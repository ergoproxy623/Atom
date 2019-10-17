(function() {
  var ActivityLogger, Repository, git;

  git = require('../git-es')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git(['stash', 'apply'], {
      cwd: cwd,
      color: true
    }).then(function(result) {
      var repoName;
      repoName = new Repository(repo).getName();
      return ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: 'Apply stash'
      }, result));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtYXBwbHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVIsQ0FBb0IsRUFBQyxPQUFEOztFQUMxQixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRXJDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtBQUNmLFFBQUE7SUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUE7V0FDTixHQUFBLENBQUksQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFKLEVBQXdCO01BQUMsS0FBQSxHQUFEO01BQU0sS0FBQSxFQUFPLElBQWI7S0FBeEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7QUFDSixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBO2FBQ1gsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztRQUFDLFVBQUEsUUFBRDtRQUFXLE9BQUEsRUFBUyxhQUFwQjtPQUFkLEVBQWtELE1BQWxELENBQXRCO0lBRkksQ0FETjtFQUZlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSgnLi4vZ2l0LWVzJykuZGVmYXVsdFxuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgZ2l0KFsnc3Rhc2gnLCAnYXBwbHknXSwge2N3ZCwgY29sb3I6IHRydWV9KVxuICAudGhlbiAocmVzdWx0KSAtPlxuICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKE9iamVjdC5hc3NpZ24oe3JlcG9OYW1lLCBtZXNzYWdlOiAnQXBwbHkgc3Rhc2gnfSwgcmVzdWx0KSlcbiJdfQ==
