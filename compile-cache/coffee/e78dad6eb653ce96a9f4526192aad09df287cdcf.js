(function() {
  var $, $$, ActivityLogger, CherryPickSelectCommits, Repository, SelectListMultipleView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = CherryPickSelectCommits = (function(superClass) {
    extend(CherryPickSelectCommits, superClass);

    function CherryPickSelectCommits() {
      return CherryPickSelectCommits.__super__.constructor.apply(this, arguments);
    }

    CherryPickSelectCommits.prototype.initialize = function(repo, data) {
      var item;
      this.repo = repo;
      CherryPickSelectCommits.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = data.length; i < len; i++) {
          item = data[i];
          item = item.split('\n');
          results.push({
            hash: item[0],
            author: item[1],
            time: item[2],
            subject: item[3]
          });
        }
        return results;
      })());
      return this.focusFilterEditor();
    };

    CherryPickSelectCommits.prototype.getFilterKey = function() {
      return 'hash';
    };

    CherryPickSelectCommits.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-pick-button'
              }, 'Cherry-Pick!');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-pick-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    CherryPickSelectCommits.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    CherryPickSelectCommits.prototype.cancelled = function() {
      return this.hide();
    };

    CherryPickSelectCommits.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    CherryPickSelectCommits.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight inline-block pull-right',
              style: 'font-family: monospace'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.hash);
              }
            });
            _this.div({
              "class": 'text-info'
            }, item.author + ", " + item.time);
            return _this.div({
              "class": 'text-warning'
            }, item.subject);
          };
        })(this));
      });
    };

    CherryPickSelectCommits.prototype.completed = function(items) {
      var commits, message, repoName;
      this.cancel();
      commits = items.map(function(item) {
        return item.hash;
      });
      message = "cherry pick commits: " + (commits.join(' '));
      repoName = new Repository(this.repo).getName();
      return git.cmd(['cherry-pick'].concat(commits), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(msg) {
        notifier.addSuccess(msg);
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: msg
        });
      })["catch"](function(msg) {
        notifier.addError(msg);
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: msg,
          failed: true
        });
      });
    };

    return CherryPickSelectCommits;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2NoZXJyeS1waWNrLXNlbGVjdC1jb21taXRzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzR0FBQTtJQUFBOzs7RUFBQSxNQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUFWLEVBQUMsU0FBRCxFQUFJOztFQUVKLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7c0NBRUosVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7QUFDVixVQUFBO01BRFcsSUFBQyxDQUFBLE9BQUQ7TUFDWCx5REFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFEOztBQUNFO2FBQUEsc0NBQUE7O1VBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWDt1QkFDUDtZQUFDLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUFaO1lBQWdCLE1BQUEsRUFBUSxJQUFLLENBQUEsQ0FBQSxDQUE3QjtZQUFpQyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBNUM7WUFBZ0QsT0FBQSxFQUFTLElBQUssQ0FBQSxDQUFBLENBQTlEOztBQUZGOztVQURGO2FBS0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFSVTs7c0NBVVosWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOztzQ0FFZCxVQUFBLEdBQVksU0FBQTtBQUNW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LElBQUQ7ZUFBVSxJQUFJLENBQUM7TUFBZixDQUFWO01BQ1YsT0FBQSxHQUFXLHVCQUFBLEdBQXlCLENBQUMsT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiLENBQUQ7TUFDcEMsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQUMsQ0FBQSxJQUFoQixDQUFxQixDQUFDLE9BQXRCLENBQUE7YUFDWCxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsYUFBRCxDQUFlLENBQUMsTUFBaEIsQ0FBdUIsT0FBdkIsQ0FBUixFQUF5QztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUF6QyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsR0FBRDtRQUNKLFFBQVEsQ0FBQyxVQUFULENBQW9CLEdBQXBCO2VBQ0EsY0FBYyxDQUFDLE1BQWYsQ0FBc0I7VUFBQyxVQUFBLFFBQUQ7VUFBVyxTQUFBLE9BQVg7VUFBb0IsTUFBQSxFQUFRLEdBQTVCO1NBQXRCO01BRkksQ0FETixDQUlBLEVBQUMsS0FBRCxFQUpBLENBSU8sU0FBQyxHQUFEO1FBQ0wsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBbEI7ZUFDQSxjQUFjLENBQUMsTUFBZixDQUFzQjtVQUFDLFVBQUEsUUFBRDtVQUFXLFNBQUEsT0FBWDtVQUFvQixNQUFBLEVBQVEsR0FBNUI7VUFBaUMsTUFBQSxFQUFRLElBQXpDO1NBQXRCO01BRkssQ0FKUDtJQUxTOzs7O0tBN0N5QjtBQVR0QyIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5TZWxlY3RMaXN0TXVsdGlwbGVWaWV3ID0gcmVxdWlyZSAnLi9zZWxlY3QtbGlzdC1tdWx0aXBsZS12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDaGVycnlQaWNrU2VsZWN0Q29tbWl0cyBleHRlbmRzIFNlbGVjdExpc3RNdWx0aXBsZVZpZXdcblxuICBpbml0aWFsaXplOiAoQHJlcG8sIGRhdGEpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zKFxuICAgICAgZm9yIGl0ZW0gaW4gZGF0YVxuICAgICAgICBpdGVtID0gaXRlbS5zcGxpdCgnXFxuJylcbiAgICAgICAge2hhc2g6IGl0ZW1bMF0sIGF1dGhvcjogaXRlbVsxXSwgdGltZTogaXRlbVsyXSwgc3ViamVjdDogaXRlbVszXX1cbiAgICApXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICdoYXNoJ1xuXG4gIGFkZEJ1dHRvbnM6IC0+XG4gICAgdmlld0J1dHRvbiA9ICQkIC0+XG4gICAgICBAZGl2IGNsYXNzOiAnYnV0dG9ucycsID0+XG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1sZWZ0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1lcnJvciBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLWNhbmNlbC1idXR0b24nLCAnQ2FuY2VsJ1xuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXN1Y2Nlc3MgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1waWNrLWJ1dHRvbicsICdDaGVycnktUGljayEnXG4gICAgdmlld0J1dHRvbi5hcHBlbmRUbyh0aGlzKVxuXG4gICAgQG9uICdjbGljaycsICdidXR0b24nLCAoe3RhcmdldH0pID0+XG4gICAgICBAY29tcGxldGUoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1waWNrLWJ1dHRvbicpXG4gICAgICBAY2FuY2VsKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tY2FuY2VsLWJ1dHRvbicpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcblxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoaXRlbSwgbWF0Y2hlZFN0cikgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LWhpZ2hsaWdodCBpbmxpbmUtYmxvY2sgcHVsbC1yaWdodCcsIHN0eWxlOiAnZm9udC1mYW1pbHk6IG1vbm9zcGFjZScsID0+XG4gICAgICAgICAgaWYgbWF0Y2hlZFN0cj8gdGhlbiBAcmF3KG1hdGNoZWRTdHIpIGVsc2UgQHNwYW4gaXRlbS5oYXNoXG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LWluZm8nLCBcIiN7aXRlbS5hdXRob3J9LCAje2l0ZW0udGltZX1cIlxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC13YXJuaW5nJywgaXRlbS5zdWJqZWN0XG5cbiAgY29tcGxldGVkOiAoaXRlbXMpIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgY29tbWl0cyA9IGl0ZW1zLm1hcCAoaXRlbSkgLT4gaXRlbS5oYXNoXG4gICAgbWVzc2FnZSA9ICBcIlwiXCJjaGVycnkgcGljayBjb21taXRzOiAje2NvbW1pdHMuam9pbignICcpfVwiXCJcIlxuICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgIGdpdC5jbWQoWydjaGVycnktcGljayddLmNvbmNhdChjb21taXRzKSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKG1zZykgLT5cbiAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MgbXNnXG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlLCBvdXRwdXQ6IG1zZ30pXG4gICAgLmNhdGNoIChtc2cpIC0+XG4gICAgICBub3RpZmllci5hZGRFcnJvciBtc2dcbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2UsIG91dHB1dDogbXNnLCBmYWlsZWQ6IHRydWV9KVxuIl19
