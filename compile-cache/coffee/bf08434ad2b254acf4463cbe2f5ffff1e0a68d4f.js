(function() {
  var fs, git, notifier;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  module.exports = function(repo, arg) {
    var file, isFolder, ref, tool;
    file = (arg != null ? arg : {}).file;
    if (file == null) {
      file = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    }
    isFolder = fs.isDirectorySync(file);
    if (!file) {
      return notifier.addInfo("No open file. Select 'Diff All'.");
    }
    if (!(tool = git.getConfig(repo, 'diff.tool'))) {
      return notifier.addInfo("You don't have a difftool configured.");
    } else {
      return git.cmd(['diff-index', 'HEAD', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        var args, diffIndex, diffsForCurrentFile, includeStagedDiff;
        diffIndex = data.split('\0');
        includeStagedDiff = atom.config.get('git-plus.diffs.includeStagedDiff');
        if (isFolder) {
          args = ['difftool', '-d', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(message) {
            return atom.notifications.addError('Error opening difftool', {
              detail: message
            });
          });
          return;
        }
        diffsForCurrentFile = diffIndex.map(function(line, i) {
          var path, staged;
          if (i % 2 === 0) {
            staged = !/^0{40}$/.test(diffIndex[i].split(' ')[3]);
            path = diffIndex[i + 1];
            if (path === file && (!staged || includeStagedDiff)) {
              return true;
            }
          } else {
            return void 0;
          }
        });
        if (diffsForCurrentFile.filter(function(diff) {
          return diff != null;
        })[0] != null) {
          args = ['difftool', '--no-prompt'];
          if (includeStagedDiff) {
            args.push('HEAD');
          }
          args.push(file);
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          })["catch"](function(message) {
            return atom.notifications.addError('Error opening difftool', {
              detail: message
            });
          });
        } else {
          return notifier.addInfo('Nothing to show.');
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZGlmZnRvb2wuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1QixzQkFBRCxNQUFPOztNQUM3QixPQUFRLElBQUksQ0FBQyxVQUFMLDJEQUFvRCxDQUFFLE9BQXRDLENBQUEsVUFBaEI7O0lBQ1IsUUFBQSxHQUFXLEVBQUUsQ0FBQyxlQUFILENBQW1CLElBQW5CO0lBRVgsSUFBRyxDQUFJLElBQVA7QUFDRSxhQUFPLFFBQVEsQ0FBQyxPQUFULENBQWlCLGtDQUFqQixFQURUOztJQUtBLElBQUEsQ0FBTyxDQUFBLElBQUEsR0FBTyxHQUFHLENBQUMsU0FBSixDQUFjLElBQWQsRUFBb0IsV0FBcEIsQ0FBUCxDQUFQO2FBQ0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsdUNBQWpCLEVBREY7S0FBQSxNQUFBO2FBR0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFlBQUQsRUFBZSxNQUFmLEVBQXVCLElBQXZCLENBQVIsRUFBc0M7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUF0QyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtBQUNKLFlBQUE7UUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO1FBQ1osaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQjtRQUVwQixJQUFHLFFBQUg7VUFDRSxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixhQUFuQjtVQUNQLElBQW9CLGlCQUFwQjtZQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFBOztVQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVjtVQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1lBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7V0FBZCxDQUNBLEVBQUMsS0FBRCxFQURBLENBQ08sU0FBQyxPQUFEO21CQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsd0JBQTVCLEVBQXNEO2NBQUMsTUFBQSxFQUFRLE9BQVQ7YUFBdEQ7VUFBYixDQURQO0FBRUEsaUJBTkY7O1FBUUEsbUJBQUEsR0FBc0IsU0FBUyxDQUFDLEdBQVYsQ0FBYyxTQUFDLElBQUQsRUFBTyxDQUFQO0FBQ2xDLGNBQUE7VUFBQSxJQUFHLENBQUEsR0FBSSxDQUFKLEtBQVMsQ0FBWjtZQUNFLE1BQUEsR0FBUyxDQUFJLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDO1lBQ2IsSUFBQSxHQUFPLFNBQVUsQ0FBQSxDQUFBLEdBQUUsQ0FBRjtZQUNqQixJQUFRLElBQUEsS0FBUSxJQUFSLElBQWlCLENBQUMsQ0FBQyxNQUFELElBQVcsaUJBQVosQ0FBekI7cUJBQUEsS0FBQTthQUhGO1dBQUEsTUFBQTttQkFLRSxPQUxGOztRQURrQyxDQUFkO1FBUXRCLElBQUc7O3FCQUFIO1VBQ0UsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLGFBQWI7VUFDUCxJQUFvQixpQkFBcEI7WUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsRUFBQTs7VUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVY7aUJBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7WUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtXQUFkLENBQ0EsRUFBQyxLQUFELEVBREEsQ0FDTyxTQUFDLE9BQUQ7bUJBQWEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0Qix3QkFBNUIsRUFBc0Q7Y0FBQyxNQUFBLEVBQVEsT0FBVDthQUF0RDtVQUFiLENBRFAsRUFKRjtTQUFBLE1BQUE7aUJBT0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsa0JBQWpCLEVBUEY7O01BcEJJLENBRE4sRUFIRjs7RUFUZTtBQUpqQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtmaWxlfT17fSkgLT5cbiAgZmlsZSA/PSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gIGlzRm9sZGVyID0gZnMuaXNEaXJlY3RvcnlTeW5jIGZpbGVcblxuICBpZiBub3QgZmlsZVxuICAgIHJldHVybiBub3RpZmllci5hZGRJbmZvIFwiTm8gb3BlbiBmaWxlLiBTZWxlY3QgJ0RpZmYgQWxsJy5cIlxuXG4gICMgV2UgcGFyc2UgdGhlIG91dHB1dCBvZiBnaXQgZGlmZi1pbmRleCB0byBoYW5kbGUgdGhlIGNhc2Ugb2YgYSBzdGFnZWQgZmlsZVxuICAjIHdoZW4gZ2l0LXBsdXMuZGlmZnMuaW5jbHVkZVN0YWdlZERpZmYgaXMgc2V0IHRvIGZhbHNlLlxuICB1bmxlc3MgdG9vbCA9IGdpdC5nZXRDb25maWcocmVwbywgJ2RpZmYudG9vbCcpXG4gICAgbm90aWZpZXIuYWRkSW5mbyBcIllvdSBkb24ndCBoYXZlIGEgZGlmZnRvb2wgY29uZmlndXJlZC5cIlxuICBlbHNlXG4gICAgZ2l0LmNtZChbJ2RpZmYtaW5kZXgnLCAnSEVBRCcsICcteiddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgZGlmZkluZGV4ID0gZGF0YS5zcGxpdCgnXFwwJylcbiAgICAgIGluY2x1ZGVTdGFnZWREaWZmID0gYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5kaWZmcy5pbmNsdWRlU3RhZ2VkRGlmZidcblxuICAgICAgaWYgaXNGb2xkZXJcbiAgICAgICAgYXJncyA9IFsnZGlmZnRvb2wnLCAnLWQnLCAnLS1uby1wcm9tcHQnXVxuICAgICAgICBhcmdzLnB1c2ggJ0hFQUQnIGlmIGluY2x1ZGVTdGFnZWREaWZmXG4gICAgICAgIGFyZ3MucHVzaCBmaWxlXG4gICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgLmNhdGNoIChtZXNzYWdlKSAtPiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIG9wZW5pbmcgZGlmZnRvb2wnLCB7ZGV0YWlsOiBtZXNzYWdlfSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGRpZmZzRm9yQ3VycmVudEZpbGUgPSBkaWZmSW5kZXgubWFwIChsaW5lLCBpKSAtPlxuICAgICAgICBpZiBpICUgMiBpcyAwXG4gICAgICAgICAgc3RhZ2VkID0gbm90IC9eMHs0MH0kLy50ZXN0KGRpZmZJbmRleFtpXS5zcGxpdCgnICcpWzNdKTtcbiAgICAgICAgICBwYXRoID0gZGlmZkluZGV4W2krMV1cbiAgICAgICAgICB0cnVlIGlmIHBhdGggaXMgZmlsZSBhbmQgKCFzdGFnZWQgb3IgaW5jbHVkZVN0YWdlZERpZmYpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB1bmRlZmluZWRcblxuICAgICAgaWYgZGlmZnNGb3JDdXJyZW50RmlsZS5maWx0ZXIoKGRpZmYpIC0+IGRpZmY/KVswXT9cbiAgICAgICAgYXJncyA9IFsnZGlmZnRvb2wnLCAnLS1uby1wcm9tcHQnXVxuICAgICAgICBhcmdzLnB1c2ggJ0hFQUQnIGlmIGluY2x1ZGVTdGFnZWREaWZmXG4gICAgICAgIGFyZ3MucHVzaCBmaWxlXG4gICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgLmNhdGNoIChtZXNzYWdlKSAtPiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIG9wZW5pbmcgZGlmZnRvb2wnLCB7ZGV0YWlsOiBtZXNzYWdlfSlcbiAgICAgIGVsc2VcbiAgICAgICAgbm90aWZpZXIuYWRkSW5mbyAnTm90aGluZyB0byBzaG93LidcbiJdfQ==
