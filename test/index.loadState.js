require("babel-polyfill");
const chai = require('chai');
const loadState = require('../lib/loadState').default;

// 断言工具
const expect = chai.expect;
// 用作返回值
const RESULT_VAL = "123";

/**
 * 对生成的方法进行测试
 * @param loadingFn 生成的方法
 * @param getLoadingState 获取加载状态值的方法
 */
loadFnTest = async (loadingFn, getLoadingState) => {
    const pm = new Promise((resolve) => {
        setTimeout(() => {
            resolve(RESULT_VAL);
        });
    });
    const loadingPm = loadingFn(pm);
    // 进入加载状态
    expect(getLoadingState()).to.be.equal(1);
    const result = await loadingPm;
    // 应该取消加载状态
    expect(getLoadingState()).to.be.equal(0);
    // 应该拿到正确的返回值
    expect(result).to.be.equal(RESULT_VAL);
};

describe('loadState test', () => {
    it("createRFn", async () => {
        // 模拟react组件
        const reactObj = {
            state: {
                loading: null
            },
            setState(fn){
                this.state = {...this.state, ...fn.call(this, this.state)};
            }
        };
        const reactFn = loadState.createRFn("loading").bind(reactObj);
        await loadFnTest(reactFn, () => reactObj.state.loading);
    });

    it("createVFn", async () => {
        // 模拟vue组件
        const vueObj = {
            loading: true
        };
        const vueFn = loadState.createVFn("loading").bind(vueObj);
        await loadFnTest(vueFn, () => vueObj.loading);
    });
});

