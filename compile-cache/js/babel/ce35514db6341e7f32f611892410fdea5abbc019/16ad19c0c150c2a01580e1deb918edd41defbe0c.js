Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global atom */

var _events = require('events');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gitIgnoreParser = require('git-ignore-parser');

var _gitIgnoreParser2 = _interopRequireDefault(_gitIgnoreParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _atom = require('atom');

var _utils = require('./utils');

'use babel';
var PathsCache = (function (_EventEmitter) {
  _inherits(PathsCache, _EventEmitter);

  function PathsCache() {
    var _this = this;

    _classCallCheck(this, PathsCache);

    _get(Object.getPrototypeOf(PathsCache.prototype), 'constructor', this).call(this);

    this._projectChangeWatcher = atom.project.onDidChangePaths(function () {
      return _this.rebuildCache();
    });

    this._repositories = [];
    this._filePathsByProjectDirectory = new Map();
    this._filePathsByDirectory = new Map();
    this._fileWatchersByDirectory = new Map();
  }

  /**
   * Checks if the given path is ignored
   * @param  {String}  path
   * @return {Boolean}
   * @private
   */

  _createClass(PathsCache, [{
    key: '_isPathIgnored',
    value: function _isPathIgnored(path) {
      var ignored = false;
      if (atom.config.get('core.excludeVcsIgnoredPaths')) {
        this._repositories.forEach(function (repository) {
          if (ignored) return;
          var ignoreSubmodules = atom.config.get('autocomplete-paths.ignoreSubmodules');
          var isIgnoredSubmodule = ignoreSubmodules && repository.isSubmodule(path);
          if (repository.isPathIgnored(path) || isIgnoredSubmodule) {
            ignored = true;
          }
        });
      }

      if (atom.config.get('autocomplete-paths.ignoredNames')) {
        var ignoredNames = atom.config.get('core.ignoredNames');
        ignoredNames.forEach(function (ignoredName) {
          if (ignored) return;
          ignored = ignored || (0, _minimatch2['default'])(path, ignoredName, { matchBase: true, dot: true });
        });
      }

      var ignoredPatterns = atom.config.get('autocomplete-paths.ignoredPatterns');
      if (ignoredPatterns) {
        ignoredPatterns.forEach(function (ignoredPattern) {
          if (ignored) return;
          ignored = ignored || (0, _minimatch2['default'])(path, ignoredPattern, { dot: true });
        });
      }

      return ignored;
    }

    /**
     * Caches the project paths and repositories
     * @return {Promise}
     * @private
     */
  }, {
    key: '_cacheProjectPathsAndRepositories',
    value: function _cacheProjectPathsAndRepositories() {
      var _this2 = this;

      this._projectDirectories = atom.project.getDirectories();

      return Promise.all(this._projectDirectories.map(atom.project.repositoryForDirectory.bind(atom.project))).then(function (repositories) {
        _this2._repositories = repositories.filter(function (r) {
          return r;
        });
      });
    }

    /**
     * Invoked when the content of the given `directory` has changed
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_onDirectoryChanged',
    value: function _onDirectoryChanged(projectDirectory, directory) {
      this._removeFilePathsForDirectory(projectDirectory, directory);
      this._cleanWatchersForDirectory(directory);
      this._cacheDirectoryFilePaths(projectDirectory, directory);
    }

    /**
     * Removes all watchers inside the given directory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_cleanWatchersForDirectory',
    value: function _cleanWatchersForDirectory(directory) {
      var _this3 = this;

      this._fileWatchersByDirectory.forEach(function (watcher, otherDirectory) {
        if (directory.contains(otherDirectory.path)) {
          watcher.dispose();
          _this3._fileWatchersByDirectory['delete'](otherDirectory);
        }
      });
    }

    /**
     * Removes all cached file paths in the given directory
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @private
     */
  }, {
    key: '_removeFilePathsForDirectory',
    value: function _removeFilePathsForDirectory(projectDirectory, directory) {
      var filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path);
      if (!filePaths) return;

      filePaths = filePaths.filter(function (path) {
        return !directory.contains(path);
      });
      this._filePathsByProjectDirectory.set(projectDirectory.path, filePaths);

      this._filePathsByDirectory['delete'](directory.path);
    }

    /**
     * Caches file paths for the given directory
     * @param  {Directory} projectDirectory
     * @param  {Directory} directory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_cacheDirectoryFilePaths',
    value: function _cacheDirectoryFilePaths(projectDirectory, directory) {
      var _this4 = this;

      if (this._cancelled) return Promise.resolve([]);

      if (process.platform !== 'win32') {
        var watcher = this._fileWatchersByDirectory.get(directory);
        if (!watcher) {
          watcher = directory.onDidChange(function () {
            return _this4._onDirectoryChanged(projectDirectory, directory);
          });
          this._fileWatchersByDirectory.set(directory, watcher);
        }
      }

      return this._getDirectoryEntries(directory).then(function (entries) {
        if (_this4._cancelled) return Promise.resolve([]);

        // Filter: Files that are not ignored
        var filePaths = entries.filter(function (entry) {
          return entry instanceof _atom.File;
        }).map(function (entry) {
          return entry.path;
        }).filter(function (path) {
          return !_this4._isPathIgnored(path);
        });

        // Merge file paths into existing array (which contains *all* file paths)
        var filePathsArray = _this4._filePathsByProjectDirectory.get(projectDirectory.path) || [];
        var newPathsCount = filePathsArray.length + filePaths.length;

        var maxFileCount = atom.config.get('autocomplete-paths.maxFileCount');
        if (newPathsCount > maxFileCount && !_this4._cancelled) {
          atom.notifications.addError('autocomplete-paths', {
            description: 'Maximum file count of ' + maxFileCount + ' has been exceeded. Path autocompletion will not work in this project.<br /><br /><a href="https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded">Click here to learn more.</a>',
            dismissable: true
          });

          _this4._filePathsByProjectDirectory.clear();
          _this4._filePathsByDirectory.clear();
          _this4._cancelled = true;
          _this4.emit('rebuild-cache-done');
          return;
        }

        _this4._filePathsByProjectDirectory.set(projectDirectory.path, _underscorePlus2['default'].union(filePathsArray, filePaths));

        // Merge file paths into existing array (which contains file paths for a specific directory)
        filePathsArray = _this4._filePathsByDirectory.get(directory.path) || [];
        _this4._filePathsByDirectory.set(directory.path, _underscorePlus2['default'].union(filePathsArray, filePaths));

        var directories = entries.filter(function (entry) {
          return entry instanceof _atom.Directory;
        }).filter(function (entry) {
          return !_this4._isPathIgnored(entry.path);
        });

        return Promise.all(directories.map(function (directory) {
          return _this4._cacheDirectoryFilePaths(projectDirectory, directory);
        }));
      });
    }

    /**
     * Promisified version of Directory#getEntries
     * @param  {Directory} directory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_getDirectoryEntries',
    value: function _getDirectoryEntries(directory) {
      return new Promise(function (resolve, reject) {
        directory.getEntries(function (err, entries) {
          if (err) return reject(err);
          resolve(entries);
        });
      });
    }

    /**
     * Rebuilds the paths cache
     */
  }, {
    key: 'rebuildCache',
    value: function rebuildCache() {
      var _this5 = this;

      var path = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      this.dispose();

      this._cancelled = false;
      this.emit('rebuild-cache');

      return (0, _utils.execPromise)('find --version').then(
      // `find` is available
      function () {
        return _this5._buildInitialCacheWithFind();
      },
      // `find` is not available
      function () {
        return _this5._buildInitialCache();
      });
    }

    /**
     * Builds the initial file cache
     * @return {Promise}
     * @private
     */
  }, {
    key: '_buildInitialCache',
    value: function _buildInitialCache() {
      var _this6 = this;

      return this._cacheProjectPathsAndRepositories().then(function () {
        return Promise.all(_this6._projectDirectories.map(function (projectDirectory) {
          return _this6._cacheDirectoryFilePaths(projectDirectory, projectDirectory);
        }));
      }).then(function (result) {
        _this6.emit('rebuild-cache-done');
        return result;
      });
    }

    /**
     * Returns the project path for the given file / directory pathName
     * @param  {String} pathName
     * @return {String}
     * @private
     */
  }, {
    key: '_getProjectPathForPath',
    value: function _getProjectPathForPath(pathName) {
      var projects = this._projectPaths;
      for (var i = 0; i < projects.length; i++) {
        var projectPath = projects[i];
        if (pathName.indexOf(projectPath) === 0) {
          return projectPath;
        }
      }
      return false;
    }

    /**
     * Returns the file paths for the given project directory with the given (optional) relative path
     * @param  {Directory} projectDirectory
     * @param  {String} [relativeToPath=null]
     * @return {String[]}
     */
  }, {
    key: 'getFilePathsForProjectDirectory',
    value: function getFilePathsForProjectDirectory(projectDirectory) {
      var relativeToPath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var filePaths = this._filePathsByProjectDirectory.get(projectDirectory.path) || [];
      if (relativeToPath) {
        return filePaths.filter(function (filePath) {
          return filePath.indexOf(relativeToPath) === 0;
        });
      }
      return filePaths;
    }

    /**
     * Disposes this PathsCache
     */
  }, {
    key: 'dispose',
    value: function dispose(isPackageDispose) {
      this._fileWatchersByDirectory.forEach(function (watcher, directory) {
        watcher.dispose();
      });
      this._fileWatchersByDirectory = new Map();
      this._filePathsByProjectDirectory = new Map();
      this._filePathsByDirectory = new Map();
      this._repositories = [];
      if (this._projectWatcher) {
        this._projectWatcher.dispose();
        this._projectWatcher = null;
      }
      if (isPackageDispose && this._projectChangeWatcher) {
        this._projectChangeWatcher.dispose();
        this._projectChangeWatcher = null;
      }
    }

    //
    // Cache with `find`
    //

    /**
     * Builds the initial file cache with `find`
     * @return {Promise}
     * @private
     */
  }, {
    key: '_buildInitialCacheWithFind',
    value: function _buildInitialCacheWithFind() {
      var _this7 = this;

      return this._cacheProjectPathsAndRepositories().then(function () {
        _this7._projectWatcher = atom.project.onDidChangeFiles(_this7._onDidChangeFiles.bind(_this7));

        return Promise.all(_this7._projectDirectories.map(_this7._populateCacheFor.bind(_this7)));
      }).then(function (result) {
        _this7.emit('rebuild-cache-done');
        return result;
      });
    }
  }, {
    key: '_onDidChangeFiles',
    value: function _onDidChangeFiles(events) {
      var _this8 = this;

      events.filter(function (event) {
        return event.action !== 'modified';
      }).forEach(function (event) {
        if (!_this8._projectDirectories) {
          return;
        }

        var action = event.action;
        var path = event.path;
        var oldPath = event.oldPath;

        var projectDirectory = _this8._projectDirectories.find(function (projectDirectory) {
          return path.indexOf(projectDirectory.path) === 0;
        });

        if (!projectDirectory) {
          return;
        }
        var directoryPath = projectDirectory.path;
        var ignored = _this8._isPathIgnored(path);

        if (ignored) {
          return;
        }

        var files = _this8._filePathsByProjectDirectory.get(directoryPath) || [];

        switch (action) {
          case 'created':
            files.push(path);
            break;

          case 'deleted':
            var i = files.indexOf(path);
            if (i > -1) {
              files.splice(i, 1);
            }
            break;

          case 'renamed':
            var j = files.indexOf(oldPath);
            if (j > -1) {
              files[j] = path;
            }
            break;
        }

        if (!_this8._filePathsByProjectDirectory.has(directoryPath)) {
          _this8._filePathsByProjectDirectory.set(directoryPath, files);
        }
      });
    }

    /**
     * Returns a list of ignore patterns for a directory
     * @param  {String} directoryPath
     * @return {String[]}
     * @private
     */
  }, {
    key: '_getIgnorePatterns',
    value: function _getIgnorePatterns(directoryPath) {
      var patterns = [];

      if (atom.config.get('autocomplete-paths.ignoredNames')) {
        atom.config.get('core.ignoredNames').forEach(function (pattern) {
          return patterns.push(pattern);
        });
      }

      if (atom.config.get('core.excludeVcsIgnoredPaths')) {
        try {
          var gitIgnore = _fs2['default'].readFileSync(directoryPath + '/.gitignore', 'utf-8');
          (0, _gitIgnoreParser2['default'])(gitIgnore).forEach(function (pattern) {
            return patterns.push(pattern);
          });
        } catch (err) {
          // .gitignore does not exist for this directory, ignoring
        }
      }

      var ignoredPatterns = atom.config.get('autocomplete-paths.ignoredPatterns');
      if (ignoredPatterns) {
        ignoredPatterns.forEach(function (pattern) {
          return patterns.push(pattern);
        });
      }

      return patterns;
    }

    /**
     * Populates cache for a project directory
     * @param  {Directory} projectDirectory
     * @return {Promise}
     * @private
     */
  }, {
    key: '_populateCacheFor',
    value: function _populateCacheFor(projectDirectory) {
      var _this9 = this;

      var directoryPath = projectDirectory.path;

      var ignorePatterns = this._getIgnorePatterns(directoryPath);
      var ignorePatternsForFind = ignorePatterns.map(function (pattern) {
        return pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
      });
      var ignorePattern = '\'.*\\(' + ignorePatternsForFind.join('\\|') + '\\).*\'';

      var cmd = ['find', '-L', directoryPath + '/', '-type', 'f', '-not', '-regex', ignorePattern].join(' ');

      return (0, _utils.execPromise)(cmd, {
        maxBuffer: 1024 * 1024
      }).then(function (stdout) {
        var files = _underscorePlus2['default'].compact(stdout.split('\n'));

        _this9._filePathsByProjectDirectory.set(directoryPath, files);

        return files;
      });
    }
  }]);

  return PathsCache;
})(_events.EventEmitter);

exports['default'] = PathsCache;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvcGF0aHMtY2FjaGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFHNkIsUUFBUTs7a0JBQ3RCLElBQUk7Ozs7K0JBQ1MsbUJBQW1COzs7O29CQUM5QixNQUFNOzs7OzhCQUNULGlCQUFpQjs7Ozt5QkFDVCxXQUFXOzs7O29CQUNELE1BQU07O3FCQUNWLFNBQVM7O0FBVnJDLFdBQVcsQ0FBQTtJQVlVLFVBQVU7WUFBVixVQUFVOztBQUNqQixXQURPLFVBQVUsR0FDZDs7OzBCQURJLFVBQVU7O0FBRTNCLCtCQUZpQixVQUFVLDZDQUVwQjs7QUFFUCxRQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzthQUFNLE1BQUssWUFBWSxFQUFFO0tBQUEsQ0FBQyxDQUFBOztBQUVyRixRQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQTtBQUN2QixRQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM3QyxRQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN0QyxRQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtHQUMxQzs7Ozs7Ozs7O2VBVmtCLFVBQVU7O1dBa0JkLHdCQUFDLElBQUksRUFBRTtBQUNwQixVQUFJLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDbkIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFO0FBQ2xELFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVSxFQUFJO0FBQ3ZDLGNBQUksT0FBTyxFQUFFLE9BQU07QUFDbkIsY0FBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFB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R0FBRyw0QkFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUU1QyxlQUFLLDRCQUE0QixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTVELGVBQU8sS0FBSyxDQUFDO09BQ2QsQ0FBQyxDQUFDO0tBQ0o7OztTQXBha0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9wYXRocy1jYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiBnbG9iYWwgYXRvbSAqL1xuXG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgZ2l0SWdub3JlUGFyc2VyIGZyb20gJ2dpdC1pZ25vcmUtcGFyc2VyJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlLXBsdXMnXG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCdcbmltcG9ydCB7IERpcmVjdG9yeSwgRmlsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBleGVjUHJvbWlzZSB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhdGhzQ2FjaGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5fcHJvamVjdENoYW5nZVdhdGNoZXIgPSBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygoKSA9PiB0aGlzLnJlYnVpbGRDYWNoZSgpKVxuXG4gICAgdGhpcy5fcmVwb3NpdG9yaWVzID0gW11cbiAgICB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkgPSBuZXcgTWFwKClcbiAgICB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeSA9IG5ldyBNYXAoKVxuICAgIHRoaXMuX2ZpbGVXYXRjaGVyc0J5RGlyZWN0b3J5ID0gbmV3IE1hcCgpXG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBwYXRoIGlzIGlnbm9yZWRcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgcGF0aFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2lzUGF0aElnbm9yZWQgKHBhdGgpIHtcbiAgICBsZXQgaWdub3JlZCA9IGZhbHNlXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJykpIHtcbiAgICAgIHRoaXMuX3JlcG9zaXRvcmllcy5mb3JFYWNoKHJlcG9zaXRvcnkgPT4ge1xuICAgICAgICBpZiAoaWdub3JlZCkgcmV0dXJuXG4gICAgICAgIGNvbnN0IGlnbm9yZVN1Ym1vZHVsZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5pZ25vcmVTdWJtb2R1bGVzJylcbiAgICAgICAgY29uc3QgaXNJZ25vcmVkU3VibW9kdWxlID0gaWdub3JlU3VibW9kdWxlcyAmJiByZXBvc2l0b3J5LmlzU3VibW9kdWxlKHBhdGgpXG4gICAgICAgIGlmIChyZXBvc2l0b3J5LmlzUGF0aElnbm9yZWQocGF0aCkgfHwgaXNJZ25vcmVkU3VibW9kdWxlKSB7XG4gICAgICAgICAgaWdub3JlZCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlZE5hbWVzJykpIHtcbiAgICAgIGNvbnN0IGlnbm9yZWROYW1lcyA9IGF0b20uY29uZmlnLmdldCgnY29yZS5pZ25vcmVkTmFtZXMnKVxuICAgICAgaWdub3JlZE5hbWVzLmZvckVhY2goaWdub3JlZE5hbWUgPT4ge1xuICAgICAgICBpZiAoaWdub3JlZCkgcmV0dXJuXG4gICAgICAgIGlnbm9yZWQgPSBpZ25vcmVkIHx8IG1pbmltYXRjaChwYXRoLCBpZ25vcmVkTmFtZSwgeyBtYXRjaEJhc2U6IHRydWUsIGRvdDogdHJ1ZSB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBpZ25vcmVkUGF0dGVybnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5pZ25vcmVkUGF0dGVybnMnKVxuICAgIGlmIChpZ25vcmVkUGF0dGVybnMpIHtcbiAgICAgIGlnbm9yZWRQYXR0ZXJucy5mb3JFYWNoKGlnbm9yZWRQYXR0ZXJuID0+IHtcbiAgICAgICAgaWYgKGlnbm9yZWQpIHJldHVyblxuICAgICAgICBpZ25vcmVkID0gaWdub3JlZCB8fCBtaW5pbWF0Y2gocGF0aCwgaWdub3JlZFBhdHRlcm4sIHsgZG90OiB0cnVlIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBpZ25vcmVkXG4gIH1cblxuICAvKipcbiAgICogQ2FjaGVzIHRoZSBwcm9qZWN0IHBhdGhzIGFuZCByZXBvc2l0b3JpZXNcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jYWNoZVByb2plY3RQYXRoc0FuZFJlcG9zaXRvcmllcyAoKSB7XG4gICAgdGhpcy5fcHJvamVjdERpcmVjdG9yaWVzID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcblxuICAgIHJldHVybiBQcm9taXNlLmFsbCh0aGlzLl9wcm9qZWN0RGlyZWN0b3JpZXNcbiAgICAgIC5tYXAoYXRvbS5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkuYmluZChhdG9tLnByb2plY3QpKVxuICAgICkudGhlbihyZXBvc2l0b3JpZXMgPT4ge1xuICAgICAgdGhpcy5fcmVwb3NpdG9yaWVzID0gcmVwb3NpdG9yaWVzLmZpbHRlcihyID0+IHIpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbnRlbnQgb2YgdGhlIGdpdmVuIGBkaXJlY3RvcnlgIGhhcyBjaGFuZ2VkXG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gcHJvamVjdERpcmVjdG9yeVxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IGRpcmVjdG9yeVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uRGlyZWN0b3J5Q2hhbmdlZCAocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KSB7XG4gICAgdGhpcy5fcmVtb3ZlRmlsZVBhdGhzRm9yRGlyZWN0b3J5KHByb2plY3REaXJlY3RvcnksIGRpcmVjdG9yeSlcbiAgICB0aGlzLl9jbGVhbldhdGNoZXJzRm9yRGlyZWN0b3J5KGRpcmVjdG9yeSlcbiAgICB0aGlzLl9jYWNoZURpcmVjdG9yeUZpbGVQYXRocyhwcm9qZWN0RGlyZWN0b3J5LCBkaXJlY3RvcnkpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgd2F0Y2hlcnMgaW5zaWRlIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBkaXJlY3RvcnlcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGVhbldhdGNoZXJzRm9yRGlyZWN0b3J5IChkaXJlY3RvcnkpIHtcbiAgICB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeS5mb3JFYWNoKCh3YXRjaGVyLCBvdGhlckRpcmVjdG9yeSkgPT4ge1xuICAgICAgaWYgKGRpcmVjdG9yeS5jb250YWlucyhvdGhlckRpcmVjdG9yeS5wYXRoKSkge1xuICAgICAgICB3YXRjaGVyLmRpc3Bvc2UoKVxuICAgICAgICB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeS5kZWxldGUob3RoZXJEaXJlY3RvcnkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCBjYWNoZWQgZmlsZSBwYXRocyBpbiB0aGUgZ2l2ZW4gZGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gcHJvamVjdERpcmVjdG9yeVxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IGRpcmVjdG9yeVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlbW92ZUZpbGVQYXRoc0ZvckRpcmVjdG9yeSAocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KSB7XG4gICAgbGV0IGZpbGVQYXRocyA9IHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5nZXQocHJvamVjdERpcmVjdG9yeS5wYXRoKVxuICAgIGlmICghZmlsZVBhdGhzKSByZXR1cm5cblxuICAgIGZpbGVQYXRocyA9IGZpbGVQYXRocy5maWx0ZXIocGF0aCA9PiAhZGlyZWN0b3J5LmNvbnRhaW5zKHBhdGgpKVxuICAgIHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5zZXQocHJvamVjdERpcmVjdG9yeS5wYXRoLCBmaWxlUGF0aHMpXG5cbiAgICB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeS5kZWxldGUoZGlyZWN0b3J5LnBhdGgpXG4gIH1cblxuICAvKipcbiAgICogQ2FjaGVzIGZpbGUgcGF0aHMgZm9yIHRoZSBnaXZlbiBkaXJlY3RvcnlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBwcm9qZWN0RGlyZWN0b3J5XG4gICAqIEBwYXJhbSAge0RpcmVjdG9yeX0gZGlyZWN0b3J5XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2FjaGVEaXJlY3RvcnlGaWxlUGF0aHMgKHByb2plY3REaXJlY3RvcnksIGRpcmVjdG9yeSkge1xuICAgIGlmICh0aGlzLl9jYW5jZWxsZWQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG5cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgICAgbGV0IHdhdGNoZXIgPSB0aGlzLl9maWxlV2F0Y2hlcnNCeURpcmVjdG9yeS5nZXQoZGlyZWN0b3J5KVxuICAgICAgaWYgKCF3YXRjaGVyKSB7XG4gICAgICAgIHdhdGNoZXIgPSBkaXJlY3Rvcnkub25EaWRDaGFuZ2UoKCkgPT5cbiAgICAgICAgICB0aGlzLl9vbkRpcmVjdG9yeUNoYW5nZWQocHJvamVjdERpcmVjdG9yeSwgZGlyZWN0b3J5KVxuICAgICAgICApXG4gICAgICAgIHRoaXMuX2ZpbGVXYXRjaGVyc0J5RGlyZWN0b3J5LnNldChkaXJlY3RvcnksIHdhdGNoZXIpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2dldERpcmVjdG9yeUVudHJpZXMoZGlyZWN0b3J5KVxuICAgICAgLnRoZW4oZW50cmllcyA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9jYW5jZWxsZWQpIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG5cbiAgICAgICAgLy8gRmlsdGVyOiBGaWxlcyB0aGF0IGFyZSBub3QgaWdub3JlZFxuICAgICAgICBjb25zdCBmaWxlUGF0aHMgPSBlbnRyaWVzXG4gICAgICAgICAgLmZpbHRlcihlbnRyeSA9PiBlbnRyeSBpbnN0YW5jZW9mIEZpbGUpXG4gICAgICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS5wYXRoKVxuICAgICAgICAgIC5maWx0ZXIocGF0aCA9PiAhdGhpcy5faXNQYXRoSWdub3JlZChwYXRoKSlcblxuICAgICAgICAvLyBNZXJnZSBmaWxlIHBhdGhzIGludG8gZXhpc3RpbmcgYXJyYXkgKHdoaWNoIGNvbnRhaW5zICphbGwqIGZpbGUgcGF0aHMpXG4gICAgICAgIGxldCBmaWxlUGF0aHNBcnJheSA9IHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5nZXQocHJvamVjdERpcmVjdG9yeS5wYXRoKSB8fCBbXVxuICAgICAgICBjb25zdCBuZXdQYXRoc0NvdW50ID0gZmlsZVBhdGhzQXJyYXkubGVuZ3RoICsgZmlsZVBhdGhzLmxlbmd0aFxuXG4gICAgICAgIGNvbnN0IG1heEZpbGVDb3VudCA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLm1heEZpbGVDb3VudCcpXG4gICAgICAgIGlmIChuZXdQYXRoc0NvdW50ID4gbWF4RmlsZUNvdW50ICYmICF0aGlzLl9jYW5jZWxsZWQpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2F1dG9jb21wbGV0ZS1wYXRocycsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgTWF4aW11bSBmaWxlIGNvdW50IG9mICR7bWF4RmlsZUNvdW50fSBoYXMgYmVlbiBleGNlZWRlZC4gUGF0aCBhdXRvY29tcGxldGlvbiB3aWxsIG5vdCB3b3JrIGluIHRoaXMgcHJvamVjdC48YnIgLz48YnIgLz48YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2F0b20tY29tbXVuaXR5L2F1dG9jb21wbGV0ZS1wYXRocy93aWtpL1Ryb3VibGVzaG9vdGluZyNtYXhpbXVtLWZpbGUtbGltaXQtZXhjZWVkZWRcIj5DbGljayBoZXJlIHRvIGxlYXJuIG1vcmUuPC9hPmAsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkuY2xlYXIoKVxuICAgICAgICAgIHRoaXMuX2ZpbGVQYXRoc0J5RGlyZWN0b3J5LmNsZWFyKClcbiAgICAgICAgICB0aGlzLl9jYW5jZWxsZWQgPSB0cnVlXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZWJ1aWxkLWNhY2hlLWRvbmUnKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5LnNldChwcm9qZWN0RGlyZWN0b3J5LnBhdGgsXG4gICAgICAgICAgXy51bmlvbihmaWxlUGF0aHNBcnJheSwgZmlsZVBhdGhzKVxuICAgICAgICApXG5cbiAgICAgICAgLy8gTWVyZ2UgZmlsZSBwYXRocyBpbnRvIGV4aXN0aW5nIGFycmF5ICh3aGljaCBjb250YWlucyBmaWxlIHBhdGhzIGZvciBhIHNwZWNpZmljIGRpcmVjdG9yeSlcbiAgICAgICAgZmlsZVBhdGhzQXJyYXkgPSB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeS5nZXQoZGlyZWN0b3J5LnBhdGgpIHx8IFtdXG4gICAgICAgIHRoaXMuX2ZpbGVQYXRoc0J5RGlyZWN0b3J5LnNldChkaXJlY3RvcnkucGF0aCxcbiAgICAgICAgICBfLnVuaW9uKGZpbGVQYXRoc0FycmF5LCBmaWxlUGF0aHMpXG4gICAgICAgIClcblxuICAgICAgICBjb25zdCBkaXJlY3RvcmllcyA9IGVudHJpZXNcbiAgICAgICAgICAuZmlsdGVyKGVudHJ5ID0+IGVudHJ5IGluc3RhbmNlb2YgRGlyZWN0b3J5KVxuICAgICAgICAgIC5maWx0ZXIoZW50cnkgPT4gIXRoaXMuX2lzUGF0aElnbm9yZWQoZW50cnkucGF0aCkpXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGRpcmVjdG9yaWVzLm1hcChkaXJlY3RvcnkgPT5cbiAgICAgICAgICB0aGlzLl9jYWNoZURpcmVjdG9yeUZpbGVQYXRocyhwcm9qZWN0RGlyZWN0b3J5LCBkaXJlY3RvcnkpXG4gICAgICAgICkpXG4gICAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFByb21pc2lmaWVkIHZlcnNpb24gb2YgRGlyZWN0b3J5I2dldEVudHJpZXNcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBkaXJlY3RvcnlcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXREaXJlY3RvcnlFbnRyaWVzIChkaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZGlyZWN0b3J5LmdldEVudHJpZXMoKGVyciwgZW50cmllcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZShlbnRyaWVzKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlYnVpbGRzIHRoZSBwYXRocyBjYWNoZVxuICAgKi9cbiAgcmVidWlsZENhY2hlIChwYXRoID0gbnVsbCkge1xuICAgIHRoaXMuZGlzcG9zZSgpXG5cbiAgICB0aGlzLl9jYW5jZWxsZWQgPSBmYWxzZVxuICAgIHRoaXMuZW1pdCgncmVidWlsZC1jYWNoZScpXG5cbiAgICByZXR1cm4gZXhlY1Byb21pc2UoJ2ZpbmQgLS12ZXJzaW9uJylcbiAgICAgIC50aGVuKFxuICAgICAgICAvLyBgZmluZGAgaXMgYXZhaWxhYmxlXG4gICAgICAgICgpID0+IHRoaXMuX2J1aWxkSW5pdGlhbENhY2hlV2l0aEZpbmQoKSxcbiAgICAgICAgLy8gYGZpbmRgIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgKCkgPT4gdGhpcy5fYnVpbGRJbml0aWFsQ2FjaGUoKVxuICAgICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyB0aGUgaW5pdGlhbCBmaWxlIGNhY2hlXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYnVpbGRJbml0aWFsQ2FjaGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9jYWNoZVByb2plY3RQYXRoc0FuZFJlcG9zaXRvcmllcygpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgICB0aGlzLl9wcm9qZWN0RGlyZWN0b3JpZXMubWFwKHByb2plY3REaXJlY3RvcnkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlRGlyZWN0b3J5RmlsZVBhdGhzKHByb2plY3REaXJlY3RvcnksIHByb2plY3REaXJlY3RvcnkpXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgncmVidWlsZC1jYWNoZS1kb25lJylcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwcm9qZWN0IHBhdGggZm9yIHRoZSBnaXZlbiBmaWxlIC8gZGlyZWN0b3J5IHBhdGhOYW1lXG4gICAqIEBwYXJhbSAge1N0cmluZ30gcGF0aE5hbWVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldFByb2plY3RQYXRoRm9yUGF0aCAocGF0aE5hbWUpIHtcbiAgICBjb25zdCBwcm9qZWN0cyA9IHRoaXMuX3Byb2plY3RQYXRoc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHByb2plY3RQYXRoID0gcHJvamVjdHNbaV1cbiAgICAgIGlmIChwYXRoTmFtZS5pbmRleE9mKHByb2plY3RQYXRoKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcHJvamVjdFBhdGhcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZmlsZSBwYXRocyBmb3IgdGhlIGdpdmVuIHByb2plY3QgZGlyZWN0b3J5IHdpdGggdGhlIGdpdmVuIChvcHRpb25hbCkgcmVsYXRpdmUgcGF0aFxuICAgKiBAcGFyYW0gIHtEaXJlY3Rvcnl9IHByb2plY3REaXJlY3RvcnlcbiAgICogQHBhcmFtICB7U3RyaW5nfSBbcmVsYXRpdmVUb1BhdGg9bnVsbF1cbiAgICogQHJldHVybiB7U3RyaW5nW119XG4gICAqL1xuICBnZXRGaWxlUGF0aHNGb3JQcm9qZWN0RGlyZWN0b3J5IChwcm9qZWN0RGlyZWN0b3J5LCByZWxhdGl2ZVRvUGF0aCA9IG51bGwpIHtcbiAgICBsZXQgZmlsZVBhdGhzID0gdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5LmdldChwcm9qZWN0RGlyZWN0b3J5LnBhdGgpIHx8IFtdXG4gICAgaWYgKHJlbGF0aXZlVG9QYXRoKSB7XG4gICAgICByZXR1cm4gZmlsZVBhdGhzLmZpbHRlcihmaWxlUGF0aCA9PiBmaWxlUGF0aC5pbmRleE9mKHJlbGF0aXZlVG9QYXRoKSA9PT0gMClcbiAgICB9XG4gICAgcmV0dXJuIGZpbGVQYXRoc1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3Bvc2VzIHRoaXMgUGF0aHNDYWNoZVxuICAgKi9cbiAgZGlzcG9zZShpc1BhY2thZ2VEaXNwb3NlKSB7XG4gICAgdGhpcy5fZmlsZVdhdGNoZXJzQnlEaXJlY3RvcnkuZm9yRWFjaCgod2F0Y2hlciwgZGlyZWN0b3J5KSA9PiB7XG4gICAgICB3YXRjaGVyLmRpc3Bvc2UoKVxuICAgIH0pXG4gICAgdGhpcy5fZmlsZVdhdGNoZXJzQnlEaXJlY3RvcnkgPSBuZXcgTWFwKClcbiAgICB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3RvcnkgPSBuZXcgTWFwKClcbiAgICB0aGlzLl9maWxlUGF0aHNCeURpcmVjdG9yeSA9IG5ldyBNYXAoKVxuICAgIHRoaXMuX3JlcG9zaXRvcmllcyA9IFtdXG4gICAgaWYgKHRoaXMuX3Byb2plY3RXYXRjaGVyKSB7XG4gICAgICB0aGlzLl9wcm9qZWN0V2F0Y2hlci5kaXNwb3NlKClcbiAgICAgIHRoaXMuX3Byb2plY3RXYXRjaGVyID0gbnVsbFxuICAgIH1cbiAgICBpZiAoaXNQYWNrYWdlRGlzcG9zZSAmJiB0aGlzLl9wcm9qZWN0Q2hhbmdlV2F0Y2hlcikge1xuICAgICAgdGhpcy5fcHJvamVjdENoYW5nZVdhdGNoZXIuZGlzcG9zZSgpXG4gICAgICB0aGlzLl9wcm9qZWN0Q2hhbmdlV2F0Y2hlciA9IG51bGxcbiAgICB9XG4gIH1cblxuICAvL1xuICAvLyBDYWNoZSB3aXRoIGBmaW5kYFxuICAvL1xuXG4gIC8qKlxuICAgKiBCdWlsZHMgdGhlIGluaXRpYWwgZmlsZSBjYWNoZSB3aXRoIGBmaW5kYFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2J1aWxkSW5pdGlhbENhY2hlV2l0aEZpbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NhY2hlUHJvamVjdFBhdGhzQW5kUmVwb3NpdG9yaWVzKClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5fcHJvamVjdFdhdGNoZXIgPSBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VGaWxlcyh0aGlzLl9vbkRpZENoYW5nZUZpbGVzLmJpbmQodGhpcykpXG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICAgIHRoaXMuX3Byb2plY3REaXJlY3Rvcmllcy5tYXAodGhpcy5fcG9wdWxhdGVDYWNoZUZvci5iaW5kKHRoaXMpKVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgncmVidWlsZC1jYWNoZS1kb25lJyk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIF9vbkRpZENoYW5nZUZpbGVzKGV2ZW50cykge1xuICAgIGV2ZW50c1xuICAgICAgLmZpbHRlcihldmVudCA9PiBldmVudC5hY3Rpb24gIT09ICdtb2RpZmllZCcpXG4gICAgICAuZm9yRWFjaChldmVudCA9PiB7XG4gICAgICAgIGlmICghdGhpcy5fcHJvamVjdERpcmVjdG9yaWVzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBhY3Rpb24sIHBhdGgsIG9sZFBhdGggfSA9IGV2ZW50O1xuXG4gICAgICAgIGNvbnN0IHByb2plY3REaXJlY3RvcnkgPSB0aGlzLl9wcm9qZWN0RGlyZWN0b3JpZXNcbiAgICAgICAgICAuZmluZChwcm9qZWN0RGlyZWN0b3J5ID0+IHBhdGguaW5kZXhPZihwcm9qZWN0RGlyZWN0b3J5LnBhdGgpID09PSAwKTtcblxuICAgICAgICBpZiAoIXByb2plY3REaXJlY3RvcnkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGlyZWN0b3J5UGF0aCA9IHByb2plY3REaXJlY3RvcnkucGF0aDtcbiAgICAgICAgY29uc3QgaWdub3JlZCA9IHRoaXMuX2lzUGF0aElnbm9yZWQocGF0aCk7XG5cbiAgICAgICAgaWYgKGlnbm9yZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlcyA9IHRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5nZXQoZGlyZWN0b3J5UGF0aCkgfHwgW107XG5cbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICBjYXNlICdjcmVhdGVkJzpcbiAgICAgICAgICAgIGZpbGVzLnB1c2gocGF0aCk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2RlbGV0ZWQnOlxuICAgICAgICAgICAgY29uc3QgaSA9IGZpbGVzLmluZGV4T2YocGF0aCk7XG4gICAgICAgICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgICAgICAgIGZpbGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAncmVuYW1lZCc6XG4gICAgICAgICAgICBjb25zdCBqID0gZmlsZXMuaW5kZXhPZihvbGRQYXRoKTtcbiAgICAgICAgICAgIGlmIChqID4gLTEpIHtcbiAgICAgICAgICAgICAgZmlsZXNbal0gPSBwYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2ZpbGVQYXRoc0J5UHJvamVjdERpcmVjdG9yeS5oYXMoZGlyZWN0b3J5UGF0aCkpIHtcbiAgICAgICAgICB0aGlzLl9maWxlUGF0aHNCeVByb2plY3REaXJlY3Rvcnkuc2V0KGRpcmVjdG9yeVBhdGgsIGZpbGVzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpc3Qgb2YgaWdub3JlIHBhdHRlcm5zIGZvciBhIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGRpcmVjdG9yeVBhdGhcbiAgICogQHJldHVybiB7U3RyaW5nW119XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZ2V0SWdub3JlUGF0dGVybnMoZGlyZWN0b3J5UGF0aCkge1xuICAgIGNvbnN0IHBhdHRlcm5zID0gW107XG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlZE5hbWVzJykpIHtcbiAgICAgIGF0b20uY29uZmlnLmdldCgnY29yZS5pZ25vcmVkTmFtZXMnKS5mb3JFYWNoKHBhdHRlcm4gPT4gcGF0dGVybnMucHVzaChwYXR0ZXJuKSk7XG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGdpdElnbm9yZSA9IGZzLnJlYWRGaWxlU3luYyhkaXJlY3RvcnlQYXRoICsgJy8uZ2l0aWdub3JlJywgJ3V0Zi04Jyk7XG4gICAgICAgIGdpdElnbm9yZVBhcnNlcihnaXRJZ25vcmUpLmZvckVhY2gocGF0dGVybiA9PiBwYXR0ZXJucy5wdXNoKHBhdHRlcm4pKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoKGVycikge1xuICAgICAgICAvLyAuZ2l0aWdub3JlIGRvZXMgbm90IGV4aXN0IGZvciB0aGlzIGRpcmVjdG9yeSwgaWdub3JpbmdcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpZ25vcmVkUGF0dGVybnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5pZ25vcmVkUGF0dGVybnMnKTtcbiAgICBpZiAoaWdub3JlZFBhdHRlcm5zKSB7XG4gICAgICBpZ25vcmVkUGF0dGVybnMuZm9yRWFjaChwYXR0ZXJuID0+IHBhdHRlcm5zLnB1c2gocGF0dGVybikpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXR0ZXJucztcbiAgfVxuXG4gIC8qKlxuICAgKiBQb3B1bGF0ZXMgY2FjaGUgZm9yIGEgcHJvamVjdCBkaXJlY3RvcnlcbiAgICogQHBhcmFtICB7RGlyZWN0b3J5fSBwcm9qZWN0RGlyZWN0b3J5XG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcG9wdWxhdGVDYWNoZUZvcihwcm9qZWN0RGlyZWN0b3J5KSB7XG4gICAgY29uc3QgZGlyZWN0b3J5UGF0aCA9IHByb2plY3REaXJlY3RvcnkucGF0aDtcblxuICAgIGNvbnN0IGlnbm9yZVBhdHRlcm5zID0gdGhpcy5fZ2V0SWdub3JlUGF0dGVybnMoZGlyZWN0b3J5UGF0aCk7XG4gICAgY29uc3QgaWdub3JlUGF0dGVybnNGb3JGaW5kID0gaWdub3JlUGF0dGVybnMubWFwKFxuICAgICAgcGF0dGVybiA9PiBwYXR0ZXJuXG4gICAgICAgIC5yZXBsYWNlKC9cXC4vZywgJ1xcXFwuJylcbiAgICAgICAgLnJlcGxhY2UoL1xcKi9nLCAnLionKVxuICAgICk7XG4gICAgY29uc3QgaWdub3JlUGF0dGVybiA9ICdcXCcuKlxcXFwoJyArIGlnbm9yZVBhdHRlcm5zRm9yRmluZC5qb2luKCdcXFxcfCcpICsgJ1xcXFwpLipcXCcnO1xuXG4gICAgY29uc3QgY21kID0gW1xuICAgICAgJ2ZpbmQnLFxuICAgICAgJy1MJyxcbiAgICAgIGRpcmVjdG9yeVBhdGggKyAnLycsXG4gICAgICAnLXR5cGUnLCAnZicsXG4gICAgICAnLW5vdCcsICctcmVnZXgnLCBpZ25vcmVQYXR0ZXJuLFxuICAgIF0uam9pbignICcpO1xuXG4gICAgcmV0dXJuIGV4ZWNQcm9taXNlKGNtZCwge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCxcbiAgICB9KS50aGVuKHN0ZG91dCA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IF8uY29tcGFjdChzdGRvdXQuc3BsaXQoJ1xcbicpKTtcblxuICAgICAgdGhpcy5fZmlsZVBhdGhzQnlQcm9qZWN0RGlyZWN0b3J5LnNldChkaXJlY3RvcnlQYXRoLCBmaWxlcyk7XG5cbiAgICAgIHJldHVybiBmaWxlcztcbiAgICB9KTtcbiAgfVxufVxuIl19