Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsServer = require('./atom-ternjs-server');

var _atomTernjsServer2 = _interopRequireDefault(_atomTernjsServer);

var _atomTernjsClient = require('./atom-ternjs-client');

var _atomTernjsClient2 = _interopRequireDefault(_atomTernjsClient);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsDocumentation = require('./atom-ternjs-documentation');

var _atomTernjsDocumentation2 = _interopRequireDefault(_atomTernjsDocumentation);

var _atomTernjsReference = require('./atom-ternjs-reference');

var _atomTernjsReference2 = _interopRequireDefault(_atomTernjsReference);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsType = require('./atom-ternjs-type');

var _atomTernjsType2 = _interopRequireDefault(_atomTernjsType);

var _atomTernjsConfig = require('./atom-ternjs-config');

var _atomTernjsConfig2 = _interopRequireDefault(_atomTernjsConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsRename = require('./atom-ternjs-rename');

var _atomTernjsRename2 = _interopRequireDefault(_atomTernjsRename);

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var Manager = (function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.disposables = [];
    /**
     * collection of all active clients
     * @type {Array}
     */
    this.clients = [];
    /**
     * reference to the client for the active text-editor
     * @type {Client}
     */
    this.client = null;
    /**
     * collection of all active servers
     * @type {Array}
     */
    this.servers = [];
    /**
     * reference to the server for the active text-editor
     * @type {Server}
     */
    this.server = null;
    this.editors = [];
  }

  _createClass(Manager, [{
    key: 'activate',
    value: function activate() {

      this.registerListeners();
      this.registerCommands();

      _atomTernjsConfig2['default'].init();
      _atomTernjsDocumentation2['default'].init();
      _atomTernjsPackageConfig2['default'].init();
      _atomTernjsProvider2['default'].init();
      _atomTernjsReference2['default'].init();
      _atomTernjsRename2['default'].init();
      _atomTernjsType2['default'].init();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
      this.editors.forEach(function (editor) {
        return (0, _atomTernjsHelper.disposeAll)(editor.disposables);
      });
      this.editors = [];

      for (var server of this.servers) {

        server.destroy();
      }

      this.servers = [];
      this.clients = [];

      this.server = null;
      this.client = null;

      _atomTernjsDocumentation2['default'] && _atomTernjsDocumentation2['default'].destroy();
      _atomTernjsReference2['default'] && _atomTernjsReference2['default'].destroy();
      _atomTernjsType2['default'] && _atomTernjsType2['default'].destroy();
      _atomTernjsPackageConfig2['default'] && _atomTernjsPackageConfig2['default'].destroy();
      _atomTernjsRename2['default'] && _atomTernjsRename2['default'].destroy();
      _atomTernjsConfig2['default'] && _atomTernjsConfig2['default'].destroy();
      _atomTernjsProvider2['default'] && _atomTernjsProvider2['default'].destroy();
      _servicesNavigation2['default'].reset();
    }
  }, {
    key: 'startServer',
    value: function startServer(projectDir) {

      if (!(0, _atomTernjsHelper.isDirectory)(projectDir)) {

        return false;
      }

      if (this.getServerForProject(projectDir)) {

        return true;
      }

      var client = new _atomTernjsClient2['default'](projectDir);
      this.clients.push(client);

      this.servers.push(new _atomTernjsServer2['default'](projectDir, client));

      this.setActiveServerAndClient(projectDir);

      return true;
    }
  }, {
    key: 'setActiveServerAndClient',
    value: function setActiveServerAndClient(uRI) {

      this.server = this.getServerForProject(uRI);
      this.client = this.getClientForProject(uRI);
    }
  }, {
    key: 'destroyClient',
    value: function destroyClient(projectDir) {
      var _this = this;

      var clients = this.clients.slice();

      clients.forEach(function (client, i) {

        if (client.projectDir === projectDir) {

          _this.clients.splice(i, 1);
        }
      });
    }
  }, {
    key: 'destroyServer',
    value: function destroyServer(projectDir) {
      var _this2 = this;

      var servers = this.servers.slice();

      servers.forEach(function (server, i) {

        if (server.projectDir === projectDir) {

          server.destroy();
          _this2.servers.splice(i, 1);
          _this2.destroyClient(projectDir);
        }
      });
    }
  }, {
    key: 'destroyUnusedServers',
    value: function destroyUnusedServers() {
      var _this3 = this;

      var projectDirs = this.editors.map(function (editor) {
        return editor.projectDir;
      });
      var servers = this.servers.slice();

      servers.forEach(function (server) {

        if (!projectDirs.includes(server.projectDir)) {

          _this3.destroyServer(server.projectDir);
        }
      });
    }
  }, {
    key: 'getServerForProject',
    value: function getServerForProject(projectDir) {

      return this.servers.filter(function (server) {
        return server.projectDir === projectDir;
      }).pop();
    }
  }, {
    key: 'getClientForProject',
    value: function getClientForProject(projectDir) {

      return this.clients.filter(function (client) {
        return client.projectDir === projectDir;
      }).pop();
    }
  }, {
    key: 'getEditor',
    value: function getEditor(id) {

      return this.editors.filter(function (editor) {
        return editor.id === id;
      }).pop();
    }
  }, {
    key: 'destroyEditor',
    value: function destroyEditor(id) {
      var _this4 = this;

      var editors = this.editors.slice();

      editors.forEach(function (editor, i) {

        if (editor.id === id) {

          (0, _atomTernjsHelper.disposeAll)(editor.disposables);
          _this4.editors.splice(i, 1);
        }
      });
    }
  }, {
    key: 'getProjectDir',
    value: function getProjectDir(uRI) {
      var _atom$project$relativizePath = atom.project.relativizePath(uRI);

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

      var project = _atom$project$relativizePath2[0];
      var file = _atom$project$relativizePath2[1];

      if (project) {

        return project;
      }

      if (file) {

        var absolutePath = _path2['default'].resolve(__dirname, file);

        return _path2['default'].dirname(absolutePath);
      }

      return undefined;
    }
  }, {
    key: 'registerListeners',
    value: function registerListeners() {
      var _this5 = this;

      this.disposables.push(atom.workspace.observeTextEditors(function (editor) {

        if (!(0, _atomTernjsHelper.isValidEditor)(editor)) {

          return;
        }

        var uRI = editor.getURI();
        var projectDir = _this5.getProjectDir(uRI);
        var serverCreatedOrPresent = _this5.startServer(projectDir);

        if (!serverCreatedOrPresent) {

          return;
        }

        var id = editor.id;
        var disposables = [];

        // Register valid editor
        _this5.editors.push({

          id: id,
          projectDir: projectDir,
          disposables: disposables
        });

        disposables.push(editor.onDidDestroy(function () {

          _this5.destroyEditor(id);
          _this5.destroyUnusedServers();
        }));

        disposables.push(editor.onDidChangeCursorPosition(function (e) {

          // do only query the type if this is the last cursor
          if (!e.cursor || !e.cursor.isLastCursor()) {

            return;
          }

          if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletion) {

            _this5.client && _atomTernjsType2['default'].queryType(editor, e);
          }
        }));

        disposables.push(editor.getBuffer().onDidSave(function (e) {

          _this5.client && _this5.client.update(editor);
        }));

        if (atom.config.get('atom-ternjs.debug')) {

          console.log('observing: ' + uRI);
        }
      }));

      this.disposables.push(atom.workspace.onDidChangeActivePaneItem(function (item) {

        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('rename-hide');

        if (!(0, _atomTernjsHelper.isValidEditor)(item)) {

          _atomTernjsEvents2['default'].emit('reference-hide');
        } else {

          var uRI = item.getURI();
          var projectDir = _this5.getProjectDir(uRI);

          _this5.setActiveServerAndClient(projectDir);
        }
      }));
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {
      var _this6 = this;

      this.disposables.push(atom.commands.add('atom-text-editor', 'core:cancel', function (e) {

        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('reference-hide');
        _atomTernjsEvents2['default'].emit('rename-hide');
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:listFiles', function (e) {

        if (_this6.client) {

          _this6.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:flush', function (e) {

        _this6.server && _this6.server.flush();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:navigateBack', function (e) {

        _servicesNavigation2['default'].goTo(-1);
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:navigateForward', function (e) {

        _servicesNavigation2['default'].goTo(1);
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:definition', function (e) {

        _this6.client && _this6.client.definition();
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:restart', function (e) {

        _this6.server && _this6.server.restart();
      }));
    }
  }]);

  return Manager;
})();

exports['default'] = new Manager();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztnQ0FFbUIsc0JBQXNCOzs7O2dDQUN0QixzQkFBc0I7Ozs7Z0NBQ3JCLHNCQUFzQjs7Ozt1Q0FDaEIsNkJBQTZCOzs7O21DQUNqQyx5QkFBeUI7Ozs7dUNBQ3JCLDhCQUE4Qjs7Ozs4QkFDdkMsb0JBQW9COzs7O2dDQUNsQixzQkFBc0I7Ozs7Z0NBS2xDLHNCQUFzQjs7a0NBQ1Isd0JBQXdCOzs7O2dDQUMxQixzQkFBc0I7Ozs7a0NBQ2xCLHVCQUF1Qjs7OztvQkFDN0IsTUFBTTs7OztBQWxCdkIsV0FBVyxDQUFDOztJQW9CTixPQUFPO0FBRUEsV0FGUCxPQUFPLEdBRUc7MEJBRlYsT0FBTzs7QUFJVCxRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7O0FBS2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7OztBQUtuQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7QUFLbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDbkI7O2VBMUJHLE9BQU87O1dBNEJILG9CQUFHOztBQUVULFVBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztBQUV4QixvQ0FBTyxJQUFJLEVBQUUsQ0FBQztBQUNkLDJDQUFjLElBQUksRUFBRSxDQUFDO0FBQ3JCLDJDQUFjLElBQUksRUFBRSxDQUFDO0FBQ3JCLHNDQUFTLElBQUksRUFBRSxDQUFDO0FBQ2hCLHVDQUFVLElBQUksRUFBRSxDQUFDO0FBQ2pCLG9DQUFPLElBQUksRUFBRSxDQUFDO0FBQ2Qs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QXFCLEVBQUUsVUFBQyxDQUFDLEVBQUs7O0FBRXRGLGVBQUssTUFBTSxJQUFJLE9BQUssTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ3RDLENBQUMsQ0FBQyxDQUFDO0tBQ0w7OztTQXpURyxPQUFPOzs7cUJBNFRFLElBQUksT0FBTyxFQUFFIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBTZXJ2ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1zZXJ2ZXInO1xuaW1wb3J0IENsaWVudCBmcm9tICcuL2F0b20tdGVybmpzLWNsaWVudCc7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQgZG9jdW1lbnRhdGlvbiBmcm9tICcuL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24nO1xuaW1wb3J0IHJlZmVyZW5jZSBmcm9tICcuL2F0b20tdGVybmpzLXJlZmVyZW5jZSc7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCB0eXBlIGZyb20gJy4vYXRvbS10ZXJuanMtdHlwZSc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtY29uZmlnJztcbmltcG9ydCB7XG4gIGlzRGlyZWN0b3J5LFxuICBpc1ZhbGlkRWRpdG9yLFxuICBkaXNwb3NlQWxsXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCBwcm92aWRlciBmcm9tICcuL2F0b20tdGVybmpzLXByb3ZpZGVyJztcbmltcG9ydCByZW5hbWUgZnJvbSAnLi9hdG9tLXRlcm5qcy1yZW5hbWUnO1xuaW1wb3J0IG5hdmlnYXRpb24gZnJvbSAnLi9zZXJ2aWNlcy9uYXZpZ2F0aW9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jbGFzcyBNYW5hZ2VyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgICAvKipcbiAgICAgKiBjb2xsZWN0aW9uIG9mIGFsbCBhY3RpdmUgY2xpZW50c1xuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgICAvKipcbiAgICAgKiByZWZlcmVuY2UgdG8gdGhlIGNsaWVudCBmb3IgdGhlIGFjdGl2ZSB0ZXh0LWVkaXRvclxuICAgICAqIEB0eXBlIHtDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5jbGllbnQgPSBudWxsO1xuICAgIC8qKlxuICAgICAqIGNvbGxlY3Rpb24gb2YgYWxsIGFjdGl2ZSBzZXJ2ZXJzXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuICAgIC8qKlxuICAgICAqIHJlZmVyZW5jZSB0byB0aGUgc2VydmVyIGZvciB0aGUgYWN0aXZlIHRleHQtZWRpdG9yXG4gICAgICogQHR5cGUge1NlcnZlcn1cbiAgICAgKi9cbiAgICB0aGlzLnNlcnZlciA9IG51bGw7XG4gICAgdGhpcy5lZGl0b3JzID0gW107XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcblxuICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcblxuICAgIGNvbmZpZy5pbml0KCk7XG4gICAgZG9jdW1lbnRhdGlvbi5pbml0KCk7XG4gICAgcGFja2FnZUNvbmZpZy5pbml0KCk7XG4gICAgcHJvdmlkZXIuaW5pdCgpO1xuICAgIHJlZmVyZW5jZS5pbml0KCk7XG4gICAgcmVuYW1lLmluaXQoKTtcbiAgICB0eXBlLmluaXQoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgICB0aGlzLmVkaXRvcnMuZm9yRWFjaChlZGl0b3IgPT4gZGlzcG9zZUFsbChlZGl0b3IuZGlzcG9zYWJsZXMpKTtcbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcblxuICAgIGZvciAoY29uc3Qgc2VydmVyIG9mIHRoaXMuc2VydmVycykge1xuXG4gICAgICBzZXJ2ZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgdGhpcy5zZXJ2ZXIgPSBudWxsO1xuICAgIHRoaXMuY2xpZW50ID0gbnVsbDtcblxuICAgIGRvY3VtZW50YXRpb24gJiYgZG9jdW1lbnRhdGlvbi5kZXN0cm95KCk7XG4gICAgcmVmZXJlbmNlICYmIHJlZmVyZW5jZS5kZXN0cm95KCk7XG4gICAgdHlwZSAmJiB0eXBlLmRlc3Ryb3koKTtcbiAgICBwYWNrYWdlQ29uZmlnICYmIHBhY2thZ2VDb25maWcuZGVzdHJveSgpO1xuICAgIHJlbmFtZSAmJiByZW5hbWUuZGVzdHJveSgpO1xuICAgIGNvbmZpZyAmJiBjb25maWcuZGVzdHJveSgpO1xuICAgIHByb3ZpZGVyICYmIHByb3ZpZGVyLmRlc3Ryb3koKTtcbiAgICBuYXZpZ2F0aW9uLnJlc2V0KCk7XG4gIH1cblxuICBzdGFydFNlcnZlcihwcm9qZWN0RGlyKSB7XG5cbiAgICBpZiAoIWlzRGlyZWN0b3J5KHByb2plY3REaXIpKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nZXRTZXJ2ZXJGb3JQcm9qZWN0KHByb2plY3REaXIpKSB7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQocHJvamVjdERpcik7XG4gICAgdGhpcy5jbGllbnRzLnB1c2goY2xpZW50KTtcblxuICAgIHRoaXMuc2VydmVycy5wdXNoKG5ldyBTZXJ2ZXIocHJvamVjdERpciwgY2xpZW50KSk7XG5cbiAgICB0aGlzLnNldEFjdGl2ZVNlcnZlckFuZENsaWVudChwcm9qZWN0RGlyKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KHVSSSkge1xuXG4gICAgdGhpcy5zZXJ2ZXIgPSB0aGlzLmdldFNlcnZlckZvclByb2plY3QodVJJKTtcbiAgICB0aGlzLmNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdCh1UkkpO1xuICB9XG5cbiAgZGVzdHJveUNsaWVudChwcm9qZWN0RGlyKSB7XG5cbiAgICBjb25zdCBjbGllbnRzID0gdGhpcy5jbGllbnRzLnNsaWNlKCk7XG5cbiAgICBjbGllbnRzLmZvckVhY2goKGNsaWVudCwgaSkgPT4ge1xuXG4gICAgICBpZiAoY2xpZW50LnByb2plY3REaXIgPT09IHByb2plY3REaXIpIHtcblxuICAgICAgICB0aGlzLmNsaWVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveVNlcnZlcihwcm9qZWN0RGlyKSB7XG5cbiAgICBjb25zdCBzZXJ2ZXJzID0gdGhpcy5zZXJ2ZXJzLnNsaWNlKCk7XG5cbiAgICBzZXJ2ZXJzLmZvckVhY2goKHNlcnZlciwgaSkgPT4ge1xuXG4gICAgICBpZiAoc2VydmVyLnByb2plY3REaXIgPT09IHByb2plY3REaXIpIHtcblxuICAgICAgICBzZXJ2ZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLnNlcnZlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lDbGllbnQocHJvamVjdERpcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95VW51c2VkU2VydmVycygpIHtcblxuICAgIGNvbnN0IHByb2plY3REaXJzID0gdGhpcy5lZGl0b3JzLm1hcChlZGl0b3IgPT4gZWRpdG9yLnByb2plY3REaXIpO1xuICAgIGNvbnN0IHNlcnZlcnMgPSB0aGlzLnNlcnZlcnMuc2xpY2UoKTtcblxuICAgIHNlcnZlcnMuZm9yRWFjaChzZXJ2ZXIgPT4ge1xuXG4gICAgICBpZiAoIXByb2plY3REaXJzLmluY2x1ZGVzKHNlcnZlci5wcm9qZWN0RGlyKSkge1xuXG4gICAgICAgIHRoaXMuZGVzdHJveVNlcnZlcihzZXJ2ZXIucHJvamVjdERpcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRTZXJ2ZXJGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIHJldHVybiB0aGlzLnNlcnZlcnMuZmlsdGVyKHNlcnZlciA9PiBzZXJ2ZXIucHJvamVjdERpciA9PT0gcHJvamVjdERpcikucG9wKCk7XG4gIH1cblxuICBnZXRDbGllbnRGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIHJldHVybiB0aGlzLmNsaWVudHMuZmlsdGVyKGNsaWVudCA9PiBjbGllbnQucHJvamVjdERpciA9PT0gcHJvamVjdERpcikucG9wKCk7XG4gIH1cblxuICBnZXRFZGl0b3IoaWQpIHtcblxuICAgIHJldHVybiB0aGlzLmVkaXRvcnMuZmlsdGVyKGVkaXRvciA9PiBlZGl0b3IuaWQgPT09IGlkKS5wb3AoKTtcbiAgfVxuXG4gIGRlc3Ryb3lFZGl0b3IoaWQpIHtcblxuICAgIGNvbnN0IGVkaXRvcnMgPSB0aGlzLmVkaXRvcnMuc2xpY2UoKTtcblxuICAgIGVkaXRvcnMuZm9yRWFjaCgoZWRpdG9yLCBpKSA9PiB7XG5cbiAgICAgIGlmIChlZGl0b3IuaWQgPT09IGlkKSB7XG5cbiAgICAgICAgZGlzcG9zZUFsbChlZGl0b3IuZGlzcG9zYWJsZXMpO1xuICAgICAgICB0aGlzLmVkaXRvcnMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UHJvamVjdERpcih1UkkpIHtcblxuICAgIGNvbnN0IFtwcm9qZWN0LCBmaWxlXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aCh1UkkpO1xuXG4gICAgaWYgKHByb2plY3QpIHtcblxuICAgICAgcmV0dXJuIHByb2plY3Q7XG4gICAgfVxuXG4gICAgaWYgKGZpbGUpIHtcblxuICAgICAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgZmlsZSk7XG5cbiAgICAgIHJldHVybiBwYXRoLmRpcm5hbWUoYWJzb2x1dGVQYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcblxuICAgICAgaWYgKCFpc1ZhbGlkRWRpdG9yKGVkaXRvcikpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVSSSA9IGVkaXRvci5nZXRVUkkoKTtcbiAgICAgIGNvbnN0IHByb2plY3REaXIgPSB0aGlzLmdldFByb2plY3REaXIodVJJKTtcbiAgICAgIGNvbnN0IHNlcnZlckNyZWF0ZWRPclByZXNlbnQgPSB0aGlzLnN0YXJ0U2VydmVyKHByb2plY3REaXIpO1xuXG4gICAgICBpZiAoIXNlcnZlckNyZWF0ZWRPclByZXNlbnQpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlkID0gZWRpdG9yLmlkO1xuICAgICAgY29uc3QgZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgICAgLy8gUmVnaXN0ZXIgdmFsaWQgZWRpdG9yXG4gICAgICB0aGlzLmVkaXRvcnMucHVzaCh7XG5cbiAgICAgICAgaWQsXG4gICAgICAgIHByb2plY3REaXIsXG4gICAgICAgIGRpc3Bvc2FibGVzXG4gICAgICB9KTtcblxuICAgICAgZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcblxuICAgICAgICB0aGlzLmRlc3Ryb3lFZGl0b3IoaWQpO1xuICAgICAgICB0aGlzLmRlc3Ryb3lVbnVzZWRTZXJ2ZXJzKCk7XG4gICAgICB9KSk7XG5cbiAgICAgIGRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKGUpID0+IHtcblxuICAgICAgICAvLyBkbyBvbmx5IHF1ZXJ5IHRoZSB0eXBlIGlmIHRoaXMgaXMgdGhlIGxhc3QgY3Vyc29yXG4gICAgICAgIGlmICghZS5jdXJzb3IgfHwgIWUuY3Vyc29yLmlzTGFzdEN1cnNvcigpKSB7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFja2FnZUNvbmZpZy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbikge1xuXG4gICAgICAgICAgdGhpcy5jbGllbnQgJiYgdHlwZS5xdWVyeVR5cGUoZWRpdG9yLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuXG4gICAgICBkaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZFNhdmUoKGUpID0+IHtcblxuICAgICAgICB0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC51cGRhdGUoZWRpdG9yKTtcbiAgICAgIH0pKTtcblxuICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYXRvbS10ZXJuanMuZGVidWcnKSkge1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGBvYnNlcnZpbmc6ICR7dVJJfWApO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtKChpdGVtKSA9PiB7XG5cbiAgICAgIGVtaXR0ZXIuZW1pdCgndHlwZS1kZXN0cm95LW92ZXJsYXknKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgnZG9jdW1lbnRhdGlvbi1kZXN0cm95LW92ZXJsYXknKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgncmVuYW1lLWhpZGUnKTtcblxuICAgICAgaWYgKCFpc1ZhbGlkRWRpdG9yKGl0ZW0pKSB7XG5cbiAgICAgICAgZW1pdHRlci5lbWl0KCdyZWZlcmVuY2UtaGlkZScpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGNvbnN0IHVSSSA9IGl0ZW0uZ2V0VVJJKCk7XG4gICAgICAgIGNvbnN0IHByb2plY3REaXIgPSB0aGlzLmdldFByb2plY3REaXIodVJJKTtcblxuICAgICAgICB0aGlzLnNldEFjdGl2ZVNlcnZlckFuZENsaWVudChwcm9qZWN0RGlyKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJywgKGUpID0+IHtcblxuICAgICAgZW1pdHRlci5lbWl0KCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZWZlcmVuY2UtaGlkZScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZW5hbWUtaGlkZScpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpsaXN0RmlsZXMnLCAoZSkgPT4ge1xuXG4gICAgICBpZiAodGhpcy5jbGllbnQpIHtcblxuICAgICAgICB0aGlzLmNsaWVudC5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgIGNvbnNvbGUuZGlyKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6Zmx1c2gnLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnNlcnZlciAmJiB0aGlzLnNlcnZlci5mbHVzaCgpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpuYXZpZ2F0ZUJhY2snLCAoZSkgPT4ge1xuXG4gICAgICBuYXZpZ2F0aW9uLmdvVG8oLTEpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpuYXZpZ2F0ZUZvcndhcmQnLCAoZSkgPT4ge1xuXG4gICAgICBuYXZpZ2F0aW9uLmdvVG8oMSk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOmRlZmluaXRpb24nLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICdhdG9tLXRlcm5qczpyZXN0YXJ0JywgKGUpID0+IHtcblxuICAgICAgdGhpcy5zZXJ2ZXIgJiYgdGhpcy5zZXJ2ZXIucmVzdGFydCgpO1xuICAgIH0pKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTWFuYWdlcigpO1xuIl19