Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getNodePrefixPath = getNodePrefixPath;
exports.findESLintDirectory = findESLintDirectory;
exports.getESLintFromDirectory = getESLintFromDirectory;
exports.refreshModulesPath = refreshModulesPath;
exports.getESLintInstance = getESLintInstance;
exports.getConfigPath = getConfigPath;
exports.getRelativePath = getRelativePath;
exports.getCLIEngineOptions = getCLIEngineOptions;
exports.getRules = getRules;
exports.didRulesChange = didRulesChange;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _resolveEnv = require('resolve-env');

var _resolveEnv2 = _interopRequireDefault(_resolveEnv);

var _atomLinter = require('atom-linter');

var _consistentPath = require('consistent-path');

var _consistentPath2 = _interopRequireDefault(_consistentPath);

'use babel';

var Cache = {
  ESLINT_LOCAL_PATH: _path2['default'].normalize(_path2['default'].join(__dirname, '..', 'node_modules', 'eslint')),
  NODE_PREFIX_PATH: null,
  LAST_MODULES_PATH: null
};

/**
 * Takes a path and translates `~` to the user's home directory, and replaces
 * all environment variables with their value.
 * @param  {string} path The path to remove "strangeness" from
 * @return {string}      The cleaned path
 */
var cleanPath = function cleanPath(path) {
  return path ? (0, _resolveEnv2['default'])(_fsPlus2['default'].normalize(path)) : '';
};

function getNodePrefixPath() {
  if (Cache.NODE_PREFIX_PATH === null) {
    var npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    try {
      Cache.NODE_PREFIX_PATH = _child_process2['default'].spawnSync(npmCommand, ['get', 'prefix'], {
        env: Object.assign(Object.assign({}, process.env), { PATH: (0, _consistentPath2['default'])() })
      }).output[1].toString().trim();
    } catch (e) {
      var errMsg = 'Unable to execute `npm get prefix`. Please make sure ' + 'Atom is getting $PATH correctly.';
      throw new Error(errMsg);
    }
  }
  return Cache.NODE_PREFIX_PATH;
}

function isDirectory(dirPath) {
  var isDir = undefined;
  try {
    isDir = _fsPlus2['default'].statSync(dirPath).isDirectory();
  } catch (e) {
    isDir = false;
  }
  return isDir;
}

function findESLintDirectory(modulesDir, config, projectPath) {
  var eslintDir = null;
  var locationType = null;
  if (config.global.useGlobalEslint) {
    locationType = 'global';
    var configGlobal = cleanPath(config.global.globalNodePath);
    var prefixPath = configGlobal || getNodePrefixPath();
    // NPM on Windows and Yarn on all platforms
    eslintDir = _path2['default'].join(prefixPath, 'node_modules', 'eslint');
    if (!isDirectory(eslintDir)) {
      // NPM on platforms other than Windows
      eslintDir = _path2['default'].join(prefixPath, 'lib', 'node_modules', 'eslint');
    }
  } else if (!config.advanced.localNodeModules) {
    locationType = 'local project';
    eslintDir = _path2['default'].join(modulesDir || '', 'eslint');
  } else if (_path2['default'].isAbsolute(cleanPath(config.advanced.localNodeModules))) {
    locationType = 'advanced specified';
    eslintDir = _path2['default'].join(cleanPath(config.advanced.localNodeModules), 'eslint');
  } else {
    locationType = 'advanced specified';
    eslintDir = _path2['default'].join(projectPath || '', cleanPath(config.advanced.localNodeModules), 'eslint');
  }

  if (isDirectory(eslintDir)) {
    return {
      path: eslintDir,
      type: locationType
    };
  }

  if (config.global.useGlobalEslint) {
    throw new Error('ESLint not found, please ensure the global Node path is set correctly.');
  }

  return {
    path: Cache.ESLINT_LOCAL_PATH,
    type: 'bundled fallback'
  };
}

function getESLintFromDirectory(modulesDir, config, projectPath) {
  var _findESLintDirectory = findESLintDirectory(modulesDir, config, projectPath);

  var ESLintDirectory = _findESLintDirectory.path;

  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(ESLintDirectory);
  } catch (e) {
    if (config.global.useGlobalEslint && e.code === 'MODULE_NOT_FOUND') {
      throw new Error('ESLint not found, try restarting Atom to clear caches.');
    }
    // eslint-disable-next-line import/no-dynamic-require
    return require(Cache.ESLINT_LOCAL_PATH);
  }
}

function refreshModulesPath(modulesDir) {
  if (Cache.LAST_MODULES_PATH !== modulesDir) {
    Cache.LAST_MODULES_PATH = modulesDir;
    process.env.NODE_PATH = modulesDir || '';
    // eslint-disable-next-line no-underscore-dangle
    require('module').Module._initPaths();
  }
}

function getESLintInstance(fileDir, config, projectPath) {
  var modulesDir = _path2['default'].dirname((0, _atomLinter.findCached)(fileDir, 'node_modules/eslint') || '');
  refreshModulesPath(modulesDir);
  return getESLintFromDirectory(modulesDir, config, projectPath);
}

function getConfigPath(_x) {
  var _again = true;

  _function: while (_again) {
    var fileDir = _x;
    _again = false;

    var configFile = (0, _atomLinter.findCached)(fileDir, ['.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json', '.eslintrc', 'package.json']);
    if (configFile) {
      if (_path2['default'].basename(configFile) === 'package.json') {
        // eslint-disable-next-line import/no-dynamic-require
        if (require(configFile).eslintConfig) {
          return configFile;
        }
        // If we are here, we found a package.json without an eslint config
        // in a dir without any other eslint config files
        // (because 'package.json' is last in the call to findCached)
        // So, keep looking from the parent directory
        _x = _path2['default'].resolve(_path2['default'].dirname(configFile), '..');
        _again = true;
        configFile = undefined;
        continue _function;
      }
      return configFile;
    }
    return null;
  }
}

function getRelativePath(fileDir, filePath, config, projectPath) {
  var ignoreFile = config.advanced.disableEslintIgnore ? null : (0, _atomLinter.findCached)(fileDir, '.eslintignore');

  // If we can find an .eslintignore file, we can set cwd there
  // (because they are expected to be at the project root)
  if (ignoreFile) {
    var ignoreDir = _path2['default'].dirname(ignoreFile);
    process.chdir(ignoreDir);
    return _path2['default'].relative(ignoreDir, filePath);
  }
  // Otherwise, we'll set the cwd to the atom project root as long as that exists
  if (projectPath) {
    process.chdir(projectPath);
    return _path2['default'].relative(projectPath, filePath);
  }
  // If all else fails, use the file location itself
  process.chdir(fileDir);
  return _path2['default'].basename(filePath);
}

function getCLIEngineOptions(type, config, rules, filePath, fileDir, givenConfigPath) {
  var cliEngineConfig = {
    rules: rules,
    ignore: !config.advanced.disableEslintIgnore,
    fix: type === 'fix'
  };

  var ignoreFile = config.advanced.disableEslintIgnore ? null : (0, _atomLinter.findCached)(fileDir, '.eslintignore');
  if (ignoreFile) {
    cliEngineConfig.ignorePath = ignoreFile;
  }

  cliEngineConfig.rulePaths = config.advanced.eslintRulesDirs.map(function (path) {
    var rulesDir = cleanPath(path);
    if (!_path2['default'].isAbsolute(rulesDir)) {
      return (0, _atomLinter.findCached)(fileDir, rulesDir);
    }
    return rulesDir;
  }).filter(function (path) {
    return path;
  });

  if (givenConfigPath === null && config.global.eslintrcPath) {
    // If we didn't find a configuration use the fallback from the settings
    cliEngineConfig.configFile = cleanPath(config.global.eslintrcPath);
  }

  return cliEngineConfig;
}

/**
 * Gets the list of rules used for a lint job
 * @param  {Object} cliEngine The CLIEngine instance used for the lint job
 * @return {Map}              A Map of the rules used, rule names as keys, rule
 *                            properties as the contents.
 */

function getRules(cliEngine) {
  // Pull the list of rules used directly from the CLIEngine
  // Added in https://github.com/eslint/eslint/pull/9782
  if (Object.prototype.hasOwnProperty.call(cliEngine, 'getRules')) {
    return cliEngine.getRules();
  }

  // Attempt to use the internal (undocumented) `linter` instance attached to
  // the CLIEngine to get the loaded rules (including plugin rules).
  // Added in ESLint v4
  if (Object.prototype.hasOwnProperty.call(cliEngine, 'linter')) {
    return cliEngine.linter.getRules();
  }

  // Older versions of ESLint don't (easily) support getting a list of rules
  return new Map();
}

/**
 * Given an exiting rule list and a new rule list, determines whether there
 * have been changes.
 * NOTE: This only accounts for presence of the rules, changes to their metadata
 * are not taken into account.
 * @param  {Map} newRules     A Map of the new rules
 * @param  {Map} currentRules A Map of the current rules
 * @return {boolean}             Whether or not there were changes
 */

function didRulesChange(currentRules, newRules) {
  return !(currentRules.size === newRules.size && Array.from(currentRules.keys()).every(function (ruleId) {
    return newRules.has(ruleId);
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL3dvcmtlci1oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7c0JBQ1IsU0FBUzs7Ozs2QkFDQyxlQUFlOzs7OzBCQUNqQixhQUFhOzs7OzBCQUNULGFBQWE7OzhCQUNwQixpQkFBaUI7Ozs7QUFQckMsV0FBVyxDQUFBOztBQVNYLElBQU0sS0FBSyxHQUFHO0FBQ1osbUJBQWlCLEVBQUUsa0JBQUssU0FBUyxDQUFDLGtCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN2RixrQkFBZ0IsRUFBRSxJQUFJO0FBQ3RCLG1CQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQTs7Ozs7Ozs7QUFRRCxJQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBRyxJQUFJO1NBQUssSUFBSSxHQUFHLDZCQUFXLG9CQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7Q0FBQyxDQUFBOztBQUUvRCxTQUFTLGlCQUFpQixHQUFHO0FBQ2xDLE1BQUksS0FBSyxDQUFDLGdCQUFnQixLQUFLLElBQUksRUFBRTtBQUNuQyxRQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFBO0FBQ25FLFFBQUk7QUFDRixXQUFLLENBQUMsZ0JBQWdCLEdBQUcsMkJBQWEsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRTtBQUM3RSxXQUFHLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0NBQVMsRUFBRSxDQUFDO09BQ3hFLENBQUMsQ0FBQyxNQUFNLENB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LENBQUMsUUFBUSxFQUFFLENBQUE7R0FDNUI7Ozs7O0FBS0QsTUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFFO0FBQzdELFdBQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtHQUNuQzs7O0FBR0QsU0FBTyxJQUFJLEdBQUcsRUFBRSxDQUFBO0NBQ2pCOzs7Ozs7Ozs7Ozs7QUFXTSxTQUFTLGNBQWMsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFO0FBQ3JELFNBQU8sRUFBRSxZQUFZLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxJQUFJLElBQ3ZDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsTUFBTTtXQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0dBQUEsQ0FBQyxDQUFBLEFBQUMsQ0FBQTtDQUM1RSIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy93b3JrZXItaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBQYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBDaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCByZXNvbHZlRW52IGZyb20gJ3Jlc29sdmUtZW52J1xuaW1wb3J0IHsgZmluZENhY2hlZCB9IGZyb20gJ2F0b20tbGludGVyJ1xuaW1wb3J0IGdldFBhdGggZnJvbSAnY29uc2lzdGVudC1wYXRoJ1xuXG5jb25zdCBDYWNoZSA9IHtcbiAgRVNMSU5UX0xPQ0FMX1BBVEg6IFBhdGgubm9ybWFsaXplKFBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdub2RlX21vZHVsZXMnLCAnZXNsaW50JykpLFxuICBOT0RFX1BSRUZJWF9QQVRIOiBudWxsLFxuICBMQVNUX01PRFVMRVNfUEFUSDogbnVsbFxufVxuXG4vKipcbiAqIFRha2VzIGEgcGF0aCBhbmQgdHJhbnNsYXRlcyBgfmAgdG8gdGhlIHVzZXIncyBob21lIGRpcmVjdG9yeSwgYW5kIHJlcGxhY2VzXG4gKiBhbGwgZW52aXJvbm1lbnQgdmFyaWFibGVzIHdpdGggdGhlaXIgdmFsdWUuXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gcmVtb3ZlIFwic3RyYW5nZW5lc3NcIiBmcm9tXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgVGhlIGNsZWFuZWQgcGF0aFxuICovXG5jb25zdCBjbGVhblBhdGggPSBwYXRoID0+IChwYXRoID8gcmVzb2x2ZUVudihmcy5ub3JtYWxpemUocGF0aCkpIDogJycpXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlUHJlZml4UGF0aCgpIHtcbiAgaWYgKENhY2hlLk5PREVfUFJFRklYX1BBVEggPT09IG51bGwpIHtcbiAgICBjb25zdCBucG1Db21tYW5kID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICducG0uY21kJyA6ICducG0nXG4gICAgdHJ5IHtcbiAgICAgIENhY2hlLk5PREVfUFJFRklYX1BBVEggPSBDaGlsZFByb2Nlc3Muc3Bhd25TeW5jKG5wbUNvbW1hbmQsIFsnZ2V0JywgJ3ByZWZpeCddLCB7XG4gICAgICAgIGVudjogT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwcm9jZXNzLmVudiksIHsgUEFUSDogZ2V0UGF0aCgpIH0pXG4gICAgICB9KS5vdXRwdXRbMV0udG9TdHJpbmcoKS50cmltKClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCBlcnJNc2cgPSAnVW5hYmxlIHRvIGV4ZWN1dGUgYG5wbSBnZXQgcHJlZml4YC4gUGxlYXNlIG1ha2Ugc3VyZSAnXG4gICAgICAgICsgJ0F0b20gaXMgZ2V0dGluZyAkUEFUSCBjb3JyZWN0bHkuJ1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIENhY2hlLk5PREVfUFJFRklYX1BBVEhcbn1cblxuZnVuY3Rpb24gaXNEaXJlY3RvcnkoZGlyUGF0aCkge1xuICBsZXQgaXNEaXJcbiAgdHJ5IHtcbiAgICBpc0RpciA9IGZzLnN0YXRTeW5jKGRpclBhdGgpLmlzRGlyZWN0b3J5KClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlzRGlyID0gZmFsc2VcbiAgfVxuICByZXR1cm4gaXNEaXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aCkge1xuICBsZXQgZXNsaW50RGlyID0gbnVsbFxuICBsZXQgbG9jYXRpb25UeXBlID0gbnVsbFxuICBpZiAoY29uZmlnLmdsb2JhbC51c2VHbG9iYWxFc2xpbnQpIHtcbiAgICBsb2NhdGlvblR5cGUgPSAnZ2xvYmFsJ1xuICAgIGNvbnN0IGNvbmZpZ0dsb2JhbCA9IGNsZWFuUGF0aChjb25maWcuZ2xvYmFsLmdsb2JhbE5vZGVQYXRoKVxuICAgIGNvbnN0IHByZWZpeFBhdGggPSBjb25maWdHbG9iYWwgfHwgZ2V0Tm9kZVByZWZpeFBhdGgoKVxuICAgIC8vIE5QTSBvbiBXaW5kb3dzIGFuZCBZYXJuIG9uIGFsbCBwbGF0Zm9ybXNcbiAgICBlc2xpbnREaXIgPSBQYXRoLmpvaW4ocHJlZml4UGF0aCwgJ25vZGVfbW9kdWxlcycsICdlc2xpbnQnKVxuICAgIGlmICghaXNEaXJlY3RvcnkoZXNsaW50RGlyKSkge1xuICAgICAgLy8gTlBNIG9uIHBsYXRmb3JtcyBvdGhlciB0aGFuIFdpbmRvd3NcbiAgICAgIGVzbGludERpciA9IFBhdGguam9pbihwcmVmaXhQYXRoLCAnbGliJywgJ25vZGVfbW9kdWxlcycsICdlc2xpbnQnKVxuICAgIH1cbiAgfSBlbHNlIGlmICghY29uZmlnLmFkdmFuY2VkLmxvY2FsTm9kZU1vZHVsZXMpIHtcbiAgICBsb2NhdGlvblR5cGUgPSAnbG9jYWwgcHJvamVjdCdcbiAgICBlc2xpbnREaXIgPSBQYXRoLmpvaW4obW9kdWxlc0RpciB8fCAnJywgJ2VzbGludCcpXG4gIH0gZWxzZSBpZiAoUGF0aC5pc0Fic29sdXRlKGNsZWFuUGF0aChjb25maWcuYWR2YW5jZWQubG9jYWxOb2RlTW9kdWxlcykpKSB7XG4gICAgbG9jYXRpb25UeXBlID0gJ2FkdmFuY2VkIHNwZWNpZmllZCdcbiAgICBlc2xpbnREaXIgPSBQYXRoLmpvaW4oY2xlYW5QYXRoKGNvbmZpZy5hZHZhbmNlZC5sb2NhbE5vZGVNb2R1bGVzKSwgJ2VzbGludCcpXG4gIH0gZWxzZSB7XG4gICAgbG9jYXRpb25UeXBlID0gJ2FkdmFuY2VkIHNwZWNpZmllZCdcbiAgICBlc2xpbnREaXIgPSBQYXRoLmpvaW4ocHJvamVjdFBhdGggfHwgJycsIGNsZWFuUGF0aChjb25maWcuYWR2YW5jZWQubG9jYWxOb2RlTW9kdWxlcyksICdlc2xpbnQnKVxuICB9XG5cbiAgaWYgKGlzRGlyZWN0b3J5KGVzbGludERpcikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcGF0aDogZXNsaW50RGlyLFxuICAgICAgdHlwZTogbG9jYXRpb25UeXBlLFxuICAgIH1cbiAgfVxuXG4gIGlmIChjb25maWcuZ2xvYmFsLnVzZUdsb2JhbEVzbGludCkge1xuICAgIHRocm93IG5ldyBFcnJvcignRVNMaW50IG5vdCBmb3VuZCwgcGxlYXNlIGVuc3VyZSB0aGUgZ2xvYmFsIE5vZGUgcGF0aCBpcyBzZXQgY29ycmVjdGx5LicpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhdGg6IENhY2hlLkVTTElOVF9MT0NBTF9QQVRILFxuICAgIHR5cGU6ICdidW5kbGVkIGZhbGxiYWNrJyxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RVNMaW50RnJvbURpcmVjdG9yeShtb2R1bGVzRGlyLCBjb25maWcsIHByb2plY3RQYXRoKSB7XG4gIGNvbnN0IHsgcGF0aDogRVNMaW50RGlyZWN0b3J5IH0gPSBmaW5kRVNMaW50RGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNvbmZpZywgcHJvamVjdFBhdGgpXG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1keW5hbWljLXJlcXVpcmVcbiAgICByZXR1cm4gcmVxdWlyZShFU0xpbnREaXJlY3RvcnkpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoY29uZmlnLmdsb2JhbC51c2VHbG9iYWxFc2xpbnQgJiYgZS5jb2RlID09PSAnTU9EVUxFX05PVF9GT1VORCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRVNMaW50IG5vdCBmb3VuZCwgdHJ5IHJlc3RhcnRpbmcgQXRvbSB0byBjbGVhciBjYWNoZXMuJylcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1keW5hbWljLXJlcXVpcmVcbiAgICByZXR1cm4gcmVxdWlyZShDYWNoZS5FU0xJTlRfTE9DQUxfUEFUSClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVmcmVzaE1vZHVsZXNQYXRoKG1vZHVsZXNEaXIpIHtcbiAgaWYgKENhY2hlLkxBU1RfTU9EVUxFU19QQVRIICE9PSBtb2R1bGVzRGlyKSB7XG4gICAgQ2FjaGUuTEFTVF9NT0RVTEVTX1BBVEggPSBtb2R1bGVzRGlyXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9QQVRIID0gbW9kdWxlc0RpciB8fCAnJ1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlcnNjb3JlLWRhbmdsZVxuICAgIHJlcXVpcmUoJ21vZHVsZScpLk1vZHVsZS5faW5pdFBhdGhzKClcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RVNMaW50SW5zdGFuY2UoZmlsZURpciwgY29uZmlnLCBwcm9qZWN0UGF0aCkge1xuICBjb25zdCBtb2R1bGVzRGlyID0gUGF0aC5kaXJuYW1lKGZpbmRDYWNoZWQoZmlsZURpciwgJ25vZGVfbW9kdWxlcy9lc2xpbnQnKSB8fCAnJylcbiAgcmVmcmVzaE1vZHVsZXNQYXRoKG1vZHVsZXNEaXIpXG4gIHJldHVybiBnZXRFU0xpbnRGcm9tRGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNvbmZpZywgcHJvamVjdFBhdGgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25maWdQYXRoKGZpbGVEaXIpIHtcbiAgY29uc3QgY29uZmlnRmlsZSA9IGZpbmRDYWNoZWQoZmlsZURpciwgW1xuICAgICcuZXNsaW50cmMuanMnLCAnLmVzbGludHJjLnlhbWwnLCAnLmVzbGludHJjLnltbCcsICcuZXNsaW50cmMuanNvbicsICcuZXNsaW50cmMnLCAncGFja2FnZS5qc29uJ1xuICBdKVxuICBpZiAoY29uZmlnRmlsZSkge1xuICAgIGlmIChQYXRoLmJhc2VuYW1lKGNvbmZpZ0ZpbGUpID09PSAncGFja2FnZS5qc29uJykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1keW5hbWljLXJlcXVpcmVcbiAgICAgIGlmIChyZXF1aXJlKGNvbmZpZ0ZpbGUpLmVzbGludENvbmZpZykge1xuICAgICAgICByZXR1cm4gY29uZmlnRmlsZVxuICAgICAgfVxuICAgICAgLy8gSWYgd2UgYXJlIGhlcmUsIHdlIGZvdW5kIGEgcGFja2FnZS5qc29uIHdpdGhvdXQgYW4gZXNsaW50IGNvbmZpZ1xuICAgICAgLy8gaW4gYSBkaXIgd2l0aG91dCBhbnkgb3RoZXIgZXNsaW50IGNvbmZpZyBmaWxlc1xuICAgICAgLy8gKGJlY2F1c2UgJ3BhY2thZ2UuanNvbicgaXMgbGFzdCBpbiB0aGUgY2FsbCB0byBmaW5kQ2FjaGVkKVxuICAgICAgLy8gU28sIGtlZXAgbG9va2luZyBmcm9tIHRoZSBwYXJlbnQgZGlyZWN0b3J5XG4gICAgICByZXR1cm4gZ2V0Q29uZmlnUGF0aChQYXRoLnJlc29sdmUoUGF0aC5kaXJuYW1lKGNvbmZpZ0ZpbGUpLCAnLi4nKSlcbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZ0ZpbGVcbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQYXRoKGZpbGVEaXIsIGZpbGVQYXRoLCBjb25maWcsIHByb2plY3RQYXRoKSB7XG4gIGNvbnN0IGlnbm9yZUZpbGUgPSBjb25maWcuYWR2YW5jZWQuZGlzYWJsZUVzbGludElnbm9yZSA/IG51bGwgOiBmaW5kQ2FjaGVkKGZpbGVEaXIsICcuZXNsaW50aWdub3JlJylcblxuICAvLyBJZiB3ZSBjYW4gZmluZCBhbiAuZXNsaW50aWdub3JlIGZpbGUsIHdlIGNhbiBzZXQgY3dkIHRoZXJlXG4gIC8vIChiZWNhdXNlIHRoZXkgYXJlIGV4cGVjdGVkIHRvIGJlIGF0IHRoZSBwcm9qZWN0IHJvb3QpXG4gIGlmIChpZ25vcmVGaWxlKSB7XG4gICAgY29uc3QgaWdub3JlRGlyID0gUGF0aC5kaXJuYW1lKGlnbm9yZUZpbGUpXG4gICAgcHJvY2Vzcy5jaGRpcihpZ25vcmVEaXIpXG4gICAgcmV0dXJuIFBhdGgucmVsYXRpdmUoaWdub3JlRGlyLCBmaWxlUGF0aClcbiAgfVxuICAvLyBPdGhlcndpc2UsIHdlJ2xsIHNldCB0aGUgY3dkIHRvIHRoZSBhdG9tIHByb2plY3Qgcm9vdCBhcyBsb25nIGFzIHRoYXQgZXhpc3RzXG4gIGlmIChwcm9qZWN0UGF0aCkge1xuICAgIHByb2Nlc3MuY2hkaXIocHJvamVjdFBhdGgpXG4gICAgcmV0dXJuIFBhdGgucmVsYXRpdmUocHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuICB9XG4gIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgdGhlIGZpbGUgbG9jYXRpb24gaXRzZWxmXG4gIHByb2Nlc3MuY2hkaXIoZmlsZURpcilcbiAgcmV0dXJuIFBhdGguYmFzZW5hbWUoZmlsZVBhdGgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDTElFbmdpbmVPcHRpb25zKHR5cGUsIGNvbmZpZywgcnVsZXMsIGZpbGVQYXRoLCBmaWxlRGlyLCBnaXZlbkNvbmZpZ1BhdGgpIHtcbiAgY29uc3QgY2xpRW5naW5lQ29uZmlnID0ge1xuICAgIHJ1bGVzLFxuICAgIGlnbm9yZTogIWNvbmZpZy5hZHZhbmNlZC5kaXNhYmxlRXNsaW50SWdub3JlLFxuICAgIGZpeDogdHlwZSA9PT0gJ2ZpeCdcbiAgfVxuXG4gIGNvbnN0IGlnbm9yZUZpbGUgPSBjb25maWcuYWR2YW5jZWQuZGlzYWJsZUVzbGludElnbm9yZSA/IG51bGwgOiBmaW5kQ2FjaGVkKGZpbGVEaXIsICcuZXNsaW50aWdub3JlJylcbiAgaWYgKGlnbm9yZUZpbGUpIHtcbiAgICBjbGlFbmdpbmVDb25maWcuaWdub3JlUGF0aCA9IGlnbm9yZUZpbGVcbiAgfVxuXG4gIGNsaUVuZ2luZUNvbmZpZy5ydWxlUGF0aHMgPSBjb25maWcuYWR2YW5jZWQuZXNsaW50UnVsZXNEaXJzLm1hcCgocGF0aCkgPT4ge1xuICAgIGNvbnN0IHJ1bGVzRGlyID0gY2xlYW5QYXRoKHBhdGgpXG4gICAgaWYgKCFQYXRoLmlzQWJzb2x1dGUocnVsZXNEaXIpKSB7XG4gICAgICByZXR1cm4gZmluZENhY2hlZChmaWxlRGlyLCBydWxlc0RpcilcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVzRGlyXG4gIH0pLmZpbHRlcihwYXRoID0+IHBhdGgpXG5cbiAgaWYgKGdpdmVuQ29uZmlnUGF0aCA9PT0gbnVsbCAmJiBjb25maWcuZ2xvYmFsLmVzbGludHJjUGF0aCkge1xuICAgIC8vIElmIHdlIGRpZG4ndCBmaW5kIGEgY29uZmlndXJhdGlvbiB1c2UgdGhlIGZhbGxiYWNrIGZyb20gdGhlIHNldHRpbmdzXG4gICAgY2xpRW5naW5lQ29uZmlnLmNvbmZpZ0ZpbGUgPSBjbGVhblBhdGgoY29uZmlnLmdsb2JhbC5lc2xpbnRyY1BhdGgpXG4gIH1cblxuICByZXR1cm4gY2xpRW5naW5lQ29uZmlnXG59XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBvZiBydWxlcyB1c2VkIGZvciBhIGxpbnQgam9iXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNsaUVuZ2luZSBUaGUgQ0xJRW5naW5lIGluc3RhbmNlIHVzZWQgZm9yIHRoZSBsaW50IGpvYlxuICogQHJldHVybiB7TWFwfSAgICAgICAgICAgICAgQSBNYXAgb2YgdGhlIHJ1bGVzIHVzZWQsIHJ1bGUgbmFtZXMgYXMga2V5cywgcnVsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyBhcyB0aGUgY29udGVudHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSdWxlcyhjbGlFbmdpbmUpIHtcbiAgLy8gUHVsbCB0aGUgbGlzdCBvZiBydWxlcyB1c2VkIGRpcmVjdGx5IGZyb20gdGhlIENMSUVuZ2luZVxuICAvLyBBZGRlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9wdWxsLzk3ODJcbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjbGlFbmdpbmUsICdnZXRSdWxlcycpKSB7XG4gICAgcmV0dXJuIGNsaUVuZ2luZS5nZXRSdWxlcygpXG4gIH1cblxuICAvLyBBdHRlbXB0IHRvIHVzZSB0aGUgaW50ZXJuYWwgKHVuZG9jdW1lbnRlZCkgYGxpbnRlcmAgaW5zdGFuY2UgYXR0YWNoZWQgdG9cbiAgLy8gdGhlIENMSUVuZ2luZSB0byBnZXQgdGhlIGxvYWRlZCBydWxlcyAoaW5jbHVkaW5nIHBsdWdpbiBydWxlcykuXG4gIC8vIEFkZGVkIGluIEVTTGludCB2NFxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNsaUVuZ2luZSwgJ2xpbnRlcicpKSB7XG4gICAgcmV0dXJuIGNsaUVuZ2luZS5saW50ZXIuZ2V0UnVsZXMoKVxuICB9XG5cbiAgLy8gT2xkZXIgdmVyc2lvbnMgb2YgRVNMaW50IGRvbid0IChlYXNpbHkpIHN1cHBvcnQgZ2V0dGluZyBhIGxpc3Qgb2YgcnVsZXNcbiAgcmV0dXJuIG5ldyBNYXAoKVxufVxuXG4vKipcbiAqIEdpdmVuIGFuIGV4aXRpbmcgcnVsZSBsaXN0IGFuZCBhIG5ldyBydWxlIGxpc3QsIGRldGVybWluZXMgd2hldGhlciB0aGVyZVxuICogaGF2ZSBiZWVuIGNoYW5nZXMuXG4gKiBOT1RFOiBUaGlzIG9ubHkgYWNjb3VudHMgZm9yIHByZXNlbmNlIG9mIHRoZSBydWxlcywgY2hhbmdlcyB0byB0aGVpciBtZXRhZGF0YVxuICogYXJlIG5vdCB0YWtlbiBpbnRvIGFjY291bnQuXG4gKiBAcGFyYW0gIHtNYXB9IG5ld1J1bGVzICAgICBBIE1hcCBvZiB0aGUgbmV3IHJ1bGVzXG4gKiBAcGFyYW0gIHtNYXB9IGN1cnJlbnRSdWxlcyBBIE1hcCBvZiB0aGUgY3VycmVudCBydWxlc1xuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgV2hldGhlciBvciBub3QgdGhlcmUgd2VyZSBjaGFuZ2VzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaWRSdWxlc0NoYW5nZShjdXJyZW50UnVsZXMsIG5ld1J1bGVzKSB7XG4gIHJldHVybiAhKGN1cnJlbnRSdWxlcy5zaXplID09PSBuZXdSdWxlcy5zaXplXG4gICAgJiYgQXJyYXkuZnJvbShjdXJyZW50UnVsZXMua2V5cygpKS5ldmVyeShydWxlSWQgPT4gbmV3UnVsZXMuaGFzKHJ1bGVJZCkpKVxufVxuIl19