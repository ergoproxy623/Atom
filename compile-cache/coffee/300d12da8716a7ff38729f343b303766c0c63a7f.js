(function() {
  var $$, ActivityLogger, GitShow, RemoteListView, Repository, SelectListView, TagView, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git-es')["default"];

  GitShow = require('../models/git-show');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  RemoteListView = require('../views/remote-list-view');

  module.exports = TagView = (function(superClass) {
    extend(TagView, superClass);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.initialize = function(repo, tag1) {
      this.repo = repo;
      this.tag = tag1;
      TagView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagView.prototype.parseData = function() {
      var items;
      items = [];
      items.push({
        tag: this.tag,
        cmd: 'Show',
        description: 'git show'
      });
      items.push({
        tag: this.tag,
        cmd: 'Push',
        description: 'git push [remote]'
      });
      items.push({
        tag: this.tag,
        cmd: 'Checkout',
        description: 'git checkout'
      });
      items.push({
        tag: this.tag,
        cmd: 'Verify',
        description: 'git tag --verify'
      });
      items.push({
        tag: this.tag,
        cmd: 'Delete',
        description: 'git tag --delete'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagView.prototype.cancelled = function() {
      return this.hide();
    };

    TagView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    TagView.prototype.viewForItem = function(arg) {
      var cmd, description, tag;
      tag = arg.tag, cmd = arg.cmd, description = arg.description;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, cmd);
            return _this.div({
              "class": 'text-warning'
            }, description + " " + tag);
          };
        })(this));
      });
    };

    TagView.prototype.getFilterKey = function() {
      return 'cmd';
    };

    TagView.prototype.confirmed = function(arg) {
      var args, cmd, repoName, tag;
      tag = arg.tag, cmd = arg.cmd;
      this.cancel();
      switch (cmd) {
        case 'Show':
          GitShow(this.repo, tag);
          break;
        case 'Push':
          git(['remote'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(result) {
              return new RemoteListView(_this.repo, result.output, {
                mode: 'push',
                tag: _this.tag
              });
            };
          })(this));
          break;
        case 'Checkout':
          args = ['checkout', tag];
          break;
        case 'Verify':
          args = ['tag', '--verify', tag];
          break;
        case 'Delete':
          args = ['tag', '--delete', tag];
      }
      if (args != null) {
        repoName = new Repository(this.repo).getName();
        return git(args, {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(result) {
          return ActivityLogger.record(Object.assign({
            repoName: repoName,
            message: cmd + " tag '" + tag + "'"
          }, result));
        });
      }
    };

    return TagView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3RhZy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMEZBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUVMLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUixDQUFvQixFQUFDLE9BQUQ7O0VBQzFCLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVI7O0VBQ1YsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUNyQyxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztzQkFDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE1BQUQ7TUFDbEIseUNBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0lBSFU7O3NCQUtaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLEtBQUEsR0FBUTtNQUNSLEtBQUssQ0FBQyxJQUFOLENBQVc7UUFBQyxHQUFBLEVBQUssSUFBQyxDQUFBLEdBQVA7UUFBWSxHQUFBLEVBQUssTUFBakI7UUFBeUIsV0FBQSxFQUFhLFVBQXRDO09BQVg7TUFDQSxLQUFLLENBQUMsSUFBTixDQUFXO1FBQUMsR0FBQSxFQUFLLElBQUMsQ0FBQSxHQUFQO1FBQVksR0FBQSxFQUFLLE1BQWpCO1FBQXlCLFdBQUEsRUFBYSxtQkFBdEM7T0FBWDtNQUNBLEtBQUssQ0FBQyxJQUFOLENBQVc7UUFBQyxHQUFBLEVBQUss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TDtTQUFWLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxNQUFEO2lCQUFZLGNBQWMsQ0FBQyxNQUFmLENBQXNCLE1BQU0sQ0FBQyxNQUFQLENBQWM7WUFBQyxVQUFBLFFBQUQ7WUFBVyxPQUFBLEVBQVksR0FBRCxHQUFLLFFBQUwsR0FBYSxHQUFiLEdBQWlCLEdBQXZDO1dBQWQsRUFBMEQsTUFBMUQsQ0FBdEI7UUFBWixDQUROLEVBRkY7O0lBZlM7Ozs7S0FsQ1M7QUFUdEIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlKCcuLi9naXQtZXMnKS5kZWZhdWx0XG5HaXRTaG93ID0gcmVxdWlyZSAnLi4vbW9kZWxzL2dpdC1zaG93J1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblJlbW90ZUxpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvcmVtb3RlLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVGFnVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgQHRhZykgLT5cbiAgICBzdXBlclxuICAgIEBzaG93KClcbiAgICBAcGFyc2VEYXRhKClcblxuICBwYXJzZURhdGE6IC0+XG4gICAgaXRlbXMgPSBbXVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnU2hvdycsIGRlc2NyaXB0aW9uOiAnZ2l0IHNob3cnfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnUHVzaCcsIGRlc2NyaXB0aW9uOiAnZ2l0IHB1c2ggW3JlbW90ZV0nfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnQ2hlY2tvdXQnLCBkZXNjcmlwdGlvbjogJ2dpdCBjaGVja291dCd9XG4gICAgaXRlbXMucHVzaCB7dGFnOiBAdGFnLCBjbWQ6ICdWZXJpZnknLCBkZXNjcmlwdGlvbjogJ2dpdCB0YWcgLS12ZXJpZnknfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnRGVsZXRlJywgZGVzY3JpcHRpb246ICdnaXQgdGFnIC0tZGVsZXRlJ31cblxuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHt0YWcsIGNtZCwgZGVzY3JpcHRpb259KSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaGlnaGxpZ2h0JywgY21kXG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LXdhcm5pbmcnLCBcIiN7ZGVzY3JpcHRpb259ICN7dGFnfVwiXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnY21kJ1xuXG4gIGNvbmZpcm1lZDogKHt0YWcsIGNtZH0pIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgc3dpdGNoIGNtZFxuICAgICAgd2hlbiAnU2hvdydcbiAgICAgICAgR2l0U2hvdyhAcmVwbywgdGFnKVxuICAgICAgd2hlbiAnUHVzaCdcbiAgICAgICAgZ2l0KFsncmVtb3RlJ10sIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAudGhlbiAocmVzdWx0KSA9PiBuZXcgUmVtb3RlTGlzdFZpZXcoQHJlcG8sIHJlc3VsdC5vdXRwdXQsIG1vZGU6ICdwdXNoJywgdGFnOiBAdGFnKVxuICAgICAgd2hlbiAnQ2hlY2tvdXQnXG4gICAgICAgIGFyZ3MgPSBbJ2NoZWNrb3V0JywgdGFnXVxuICAgICAgd2hlbiAnVmVyaWZ5J1xuICAgICAgICBhcmdzID0gWyd0YWcnLCAnLS12ZXJpZnknLCB0YWddXG4gICAgICB3aGVuICdEZWxldGUnXG4gICAgICAgIGFyZ3MgPSBbJ3RhZycsICctLWRlbGV0ZScsIHRhZ11cblxuICAgIGlmIGFyZ3M/XG4gICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICAgIGdpdChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChyZXN1bHQpIC0+IEFjdGl2aXR5TG9nZ2VyLnJlY29yZChPYmplY3QuYXNzaWduKHtyZXBvTmFtZSwgbWVzc2FnZTogXCIje2NtZH0gdGFnICcje3RhZ30nXCJ9LCByZXN1bHQpKVxuIl19
