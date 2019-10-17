'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var defaultProjectConfig = {

  ecmaVersion: 8,
  libs: [],
  loadEagerly: [],
  dontLoad: ['node_modules/**'],
  plugins: {

    doc_comment: true
  }
};

exports.defaultProjectConfig = defaultProjectConfig;
var defaultServerConfig = {

  ecmaVersion: 8,
  libs: [],
  loadEagerly: [],
  dontLoad: ['node_modules/**'],
  plugins: {

    doc_comment: true
  },
  dependencyBudget: 20000,
  ecmaScript: true
};

exports.defaultServerConfig = defaultServerConfig;
var ecmaVersions = [5, 6, 7, 8];

exports.ecmaVersions = ecmaVersions;
var availableLibs = ['browser', 'chai', 'jquery', 'react', 'underscore'];

exports.availableLibs = availableLibs;
var availablePlugins = {

  complete_strings: {

    maxLength: 15
  },
  doc_comment: {

    fullDocs: true,
    strong: false
  },
  node: {

    dontLoad: '',
    load: '',
    modules: ''
  },
  node_resolve: {},
  modules: {

    dontLoad: '',
    load: '',
    modules: ''
  },
  es_modules: {},
  angular: {},
  requirejs: {

    baseURL: '',
    paths: '',
    override: ''
  },
  commonjs: {}
};
exports.availablePlugins = availablePlugins;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2NvbmZpZy90ZXJuLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O0FBRUwsSUFBTSxvQkFBb0IsR0FBRzs7QUFFbEMsYUFBVyxFQUFFLENBQUM7QUFDZCxNQUFJLEVBQUUsRUFBRTtBQUNSLGFBQVcsRUFBRSxFQUFFO0FBQ2YsVUFBUSxFQUFFLENBQ1IsaUJBQWlCLENBQ2xCO0FBQ0QsU0FBTyxFQUFFOztBQUVQLGVBQVcsRUFBRSxJQUFJO0dBQ2xCO0NBQ0YsQ0FBQzs7O0FBRUssSUFBTSxtQkFBbUIsR0FBRzs7QUFFakMsYUFBVyxFQUFFLENBQUM7QUFDZCxNQUFJLEVBQUUsRUFBRTtBQUNSLGFBQVcsRUFBRSxFQUFFO0FBQ2YsVUFBUSxFQUFFLENBQ1IsaUJBQWlCLENBQ2xCO0FBQ0QsU0FBTyxFQUFFOztBQUVQLGVBQVcsRUFBRSxJQUFJO0dBQ2xCO0FBQ0Qsa0JBQWdCLEVBQUUsS0FBSztBQUN2QixZQUFVLEVBQUUsSUFBSTtDQUNqQixDQUFDOzs7QUFFSyxJQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7QUFFbEMsSUFBTSxhQUFhLEdBQUcsQ0FFM0IsU0FBUyxFQUNULE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLFlBQVksQ0FDYixDQUFDOzs7QUFFSyxJQUFNLGdCQUFnQixHQUFHOztBQUU5QixrQkFBZ0IsRUFBRTs7QUFFaEIsYUFBUyxFQUFFLEVBQUU7R0FDZDtBQUNELGFBQVcsRUFBRTs7QUFFWCxZQUFRLEVBQUUsSUFBSTtBQUNkLFVBQU0sRUFBRSxLQUFLO0dBQ2Q7QUFDRCxNQUFJLEVBQUU7O0FBRUosWUFBUSxFQUFFLEVBQUU7QUFDWixRQUFJLEVBQUUsRUFBRTtBQUNSLFdBQU8sRUFBRSxFQUFFO0dBQ1o7QUFDRCxjQUFZLEVBQUUsRUFBRTtBQUNoQixTQUFPLEVBQUU7O0FBRVAsWUFBUSxFQUFFLEVBQUU7QUFDWixRQUFJLEVBQUUsRUFBRTtBQUNSLFdBQU8sRUFBRSxFQUFFO0dBQ1o7QUFDRCxZQUFVLEVBQUUsRUFBRTtBQUNkLFNBQU8sRUFBRSxFQUFFO0FBQ1gsV0FBUyxFQUFFOztBQUVULFdBQU8sRUFBRSxFQUFFO0FBQ1gsU0FBSyxFQUFFLEVBQUU7QUFDVCxZQUFRLEVBQUUsRUFBRTtHQUNiO0FBQ0QsVUFBUSxFQUFFLEVBQUU7Q0FDYixDQUFDIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2NvbmZpZy90ZXJuLWNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdFByb2plY3RDb25maWcgPSB7XG5cbiAgZWNtYVZlcnNpb246IDgsXG4gIGxpYnM6IFtdLFxuICBsb2FkRWFnZXJseTogW10sXG4gIGRvbnRMb2FkOiBbXG4gICAgJ25vZGVfbW9kdWxlcy8qKidcbiAgXSxcbiAgcGx1Z2luczoge1xuXG4gICAgZG9jX2NvbW1lbnQ6IHRydWVcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRTZXJ2ZXJDb25maWcgPSB7XG5cbiAgZWNtYVZlcnNpb246IDgsXG4gIGxpYnM6IFtdLFxuICBsb2FkRWFnZXJseTogW10sXG4gIGRvbnRMb2FkOiBbXG4gICAgJ25vZGVfbW9kdWxlcy8qKidcbiAgXSxcbiAgcGx1Z2luczoge1xuXG4gICAgZG9jX2NvbW1lbnQ6IHRydWVcbiAgfSxcbiAgZGVwZW5kZW5jeUJ1ZGdldDogMjAwMDAsXG4gIGVjbWFTY3JpcHQ6IHRydWVcbn07XG5cbmV4cG9ydCBjb25zdCBlY21hVmVyc2lvbnMgPSBbNSwgNiwgNywgOF07XG5cbmV4cG9ydCBjb25zdCBhdmFpbGFibGVMaWJzID0gW1xuXG4gICdicm93c2VyJyxcbiAgJ2NoYWknLFxuICAnanF1ZXJ5JyxcbiAgJ3JlYWN0JyxcbiAgJ3VuZGVyc2NvcmUnXG5dO1xuXG5leHBvcnQgY29uc3QgYXZhaWxhYmxlUGx1Z2lucyA9IHtcblxuICBjb21wbGV0ZV9zdHJpbmdzOiB7XG5cbiAgICBtYXhMZW5ndGg6IDE1XG4gIH0sXG4gIGRvY19jb21tZW50OiB7XG5cbiAgICBmdWxsRG9jczogdHJ1ZSxcbiAgICBzdHJvbmc6IGZhbHNlXG4gIH0sXG4gIG5vZGU6IHtcblxuICAgIGRvbnRMb2FkOiAnJyxcbiAgICBsb2FkOiAnJyxcbiAgICBtb2R1bGVzOiAnJ1xuICB9LFxuICBub2RlX3Jlc29sdmU6IHt9LFxuICBtb2R1bGVzOiB7XG5cbiAgICBkb250TG9hZDogJycsXG4gICAgbG9hZDogJycsXG4gICAgbW9kdWxlczogJydcbiAgfSxcbiAgZXNfbW9kdWxlczoge30sXG4gIGFuZ3VsYXI6IHt9LFxuICByZXF1aXJlanM6IHtcblxuICAgIGJhc2VVUkw6ICcnLFxuICAgIHBhdGhzOiAnJyxcbiAgICBvdmVycmlkZTogJydcbiAgfSxcbiAgY29tbW9uanM6IHt9XG59O1xuIl19