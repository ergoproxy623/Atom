Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.execPromise = execPromise;

var _child_process = require('child_process');

'use babel';

function execPromise(cmd, options) {
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)(cmd, options, function (err, stdout, stderr) {
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7NkJBRXFCLGVBQWU7O0FBRnBDLFdBQVcsQ0FBQTs7QUFJSixTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO0FBQ3hDLFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLO0FBQ3RDLDZCQUFLLEdBQUcsRUFBRSxPQUFPLEVBQUUsVUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBSztBQUMxQyxVQUFJLEdBQUcsRUFBRTtBQUNQLGVBQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3BCO0FBQ0QsYUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2VzcydcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWNQcm9taXNlKGNtZCwgb3B0aW9ucykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGV4ZWMoY21kLCBvcHRpb25zLCAoZXJyLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgICByZXNvbHZlKHN0ZG91dCk7XG4gICAgfSk7XG4gIH0pO1xufVxuIl19