(function() {
  var $, $$, SelectListMultipleView, SelectStageFilesView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(superClass) {
    extend(SelectStageFilesView, superClass);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.selectedItems.push('foobar');
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.getFilterKey = function() {
      return 'path';
    };

    SelectStageFilesView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'select-list-buttons'
        }, (function(_this) {
          return function() {
            _this.div(function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.div(function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-apply-button'
              }, 'Apply');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-apply-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageFilesView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageFilesView.prototype.viewForItem = function(item, matchedStr) {
      var classString;
      classString = item.staged ? 'active' : '';
      return $$(function() {
        return this.li({
          "class": classString
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right'
            }, function() {
              return _this.span({
                "class": 'inline-block highlight'
              }, item.mode);
            });
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item.path);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.confirmed = function(item, viewItem) {
      item.staged = !item.staged;
      return viewItem.toggleClass('active');
    };

    SelectStageFilesView.prototype.completed = function(_) {
      var stage, stagePromise, unstage, unstagePromise;
      stage = this.items.filter(function(item) {
        return item.staged;
      }).map(function(arg) {
        var path;
        path = arg.path;
        return path;
      });
      unstage = this.items.filter(function(item) {
        return !item.staged;
      }).map(function(arg) {
        var path;
        path = arg.path;
        return path;
      });
      stagePromise = stage.length > 0 ? git.cmd(['add', '-f'].concat(stage), {
        cwd: this.repo.getWorkingDirectory()
      }) : void 0;
      unstagePromise = unstage.length > 0 ? git.cmd(['reset', 'HEAD', '--'].concat(unstage), {
        cwd: this.repo.getWorkingDirectory()
      }) : void 0;
      Promise.all([stagePromise, unstagePromise]).then(function(data) {
        return notifier.addSuccess('Index updated successfully');
      })["catch"](notifier.addError);
      return this.cancel();
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3NlbGVjdC1zdGFnZS1maWxlcy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsdUVBQUE7SUFBQTs7O0VBQUEsTUFBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUQsRUFBSTs7RUFFSixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFekIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OzttQ0FDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsS0FBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQ1gsc0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixRQUFwQjtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUxVOzttQ0FPWixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O21DQUVkLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLFVBQUEsR0FBYSxFQUFBLENBQUcsU0FBQTtlQUNkLElBQUMsQ0FBQSxHQUFELENBQUs7VUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHFCQUFQO1NBQUwsRUFBbUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUNqQyxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7cUJBQ0gsS0FBQyxDQUFBLE1BQUQsQ0FBUTtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLG9EQUFQO2VBQVIsRUFBcUUsUUFBckU7WUFERyxDQUFMO21CQUVBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtxQkFDSCxLQUFDLENBQUEsTUFBRCxDQUFRO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8scURBQVA7ZUFBUixFQUFzRSxPQUF0RTtZQURHLENBQUw7VUFIaUM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO01BRGMsQ0FBSDtNQU1iLFVBQVUsQ0FBQyxRQUFYLENBQW9CLElBQXBCO2FBRUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsUUFBYixFQUF1QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUNyQixjQUFBO1VBRHVCLFNBQUQ7VUFDdEIsSUFBZSxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsUUFBVixDQUFtQixrQkFBbkIsQ0FBZjtZQUFBLEtBQUMsQ0FBQSxRQUFELENBQUEsRUFBQTs7VUFDQSxJQUFhLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxRQUFWLENBQW1CLG1CQUFuQixDQUFiO21CQUFBLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTs7UUFGcUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0lBVFU7O21DQWFaLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFISTs7bUNBS04sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7O21DQUVYLElBQUEsR0FBTSxTQUFBO0FBQUcsVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQUFIOzttQ0FFTixXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sVUFBUDtBQUNYLFVBQUE7TUFBQSxXQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFSLEdBQW9CLFFBQXBCLEdBQWtDO2FBQ2hELEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSTtVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtTQUFKLEVBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDdEIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDthQUFMLEVBQTBCLFNBQUE7cUJBQ3hCLEtBQUMsQ0FBQSxJQUFELENBQU07Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3QkFBUDtlQUFOLEVBQXVDLElBQUksQ0FBQyxJQUE1QztZQUR3QixDQUExQjtZQUVBLElBQUcsa0JBQUg7cUJBQW9CLEtBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxFQUFwQjthQUFBLE1BQUE7cUJBQTBDLEtBQUMsQ0FBQSxJQUFELENBQU0sSUFBSSxDQUFDLElBQVgsRUFBMUM7O1VBSHNCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtNQURDLENBQUg7SUFGVzs7bUNBUWIsU0FBQSxHQUFXLFNBQUMsSUFBRCxFQUFPLFFBQVA7TUFDVCxJQUFJLENBQUMsTUFBTCxHQUFjLENBQUksSUFBSSxDQUFDO2FBQ3ZCLFFBQVEsQ0FBQyxXQUFULENBQXFCLFFBQXJCO0lBRlM7O21DQUlYLFNBQUEsR0FBVyxTQUFDLENBQUQ7QUFDVCxVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLFNBQUMsSUFBRDtlQUFVLElBQUksQ0FBQztNQUFmLENBQWQsQ0FBb0MsQ0FBQyxHQUFyQyxDQUF5QyxTQUFDLEdBQUQ7QUFBWSxZQUFBO1FBQVYsT0FBRDtlQUFXO01BQVosQ0FBekM7TUFDUixPQUFBLEdBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsU0FBQyxJQUFEO2VBQVUsQ0FBSSxJQUFJLENBQUM7TUFBbkIsQ0FBZCxDQUF3QyxDQUFDLEdBQXpDLENBQTZDLFNBQUMsR0FBRDtBQUFZLFlBQUE7UUFBVixPQUFEO2VBQVc7TUFBWixDQUE3QztNQUNWLFlBQUEsR0FBa0IsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQixHQUEwQixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsS0FBRCxFQUFRLElBQVIsQ0FBYSxDQUFDLE1BQWQsQ0FBcUIsS0FBckIsQ0FBUixFQUFxQztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFyQyxDQUExQixHQUFBO01BQ2YsY0FBQSxHQUFvQixPQUFPLENBQUMsTUFBUixHQUFpQixDQUFwQixHQUEyQixHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FBdUIsQ0FBQyxNQUF4QixDQUErQixPQUEvQixDQUFSLEVBQWlEO1FBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO09BQWpELENBQTNCLEdBQUE7TUFDakIsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFDLFlBQUQsRUFBZSxjQUFmLENBQVosQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7ZUFBVSxRQUFRLENBQUMsVUFBVCxDQUFvQiw0QkFBcEI7TUFBVixDQUROLENBRUEsRUFBQyxLQUFELEVBRkEsQ0FFTyxRQUFRLENBQUMsUUFGaEI7YUFHQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBUlM7Ozs7S0E1Q3NCO0FBUG5DIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuU2VsZWN0TGlzdE11bHRpcGxlVmlldyA9IHJlcXVpcmUgJy4vc2VsZWN0LWxpc3QtbXVsdGlwbGUtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2VsZWN0U3RhZ2VGaWxlc1ZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0TXVsdGlwbGVWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgaXRlbXMpIC0+XG4gICAgc3VwZXJcbiAgICBAc2VsZWN0ZWRJdGVtcy5wdXNoICdmb29iYXInICMgaGFjayB0byBvdmVycmlkZSBzdXBlciBjbGFzcyBiZWhhdmlvciBzbyA6OmNvbXBsZXRlZCB3aWxsIGJlIGNhbGxlZFxuICAgIEBzaG93KClcbiAgICBAc2V0SXRlbXMgaXRlbXNcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ3BhdGgnXG5cbiAgYWRkQnV0dG9uczogLT5cbiAgICB2aWV3QnV0dG9uID0gJCQgLT5cbiAgICAgIEBkaXYgY2xhc3M6ICdzZWxlY3QtbGlzdC1idXR0b25zJywgPT5cbiAgICAgICAgQGRpdiA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCBidG4tY2FuY2VsLWJ1dHRvbicsICdDYW5jZWwnXG4gICAgICAgIEBkaXYgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBidG4tYXBwbHktYnV0dG9uJywgJ0FwcGx5J1xuICAgIHZpZXdCdXR0b24uYXBwZW5kVG8odGhpcylcblxuICAgIEBvbiAnY2xpY2snLCAnYnV0dG9uJywgKHt0YXJnZXR9KSA9PlxuICAgICAgQGNvbXBsZXRlKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tYXBwbHktYnV0dG9uJylcbiAgICAgIEBjYW5jZWwoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1jYW5jZWwtYnV0dG9uJylcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoaXRlbSwgbWF0Y2hlZFN0cikgLT5cbiAgICBjbGFzc1N0cmluZyA9IGlmIGl0ZW0uc3RhZ2VkIHRoZW4gJ2FjdGl2ZScgZWxzZSAnJ1xuICAgICQkIC0+XG4gICAgICBAbGkgY2xhc3M6IGNsYXNzU3RyaW5nLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQHNwYW4gY2xhc3M6ICdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0JywgaXRlbS5tb2RlXG4gICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKSBlbHNlIEBzcGFuIGl0ZW0ucGF0aFxuXG4gIGNvbmZpcm1lZDogKGl0ZW0sIHZpZXdJdGVtKSAtPlxuICAgIGl0ZW0uc3RhZ2VkID0gbm90IGl0ZW0uc3RhZ2VkXG4gICAgdmlld0l0ZW0udG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgY29tcGxldGVkOiAoXykgLT5cbiAgICBzdGFnZSA9IEBpdGVtcy5maWx0ZXIoKGl0ZW0pIC0+IGl0ZW0uc3RhZ2VkKS5tYXAgKHtwYXRofSkgLT4gcGF0aFxuICAgIHVuc3RhZ2UgPSBAaXRlbXMuZmlsdGVyKChpdGVtKSAtPiBub3QgaXRlbS5zdGFnZWQpLm1hcCAoe3BhdGh9KSAtPiBwYXRoXG4gICAgc3RhZ2VQcm9taXNlID0gaWYgc3RhZ2UubGVuZ3RoID4gMCAgdGhlbiBnaXQuY21kKFsnYWRkJywgJy1mJ10uY29uY2F0KHN0YWdlKSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgdW5zdGFnZVByb21pc2UgPSBpZiB1bnN0YWdlLmxlbmd0aCA+IDAgdGhlbiBnaXQuY21kKFsncmVzZXQnLCAnSEVBRCcsICctLSddLmNvbmNhdCh1bnN0YWdlKSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgUHJvbWlzZS5hbGwoW3N0YWdlUHJvbWlzZSwgdW5zdGFnZVByb21pc2VdKVxuICAgIC50aGVuIChkYXRhKSAtPiBub3RpZmllci5hZGRTdWNjZXNzICdJbmRleCB1cGRhdGVkIHN1Y2Nlc3NmdWxseSdcbiAgICAuY2F0Y2ggbm90aWZpZXIuYWRkRXJyb3JcbiAgICBAY2FuY2VsKClcbiJdfQ==
