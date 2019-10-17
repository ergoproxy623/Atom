(function() {
  var $$, ActivityLogger, ListView, RemoteBranchListView, Repository, SelectListView, _pull, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  _pull = require('../models/_pull');

  notifier = require('../notifier');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  RemoteBranchListView = require('./remote-branch-list-view');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data1, arg1) {
      var ref1;
      this.repo = repo;
      this.data = data1;
      ref1 = arg1 != null ? arg1 : {}, this.mode = ref1.mode, this.tag = ref1.tag, this.extraArgs = ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve1, reject1) {
          _this.resolve = resolve1;
          _this.reject = reject1;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg1) {
      var name;
      name = arg1.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.pull = function(remoteName) {
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        return git.cmd(['branch', '--no-color', '-r'], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(data) {
            return new Promise(function(resolve, reject) {
              return new RemoteBranchListView(data, remoteName, function(arg1) {
                var args, branchName, name, repoName, startMessage;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                startMessage = notifier.addInfo("Pulling...", {
                  dismissable: true
                });
                args = ['pull'].concat(_this.extraArgs, remoteName, branchName).filter(function(arg) {
                  return arg !== '';
                });
                repoName = new Repository(_this.repo).getName();
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  resolve(branchName);
                  repoName = new Repository(_this.repo).getName();
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: data
                  });
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  reject();
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: error,
                    failed: true
                  });
                  return startMessage.dismiss();
                });
              });
            });
          };
        })(this));
      } else {
        return _pull(this.repo, {
          extraArgs: this.extraArgs
        });
      }
    };

    ListView.prototype.confirmed = function(arg1) {
      var name, pullBeforePush;
      name = arg1.name;
      if (this.mode === 'pull') {
        this.pull(name);
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else if (this.mode === 'push') {
        pullBeforePush = atom.config.get('git-plus.remoteInteractions.pullBeforePush');
        if (pullBeforePush && atom.config.get('git-plus.remoteInteractions.pullRebase')) {
          this.extraArgs = '--rebase';
        }
        if (pullBeforePush) {
          this.pull(name).then((function(_this) {
            return function(branch) {
              return _this.execute(name, null, branch);
            };
          })(this));
        } else {
          this.execute(name);
        }
      } else if (this.mode === 'push -u') {
        this.pushAndSetUpstream(name);
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs, branch) {
      var args, message, repoName, startMessage;
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      if (atom.config.get('git-plus.remoteInteractions.promptForBranch')) {
        if (branch != null) {
          args = [this.mode];
          if (extraArgs.length > 0) {
            args.push(extraArgs);
          }
          args = args.concat([remote, branch]);
          message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
          startMessage = notifier.addInfo(message, {
            dismissable: true
          });
          return git.cmd(args, {
            cwd: this.repo.getWorkingDirectory()
          }, {
            color: true
          }).then((function(_this) {
            return function(data) {
              startMessage.dismiss();
              return git.refresh(_this.repo);
            };
          })(this))["catch"]((function(_this) {
            return function(data) {
              return startMessage.dismiss();
            };
          })(this));
        } else {
          return git.cmd(['branch', '--no-color', '-r'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteBranchListView(data, remote, function(arg1) {
                var branchName, name, repoName;
                name = arg1.name;
                branchName = name.substring(name.indexOf('/') + 1);
                startMessage = notifier.addInfo("Pushing...", {
                  dismissable: true
                });
                args = ['push'].concat(extraArgs, remote, branchName).filter(function(arg) {
                  return arg !== '';
                });
                repoName = new Repository(_this.repo).getName();
                return git.cmd(args, {
                  cwd: _this.repo.getWorkingDirectory()
                }, {
                  color: true
                }).then(function(data) {
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: data
                  });
                  startMessage.dismiss();
                  return git.refresh(_this.repo);
                })["catch"](function(error) {
                  ActivityLogger.record({
                    repoName: repoName,
                    message: args.join(' '),
                    output: error,
                    failed: true
                  });
                  return startMessage.dismiss();
                });
              });
            };
          })(this));
        }
      } else {
        args = [this.mode];
        if (extraArgs.length > 0) {
          args.push(extraArgs);
        }
        args = args.concat([remote, this.tag]).filter(function(arg) {
          return arg !== '';
        });
        message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
        startMessage = notifier.addInfo(message, {
          dismissable: true
        });
        repoName = new Repository(this.repo).getName();
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }, {
          color: true
        }).then((function(_this) {
          return function(data) {
            ActivityLogger.record({
              repoName: repoName,
              message: args.join(' '),
              output: data
            });
            startMessage.dismiss();
            return git.refresh(_this.repo);
          };
        })(this))["catch"]((function(_this) {
          return function(data) {
            ActivityLogger.record({
              repoName: repoName,
              message: args.join(' '),
              output: data,
              failed: true
            });
            return startMessage.dismiss();
          };
        })(this));
      }
    };

    ListView.prototype.pushAndSetUpstream = function(remote) {
      var args, message, repoName, startMessage;
      if (remote == null) {
        remote = '';
      }
      args = ['push', '-u', remote, 'HEAD'].filter(function(arg) {
        return arg !== '';
      });
      message = "Pushing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      repoName = new Repository(this.repo).getName();
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        ActivityLogger.record({
          repoName: repoName,
          message: args.join(' '),
          output: data
        });
        return startMessage.dismiss();
      })["catch"]((function(_this) {
        return function(data) {
          ActivityLogger.record({
            repoName: repoName,
            message: args.join(' '),
            output: data,
            failed: true
          });
          return startMessage.dismiss();
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5R0FBQTtJQUFBOzs7RUFBQSxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBRUwsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLEtBQUEsR0FBUSxPQUFBLENBQVEsaUJBQVI7O0VBQ1IsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFDckMsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDJCQUFSOztFQUV2QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O3VCQUNKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZjtBQUNWLFVBQUE7TUFEVyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxPQUFEOzRCQUFPLE9BQTBCLElBQXpCLElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLFdBQUEsS0FBSyxJQUFDLENBQUEsaUJBQUE7TUFDeEMsMENBQUEsU0FBQTs7UUFDQSxJQUFDLENBQUEsTUFBTzs7O1FBQ1IsSUFBQyxDQUFBLFlBQWE7O01BQ2QsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7YUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUksT0FBSixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFELEVBQVcsT0FBWDtVQUFDLEtBQUMsQ0FBQSxVQUFEO1VBQVUsS0FBQyxDQUFBLFNBQUQ7UUFBWDtNQUFBLENBQUEsQ0FB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LENBQUMsT0FBYixDQUFBO01BRkksQ0FETixDQUlBLEVBQUMsS0FBRCxFQUpBLENBSU8sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDTCxjQUFjLENBQUMsTUFBZixDQUFzQjtZQUFDLFVBQUEsUUFBRDtZQUFXLE9BQUEsRUFBUyxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVYsQ0FBcEI7WUFBb0MsTUFBQSxFQUFRLElBQTVDO1lBQWtELE1BQUEsRUFBUSxJQUExRDtXQUF0QjtpQkFDQSxZQUFZLENBQUMsT0FBYixDQUFBO1FBRks7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSlA7SUFMa0I7Ozs7S0E1SEM7QUFWdkIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5fcHVsbCA9IHJlcXVpcmUgJy4uL21vZGVscy9fcHVsbCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5BY3Rpdml0eUxvZ2dlciA9IHJlcXVpcmUoJy4uL2FjdGl2aXR5LWxvZ2dlcicpLmRlZmF1bHRcblJlcG9zaXRvcnkgPSByZXF1aXJlKCcuLi9yZXBvc2l0b3J5JykuZGVmYXVsdFxuUmVtb3RlQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlICcuL3JlbW90ZS1icmFuY2gtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBMaXN0VmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgQGRhdGEsIHtAbW9kZSwgQHRhZywgQGV4dHJhQXJnc309e30pIC0+XG4gICAgc3VwZXJcbiAgICBAdGFnID89ICcnXG4gICAgQGV4dHJhQXJncyA/PSBbXVxuICAgIEBzaG93KClcbiAgICBAcGFyc2VEYXRhKClcbiAgICBAcmVzdWx0ID0gbmV3IFByb21pc2UgKEByZXNvbHZlLCBAcmVqZWN0KSA9PlxuXG4gIHBhcnNlRGF0YTogLT5cbiAgICBpdGVtcyA9IEBkYXRhLnNwbGl0KFwiXFxuXCIpXG4gICAgcmVtb3RlcyA9IGl0ZW1zLmZpbHRlcigoaXRlbSkgLT4gaXRlbSBpc250ICcnKS5tYXAgKGl0ZW0pIC0+IHsgbmFtZTogaXRlbSB9XG4gICAgaWYgcmVtb3Rlcy5sZW5ndGggaXMgMVxuICAgICAgQGNvbmZpcm1lZCByZW1vdGVzWzBdXG4gICAgZWxzZVxuICAgICAgQHNldEl0ZW1zIHJlbW90ZXNcbiAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnbmFtZSdcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe25hbWV9KSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgbmFtZVxuXG4gIHB1bGw6IChyZW1vdGVOYW1lKSAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnByb21wdEZvckJyYW5jaCcpXG4gICAgICBnaXQuY21kKFsnYnJhbmNoJywgJy0tbm8tY29sb3InLCAnLXInXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgICBuZXcgUmVtb3RlQnJhbmNoTGlzdFZpZXcgZGF0YSwgcmVtb3RlTmFtZSwgKHtuYW1lfSkgPT5cbiAgICAgICAgICAgIGJyYW5jaE5hbWUgPSBuYW1lLnN1YnN0cmluZyhuYW1lLmluZGV4T2YoJy8nKSArIDEpXG4gICAgICAgICAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIFwiUHVsbGluZy4uLlwiLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgYXJncyA9IFsncHVsbCddLmNvbmNhdChAZXh0cmFBcmdzLCByZW1vdGVOYW1lLCBicmFuY2hOYW1lKS5maWx0ZXIoKGFyZykgLT4gYXJnIGlzbnQgJycpXG4gICAgICAgICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICAgICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICAgICAgcmVzb2x2ZSBicmFuY2hOYW1lXG4gICAgICAgICAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgICAgICAgICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBkYXRhfSlcbiAgICAgICAgICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuICAgICAgICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgICAgICAgLmNhdGNoIChlcnJvcikgPT5cbiAgICAgICAgICAgICAgcmVqZWN0KClcbiAgICAgICAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZXJyb3IsIGZhaWxlZDogdHJ1ZX0pXG4gICAgICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICBlbHNlXG4gICAgICBfcHVsbCBAcmVwbywgZXh0cmFBcmdzOiBAZXh0cmFBcmdzXG5cbiAgY29uZmlybWVkOiAoe25hbWV9KSAtPlxuICAgIGlmIEBtb2RlIGlzICdwdWxsJ1xuICAgICAgQHB1bGwgbmFtZVxuICAgIGVsc2UgaWYgQG1vZGUgaXMgJ2ZldGNoLXBydW5lJ1xuICAgICAgQG1vZGUgPSAnZmV0Y2gnXG4gICAgICBAZXhlY3V0ZSBuYW1lLCAnLS1wcnVuZSdcbiAgICBlbHNlIGlmIEBtb2RlIGlzICdwdXNoJ1xuICAgICAgcHVsbEJlZm9yZVB1c2ggPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wdWxsQmVmb3JlUHVzaCcpXG4gICAgICBAZXh0cmFBcmdzID0gJy0tcmViYXNlJyBpZiBwdWxsQmVmb3JlUHVzaCBhbmQgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5yZW1vdGVJbnRlcmFjdGlvbnMucHVsbFJlYmFzZScpXG4gICAgICBpZiBwdWxsQmVmb3JlUHVzaFxuICAgICAgICBAcHVsbChuYW1lKS50aGVuIChicmFuY2gpID0+IEBleGVjdXRlIG5hbWUsIG51bGwsIGJyYW5jaFxuICAgICAgZWxzZVxuICAgICAgICBAZXhlY3V0ZSBuYW1lXG4gICAgZWxzZSBpZiBAbW9kZSBpcyAncHVzaCAtdSdcbiAgICAgIEBwdXNoQW5kU2V0VXBzdHJlYW0gbmFtZVxuICAgIGVsc2VcbiAgICAgIEBleGVjdXRlIG5hbWVcbiAgICBAY2FuY2VsKClcblxuICBleGVjdXRlOiAocmVtb3RlPScnLCBleHRyYUFyZ3M9JycsIGJyYW5jaCkgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wcm9tcHRGb3JCcmFuY2gnKVxuICAgICAgaWYgYnJhbmNoP1xuICAgICAgICBhcmdzID0gW0Btb2RlXVxuICAgICAgICBpZiBleHRyYUFyZ3MubGVuZ3RoID4gMFxuICAgICAgICAgIGFyZ3MucHVzaCBleHRyYUFyZ3NcbiAgICAgICAgYXJncyA9IGFyZ3MuY29uY2F0KFtyZW1vdGUsIGJyYW5jaF0pXG4gICAgICAgIG1lc3NhZ2UgPSBcIiN7QG1vZGVbMF0udG9VcHBlckNhc2UoKStAbW9kZS5zdWJzdHJpbmcoMSl9aW5nLi4uXCJcbiAgICAgICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBtZXNzYWdlLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgICAgLmNhdGNoIChkYXRhKSA9PlxuICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgIGVsc2VcbiAgICAgICAgZ2l0LmNtZChbJ2JyYW5jaCcsICctLW5vLWNvbG9yJywgJy1yJ10sIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICBuZXcgUmVtb3RlQnJhbmNoTGlzdFZpZXcgZGF0YSwgcmVtb3RlLCAoe25hbWV9KSA9PlxuICAgICAgICAgICAgYnJhbmNoTmFtZSA9IG5hbWUuc3Vic3RyaW5nKG5hbWUuaW5kZXhPZignLycpICsgMSlcbiAgICAgICAgICAgIHN0YXJ0TWVzc2FnZSA9IG5vdGlmaWVyLmFkZEluZm8gXCJQdXNoaW5nLi4uXCIsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICBhcmdzID0gWydwdXNoJ10uY29uY2F0KGV4dHJhQXJncywgcmVtb3RlLCBicmFuY2hOYW1lKS5maWx0ZXIoKGFyZykgLT4gYXJnIGlzbnQgJycpXG4gICAgICAgICAgICByZXBvTmFtZSA9IG5ldyBSZXBvc2l0b3J5KEByZXBvKS5nZXROYW1lKClcbiAgICAgICAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICAgICAgQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogYXJncy5qb2luKCcgJyksIG91dHB1dDogZGF0YX0pXG4gICAgICAgICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAgICAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgICAgICAgIC5jYXRjaCAoZXJyb3IpID0+XG4gICAgICAgICAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGVycm9yLCBmYWlsZWQ6IHRydWV9KVxuICAgICAgICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgZWxzZVxuICAgICAgYXJncyA9IFtAbW9kZV1cbiAgICAgIGlmIGV4dHJhQXJncy5sZW5ndGggPiAwXG4gICAgICAgIGFyZ3MucHVzaCBleHRyYUFyZ3NcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdChbcmVtb3RlLCBAdGFnXSkuZmlsdGVyKChhcmcpIC0+IGFyZyBpc250ICcnKVxuICAgICAgbWVzc2FnZSA9IFwiI3tAbW9kZVswXS50b1VwcGVyQ2FzZSgpK0Btb2RlLnN1YnN0cmluZygxKX1pbmcuLi5cIlxuICAgICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBtZXNzYWdlLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgcmVwb05hbWUgPSBuZXcgUmVwb3NpdG9yeShAcmVwbykuZ2V0TmFtZSgpXG4gICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCB7Y29sb3I6IHRydWV9KVxuICAgICAgLnRoZW4gKGRhdGEpID0+XG4gICAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGRhdGF9KVxuICAgICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAuY2F0Y2ggKGRhdGEpID0+XG4gICAgICAgIEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IGFyZ3Muam9pbignICcpLCBvdXRwdXQ6IGRhdGEsIGZhaWxlZDogdHJ1ZX0pXG4gICAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcblxuICBwdXNoQW5kU2V0VXBzdHJlYW06IChyZW1vdGU9JycpIC0+XG4gICAgYXJncyA9IFsncHVzaCcsICctdScsIHJlbW90ZSwgJ0hFQUQnXS5maWx0ZXIoKGFyZykgLT4gYXJnIGlzbnQgJycpXG4gICAgbWVzc2FnZSA9IFwiUHVzaGluZy4uLlwiXG4gICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBtZXNzYWdlLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkoQHJlcG8pLmdldE5hbWUoKVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBkYXRhfSlcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAuY2F0Y2ggKGRhdGEpID0+XG4gICAgICBBY3Rpdml0eUxvZ2dlci5yZWNvcmQoe3JlcG9OYW1lLCBtZXNzYWdlOiBhcmdzLmpvaW4oJyAnKSwgb3V0cHV0OiBkYXRhLCBmYWlsZWQ6IHRydWV9KVxuICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuIl19
