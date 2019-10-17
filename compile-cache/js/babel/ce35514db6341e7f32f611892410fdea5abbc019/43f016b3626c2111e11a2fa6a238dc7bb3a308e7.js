Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _configTernConfig = require('../config/tern-config');

var _underscorePlus = require('underscore-plus');

'use babel';

var maxPendingRequests = 50;

var Server = (function () {
  function Server(projectRoot, client) {
    var _this = this;

    _classCallCheck(this, Server);

    this.onError = function (e) {

      _this.restart('Child process error: ' + e);
    };

    this.onDisconnect = function () {

      console.warn('child process disconnected.');
    };

    this.onWorkerMessage = function (e) {

      if (e.error && e.error.isUncaughtException) {

        _this.restart('UncaughtException: ' + e.error.message + '. Restarting Server...');

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';
      var id = e.id;

      if (!id) {

        console.error('no id given', e);

        return;
      }

      if (isError) {

        _this.rejects[id] && _this.rejects[id](e.error);
      } else {

        _this.resolves[id] && _this.resolves[id](e.data);
      }

      delete _this.resolves[id];
      delete _this.rejects[id];

      _this.pendingRequest--;
    };

    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.pendingRequest = 0;

    this.projectDir = projectRoot;
    this.distDir = _path2['default'].resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = (0, _underscorePlus.clone)(_configTernConfig.defaultServerConfig);

    var homeDir = process.env.HOME || process.env.USERPROFILE;

    if (homeDir && _fs2['default'].existsSync(_path2['default'].resolve(homeDir, '.tern-config'))) {

      this.defaultConfig = this.readProjectFile(_path2['default'].resolve(homeDir, '.tern-config'));
    }

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(_path2['default'].resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      this.config.async = _atomTernjsPackageConfig2['default'].options.ternServerGetFileAsync;
      this.config.dependencyBudget = _atomTernjsPackageConfig2['default'].options.ternServerDependencyBudget;

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          _glob2['default'].sync(pat, { cwd: _this2.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = _child_process2['default'].fork(_path2['default'].resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage);
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this3 = this;

      if (this.pendingRequest >= maxPendingRequests) {

        this.restart('Max number of pending requests reached. Restarting server...');

        return;
      }

      var requestID = _uuid2['default'].v1();

      this.pendingRequest++;

      return new Promise(function (resolve, reject) {

        _this3.resolves[requestID] = resolve;
        _this3.rejects[requestID] = reject;

        _this3.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return (0, _minimatch2['default'])(file, pat);
      });
    }
  }, {
    key: 'restart',
    value: function restart(message) {

      atom.notifications.addError(message || 'Restarting Server...', {

        dismissable: false
      });

      _atomTernjsManager2['default'].destroyServer(this.projectDir);
      _atomTernjsManager2['default'].startServer(this.projectDir);
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      for (var key in this.rejects) {

        this.rejects[key]('Server is being destroyed. Rejecting.');
      }

      this.resolves = {};
      this.rejects = {};

      this.pendingRequest = 0;

      try {

        this.child.disconnect();
      } catch (error) {

        console.error(error);
      }
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if ((0, _atomTernjsHelper.fileExists)(fileName) !== undefined) {

        return false;
      }

      var file = _fs2['default'].readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message + '. Please restart atom after the file is fixed. This issue isn\'t fully covered yet.', { dismissable: true });

        _atomTernjsManager2['default'].destroyServer(this.projectDir);
      }
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) {

        if (!data.hasOwnProperty(option)) {

          data[option] = this.defaultConfig[option];
        } else if (option === 'plugins') {

          for (var _name in this.defaultConfig.plugins) {

            if (!Object.prototype.hasOwnProperty.call(data.plugins, _name)) {

              data.plugins[_name] = this.defaultConfig.plugins[_name];
            }
          }
        }
      }

      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = _path2['default'].resolve(projectDir, file);

      if (!this.disableLoadingLocal && _fs2['default'].existsSync(local)) {

        return local;
      }

      var shared = _path2['default'].resolve(fallbackDir, file);

      if (_fs2['default'].existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript && src.indexOf('ecmascript') === -1) {

        src.unshift('ecmascript');
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, _path2['default'].resolve(this.distDir, 'defs')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + src[i]);

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }

      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, _path2['default'].resolve(this.distDir, 'plugin')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + plugin);

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {

            console.warn(e);
          }
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[_path2['default'].basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1zZXJ2ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FFb0IsdUJBQXVCOzs7O2dDQUNsQixzQkFBc0I7O2tCQUNoQyxJQUFJOzs7O29CQUNGLE1BQU07Ozs7b0JBQ04sTUFBTTs7Ozs2QkFDUixlQUFlOzs7O3lCQUNSLFdBQVc7Ozs7b0JBQ2hCLE1BQU07Ozs7MkJBQ0MsY0FBYzs7Ozt1Q0FDWiw4QkFBOEI7Ozs7Z0NBQ3RCLHVCQUF1Qjs7OEJBSWxELGlCQUFpQjs7QUFoQnhCLFdBQVcsQ0FBQzs7QUFrQlosSUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O0lBRVQsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLFdBQVcsRUFBRSxNQUFNLEVBQUU7OzswQkFGZCxNQUFNOztTQW1GekIsT0FBTyxHQUFHLFVBQUMsQ0FBQyxFQUFLOztBQUVmLFlBQUssT0FBTywyQkFBeUIsQ0FBQyxDQUFHLENBQUM7S0FDM0M7O1NBRUQsWUFBWSxHQUFHLFlBQU07O0FBRW5CLGFBQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUM3Qzs7U0E2REQsZUFBZSxHQUFHLFVBQUMsQ0FBQyxFQUFLOztBQUV2QixVQUFJLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRTs7QUFFMUMsY0FBSyxPQUFPLHlCQUF1QixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sNEJBQXlCLENBQUM7O0FBRTVFLGVBQU87T0FDUjs7QUFFRCxVQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxLQUFLLE1BQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQztBQUM5RCxVQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsRUFBRSxFQUFFOztBQUVQLGVBQU8s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V0FFM0UsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixnQkFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLDRCQUEwQixNQUFNLFNBQU07O0FBRS9ELHlCQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUM7QUFDSCxxQkFBUztXQUNWO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLGVBQU8sQ0FBQyxrQkFBSyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7T0FDdEM7O0FBRUQsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztTQWxZa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHtmaWxlRXhpc3RzfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBjcCBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQnO1xuaW1wb3J0IHJlc29sdmVGcm9tIGZyb20gJ3Jlc29sdmUtZnJvbSc7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCB7ZGVmYXVsdFNlcnZlckNvbmZpZ30gZnJvbSAnLi4vY29uZmlnL3Rlcm4tY29uZmlnJztcblxuaW1wb3J0IHtcbiAgY2xvbmVcbn0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuY29uc3QgbWF4UGVuZGluZ1JlcXVlc3RzID0gNTA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlciB7XG5cbiAgY29uc3RydWN0b3IocHJvamVjdFJvb3QsIGNsaWVudCkge1xuXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICB0aGlzLmNoaWxkID0gbnVsbDtcblxuICAgIHRoaXMucmVzb2x2ZXMgPSB7fTtcbiAgICB0aGlzLnJlamVjdHMgPSB7fTtcblxuICAgIHRoaXMucGVuZGluZ1JlcXVlc3QgPSAwO1xuXG4gICAgdGhpcy5wcm9qZWN0RGlyID0gcHJvamVjdFJvb3Q7XG4gICAgdGhpcy5kaXN0RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL25vZGVfbW9kdWxlcy90ZXJuJyk7XG5cbiAgICB0aGlzLmRlZmF1bHRDb25maWcgPSBjbG9uZShkZWZhdWx0U2VydmVyQ29uZmlnKTtcblxuICAgIGNvbnN0IGhvbWVEaXIgPSBwcm9jZXNzLmVudi5IT01FIHx8IHByb2Nlc3MuZW52LlVTRVJQUk9GSUxFO1xuXG4gICAgaWYgKGhvbWVEaXIgJiYgZnMuZXhpc3RzU3luYyhwYXRoLnJlc29sdmUoaG9tZURpciwgJy50ZXJuLWNvbmZpZycpKSkge1xuXG4gICAgICB0aGlzLmRlZmF1bHRDb25maWcgPSB0aGlzLnJlYWRQcm9qZWN0RmlsZShwYXRoLnJlc29sdmUoaG9tZURpciwgJy50ZXJuLWNvbmZpZycpKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2plY3RGaWxlTmFtZSA9ICcudGVybi1wcm9qZWN0JztcbiAgICB0aGlzLmRpc2FibGVMb2FkaW5nTG9jYWwgPSBmYWxzZTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIGlmICghdGhpcy5wcm9qZWN0RGlyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMucmVhZFByb2plY3RGaWxlKHBhdGgucmVzb2x2ZSh0aGlzLnByb2plY3REaXIsIHRoaXMucHJvamVjdEZpbGVOYW1lKSk7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5kZWZhdWx0Q29uZmlnO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmFzeW5jID0gcGFja2FnZUNvbmZpZy5vcHRpb25zLnRlcm5TZXJ2ZXJHZXRGaWxlQXN5bmM7XG4gICAgdGhpcy5jb25maWcuZGVwZW5kZW5jeUJ1ZGdldCA9IHBhY2thZ2VDb25maWcub3B0aW9ucy50ZXJuU2VydmVyRGVwZW5kZW5jeUJ1ZGdldDtcblxuICAgIGlmICghdGhpcy5jb25maWcucGx1Z2luc1snZG9jX2NvbW1lbnQnXSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zWydkb2NfY29tbWVudCddID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQgZGVmcyA9IHRoaXMuZmluZERlZnModGhpcy5wcm9qZWN0RGlyLCB0aGlzLmNvbmZpZyk7XG4gICAgbGV0IHBsdWdpbnMgPSB0aGlzLmxvYWRQbHVnaW5zKHRoaXMucHJvamVjdERpciwgdGhpcy5jb25maWcpO1xuICAgIGxldCBmaWxlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5KSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5LmZvckVhY2goKHBhdCkgPT4ge1xuXG4gICAgICAgIGdsb2Iuc3luYyhwYXQsIHsgY3dkOiB0aGlzLnByb2plY3REaXIgfSkuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG5cbiAgICAgICAgICBmaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGQgPSBjcC5mb3JrKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2F0b20tdGVybmpzLXNlcnZlci13b3JrZXIuanMnKSk7XG4gICAgdGhpcy5jaGlsZC5vbignbWVzc2FnZScsIHRoaXMub25Xb3JrZXJNZXNzYWdlKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdlcnJvcicsIHRoaXMub25FcnJvcik7XG4gICAgdGhpcy5jaGlsZC5vbignZGlzY29ubmVjdCcsIHRoaXMub25EaXNjb25uZWN0KTtcbiAgICB0aGlzLmNoaWxkLnNlbmQoe1xuXG4gICAgICB0eXBlOiAnaW5pdCcsXG4gICAgICBkaXI6IHRoaXMucHJvamVjdERpcixcbiAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICBkZWZzOiBkZWZzLFxuICAgICAgcGx1Z2luczogcGx1Z2lucyxcbiAgICAgIGZpbGVzOiBmaWxlc1xuICAgIH0pO1xuICB9XG5cbiAgb25FcnJvciA9IChlKSA9PiB7XG5cbiAgICB0aGlzLnJlc3RhcnQoYENoaWxkIHByb2Nlc3MgZXJyb3I6ICR7ZX1gKTtcbiAgfVxuXG4gIG9uRGlzY29ubmVjdCA9ICgpID0+IHtcblxuICAgIGNvbnNvbGUud2FybignY2hpbGQgcHJvY2VzcyBkaXNjb25uZWN0ZWQuJyk7XG4gIH1cblxuICByZXF1ZXN0KHR5cGUsIGRhdGEpIHtcblxuICAgIGlmICh0aGlzLnBlbmRpbmdSZXF1ZXN0ID49IG1heFBlbmRpbmdSZXF1ZXN0cykge1xuXG4gICAgICB0aGlzLnJlc3RhcnQoJ01heCBudW1iZXIgb2YgcGVuZGluZyByZXF1ZXN0cyByZWFjaGVkLiBSZXN0YXJ0aW5nIHNlcnZlci4uLicpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHJlcXVlc3RJRCA9IHV1aWQudjEoKTtcblxuICAgIHRoaXMucGVuZGluZ1JlcXVlc3QrKztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIHRoaXMucmVzb2x2ZXNbcmVxdWVzdElEXSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnJlamVjdHNbcmVxdWVzdElEXSA9IHJlamVjdDtcblxuICAgICAgdGhpcy5jaGlsZC5zZW5kKHtcblxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBpZDogcmVxdWVzdElELFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZsdXNoKCkge1xuXG4gICAgdGhpcy5yZXF1ZXN0KCdmbHVzaCcsIHt9KS50aGVuKCgpID0+IHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0FsbCBmaWxlcyBmZXRjaGVkIGFuZCBhbmFseXplZC4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvbnRMb2FkKGZpbGUpIHtcblxuICAgIGlmICghdGhpcy5jb25maWcuZG9udExvYWQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5kb250TG9hZC5zb21lKChwYXQpID0+IHtcblxuICAgICAgcmV0dXJuIG1pbmltYXRjaChmaWxlLCBwYXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVzdGFydChtZXNzYWdlKSB7XG5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSB8fCAnUmVzdGFydGluZyBTZXJ2ZXIuLi4nLCB7XG5cbiAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgbWFuYWdlci5kZXN0cm95U2VydmVyKHRoaXMucHJvamVjdERpcik7XG4gICAgbWFuYWdlci5zdGFydFNlcnZlcih0aGlzLnByb2plY3REaXIpO1xuICB9XG5cbiAgb25Xb3JrZXJNZXNzYWdlID0gKGUpID0+IHtcblxuICAgIGlmIChlLmVycm9yICYmIGUuZXJyb3IuaXNVbmNhdWdodEV4Y2VwdGlvbikge1xuXG4gICAgICB0aGlzLnJlc3RhcnQoYFVuY2F1Z2h0RXhjZXB0aW9uOiAke2UuZXJyb3IubWVzc2FnZX0uIFJlc3RhcnRpbmcgU2VydmVyLi4uYCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpc0Vycm9yID0gZS5lcnJvciAhPT0gJ251bGwnICYmIGUuZXJyb3IgIT09ICd1bmRlZmluZWQnO1xuICAgIGNvbnN0IGlkID0gZS5pZDtcblxuICAgIGlmICghaWQpIHtcblxuICAgICAgY29uc29sZS5lcnJvcignbm8gaWQgZ2l2ZW4nLCBlKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc0Vycm9yKSB7XG5cbiAgICAgIHRoaXMucmVqZWN0c1tpZF0gJiYgdGhpcy5yZWplY3RzW2lkXShlLmVycm9yKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMucmVzb2x2ZXNbaWRdICYmIHRoaXMucmVzb2x2ZXNbaWRdKGUuZGF0YSk7XG4gICAgfVxuXG4gICAgZGVsZXRlIHRoaXMucmVzb2x2ZXNbaWRdO1xuICAgIGRlbGV0ZSB0aGlzLnJlamVjdHNbaWRdO1xuXG4gICAgdGhpcy5wZW5kaW5nUmVxdWVzdC0tO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGlmICghdGhpcy5jaGlsZCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5yZWplY3RzKSB7XG5cbiAgICAgIHRoaXMucmVqZWN0c1trZXldKCdTZXJ2ZXIgaXMgYmVpbmcgZGVzdHJveWVkLiBSZWplY3RpbmcuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNvbHZlcyA9IHt9O1xuICAgIHRoaXMucmVqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5wZW5kaW5nUmVxdWVzdCA9IDA7XG5cbiAgICB0cnkge1xuXG4gICAgICB0aGlzLmNoaWxkLmRpc2Nvbm5lY3QoKTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHJlYWRKU09OKGZpbGVOYW1lKSB7XG5cbiAgICBpZiAoZmlsZUV4aXN0cyhmaWxlTmFtZSkgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZU5hbWUsICd1dGY4Jyk7XG5cbiAgICB0cnkge1xuXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShmaWxlKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICBgQmFkIEpTT04gaW4gJHtmaWxlTmFtZX06ICR7ZS5tZXNzYWdlfS4gUGxlYXNlIHJlc3RhcnQgYXRvbSBhZnRlciB0aGUgZmlsZSBpcyBmaXhlZC4gVGhpcyBpc3N1ZSBpc24ndCBmdWxseSBjb3ZlcmVkIHlldC5gLFxuICAgICAgICB7IGRpc21pc3NhYmxlOiB0cnVlIH1cbiAgICAgICk7XG5cbiAgICAgIG1hbmFnZXIuZGVzdHJveVNlcnZlcih0aGlzLnByb2plY3REaXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlYWRQcm9qZWN0RmlsZShmaWxlTmFtZSkge1xuXG4gICAgbGV0IGRhdGEgPSB0aGlzLnJlYWRKU09OKGZpbGVOYW1lKTtcblxuICAgIGlmICghZGF0YSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgb3B0aW9uIGluIHRoaXMuZGVmYXVsdENvbmZpZykge1xuXG4gICAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkob3B0aW9uKSkge1xuXG4gICAgICAgIGRhdGFbb3B0aW9uXSA9IHRoaXMuZGVmYXVsdENvbmZpZ1tvcHRpb25dO1xuXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gJ3BsdWdpbnMnKSB7XG5cbiAgICAgICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuZGVmYXVsdENvbmZpZy5wbHVnaW5zKSB7XG5cbiAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLnBsdWdpbnMsIG5hbWUpKSB7XG5cbiAgICAgICAgICAgIGRhdGEucGx1Z2luc1tuYW1lXSA9IHRoaXMuZGVmYXVsdENvbmZpZy5wbHVnaW5zW25hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZmluZEZpbGUoZmlsZSwgcHJvamVjdERpciwgZmFsbGJhY2tEaXIpIHtcblxuICAgIGxldCBsb2NhbCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0RGlyLCBmaWxlKTtcblxuICAgIGlmICghdGhpcy5kaXNhYmxlTG9hZGluZ0xvY2FsICYmIGZzLmV4aXN0c1N5bmMobG9jYWwpKSB7XG5cbiAgICAgIHJldHVybiBsb2NhbDtcbiAgICB9XG5cbiAgICBsZXQgc2hhcmVkID0gcGF0aC5yZXNvbHZlKGZhbGxiYWNrRGlyLCBmaWxlKTtcblxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNoYXJlZCkpIHtcblxuICAgICAgcmV0dXJuIHNoYXJlZDtcbiAgICB9XG4gIH1cblxuICBmaW5kRGVmcyhwcm9qZWN0RGlyLCBjb25maWcpIHtcblxuICAgIGxldCBkZWZzID0gW107XG4gICAgbGV0IHNyYyA9IGNvbmZpZy5saWJzLnNsaWNlKCk7XG5cbiAgICBpZiAoY29uZmlnLmVjbWFTY3JpcHQgJiYgc3JjLmluZGV4T2YoJ2VjbWFzY3JpcHQnKSA9PT0gLTEpIHtcblxuICAgICAgc3JjLnVuc2hpZnQoJ2VjbWFzY3JpcHQnKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNyYy5sZW5ndGg7ICsraSkge1xuXG4gICAgICBsZXQgZmlsZSA9IHNyY1tpXTtcblxuICAgICAgaWYgKCEvXFwuanNvbiQvLnRlc3QoZmlsZSkpIHtcblxuICAgICAgICBmaWxlID0gYCR7ZmlsZX0uanNvbmA7XG4gICAgICB9XG5cbiAgICAgIGxldCBmb3VuZCA9XG4gICAgICAgIHRoaXMuZmluZEZpbGUoZmlsZSwgcHJvamVjdERpciwgcGF0aC5yZXNvbHZlKHRoaXMuZGlzdERpciwgJ2RlZnMnKSkgfHxcbiAgICAgICAgcmVzb2x2ZUZyb20ocHJvamVjdERpciwgYHRlcm4tJHtzcmNbaV19YClcbiAgICAgICAgO1xuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGB0ZXJuLSR7c3JjW2ldfWApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRmFpbGVkIHRvIGZpbmQgbGlicmFyeSAke3NyY1tpXX1cXG5gLCB7XG5cbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZvdW5kKSB7XG5cbiAgICAgICAgZGVmcy5wdXNoKHRoaXMucmVhZEpTT04oZm91bmQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmcztcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKHByb2plY3REaXIsIGNvbmZpZykge1xuXG4gICAgbGV0IHBsdWdpbnMgPSBjb25maWcucGx1Z2lucztcbiAgICBsZXQgb3B0aW9ucyA9IHt9O1xuICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMgPSBbXTtcblxuICAgIGZvciAobGV0IHBsdWdpbiBpbiBwbHVnaW5zKSB7XG5cbiAgICAgIGxldCB2YWwgPSBwbHVnaW5zW3BsdWdpbl07XG5cbiAgICAgIGlmICghdmFsKSB7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBmb3VuZCA9XG4gICAgICAgIHRoaXMuZmluZEZpbGUoYCR7cGx1Z2lufS5qc2AsIHByb2plY3REaXIsIHBhdGgucmVzb2x2ZSh0aGlzLmRpc3REaXIsICdwbHVnaW4nKSkgfHxcbiAgICAgICAgcmVzb2x2ZUZyb20ocHJvamVjdERpciwgYHRlcm4tJHtwbHVnaW59YClcbiAgICAgICAgO1xuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGB0ZXJuLSR7cGx1Z2lufWApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGAke3RoaXMucHJvamVjdERpcn0vbm9kZV9tb2R1bGVzL3Rlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBGYWlsZWQgdG8gZmluZCBwbHVnaW4gJHtwbHVnaW59XFxuYCwge1xuXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMucHVzaChmb3VuZCk7XG4gICAgICBvcHRpb25zW3BhdGguYmFzZW5hbWUocGx1Z2luKV0gPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cbn1cbiJdfQ==