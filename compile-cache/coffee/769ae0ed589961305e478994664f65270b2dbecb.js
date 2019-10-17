(function() {
  var MergeListView, git;

  git = require('../git');

  MergeListView = require('../views/merge-list-view');

  module.exports = function(repo, arg) {
    var args, extraArgs, noFastForward, ref, remote;
    ref = arg != null ? arg : {}, remote = ref.remote, noFastForward = ref.noFastForward;
    extraArgs = noFastForward ? ['--no-ff'] : [];
    args = ['branch', '--no-color'];
    if (remote) {
      args.push('-r');
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new MergeListView(repo, data, extraArgs);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtbWVyZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sYUFBQSxHQUFnQixPQUFBLENBQVEsMEJBQVI7O0VBRWhCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO3dCQURzQixNQUF3QixJQUF2QixxQkFBUTtJQUMvQixTQUFBLEdBQWUsYUFBSCxHQUFzQixDQUFDLFNBQUQsQ0FBdEIsR0FBdUM7SUFDbkQsSUFBQSxHQUFPLENBQUMsUUFBRCxFQUFXLFlBQVg7SUFDUCxJQUFrQixNQUFsQjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFBOztXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFVLElBQUksYUFBSixDQUFrQixJQUFsQixFQUF3QixJQUF4QixFQUE4QixTQUE5QjtJQUFWLENBRE47RUFKZTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbk1lcmdlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9tZXJnZS1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtyZW1vdGUsIG5vRmFzdEZvcndhcmR9PXt9KSAtPlxuICBleHRyYUFyZ3MgPSBpZiBub0Zhc3RGb3J3YXJkIHRoZW4gWyctLW5vLWZmJ10gZWxzZSBbXVxuICBhcmdzID0gWydicmFuY2gnLCAnLS1uby1jb2xvciddXG4gIGFyZ3MucHVzaCAnLXInIGlmIHJlbW90ZVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgTWVyZ2VMaXN0VmlldyhyZXBvLCBkYXRhLCBleHRyYUFyZ3MpXG4iXX0=
