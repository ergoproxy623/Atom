Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _parseCode = require("./parse-code");

var _parseCode2 = _interopRequireDefault(_parseCode);

var _buildSuggestion = require("./build-suggestion");

var _buildSuggestion2 = _interopRequireDefault(_buildSuggestion);

var _resolveModule = require("./resolve-module");

var _resolveModule2 = _interopRequireDefault(_resolveModule);

var _findDestination = require("./find-destination");

var _findDestination2 = _interopRequireDefault(_findDestination);

"use babel";
exports.parseCode = _parseCode2["default"];
exports.buildSuggestion = _buildSuggestion2["default"];
exports.resolveModule = _resolveModule2["default"];
exports.findDestination = _findDestination2["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2NvcmUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3lCQUVzQixjQUFjOzs7OytCQUNSLG9CQUFvQjs7Ozs2QkFDdEIsa0JBQWtCOzs7OytCQUNoQixvQkFBb0I7Ozs7QUFMaEQsV0FBVyxDQUFBO1FBT0YsU0FBUztRQUFFLGVBQWU7UUFBRSxhQUFhO1FBQUUsZUFBZSIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9qcy1oeXBlcmNsaWNrL2xpYi9jb3JlL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIlxuLy8gQGZsb3dcbmltcG9ydCBwYXJzZUNvZGUgZnJvbSBcIi4vcGFyc2UtY29kZVwiXG5pbXBvcnQgYnVpbGRTdWdnZXN0aW9uIGZyb20gXCIuL2J1aWxkLXN1Z2dlc3Rpb25cIlxuaW1wb3J0IHJlc29sdmVNb2R1bGUgZnJvbSBcIi4vcmVzb2x2ZS1tb2R1bGVcIlxuaW1wb3J0IGZpbmREZXN0aW5hdGlvbiBmcm9tIFwiLi9maW5kLWRlc3RpbmF0aW9uXCJcblxuZXhwb3J0IHsgcGFyc2VDb2RlLCBidWlsZFN1Z2dlc3Rpb24sIHJlc29sdmVNb2R1bGUsIGZpbmREZXN0aW5hdGlvbiB9XG4iXX0=