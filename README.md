# load-state
[![npm](https://img.shields.io/npm/v/load-state.svg)](https://www.npmjs.com/package/load-state)
[![npm](https://img.shields.io/npm/dm/load-state.svg)](https://www.npmjs.com/package/load-state)
[![Coverage Status](https://coveralls.io/repos/github/ty-bt/load-state/badge.svg?branch=master)](https://coveralls.io/github/ty-bt/load-state?branch=master)
[![Build Status](https://travis-ci.org/ty-bt/load-state.svg?branch=master)](https://travis-ci.org/ty-bt/load-state)

加载中状态管理. Loading state management.
使用数值类型来管理加载状态，每次调用加载方法状态+1，加载方法参数中的promise执行完成或异常后状态-1
当管理的状态值为0时为非加载状态，>0则为加载状态
可以使用 `!!` 将其转为 boolean

## loadState.createFn(changeLoadFn)
创建一个加载方法
### 参数
`changeLoadFn` `function(change)` 状态变更方法，change为1或-1, 可通过`loadState.getNextState`方法获取下一个状态值
### 返回值
返回一个加载方法`function(promise)`, promise可以是一个`Promise对象`或`返回Promise对象的方法`
执行此方法，方法会将管理的状态值+1，promise对象成功或出现异常时会将状态值-1


## loadState.getNextState(cur, change)
获取下一个状态值

### 参数
* cur: 当前状态值
* change: 修改值 1 或 -1 `loadState.createFn` 参数方法中接受到的参数
### 返回值
如果`cur`为boolean类型或为空则认为0，再继续加上change

## loadState.createRFn(field) React组件内使用封装
### 参数
`field` state中的状态名称
### 返回值
返回一个加载方法

演示地址：[![Edit wonderful-breeze-vvxnh](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wonderful-breeze-vvxnh?fontsize=14)

## react hook封装示例
hook用起来更爽
```jsx harmony
/**
 * loading状态管理hook
 * @param initValue 可空， 初始值， 可以为boolean值或int
 * @param isNum 是否返回数字形式的加载状态， 默认为false, 返回boolean形式的状态
 * @return {[当前loading状态值, 状态管理方法]}
 */
function useLoading(initValue, isNum = false) {
  const [loading, setLoading] = useState(initValue);
  return [
    isNum ? loading : !!loading,
    loadState.createFn(change => {
      setLoading(prev => loadState.getNextState(prev, change));
    })
  ];
}
```
演示地址：[![Edit magical-raman-tdh8w](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/magical-raman-tdh8w?fontsize=14)


## loadState.createVFn(field) Vue组件内使用封装

### 参数
`field` data中的状态名称
### 返回值
返回一个加载方法

演示地址：[![Edit Vue Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-template-kdl6u?fontsize=14)


## 加载方法的使用
`function(promise)`, promise可以是一个`Promise对象`或`返回Promise对象的方法`


