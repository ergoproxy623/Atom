Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var BracketMatcher = (function () {
  function BracketMatcher(editor) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$brackets = _ref.brackets;
    var brackets = _ref$brackets === undefined ? ['{}', '()', '[]'] : _ref$brackets;
    var _ref$repeatColorCount = _ref.repeatColorCount;
    var repeatColorCount = _ref$repeatColorCount === undefined ? 9 : _ref$repeatColorCount;
    var _ref$alternateDifferent = _ref.alternateDifferent;
    var alternateDifferent = _ref$alternateDifferent === undefined ? false : _ref$alternateDifferent;
    var _ref$alternateConsecutive = _ref.alternateConsecutive;
    var alternateConsecutive = _ref$alternateConsecutive === undefined ? false : _ref$alternateConsecutive;

    _classCallCheck(this, BracketMatcher);

    this.editor = editor;
    this.brackets = brackets;
    this.repeatColorCount = repeatColorCount;
    this.alternateDifferent = alternateDifferent;
    this.alternateConsecutive = alternateConsecutive;
    this.markerLayer = editor.addMarkerLayer();
    this.colorBrackets();
  }

  _createClass(BracketMatcher, [{
    key: 'refresh',
    value: function refresh() {
      this.clear();
      this.colorBrackets();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.markerLayer.clear();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.markerLayer.destroy();
    }
  }, {
    key: 'colorBrackets',
    value: function colorBrackets() {
      if (this.alternateDifferent) {
        var symbolStarts = "";
        var symbolEnds = "";
        var brackets = [];
        for (var bracket of this.brackets) {
          if (bracket.length === 2) {
            symbolStarts += bracket[0];
            symbolEnds += bracket[1];
            brackets.push(bracket);
          } else {
            atom.notifications.addError(bracket + ' is not a valid set of brackets');
          }
        }
        if (symbolStarts && symbolEnds) {
          this.colorify(symbolStarts, symbolEnds, brackets);
        }
      } else {
        for (var bracket of this.brackets) {
          if (bracket.length === 2) {
            this.colorify(bracket[0], bracket[1], [bracket]);
          } else {
            atom.notifications.addError(bracket + ' is not a valid set of brackets');
          }
        }
      }
    }
  }, {
    key: 'colorify',
    value: function colorify(symbolStart, symbolEnd, brackets) {
      var _this = this;

      var bracketCounts = brackets.reduce(function (obj, bracket) {
        obj[bracket] = [];
        return obj;
      }, {});
      var count = 0;
      var regex = new RegExp('[' + this.escapeRegExp(symbolStart + symbolEnd) + ']', 'g');

      this.editor.scan(regex, function (result) {

        if (_this.isRangeCommentedOrString(result.range)) {
          return;
        }

        if (symbolStart.includes(result.matchText)) {
          count++;
          var bracket = brackets.find(function (b) {
            return b[0] === result.matchText;
          });
          bracketCounts[bracket].push(count);
        } else if (symbolEnd.includes(result.matchText)) {
          var bracket = brackets.find(function (b) {
            return b[1] === result.matchText;
          });
          count = bracketCounts[bracket].pop() || 0;
        }

        var marker = _this.markerLayer.markBufferRange(result.range, { invalidate: 'inside' });

        var colorNumber = count > 0 ? (count - 1) % _this.repeatColorCount + 1 : 0;
        _this.editor.decorateMarker(marker, { type: 'text', 'class': 'bracket-colorizer-color' + colorNumber, stamp: 'bracket-colorizer' });

        if (!_this.alternateConsecutive && symbolEnd.includes(result.matchText)) {
          count--;
        }

        if (count < 0) {
          count = 0;
        }
      });
    }
  }, {
    key: 'escapeRegExp',
    value: function escapeRegExp(string) {
      // from https://stackoverflow.com/a/6969486/806777
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }, {
    key: 'isRangeCommentedOrString',
    value: function isRangeCommentedOrString(range) {
      var scopesArray = this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
      for (var scope of scopesArray.reverse()) {
        scope = scope.split('.');
        if (scope.includes('embedded') && scope.includes('source') || scope.includes('math')) {
          return false;
        }
        if (scope.includes('comment') || scope.includes('string') || scope.includes('regex')) {
          return true;
        }
      }
      return false;
    }
  }]);

  return BracketMatcher;
})();

exports['default'] = BracketMatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2JyYWNrZXQtY29sb3JpemVyL2xpYi9icmFja2V0LW1hdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUVxQixjQUFjO0FBQ3RCLFdBRFEsY0FBYyxDQUNyQixNQUFNLEVBS1Y7cUVBQUosRUFBRTs7NkJBSkosUUFBUTtRQUFSLFFBQVEsaUNBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztxQ0FDN0IsZ0JBQWdCO1FBQWhCLGdCQUFnQix5Q0FBRyxDQUFDO3VDQUNwQixrQkFBa0I7UUFBbEIsa0JBQWtCLDJDQUFHLEtBQUs7eUNBQzFCLG9CQUFvQjtRQUFwQixvQkFBb0IsNkNBQUcsS0FBSzs7MEJBTFgsY0FBYzs7QUFPL0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFDekIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0FBQ3pDLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztBQUM3QyxRQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7QUFDakQsUUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDM0MsUUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0dBQ3RCOztlQWRrQixjQUFjOztXQWdCMUIsbUJBQUc7QUFDUixVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDYixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7S0FDdEI7OztXQUVJLGlCQUFHO0FBQ04sVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUMxQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzVCOzs7V0FFWSx5QkFBRztBQUNkLFVBQUksSUFBSSxDQUFDLGtCQUFr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LENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwRixpQkFBTyxJQUFJLENBQUM7U0FDYjtPQUNGO0FBQ0QsYUFBTyxLQUFLLENBQUM7S0FDZDs7O1NBcEhrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9icmFja2V0LWNvbG9yaXplci9saWIvYnJhY2tldC1tYXRjaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCcmFja2V0TWF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKGVkaXRvciwge1xuICAgIGJyYWNrZXRzID0gWyd7fScsICcoKScsICdbXSddLFxuICAgIHJlcGVhdENvbG9yQ291bnQgPSA5LFxuICAgIGFsdGVybmF0ZURpZmZlcmVudCA9IGZhbHNlLFxuICAgIGFsdGVybmF0ZUNvbnNlY3V0aXZlID0gZmFsc2UsXG4gIH0gPSB7fSkge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIHRoaXMuYnJhY2tldHMgPSBicmFja2V0cztcbiAgICB0aGlzLnJlcGVhdENvbG9yQ291bnQgPSByZXBlYXRDb2xvckNvdW50O1xuICAgIHRoaXMuYWx0ZXJuYXRlRGlmZmVyZW50ID0gYWx0ZXJuYXRlRGlmZmVyZW50O1xuICAgIHRoaXMuYWx0ZXJuYXRlQ29uc2VjdXRpdmUgPSBhbHRlcm5hdGVDb25zZWN1dGl2ZTtcbiAgICB0aGlzLm1hcmtlckxheWVyID0gZWRpdG9yLmFkZE1hcmtlckxheWVyKCk7XG4gICAgdGhpcy5jb2xvckJyYWNrZXRzKCk7XG4gIH1cblxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLmNvbG9yQnJhY2tldHMoKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMubWFya2VyTGF5ZXIuY2xlYXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5tYXJrZXJMYXllci5kZXN0cm95KCk7XG4gIH1cblxuICBjb2xvckJyYWNrZXRzKCkge1xuICAgIGlmICh0aGlzLmFsdGVybmF0ZURpZmZlcmVudCkge1xuICAgICAgbGV0IHN5bWJvbFN0YXJ0cyA9IFwiXCI7XG4gICAgICBsZXQgc3ltYm9sRW5kcyA9IFwiXCI7XG4gICAgICBjb25zdCBicmFja2V0cyA9IFtdO1xuICAgICAgZm9yIChsZXQgYnJhY2tldCBvZiB0aGlzLmJyYWNrZXRzKSB7XG4gICAgICAgIGlmIChicmFja2V0Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIHN5bWJvbFN0YXJ0cyArPSBicmFja2V0WzBdO1xuICAgICAgICAgIHN5bWJvbEVuZHMgKz0gYnJhY2tldFsxXTtcbiAgICAgICAgICBicmFja2V0cy5wdXNoKGJyYWNrZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgJHticmFja2V0fSBpcyBub3QgYSB2YWxpZCBzZXQgb2YgYnJhY2tldHNgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN5bWJvbFN0YXJ0cyAmJiBzeW1ib2xFbmRzKSB7XG4gICAgICAgIHRoaXMuY29sb3JpZnkoc3ltYm9sU3RhcnRzLCBzeW1ib2xFbmRzLCBicmFja2V0cyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGJyYWNrZXQgb2YgdGhpcy5icmFja2V0cykge1xuICAgICAgICBpZiAoYnJhY2tldC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICB0aGlzLmNvbG9yaWZ5KGJyYWNrZXRbMF0sIGJyYWNrZXRbMV0sIFticmFja2V0XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGAke2JyYWNrZXR9IGlzIG5vdCBhIHZhbGlkIHNldCBvZiBicmFja2V0c2ApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29sb3JpZnkoc3ltYm9sU3RhcnQsIHN5bWJvbEVuZCwgYnJhY2tldHMpIHtcbiAgICBjb25zdCBicmFja2V0Q291bnRzID0gYnJhY2tldHMucmVkdWNlKChvYmosIGJyYWNrZXQpID0+IHtcbiAgICAgIG9ialticmFja2V0XSA9IFtdO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSk7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFske3RoaXMuZXNjYXBlUmVnRXhwKHN5bWJvbFN0YXJ0ICsgc3ltYm9sRW5kKX1dYCwgJ2cnKTtcblxuICAgIHRoaXMuZWRpdG9yLnNjYW4ocmVnZXgsIChyZXN1bHQpID0+IHtcblxuICAgICAgaWYgKHRoaXMuaXNSYW5nZUNvbW1lbnRlZE9yU3RyaW5nKHJlc3VsdC5yYW5nZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG5cbiAgICAgIGlmIChzeW1ib2xTdGFydC5pbmNsdWRlcyhyZXN1bHQubWF0Y2hUZXh0KSkge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBjb25zdCBicmFja2V0ID0gYnJhY2tldHMuZmluZChiID0+IGJbMF0gPT09IHJlc3VsdC5tYXRjaFRleHQpO1xuICAgICAgICBicmFja2V0Q291bnRzW2JyYWNrZXRdLnB1c2goY291bnQpO1xuICAgICAgfSBlbHNlIGlmIChzeW1ib2xFbmQuaW5jbHVkZXMocmVzdWx0Lm1hdGNoVGV4dCkpIHtcbiAgICAgICAgY29uc3QgYnJhY2tldCA9IGJyYWNrZXRzLmZpbmQoYiA9PiBiWzFdID09PSByZXN1bHQubWF0Y2hUZXh0KTtcbiAgICAgICAgY291bnQgPSBicmFja2V0Q291bnRzW2JyYWNrZXRdLnBvcCgpIHx8IDA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRoaXMubWFya2VyTGF5ZXIubWFya0J1ZmZlclJhbmdlKHJlc3VsdC5yYW5nZSwge2ludmFsaWRhdGU6ICdpbnNpZGUnfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yTnVtYmVyID0gY291bnQgPiAwID8gKGNvdW50IC0gMSkgJSB0aGlzLnJlcGVhdENvbG9yQ291bnQgKyAxIDogMDtcbiAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKFxuICAgICAgICBtYXJrZXIsIHt0eXBlOiAndGV4dCcsIGNsYXNzOiBgYnJhY2tldC1jb2xvcml6ZXItY29sb3Ike2NvbG9yTnVtYmVyfWAsIHN0YW1wOiAnYnJhY2tldC1jb2xvcml6ZXInfVxuICAgICAgKTtcblxuICAgICAgaWYgKCF0aGlzLmFsdGVybmF0ZUNvbnNlY3V0aXZlICYmIHN5bWJvbEVuZC5pbmNsdWRlcyhyZXN1bHQubWF0Y2hUZXh0KSkge1xuICAgICAgICBjb3VudC0tO1xuICAgICAgfVxuXG4gICAgICBpZiAoY291bnQgPCAwKSB7XG4gICAgICAgIGNvdW50ID0gMDtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG5cbiAgZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICAgIC8vIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzY5Njk0ODYvODA2Nzc3XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xuICB9XG5cbiAgaXNSYW5nZUNvbW1lbnRlZE9yU3RyaW5nKHJhbmdlKSB7XG4gICAgY29uc3Qgc2NvcGVzQXJyYXkgPSB0aGlzLmVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5zdGFydCkuZ2V0U2NvcGVzQXJyYXkoKTtcbiAgICBmb3IgKGxldCBzY29wZSBvZiBzY29wZXNBcnJheS5yZXZlcnNlKCkpIHtcbiAgICAgIHNjb3BlID0gc2NvcGUuc3BsaXQoJy4nKTtcbiAgICAgIGlmICgoc2NvcGUuaW5jbHVkZXMoJ2VtYmVkZGVkJykgJiYgc2NvcGUuaW5jbHVkZXMoJ3NvdXJjZScpKSB8fCBzY29wZS5pbmNsdWRlcygnbWF0aCcpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChzY29wZS5pbmNsdWRlcygnY29tbWVudCcpIHx8IHNjb3BlLmluY2x1ZGVzKCdzdHJpbmcnKSB8fCBzY29wZS5pbmNsdWRlcygncmVnZXgnKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iXX0=