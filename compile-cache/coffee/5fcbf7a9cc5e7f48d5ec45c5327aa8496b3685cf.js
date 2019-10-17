(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo, arg) {
    var setUpstream;
    setUpstream = (arg != null ? arg : {}).setUpstream;
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      var mode;
      mode = setUpstream ? 'push -u' : 'push';
      return new RemoteListView(repo, data, {
        mode: mode
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcHVzaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNmLFFBQUE7SUFEdUIsNkJBQUQsTUFBYztXQUNwQyxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxDQUFSLEVBQW9CO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBcEIsQ0FBb0QsQ0FBQyxJQUFyRCxDQUEwRCxTQUFDLElBQUQ7QUFDeEQsVUFBQTtNQUFBLElBQUEsR0FBVSxXQUFILEdBQW9CLFNBQXBCLEdBQW1DO2FBQzFDLElBQUksY0FBSixDQUFtQixJQUFuQixFQUF5QixJQUF6QixFQUErQjtRQUFDLE1BQUEsSUFBRDtPQUEvQjtJQUZ3RCxDQUExRDtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuUmVtb3RlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9yZW1vdGUtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7c2V0VXBzdHJlYW19PXt9KSAtPlxuICBnaXQuY21kKFsncmVtb3RlJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpLnRoZW4gKGRhdGEpIC0+XG4gICAgbW9kZSA9IGlmIHNldFVwc3RyZWFtIHRoZW4gJ3B1c2ggLXUnIGVsc2UgJ3B1c2gnXG4gICAgbmV3IFJlbW90ZUxpc3RWaWV3KHJlcG8sIGRhdGEsIHttb2RlfSlcbiJdfQ==
