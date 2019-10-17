Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHyperclickProvider = require('./atom-ternjs-hyperclick-provider');

var _atomTernjsHyperclickProvider2 = _interopRequireDefault(_atomTernjsHyperclickProvider);

var _atom = require('atom');

'use babel';

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.config = _config2['default'];
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      this.subscriptions = new _atom.CompositeDisposable();

      this.subscriptions.add(atom.packages.onDidActivateInitialPackages(function () {

        if (!atom.inSpecMode()) {

          require('atom-package-deps').install('atom-ternjs', true);
        }
      }));

      _atomTernjsManager2['default'].activate();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      _atomTernjsManager2['default'].destroy();
      this.subscriptions.dispose();
    }
  }, {
    key: 'provide',
    value: function provide() {

      return _atomTernjsProvider2['default'];
    }
  }, {
    key: 'provideHyperclick',
    value: function provideHyperclick() {

      return _atomTernjsHyperclickProvider2['default'];
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUV5QixVQUFVOzs7O2tDQUNkLHdCQUF3Qjs7OztpQ0FDekIsdUJBQXVCOzs7OzRDQUNwQixtQ0FBbUM7Ozs7b0JBQ3RCLE1BQU07O0FBTjFDLFdBQVcsQ0FBQzs7SUFRTixVQUFVO0FBRUgsV0FGUCxVQUFVLEdBRUE7MEJBRlYsVUFBVTs7QUFJWixRQUFJLENBQUMsTUFBTSxzQkFBZSxDQUFDO0dBQzVCOztlQUxHLFVBQVU7O1dBT04sb0JBQUc7O0FBRVQsVUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7QUFFL0MsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsWUFBVzs7QUFFcEQsWUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTs7QUFFdEIsaUJBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0Q7T0FDRixDQUFDLENBQ0gsQ0FBQzs7QUFFRixxQ0FBUSxRQUFRLEVBQUUsQ0FBQztLQUNwQjs7O1dBRVMsc0JBQUc7O0FBRVgscUNBQVEsT0FBTyxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM5Qjs7O1dBRU0sbUJBQUc7O0FBRVIsNkNBQWdCO0tBQ2pCOzs7V0FFZ0IsNkJBQUc7O0FBRWxCLHVEQUFrQjtLQUNuQjs7O1NBdENHLFVBQVU7OztxQkF5Q0QsSUFBSSxVQUFVLEVBQUUiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBkZWZhdWxDb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHByb3ZpZGVyIGZyb20gJy4vYXRvbS10ZXJuanMtcHJvdmlkZXInO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBoeXBlcmNsaWNrIGZyb20gJy4vYXRvbS10ZXJuanMtaHlwZXJjbGljay1wcm92aWRlcic7XG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmNsYXNzIEF0b21UZXJuanMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5jb25maWcgPSBkZWZhdWxDb25maWc7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcblxuICAgICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnYXRvbS10ZXJuanMnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgbWFuYWdlci5hY3RpdmF0ZSgpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcblxuICAgIG1hbmFnZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cblxuICBwcm92aWRlKCkge1xuXG4gICAgcmV0dXJuIHByb3ZpZGVyO1xuICB9XG5cbiAgcHJvdmlkZUh5cGVyY2xpY2soKSB7XG5cbiAgICByZXR1cm4gaHlwZXJjbGljaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQXRvbVRlcm5qcygpO1xuIl19