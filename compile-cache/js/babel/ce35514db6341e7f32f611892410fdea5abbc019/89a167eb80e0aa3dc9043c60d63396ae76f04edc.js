Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _optionScopes = require('./option-scopes');

var _optionScopes2 = _interopRequireDefault(_optionScopes);

'use babel';

var options = {
  normalizeSlashes: {
    type: 'boolean',
    description: 'Replaces backward slashes with forward slashes on windows (if possible)',
    'default': true
  },
  maxFileCount: {
    type: 'number',
    description: 'The maximum amount of files to be handled',
    'default': 2000
  },
  suggestionPriority: {
    type: 'number',
    description: 'Suggestion priority of this provider. If set to a number larger than or equal to 1, suggestions will be displayed on top of default suggestions.',
    'default': 2
  },
  ignoredNames: {
    type: 'boolean',
    'default': true,
    description: 'Ignore items matched by the `Ignore Names` core option.'
  },
  ignoreSubmodules: {
    type: 'boolean',
    'default': false,
    description: 'Ignore submodule directories.'
  },
  ignoredPatterns: {
    type: 'array',
    'default': [],
    items: {
      type: 'string'
    },
    description: 'Ignore additional file path patterns.'
  },
  ignoreBuiltinScopes: {
    type: 'boolean',
    'default': false,
    description: 'Ignore built-in scopes and use only scopes from user configuration.'
  },
  scopes: {
    type: 'array',
    'default': [],
    items: {
      type: 'object',
      properties: {
        scopes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        prefixes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        extensions: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        relative: {
          type: 'boolean',
          'default': true
        },
        replaceOnInsert: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: ['string', 'string']
            }
          }
        }
      }
    }
  }
};

for (var key in _optionScopes2['default']) {
  options[key] = {
    type: 'boolean',
    'default': false
  };
}

exports['default'] = options;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1wYXRocy9saWIvY29uZmlnL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs0QkFFeUIsaUJBQWlCOzs7O0FBRjFDLFdBQVcsQ0FBQTs7QUFJWCxJQUFNLE9BQU8sR0FBRztBQUNkLGtCQUFnQixFQUFFO0FBQ2hCLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBVyxFQUFFLHlFQUF5RTtBQUN0RixlQUFTLElBQUk7R0FDZDtBQUNELGNBQVksRUFBRTtBQUNaLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBVyxFQUFFLDJDQUEyQztBQUN4RCxlQUFTLElBQUk7R0FDZDtBQUNELG9CQUFrQixFQUFFO0FBQ2xCLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBVyxFQUFFLGtKQUFrSjtBQUMvSixlQUFTLENBQUM7R0FDWDtBQUNELGNBQVksRUFBRTtBQUNaLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsZUFBVyxFQUFFLHlEQUF5RDtHQUN2RTtBQUNELGtCQUFnQixFQUFFO0FBQ2hCLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsZUFBVyxFQUFFLCtCQUErQjtHQUM3QztBQUNELGlCQUFlLEVBQUU7QUFDZixRQUFJLEVBQUUsT0FBTztBQUNiLGVBQVMsRUFBRTtBQUNYLFNBQUssRUFBRTtBQUNMLFVBQUksRUFBRSxRQUFRO0tBQ2Y7QUFDRCxlQUFXLEVBQUUsdUNBQXVDO0dBQ3JEO0FBQ0QscUJBQW1CLEVBQUU7QUFDbkIsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxlQUFXLEVBQUUscUVBQXFFO0dBQ25GO0FBQ0QsUUFBTSxFQUFFO0FBQ04sUUFBSSxFQUFFLE9BQU87QUFDYixlQUFTLEVBQUU7QUFDWCxTQUFLLEVBQUU7QUFDTCxVQUFJLEVBQUUsUUFBUTtBQUNkLGdCQUFVLEVBQUU7QUFDVixjQUFNLEVBQUU7QUFDTixjQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7QUFDZixlQUFLLEVBQUU7QUFDTCxnQkFBSSxFQUFFLFFBQVE7V0FDZjtTQUNGO0FBQ0QsZ0JBQVEsRUFBRTtBQUNSLGNBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztBQUNmLGVBQUssRUFBRTtBQUNMLGdCQUFJLEVBQUUsUUFBUTtXQUNmO1NBQ0Y7QUFDRCxrQkFBVSxFQUFFO0FBQ1YsY0FBSSxFQUFFLENBQUMsT0FBTyxDQUFDO0FBQ2YsZUFBSyxFQUFFO0FBQ0wsZ0JBQUksRUFBRSxRQUFRO1dBQ2Y7U0FDRjtBQUNELGdCQUFRLEVBQUU7QUFDUixjQUFJLEVBQUUsU0FBUztBQUNmLHFCQUFTLElBQUk7U0FDZDtBQUNELHVCQUFlLEVBQUU7QUFDZixjQUFJLEVBQUUsT0FBTztBQUNiLGVBQUssRUFBRTtBQUNMLGdCQUFJLEVBQUUsT0FBTztBQUNiLGlCQUFLLEVBQUU7QUFDTCxrQkFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQzthQUMzQjtXQUNGO1NBQ0Y7T0FDRjtLQUNGO0dBQ0Y7Q0FDRixDQUFBOztBQUVELEtBQUssSUFBSSxHQUFHLCtCQUFrQjtBQUM1QixTQUFPLENBQUMsR0FBRyxDQUFDLEdBQUc7QUFDYixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztHQUNmLENBQUE7Q0FDRjs7cUJBRWMsT0FBTyIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcGF0aHMvbGliL2NvbmZpZy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBPcHRpb25TY29wZXMgZnJvbSAnLi9vcHRpb24tc2NvcGVzJ1xuXG5jb25zdCBvcHRpb25zID0ge1xuICBub3JtYWxpemVTbGFzaGVzOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlc2NyaXB0aW9uOiAnUmVwbGFjZXMgYmFja3dhcmQgc2xhc2hlcyB3aXRoIGZvcndhcmQgc2xhc2hlcyBvbiB3aW5kb3dzIChpZiBwb3NzaWJsZSknLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcbiAgbWF4RmlsZUNvdW50OiB7XG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVzY3JpcHRpb246ICdUaGUgbWF4aW11bSBhbW91bnQgb2YgZmlsZXMgdG8gYmUgaGFuZGxlZCcsXG4gICAgZGVmYXVsdDogMjAwMFxuICB9LFxuICBzdWdnZXN0aW9uUHJpb3JpdHk6IHtcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICBkZXNjcmlwdGlvbjogJ1N1Z2dlc3Rpb24gcHJpb3JpdHkgb2YgdGhpcyBwcm92aWRlci4gSWYgc2V0IHRvIGEgbnVtYmVyIGxhcmdlciB0aGFuIG9yIGVxdWFsIHRvIDEsIHN1Z2dlc3Rpb25zIHdpbGwgYmUgZGlzcGxheWVkIG9uIHRvcCBvZiBkZWZhdWx0IHN1Z2dlc3Rpb25zLicsXG4gICAgZGVmYXVsdDogMlxuICB9LFxuICBpZ25vcmVkTmFtZXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBkZXNjcmlwdGlvbjogJ0lnbm9yZSBpdGVtcyBtYXRjaGVkIGJ5IHRoZSBgSWdub3JlIE5hbWVzYCBjb3JlIG9wdGlvbi4nXG4gIH0sXG4gIGlnbm9yZVN1Ym1vZHVsZXM6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgZGVzY3JpcHRpb246ICdJZ25vcmUgc3VibW9kdWxlIGRpcmVjdG9yaWVzLidcbiAgfSxcbiAgaWdub3JlZFBhdHRlcm5zOiB7XG4gICAgdHlwZTogJ2FycmF5JyxcbiAgICBkZWZhdWx0OiBbXSxcbiAgICBpdGVtczoge1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICB9LFxuICAgIGRlc2NyaXB0aW9uOiAnSWdub3JlIGFkZGl0aW9uYWwgZmlsZSBwYXRoIHBhdHRlcm5zLidcbiAgfSxcbiAgaWdub3JlQnVpbHRpblNjb3Blczoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBkZXNjcmlwdGlvbjogJ0lnbm9yZSBidWlsdC1pbiBzY29wZXMgYW5kIHVzZSBvbmx5IHNjb3BlcyBmcm9tIHVzZXIgY29uZmlndXJhdGlvbi4nXG4gIH0sXG4gIHNjb3Blczoge1xuICAgIHR5cGU6ICdhcnJheScsXG4gICAgZGVmYXVsdDogW10sXG4gICAgaXRlbXM6IHtcbiAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzY29wZXM6IHtcbiAgICAgICAgICB0eXBlOiBbJ2FycmF5J10sXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwcmVmaXhlczoge1xuICAgICAgICAgIHR5cGU6IFsnYXJyYXknXSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGV4dGVuc2lvbnM6IHtcbiAgICAgICAgICB0eXBlOiBbJ2FycmF5J10sXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZWxhdGl2ZToge1xuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHJlcGxhY2VPbkluc2VydDoge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiBbJ3N0cmluZycsICdzdHJpbmcnXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mb3IgKGxldCBrZXkgaW4gT3B0aW9uU2NvcGVzKSB7XG4gIG9wdGlvbnNba2V5XSA9IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvcHRpb25zXG4iXX0=