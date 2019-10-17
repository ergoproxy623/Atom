Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.provideLinter = provideLinter;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _jsonlint = require('jsonlint');

var jsonlint = _interopRequireWildcard(_jsonlint);

'use babel';

var regex = '.+?line\\s(\\d+)';

function activate() {
  require('atom-package-deps').install('linter-jsonlint');
}

function provideLinter() {
  return {
    name: 'JSON Lint',
    grammarScopes: ['source.json'],
    scope: 'file',
    lintsOnChange: true,
    lint: function lint(editor) {
      var path = editor.getPath();
      var text = editor.getText();

      try {
        jsonlint.parse(text);
      } catch (error) {
        var message = error.message;

        var line = Number(message.match(regex)[1]);
        var column = 0;

        return Promise.resolve([{
          severity: 'error',
          excerpt: message,
          location: {
            file: path,
            position: new _atom.Range([line, column], [line, column + 1])
          }
        }]);
      }

      return Promise.resolve([]);
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc29ubGludC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFHc0IsTUFBTTs7d0JBQ0YsVUFBVTs7SUFBeEIsUUFBUTs7QUFKcEIsV0FBVyxDQUFDOztBQU1aLElBQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDOztBQUUxQixTQUFTLFFBQVEsR0FBRztBQUN6QixTQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztDQUN6RDs7QUFFTSxTQUFTLGFBQWEsR0FBRztBQUM5QixTQUFPO0FBQ0wsUUFBSSxFQUFFLFdBQVc7QUFDakIsaUJBQWEsRUFBRSxDQUFDLGFBQWEsQ0FBQztBQUM5QixTQUFLLEVBQUUsTUFBTTtBQUNiLGlCQUFhLEVBQUUsSUFBSTtBQUNuQixRQUFJLEVBQUUsY0FBQyxNQUFNLEVBQUs7QUFDaEIsVUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlCLFVBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFOUIsVUFBSTtBQUNGLGdCQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3RCLENBQUMsT0FBTyxLQUFLLEVBQUU7WUFDTixPQUFPLEdBQUssS0FBSyxDQUFqQixPQUFPOztBQUNmLFlBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsWUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVqQixlQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QixrQkFBUSxFQUFFLE9BQU87QUFDakIsaUJBQU8sRUFBRSxPQUFPO0FBQ2hCLGtCQUFRLEVBQUU7QUFDUixnQkFBSSxFQUFFLElBQUk7QUFDVixvQkFBUSxFQUFFLGdCQUFVLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztXQUN4RDtTQUNGLENBQUMsQ0FBQyxDQUFDO09BQ0w7O0FBRUQsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzVCO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1qc29ubGludC9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnNcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgKiBhcyBqc29ubGludCBmcm9tICdqc29ubGludCc7XG5cbmNvbnN0IHJlZ2V4ID0gJy4rP2xpbmVcXFxccyhcXFxcZCspJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1qc29ubGludCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUxpbnRlcigpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnSlNPTiBMaW50JyxcbiAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qc29uJ10sXG4gICAgc2NvcGU6ICdmaWxlJyxcbiAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgIGxpbnQ6IChlZGl0b3IpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgY29uc3QgdGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGpzb25saW50LnBhcnNlKHRleHQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlIH0gPSBlcnJvcjtcbiAgICAgICAgY29uc3QgbGluZSA9IE51bWJlcihtZXNzYWdlLm1hdGNoKHJlZ2V4KVsxXSk7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IDA7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbe1xuICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgIGV4Y2VycHQ6IG1lc3NhZ2UsXG4gICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGZpbGU6IHBhdGgsXG4gICAgICAgICAgICBwb3NpdGlvbjogbmV3IFJhbmdlKFtsaW5lLCBjb2x1bW5dLCBbbGluZSwgY29sdW1uICsgMV0pXG4gICAgICAgICAgfVxuICAgICAgICB9XSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==