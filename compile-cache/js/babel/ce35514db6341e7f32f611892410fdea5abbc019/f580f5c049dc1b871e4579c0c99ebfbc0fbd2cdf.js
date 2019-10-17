'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = [{
  scopes: ['source.js', 'source.js.jsx', 'source.coffee', 'source.coffee.jsx', 'source.ts', 'source.tsx'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee', 'json'],
  relative: true,
  replaceOnInsert: [['([\\/]?index)?\\.jsx?$', ''], ['([\\/]?index)?\\.ts$', ''], ['([\\/]?index)?\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['import\\s+.*?from\\s+[\'"]', // import foo from './foo'
  'import\\s+[\'"]', // import './foo'
  'require\\([\'"]', // require('./foo')
  'define\\(\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'vue', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['text.html.vue'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['css', 'sass', 'scss', 'less', 'styl'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.coffee', 'source.coffee.jsx'],
  prefixes: ['require\\s+[\'"]', // require './foo'
  'define\\s+\\[?[\'"]' // define(['./foo']) or define('./foo')
  ],
  extensions: ['js', 'jsx', 'ts', 'tsx', 'coffee'],
  relative: true,
  replaceOnInsert: [['\\.jsx?$', ''], ['\\.ts$', ''], ['\\.coffee$', '']]
}, {
  scopes: ['source.php'],
  prefixes: ['require_once\\([\'"]', // require_once('foo.php')
  'include\\([\'"]' // include('./foo.php')
  ],
  extensions: ['php'],
  relative: true
}, {
  scopes: ['source.sass', 'source.css.scss', 'source.css.less', 'source.stylus'],
  prefixes: ['@import[\\(|\\s+]?[\'"]' // @import 'foo' or @import('foo')
  ],
  extensions: ['sass', 'scss', 'css'],
  relative: true,
  replaceOnInsert: [['(/)?_([^/]*?)$', '$1$2'] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
  ]
}, {
  scopes: ['source.css'],
  prefixes: ['@import\\s+[\'"]?', // @import 'foo.css'
  '@import\\s+url\\([\'"]?' // @import url('foo.css')
  ],
  extensions: ['css'],
  relative: true
}, {
  scopes: ['source.css', 'source.sass', 'source.css.less', 'source.css.scss', 'source.stylus'],
  prefixes: ['url\\([\'"]?'],
  extensions: ['png', 'gif', 'jpeg', 'jpg', 'woff', 'ttf', 'svg', 'otf'],
  relative: true
}, {
  scopes: ['source.c', 'source.cpp'],
  prefixes: ['^\\s*#include\\s+[\'"]'],
  extensions: ['h', 'hpp'],
  relative: true,
  includeCurrentDirectory: false
}, {
  scopes: ['source.lua'],
  prefixes: ['require[\\s+|\\(][\'"]'],
  extensions: ['lua'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.lua$', '']]
}, {
  scopes: ['source.ruby'],
  prefixes: ['^\\s*require[\\s+|\\(][\'"]'],
  extensions: ['rb'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\.rb$', '']]
}, {
  scopes: ['source.python'],
  prefixes: ['^\\s*from\\s+', '^\\s*import\\s+'],
  extensions: ['py'],
  relative: true,
  includeCurrentDirectory: false,
  replaceOnInsert: [['\\/', '.'], ['\\\\', '.'], ['\\.py$', '']]
}];
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvY29uZmlnL2RlZmF1bHQtc2NvcGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7cUJBRUksQ0FDYjtBQUNFLFFBQU0sRUFBRSxDQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUM7QUFDdkcsVUFBUSxFQUFFLENBQ1IsNEJBQTRCO0FBQzVCLG1CQUFpQjtBQUNqQixtQkFBaUI7QUFDakIsc0JBQW9CO0dBQ3JCO0FBQ0QsWUFBVSxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7QUFDeEQsVUFBUSxFQUFFLElBQUk7QUFDZCxpQkFBZSxFQUFFLENBQ2YsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLENBQUMsRUFDOUIsQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsRUFDNUIsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FDakM7Q0FDRixFQUNEO0FBQ0UsUUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO0FBQ3pCLFVBQVEsRUFBRSxDQUNSLDRCQUE0QjtBQUM1QixtQkFBaUI7QUFDakIsbUJBQWlCO0FBQ2pCLHNCQUFvQjtHQUNyQjtBQUNELFlBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDO0FBQ3ZELFVBQVEsRUFBRSxJQUFJO0FBQ2QsaUJBQWUsRUFBRSxDQUNmLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUNoQixDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsRUFDZCxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FDbkI7Q0FDRixFQUNEO0FBQ0UsUUFBTSxFQUFFLENBQUMsZUFBZSxDQUFDO0FB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QUFDOUIsaUJBQWUsRUFBRSxDQUNmLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUNmO0NBQ0YsRUFDRDtBQUNFLFFBQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQztBQUN6QixVQUFRLEVBQUUsQ0FDUixlQUFlLEVBQ2YsaUJBQWlCLENBQ2xCO0FBQ0QsWUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQ2xCLFVBQVEsRUFBRSxJQUFJO0FBQ2QseUJBQXVCLEVBQUUsS0FBSztBQUM5QixpQkFBZSxFQUFFLENBQ2YsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQ1osQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQ2IsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQ2Y7Q0FDRixDQUNGIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvY29uZmlnL2RlZmF1bHQtc2NvcGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuZXhwb3J0IGRlZmF1bHQgW1xuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5qcycsICdzb3VyY2UuanMuanN4JywgJ3NvdXJjZS5jb2ZmZWUnLCAnc291cmNlLmNvZmZlZS5qc3gnLCAnc291cmNlLnRzJywgJ3NvdXJjZS50c3gnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ2ltcG9ydFxcXFxzKy4qP2Zyb21cXFxccytbXFwnXCJdJywgLy8gaW1wb3J0IGZvbyBmcm9tICcuL2ZvbydcbiAgICAgICdpbXBvcnRcXFxccytbXFwnXCJdJywgLy8gaW1wb3J0ICcuL2ZvbydcbiAgICAgICdyZXF1aXJlXFxcXChbXFwnXCJdJywgLy8gcmVxdWlyZSgnLi9mb28nKVxuICAgICAgJ2RlZmluZVxcXFwoXFxcXFs/W1xcJ1wiXScgLy8gZGVmaW5lKFsnLi9mb28nXSkgb3IgZGVmaW5lKCcuL2ZvbycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2pzJywgJ2pzeCcsICd0cycsICd0c3gnLCAnY29mZmVlJywgJ2pzb24nXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnKFtcXFxcL10/aW5kZXgpP1xcXFwuanN4PyQnLCAnJ10sXG4gICAgICBbJyhbXFxcXC9dP2luZGV4KT9cXFxcLnRzJCcsICcnXSxcbiAgICAgIFsnKFtcXFxcL10/aW5kZXgpP1xcXFwuY29mZmVlJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwudnVlJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdpbXBvcnRcXFxccysuKj9mcm9tXFxcXHMrW1xcJ1wiXScsIC8vIGltcG9ydCBmb28gZnJvbSAnLi9mb28nXG4gICAgICAnaW1wb3J0XFxcXHMrW1xcJ1wiXScsIC8vIGltcG9ydCAnLi9mb28nXG4gICAgICAncmVxdWlyZVxcXFwoW1xcJ1wiXScsIC8vIHJlcXVpcmUoJy4vZm9vJylcbiAgICAgICdkZWZpbmVcXFxcKFxcXFxbP1tcXCdcIl0nIC8vIGRlZmluZShbJy4vZm9vJ10pIG9yIGRlZmluZSgnLi9mb28nKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydqcycsICdqc3gnLCAndnVlJywgJ3RzJywgJ3RzeCcsICdjb2ZmZWUnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC5qc3g/JCcsICcnXSxcbiAgICAgIFsnXFxcXC50cyQnLCAnJ10sXG4gICAgICBbJ1xcXFwuY29mZmVlJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWyd0ZXh0Lmh0bWwudnVlJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdAaW1wb3J0W1xcXFwofFxcXFxzK10/W1xcJ1wiXScgLy8gQGltcG9ydCAnZm9vJyBvciBAaW1wb3J0KCdmb28nKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydjc3MnLCAnc2FzcycsICdzY3NzJywgJ2xlc3MnLCAnc3R5bCddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWycoLyk/XyhbXi9dKj8pJCcsICckMSQyJ10gLy8gZGlyMS9fZGlyMi9fZmlsZS5zYXNzID0+IGRpcjEvX2RpcjIvZmlsZS5zYXNzXG4gICAgXVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5jb2ZmZWUnLCAnc291cmNlLmNvZmZlZS5qc3gnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ3JlcXVpcmVcXFxccytbXFwnXCJdJywgLy8gcmVxdWlyZSAnLi9mb28nXG4gICAgICAnZGVmaW5lXFxcXHMrXFxcXFs/W1xcJ1wiXScgLy8gZGVmaW5lKFsnLi9mb28nXSkgb3IgZGVmaW5lKCcuL2ZvbycpXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2pzJywgJ2pzeCcsICd0cycsICd0c3gnLCAnY29mZmVlJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJ1xcXFwuanN4PyQnLCAnJ10sXG4gICAgICBbJ1xcXFwudHMkJywgJyddLFxuICAgICAgWydcXFxcLmNvZmZlZSQnLCAnJ11cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBzY29wZXM6IFsnc291cmNlLnBocCddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAncmVxdWlyZV9vbmNlXFxcXChbXFwnXCJdJywgLy8gcmVxdWlyZV9vbmNlKCdmb28ucGhwJylcbiAgICAgICdpbmNsdWRlXFxcXChbXFwnXCJdJyAvLyBpbmNsdWRlKCcuL2Zvby5waHAnKVxuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydwaHAnXSxcbiAgICByZWxhdGl2ZTogdHJ1ZVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5zYXNzJywgJ3NvdXJjZS5jc3Muc2NzcycsICdzb3VyY2UuY3NzLmxlc3MnLCAnc291cmNlLnN0eWx1cyddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnQGltcG9ydFtcXFxcKHxcXFxccytdP1tcXCdcIl0nIC8vIEBpbXBvcnQgJ2Zvbycgb3IgQGltcG9ydCgnZm9vJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnc2FzcycsICdzY3NzJywgJ2NzcyddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWycoLyk/XyhbXi9dKj8pJCcsICckMSQyJ10gLy8gZGlyMS9fZGlyMi9fZmlsZS5zYXNzID0+IGRpcjEvX2RpcjIvZmlsZS5zYXNzXG4gICAgXVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5jc3MnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ0BpbXBvcnRcXFxccytbXFwnXCJdPycsIC8vIEBpbXBvcnQgJ2Zvby5jc3MnXG4gICAgICAnQGltcG9ydFxcXFxzK3VybFxcXFwoW1xcJ1wiXT8nIC8vIEBpbXBvcnQgdXJsKCdmb28uY3NzJylcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsnY3NzJ10sXG4gICAgcmVsYXRpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UuY3NzJywgJ3NvdXJjZS5zYXNzJywgJ3NvdXJjZS5jc3MubGVzcycsICdzb3VyY2UuY3NzLnNjc3MnLCAnc291cmNlLnN0eWx1cyddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAndXJsXFxcXChbXFwnXCJdPydcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsncG5nJywgJ2dpZicsICdqcGVnJywgJ2pwZycsICd3b2ZmJywgJ3R0ZicsICdzdmcnLCAnb3RmJ10sXG4gICAgcmVsYXRpdmU6IHRydWVcbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UuYycsICdzb3VyY2UuY3BwJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdeXFxcXHMqI2luY2x1ZGVcXFxccytbXFwnXCJdJ1xuICAgIF0sXG4gICAgZXh0ZW5zaW9uczogWydoJywgJ2hwcCddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIGluY2x1ZGVDdXJyZW50RGlyZWN0b3J5OiBmYWxzZVxuICB9LFxuICB7XG4gICAgc2NvcGVzOiBbJ3NvdXJjZS5sdWEnXSxcbiAgICBwcmVmaXhlczogW1xuICAgICAgJ3JlcXVpcmVbXFxcXHMrfFxcXFwoXVtcXCdcIl0nXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ2x1YSddLFxuICAgIHJlbGF0aXZlOiB0cnVlLFxuICAgIGluY2x1ZGVDdXJyZW50RGlyZWN0b3J5OiBmYWxzZSxcbiAgICByZXBsYWNlT25JbnNlcnQ6IFtcbiAgICAgIFsnXFxcXC8nLCAnLiddLFxuICAgICAgWydcXFxcXFxcXCcsICcuJ10sXG4gICAgICBbJ1xcXFwubHVhJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UucnVieSddLFxuICAgIHByZWZpeGVzOiBbXG4gICAgICAnXlxcXFxzKnJlcXVpcmVbXFxcXHMrfFxcXFwoXVtcXCdcIl0nXG4gICAgXSxcbiAgICBleHRlbnNpb25zOiBbJ3JiJ10sXG4gICAgcmVsYXRpdmU6IHRydWUsXG4gICAgaW5jbHVkZUN1cnJlbnREaXJlY3Rvcnk6IGZhbHNlLFxuICAgIHJlcGxhY2VPbkluc2VydDogW1xuICAgICAgWydcXFxcLnJiJCcsICcnXVxuICAgIF1cbiAgfSxcbiAge1xuICAgIHNjb3BlczogWydzb3VyY2UucHl0aG9uJ10sXG4gICAgcHJlZml4ZXM6IFtcbiAgICAgICdeXFxcXHMqZnJvbVxcXFxzKycsXG4gICAgICAnXlxcXFxzKmltcG9ydFxcXFxzKydcbiAgICBdLFxuICAgIGV4dGVuc2lvbnM6IFsncHknXSxcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBpbmNsdWRlQ3VycmVudERpcmVjdG9yeTogZmFsc2UsXG4gICAgcmVwbGFjZU9uSW5zZXJ0OiBbXG4gICAgICBbJ1xcXFwvJywgJy4nXSxcbiAgICAgIFsnXFxcXFxcXFwnLCAnLiddLFxuICAgICAgWydcXFxcLnB5JCcsICcnXVxuICAgIF1cbiAgfVxuXVxuIl19