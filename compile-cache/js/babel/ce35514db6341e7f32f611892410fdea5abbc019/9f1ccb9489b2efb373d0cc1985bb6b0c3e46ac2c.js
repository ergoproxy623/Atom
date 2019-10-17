Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _configTernConfigDocs = require('../../config/tern-config-docs');

var _configTernConfigDocs2 = _interopRequireDefault(_configTernConfigDocs);

var _configTernPluginsDefintionsJs = require('../../config/tern-plugins-defintions.js');

var _configTernPluginsDefintionsJs2 = _interopRequireDefault(_configTernPluginsDefintionsJs);

var _configTernConfig = require('../../config/tern-config');

'use babel';

var templateContainer = '\n\n  <div>\n    <h1 class="title"></h1>\n    <div class="content"></div>\n    <button class="btn btn-default">Save &amp; Restart Server</button>\n  </div>\n';

var createView = function createView(model) {

  return new ConfigView(model).init();
};

exports.createView = createView;

var ConfigView = (function () {
  function ConfigView(model) {
    _classCallCheck(this, ConfigView);

    this.setModel(model);
    model.gatherData();
  }

  _createClass(ConfigView, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var projectDir = this.model.getProjectDir();

      this.el = document.createElement('div');
      this.el.classList.add('atom-ternjs-config');
      this.el.innerHTML = templateContainer;

      var elContent = this.el.querySelector('.content');
      var elTitle = this.el.querySelector('.title');
      elTitle.innerHTML = projectDir;

      var buttonSave = this.el.querySelector('button');

      buttonSave.addEventListener('click', function (e) {

        _this.model.updateConfig();
      });

      var sectionEcmaVersion = this.renderSection('ecmaVersion');
      var ecmaVersions = this.renderRadio();
      ecmaVersions.forEach(function (ecmaVersion) {
        return sectionEcmaVersion.appendChild(ecmaVersion);
      });
      elContent.appendChild(sectionEcmaVersion);

      var sectionLibs = this.renderSection('libs');
      var libs = this.renderlibs();
      libs.forEach(function (lib) {
        return sectionLibs.appendChild(lib);
      });
      elContent.appendChild(sectionLibs);

      elContent.appendChild(this.renderEditors('loadEagerly', this.model.config.loadEagerly));
      elContent.appendChild(this.renderEditors('dontLoad', this.model.config.dontLoad));

      var sectionPlugins = this.renderSection('plugins');
      var plugins = this.renderPlugins();
      plugins.forEach(function (plugin) {
        return sectionPlugins.appendChild(plugin);
      });
      elContent.appendChild(sectionPlugins);

      return this.el;
    }
  }, {
    key: 'renderSection',
    value: function renderSection(title) {

      var section = document.createElement('section');
      section.classList.add(title);

      var header = document.createElement('h2');
      header.innerHTML = title;

      section.appendChild(header);

      var docs = _configTernConfigDocs2['default'][title].doc;

      if (docs) {

        var doc = document.createElement('p');
        doc.innerHTML = docs;

        section.appendChild(doc);
      }

      return section;
    }
  }, {
    key: 'renderRadio',
    value: function renderRadio() {
      var _this2 = this;

      return _configTernConfig.ecmaVersions.map(function (ecmaVersion) {

        var inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');

        var label = document.createElement('span');
        label.innerHTML = 'ecmaVersion ' + ecmaVersion;

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ecmaVersions';
        radio.value = ecmaVersion;
        radio.checked = parseInt(_this2.model.config.ecmaVersion) === ecmaVersion;

        radio.addEventListener('change', function (e) {

          _this2.model.setEcmaVersion(e.target.value);
        }, false);

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(radio);

        return inputWrapper;
      });
    }
  }, {
    key: 'renderEditors',
    value: function renderEditors(identifier) {
      var _this3 = this;

      var paths = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

      var section = this.renderSection(identifier);

      paths.forEach(function (path) {

        section.appendChild(_this3.createInputWrapper(path, identifier));
      });

      section.appendChild(this.createInputWrapper(null, identifier));

      return section;
    }
  }, {
    key: 'renderPlugins',
    value: function renderPlugins() {
      var _this4 = this;

      var plugins = Object.keys(this.model.config.plugins);
      var availablePluginsKeys = Object.keys(_configTernConfig.availablePlugins);
      var unknownPlugins = plugins.filter(function (plugin) {

        return !_configTernConfig.availablePlugins[plugin] ? true : false;
      });

      return availablePluginsKeys.map(function (plugin) {
        return _this4.renderPlugin(plugin);
      }).concat(unknownPlugins.map(function (plugin) {
        return _this4.renderPlugin(plugin);
      }));
    }
  }, {
    key: 'renderPlugin',
    value: function renderPlugin(plugin) {

      var wrapper = document.createElement('p');

      wrapper.appendChild(this.buildBoolean(plugin, 'plugin', this.model.config.plugins[plugin]));

      var doc = document.createElement('span');
      doc.innerHTML = _configTernPluginsDefintionsJs2['default'][plugin] && _configTernPluginsDefintionsJs2['default'][plugin].doc;

      wrapper.appendChild(doc);

      return wrapper;
    }
  }, {
    key: 'renderlibs',
    value: function renderlibs() {
      var _this5 = this;

      return _configTernConfig.availableLibs.map(function (lib) {

        return _this5.buildBoolean(lib, 'lib', _this5.model.config.libs.includes(lib));
      });
    }
  }, {
    key: 'buildBoolean',
    value: function buildBoolean(key, type, checked) {
      var _this6 = this;

      var inputWrapper = document.createElement('div');
      var label = document.createElement('span');
      var checkbox = document.createElement('input');

      inputWrapper.classList.add('input-wrapper');
      label.innerHTML = key;
      checkbox.type = 'checkbox';
      checkbox.value = key;
      checkbox.checked = checked;

      checkbox.addEventListener('change', function (e) {

        switch (type) {

          case 'lib':
            {

              e.target.checked ? _this6.model.addLib(key) : _this6.model.removeLib(key);
            }break;

          case 'plugin':
            {

              e.target.checked ? _this6.model.addPlugin(key) : _this6.model.removePlugin(key);
            }
        }
      }, false);

      inputWrapper.appendChild(label);
      inputWrapper.appendChild(checkbox);

      return inputWrapper;
    }
  }, {
    key: 'createInputWrapper',
    value: function createInputWrapper(path, identifier) {

      var inputWrapper = document.createElement('div');
      var editor = this.createTextEditor(path, identifier);

      inputWrapper.classList.add('input-wrapper');
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(identifier));
      inputWrapper.appendChild(this.createSub(editor));

      return inputWrapper;
    }
  }, {
    key: 'createSub',
    value: function createSub(editor) {
      var _this7 = this;

      var sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');

      sub.addEventListener('click', function (e) {

        _this7.model.removeEditor(editor);
        var inputWrapper = e.target.closest('.input-wrapper');
        inputWrapper.parentNode.removeChild(inputWrapper);
      }, false);

      return sub;
    }
  }, {
    key: 'createAdd',
    value: function createAdd(identifier) {
      var _this8 = this;

      var add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', function (e) {

        e.target.closest('section').appendChild(_this8.createInputWrapper(null, identifier));
      }, false);

      return add;
    }
  }, {
    key: 'createTextEditor',
    value: function createTextEditor(path, identifier) {

      var editor = document.createElement('atom-text-editor');
      editor.setAttribute('mini', true);

      if (path) {

        editor.getModel().getBuffer().setText(path);
      }

      this.model.editors.push({

        identifier: identifier,
        ref: editor
      });

      return editor;
    }
  }, {
    key: 'getModel',
    value: function getModel() {

      return this.model;
    }
  }, {
    key: 'setModel',
    value: function setModel(model) {

      this.model = model;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.el.remove();
    }
  }]);

  return ConfigView;
})();

exports['default'] = ConfigView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi92aWV3cy9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQ0FFMkIsK0JBQStCOzs7OzZDQUM1Qix5Q0FBeUM7Ozs7Z0NBTWhFLDBCQUEwQjs7QUFUakMsV0FBVyxDQUFDOztBQVdaLElBQU0saUJBQWlCLGtLQU90QixDQUFDOztBQUVLLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLEtBQUssRUFBSzs7QUFFbkMsU0FBTyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztDQUNyQyxDQUFDOzs7O0lBRW1CLFVBQVU7QUFFbEIsV0FGUSxVQUFVLENBRWpCLEtBQUssRUFBRTswQkFGQSxVQUFVOztBQUkzQixRQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLFNBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNwQjs7ZUFOa0IsVUFBVTs7V0FRekIsZ0JBQUc7OztBQUVMLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRTlDLFVBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQzs7QUFFdEMsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsYUFBTyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7O0FBRS9CLFVBQU0s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LENBQUMsQ0FBQzs7QUFFVixhQUFPLEdBQUcsQ0FBQztLQUNaOzs7V0FFZSwwQkFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFOztBQUVqQyxVQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUQsWUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRWxDLFVBQUksSUFBSSxFQUFFOztBQUVSLGNBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDN0M7O0FBRUQsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDOztBQUV0QixrQkFBVSxFQUFWLFVBQVU7QUFDVixXQUFHLEVBQUUsTUFBTTtPQUNaLENBQUMsQ0FBQzs7QUFFSCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFTyxvQkFBRzs7QUFFVCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkI7OztXQUVPLGtCQUFDLEtBQUssRUFBRTs7QUFFZCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRU0sbUJBQUc7O0FBRVIsVUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNsQjs7O1NBclJrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvdmlld3MvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB0ZXJuQ29uZmlnRG9jcyBmcm9tICcuLi8uLi9jb25maWcvdGVybi1jb25maWctZG9jcyc7XG5pbXBvcnQgcGx1Z2luRGVmaW5pdGlvbnMgZnJvbSAnLi4vLi4vY29uZmlnL3Rlcm4tcGx1Z2lucy1kZWZpbnRpb25zLmpzJztcblxuaW1wb3J0IHtcbiAgZWNtYVZlcnNpb25zLFxuICBhdmFpbGFibGVMaWJzLFxuICBhdmFpbGFibGVQbHVnaW5zXG59IGZyb20gJy4uLy4uL2NvbmZpZy90ZXJuLWNvbmZpZyc7XG5cbmNvbnN0IHRlbXBsYXRlQ29udGFpbmVyID0gYFxuXG4gIDxkaXY+XG4gICAgPGgxIGNsYXNzPVwidGl0bGVcIj48L2gxPlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+PC9kaXY+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPlNhdmUgJmFtcDsgUmVzdGFydCBTZXJ2ZXI8L2J1dHRvbj5cbiAgPC9kaXY+XG5gO1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVmlldyA9IChtb2RlbCkgPT4ge1xuXG4gIHJldHVybiBuZXcgQ29uZmlnVmlldyhtb2RlbCkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uZmlnVmlldyB7XG5cbiAgY29uc3RydWN0b3IobW9kZWwpIHtcblxuICAgIHRoaXMuc2V0TW9kZWwobW9kZWwpO1xuICAgIG1vZGVsLmdhdGhlckRhdGEoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG5cbiAgICBjb25zdCBwcm9qZWN0RGlyID0gdGhpcy5tb2RlbC5nZXRQcm9qZWN0RGlyKCk7XG5cbiAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1jb25maWcnKTtcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRlbXBsYXRlQ29udGFpbmVyO1xuXG4gICAgY29uc3QgZWxDb250ZW50ID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpO1xuICAgIGNvbnN0IGVsVGl0bGUgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xuICAgIGVsVGl0bGUuaW5uZXJIVE1MID0gcHJvamVjdERpcjtcblxuICAgIGNvbnN0IGJ1dHRvblNhdmUgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpO1xuXG4gICAgYnV0dG9uU2F2ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMubW9kZWwudXBkYXRlQ29uZmlnKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWN0aW9uRWNtYVZlcnNpb24gPSB0aGlzLnJlbmRlclNlY3Rpb24oJ2VjbWFWZXJzaW9uJyk7XG4gICAgY29uc3QgZWNtYVZlcnNpb25zID0gdGhpcy5yZW5kZXJSYWRpbygpO1xuICAgIGVjbWFWZXJzaW9ucy5mb3JFYWNoKGVjbWFWZXJzaW9uID0+IHNlY3Rpb25FY21hVmVyc2lvbi5hcHBlbmRDaGlsZChlY21hVmVyc2lvbikpO1xuICAgIGVsQ29udGVudC5hcHBlbmRDaGlsZChzZWN0aW9uRWNtYVZlcnNpb24pO1xuXG4gICAgY29uc3Qgc2VjdGlvbkxpYnMgPSB0aGlzLnJlbmRlclNlY3Rpb24oJ2xpYnMnKTtcbiAgICBjb25zdCBsaWJzID0gdGhpcy5yZW5kZXJsaWJzKCk7XG4gICAgbGlicy5mb3JFYWNoKGxpYiA9PiBzZWN0aW9uTGlicy5hcHBlbmRDaGlsZChsaWIpKTtcbiAgICBlbENvbnRlbnQuYXBwZW5kQ2hpbGQoc2VjdGlvbkxpYnMpO1xuXG4gICAgZWxDb250ZW50LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyRWRpdG9ycygnbG9hZEVhZ2VybHknLCB0aGlzLm1vZGVsLmNvbmZpZy5sb2FkRWFnZXJseSkpO1xuICAgIGVsQ29udGVudC5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlckVkaXRvcnMoJ2RvbnRMb2FkJywgdGhpcy5tb2RlbC5jb25maWcuZG9udExvYWQpKTtcblxuICAgIGNvbnN0IHNlY3Rpb25QbHVnaW5zID0gdGhpcy5yZW5kZXJTZWN0aW9uKCdwbHVnaW5zJyk7XG4gICAgY29uc3QgcGx1Z2lucyA9IHRoaXMucmVuZGVyUGx1Z2lucygpO1xuICAgIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4gc2VjdGlvblBsdWdpbnMuYXBwZW5kQ2hpbGQocGx1Z2luKSk7XG4gICAgZWxDb250ZW50LmFwcGVuZENoaWxkKHNlY3Rpb25QbHVnaW5zKTtcblxuICAgIHJldHVybiB0aGlzLmVsO1xuICB9XG5cbiAgcmVuZGVyU2VjdGlvbih0aXRsZSkge1xuXG4gICAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKTtcbiAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQodGl0bGUpO1xuXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBoZWFkZXIuaW5uZXJIVE1MID0gdGl0bGU7XG5cbiAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGhlYWRlcik7XG5cbiAgICBjb25zdCBkb2NzID0gdGVybkNvbmZpZ0RvY3NbdGl0bGVdLmRvYztcblxuICAgIGlmIChkb2NzKSB7XG5cbiAgICAgIGNvbnN0IGRvYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIGRvYy5pbm5lckhUTUwgPSBkb2NzO1xuXG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGRvYyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICByZW5kZXJSYWRpbygpIHtcblxuICAgIHJldHVybiBlY21hVmVyc2lvbnMubWFwKChlY21hVmVyc2lvbikgPT4ge1xuXG4gICAgICBjb25zdCBpbnB1dFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGlucHV0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dC13cmFwcGVyJyk7XG5cbiAgICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0gYGVjbWFWZXJzaW9uICR7ZWNtYVZlcnNpb259YDtcblxuICAgICAgY29uc3QgcmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgcmFkaW8udHlwZSA9ICdyYWRpbyc7XG4gICAgICByYWRpby5uYW1lID0gJ2VjbWFWZXJzaW9ucyc7XG4gICAgICByYWRpby52YWx1ZSA9IGVjbWFWZXJzaW9uO1xuICAgICAgcmFkaW8uY2hlY2tlZCA9IHBhcnNlSW50KHRoaXMubW9kZWwuY29uZmlnLmVjbWFWZXJzaW9uKSA9PT0gZWNtYVZlcnNpb247XG5cbiAgICAgIHJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cbiAgICAgICAgdGhpcy5tb2RlbC5zZXRFY21hVmVyc2lvbihlLnRhcmdldC52YWx1ZSk7XG5cbiAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChyYWRpbyk7XG5cbiAgICAgIHJldHVybiBpbnB1dFdyYXBwZXI7XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJFZGl0b3JzKGlkZW50aWZpZXIsIHBhdGhzID0gW10pIHtcblxuICAgIGNvbnN0IHNlY3Rpb24gPSB0aGlzLnJlbmRlclNlY3Rpb24oaWRlbnRpZmllcik7XG5cbiAgICBwYXRocy5mb3JFYWNoKChwYXRoKSA9PiB7XG5cbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbnB1dFdyYXBwZXIocGF0aCwgaWRlbnRpZmllcikpO1xuICAgIH0pO1xuXG4gICAgc2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUlucHV0V3JhcHBlcihudWxsLCBpZGVudGlmaWVyKSk7XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gIHJlbmRlclBsdWdpbnMoKSB7XG5cbiAgICBjb25zdCBwbHVnaW5zID0gT2JqZWN0LmtleXModGhpcy5tb2RlbC5jb25maWcucGx1Z2lucyk7XG4gICAgY29uc3QgYXZhaWxhYmxlUGx1Z2luc0tleXMgPSBPYmplY3Qua2V5cyhhdmFpbGFibGVQbHVnaW5zKTtcbiAgICBjb25zdCB1bmtub3duUGx1Z2lucyA9IHBsdWdpbnMuZmlsdGVyKChwbHVnaW4pID0+IHtcblxuICAgICAgcmV0dXJuICFhdmFpbGFibGVQbHVnaW5zW3BsdWdpbl0gPyB0cnVlIDogZmFsc2U7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXZhaWxhYmxlUGx1Z2luc0tleXMubWFwKHBsdWdpbiA9PiB0aGlzLnJlbmRlclBsdWdpbihwbHVnaW4pKVxuICAgIC5jb25jYXQodW5rbm93blBsdWdpbnMubWFwKHBsdWdpbiA9PiB0aGlzLnJlbmRlclBsdWdpbihwbHVnaW4pKSk7XG4gIH1cblxuICByZW5kZXJQbHVnaW4ocGx1Z2luKSB7XG5cbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChcbiAgICAgIHRoaXMuYnVpbGRCb29sZWFuKFxuICAgICAgICBwbHVnaW4sXG4gICAgICAgICdwbHVnaW4nLFxuICAgICAgICB0aGlzLm1vZGVsLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl1cbiAgICAgIClcbiAgICApO1xuXG4gICAgY29uc3QgZG9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGRvYy5pbm5lckhUTUwgPSBwbHVnaW5EZWZpbml0aW9uc1twbHVnaW5dICYmIHBsdWdpbkRlZmluaXRpb25zW3BsdWdpbl0uZG9jO1xuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChkb2MpO1xuXG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH1cblxuICByZW5kZXJsaWJzKCkge1xuXG4gICAgcmV0dXJuIGF2YWlsYWJsZUxpYnMubWFwKChsaWIpID0+IHtcblxuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRCb29sZWFuKFxuICAgICAgICAgIGxpYixcbiAgICAgICAgICAnbGliJyxcbiAgICAgICAgICB0aGlzLm1vZGVsLmNvbmZpZy5saWJzLmluY2x1ZGVzKGxpYilcbiAgICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGJ1aWxkQm9vbGVhbihrZXksIHR5cGUsIGNoZWNrZWQpIHtcblxuICAgIGNvbnN0IGlucHV0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgIGlucHV0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dC13cmFwcGVyJyk7XG4gICAgbGFiZWwuaW5uZXJIVE1MID0ga2V5O1xuICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGNoZWNrYm94LnZhbHVlID0ga2V5O1xuICAgIGNoZWNrYm94LmNoZWNrZWQgPSBjaGVja2VkO1xuXG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblxuICAgICAgc3dpdGNoICh0eXBlKSB7XG5cbiAgICAgICAgY2FzZSAnbGliJzoge1xuXG4gICAgICAgICAgZS50YXJnZXQuY2hlY2tlZCA/IHRoaXMubW9kZWwuYWRkTGliKGtleSkgOiB0aGlzLm1vZGVsLnJlbW92ZUxpYihrZXkpO1xuXG4gICAgICAgIH0gYnJlYWs7XG5cbiAgICAgICAgY2FzZSAncGx1Z2luJzoge1xuXG4gICAgICAgICAgZS50YXJnZXQuY2hlY2tlZCA/IHRoaXMubW9kZWwuYWRkUGx1Z2luKGtleSkgOiB0aGlzLm1vZGVsLnJlbW92ZVBsdWdpbihrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChjaGVja2JveCk7XG5cbiAgICByZXR1cm4gaW5wdXRXcmFwcGVyO1xuICB9XG5cbiAgY3JlYXRlSW5wdXRXcmFwcGVyKHBhdGgsIGlkZW50aWZpZXIpIHtcblxuICAgIGNvbnN0IGlucHV0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGVkaXRvciA9IHRoaXMuY3JlYXRlVGV4dEVkaXRvcihwYXRoLCBpZGVudGlmaWVyKTtcblxuICAgIGlucHV0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dC13cmFwcGVyJyk7XG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGVkaXRvcik7XG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQWRkKGlkZW50aWZpZXIpKTtcbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVTdWIoZWRpdG9yKSk7XG5cbiAgICByZXR1cm4gaW5wdXRXcmFwcGVyO1xuICB9XG5cbiAgY3JlYXRlU3ViKGVkaXRvcikge1xuXG4gICAgY29uc3Qgc3ViID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdzdWInKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cy1yZW1vdmVkJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ2ljb24nKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnaWNvbi1kaWZmLXJlbW92ZWQnKTtcblxuICAgIHN1Yi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMubW9kZWwucmVtb3ZlRWRpdG9yKGVkaXRvcik7XG4gICAgICBjb25zdCBpbnB1dFdyYXBwZXIgPSBlLnRhcmdldC5jbG9zZXN0KCcuaW5wdXQtd3JhcHBlcicpO1xuICAgICAgaW5wdXRXcmFwcGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaW5wdXRXcmFwcGVyKTtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiBzdWI7XG4gIH1cblxuICBjcmVhdGVBZGQoaWRlbnRpZmllcikge1xuXG4gICAgY29uc3QgYWRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdhZGQnKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cy1hZGRlZCcpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdpY29uJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ2ljb24tZGlmZi1hZGRlZCcpO1xuICAgIGFkZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIGUudGFyZ2V0LmNsb3Nlc3QoJ3NlY3Rpb24nKS5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUlucHV0V3JhcHBlcihudWxsLCBpZGVudGlmaWVyKSk7XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgICByZXR1cm4gYWRkO1xuICB9XG5cbiAgY3JlYXRlVGV4dEVkaXRvcihwYXRoLCBpZGVudGlmaWVyKSB7XG5cbiAgICBjb25zdCBlZGl0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdG9tLXRleHQtZWRpdG9yJyk7XG4gICAgZWRpdG9yLnNldEF0dHJpYnV0ZSgnbWluaScsIHRydWUpO1xuXG4gICAgaWYgKHBhdGgpIHtcblxuICAgICAgZWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCkuc2V0VGV4dChwYXRoKTtcbiAgICB9XG5cbiAgICB0aGlzLm1vZGVsLmVkaXRvcnMucHVzaCh7XG5cbiAgICAgIGlkZW50aWZpZXIsXG4gICAgICByZWY6IGVkaXRvclxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVkaXRvcjtcbiAgfVxuXG4gIGdldE1vZGVsKCkge1xuXG4gICAgcmV0dXJuIHRoaXMubW9kZWw7XG4gIH1cblxuICBzZXRNb2RlbChtb2RlbCkge1xuXG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIHRoaXMuZWwucmVtb3ZlKCk7XG4gIH1cbn1cbiJdfQ==