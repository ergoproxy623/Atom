(function() {
  var ActivityLogger, BufferedProcess, Directory, Os, RepoListView, Repository, _prettify, _prettifyDiff, _prettifyUntracked, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, ref;

  Os = require('os');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, Directory = ref.Directory;

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  Repository = require('./repository')["default"];

  ActivityLogger = require('./activity-logger')["default"];

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data, arg) {
    var i, mode, staged;
    staged = (arg != null ? arg : {}).staged;
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
          staged: staged,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/).filter(function(d) {
      return d !== '';
    });
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, ref1;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(ref1 = (function() {
      var j, len, ref2, results;
      ref2 = data.slice(1);
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        line = ref2[j];
        results.push('@@' + line);
      }
      return results;
    })())), ref1;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, ref1;
      project = atom.project;
      path = (ref1 = atom.workspace.getCenter().getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options, arg) {
      var color;
      if (options == null) {
        options = {
          env: process.env
        };
      }
      color = (arg != null ? arg : {}).color;
      return new Promise(function(resolve, reject) {
        var output, process, ref1;
        output = '';
        if (color) {
          args = ['-c', 'color.ui=always'].concat(args);
        }
        process = new BufferedProcess({
          command: (ref1 = atom.config.get('git-plus.general.gitPath')) != null ? ref1 : 'git',
          args: args,
          options: options,
          stdout: function(data) {
            return output += data.toString();
          },
          stderr: function(data) {
            return output += data.toString();
          },
          exit: function(code) {
            if (code === 0) {
              return resolve(output);
            } else {
              return reject(output);
            }
          }
        });
        return process.onWillThrowError(function(errorObject) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        });
      });
    },
    getConfig: function(repo, setting) {
      return repo.getConfigValue(setting, repo.getWorkingDirectory());
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0').slice(0, -1);
        } else {
          return [];
        }
      });
    },
    refresh: function(repo) {
      if (repo) {
        if (typeof repo.refreshStatus === "function") {
          repo.refreshStatus();
        }
        return typeof repo.refreshIndex === "function" ? repo.refreshIndex() : void 0;
      } else {
        return atom.project.getRepositories().forEach(function(repo) {
          if (repo != null) {
            return repo.refreshStatus();
          }
        });
      }
    },
    relativize: function(path) {
      var ref1, ref2, ref3, ref4;
      return (ref1 = (ref2 = (ref3 = git.getSubmodule(path)) != null ? ref3.relativize(path) : void 0) != null ? ref2 : (ref4 = atom.project.getRepositories()[0]) != null ? ref4.relativize(path) : void 0) != null ? ref1 : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data, {
          staged: true
        });
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, arg) {
      var args, showUntracked;
      showUntracked = (arg != null ? arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data, {
            staged: false
          }));
        } else {
          return _prettify(data, {
            staged: false
          });
        }
      });
    },
    add: function(repo, arg) {
      var args, file, message, ref1, repoName, update;
      ref1 = arg != null ? arg : {}, file = ref1.file, update = ref1.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      message = "git add " + args[args.length - 1];
      repoName = new Repository(repo).getName();
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: output
        });
      })["catch"](function(output) {
        return ActivityLogger.record({
          repoName: repoName,
          message: message,
          output: output,
          failed: true
        });
      });
    },
    getAllRepos: function() {
      var project;
      project = atom.project;
      return Promise.all(project.getDirectories().map(project.repositoryForDirectory.bind(project)));
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getRepoForPath: function(path) {
      if (path == null) {
        return Promise.reject("No file to find repository for");
      } else {
        return new Promise(function(resolve, reject) {
          var repoPromises;
          repoPromises = atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project));
          return Promise.all(repoPromises).then(function(repos) {
            return repos.filter(Boolean).forEach(function(repo) {
              var directory, submodule;
              directory = new Directory(repo.getWorkingDirectory());
              if ((repo != null) && directory.contains(path) || directory.getPath() === path) {
                submodule = repo != null ? repo.repo.submoduleForPath(path) : void 0;
                if (submodule != null) {
                  return resolve(submodule);
                } else {
                  return resolve(repo);
                }
              }
            });
          });
        });
      }
    },
    getSubmodule: function(path) {
      var ref1, ref2, ref3;
      if (path == null) {
        path = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      }
      return (ref2 = atom.project.getRepositories().filter(function(r) {
        var ref3;
        return r != null ? (ref3 = r.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (ref3 = ref2.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2dpdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxNQUErQixPQUFBLENBQVEsTUFBUixDQUEvQixFQUFDLHFDQUFELEVBQWtCOztFQUVsQixZQUFBLEdBQWUsT0FBQSxDQUFRLHdCQUFSOztFQUNmLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUjs7RUFDWCxVQUFBLEdBQWMsT0FBQSxDQUFRLGNBQVIsQ0FBdUIsRUFBQyxPQUFEOztFQUNyQyxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUE0QixFQUFDLE9BQUQ7O0VBRTdDLGlCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLFlBQVA7QUFDbEIsUUFBQTs7TUFEeUIsZUFBYTs7SUFDdEMsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsb0JBQW5CO1dBQ1AsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQ0osWUFBWSxDQUFDLE1BQWIsQ0FBb0Isa0JBQUEsQ0FBbUIsSUFBbkIsQ0FBcEI7SUFESSxDQUROO0VBRmtCOztFQU1wQixTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNWLFFBQUE7SUFEa0Isd0JBQUQsTUFBUztJQUMxQixJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sR0FBUDs7SUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCOzs7QUFDbkI7V0FBQSxpREFBQTs7cUJBQ0g7VUFBQyxNQUFBLElBQUQ7VUFBTyxRQUFBLE1BQVA7VUFBZSxJQUFBLEVBQU0sSUFB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QUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1YsY0FBQTtVQUFBLElBQUcsYUFBQSxJQUFrQixDQUFBLFNBQUEsR0FBWSxHQUFHLENBQUMsWUFBSixDQUFBLENBQVosQ0FBckI7bUJBQ0UsT0FBQSxDQUFRLFNBQVMsQ0FBQyxtQkFBVixDQUFBLENBQVIsRUFERjtXQUFBLE1BQUE7bUJBR0UsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7cUJBQVUsT0FBQSxDQUFRLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQVI7WUFBVixDQUFuQixFQUhGOztRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBREcsQ0F6SEw7O0FBN0NGIiwic291cmNlc0NvbnRlbnQiOlsiT3MgPSByZXF1aXJlICdvcydcbntCdWZmZXJlZFByb2Nlc3MsIERpcmVjdG9yeX0gPSByZXF1aXJlICdhdG9tJ1xuXG5SZXBvTGlzdFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3JlcG8tbGlzdC12aWV3J1xubm90aWZpZXIgPSByZXF1aXJlICcuL25vdGlmaWVyJ1xuUmVwb3NpdG9yeSA9ICByZXF1aXJlKCcuL3JlcG9zaXRvcnknKS5kZWZhdWx0XG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4vYWN0aXZpdHktbG9nZ2VyJykuZGVmYXVsdFxuXG5naXRVbnRyYWNrZWRGaWxlcyA9IChyZXBvLCBkYXRhVW5zdGFnZWQ9W10pIC0+XG4gIGFyZ3MgPSBbJ2xzLWZpbGVzJywgJy1vJywgJy0tZXhjbHVkZS1zdGFuZGFyZCddXG4gIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgZGF0YVVuc3RhZ2VkLmNvbmNhdChfcHJldHRpZnlVbnRyYWNrZWQoZGF0YSkpXG5cbl9wcmV0dGlmeSA9IChkYXRhLCB7c3RhZ2VkfT17fSkgLT5cbiAgcmV0dXJuIFtdIGlmIGRhdGEgaXMgJydcbiAgZGF0YSA9IGRhdGEuc3BsaXQoL1xcMC8pWy4uLi0xXVxuICBbXSA9IGZvciBtb2RlLCBpIGluIGRhdGEgYnkgMlxuICAgIHttb2RlLCBzdGFnZWQsIHBhdGg6IGRhdGFbaSsxXX1cblxuX3ByZXR0aWZ5VW50cmFja2VkID0gKGRhdGEpIC0+XG4gIHJldHVybiBbXSBpZiBkYXRhIGlzICcnXG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9cXG4vKS5maWx0ZXIgKGQpIC0+IGQgaXNudCAnJ1xuICBkYXRhLm1hcCAoZmlsZSkgLT4ge21vZGU6ICc/JywgcGF0aDogZmlsZX1cblxuX3ByZXR0aWZ5RGlmZiA9IChkYXRhKSAtPlxuICBkYXRhID0gZGF0YS5zcGxpdCgvXkBAKD89WyBcXC1cXCtcXCwwLTldKkBAKS9nbSlcbiAgZGF0YVsxLi5kYXRhLmxlbmd0aF0gPSAoJ0BAJyArIGxpbmUgZm9yIGxpbmUgaW4gZGF0YVsxLi5dKVxuICBkYXRhXG5cbmdldFJlcG9Gb3JDdXJyZW50RmlsZSA9IC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgcHJvamVjdCA9IGF0b20ucHJvamVjdFxuICAgIHBhdGggPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKVxuICAgIGRpcmVjdG9yeSA9IHByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5maWx0ZXIoKGQpIC0+IGQuY29udGFpbnMocGF0aCkpWzBdXG4gICAgaWYgZGlyZWN0b3J5P1xuICAgICAgcHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGRpcmVjdG9yeSkudGhlbiAocmVwbykgLT5cbiAgICAgICAgc3VibW9kdWxlID0gcmVwby5yZXBvLnN1Ym1vZHVsZUZvclBhdGgocGF0aClcbiAgICAgICAgaWYgc3VibW9kdWxlPyB0aGVuIHJlc29sdmUoc3VibW9kdWxlKSBlbHNlIHJlc29sdmUocmVwbylcbiAgICAgIC5jYXRjaCAoZSkgLT5cbiAgICAgICAgcmVqZWN0KGUpXG4gICAgZWxzZVxuICAgICAgcmVqZWN0IFwibm8gY3VycmVudCBmaWxlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBnaXQgPVxuICBjbWQ6IChhcmdzLCBvcHRpb25zPXsgZW52OiBwcm9jZXNzLmVudn0sIHtjb2xvcn09e30pIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIG91dHB1dCA9ICcnXG4gICAgICBhcmdzID0gWyctYycsICdjb2xvci51aT1hbHdheXMnXS5jb25jYXQoYXJncykgaWYgY29sb3JcbiAgICAgIHByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzXG4gICAgICAgIGNvbW1hbmQ6IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5naXRQYXRoJykgPyAnZ2l0J1xuICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgc3Rkb3V0OiAoZGF0YSkgLT4gb3V0cHV0ICs9IGRhdGEudG9TdHJpbmcoKVxuICAgICAgICBzdGRlcnI6IChkYXRhKSAtPlxuICAgICAgICAgIG91dHB1dCArPSBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgZXhpdDogKGNvZGUpIC0+XG4gICAgICAgICAgaWYgY29kZSBpcyAwXG4gICAgICAgICAgICByZXNvbHZlIG91dHB1dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlamVjdCBvdXRwdXRcbiAgICAgIHByb2Nlc3Mub25XaWxsVGhyb3dFcnJvciAoZXJyb3JPYmplY3QpIC0+XG4gICAgICAgIG5vdGlmaWVyLmFkZEVycm9yICdHaXQgUGx1cyBpcyB1bmFibGUgdG8gbG9jYXRlIHRoZSBnaXQgY29tbWFuZC4gUGxlYXNlIGVuc3VyZSBwcm9jZXNzLmVudi5QQVRIIGNhbiBhY2Nlc3MgZ2l0LidcbiAgICAgICAgcmVqZWN0IFwiQ291bGRuJ3QgZmluZCBnaXRcIlxuXG4gIGdldENvbmZpZzogKHJlcG8sIHNldHRpbmcpIC0+IHJlcG8uZ2V0Q29uZmlnVmFsdWUgc2V0dGluZywgcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcblxuICByZXNldDogKHJlcG8pIC0+XG4gICAgZ2l0LmNtZChbJ3Jlc2V0JywgJ0hFQUQnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSkudGhlbiAoKSAtPiBub3RpZmllci5hZGRTdWNjZXNzICdBbGwgY2hhbmdlcyB1bnN0YWdlZCdcblxuICBzdGF0dXM6IChyZXBvKSAtPlxuICAgIGdpdC5jbWQoWydzdGF0dXMnLCAnLS1wb3JjZWxhaW4nLCAnLXonXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT4gaWYgZGF0YS5sZW5ndGggPiAyIHRoZW4gZGF0YS5zcGxpdCgnXFwwJylbLi4uLTFdIGVsc2UgW11cblxuICByZWZyZXNoOiAocmVwbykgLT5cbiAgICBpZiByZXBvXG4gICAgICByZXBvLnJlZnJlc2hTdGF0dXM/KClcbiAgICAgIHJlcG8ucmVmcmVzaEluZGV4PygpXG4gICAgZWxzZVxuICAgICAgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZvckVhY2ggKHJlcG8pIC0+IHJlcG8ucmVmcmVzaFN0YXR1cygpIGlmIHJlcG8/XG5cbiAgcmVsYXRpdml6ZTogKHBhdGgpIC0+XG4gICAgZ2l0LmdldFN1Ym1vZHVsZShwYXRoKT8ucmVsYXRpdml6ZShwYXRoKSA/IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVswXT8ucmVsYXRpdml6ZShwYXRoKSA/IHBhdGhcblxuICBkaWZmOiAocmVwbywgcGF0aCkgLT5cbiAgICBnaXQuY21kKFsnZGlmZicsICctcCcsICctVTEnLCBwYXRoXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT4gX3ByZXR0aWZ5RGlmZihkYXRhKVxuXG4gIHN0YWdlZEZpbGVzOiAocmVwbykgLT5cbiAgICBhcmdzID0gWydkaWZmLWluZGV4JywgJy0tY2FjaGVkJywgJ0hFQUQnLCAnLS1uYW1lLXN0YXR1cycsICcteiddXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgX3ByZXR0aWZ5IGRhdGEsIHN0YWdlZDogdHJ1ZVxuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBpZiBlcnJvci5pbmNsdWRlcyBcImFtYmlndW91cyBhcmd1bWVudCAnSEVBRCdcIlxuICAgICAgICBQcm9taXNlLnJlc29sdmUgWzFdXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEVycm9yIGVycm9yXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSBbXVxuXG4gIHVuc3RhZ2VkRmlsZXM6IChyZXBvLCB7c2hvd1VudHJhY2tlZH09e30pIC0+XG4gICAgYXJncyA9IFsnZGlmZi1maWxlcycsICctLW5hbWUtc3RhdHVzJywgJy16J11cbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBpZiBzaG93VW50cmFja2VkXG4gICAgICAgIGdpdFVudHJhY2tlZEZpbGVzKHJlcG8sIF9wcmV0dGlmeShkYXRhLCBzdGFnZWQ6IGZhbHNlKSlcbiAgICAgIGVsc2VcbiAgICAgICAgX3ByZXR0aWZ5KGRhdGEsIHN0YWdlZDogZmFsc2UpXG5cbiAgYWRkOiAocmVwbywge2ZpbGUsIHVwZGF0ZX09e30pIC0+XG4gICAgYXJncyA9IFsnYWRkJ11cbiAgICBpZiB1cGRhdGUgdGhlbiBhcmdzLnB1c2ggJy0tdXBkYXRlJyBlbHNlIGFyZ3MucHVzaCAnLS1hbGwnXG4gICAgYXJncy5wdXNoKGlmIGZpbGUgdGhlbiBmaWxlIGVsc2UgJy4nKVxuXG4gICAgbWVzc2FnZSA9IFwiXCJcImdpdCBhZGQgI3thcmdzW2FyZ3MubGVuZ3RoIC0gMV19XCJcIlwiXG5cbiAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KHJlcG8pLmdldE5hbWUoKVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAob3V0cHV0KSAtPiBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlLG91dHB1dH0pXG4gICAgLmNhdGNoIChvdXRwdXQpIC0+XG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe1xuICAgICAgICByZXBvTmFtZSxcbiAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgb3V0cHV0LFxuICAgICAgICBmYWlsZWQ6IHRydWVcbiAgICAgIH0pXG5cbiAgZ2V0QWxsUmVwb3M6IC0+XG4gICAge3Byb2plY3R9ID0gYXRvbVxuICAgIFByb21pc2UuYWxsKHByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgLm1hcChwcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkuYmluZChwcm9qZWN0KSkpXG5cbiAgZ2V0UmVwbzogLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgZ2V0UmVwb0ZvckN1cnJlbnRGaWxlKCkudGhlbiAocmVwbykgLT4gcmVzb2x2ZShyZXBvKVxuICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICByZXBvcyA9IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIgKHIpIC0+IHI/XG4gICAgICAgIGlmIHJlcG9zLmxlbmd0aCBpcyAwXG4gICAgICAgICAgcmVqZWN0KFwiTm8gcmVwb3MgZm91bmRcIilcbiAgICAgICAgZWxzZSBpZiByZXBvcy5sZW5ndGggPiAxXG4gICAgICAgICAgcmVzb2x2ZShuZXcgUmVwb0xpc3RWaWV3KHJlcG9zKS5yZXN1bHQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXNvbHZlKHJlcG9zWzBdKVxuXG4gIGdldFJlcG9Gb3JQYXRoOiAocGF0aCkgLT5cbiAgICBpZiBub3QgcGF0aD9cbiAgICAgIFByb21pc2UucmVqZWN0IFwiTm8gZmlsZSB0byBmaW5kIHJlcG9zaXRvcnkgZm9yXCJcbiAgICBlbHNlXG4gICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgICByZXBvUHJvbWlzZXMgPVxuICAgICAgICAgIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICAgICAgLm1hcChhdG9tLnByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeS5iaW5kKGF0b20ucHJvamVjdCkpXG5cbiAgICAgICAgUHJvbWlzZS5hbGwocmVwb1Byb21pc2VzKS50aGVuIChyZXBvcykgLT5cbiAgICAgICAgICByZXBvcy5maWx0ZXIoQm9vbGVhbikuZm9yRWFjaCAocmVwbykgLT5cbiAgICAgICAgICAgIGRpcmVjdG9yeSA9IG5ldyBEaXJlY3RvcnkocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgICAgICBpZiByZXBvPyBhbmQgZGlyZWN0b3J5LmNvbnRhaW5zKHBhdGgpIG9yIGRpcmVjdG9yeS5nZXRQYXRoKCkgaXMgcGF0aFxuICAgICAgICAgICAgICBzdWJtb2R1bGUgPSByZXBvPy5yZXBvLnN1Ym1vZHVsZUZvclBhdGgocGF0aClcbiAgICAgICAgICAgICAgaWYgc3VibW9kdWxlPyB0aGVuIHJlc29sdmUoc3VibW9kdWxlKSBlbHNlIHJlc29sdmUocmVwbylcblxuICBnZXRTdWJtb2R1bGU6IChwYXRoKSAtPlxuICAgIHBhdGggPz0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcbiAgICBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKCkuZmlsdGVyKChyKSAtPlxuICAgICAgcj8ucmVwbz8uc3VibW9kdWxlRm9yUGF0aCBwYXRoXG4gICAgKVswXT8ucmVwbz8uc3VibW9kdWxlRm9yUGF0aCBwYXRoXG5cbiAgZGlyOiAoYW5kU3VibW9kdWxlcz10cnVlKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBpZiBhbmRTdWJtb2R1bGVzIGFuZCBzdWJtb2R1bGUgPSBnaXQuZ2V0U3VibW9kdWxlKClcbiAgICAgICAgcmVzb2x2ZShzdWJtb2R1bGUuZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgZWxzZVxuICAgICAgICBnaXQuZ2V0UmVwbygpLnRoZW4gKHJlcG8pIC0+IHJlc29sdmUocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4iXX0=
