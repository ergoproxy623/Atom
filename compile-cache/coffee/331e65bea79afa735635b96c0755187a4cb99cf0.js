(function() {
  var ActivityLogger, RemoveListView, Repository, git, gitRemove, prettify;

  git = require('../git');

  ActivityLogger = require('../activity-logger')["default"];

  Repository = require('../repository')["default"];

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, arg) {
    var currentFile, cwd, ref, repoName, showSelector;
    showSelector = (arg != null ? arg : {}).showSelector;
    cwd = repo.getWorkingDirectory();
    currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (repo.isPathModified(currentFile) === false || window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        repoName = new Repository(repo).getName();
        return git.cmd(['rm', '-f', '--ignore-unmatch', currentFile], {
          cwd: cwd
        }).then(function(data) {
          return ActivityLogger.record({
            repoName: repoName,
            message: "Remove '" + (prettify(data)) + "'",
            output: data
          });
        })["catch"](function(data) {
          return ActivityLogger.record({
            repoName: repoName,
            message: "Remove '" + (prettify(data)) + "'",
            output: data,
            failed: true
          });
        });
      }
    } else {
      return git.cmd(['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'], {
        cwd: cwd
      }).then(function(data) {
        return new RemoveListView(repo, prettify(data));
      });
    }
  };

  prettify = function(data) {
    var file, i, j, len, results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      results = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        file = data[i];
        results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvdm92ZW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtcmVtb3ZlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG9CQUFSLENBQTZCLEVBQUMsT0FBRDs7RUFDOUMsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQXdCLEVBQUMsT0FBRDs7RUFDckMsY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ1YsUUFBQTtJQURrQiw4QkFBRCxNQUFlO0lBQ2hDLEdBQUEsR0FBTSxJQUFJLENBQUMsbUJBQUwsQ0FBQTtJQUNOLFdBQUEsR0FBYyxJQUFJLENBQUMsVUFBTCwyREFBb0QsQ0FBRSxPQUF0QyxDQUFBLFVBQWhCO0lBQ2QsSUFBRyxxQkFBQSxJQUFpQixDQUFJLFlBQXhCO01BQ0UsSUFBRyxJQUFJLENBQUMsY0FBTCxDQUFvQixXQUFwQixDQUFBLEtBQW9DLEtBQXBDLElBQTZDLE1BQU0sQ0FBQyxPQUFQLENBQWUsZUFBZixDQUFoRDtRQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFrQyxDQUFDLE9BQW5DLENBQUE7UUFDQSxRQUFBLEdBQVcsSUFBSSxVQUFKLENBQWUsSUFBZixDQUFvQixDQUFDLE9BQXJCLENBQUE7ZUFDWCxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxrQkFBYixFQUFpQyxXQUFqQyxDQUFSLEVBQXVEO1VBQUMsS0FBQSxHQUFEO1NBQXZELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2lCQUFVLGNBQWMsQ0FBQyxNQUFmLENBQXNCO1lBQUMsVUFBQSxRQUFEO1lBQVcsT0FBQSxFQUFTLFVBQUEsR0FBVSxDQUFDLFFBQUEsQ0FBUyxJQUFULENBQUQsQ0FBVixHQUF5QixHQUE3QztZQUFpRCxNQUFBLEVBQVEsSUFBekQ7V0FBdEI7UUFBVixDQUROLENBRUEsRUFBQyxLQUFELEVBRkEsQ0FFTyxTQUFDLElBQUQ7aUJBQVUsY0FBYyxDQUFDLE1BQWYsQ0FBc0I7WUFBQyxVQUFBLFFBQUQ7WUFBVyxPQUFBLEVBQVMsVUFBQSxHQUFVLENBQUMsUUFBQSxDQUFTLElBQVQsQ0FBRCxDQUFWLEdBQXlCLEdBQTdDO1lBQWlELE1BQUEsRUFBUSxJQUF6RDtZQUErRCxNQUFBLEVBQVEsSUFBdkU7V0FBdEI7UUFBVixDQUZQLEVBSEY7T0FERjtLQUFBLE1BQUE7YUFRRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLGtCQUFuQixFQUF1QyxJQUF2QyxFQUE2QyxHQUE3QyxDQUFSLEVBQTJEO1FBQUMsS0FBQSxHQUFEO09BQTNELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2VBQVUsSUFBSSxjQUFKLENBQW1CLElBQW5CLEVBQXlCLFFBQUEsQ0FBUyxJQUFULENBQXpCO01BQVYsQ0FETixFQVJGOztFQUhVOztFQWNaLFFBQUEsR0FBVyxTQUFDLElBQUQ7QUFDVCxRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWDtJQUNQLElBQUcsSUFBSDtBQUNFO1dBQUEsOENBQUE7O3FCQUNFLElBQUssQ0FBQSxDQUFBLENBQUwsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLFdBQVgsQ0FBd0IsQ0FBQSxDQUFBO0FBRHBDO3FCQURGO0tBQUEsTUFBQTthQUlFLEtBSkY7O0VBRlM7O0VBUVgsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUEzQmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuQWN0aXZpdHlMb2dnZXIgPSByZXF1aXJlKCcuLi9hY3Rpdml0eS1sb2dnZXInKS5kZWZhdWx0XG5SZXBvc2l0b3J5ID0gcmVxdWlyZSgnLi4vcmVwb3NpdG9yeScpLmRlZmF1bHRcblJlbW92ZUxpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvcmVtb3ZlLWxpc3QtdmlldydcblxuZ2l0UmVtb3ZlID0gKHJlcG8sIHtzaG93U2VsZWN0b3J9PXt9KSAtPlxuICBjd2QgPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICBjdXJyZW50RmlsZSA9IHJlcG8ucmVsYXRpdml6ZShhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKSlcbiAgaWYgY3VycmVudEZpbGU/IGFuZCBub3Qgc2hvd1NlbGVjdG9yXG4gICAgaWYgcmVwby5pc1BhdGhNb2RpZmllZChjdXJyZW50RmlsZSkgaXMgZmFsc2Ugb3Igd2luZG93LmNvbmZpcm0oJ0FyZSB5b3Ugc3VyZT8nKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKS5kZXN0cm95KClcbiAgICAgIHJlcG9OYW1lID0gbmV3IFJlcG9zaXRvcnkocmVwbykuZ2V0TmFtZSgpXG4gICAgICBnaXQuY21kKFsncm0nLCAnLWYnLCAnLS1pZ25vcmUtdW5tYXRjaCcsIGN1cnJlbnRGaWxlXSwge2N3ZH0pXG4gICAgICAudGhlbiAoZGF0YSkgLT4gQWN0aXZpdHlMb2dnZXIucmVjb3JkKHtyZXBvTmFtZSwgbWVzc2FnZTogXCJSZW1vdmUgJyN7cHJldHRpZnkgZGF0YX0nXCIsIG91dHB1dDogZGF0YX0pXG4gICAgICAuY2F0Y2ggKGRhdGEpIC0+IEFjdGl2aXR5TG9nZ2VyLnJlY29yZCh7cmVwb05hbWUsIG1lc3NhZ2U6IFwiUmVtb3ZlICcje3ByZXR0aWZ5IGRhdGF9J1wiLCBvdXRwdXQ6IGRhdGEsIGZhaWxlZDogdHJ1ZX0pXG4gIGVsc2VcbiAgICBnaXQuY21kKFsncm0nLCAnLXInLCAnLW4nLCAnLS1pZ25vcmUtdW5tYXRjaCcsICctZicsICcqJ10sIHtjd2R9KVxuICAgIC50aGVuIChkYXRhKSAtPiBuZXcgUmVtb3ZlTGlzdFZpZXcocmVwbywgcHJldHRpZnkoZGF0YSkpXG5cbnByZXR0aWZ5ID0gKGRhdGEpIC0+XG4gIGRhdGEgPSBkYXRhLm1hdGNoKC9ybSAoJy4qJykvZylcbiAgaWYgZGF0YVxuICAgIGZvciBmaWxlLCBpIGluIGRhdGFcbiAgICAgIGRhdGFbaV0gPSBmaWxlLm1hdGNoKC9ybSAnKC4qKScvKVsxXVxuICBlbHNlXG4gICAgZGF0YVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdpdFJlbW92ZVxuIl19
