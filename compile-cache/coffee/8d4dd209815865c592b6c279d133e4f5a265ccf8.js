(function() {
  var TagListView, git;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  module.exports = function(repo) {
    return git.cmd(['tag', '-ln'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new TagListView(repo, data);
    })["catch"](function() {
      return new TagListView(repo);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtdGFncy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixXQUFBLEdBQWMsT0FBQSxDQUFRLHdCQUFSOztFQUVkLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFSLEVBQXdCO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBeEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBVSxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEI7SUFBVixDQUROLENBRUEsRUFBQyxLQUFELEVBRkEsQ0FFTyxTQUFBO2FBQUcsSUFBSSxXQUFKLENBQWdCLElBQWhCO0lBQUgsQ0FGUDtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuVGFnTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy90YWctbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQuY21kKFsndGFnJywgJy1sbiddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT4gbmV3IFRhZ0xpc3RWaWV3KHJlcG8sIGRhdGEpXG4gIC5jYXRjaCAtPiBuZXcgVGFnTGlzdFZpZXcocmVwbylcbiJdfQ==
