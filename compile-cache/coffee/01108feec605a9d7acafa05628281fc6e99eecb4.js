(function() {
  var $, ActivityLogger, CompositeDisposable, InputView, Repository, TextEditorView, View, git, git2, ref, runCommand,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  git2 = require('../git-es')["default"];

  Repository = require('../repository')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  runCommand = function(repo, args) {
    var promise, repoName;
    repoName = new Repository(repo).getName();
    promise = git2(args, {
      cwd: repo.getWorkingDirectory(),
      color: true
    });
    promise.then(function(result) {
      ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: "" + (args.join(' '))
      }, result));
      return git.refresh(repo);
    });
    return promise;
  };

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeholderText: 'Git command and arguments'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.commandEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            var ref1;
            if ((ref1 = _this.panel) != null) {
              ref1.destroy();
            }
            _this.currentPane.activate();
            return _this.disposables.dispose();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          var ref1;
          _this.disposables.dispose();
          if ((ref1 = _this.panel) != null) {
            ref1.destroy();
          }
          return runCommand(_this.repo, _this.commandEditor.getText().split(' ')).then(function() {
            _this.currentPane.activate();
            return git.refresh(_this.repo);
          });
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = function(repo, args) {
    if (args == null) {
      args = [];
    }
    if (args.length > 0) {
      return runCommand(repo, args.split(' '));
    } else {
      return new InputView(repo);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcnVuLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsK0dBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksbUNBQUosRUFBb0I7O0VBRXBCLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixJQUFBLEdBQU8sT0FBQSxDQUFRLFdBQVIsQ0FBb0IsRUFBQyxPQUFEOztFQUMzQixVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBRTlDLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxJQUFQO0FBQ1gsUUFBQTtJQUFBLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBQTtJQUNYLE9BQUEsR0FBVSxJQUFBLENBQUssSUFBTCxFQUFXO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7TUFBaUMsS0FBQSxFQUFPLElBQXhDO0tBQVg7SUFDVixPQUFPLENBQUMsSUFBUixDQUFhLFNBQUMsTUFBRDtNQUNYLGNBQWMsQ0FBQyxNQUFmLENBQXNCLE1BQU0sQ0FBQyxNQUFQLENBQWM7UUFBQyxVQUFBLFFBQUQ7UUFBVyxPQUFBLEVBQVMsRUFBQSxHQUFFLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQUQsQ0FBdEI7T0FBZCxFQUF3RCxNQUF4RCxDQUF0QjthQUNBLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWjtJQUZXLENBQWI7QUFHQSxXQUFPO0VBTkk7O0VBUVA7Ozs7Ozs7SUFDSixTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSCxLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBMEIsSUFBSSxjQUFKLENBQW1CO1lBQUEsSUFBQSxFQUFNLElBQU47WUFBWSxlQUFBLEVBQWlCLDJCQUE3QjtXQUFuQixDQUExQjtRQURHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMO0lBRFE7O3dCQUlWLFVBQUEsR0FBWSxTQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBOztRQUNmLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxLQUFmLENBQUE7TUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztRQUFBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7QUFDcEUsZ0JBQUE7O2tCQUFNLENBQUUsT0FBUixDQUFBOztZQUNBLEtBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBO21CQUNBLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO1VBSG9FO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO09BQXRDLENBQWpCO2FBS0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0MsY0FBdEMsRUFBc0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLENBQUQ7QUFDckUsY0FBQTtVQUFBLEtBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBOztnQkFDTSxDQUFFLE9BQVIsQ0FBQTs7aUJBQ0EsVUFBQSxDQUFXLEtBQUMsQ0FBQSxJQUFaLEVBQWtCLEtBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBQXdCLENBQUMsS0FBekIsQ0FBK0IsR0FBL0IsQ0FBbEIsQ0FBc0QsQ0FBQyxJQUF2RCxDQUE0RCxTQUFBO1lBQzFELEtBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBO21CQUNBLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBQyxDQUFBLElBQWI7VUFGMEQsQ0FBNUQ7UUFIcUU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRELENBQWpCO0lBWlU7Ozs7S0FMVTs7RUF3QnhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLElBQVA7O01BQU8sT0FBSzs7SUFDM0IsSUFBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWpCO2FBQ0UsVUFBQSxDQUFXLElBQVgsRUFBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQWpCLEVBREY7S0FBQSxNQUFBO2FBR0UsSUFBSSxTQUFKLENBQWMsSUFBZCxFQUhGOztFQURlO0FBeENqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbmdpdDIgPSByZXF1aXJlKCcuLi9naXQtZXMnKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuXG5ydW5Db21tYW5kID0gKHJlcG8sIGFyZ3MpIC0+XG4gIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gIHByb21pc2UgPSBnaXQyKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIGNvbG9yOiB0cnVlKVxuICBwcm9taXNlLnRoZW4gKHJlc3VsdCkgLT5cbiAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoT2JqZWN0LmFzc2lnbih7cmVwb05hbWUsIG1lc3NhZ2U6IFwiI3thcmdzLmpvaW4oJyAnKX1cIn0sIHJlc3VsdCkpXG4gICAgZ2l0LnJlZnJlc2ggcmVwb1xuICByZXR1cm4gcHJvbWlzZVxuXG5jbGFzcyBJbnB1dFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgPT5cbiAgICAgIEBzdWJ2aWV3ICdjb21tYW5kRWRpdG9yJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ0dpdCBjb21tYW5kIGFuZCBhcmd1bWVudHMnKVxuXG4gIGluaXRpYWxpemU6IChAcmVwbykgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBjb21tYW5kRWRpdG9yLmZvY3VzKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnOiAoZSkgPT5cbiAgICAgIEBwYW5lbD8uZGVzdHJveSgpXG4gICAgICBAY3VycmVudFBhbmUuYWN0aXZhdGUoKVxuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNvbmZpcm0nLCAoZSkgPT5cbiAgICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgIEBwYW5lbD8uZGVzdHJveSgpXG4gICAgICBydW5Db21tYW5kKEByZXBvLCBAY29tbWFuZEVkaXRvci5nZXRUZXh0KCkuc3BsaXQoJyAnKSkudGhlbiA9PlxuICAgICAgICBAY3VycmVudFBhbmUuYWN0aXZhdGUoKVxuICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCBhcmdzPVtdKSAtPlxuICBpZiBhcmdzLmxlbmd0aCA+IDBcbiAgICBydW5Db21tYW5kIHJlcG8sIGFyZ3Muc3BsaXQoJyAnKVxuICBlbHNlXG4gICAgbmV3IElucHV0VmlldyhyZXBvKVxuIl19
