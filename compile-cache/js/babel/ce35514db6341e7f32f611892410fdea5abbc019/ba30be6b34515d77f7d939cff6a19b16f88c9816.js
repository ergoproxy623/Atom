Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var TypeView = require('./atom-ternjs-type-view');
var TOLERANCE = 20;

var Type = (function () {
  function Type() {
    _classCallCheck(this, Type);

    this.view = null;
    this.overlayDecoration = null;

    this.currentRange = null;
    this.currentViewData = null;

    this.destroyOverlayListener = this.destroyOverlay.bind(this);
  }

  _createClass(Type, [{
    key: 'init',
    value: function init() {

      this.view = new TypeView();
      this.view.initialize(this);

      atom.views.getView(atom.workspace).appendChild(this.view);

      _atomTernjsEvents2['default'].on('type-destroy-overlay', this.destroyOverlayListener);
    }
  }, {
    key: 'setPosition',
    value: function setPosition() {

      if (this.overlayDecoration) {

        return;
      }

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var marker = editor.getLastCursor().getMarker();

      if (!marker) {

        return;
      }

      this.overlayDecoration = editor.decorateMarker(marker, {

        type: 'overlay',
        item: this.view,
        'class': 'atom-ternjs-type',
        position: 'tale',
        invalidate: 'touch'
      });
    }
  }, {
    key: 'queryType',
    value: function queryType(editor, e) {
      var _this = this;

      var rowStart = 0;
      var rangeBefore = false;
      var tmp = false;
      var may = 0;
      var may2 = 0;
      var skipCounter = 0;
      var skipCounter2 = 0;
      var paramPosition = 0;
      var position = e.newBufferPosition;
      var buffer = editor.getBuffer();

      if (position.row - TOLERANCE < 0) {

        rowStart = 0;
      } else {

        rowStart = position.row - TOLERANCE;
      }

      buffer.backwardsScanInRange(/\]|\[|\(|\)|\,|\{|\}/g, new _atom.Range([rowStart, 0], [position.row, position.column]), function (obj) {

        var scopeDescriptor = editor.scopeDescriptorForBufferPosition([obj.range.start.row, obj.range.start.column]);

        if (scopeDescriptor.scopes.includes('string.quoted') || scopeDescriptor.scopes.includes('string.regexp')) {

          return;
        }

        if (obj.matchText === '}') {

          may++;
          return;
        }

        if (obj.matchText === ']') {

          if (!tmp) {

            skipCounter2++;
          }

          may2++;
          return;
        }

        if (obj.matchText === '{') {

          if (!may) {

            rangeBefore = false;
            obj.stop();

            return;
          }

          may--;
          return;
        }

        if (obj.matchText === '[') {

          if (skipCounter2) {

            skipCounter2--;
          }

          if (!may2) {

            rangeBefore = false;
            obj.stop();
            return;
          }

          may2--;
          return;
        }

        if (obj.matchText === ')' && !tmp) {

          skipCounter++;
          return;
        }

        if (obj.matchText === ',' && !skipCounter && !skipCounter2 && !may && !may2) {

          paramPosition++;
          return;
        }

        if (obj.matchText === ',') {

          return;
        }

        if (obj.matchText === '(' && skipCounter) {

          skipCounter--;
          return;
        }

        if (skipCounter || skipCounter2) {

          return;
        }

        if (obj.matchText === '(' && !tmp) {

          rangeBefore = obj.range;
          obj.stop();

          return;
        }

        tmp = obj.matchText;
      });

      if (!rangeBefore) {

        this.currentViewData = null;
        this.currentRange = null;
        this.destroyOverlay();

        return;
      }

      if (rangeBefore.isEqual(this.currentRange)) {

        this.currentViewData && this.setViewData(this.currentViewData, paramPosition);

        return;
      }

      this.currentRange = rangeBefore;
      this.currentViewData = null;
      this.destroyOverlay();

      _atomTernjsManager2['default'].client.update(editor).then(function () {

        _atomTernjsManager2['default'].client.type(editor, rangeBefore.start).then(function (data) {

          if (!data || !data.type.startsWith('fn') || !data.exprName) {

            return;
          }

          _this.currentViewData = data;

          _this.setViewData(data, paramPosition);
        })['catch'](function (error) {

          // most likely the type wasn't found. ignore it.
        });
      });
    }
  }, {
    key: 'setViewData',
    value: function setViewData(data, paramPosition) {

      var viewData = (0, _underscorePlus.deepClone)(data);
      var type = (0, _atomTernjsHelper.prepareType)(viewData);
      var params = (0, _atomTernjsHelper.extractParams)(type);
      (0, _atomTernjsHelper.formatType)(viewData);

      if (params && params[paramPosition]) {

        viewData.type = viewData.type.replace(params[paramPosition], '<span class="text-info">' + params[paramPosition] + '</span>');
      }

      if (viewData.doc && _atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

        viewData.doc = viewData.doc && viewData.doc.replace(/(?:\r\n|\r|\n)/g, '<br />');
        viewData.doc = (0, _atomTernjsHelper.prepareInlineDocs)(viewData.doc);

        this.view.setData(viewData.type, viewData.doc);
      } else {

        this.view.setData(viewData.type);
      }

      this.setPosition();
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('destroy-type-overlay', this.destroyOverlayListener);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = null;
      }
    }
  }]);

  return Type;
})();

exports['default'] = new Type();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy10eXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBS29CLHVCQUF1Qjs7Ozt1Q0FDakIsOEJBQThCOzs7O2dDQUNwQyxzQkFBc0I7Ozs7b0JBQ3RCLE1BQU07O2dDQU1uQixzQkFBc0I7OzhCQUVMLGlCQUFpQjs7QUFoQnpDLFdBQVcsQ0FBQzs7QUFFWixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNwRCxJQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7O0lBZWYsSUFBSTtBQUVHLFdBRlAsSUFBSSxHQUVNOzBCQUZWLElBQUk7O0FBSU4sUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDekIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7O0FBRTVCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5RDs7ZUFYRyxJQUFJOztXQWFKLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUMzQixVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFELG9DQUFRLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztLQUNqRTs7O1dBRVUsdUJBQUc7O0FBRVosVUFBSSxJQUFJLENBQUMs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QUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7T0FDbEI7S0FDRjs7O1NBL1FHLElBQUk7OztxQkFrUkssSUFBSSxJQUFJLEVBQUUiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgVHlwZVZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXR5cGUtdmlldycpO1xuY29uc3QgVE9MRVJBTkNFID0gMjA7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCB7UmFuZ2V9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtcbiAgcHJlcGFyZVR5cGUsXG4gIHByZXBhcmVJbmxpbmVEb2NzLFxuICBleHRyYWN0UGFyYW1zLFxuICBmb3JtYXRUeXBlXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuaW1wb3J0IHtkZWVwQ2xvbmV9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmNsYXNzIFR5cGUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMuY3VycmVudFJhbmdlID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRWaWV3RGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5TGlzdGVuZXIgPSB0aGlzLmRlc3Ryb3lPdmVybGF5LmJpbmQodGhpcyk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IFR5cGVWaWV3KCk7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG5cbiAgICBlbWl0dGVyLm9uKCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScsIHRoaXMuZGVzdHJveU92ZXJsYXlMaXN0ZW5lcik7XG4gIH1cblxuICBzZXRQb3NpdGlvbigpIHtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlEZWNvcmF0aW9uKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICBpZiAoIWVkaXRvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbWFya2VyID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRNYXJrZXIoKTtcblxuICAgIGlmICghbWFya2VyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuXG4gICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICBjbGFzczogJ2F0b20tdGVybmpzLXR5cGUnLFxuICAgICAgcG9zaXRpb246ICd0YWxlJyxcbiAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICB9KTtcbiAgfVxuXG4gIHF1ZXJ5VHlwZShlZGl0b3IsIGUpIHtcblxuICAgIGxldCByb3dTdGFydCA9IDA7XG4gICAgbGV0IHJhbmdlQmVmb3JlID0gZmFsc2U7XG4gICAgbGV0IHRtcCA9IGZhbHNlO1xuICAgIGxldCBtYXkgPSAwO1xuICAgIGxldCBtYXkyID0gMDtcbiAgICBsZXQgc2tpcENvdW50ZXIgPSAwO1xuICAgIGxldCBza2lwQ291bnRlcjIgPSAwO1xuICAgIGxldCBwYXJhbVBvc2l0aW9uID0gMDtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGUubmV3QnVmZmVyUG9zaXRpb247XG4gICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuXG4gICAgaWYgKHBvc2l0aW9uLnJvdyAtIFRPTEVSQU5DRSA8IDApIHtcblxuICAgICAgcm93U3RhcnQgPSAwO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgcm93U3RhcnQgPSBwb3NpdGlvbi5yb3cgLSBUT0xFUkFOQ0U7XG4gICAgfVxuXG4gICAgYnVmZmVyLmJhY2t3YXJkc1NjYW5JblJhbmdlKC9cXF18XFxbfFxcKHxcXCl8XFwsfFxce3xcXH0vZywgbmV3IFJhbmdlKFtyb3dTdGFydCwgMF0sIFtwb3NpdGlvbi5yb3csIHBvc2l0aW9uLmNvbHVtbl0pLCAob2JqKSA9PiB7XG5cbiAgICAgIGNvbnN0IHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihbb2JqLnJhbmdlLnN0YXJ0LnJvdywgb2JqLnJhbmdlLnN0YXJ0LmNvbHVtbl0pO1xuXG4gICAgICBpZiAoXG4gICAgICAgIHNjb3BlRGVzY3JpcHRvci5zY29wZXMuaW5jbHVkZXMoJ3N0cmluZy5xdW90ZWQnKSB8fFxuICAgICAgICBzY29wZURlc2NyaXB0b3Iuc2NvcGVzLmluY2x1ZGVzKCdzdHJpbmcucmVnZXhwJylcbiAgICAgICkge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICd9Jykge1xuXG4gICAgICAgIG1heSsrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnXScpIHtcblxuICAgICAgICBpZiAoIXRtcCkge1xuXG4gICAgICAgICAgc2tpcENvdW50ZXIyKys7XG4gICAgICAgIH1cblxuICAgICAgICBtYXkyKys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICd7Jykge1xuXG4gICAgICAgIGlmICghbWF5KSB7XG5cbiAgICAgICAgICByYW5nZUJlZm9yZSA9IGZhbHNlO1xuICAgICAgICAgIG9iai5zdG9wKCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtYXktLTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJ1snKSB7XG5cbiAgICAgICAgaWYgKHNraXBDb3VudGVyMikge1xuXG4gICAgICAgICAgc2tpcENvdW50ZXIyLS07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1heTIpIHtcblxuICAgICAgICAgIHJhbmdlQmVmb3JlID0gZmFsc2U7XG4gICAgICAgICAgb2JqLnN0b3AoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtYXkyLS07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICcpJyAmJiAhdG1wKSB7XG5cbiAgICAgICAgc2tpcENvdW50ZXIrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJywnICYmICFza2lwQ291bnRlciAmJiAhc2tpcENvdW50ZXIyICYmICFtYXkgJiYgIW1heTIpIHtcblxuICAgICAgICBwYXJhbVBvc2l0aW9uKys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICcsJykge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICcoJyAmJiBza2lwQ291bnRlcikge1xuXG4gICAgICAgIHNraXBDb3VudGVyLS07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHNraXBDb3VudGVyIHx8IHNraXBDb3VudGVyMikge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICcoJyAmJiAhdG1wKSB7XG5cbiAgICAgICAgcmFuZ2VCZWZvcmUgPSBvYmoucmFuZ2U7XG4gICAgICAgIG9iai5zdG9wKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0bXAgPSBvYmoubWF0Y2hUZXh0O1xuICAgIH0pO1xuXG4gICAgaWYgKCFyYW5nZUJlZm9yZSkge1xuXG4gICAgICB0aGlzLmN1cnJlbnRWaWV3RGF0YSA9IG51bGw7XG4gICAgICB0aGlzLmN1cnJlbnRSYW5nZSA9IG51bGw7XG4gICAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocmFuZ2VCZWZvcmUuaXNFcXVhbCh0aGlzLmN1cnJlbnRSYW5nZSkpIHtcblxuICAgICAgdGhpcy5jdXJyZW50Vmlld0RhdGEgJiYgdGhpcy5zZXRWaWV3RGF0YSh0aGlzLmN1cnJlbnRWaWV3RGF0YSwgcGFyYW1Qb3NpdGlvbik7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRSYW5nZSA9IHJhbmdlQmVmb3JlO1xuICAgIHRoaXMuY3VycmVudFZpZXdEYXRhID0gbnVsbDtcbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKCgpID0+IHtcblxuICAgICAgbWFuYWdlci5jbGllbnQudHlwZShlZGl0b3IsIHJhbmdlQmVmb3JlLnN0YXJ0KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICFkYXRhIHx8XG4gICAgICAgICAgIWRhdGEudHlwZS5zdGFydHNXaXRoKCdmbicpIHx8XG4gICAgICAgICAgIWRhdGEuZXhwck5hbWVcbiAgICAgICAgKSB7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRWaWV3RGF0YSA9IGRhdGE7XG5cbiAgICAgICAgdGhpcy5zZXRWaWV3RGF0YShkYXRhLCBwYXJhbVBvc2l0aW9uKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG5cbiAgICAgICAgLy8gbW9zdCBsaWtlbHkgdGhlIHR5cGUgd2Fzbid0IGZvdW5kLiBpZ25vcmUgaXQuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFZpZXdEYXRhKGRhdGEsIHBhcmFtUG9zaXRpb24pIHtcblxuICAgIGNvbnN0IHZpZXdEYXRhID0gZGVlcENsb25lKGRhdGEpO1xuICAgIGNvbnN0IHR5cGUgPSBwcmVwYXJlVHlwZSh2aWV3RGF0YSk7XG4gICAgY29uc3QgcGFyYW1zID0gZXh0cmFjdFBhcmFtcyh0eXBlKTtcbiAgICBmb3JtYXRUeXBlKHZpZXdEYXRhKTtcblxuICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zW3BhcmFtUG9zaXRpb25dKSB7XG5cbiAgICAgIHZpZXdEYXRhLnR5cGUgPSB2aWV3RGF0YS50eXBlLnJlcGxhY2UocGFyYW1zW3BhcmFtUG9zaXRpb25dLCBgPHNwYW4gY2xhc3M9XCJ0ZXh0LWluZm9cIj4ke3BhcmFtc1twYXJhbVBvc2l0aW9uXX08L3NwYW4+YCk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdmlld0RhdGEuZG9jICYmXG4gICAgICBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvblxuICAgICkge1xuXG4gICAgICB2aWV3RGF0YS5kb2MgPSB2aWV3RGF0YS5kb2MgJiYgdmlld0RhdGEuZG9jLnJlcGxhY2UoLyg/OlxcclxcbnxcXHJ8XFxuKS9nLCAnPGJyIC8+Jyk7XG4gICAgICB2aWV3RGF0YS5kb2MgPSBwcmVwYXJlSW5saW5lRG9jcyh2aWV3RGF0YS5kb2MpO1xuXG4gICAgICB0aGlzLnZpZXcuc2V0RGF0YSh2aWV3RGF0YS50eXBlLCB2aWV3RGF0YS5kb2MpO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy52aWV3LnNldERhdGEodmlld0RhdGEudHlwZSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRQb3NpdGlvbigpO1xuICB9XG5cbiAgZGVzdHJveU92ZXJsYXkoKSB7XG5cbiAgICBpZiAodGhpcy5vdmVybGF5RGVjb3JhdGlvbikge1xuXG4gICAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBlbWl0dGVyLm9mZignZGVzdHJveS10eXBlLW92ZXJsYXknLCB0aGlzLmRlc3Ryb3lPdmVybGF5TGlzdGVuZXIpO1xuXG4gICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgaWYgKHRoaXMudmlldykge1xuXG4gICAgICB0aGlzLnZpZXcuZGVzdHJveSgpO1xuICAgICAgdGhpcy52aWV3ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFR5cGUoKTtcbiJdfQ==