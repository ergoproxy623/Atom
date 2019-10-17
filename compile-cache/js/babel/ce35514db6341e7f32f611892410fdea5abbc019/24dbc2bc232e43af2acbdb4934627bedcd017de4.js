Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = resolveModule;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _resolve = require("resolve");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick:resolve-module");

// Default comes from Node's `require.extensions`
var defaultExtensions = [".js", ".json", ".node"];

function findPackageJson(_x) {
  var _again = true;

  _function: while (_again) {
    var basedir = _x;
    _again = false;

    var packagePath = _path2["default"].resolve(basedir, "package.json");
    try {
      _fs2["default"].accessSync(packagePath);
    } catch (e) {
      var _parent = _path2["default"].resolve(basedir, "../");
      if (_parent != basedir) {
        _x = _parent;
        _again = true;
        packagePath = _parent = undefined;
        continue _function;
      }
      return undefined;
    }
    return packagePath;
  }
}

function loadModuleRoots(basedir) {
  var packagePath = findPackageJson(basedir);
  if (!packagePath) {
    return;
  }
  var config = JSON.parse(String(_fs2["default"].readFileSync(packagePath)));

  if (config && config.moduleRoots) {
    var _ret = (function () {
      var roots = config.moduleRoots;
      if (typeof roots === "string") {
        roots = [roots];
      }

      var packageDir = _path2["default"].dirname(packagePath);
      return {
        v: roots.map(function (r) {
          return _path2["default"].resolve(packageDir, r);
        })
      };
    })();

    if (typeof _ret === "object") return _ret.v;
  }
}

function resolveWithCustomRoots(basedir, absoluteModule, options) {
  var _options$extensions = options.extensions;
  var extensions = _options$extensions === undefined ? defaultExtensions : _options$extensions;
  var requireIfTrusted = options.requireIfTrusted;

  var moduleName = "./" + absoluteModule;

  var roots = loadModuleRoots(basedir);

  if (roots) {
    var resolveOptions = { basedir: basedir, extensions: extensions };
    for (var i = 0; i < roots.length; i++) {
      var stats = undefined;
      try {
        stats = _fs2["default"].statSync(roots[i]);
      } catch (e) {
        // Ignore invalid moduleRoots instead of throwing an error.
        continue;
      }

      if (stats.isFile()) {
        var resolver = roots[i];
        try {
          // $FlowExpectError
          var customResolver = requireIfTrusted(resolver);
          var filename = customResolver({
            basedir: basedir,
            moduleName: absoluteModule
          });
          debug("filename", filename);
          // it's ok for a custom resolver to jut pass on a module
          if (filename == null) {
            continue;
          } else if (typeof filename === "string") {
            if (filename.match(/^http/)) {
              return { type: "url", url: filename };
            }

            resolveOptions.basedir = basedir;
            return {
              type: "file",
              filename: (0, _resolve.sync)(filename, resolveOptions)
            };
          }
          throw new Error("Custom resolvers must return a string or null/undefined.\nRecieved: " + filename);
        } catch (e) {
          e.message = "Error in custom resolver: " + resolver + "\n\n" + e.message;
          throw e;
        }
      }
      resolveOptions.basedir = roots[i];

      try {
        var filename = (0, _resolve.sync)(moduleName, resolveOptions);
        return { type: "file", filename: filename };
      } catch (e) {
        /* do nothing */
      }
    }
  }
  return { type: "file", filename: undefined };
}

function resolveModule(filePath, suggestion, options) {
  var _options$extensions2 = options.extensions;
  var extensions = _options$extensions2 === undefined ? defaultExtensions : _options$extensions2;
  var moduleName = suggestion.moduleName;

  var basedir = _path2["default"].dirname(filePath);
  var resolveOptions = { basedir: basedir, extensions: extensions };

  var filename = undefined;

  try {
    filename = (0, _resolve.sync)(moduleName, resolveOptions);
    if (filename == moduleName) {
      return {
        type: "url",
        url: "http://nodejs.org/api/" + moduleName + ".html"
      };
    }
  } catch (e) {
    if (moduleName === "atom") {
      return {
        type: "url",
        url: "https://atom.io/docs/api/latest/"
      };
    }
  }

  // Allow linking to relative files that don't exist yet.
  if (!filename && moduleName[0] === ".") {
    if (_path2["default"].extname(moduleName) == "") {
      moduleName += ".js";
    }

    filename = _path2["default"].join(basedir, moduleName);
    debug("opening new file", filename);
  } else if (!filename) {
    var customResolution = resolveWithCustomRoots(basedir, moduleName, options);
    debug("Custom Resolution", customResolution);
    return customResolution;
  } else {
    debug("resolved", filename);
  }

  return { type: "file", filename: filename };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2NvcmUvcmVzb2x2ZS1tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQThHd0IsYUFBYTs7OztvQkE1R3BCLE1BQU07Ozs7a0JBQ1IsSUFBSTs7Ozt1QkFDYSxTQUFTOztxQkFFbkIsT0FBTzs7OztBQU43QixXQUFXLENBQUE7O0FBT1gsSUFBTSxLQUFLLEdBQUcsd0JBQVUsOEJBQThCLENBQUMsQ0FBQTs7O0FBR3ZELElBQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQU1uRCxTQUFTLGVBQWU7Ozs0QkFBVTtRQUFULE9BQU87OztBQUM5QixRQUFNLFdBQVcsR0FBRyxrQkFBSyxPQUFPLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBQ3pELFFBQUk7QUFDRixzQkFBRyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUE7S0FDM0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFVBQU0sT0FBTSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDM0MsVUFBSSxPQUFNLElBQUksT0FBTyxFQUFFO2FBQ0UsT0FBTTs7QUFOM0IsbUJBQVcsR0FJVCxPQUFNOztPQUdYO0FBQ0QsYUFBTyxTQUFTLENBQUE7S0FDakI7QUFDRCxXQUFPLFdBQVcsQ0FBQTtHQUNuQjtDQUFBOztBQUVELFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRTtBQUNoQyxNQUFNLFdBQVcsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDNUMsTUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQixXQUFNO0dBQ1A7QUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBRyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUUvRCxNQUFJ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QUMsQ0FBQTtHQUNwQyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDcEIsUUFBTSxnQkFBZ0IsR0FBRyxzQkFBc0IsQ0FDN0MsT0FBTyxFQUNQLFVBQVUsRUFDVixPQUFPLENBQ1IsQ0FBQTtBQUNELFNBQUssQ0FBQyxtQkFBbUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzVDLFdBQU8sZ0JBQWdCLENBQUE7R0FDeEIsTUFBTTtBQUNMLFNBQUssQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUE7R0FDNUI7O0FBRUQsU0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFBO0NBQ2xDIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2NvcmUvcmVzb2x2ZS1tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG4vLyBAZmxvd1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IGZzIGZyb20gXCJmc1wiXG5pbXBvcnQgeyBzeW5jIGFzIHJlc29sdmUgfSBmcm9tIFwicmVzb2x2ZVwiXG5pbXBvcnQgdHlwZSB7IFJlc29sdmVkIH0gZnJvbSBcIi4uL3R5cGVzXCJcbmltcG9ydCBtYWtlRGVidWcgZnJvbSBcImRlYnVnXCJcbmNvbnN0IGRlYnVnID0gbWFrZURlYnVnKFwianMtaHlwZXJjbGljazpyZXNvbHZlLW1vZHVsZVwiKVxuXG4vLyBEZWZhdWx0IGNvbWVzIGZyb20gTm9kZSdzIGByZXF1aXJlLmV4dGVuc2lvbnNgXG5jb25zdCBkZWZhdWx0RXh0ZW5zaW9ucyA9IFtcIi5qc1wiLCBcIi5qc29uXCIsIFwiLm5vZGVcIl1cbnR5cGUgUmVzb2x2ZU9wdGlvbnMgPSB7XG4gIGV4dGVuc2lvbnM/OiB0eXBlb2YgZGVmYXVsdEV4dGVuc2lvbnMsXG4gIHJlcXVpcmVJZlRydXN0ZWQ6IChtb2R1bGVOYW1lOiBzdHJpbmcpID0+IGFueSxcbn1cblxuZnVuY3Rpb24gZmluZFBhY2thZ2VKc29uKGJhc2VkaXIpIHtcbiAgY29uc3QgcGFja2FnZVBhdGggPSBwYXRoLnJlc29sdmUoYmFzZWRpciwgXCJwYWNrYWdlLmpzb25cIilcbiAgdHJ5IHtcbiAgICBmcy5hY2Nlc3NTeW5jKHBhY2thZ2VQYXRoKVxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3QgcGFyZW50ID0gcGF0aC5yZXNvbHZlKGJhc2VkaXIsIFwiLi4vXCIpXG4gICAgaWYgKHBhcmVudCAhPSBiYXNlZGlyKSB7XG4gICAgICByZXR1cm4gZmluZFBhY2thZ2VKc29uKHBhcmVudClcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG4gIHJldHVybiBwYWNrYWdlUGF0aFxufVxuXG5mdW5jdGlvbiBsb2FkTW9kdWxlUm9vdHMoYmFzZWRpcikge1xuICBjb25zdCBwYWNrYWdlUGF0aCA9IGZpbmRQYWNrYWdlSnNvbihiYXNlZGlyKVxuICBpZiAoIXBhY2thZ2VQYXRoKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgY29uZmlnID0gSlNPTi5wYXJzZShTdHJpbmcoZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VQYXRoKSkpXG5cbiAgaWYgKGNvbmZpZyAmJiBjb25maWcubW9kdWxlUm9vdHMpIHtcbiAgICBsZXQgcm9vdHMgPSBjb25maWcubW9kdWxlUm9vdHNcbiAgICBpZiAodHlwZW9mIHJvb3RzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByb290cyA9IFtyb290c11cbiAgICB9XG5cbiAgICBjb25zdCBwYWNrYWdlRGlyID0gcGF0aC5kaXJuYW1lKHBhY2thZ2VQYXRoKVxuICAgIHJldHVybiByb290cy5tYXAociA9PiBwYXRoLnJlc29sdmUocGFja2FnZURpciwgcikpXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVdpdGhDdXN0b21Sb290cyhiYXNlZGlyLCBhYnNvbHV0ZU1vZHVsZSwgb3B0aW9ucyk6IFJlc29sdmVkIHtcbiAgY29uc3QgeyBleHRlbnNpb25zID0gZGVmYXVsdEV4dGVuc2lvbnMsIHJlcXVpcmVJZlRydXN0ZWQgfSA9IG9wdGlvbnNcbiAgY29uc3QgbW9kdWxlTmFtZSA9IGAuLyR7YWJzb2x1dGVNb2R1bGV9YFxuXG4gIGNvbnN0IHJvb3RzID0gbG9hZE1vZHVsZVJvb3RzKGJhc2VkaXIpXG5cbiAgaWYgKHJvb3RzKSB7XG4gICAgY29uc3QgcmVzb2x2ZU9wdGlvbnMgPSB7IGJhc2VkaXIsIGV4dGVuc2lvbnMgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm9vdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzdGF0c1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdHMgPSBmcy5zdGF0U3luYyhyb290c1tpXSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gSWdub3JlIGludmFsaWQgbW9kdWxlUm9vdHMgaW5zdGVhZCBvZiB0aHJvd2luZyBhbiBlcnJvci5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRzLmlzRmlsZSgpKSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVyID0gcm9vdHNbaV1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyAkRmxvd0V4cGVjdEVycm9yXG4gICAgICAgICAgY29uc3QgY3VzdG9tUmVzb2x2ZXIgPSByZXF1aXJlSWZUcnVzdGVkKHJlc29sdmVyKVxuICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gY3VzdG9tUmVzb2x2ZXIoe1xuICAgICAgICAgICAgYmFzZWRpcixcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6IGFic29sdXRlTW9kdWxlLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgZGVidWcoXCJmaWxlbmFtZVwiLCBmaWxlbmFtZSlcbiAgICAgICAgICAvLyBpdCdzIG9rIGZvciBhIGN1c3RvbSByZXNvbHZlciB0byBqdXQgcGFzcyBvbiBhIG1vZHVsZVxuICAgICAgICAgIGlmIChmaWxlbmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpbGVuYW1lID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAoZmlsZW5hbWUubWF0Y2goL15odHRwLykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogXCJ1cmxcIiwgdXJsOiBmaWxlbmFtZSB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc29sdmVPcHRpb25zLmJhc2VkaXIgPSBiYXNlZGlyXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0eXBlOiBcImZpbGVcIixcbiAgICAgICAgICAgICAgZmlsZW5hbWU6IHJlc29sdmUoZmlsZW5hbWUsIHJlc29sdmVPcHRpb25zKSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEN1c3RvbSByZXNvbHZlcnMgbXVzdCByZXR1cm4gYSBzdHJpbmcgb3IgbnVsbC91bmRlZmluZWQuXFxuUmVjaWV2ZWQ6ICR7ZmlsZW5hbWV9YCxcbiAgICAgICAgICApXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBlLm1lc3NhZ2UgPSBgRXJyb3IgaW4gY3VzdG9tIHJlc29sdmVyOiAke3Jlc29sdmVyfVxcblxcbiR7ZS5tZXNzYWdlfWBcbiAgICAgICAgICB0aHJvdyBlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc29sdmVPcHRpb25zLmJhc2VkaXIgPSByb290c1tpXVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHJlc29sdmUobW9kdWxlTmFtZSwgcmVzb2x2ZU9wdGlvbnMpXG4gICAgICAgIHJldHVybiB7IHR5cGU6IFwiZmlsZVwiLCBmaWxlbmFtZSB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgdHlwZTogXCJmaWxlXCIsIGZpbGVuYW1lOiB1bmRlZmluZWQgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXNvbHZlTW9kdWxlKFxuICBmaWxlUGF0aDogc3RyaW5nLFxuICBzdWdnZXN0aW9uOiB7IG1vZHVsZU5hbWU6IHN0cmluZyB9LFxuICBvcHRpb25zOiBSZXNvbHZlT3B0aW9ucyxcbik6IFJlc29sdmVkIHtcbiAgY29uc3QgeyBleHRlbnNpb25zID0gZGVmYXVsdEV4dGVuc2lvbnMgfSA9IG9wdGlvbnNcbiAgbGV0IHsgbW9kdWxlTmFtZSB9ID0gc3VnZ2VzdGlvblxuXG4gIGNvbnN0IGJhc2VkaXIgPSBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gIGNvbnN0IHJlc29sdmVPcHRpb25zID0geyBiYXNlZGlyLCBleHRlbnNpb25zIH1cblxuICBsZXQgZmlsZW5hbWVcblxuICB0cnkge1xuICAgIGZpbGVuYW1lID0gcmVzb2x2ZShtb2R1bGVOYW1lLCByZXNvbHZlT3B0aW9ucylcbiAgICBpZiAoZmlsZW5hbWUgPT0gbW9kdWxlTmFtZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogXCJ1cmxcIixcbiAgICAgICAgdXJsOiBgaHR0cDovL25vZGVqcy5vcmcvYXBpLyR7bW9kdWxlTmFtZX0uaHRtbGAsXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKG1vZHVsZU5hbWUgPT09IFwiYXRvbVwiKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBcInVybFwiLFxuICAgICAgICB1cmw6IGBodHRwczovL2F0b20uaW8vZG9jcy9hcGkvbGF0ZXN0L2AsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQWxsb3cgbGlua2luZyB0byByZWxhdGl2ZSBmaWxlcyB0aGF0IGRvbid0IGV4aXN0IHlldC5cbiAgaWYgKCFmaWxlbmFtZSAmJiBtb2R1bGVOYW1lWzBdID09PSBcIi5cIikge1xuICAgIGlmIChwYXRoLmV4dG5hbWUobW9kdWxlTmFtZSkgPT0gXCJcIikge1xuICAgICAgbW9kdWxlTmFtZSArPSBcIi5qc1wiXG4gICAgfVxuXG4gICAgZmlsZW5hbWUgPSBwYXRoLmpvaW4oYmFzZWRpciwgbW9kdWxlTmFtZSlcbiAgICBkZWJ1ZyhcIm9wZW5pbmcgbmV3IGZpbGVcIiwgZmlsZW5hbWUpXG4gIH0gZWxzZSBpZiAoIWZpbGVuYW1lKSB7XG4gICAgY29uc3QgY3VzdG9tUmVzb2x1dGlvbiA9IHJlc29sdmVXaXRoQ3VzdG9tUm9vdHMoXG4gICAgICBiYXNlZGlyLFxuICAgICAgbW9kdWxlTmFtZSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKVxuICAgIGRlYnVnKFwiQ3VzdG9tIFJlc29sdXRpb25cIiwgY3VzdG9tUmVzb2x1dGlvbilcbiAgICByZXR1cm4gY3VzdG9tUmVzb2x1dGlvblxuICB9IGVsc2Uge1xuICAgIGRlYnVnKFwicmVzb2x2ZWRcIiwgZmlsZW5hbWUpXG4gIH1cblxuICByZXR1cm4geyB0eXBlOiBcImZpbGVcIiwgZmlsZW5hbWUgfVxufVxuIl19