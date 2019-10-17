(function() {
  var ActivityLogger, Repository, git;

  git = require('../git-es')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git(['stash', 'drop'], {
      cwd: cwd,
      color: true
    }).then(function(result) {
      var repoName;
      repoName = new Repository(repo).getName();
      return ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: 'Drop stash'
      }, result));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtZHJvcC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUixDQUFvQixFQUFDLE9BQUQ7O0VBQzFCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFFckMsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQTtXQUNOLEdBQUEsQ0FBSSxDQUFDLE9BQUQsRUFBVSxNQUFWLENBQUosRUFBdUI7TUFBQyxLQUFBLEdBQUQ7TUFBTSxLQUFBLEVBQU8sSUFBYjtLQUF2QixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsTUFBRDtBQUNKLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxVQUFKLENBQWUsSUFBZixDQUFvQixDQUFDLE9BQXJCLENBQUE7YUFDWCxjQUFjLENBQUMsTUFBZixDQUFzQixNQUFNLENBQUMsTUFBUCxDQUFjO1FBQUMsVUFBQSxRQUFEO1FBQVcsT0FBQSxFQUFTLFlBQXBCO09BQWQsRUFBaUQsTUFBakQsQ0FBdEI7SUFGSSxDQUROO0VBRmU7QUFKakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlKCcuLi9naXQtZXMnKS5kZWZhdWx0XG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBjd2QgPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICBnaXQoWydzdGFzaCcsICdkcm9wJ10sIHtjd2QsIGNvbG9yOiB0cnVlfSlcbiAgLnRoZW4gKHJlc3VsdCkgLT5cbiAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZChPYmplY3QuYXNzaWduKHtyZXBvTmFtZSwgbWVzc2FnZTogJ0Ryb3Agc3Rhc2gnfSwgcmVzdWx0KSlcbiJdfQ==
