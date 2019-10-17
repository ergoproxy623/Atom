Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = makeRequire;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var debug = (0, _debug2["default"])("js-hyperclick:require-if-trusted");

var hashFile = function hashFile(filename) {
  var hash = _crypto2["default"].createHash("sha1");
  hash.setEncoding("hex");
  hash.write(_fs2["default"].readFileSync(filename));
  hash.end();
  return String(hash.read());
};

var fileHashes = {};

var hasChanged = function hasChanged(filename, hash) {
  return fileHashes[filename] != null && fileHashes[filename] != hash;
};

var configKey = "js-hyperclick.trustedFiles";
function updateTrust(hash, trusted) {
  var trustedFiles = (atom.config.get(configKey) || []).filter(function (tmp) {
    return tmp.hash !== hash;
  });

  var newConfig = [].concat(_toConsumableArray(trustedFiles), [{ hash: hash, trusted: trusted }]);
  debug("updateTrust", newConfig);

  atom.config.set(configKey, newConfig);
}

function promptUser(_ref) {
  var path = _ref.path;
  var hash = _ref.hash;
  var lastHash = _ref.lastHash;
  var fallback = _ref.fallback;

  var message = "js-hyperclick: Trust and execute this file?";
  var detail = "filename: " + path + "\nhash: " + hash;

  if (lastHash) {
    detail += "\nprevious hash: " + lastHash;
    detail += "\nThe file has changed and atom must reload to use it.";
  }

  debug("promptUser", path);
  var options = {
    pending: atom.config.get("js-hyperclick.usePendingPanes")
  };
  var untrustedFile = atom.workspace.open(path, options);
  var notification = atom.notifications.addInfo(message, {
    detail: detail,
    dismissable: true,
    buttons: [{
      text: lastHash ? "Trust & Restart" : "Trust",
      onDidClick: function onDidClick() {
        updateTrust(hash, true);
        notification.dismiss();

        if (lastHash) {
          return atom.reload();
        }
        debug("Trust");
        fallback(true);
        untrustedFile.then(function (editor) {
          editor.destroy();
        });
      }
    }, {
      text: "Never",
      onDidClick: function onDidClick() {
        updateTrust(hash, false);
        notification.dismiss();
      }
    }]
  });
}

function makeRequire(fallback) {
  return function requireIfTrusted(path) {
    var trustedFiles = atom.config.get(configKey) || [];

    var hash = hashFile(path);
    // Originally I was going to store the filename and a hash
    // (trustedFiles[path][hash] = true), but using a config key
    // that contains a dot causes it to get broken up
    // (trustedFiles['some-path']['js'][hash] = true)

    var _ref2 = trustedFiles.find(function (tmp) {
      return tmp.hash === hash;
    }) || {};

    var trusted = _ref2.trusted;

    var changed = hasChanged(path, hash);
    var lastHash = fileHashes[path];

    if (trusted && !changed) {
      fileHashes[path] = hash;
      // $FlowExpectError
      return require(path);
    }

    if (trusted == null || changed) {
      promptUser({ path: path, hash: hash, lastHash: lastHash, fallback: fallback });
    }
    return fallback(false);
  };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL3JlcXVpcmUtaWYtdHJ1c3RlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBZ0Z3QixXQUFXOzs7Ozs7a0JBL0VwQixJQUFJOzs7O3NCQUNBLFFBQVE7Ozs7cUJBQ0wsT0FBTzs7OztBQUM3QixJQUFNLEtBQUssR0FBRyx3QkFBVSxrQ0FBa0MsQ0FBQyxDQUFBOztBQUUzRCxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxRQUFRLEVBQXFCO0FBQzdDLE1BQU0sSUFBSSxHQUFHLG9CQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN0QyxNQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3ZCLE1BQUksQ0FBQyxLQUFLLENBQUMsZ0JBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDckMsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ1YsU0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7Q0FDM0IsQ0FBQTs7QUFFRCxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUE7O0FBRXJCLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLFFBQVEsRUFBRSxJQUFJO1NBQ2hDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUk7Q0FBQSxDQUFBOztBQU05RCxJQUFNLFNBQVMsR0FBRyw0QkFBNEIsQ0FBQTtBQUM5QyxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ2xDLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsTUFBTSxDQUM1RCxVQUFBLEdBQUc7V0FBSSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUk7R0FB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QUksT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3ZCLGdCQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFBOztBQUV2QixhQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNyQjs7QUFFRCxRQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO0FBQzlCLGdCQUFVLENBQUMsRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtLQUMvQztBQUNELFdBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ3ZCLENBQUE7Q0FDRiIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9qcy1oeXBlcmNsaWNrL2xpYi9yZXF1aXJlLWlmLXRydXN0ZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiXG5pbXBvcnQgY3J5cHRvIGZyb20gXCJjcnlwdG9cIlxuaW1wb3J0IG1ha2VEZWJ1ZyBmcm9tIFwiZGVidWdcIlxuY29uc3QgZGVidWcgPSBtYWtlRGVidWcoXCJqcy1oeXBlcmNsaWNrOnJlcXVpcmUtaWYtdHJ1c3RlZFwiKVxuXG5jb25zdCBoYXNoRmlsZSA9IChmaWxlbmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgY29uc3QgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKFwic2hhMVwiKVxuICBoYXNoLnNldEVuY29kaW5nKFwiaGV4XCIpXG4gIGhhc2gud3JpdGUoZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lKSlcbiAgaGFzaC5lbmQoKVxuICByZXR1cm4gU3RyaW5nKGhhc2gucmVhZCgpKVxufVxuXG5jb25zdCBmaWxlSGFzaGVzID0ge31cblxuY29uc3QgaGFzQ2hhbmdlZCA9IChmaWxlbmFtZSwgaGFzaCkgPT5cbiAgZmlsZUhhc2hlc1tmaWxlbmFtZV0gIT0gbnVsbCAmJiBmaWxlSGFzaGVzW2ZpbGVuYW1lXSAhPSBoYXNoXG5cbmV4cG9ydCB0eXBlIEZhbGxiYWNrPFQ+ID0gKHRydXN0ZWQ6IGJvb2xlYW4pID0+IFRcblxuZXhwb3J0IHR5cGUgUmVxdWlyZTxUPiA9IChtb2R1bGVOYW1lOiBzdHJpbmcpID0+IFRcblxuY29uc3QgY29uZmlnS2V5ID0gXCJqcy1oeXBlcmNsaWNrLnRydXN0ZWRGaWxlc1wiXG5mdW5jdGlvbiB1cGRhdGVUcnVzdChoYXNoLCB0cnVzdGVkKSB7XG4gIGNvbnN0IHRydXN0ZWRGaWxlcyA9IChhdG9tLmNvbmZpZy5nZXQoY29uZmlnS2V5KSB8fCBbXSkuZmlsdGVyKFxuICAgIHRtcCA9PiB0bXAuaGFzaCAhPT0gaGFzaCxcbiAgKVxuXG4gIGNvbnN0IG5ld0NvbmZpZyA9IFsuLi50cnVzdGVkRmlsZXMsIHsgaGFzaCwgdHJ1c3RlZCB9XVxuICBkZWJ1ZyhcInVwZGF0ZVRydXN0XCIsIG5ld0NvbmZpZylcblxuICBhdG9tLmNvbmZpZy5zZXQoY29uZmlnS2V5LCBuZXdDb25maWcpXG59XG5cbmZ1bmN0aW9uIHByb21wdFVzZXIoeyBwYXRoLCBoYXNoLCBsYXN0SGFzaCwgZmFsbGJhY2sgfSkge1xuICBjb25zdCBtZXNzYWdlID0gXCJqcy1oeXBlcmNsaWNrOiBUcnVzdCBhbmQgZXhlY3V0ZSB0aGlzIGZpbGU/XCJcbiAgbGV0IGRldGFpbCA9IGBmaWxlbmFtZTogJHtwYXRofVxcbmhhc2g6ICR7aGFzaH1gXG5cbiAgaWYgKGxhc3RIYXNoKSB7XG4gICAgZGV0YWlsICs9IGBcXG5wcmV2aW91cyBoYXNoOiAke2xhc3RIYXNofWBcbiAgICBkZXRhaWwgKz0gYFxcblRoZSBmaWxlIGhhcyBjaGFuZ2VkIGFuZCBhdG9tIG11c3QgcmVsb2FkIHRvIHVzZSBpdC5gXG4gIH1cblxuICBkZWJ1ZyhcInByb21wdFVzZXJcIiwgcGF0aClcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBwZW5kaW5nOiBhdG9tLmNvbmZpZy5nZXQoXCJqcy1oeXBlcmNsaWNrLnVzZVBlbmRpbmdQYW5lc1wiKSxcbiAgfVxuICBjb25zdCB1bnRydXN0ZWRGaWxlID0gYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoLCBvcHRpb25zKVxuICBjb25zdCBub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhtZXNzYWdlLCB7XG4gICAgZGV0YWlsLFxuICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgIGJ1dHRvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgdGV4dDogbGFzdEhhc2ggPyBcIlRydXN0ICYgUmVzdGFydFwiIDogXCJUcnVzdFwiLFxuICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgIHVwZGF0ZVRydXN0KGhhc2gsIHRydWUpXG4gICAgICAgICAgbm90aWZpY2F0aW9uLmRpc21pc3MoKVxuXG4gICAgICAgICAgaWYgKGxhc3RIYXNoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXRvbS5yZWxvYWQoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBkZWJ1ZyhcIlRydXN0XCIpXG4gICAgICAgICAgZmFsbGJhY2sodHJ1ZSlcbiAgICAgICAgICB1bnRydXN0ZWRGaWxlLnRoZW4oZWRpdG9yID0+IHtcbiAgICAgICAgICAgIGVkaXRvci5kZXN0cm95KClcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogXCJOZXZlclwiLFxuICAgICAgICBvbkRpZENsaWNrKCkge1xuICAgICAgICAgIHVwZGF0ZVRydXN0KGhhc2gsIGZhbHNlKVxuICAgICAgICAgIG5vdGlmaWNhdGlvbi5kaXNtaXNzKClcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFrZVJlcXVpcmU8VD4oZmFsbGJhY2s6IEZhbGxiYWNrPFQ+KTogUmVxdWlyZTxUPiB7XG4gIHJldHVybiBmdW5jdGlvbiByZXF1aXJlSWZUcnVzdGVkKHBhdGg6IHN0cmluZyk6IFQge1xuICAgIGNvbnN0IHRydXN0ZWRGaWxlcyA9IGF0b20uY29uZmlnLmdldChjb25maWdLZXkpIHx8IFtdXG5cbiAgICBjb25zdCBoYXNoID0gaGFzaEZpbGUocGF0aClcbiAgICAvLyBPcmlnaW5hbGx5IEkgd2FzIGdvaW5nIHRvIHN0b3JlIHRoZSBmaWxlbmFtZSBhbmQgYSBoYXNoXG4gICAgLy8gKHRydXN0ZWRGaWxlc1twYXRoXVtoYXNoXSA9IHRydWUpLCBidXQgdXNpbmcgYSBjb25maWcga2V5XG4gICAgLy8gdGhhdCBjb250YWlucyBhIGRvdCBjYXVzZXMgaXQgdG8gZ2V0IGJyb2tlbiB1cFxuICAgIC8vICh0cnVzdGVkRmlsZXNbJ3NvbWUtcGF0aCddWydqcyddW2hhc2hdID0gdHJ1ZSlcbiAgICBjb25zdCB7IHRydXN0ZWQgfSA9IHRydXN0ZWRGaWxlcy5maW5kKHRtcCA9PiB0bXAuaGFzaCA9PT0gaGFzaCkgfHwge31cblxuICAgIGNvbnN0IGNoYW5nZWQgPSBoYXNDaGFuZ2VkKHBhdGgsIGhhc2gpXG4gICAgY29uc3QgbGFzdEhhc2ggPSBmaWxlSGFzaGVzW3BhdGhdXG5cbiAgICBpZiAodHJ1c3RlZCAmJiAhY2hhbmdlZCkge1xuICAgICAgZmlsZUhhc2hlc1twYXRoXSA9IGhhc2hcbiAgICAgIC8vICRGbG93RXhwZWN0RXJyb3JcbiAgICAgIHJldHVybiByZXF1aXJlKHBhdGgpXG4gICAgfVxuXG4gICAgaWYgKHRydXN0ZWQgPT0gbnVsbCB8fCBjaGFuZ2VkKSB7XG4gICAgICBwcm9tcHRVc2VyKHsgcGF0aCwgaGFzaCwgbGFzdEhhc2gsIGZhbGxiYWNrIH0pXG4gICAgfVxuICAgIHJldHVybiBmYWxsYmFjayhmYWxzZSlcbiAgfVxufVxuIl19