'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AutocompleteModulesPlugin = (function () {
  function AutocompleteModulesPlugin() {
    _classCallCheck(this, AutocompleteModulesPlugin);

    this.config = require('./package-configs').registrar;
    this.completionProvider = null;
  }

  _createClass(AutocompleteModulesPlugin, [{
    key: 'activate',
    value: function activate() {
      this.completionProvider = new (require('./completion-provider'))();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      delete this.completionProvider;
      this.completionProvider = null;
    }
  }, {
    key: 'getCompletionProvider',
    value: function getCompletionProvider() {
      return this.completionProvider;
    }
  }]);

  return AutocompleteModulesPlugin;
})();

module.exports = new AutocompleteModulesPlugin();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1tb2R1bGVzL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7O0lBRU4seUJBQXlCO0FBQ2xCLFdBRFAseUJBQXlCLEdBQ2Y7MEJBRFYseUJBQXlCOztBQUUzQixRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUNyRCxRQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0dBQ2hDOztlQUpHLHlCQUF5Qjs7V0FNckIsb0JBQUc7QUFDVCxVQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxPQUFPLENBQUMsdUJBQXVCLEVBQUMsRUFBQyxDQUFDO0tBQ2xFOzs7V0FFUyxzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0FBQy9CLFVBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7S0FDaEM7OztXQUVvQixpQ0FBRztBQUN0QixhQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztLQUNoQzs7O1NBakJHLHlCQUF5Qjs7O0FBb0IvQixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUkseUJBQXlCLEVBQUUsQ0FBQyIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtbW9kdWxlcy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jbGFzcyBBdXRvY29tcGxldGVNb2R1bGVzUGx1Z2luIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25maWcgPSByZXF1aXJlKCcuL3BhY2thZ2UtY29uZmlncycpLnJlZ2lzdHJhcjtcbiAgICB0aGlzLmNvbXBsZXRpb25Qcm92aWRlciA9IG51bGw7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmNvbXBsZXRpb25Qcm92aWRlciA9IG5ldyAocmVxdWlyZSgnLi9jb21wbGV0aW9uLXByb3ZpZGVyJykpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBkZWxldGUgdGhpcy5jb21wbGV0aW9uUHJvdmlkZXI7XG4gICAgdGhpcy5jb21wbGV0aW9uUHJvdmlkZXIgPSBudWxsO1xuICB9XG5cbiAgZ2V0Q29tcGxldGlvblByb3ZpZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNvbXBsZXRpb25Qcm92aWRlcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBBdXRvY29tcGxldGVNb2R1bGVzUGx1Z2luKCk7XG4iXX0=