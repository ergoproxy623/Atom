function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*global atom */

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _atom = require("atom");

var _shell = require("shell");

var _shell2 = _interopRequireDefault(_shell);

var _makeCache = require("./make-cache");

var _makeCache2 = _interopRequireDefault(_makeCache);

var _core = require("./core");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _requireIfTrusted = require("./require-if-trusted");

var _requireIfTrusted2 = _interopRequireDefault(_requireIfTrusted);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick");

var scopes = ["source.js", "source.js.jsx", "javascript", "source.flow"];
var isJavascript = function isJavascript(textEditor) {
  var _textEditor$getGrammar = textEditor.getGrammar();

  var scopeName = _textEditor$getGrammar.scopeName;

  if (scopes.indexOf(scopeName) >= 0) {
    return true;
  }
  debug("Not Javascript", scopeName);
  return false;
};

function makeProvider(subscriptions) {
  var cache = (0, _makeCache2["default"])(subscriptions);
  var automaticJumpCounter = 0;

  var automaticJump = function automaticJump(textEditor, _ref) {
    var start = _ref.start;
    var end = _ref.end;

    if (!atom.config.get("js-hyperclick.skipIntermediate")) {
      return;
    }

    if (automaticJumpCounter++ > 10) {
      var detail = "Unable to find origin: too many jumps";
      atom.notifications.addWarning("js-hyperclick", { detail: detail });
      return;
    }

    var buffer = textEditor.getBuffer();
    var nextInfo = cache.get(textEditor);
    var range = new _atom.Range(
    // I know this works, but flow claims the type is wrong - $FlowFixMe
    buffer.positionForCharacterIndex(start).toArray(), buffer.positionForCharacterIndex(end).toArray());
    var text = buffer.getTextInRange(range);

    var options = {
      jumpToImport: atom.config.get("js-hyperclick.jumpToImport")
    };

    var nextSuggestion = (0, _core.buildSuggestion)(nextInfo, text, { start: start, end: end }, options);

    var result = undefined;
    if (nextSuggestion) {
      if (options.jumpToImport && nextSuggestion.type === "from-import") {
        return;
      }

      result = buildResult(textEditor, range, nextSuggestion, true);
    }
    if (result) {
      result.callback();
    }
  };

  var navigateToSuggestion = function navigateToSuggestion(textEditor, suggestion) {
    var info = cache.get(textEditor);
    var target = (0, _core.findDestination)(info, suggestion);

    if (target) {
      var buffer = textEditor.getBuffer();
      var position = buffer.positionForCharacterIndex(target.start);
      textEditor.setCursorBufferPosition(position);
      textEditor.scrollToCursorPosition();

      automaticJump(textEditor, target);
    }
  };

  var followSuggestionPath = function followSuggestionPath(fromFile, suggestion) {
    var blockNotFoundWarning = false;
    var requireIfTrusted = (0, _requireIfTrusted2["default"])(function (isTrusted) {
      if (isTrusted) {
        followSuggestionPath(fromFile, suggestion);
      }

      blockNotFoundWarning = true;
      return function () {
        return undefined;
      };
    });
    var resolveOptions = {
      extensions: atom.config.get("js-hyperclick.extensions"),
      requireIfTrusted: requireIfTrusted
    };
    debug("resolveOptions", resolveOptions);
    var resolved = (0, _core.resolveModule)(fromFile, suggestion, resolveOptions);

    if (blockNotFoundWarning) {
      // Do nothing
    } else if (resolved.type === "url") {
        if (atom.packages.isPackageLoaded("web-browser")) {
          atom.workspace.open(resolved.url);
        } else {
          // flow insisted resolved.url may be undefined here, so I had to
          // switch to a local variable.
          _shell2["default"].openExternal(resolved.url);
        }
      } else if (resolved.type === "file") {
        var filename = resolved.filename;

        if (filename == null) {
          var detail = "module " + suggestion.moduleName + " was not found";
          atom.notifications.addWarning("js-hyperclick", { detail: detail });
          return;
        }

        if (_fs2["default"].existsSync(filename)) {
          filename = _fs2["default"].realpathSync(filename);
        }
        var options = {
          pending: atom.config.get("js-hyperclick.usePendingPanes")
        };
        atom.workspace.open(filename, options).then(function (editor) {
          navigateToSuggestion(editor, suggestion);
        });
      } else {
        // Verify all types have been handled
        ;resolved.type;
      }
  };

  function buildResult(textEditor, range, suggestion) {
    var isAutomaticJump = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

    if (!isJavascript(textEditor)) {
      return;
    }
    if (suggestion.range) {
      var buffer = textEditor.getBuffer();

      range = new _atom.Range(
      // I know this works, but flow claims the type s wrong - $FlowFixMe
      buffer.positionForCharacterIndex(suggestion.range.start).toArray(), buffer.positionForCharacterIndex(suggestion.range.end).toArray());
    }

    return {
      range: range,
      callback: function callback() {
        if (!isAutomaticJump) {
          automaticJumpCounter = 0;
        }

        if (suggestion.type === "binding") {
          navigateToSuggestion(textEditor, suggestion);
        } else {
          followSuggestionPath(textEditor.getPath(), suggestion);
        }
      }
    };
  }

  return {
    providerName: "js-hyperclick",
    wordRegExp: /[$0-9\w]+/g,
    priority: atom.config.get("js-hyperclick.priority"),
    getSuggestionForWord: function getSuggestionForWord(textEditor, text, range) {
      if (isJavascript(textEditor)) {
        var info = cache.get(textEditor);
        if (info.parseError) return;

        var buffer = textEditor.getBuffer();
        var start = buffer.characterIndexForPosition(range.start);
        var end = buffer.characterIndexForPosition(range.end);

        var options = {
          jumpToImport: atom.config.get("js-hyperclick.jumpToImport")
        };
        var suggestion = (0, _core.buildSuggestion)(info, text, { start: start, end: end }, options);
        debug(text, suggestion);
        if (suggestion) {
          return buildResult(textEditor, range, suggestion, false);
        }
      }
    }
  };
}

function migrateTrustedResolvers() {
  var key = "js-hyperclick.trustedResolvers";
  var trustedResolvers = atom.config.get(key);
  if (trustedResolvers != null) {
    atom.config.set("js-hyperclick.trustedFiles", trustedResolvers);
    atom.config.set(key, undefined);
  }
}

module.exports = {
  config: {
    extensions: {
      description: "Comma separated list of extensions to check for when a file isn't found",
      type: "array",
      // Default comes from Node's `require.extensions`
      "default": [".js", ".json", ".node"],
      items: { type: "string" }
    },
    usePendingPanes: {
      type: "boolean",
      "default": false
    },
    jumpToImport: {
      type: "boolean",
      "default": false,
      description: "\n        Jump to the import statement instead of leaving the current file.\n        You can still click the import to switch files.\n        ".trim() },
    // if the description starts with whitespace it doesn't display
    skipIntermediate: {
      type: "boolean",
      "default": true,
      title: "Jump through intermediate links",
      description: "\n        When you land at your destination, js-hyperclick checks to see if\n        that is a link and then follows it. This is mostly useful to skip\n        over files that `export ... from './otherfile'`. You will land in\n        `./otherfile` instead of at that export.\n        ".trim()
    },
    priority: {
      type: "number",
      "default": 0,
      title: "hyperclick priority",
      description: "\n        Hyperclick only returns suggestions from a single provider, so this is a\n        workaround for providers to override others. priority defaults to 0.\n        https://atom.io/packages/hyperclick\n        ".trim()
    }
  },
  // This doesn't show up in the settings. Use Edit > Config if you need to
  // change this.
  // trustedFiles: {
  //   type: "array",
  //   items: {
  //     type: "object",
  //     properties: {
  //       hash: { type: "string" },
  //       trusted: { type: "boolean" },
  //     },
  //   },
  //   default: [],
  // },
  activate: function activate() {
    // hyperclick is bundled into nuclide
    if (!atom.packages.isPackageLoaded("hyperclick")) {
      require("atom-package-deps").install("js-hyperclick");
    }
    migrateTrustedResolvers();
    debug("activate");
    this.subscriptions = new _atom.CompositeDisposable();
  },
  getProvider: function getProvider() {
    return makeProvider(this.subscriptions);
  },
  deactivate: function deactivate() {
    debug("deactivate");
    this.subscriptions.dispose();
  }
};

global.jsHyperclick = module.exports;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2pzLWh5cGVyY2xpY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFLd0IsT0FBTzs7OztvQkFFSyxNQUFNOztxQkFFeEIsT0FBTzs7Ozt5QkFDSCxjQUFjOzs7O29CQUM0QixRQUFROztrQkFDekQsSUFBSTs7OztnQ0FDSyxzQkFBc0I7Ozs7QUFiOUMsV0FBVyxDQUFBOztBQWdCWCxJQUFNLEtBQUssR0FBRyx3QkFBWSxlQUFlLENBQUMsQ0FBQTs7QUFFMUMsSUFBTSxNQUFNLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUMxRSxJQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxVQUFVLEVBQWlCOytCQUN6QixVQUFVLENBQUMsVUFBVSxFQUFFOztNQUFyQyxTQUFTLDBCQUFULFNBQVM7O0FBRWpCLE1BQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbEMsV0FBTyxJQUFJLENBQUE7R0FDWjtBQUNELE9BQUssQ0FBQyxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUNsQyxTQUFPLEtBQUssQ0FBQTtDQUNiLENBQUE7O0FBRUQsU0FBUyxZQUFZLENBQUMsYUFBYSxFQUFFO0FBQ25DLE1BQU0sS0FBSyxHQUFHLDRCQUFVLGFBQWEsQ0FBQyxDQUFBO0FBQ3RDLE1BQUksb0JBQW9CLEdBQUcsQ0FBQyxDQUFBOztBQUU1QixNQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUksVUFBVSxFQUFFLElBQWMsRUFBWTtRQUF4QixLQUFLLEdBQVAsSUFBYyxDQUFaLEtBQUs7UUFBRSxHQUFHLEdBQVosSUFBYyxDQUFMLEdBQUc7O0FBQzdDLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFFO0FBQ3RELGFBQU07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QUE7R0FDL0M7QUFDRCxhQUFXLEVBQUEsdUJBQUc7QUFDWixXQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7R0FDeEM7QUFDRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxTQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDbkIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUM3QjtDQUNGLENBQUE7O0FBRUQsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFBIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2pzLWh5cGVyY2xpY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG4vKmdsb2JhbCBhdG9tICovXG4vLyBAZmxvd1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSBcImF0b21cIlxuaW1wb3J0IHR5cGUgeyBSYW5nZSwgUmVzb2x2ZWQgfSBmcm9tIFwiLi90eXBlc1wiXG5pbXBvcnQgY3JlYXRlRGVidWcgZnJvbSBcImRlYnVnXCJcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCJcbmltcG9ydCB7IFJhbmdlIGFzIEF0b21SYW5nZSB9IGZyb20gXCJhdG9tXCJcbmltcG9ydCBzaGVsbCBmcm9tIFwic2hlbGxcIlxuaW1wb3J0IG1ha2VDYWNoZSBmcm9tIFwiLi9tYWtlLWNhY2hlXCJcbmltcG9ydCB7IGJ1aWxkU3VnZ2VzdGlvbiwgZmluZERlc3RpbmF0aW9uLCByZXNvbHZlTW9kdWxlIH0gZnJvbSBcIi4vY29yZVwiXG5pbXBvcnQgZnMgZnJvbSBcImZzXCJcbmltcG9ydCBtYWtlUmVxdWlyZSBmcm9tIFwiLi9yZXF1aXJlLWlmLXRydXN0ZWRcIlxuaW1wb3J0IHR5cGUgeyBSZXF1aXJlIH0gZnJvbSBcIi4vcmVxdWlyZS1pZi10cnVzdGVkXCJcblxuY29uc3QgZGVidWcgPSBjcmVhdGVEZWJ1ZyhcImpzLWh5cGVyY2xpY2tcIilcblxuY29uc3Qgc2NvcGVzID0gW1wic291cmNlLmpzXCIsIFwic291cmNlLmpzLmpzeFwiLCBcImphdmFzY3JpcHRcIiwgXCJzb3VyY2UuZmxvd1wiXVxuY29uc3QgaXNKYXZhc2NyaXB0ID0gKHRleHRFZGl0b3I6IFRleHRFZGl0b3IpID0+IHtcbiAgY29uc3QgeyBzY29wZU5hbWUgfSA9IHRleHRFZGl0b3IuZ2V0R3JhbW1hcigpXG5cbiAgaWYgKHNjb3Blcy5pbmRleE9mKHNjb3BlTmFtZSkgPj0gMCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgZGVidWcoXCJOb3QgSmF2YXNjcmlwdFwiLCBzY29wZU5hbWUpXG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBtYWtlUHJvdmlkZXIoc3Vic2NyaXB0aW9ucykge1xuICBjb25zdCBjYWNoZSA9IG1ha2VDYWNoZShzdWJzY3JpcHRpb25zKVxuICBsZXQgYXV0b21hdGljSnVtcENvdW50ZXIgPSAwXG5cbiAgY29uc3QgYXV0b21hdGljSnVtcCA9ICh0ZXh0RWRpdG9yLCB7IHN0YXJ0LCBlbmQgfTogUmFuZ2UpID0+IHtcbiAgICBpZiAoIWF0b20uY29uZmlnLmdldChcImpzLWh5cGVyY2xpY2suc2tpcEludGVybWVkaWF0ZVwiKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGF1dG9tYXRpY0p1bXBDb3VudGVyKysgPiAxMCkge1xuICAgICAgY29uc3QgZGV0YWlsID0gYFVuYWJsZSB0byBmaW5kIG9yaWdpbjogdG9vIG1hbnkganVtcHNgXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcImpzLWh5cGVyY2xpY2tcIiwgeyBkZXRhaWwgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBjb25zdCBuZXh0SW5mbyA9IGNhY2hlLmdldCh0ZXh0RWRpdG9yKVxuICAgIGNvbnN0IHJhbmdlID0gbmV3IEF0b21SYW5nZShcbiAgICAgIC8vIEkga25vdyB0aGlzIHdvcmtzLCBidXQgZmxvdyBjbGFpbXMgdGhlIHR5cGUgaXMgd3JvbmcgLSAkRmxvd0ZpeE1lXG4gICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChzdGFydCkudG9BcnJheSgpLFxuICAgICAgYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoZW5kKS50b0FycmF5KCksXG4gICAgKVxuICAgIGNvbnN0IHRleHQgPSBidWZmZXIuZ2V0VGV4dEluUmFuZ2UocmFuZ2UpXG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAganVtcFRvSW1wb3J0OiBhdG9tLmNvbmZpZy5nZXQoXCJqcy1oeXBlcmNsaWNrLmp1bXBUb0ltcG9ydFwiKSxcbiAgICB9XG5cbiAgICBjb25zdCBuZXh0U3VnZ2VzdGlvbiA9IGJ1aWxkU3VnZ2VzdGlvbihcbiAgICAgIG5leHRJbmZvLFxuICAgICAgdGV4dCxcbiAgICAgIHsgc3RhcnQsIGVuZCB9LFxuICAgICAgb3B0aW9ucyxcbiAgICApXG5cbiAgICBsZXQgcmVzdWx0XG4gICAgaWYgKG5leHRTdWdnZXN0aW9uKSB7XG4gICAgICBpZiAob3B0aW9ucy5qdW1wVG9JbXBvcnQgJiYgbmV4dFN1Z2dlc3Rpb24udHlwZSA9PT0gXCJmcm9tLWltcG9ydFwiKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICByZXN1bHQgPSBidWlsZFJlc3VsdCh0ZXh0RWRpdG9yLCByYW5nZSwgbmV4dFN1Z2dlc3Rpb24sIHRydWUpXG4gICAgfVxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHJlc3VsdC5jYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgbmF2aWdhdGVUb1N1Z2dlc3Rpb24gPSAodGV4dEVkaXRvciwgc3VnZ2VzdGlvbikgPT4ge1xuICAgIGNvbnN0IGluZm8gPSBjYWNoZS5nZXQodGV4dEVkaXRvcilcbiAgICBjb25zdCB0YXJnZXQgPSBmaW5kRGVzdGluYXRpb24oaW5mbywgc3VnZ2VzdGlvbilcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgodGFyZ2V0LnN0YXJ0KVxuICAgICAgdGV4dEVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcbiAgICAgIHRleHRFZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpXG5cbiAgICAgIGF1dG9tYXRpY0p1bXAodGV4dEVkaXRvciwgdGFyZ2V0KVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGZvbGxvd1N1Z2dlc3Rpb25QYXRoID0gKGZyb21GaWxlLCBzdWdnZXN0aW9uKSA9PiB7XG4gICAgbGV0IGJsb2NrTm90Rm91bmRXYXJuaW5nID0gZmFsc2VcbiAgICBjb25zdCByZXF1aXJlSWZUcnVzdGVkOiBSZXF1aXJlPCgpID0+ID9SZXNvbHZlZD4gPSBtYWtlUmVxdWlyZShcbiAgICAgIGlzVHJ1c3RlZCA9PiB7XG4gICAgICAgIGlmIChpc1RydXN0ZWQpIHtcbiAgICAgICAgICBmb2xsb3dTdWdnZXN0aW9uUGF0aChmcm9tRmlsZSwgc3VnZ2VzdGlvbilcbiAgICAgICAgfVxuXG4gICAgICAgIGJsb2NrTm90Rm91bmRXYXJuaW5nID0gdHJ1ZVxuICAgICAgICByZXR1cm4gKCkgPT4gdW5kZWZpbmVkXG4gICAgICB9LFxuICAgIClcbiAgICBjb25zdCByZXNvbHZlT3B0aW9ucyA9IHtcbiAgICAgIGV4dGVuc2lvbnM6IGF0b20uY29uZmlnLmdldChcImpzLWh5cGVyY2xpY2suZXh0ZW5zaW9uc1wiKSxcbiAgICAgIHJlcXVpcmVJZlRydXN0ZWQsXG4gICAgfVxuICAgIGRlYnVnKFwicmVzb2x2ZU9wdGlvbnNcIiwgcmVzb2x2ZU9wdGlvbnMpXG4gICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlTW9kdWxlKGZyb21GaWxlLCBzdWdnZXN0aW9uLCByZXNvbHZlT3B0aW9ucylcblxuICAgIGlmIChibG9ja05vdEZvdW5kV2FybmluZykge1xuICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH0gZWxzZSBpZiAocmVzb2x2ZWQudHlwZSA9PT0gXCJ1cmxcIikge1xuICAgICAgaWYgKGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKFwid2ViLWJyb3dzZXJcIikpIHtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihyZXNvbHZlZC51cmwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBmbG93IGluc2lzdGVkIHJlc29sdmVkLnVybCBtYXkgYmUgdW5kZWZpbmVkIGhlcmUsIHNvIEkgaGFkIHRvXG4gICAgICAgIC8vIHN3aXRjaCB0byBhIGxvY2FsIHZhcmlhYmxlLlxuICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwocmVzb2x2ZWQudXJsKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVzb2x2ZWQudHlwZSA9PT0gXCJmaWxlXCIpIHtcbiAgICAgIGxldCBmaWxlbmFtZSA9IHJlc29sdmVkLmZpbGVuYW1lXG5cbiAgICAgIGlmIChmaWxlbmFtZSA9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGRldGFpbCA9IGBtb2R1bGUgJHtzdWdnZXN0aW9uLm1vZHVsZU5hbWV9IHdhcyBub3QgZm91bmRgXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFwianMtaHlwZXJjbGlja1wiLCB7IGRldGFpbCB9KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZW5hbWUpKSB7XG4gICAgICAgIGZpbGVuYW1lID0gZnMucmVhbHBhdGhTeW5jKGZpbGVuYW1lKVxuICAgICAgfVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgcGVuZGluZzogYXRvbS5jb25maWcuZ2V0KFwianMtaHlwZXJjbGljay51c2VQZW5kaW5nUGFuZXNcIiksXG4gICAgICB9XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVuYW1lLCBvcHRpb25zKS50aGVuKGVkaXRvciA9PiB7XG4gICAgICAgIG5hdmlnYXRlVG9TdWdnZXN0aW9uKGVkaXRvciwgc3VnZ2VzdGlvbilcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFZlcmlmeSBhbGwgdHlwZXMgaGF2ZSBiZWVuIGhhbmRsZWRcbiAgICAgIDsocmVzb2x2ZWQudHlwZTogZW1wdHkpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRSZXN1bHQodGV4dEVkaXRvciwgcmFuZ2UsIHN1Z2dlc3Rpb24sIGlzQXV0b21hdGljSnVtcCA9IHRydWUpIHtcbiAgICBpZiAoIWlzSmF2YXNjcmlwdCh0ZXh0RWRpdG9yKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChzdWdnZXN0aW9uLnJhbmdlKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICAgIHJhbmdlID0gbmV3IEF0b21SYW5nZShcbiAgICAgICAgLy8gSSBrbm93IHRoaXMgd29ya3MsIGJ1dCBmbG93IGNsYWltcyB0aGUgdHlwZSBzIHdyb25nIC0gJEZsb3dGaXhNZVxuICAgICAgICBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChzdWdnZXN0aW9uLnJhbmdlLnN0YXJ0KS50b0FycmF5KCksXG4gICAgICAgIGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHN1Z2dlc3Rpb24ucmFuZ2UuZW5kKS50b0FycmF5KCksXG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJhbmdlLFxuICAgICAgY2FsbGJhY2soKSB7XG4gICAgICAgIGlmICghaXNBdXRvbWF0aWNKdW1wKSB7XG4gICAgICAgICAgYXV0b21hdGljSnVtcENvdW50ZXIgPSAwXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VnZ2VzdGlvbi50eXBlID09PSBcImJpbmRpbmdcIikge1xuICAgICAgICAgIG5hdmlnYXRlVG9TdWdnZXN0aW9uKHRleHRFZGl0b3IsIHN1Z2dlc3Rpb24pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9sbG93U3VnZ2VzdGlvblBhdGgodGV4dEVkaXRvci5nZXRQYXRoKCksIHN1Z2dlc3Rpb24pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwcm92aWRlck5hbWU6IFwianMtaHlwZXJjbGlja1wiLFxuICAgIHdvcmRSZWdFeHA6IC9bJDAtOVxcd10rL2csXG4gICAgcHJpb3JpdHk6IGF0b20uY29uZmlnLmdldChcImpzLWh5cGVyY2xpY2sucHJpb3JpdHlcIiksXG4gICAgZ2V0U3VnZ2VzdGlvbkZvcldvcmQoXG4gICAgICB0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLFxuICAgICAgdGV4dDogc3RyaW5nLFxuICAgICAgcmFuZ2U6IEF0b21SYW5nZSxcbiAgICApIHtcbiAgICAgIGlmIChpc0phdmFzY3JpcHQodGV4dEVkaXRvcikpIHtcbiAgICAgICAgY29uc3QgaW5mbyA9IGNhY2hlLmdldCh0ZXh0RWRpdG9yKVxuICAgICAgICBpZiAoaW5mby5wYXJzZUVycm9yKSByZXR1cm5cblxuICAgICAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gYnVmZmVyLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24ocmFuZ2Uuc3RhcnQpXG4gICAgICAgIGNvbnN0IGVuZCA9IGJ1ZmZlci5jaGFyYWN0ZXJJbmRleEZvclBvc2l0aW9uKHJhbmdlLmVuZClcblxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgIGp1bXBUb0ltcG9ydDogYXRvbS5jb25maWcuZ2V0KFwianMtaHlwZXJjbGljay5qdW1wVG9JbXBvcnRcIiksXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbiA9IGJ1aWxkU3VnZ2VzdGlvbihpbmZvLCB0ZXh0LCB7IHN0YXJ0LCBlbmQgfSwgb3B0aW9ucylcbiAgICAgICAgZGVidWcodGV4dCwgc3VnZ2VzdGlvbilcbiAgICAgICAgaWYgKHN1Z2dlc3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gYnVpbGRSZXN1bHQodGV4dEVkaXRvciwgcmFuZ2UsIHN1Z2dlc3Rpb24sIGZhbHNlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG5mdW5jdGlvbiBtaWdyYXRlVHJ1c3RlZFJlc29sdmVycygpIHtcbiAgY29uc3Qga2V5ID0gYGpzLWh5cGVyY2xpY2sudHJ1c3RlZFJlc29sdmVyc2BcbiAgY29uc3QgdHJ1c3RlZFJlc29sdmVycyA9IGF0b20uY29uZmlnLmdldChrZXkpXG4gIGlmICh0cnVzdGVkUmVzb2x2ZXJzICE9IG51bGwpIHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoXCJqcy1oeXBlcmNsaWNrLnRydXN0ZWRGaWxlc1wiLCB0cnVzdGVkUmVzb2x2ZXJzKVxuICAgIGF0b20uY29uZmlnLnNldChrZXksIHVuZGVmaW5lZClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29uZmlnOiB7XG4gICAgZXh0ZW5zaW9uczoge1xuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIFwiQ29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgZXh0ZW5zaW9ucyB0byBjaGVjayBmb3Igd2hlbiBhIGZpbGUgaXNuJ3QgZm91bmRcIixcbiAgICAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAgIC8vIERlZmF1bHQgY29tZXMgZnJvbSBOb2RlJ3MgYHJlcXVpcmUuZXh0ZW5zaW9uc2BcbiAgICAgIGRlZmF1bHQ6IFtcIi5qc1wiLCBcIi5qc29uXCIsIFwiLm5vZGVcIl0sXG4gICAgICBpdGVtczogeyB0eXBlOiBcInN0cmluZ1wiIH0sXG4gICAgfSxcbiAgICB1c2VQZW5kaW5nUGFuZXM6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgfSxcbiAgICBqdW1wVG9JbXBvcnQ6IHtcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBkZXNjcmlwdGlvbjogYFxuICAgICAgICBKdW1wIHRvIHRoZSBpbXBvcnQgc3RhdGVtZW50IGluc3RlYWQgb2YgbGVhdmluZyB0aGUgY3VycmVudCBmaWxlLlxuICAgICAgICBZb3UgY2FuIHN0aWxsIGNsaWNrIHRoZSBpbXBvcnQgdG8gc3dpdGNoIGZpbGVzLlxuICAgICAgICBgLnRyaW0oKSwgLy8gaWYgdGhlIGRlc2NyaXB0aW9uIHN0YXJ0cyB3aXRoIHdoaXRlc3BhY2UgaXQgZG9lc24ndCBkaXNwbGF5XG4gICAgfSxcbiAgICBza2lwSW50ZXJtZWRpYXRlOiB7XG4gICAgICB0eXBlOiBcImJvb2xlYW5cIixcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICB0aXRsZTogYEp1bXAgdGhyb3VnaCBpbnRlcm1lZGlhdGUgbGlua3NgLFxuICAgICAgZGVzY3JpcHRpb246IGBcbiAgICAgICAgV2hlbiB5b3UgbGFuZCBhdCB5b3VyIGRlc3RpbmF0aW9uLCBqcy1oeXBlcmNsaWNrIGNoZWNrcyB0byBzZWUgaWZcbiAgICAgICAgdGhhdCBpcyBhIGxpbmsgYW5kIHRoZW4gZm9sbG93cyBpdC4gVGhpcyBpcyBtb3N0bHkgdXNlZnVsIHRvIHNraXBcbiAgICAgICAgb3ZlciBmaWxlcyB0aGF0IFxcYGV4cG9ydCAuLi4gZnJvbSAnLi9vdGhlcmZpbGUnXFxgLiBZb3Ugd2lsbCBsYW5kIGluXG4gICAgICAgIFxcYC4vb3RoZXJmaWxlXFxgIGluc3RlYWQgb2YgYXQgdGhhdCBleHBvcnQuXG4gICAgICAgIGAudHJpbSgpLFxuICAgIH0sXG4gICAgcHJpb3JpdHk6IHtcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICBkZWZhdWx0OiAwLFxuICAgICAgdGl0bGU6IGBoeXBlcmNsaWNrIHByaW9yaXR5YCxcbiAgICAgIGRlc2NyaXB0aW9uOiBgXG4gICAgICAgIEh5cGVyY2xpY2sgb25seSByZXR1cm5zIHN1Z2dlc3Rpb25zIGZyb20gYSBzaW5nbGUgcHJvdmlkZXIsIHNvIHRoaXMgaXMgYVxuICAgICAgICB3b3JrYXJvdW5kIGZvciBwcm92aWRlcnMgdG8gb3ZlcnJpZGUgb3RoZXJzLiBwcmlvcml0eSBkZWZhdWx0cyB0byAwLlxuICAgICAgICBodHRwczovL2F0b20uaW8vcGFja2FnZXMvaHlwZXJjbGlja1xuICAgICAgICBgLnRyaW0oKSxcbiAgICB9LFxuICAgIC8vIFRoaXMgZG9lc24ndCBzaG93IHVwIGluIHRoZSBzZXR0aW5ncy4gVXNlIEVkaXQgPiBDb25maWcgaWYgeW91IG5lZWQgdG9cbiAgICAvLyBjaGFuZ2UgdGhpcy5cbiAgICAvLyB0cnVzdGVkRmlsZXM6IHtcbiAgICAvLyAgIHR5cGU6IFwiYXJyYXlcIixcbiAgICAvLyAgIGl0ZW1zOiB7XG4gICAgLy8gICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgLy8gICAgIHByb3BlcnRpZXM6IHtcbiAgICAvLyAgICAgICBoYXNoOiB7IHR5cGU6IFwic3RyaW5nXCIgfSxcbiAgICAvLyAgICAgICB0cnVzdGVkOiB7IHR5cGU6IFwiYm9vbGVhblwiIH0sXG4gICAgLy8gICAgIH0sXG4gICAgLy8gICB9LFxuICAgIC8vICAgZGVmYXVsdDogW10sXG4gICAgLy8gfSxcbiAgfSxcbiAgYWN0aXZhdGUoKSB7XG4gICAgLy8gaHlwZXJjbGljayBpcyBidW5kbGVkIGludG8gbnVjbGlkZVxuICAgIGlmICghYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoXCJoeXBlcmNsaWNrXCIpKSB7XG4gICAgICByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLWRlcHNcIikuaW5zdGFsbChcImpzLWh5cGVyY2xpY2tcIilcbiAgICB9XG4gICAgbWlncmF0ZVRydXN0ZWRSZXNvbHZlcnMoKVxuICAgIGRlYnVnKFwiYWN0aXZhdGVcIilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIH0sXG4gIGdldFByb3ZpZGVyKCkge1xuICAgIHJldHVybiBtYWtlUHJvdmlkZXIodGhpcy5zdWJzY3JpcHRpb25zKVxuICB9LFxuICBkZWFjdGl2YXRlKCkge1xuICAgIGRlYnVnKFwiZGVhY3RpdmF0ZVwiKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfSxcbn1cblxuZ2xvYmFsLmpzSHlwZXJjbGljayA9IG1vZHVsZS5leHBvcnRzXG4iXX0=