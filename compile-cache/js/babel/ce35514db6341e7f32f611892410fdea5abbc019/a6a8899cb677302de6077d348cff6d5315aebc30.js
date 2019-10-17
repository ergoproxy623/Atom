'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');

var Configs = require('./package-configs').retrieval;
var LookupApi = require('./lookups');

var GetModuleFromPrefix = require('./utils/get-module-from-prefix');
var ModuleLookups = require('./lookups/module');

var GetExportFromPrefix = require('./utils/get-exports-from-prefix');
var ExportLookups = require('./lookups/export');

var _require = require('./utils/regex-patterns');

var LINE_REGEXP = _require.regexModuleExistOnLine;

var FilterLookupsByText = require('./utils/filter-lookups-by-text');

var SELECTOR = ['.source.js', 'javascript', '.source.coffee', '.source.flow'];
var SELECTOR_DISABLE = ['.source.js .comment', 'javascript comment', '.source.js .keyword', 'javascript keyword'];

var CompletionProvider = (function () {
  function CompletionProvider() {
    _classCallCheck(this, CompletionProvider);

    this.selector = SELECTOR.join(', ');
    this.disableForSelector = SELECTOR_DISABLE.join(', ');
    this.inclusionPriority = 1;
    this.suggestionPriority = 3;
  }

  _createClass(CompletionProvider, [{
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var prefix = _ref.prefix;

      var line = editor.buffer.lineForRow(bufferPosition.row);
      if (!LINE_REGEXP.test(line)) {
        return [];
      }

      var activeTextEditor = atom.workspace.getActiveTextEditor();

      var prefixLine = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);

      var lookupApi = undefined;

      var prefixModule = GetModuleFromPrefix(prefix, prefixLine);
      if (prefixModule !== false) {
        lookupApi = new LookupApi(activeTextEditor.getPath(), ModuleLookups, Configs, FilterLookupsByText);

        var promises = lookupApi.filterList(prefixModule, prefixModule, prefixModule);

        return Promise.all(promises).reduce(function (acc, suggestions) {
          return [].concat(_toConsumableArray(acc), _toConsumableArray(suggestions));
        }, []);
      }

      var prefixExport = GetExportFromPrefix(prefix, prefixLine);
      if (prefixExport !== false) {
        lookupApi = new LookupApi(activeTextEditor.getPath(), ExportLookups, Configs, FilterLookupsByText);

        var importModule = GetModuleFromPrefix('', line);
        var promises = lookupApi.filterList(importModule, importModule, prefixExport);

        return Promise.all(promises).reduce(function (acc, suggestions) {
          return [].concat(_toConsumableArray(acc), _toConsumableArray(suggestions));
        }, []);
      }

      return [];
    }
  }]);

  return CompletionProvider;
})();

module.exports = CompletionProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1tb2R1bGVzL2xpYi9jb21wbGV0aW9uLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7QUFFWixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXBDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUN2RCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRXZDLElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDdEUsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRWxELElBQU0sbUJBQW1CLEdBQUcsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdkUsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O2VBRUYsT0FBTyxDQUFDLHdCQUF3QixDQUFDOztJQUFqRCxXQUFXLFlBQW5DLHNCQUFzQjs7QUFDOUIsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7QUFFdEUsSUFBTSxRQUFRLEdBQUcsQ0FDZixZQUFZLEVBQ1osWUFBWSxFQUNaLGdCQUFnQixFQUNoQixjQUFjLENBQ2YsQ0FBQztBQUNGLElBQU0sZ0JBQWdCLEdBQUcsQ0FDdkIscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUNwQixxQkFBcUIsRUFDckIsb0JBQW9CLENBQ3JCLENBQUM7O0lBRUksa0JBQWtCO0FBQ1gsV0FEUCxrQkFBa0IsR0FDUjswQkFEVixrQkFBa0I7O0FBRXBCLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUM7QUFDM0IsUUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQztHQUM3Qjs7ZUFORyxrQkFBa0I7O1dBUVIsd0JBQUMsSUFBZ0MsRUFBRTtVQUFqQyxNQUFNLEdBQVAsSUFBZ0MsQ0FBL0IsTUFBTTtVQUFFLGNBQWMsR0FBdkIsSUFBZ0MsQ0FBdkIsY0FBYztVQUFFLE1BQU0sR0FBL0IsSUFBZ0MsQ0FBUCxNQUFNOztBQUM1QyxVQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDM0IsZUFBTyxFQUFFLENBQUM7T0FDWDs7QUFFRCxVQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFOUQsVUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDOztBQUVwRixVQUFJLFNBQVMsWUFBQSxDQUFDOztBQUVkLFVBQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM3RCxVQUFJLFlBQVksS0FBSyxLQUFLLEVBQUU7QUFDMUIsaUJBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUM7O0FBRW5HLFlBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQzs7QUFFaEYsZUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUMzQixNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsV0FBVzs4Q0FBUyxHQUFHLHNCQUFLLFdBQVc7U0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQzdEOztBQUVELFVBQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM3RCxVQUFJLFlBQVksS0FBSyxLQUFLLEVBQUU7QUFDMUIsaUJBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUM7O0FBRW5HLFlBQU0sWUFBWSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRCxZQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7O0FBRWhGLGVBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FDM0IsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLFdBQVc7OENBQVMsR0FBRyxzQkFBSyxXQUFXO1NBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztPQUM3RDs7QUFFRCxhQUFPLEVBQUUsQ0FBQztLQUNYOzs7U0ExQ0csa0JBQWtCOzs7QUE2Q3hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLW1vZHVsZXMvbGliL2NvbXBsZXRpb24tcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5cbmNvbnN0IENvbmZpZ3MgPSByZXF1aXJlKCcuL3BhY2thZ2UtY29uZmlncycpLnJldHJpZXZhbDtcbmNvbnN0IExvb2t1cEFwaSA9IHJlcXVpcmUoJy4vbG9va3VwcycpO1xuXG5jb25zdCBHZXRNb2R1bGVGcm9tUHJlZml4ID0gcmVxdWlyZSgnLi91dGlscy9nZXQtbW9kdWxlLWZyb20tcHJlZml4Jyk7XG5jb25zdCBNb2R1bGVMb29rdXBzID0gcmVxdWlyZSgnLi9sb29rdXBzL21vZHVsZScpO1xuXG5jb25zdCBHZXRFeHBvcnRGcm9tUHJlZml4ID0gcmVxdWlyZSgnLi91dGlscy9nZXQtZXhwb3J0cy1mcm9tLXByZWZpeCcpO1xuY29uc3QgRXhwb3J0TG9va3VwcyA9IHJlcXVpcmUoJy4vbG9va3Vwcy9leHBvcnQnKTtcblxuY29uc3QgeyByZWdleE1vZHVsZUV4aXN0T25MaW5lOiBMSU5FX1JFR0VYUCB9ID0gcmVxdWlyZSgnLi91dGlscy9yZWdleC1wYXR0ZXJucycpO1xuY29uc3QgRmlsdGVyTG9va3Vwc0J5VGV4dCA9IHJlcXVpcmUoJy4vdXRpbHMvZmlsdGVyLWxvb2t1cHMtYnktdGV4dCcpO1xuXG5jb25zdCBTRUxFQ1RPUiA9IFtcbiAgJy5zb3VyY2UuanMnLFxuICAnamF2YXNjcmlwdCcsXG4gICcuc291cmNlLmNvZmZlZScsXG4gICcuc291cmNlLmZsb3cnXG5dO1xuY29uc3QgU0VMRUNUT1JfRElTQUJMRSA9IFtcbiAgJy5zb3VyY2UuanMgLmNvbW1lbnQnLFxuICAnamF2YXNjcmlwdCBjb21tZW50JyxcbiAgJy5zb3VyY2UuanMgLmtleXdvcmQnLFxuICAnamF2YXNjcmlwdCBrZXl3b3JkJ1xuXTtcblxuY2xhc3MgQ29tcGxldGlvblByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IFNFTEVDVE9SLmpvaW4oJywgJyk7XG4gICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSBTRUxFQ1RPUl9ESVNBQkxFLmpvaW4oJywgJyk7XG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDE7XG4gICAgdGhpcy5zdWdnZXN0aW9uUHJpb3JpdHkgPSAzO1xuICB9XG5cbiAgZ2V0U3VnZ2VzdGlvbnMoe2VkaXRvciwgYnVmZmVyUG9zaXRpb24sIHByZWZpeH0pIHtcbiAgICBjb25zdCBsaW5lID0gZWRpdG9yLmJ1ZmZlci5saW5lRm9yUm93KGJ1ZmZlclBvc2l0aW9uLnJvdyk7XG4gICAgaWYgKCFMSU5FX1JFR0VYUC50ZXN0KGxpbmUpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgIGNvbnN0IHByZWZpeExpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuXG4gICAgbGV0IGxvb2t1cEFwaTtcblxuICAgIGNvbnN0IHByZWZpeE1vZHVsZSA9IEdldE1vZHVsZUZyb21QcmVmaXgocHJlZml4LCBwcmVmaXhMaW5lKTtcbiAgICBpZiAocHJlZml4TW9kdWxlICE9PSBmYWxzZSkge1xuICAgICAgbG9va3VwQXBpID0gbmV3IExvb2t1cEFwaShhY3RpdmVUZXh0RWRpdG9yLmdldFBhdGgoKSwgTW9kdWxlTG9va3VwcywgQ29uZmlncywgRmlsdGVyTG9va3Vwc0J5VGV4dCk7XG5cbiAgICAgIGNvbnN0IHByb21pc2VzID0gbG9va3VwQXBpLmZpbHRlckxpc3QocHJlZml4TW9kdWxlLCBwcmVmaXhNb2R1bGUsIHByZWZpeE1vZHVsZSk7XG5cbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgIC5yZWR1Y2UoKGFjYywgc3VnZ2VzdGlvbnMpID0+IFsuLi5hY2MsIC4uLnN1Z2dlc3Rpb25zXSwgW10pO1xuICAgIH1cblxuICAgIGNvbnN0IHByZWZpeEV4cG9ydCA9IEdldEV4cG9ydEZyb21QcmVmaXgocHJlZml4LCBwcmVmaXhMaW5lKTtcbiAgICBpZiAocHJlZml4RXhwb3J0ICE9PSBmYWxzZSkge1xuICAgICAgbG9va3VwQXBpID0gbmV3IExvb2t1cEFwaShhY3RpdmVUZXh0RWRpdG9yLmdldFBhdGgoKSwgRXhwb3J0TG9va3VwcywgQ29uZmlncywgRmlsdGVyTG9va3Vwc0J5VGV4dCk7XG5cbiAgICAgIGNvbnN0IGltcG9ydE1vZHVsZSA9IEdldE1vZHVsZUZyb21QcmVmaXgoJycsIGxpbmUpO1xuICAgICAgY29uc3QgcHJvbWlzZXMgPSBsb29rdXBBcGkuZmlsdGVyTGlzdChpbXBvcnRNb2R1bGUsIGltcG9ydE1vZHVsZSwgcHJlZml4RXhwb3J0KTtcblxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgICAgLnJlZHVjZSgoYWNjLCBzdWdnZXN0aW9ucykgPT4gWy4uLmFjYywgLi4uc3VnZ2VzdGlvbnNdLCBbXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGxldGlvblByb3ZpZGVyO1xuIl19