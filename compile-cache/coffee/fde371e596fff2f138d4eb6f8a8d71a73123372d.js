(function() {
  var $, ActivityLogger, BufferedProcess, CompositeDisposable, Os, Path, Repository, TagCreateView, TextEditorView, View, fs, git, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, CompositeDisposable = ref.CompositeDisposable;

  ref1 = require('atom-space-pen-views'), $ = ref1.$, TextEditorView = ref1.TextEditorView, View = ref1.View;

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  git = require('../git-es')["default"];

  module.exports = TagCreateView = (function(superClass) {
    extend(TagCreateView, superClass);

    function TagCreateView() {
      return TagCreateView.__super__.constructor.apply(this, arguments);
    }

    TagCreateView.content = function() {
      return this.div((function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagName', new TextEditorView({
              mini: true,
              placeholderText: 'Tag'
            }));
          });
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagMessage', new TextEditorView({
              mini: true,
              placeholderText: 'Annotation message'
            }));
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight gp-confirm-button',
                click: 'createTag'
              }, 'Create Tag');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight gp-cancel-button',
                click: 'destroy'
              }, 'Cancel');
            });
          });
        };
      })(this));
    };

    TagCreateView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.tagName.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.createTag();
          };
        })(this)
      }));
    };

    TagCreateView.prototype.createTag = function() {
      var flag, repoName, tag;
      tag = {
        name: this.tagName.getModel().getText(),
        message: this.tagMessage.getModel().getText()
      };
      flag = atom.config.get('git-plus.tags.signTags') ? '-s' : '-a';
      repoName = new Repository(this.repo).getName();
      git(['tag', flag, tag.name, '-m', tag.message], {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(result) {
        return ActivityLogger.record(Object.assign({
          repoName: repoName,
          message: "Create tag '" + tag.name + "'"
        }, result));
      });
      return this.destroy();
    };

    TagCreateView.prototype.destroy = function() {
      var ref2;
      if ((ref2 = this.panel) != null) {
        ref2.destroy();
      }
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    return TagCreateView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3RhZy1jcmVhdGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHNJQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUVMLE1BQXlDLE9BQUEsQ0FBUSxNQUFSLENBQXpDLEVBQUMscUNBQUQsRUFBa0I7O0VBQ2xCLE9BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFVBQUQsRUFBSSxvQ0FBSixFQUFvQjs7RUFDcEIsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVIsQ0FBb0IsRUFBQyxPQUFEOztFQUUxQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDSCxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQTttQkFDbkIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxTQUFULEVBQW9CLElBQUksY0FBSixDQUFtQjtjQUFBLElBQUEsRUFBTSxJQUFOO2NBQVksZUFBQSxFQUFpQixLQUE3QjthQUFuQixDQUFwQjtVQURtQixDQUFyQjtVQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBO21C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Q00sU0FBQyxNQUFEO2VBQ0osY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztVQUFDLFVBQUEsUUFBRDtVQUFXLE9BQUEsRUFBUyxjQUFBLEdBQWUsR0FBRyxDQUFDLElBQW5CLEdBQXdCLEdBQTVDO1NBQWQsRUFBK0QsTUFBL0QsQ0FBdEI7TUFESSxDQUROO2FBR0EsSUFBQyxDQUFBLE9BQUQsQ0FBQTtJQVBTOzs0QkFTWCxPQUFBLEdBQVMsU0FBQTtBQUNQLFVBQUE7O1lBQU0sQ0FBRSxPQUFSLENBQUE7O01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQTtJQUhPOzs7O0tBL0JpQjtBQVg1QiIsInNvdXJjZXNDb250ZW50IjpbIk9zID0gcmVxdWlyZSAnb3MnXG5QYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxue0J1ZmZlcmVkUHJvY2VzcywgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFRleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcbmdpdCA9IHJlcXVpcmUoJy4uL2dpdC1lcycpLmRlZmF1bHRcblxubW9kdWxlLmV4cG9ydHM9XG5jbGFzcyBUYWdDcmVhdGVWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2ID0+XG4gICAgICBAZGl2IGNsYXNzOiAnYmxvY2snLCA9PlxuICAgICAgICBAc3VidmlldyAndGFnTmFtZScsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdUYWcnKVxuICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJywgPT5cbiAgICAgICAgQHN1YnZpZXcgJ3RhZ01lc3NhZ2UnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnQW5ub3RhdGlvbiBtZXNzYWdlJylcbiAgICAgIEBkaXYgY2xhc3M6ICdibG9jaycsID0+XG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1sZWZ0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBncC1jb25maXJtLWJ1dHRvbicsIGNsaWNrOiAnY3JlYXRlVGFnJywgJ0NyZWF0ZSBUYWcnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGdwLWNhbmNlbC1idXR0b24nLCBjbGljazogJ2Rlc3Ryb3knLCAnQ2FuY2VsJ1xuXG4gIGluaXRpYWxpemU6IChAcmVwbykgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEB0YWdOYW1lLmZvY3VzKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJzogPT4gQGRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjb25maXJtJzogPT4gQGNyZWF0ZVRhZygpXG5cbiAgY3JlYXRlVGFnOiAtPlxuICAgIHRhZyA9IG5hbWU6IEB0YWdOYW1lLmdldE1vZGVsKCkuZ2V0VGV4dCgpLCBtZXNzYWdlOiBAdGFnTWVzc2FnZS5nZXRNb2RlbCgpLmdldFRleHQoKVxuICAgIGZsYWcgPSBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnRhZ3Muc2lnblRhZ3MnKSB0aGVuICctcycgZWxzZSAnLWEnXG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgZ2l0KFsndGFnJywgZmxhZywgdGFnLm5hbWUsICctbScsIHRhZy5tZXNzYWdlXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZChPYmplY3QuYXNzaWduKHtyZXBvTmFtZSwgbWVzc2FnZTogXCJDcmVhdGUgdGFnICcje3RhZy5uYW1lfSdcIn0sIHJlc3VsdCkpXG4gICAgQGRlc3Ryb3koKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGN1cnJlbnRQYW5lLmFjdGl2YXRlKClcbiJdfQ==
