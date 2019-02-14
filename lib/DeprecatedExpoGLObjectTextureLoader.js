"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _webgltextureLoader = require("webgltexture-loader");

var _reactNative = require("react-native");

var _expo = require("expo");

var _expo2 = _interopRequireDefault(_expo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var neverEnding = new Promise(function () {});

var available = !!(_reactNative.NativeModules.ExponentGLObjectManager && _reactNative.NativeModules.ExponentGLObjectManager.createObjectAsync);

var warned = false;

var ExpoGLObjectTextureLoader = function (_WebGLTextureLoaderAs) {
  _inherits(ExpoGLObjectTextureLoader, _WebGLTextureLoaderAs);

  function ExpoGLObjectTextureLoader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ExpoGLObjectTextureLoader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ExpoGLObjectTextureLoader.__proto__ || Object.getPrototypeOf(ExpoGLObjectTextureLoader)).call.apply(_ref, [this].concat(args))), _this), _this.objIds = new WeakMap(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ExpoGLObjectTextureLoader, [{
    key: "canLoad",
    value: function canLoad(input) {
      if (!available && !warned) {
        warned = true;
        console.log("webgltexture-loader-expo: ExponentGLObjectManager.createObjectAsync is not available. Make sure to use the correct version of Expo");
      }
      return available && (typeof input === "undefined" ? "undefined" : _typeof(input)) === "object";
    }
  }, {
    key: "disposeTexture",
    value: function disposeTexture(texture) {
      var exglObjId = this.objIds.get(texture);
      if (exglObjId) {
        _reactNative.NativeModules.ExponentGLObjectManager.destroyObjectAsync(exglObjId);
      }
      this.objIds.delete(texture);
    }
  }, {
    key: "inputHash",
    value: function inputHash(config) {
      // JSON.stringify is a quick way to hash the config object
      return JSON.stringify(config);
    }
  }, {
    key: "loadNoCache",
    value: function loadNoCache(config) {
      var _this2 = this;

      var gl = this.gl;
      // $FlowFixMe

      var exglCtxId = gl.__exglCtxId;

      var disposed = false;
      var dispose = function dispose() {
        disposed = true;
      };
      var promise = _reactNative.NativeModules.ExponentGLObjectManager.createObjectAsync({
        exglCtxId: exglCtxId,
        texture: config
      }).then(function (_ref2) {
        var exglObjId = _ref2.exglObjId;

        if (disposed) return neverEnding;
        // $FlowFixMe
        var texture = new WebGLTexture(exglObjId);
        _this2.objIds.set(texture, exglObjId);
        var width = 0;
        var height = 0;
        // ^ unfortunately there is no way to retrieve these
        return { texture: texture, width: width, height: height };
      });
      return { promise: promise, dispose: dispose };
    }
  }]);

  return ExpoGLObjectTextureLoader;
}(_webgltextureLoader.WebGLTextureLoaderAsyncHashCache);

ExpoGLObjectTextureLoader.priority = -200;


_webgltextureLoader.globalRegistry.add(ExpoGLObjectTextureLoader);

exports.default = ExpoGLObjectTextureLoader;
//# sourceMappingURL=DeprecatedExpoGLObjectTextureLoader.js.map