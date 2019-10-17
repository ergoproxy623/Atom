(function() {
  var ActivityLogger, Repository, git;

  git = require('../git-es')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = function(repo, arg) {
    var args, cwd, message;
    message = (arg != null ? arg : {}).message;
    cwd = repo.getWorkingDirectory();
    args = ['stash', 'save'];
    if (message) {
      args.push(message);
    }
    return git(args, {
      cwd: cwd,
      color: true
    }).then(function(result) {
      var repoName;
      repoName = new Repository(repo).getName();
      return ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: 'Stash changes'
      }, result));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtc2F2ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUixDQUFvQixFQUFDLE9BQUQ7O0VBQzFCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFFckMsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNmLFFBQUE7SUFEdUIseUJBQUQsTUFBVTtJQUNoQyxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUE7SUFDTixJQUFBLEdBQU8sQ0FBQyxPQUFELEVBQVUsTUFBVjtJQUNQLElBQXNCLE9BQXRCO01BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQUE7O1dBQ0EsR0FBQSxDQUFJLElBQUosRUFBVTtNQUFDLEtBQUEsR0FBRDtNQUFNLEtBQUEsRUFBTyxJQUFiO0tBQVYsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7QUFDSixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksVUFBSixDQUFlLElBQWYsQ0FBb0IsQ0FBQyxPQUFyQixDQUFBO2FBQ1gsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsTUFBTSxDQUFDLE1BQVAsQ0FBYztRQUFDLFVBQUEsUUFBRDtRQUFXLE9BQUEsRUFBUyxlQUFwQjtPQUFkLEVBQW9ELE1BQXBELENBQXRCO0lBRkksQ0FETjtFQUplO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSgnLi4vZ2l0LWVzJykuZGVmYXVsdFxuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge21lc3NhZ2V9PXt9KSAtPlxuICBjd2QgPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICBhcmdzID0gWydzdGFzaCcsICdzYXZlJ11cbiAgYXJncy5wdXNoKG1lc3NhZ2UpIGlmIG1lc3NhZ2VcbiAgZ2l0KGFyZ3MsIHtjd2QsIGNvbG9yOiB0cnVlfSlcbiAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZChPYmplY3QuYXNzaWduKHtyZXBvTmFtZSwgbWVzc2FnZTogJ1N0YXNoIGNoYW5nZXMnfSAscmVzdWx0KSlcbiJdfQ==
