Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = buildSuggestion;
"use babel";

var scopeSize = function scopeSize(_ref) {
  var b = _ref.block;
  return b.end - b.start;
};

function findClosestScope(scopes, start, end) {
  return scopes.reduce(function (closest, scope) {
    var block = scope.block;

    if (block.start <= start && block.end >= end && scopeSize(scope) < scopeSize(closest)) {
      return scope;
    }

    return closest;
  });
}

function buildSuggestion(info, text, _ref2) {
  var start = _ref2.start;
  var end = _ref2.end;
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  if (info.parseError) throw info.parseError;
  var paths = info.paths;
  var scopes = info.scopes;
  var externalModules = info.externalModules;

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (path.range.start > end) {
      break;
    }
    if (path.range.start <= start && path.range.end >= end) {
      if (path.imported !== "default") {
        return {
          type: "from-import",
          imported: path.imported,
          moduleName: path.moduleName,
          bindingStart: path.range.start,
          bindingEnd: path.range.end
        };
      }

      return {
        type: "path",
        imported: path.imported,
        moduleName: path.moduleName,
        range: path.range
      };
    }
  }

  var closestScope = findClosestScope(scopes, start, end);
  // Sometimes it reports it has a binding, but it can't actually get the
  // binding
  if (closestScope.hasBinding(text) && closestScope.getBinding(text)) {
    var _ret = (function () {
      var binding = closestScope.getBinding(text);
      var _binding$identifier = binding.identifier;
      var bindingStart = _binding$identifier.start;
      var bindingEnd = _binding$identifier.end;

      var clickedDeclaration = bindingStart <= start && bindingEnd >= end;
      var crossFiles = !options.jumpToImport;

      if (clickedDeclaration || crossFiles) {
        var targetModule = externalModules.find(function (m) {
          var bindingStart = binding.identifier.start;

          return m.local == text && m.start == bindingStart;
        });

        if (targetModule) {
          return {
            v: {
              type: "from-import",
              imported: targetModule.imported,
              moduleName: targetModule.moduleName,
              bindingStart: bindingStart,
              bindingEnd: bindingEnd
            }
          };
        }
      }

      // Exit early if you clicked on where the variable is declared
      if (clickedDeclaration) {
        return {
          v: null
        };
      }

      return {
        v: {
          type: "binding",
          start: bindingStart,
          end: bindingEnd
        }
      };
    })();

    if (typeof _ret === "object") return _ret.v;
  }

  return null;
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2NvcmUvYnVpbGQtc3VnZ2VzdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBc0J3QixlQUFlO0FBdEJ2QyxXQUFXLENBQUE7O0FBSVgsSUFBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksSUFBWTtNQUFILENBQUMsR0FBVixJQUFZLENBQVYsS0FBSztTQUFVLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUs7Q0FBQSxDQUFBOztBQUVuRCxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQzVDLFNBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUs7UUFDL0IsS0FBSyxHQUFLLEtBQUssQ0FBZixLQUFLOztBQUViLFFBQ0UsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLElBQ3BCLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUNoQixTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUNyQztBQUNBLGFBQU8sS0FBSyxDQUFBO0tBQ2I7O0FBRUQsV0FBTyxPQUFPLENBQUE7R0FDZixDQUFDLENBQUE7Q0FDSDs7QUFFYyxTQUFTLGVBQWUsQ0FDckMsSUFBVSxFQUNWLElBQVksRUFDWixLQUFxQixFQUVSO01BRlgsS0FBSyxHQUFQLEtBQXFCLENBQW5CLEtBQUs7TUFBRSxHQUFHLEdBQVosS0FBcUIsQ0FBWixHQUFHO01BQ1osT0FBMEIseURBQUcsRUFBRTs7QUFFL0IsTUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQTtNQUNsQyxLQUFLLEdBQThCLElBQUksQ0FBdkMsS0FBSztNQUFFLE1BQU0sR0FBc0IsSUFBSSxDQUFoQyxNQUFNO01BQUUsZUFBZSxHQUFLLElBQUksQ0FBeEIsZUFBZTs7QUFFdEMsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDckMsUUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3JCLFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsR0FBRyxFQUFFO0FBQzFCLFlBQUs7S0FDTjtBQUNELFFBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsRUFBRTtBQUN0RCxVQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO0FBQy9CLGVBQU87QUFDTCxjQUFJLEVBQUUsYUFBYTtBQUNuQixrQkFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQ3ZCLG9CQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7QUFDM0Isc0JBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7QUFDOUIsb0JBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUc7U0FDM0IsQ0FBQTtPQUNGOztBQUVELGFBQU87QUFDTCxZQUFJLEVBQUUsTUFBTTtBQUNaLGdCQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDdkIsa0JBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtBQUMzQixhQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7T0FDbEIsQ0FBQTtLQUNGO0dBQ0Y7O0FBRUQsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTs7O0FBR3pELE1BQUksWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFOztBQUNsRSxVQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO2dDQUNJLE9BQU8sQ0FBQyxVQUFVO1VBQXBELFlBQVksdUJBQW5CLEtBQUs7VUFBcUIsVUFBVSx1QkFBZixHQUFHOztBQUVoQyxVQUFNLGtCQUFrQixHQUFHLFlBQVksSUFBSSxLQUFLLElBQUksVUFBVSxJQUFJLEdBQUcsQ0FBQTtBQUNyRSxVQUFNLFVBQVUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUE7O0FBRXhDLFVBQUksa0JBQWtCLElBQUksVUFBVSxFQUFFO0FBQ3BDLFlBQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLEVBQUk7Y0FDOUIsWUFBWSxHQUFLLE9BQU8sQ0FBQyxVQUFVLENBQTFDLEtBQUs7O0FBQ2IsaUJBQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxZQUFZLENBQUE7U0FDbEQsQ0FBQyxDQUFBOztBQUVGLFlBQUksWUFBWSxFQUFFO0FBQ2hCO2VBQU87QUFDTCxrQkFBSSxFQUFFLGFBQWE7QUFDbkIsc0JBQVEsRUFBRSxZQUFZLENBQUMsUUFBUTtBQUMvQix3QkFBVSxFQUFFLFlBQVksQ0FBQyxVQUFVO0FBQ25DLDBCQUFZLEVBQVosWUFBWTtBQUNaLHdCQUFVLEVBQVYsVUFBVTthQUNYO1lBQUE7U0FDRjtPQUNGOzs7QUFHRCxVQUFJLGtCQUFrQixFQUFFO0FBQ3RCO2FBQU8sSUFBSTtVQUFBO09BQ1o7O0FBRUQ7V0FBTztBQUNMLGNBQUksRUFBRSxTQUFTO0FBQ2YsZUFBSyxFQUFFLFlBQVk7QUFDbkIsYUFBRyxFQUFFLFVBQVU7U0FDaEI7UUFBQTs7OztHQUNGOztBQUVELFNBQU8sSUFBSSxDQUFBO0NBQ1oiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvanMtaHlwZXJjbGljay9saWIvY29yZS9idWlsZC1zdWdnZXN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuLy8gQGZsb3dcbmltcG9ydCB0eXBlIHsgSW5mbywgUmFuZ2UsIFN1Z2dlc3Rpb24sIFN1Z2dlc3Rpb25PcHRpb25zIH0gZnJvbSBcIi4uL3R5cGVzXCJcblxuY29uc3Qgc2NvcGVTaXplID0gKHsgYmxvY2s6IGIgfSkgPT4gYi5lbmQgLSBiLnN0YXJ0XG5cbmZ1bmN0aW9uIGZpbmRDbG9zZXN0U2NvcGUoc2NvcGVzLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBzY29wZXMucmVkdWNlKChjbG9zZXN0LCBzY29wZSkgPT4ge1xuICAgIGNvbnN0IHsgYmxvY2sgfSA9IHNjb3BlXG5cbiAgICBpZiAoXG4gICAgICBibG9jay5zdGFydCA8PSBzdGFydCAmJlxuICAgICAgYmxvY2suZW5kID49IGVuZCAmJlxuICAgICAgc2NvcGVTaXplKHNjb3BlKSA8IHNjb3BlU2l6ZShjbG9zZXN0KVxuICAgICkge1xuICAgICAgcmV0dXJuIHNjb3BlXG4gICAgfVxuXG4gICAgcmV0dXJuIGNsb3Nlc3RcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRTdWdnZXN0aW9uKFxuICBpbmZvOiBJbmZvLFxuICB0ZXh0OiBzdHJpbmcsXG4gIHsgc3RhcnQsIGVuZCB9OiBSYW5nZSxcbiAgb3B0aW9uczogU3VnZ2VzdGlvbk9wdGlvbnMgPSB7fSxcbik6ID9TdWdnZXN0aW9uIHtcbiAgaWYgKGluZm8ucGFyc2VFcnJvcikgdGhyb3cgaW5mby5wYXJzZUVycm9yXG4gIGNvbnN0IHsgcGF0aHMsIHNjb3BlcywgZXh0ZXJuYWxNb2R1bGVzIH0gPSBpbmZvXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRocy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhdGggPSBwYXRoc1tpXVxuICAgIGlmIChwYXRoLnJhbmdlLnN0YXJ0ID4gZW5kKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBpZiAocGF0aC5yYW5nZS5zdGFydCA8PSBzdGFydCAmJiBwYXRoLnJhbmdlLmVuZCA+PSBlbmQpIHtcbiAgICAgIGlmIChwYXRoLmltcG9ydGVkICE9PSBcImRlZmF1bHRcIikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6IFwiZnJvbS1pbXBvcnRcIixcbiAgICAgICAgICBpbXBvcnRlZDogcGF0aC5pbXBvcnRlZCxcbiAgICAgICAgICBtb2R1bGVOYW1lOiBwYXRoLm1vZHVsZU5hbWUsXG4gICAgICAgICAgYmluZGluZ1N0YXJ0OiBwYXRoLnJhbmdlLnN0YXJ0LFxuICAgICAgICAgIGJpbmRpbmdFbmQ6IHBhdGgucmFuZ2UuZW5kLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFwicGF0aFwiLFxuICAgICAgICBpbXBvcnRlZDogcGF0aC5pbXBvcnRlZCxcbiAgICAgICAgbW9kdWxlTmFtZTogcGF0aC5tb2R1bGVOYW1lLFxuICAgICAgICByYW5nZTogcGF0aC5yYW5nZSxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBjbG9zZXN0U2NvcGUgPSBmaW5kQ2xvc2VzdFNjb3BlKHNjb3Blcywgc3RhcnQsIGVuZClcbiAgLy8gU29tZXRpbWVzIGl0IHJlcG9ydHMgaXQgaGFzIGEgYmluZGluZywgYnV0IGl0IGNhbid0IGFjdHVhbGx5IGdldCB0aGVcbiAgLy8gYmluZGluZ1xuICBpZiAoY2xvc2VzdFNjb3BlLmhhc0JpbmRpbmcodGV4dCkgJiYgY2xvc2VzdFNjb3BlLmdldEJpbmRpbmcodGV4dCkpIHtcbiAgICBjb25zdCBiaW5kaW5nID0gY2xvc2VzdFNjb3BlLmdldEJpbmRpbmcodGV4dClcbiAgICBjb25zdCB7IHN0YXJ0OiBiaW5kaW5nU3RhcnQsIGVuZDogYmluZGluZ0VuZCB9ID0gYmluZGluZy5pZGVudGlmaWVyXG5cbiAgICBjb25zdCBjbGlja2VkRGVjbGFyYXRpb24gPSBiaW5kaW5nU3RhcnQgPD0gc3RhcnQgJiYgYmluZGluZ0VuZCA+PSBlbmRcbiAgICBjb25zdCBjcm9zc0ZpbGVzID0gIW9wdGlvbnMuanVtcFRvSW1wb3J0XG5cbiAgICBpZiAoY2xpY2tlZERlY2xhcmF0aW9uIHx8IGNyb3NzRmlsZXMpIHtcbiAgICAgIGNvbnN0IHRhcmdldE1vZHVsZSA9IGV4dGVybmFsTW9kdWxlcy5maW5kKG0gPT4ge1xuICAgICAgICBjb25zdCB7IHN0YXJ0OiBiaW5kaW5nU3RhcnQgfSA9IGJpbmRpbmcuaWRlbnRpZmllclxuICAgICAgICByZXR1cm4gbS5sb2NhbCA9PSB0ZXh0ICYmIG0uc3RhcnQgPT0gYmluZGluZ1N0YXJ0XG4gICAgICB9KVxuXG4gICAgICBpZiAodGFyZ2V0TW9kdWxlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogXCJmcm9tLWltcG9ydFwiLFxuICAgICAgICAgIGltcG9ydGVkOiB0YXJnZXRNb2R1bGUuaW1wb3J0ZWQsXG4gICAgICAgICAgbW9kdWxlTmFtZTogdGFyZ2V0TW9kdWxlLm1vZHVsZU5hbWUsXG4gICAgICAgICAgYmluZGluZ1N0YXJ0LFxuICAgICAgICAgIGJpbmRpbmdFbmQsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeGl0IGVhcmx5IGlmIHlvdSBjbGlja2VkIG9uIHdoZXJlIHRoZSB2YXJpYWJsZSBpcyBkZWNsYXJlZFxuICAgIGlmIChjbGlja2VkRGVjbGFyYXRpb24pIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IFwiYmluZGluZ1wiLFxuICAgICAgc3RhcnQ6IGJpbmRpbmdTdGFydCxcbiAgICAgIGVuZDogYmluZGluZ0VuZCxcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuIl19