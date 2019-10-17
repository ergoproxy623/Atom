function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/* global emit */

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var _workerHelpers = require('./worker-helpers');

var Helpers = _interopRequireWildcard(_workerHelpers);

var _isConfigAtHomeRoot = require('./is-config-at-home-root');

var _isConfigAtHomeRoot2 = _interopRequireDefault(_isConfigAtHomeRoot);

'use babel';

process.title = 'linter-eslint helper';

var rulesMetadata = new Map();
var shouldSendRules = false;

function lintJob(_ref) {
  var cliEngineOptions = _ref.cliEngineOptions;
  var contents = _ref.contents;
  var eslint = _ref.eslint;
  var filePath = _ref.filePath;

  var cliEngine = new eslint.CLIEngine(cliEngineOptions);
  var report = cliEngine.executeOnText(contents, filePath);
  var rules = Helpers.getRules(cliEngine);
  shouldSendRules = Helpers.didRulesChange(rulesMetadata, rules);
  if (shouldSendRules) {
    // Rebuild rulesMetadata
    rulesMetadata.clear();
    rules.forEach(function (properties, rule) {
      return rulesMetadata.set(rule, properties);
    });
  }
  return report;
}

function fixJob(_ref2) {
  var cliEngineOptions = _ref2.cliEngineOptions;
  var contents = _ref2.contents;
  var eslint = _ref2.eslint;
  var filePath = _ref2.filePath;

  var report = lintJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });

  eslint.CLIEngine.outputFixes(report);

  if (!report.results.length || !report.results[0].messages.length) {
    return 'Linter-ESLint: Fix complete.';
  }
  return 'Linter-ESLint: Fix attempt complete, but linting errors remain.';
}

module.exports = _asyncToGenerator(function* () {
  process.on('message', function (jobConfig) {
    // We catch all worker errors so that we can create a separate error emitter
    // for each emitKey, rather than adding multiple listeners for `task:error`
    var contents = jobConfig.contents;
    var type = jobConfig.type;
    var config = jobConfig.config;
    var filePath = jobConfig.filePath;
    var projectPath = jobConfig.projectPath;
    var rules = jobConfig.rules;
    var emitKey = jobConfig.emitKey;

    try {
      if (config.advanced.disableFSCache) {
        _atomLinter.FindCache.clear();
      }

      var fileDir = _path2['default'].dirname(filePath);
      var eslint = Helpers.getESLintInstance(fileDir, config, projectPath);
      var configPath = Helpers.getConfigPath(fileDir);
      var noProjectConfig = configPath === null || (0, _isConfigAtHomeRoot2['default'])(configPath);
      if (noProjectConfig && config.disabling.disableWhenNoEslintConfig) {
        emit(emitKey, { messages: [] });
        return;
      }

      var relativeFilePath = Helpers.getRelativePath(fileDir, filePath, config, projectPath);

      var cliEngineOptions = Helpers.getCLIEngineOptions(type, config, rules, relativeFilePath, fileDir, configPath);

      var response = undefined;
      if (type === 'lint') {
        var report = lintJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });
        response = {
          messages: report.results.length ? report.results[0].messages : []
        };
        if (shouldSendRules) {
          // You can't emit Maps, convert to Array of Arrays to send back.
          response.updatedRules = Array.from(rulesMetadata);
        }
      } else if (type === 'fix') {
        response = fixJob({ cliEngineOptions: cliEngineOptions, contents: contents, eslint: eslint, filePath: filePath });
      } else if (type === 'debug') {
        var modulesDir = _path2['default'].dirname((0, _atomLinter.findCached)(fileDir, 'node_modules/eslint') || '');
        response = Helpers.findESLintDirectory(modulesDir, config, projectPath);
      }
      emit(emitKey, response);
    } catch (workerErr) {
      emit('workerError:' + emitKey, { msg: workerErr.message, stack: workerErr.stack });
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL3dvcmtlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFJaUIsTUFBTTs7OzswQkFDZSxhQUFhOzs2QkFDMUIsa0JBQWtCOztJQUEvQixPQUFPOztrQ0FDWSwwQkFBMEI7Ozs7QUFQekQsV0FBVyxDQUFBOztBQVNYLE9BQU8sQ0FBQyxLQUFLLEdBQUcsc0JBQXNCLENBQUE7O0FBRXRDLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFBOztBQUUzQixTQUFTLE9BQU8sQ0FBQyxJQUFnRCxFQUFFO01BQWhELGdCQUFnQixHQUFsQixJQUFnRCxDQUE5QyxnQkFBZ0I7TUFBRSxRQUFRLEdBQTVCLElBQWdELENBQTVCLFFBQVE7TUFBRSxNQUFNLEdBQXBDLElBQWdELENBQWxCLE1BQU07TUFBRSxRQUFRLEdBQTlDLElBQWdELENBQVYsUUFBUTs7QUFDN0QsTUFBTSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDeEQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDMUQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUN6QyxpQkFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzlELE1BQUksZUFBZSxFQUFFOztBQUVuQixpQkFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3JCLFNBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxVQUFVLEVBQUUsSUFBSTthQUFLLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztLQUFBLENBQUMsQ0FBQTtHQUN6RTtBQUNELFNBQU8sTUFBTSxDQUFBO0NBQ2Q7O0FBRUQsU0FBUyxNQUFNLENBQUMsS0FBZ0QsRUFBRTtNQUFoRCxnQkFBZ0IsR0FBbEIsS0FBZ0QsQ0FBOUMsZ0JBQWdCO01BQUUsUUFBUSxHQUE1QixLQUFnRCxDQUE1QixRQUFRO01BQUUsTUFBTSxHQUFwQyxLQUFnRCxDQUFsQixNQUFNO01BQUUsUUFBUSxHQUE5QyxLQUFnRCxDQUFWLFFBQVE7O0FBQzVELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxFQUFFLGdCQUFnQixFQUFoQixnQkFBZ0IsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7O0FBRXhFLFFBQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUVwQyxNQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7QUFDaEUsV0FBTyw4QkFBOEIsQ0FBQTtHQUN0QztBQUNELFNBQU8saUVBQWlFLENBQUE7Q0FDekU7O0FBRUQsTUFBTSxDQUFDLE9BQU8scUJBQUcsYUFBWTtBQUMzQixTQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFDLFNBQVMsRUFBSzs7O1FBSWpDLFFBQVEsR0FDTixTQUFTLENBRFgsUUFBUTtRQUFFLElBQUksR0FDWixTQUFTLENBREQsSUFBSTtRQUFFLE1BQU0sR0FDcEIsU0FBUyxDQURLLE1BQU07UUFBRSxRQUFRLEdBQzlCLFNBQVMsQ0FEYSxRQUFRO1FBQUUsV0FBVyxHQUMzQyxTQUFTLENBRHVCLFdBQVc7UUFBRSxLQUFLLEdBQ2xELFNBQVMsQ0FEb0MsS0FBSztRQUFFLE9BQU8sR0FDM0QsU0FBUyxDQUQyQyxPQUFPOztBQUUvRCxRQUFJO0FBQ0YsVUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRTtBQUNsQyw4QkFBVSxLQUFLLEVBQUUsQ0FBQTtPQUNsQjs7QUFFRCxVQUFNLE9BQU8sR0FBRyxrQkFBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDdEMsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDdEUsVUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNqRCxVQUFNLGVBQWUsR0FBSSxVQUFVLEtBQUssSUFBSSxJQUFJLHFDQUFtQixVQUFVLENBQUMsQUFBQyxDQUFBO0FBQy9FLFVBQUksZUFBZSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMseUJBQXlCLEVBQUU7QUFDakUsWUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQy9CLGVBQU07T0FDUDs7QUFFRCxVQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUE7O0FBRXhGLFVBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUM3QixtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7O0FBRWxGLFVBQUksUUFBUSxZQUFBLENBQUE7QUFDWixVQUFJLElBQUksS0FBSyxNQUFNLEVBQUU7QUFDbkIsWUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEVBQUUsZ0JBQWdCLEVBQWhCLGdCQUFnQixFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUN4RSxnQkFBUSxHQUFHO0FBQ1Qsa0JBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxFQUFFO1NBQ2xFLENBQUE7QUFDRCxZQUFJLGVBQWUsRUFBRTs7QUFFbkIsa0JBQVEsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUNsRDtPQUNGLE1BQU0sSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO0FBQ3pCLGdCQUFRLEdBQUcsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLEVBQWhCLGdCQUFnQixFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtPQUNwRSxNQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtBQUMzQixZQUFNLFVBQVUsR0FBRyxrQkFBSyxPQUFPLENBQUMsNEJBQVcsT0FBTyxFQUFFLHFCQUFxQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFDakYsZ0JBQVEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQTtPQUN4RTtBQUNELFVBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEIsQ0FBQyxPQUFPLFNBQVMsRUFBRTtBQUNsQixVQUFJLGtCQUFnQixPQUFPLEVBQUksRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7S0FDbkY7R0FDRixDQUFDLENBQUE7Q0FDSCxDQUFBLENBQUEiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcmMvd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLyogZ2xvYmFsIGVtaXQgKi9cblxuaW1wb3J0IFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IEZpbmRDYWNoZSwgZmluZENhY2hlZCB9IGZyb20gJ2F0b20tbGludGVyJ1xuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL3dvcmtlci1oZWxwZXJzJ1xuaW1wb3J0IGlzQ29uZmlnQXRIb21lUm9vdCBmcm9tICcuL2lzLWNvbmZpZy1hdC1ob21lLXJvb3QnXG5cbnByb2Nlc3MudGl0bGUgPSAnbGludGVyLWVzbGludCBoZWxwZXInXG5cbmNvbnN0IHJ1bGVzTWV0YWRhdGEgPSBuZXcgTWFwKClcbmxldCBzaG91bGRTZW5kUnVsZXMgPSBmYWxzZVxuXG5mdW5jdGlvbiBsaW50Sm9iKHsgY2xpRW5naW5lT3B0aW9ucywgY29udGVudHMsIGVzbGludCwgZmlsZVBhdGggfSkge1xuICBjb25zdCBjbGlFbmdpbmUgPSBuZXcgZXNsaW50LkNMSUVuZ2luZShjbGlFbmdpbmVPcHRpb25zKVxuICBjb25zdCByZXBvcnQgPSBjbGlFbmdpbmUuZXhlY3V0ZU9uVGV4dChjb250ZW50cywgZmlsZVBhdGgpXG4gIGNvbnN0IHJ1bGVzID0gSGVscGVycy5nZXRSdWxlcyhjbGlFbmdpbmUpXG4gIHNob3VsZFNlbmRSdWxlcyA9IEhlbHBlcnMuZGlkUnVsZXNDaGFuZ2UocnVsZXNNZXRhZGF0YSwgcnVsZXMpXG4gIGlmIChzaG91bGRTZW5kUnVsZXMpIHtcbiAgICAvLyBSZWJ1aWxkIHJ1bGVzTWV0YWRhdGFcbiAgICBydWxlc01ldGFkYXRhLmNsZWFyKClcbiAgICBydWxlcy5mb3JFYWNoKChwcm9wZXJ0aWVzLCBydWxlKSA9PiBydWxlc01ldGFkYXRhLnNldChydWxlLCBwcm9wZXJ0aWVzKSlcbiAgfVxuICByZXR1cm4gcmVwb3J0XG59XG5cbmZ1bmN0aW9uIGZpeEpvYih7IGNsaUVuZ2luZU9wdGlvbnMsIGNvbnRlbnRzLCBlc2xpbnQsIGZpbGVQYXRoIH0pIHtcbiAgY29uc3QgcmVwb3J0ID0gbGludEpvYih7IGNsaUVuZ2luZU9wdGlvbnMsIGNvbnRlbnRzLCBlc2xpbnQsIGZpbGVQYXRoIH0pXG5cbiAgZXNsaW50LkNMSUVuZ2luZS5vdXRwdXRGaXhlcyhyZXBvcnQpXG5cbiAgaWYgKCFyZXBvcnQucmVzdWx0cy5sZW5ndGggfHwgIXJlcG9ydC5yZXN1bHRzWzBdLm1lc3NhZ2VzLmxlbmd0aCkge1xuICAgIHJldHVybiAnTGludGVyLUVTTGludDogRml4IGNvbXBsZXRlLidcbiAgfVxuICByZXR1cm4gJ0xpbnRlci1FU0xpbnQ6IEZpeCBhdHRlbXB0IGNvbXBsZXRlLCBidXQgbGludGluZyBlcnJvcnMgcmVtYWluLidcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyAoKSA9PiB7XG4gIHByb2Nlc3Mub24oJ21lc3NhZ2UnLCAoam9iQ29uZmlnKSA9PiB7XG4gICAgLy8gV2UgY2F0Y2ggYWxsIHdvcmtlciBlcnJvcnMgc28gdGhhdCB3ZSBjYW4gY3JlYXRlIGEgc2VwYXJhdGUgZXJyb3IgZW1pdHRlclxuICAgIC8vIGZvciBlYWNoIGVtaXRLZXksIHJhdGhlciB0aGFuIGFkZGluZyBtdWx0aXBsZSBsaXN0ZW5lcnMgZm9yIGB0YXNrOmVycm9yYFxuICAgIGNvbnN0IHtcbiAgICAgIGNvbnRlbnRzLCB0eXBlLCBjb25maWcsIGZpbGVQYXRoLCBwcm9qZWN0UGF0aCwgcnVsZXMsIGVtaXRLZXlcbiAgICB9ID0gam9iQ29uZmlnXG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWcuYWR2YW5jZWQuZGlzYWJsZUZTQ2FjaGUpIHtcbiAgICAgICAgRmluZENhY2hlLmNsZWFyKClcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZURpciA9IFBhdGguZGlybmFtZShmaWxlUGF0aClcbiAgICAgIGNvbnN0IGVzbGludCA9IEhlbHBlcnMuZ2V0RVNMaW50SW5zdGFuY2UoZmlsZURpciwgY29uZmlnLCBwcm9qZWN0UGF0aClcbiAgICAgIGNvbnN0IGNvbmZpZ1BhdGggPSBIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcilcbiAgICAgIGNvbnN0IG5vUHJvamVjdENvbmZpZyA9IChjb25maWdQYXRoID09PSBudWxsIHx8IGlzQ29uZmlnQXRIb21lUm9vdChjb25maWdQYXRoKSlcbiAgICAgIGlmIChub1Byb2plY3RDb25maWcgJiYgY29uZmlnLmRpc2FibGluZy5kaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnKSB7XG4gICAgICAgIGVtaXQoZW1pdEtleSwgeyBtZXNzYWdlczogW10gfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbGF0aXZlRmlsZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aChmaWxlRGlyLCBmaWxlUGF0aCwgY29uZmlnLCBwcm9qZWN0UGF0aClcblxuICAgICAgY29uc3QgY2xpRW5naW5lT3B0aW9ucyA9IEhlbHBlcnNcbiAgICAgICAgLmdldENMSUVuZ2luZU9wdGlvbnModHlwZSwgY29uZmlnLCBydWxlcywgcmVsYXRpdmVGaWxlUGF0aCwgZmlsZURpciwgY29uZmlnUGF0aClcblxuICAgICAgbGV0IHJlc3BvbnNlXG4gICAgICBpZiAodHlwZSA9PT0gJ2xpbnQnKSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydCA9IGxpbnRKb2IoeyBjbGlFbmdpbmVPcHRpb25zLCBjb250ZW50cywgZXNsaW50LCBmaWxlUGF0aCB9KVxuICAgICAgICByZXNwb25zZSA9IHtcbiAgICAgICAgICBtZXNzYWdlczogcmVwb3J0LnJlc3VsdHMubGVuZ3RoID8gcmVwb3J0LnJlc3VsdHNbMF0ubWVzc2FnZXMgOiBbXVxuICAgICAgICB9XG4gICAgICAgIGlmIChzaG91bGRTZW5kUnVsZXMpIHtcbiAgICAgICAgICAvLyBZb3UgY2FuJ3QgZW1pdCBNYXBzLCBjb252ZXJ0IHRvIEFycmF5IG9mIEFycmF5cyB0byBzZW5kIGJhY2suXG4gICAgICAgICAgcmVzcG9uc2UudXBkYXRlZFJ1bGVzID0gQXJyYXkuZnJvbShydWxlc01ldGFkYXRhKVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdmaXgnKSB7XG4gICAgICAgIHJlc3BvbnNlID0gZml4Sm9iKHsgY2xpRW5naW5lT3B0aW9ucywgY29udGVudHMsIGVzbGludCwgZmlsZVBhdGggfSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RlYnVnJykge1xuICAgICAgICBjb25zdCBtb2R1bGVzRGlyID0gUGF0aC5kaXJuYW1lKGZpbmRDYWNoZWQoZmlsZURpciwgJ25vZGVfbW9kdWxlcy9lc2xpbnQnKSB8fCAnJylcbiAgICAgICAgcmVzcG9uc2UgPSBIZWxwZXJzLmZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnLCBwcm9qZWN0UGF0aClcbiAgICAgIH1cbiAgICAgIGVtaXQoZW1pdEtleSwgcmVzcG9uc2UpXG4gICAgfSBjYXRjaCAod29ya2VyRXJyKSB7XG4gICAgICBlbWl0KGB3b3JrZXJFcnJvcjoke2VtaXRLZXl9YCwgeyBtc2c6IHdvcmtlckVyci5tZXNzYWdlLCBzdGFjazogd29ya2VyRXJyLnN0YWNrIH0pXG4gICAgfVxuICB9KVxufVxuIl19