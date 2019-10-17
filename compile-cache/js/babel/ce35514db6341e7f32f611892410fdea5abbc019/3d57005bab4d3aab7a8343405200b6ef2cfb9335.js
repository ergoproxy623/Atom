Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _modelsConfig = require('./models/config');

var _modelsConfig2 = _interopRequireDefault(_modelsConfig);

var _viewsConfig = require('./views/config');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

'use babel';

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this.disposables = [];
  }

  _createClass(Config, [{
    key: 'init',
    value: function init() {

      this.disposables.push(atom.views.addViewProvider(_modelsConfig2['default'], _viewsConfig.createView), atom.workspace.addOpener(this.opener.bind(this)), atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', this.requestPane.bind(this)));
    }
  }, {
    key: 'opener',
    value: function opener(uri) {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      var _url$parse = _url2['default'].parse(uri);

      var protocol = _url$parse.protocol;
      var host = _url$parse.host;

      if (protocol !== 'atom-ternjs:' || host !== 'config') {

        return undefined;
      }

      var model = new _modelsConfig2['default']();

      model.setProjectDir(projectDir);
      model.setURI(uri);

      return model;
    }
  }, {
    key: 'requestPane',
    value: function requestPane() {

      var projectDir = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

      if (!projectDir) {

        atom.notifications.addError('There is no active server. Open at least one JavaScript file in the current project to start the tern server. After the server has started you will be able to configure the project.', {

          dismissable: true
        });

        return;
      }

      var uri = 'atom-ternjs:' + '//config/' + projectDir;
      var previousPane = atom.workspace.paneForURI(uri);

      if (previousPane) {

        previousPane.activate();

        return;
      }

      atom.workspace.open('atom-ternjs:' + '//config/' + projectDir, {

        searchAllPanes: true,
        split: 'right'

      }).then(function (model) {

        // console.log(model);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);
      this.disposables = [];
    }
  }]);

  return Config;
})();

exports['default'] = new Config();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzttQkFFZ0IsS0FBSzs7Ozs0QkFFRyxpQkFBaUI7Ozs7MkJBQ2hCLGdCQUFnQjs7Z0NBSWxDLHNCQUFzQjs7aUNBRVQsdUJBQXVCOzs7O0FBWDNDLFdBQVcsQ0FBQzs7SUFhTixNQUFNO0FBRUMsV0FGUCxNQUFNLEdBRUk7MEJBRlYsTUFBTTs7QUFJUixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztHQUN2Qjs7ZUFMRyxNQUFNOztXQU9OLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUVuQixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsb0RBQXlCLEVBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQzNGLENBQUM7S0FDSDs7O1dBRUssZ0JBQUMsR0FBRyxFQUFFOztBQUVWLFVBQU0sVUFBVSxHQUFHLCtCQUFRLE1BQU0sSUFBSSwrQkFBUSxNQUFNLENBQUMsVUFBVSxDQUFDOzt1QkFDdEMsaUJBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQzs7VUFBaEMsUUFBUSxjQUFSLFFBQVE7VUFBRSxJQUFJLGNBQUosSUFBSTs7QUFFckIsVUFDRSxRQUFRLEtBQUssY0FBYyxJQUMzQixJQUFJLEtBQUssUUFBUSxFQUNqQjs7QUFFQSxlQUFPLFNBQVMsQ0FBQztPQUNsQjs7QUFFRCxVQUFNLEtBQUssR0FBRywrQkFBaUIsQ0FBQzs7QUFFaEMsV0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoQyxXQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVsQixhQUFPLEtBQUssQ0FBQztLQUNkOzs7V0FFVSx1QkFBRzs7QUFFWixVQUFNLFVBQVUsR0FBRywrQkFBUSxNQUFNLElBQUksK0JBQVEsTUFBTSxDQUFDLFVBQVUsQ0FBQzs7QUFFL0QsVUFBSSxDQUFDLFVBQVUsRUFBRTs7QUFFZixZQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyx1TEFBdUwsRUFBRTs7QUFFbk4scUJBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUMsQ0FBQzs7QUFFSCxlQUFPO09BQ1I7O0FBRUQsVUFBTSxHQUFHLEdBQUcsY0FBYyxHQUFHLFdBQVcsR0FBRyxVQUFVLENBQUM7QUFDdEQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXBELFVBQUksWUFBWSxFQUFFOztBQUVoQixvQkFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUV4QixlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLFdBQVcsR0FBRyxVQUFVLEVBQUU7O0FBRTdELHNCQUFjLEVBQUUsSUFBSTtBQUNwQixhQUFLLEVBQUUsT0FBTzs7T0FFZixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFLOzs7T0FHbEIsQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLG1CQUFHOztBQUVSLHdDQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3QixVQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztLQUN2Qjs7O1NBN0VHLE1BQU07OztxQkFnRkcsSUFBSSxNQUFNLEVBQUUiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5cbmltcG9ydCBDb25maWdNb2RlbCBmcm9tICcuL21vZGVscy9jb25maWcnO1xuaW1wb3J0IHtjcmVhdGVWaWV3fSBmcm9tICcuL3ZpZXdzL2NvbmZpZyc7XG5cbmltcG9ydCB7XG4gIGRpc3Bvc2VBbGxcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuXG5jbGFzcyBDb25maWcge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChcblxuICAgICAgYXRvbS52aWV3cy5hZGRWaWV3UHJvdmlkZXIoQ29uZmlnTW9kZWwsIGNyZWF0ZVZpZXcpLFxuICAgICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKHRoaXMub3BlbmVyLmJpbmQodGhpcykpLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2F0b20tdGVybmpzOm9wZW5Db25maWcnLCB0aGlzLnJlcXVlc3RQYW5lLmJpbmQodGhpcykpXG4gICAgKTtcbiAgfVxuXG4gIG9wZW5lcih1cmkpIHtcblxuICAgIGNvbnN0IHByb2plY3REaXIgPSBtYW5hZ2VyLnNlcnZlciAmJiBtYW5hZ2VyLnNlcnZlci5wcm9qZWN0RGlyO1xuICAgIGNvbnN0IHtwcm90b2NvbCwgaG9zdH0gPSB1cmwucGFyc2UodXJpKTtcblxuICAgIGlmIChcbiAgICAgIHByb3RvY29sICE9PSAnYXRvbS10ZXJuanM6JyB8fFxuICAgICAgaG9zdCAhPT0gJ2NvbmZpZydcbiAgICApIHtcblxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBtb2RlbCA9IG5ldyBDb25maWdNb2RlbCgpO1xuXG4gICAgbW9kZWwuc2V0UHJvamVjdERpcihwcm9qZWN0RGlyKTtcbiAgICBtb2RlbC5zZXRVUkkodXJpKTtcblxuICAgIHJldHVybiBtb2RlbDtcbiAgfVxuXG4gIHJlcXVlc3RQYW5lKCkge1xuXG4gICAgY29uc3QgcHJvamVjdERpciA9IG1hbmFnZXIuc2VydmVyICYmIG1hbmFnZXIuc2VydmVyLnByb2plY3REaXI7XG5cbiAgICBpZiAoIXByb2plY3REaXIpIHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdUaGVyZSBpcyBubyBhY3RpdmUgc2VydmVyLiBPcGVuIGF0IGxlYXN0IG9uZSBKYXZhU2NyaXB0IGZpbGUgaW4gdGhlIGN1cnJlbnQgcHJvamVjdCB0byBzdGFydCB0aGUgdGVybiBzZXJ2ZXIuIEFmdGVyIHRoZSBzZXJ2ZXIgaGFzIHN0YXJ0ZWQgeW91IHdpbGwgYmUgYWJsZSB0byBjb25maWd1cmUgdGhlIHByb2plY3QuJywge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVyaSA9ICdhdG9tLXRlcm5qczonICsgJy8vY29uZmlnLycgKyBwcm9qZWN0RGlyO1xuICAgIGNvbnN0IHByZXZpb3VzUGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkodXJpKTtcblxuICAgIGlmIChwcmV2aW91c1BhbmUpIHtcblxuICAgICAgcHJldmlvdXNQYW5lLmFjdGl2YXRlKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tLXRlcm5qczonICsgJy8vY29uZmlnLycgKyBwcm9qZWN0RGlyLCB7XG5cbiAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxuICAgICAgc3BsaXQ6ICdyaWdodCdcblxuICAgIH0pLnRoZW4oKG1vZGVsKSA9PiB7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKG1vZGVsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29uZmlnKCk7XG4iXX0=