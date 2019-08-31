# load-state
[![npm](https://img.shields.io/npm/v/load-state.svg)](https://www.npmjs.com/package/load-state)
[![npm](https://img.shields.io/npm/dm/load-state.svg)](https://www.npmjs.com/package/load-state)
[![Coverage Status](https://coveralls.io/repos/github/ty-bt/load-state/badge.svg?branch=master)](https://coveralls.io/github/ty-bt/load-state?branch=master)
[![Build Status](https://travis-ci.org/ty-bt/load-state.svg?branch=master)](https://travis-ci.org/ty-bt/load-state)

加载中状态管理, 提供React,Vue快捷调用，便捷的管理加载状态
使用数值类型来管理加载状态，每次调用加载方法状态+1，加载方法参数中的promise执行完成或异常后状态-1
当管理的状态值为0时为非加载状态，>0则为加载状态
可以使用 `!!` 将其转为 boolean

## loadState.createFn(changeLoadFn)
创建一个加载方法
### 参数
`changeLoadFn` `function(change)` 状态变更方法，change为1或-1, 可通过`loadState.getNextState`方法获取下一个状态值
### 返回值
返回一个加载方法`function(promise)`, 
* promise可以是一个`Promise对象`或`返回Promise对象的方法`
* `0.1版本以上` promise可以是boolean值，true loading 计数+1 , false -1`（这样使用需要自己管理好状态，不然可能会导致一些异常）`
* 执行此方法，方法会将管理的状态值+1，promise对象成功或出现异常时会将状态值-1


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
```jsx harmony
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Spin, Alert, Button } from "antd";
import loadState from "load-state";

class Card extends React.Component {
  state = { data: { loading: false } };

  loading = loadState.createRFn("data.loading");

  showSetTimeout = async ms => {
    const pm = new Promise((resolve, reject) => {
      setTimeout(() => resolve(123), ms);
    });
    // 可以接受到异步返回值
    const result = await this.loading(pm);
    console.log(result);

    // 和上面代码一样 用await舒服很多
    // this.loading(pm).then(res => {
    //   console.log(res); // 123
    // });

    // 参数也可以是一个返回promise的方法
    // const result = this.loading(async () => {
    //   return await fetch("/aa/bb");
    // });
  };

  render() {
    return (
      <div>
        <Spin spinning={!!this.state.data.loading}>
          <Alert
            message="点击按钮进入loading状态"
            description="可多次点击."
            type="info"
          />
        </Spin>
        <div style={{ marginTop: 16 }}>
          Loading state: {this.state.data.loading} -{" "}
          {(!!this.state.data.loading).toString()}
          <Button
            style={{ margin: 16 }}
            type="primary"
            onClick={() => this.showSetTimeout(1000)}
          >
            1000ms
          </Button>
          <Button type="primary" onClick={() => this.showSetTimeout(2000)}>
            2000ms
          </Button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Card />, document.getElementById("container"));

```
演示地址：[![Edit wonderful-breeze-vvxnh](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wonderful-breeze-vvxnh?fontsize=14)

## react hook封装示例
hook用起来更爽
```jsx harmony
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Spin, Alert, Button } from "antd";
import loadState from "load-state";

/**
 * react hook 示例
 */

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

function Demo() {
  // 获取loading 状态 和 loading状态管理方法
  const [loading, loadingFn] = useLoading(false, true);

  const showSetTimeout = async ms => {
    const pm = new Promise((resolve, reject) => {
      setTimeout(() => resolve(123), ms);
    });
    // 可以接受到异步返回值
    const result = await loadingFn(pm);
    console.log(result);
  };
  return (
    <div>
      <Spin spinning={!!loading}>
        <Alert
          message="点击按钮进入loading状态"
          description="可多次点击."
          type="info"
        />
      </Spin>
      <div style={{ marginTop: 16 }}>
        Loading state: {loading} - {(!!loading).toString()}
        <Button
          style={{ margin: 16 }}
          type="primary"
          onClick={() => showSetTimeout(1000)}
        >
          1000ms
        </Button>
        <Button type="primary" onClick={() => showSetTimeout(2000)}>
          2000ms
        </Button>
      </div>
    </div>
  );
}

ReactDOM.render(<Demo />, document.getElementById("container"));

```
演示地址：[![Edit magical-raman-tdh8w](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/magical-raman-tdh8w?fontsize=14)


## loadState.createVFn(field) Vue组件内使用封装

### 参数
`field` data中的状态名称
### 返回值
返回一个加载方法

```html
<template>
  <div>
    <el-alert v-loading="!!data.loading" title="点击按钮进入loading状态" type="success" description="可多次点击"></el-alert>
    <p>{{data.loading}}-{{!!data.loading}}</p>
    <el-button type="primary" @click="showSetTimeout(1000)">1000ms</el-button>
    <el-button type="primary" @click="showSetTimeout(2000)">2000ms</el-button>
  </div>
</template>

<script>
import loadState from "load-state";
export default {
  data() {
    return {
      tableData: [],
      data: {
        loading: false
      }
    };
  },
  methods: {
    loadingFn: loadState.createVFn("data.loading"),
    showSetTimeout: async function(ms) {
      const pm = new Promise((resolve, reject) => {
        setTimeout(() => resolve(123), ms);
      });
      // 可以接受到异步返回值
      const result = await this.loadingFn(pm);
      console.log(result);

      // 和上面代码一样 用await舒服很多
      // this.loading(pm).then(res => {
      //   console.log(res); // 123
      // });

      // 参数也可以是一个返回promise的方法
      // const result = this.loading(async () => {
      //   return await fetch("/aa/bb");
      // });
    }
  }
};
</script>


```
演示地址：[![Edit Vue Template](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-template-kdl6u?fontsize=14)


## 加载方法的使用
`function(promise)`, promise可以是一个`Promise对象`或`返回Promise对象的方法`


