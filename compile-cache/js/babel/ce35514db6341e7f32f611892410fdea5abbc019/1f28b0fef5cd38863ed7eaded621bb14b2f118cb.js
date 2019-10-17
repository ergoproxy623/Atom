Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = cachedParser;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _core = require("./core");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick:make-cache");

function cachedParser(subscriptions) {
  var editors = new WeakMap();
  var data = new WeakMap();
  var configCache = new WeakMap();

  function loadBabelConfig(editor) {
    if (!configCache.has(editor)) {
      var babel = require("@babel/core");
      var transformOptions = {
        babelrc: true,
        root: _path2["default"].dirname(editor.getPath()),
        rootMode: "upward-optional",
        filename: editor.getPath()
      };

      try {
        var partialConfig = babel.loadPartialConfig(transformOptions);

        debug("Partial Config", partialConfig);

        if (partialConfig.config == null) {
          configCache.set(editor, undefined);
        } else {
          configCache.set(editor, partialConfig.options);
        }
      } catch (e) {
        debug("Error loading config");
        debug(e);
      }
    }
    return configCache.get(editor);
  }

  function watchEditor(editor) {
    if (!editors.has(editor)) {
      editors.set(editor, null);
      subscriptions.add(editor.onDidStopChanging(function () {
        data["delete"](editor);
      }));
    }
  }

  return {
    get: function get(editor) {
      watchEditor(editor);
      if (!data.has(editor)) {
        data.set(editor, (0, _core.parseCode)(editor.getText(), loadBabelConfig(editor)));
      }

      // $FlowExpectError - Flow thinks it might return null here
      return data.get(editor);
    }
  };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL21ha2UtY2FjaGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQVd3QixZQUFZOzs7O29CQVJuQixNQUFNOzs7O29CQUdHLFFBQVE7O3FCQUNaLE9BQU87Ozs7QUFQN0IsV0FBVyxDQUFBOztBQVNYLElBQU0sS0FBSyxHQUFHLHdCQUFVLDBCQUEwQixDQUFDLENBQUE7O0FBRXBDLFNBQVMsWUFBWSxDQUFDLGFBQWtDLEVBQUU7QUFDdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQTtBQUM3QixNQUFNLElBQStCLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQTtBQUNyRCxNQUFNLFdBQXlDLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQTs7QUFFL0QsV0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQy9CLFFBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzVCLFVBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNwQyxVQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLGVBQU8sRUFBRSxJQUFJO0FBQ2IsWUFBSSxFQUFFLGtCQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEMsZ0JBQVEsRUFBRSxpQkFBaUI7QUFDM0IsZ0JBQVEsRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFO09BQzNCLENBQUE7O0FBRUQsVUFBSTtBQUNGLFlBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBOztBQUUvRCxhQUFLLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUE7O0FBRXRDLFlBQUksYUFBYSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDaEMscUJBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1NBQ25DLE1BQU07QUFDTCxxQkFBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQy9DO09BQ0YsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLGFBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQzdCLGFBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNUO0tBQ0Y7QUFDRCxXQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDL0I7O0FBRUQsV0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQzNCLFFBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3hCLGFBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3pCLG1CQUFhLENBQUMsR0FBRyxDQUNmLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFNO0FBQzdCLFlBQUksVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQ3BCLENBQUMsQ0FDSCxDQUFBO0tBQ0Y7R0FDRjs7QUFFRCxTQUFPO0FBQ0wsT0FBRyxFQUFBLGFBQUMsTUFBa0IsRUFBUTtBQUM1QixpQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLHFCQUFVLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQ3ZFOzs7QUFHRCxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDeEI7R0FDRixDQUFBO0NBQ0YiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvbWFrZS1jYWNoZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCJcbi8vIEBmbG93XG5cbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCJcbmltcG9ydCB0eXBlIHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEVkaXRvciB9IGZyb20gXCJhdG9tXCJcbmltcG9ydCB0eXBlIHsgSW5mbyB9IGZyb20gXCIuL3R5cGVzXCJcbmltcG9ydCB7IHBhcnNlQ29kZSB9IGZyb20gXCIuL2NvcmVcIlxuaW1wb3J0IG1ha2VEZWJ1ZyBmcm9tIFwiZGVidWdcIlxuXG5jb25zdCBkZWJ1ZyA9IG1ha2VEZWJ1ZyhcImpzLWh5cGVyY2xpY2s6bWFrZS1jYWNoZVwiKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjYWNoZWRQYXJzZXIoc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZSkge1xuICBjb25zdCBlZGl0b3JzID0gbmV3IFdlYWtNYXAoKVxuICBjb25zdCBkYXRhOiBXZWFrTWFwPFRleHRFZGl0b3IsIEluZm8+ID0gbmV3IFdlYWtNYXAoKVxuICBjb25zdCBjb25maWdDYWNoZTogV2Vha01hcDxUZXh0RWRpdG9yLCA/T2JqZWN0PiA9IG5ldyBXZWFrTWFwKClcblxuICBmdW5jdGlvbiBsb2FkQmFiZWxDb25maWcoZWRpdG9yKSB7XG4gICAgaWYgKCFjb25maWdDYWNoZS5oYXMoZWRpdG9yKSkge1xuICAgICAgY29uc3QgYmFiZWwgPSByZXF1aXJlKFwiQGJhYmVsL2NvcmVcIilcbiAgICAgIGNvbnN0IHRyYW5zZm9ybU9wdGlvbnMgPSB7XG4gICAgICAgIGJhYmVscmM6IHRydWUsXG4gICAgICAgIHJvb3Q6IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKSxcbiAgICAgICAgcm9vdE1vZGU6IFwidXB3YXJkLW9wdGlvbmFsXCIsXG4gICAgICAgIGZpbGVuYW1lOiBlZGl0b3IuZ2V0UGF0aCgpLFxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwYXJ0aWFsQ29uZmlnID0gYmFiZWwubG9hZFBhcnRpYWxDb25maWcodHJhbnNmb3JtT3B0aW9ucylcblxuICAgICAgICBkZWJ1ZyhcIlBhcnRpYWwgQ29uZmlnXCIsIHBhcnRpYWxDb25maWcpXG5cbiAgICAgICAgaWYgKHBhcnRpYWxDb25maWcuY29uZmlnID09IG51bGwpIHtcbiAgICAgICAgICBjb25maWdDYWNoZS5zZXQoZWRpdG9yLCB1bmRlZmluZWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uZmlnQ2FjaGUuc2V0KGVkaXRvciwgcGFydGlhbENvbmZpZy5vcHRpb25zKVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlYnVnKFwiRXJyb3IgbG9hZGluZyBjb25maWdcIilcbiAgICAgICAgZGVidWcoZSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbmZpZ0NhY2hlLmdldChlZGl0b3IpXG4gIH1cblxuICBmdW5jdGlvbiB3YXRjaEVkaXRvcihlZGl0b3IpIHtcbiAgICBpZiAoIWVkaXRvcnMuaGFzKGVkaXRvcikpIHtcbiAgICAgIGVkaXRvcnMuc2V0KGVkaXRvciwgbnVsbClcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT4ge1xuICAgICAgICAgIGRhdGEuZGVsZXRlKGVkaXRvcilcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQoZWRpdG9yOiBUZXh0RWRpdG9yKTogSW5mbyB7XG4gICAgICB3YXRjaEVkaXRvcihlZGl0b3IpXG4gICAgICBpZiAoIWRhdGEuaGFzKGVkaXRvcikpIHtcbiAgICAgICAgZGF0YS5zZXQoZWRpdG9yLCBwYXJzZUNvZGUoZWRpdG9yLmdldFRleHQoKSwgbG9hZEJhYmVsQ29uZmlnKGVkaXRvcikpKVxuICAgICAgfVxuXG4gICAgICAvLyAkRmxvd0V4cGVjdEVycm9yIC0gRmxvdyB0aGlua3MgaXQgbWlnaHQgcmV0dXJuIG51bGwgaGVyZVxuICAgICAgcmV0dXJuIGRhdGEuZ2V0KGVkaXRvcilcbiAgICB9LFxuICB9XG59XG4iXX0=