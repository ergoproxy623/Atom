Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global atom */

var _events = require('events');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _underscorePlus = require('underscore-plus');

var _underscorePlus2 = _interopRequireDefault(_underscorePlus);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _pathsCache = require('./paths-cache');

var _pathsCache2 = _interopRequireDefault(_pathsCache);

var _fuzzaldrinPlus = require('fuzzaldrin-plus');

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _configDefaultScopes = require('./config/default-scopes');

var _configDefaultScopes2 = _interopRequireDefault(_configDefaultScopes);

var _configOptionScopes = require('./config/option-scopes');

var _configOptionScopes2 = _interopRequireDefault(_configOptionScopes);

'use babel';
var PathsProvider = (function (_EventEmitter) {
  _inherits(PathsProvider, _EventEmitter);

  function PathsProvider() {
    _classCallCheck(this, PathsProvider);

    _get(Object.getPrototypeOf(PathsProvider.prototype), 'constructor', this).call(this);
    this.reloadScopes();

    this._pathsCache = new _pathsCache2['default']();
    this._isReady = false;

    this._onRebuildCache = this._onRebuildCache.bind(this);
    this._onRebuildCacheDone = this._onRebuildCacheDone.bind(this);

    this._pathsCache.on('rebuild-cache', this._onRebuildCache);
    this._pathsCache.on('rebuild-cache-done', this._onRebuildCacheDone);
  }

  /**
   * Reloads the scopes
   */

  _createClass(PathsProvider, [{
    key: 'reloadScopes',
    value: function reloadScopes() {
      this._scopes = atom.config.get('autocomplete-paths.scopes').slice(0) || [];

      if (!atom.config.get('autocomplete-paths.ignoreBuiltinScopes')) {
        this._scopes = this._scopes.concat(_configDefaultScopes2['default']);
      }

      for (var key in _configOptionScopes2['default']) {
        if (atom.config.get('autocomplete-paths.' + key)) {
          this._scopes = this._scopes.slice(0).concat(_configOptionScopes2['default'][key]);
        }
      }
    }

    /**
     * Gets called when the PathsCache is starting to rebuild the cache
     * @private
     */
  }, {
    key: '_onRebuildCache',
    value: function _onRebuildCache() {
      this.emit('rebuild-cache');
    }

    /**
     * Gets called when the PathsCache is done rebuilding the cache
     * @private
     */
  }, {
    key: '_onRebuildCacheDone',
    value: function _onRebuildCacheDone() {
      this.emit('rebuild-cache-done');
    }

    /**
     * Checks if the given scope config matches the given request
     * @param  {Object} scope
     * @param  {Object} request
     * @return {Array} The match object
     * @private
     */
  }, {
    key: '_scopeMatchesRequest',
    value: function _scopeMatchesRequest(scope, request) {
      var sourceScopes = Array.isArray(scope.scopes) ? scope.scopes : [scope.scopes];

      // Check if the scope descriptors match
      var scopeMatches = _underscorePlus2['default'].intersection(request.scopeDescriptor.getScopesArray(), sourceScopes).length > 0;
      if (!scopeMatches) return false;

      // Check if the line matches the prefixes
      var line = this._getLineTextForRequest(request);

      var lineMatch = null;
      var scopePrefixes = Array.isArray(scope.prefixes) ? scope.prefixes : [scope.prefixes];
      scopePrefixes.forEach(function (prefix) {
        var regex = new RegExp(prefix, 'i');
        lineMatch = lineMatch || line.match(regex);
      });

      return lineMatch;
    }

    /**
     * Returns the whole line text for the given request
     * @param  {Object} request
     * @return {String}
     * @private
     */
  }, {
    key: '_getLineTextForRequest',
    value: function _getLineTextForRequest(request) {
      var editor = request.editor;
      var bufferPosition = request.bufferPosition;

      return editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    }

    /**
     * Returns the suggestions for the given scope and the given request
     * @param  {Object} scope
     * @param  {Object} request
     * @return {Promise}
     * @private
     */
  }, {
    key: '_getSuggestionsForScope',
    value: function _getSuggestionsForScope(scope, request, match) {
      var line = this._getLineTextForRequest(request);
      var pathPrefix = line.substr(match.index + match[0].length);
      var trailingSlashPresent = pathPrefix.match(/[/|\\]$/);
      var directoryGiven = pathPrefix.indexOf('./') === 0 || pathPrefix.indexOf('../') === 0;
      var parsedPathPrefix = _path2['default'].parse(pathPrefix);

      // path.parse ignores trailing slashes, so we handle this manually
      if (trailingSlashPresent) {
        parsedPathPrefix.dir = _path2['default'].join(parsedPathPrefix.dir, parsedPathPrefix.base);
        parsedPathPrefix.base = '';
        parsedPathPrefix.name = '';
      }

      var projectDirectory = this._getProjectDirectory(request.editor);
      if (!projectDirectory) return Promise.resolve([]);
      var currentDirectory = _path2['default'].dirname(request.editor.getPath());

      var requestedDirectoryPath = _path2['default'].resolve(currentDirectory, parsedPathPrefix.dir);

      var files = directoryGiven ? this._pathsCache.getFilePathsForProjectDirectory(projectDirectory, requestedDirectoryPath) : this._pathsCache.getFilePathsForProjectDirectory(projectDirectory);

      var fuzzyMatcher = directoryGiven ? parsedPathPrefix.base : pathPrefix;

      var extensions = scope.extensions;

      if (extensions) {
        (function () {
          var regex = new RegExp('.(' + extensions.join('|') + ')$');
          files = files.filter(function (path) {
            return regex.test(path);
          });
        })();
      }

      if (fuzzyMatcher) {
        files = _fuzzaldrinPlus2['default'].filter(files, fuzzyMatcher, {
          maxResults: 10
        });
      }

      var suggestions = files.map(function (pathName) {
        var normalizeSlashes = atom.config.get('autocomplete-paths.normalizeSlashes');

        var projectRelativePath = atom.project.relativizePath(pathName)[1];
        var displayText = projectRelativePath;
        if (directoryGiven) {
          displayText = _path2['default'].relative(requestedDirectoryPath, pathName);
        }
        if (normalizeSlashes) {
          displayText = (0, _slash2['default'])(displayText);
        }

        // Relativize path to current file if necessary
        var relativePath = _path2['default'].relative(_path2['default'].dirname(request.editor.getPath()), pathName);
        if (normalizeSlashes) relativePath = (0, _slash2['default'])(relativePath);
        if (scope.relative !== false) {
          pathName = relativePath;
          if (scope.includeCurrentDirectory !== false) {
            if (pathName[0] !== '.') {
              pathName = './' + pathName;
            }
          }
        }

        if (scope.projectRelativePath) {
          pathName = projectRelativePath;
        }

        // Replace stuff if necessary
        if (scope.replaceOnInsert) {
          var originalPathName = pathName;
          scope.replaceOnInsert.forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var from = _ref2[0];
            var to = _ref2[1];

            var regex = new RegExp(from);
            if (regex.test(pathName)) {
              pathName = pathName.replace(regex, to);
            }
          });
        }

        // Calculate distance to file
        var distanceToFile = relativePath.split(_path2['default'].sep).length;
        return {
          text: pathName,
          replacementPrefix: pathPrefix,
          displayText: displayText,
          type: 'import',
          iconHTML: '<i class="icon-file-code"></i>',
          score: _fuzzaldrinPlus2['default'].score(displayText, request.prefix),
          distanceToFile: distanceToFile
        };
      });

      // Modify score to incorporate distance
      var suggestionsCount = suggestions.length;
      if (suggestions.length) {
        (function () {
          var maxDistance = _underscorePlus2['default'].max(suggestions, function (s) {
            return s.distanceToFile;
          }).distanceToFile;
          suggestions.forEach(function (s, i) {
            s.score = suggestionsCount - i + (maxDistance - s.distanceToFile);
          });

          // Sort again
          suggestions.sort(function (a, b) {
            return b.score - a.score;
          });
        })();
      }

      return Promise.resolve(suggestions);
    }

    /**
     * Returns the suggestions for the given request
     * @param  {Object} request
     * @return {Promise}
     */
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(request) {
      var _this = this;

      var matches = this._scopes.map(function (scope) {
        return [scope, _this._scopeMatchesRequest(scope, request)];
      }).filter(function (result) {
        return result[1];
      }); // Filter scopes that match
      var promises = matches.map(function (_ref3) {
        var _ref32 = _slicedToArray(_ref3, 2);

        var scope = _ref32[0];
        var match = _ref32[1];
        return _this._getSuggestionsForScope(scope, request, match);
      });

      return Promise.all(promises).then(function (suggestions) {
        suggestions = _underscorePlus2['default'].flatten(suggestions);
        if (!suggestions.length) return false;
        return suggestions;
      });
    }

    /**
     * Rebuilds the cache
     * @return {Promise}
     */
  }, {
    key: 'rebuildCache',
    value: function rebuildCache() {
      var _this2 = this;

      return this._pathsCache.rebuildCache().then(function (result) {
        _this2._isReady = true;
        return result;
      });
    }

    /**
     * Returns the project directory that contains the file opened in the given editor
     * @param  {TextEditor} editor
     * @return {Directory}
     * @private
     */
  }, {
    key: '_getProjectDirectory',
    value: function _getProjectDirectory(editor) {
      var filePath = editor.getBuffer().getPath();
      var projectDirectory = null;
      atom.project.getDirectories().forEach(function (directory) {
        if (directory.contains(filePath)) {
          projectDirectory = directory;
        }
      });
      return projectDirectory;
    }
  }, {
    key: 'isReady',
    value: function isReady() {
      return this._isReady;
    }
  }, {
    key: 'dispose',

    /**
     * Disposes this provider
     */
    value: function dispose() {
      this._pathsCache.removeListener('rebuild-cache', this._onRebuildCache);
      this._pathsCache.removeListener('rebuild-cache-done', this._onRebuildCacheDone);
      this._pathsCache.dispose(true);
    }
  }, {
    key: 'suggestionPriority',
    get: function get() {
      return atom.config.get('autocomplete-paths.suggestionPriority');
    }
  }, {
    key: 'fileCount',
    get: function get() {
      var _this3 = this;

      return atom.project.getDirectories().reduce(function (accumulated, directory) {
        var filePaths = _this3._pathsCache.getFilePathsForProjectDirectory(directory);
        return accumulated + filePaths.length;
      }, 0);
    }
  }]);

  return PathsProvider;
})(_events.EventEmitter);

exports['default'] = PathsProvider;

PathsProvider.prototype.selector = '*';
PathsProvider.prototype.inclusionPriority = 1;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvcGF0aHMtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQUc2QixRQUFROztvQkFDcEIsTUFBTTs7Ozs4QkFDVCxpQkFBaUI7Ozs7cUJBQ2IsT0FBTzs7OzswQkFDRixlQUFlOzs7OzhCQUNmLGlCQUFpQjs7OzttQ0FDZCx5QkFBeUI7Ozs7a0NBQzFCLHdCQUF3Qjs7OztBQVZqRCxXQUFXLENBQUE7SUFZVSxhQUFhO1lBQWIsYUFBYTs7QUFDcEIsV0FETyxhQUFhLEdBQ2pCOzBCQURJLGFBQWE7O0FBRTlCLCtCQUZpQixhQUFhLDZDQUV2QjtBQUNQLFFBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTs7QUFFbkIsUUFBSSxDQUFDLFdBQVcsR0FBRyw2QkFBZ0IsQ0FBQTtBQUNuQyxRQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTs7QUFFckIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUN0RCxRQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFOUQsUUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUMxRCxRQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtHQUNwRTs7Ozs7O2VBYmtCLGFBQWE7O1dBa0JuQix3QkFBRztBQUNkLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBOztBQUUx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SUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBQyxXQUFXLEVBQUUsU0FBUyxFQUFLO0FBQ3RFLFlBQU0sU0FBUyxHQUFHLE9BQUssV0FBVyxDQUFDLCtCQUErQixDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzdFLGVBQU8sV0FBVyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7T0FDdkMsRUFBRSxDQUFDLENBQUMsQ0FBQTtLQUNOOzs7U0E1UWtCLGFBQWE7OztxQkFBYixhQUFhOztBQXdSbEMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFBO0FBQ3RDLGFBQWEsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvcGF0aHMtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZ2xvYmFsIGF0b20gKi9cblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBfIGZyb20gJ3VuZGVyc2NvcmUtcGx1cydcbmltcG9ydCBzbGFzaCBmcm9tICdzbGFzaCdcbmltcG9ydCBQYXRoc0NhY2hlIGZyb20gJy4vcGF0aHMtY2FjaGUnXG5pbXBvcnQgZnV6emFsZHJpbiBmcm9tICdmdXp6YWxkcmluLXBsdXMnXG5pbXBvcnQgRGVmYXVsdFNjb3BlcyBmcm9tICcuL2NvbmZpZy9kZWZhdWx0LXNjb3BlcydcbmltcG9ydCBPcHRpb25TY29wZXMgZnJvbSAnLi9jb25maWcvb3B0aW9uLXNjb3BlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0aHNQcm92aWRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5yZWxvYWRTY29wZXMoKVxuXG4gICAgdGhpcy5fcGF0aHNDYWNoZSA9IG5ldyBQYXRoc0NhY2hlKClcbiAgICB0aGlzLl9pc1JlYWR5ID0gZmFsc2VcblxuICAgIHRoaXMuX29uUmVidWlsZENhY2hlID0gdGhpcy5fb25SZWJ1aWxkQ2FjaGUuYmluZCh0aGlzKVxuICAgIHRoaXMuX29uUmVidWlsZENhY2hlRG9uZSA9IHRoaXMuX29uUmVidWlsZENhY2hlRG9uZS5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLl9wYXRoc0NhY2hlLm9uKCdyZWJ1aWxkLWNhY2hlJywgdGhpcy5fb25SZWJ1aWxkQ2FjaGUpXG4gICAgdGhpcy5fcGF0aHNDYWNoZS5vbigncmVidWlsZC1jYWNoZS1kb25lJywgdGhpcy5fb25SZWJ1aWxkQ2FjaGVEb25lKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbG9hZHMgdGhlIHNjb3Blc1xuICAgKi9cbiAgcmVsb2FkU2NvcGVzICgpIHtcbiAgICB0aGlzLl9zY29wZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5zY29wZXMnKS5zbGljZSgwKSB8fCBbXVxuXG4gICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5pZ25vcmVCdWlsdGluU2NvcGVzJykpIHtcbiAgICAgIHRoaXMuX3Njb3BlcyA9IHRoaXMuX3Njb3Blcy5jb25jYXQoRGVmYXVsdFNjb3BlcylcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gT3B0aW9uU2NvcGVzKSB7XG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KGBhdXRvY29tcGxldGUtcGF0aHMuJHtrZXl9YCkpIHtcbiAgICAgICAgdGhpcy5fc2NvcGVzID0gdGhpcy5fc2NvcGVzLnNsaWNlKDApLmNvbmNhdChPcHRpb25TY29wZXNba2V5XSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBjYWxsZWQgd2hlbiB0aGUgUGF0aHNDYWNoZSBpcyBzdGFydGluZyB0byByZWJ1aWxkIHRoZSBjYWNoZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uUmVidWlsZENhY2hlICgpIHtcbiAgICB0aGlzLmVtaXQoJ3JlYnVpbGQtY2FjaGUnKVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgY2FsbGVkIHdoZW4gdGhlIFBhdGhzQ2FjaGUgaXMgZG9uZSByZWJ1aWxkaW5nIHRoZSBjYWNoZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uUmVidWlsZENhY2hlRG9uZSAoKSB7XG4gICAgdGhpcy5lbWl0KCdyZWJ1aWxkLWNhY2hlLWRvbmUnKVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gc2NvcGUgY29uZmlnIG1hdGNoZXMgdGhlIGdpdmVuIHJlcXVlc3RcbiAgICogQHBhcmFtICB7T2JqZWN0fSBzY29wZVxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHJlcXVlc3RcbiAgICogQHJldHVybiB7QXJyYXl9IFRoZSBtYXRjaCBvYmplY3RcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zY29wZU1hdGNoZXNSZXF1ZXN0IChzY29wZSwgcmVxdWVzdCkge1xuICAgIGNvbnN0IHNvdXJjZVNjb3BlcyA9IEFycmF5LmlzQXJyYXkoc2NvcGUuc2NvcGVzKVxuICAgICAgPyBzY29wZS5zY29wZXNcbiAgICAgIDogW3Njb3BlLnNjb3Blc11cblxuICAgIC8vIENoZWNrIGlmIHRoZSBzY29wZSBkZXNjcmlwdG9ycyBtYXRjaFxuICAgIGNvbnN0IHNjb3BlTWF0Y2hlcyA9IF8uaW50ZXJzZWN0aW9uKFxuICAgICAgcmVxdWVzdC5zY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKSxcbiAgICAgIHNvdXJjZVNjb3Blc1xuICAgICkubGVuZ3RoID4gMFxuICAgIGlmICghc2NvcGVNYXRjaGVzKSByZXR1cm4gZmFsc2VcblxuICAgIC8vIENoZWNrIGlmIHRoZSBsaW5lIG1hdGNoZXMgdGhlIHByZWZpeGVzXG4gICAgY29uc3QgbGluZSA9IHRoaXMuX2dldExpbmVUZXh0Rm9yUmVxdWVzdChyZXF1ZXN0KVxuXG4gICAgbGV0IGxpbmVNYXRjaCA9IG51bGxcbiAgICBjb25zdCBzY29wZVByZWZpeGVzID0gQXJyYXkuaXNBcnJheShzY29wZS5wcmVmaXhlcylcbiAgICAgID8gc2NvcGUucHJlZml4ZXNcbiAgICAgIDogW3Njb3BlLnByZWZpeGVzXVxuICAgIHNjb3BlUHJlZml4ZXMuZm9yRWFjaChwcmVmaXggPT4ge1xuICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHByZWZpeCwgJ2knKVxuICAgICAgbGluZU1hdGNoID0gbGluZU1hdGNoIHx8IGxpbmUubWF0Y2gocmVnZXgpXG4gICAgfSlcblxuICAgIHJldHVybiBsaW5lTWF0Y2hcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3aG9sZSBsaW5lIHRleHQgZm9yIHRoZSBnaXZlbiByZXF1ZXN0XG4gICAqIEBwYXJhbSAge09iamVjdH0gcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZ2V0TGluZVRleHRGb3JSZXF1ZXN0IChyZXF1ZXN0KSB7XG4gICAgY29uc3QgeyBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uIH0gPSByZXF1ZXN0XG4gICAgcmV0dXJuIGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzdWdnZXN0aW9ucyBmb3IgdGhlIGdpdmVuIHNjb3BlIGFuZCB0aGUgZ2l2ZW4gcmVxdWVzdFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHNjb3BlXG4gICAqIEBwYXJhbSAge09iamVjdH0gcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldFN1Z2dlc3Rpb25zRm9yU2NvcGUgKHNjb3BlLCByZXF1ZXN0LCBtYXRjaCkge1xuICAgIGNvbnN0IGxpbmUgPSB0aGlzLl9nZXRMaW5lVGV4dEZvclJlcXVlc3QocmVxdWVzdClcbiAgICBjb25zdCBwYXRoUHJlZml4ID0gbGluZS5zdWJzdHIobWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGgpXG4gICAgY29uc3QgdHJhaWxpbmdTbGFzaFByZXNlbnQgPSBwYXRoUHJlZml4Lm1hdGNoKC9bL3xcXFxcXSQvKVxuICAgIGNvbnN0IGRpcmVjdG9yeUdpdmVuID0gcGF0aFByZWZpeC5pbmRleE9mKCcuLycpID09PSAwIHx8IHBhdGhQcmVmaXguaW5kZXhPZignLi4vJykgPT09IDBcbiAgICBjb25zdCBwYXJzZWRQYXRoUHJlZml4ID0gcGF0aC5wYXJzZShwYXRoUHJlZml4KVxuXG4gICAgLy8gcGF0aC5wYXJzZSBpZ25vcmVzIHRyYWlsaW5nIHNsYXNoZXMsIHNvIHdlIGhhbmRsZSB0aGlzIG1hbnVhbGx5XG4gICAgaWYgKHRyYWlsaW5nU2xhc2hQcmVzZW50KSB7XG4gICAgICBwYXJzZWRQYXRoUHJlZml4LmRpciA9IHBhdGguam9pbihwYXJzZWRQYXRoUHJlZml4LmRpciwgcGFyc2VkUGF0aFByZWZpeC5iYXNlKVxuICAgICAgcGFyc2VkUGF0aFByZWZpeC5iYXNlID0gJydcbiAgICAgIHBhcnNlZFBhdGhQcmVmaXgubmFtZSA9ICcnXG4gICAgfVxuXG4gICAgY29uc3QgcHJvamVjdERpcmVjdG9yeSA9IHRoaXMuX2dldFByb2plY3REaXJlY3RvcnkocmVxdWVzdC5lZGl0b3IpXG4gICAgaWYgKCFwcm9qZWN0RGlyZWN0b3J5KSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKVxuICAgIGNvbnN0IGN1cnJlbnREaXJlY3RvcnkgPSBwYXRoLmRpcm5hbWUocmVxdWVzdC5lZGl0b3IuZ2V0UGF0aCgpKVxuXG4gICAgY29uc3QgcmVxdWVzdGVkRGlyZWN0b3J5UGF0aCA9IHBhdGgucmVzb2x2ZShjdXJyZW50RGlyZWN0b3J5LCBwYXJzZWRQYXRoUHJlZml4LmRpcilcblxuICAgIGxldCBmaWxlcyA9IGRpcmVjdG9yeUdpdmVuXG4gICAgICA/IHRoaXMuX3BhdGhzQ2FjaGUuZ2V0RmlsZVBhdGhzRm9yUHJvamVjdERpcmVjdG9yeShwcm9qZWN0RGlyZWN0b3J5LCByZXF1ZXN0ZWREaXJlY3RvcnlQYXRoKVxuICAgICAgOiB0aGlzLl9wYXRoc0NhY2hlLmdldEZpbGVQYXRoc0ZvclByb2plY3REaXJlY3RvcnkocHJvamVjdERpcmVjdG9yeSlcblxuICAgIGNvbnN0IGZ1enp5TWF0Y2hlciA9IGRpcmVjdG9yeUdpdmVuXG4gICAgICA/IHBhcnNlZFBhdGhQcmVmaXguYmFzZVxuICAgICAgOiBwYXRoUHJlZml4XG5cbiAgICBjb25zdCB7IGV4dGVuc2lvbnMgfSA9IHNjb3BlXG4gICAgaWYgKGV4dGVuc2lvbnMpIHtcbiAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgLigke2V4dGVuc2lvbnMuam9pbignfCcpfSkkYClcbiAgICAgIGZpbGVzID0gZmlsZXMuZmlsdGVyKHBhdGggPT4gcmVnZXgudGVzdChwYXRoKSlcbiAgICB9XG5cbiAgICBpZiAoZnV6enlNYXRjaGVyKSB7XG4gICAgICBmaWxlcyA9IGZ1enphbGRyaW4uZmlsdGVyKGZpbGVzLCBmdXp6eU1hdGNoZXIsIHtcbiAgICAgICAgbWF4UmVzdWx0czogMTBcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IHN1Z2dlc3Rpb25zID0gZmlsZXMubWFwKHBhdGhOYW1lID0+IHtcbiAgICAgIGNvbnN0IG5vcm1hbGl6ZVNsYXNoZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wYXRocy5ub3JtYWxpemVTbGFzaGVzJylcblxuICAgICAgY29uc3QgcHJvamVjdFJlbGF0aXZlUGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoTmFtZSlbMV1cbiAgICAgIGxldCBkaXNwbGF5VGV4dCA9IHByb2plY3RSZWxhdGl2ZVBhdGhcbiAgICAgIGlmIChkaXJlY3RvcnlHaXZlbikge1xuICAgICAgICBkaXNwbGF5VGV4dCA9IHBhdGgucmVsYXRpdmUocmVxdWVzdGVkRGlyZWN0b3J5UGF0aCwgcGF0aE5hbWUpXG4gICAgICB9XG4gICAgICBpZiAobm9ybWFsaXplU2xhc2hlcykge1xuICAgICAgICBkaXNwbGF5VGV4dCA9IHNsYXNoKGRpc3BsYXlUZXh0KVxuICAgICAgfVxuXG4gICAgICAvLyBSZWxhdGl2aXplIHBhdGggdG8gY3VycmVudCBmaWxlIGlmIG5lY2Vzc2FyeVxuICAgICAgbGV0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUocGF0aC5kaXJuYW1lKHJlcXVlc3QuZWRpdG9yLmdldFBhdGgoKSksIHBhdGhOYW1lKVxuICAgICAgaWYgKG5vcm1hbGl6ZVNsYXNoZXMpIHJlbGF0aXZlUGF0aCA9IHNsYXNoKHJlbGF0aXZlUGF0aClcbiAgICAgIGlmIChzY29wZS5yZWxhdGl2ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgcGF0aE5hbWUgPSByZWxhdGl2ZVBhdGhcbiAgICAgICAgaWYgKHNjb3BlLmluY2x1ZGVDdXJyZW50RGlyZWN0b3J5ICE9PSBmYWxzZSkge1xuICAgICAgICAgIGlmIChwYXRoTmFtZVswXSAhPT0gJy4nKSB7XG4gICAgICAgICAgICBwYXRoTmFtZSA9IGAuLyR7cGF0aE5hbWV9YFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2NvcGUucHJvamVjdFJlbGF0aXZlUGF0aCkge1xuICAgICAgICBwYXRoTmFtZSA9IHByb2plY3RSZWxhdGl2ZVBhdGhcbiAgICAgIH1cblxuICAgICAgLy8gUmVwbGFjZSBzdHVmZiBpZiBuZWNlc3NhcnlcbiAgICAgIGlmIChzY29wZS5yZXBsYWNlT25JbnNlcnQpIHtcbiAgICAgICAgbGV0IG9yaWdpbmFsUGF0aE5hbWUgPSBwYXRoTmFtZVxuICAgICAgICBzY29wZS5yZXBsYWNlT25JbnNlcnQuZm9yRWFjaCgoW2Zyb20sIHRvXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChmcm9tKVxuICAgICAgICAgIGlmIChyZWdleC50ZXN0KHBhdGhOYW1lKSkge1xuICAgICAgICAgICAgcGF0aE5hbWUgPSBwYXRoTmFtZS5yZXBsYWNlKHJlZ2V4LCB0bylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIENhbGN1bGF0ZSBkaXN0YW5jZSB0byBmaWxlXG4gICAgICBjb25zdCBkaXN0YW5jZVRvRmlsZSA9IHJlbGF0aXZlUGF0aC5zcGxpdChwYXRoLnNlcCkubGVuZ3RoXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiBwYXRoTmFtZSxcbiAgICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHBhdGhQcmVmaXgsXG4gICAgICAgIGRpc3BsYXlUZXh0LFxuICAgICAgICB0eXBlOiAnaW1wb3J0JyxcbiAgICAgICAgaWNvbkhUTUw6ICc8aSBjbGFzcz1cImljb24tZmlsZS1jb2RlXCI+PC9pPicsXG4gICAgICAgIHNjb3JlOiBmdXp6YWxkcmluLnNjb3JlKGRpc3BsYXlUZXh0LCByZXF1ZXN0LnByZWZpeCksXG4gICAgICAgIGRpc3RhbmNlVG9GaWxlXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIE1vZGlmeSBzY29yZSB0byBpbmNvcnBvcmF0ZSBkaXN0YW5jZVxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zQ291bnQgPSBzdWdnZXN0aW9ucy5sZW5ndGhcbiAgICBpZiAoc3VnZ2VzdGlvbnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBtYXhEaXN0YW5jZSA9IF8ubWF4KHN1Z2dlc3Rpb25zLCBzID0+IHMuZGlzdGFuY2VUb0ZpbGUpLmRpc3RhbmNlVG9GaWxlXG4gICAgICBzdWdnZXN0aW9ucy5mb3JFYWNoKChzLCBpKSA9PiB7XG4gICAgICAgIHMuc2NvcmUgPSAoc3VnZ2VzdGlvbnNDb3VudCAtIGkpICsgKG1heERpc3RhbmNlIC0gcy5kaXN0YW5jZVRvRmlsZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNvcnQgYWdhaW5cbiAgICAgIHN1Z2dlc3Rpb25zLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKVxuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoc3VnZ2VzdGlvbnMpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3VnZ2VzdGlvbnMgZm9yIHRoZSBnaXZlbiByZXF1ZXN0XG4gICAqIEBwYXJhbSAge09iamVjdH0gcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgZ2V0U3VnZ2VzdGlvbnMgKHJlcXVlc3QpIHtcbiAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5fc2NvcGVzXG4gICAgICAubWFwKHNjb3BlID0+IFtzY29wZSwgdGhpcy5fc2NvcGVNYXRjaGVzUmVxdWVzdChzY29wZSwgcmVxdWVzdCldKVxuICAgICAgLmZpbHRlcihyZXN1bHQgPT4gcmVzdWx0WzFdKSAvLyBGaWx0ZXIgc2NvcGVzIHRoYXQgbWF0Y2hcbiAgICBjb25zdCBwcm9taXNlcyA9IG1hdGNoZXMubWFwKChbc2NvcGUsIG1hdGNoXSkgPT5cbiAgICAgIHRoaXMuX2dldFN1Z2dlc3Rpb25zRm9yU2NvcGUoc2NvcGUsIHJlcXVlc3QsIG1hdGNoKVxuICAgIClcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICAgIC50aGVuKHN1Z2dlc3Rpb25zID0+IHtcbiAgICAgICAgc3VnZ2VzdGlvbnMgPSBfLmZsYXR0ZW4oc3VnZ2VzdGlvbnMpXG4gICAgICAgIGlmICghc3VnZ2VzdGlvbnMubGVuZ3RoKSByZXR1cm4gZmFsc2VcbiAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zXG4gICAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIFJlYnVpbGRzIHRoZSBjYWNoZVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfVxuICAgKi9cbiAgcmVidWlsZENhY2hlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGF0aHNDYWNoZS5yZWJ1aWxkQ2FjaGUoKVxuICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgdGhpcy5faXNSZWFkeSA9IHRydWVcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwcm9qZWN0IGRpcmVjdG9yeSB0aGF0IGNvbnRhaW5zIHRoZSBmaWxlIG9wZW5lZCBpbiB0aGUgZ2l2ZW4gZWRpdG9yXG4gICAqIEBwYXJhbSAge1RleHRFZGl0b3J9IGVkaXRvclxuICAgKiBAcmV0dXJuIHtEaXJlY3Rvcnl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZ2V0UHJvamVjdERpcmVjdG9yeSAoZWRpdG9yKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0UGF0aCgpXG4gICAgbGV0IHByb2plY3REaXJlY3RvcnkgPSBudWxsXG4gICAgYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKCkuZm9yRWFjaChkaXJlY3RvcnkgPT4ge1xuICAgICAgaWYgKGRpcmVjdG9yeS5jb250YWlucyhmaWxlUGF0aCkpIHtcbiAgICAgICAgcHJvamVjdERpcmVjdG9yeSA9IGRpcmVjdG9yeVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHByb2plY3REaXJlY3RvcnlcbiAgfVxuXG4gIGlzUmVhZHkgKCkgeyByZXR1cm4gdGhpcy5faXNSZWFkeSB9XG5cbiAgZ2V0IHN1Z2dlc3Rpb25Qcmlvcml0eSAoKSB7XG4gICAgcmV0dXJuIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBhdGhzLnN1Z2dlc3Rpb25Qcmlvcml0eScpXG4gIH1cblxuICBnZXQgZmlsZUNvdW50KCkge1xuICAgIHJldHVybiBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5yZWR1Y2UoKGFjY3VtdWxhdGVkLCBkaXJlY3RvcnkpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuX3BhdGhzQ2FjaGUuZ2V0RmlsZVBhdGhzRm9yUHJvamVjdERpcmVjdG9yeShkaXJlY3RvcnkpXG4gICAgICByZXR1cm4gYWNjdW11bGF0ZWQgKyBmaWxlUGF0aHMubGVuZ3RoO1xuICAgIH0sIDApXG4gIH1cblxuICAvKipcbiAgICogRGlzcG9zZXMgdGhpcyBwcm92aWRlclxuICAgKi9cbiAgZGlzcG9zZSAoKSB7XG4gICAgdGhpcy5fcGF0aHNDYWNoZS5yZW1vdmVMaXN0ZW5lcigncmVidWlsZC1jYWNoZScsIHRoaXMuX29uUmVidWlsZENhY2hlKVxuICAgIHRoaXMuX3BhdGhzQ2FjaGUucmVtb3ZlTGlzdGVuZXIoJ3JlYnVpbGQtY2FjaGUtZG9uZScsIHRoaXMuX29uUmVidWlsZENhY2hlRG9uZSlcbiAgICB0aGlzLl9wYXRoc0NhY2hlLmRpc3Bvc2UodHJ1ZSlcbiAgfVxufVxuXG5QYXRoc1Byb3ZpZGVyLnByb3RvdHlwZS5zZWxlY3RvciA9ICcqJ1xuUGF0aHNQcm92aWRlci5wcm90b3R5cGUuaW5jbHVzaW9uUHJpb3JpdHkgPSAxXG4iXX0=