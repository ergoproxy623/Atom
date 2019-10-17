(function() {
  var ActivityLogger, Repository, git;

  git = require('../git-es')["default"];

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  module.exports = function(repo) {
    var cwd;
    cwd = repo.getWorkingDirectory();
    return git(['stash', 'pop'], {
      cwd: cwd,
      color: true
    }).then(function(result) {
      var repoName;
      repoName = new Repository(repo).getName();
      return ActivityLogger.record(Object.assign({
        repoName: repoName,
        message: 'Pop stash'
      }, result));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3Rhc2gtcG9wLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSLENBQW9CLEVBQUMsT0FBRDs7RUFDMUIsY0FBQSxHQUFpQixPQUFBLENBQVEsb0JBQVIsQ0FBNkIsRUFBQyxPQUFEOztFQUM5QyxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FBd0IsRUFBQyxPQUFEOztFQUVyQyxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7QUFDZixRQUFBO0lBQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBO1dBQ04sR0FBQSxDQUFJLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FBSixFQUFzQjtNQUFDLEtBQUEsR0FBRDtNQUFNLEtBQUEsRUFBTyxJQUFiO0tBQXRCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxNQUFEO0FBQ0osVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFJLFVBQUosQ0FBZSxJQUFmLENBQW9CLENBQUMsT0FBckIsQ0FBQTthQUNYLGNBQWMsQ0FBQyxNQUFmLENBQXNCLE1BQU0sQ0FBQyxNQUFQLENBQWM7UUFBQyxVQUFBLFFBQUQ7UUFBVyxPQUFBLEVBQVMsV0FBcEI7T0FBZCxFQUFnRCxNQUFoRCxDQUF0QjtJQUZJLENBRE47RUFGZTtBQUpqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUoJy4uL2dpdC1lcycpLmRlZmF1bHRcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gIGdpdChbJ3N0YXNoJywgJ3BvcCddLCB7Y3dkLCBjb2xvcjogdHJ1ZX0pXG4gIC50aGVuIChyZXN1bHQpIC0+XG4gICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShyZXBvKS5nZXROYW1lKClcbiAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoT2JqZWN0LmFzc2lnbih7cmVwb05hbWUsIG1lc3NhZ2U6ICdQb3Agc3Rhc2gnfSwgcmVzdWx0KSlcbiJdfQ==
