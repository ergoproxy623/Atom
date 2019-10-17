Object.defineProperty(exports, '__esModule', {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

// Dependencies
'use babel';var fs = undefined;
var path = undefined;
var helpers = undefined;

// Internal Variables
var bundledCsslintPath = undefined;

var loadDeps = function loadDeps() {
  if (!fs) {
    fs = require('fs-plus');
  }
  if (!path) {
    path = require('path');
  }
  if (!helpers) {
    helpers = require('atom-linter');
  }
};

var getCheckNotificationDetails = function getCheckNotificationDetails(checkDetail) {
  return function (notification) {
    var _notification$getOptions = notification.getOptions();

    var detail = _notification$getOptions.detail;

    if (detail === checkDetail) {
      return true;
    }
    return false;
  };
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterCsslintDeps = function installLinterCsslintDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-csslint');
      }
      loadDeps();

      // FIXME: Remove this after a few versions
      if (atom.config.get('linter-csslint.disableTimeout')) {
        atom.config.unset('linter-csslint.disableTimeout');
      }
    };
    depsCallbackID = window.requestIdleCallback(installLinterCsslintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-csslint.executablePath', function (value) {
      _this.executablePath = value;
    }));

    this.activeNotifications = new Set();
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.activeNotifications.forEach(function (notification) {
      return notification.dismiss();
    });
    this.activeNotifications.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'CSSLint',
      grammarScopes: ['source.css'],
      scope: 'file',
      lintsOnChange: false,
      lint: _asyncToGenerator(function* (textEditor) {
        loadDeps();
        var filePath = textEditor.getPath();
        var text = textEditor.getText();
        if (!filePath || text.length === 0) {
          // Empty or unsaved file
          return [];
        }

        var parameters = ['--format=json', filePath];

        var projectPath = atom.project.relativizePath(filePath)[0];
        var cwd = projectPath;
        if (!cwd) {
          cwd = path.dirname(filePath);
        }

        var execOptions = {
          cwd: cwd,
          uniqueKey: 'linter-csslint::' + filePath,
          timeout: 1000 * 30, // 30 seconds
          ignoreExitCode: true
        };

        var execPath = _this2.determineExecPath(_this2.executablePath, projectPath);

        var output = undefined;
        try {
          output = yield helpers.exec(execPath, parameters, execOptions);
        } catch (e) {
          var _ret = (function () {
            // eslint-disable-next-line no-console
            console.error(e);

            // Check if the notification is currently showing to the user
            var checkNotificationDetails = getCheckNotificationDetails(e.message);
            if (Array.from(_this2.activeNotifications).some(checkNotificationDetails)) {
              // This message is still showing to the user!
              return {
                v: null
              };
            }

            // Notify the user
            var message = 'linter-csslint:: Error while running CSSLint!';
            var options = {
              detail: e.message,
              dismissable: true
            };
            var notification = atom.notifications.addError(message, options);
            _this2.activeNotifications.add(notification);
            // Remove it when the user closes the notification
            notification.onDidDismiss(function () {
              return _this2.activeNotifications['delete'](notification);
            });

            // Don't update any current results
            return {
              v: null
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        }

        if (output === null) {
          // Another run has superseded this run
          return null;
        }

        if (textEditor.getText() !== text) {
          // The editor contents have changed, tell Linter not to update
          return null;
        }

        var toReturn = [];

        if (output.length < 1) {
          // No output, no errors
          return toReturn;
        }

        var lintResult = undefined;
        try {
          lintResult = JSON.parse(output);
        } catch (e) {
          var excerpt = 'Invalid response received from CSSLint, check ' + 'your console for more details.';
          return [{
            severity: 'error',
            excerpt: excerpt,
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, 0)
            }
          }];
        }

        if (lintResult.messages.length < 1) {
          // Output, but no errors found
          return toReturn;
        }

        lintResult.messages.forEach(function (data) {
          var line = undefined;
          var col = undefined;
          if (!(data.line && data.col)) {
            line = 0;

            // Use the file start if a location wasn't defined
            col = 0;
          } else {
            line = data.line - 1;
            col = data.col - 1;
          }

          var severity = data.type === 'error' ? 'error' : 'warning';

          var msg = {
            severity: severity,
            excerpt: data.message,
            location: {
              file: filePath,
              position: helpers.generateRange(textEditor, line, col)
            }
          };
          if (data.rule.id && data.rule.desc) {
            msg.details = data.rule.desc + ' (' + data.rule.id + ')';
          }
          if (data.rule.url) {
            msg.url = data.rule.url;
          }

          toReturn.push(msg);
        });

        return toReturn;
      })
    };
  },

  determineExecPath: function determineExecPath(givenPath, projectPath) {
    var execPath = givenPath;
    if (execPath === '') {
      // Use the bundled copy of CSSLint
      var relativeBinPath = path.join('node_modules', '.bin', 'csslint');
      if (process.platform === 'win32') {
        relativeBinPath += '.cmd';
      }
      if (!bundledCsslintPath) {
        var packagePath = atom.packages.resolvePackagePath('linter-csslint');
        bundledCsslintPath = path.join(packagePath, relativeBinPath);
      }
      execPath = bundledCsslintPath;
      if (projectPath) {
        var localCssLintPath = path.join(projectPath, relativeBinPath);
        if (fs.existsSync(localCssLintPath)) {
          execPath = localCssLintPath;
        }
      }
    } else {
      // Normalize any usage of ~
      fs.normalize(execPath);
    }
    return execPath;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1jc3NsaW50L2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUdvQyxNQUFNOzs7QUFIMUMsV0FBVyxDQUFDLEFBTVosSUFBSSxFQUFFLFlBQUEsQ0FBQztBQUNQLElBQUksSUFBSSxZQUFBLENBQUM7QUFDVCxJQUFJLE9BQU8sWUFBQSxDQUFDOzs7QUFHWixJQUFJLGtCQUFrQixZQUFBLENBQUM7O0FBRXZCLElBQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxHQUFTO0FBQ3JCLE1BQUksQ0FBQyxFQUFFLEVBQUU7QUFDUCxNQUFFLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3pCO0FBQ0QsTUFBSSxDQUFDLElBQUksRUFBRTtBQUNULFFBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDeEI7QUFDRCxNQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osV0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztHQUNsQztDQUNGLENBQUM7O0FBRUYsSUFBTSwyQkFBMkIsR0FBRyxTQUE5QiwyQkFBMkIsQ0FBRyxXQUFXO1NBQUksVUFBQyxZQUFZLEVBQUs7bUNBQ2hELFlBQVksQ0FBQyxVQUFVLEVBQUU7O1FBQXBDLE1BQU0sNEJBQU4sTUFBTTs7QUFDZCxRQUFJLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDMUIsYUFBTyxJQUFJLENBQUM7S0FDYjtBQUNELFdBQU8sS0FBSyxDQUFDO0dBQ2Q7Q0FBQSxDQUFDOztxQkFFYTtBQUNiLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQy9CLFFBQUksY0FBYyxZQUFBLENBQUM7QUFDbkIsUUFBTSx3QkFBd0IsR0FBRyxTQUEzQix3QkFBd0IsR0FBUztBQUNyQyxZQUFLLGFBQWEsVUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FB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a0IsQ0FBQztBQUM5QixVQUFJLFdBQVcsRUFBRTtBQUNmLFlBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDakUsWUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7QUFDbkMsa0JBQVEsR0FBRyxnQkFBZ0IsQ0FBQztTQUM3QjtPQUNGO0tBQ0YsTUFBTTs7QUFFTCxRQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3hCO0FBQ0QsV0FBTyxRQUFRLENBQUM7R0FDakI7Q0FDRiIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItY3NzbGludC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLCBpbXBvcnQvZXh0ZW5zaW9uc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG4vLyBEZXBlbmRlbmNpZXNcbmxldCBmcztcbmxldCBwYXRoO1xubGV0IGhlbHBlcnM7XG5cbi8vIEludGVybmFsIFZhcmlhYmxlc1xubGV0IGJ1bmRsZWRDc3NsaW50UGF0aDtcblxuY29uc3QgbG9hZERlcHMgPSAoKSA9PiB7XG4gIGlmICghZnMpIHtcbiAgICBmcyA9IHJlcXVpcmUoJ2ZzLXBsdXMnKTtcbiAgfVxuICBpZiAoIXBhdGgpIHtcbiAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICB9XG4gIGlmICghaGVscGVycykge1xuICAgIGhlbHBlcnMgPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpO1xuICB9XG59O1xuXG5jb25zdCBnZXRDaGVja05vdGlmaWNhdGlvbkRldGFpbHMgPSBjaGVja0RldGFpbCA9PiAobm90aWZpY2F0aW9uKSA9PiB7XG4gIGNvbnN0IHsgZGV0YWlsIH0gPSBub3RpZmljYXRpb24uZ2V0T3B0aW9ucygpO1xuICBpZiAoZGV0YWlsID09PSBjaGVja0RldGFpbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpO1xuICAgIGxldCBkZXBzQ2FsbGJhY2tJRDtcbiAgICBjb25zdCBpbnN0YWxsTGludGVyQ3NzbGludERlcHMgPSAoKSA9PiB7XG4gICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKGRlcHNDYWxsYmFja0lEKTtcbiAgICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItY3NzbGludCcpO1xuICAgICAgfVxuICAgICAgbG9hZERlcHMoKTtcblxuICAgICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIGFmdGVyIGEgZmV3IHZlcnNpb25zXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItY3NzbGludC5kaXNhYmxlVGltZW91dCcpKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdsaW50ZXItY3NzbGludC5kaXNhYmxlVGltZW91dCcpO1xuICAgICAgfVxuICAgIH07XG4gICAgZGVwc0NhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVyQ3NzbGludERlcHMpO1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQoZGVwc0NhbGxiYWNrSUQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbGludGVyLWNzc2xpbnQuZXhlY3V0YWJsZVBhdGgnLFxuICAgICAgKHZhbHVlKSA9PiB7IHRoaXMuZXhlY3V0YWJsZVBhdGggPSB2YWx1ZTsgfSxcbiAgICApKTtcblxuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucyA9IG5ldyBTZXQoKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKCk7XG4gICAgdGhpcy5hY3RpdmVOb3RpZmljYXRpb25zLmZvckVhY2gobm90aWZpY2F0aW9uID0+IG5vdGlmaWNhdGlvbi5kaXNtaXNzKCkpO1xuICAgIHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucy5jbGVhcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0NTU0xpbnQnLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuY3NzJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogZmFsc2UsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBsb2FkRGVwcygpO1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gdGV4dEVkaXRvci5nZXRUZXh0KCk7XG4gICAgICAgIGlmICghZmlsZVBhdGggfHwgdGV4dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAvLyBFbXB0eSBvciB1bnNhdmVkIGZpbGVcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gW1xuICAgICAgICAgICctLWZvcm1hdD1qc29uJyxcbiAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF07XG4gICAgICAgIGxldCBjd2QgPSBwcm9qZWN0UGF0aDtcbiAgICAgICAgaWYgKCFjd2QpIHtcbiAgICAgICAgICBjd2QgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhlY09wdGlvbnMgPSB7XG4gICAgICAgICAgY3dkLFxuICAgICAgICAgIHVuaXF1ZUtleTogYGxpbnRlci1jc3NsaW50Ojoke2ZpbGVQYXRofWAsXG4gICAgICAgICAgdGltZW91dDogMTAwMCAqIDMwLCAvLyAzMCBzZWNvbmRzXG4gICAgICAgICAgaWdub3JlRXhpdENvZGU6IHRydWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZXhlY1BhdGggPSB0aGlzLmRldGVybWluZUV4ZWNQYXRoKHRoaXMuZXhlY3V0YWJsZVBhdGgsIHByb2plY3RQYXRoKTtcblxuICAgICAgICBsZXQgb3V0cHV0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhleGVjUGF0aCwgcGFyYW1ldGVycywgZXhlY09wdGlvbnMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIG5vdGlmaWNhdGlvbiBpcyBjdXJyZW50bHkgc2hvd2luZyB0byB0aGUgdXNlclxuICAgICAgICAgIGNvbnN0IGNoZWNrTm90aWZpY2F0aW9uRGV0YWlscyA9IGdldENoZWNrTm90aWZpY2F0aW9uRGV0YWlscyhlLm1lc3NhZ2UpO1xuICAgICAgICAgIGlmIChBcnJheS5mcm9tKHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucykuc29tZShjaGVja05vdGlmaWNhdGlvbkRldGFpbHMpKSB7XG4gICAgICAgICAgICAvLyBUaGlzIG1lc3NhZ2UgaXMgc3RpbGwgc2hvd2luZyB0byB0aGUgdXNlciFcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE5vdGlmeSB0aGUgdXNlclxuICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnbGludGVyLWNzc2xpbnQ6OiBFcnJvciB3aGlsZSBydW5uaW5nIENTU0xpbnQhJztcbiAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgZGV0YWlsOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihtZXNzYWdlLCBvcHRpb25zKTtcbiAgICAgICAgICB0aGlzLmFjdGl2ZU5vdGlmaWNhdGlvbnMuYWRkKG5vdGlmaWNhdGlvbik7XG4gICAgICAgICAgLy8gUmVtb3ZlIGl0IHdoZW4gdGhlIHVzZXIgY2xvc2VzIHRoZSBub3RpZmljYXRpb25cbiAgICAgICAgICBub3RpZmljYXRpb24ub25EaWREaXNtaXNzKCgpID0+IHRoaXMuYWN0aXZlTm90aWZpY2F0aW9ucy5kZWxldGUobm90aWZpY2F0aW9uKSk7XG5cbiAgICAgICAgICAvLyBEb24ndCB1cGRhdGUgYW55IGN1cnJlbnQgcmVzdWx0c1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dHB1dCA9PT0gbnVsbCkge1xuICAgICAgICAgIC8vIEFub3RoZXIgcnVuIGhhcyBzdXBlcnNlZGVkIHRoaXMgcnVuXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IHRleHQpIHtcbiAgICAgICAgICAvLyBUaGUgZWRpdG9yIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBbXTtcblxuICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAvLyBObyBvdXRwdXQsIG5vIGVycm9yc1xuICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsaW50UmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGxpbnRSZXN1bHQgPSBKU09OLnBhcnNlKG91dHB1dCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zdCBleGNlcnB0ID0gJ0ludmFsaWQgcmVzcG9uc2UgcmVjZWl2ZWQgZnJvbSBDU1NMaW50LCBjaGVjayAnXG4gICAgICAgICAgICArICd5b3VyIGNvbnNvbGUgZm9yIG1vcmUgZGV0YWlscy4nO1xuICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgICAgICBleGNlcnB0LFxuICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgMCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbnRSZXN1bHQubWVzc2FnZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIC8vIE91dHB1dCwgYnV0IG5vIGVycm9ycyBmb3VuZFxuICAgICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbnRSZXN1bHQubWVzc2FnZXMuZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBsaW5lO1xuICAgICAgICAgIGxldCBjb2w7XG4gICAgICAgICAgaWYgKCEoZGF0YS5saW5lICYmIGRhdGEuY29sKSkge1xuICAgICAgICAgICAgLy8gVXNlIHRoZSBmaWxlIHN0YXJ0IGlmIGEgbG9jYXRpb24gd2Fzbid0IGRlZmluZWRcbiAgICAgICAgICAgIFtsaW5lLCBjb2xdID0gWzAsIDBdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBbbGluZSwgY29sXSA9IFtkYXRhLmxpbmUgLSAxLCBkYXRhLmNvbCAtIDFdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHNldmVyaXR5ID0gZGF0YS50eXBlID09PSAnZXJyb3InID8gJ2Vycm9yJyA6ICd3YXJuaW5nJztcblxuICAgICAgICAgIGNvbnN0IG1zZyA9IHtcbiAgICAgICAgICAgIHNldmVyaXR5LFxuICAgICAgICAgICAgZXhjZXJwdDogZGF0YS5tZXNzYWdlLFxuICAgICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbGluZSwgY29sKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoZGF0YS5ydWxlLmlkICYmIGRhdGEucnVsZS5kZXNjKSB7XG4gICAgICAgICAgICBtc2cuZGV0YWlscyA9IGAke2RhdGEucnVsZS5kZXNjfSAoJHtkYXRhLnJ1bGUuaWR9KWA7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkYXRhLnJ1bGUudXJsKSB7XG4gICAgICAgICAgICBtc2cudXJsID0gZGF0YS5ydWxlLnVybDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b1JldHVybi5wdXNoKG1zZyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcblxuICBkZXRlcm1pbmVFeGVjUGF0aChnaXZlblBhdGgsIHByb2plY3RQYXRoKSB7XG4gICAgbGV0IGV4ZWNQYXRoID0gZ2l2ZW5QYXRoO1xuICAgIGlmIChleGVjUGF0aCA9PT0gJycpIHtcbiAgICAgIC8vIFVzZSB0aGUgYnVuZGxlZCBjb3B5IG9mIENTU0xpbnRcbiAgICAgIGxldCByZWxhdGl2ZUJpblBhdGggPSBwYXRoLmpvaW4oJ25vZGVfbW9kdWxlcycsICcuYmluJywgJ2Nzc2xpbnQnKTtcbiAgICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICAgIHJlbGF0aXZlQmluUGF0aCArPSAnLmNtZCc7XG4gICAgICB9XG4gICAgICBpZiAoIWJ1bmRsZWRDc3NsaW50UGF0aCkge1xuICAgICAgICBjb25zdCBwYWNrYWdlUGF0aCA9IGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCdsaW50ZXItY3NzbGludCcpO1xuICAgICAgICBidW5kbGVkQ3NzbGludFBhdGggPSBwYXRoLmpvaW4ocGFja2FnZVBhdGgsIHJlbGF0aXZlQmluUGF0aCk7XG4gICAgICB9XG4gICAgICBleGVjUGF0aCA9IGJ1bmRsZWRDc3NsaW50UGF0aDtcbiAgICAgIGlmIChwcm9qZWN0UGF0aCkge1xuICAgICAgICBjb25zdCBsb2NhbENzc0xpbnRQYXRoID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCByZWxhdGl2ZUJpblBhdGgpO1xuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhsb2NhbENzc0xpbnRQYXRoKSkge1xuICAgICAgICAgIGV4ZWNQYXRoID0gbG9jYWxDc3NMaW50UGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBOb3JtYWxpemUgYW55IHVzYWdlIG9mIH5cbiAgICAgIGZzLm5vcm1hbGl6ZShleGVjUGF0aCk7XG4gICAgfVxuICAgIHJldHVybiBleGVjUGF0aDtcbiAgfSxcbn07XG4iXX0=