Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* global atom */

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _pathsProvider = require('./paths-provider');

var _pathsProvider2 = _interopRequireDefault(_pathsProvider);

var _atom = require('atom');

var _configOptionScopes = require('./config/option-scopes');

var _configOptionScopes2 = _interopRequireDefault(_configOptionScopes);

'use babel';exports['default'] = {
  config: _config2['default'],
  subscriptions: null,

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'autocomplete-paths:rebuild-cache': function autocompletePathsRebuildCache() {
        _this._provider.rebuildCache();
      }
    }));

    var cacheOptions = ['core.ignoredNames', 'core.excludeVcsIgnoredPaths', 'autocomplete-paths.ignoreSubmodules', 'autocomplete-paths.ignoredNames', 'autocomplete-paths.ignoredPatterns'];
    cacheOptions.forEach(function (cacheOption) {
      _this.subscriptions.add(atom.config.observe(cacheOption, function (value) {
        if (!_this._provider) return;
        _this._provider.rebuildCache();
      }));
    });

    var scopeOptions = ['autocomplete-paths.scopes'];
    for (var key in _configOptionScopes2['default']) {
      scopeOptions.push('autocomplete-paths.' + key);
    }
    scopeOptions.forEach(function (scopeOption) {
      _this.subscriptions.add(atom.config.observe(scopeOption, function (value) {
        if (!_this._provider) return;
        _this._provider.reloadScopes();
      }));
    });
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    if (this._provider) {
      this._provider.dispose();
      this._provider = null;
    }
    if (this._statusBarTile) {
      this._statusBarTile.destroy();
      this._statusBarTile = null;
    }
  },

  /**
   * Invoked when the status bar becomes available
   * @param  {StatusBar} statusBar
   */
  consumeStatusBar: function consumeStatusBar(statusBar) {
    this._statusBar = statusBar;
    if (this._displayStatusBarItemOnConsumption) {
      this._displayStatusBarTile();
    }
  },

  /**
   * Displays the status bar tile
   */
  _displayStatusBarTile: function _displayStatusBarTile() {
    var _this2 = this;

    if (!this._statusBar) {
      this._displayStatusBarItemOnConsumption = true;
      return;
    }
    if (this._statusBarTile) return;

    this._statusBarElement = document.createElement('autocomplete-paths-status-bar');
    this._statusBarElement.innerHTML = 'Rebuilding paths cache...';
    this._statusBarTile = this._statusBar.addRightTile({
      item: this._statusBarElement,
      priority: 100
    });
    this._statusBarInterval = setInterval(function () {
      var fileCount = _this2._provider.fileCount;
      _this2._statusBarElement.innerHTML = 'Rebuilding paths cache... ' + fileCount + ' files';
    }, 500);
  },

  /**
   * Hides the status bar tile
   */
  _hideStatusBarTile: function _hideStatusBarTile() {
    clearInterval(this._statusBarInterval);
    this._statusBarTile && this._statusBarTile.destroy();
    this._statusBarTile = null;
    this._statusBarElement = null;
  },

  getProvider: function getProvider() {
    var _this3 = this;

    if (!this._provider) {
      this._provider = new _pathsProvider2['default']();
      this._provider.on('rebuild-cache', function () {
        _this3._displayStatusBarTile();
      });
      this._provider.on('rebuild-cache-done', function () {
        _this3._hideStatusBarTile();
      });
      this._provider.rebuildCache();
    }
    return this._provider;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvYXV0b2NvbXBsZXRlLXBhdGhzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3NCQUdtQixVQUFVOzs7OzZCQUNILGtCQUFrQjs7OztvQkFDUixNQUFNOztrQ0FDakIsd0JBQXdCOzs7O0FBTmpELFdBQVcsQ0FBQSxxQkFRSTtBQUNiLFFBQU0scUJBQVE7QUFDZCxlQUFhLEVBQUUsSUFBSTs7QUFFbkIsVUFBUSxFQUFFLG9CQUFZOzs7QUFDcEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCx3Q0FBa0MsRUFBRSx5Q0FBTTtBQUN4QyxjQUFLLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtPQUM5QjtLQUNGLENBQUMsQ0FBQyxDQUFBOztBQUVILFFBQU0sWUFBWSxHQUFHLENBQ25CLG1CQUFtQixFQUNuQiw2QkFBNkIsRUFDN0IscUNBQXFDLEVBQ3JDLGlDQUFpQyxFQUNqQyxvQ0FBb0MsQ0FDckMsQ0FBQTtBQUNELGdCQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsV0FBVyxFQUFJO0FBQ2xDLFlBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDL0QsWUFBSSxDQUFDLE1BQUssU0FBUyxFQUFFLE9BQU07QUFDM0IsY0FBSyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUE7T0FDOUIsQ0FBQyxDQUFDLENBQUE7S0FDSixDQUFDLENBQUE7O0FBRUYsUUFBTSxZQUFZLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0FBQ2xELFNBQUssSUFBSSxHQUFHLHFDQUFrQjtBQUM1QixrQkFBWSxDQUFDLElBQUks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QUFDLFlBQVksRUFBRSxDQUFBO0tBQzlCO0FBQ0QsV0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO0dBQ3RCO0NBQ0YiLCJmaWxlIjoiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLXBhdGhzL2xpYi9hdXRvY29tcGxldGUtcGF0aHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyogZ2xvYmFsIGF0b20gKi9cblxuaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZydcbmltcG9ydCBQYXRoc1Byb3ZpZGVyIGZyb20gJy4vcGF0aHMtcHJvdmlkZXInXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBPcHRpb25TY29wZXMgZnJvbSAnLi9jb25maWcvb3B0aW9uLXNjb3BlcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IENvbmZpZyxcbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcblxuICBhY3RpdmF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdhdXRvY29tcGxldGUtcGF0aHM6cmVidWlsZC1jYWNoZSc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fcHJvdmlkZXIucmVidWlsZENhY2hlKClcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIGNvbnN0IGNhY2hlT3B0aW9ucyA9IFtcbiAgICAgICdjb3JlLmlnbm9yZWROYW1lcycsXG4gICAgICAnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJyxcbiAgICAgICdhdXRvY29tcGxldGUtcGF0aHMuaWdub3JlU3VibW9kdWxlcycsXG4gICAgICAnYXV0b2NvbXBsZXRlLXBhdGhzLmlnbm9yZWROYW1lcycsXG4gICAgICAnYXV0b2NvbXBsZXRlLXBhdGhzLmlnbm9yZWRQYXR0ZXJucydcbiAgICBdXG4gICAgY2FjaGVPcHRpb25zLmZvckVhY2goY2FjaGVPcHRpb24gPT4ge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKGNhY2hlT3B0aW9uLCB2YWx1ZSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5fcHJvdmlkZXIpIHJldHVyblxuICAgICAgICB0aGlzLl9wcm92aWRlci5yZWJ1aWxkQ2FjaGUoKVxuICAgICAgfSkpXG4gICAgfSlcblxuICAgIGNvbnN0IHNjb3BlT3B0aW9ucyA9IFsnYXV0b2NvbXBsZXRlLXBhdGhzLnNjb3BlcyddXG4gICAgZm9yIChsZXQga2V5IGluIE9wdGlvblNjb3Blcykge1xuICAgICAgc2NvcGVPcHRpb25zLnB1c2goYGF1dG9jb21wbGV0ZS1wYXRocy4ke2tleX1gKVxuICAgIH1cbiAgICBzY29wZU9wdGlvbnMuZm9yRWFjaChzY29wZU9wdGlvbiA9PiB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoc2NvcGVPcHRpb24sIHZhbHVlID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLl9wcm92aWRlcikgcmV0dXJuXG4gICAgICAgIHRoaXMuX3Byb3ZpZGVyLnJlbG9hZFNjb3BlcygpXG4gICAgICB9KSlcbiAgICB9KVxuICB9LFxuXG4gIGRlYWN0aXZhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuX3Byb3ZpZGVyKSB7XG4gICAgICB0aGlzLl9wcm92aWRlci5kaXNwb3NlKClcbiAgICAgIHRoaXMuX3Byb3ZpZGVyID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy5fc3RhdHVzQmFyVGlsZSkge1xuICAgICAgdGhpcy5fc3RhdHVzQmFyVGlsZS5kZXN0cm95KClcbiAgICAgIHRoaXMuX3N0YXR1c0JhclRpbGUgPSBudWxsXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIHN0YXR1cyBiYXIgYmVjb21lcyBhdmFpbGFibGVcbiAgICogQHBhcmFtICB7U3RhdHVzQmFyfSBzdGF0dXNCYXJcbiAgICovXG4gIGNvbnN1bWVTdGF0dXNCYXI6IGZ1bmN0aW9uIChzdGF0dXNCYXIpIHtcbiAgICB0aGlzLl9zdGF0dXNCYXIgPSBzdGF0dXNCYXJcbiAgICBpZiAodGhpcy5fZGlzcGxheVN0YXR1c0Jhckl0ZW1PbkNvbnN1bXB0aW9uKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5U3RhdHVzQmFyVGlsZSgpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyB0aGUgc3RhdHVzIGJhciB0aWxlXG4gICAqL1xuICBfZGlzcGxheVN0YXR1c0JhclRpbGUgKCkge1xuICAgIGlmICghdGhpcy5fc3RhdHVzQmFyKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5U3RhdHVzQmFySXRlbU9uQ29uc3VtcHRpb24gPSB0cnVlXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuX3N0YXR1c0JhclRpbGUpIHJldHVyblxuXG4gICAgdGhpcy5fc3RhdHVzQmFyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1dG9jb21wbGV0ZS1wYXRocy1zdGF0dXMtYmFyJylcbiAgICB0aGlzLl9zdGF0dXNCYXJFbGVtZW50LmlubmVySFRNTCA9ICdSZWJ1aWxkaW5nIHBhdGhzIGNhY2hlLi4uJ1xuICAgIHRoaXMuX3N0YXR1c0JhclRpbGUgPSB0aGlzLl9zdGF0dXNCYXIuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuX3N0YXR1c0JhckVsZW1lbnQsXG4gICAgICBwcmlvcml0eTogMTAwXG4gICAgfSlcbiAgICB0aGlzLl9zdGF0dXNCYXJJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVDb3VudCA9IHRoaXMuX3Byb3ZpZGVyLmZpbGVDb3VudDtcbiAgICAgIHRoaXMuX3N0YXR1c0JhckVsZW1lbnQuaW5uZXJIVE1MID0gYFJlYnVpbGRpbmcgcGF0aHMgY2FjaGUuLi4gJHtmaWxlQ291bnR9IGZpbGVzYDtcbiAgICB9LCA1MDApXG4gIH0sXG5cbiAgLyoqXG4gICAqIEhpZGVzIHRoZSBzdGF0dXMgYmFyIHRpbGVcbiAgICovXG4gIF9oaWRlU3RhdHVzQmFyVGlsZSAoKSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9zdGF0dXNCYXJJbnRlcnZhbClcbiAgICB0aGlzLl9zdGF0dXNCYXJUaWxlICYmIHRoaXMuX3N0YXR1c0JhclRpbGUuZGVzdHJveSgpXG4gICAgdGhpcy5fc3RhdHVzQmFyVGlsZSA9IG51bGxcbiAgICB0aGlzLl9zdGF0dXNCYXJFbGVtZW50ID0gbnVsbFxuICB9LFxuXG4gIGdldFByb3ZpZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9wcm92aWRlcikge1xuICAgICAgdGhpcy5fcHJvdmlkZXIgPSBuZXcgUGF0aHNQcm92aWRlcigpXG4gICAgICB0aGlzLl9wcm92aWRlci5vbigncmVidWlsZC1jYWNoZScsICgpID0+IHtcbiAgICAgICAgdGhpcy5fZGlzcGxheVN0YXR1c0JhclRpbGUoKVxuICAgICAgfSlcbiAgICAgIHRoaXMuX3Byb3ZpZGVyLm9uKCdyZWJ1aWxkLWNhY2hlLWRvbmUnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2hpZGVTdGF0dXNCYXJUaWxlKClcbiAgICAgIH0pXG4gICAgICB0aGlzLl9wcm92aWRlci5yZWJ1aWxkQ2FjaGUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXJcbiAgfVxufVxuIl19