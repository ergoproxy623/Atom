(function() {
  var ActivityLogger, Repository, emptyOrUndefined, getUpstream, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  emptyOrUndefined = function(thing) {
    return thing !== '' && thing !== void 0;
  };

  getUpstream = function(repo) {
    var branch, branchInfo, ref, remote;
    branchInfo = (ref = repo.getUpstreamBranch()) != null ? ref.substring('refs/remotes/'.length).split('/') : void 0;
    if (!branchInfo) {
      return null;
    }
    remote = branchInfo[0];
    branch = branchInfo.slice(1).join('/');
    return [remote, branch];
  };

  module.exports = function(repo, arg) {
    var args, extraArgs, recordMessage, repoName, startMessage, upstream;
    extraArgs = (arg != null ? arg : {}).extraArgs;
    if (upstream = getUpstream(repo)) {
      if (typeof extraArgs === 'string') {
        extraArgs = [extraArgs];
      }
      if (extraArgs == null) {
        extraArgs = [];
      }
      startMessage = notifier.addInfo("Pulling...", {
        dismissable: true
      });
      recordMessage = "pull " + (extraArgs.join(' '));
      args = ['pull'].concat(extraArgs).concat(upstream).filter(emptyOrUndefined);
      repoName = new Repository(repo).getName();
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(output) {
        ActivityLogger.record({
          message: recordMessage,
          output: output,
          repoName: repoName
        });
        return startMessage.dismiss();
      })["catch"](function(output) {
        ActivityLogger.record({
          message: recordMessage,
          output: output,
          repoName: repoName,
          failed: true
        });
        return startMessage.dismiss();
      });
    } else {
      return notifier.addInfo('The current branch is not tracking from upstream');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9fcHVsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUVyQyxnQkFBQSxHQUFtQixTQUFDLEtBQUQ7V0FBVyxLQUFBLEtBQVcsRUFBWCxJQUFrQixLQUFBLEtBQVc7RUFBeEM7O0VBRW5CLFdBQUEsR0FBYyxTQUFDLElBQUQ7QUFDWixRQUFBO0lBQUEsVUFBQSxpREFBcUMsQ0FBRSxTQUExQixDQUFvQyxlQUFlLENBQUMsTUFBcEQsQ0FBMkQsQ0FBQyxLQUE1RCxDQUFrRSxHQUFsRTtJQUNiLElBQWUsQ0FBSSxVQUFuQjtBQUFBLGFBQU8sS0FBUDs7SUFDQSxNQUFBLEdBQVMsVUFBVyxDQUFBLENBQUE7SUFDcEIsTUFBQSxHQUFTLFVBQVUsQ0FBQyxLQUFYLENBQWlCLENBQWpCLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsR0FBekI7V0FDVCxDQUFDLE1BQUQsRUFBUyxNQUFUO0VBTFk7O0VBT2QsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNmLFFBQUE7SUFEdUIsMkJBQUQsTUFBWTtJQUNsQyxJQUFHLFFBQUEsR0FBVyxXQUFBLENBQVksSUFBWixDQUFkO01BQ0UsSUFBRyxPQUFPLFNBQVAsS0FBb0IsUUFBdkI7UUFBcUMsU0FBQSxHQUFZLENBQUMsU0FBRCxFQUFqRDs7O1FBQ0EsWUFBYTs7TUFDYixZQUFBLEdBQWUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsWUFBakIsRUFBK0I7UUFBQSxXQUFBLEVBQWEsSUFBYjtPQUEvQjtNQUNmLGFBQUEsR0FBZSxPQUFBLEdBQVMsQ0FBQyxTQUFTLENBQUMsSUFBVixDQUFlLEdBQWYsQ0FBRDtNQUN4QixJQUFBLEdBQU8sQ0FBQyxNQUFELENBQVEsQ0FBQyxNQUFULENBQWdCLFNBQWhCLENBQTBCLENBQUMsTUFBM0IsQ0FBa0MsUUFBbEMsQ0FBMkMsQ0FBQyxNQUE1QyxDQUFtRCxnQkFBbkQ7TUFDUCxRQUFBLEdBQVcsSUFBSSxVQUFKLENBQWUsSUFBZixDQUFvQixDQUFDLE9BQXJCLENBQUE7YUFDWCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQWQsRUFBK0M7UUFBQyxLQUFBLEVBQU8sSUFBUjtPQUEvQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsTUFBRDtRQUNKLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1VBQUMsT0FBQSxFQUFTLGFBQVY7VUFBeUIsUUFBQSxNQUF6QjtVQUFpQyxVQUFBLFFBQWpDO1NBQXRCO2VBQ0EsWUFBWSxDQUFDLE9BQWIsQ0FBQTtNQUZJLENBRE4sQ0FJQSxFQUFDLEtBQUQsRUFKQSxDQUlPLFNBQUMsTUFBRDtRQUNMLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1VBQUMsT0FBQSxFQUFTLGFBQVY7VUFBeUIsUUFBQSxNQUF6QjtVQUFpQyxVQUFBLFFBQWpDO1VBQTJDLE1BQUEsRUFBUSxJQUFuRDtTQUF0QjtlQUNBLFlBQVksQ0FBQyxPQUFiLENBQUE7TUFGSyxDQUpQLEVBUEY7S0FBQSxNQUFBO2FBZUUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0RBQWpCLEVBZkY7O0VBRGU7QUFkakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblxuZW1wdHlPclVuZGVmaW5lZCA9ICh0aGluZykgLT4gdGhpbmcgaXNudCAnJyBhbmQgdGhpbmcgaXNudCB1bmRlZmluZWRcblxuZ2V0VXBzdHJlYW0gPSAocmVwbykgLT5cbiAgYnJhbmNoSW5mbyA9IHJlcG8uZ2V0VXBzdHJlYW1CcmFuY2goKT8uc3Vic3RyaW5nKCdyZWZzL3JlbW90ZXMvJy5sZW5ndGgpLnNwbGl0KCcvJylcbiAgcmV0dXJuIG51bGwgaWYgbm90IGJyYW5jaEluZm9cbiAgcmVtb3RlID0gYnJhbmNoSW5mb1swXVxuICBicmFuY2ggPSBicmFuY2hJbmZvLnNsaWNlKDEpLmpvaW4oJy8nKVxuICBbcmVtb3RlLCBicmFuY2hdXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtleHRyYUFyZ3N9PXt9KSAtPlxuICBpZiB1cHN0cmVhbSA9IGdldFVwc3RyZWFtKHJlcG8pXG4gICAgaWYgdHlwZW9mIGV4dHJhQXJncyBpcyAnc3RyaW5nJyB0aGVuIGV4dHJhQXJncyA9IFtleHRyYUFyZ3NdXG4gICAgZXh0cmFBcmdzID89IFtdXG4gICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBcIlB1bGxpbmcuLi5cIiwgZGlzbWlzc2FibGU6IHRydWVcbiAgICByZWNvcmRNZXNzYWdlID1cIlwiXCJwdWxsICN7ZXh0cmFBcmdzLmpvaW4oJyAnKX1cIlwiXCJcbiAgICBhcmdzID0gWydwdWxsJ10uY29uY2F0KGV4dHJhQXJncykuY29uY2F0KHVwc3RyZWFtKS5maWx0ZXIoZW1wdHlPclVuZGVmaW5lZClcbiAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAudGhlbiAob3V0cHV0KSAtPlxuICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHttZXNzYWdlOiByZWNvcmRNZXNzYWdlLCBvdXRwdXQsIHJlcG9OYW1lfSlcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAuY2F0Y2ggKG91dHB1dCkgLT5cbiAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7bWVzc2FnZTogcmVjb3JkTWVzc2FnZSwgb3V0cHV0LCByZXBvTmFtZSwgZmFpbGVkOiB0cnVlfSlcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgZWxzZVxuICAgIG5vdGlmaWVyLmFkZEluZm8gJ1RoZSBjdXJyZW50IGJyYW5jaCBpcyBub3QgdHJhY2tpbmcgZnJvbSB1cHN0cmVhbSdcbiJdfQ==
