"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isTypeOf = _interopRequireDefault(require("is-type-of"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var loadState = {
  /**
   * 获取下一个状态值
   * 如果不存在 或 类型是布尔型 则认为是初始值 0 用于刚开始就显示加载状态true的情况
   * @param cur 当前状态值
   * @param change 修改值
   * @returns {*}
   */
  getNextState: function getNextState(cur, change) {
    // 如果不存在 或 类型是布尔型 则认为是初始值 0 用于刚开始就显示加载状态true的情况
    if (!cur || _isTypeOf["default"]["boolean"](cur)) {
      cur = 0;
    }

    return cur + change;
  },

  /**
   * 创建一个loading方法
   * @param changeLoadFn function(change) 进入loading则change为1, 取消loading则change为-1
   * @return {Function}
   */
  createFn: function createFn(changeLoadFn) {
    /**
     * 此方法可以接受promise对象或者一个方法, 自动设置state中指定属性(数字, 0为非加载状态, 大于0则代表是加载状态)
     * 在promise执行过程state +1
     * 在promise完成后将state -1
     * @params promise Promise|Function
     * @return 返回promise或function最终返回值
     */
    return (
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(promise) {
          var result;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // 进入loading状态
                  changeLoadFn.call(this, 1);
                  _context.prev = 1;

                  if (!_isTypeOf["default"]["function"](promise)) {
                    _context.next = 8;
                    break;
                  }

                  _context.next = 5;
                  return promise();

                case 5:
                  result = _context.sent;
                  _context.next = 11;
                  break;

                case 8:
                  _context.next = 10;
                  return promise;

                case 10:
                  result = _context.sent;

                case 11:
                  _context.next = 17;
                  break;

                case 13:
                  _context.prev = 13;
                  _context.t0 = _context["catch"](1);
                  // 取消loading状态
                  changeLoadFn.call(this, -1);
                  throw _context.t0;

                case 17:
                  // 取消loading状态
                  changeLoadFn.call(this, -1);
                  return _context.abrupt("return", result);

                case 19:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[1, 13]]);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()
    );
  },

  /**
   * 创建react组件内部的加载状态管理方法
   * @param field state中的名字  该属性应该为数字, 如果是空或布尔类型会在计算中置为0
   * @return {Function}
   */
  createRFn: function createRFn(field) {
    return this.createFn(function (change) {
      // 修改组件state中指定属性
      this.setState(function (prevState) {
        var loading = prevState[field];
        loading = loadState.getNextState(loading, change);
        var nextState = Object.assign({}, prevState);
        nextState[field] = loading;
        return nextState;
      });
    });
  },

  /**
   * 创建vue组件内部的加载状态管理方法
   * @param field state中的名字  该属性应该为数字, 如果是空或布尔类型会在计算中置为0
   * @return {Function}
   */
  createVFn: function createVFn(field) {
    return this.createFn(function (change) {
      // 修改组件props中指定属性
      var loading = this[field];
      loading = loadState.getNextState(loading, change);
      this[field] = loading;
    });
  }
};
/**
 * 加载状态管理工具
 */

var _default = loadState;
exports["default"] = _default;