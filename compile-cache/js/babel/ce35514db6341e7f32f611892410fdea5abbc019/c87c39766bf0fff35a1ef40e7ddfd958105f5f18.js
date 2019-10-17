Object.defineProperty(exports, '__esModule', {
  value: true
});

// Internal functions

var findSimilarIssue = _asyncToGenerator(function* (issueTitle) {
  var repo = _packageJson2['default'].repository.url.replace(/https?:\/\/(\d+\.)?github\.com\//gi, '');
  var query = encodeURIComponent('repo:' + repo + ' is:open in:title ' + issueTitle);
  var githubHeaders = new Headers({
    accept: 'application/vnd.github.v3+json',
    contentType: 'application/json'
  });

  var data = [];
  try {
    var response = yield fetch('https://api.github.com/search/issues?q=' + query + '&sort=created&order=asc', { headers: githubHeaders });
    if (!response.ok) {
      return null;
    }

    data = yield response.json();
    if (data === null || data.items === undefined) {
      return null;
    }

    if (data.items.length === 0) {
      return null;
    }

    var issue = data.items[0];
    if (issue.title.includes(issueTitle)) {
      return _packageJson2['default'].repository.url + '/issues/' + issue.number;
    }
  } catch (error) {
    // eslint-disable no-empty
  }

  return null;
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _electron = require('electron');

// eslint-disable-line import/extensions, import/no-extraneous-dependencies, import/no-unresolved

var _htmllint = require('htmllint');

var _htmllint2 = _interopRequireDefault(_htmllint);

var _packageJson = require('../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

// Internal variables
'use babel';

var ignored = [];exports['default'] = _asyncToGenerator(function* (issue, error) {
  var range = '(' + (issue.line - 1) + ':' + (issue.column - 1) + ')';
  var reason = _htmllint2['default'].messages.renderIssue(issue);
  var titleText = 'Invalid position given by rule \'' + issue.code + '\'';

  if (ignored.includes(titleText)) {
    return;
  }
  ignored.push(titleText);

  var ghIssue = yield findSimilarIssue(titleText);
  var notification = atom.notifications.addWarning('Unexpected issue with htmllint', {
    description: ['Original message: ' + issue.code + ' - ' + reason + ' ' + range, ghIssue === null ? '' : 'This issue has already been reported'].join('\n\n'),
    dismissable: true,
    buttons: [{
      text: ghIssue === null ? 'Report' : 'View issue',
      onDidClick: function onDidClick() {
        if (ghIssue !== null) {
          _electron.shell.openExternal(ghIssue);
        } else {
          var title = encodeURIComponent(titleText);
          var body = encodeURIComponent(['htmlhint returned a point that did not exist in the document being edited.', '', 'Debug information:', '- Code: `' + issue.code + '`', '- Rule: `' + reason + '`', '- Range: `' + range + '`', '- Error: `' + error.toString() + '`', '', '<!-- If at all possible, please include code to reproduce this issue! -->'].join('\n'));

          _electron.shell.openExternal(_packageJson2['default'].repository.url + '/issues/new?title=' + title + '&body=' + body);
        }

        notification.dismiss();
      }
    }]
  });
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1odG1sbGludC9saWIvcmVwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztJQVdlLGdCQUFnQixxQkFBL0IsV0FBZ0MsVUFBVSxFQUFFO0FBQzFDLE1BQU0sSUFBSSxHQUFHLHlCQUFTLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG9DQUFvQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZGLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixXQUFTLElBQUksMEJBQXFCLFVBQVUsQ0FBRyxDQUFDO0FBQ2hGLE1BQU0sYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDO0FBQ2hDLFVBQU0sRUFBRSxnQ0FBZ0M7QUFDeEMsZUFBVyxFQUFFLGtCQUFrQjtHQUNoQyxDQUFDLENBQUM7O0FBRUgsTUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2QsTUFBSTtBQUNGLFFBQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyw2Q0FBMkMsS0FBSyw4QkFBMkIsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNuSSxRQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRTtBQUNoQixhQUFPLElBQUksQ0FBQztLQUNiOztBQUVELFFBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QixRQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDN0MsYUFBTyxJQUFJLENBQUM7S0FDYjs7QUFFRCxRQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMzQixhQUFPLElBQUksQ0FBQztLQUNiOztBQUVELFFBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNUIsUUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNwQyxhQUFVLHlCQUFTLFVBQVUsQ0FBQyxHQUFHLGdCQUFXLEtBQUssQ0FBQyxNQUFNLENBQUc7S0FDNUQ7R0FDRixDQUFDLE9BQU8sS0FBSyxFQUFFOztHQUVmOztBQUVELFNBQU8sSUFBSSxDQUFDO0NBQ2I7Ozs7Ozt3QkExQ3FCLFVBQVU7Ozs7d0JBQ1gsVUFBVTs7OzsyQkFFVixpQkFBaUI7Ozs7O0FBTHRDLFdBQVcsQ0FBQzs7QUFRWixJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsdUNBc0NKLFdBQXNCLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDakQsTUFBTSxLQUFLLFVBQU8sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUEsVUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQSxNQUFHLENBQUM7QUFDeEQsTUFBTSxNQUFNLEdBQUcsc0JBQVMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNwRCxNQUFNLFNBQVMseUNBQXNDLEtBQUssQ0FBQyxJQUFJLE9BQUcsQ0FBQzs7QUFFbkUsTUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQy9CLFdBQU87R0FDUjtBQUNELFNBQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXhCLE1BQU0sT0FBTyxHQUFHLE1BQU0sZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsZ0NBQWdDLEVBQUU7QUFDbkYsZUFBVyxFQUFFLHdCQUNVLEtBQUssQ0FBQyxJQUFJLFdBQU0sTUFBTSxTQUFJLEtBQUssRUFDcEQsT0FBTyxLQUFLLElBQUksR0FBRyxFQUFFLEdBQUcsc0NBQXNDLENBQy9ELENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNkLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLFdBQU8sRUFBRSxDQUNQO0FBQ0UsVUFBSSxFQUFFLE9BQU8sS0FBSyxJQUFJLEdBQUcsUUFBUSxHQUFHLFlBQVk7QUFDaEQsZ0JBQVUsRUFBRSxzQkFBTTtBQUNoQixZQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7QUFDcEIsMEJBQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzdCLE1BQU07QUFDTCxjQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QyxjQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxDQUM5Qiw0RUFBNEUsRUFDNUUsRUFBRSxFQUNGLG9CQUFvQixnQkFDUCxLQUFLLENBQUMsSUFBSSxzQkFDVixNQUFNLHVCQUNMLEtBQUssdUJBQ0wsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUM5QixFQUFFLEVBQ0YsMkVBQTJFLENBQzVFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRWQsMEJBQU0sWUFBWSxDQUFJLHlCQUFTLFVBQVUsQ0FBQyxHQUFHLDBCQUFxQixLQUFLLGNBQVMsSUFBSSxDQUFHLENBQUM7U0FDekY7O0FBRUQsb0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN4QjtLQUNGLENBQ0Y7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItaHRtbGxpbnQvbGliL3JlcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvZXh0ZW5zaW9ucywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLCBpbXBvcnQvbm8tdW5yZXNvbHZlZFxuaW1wb3J0IGh0bWxsaW50IGZyb20gJ2h0bWxsaW50JztcblxuaW1wb3J0IG1ldGFkYXRhIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5cbi8vIEludGVybmFsIHZhcmlhYmxlc1xuY29uc3QgaWdub3JlZCA9IFtdO1xuXG4vLyBJbnRlcm5hbCBmdW5jdGlvbnNcbmFzeW5jIGZ1bmN0aW9uIGZpbmRTaW1pbGFySXNzdWUoaXNzdWVUaXRsZSkge1xuICBjb25zdCByZXBvID0gbWV0YWRhdGEucmVwb3NpdG9yeS51cmwucmVwbGFjZSgvaHR0cHM/OlxcL1xcLyhcXGQrXFwuKT9naXRodWJcXC5jb21cXC8vZ2ksICcnKTtcbiAgY29uc3QgcXVlcnkgPSBlbmNvZGVVUklDb21wb25lbnQoYHJlcG86JHtyZXBvfSBpczpvcGVuIGluOnRpdGxlICR7aXNzdWVUaXRsZX1gKTtcbiAgY29uc3QgZ2l0aHViSGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcbiAgICBhY2NlcHQ6ICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzK2pzb24nLFxuICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcbiAgfSk7XG5cbiAgbGV0IGRhdGEgPSBbXTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5naXRodWIuY29tL3NlYXJjaC9pc3N1ZXM/cT0ke3F1ZXJ5fSZzb3J0PWNyZWF0ZWQmb3JkZXI9YXNjYCwgeyBoZWFkZXJzOiBnaXRodWJIZWFkZXJzIH0pO1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgaWYgKGRhdGEgPT09IG51bGwgfHwgZGF0YS5pdGVtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGlzc3VlID0gZGF0YS5pdGVtc1swXTtcbiAgICBpZiAoaXNzdWUudGl0bGUuaW5jbHVkZXMoaXNzdWVUaXRsZSkpIHtcbiAgICAgIHJldHVybiBgJHttZXRhZGF0YS5yZXBvc2l0b3J5LnVybH0vaXNzdWVzLyR7aXNzdWUubnVtYmVyfWA7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIGVzbGludC1kaXNhYmxlIG5vLWVtcHR5XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gcmVwb3J0KGlzc3VlLCBlcnJvcikge1xuICBjb25zdCByYW5nZSA9IGAoJHtpc3N1ZS5saW5lIC0gMX06JHtpc3N1ZS5jb2x1bW4gLSAxfSlgO1xuICBjb25zdCByZWFzb24gPSBodG1sbGludC5tZXNzYWdlcy5yZW5kZXJJc3N1ZShpc3N1ZSk7XG4gIGNvbnN0IHRpdGxlVGV4dCA9IGBJbnZhbGlkIHBvc2l0aW9uIGdpdmVuIGJ5IHJ1bGUgJyR7aXNzdWUuY29kZX0nYDtcblxuICBpZiAoaWdub3JlZC5pbmNsdWRlcyh0aXRsZVRleHQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlnbm9yZWQucHVzaCh0aXRsZVRleHQpO1xuXG4gIGNvbnN0IGdoSXNzdWUgPSBhd2FpdCBmaW5kU2ltaWxhcklzc3VlKHRpdGxlVGV4dCk7XG4gIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdVbmV4cGVjdGVkIGlzc3VlIHdpdGggaHRtbGxpbnQnLCB7XG4gICAgZGVzY3JpcHRpb246IFtcbiAgICAgIGBPcmlnaW5hbCBtZXNzYWdlOiAke2lzc3VlLmNvZGV9IC0gJHtyZWFzb259ICR7cmFuZ2V9YCxcbiAgICAgIGdoSXNzdWUgPT09IG51bGwgPyAnJyA6ICdUaGlzIGlzc3VlIGhhcyBhbHJlYWR5IGJlZW4gcmVwb3J0ZWQnXG4gICAgXS5qb2luKCdcXG5cXG4nKSxcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICBidXR0b25zOiBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6IGdoSXNzdWUgPT09IG51bGwgPyAnUmVwb3J0JyA6ICdWaWV3IGlzc3VlJyxcbiAgICAgICAgb25EaWRDbGljazogKCkgPT4ge1xuICAgICAgICAgIGlmIChnaElzc3VlICE9PSBudWxsKSB7XG4gICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoZ2hJc3N1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gZW5jb2RlVVJJQ29tcG9uZW50KHRpdGxlVGV4dCk7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFtcbiAgICAgICAgICAgICAgJ2h0bWxoaW50IHJldHVybmVkIGEgcG9pbnQgdGhhdCBkaWQgbm90IGV4aXN0IGluIHRoZSBkb2N1bWVudCBiZWluZyBlZGl0ZWQuJyxcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICdEZWJ1ZyBpbmZvcm1hdGlvbjonLFxuICAgICAgICAgICAgICBgLSBDb2RlOiBcXGAke2lzc3VlLmNvZGV9XFxgYCxcbiAgICAgICAgICAgICAgYC0gUnVsZTogXFxgJHtyZWFzb259XFxgYCxcbiAgICAgICAgICAgICAgYC0gUmFuZ2U6IFxcYCR7cmFuZ2V9XFxgYCxcbiAgICAgICAgICAgICAgYC0gRXJyb3I6IFxcYCR7ZXJyb3IudG9TdHJpbmcoKX1cXGBgLFxuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgJzwhLS0gSWYgYXQgYWxsIHBvc3NpYmxlLCBwbGVhc2UgaW5jbHVkZSBjb2RlIHRvIHJlcHJvZHVjZSB0aGlzIGlzc3VlISAtLT4nXG4gICAgICAgICAgICBdLmpvaW4oJ1xcbicpKTtcblxuICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKGAke21ldGFkYXRhLnJlcG9zaXRvcnkudXJsfS9pc3N1ZXMvbmV3P3RpdGxlPSR7dGl0bGV9JmJvZHk9JHtib2R5fWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0pO1xufVxuIl19