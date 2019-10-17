(function() {
  var SelectStageFiles, git;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  module.exports = function(repo) {
    var stagedFiles, unstagedFiles;
    unstagedFiles = git.unstagedFiles(repo, {
      showUntracked: true
    });
    stagedFiles = git.stagedFiles(repo);
    return Promise.all([unstagedFiles, stagedFiles]).then(function(data) {
      return new SelectStageFiles(repo, data[0].concat(data[1]));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3RhZ2UtZmlsZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLGtDQUFSOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7QUFDZixRQUFBO0lBQUEsYUFBQSxHQUFnQixHQUFHLENBQUMsYUFBSixDQUFrQixJQUFsQixFQUF3QjtNQUFBLGFBQUEsRUFBZSxJQUFmO0tBQXhCO0lBQ2hCLFdBQUEsR0FBYyxHQUFHLENBQUMsV0FBSixDQUFnQixJQUFoQjtXQUNkLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQyxhQUFELEVBQWdCLFdBQWhCLENBQVosQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBVSxJQUFJLGdCQUFKLENBQXFCLElBQXJCLEVBQTJCLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFSLENBQWUsSUFBSyxDQUFBLENBQUEsQ0FBcEIsQ0FBM0I7SUFBVixDQUROO0VBSGU7QUFIakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5TZWxlY3RTdGFnZUZpbGVzID0gcmVxdWlyZSAnLi4vdmlld3Mvc2VsZWN0LXN0YWdlLWZpbGVzLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIHVuc3RhZ2VkRmlsZXMgPSBnaXQudW5zdGFnZWRGaWxlcyhyZXBvLCBzaG93VW50cmFja2VkOiB0cnVlKVxuICBzdGFnZWRGaWxlcyA9IGdpdC5zdGFnZWRGaWxlcyhyZXBvKVxuICBQcm9taXNlLmFsbChbdW5zdGFnZWRGaWxlcywgc3RhZ2VkRmlsZXNdKVxuICAudGhlbiAoZGF0YSkgLT4gbmV3IFNlbGVjdFN0YWdlRmlsZXMocmVwbywgZGF0YVswXS5jb25jYXQoZGF0YVsxXSkpXG4iXX0=
