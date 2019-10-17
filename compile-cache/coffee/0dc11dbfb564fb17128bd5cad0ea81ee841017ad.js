(function() {
  var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  TagView = require('./tag-view');

  TagCreateView = require('./tag-create-view');

  module.exports = TagListView = (function(superClass) {
    extend(TagListView, superClass);

    function TagListView() {
      return TagListView.__super__.constructor.apply(this, arguments);
    }

    TagListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data != null ? data : '';
      TagListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagListView.prototype.parseData = function() {
      var item, items, tmp;
      if (this.data.length > 0) {
        this.data = this.data.split("\n").slice(0, -1);
        items = (function() {
          var i, len, ref1, results;
          ref1 = this.data.reverse();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            item = ref1[i];
            if (!(item !== '')) {
              continue;
            }
            tmp = item.match(/([\w\d-_\/.]+)\s(.*)/);
            results.push({
              tag: tmp != null ? tmp[1] : void 0,
              annotation: tmp != null ? tmp[2] : void 0
            });
          }
          return results;
        }).call(this);
      } else {
        items = [];
      }
      items.push({
        tag: '+ Add Tag',
        annotation: 'Add a tag referencing the current commit.'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagListView.prototype.getFilterKey = function() {
      return 'tag';
    };

    TagListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagListView.prototype.cancelled = function() {
      return this.hide();
    };

    TagListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    TagListView.prototype.viewForItem = function(arg) {
      var annotation, tag;
      tag = arg.tag, annotation = arg.annotation;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, tag);
            return _this.div({
              "class": 'text-warning'
            }, annotation);
          };
        })(this));
      });
    };

    TagListView.prototype.confirmed = function(arg) {
      var tag;
      tag = arg.tag;
      this.cancel();
      if (tag === '+ Add Tag') {
        return new TagCreateView(this.repo);
      } else {
        return new TagView(this.repo, tag);
      }
    };

    return TagListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3RhZy1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2RUFBQTtJQUFBOzs7RUFBQyxrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3BCLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBQ1YsYUFBQSxHQUFnQixPQUFBLENBQVEsbUJBQVI7O0VBRWhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7MEJBRUosVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxzQkFBRCxPQUFNO01BQ3hCLDZDQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUhVOzswQkFLWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixHQUFlLENBQWxCO1FBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQWtCO1FBQzFCLEtBQUE7O0FBQ0U7QUFBQTtlQUFBLHNDQUFBOztrQkFBaUMsSUFBQSxLQUFROzs7WUFDdkMsR0FBQSxHQUFNLElBQUksQ0FBQyxLQUFMLENBQVcsc0JBQVg7eUJBQ047Y0FBQyxHQUFBLGdCQUFLLEdBQUssQ0FBQSxDQUFBLFVBQVg7Y0FBZSxVQUFBLGdCQUFZLEdBQUssQ0FBQSxDQUFBLFVBQWhDOztBQUZGOztzQkFISjtPQUFBLE1BQUE7UUFRRSxLQUFBLEdBQVEsR0FSVjs7TUFVQSxLQUFLLENBQUMsSUFBTixDQUFXO1FBQUMsR0FBQSxFQUFLLFdBQU47UUFBbUIsVUFBQSxFQUFZLDJDQUEvQjtPQUFYO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFiUzs7MEJBZVgsWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzswQkFFZCxJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBSEk7OzBCQUtOLFNBQUEsR0FBVyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUFIOzswQkFFWCxJQUFBLEdBQU0sU0FBQTtBQUFHLFVBQUE7K0NBQU0sQ0FBRSxPQUFSLENBQUE7SUFBSDs7MEJBRU4sV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxlQUFLO2FBQ2xCLEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO1lBQ0YsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7YUFBTCxFQUE4QixHQUE5QjttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO2FBQUwsRUFBNEIsVUFBNUI7VUFGRTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtNQURDLENBQUg7SUFEVzs7MEJBTWIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxNQUFEO01BQ1YsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLElBQUcsR0FBQSxLQUFPLFdBQVY7ZUFDRSxJQUFJLGFBQUosQ0FBa0IsSUFBQyxDQUFBLElBQW5CLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBSSxPQUFKLENBQVksSUFBQyxDQUFBLElBQWIsRUFBbUIsR0FBbkIsRUFIRjs7SUFGUzs7OztLQXZDYTtBQVAxQiIsInNvdXJjZXNDb250ZW50IjpbIntCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcbnskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cblRhZ1ZpZXcgPSByZXF1aXJlICcuL3RhZy12aWV3J1xuVGFnQ3JlYXRlVmlldyA9IHJlcXVpcmUgJy4vdGFnLWNyZWF0ZS12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUYWdMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBAZGF0YT0nJykgLT5cbiAgICBzdXBlclxuICAgIEBzaG93KClcbiAgICBAcGFyc2VEYXRhKClcblxuICBwYXJzZURhdGE6IC0+XG4gICAgaWYgQGRhdGEubGVuZ3RoID4gMFxuICAgICAgQGRhdGEgPSBAZGF0YS5zcGxpdChcIlxcblwiKVsuLi4tMV1cbiAgICAgIGl0ZW1zID0gKFxuICAgICAgICBmb3IgaXRlbSBpbiBAZGF0YS5yZXZlcnNlKCkgd2hlbiBpdGVtICE9ICcnXG4gICAgICAgICAgdG1wID0gaXRlbS5tYXRjaCAvKFtcXHdcXGQtXy8uXSspXFxzKC4qKS9cbiAgICAgICAgICB7dGFnOiB0bXA/WzFdLCBhbm5vdGF0aW9uOiB0bXA/WzJdfVxuICAgICAgKVxuICAgIGVsc2VcbiAgICAgIGl0ZW1zID0gW11cblxuICAgIGl0ZW1zLnB1c2gge3RhZzogJysgQWRkIFRhZycsIGFubm90YXRpb246ICdBZGQgYSB0YWcgcmVmZXJlbmNpbmcgdGhlIGN1cnJlbnQgY29tbWl0Lid9XG4gICAgQHNldEl0ZW1zIGl0ZW1zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICd0YWcnXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHt0YWcsIGFubm90YXRpb259KSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaGlnaGxpZ2h0JywgdGFnXG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LXdhcm5pbmcnLCBhbm5vdGF0aW9uXG5cbiAgY29uZmlybWVkOiAoe3RhZ30pIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgaWYgdGFnIGlzICcrIEFkZCBUYWcnXG4gICAgICBuZXcgVGFnQ3JlYXRlVmlldyhAcmVwbylcbiAgICBlbHNlXG4gICAgICBuZXcgVGFnVmlldyhAcmVwbywgdGFnKVxuIl19
