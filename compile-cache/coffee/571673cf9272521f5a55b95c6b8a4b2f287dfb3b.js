(function() {
  var $$, ActivityLogger, ListView, Repository, SelectListView, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git-es')["default"];

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      ListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    ListView.prototype.parseData = function() {
      var branches, i, item, items, len;
      items = this.data.split("\n");
      branches = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        item = item.replace(/\s/g, '');
        if (item !== '') {
          branches.push({
            name: item
          });
        }
      }
      this.setItems(branches);
      return this.focusFilterEditor();
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg) {
      var current, name;
      name = arg.name;
      current = false;
      if (name.startsWith("*")) {
        name = name.slice(1);
        current = true;
      }
      return $$(function() {
        return this.li(name, (function(_this) {
          return function() {
            return _this.div({
              "class": 'pull-right'
            }, function() {
              if (current) {
                return _this.span('Current');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var name;
      name = arg.name;
      this.rebase(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.rebase = function(branch) {
      return git(['rebase', branch], {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(result) {
          var repoName;
          repoName = new Repository(_this.repo).getName();
          ActivityLogger.record(Object.assign({
            repoName: repoName,
            message: "rebase branch '" + branch + "'"
          }, result));
          atom.workspace.getTextEditors().forEach(function(editor) {
            return fs.exists(editor.getPath(), function(exist) {
              if (!exist) {
                return editor.destroy();
              }
            });
          });
          return git.refresh(_this.repo);
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3JlYmFzZS1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxnRkFBQTtJQUFBOzs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUixDQUFvQixFQUFDLE9BQUQ7O0VBQzFCLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRXJDLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxPQUFEO01BQ2xCLDBDQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUhVOzt1QkFLWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWjtNQUNSLFFBQUEsR0FBVztBQUNYLFdBQUEsdUNBQUE7O1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixFQUFwQjtRQUNQLElBQU8sSUFBQSxLQUFRLEVBQWY7VUFDRSxRQUFRLENBQUMsSUFBVCxDQUFjO1lBQUMsSUFBQSxFQUFNLElBQVA7V0FBZCxFQURGOztBQUZGO01BSUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFSUzs7dUJBVVgsWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzt1QkFFZCxJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBSEk7O3VCQUtOLFNBQUEsR0FBVyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUFIOzt1QkFFWCxJQUFBLEdBQU0sU0FBQTtBQUNKLFVBQUE7K0NBQU0sQ0FBRSxPQUFSLENBQUE7SUFESTs7dUJBR04sV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxPQUFEO01BQ1osT0FBQSxHQUFVO01BQ1YsSUFBRyxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUFIO1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWDtRQUNQLE9BQUEsR0FBVSxLQUZaOzthQUdBLEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDUixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO2FBQUwsRUFBMEIsU0FBQTtjQUN4QixJQUFvQixPQUFwQjt1QkFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFNBQU4sRUFBQTs7WUFEd0IsQ0FBMUI7VUFEUTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVjtNQURDLENBQUg7SUFMVzs7dUJBVWIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxPQUFEO01BQ1YsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLFNBQVgsQ0FBc0IsQ0FBQSxDQUFBLENBQTlCO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZTOzt1QkFJWCxNQUFBLEdBQVEsU0FBQyxNQUFEO2FBQ04sR0FBQSxDQUFJLENBQUMsUUFBRCxFQUFXLE1BQVgsQ0FBSixFQUF3QjtRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUF4QixDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO0FBQ0osY0FBQTtVQUFBLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxLQUFDLENBQUEsSUFBaEIsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBO1VBQ1gsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztZQUFDLFVBQUEsUUFBRDtZQUFXLE9BQUEsRUFBUyxpQkFBQSxHQUFrQixNQUFsQixHQUF5QixHQUE3QztXQUFkLEVBQWdFLE1BQWhFLENBQXRCO1VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQUEsQ0FBK0IsQ0FBQyxPQUFoQyxDQUF3QyxTQUFDLE1BQUQ7bUJBQ3RDLEVBQUUsQ0FBQyxNQUFILENBQVUsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFWLEVBQTRCLFNBQUMsS0FBRDtjQUFXLElBQW9CLENBQUksS0FBeEI7dUJBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxFQUFBOztZQUFYLENBQTVCO1VBRHNDLENBQXhDO2lCQUVBLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBQyxDQUFBLElBQWI7UUFMSTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETjtJQURNOzs7O0tBMUNhO0FBUnpCIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xueyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmdpdCA9IHJlcXVpcmUoJy4uL2dpdC1lcycpLmRlZmF1bHRcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIExpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhKSAtPlxuICAgICAgc3VwZXJcbiAgICAgIEBzaG93KClcbiAgICAgIEBwYXJzZURhdGEoKVxuXG4gICAgcGFyc2VEYXRhOiAtPlxuICAgICAgaXRlbXMgPSBAZGF0YS5zcGxpdChcIlxcblwiKVxuICAgICAgYnJhbmNoZXMgPSBbXVxuICAgICAgZm9yIGl0ZW0gaW4gaXRlbXNcbiAgICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvXFxzL2csICcnKVxuICAgICAgICB1bmxlc3MgaXRlbSBpcyAnJ1xuICAgICAgICAgIGJyYW5jaGVzLnB1c2gge25hbWU6IGl0ZW19XG4gICAgICBAc2V0SXRlbXMgYnJhbmNoZXNcbiAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgICBnZXRGaWx0ZXJLZXk6IC0+ICduYW1lJ1xuXG4gICAgc2hvdzogLT5cbiAgICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgICBAcGFuZWwuc2hvdygpXG4gICAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICAgIGhpZGU6IC0+XG4gICAgICBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gICAgdmlld0Zvckl0ZW06ICh7bmFtZX0pIC0+XG4gICAgICBjdXJyZW50ID0gZmFsc2VcbiAgICAgIGlmIG5hbWUuc3RhcnRzV2l0aCBcIipcIlxuICAgICAgICBuYW1lID0gbmFtZS5zbGljZSgxKVxuICAgICAgICBjdXJyZW50ID0gdHJ1ZVxuICAgICAgJCQgLT5cbiAgICAgICAgQGxpIG5hbWUsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgICAgQHNwYW4oJ0N1cnJlbnQnKSBpZiBjdXJyZW50XG5cbiAgICBjb25maXJtZWQ6ICh7bmFtZX0pIC0+XG4gICAgICBAcmViYXNlIG5hbWUubWF0Y2goL1xcKj8oLiopLylbMV1cbiAgICAgIEBjYW5jZWwoKVxuXG4gICAgcmViYXNlOiAoYnJhbmNoKSAtPlxuICAgICAgZ2l0KFsncmViYXNlJywgYnJhbmNoXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAocmVzdWx0KSA9PlxuICAgICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKE9iamVjdC5hc3NpZ24oe3JlcG9OYW1lLCBtZXNzYWdlOiBcInJlYmFzZSBicmFuY2ggJyN7YnJhbmNofSdcIn0sIHJlc3VsdCkpXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZm9yRWFjaCAoZWRpdG9yKSAtPlxuICAgICAgICAgIGZzLmV4aXN0cyBlZGl0b3IuZ2V0UGF0aCgpLCAoZXhpc3QpIC0+IGVkaXRvci5kZXN0cm95KCkgaWYgbm90IGV4aXN0XG4gICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4iXX0=
