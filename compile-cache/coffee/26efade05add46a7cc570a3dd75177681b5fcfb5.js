(function() {
  var $, $$, ActivityLogger, EditorView, Repository, SelectListMultipleView, SelectStageFilesView, git, prettify, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, EditorView = ref.EditorView;

  git = require('../git');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  SelectListMultipleView = require('./select-list-multiple-view');

  prettify = function(data) {
    var file, i, j, len, result, results;
    result = data.match(/rm ('.*')/g);
    if ((result != null ? result.length : void 0) >= 1) {
      results = [];
      for (i = j = 0, len = result.length; j < len; i = ++j) {
        file = result[i];
        results.push(result[i] = ' ' + file.match(/rm '(.*)'/)[1]);
      }
      return results;
    }
  };

  module.exports = SelectStageFilesView = (function(superClass) {
    extend(SelectStageFilesView, superClass);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-remove-button'
              }, 'Remove');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-remove-button')) {
            if (window.confirm('Are you sure?')) {
              _this.complete();
            }
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
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var currentFile, editor, files, item, ref1, repoName;
      files = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          if (item !== '') {
            results.push(item);
          }
        }
        return results;
      })();
      this.cancel();
      currentFile = this.repo.relativize((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0);
      editor = atom.workspace.getActiveTextEditor();
      if (indexOf.call(files, currentFile) >= 0) {
        atom.views.getView(editor).remove();
      }
      repoName = new Repository(this.repo).getName();
      return git.cmd(['rm', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        return ActivityLogger.record({
          repoName: repoName,
          message: "Remove '" + (prettify(data)) + "'",
          output: data
        });
      })["catch"](function(data) {
        return ActivityLogger.record({
          repoName: repoName,
          message: "Remove '" + (prettify(data)) + "'",
          output: data,
          failed: true
        });
      });
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3JlbW92ZS1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrR0FBQTtJQUFBOzs7O0VBQUEsTUFBc0IsT0FBQSxDQUFRLHNCQUFSLENBQXRCLEVBQUMsU0FBRCxFQUFJLFdBQUosRUFBUTs7RUFFUixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVI7O0VBRXpCLFFBQUEsR0FBVyxTQUFDLElBQUQ7QUFDVCxRQUFBO0lBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWDtJQUNULHNCQUFHLE1BQU0sQ0FBRSxnQkFBUixJQUFrQixDQUFyQjtBQUNFO1dBQUEsZ0RBQUE7O3FCQUNFLE1BQU8sQ0FBQSxDQUFBLENBQVAsR0FBWSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLENBQXdCLENBQUEsQ0FBQTtBQUQ1QztxQkFERjs7RUFGUzs7RUFNWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O21DQUVKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxLQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWCxzREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBSlU7O21DQU1aLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLFVBQUEsR0FBYSxFQUFBLENBQUcsU0FBQTtlQUNkLElBQUMsQ0FBQSxHQUFE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LEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLENBQVksQ0FBQyxNQUFiLENBQW9CLEtBQXBCLENBQVIsRUFBb0M7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBcEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7ZUFDSixjQUFjLENBQUMsTUFBZixDQUFzQjtVQUFDLFVBQUEsUUFBRDtVQUFXLE9BQUEsRUFBUyxVQUFBLEdBQVUsQ0FBQyxRQUFBLENBQVMsSUFBVCxDQUFELENBQVYsR0FBMEIsR0FBOUM7VUFBa0QsTUFBQSxFQUFRLElBQTFEO1NBQXRCO01BREksQ0FETixDQUdBLEVBQUMsS0FBRCxFQUhBLENBR08sU0FBQyxJQUFEO2VBQ0wsY0FBYyxDQUFDLE1BQWYsQ0FBc0I7VUFBQyxVQUFBLFFBQUQ7VUFBVyxPQUFBLEVBQVMsVUFBQSxHQUFVLENBQUMsUUFBQSxDQUFTLElBQVQsQ0FBRCxDQUFWLEdBQTBCLEdBQTlDO1VBQWtELE1BQUEsRUFBUSxJQUExRDtVQUFnRSxNQUFBLEVBQVEsSUFBeEU7U0FBdEI7TUFESyxDQUhQO0lBUlM7Ozs7S0F0Q3NCO0FBZG5DIiwic291cmNlc0NvbnRlbnQiOlsieyQsICQkLCBFZGl0b3JWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuU2VsZWN0TGlzdE11bHRpcGxlVmlldyA9IHJlcXVpcmUgJy4vc2VsZWN0LWxpc3QtbXVsdGlwbGUtdmlldydcblxucHJldHRpZnkgPSAoZGF0YSkgLT5cbiAgcmVzdWx0ID0gZGF0YS5tYXRjaCgvcm0gKCcuKicpL2cpXG4gIGlmIHJlc3VsdD8ubGVuZ3RoID49IDFcbiAgICBmb3IgZmlsZSwgaSBpbiByZXN1bHRcbiAgICAgIHJlc3VsdFtpXSA9ICcgJyArIGZpbGUubWF0Y2goL3JtICcoLiopJy8pWzFdXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNlbGVjdFN0YWdlRmlsZXNWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdE11bHRpcGxlVmlld1xuXG4gIGluaXRpYWxpemU6IChAcmVwbywgaXRlbXMpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zIGl0ZW1zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBhZGRCdXR0b25zOiAtPlxuICAgIHZpZXdCdXR0b24gPSAkJCAtPlxuICAgICAgQGRpdiBjbGFzczogJ2J1dHRvbnMnLCA9PlxuICAgICAgICBAc3BhbiBjbGFzczogJ3B1bGwtbGVmdCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1jYW5jZWwtYnV0dG9uJywgJ0NhbmNlbCdcbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1zdWNjZXNzIGlubGluZS1ibG9jay10aWdodCBidG4tcmVtb3ZlLWJ1dHRvbicsICdSZW1vdmUnXG4gICAgdmlld0J1dHRvbi5hcHBlbmRUbyh0aGlzKVxuXG4gICAgQG9uICdjbGljaycsICdidXR0b24nLCAoe3RhcmdldH0pID0+XG4gICAgICBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1yZW1vdmUtYnV0dG9uJylcbiAgICAgICAgQGNvbXBsZXRlKCkgaWYgd2luZG93LmNvbmZpcm0gJ0FyZSB5b3Ugc3VyZT8nXG4gICAgICBAY2FuY2VsKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tY2FuY2VsLWJ1dHRvbicpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPlxuICAgIEBoaWRlKClcblxuICBoaWRlOiAtPlxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtLCBtYXRjaGVkU3RyKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgaWYgbWF0Y2hlZFN0cj8gdGhlbiBAcmF3KG1hdGNoZWRTdHIpIGVsc2UgQHNwYW4gaXRlbVxuXG4gIGNvbXBsZXRlZDogKGl0ZW1zKSAtPlxuICAgIGZpbGVzID0gKGl0ZW0gZm9yIGl0ZW0gaW4gaXRlbXMgd2hlbiBpdGVtIGlzbnQgJycpXG4gICAgQGNhbmNlbCgpXG4gICAgY3VycmVudEZpbGUgPSBAcmVwby5yZWxhdGl2aXplIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpXG5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5yZW1vdmUoKSBpZiBjdXJyZW50RmlsZSBpbiBmaWxlc1xuICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgIGdpdC5jbWQoWydybScsICctZiddLmNvbmNhdChmaWxlcyksIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogXCJSZW1vdmUgJyN7cHJldHRpZnkoZGF0YSl9J1wiLCBvdXRwdXQ6IGRhdGF9KVxuICAgIC5jYXRjaCAoZGF0YSkgLT5cbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IFwiUmVtb3ZlICcje3ByZXR0aWZ5KGRhdGEpfSdcIiwgb3V0cHV0OiBkYXRhLCBmYWlsZWQ6IHRydWV9KVxuIl19
