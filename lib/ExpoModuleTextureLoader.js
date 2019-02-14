"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadAsset = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _webgltextureLoader = require("webgltexture-loader");

var _reactNative = require("react-native");

var _expo = require("expo");

var _md = require("./md5");

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var neverEnding = new Promise(function () {});

var hash = function hash(module) {
  return typeof module === "number" ? module : module.uri;
};

var localAsset = function localAsset(module) {
  var asset = _expo.Asset.fromModule(module);
  return asset.downloadAsync().then(function () {
    return asset;
  });
};

var remoteAssetCache = {};

var remoteAsset = function remoteAsset(uri) {
  var i = uri.lastIndexOf(".");
  var ext = i !== -1 ? uri.slice(i) : ".jpg";
  var key = (0, _md2.default)(uri);
  if (key in remoteAssetCache) {
    return Promise.resolve(remoteAssetCache[key]);
  }
  var promise = Promise.all([new Promise(function (success, failure) {
    return _reactNative.Image.getSize(uri, function (width, height) {
      return success({ width: width, height: height });
    }, failure);
  }), _expo.FileSystem.downloadAsync(uri, _expo.FileSystem.documentDirectory + ("ExponentAsset-" + key + ext), {
    cache: true
  })]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        size = _ref2[0],
        asset = _ref2[1];

    return _extends({}, size, { uri: uri, localUri: asset.uri });
  });
  remoteAssetCache[key] = promise;
  return promise;
};

var localFile = function localFile(uri) {
  var i = uri.lastIndexOf(".");
  var ext = i !== -1 ? uri.slice(i) : ".jpg";
  var key = (0, _md2.default)(uri);
  if (key in remoteAssetCache) {
    return Promise.resolve(remoteAssetCache[key]);
  }
  var promise = new Promise(function (success, failure) {
    return _reactNative.Image.getSize(uri, function (width, height) {
      return success({ width: width, height: height });
    }, failure);
  }).then(function (size) {
    return _extends({}, size, { uri: uri, localUri: uri });
  });
  remoteAssetCache[key] = promise;
  return promise;
};

var loadAsset = exports.loadAsset = function loadAsset(module) {
  return typeof module === "number" ? localAsset(module) : module.uri.startsWith("file:") || module.uri.startsWith("data:") ? localFile(module.uri) : remoteAsset(module.uri);
};

var ExpoModuleTextureLoader = function (_WebGLTextureLoaderAs) {
  _inherits(ExpoModuleTextureLoader, _WebGLTextureLoaderAs);

  function ExpoModuleTextureLoader() {
    var _ref3;

    var _temp, _this, _ret;

    _classCallCheck(this, ExpoModuleTextureLoader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = ExpoModuleTextureLoader.__proto__ || Object.getPrototypeOf(ExpoModuleTextureLoader)).call.apply(_ref3, [this].concat(args))), _this), _this.objIds = new WeakMap(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ExpoModuleTextureLoader, [{
    key: "canLoad",
    value: function canLoad(input) {
      return typeof input === "number" || input && (typeof input === "undefined" ? "undefined" : _typeof(input)) === "object" && typeof input.uri === "string";
    }
  }, {
    key: "inputHash",
    value: function inputHash(module) {
      return typeof module === "number" ? module : module.uri;
    }
  }, {
    key: "loadNoCache",
    value: function loadNoCache(module) {
      var gl = this.gl;

      var disposed = false;
      var dispose = function dispose() {
        disposed = true;
      };
      var promise = loadAsset(module).then(function (asset) {
        if (disposed) return neverEnding;
        var width = asset.width,
            height = asset.height;

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // $FlowFixMe
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, asset);
        return { texture: texture, width: width, height: height };
      });
      return { promise: promise, dispose: dispose };
    }
  }]);

  return ExpoModuleTextureLoader;
}(_webgltextureLoader.WebGLTextureLoaderAsyncHashCache);

_webgltextureLoader.globalRegistry.add(ExpoModuleTextureLoader);

exports.default = ExpoModuleTextureLoader;
//# sourceMappingURL=ExpoModuleTextureLoader.js.map