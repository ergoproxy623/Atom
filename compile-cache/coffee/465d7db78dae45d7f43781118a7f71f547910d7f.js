(function() {
  var StatusListView, git;

  git = require('../git');

  StatusListView = require('../views/status-list-view');

  module.exports = function(repo) {
    return git.status(repo).then(function(data) {
      return new StatusListView(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtc3RhdHVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQ7V0FDZixHQUFHLENBQUMsTUFBSixDQUFXLElBQVgsQ0FBZ0IsQ0FBQyxJQUFqQixDQUFzQixTQUFDLElBQUQ7YUFBVSxJQUFJLGNBQUosQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekI7SUFBVixDQUF0QjtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuU3RhdHVzTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9zdGF0dXMtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQuc3RhdHVzKHJlcG8pLnRoZW4gKGRhdGEpIC0+IG5ldyBTdGF0dXNMaXN0VmlldyhyZXBvLCBkYXRhKVxuIl19
