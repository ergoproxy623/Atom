Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _atom = require('atom');

var _bracketMatcher = require('./bracket-matcher');

var _bracketMatcher2 = _interopRequireDefault(_bracketMatcher);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

exports['default'] = {

  subscriptions: null,
  editors: null,
  brackets: null,
  ignored_files: null,
  repeat_color: null,

  config: {
    brackets: {
      title: 'Brackets to match',
      description: "Should be matching pairs like '()', and '{}'",
      'default': ['{}', '()', '[]'],
      type: 'array',
      items: {
        type: 'string'
      }
    },
    ignored_files: {
      title: 'Ignored files',
      description: 'Files which will not be colorized',
      'default': ['*.md', '.*'],
      type: 'array',
      items: {
        type: 'string'
      }
    },
    repeat_color: {
      title: 'Repeat Color Count',
      description: 'Number of color classes to repeat',
      'default': 9,
      type: 'integer'
    },
    alternate_different: {
      title: 'Alternate Different Brackets',
      description: 'Alternate colors for different brackets',
      'default': false,
      type: 'boolean'
    },
    alternate_consecutive: {
      title: 'Alternate Consecutive Brackets',
      description: 'Alternate colors for consecutive brackets',
      'default': false,
      type: 'boolean'
    }
  },

  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();
    this.editors = new WeakMap();
    this.brackets = atom.config.get('bracket-colorizer.brackets');
    this.ignored_files = atom.config.get('bracket-colorizer.ignored_files');
    this.repeat_color = atom.config.get('bracket-colorizer.repeat_color');
    this.alternate_different = atom.config.get('bracket-colorizer.alternate_different');
    this.alternate_consecutive = atom.config.get('bracket-colorizer.alternate_consecutive');

    this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function () {
      return _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.brackets', function (_ref) {
      var newValue = _ref.newValue;

      _this.brackets = newValue;
      _this.cleanAll();
      _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.ignored_files', function (_ref2) {
      var newValue = _ref2.newValue;

      _this.ignored_files = newValue;
      _this.cleanAll();
      _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.repeat_color', function (_ref3) {
      var newValue = _ref3.newValue;

      _this.repeat_color = newValue;
      _this.cleanAll();
      _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.alternate_different', function (_ref4) {
      var newValue = _ref4.newValue;

      _this.alternate_different = newValue;
      _this.cleanAll();
      _this.processEditor();
    }));
    this.subscriptions.add(atom.config.onDidChange('bracket-colorizer.alternate_consecutive', function (_ref5) {
      var newValue = _ref5.newValue;

      _this.alternate_consecutive = newValue;
      _this.cleanAll();
      _this.processEditor();
    }));

    this.processEditor();
  },

  deactivate: function deactivate() {
    this.cleanAll();
    this.subscriptions.dispose();
  },

  processEditor: function processEditor() {
    var _this2 = this;

    var editor = atom.workspace.getActiveTextEditor();
    if (!editor || this.editors.has(editor)) {
      return;
    }

    var file = editor.buffer.file;
    if (!file) {
      return;
    }
    if (file.path) {
      for (var _name of this.ignored_files) {
        if ((0, _minimatch2['default'])(_path2['default'].basename(file.path), _name)) {
          return;
        }
      }
    }

    var editorObj = {
      subscriptions: new _atom.CompositeDisposable(),
      bracketMatcher: new _bracketMatcher2['default'](editor, {
        brackets: this.brackets,
        repeatColorCount: this.repeat_color,
        alternateDifferent: this.alternate_different,
        alternateConsecutive: this.alternate_consecutive
      })
    };
    editorObj.subscriptions.add(editor.onDidStopChanging(function () {
      editorObj.bracketMatcher.refresh();
    }));
    editorObj.subscriptions.add(editor.onDidTokenize(function () {
      editorObj.bracketMatcher.refresh();
    }));
    editorObj.subscriptions.add(editor.onDidDestroy(function () {
      editorObj.bracketMatcher.destroy();
      editorObj.subscriptions.dispose();
      _this2.editors['delete'](editor);
    }));
    this.editors.set(editor, editorObj);
  },

  cleanAll: function cleanAll() {
    var _this3 = this;

    atom.workspace.getTextEditors().forEach(function (editor) {
      if (!_this3.editors.has(editor)) {
        return;
      }
      var editorObj = _this3.editors.get(editor);
      editorObj.bracketMatcher.destroy();
      editorObj.subscriptions.dispose();
      _this3.editors['delete'](editor);
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2JyYWNrZXQtY29sb3JpemVyL2xpYi9icmFja2V0LWNvbG9yaXplci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7OEJBQ2YsbUJBQW1COzs7O3lCQUN4QixXQUFXOzs7O29CQUNoQixNQUFNOzs7O3FCQUVSOztBQUViLGVBQWEsRUFBRSxJQUFJO0FBQ25CLFNBQU8sRUFBRSxJQUFJO0FBQ2IsVUFBUSxFQUFFLElBQUk7QUFDZCxlQUFhLEVBQUUsSUFBSTtBQUNuQixjQUFZLEVBQUUsSUFBSTs7QUFFbEIsUUFBTSxFQUFFO0FBQ04sWUFBUSxFQUFFO0FBQ1IsV0FBSyxFQUFFLG1CQUFtQjtBQUMxQixpQkFBVyxFQUFFLDhDQUE4QztBQUMzRCxpQkFBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQzNCLFVBQUksRUFBRSxPQUFPO0FBQ2IsV0FBSyxFQUFFO0FBQ0wsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0FBQ0QsaUJBQWEsRUFBRTtBQUNiLFdBQUssRUFBRSxlQUFlO0FBQ3RCLGlCQUFXLEVBQUUsbUNBQW1DO0FBQ2hELGlCQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztBQUN2QixVQUFJLEVBQUUsT0FBTztBQUNiLFdBQUssRUFBRTtBQUNMLFlBQUksRUFBRSxRQUFRO09BQ2Y7S0FDRjtBQUNELGdCQUFZLEVBQUU7QUFDWixXQUFLLEVBQUUsb0JBQW9CO0FBQzNCLGlCQUFXLEVBQUUsbUNBQW1DO0FBQ2hELGlCQUFTLENBQUM7QUFDVixVQUFJLEVBQUUsU0FBUztLQUNoQjtBQUNELHVCQUFtQixFQUFFO0FBQ25CLFdBQUssRUFBRSw4QkFBOEI7QUFDckMsaUJBQVcsRUFBRSx5Q0FBeUM7QUFDdEQsaUJBQVMsS0FBSztBQUNkLFVBQUksRUFBRSxTQUFTO0tBQ2hCO0FBQ0QseUJBQXFCLEVBQUU7QUFDckIsV0FBSyxFQUFFLGdDQUFn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QUUsQ0FBQztLQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNKLGFBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBTTtBQUNyRCxlQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ0osYUFBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQ3BELGVBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkMsZUFBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQyxhQUFLLE9BQU8sVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdCLENBQUMsQ0FBQyxDQUFDO0FBQ0osUUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0dBQ3JDOztBQUVELFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsUUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDbEQsVUFBSSxDQUFDLE9BQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM3QixlQUFPO09BQ1I7QUFDRCxVQUFNLFNBQVMsR0FBRyxPQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsZUFBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQyxlQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xDLGFBQUssT0FBTyxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0IsQ0FBQyxDQUFDO0dBQ0o7Q0FDRiIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9icmFja2V0LWNvbG9yaXplci9saWIvYnJhY2tldC1jb2xvcml6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBCcmFja2V0TWF0Y2hlciBmcm9tICcuL2JyYWNrZXQtbWF0Y2hlcic7XG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIGVkaXRvcnM6IG51bGwsXG4gIGJyYWNrZXRzOiBudWxsLFxuICBpZ25vcmVkX2ZpbGVzOiBudWxsLFxuICByZXBlYXRfY29sb3I6IG51bGwsXG5cbiAgY29uZmlnOiB7XG4gICAgYnJhY2tldHM6IHtcbiAgICAgIHRpdGxlOiAnQnJhY2tldHMgdG8gbWF0Y2gnLFxuICAgICAgZGVzY3JpcHRpb246IFwiU2hvdWxkIGJlIG1hdGNoaW5nIHBhaXJzIGxpa2UgJygpJywgYW5kICd7fSdcIixcbiAgICAgIGRlZmF1bHQ6IFsne30nLCAnKCknLCAnW10nXSxcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBpdGVtczoge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfVxuICAgIH0sXG4gICAgaWdub3JlZF9maWxlczoge1xuICAgICAgdGl0bGU6ICdJZ25vcmVkIGZpbGVzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRmlsZXMgd2hpY2ggd2lsbCBub3QgYmUgY29sb3JpemVkJyxcbiAgICAgIGRlZmF1bHQ6IFsnKi5tZCcsICcuKiddLFxuICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgIGl0ZW1zOiB7XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9XG4gICAgfSxcbiAgICByZXBlYXRfY29sb3I6IHtcbiAgICAgIHRpdGxlOiAnUmVwZWF0IENvbG9yIENvdW50JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIGNvbG9yIGNsYXNzZXMgdG8gcmVwZWF0JyxcbiAgICAgIGRlZmF1bHQ6IDksXG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICB9LFxuICAgIGFsdGVybmF0ZV9kaWZmZXJlbnQ6IHtcbiAgICAgIHRpdGxlOiAnQWx0ZXJuYXRlIERpZmZlcmVudCBCcmFja2V0cycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FsdGVybmF0ZSBjb2xvcnMgZm9yIGRpZmZlcmVudCBicmFja2V0cycsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIH0sXG4gICAgYWx0ZXJuYXRlX2NvbnNlY3V0aXZlOiB7XG4gICAgICB0aXRsZTogJ0FsdGVybmF0ZSBDb25zZWN1dGl2ZSBCcmFja2V0cycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FsdGVybmF0ZSBjb2xvcnMgZm9yIGNvbnNlY3V0aXZlIGJyYWNrZXRzJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgfSxcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIHRoaXMuZWRpdG9ycyA9IG5ldyBXZWFrTWFwKCk7XG4gICAgdGhpcy5icmFja2V0cyA9IGF0b20uY29uZmlnLmdldCgnYnJhY2tldC1jb2xvcml6ZXIuYnJhY2tldHMnKTtcbiAgICB0aGlzLmlnbm9yZWRfZmlsZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ2JyYWNrZXQtY29sb3JpemVyLmlnbm9yZWRfZmlsZXMnKTtcbiAgICB0aGlzLnJlcGVhdF9jb2xvciA9IGF0b20uY29uZmlnLmdldCgnYnJhY2tldC1jb2xvcml6ZXIucmVwZWF0X2NvbG9yJyk7XG4gICAgdGhpcy5hbHRlcm5hdGVfZGlmZmVyZW50ID0gYXRvbS5jb25maWcuZ2V0KCdicmFja2V0LWNvbG9yaXplci5hbHRlcm5hdGVfZGlmZmVyZW50Jyk7XG4gICAgdGhpcy5hbHRlcm5hdGVfY29uc2VjdXRpdmUgPSBhdG9tLmNvbmZpZy5nZXQoJ2JyYWNrZXQtY29sb3JpemVyLmFsdGVybmF0ZV9jb25zZWN1dGl2ZScpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtKCgpID0+IHRoaXMucHJvY2Vzc0VkaXRvcigpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYnJhY2tldC1jb2xvcml6ZXIuYnJhY2tldHMnLCAoe25ld1ZhbHVlfSkgPT4ge1xuICAgICAgdGhpcy5icmFja2V0cyA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5jbGVhbkFsbCgpO1xuICAgICAgdGhpcy5wcm9jZXNzRWRpdG9yKCk7XG4gICAgfSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2JyYWNrZXQtY29sb3JpemVyLmlnbm9yZWRfZmlsZXMnLCAoe25ld1ZhbHVlfSkgPT4ge1xuICAgICAgdGhpcy5pZ25vcmVkX2ZpbGVzID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLmNsZWFuQWxsKCk7XG4gICAgICB0aGlzLnByb2Nlc3NFZGl0b3IoKTtcbiAgICB9KSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYnJhY2tldC1jb2xvcml6ZXIucmVwZWF0X2NvbG9yJywgKHtuZXdWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMucmVwZWF0X2NvbG9yID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLmNsZWFuQWxsKCk7XG4gICAgICB0aGlzLnByb2Nlc3NFZGl0b3IoKTtcbiAgICB9KSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYnJhY2tldC1jb2xvcml6ZXIuYWx0ZXJuYXRlX2RpZmZlcmVudCcsICh7bmV3VmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmFsdGVybmF0ZV9kaWZmZXJlbnQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuY2xlYW5BbGwoKTtcbiAgICAgIHRoaXMucHJvY2Vzc0VkaXRvcigpO1xuICAgIH0pKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdicmFja2V0LWNvbG9yaXplci5hbHRlcm5hdGVfY29uc2VjdXRpdmUnLCAoe25ld1ZhbHVlfSkgPT4ge1xuICAgICAgdGhpcy5hbHRlcm5hdGVfY29uc2VjdXRpdmUgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuY2xlYW5BbGwoKTtcbiAgICAgIHRoaXMucHJvY2Vzc0VkaXRvcigpO1xuICAgIH0pKTtcblxuICAgIHRoaXMucHJvY2Vzc0VkaXRvcigpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5jbGVhbkFsbCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvY2Vzc0VkaXRvcigpIHtcbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgaWYgKCFlZGl0b3IgfHwgdGhpcy5lZGl0b3JzLmhhcyhlZGl0b3IpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZpbGUgPSBlZGl0b3IuYnVmZmVyLmZpbGU7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmaWxlLnBhdGgpIHtcbiAgICAgIGZvciAobGV0IG5hbWUgb2YgdGhpcy5pZ25vcmVkX2ZpbGVzKSB7XG4gICAgICAgIGlmIChtaW5pbWF0Y2gocGF0aC5iYXNlbmFtZShmaWxlLnBhdGgpLCBuYW1lKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVkaXRvck9iaiA9IHtcbiAgICAgIHN1YnNjcmlwdGlvbnM6IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCksXG4gICAgICBicmFja2V0TWF0Y2hlcjogbmV3IEJyYWNrZXRNYXRjaGVyKGVkaXRvciwge1xuICAgICAgICBicmFja2V0czogdGhpcy5icmFja2V0cyxcbiAgICAgICAgcmVwZWF0Q29sb3JDb3VudDogdGhpcy5yZXBlYXRfY29sb3IsXG4gICAgICAgIGFsdGVybmF0ZURpZmZlcmVudDogdGhpcy5hbHRlcm5hdGVfZGlmZmVyZW50LFxuICAgICAgICBhbHRlcm5hdGVDb25zZWN1dGl2ZTogdGhpcy5hbHRlcm5hdGVfY29uc2VjdXRpdmUsXG4gICAgICB9KSxcbiAgICB9O1xuICAgIGVkaXRvck9iai5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3Iub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT4ge1xuICAgICAgZWRpdG9yT2JqLmJyYWNrZXRNYXRjaGVyLnJlZnJlc2goKTtcbiAgICB9KSk7XG4gICAgZWRpdG9yT2JqLnN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvci5vbkRpZFRva2VuaXplKCgpID0+IHtcbiAgICAgIGVkaXRvck9iai5icmFja2V0TWF0Y2hlci5yZWZyZXNoKCk7XG4gICAgfSkpO1xuICAgIGVkaXRvck9iai5zdWJzY3JpcHRpb25zLmFkZChlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIGVkaXRvck9iai5icmFja2V0TWF0Y2hlci5kZXN0cm95KCk7XG4gICAgICBlZGl0b3JPYmouc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmVkaXRvcnMuZGVsZXRlKGVkaXRvcik7XG4gICAgfSkpO1xuICAgIHRoaXMuZWRpdG9ycy5zZXQoZWRpdG9yLCBlZGl0b3JPYmopO1xuICB9LFxuXG4gIGNsZWFuQWxsKCkge1xuICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaCgoZWRpdG9yKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZWRpdG9ycy5oYXMoZWRpdG9yKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBlZGl0b3JPYmogPSB0aGlzLmVkaXRvcnMuZ2V0KGVkaXRvcik7XG4gICAgICBlZGl0b3JPYmouYnJhY2tldE1hdGNoZXIuZGVzdHJveSgpO1xuICAgICAgZWRpdG9yT2JqLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5lZGl0b3JzLmRlbGV0ZShlZGl0b3IpO1xuICAgIH0pO1xuICB9XG59O1xuIl19