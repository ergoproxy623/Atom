(function() {
  var ActivityLogger, CompositeDisposable, Path, Repository, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = data.length; j < len; i = j += 2) {
        mode = data[i];
        results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1).trim()
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(arg) {
      var mode, path;
      mode = arg.mode, path = arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "deleted:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--no-color', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['-c', 'color.ui=false', 'status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(arg) {
      var path;
      path = arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var ref;
      return (ref = p.path, indexOf.call(currentPaths, ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var firstSpliting, message, prevChangedFiles, replacerRegex, statusRegex;
    statusRegex = /\n{2,}((?:(?::\w{6} \w{6}(?: \w{7}\.{3}){2} [ MADRCU?!]\s+.+?\n?))*)$/;
    firstSpliting = statusRegex.exec(prevCommit);
    if (firstSpliting != null) {
      message = prevCommit.substring(0, firstSpliting.index);
      replacerRegex = /^:\w{6} \w{6}(?: \w{7}\.{3}){2} ([ MADRCU?!].+)$/gm;
      prevChangedFiles = (firstSpliting[1].trim().replace(replacerRegex, "$1")).split('\n');
    } else {
      message = prevCommit.trim();
      prevChangedFiles = [];
    }
    return {
      message: message,
      prevChangedFiles: prevChangedFiles
    };
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(arg) {
    var commentChar, currentChanges, filePath, message, nothingToCommit, prevChangedFiles, replacementText, status, textToReplace;
    commentChar = arg.commentChar, message = arg.message, prevChangedFiles = arg.prevChangedFiles, status = arg.status, filePath = arg.filePath;
    status = cleanupUnstagedText(status);
    status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentChar + " ");
    if (prevChangedFiles.length > 0) {
      nothingToCommit = "nothing to commit, working directory clean";
      currentChanges = "committed:\n" + commentChar;
      textToReplace = null;
      if (status.indexOf(nothingToCommit) > -1) {
        textToReplace = nothingToCommit;
      } else if (status.indexOf(currentChanges) > -1) {
        textToReplace = currentChanges;
      }
      replacementText = "committed:\n" + (prevChangedFiles.map(function(f) {
        return commentChar + "   " + f;
      }).join("\n"));
      status = status.replace(textToReplace, replacementText);
    }
    return fs.writeFileSync(filePath, message + "\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status);
  };

  showFile = function(filePath) {
    var commitEditor, ref, splitDirection;
    commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
    if (!commitEditor) {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getCenter().getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath);
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        atom.workspace.paneForURI(filePath).activate();
      } else {
        atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
      }
      return Promise.resolve(commitEditor);
    }
  };

  destroyCommitEditor = function(filePath) {
    var ref;
    return (ref = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref.destroy() : void 0;
  };

  commit = function(repo, filePath) {
    var args, repoName;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    repoName = new Repository(repo).getName();
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      ActivityLogger.record({
        repoName: repoName,
        message: 'commit',
        output: data
      });
      destroyCommitEditor(filePath);
      return git.refresh();
    })["catch"](function(data) {
      ActivityLogger.record({
        repoName: repoName,
        message: 'commit',
        output: data,
        failed: true
      });
      return destroyCommitEditor(filePath);
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    return disposables.dispose();
  };

  module.exports = function(repo) {
    var commentChar, currentPane, cwd, filePath, ref;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    commentChar = (ref = git.getConfig(repo, 'core.commentchar')) != null ? ref : '#';
    return git.cmd(['whatchanged', '-1', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getStagedFiles(repo).then(function(files) {
        prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
        return {
          message: message,
          prevChangedFiles: prevChangedFiles
        };
      });
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          commentChar: commentChar,
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(repo, filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtY29tbWl0LWFtZW5kLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc1JBQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUE2QixFQUFDLE9BQUQ7O0VBQzlDLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUF3QixFQUFDLE9BQUQ7O0VBRXJDLFdBQUEsR0FBYyxJQUFJOztFQUVsQixtQkFBQSxHQUFzQixTQUFDLElBQUQ7QUFDcEIsUUFBQTtJQUFBLElBQWEsSUFBQSxLQUFRLEVBQXJCO0FBQUEsYUFBTyxHQUFQOztJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUI7OztBQUNuQjtXQUFBLGlEQUFBOztxQkFDSDtVQUFDLE1BQUEsSUFBRDtVQUFPLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBbEI7O0FBREc7OztFQUhlOztFQU10QixxQkFBQSxHQUF3QixTQUFDLElBQUQ7V0FDdEI7TUFBQSxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBWDtNQUNBLElBQUEsRUFBTSxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsQ0FBaUIsQ0FBQyxJQUFsQixDQUFBLENBRE47O0VBRHNCOztFQUl4QixvQkFBQSxHQUF1QixTQUFDLEtBQUQ7V0FDckIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxTQUFDLEdBQUQ7QUFDUixVQUFBO01BRFUsaUJB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cG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkFjdGl2aXR5TG9nZ2VyID0gcmVxdWlyZSgnLi4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuUmVwb3NpdG9yeSA9IHJlcXVpcmUoJy4uL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5cbmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxucHJldHRpZnlTdGFnZWRGaWxlcyA9IChkYXRhKSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFwwLylbLi4uLTFdXG4gIFtdID0gZm9yIG1vZGUsIGkgaW4gZGF0YSBieSAyXG4gICAge21vZGUsIHBhdGg6IGRhdGFbaSsxXSB9XG5cbnByZXR0eWlmeVByZXZpb3VzRmlsZSA9IChkYXRhKSAtPlxuICBtb2RlOiBkYXRhWzBdXG4gIHBhdGg6IGRhdGEuc3Vic3RyaW5nKDEpLnRyaW0oKVxuXG5wcmV0dGlmeUZpbGVTdGF0dXNlcyA9IChmaWxlcykgLT5cbiAgZmlsZXMubWFwICh7bW9kZSwgcGF0aH0pIC0+XG4gICAgc3dpdGNoIG1vZGVcbiAgICAgIHdoZW4gJ00nXG4gICAgICAgIFwibW9kaWZpZWQ6ICAgI3twYXRofVwiXG4gICAgICB3aGVuICdBJ1xuICAgICAgICBcIm5ldyBmaWxlOiAgICN7cGF0aH1cIlxuICAgICAgd2hlbiAnRCdcbiAgICAgICAgXCJkZWxldGVkOiAgICN7cGF0aH1cIlxuICAgICAgd2hlbiAnUidcbiAgICAgICAgXCJyZW5hbWVkOiAgICN7cGF0aH1cIlxuXG5nZXRTdGFnZWRGaWxlcyA9IChyZXBvKSAtPlxuICBnaXQuc3RhZ2VkRmlsZXMocmVwbykudGhlbiAoZmlsZXMpIC0+XG4gICAgaWYgZmlsZXMubGVuZ3RoID49IDFcbiAgICAgIGFyZ3MgPSBbJ2RpZmYtaW5kZXgnLCAnLS1uby1jb2xvcicsICctLWNhY2hlZCcsICdIRUFEJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRhdGEpIC0+IHByZXR0aWZ5U3RhZ2VkRmlsZXMgZGF0YVxuICAgIGVsc2VcbiAgICAgIFByb21pc2UucmVzb2x2ZSBbXVxuXG5nZXRHaXRTdGF0dXMgPSAocmVwbykgLT5cbiAgZ2l0LmNtZCBbJy1jJywgJ2NvbG9yLnVpPWZhbHNlJywgJ3N0YXR1cyddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbmRpZmZGaWxlcyA9IChwcmV2aW91c0ZpbGVzLCBjdXJyZW50RmlsZXMpIC0+XG4gIHByZXZpb3VzRmlsZXMgPSBwcmV2aW91c0ZpbGVzLm1hcCAocCkgLT4gcHJldHR5aWZ5UHJldmlvdXNGaWxlIHBcbiAgY3VycmVudFBhdGhzID0gY3VycmVudEZpbGVzLm1hcCAoe3BhdGh9KSAtPiBwYXRoXG4gIHByZXZpb3VzRmlsZXMuZmlsdGVyIChwKSAtPiBwLnBhdGggaW4gY3VycmVudFBhdGhzIGlzIGZhbHNlXG5cbnBhcnNlID0gKHByZXZDb21taXQpIC0+XG4gIHN0YXR1c1JlZ2V4ID0gL1xcbnsyLH0oKD86KD86Olxcd3s2fSBcXHd7Nn0oPzogXFx3ezd9XFwuezN9KXsyfSBbIE1BRFJDVT8hXVxccysuKz9cXG4/KSkqKSQvXG4gIGZpcnN0U3BsaXRpbmcgPSBzdGF0dXNSZWdleC5leGVjIHByZXZDb21taXRcblxuICBpZiBmaXJzdFNwbGl0aW5nP1xuICAgIG1lc3NhZ2UgPSBwcmV2Q29tbWl0LnN1YnN0cmluZyAwLCBmaXJzdFNwbGl0aW5nLmluZGV4XG5cbiAgICByZXBsYWNlclJlZ2V4ID0gL146XFx3ezZ9IFxcd3s2fSg/OiBcXHd7N31cXC57M30pezJ9IChbIE1BRFJDVT8hXS4rKSQvZ21cbiAgICBwcmV2Q2hhbmdlZEZpbGVzID0gKGZpcnN0U3BsaXRpbmdbMV0udHJpbSgpLnJlcGxhY2UgcmVwbGFjZXJSZWdleCwgXCIkMVwiKS5zcGxpdCAnXFxuJ1xuICBlbHNlXG4gICAgbWVzc2FnZSA9IHByZXZDb21taXQudHJpbSgpXG4gICAgcHJldkNoYW5nZWRGaWxlcyA9IFtdXG4gIHttZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzfVxuXG5jbGVhbnVwVW5zdGFnZWRUZXh0ID0gKHN0YXR1cykgLT5cbiAgdW5zdGFnZWRGaWxlcyA9IHN0YXR1cy5pbmRleE9mIFwiQ2hhbmdlcyBub3Qgc3RhZ2VkIGZvciBjb21taXQ6XCJcbiAgaWYgdW5zdGFnZWRGaWxlcyA+PSAwXG4gICAgdGV4dCA9IHN0YXR1cy5zdWJzdHJpbmcgdW5zdGFnZWRGaWxlc1xuICAgIHN0YXR1cyA9IFwiI3tzdGF0dXMuc3Vic3RyaW5nKDAsIHVuc3RhZ2VkRmlsZXMgLSAxKX1cXG4je3RleHQucmVwbGFjZSAvXFxzKlxcKC4qXFwpXFxuL2csIFwiXCJ9XCJcbiAgZWxzZVxuICAgIHN0YXR1c1xuXG5wcmVwRmlsZSA9ICh7Y29tbWVudENoYXIsIG1lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXMsIHN0YXR1cywgZmlsZVBhdGh9KSAtPlxuICAgIHN0YXR1cyA9IGNsZWFudXBVbnN0YWdlZFRleHQgc3RhdHVzXG4gICAgc3RhdHVzID0gc3RhdHVzLnJlcGxhY2UoL1xccypcXCguKlxcKVxcbi9nLCBcIlxcblwiKS5yZXBsYWNlKC9cXG4vZywgXCJcXG4je2NvbW1lbnRDaGFyfSBcIilcbiAgICBpZiBwcmV2Q2hhbmdlZEZpbGVzLmxlbmd0aCA+IDBcbiAgICAgIG5vdGhpbmdUb0NvbW1pdCA9IFwibm90aGluZyB0byBjb21taXQsIHdvcmtpbmcgZGlyZWN0b3J5IGNsZWFuXCJcbiAgICAgIGN1cnJlbnRDaGFuZ2VzID0gXCJjb21taXR0ZWQ6XFxuI3tjb21tZW50Q2hhcn1cIlxuICAgICAgdGV4dFRvUmVwbGFjZSA9IG51bGxcbiAgICAgIGlmIHN0YXR1cy5pbmRleE9mKG5vdGhpbmdUb0NvbW1pdCkgPiAtMVxuICAgICAgICB0ZXh0VG9SZXBsYWNlID0gbm90aGluZ1RvQ29tbWl0XG4gICAgICBlbHNlIGlmIHN0YXR1cy5pbmRleE9mKGN1cnJlbnRDaGFuZ2VzKSA+IC0xXG4gICAgICAgIHRleHRUb1JlcGxhY2UgPSBjdXJyZW50Q2hhbmdlc1xuICAgICAgcmVwbGFjZW1lbnRUZXh0ID1cbiAgICAgICAgXCJcIlwiY29tbWl0dGVkOlxuICAgICAgICAje1xuICAgICAgICAgIHByZXZDaGFuZ2VkRmlsZXMubWFwKChmKSAtPiBcIiN7Y29tbWVudENoYXJ9ICAgI3tmfVwiKS5qb2luKFwiXFxuXCIpXG4gICAgICAgIH1cIlwiXCJcbiAgICAgIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlIHRleHRUb1JlcGxhY2UsIHJlcGxhY2VtZW50VGV4dFxuICAgIGZzLndyaXRlRmlsZVN5bmMgZmlsZVBhdGgsXG4gICAgICBcIlwiXCIje21lc3NhZ2V9XG4gICAgICAje2NvbW1lbnRDaGFyfSBQbGVhc2UgZW50ZXIgdGhlIGNvbW1pdCBtZXNzYWdlIGZvciB5b3VyIGNoYW5nZXMuIExpbmVzIHN0YXJ0aW5nXG4gICAgICAje2NvbW1lbnRDaGFyfSB3aXRoICcje2NvbW1lbnRDaGFyfScgd2lsbCBiZSBpZ25vcmVkLCBhbmQgYW4gZW1wdHkgbWVzc2FnZSBhYm9ydHMgdGhlIGNvbW1pdC5cbiAgICAgICN7Y29tbWVudENoYXJ9XG4gICAgICAje2NvbW1lbnRDaGFyfSAje3N0YXR1c31cIlwiXCJcblxuc2hvd0ZpbGUgPSAoZmlsZVBhdGgpIC0+XG4gIGNvbW1pdEVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpPy5pdGVtRm9yVVJJKGZpbGVQYXRoKVxuICBpZiBub3QgY29tbWl0RWRpdG9yXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgICAgc3BsaXREaXJlY3Rpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuc3BsaXRQYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmUoKVtcInNwbGl0I3tzcGxpdERpcmVjdGlvbn1cIl0oKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZmlsZVBhdGhcbiAgZWxzZVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLmFjdGl2YXRlKClcbiAgICBlbHNlXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZUl0ZW1Gb3JVUkkoZmlsZVBhdGgpXG4gICAgUHJvbWlzZS5yZXNvbHZlKGNvbW1pdEVkaXRvcilcblxuZGVzdHJveUNvbW1pdEVkaXRvciA9IChmaWxlUGF0aCkgLT5cbiAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuaXRlbUZvclVSSShmaWxlUGF0aCk/LmRlc3Ryb3koKVxuXG5jb21taXQgPSAocmVwbywgZmlsZVBhdGgpIC0+XG4gIGFyZ3MgPSBbJ2NvbW1pdCcsICctLWFtZW5kJywgJy0tY2xlYW51cD1zdHJpcCcsIFwiLS1maWxlPSN7ZmlsZVBhdGh9XCJdXG4gIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHsgcmVwb05hbWUsIG1lc3NhZ2U6ICdjb21taXQnLCBvdXRwdXQ6IGRhdGF9KVxuICAgIGRlc3Ryb3lDb21taXRFZGl0b3IoZmlsZVBhdGgpXG4gICAgZ2l0LnJlZnJlc2goKVxuICAuY2F0Y2ggKGRhdGEpIC0+XG4gICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgIG1lc3NhZ2U6ICdjb21taXQnLCBvdXRwdXQ6IGRhdGEsIGZhaWxlZDogdHJ1ZSB9KVxuICAgIGRlc3Ryb3lDb21taXRFZGl0b3IoZmlsZVBhdGgpXG5cbmNsZWFudXAgPSAoY3VycmVudFBhbmUsIGZpbGVQYXRoKSAtPlxuICBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpIGlmIGN1cnJlbnRQYW5lLmlzQWxpdmUoKVxuICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgZmlsZVBhdGggPSBQYXRoLmpvaW4ocmVwby5nZXRQYXRoKCksICdDT01NSVRfRURJVE1TRycpXG4gIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gIGNvbW1lbnRDaGFyID0gZ2l0LmdldENvbmZpZyhyZXBvLCAnY29yZS5jb21tZW50Y2hhcicpID8gJyMnXG4gIGdpdC5jbWQoWyd3aGF0Y2hhbmdlZCcsICctMScsICctLWZvcm1hdD0lQiddLCB7Y3dkfSlcbiAgLnRoZW4gKGFtZW5kKSAtPiBwYXJzZSBhbWVuZFxuICAudGhlbiAoe21lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXN9KSAtPlxuICAgIGdldFN0YWdlZEZpbGVzKHJlcG8pXG4gICAgLnRoZW4gKGZpbGVzKSAtPlxuICAgICAgcHJldkNoYW5nZWRGaWxlcyA9IHByZXR0aWZ5RmlsZVN0YXR1c2VzKGRpZmZGaWxlcyBwcmV2Q2hhbmdlZEZpbGVzLCBmaWxlcylcbiAgICAgIHttZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzfVxuICAudGhlbiAoe21lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXN9KSAtPlxuICAgIGdldEdpdFN0YXR1cyhyZXBvKVxuICAgIC50aGVuIChzdGF0dXMpIC0+IHByZXBGaWxlIHtjb21tZW50Q2hhciwgbWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlcywgc3RhdHVzLCBmaWxlUGF0aH1cbiAgICAudGhlbiAtPiBzaG93RmlsZSBmaWxlUGF0aFxuICAudGhlbiAodGV4dEVkaXRvcikgLT5cbiAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZFNhdmUgLT4gY29tbWl0KHJlcG8sIGZpbGVQYXRoKVxuICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSAtPiBjbGVhbnVwIGN1cnJlbnRQYW5lLCBmaWxlUGF0aFxuICAuY2F0Y2ggKG1zZykgLT4gbm90aWZpZXIuYWRkSW5mbyBtc2dcbiJdfQ==
