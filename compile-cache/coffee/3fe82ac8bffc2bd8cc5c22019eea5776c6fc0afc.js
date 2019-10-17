(function() {
  var $, ActivityLogger, CompositeDisposable, InputView, Repository, TextEditorView, View, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div({
        "class": 'git-branch'
      }, (function(_this) {
        return function() {
          return _this.subview('branchEditor', new TextEditorView({
            mini: true,
            placeholderText: 'New branch name'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.panel.show();
      this.branchEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(event) {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function(event) {
            return _this.createBranch();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      this.panel.destroy();
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    InputView.prototype.createBranch = function() {
      var message, name, repoName;
      this.destroy();
      name = this.branchEditor.getModel().getText();
      if (name.length > 0) {
        message = "checkout to new branch '" + name + "'";
        repoName = new Repository(this.repo).getName();
        return git.cmd(['checkout', '-b', name], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(output) {
            ActivityLogger.record({
              repoName: repoName,
              message: message,
              output: output
            });
            return git.refresh(_this.repo);
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            return ActivityLogger.record({
              repoName: repoName,
              message: message,
              output: err,
              failed: true
            });
          };
        })(this));
      }
    };

    return InputView;

  })(View);

  module.exports = function(repo) {
    return new InputView(repo);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY2hlY2tvdXQtbmV3LWJyYW5jaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZGQUFBO0lBQUE7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBRCxFQUFJLG1DQUFKLEVBQW9COztFQUNwQixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUUvQjs7Ozs7OztJQUNKLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7T0FBTCxFQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3hCLEtBQUMsQ0FBQSxPQUFELENBQVMsY0FBVCxFQUF5QixJQUFJLGNBQUosQ0FBbUI7WUFBQSxJQUFBLEVBQU0sSUFBTjtZQUFZLGVBQUEsRUFBaUIsaUJBQTdCO1dBQW5CLENBQXpCO1FBRHdCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtJQURROzt3QkFJVixVQUFBLEdBQVksU0FBQyxLQUFEO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTtNQUNmLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQU47T0FBN0I7TUFDVCxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtNQUVBLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7UUFBQSxhQUFBLEVBQWUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxLQUFEO21CQUFXLEtBQUMsQ0FBQSxPQUFELENBQUE7VUFBWDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtPQUF0QyxDQUFqQjthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO1FBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7bUJBQVcsS0FBQyxDQUFBLFlBQUQsQ0FBQTtVQUFYO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtPQUF0QyxDQUFqQjtJQVJVOzt3QkFVWixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQTtJQUhPOzt3QkFLVCxZQUFBLEdBQWMsU0FBQTtBQUNaLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxDQUFBO01BQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxZQUFZLENBQUMsUUFBZCxDQUFBLENBQXdCLENBQUMsT0FBekIsQ0FBQTtNQUNQLElBQUcsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUFqQjtRQUNFLE9BQUEsR0FBVSwwQkFBQSxHQUE2QixJQUE3QixHQUFrQztRQUM1QyxRQUFBLEdBQVcsSUFBSSxVQUFKLENBQWUsSUFBQyxDQUFBLElBQWhCLENBQXFCLENBQUMsT0FBdEIsQ0FBQTtlQUNYLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUFSLEVBQWtDO1VBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO1NBQWxDLENBQ0EsQ0FBQyxJQURELENBQ00sQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxNQUFEO1lBQ0osY0FBYyxDQUFDLE1BQWYsQ0FBc0I7Y0FBQyxVQUFBLFFBQUQ7Y0FBVyxTQUFBLE9BQVg7Y0FBb0IsUUFBQSxNQUFwQjthQUF0QjttQkFDQSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQUMsQ0FBQSxJQUFiO1VBRkk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FJQSxFQUFDLEtBQUQsRUFKQSxDQUlPLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsR0FBRDttQkFDTCxjQUFjLENBQUMsTUFBZixDQUFzQjtjQUFDLFVBQUEsUUFBRDtjQUFXLFNBQUEsT0FBWDtjQUFvQixNQUFBLEVBQVEsR0FBNUI7Y0FBaUMsTUFBQSxFQUFRLElBQXpDO2FBQXRCO1VBREs7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlAsRUFIRjs7SUFIWTs7OztLQXBCUTs7RUFpQ3hCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtXQUFVLElBQUksU0FBSixDQUFjLElBQWQ7RUFBVjtBQXZDakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFRleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblxuY2xhc3MgSW5wdXRWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAnZ2l0LWJyYW5jaCcsID0+XG4gICAgICBAc3VidmlldyAnYnJhbmNoRWRpdG9yJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ05ldyBicmFuY2ggbmFtZScpXG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgQHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcblxuICAgIEBicmFuY2hFZGl0b3IuZm9jdXMoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnOiAoZXZlbnQpID0+IEBkZXN0cm95KClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y29uZmlybSc6IChldmVudCkgPT4gQGNyZWF0ZUJyYW5jaCgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAcGFuZWwuZGVzdHJveSgpXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIEBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpXG5cbiAgY3JlYXRlQnJhbmNoOiAtPlxuICAgIEBkZXN0cm95KClcbiAgICBuYW1lID0gQGJyYW5jaEVkaXRvci5nZXRNb2RlbCgpLmdldFRleHQoKVxuICAgIGlmIG5hbWUubGVuZ3RoID4gMFxuICAgICAgbWVzc2FnZSA9IFwiXCJcImNoZWNrb3V0IHRvIG5ldyBicmFuY2ggJyN7bmFtZX0nXCJcIlwiXG4gICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICAgIGdpdC5jbWQoWydjaGVja291dCcsICctYicsIG5hbWVdLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChvdXRwdXQpID0+XG4gICAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2UsIG91dHB1dH0pXG4gICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAuY2F0Y2ggKGVycikgPT5cbiAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZSwgb3V0cHV0OiBlcnIsIGZhaWxlZDogdHJ1ZX0pXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+IG5ldyBJbnB1dFZpZXcocmVwbylcbiJdfQ==
