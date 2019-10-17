'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  excludeLowerPriorityProviders: {

    title: 'Exclude lower priority providers',
    description: 'Whether to exclude lower priority providers (e.g. autocomplete-paths)',
    type: 'boolean',
    'default': false,
    order: 0
  },
  guess: {

    title: 'Guess',
    description: 'When completing a property and no completions are found, Tern will use some heuristics to try and return some properties anyway. Set this to false to turn that off.',
    type: 'boolean',
    'default': true,
    order: 1
  },
  sort: {

    title: 'Sort',
    description: 'Determines whether the result set will be sorted.',
    type: 'boolean',
    'default': true,
    order: 2
  },
  caseInsensitive: {

    title: 'Case-insensitive',
    description: 'Whether to use a case-insensitive compare between the current word and potential completions.',
    type: 'boolean',
    'default': true,
    order: 3
  },
  useSnippets: {

    title: 'Use autocomplete-snippets',
    description: 'Adds snippets to autocomplete+ suggestions',
    type: 'boolean',
    'default': false,
    order: 4
  },
  snippetsFirst: {

    title: 'Display snippets above',
    description: 'Displays snippets above tern suggestions. Requires a restart.',
    type: 'boolean',
    'default': false,
    order: 5
  },
  useSnippetsAndFunction: {

    title: 'Display both, autocomplete-snippets and function name',
    description: 'Choose to just complete the function name or expand the snippet',
    type: 'boolean',
    'default': false,
    order: 6
  },
  inlineFnCompletion: {

    title: 'Display inline suggestions for function params',
    description: 'Displays a inline suggestion located right next to the current cursor',
    type: 'boolean',
    'default': true,
    order: 7
  },
  inlineFnCompletionDocumentation: {

    title: 'Display inline suggestions with additional documentation (if any)',
    description: 'Adds documentation to the inline function completion',
    type: 'boolean',
    'default': false,
    order: 8
  },
  documentation: {

    title: 'Documentation',
    description: 'Whether to include documentation string (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 9
  },
  urls: {

    title: 'Url',
    description: 'Whether to include documentation urls (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 10
  },
  origins: {

    title: 'Origin',
    description: 'Whether to include origins (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 11
  },
  ternServerGetFileAsync: {

    title: 'Tern Server getFile async',
    description: 'Indicates whether getFile is asynchronous. Default is true. Requires a restart.',
    type: 'boolean',
    'default': true,
    order: 12
  },
  ternServerDependencyBudget: {

    title: 'Tern Server dependency-budget',
    description: 'http://ternjs.net/doc/manual.html#dependency_budget. Requires a restart.',
    type: 'number',
    'default': 20000,
    order: 13
  },
  debug: {

    title: 'Debug',
    description: 'Display debug information in console.',
    type: 'boolean',
    'default': true,
    order: 14
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRzs7QUFFYiwrQkFBNkIsRUFBRTs7QUFFN0IsU0FBSyxFQUFFLGtDQUFrQztBQUN6QyxlQUFXLEVBQUUsdUVBQXVFO0FBQ3BGLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELE9BQUssRUFBRTs7QUFFTCxTQUFLLEVBQUUsT0FBTztBQUNkLGVBQVcsRUFBRSxzS0FBc0s7QUFDbkwsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsTUFBSSxFQUFFOztBQUVKLFNBQUssRUFBRSxNQUFNO0FBQ2IsZUFBVyxFQUFFLG1EQUFtRDtBQUNoRSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxpQkFBZSxFQUFFOztBQUVmLFNBQUssRUFBRSxrQkFBa0I7QUFDekIsZUFBVyxFQUFFLCtGQUErRjtBQUM1RyxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxhQUFXLEVBQUU7O0FBRVgsU0FBSyxFQUFFLDJCQUEyQjtBQUNsQyxlQUFXLEVBQUUsNENBQTRDO0FBQ3pELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGVBQWEsRUFBRTs7QUFFYixTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcsRUFBRSwrREFBK0Q7QUFDNUUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0Qsd0JBQXNCLEVBQUU7O0FBRXRCLFNBQUssRUFBRSx1REFBdUQ7QUFDOUQsZUFBVyxFQUFFLGlFQUFpRTtBQUM5RSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxvQkFBa0IsRUFBRTs7QUFFbEIsU0FBSyxFQUFFLGdEQUFnRDtBQUN2RCxlQUFXLEVBQUUsdUVBQXVFO0FBQ3BGLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGlDQUErQixFQUFFOztBQUUvQixTQUFLLEVBQUUsbUVBQW1FO0FBQzFFLGVBQVcsRUFBRSxzREFBc0Q7QUFDbkUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsZUFBYSxFQUFFOztBQUViLFNBQUssRUFBRSxlQUFlO0FBQ3RCLGVBQVcsRUFBRSx3RUFBd0U7QUFDckYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsTUFBSSxFQUFFOztBQUVKLFNBQUssRUFBRSxLQUFLO0FBQ1osZUFBVyxFQUFFLHNFQUFzRTtBQUNuRixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxTQUFPLEVBQUU7O0FBRVAsU0FBSyxFQUFFLFFBQVE7QUFDZixlQUFXLEVBQUUsMkRBQTJEO0FBQ3hFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLEVBQUU7R0FDVjtBQUNELHdCQUFzQixFQUFFOztBQUV0QixTQUFLLEVBQUUsMkJBQTJCO0FBQ2xDLGVBQVcsRUFBRSxpRkFBaUY7QUFDOUYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QsNEJBQTBCLEVBQUU7O0FBRTFCLFNBQUssRUFBRSwrQkFBK0I7QUFDdEMsZUFBVyxFQUFFLDBFQUEwRTtBQUN2RixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxPQUFLLEVBQUU7O0FBRUwsU0FBSyxFQUFFLE9BQU87QUFDZCxlQUFXLEVBQUUsdUNBQXVDO0FBQ3BELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLEVBQUU7R0FDVjtDQUNGIiwiZmlsZSI6Ii9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGV4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzOiB7XG5cbiAgICB0aXRsZTogJ0V4Y2x1ZGUgbG93ZXIgcHJpb3JpdHkgcHJvdmlkZXJzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gZXhjbHVkZSBsb3dlciBwcmlvcml0eSBwcm92aWRlcnMgKGUuZy4gYXV0b2NvbXBsZXRlLXBhdGhzKScsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiAwXG4gIH0sXG4gIGd1ZXNzOiB7XG5cbiAgICB0aXRsZTogJ0d1ZXNzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZW4gY29tcGxldGluZyBhIHByb3BlcnR5IGFuZCBubyBjb21wbGV0aW9ucyBhcmUgZm91bmQsIFRlcm4gd2lsbCB1c2Ugc29tZSBoZXVyaXN0aWNzIHRvIHRyeSBhbmQgcmV0dXJuIHNvbWUgcHJvcGVydGllcyBhbnl3YXkuIFNldCB0aGlzIHRvIGZhbHNlIHRvIHR1cm4gdGhhdCBvZmYuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMVxuICB9LFxuICBzb3J0OiB7XG5cbiAgICB0aXRsZTogJ1NvcnQnLFxuICAgIGRlc2NyaXB0aW9uOiAnRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSByZXN1bHQgc2V0IHdpbGwgYmUgc29ydGVkLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDJcbiAgfSxcbiAgY2FzZUluc2Vuc2l0aXZlOiB7XG5cbiAgICB0aXRsZTogJ0Nhc2UtaW5zZW5zaXRpdmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byB1c2UgYSBjYXNlLWluc2Vuc2l0aXZlIGNvbXBhcmUgYmV0d2VlbiB0aGUgY3VycmVudCB3b3JkIGFuZCBwb3RlbnRpYWwgY29tcGxldGlvbnMuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogM1xuICB9LFxuICB1c2VTbmlwcGV0czoge1xuXG4gICAgdGl0bGU6ICdVc2UgYXV0b2NvbXBsZXRlLXNuaXBwZXRzJyxcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc25pcHBldHMgdG8gYXV0b2NvbXBsZXRlKyBzdWdnZXN0aW9ucycsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiA0XG4gIH0sXG4gIHNuaXBwZXRzRmlyc3Q6IHtcblxuICAgIHRpdGxlOiAnRGlzcGxheSBzbmlwcGV0cyBhYm92ZScsXG4gICAgZGVzY3JpcHRpb246ICdEaXNwbGF5cyBzbmlwcGV0cyBhYm92ZSB0ZXJuIHN1Z2dlc3Rpb25zLiBSZXF1aXJlcyBhIHJlc3RhcnQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDVcbiAgfSxcbiAgdXNlU25pcHBldHNBbmRGdW5jdGlvbjoge1xuXG4gICAgdGl0bGU6ICdEaXNwbGF5IGJvdGgsIGF1dG9jb21wbGV0ZS1zbmlwcGV0cyBhbmQgZnVuY3Rpb24gbmFtZScsXG4gICAgZGVzY3JpcHRpb246ICdDaG9vc2UgdG8ganVzdCBjb21wbGV0ZSB0aGUgZnVuY3Rpb24gbmFtZSBvciBleHBhbmQgdGhlIHNuaXBwZXQnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogNlxuICB9LFxuICBpbmxpbmVGbkNvbXBsZXRpb246IHtcblxuICAgIHRpdGxlOiAnRGlzcGxheSBpbmxpbmUgc3VnZ2VzdGlvbnMgZm9yIGZ1bmN0aW9uIHBhcmFtcycsXG4gICAgZGVzY3JpcHRpb246ICdEaXNwbGF5cyBhIGlubGluZSBzdWdnZXN0aW9uIGxvY2F0ZWQgcmlnaHQgbmV4dCB0byB0aGUgY3VycmVudCBjdXJzb3InLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA3XG4gIH0sXG4gIGlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb246IHtcblxuICAgIHRpdGxlOiAnRGlzcGxheSBpbmxpbmUgc3VnZ2VzdGlvbnMgd2l0aCBhZGRpdGlvbmFsIGRvY3VtZW50YXRpb24gKGlmIGFueSknLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBkb2N1bWVudGF0aW9uIHRvIHRoZSBpbmxpbmUgZnVuY3Rpb24gY29tcGxldGlvbicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiA4XG4gIH0sXG4gIGRvY3VtZW50YXRpb246IHtcblxuICAgIHRpdGxlOiAnRG9jdW1lbnRhdGlvbicsXG4gICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIGluY2x1ZGUgZG9jdW1lbnRhdGlvbiBzdHJpbmcgKGlmIGZvdW5kKSBpbiB0aGUgcmVzdWx0IGRhdGEuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogOVxuICB9LFxuICB1cmxzOiB7XG5cbiAgICB0aXRsZTogJ1VybCcsXG4gICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIGluY2x1ZGUgZG9jdW1lbnRhdGlvbiB1cmxzIChpZiBmb3VuZCkgaW4gdGhlIHJlc3VsdCBkYXRhLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDEwXG4gIH0sXG4gIG9yaWdpbnM6IHtcblxuICAgIHRpdGxlOiAnT3JpZ2luJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gaW5jbHVkZSBvcmlnaW5zIChpZiBmb3VuZCkgaW4gdGhlIHJlc3VsdCBkYXRhLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDExXG4gIH0sXG4gIHRlcm5TZXJ2ZXJHZXRGaWxlQXN5bmM6IHtcblxuICAgIHRpdGxlOiAnVGVybiBTZXJ2ZXIgZ2V0RmlsZSBhc3luYycsXG4gICAgZGVzY3JpcHRpb246ICdJbmRpY2F0ZXMgd2hldGhlciBnZXRGaWxlIGlzIGFzeW5jaHJvbm91cy4gRGVmYXVsdCBpcyB0cnVlLiBSZXF1aXJlcyBhIHJlc3RhcnQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMTJcbiAgfSxcbiAgdGVyblNlcnZlckRlcGVuZGVuY3lCdWRnZXQ6IHtcblxuICAgIHRpdGxlOiAnVGVybiBTZXJ2ZXIgZGVwZW5kZW5jeS1idWRnZXQnLFxuICAgIGRlc2NyaXB0aW9uOiAnaHR0cDovL3Rlcm5qcy5uZXQvZG9jL21hbnVhbC5odG1sI2RlcGVuZGVuY3lfYnVkZ2V0LiBSZXF1aXJlcyBhIHJlc3RhcnQuJyxcbiAgICB0eXBlOiAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiAyMDAwMCxcbiAgICBvcmRlcjogMTNcbiAgfSxcbiAgZGVidWc6IHtcblxuICAgIHRpdGxlOiAnRGVidWcnLFxuICAgIGRlc2NyaXB0aW9uOiAnRGlzcGxheSBkZWJ1ZyBpbmZvcm1hdGlvbiBpbiBjb25zb2xlLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDE0XG4gIH0sXG59O1xuIl19