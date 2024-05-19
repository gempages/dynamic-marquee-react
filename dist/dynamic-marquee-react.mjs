import React, { useState, useRef, useLayoutEffect, useEffect, Children } from 'react';
import { createPortal } from 'react-dom';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * A boundary represents everything below a given point in the call stack.
 *
 * It can have an `onEnter` function which is called on entry and an `onExit`
 * function which is called on exit.
 *
 * To enter the boundry call `enter` with the function you want to run inside
 * it. On the first call to `enter` in the current stack `onEnter` will be
 * called before the provided function and `onExit` will be called after it.
 *
 * Nested `enter` calls will be called immediately.
 *
 * The function provided to `enter` will receive the return value from `onEnter`
 * as the first argument. This will be `undefined` if the `onEnter` function is still
 * executing.
 *
 * `onExit` will receive the the return value from `onEnter` and also the exception
 * if one is thrown from an `enter` call. It can choose to handle it, or leave it
 * to be rethrown.
 */
var Boundary = /** @class */ (function () {
    /**
     * Takes an object with the following properties:
     * - onEnter (optional): A function that is called immediately before the boundary
     *                       is entered. It must not call `enter` on the boundary.
     * - onExit (optional): A function that is called immediately after leaving the
     *                      boundary. It receives an object that contains the following
     *                      properties:
     *                      - onEnterResult: The return value from `onEnter`. This will be
     *                                       `undefined` if `onEnter` threw an exception.
     *                      - exceptionOccurred: `true` if an exception occured inside
     *                                           the boundary.
     *                      - retrieveException: A function that returns the exception
     *                                           that occurred. Calling this will prevent
     *                                           the exception being thrown from `enter()`.
     *                                           Rethrow it if you don't want to handle it
     *                                           yourself.
     *                      If an exception occurs inside the boundary this will still
     *                      be called, and the exception will be rethrown, unless you call
     *                      `retrieveException`.
     */
    function Boundary(_a) {
        var _b = _a === void 0 ? {} : _a, onEnter = _b.onEnter, onExit = _b.onExit;
        this._execution = null;
        this.inBoundary = this.inBoundary.bind(this);
        this.enter = this.enter.bind(this);
        this._onEnter = onEnter || null;
        this._onExit = onExit || null;
    }
    /**
     * Returns `true` if called from within the boundary. This includes the `onEnter`
     * callback.
     */
    Boundary.prototype.inBoundary = function () {
        return !!this._execution;
    };
    Boundary.prototype.enter = function (fn) {
        if (this._execution) {
            return fn ? fn(this._execution.onEnterResult) : undefined;
        }
        var execution = (this._execution = {
            onEnterResult: undefined,
        });
        var returnVal = undefined;
        var exceptionOccurred = false;
        var exception = undefined;
        try {
            if (this._onEnter) {
                execution.onEnterResult = this._onEnter();
            }
            if (fn) {
                returnVal = fn(execution.onEnterResult);
            }
        }
        catch (e) {
            exceptionOccurred = true;
            exception = e;
        }
        this._execution = null;
        var exceptionHandled = !exceptionOccurred;
        if (this._onExit) {
            try {
                this._onExit({
                    onEnterResult: execution.onEnterResult,
                    exceptionOccurred: exceptionOccurred,
                    retrieveException: function () {
                        exceptionHandled = true;
                        return exception;
                    },
                });
            }
            catch (e) {
                if (exceptionHandled) {
                    // if an error occured before onExit prioritise that one
                    // (similar to how `finally` works)
                    throw e;
                }
            }
        }
        if (!exceptionHandled) {
            throw exception;
        }
        return returnVal;
    };
    return Boundary;
}());

var DIRECTION = {
  RIGHT: 'right',
  DOWN: 'down'
};

function deferException$1(callback) {
  try {
    return callback();
  } catch (e) {
    window.setTimeout(function () {
      throw e;
    }, 0);
  }
}
function Listeners() {
  var listeners = [];
  return {
    add: function add(listener) {
      listeners.push(listener);
      return function () {
        var index = listeners.indexOf(listener);
        if (index >= 0) listeners.splice(index, 1);
      };
    },
    invoke: function invoke() {
      [].concat(listeners).forEach(function (callback) {
        return deferException$1(function () {
          return callback();
        });
      });
    }
  };
}

var PX_REGEX = /px$/;
function pxStringToValue(input) {
  if (!PX_REGEX.test(input)) {
    throw new Error('String missing `px` suffix');
  }
  return parseFloat(input.slice(0, -2));
}
var SizeWatcher = /*#__PURE__*/function () {
  function SizeWatcher($el) {
    var _this = this,
      _this$_observer;
    _classCallCheck(this, SizeWatcher);
    var listeners = Listeners();
    this.onSizeChange = listeners.add;
    this._$el = $el;
    this._width = null;
    this._height = null;
    this._observer = 'ResizeObserver' in window ? new ResizeObserver(function (entries) {
      var entry = entries[entries.length - 1];
      var size = entry.borderBoxSize[0] || entry.borderBoxSize;
      _this._width = size.inlineSize;
      _this._height = size.blockSize;
      listeners.invoke();
    }) : null;
    (_this$_observer = this._observer) === null || _this$_observer === void 0 || _this$_observer.observe($el);
  }
  return _createClass(SizeWatcher, [{
    key: "getWidth",
    value: function getWidth() {
      if (this._width !== null) return this._width;

      // maps to `inlineSize`
      var width = pxStringToValue(window.getComputedStyle(this._$el).width);
      if (this._observer) this._width = width;
      return width;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      if (this._height !== null) return this._height;

      // maps to `blockSize`
      var height = pxStringToValue(window.getComputedStyle(this._$el).height);
      if (this._observer) this._height = height;
      return height;
    }
  }, {
    key: "tearDown",
    value: function tearDown() {
      var _this$_observer2;
      (_this$_observer2 = this._observer) === null || _this$_observer2 === void 0 || _this$_observer2.disconnect();
      this._observer = null;
    }
  }]);
}();

var Item = /*#__PURE__*/function () {
  function Item(_ref) {
    var $el = _ref.$el,
      direction = _ref.direction,
      metadata = _ref.metadata,
      snapToNeighbor = _ref.snapToNeighbor;
    _classCallCheck(this, Item);
    var $container = document.createElement('div');
    $container.style.all = 'unset';
    $container.style.display = 'block';
    $container.style.opacity = '0';
    $container.style.pointerEvents = 'none';
    $container.style.position = 'absolute';
    if (direction === DIRECTION.RIGHT) {
      $container.style.whiteSpace = 'nowrap';
    } else {
      $container.style.left = '0';
      $container.style.right = '0';
    }
    $container.setAttribute('aria-hidden', 'true');
    this._sizeWatcher = new SizeWatcher($container);
    this.onSizeChange = this._sizeWatcher.onSizeChange;
    $container.appendChild($el);
    this._$container = $container;
    this._$el = $el;
    this._direction = direction;
    this._metadata = metadata;
    this._snapToNeighbor = snapToNeighbor;
    this._offset = null;
  }
  return _createClass(Item, [{
    key: "getSize",
    value: function getSize() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref2$inverse = _ref2.inverse,
        inverse = _ref2$inverse === void 0 ? false : _ref2$inverse;
      var dir = this._direction;
      if (inverse) {
        dir = dir === DIRECTION.RIGHT ? DIRECTION.DOWN : DIRECTION.RIGHT;
      }
      return dir === DIRECTION.RIGHT ? this._sizeWatcher.getWidth() : this._sizeWatcher.getHeight();
    }
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      if (this._offset === offset) return;
      this._offset = offset;
      this._$container.style.removeProperty('opacity');
      this._$container.style.removeProperty('pointer-events');
      this._$container.removeAttribute('aria-hidden');
      if (this._direction === DIRECTION.RIGHT) {
        this._$container.style.left = "".concat(offset, "px");
      } else {
        this._$container.style.top = "".concat(offset, "px");
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      this._sizeWatcher.tearDown();
      this._$container.parentNode.removeChild(this._$container);
    }
  }, {
    key: "getContainer",
    value: function getContainer() {
      return this._$container;
    }
  }, {
    key: "getOriginalEl",
    value: function getOriginalEl() {
      return this._$el;
    }
  }, {
    key: "getMetadata",
    value: function getMetadata() {
      return this._metadata;
    }
  }, {
    key: "getSnapToNeighbor",
    value: function getSnapToNeighbor() {
      return this._snapToNeighbor;
    }
  }]);
}();

var transitionDuration = 30000;
var Slider = /*#__PURE__*/function () {
  function Slider($el, direction) {
    _classCallCheck(this, Slider);
    this._$el = $el;
    this._direction = direction;
    this._transitionState = null;
  }
  return _createClass(Slider, [{
    key: "setOffset",
    value: function setOffset(offset, rate, force) {
      var transitionState = this._transitionState;
      var rateChanged = !transitionState || transitionState.rate !== rate;
      if (transitionState && !force) {
        var timePassed = performance.now() - transitionState.time;
        if (timePassed < transitionDuration - 10000 && !rateChanged) {
          return;
        }
      }
      if (force || rateChanged) {
        if (this._direction === DIRECTION.RIGHT) {
          this._$el.style.transform = "translateX(".concat(offset, "px)");
        } else {
          this._$el.style.transform = "translateY(".concat(offset, "px)");
        }
        this._$el.style.transition = 'none';
        this._$el.offsetLeft;
      }
      if (rate && (force || rateChanged)) {
        this._$el.style.transition = "transform ".concat(transitionDuration, "ms linear");
      }
      if (rate) {
        var futureOffset = offset + rate / 1000 * transitionDuration;
        if (this._direction === DIRECTION.RIGHT) {
          this._$el.style.transform = "translateX(".concat(futureOffset, "px)");
        } else {
          this._$el.style.transform = "translateY(".concat(futureOffset, "px)");
        }
      }
      this._transitionState = {
        time: performance.now(),
        rate: rate
      };
    }
  }]);
}();

function defer(fn) {
  window.setTimeout(function () {
    return fn();
  }, 0);
}
function deferException(cb) {
  try {
    return cb();
  } catch (e) {
    defer(function () {
      throw e;
    });
  }
}
function toDomEl($el) {
  if (typeof $el === 'string' || typeof $el === 'number') {
    // helper. convert string to div
    var $div = document.createElement('div');
    $div.textContent = $el + '';
    return $div;
  }
  return $el;
}
function last(input) {
  return input.length ? input[input.length - 1] : null;
}
function first(input) {
  return input.length ? input[0] : null;
}

var maxTranslateDistance = 500000;
var renderInterval = 100;
var Marquee$1 = /*#__PURE__*/function () {
  function Marquee($container) {
    var _this = this;
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$rate = _ref.rate,
      rate = _ref$rate === void 0 ? -25 : _ref$rate,
      _ref$upDown = _ref.upDown,
      upDown = _ref$upDown === void 0 ? false : _ref$upDown,
      _ref$startOnScreen = _ref.startOnScreen,
      startOnScreen = _ref$startOnScreen === void 0 ? false : _ref$startOnScreen;
    _classCallCheck(this, Marquee);
    this._boundary = new Boundary({
      onEnter: function onEnter() {
        return {
          callbacks: []
        };
      },
      onExit: function onExit(_ref2) {
        var callbacks = _ref2.onEnterResult.callbacks;
        callbacks.forEach(function (cb) {
          return defer(function () {
            return cb();
          });
        });
      }
    });
    this._waitingForItem = true;
    this._askedForItem = true;
    this._nextAppendIsSynchronous = false;
    this._rate = rate;
    this._lastEffectiveRate = rate;
    this._justReversedRate = false;
    this._correlation = null;
    this._direction = upDown ? DIRECTION.DOWN : DIRECTION.RIGHT;
    this._startOnScreen = startOnScreen;
    this._onItemRequired = [];
    this._onItemRemoved = [];
    this._onAllItemsRemoved = [];
    this._windowOffset = 0;
    this._gapSize = 0;
    this._items = [];
    this._pendingItem = null;
    this._visible = !!document.hidden;
    this._waitingForRaf = false;
    var $window = document.createElement('div');
    $window.style.all = 'unset';
    $window.style.display = 'block';
    $window.style.overflow = 'hidden';
    $window.style.position = 'relative';
    if (this._direction === DIRECTION.DOWN) {
      $window.style.height = '100%';
    }
    this._$window = $window;
    this._containerSizeWatcher = new SizeWatcher($window);
    this._containerSizeWatcher.onSizeChange(function () {
      return _this._tickOnRaf();
    });
    this.windowInverseSize = null;
    this._updateWindowInverseSize();
    var $moving = document.createElement('div');
    this._$moving = $moving;
    $moving.style.all = 'unset';
    $moving.style.display = 'block';
    $moving.style.position = 'absolute';
    $moving.style.left = '0';
    $moving.style.right = '0';
    this._slider = new Slider($moving, this._direction);
    $window.appendChild($moving);
    $container.appendChild($window);
  }

  // called when there's room for a new item.
  // You can return the item to append next
  return _createClass(Marquee, [{
    key: "onItemRequired",
    value: function onItemRequired(cb) {
      this._onItemRequired.push(cb);
    }

    // Called when an item is removed
  }, {
    key: "onItemRemoved",
    value: function onItemRemoved(cb) {
      this._onItemRemoved.push(cb);
    }

    // Called when the last item is removed
  }, {
    key: "onAllItemsRemoved",
    value: function onAllItemsRemoved(cb) {
      this._onAllItemsRemoved.push(cb);
    }
  }, {
    key: "getNumItems",
    value: function getNumItems() {
      return this._items.length;
    }
  }, {
    key: "setRate",
    value: function setRate(rate) {
      if (rate === this._rate) {
        return;
      }
      if (rate * this._lastEffectiveRate < 0) {
        this._justReversedRate = !this._justReversedRate;
        // flip to false which will cause a new item to be asked for if necessary
        this._waitingForItem = this._askedForItem = false;
      }
      this._rate = rate;
      if (rate) {
        this._lastEffectiveRate = rate;
      }
      this._tick(true);
    }
  }, {
    key: "getRate",
    value: function getRate() {
      return this._rate;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this2 = this;
      this._boundary.enter(function () {
        _this2._items.forEach(function (_ref3) {
          var item = _ref3.item;
          return _this2._removeItem(item);
        });
        _this2._items = [];
        _this2._waitingForItem = true;
        _this2._askedForItem = true;
        _this2._nextAppendIsSynchronous = false;
        _this2._updateWindowInverseSize();
        _this2._cleanup();
      });
    }
  }, {
    key: "updateUI",
    value: function updateUI() {
      console.log(' this._items', this._items);
      // calculate what the new offsets should be given item sizes may have changed
      this._items.reduce(function (newOffset, item) {
        if (newOffset !== null) {
          item.offset = newOffset;
        }
        item.item.setOffset(item.offset);
        return item.offset + item.item.getSize();
      }, null);
    }
  }, {
    key: "isWaitingForItem",
    value: function isWaitingForItem() {
      return this._waitingForItem;
    }
  }, {
    key: "watchItemSize",
    value: function watchItemSize(elOrString) {
      var $el = toDomEl(elOrString);
      var item = new Item({
        $el: $el,
        direction: this._direction
      });
      this._$window.appendChild(item.getContainer());
      return {
        getSize: function getSize() {
          return item.getSize();
        },
        onSizeChange: item.onSizeChange,
        stopWatching: function stopWatching() {
          return item.remove();
        }
      };
    }
  }, {
    key: "appendItem",
    value: function appendItem(elOrString) {
      var _this3 = this;
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref4$metadata = _ref4.metadata,
        metadata = _ref4$metadata === void 0 ? null : _ref4$metadata,
        _ref4$snapToNeighbour = _ref4.snapToNeighbour,
        snapToNeighbour = _ref4$snapToNeighbour === void 0 ? false : _ref4$snapToNeighbour;
      this._boundary.enter(function () {
        if (!_this3._waitingForItem) {
          throw new Error('No room for item.');
        }
        var $el = toDomEl(elOrString);
        var itemAlreadyExists = _this3._items.some(function (_ref5) {
          var item = _ref5.item;
          return item.getOriginalEl() === $el;
        });
        if (itemAlreadyExists) {
          throw new Error('Item already exists.');
        }
        _this3._waitingForItem = false;
        _this3._askedForItem = false;
        var resolvedSnap = snapToNeighbour || _this3._startOnScreen && !_this3._items.length || _this3._nextAppendIsSynchronous;
        _this3._nextAppendIsSynchronous = false;
        _this3._pendingItem = new Item({
          $el: $el,
          direction: _this3._direction,
          metadata: metadata,
          snapToNeighbor: resolvedSnap
        });
        _this3._pendingItem.onSizeChange(function () {
          return _this3._tickOnRaf();
        });
        _this3._tick();
      });
    }

    /**
     * Returns the amount of pixels that need to be filled.
     *
     * If `snapToNeighbour` is `true` then this includes the empty space
     * after the neighbouring item.
     *
     * If `snapToNeighbour` is `false`, then this will just contain the buffer
     * space, unless the `startOnScreen` option is `true` and there are currently
     * no items.
     */
  }, {
    key: "getGapSize",
    value: function getGapSize() {
      var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        snapToNeighbour = _ref6.snapToNeighbour;
      if (!this._waitingForItem) return 0;
      var size;
      if (this._items.length) {
        size = snapToNeighbour ? this._gapSize : this._getBuffer();
      } else {
        size = this._startOnScreen || snapToNeighbour ? this._getContainerSize() + this._getBuffer() : this._getBuffer();
      }

      // if we're waiting for an item pretend it's at least 1 to handle cases like where we request for an item
      // but then the container size gets smalller meaning in reality the gap size becomes negative. If this happens
      // we don't flip from wanting an item to not wanting one so pretend there is some space.
      return Math.max(1, size);
    }
  }, {
    key: "_getContainerSize",
    value: function _getContainerSize() {
      // if container has size 0 pretend it is 1 to prevent infinite loop
      // of adding items that are instantly removed
      return Math.max(this._direction === DIRECTION.RIGHT ? this._containerSizeWatcher.getWidth() : this._containerSizeWatcher.getHeight(), 1);
    }
  }, {
    key: "_getBuffer",
    value: function _getBuffer() {
      return renderInterval / 1000 * Math.abs(this._rate);
    }
  }, {
    key: "_removeItem",
    value: function _removeItem(item) {
      var _this4 = this;
      this._boundary.enter(function (_ref7) {
        var callbacks = _ref7.callbacks;
        item.remove();
        _this4._items.splice(_this4._items.indexOf(item), 1);
        _this4._onItemRemoved.forEach(function (cb) {
          callbacks.push(function () {
            return cb(item.getOriginalEl());
          });
        });
      });
    }

    // update size of container so that the marquee items fit inside it.
    // This is needed because the items are posisitioned absolutely, so not in normal flow.
    // Without this, for DIRECTION.RIGHT, the height of the container would always be 0px, which is not useful
  }, {
    key: "_updateWindowInverseSize",
    value: function _updateWindowInverseSize() {
      if (this._direction === DIRECTION.DOWN) {
        return;
      }
      var maxSize = this._items.length ? Math.max.apply(Math, _toConsumableArray(this._items.map(function (_ref8) {
        var item = _ref8.item;
        return item.getSize({
          inverse: true
        });
      }))) : 0;
      if (this.windowInverseSize !== maxSize) {
        this.windowInverseSize = maxSize;
        this._$window.style.height = "".concat(maxSize, "px");
      }
    }
  }, {
    key: "_scheduleRender",
    value: function _scheduleRender() {
      var _this5 = this;
      if (!this._renderTimer) {
        // ideally we'd use requestAnimationFrame here but there's a bug in
        // chrome which means when the callback is called it triggers a style
        // recalculation even when nothing changes, which is not efficient
        // see https://bugs.chromium.org/p/chromium/issues/detail?id=1252311
        // and https://stackoverflow.com/q/69293778/1048589
        this._renderTimer = window.setTimeout(function () {
          return _this5._tick();
        }, renderInterval);
      }
    }
  }, {
    key: "_cleanup",
    value: function _cleanup() {
      this._correlation = null;
      this._windowOffset = 0;
    }
  }, {
    key: "_tickOnRaf",
    value: function _tickOnRaf() {
      var _this6 = this;
      if (!window.requestAnimationFrame || this._waitingForRaf) return;
      this._waitingForRaf = true;
      window.requestAnimationFrame(function () {
        _this6._waitingForRaf = false;
        _this6._tick();
      });
    }
  }, {
    key: "_tick",
    value: function _tick() {
      var _this7 = this;
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this._boundary.enter(function (_ref9) {
        var callbacks = _ref9.callbacks;
        _this7._renderTimer && clearTimeout(_this7._renderTimer);
        _this7._renderTimer = null;
        if (!force && !_this7._items.length && !_this7._pendingItem) {
          _this7._cleanup();
          return;
        }
        _this7._scheduleRender();
        if (!_this7._$window.isConnected) {
          // pause if we've been removed from the dom
          _this7._correlation = null;
          return;
        }
        var now = performance.now();
        var resynced = false;
        if (_this7._correlation) {
          var timePassed = now - _this7._correlation.time;
          _this7._windowOffset = _this7._correlation.offset + _this7._correlation.rate * -1 * (timePassed / 1000);
        } else {
          resynced = true;
        }
        if (Math.abs(_this7._windowOffset) > maxTranslateDistance) {
          // resync so that the number of pixels we are translating doesn't get too big
          resynced = true;
          var shiftAmount = _this7._windowOffset;
          _this7._items.forEach(function (item) {
            return item.offset -= shiftAmount;
          });
          _this7._correlation = null;
          _this7._windowOffset = 0;
        }
        var visible = !document.hidden;
        var goneVisible = visible && _this7._visible !== visible;
        _this7._visible = visible;
        _this7._slider.setOffset(_this7._windowOffset * -1, _this7._rate, resynced || goneVisible);
        if (!_this7._correlation || _this7._correlation.rate !== _this7._rate) {
          _this7._correlation = {
            time: now,
            offset: _this7._windowOffset,
            rate: _this7._rate
          };
        }
        var containerSize = _this7._getContainerSize();
        var justReversedRate = _this7._justReversedRate;
        _this7._justReversedRate = false;

        // calculate what the new offsets should be given item sizes may have changed
        _this7._items.reduce(function (newOffset, item) {
          if (newOffset !== null) {
            item.offset = newOffset;
          }
          item.item.setOffset(item.offset);
          return item.offset + item.item.getSize();
        }, null);
        // remove items that are off screen
        _this7._items = _toConsumableArray(_this7._items).filter(function (_ref10) {
          var item = _ref10.item,
            offset = _ref10.offset;
          var keep = _this7._lastEffectiveRate <= 0 ? offset + item.getSize() > _this7._windowOffset : offset + item.getSize() > 0 || offset + item.getSize() < containerSize;
          if (!keep) _this7._removeItem(item);
          return keep;
        });
        if (_this7._pendingItem) {
          _this7._$moving.appendChild(_this7._pendingItem.getContainer());
          if (_this7._lastEffectiveRate <= 0) {
            var neighbour = last(_this7._items);
            var offsetIfWasTouching = neighbour ? neighbour.offset + neighbour.item.getSize() : _this7._windowOffset;
            _this7._items = [].concat(_toConsumableArray(_this7._items), [{
              item: _this7._pendingItem,
              offset: _this7._pendingItem.getSnapToNeighbor() ? offsetIfWasTouching : Math.max(
              // edge case that would happen if new item requested and synchronously provided,
              // but before during that another item size increases, or if new item was provided
              // when it wasn't strictly needed, which can happen if you have negative rate,
              // switch to positive which requests an item, and then switch back to negative again
              // and provide an item
              offsetIfWasTouching, _this7._windowOffset + containerSize)
            }]);
          } else {
            var _neighbour = first(_this7._items);
            var _offsetIfWasTouching = _neighbour ? _neighbour.offset - _this7._pendingItem.getSize() : _this7._windowOffset + containerSize - _this7._pendingItem.getSize();
            _this7._items = [{
              item: _this7._pendingItem,
              offset: _this7._pendingItem.getSnapToNeighbor() ? _offsetIfWasTouching : Math.min(
              // edge case that would happen if new item was provided when it wasn't strictly needed,
              // which can happen if you have positive rate, switch to negative which requests an item,
              // and then switch back to positive again and provide an item
              _offsetIfWasTouching, _this7._windowOffset - _this7._pendingItem.getSize())
            }].concat(_toConsumableArray(_this7._items));
          }
          _this7._pendingItem = null;
        }
        var nextItemTouching = null;
        _this7._gapSize = 0;

        // add a buffer on the side to make sure that new elements are added before they would actually be on screen
        var buffer = _this7._getBuffer();
        if (_this7._items.length) {
          var firstItem = first(_this7._items);
          var lastItem = last(_this7._items);
          var _neighbour2 = _this7._lastEffectiveRate <= 0 ? lastItem : firstItem;
          if (_this7._lastEffectiveRate <= 0) {
            _this7._gapSize = containerSize + buffer - (lastItem.offset + lastItem.item.getSize() - _this7._windowOffset);
          } else {
            _this7._gapSize = firstItem.offset - _this7._windowOffset + buffer;
          }
          if (_this7._gapSize > 0) {
            _this7._waitingForItem = true;
            // if an item is appended immediately below, it would be considered touching
            // the previous if we haven't just changed direction.
            // This is useful when deciding whether to add a separator on the side that enters the
            // screen first or not
            nextItemTouching = !justReversedRate ? {
              $el: _neighbour2.item.getOriginalEl(),
              metadata: _neighbour2.item.getMetadata()
            } : null;
          }
        } else {
          _this7._waitingForItem = true;
        }
        if (!_this7._items.length) {
          _this7._onAllItemsRemoved.forEach(function (cb) {
            return callbacks.push(cb);
          });
        }
        _this7._updateWindowInverseSize();
        if (_this7._waitingForItem && !_this7._askedForItem) {
          _this7._askedForItem = true;
          var nextItem;
          if (nextItemTouching) {
            _this7._nextAppendIsSynchronous = true;
          }
          _this7._onItemRequired.some(function (cb) {
            return deferException(function () {
              nextItem = cb({
                /** @deprecated */
                immediatelyFollowsPrevious: !!nextItemTouching,
                touching: nextItemTouching
              });
              return !!nextItem;
            });
          });
          if (nextItem) {
            // Note appendItem() will call _tick() synchronously again
            _this7.appendItem(nextItem);
          }
          _this7._nextAppendIsSynchronous = false;
        }
      });
    }
  }]);
}();

function createContainer() {
    var $el = document.createElement('div');
    $el.style.all = 'unset';
    $el.style.display = 'block';
    return $el;
}

function IdGenerator() {
    var ids = new Set();
    return {
        generate: function () {
            var base = "".concat(performance.now());
            var id = base;
            for (var i = 0; ids.has(id); i++) {
                id = "".concat(base, ":").concat(i);
            }
            ids.add(id);
            return id;
        },
        release: function (id) {
            ids.delete(id);
        },
    };
}

function WatchSize(_a) {
    var marqueeInstance = _a.marqueeInstance, onChange = _a.onChange, children = _a.children;
    var $container = useState(createContainer())[0];
    var currentOnChange = useRef(onChange);
    currentOnChange.current = onChange;
    useLayoutEffect(function () {
        if (!$container)
            return;
        var _a = marqueeInstance.watchItemSize($container), getSize = _a.getSize, onSizeChange = _a.onSizeChange, stopWatching = _a.stopWatching;
        var send = function () { return currentOnChange.current(getSize()); };
        onSizeChange(function () {
            send();
        });
        send();
        return function () { return stopWatching(); };
    }, [$container, marqueeInstance]);
    return createPortal(children, $container);
}

function Marquee(_a) {
    var children = _a.children, marqueeOpts = __rest(_a, ["children"]);
    var filteredChildren = Children.toArray(children);
    if (filteredChildren.length === 0)
        return React.createElement("div", null);
    return (React.createElement(MarqueeInternal, __assign({}, marqueeOpts, { filteredChildren: filteredChildren })));
}
var MarqueeInternal = React.memo(function (_a) {
    var filteredChildren = _a.filteredChildren, rate = _a.rate, upDown = _a.upDown, startOnScreen = _a.startOnScreen;
    var rateInitial = useState(rate)[0];
    var startOnScreenInitial = useState(startOnScreen)[0];
    var upDownInitial = useState(upDown)[0];
    var idGenerator = useState(IdGenerator())[0];
    var _b = useState(null), setRenderTrigger = _b[1];
    var _c = useState(null), $container = _c[0], setContainer = _c[1];
    var _d = useState(null), isPause = _d[0]; _d[1];
    var placeholders = useRef([]);
    var nextChildIndex = useRef(0);
    var _e = useState(null), marqueeInstance = _e[0], setMarqueeInstance = _e[1];
    var nextItemTouching = useRef(false);
    var itemSizes = useRef([]);
    var childrenCount = useRef(filteredChildren.length);
    childrenCount.current = filteredChildren.length;
    // Input items have changed. If there are fewer than before trim the item
    // sizes array.
    if (itemSizes.current.length > filteredChildren.length) {
        itemSizes.current = itemSizes.current.slice(0, filteredChildren.length);
    }
    useEffect(function () {
        if (!$container)
            return;
        // Create the marquee instance.
        var marquee = new Marquee$1($container, {
            upDown: upDownInitial,
            startOnScreen: startOnScreenInitial,
            rate: rateInitial,
        });
        setMarqueeInstance(marquee);
        return function () { return marquee.clear(); };
    }, [
        $container,
        rateInitial,
        setMarqueeInstance,
        startOnScreenInitial,
        upDownInitial,
    ]);
    useEffect(function () {
        if (!marqueeInstance)
            return;
        // marqueeInstance.clear();
        var indexFilter = filteredChildren.length === 1
            ? childrenCount.current
            : childrenCount.current - 1;
        placeholders.current = placeholders.current.filter(function (item, index) {
            return index < indexFilter;
        });
        nextChildIndex.current = placeholders.current.length;
        var createPlaceholders = function (sizeToFill) {
            // we may have some placeholders queued, and if that's the case
            // subtract their sizes.
            placeholders.current
                .filter(function (_a) {
                var appended = _a.appended;
                return !appended;
            })
                .forEach(function (_a) {
                var childIndex = _a.childIndex;
                return (sizeToFill -= itemSizes.current[childIndex]);
            });
            var zeroIncreaseCounter = 0;
            // Figure out how many items we need to fill the available space, and create
            // that many placeholders. The next render will put the placeholders in the dom.
            while (sizeToFill > 0 &&
                // If all sizes end up being 0 prevent an infinite loop.
                zeroIncreaseCounter < itemSizes.current.length) {
                var childIndex = nextChildIndex.current;
                var childSize = itemSizes.current[childIndex];
                if (childSize === 0) {
                    zeroIncreaseCounter++;
                }
                else {
                    zeroIncreaseCounter = 0;
                }
                sizeToFill -= childSize;
                var $placeholder = createContainer();
                placeholders.current.push({
                    $placeholder: $placeholder,
                    key: idGenerator.generate(),
                    childIndex: childIndex,
                    inDom: false,
                    appended: false,
                });
                nextChildIndex.current =
                    (nextChildIndex.current + 1) % childrenCount.current;
            }
            // Trigger a render.
            setRenderTrigger({});
        };
        marqueeInstance.onItemRequired(function (_a) {
            var touching = _a.touching;
            nextItemTouching.current = !!touching;
            createPlaceholders(marqueeInstance.getGapSize());
        });
        marqueeInstance.onItemRemoved(function ($el) {
            // Remove the placeholder for the item that has just been removed from the marquee.
            placeholders.current = placeholders.current.filter(function (_a) {
                var $placeholder = _a.$placeholder, key = _a.key;
                if ($el === $placeholder) {
                    idGenerator.release(key);
                    return false;
                }
                return true;
            });
        });
        // Create the placeholder for the first item.
        // May actually be more than one item if the items are smaller than the buffer size.
        createPlaceholders(marqueeInstance.getGapSize());
    }, [idGenerator, marqueeInstance, filteredChildren.length, isPause]);
    useEffect(function () {
        if (!marqueeInstance || rate === undefined)
            return;
        // The rate has changed, update it.
        marqueeInstance.setRate(rate);
    }, [marqueeInstance, rate]);
    useEffect(function () {
        if (!marqueeInstance)
            return;
        // We have just rendered, and the marquee is waiting for the next item.
        // This is in a loop because there may be room for more than one item.
        while (marqueeInstance.isWaitingForItem()) {
            var toAppend = placeholders.current.find(function (_a) {
                var inDom = _a.inDom, appended = _a.appended;
                return inDom && !appended;
            });
            if (!toAppend) {
                // Ran out of placeholders that are in the DOM. More should have been
                // created but are not in the dom yet until the next render.
                // This may happen if the container or item sizes changed between when
                // we calculated how many new placeholders we needed and now.
                return;
            }
            toAppend.appended = true;
            // Note that this may synchronously call the `onItemRequired` callback,
            // which may result in more placeholders being created if needed.
            marqueeInstance.appendItem(toAppend.$placeholder, {
                snapToNeighbour: nextItemTouching.current,
            });
        }
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: setContainer, style: { all: 'unset', display: 'block', height: '100%' } }),
        placeholders.current.map(function (placeholder, index) {
            var $placeholder = placeholder.$placeholder, key = placeholder.key, childIndex = placeholder.childIndex;
            placeholder.inDom = true;
            var child = filteredChildren[childIndex];
            return child
                ? createPortal(React.cloneElement(child, {
                    'marquee-item-index': index,
                    'marquee-item-key': key,
                }), $placeholder, key)
                : null;
        }),
        marqueeInstance
            ? filteredChildren.map(function (child, i) { return (React.createElement(WatchSize, { key: i, marqueeInstance: marqueeInstance, onChange: function (size) {
                    itemSizes.current[i] = size;
                } }, child)); })
            : null));
});
MarqueeInternal.displayName = 'MarqueeInternal';

export { Marquee };
