Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _report = require('./report');

var _report2 = _interopRequireDefault(_report);

// Dependencies
'use babel';var dirname = undefined;
var htmllint = undefined;
var findAsync = undefined;
var fsReadFile = undefined;
var generateRange = undefined;
var tinyPromisify = undefined;
var stripJSONComments = undefined;

// Configuration
var disableWhenNoHtmllintConfig = undefined;

// Internal variables
var phpEmbeddedScope = 'text.html.php';

// Internal functions
var getConfig = _asyncToGenerator(function* (filePath) {
  var readFile = tinyPromisify(fsReadFile);
  var configPath = yield findAsync(dirname(filePath), '.htmllintrc');
  var conf = null;
  if (configPath !== null) {
    conf = yield readFile(configPath, 'utf8');
  }
  if (conf) {
    return JSON.parse(stripJSONComments(conf));
  }
  return null;
});

var phpScopedEditor = function phpScopedEditor(editor) {
  return editor.getCursors().some(function (cursor) {
    return cursor.getScopeDescriptor().getScopesArray().some(function (scope) {
      return scope === phpEmbeddedScope;
    });
  });
};

var removePHP = function removePHP(str) {
  return str.replace(/<\?(?:php|=)?(?:[\s\S])+?\?>/gi, function (match) {
    var newlines = match.match(/\r?\n|\r/g);
    var newlineCount = newlines ? newlines.length : 0;

    return '\n'.repeat(newlineCount);
  });
};

var loadDeps = function loadDeps() {
  if (loadDeps.loaded) {
    return;
  }
  if (!dirname) {
    var _require = require('path');

    dirname = _require.dirname;
  }
  if (!htmllint) {
    htmllint = require('htmllint');
  }
  if (!findAsync || !generateRange) {
    var _require2 = require('atom-linter');

    findAsync = _require2.findAsync;
    generateRange = _require2.generateRange;
  }
  if (!fsReadFile) {
    var _require3 = require('fs');

    fsReadFile = _require3.readFile;
  }
  if (!tinyPromisify) {
    tinyPromisify = require('tiny-promisify');
  }
  if (!stripJSONComments) {
    stripJSONComments = require('strip-json-comments');
  }
  loadDeps.loaded = true;
};

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterHtmllintDeps = function installLinterHtmllintDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-htmllint');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterHtmllintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.grammarScopes = [];

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-htmllint.enabledScopes', function (scopes) {
      // Remove any old scopes
      _this.grammarScopes.splice(0, _this.grammarScopes.length);
      // Add the current scopes
      Array.prototype.push.apply(_this.grammarScopes, scopes);
    }));
    this.subscriptions.add(atom.config.observe('linter-htmllint.disableWhenNoHtmllintConfig', function (value) {
      disableWhenNoHtmllintConfig = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    return {
      name: 'htmllint',
      grammarScopes: this.grammarScopes,
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (editor) {
        if (!atom.workspace.isTextEditor(editor)) {
          return null;
        }

        var filePath = editor.getPath();
        if (!filePath) {
          // Invalid path
          return null;
        }

        var isPhPEditor = phpScopedEditor(editor);

        var fileText = editor.getText();
        var text = isPhPEditor ? removePHP(fileText) : fileText;
        if (!text) {
          return [];
        }

        // Ensure that all dependencies are loaded
        loadDeps();

        var ruleset = yield getConfig(filePath);
        if (!ruleset && disableWhenNoHtmllintConfig) {
          return null;
        }

        var issues = yield htmllint(text, ruleset || undefined);

        if (editor.getText() !== fileText) {
          // Editor contents have changed, tell Linter not to update
          return null;
        }

        return issues.map(function (issue) {
          try {
            return {
              severity: 'error',
              excerpt: htmllint.messages.renderIssue(issue),
              location: {
                file: filePath,
                position: generateRange(editor, issue.line - 1, issue.column - 1)
              }
            };
          } catch (error) {
            (0, _report2['default'])(issue, error);
            return null;
          }
        });
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1odG1sbGludC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFHb0MsTUFBTTs7c0JBQ3ZCLFVBQVU7Ozs7O0FBSjdCLFdBQVcsQ0FBQyxBQU9aLElBQUksT0FBTyxZQUFBLENBQUM7QUFDWixJQUFJLFFBQVEsWUFBQSxDQUFDO0FBQ2IsSUFBSSxTQUFTLFlBQUEsQ0FBQztBQUNkLElBQUksVUFBVSxZQUFBLENBQUM7QUFDZixJQUFJLGFBQWEsWUFBQSxDQUFDO0FBQ2xCLElBQUksYUFBYSxZQUFBLENBQUM7QUFDbEIsSUFBSSxpQkFBaUIsWUFBQSxDQUFDOzs7QUFHdEIsSUFBSSwyQkFBMkIsWUFBQSxDQUFDOzs7QUFHaEMsSUFBTSxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7OztBQUd6QyxJQUFNLFNBQVMscUJBQUcsV0FBTyxRQUFRLEVBQUs7QUFDcEMsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNyRSxNQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsTUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO0FBQ3ZCLFFBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7R0FDM0M7QUFDRCxNQUFJLElBQUksRUFBRTtBQUNSLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzVDO0FBQ0QsU0FBTyxJQUFJLENBQUM7Q0FDYixDQUFBLENBQUM7O0FBRUYsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFHLE1BQU07U0FDNUIsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFB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U0FDWDs7O0FBR0QsZ0JBQVEsRUFBRSxDQUFDOztBQUVYLFlBQU0sT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxPQUFPLElBQUksMkJBQTJCLEVBQUU7QUFDM0MsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsWUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sSUFBSSxTQUFTLENBQUMsQ0FBQzs7QUFFMUQsWUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssUUFBUSxFQUFFOztBQUVqQyxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxlQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0IsY0FBSTtBQUNGLG1CQUFPO0FBQ0wsc0JBQVEsRUFBRSxPQUFPO0FBQ2pCLHFCQUFPLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO0FBQzdDLHNCQUFRLEVBQUU7QUFDUixvQkFBSSxFQUFFLFFBQVE7QUFDZCx3QkFBUSxFQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7ZUFDbEU7YUFDRixDQUFDO1dBQ0gsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLHFDQUFPLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNyQixtQkFBTyxJQUFJLENBQUM7V0FDYjtTQUNGLENBQUMsQ0FBQztPQUNKLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItaHRtbGxpbnQvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgcmVwb3J0IGZyb20gJy4vcmVwb3J0JztcblxuLy8gRGVwZW5kZW5jaWVzXG5sZXQgZGlybmFtZTtcbmxldCBodG1sbGludDtcbmxldCBmaW5kQXN5bmM7XG5sZXQgZnNSZWFkRmlsZTtcbmxldCBnZW5lcmF0ZVJhbmdlO1xubGV0IHRpbnlQcm9taXNpZnk7XG5sZXQgc3RyaXBKU09OQ29tbWVudHM7XG5cbi8vIENvbmZpZ3VyYXRpb25cbmxldCBkaXNhYmxlV2hlbk5vSHRtbGxpbnRDb25maWc7XG5cbi8vIEludGVybmFsIHZhcmlhYmxlc1xuY29uc3QgcGhwRW1iZWRkZWRTY29wZSA9ICd0ZXh0Lmh0bWwucGhwJztcblxuLy8gSW50ZXJuYWwgZnVuY3Rpb25zXG5jb25zdCBnZXRDb25maWcgPSBhc3luYyAoZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgcmVhZEZpbGUgPSB0aW55UHJvbWlzaWZ5KGZzUmVhZEZpbGUpO1xuICBjb25zdCBjb25maWdQYXRoID0gYXdhaXQgZmluZEFzeW5jKGRpcm5hbWUoZmlsZVBhdGgpLCAnLmh0bWxsaW50cmMnKTtcbiAgbGV0IGNvbmYgPSBudWxsO1xuICBpZiAoY29uZmlnUGF0aCAhPT0gbnVsbCkge1xuICAgIGNvbmYgPSBhd2FpdCByZWFkRmlsZShjb25maWdQYXRoLCAndXRmOCcpO1xuICB9XG4gIGlmIChjb25mKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uoc3RyaXBKU09OQ29tbWVudHMoY29uZikpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxuY29uc3QgcGhwU2NvcGVkRWRpdG9yID0gZWRpdG9yID0+IChcbiAgZWRpdG9yLmdldEN1cnNvcnMoKS5zb21lKGN1cnNvciA9PiAoXG4gICAgY3Vyc29yLmdldFNjb3BlRGVzY3JpcHRvcigpLmdldFNjb3Blc0FycmF5KCkuc29tZShzY29wZSA9PiAoXG4gICAgICBzY29wZSA9PT0gcGhwRW1iZWRkZWRTY29wZVxuICAgICkpXG4gICkpXG4pO1xuXG5jb25zdCByZW1vdmVQSFAgPSBzdHIgPT4gc3RyLnJlcGxhY2UoLzxcXD8oPzpwaHB8PSk/KD86W1xcc1xcU10pKz9cXD8+L2dpLCAobWF0Y2gpID0+IHtcbiAgY29uc3QgbmV3bGluZXMgPSBtYXRjaC5tYXRjaCgvXFxyP1xcbnxcXHIvZyk7XG4gIGNvbnN0IG5ld2xpbmVDb3VudCA9IG5ld2xpbmVzID8gbmV3bGluZXMubGVuZ3RoIDogMDtcblxuICByZXR1cm4gJ1xcbicucmVwZWF0KG5ld2xpbmVDb3VudCk7XG59KTtcblxuY29uc3QgbG9hZERlcHMgPSAoKSA9PiB7XG4gIGlmIChsb2FkRGVwcy5sb2FkZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFkaXJuYW1lKSB7XG4gICAgKHsgZGlybmFtZSB9ID0gcmVxdWlyZSgncGF0aCcpKTtcbiAgfVxuICBpZiAoIWh0bWxsaW50KSB7XG4gICAgaHRtbGxpbnQgPSByZXF1aXJlKCdodG1sbGludCcpO1xuICB9XG4gIGlmICghZmluZEFzeW5jIHx8ICFnZW5lcmF0ZVJhbmdlKSB7XG4gICAgKHsgZmluZEFzeW5jLCBnZW5lcmF0ZVJhbmdlIH0gPSByZXF1aXJlKCdhdG9tLWxpbnRlcicpKTtcbiAgfVxuICBpZiAoIWZzUmVhZEZpbGUpIHtcbiAgICAoeyByZWFkRmlsZTogZnNSZWFkRmlsZSB9ID0gcmVxdWlyZSgnZnMnKSk7XG4gIH1cbiAgaWYgKCF0aW55UHJvbWlzaWZ5KSB7XG4gICAgdGlueVByb21pc2lmeSA9IHJlcXVpcmUoJ3RpbnktcHJvbWlzaWZ5Jyk7XG4gIH1cbiAgaWYgKCFzdHJpcEpTT05Db21tZW50cykge1xuICAgIHN0cmlwSlNPTkNvbW1lbnRzID0gcmVxdWlyZSgnc3RyaXAtanNvbi1jb21tZW50cycpO1xuICB9XG4gIGxvYWREZXBzLmxvYWRlZCA9IHRydWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbiAgICBsZXQgZGVwc0NhbGxiYWNrSUQ7XG4gICAgY29uc3QgaW5zdGFsbExpbnRlckh0bWxsaW50RGVwcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUoZGVwc0NhbGxiYWNrSUQpO1xuICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1odG1sbGludCcpO1xuICAgICAgfVxuICAgICAgbG9hZERlcHMoKTtcbiAgICB9O1xuICAgIGRlcHNDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soaW5zdGFsbExpbnRlckh0bWxsaW50RGVwcyk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChkZXBzQ2FsbGJhY2tJRCk7XG5cbiAgICB0aGlzLmdyYW1tYXJTY29wZXMgPSBbXTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItaHRtbGxpbnQuZW5hYmxlZFNjb3BlcycsIChzY29wZXMpID0+IHtcbiAgICAgIC8vIFJlbW92ZSBhbnkgb2xkIHNjb3Blc1xuICAgICAgdGhpcy5ncmFtbWFyU2NvcGVzLnNwbGljZSgwLCB0aGlzLmdyYW1tYXJTY29wZXMubGVuZ3RoKTtcbiAgICAgIC8vIEFkZCB0aGUgY3VycmVudCBzY29wZXNcbiAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHRoaXMuZ3JhbW1hclNjb3Blcywgc2NvcGVzKTtcbiAgICB9KSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItaHRtbGxpbnQuZGlzYWJsZVdoZW5Ob0h0bWxsaW50Q29uZmlnJywgKHZhbHVlKSA9PiB7XG4gICAgICBkaXNhYmxlV2hlbk5vSHRtbGxpbnRDb25maWcgPSB2YWx1ZTtcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpO1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5jbGVhcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ2h0bWxsaW50JyxcbiAgICAgIGdyYW1tYXJTY29wZXM6IHRoaXMuZ3JhbW1hclNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKGVkaXRvcikgPT4ge1xuICAgICAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgICAgICAvLyBJbnZhbGlkIHBhdGhcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzUGhQRWRpdG9yID0gcGhwU2NvcGVkRWRpdG9yKGVkaXRvcik7XG5cbiAgICAgICAgY29uc3QgZmlsZVRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCB0ZXh0ID0gaXNQaFBFZGl0b3IgPyByZW1vdmVQSFAoZmlsZVRleHQpIDogZmlsZVRleHQ7XG4gICAgICAgIGlmICghdGV4dCkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IGFsbCBkZXBlbmRlbmNpZXMgYXJlIGxvYWRlZFxuICAgICAgICBsb2FkRGVwcygpO1xuXG4gICAgICAgIGNvbnN0IHJ1bGVzZXQgPSBhd2FpdCBnZXRDb25maWcoZmlsZVBhdGgpO1xuICAgICAgICBpZiAoIXJ1bGVzZXQgJiYgZGlzYWJsZVdoZW5Ob0h0bWxsaW50Q29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc3N1ZXMgPSBhd2FpdCBodG1sbGludCh0ZXh0LCBydWxlc2V0IHx8IHVuZGVmaW5lZCk7XG5cbiAgICAgICAgaWYgKGVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gRWRpdG9yIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzc3Vlcy5tYXAoKGlzc3VlKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICAgICAgICBleGNlcnB0OiBodG1sbGludC5tZXNzYWdlcy5yZW5kZXJJc3N1ZShpc3N1ZSksXG4gICAgICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGdlbmVyYXRlUmFuZ2UoZWRpdG9yLCBpc3N1ZS5saW5lIC0gMSwgaXNzdWUuY29sdW1uIC0gMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmVwb3J0KGlzc3VlLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=