(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.tag = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _private$appenders;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var _public = {};
  var _private = {};

  var APPENDER_PREFIX = 'appender';

  /**
   * Tag names
   * Reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element
   * @type {Array}
   */
  _private.tagNames = ['a', 'abbr', 'address', 'area', 'article', 'audio', 'b', 'base', 'bdi', 'bdo', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'];

  /**
   * Properties appender functions
   * @type {Object}
   */
  _private.propertiesAppenders = _defineProperty({
    events: function events(element, property, _events) {
      for (var eventName in _events) {
        element.addEventListener(eventName, _events[eventName]);
      }
    },
    className: function className(element, property, value) {
      value = value.constructor.name === 'String' ? value.split(' ') : value;

      element.classList.add.apply(element.classList, value);
    },
    style: function style(element, property, styles) {
      for (var prop in styles) {
        element.style[prop] = styles[prop];
      }
    }
  }, APPENDER_PREFIX + 'Default', function (element, property, value) {
    element.setAttribute(property, value);
  });

  /**
   * Appender functions
   * @type {Object}
   */
  _private.appenders = (_private$appenders = {}, _defineProperty(_private$appenders, APPENDER_PREFIX + 'Object', function (element, arg) {
    var propertyType;

    for (var value in arg) {
      propertyType = typeof _private.propertiesAppenders[value] === 'function' ? value : APPENDER_PREFIX + 'Default';

      _private.propertiesAppenders[propertyType](element, value, arg[value]);
    }
  }), _defineProperty(_private$appenders, APPENDER_PREFIX + 'String', function (element, arg) {
    element.appendChild(document.createTextNode(arg));
  }), _defineProperty(_private$appenders, APPENDER_PREFIX + 'Function', function (element, arg) {
    element.appendChild(arg());
  }), _defineProperty(_private$appenders, APPENDER_PREFIX + 'Array', function (element, arg) {
    arg.forEach(function (value) {
      element.appendChild(value);
    });
  }), _defineProperty(_private$appenders, APPENDER_PREFIX + 'Default', function (element, arg) {
    element.appendChild(arg);
  }), _private$appenders);

  /**
   * Builder element
   * @param  {String}     name
   * @param  {Arguments}  attr
   *
   * @return {HTMLObject} builded element
   */
  _private.builderElement = function (name, attrs) {
    var element = document.createElement(name),
        appenderName;

    Array.prototype.forEach.call(attrs, function (arg) {
      if (arg === undefined || arg === null || !arg.constructor) {
        throw new Error('Invalid object tag was provided. Please, fix your template!');
      }

      arg = _private.normalizeArg(arg);

      appenderName = typeof _private.appenders[APPENDER_PREFIX + arg.constructor.name] === 'function' ? arg.constructor.name : 'Default';

      _private.appenders[APPENDER_PREFIX + appenderName](element, arg);
    });

    return element;
  };

  /**
   * Normalize argument
   * @param  {*} arg
   *
   * @return {*}     normalized argument
   */
  _private.normalizeArg = function (arg) {
    return arg.constructor.name === 'Number' ? arg.toString() : arg;
  };

  _private.tagNames.forEach(function (tagName) {
    _public[tagName] = function () {
      return _private.builderElement(tagName, arguments);
    };
  });

  module.exports = _public;
});