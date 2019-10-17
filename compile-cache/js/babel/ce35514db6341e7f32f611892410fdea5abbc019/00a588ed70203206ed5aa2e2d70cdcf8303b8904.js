Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseCode;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

"use babel";

var debug = (0, _debug2["default"])("js-hyperclick:parse-code");

// TimeCop was reporting that it took over 600ms for js-hyperclick to start.
// Converting this `import` to a `require` reduced it to under 250ms Moving it
// to require inside `findIdentifiers` and `parseCode` moved it off the TimeCop
// list (under 5ms)

/*
import { parse, traverse, types as t } from '@babel/core'
*/

var parseErrorTag = Symbol();

var identifierReducer = function identifierReducer(tmp, node) {
  var value = node;
  if (node.value) {
    value = node.value;
  }

  var _require = require("@babel/core");

  var t = _require.types;

  var newIdentifiers = undefined;
  if (t.isIdentifier(value)) {
    newIdentifiers = [value];
  } else if (t.isObjectPattern(value)) {
    newIdentifiers = findIdentifiers(value);
  } else if (t.isArrayPattern(value)) {
    newIdentifiers = findIdentifiers(value);
  }

  /* istanbul ignore next: If this throws, it's a mistake in my code or an
    /* unsupported syntax */
  if (!newIdentifiers) {
    throw new Error("No identifiers found");
  }

  return [].concat(_toConsumableArray(tmp), _toConsumableArray(newIdentifiers));
};
function findIdentifiers(node) {
  var identifiers = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var _require2 = require("@babel/core");

  var t = _require2.types;

  if (t.isObjectPattern(node)) {
    return node.properties.reduce(identifierReducer, identifiers);
  } else if (t.isArrayPattern(node)) {
    return node.elements.reduce(identifierReducer, identifiers);
  } else if (t.isIdentifier(node)) {
    return [node];
  }
  /* istanbul ignore next */
  throw new Error("Unknown node type");
}

var makeDefaultConfig = function makeDefaultConfig() {
  return {
    sourceType: "module",
    // Enable as many plugins as I can so that people don't need to configure
    // anything.
    plugins: [require("@babel/plugin-syntax-async-generators"), require("@babel/plugin-syntax-bigint"), require("@babel/plugin-syntax-class-properties"), [require("@babel/plugin-syntax-decorators"), { decoratorsBeforeExport: false }], require("@babel/plugin-syntax-do-expressions"), require("@babel/plugin-syntax-dynamic-import"), require("@babel/plugin-syntax-export-default-from"), require("@babel/plugin-syntax-export-namespace-from"), require("@babel/plugin-syntax-flow"), require("@babel/plugin-syntax-function-bind"), require("@babel/plugin-syntax-function-sent"), require("@babel/plugin-syntax-import-meta"), require("@babel/plugin-syntax-json-strings"), require("@babel/plugin-syntax-jsx"), require("@babel/plugin-syntax-logical-assignment-operators"), require("@babel/plugin-syntax-nullish-coalescing-operator"), require("@babel/plugin-syntax-numeric-separator"), require("@babel/plugin-syntax-object-rest-spread"), require("@babel/plugin-syntax-optional-catch-binding"), require("@babel/plugin-syntax-optional-chaining"), [require("@babel/plugin-syntax-pipeline-operator"), { proposal: "minimal" }], require("@babel/plugin-syntax-throw-expressions")]
  };
};

// Even though Babel can parse typescript, I can't have it and flow
// enabled at the same time.
// "@babel/plugin-syntax-typescript",

function parseCode(code, babelConfig) {
  var _require3 = require("@babel/core");

  var traverse = _require3.traverse;
  var t = _require3.types;

  var _require4 = require("@babel/core");

  var parseSync = _require4.parseSync;

  var ast = undefined;

  try {
    ast = parseSync(code, babelConfig || makeDefaultConfig());
  } catch (parseError) {
    debug("parseError", parseError);
    /* istanbul ignore next */
    return { type: "parse-error", parseError: parseError };
  }

  // console.log(JSON.stringify(ast, null, 4))

  var scopes = [];
  var externalModules = [];
  var exports = {};
  var paths = [];

  var addModule = function addModule(moduleName, identifier) {
    var imported = arguments.length <= 2 || arguments[2] === undefined ? "default" : arguments[2];

    externalModules.push({
      local: identifier.name,
      start: identifier.start,
      end: identifier.end,
      moduleName: moduleName,
      imported: imported
    });
  };
  var addUnboundModule = function addUnboundModule(moduleName, identifier) {
    var imported = arguments.length <= 2 || arguments[2] === undefined ? identifier.name : arguments[2];
    return (function () {
      paths.push({
        imported: imported,
        moduleName: moduleName,
        range: {
          start: identifier.start,
          end: identifier.end
        }
      });
    })();
  };

  var isModuleDotExports = function isModuleDotExports(node) {
    return t.isMemberExpression(node) && t.isIdentifier(node.object, { name: "module" }) && t.isIdentifier(node.property, { name: "exports" });
  };

  var visitors = {
    Scope: function Scope(_ref) {
      var scope = _ref.scope;

      scopes.push(scope);
    },
    CallExpression: function CallExpression(_ref2) {
      var node = _ref2.node;
      var parent = _ref2.parent;

      // `import()` is an operator, not a function.
      // `isIdentifier` doesn't work here.
      // http://2ality.com/2017/01/import-operator.html
      var isImport = node.callee.type === "Import";

      var isRequire = t.isIdentifier(node.callee, { name: "require" });

      var isRequireResolve = t.isMemberExpression(node.callee, { computed: false }) && t.isIdentifier(node.callee.object, { name: "require" }) && t.isIdentifier(node.callee.property, { name: "resolve" });

      if (isImport || isRequire || isRequireResolve) {
        if (t.isLiteral(node.arguments[0])) {
          (function () {
            var moduleName = undefined;
            var arg = node.arguments[0];
            if (t.isLiteral(arg)) {
              moduleName = arg.value;
            }
            if (moduleName == null && t.isTemplateLiteral(arg) && arg.quasis.length === 1) {
              var quasi = arg.quasis[0];
              moduleName = quasi.value.cooked;
            }
            var id = parent.id;

            if (moduleName != null) {
              if (t.isAssignmentExpression(parent) && isModuleDotExports(parent.left)) {
                addUnboundModule(moduleName, parent.left, "default");
              }

              paths.push({
                imported: "default",
                moduleName: moduleName,
                range: {
                  start: node.arguments[0].start,
                  end: node.arguments[0].end
                }
              });

              if (t.isIdentifier(id)) {
                addModule(moduleName, id);
              }
              if (t.isObjectPattern(id) || t.isArrayPattern(id)) {
                findIdentifiers(id).forEach(function (identifier) {
                  addModule(moduleName, identifier);
                });
              }
            }
          })();
        }
      }
    },
    ImportDeclaration: function ImportDeclaration(_ref3) {
      var node = _ref3.node;

      if (t.isLiteral(node.source)) {
        (function () {
          var moduleName = node.source.value;
          node.specifiers.forEach(function (_ref4) {
            var local = _ref4.local;
            var imported = _ref4.imported;

            var importedName = "default";
            if (imported != null) {
              addUnboundModule(moduleName, imported);
              importedName = imported.name;
            }

            addModule(moduleName, local, importedName);
          });
          paths.push({
            imported: "default",
            moduleName: moduleName,
            range: {
              start: node.source.start,
              end: node.source.end
            }
          });
        })();
      }
    },
    ExportDefaultDeclaration: function ExportDefaultDeclaration(_ref5) {
      var node = _ref5.node;
      var declaration = node.declaration;

      if (t.isIdentifier(declaration)) {
        exports["default"] = {
          start: declaration.start,
          end: declaration.end
        };
        return;
      }

      exports["default"] = {
        start: node.start,
        end: node.end
      };
    },
    ExportNamedDeclaration: function ExportNamedDeclaration(_ref6) {
      var node = _ref6.node;
      var specifiers = node.specifiers;
      var declaration = node.declaration;

      var moduleName = t.isLiteral(node.source) ? node.source.value : undefined;

      specifiers.forEach(function (spec) {
        if (t.isExportSpecifier(spec)) {
          var _spec$exported = spec.exported;
          var _name = _spec$exported.name;
          var start = _spec$exported.start;
          var end = _spec$exported.end;

          exports[_name] = { start: start, end: end };

          // export ... from does not create a local binding, so I'm
          // gathering it in the paths. build-suggestion will convert
          // it back to a `from-module`
          if (moduleName && t.isIdentifier(spec.local)) {
            addUnboundModule(moduleName, spec.local);
            // paths.push({
            //     imported: spec.local.name,
            //     moduleName,
            //     range: {
            //         start: spec.local.start,
            //         end: spec.local.end,
            //     }
            // })
          }
        } else if (t.isExportDefaultSpecifier(spec)) {
            var _spec$exported2 = spec.exported;
            var _name2 = _spec$exported2.name;
            var start = _spec$exported2.start;
            var end = _spec$exported2.end;

            exports[_name2] = { start: start, end: end };

            if (moduleName) {
              paths.push({
                imported: "default",
                moduleName: moduleName,
                range: {
                  start: spec.exported.start,
                  end: spec.exported.end
                }
              });
            }
          }
      });

      if (t.isVariableDeclaration(declaration)) {
        declaration.declarations.forEach(function (_ref7) {
          var id = _ref7.id;

          declaration.declarations.forEach;
          findIdentifiers(id).forEach(function (_ref8) {
            var name = _ref8.name;
            var start = _ref8.start;
            var end = _ref8.end;

            exports[name] = { start: start, end: end };
          });
        });
      }

      if (t.isFunctionDeclaration(declaration) || t.isTypeAlias(declaration) || t.isInterfaceDeclaration(declaration)) {
        var _declaration$id = declaration.id;
        var _name3 = _declaration$id.name;
        var start = _declaration$id.start;
        var end = _declaration$id.end;

        exports[_name3] = { start: start, end: end };
      }

      if (moduleName) {
        paths.push({
          imported: "default",
          moduleName: moduleName,
          range: {
            start: node.source.start,
            end: node.source.end
          }
        });
      }
    },
    ExportAllDeclaration: function ExportAllDeclaration(_ref9) {
      var node = _ref9.node;

      if (t.isLiteral(node.source)) {
        var moduleName = node.source.value;
        paths.push({
          imported: "default",
          moduleName: moduleName,
          range: {
            start: node.source.start,
            end: node.source.end
          }
        });
      }
    },
    AssignmentExpression: function AssignmentExpression(_ref10) {
      var node = _ref10.node;

      if (isModuleDotExports(node.left)) {
        exports["default"] = {
          start: node.left.start,
          end: node.left.end
        };
      }
    }
  };

  try {
    traverse(ast, visitors);
  } catch (e) {
    debug("Error traversing", e);
    /* istanbul ignore else */
    if (e[parseErrorTag]) {
      return { type: "parse-error", parseError: e };
    } else {
      /* This should never trigger, it just rethrows unexpected errors */
      throw e;
    }
  }

  return {
    type: "info",
    scopes: scopes,
    // Cannot return object literal because possibly uninitialized variable [1]
    // is incompatible with string [2] in property moduleName of array element
    // of property externalModules. - $FlowFixMe
    externalModules: externalModules,
    exports: exports,
    paths: paths
  };
}

module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3ZvdmVuLy5hdG9tL3BhY2thZ2VzL2pzLWh5cGVyY2xpY2svbGliL2NvcmUvcGFyc2UtY29kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7cUJBNkZ3QixTQUFTOzs7Ozs7cUJBMUZYLE9BQU87Ozs7QUFIN0IsV0FBVyxDQUFBOztBQUlYLElBQU0sS0FBSyxHQUFHLHdCQUFVLDBCQUEwQixDQUFDLENBQUE7Ozs7Ozs7Ozs7O0FBV25ELElBQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFBOztBQUU5QixJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUs7QUFDdkMsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLE1BQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLFNBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO0dBQ25COztpQkFDb0IsT0FBTyxDQUFDLGFBQWEsQ0FBQzs7TUFBNUIsQ0FBQyxZQUFSLEtBQUs7O0FBQ2IsTUFBSSxjQUFjLFlBQUEsQ0FBQTtBQUNsQixNQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDekIsa0JBQWMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ3pCLE1BQU0sSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ25DLGtCQUFjLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ3hDLE1BQU0sSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2xDLGtCQUFjLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ3hDOzs7O0FBSUQsTUFBSSxDQUFDLGNBQWMsRUFBRTtBQUNuQixVQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUE7R0FDeEM7O0FBRUQsc0NBQVcsR0FBRyxzQkFBSyxjQUFjLEdBQUM7Q0FDbkMsQ0FBQTtBQUNELFNBQVMsZUFBZSxDQUFDLElBQUksRUFBb0I7TUFBbEIsV0FBVyx5REFBRyxFQUFFOztrQkFDeEIsT0FBTyxDQUFDLGFBQWEsQ0FBQzs7TUFBNUIsQ0FBQyxhQUFSLEtBQUs7O0FBRWIsTUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzNCLFdBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLENBQUE7R0FDOUQsTUFBTSxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDakMsV0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQTtHQUM1RCxNQUFNLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUMvQixXQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDZDs7QUFFRCxRQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7Q0FDckM7O0FBRUQsSUFBTSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUI7U0FBVTtBQUMvQixjQUFVLEVBQUUsUUFBUTs7O0FBR3BCLFdBQU8sRUFBRSxDQUNQLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxFQUNoRCxPQUFPLENBQUMsNkJBQTZCLENBQUMsRUFDdEMsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLEVBQ2hELENBQ0UsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLEVBQzFDLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLENBQ2xDLEVBQ0QsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLEVBQzlDLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxFQUM5QyxPQUFPLENBQUMsMENBQTBDLENBQUMsRUFDbkQsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLEVBQ3JELE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxFQUNwQyxPQUFPLENBQUMsb0NBQW9DLENBQUMsRUFDN0MsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLEVBQzdDLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxFQUMzQyxPQUFPLENBQUMsbUNBQW1DLENBQUMsRUFDNUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLEVBQ25DLE9BQU8sQ0FBQyxtREFBbUQsQ0FBQyxFQUM1RCxPQUFPLENBQUMsa0RBQWtELENBQUMsRUFDM0QsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLEVBQ2pELE9BQU8sQ0FBQyx5Q0FBeUMsQ0FBQyxFQUNsRCxPQUFPLENBQUMsNkNBQTZDLENBQUMsRUFDdEQsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLEVBQ2pELENBQ0UsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLEVBQ2pELEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUN4QixFQUNELE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUlsRDtHQUNGO0NBQUMsQ0FBQTs7Ozs7O0FBRWEsU0FBUyxTQUFTLENBQUMsSUFBWSxFQUFFLFdBQW9CLEVBQVE7a0JBQzNDLE9BQU8sQ0FBQyxhQUFhLENBQUM7O01BQTdDLFFBQVEsYUFBUixRQUFRO01BQVMsQ0FBQyxhQUFSLEtBQUs7O2tCQUNELE9BQU8sQ0FBQyxhQUFhLENBQUM7O01BQXBDLFNBQVMsYUFBVCxTQUFTOztBQUNqQixNQUFJLEdBQUcsR0FBRyxTQUFTLENBQUE7O0FBRW5CLE1BQUk7QUFDRixPQUFHLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLElBQUksaUJBQWlCLEVBQUUsQ0FBQyxDQUFBO0dBQzFELENBQUMsT0FBTyxVQUFVLEVBQUU7QUFDbkIsU0FBSyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTs7QUFFL0IsV0FBTyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFBO0dBQzNDOzs7O0FBSUQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFDbEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFBOztBQUVoQixNQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxVQUFVLEVBQUUsVUFBVSxFQUEyQjtRQUF6QixRQUFRLHlEQUFHLFNBQVM7O0FBQzdELG1CQUFlLENBQUMsSUFBSSxDQUFDO0FBQ25CLFdBQUssRUFBRSxVQUFVLENBQUMsSUFBSTtBQUN0QixXQUFLLEVBQUUsVUFBVSxDQUFDLEtBQUs7QUFDdkIsU0FBRyxFQUFFLFVBQVUsQ0FBQyxHQUFHO0FBQ25CLGdCQUFVLEVBQVYsVUFBVTtBQUNWLGNBQVEsRUFBUixRQUFRO0tBQ1QsQ0FBQyxDQUFBO0dBQ0gsQ0FBQTtBQUNELE1BQU0sZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQ3BCLFVBQVUsRUFDVixVQUFVO1FBQ1YsUUFBUSx5REFBRyxVQUFVLENBQUMsSUFBSTt3QkFDdkI7QUFDSCxXQUFLLENBQUMsSUFBSSxDQUFDO0FBQ1QsZ0JBQVEsRUFBUixRQUFRO0FBQ1Isa0JBQVUsRUFBVixVQUFVO0FBQ1YsYUFBSyxFQUFFO0FBQ0wsZUFBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLO0FBQ3ZCLGFBQUcsRUFBRSxVQUFVLENBQUMsR0FBRztTQUNwQjtPQUNGLENBQUMsQ0FBQTtLQUNIO0dBQUEsQ0FBQTs7QUFFRCxNQUFNLGtCQUFrQixHQUFHLFNBQXJCLGtCQUFrQixDQUFHLElBQUk7V0FDN0IsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUMxQixDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFDL0MsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDO0dBQUEsQ0FBQTs7QUFFcEQsTUFBTSxRQUFRLEdBQUc7QUFDZixTQUFLLEVBQUEsZUFBQyxJQUFTLEVBQUU7VUFBVCxLQUFLLEdBQVAsSUFBUyxDQUFQLEtBQUs7O0FBQ1gsWUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUNuQjtBQUNELGtCQUFjLEVBQUEsd0JBQUMsS0FBZ0IsRUFBRTtVQUFoQixJQUFJLEdBQU4sS0FBZ0IsQ0FBZCxJQUFJO1VBQUUsTUFBTSxHQUFkLEtBQWdCLENBQVIsTUFBTTs7Ozs7QUFJM0IsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBOztBQUU5QyxVQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTs7QUFFbEUsVUFBTSxnQkFBZ0IsR0FDcEIsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFDdEQsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQyxJQUN2RCxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUE7O0FBRTNELFVBQUksUUFBUSxJQUFJLFNBQVMsSUFBSSxnQkFBZ0IsRUFBRTtBQUM3QyxZQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOztBQUNsQyxnQkFBSSxVQUFVLFlBQUEsQ0FBQTtBQUNkLGdCQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdCLGdCQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDcEIsd0JBQVUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO2FBQ3ZCO0FBQ0QsZ0JBQ0UsVUFBVSxJQUFJLElBQUksSUFDbEIsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQ3ZCO0FBQ0Esa0JBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDM0Isd0JBQVUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQTthQUNoQztnQkFDTyxFQUFFLEdBQUssTUFBTSxDQUFiLEVBQUU7O0FBRVYsZ0JBQUksVUFBVSxJQUFJLElBQUksRUFBRTtBQUN0QixrQkFDRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLElBQ2hDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFDL0I7QUFDQSxnQ0FBZ0IsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQTtlQUNyRDs7QUFFRCxtQkFBSyxDQUFDLElBQUksQ0FBQztBQUNULHdCQUFRLEVBQUUsU0FBUztBQUNuQiwwQkFBVSxFQUFWLFVBQVU7QUFDVixxQkFBSyxFQUFFO0FBQ0wsdUJBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7QUFDOUIscUJBQUcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUc7aUJBQzNCO2VBQ0YsQ0FBQyxDQUFBOztBQUVGLGtCQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEIseUJBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUE7ZUFDMUI7QUFDRCxrQkFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDakQsK0JBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVLEVBQUk7QUFDeEMsMkJBQVMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUE7aUJBQ2xDLENBQUMsQ0FBQTtlQUNIO2FBQ0Y7O1NBQ0Y7T0FDRjtLQUNGO0FBQ0QscUJBQWlCLEVBQUEsMkJBQUMsS0FBUSxFQUFFO1VBQVIsSUFBSSxHQUFOLEtBQVEsQ0FBTixJQUFJOztBQUN0QixVQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFOztBQUM1QixjQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtBQUNwQyxjQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQW1CLEVBQUs7Z0JBQXRCLEtBQUssR0FBUCxLQUFtQixDQUFqQixLQUFLO2dCQUFFLFFBQVEsR0FBakIsS0FBbUIsQ0FBVixRQUFROztBQUN4QyxnQkFBSSxZQUFZLEdBQUcsU0FBUyxDQUFBO0FBQzVCLGdCQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7QUFDcEIsOEJBQWdCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ3RDLDBCQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQTthQUM3Qjs7QUFFRCxxQkFBUyxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUE7V0FDM0MsQ0FBQyxDQUFBO0FBQ0YsZUFBSyxDQUFDLElBQUksQ0FBQztBQUNULG9CQUFRLEVBQUUsU0FBUztBQUNuQixzQkFBVSxFQUFWLFVBQVU7QUFDVixpQkFBSyxFQUFFO0FBQ0wsbUJBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7QUFDeEIsaUJBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7YUFDckI7V0FDRixDQUFDLENBQUE7O09BQ0g7S0FDRjtBQUNELDRCQUF3QixFQUFBLGtDQUFDLEtBQVEsRUFBRTtVQUFSLElBQUksR0FBTixLQUFRLENBQU4sSUFBSTtVQUNyQixXQUFXLEdBQUssSUFBSSxDQUFwQixXQUFXOztBQUVuQixVQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDL0IsZUFBTyxXQUFRLEdBQUc7QUFDaEIsZUFBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLO0FBQ3hCLGFBQUcsRUFBRSxXQUFXLENBQUMsR0FBRztTQUNyQixDQUFBO0FBQ0QsZUFBTTtPQUNQOztBQUVELGFBQU8sV0FBUSxHQUFHO0FBQ2hCLGFBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQixXQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7T0FDZCxDQUFBO0tBQ0Y7QUFDRCwwQkFBc0IsRUFBQSxnQ0FBQyxLQUFRLEVBQUU7VUFBUixJQUFJLEdBQU4sS0FBUSxDQUFOLElBQUk7VUFDbkIsVUFBVSxHQUFrQixJQUFJLENBQWhDLFVBQVU7VUFBRSxXQUFXLEdBQUssSUFBSSxDQUFwQixXQUFXOztBQUUvQixVQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQ2pCLFNBQVMsQ0FBQTs7QUFFYixnQkFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSTtBQUN6QixZQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTsrQkFDQSxJQUFJLENBQUMsUUFBUTtjQUFsQyxLQUFJLGtCQUFKLElBQUk7Y0FBRSxLQUFLLGtCQUFMLEtBQUs7Y0FBRSxHQUFHLGtCQUFILEdBQUc7O0FBQ3hCLGlCQUFPLENBQUMsS0FBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsQ0FBQTs7Ozs7QUFLOUIsY0FBSSxVQUFVLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDNUMsNEJBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTs7Ozs7Ozs7O1dBU3pDO1NBQ0YsTUFBTSxJQUFJLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtrQ0FDZCxJQUFJLENBQUMsUUFBUTtnQkFBbEMsTUFBSSxtQkFBSixJQUFJO2dCQUFFLEtBQUssbUJBQUwsS0FBSztnQkFBRSxHQUFHLG1CQUFILEdBQUc7O0FBQ3hCLG1CQUFPLENBQUMsTUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUwsS0FBSyxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsQ0FBQTs7QUFFOUIsZ0JBQUksVUFBVSxFQUFFO0FBQ2QsbUJBQUssQ0FBQyxJQUFJLENBQUM7QUFDVCx3QkFBUSxFQUFFLFNBQVM7QUFDbkIsMEJBQVUsRUFBVixVQUFVO0FBQ1YscUJBQUssRUFBRTtBQUNMLHVCQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLO0FBQzFCLHFCQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHO2lCQUN2QjtlQUNGLENBQUMsQ0FBQTthQUNIO1dBQ0Y7T0FDRixDQUFDLENBQUE7O0FBRUYsVUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDeEMsbUJBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBTSxFQUFLO2NBQVQsRUFBRSxHQUFKLEtBQU0sQ0FBSixFQUFFOztBQUNwQyxxQkFBVyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUE7QUFDaEMseUJBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFvQixFQUFLO2dCQUF2QixJQUFJLEdBQU4sS0FBb0IsQ0FBbEIsSUFBSTtnQkFBRSxLQUFLLEdBQWIsS0FBb0IsQ0FBWixLQUFLO2dCQUFFLEdBQUcsR0FBbEIsS0FBb0IsQ0FBTCxHQUFHOztBQUM3QyxtQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLENBQUE7V0FDL0IsQ0FBQyxDQUFBO1NBQ0gsQ0FBQyxDQUFBO09BQ0g7O0FBRUQsVUFDRSxDQUFDLENBQUMscUJBQXFCLENBQUMsV0FBVyxDQUFDLElBQ3BDLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQzFCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsRUFDckM7OEJBQzZCLFdBQVcsQ0FBQyxFQUFFO1lBQW5DLE1BQUksbUJBQUosSUFBSTtZQUFFLEtBQUssbUJBQUwsS0FBSztZQUFFLEdBQUcsbUJBQUgsR0FBRzs7QUFDeEIsZUFBTyxDQUFDLE1BQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLENBQUE7T0FDL0I7O0FBRUQsVUFBSSxVQUFVLEVBQUU7QUFDZCxhQUFLLENBQUMsSUFBSSxDQUFDO0FBQ1Qsa0JBQVEsRUFBRSxTQUFTO0FBQ25CLG9CQUFVLEVBQVYsVUFBVTtBQUNWLGVBQUssRUFBRTtBQUNMLGlCQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLO0FBQ3hCLGVBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUc7V0FDckI7U0FDRixDQUFDLENBQUE7T0FDSDtLQUNGO0FBQ0Qsd0JBQW9CLEVBQUEsOEJBQUMsS0FBUSxFQUFFO1VBQVIsSUFBSSxHQUFOLEtBQVEsQ0FBTixJQUFJOztBQUN6QixVQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0FBQzVCLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO0FBQ3BDLGFBQUssQ0FBQyxJQUFJLENBQUM7QUFDVCxrQkFBUSxFQUFFLFNBQVM7QUFDbkIsb0JBQVUsRUFBVixVQUFVO0FBQ1YsZUFBSyxFQUFFO0FBQ0wsaUJBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7QUFDeEIsZUFBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRztXQUNyQjtTQUNGLENBQUMsQ0FBQTtPQUNIO0tBQ0Y7QUFDRCx3QkFBb0IsRUFBQSw4QkFBQyxNQUFRLEVBQUU7VUFBUixJQUFJLEdBQU4sTUFBUSxDQUFOLElBQUk7O0FBQ3pCLFVBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ2pDLGVBQU8sV0FBUSxHQUFHO0FBQ2hCLGVBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUs7QUFDdEIsYUFBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztTQUNuQixDQUFBO09BQ0Y7S0FDRjtHQUNGLENBQUE7O0FBRUQsTUFBSTtBQUNGLFlBQVEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUE7R0FDeEIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFNBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQTs7QUFFNUIsUUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUU7QUFDcEIsYUFBTyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFBO0tBQzlDLE1BQU07O0FBRUwsWUFBTSxDQUFDLENBQUE7S0FDUjtHQUNGOztBQUVELFNBQU87QUFDTCxRQUFJLEVBQUUsTUFBTTtBQUNaLFVBQU0sRUFBTixNQUFNOzs7O0FBSU4sbUJBQWUsRUFBZixlQUFlO0FBQ2YsV0FBTyxFQUFQLE9BQU87QUFDUCxTQUFLLEVBQUwsS0FBSztHQUNOLENBQUE7Q0FDRiIsImZpbGUiOiIvaG9tZS92b3Zlbi8uYXRvbS9wYWNrYWdlcy9qcy1oeXBlcmNsaWNrL2xpYi9jb3JlL3BhcnNlLWNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiXG4vLyBAZmxvd1xuaW1wb3J0IHR5cGUgeyBJbmZvIH0gZnJvbSBcIi4uL3R5cGVzXCJcbmltcG9ydCBtYWtlRGVidWcgZnJvbSBcImRlYnVnXCJcbmNvbnN0IGRlYnVnID0gbWFrZURlYnVnKFwianMtaHlwZXJjbGljazpwYXJzZS1jb2RlXCIpXG5cbi8vIFRpbWVDb3Agd2FzIHJlcG9ydGluZyB0aGF0IGl0IHRvb2sgb3ZlciA2MDBtcyBmb3IganMtaHlwZXJjbGljayB0byBzdGFydC5cbi8vIENvbnZlcnRpbmcgdGhpcyBgaW1wb3J0YCB0byBhIGByZXF1aXJlYCByZWR1Y2VkIGl0IHRvIHVuZGVyIDI1MG1zIE1vdmluZyBpdFxuLy8gdG8gcmVxdWlyZSBpbnNpZGUgYGZpbmRJZGVudGlmaWVyc2AgYW5kIGBwYXJzZUNvZGVgIG1vdmVkIGl0IG9mZiB0aGUgVGltZUNvcFxuLy8gbGlzdCAodW5kZXIgNW1zKVxuXG4vKlxuaW1wb3J0IHsgcGFyc2UsIHRyYXZlcnNlLCB0eXBlcyBhcyB0IH0gZnJvbSAnQGJhYmVsL2NvcmUnXG4qL1xuXG5jb25zdCBwYXJzZUVycm9yVGFnID0gU3ltYm9sKClcblxuY29uc3QgaWRlbnRpZmllclJlZHVjZXIgPSAodG1wLCBub2RlKSA9PiB7XG4gIGxldCB2YWx1ZSA9IG5vZGVcbiAgaWYgKG5vZGUudmFsdWUpIHtcbiAgICB2YWx1ZSA9IG5vZGUudmFsdWVcbiAgfVxuICBjb25zdCB7IHR5cGVzOiB0IH0gPSByZXF1aXJlKFwiQGJhYmVsL2NvcmVcIilcbiAgbGV0IG5ld0lkZW50aWZpZXJzXG4gIGlmICh0LmlzSWRlbnRpZmllcih2YWx1ZSkpIHtcbiAgICBuZXdJZGVudGlmaWVycyA9IFt2YWx1ZV1cbiAgfSBlbHNlIGlmICh0LmlzT2JqZWN0UGF0dGVybih2YWx1ZSkpIHtcbiAgICBuZXdJZGVudGlmaWVycyA9IGZpbmRJZGVudGlmaWVycyh2YWx1ZSlcbiAgfSBlbHNlIGlmICh0LmlzQXJyYXlQYXR0ZXJuKHZhbHVlKSkge1xuICAgIG5ld0lkZW50aWZpZXJzID0gZmluZElkZW50aWZpZXJzKHZhbHVlKVxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IElmIHRoaXMgdGhyb3dzLCBpdCdzIGEgbWlzdGFrZSBpbiBteSBjb2RlIG9yIGFuXG4gICAgLyogdW5zdXBwb3J0ZWQgc3ludGF4ICovXG4gIGlmICghbmV3SWRlbnRpZmllcnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBpZGVudGlmaWVycyBmb3VuZFwiKVxuICB9XG5cbiAgcmV0dXJuIFsuLi50bXAsIC4uLm5ld0lkZW50aWZpZXJzXVxufVxuZnVuY3Rpb24gZmluZElkZW50aWZpZXJzKG5vZGUsIGlkZW50aWZpZXJzID0gW10pIHtcbiAgY29uc3QgeyB0eXBlczogdCB9ID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG5cbiAgaWYgKHQuaXNPYmplY3RQYXR0ZXJuKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUucHJvcGVydGllcy5yZWR1Y2UoaWRlbnRpZmllclJlZHVjZXIsIGlkZW50aWZpZXJzKVxuICB9IGVsc2UgaWYgKHQuaXNBcnJheVBhdHRlcm4obm9kZSkpIHtcbiAgICByZXR1cm4gbm9kZS5lbGVtZW50cy5yZWR1Y2UoaWRlbnRpZmllclJlZHVjZXIsIGlkZW50aWZpZXJzKVxuICB9IGVsc2UgaWYgKHQuaXNJZGVudGlmaWVyKG5vZGUpKSB7XG4gICAgcmV0dXJuIFtub2RlXVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gbm9kZSB0eXBlXCIpXG59XG5cbmNvbnN0IG1ha2VEZWZhdWx0Q29uZmlnID0gKCkgPT4gKHtcbiAgc291cmNlVHlwZTogXCJtb2R1bGVcIixcbiAgLy8gRW5hYmxlIGFzIG1hbnkgcGx1Z2lucyBhcyBJIGNhbiBzbyB0aGF0IHBlb3BsZSBkb24ndCBuZWVkIHRvIGNvbmZpZ3VyZVxuICAvLyBhbnl0aGluZy5cbiAgcGx1Z2luczogW1xuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1hc3luYy1nZW5lcmF0b3JzXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1iaWdpbnRcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWNsYXNzLXByb3BlcnRpZXNcIiksXG4gICAgW1xuICAgICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWRlY29yYXRvcnNcIiksXG4gICAgICB7IGRlY29yYXRvcnNCZWZvcmVFeHBvcnQ6IGZhbHNlIH0sXG4gICAgXSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtZG8tZXhwcmVzc2lvbnNcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWR5bmFtaWMtaW1wb3J0XCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1leHBvcnQtZGVmYXVsdC1mcm9tXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1leHBvcnQtbmFtZXNwYWNlLWZyb21cIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWZsb3dcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWZ1bmN0aW9uLWJpbmRcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWZ1bmN0aW9uLXNlbnRcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWltcG9ydC1tZXRhXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1qc29uLXN0cmluZ3NcIiksXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LWpzeFwiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtbG9naWNhbC1hc3NpZ25tZW50LW9wZXJhdG9yc1wiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtbnVsbGlzaC1jb2FsZXNjaW5nLW9wZXJhdG9yXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1udW1lcmljLXNlcGFyYXRvclwiKSxcbiAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtb2JqZWN0LXJlc3Qtc3ByZWFkXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1vcHRpb25hbC1jYXRjaC1iaW5kaW5nXCIpLFxuICAgIHJlcXVpcmUoXCJAYmFiZWwvcGx1Z2luLXN5bnRheC1vcHRpb25hbC1jaGFpbmluZ1wiKSxcbiAgICBbXG4gICAgICByZXF1aXJlKFwiQGJhYmVsL3BsdWdpbi1zeW50YXgtcGlwZWxpbmUtb3BlcmF0b3JcIiksXG4gICAgICB7IHByb3Bvc2FsOiBcIm1pbmltYWxcIiB9LFxuICAgIF0sXG4gICAgcmVxdWlyZShcIkBiYWJlbC9wbHVnaW4tc3ludGF4LXRocm93LWV4cHJlc3Npb25zXCIpLFxuICAgIC8vIEV2ZW4gdGhvdWdoIEJhYmVsIGNhbiBwYXJzZSB0eXBlc2NyaXB0LCBJIGNhbid0IGhhdmUgaXQgYW5kIGZsb3dcbiAgICAvLyBlbmFibGVkIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAgLy8gXCJAYmFiZWwvcGx1Z2luLXN5bnRheC10eXBlc2NyaXB0XCIsXG4gIF0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZUNvZGUoY29kZTogc3RyaW5nLCBiYWJlbENvbmZpZzogP09iamVjdCk6IEluZm8ge1xuICBjb25zdCB7IHRyYXZlcnNlLCB0eXBlczogdCB9ID0gcmVxdWlyZShcIkBiYWJlbC9jb3JlXCIpXG4gIGNvbnN0IHsgcGFyc2VTeW5jIH0gPSByZXF1aXJlKFwiQGJhYmVsL2NvcmVcIilcbiAgbGV0IGFzdCA9IHVuZGVmaW5lZFxuXG4gIHRyeSB7XG4gICAgYXN0ID0gcGFyc2VTeW5jKGNvZGUsIGJhYmVsQ29uZmlnIHx8IG1ha2VEZWZhdWx0Q29uZmlnKCkpXG4gIH0gY2F0Y2ggKHBhcnNlRXJyb3IpIHtcbiAgICBkZWJ1ZyhcInBhcnNlRXJyb3JcIiwgcGFyc2VFcnJvcilcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIHJldHVybiB7IHR5cGU6IFwicGFyc2UtZXJyb3JcIiwgcGFyc2VFcnJvciB9XG4gIH1cblxuICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShhc3QsIG51bGwsIDQpKVxuXG4gIGNvbnN0IHNjb3BlcyA9IFtdXG4gIGNvbnN0IGV4dGVybmFsTW9kdWxlcyA9IFtdXG4gIGNvbnN0IGV4cG9ydHMgPSB7fVxuICBjb25zdCBwYXRocyA9IFtdXG5cbiAgY29uc3QgYWRkTW9kdWxlID0gKG1vZHVsZU5hbWUsIGlkZW50aWZpZXIsIGltcG9ydGVkID0gXCJkZWZhdWx0XCIpID0+IHtcbiAgICBleHRlcm5hbE1vZHVsZXMucHVzaCh7XG4gICAgICBsb2NhbDogaWRlbnRpZmllci5uYW1lLFxuICAgICAgc3RhcnQ6IGlkZW50aWZpZXIuc3RhcnQsXG4gICAgICBlbmQ6IGlkZW50aWZpZXIuZW5kLFxuICAgICAgbW9kdWxlTmFtZSxcbiAgICAgIGltcG9ydGVkLFxuICAgIH0pXG4gIH1cbiAgY29uc3QgYWRkVW5ib3VuZE1vZHVsZSA9IChcbiAgICBtb2R1bGVOYW1lLFxuICAgIGlkZW50aWZpZXIsXG4gICAgaW1wb3J0ZWQgPSBpZGVudGlmaWVyLm5hbWUsXG4gICkgPT4ge1xuICAgIHBhdGhzLnB1c2goe1xuICAgICAgaW1wb3J0ZWQsXG4gICAgICBtb2R1bGVOYW1lLFxuICAgICAgcmFuZ2U6IHtcbiAgICAgICAgc3RhcnQ6IGlkZW50aWZpZXIuc3RhcnQsXG4gICAgICAgIGVuZDogaWRlbnRpZmllci5lbmQsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBpc01vZHVsZURvdEV4cG9ydHMgPSBub2RlID0+XG4gICAgdC5pc01lbWJlckV4cHJlc3Npb24obm9kZSkgJiZcbiAgICB0LmlzSWRlbnRpZmllcihub2RlLm9iamVjdCwgeyBuYW1lOiBcIm1vZHVsZVwiIH0pICYmXG4gICAgdC5pc0lkZW50aWZpZXIobm9kZS5wcm9wZXJ0eSwgeyBuYW1lOiBcImV4cG9ydHNcIiB9KVxuXG4gIGNvbnN0IHZpc2l0b3JzID0ge1xuICAgIFNjb3BlKHsgc2NvcGUgfSkge1xuICAgICAgc2NvcGVzLnB1c2goc2NvcGUpXG4gICAgfSxcbiAgICBDYWxsRXhwcmVzc2lvbih7IG5vZGUsIHBhcmVudCB9KSB7XG4gICAgICAvLyBgaW1wb3J0KClgIGlzIGFuIG9wZXJhdG9yLCBub3QgYSBmdW5jdGlvbi5cbiAgICAgIC8vIGBpc0lkZW50aWZpZXJgIGRvZXNuJ3Qgd29yayBoZXJlLlxuICAgICAgLy8gaHR0cDovLzJhbGl0eS5jb20vMjAxNy8wMS9pbXBvcnQtb3BlcmF0b3IuaHRtbFxuICAgICAgY29uc3QgaXNJbXBvcnQgPSBub2RlLmNhbGxlZS50eXBlID09PSBcIkltcG9ydFwiXG5cbiAgICAgIGNvbnN0IGlzUmVxdWlyZSA9IHQuaXNJZGVudGlmaWVyKG5vZGUuY2FsbGVlLCB7IG5hbWU6IFwicmVxdWlyZVwiIH0pXG5cbiAgICAgIGNvbnN0IGlzUmVxdWlyZVJlc29sdmUgPVxuICAgICAgICB0LmlzTWVtYmVyRXhwcmVzc2lvbihub2RlLmNhbGxlZSwgeyBjb21wdXRlZDogZmFsc2UgfSkgJiZcbiAgICAgICAgdC5pc0lkZW50aWZpZXIobm9kZS5jYWxsZWUub2JqZWN0LCB7IG5hbWU6IFwicmVxdWlyZVwiIH0pICYmXG4gICAgICAgIHQuaXNJZGVudGlmaWVyKG5vZGUuY2FsbGVlLnByb3BlcnR5LCB7IG5hbWU6IFwicmVzb2x2ZVwiIH0pXG5cbiAgICAgIGlmIChpc0ltcG9ydCB8fCBpc1JlcXVpcmUgfHwgaXNSZXF1aXJlUmVzb2x2ZSkge1xuICAgICAgICBpZiAodC5pc0xpdGVyYWwobm9kZS5hcmd1bWVudHNbMF0pKSB7XG4gICAgICAgICAgbGV0IG1vZHVsZU5hbWVcbiAgICAgICAgICBjb25zdCBhcmcgPSBub2RlLmFyZ3VtZW50c1swXVxuICAgICAgICAgIGlmICh0LmlzTGl0ZXJhbChhcmcpKSB7XG4gICAgICAgICAgICBtb2R1bGVOYW1lID0gYXJnLnZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG1vZHVsZU5hbWUgPT0gbnVsbCAmJlxuICAgICAgICAgICAgdC5pc1RlbXBsYXRlTGl0ZXJhbChhcmcpICYmXG4gICAgICAgICAgICBhcmcucXVhc2lzLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgY29uc3QgcXVhc2kgPSBhcmcucXVhc2lzWzBdXG4gICAgICAgICAgICBtb2R1bGVOYW1lID0gcXVhc2kudmFsdWUuY29va2VkXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHsgaWQgfSA9IHBhcmVudFxuXG4gICAgICAgICAgaWYgKG1vZHVsZU5hbWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0LmlzQXNzaWdubWVudEV4cHJlc3Npb24ocGFyZW50KSAmJlxuICAgICAgICAgICAgICBpc01vZHVsZURvdEV4cG9ydHMocGFyZW50LmxlZnQpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgYWRkVW5ib3VuZE1vZHVsZShtb2R1bGVOYW1lLCBwYXJlbnQubGVmdCwgXCJkZWZhdWx0XCIpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhdGhzLnB1c2goe1xuICAgICAgICAgICAgICBpbXBvcnRlZDogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgICAgIHJhbmdlOiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IG5vZGUuYXJndW1lbnRzWzBdLnN0YXJ0LFxuICAgICAgICAgICAgICAgIGVuZDogbm9kZS5hcmd1bWVudHNbMF0uZW5kLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKHQuaXNJZGVudGlmaWVyKGlkKSkge1xuICAgICAgICAgICAgICBhZGRNb2R1bGUobW9kdWxlTmFtZSwgaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodC5pc09iamVjdFBhdHRlcm4oaWQpIHx8IHQuaXNBcnJheVBhdHRlcm4oaWQpKSB7XG4gICAgICAgICAgICAgIGZpbmRJZGVudGlmaWVycyhpZCkuZm9yRWFjaChpZGVudGlmaWVyID0+IHtcbiAgICAgICAgICAgICAgICBhZGRNb2R1bGUobW9kdWxlTmFtZSwgaWRlbnRpZmllcilcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIEltcG9ydERlY2xhcmF0aW9uKHsgbm9kZSB9KSB7XG4gICAgICBpZiAodC5pc0xpdGVyYWwobm9kZS5zb3VyY2UpKSB7XG4gICAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSBub2RlLnNvdXJjZS52YWx1ZVxuICAgICAgICBub2RlLnNwZWNpZmllcnMuZm9yRWFjaCgoeyBsb2NhbCwgaW1wb3J0ZWQgfSkgPT4ge1xuICAgICAgICAgIGxldCBpbXBvcnRlZE5hbWUgPSBcImRlZmF1bHRcIlxuICAgICAgICAgIGlmIChpbXBvcnRlZCAhPSBudWxsKSB7XG4gICAgICAgICAgICBhZGRVbmJvdW5kTW9kdWxlKG1vZHVsZU5hbWUsIGltcG9ydGVkKVxuICAgICAgICAgICAgaW1wb3J0ZWROYW1lID0gaW1wb3J0ZWQubmFtZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGFkZE1vZHVsZShtb2R1bGVOYW1lLCBsb2NhbCwgaW1wb3J0ZWROYW1lKVxuICAgICAgICB9KVxuICAgICAgICBwYXRocy5wdXNoKHtcbiAgICAgICAgICBpbXBvcnRlZDogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgc3RhcnQ6IG5vZGUuc291cmNlLnN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBub2RlLnNvdXJjZS5lbmQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbih7IG5vZGUgfSkge1xuICAgICAgY29uc3QgeyBkZWNsYXJhdGlvbiB9ID0gbm9kZVxuXG4gICAgICBpZiAodC5pc0lkZW50aWZpZXIoZGVjbGFyYXRpb24pKSB7XG4gICAgICAgIGV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICAgICAgICBzdGFydDogZGVjbGFyYXRpb24uc3RhcnQsXG4gICAgICAgICAgZW5kOiBkZWNsYXJhdGlvbi5lbmQsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICAgICAgc3RhcnQ6IG5vZGUuc3RhcnQsXG4gICAgICAgIGVuZDogbm9kZS5lbmQsXG4gICAgICB9XG4gICAgfSxcbiAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uKHsgbm9kZSB9KSB7XG4gICAgICBjb25zdCB7IHNwZWNpZmllcnMsIGRlY2xhcmF0aW9uIH0gPSBub2RlXG5cbiAgICAgIGNvbnN0IG1vZHVsZU5hbWUgPSB0LmlzTGl0ZXJhbChub2RlLnNvdXJjZSlcbiAgICAgICAgPyBub2RlLnNvdXJjZS52YWx1ZVxuICAgICAgICA6IHVuZGVmaW5lZFxuXG4gICAgICBzcGVjaWZpZXJzLmZvckVhY2goc3BlYyA9PiB7XG4gICAgICAgIGlmICh0LmlzRXhwb3J0U3BlY2lmaWVyKHNwZWMpKSB7XG4gICAgICAgICAgY29uc3QgeyBuYW1lLCBzdGFydCwgZW5kIH0gPSBzcGVjLmV4cG9ydGVkXG4gICAgICAgICAgZXhwb3J0c1tuYW1lXSA9IHsgc3RhcnQsIGVuZCB9XG5cbiAgICAgICAgICAvLyBleHBvcnQgLi4uIGZyb20gZG9lcyBub3QgY3JlYXRlIGEgbG9jYWwgYmluZGluZywgc28gSSdtXG4gICAgICAgICAgLy8gZ2F0aGVyaW5nIGl0IGluIHRoZSBwYXRocy4gYnVpbGQtc3VnZ2VzdGlvbiB3aWxsIGNvbnZlcnRcbiAgICAgICAgICAvLyBpdCBiYWNrIHRvIGEgYGZyb20tbW9kdWxlYFxuICAgICAgICAgIGlmIChtb2R1bGVOYW1lICYmIHQuaXNJZGVudGlmaWVyKHNwZWMubG9jYWwpKSB7XG4gICAgICAgICAgICBhZGRVbmJvdW5kTW9kdWxlKG1vZHVsZU5hbWUsIHNwZWMubG9jYWwpXG4gICAgICAgICAgICAvLyBwYXRocy5wdXNoKHtcbiAgICAgICAgICAgIC8vICAgICBpbXBvcnRlZDogc3BlYy5sb2NhbC5uYW1lLFxuICAgICAgICAgICAgLy8gICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgICAvLyAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgIC8vICAgICAgICAgc3RhcnQ6IHNwZWMubG9jYWwuc3RhcnQsXG4gICAgICAgICAgICAvLyAgICAgICAgIGVuZDogc3BlYy5sb2NhbC5lbmQsXG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodC5pc0V4cG9ydERlZmF1bHRTcGVjaWZpZXIoc3BlYykpIHtcbiAgICAgICAgICBjb25zdCB7IG5hbWUsIHN0YXJ0LCBlbmQgfSA9IHNwZWMuZXhwb3J0ZWRcbiAgICAgICAgICBleHBvcnRzW25hbWVdID0geyBzdGFydCwgZW5kIH1cblxuICAgICAgICAgIGlmIChtb2R1bGVOYW1lKSB7XG4gICAgICAgICAgICBwYXRocy5wdXNoKHtcbiAgICAgICAgICAgICAgaW1wb3J0ZWQ6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgICBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgICByYW5nZToge1xuICAgICAgICAgICAgICAgIHN0YXJ0OiBzcGVjLmV4cG9ydGVkLnN0YXJ0LFxuICAgICAgICAgICAgICAgIGVuZDogc3BlYy5leHBvcnRlZC5lbmQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgaWYgKHQuaXNWYXJpYWJsZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSkge1xuICAgICAgICBkZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoeyBpZCB9KSA9PiB7XG4gICAgICAgICAgZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zLmZvckVhY2hcbiAgICAgICAgICBmaW5kSWRlbnRpZmllcnMoaWQpLmZvckVhY2goKHsgbmFtZSwgc3RhcnQsIGVuZCB9KSA9PiB7XG4gICAgICAgICAgICBleHBvcnRzW25hbWVdID0geyBzdGFydCwgZW5kIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIHQuaXNGdW5jdGlvbkRlY2xhcmF0aW9uKGRlY2xhcmF0aW9uKSB8fFxuICAgICAgICB0LmlzVHlwZUFsaWFzKGRlY2xhcmF0aW9uKSB8fFxuICAgICAgICB0LmlzSW50ZXJmYWNlRGVjbGFyYXRpb24oZGVjbGFyYXRpb24pXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgeyBuYW1lLCBzdGFydCwgZW5kIH0gPSBkZWNsYXJhdGlvbi5pZFxuICAgICAgICBleHBvcnRzW25hbWVdID0geyBzdGFydCwgZW5kIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1vZHVsZU5hbWUpIHtcbiAgICAgICAgcGF0aHMucHVzaCh7XG4gICAgICAgICAgaW1wb3J0ZWQ6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgIHN0YXJ0OiBub2RlLnNvdXJjZS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogbm9kZS5zb3VyY2UuZW5kLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSxcbiAgICBFeHBvcnRBbGxEZWNsYXJhdGlvbih7IG5vZGUgfSkge1xuICAgICAgaWYgKHQuaXNMaXRlcmFsKG5vZGUuc291cmNlKSkge1xuICAgICAgICBjb25zdCBtb2R1bGVOYW1lID0gbm9kZS5zb3VyY2UudmFsdWVcbiAgICAgICAgcGF0aHMucHVzaCh7XG4gICAgICAgICAgaW1wb3J0ZWQ6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgIG1vZHVsZU5hbWUsXG4gICAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgIHN0YXJ0OiBub2RlLnNvdXJjZS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogbm9kZS5zb3VyY2UuZW5kLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSxcbiAgICBBc3NpZ25tZW50RXhwcmVzc2lvbih7IG5vZGUgfSkge1xuICAgICAgaWYgKGlzTW9kdWxlRG90RXhwb3J0cyhub2RlLmxlZnQpKSB7XG4gICAgICAgIGV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgICAgICAgICBzdGFydDogbm9kZS5sZWZ0LnN0YXJ0LFxuICAgICAgICAgIGVuZDogbm9kZS5sZWZ0LmVuZCxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gIH1cblxuICB0cnkge1xuICAgIHRyYXZlcnNlKGFzdCwgdmlzaXRvcnMpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBkZWJ1ZyhcIkVycm9yIHRyYXZlcnNpbmdcIiwgZSlcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChlW3BhcnNlRXJyb3JUYWddKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInBhcnNlLWVycm9yXCIsIHBhcnNlRXJyb3I6IGUgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvKiBUaGlzIHNob3VsZCBuZXZlciB0cmlnZ2VyLCBpdCBqdXN0IHJldGhyb3dzIHVuZXhwZWN0ZWQgZXJyb3JzICovXG4gICAgICB0aHJvdyBlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBcImluZm9cIixcbiAgICBzY29wZXMsXG4gICAgLy8gQ2Fubm90IHJldHVybiBvYmplY3QgbGl0ZXJhbCBiZWNhdXNlIHBvc3NpYmx5IHVuaW5pdGlhbGl6ZWQgdmFyaWFibGUgWzFdXG4gICAgLy8gaXMgaW5jb21wYXRpYmxlIHdpdGggc3RyaW5nIFsyXSBpbiBwcm9wZXJ0eSBtb2R1bGVOYW1lIG9mIGFycmF5IGVsZW1lbnRcbiAgICAvLyBvZiBwcm9wZXJ0eSBleHRlcm5hbE1vZHVsZXMuIC0gJEZsb3dGaXhNZVxuICAgIGV4dGVybmFsTW9kdWxlcyxcbiAgICBleHBvcnRzLFxuICAgIHBhdGhzLFxuICB9XG59XG4iXX0=