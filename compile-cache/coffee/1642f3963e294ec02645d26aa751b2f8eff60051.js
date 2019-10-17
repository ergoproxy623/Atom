(function() {
  var $, BufferedProcess, CompositeDisposable, SplitDiff, SyncScroll, _, disposables, fs, git, notifier, path, ref, showRevision, splitDiff, updateNewTextEditor;

  _ = require('underscore-plus');

  path = require('path');

  fs = require('fs');

  git = require('../git');

  notifier = require('../notifier');

  ref = require("atom"), CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

  $ = require("atom-space-pen-views").$;

  disposables = new CompositeDisposable;

  SplitDiff = null;

  SyncScroll = null;

  splitDiff = function(editor, newTextEditor) {
    var editors, syncScroll;
    editors = {
      editor1: newTextEditor,
      editor2: editor
    };
    SplitDiff._setConfig('diffWords', true);
    SplitDiff._setConfig('ignoreWhitespace', true);
    SplitDiff._setConfig('syncHorizontalScroll', true);
    SplitDiff.diffPanes();
    SplitDiff.updateDiff(editors);
    syncScroll = new SyncScroll(editors.editor1, editors.editor2, true);
    return syncScroll.syncPositions();
  };

  updateNewTextEditor = function(newTextEditor, editor, gitRevision, fileContents) {
    return _.delay(function() {
      var lineEnding, ref1;
      lineEnding = ((ref1 = editor.buffer) != null ? ref1.lineEndingForRow(0) : void 0) || "\n";
      fileContents = fileContents.replace(/(\r\n|\n)/g, lineEnding);
      newTextEditor.buffer.setPreferredLineEnding(lineEnding);
      newTextEditor.setText(fileContents);
      newTextEditor.buffer.cachedDiskContents = fileContents;
      return splitDiff(editor, newTextEditor);
    }, 300);
  };

  showRevision = function(repo, filePath, editor, gitRevision, fileContents, options) {
    var outputFilePath, ref1, tempContent;
    if (options == null) {
      options = {};
    }
    gitRevision = path.basename(gitRevision);
    outputFilePath = (repo.getPath()) + "/{" + gitRevision + "} " + (path.basename(filePath));
    if (options.diff) {
      outputFilePath += ".diff";
    }
    tempContent = "Loading..." + ((ref1 = editor.buffer) != null ? ref1.lineEndingForRow(0) : void 0);
    return fs.writeFile(outputFilePath, tempContent, (function(_this) {
      return function(error) {
        if (!error) {
          return atom.workspace.open(filePath, {
            split: "left"
          }).then(function(editor) {
            return atom.workspace.open(outputFilePath, {
              split: "right"
            }).then(function(newTextEditor) {
              updateNewTextEditor(newTextEditor, editor, gitRevision, fileContents);
              try {
                return disposables.add(newTextEditor.onDidDestroy(function() {
                  return fs.unlink(outputFilePath);
                }));
              } catch (error1) {
                error = error1;
                return atom.notifications.addError("Could not remove file " + outputFilePath);
              }
            });
          });
        }
      };
    })(this));
  };

  module.exports = {
    showRevision: function(repo, editor, gitRevision) {
      var args, error, fileName, filePath, options;
      if (!SplitDiff) {
        try {
          SplitDiff = require(atom.packages.resolvePackagePath('split-diff'));
          SyncScroll = require(atom.packages.resolvePackagePath('split-diff') + '/lib/sync-scroll');
          atom.themes.requireStylesheet(atom.packages.resolvePackagePath('split-diff') + '/styles/split-diff');
        } catch (error1) {
          error = error1;
          return notifier.addInfo("Could not load 'split-diff' package to open diff view. Please install it `apm install split-diff`.");
        }
      }
      options = {
        diff: false
      };
      SplitDiff.disable(false);
      filePath = editor.getPath();
      fileName = path.basename(filePath);
      args = ["show", gitRevision + ":./" + fileName];
      return git.cmd(args, {
        cwd: path.dirname(filePath)
      }).then(function(data) {
        return showRevision(repo, filePath, editor, gitRevision, data, options);
      })["catch"](function(code) {
        return atom.notifications.addError("Git Plus: Could not retrieve revision for " + fileName + " (" + code + ")");
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL2dpdC1yZXZpc2lvbi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBRVgsTUFBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyw2Q0FBRCxFQUFzQjs7RUFDckIsSUFBSyxPQUFBLENBQVEsc0JBQVI7O0VBRU4sV0FBQSxHQUFjLElBQUk7O0VBQ2xCLFNBQUEsR0FBWTs7RUFDWixVQUFBLEdBQWE7O0VBRWIsU0FBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLGFBQVQ7QUFDVixRQUFBO0lBQUEsT0FBQSxHQUNFO01BQUEsT0FBQSxFQUFTLGFBQVQ7TUFDQSxPQUFBLEVBQVMsTUFEVDs7SUFFRixTQUFTLENBQUMsVUFBVixDQUFxQixXQUFyQixFQUFrQyxJQUFsQztJQUNBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLGtCQUFyQixFQUF5QyxJQUF6QztJQUNBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLHNCQUFyQixFQUE2QyxJQUE3QztJQUNBLFNBQVMsQ0FBQyxTQUFWLENBQUE7SUFDQSxTQUFTLENBQUMsVUFBVixDQUFxQixPQUFyQjtJQUNBLFVBQUEsR0FBYSxJQUFJLFVBQUosQ0FBZSxPQUFPLENBQUMsT0FBdkIsRUFBZ0MsT0FBTyxDQUFDLE9BQXhDLEVBQWlELElBQWpEO1dBQ2IsVUFBVSxDQUFDLGFBQVgsQ0FBQTtFQVZVOztFQVlaLG1CQUFBLEdBQXNCLFNBQUMsYUFBRCxFQUFnQixNQUFoQixFQUF3QixXQUF4QixFQUFxQyxZQUFyQztXQUNwQixDQUFDLENBQUMsS0FBRixDQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsVUFBQSx5Q0FBMEIsQ0FBRSxnQkFBZixDQUFnQyxDQUFoQyxXQUFBLElBQXNDO01BQ25ELFlBQUEsR0FBZSxZQUFZLENBQUMsT0FBYixDQUFxQixZQUFyQixFQUFtQyxVQUFuQztNQUNmLGFBQWEsQ0FBQyxNQUFNLENBQUMsc0JBQXJCLENBQTRDLFVBQTVDO01BQ0EsYUFBYSxDQUFDLE9BQWQsQ0FBc0IsWUFBdEI7TUFDQSxhQUFhLENBQUMsTUFBTSxDQUFDLGtCQUFyQixHQUEwQzthQUMxQyxTQUFBLENBQVUsTUFBVixFQUFrQixhQUFsQjtJQU5NLENBQVIsRUFPRSxHQVBGO0VBRG9COztFQVV0QixZQUFBLEdBQWUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixNQUFqQixFQUF5QixXQUF6QixFQUFzQyxZQUF0QyxFQUFvRCxPQUFwRDtBQUNiLFFBQUE7O01BRGlFLFVBQVE7O0lBQ3pFLFdBQUEsR0FBYyxJQUFJLENBQUMsUUFBTCxDQUFjLFdBQWQ7SUFDZCxjQUFBLEdBQW1CLENBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQUFELENBQUEsR0FBZ0IsSUFBaEIsR0FBb0IsV0FBcEIsR0FBZ0MsSUFBaEMsR0FBbUMsQ0FBQyxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQsQ0FBRDtJQUN0RCxJQUE2QixPQUFPLENBQUMsSUFBckM7TUFBQSxjQUFBLElBQWtCLFFBQWxCOztJQUNBLFdBQUEsR0FBYyxZQUFBLHlDQUE0QixDQUFFLGdCQUFmLENBQWdDLENBQWhDO1dBQzdCLEVBQUUsQ0FBQyxTQUFILENBQWEsY0FBYixFQUE2QixXQUE3QixFQUEwQyxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsS0FBRDtRQUN4QyxJQUFHLENBQUksS0FBUDtpQkFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsRUFDRTtZQUFBLEtBQUEsRUFBTyxNQUFQO1dBREYsQ0FFQSxDQUFDLElBRkQsQ0FFTSxTQUFDLE1BQUQ7bUJBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQXBCLEVBQ0U7Y0FBQSxLQUFBLEVBQU8sT0FBUDthQURGLENBRUEsQ0FBQyxJQUZELENBRU0sU0FBQyxhQUFEO2NBQ0osbUJBQUEsQ0FBb0IsYUFBcEIsRUFBbUMsTUFBbkMsRUFBMkMsV0FBM0MsRUFBd0QsWUFBeEQ7QUFDQTt1QkFDRSxXQUFXLENBQUMsR0FBWixDQUFnQixhQUFhLENBQUMsWUFBZCxDQUEyQixTQUFBO3lCQUFHLEVBQUUsQ0FBQyxNQUFILENBQVUsY0FBVjtnQkFBSCxDQUEzQixDQUFoQixFQURGO2VBQUEsY0FBQTtnQkFFTTtBQUNKLHVCQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsd0JBQUEsR0FBeUIsY0FBckQsRUFIVDs7WUFGSSxDQUZOO1VBREksQ0FGTixFQURGOztNQUR3QztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUM7RUFMYTs7RUFtQmYsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFlBQUEsRUFBYyxTQUFDLElBQUQsRUFBTyxNQUFQLEVBQWUsV0FBZjtBQUNaLFVBQUE7TUFBQSxJQUFHLENBQUksU0FBUDtBQUNFO1VBQ0UsU0FBQSxHQUFZLE9BQUEsQ0FBUSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQWlDLFlBQWpDLENBQVI7VUFDWixVQUFBLEdBQWEsT0FBQSxDQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsWUFBakMsQ0FBQSxHQUFpRCxrQkFBekQ7VUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFaLENBQThCLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsWUFBakMsQ0FBQSxHQUFpRCxvQkFBL0UsRUFIRjtTQUFBLGNBQUE7VUFJTTtBQUNKLGlCQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLG9HQUFqQixFQUxUO1NBREY7O01BUUEsT0FBQSxHQUFVO1FBQUMsSUFBQSxFQUFNLEtBQVA7O01BRVYsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsS0FBbEI7TUFFQSxRQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQTtNQUNYLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQ7TUFFWCxJQUFBLEdBQU8sQ0FBQyxNQUFELEVBQVksV0FBRCxHQUFhLEtBQWIsR0FBa0IsUUFBN0I7YUFDUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWIsQ0FBTDtPQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2VBQ0osWUFBQSxDQUFhLElBQWIsRUFBbUIsUUFBbkIsRUFBNkIsTUFBN0IsRUFBcUMsV0FBckMsRUFBa0QsSUFBbEQsRUFBd0QsT0FBeEQ7TUFESSxDQUROLENBR0EsRUFBQyxLQUFELEVBSEEsQ0FHTyxTQUFDLElBQUQ7ZUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLDRDQUFBLEdBQTZDLFFBQTdDLEdBQXNELElBQXRELEdBQTBELElBQTFELEdBQStELEdBQTNGO01BREssQ0FIUDtJQWpCWSxDQUFkOztBQXZERiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuXG57Q29tcG9zaXRlRGlzcG9zYWJsZSwgQnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgXCJhdG9tXCJcbnskfSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5cbmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblNwbGl0RGlmZiA9IG51bGxcblN5bmNTY3JvbGwgPSBudWxsXG5cbnNwbGl0RGlmZiA9IChlZGl0b3IsIG5ld1RleHRFZGl0b3IpIC0+XG4gIGVkaXRvcnMgPVxuICAgIGVkaXRvcjE6IG5ld1RleHRFZGl0b3IgICAgIyB0aGUgb2xkZXIgcmV2aXNpb25cbiAgICBlZGl0b3IyOiBlZGl0b3IgICAgICAgICAgICMgY3VycmVudCByZXZcbiAgU3BsaXREaWZmLl9zZXRDb25maWcgJ2RpZmZXb3JkcycsIHRydWVcbiAgU3BsaXREaWZmLl9zZXRDb25maWcgJ2lnbm9yZVdoaXRlc3BhY2UnLCB0cnVlXG4gIFNwbGl0RGlmZi5fc2V0Q29uZmlnICdzeW5jSG9yaXpvbnRhbFNjcm9sbCcsIHRydWVcbiAgU3BsaXREaWZmLmRpZmZQYW5lcygpXG4gIFNwbGl0RGlmZi51cGRhdGVEaWZmKGVkaXRvcnMpXG4gIHN5bmNTY3JvbGwgPSBuZXcgU3luY1Njcm9sbChlZGl0b3JzLmVkaXRvcjEsIGVkaXRvcnMuZWRpdG9yMiwgdHJ1ZSlcbiAgc3luY1Njcm9sbC5zeW5jUG9zaXRpb25zKClcblxudXBkYXRlTmV3VGV4dEVkaXRvciA9IChuZXdUZXh0RWRpdG9yLCBlZGl0b3IsIGdpdFJldmlzaW9uLCBmaWxlQ29udGVudHMpIC0+XG4gIF8uZGVsYXkgLT5cbiAgICBsaW5lRW5kaW5nID0gZWRpdG9yLmJ1ZmZlcj8ubGluZUVuZGluZ0ZvclJvdygwKSB8fCBcIlxcblwiXG4gICAgZmlsZUNvbnRlbnRzID0gZmlsZUNvbnRlbnRzLnJlcGxhY2UoLyhcXHJcXG58XFxuKS9nLCBsaW5lRW5kaW5nKVxuICAgIG5ld1RleHRFZGl0b3IuYnVmZmVyLnNldFByZWZlcnJlZExpbmVFbmRpbmcobGluZUVuZGluZylcbiAgICBuZXdUZXh0RWRpdG9yLnNldFRleHQoZmlsZUNvbnRlbnRzKVxuICAgIG5ld1RleHRFZGl0b3IuYnVmZmVyLmNhY2hlZERpc2tDb250ZW50cyA9IGZpbGVDb250ZW50c1xuICAgIHNwbGl0RGlmZihlZGl0b3IsIG5ld1RleHRFZGl0b3IpXG4gICwgMzAwXG5cbnNob3dSZXZpc2lvbiA9IChyZXBvLCBmaWxlUGF0aCwgZWRpdG9yLCBnaXRSZXZpc2lvbiwgZmlsZUNvbnRlbnRzLCBvcHRpb25zPXt9KSAtPlxuICBnaXRSZXZpc2lvbiA9IHBhdGguYmFzZW5hbWUoZ2l0UmV2aXNpb24pXG4gIG91dHB1dEZpbGVQYXRoID0gXCIje3JlcG8uZ2V0UGF0aCgpfS97I3tnaXRSZXZpc2lvbn19ICN7cGF0aC5iYXNlbmFtZShmaWxlUGF0aCl9XCJcbiAgb3V0cHV0RmlsZVBhdGggKz0gXCIuZGlmZlwiIGlmIG9wdGlvbnMuZGlmZlxuICB0ZW1wQ29udGVudCA9IFwiTG9hZGluZy4uLlwiICsgZWRpdG9yLmJ1ZmZlcj8ubGluZUVuZGluZ0ZvclJvdygwKVxuICBmcy53cml0ZUZpbGUgb3V0cHV0RmlsZVBhdGgsIHRlbXBDb250ZW50LCAoZXJyb3IpID0+XG4gICAgaWYgbm90IGVycm9yXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGVQYXRoLFxuICAgICAgICBzcGxpdDogXCJsZWZ0XCJcbiAgICAgIC50aGVuIChlZGl0b3IpID0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gb3V0cHV0RmlsZVBhdGgsXG4gICAgICAgICAgc3BsaXQ6IFwicmlnaHRcIlxuICAgICAgICAudGhlbiAobmV3VGV4dEVkaXRvcikgPT5cbiAgICAgICAgICB1cGRhdGVOZXdUZXh0RWRpdG9yKG5ld1RleHRFZGl0b3IsIGVkaXRvciwgZ2l0UmV2aXNpb24sIGZpbGVDb250ZW50cylcbiAgICAgICAgICB0cnlcbiAgICAgICAgICAgIGRpc3Bvc2FibGVzLmFkZCBuZXdUZXh0RWRpdG9yLm9uRGlkRGVzdHJveSAtPiBmcy51bmxpbmsgb3V0cHV0RmlsZVBhdGhcbiAgICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBcIkNvdWxkIG5vdCByZW1vdmUgZmlsZSAje291dHB1dEZpbGVQYXRofVwiXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgc2hvd1JldmlzaW9uOiAocmVwbywgZWRpdG9yLCBnaXRSZXZpc2lvbikgLT5cbiAgICBpZiBub3QgU3BsaXREaWZmXG4gICAgICB0cnlcbiAgICAgICAgU3BsaXREaWZmID0gcmVxdWlyZSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgnc3BsaXQtZGlmZicpXG4gICAgICAgIFN5bmNTY3JvbGwgPSByZXF1aXJlIGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCdzcGxpdC1kaWZmJykgKyAnL2xpYi9zeW5jLXNjcm9sbCdcbiAgICAgICAgYXRvbS50aGVtZXMucmVxdWlyZVN0eWxlc2hlZXQoYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ3NwbGl0LWRpZmYnKSArICcvc3R5bGVzL3NwbGl0LWRpZmYnKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgcmV0dXJuIG5vdGlmaWVyLmFkZEluZm8oXCJDb3VsZCBub3QgbG9hZCAnc3BsaXQtZGlmZicgcGFja2FnZSB0byBvcGVuIGRpZmYgdmlldy4gUGxlYXNlIGluc3RhbGwgaXQgYGFwbSBpbnN0YWxsIHNwbGl0LWRpZmZgLlwiKVxuXG4gICAgb3B0aW9ucyA9IHtkaWZmOiBmYWxzZX1cblxuICAgIFNwbGl0RGlmZi5kaXNhYmxlKGZhbHNlKVxuXG4gICAgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgZmlsZU5hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKVxuXG4gICAgYXJncyA9IFtcInNob3dcIiwgXCIje2dpdFJldmlzaW9ufTouLyN7ZmlsZU5hbWV9XCJdXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHBhdGguZGlybmFtZShmaWxlUGF0aCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBzaG93UmV2aXNpb24ocmVwbywgZmlsZVBhdGgsIGVkaXRvciwgZ2l0UmV2aXNpb24sIGRhdGEsIG9wdGlvbnMpXG4gICAgLmNhdGNoIChjb2RlKSAtPlxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiR2l0IFBsdXM6IENvdWxkIG5vdCByZXRyaWV2ZSByZXZpc2lvbiBmb3IgI3tmaWxlTmFtZX0gKCN7Y29kZX0pXCIpXG4iXX0=
