require("babel-polyfill");
const chai = require('chai');
const loadState = require('../lib/loadState').default;

// 断言工具
const expect = chai.expect;
// 用作返回值
const RESULT_VAL = "123";

/**
 * 对生成的方法进行测试 传递promise对象
 * @param loadingFn 生成的方法
 * @param getLoadingState 获取加载状态值的方法
 */
const loadFnPromiseTest = async (loadingFn, getLoadingState) => {
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

/**
 * 对生成的方法进行测试 传递异步方法
 * @param loadingFn 生成的方法
 * @param getLoadingState 获取加载状态值的方法
 */
const loadFnTest = async (loadingFn, getLoadingState) => {
    const pm = new Promise((resolve) => {
        setTimeout(() => {
            resolve(RESULT_VAL);
        });
    });
    const loadingPm = loadingFn(async () => {return await pm});
    // 进入加载状态
    expect(getLoadingState()).to.be.equal(1);
    const result = await loadingPm;
    // 应该取消加载状态
    expect(getLoadingState()).to.be.equal(0);
    // 应该拿到正确的返回值
    expect(result).to.be.equal(RESULT_VAL);
};

/**
 * 对生成的方法进行抛出异常测试
 * @param loadingFn 生成的方法
 * @param getLoadingState 获取加载状态值的方法
 */
const loadFnTestCatch = async (loadingFn, getLoadingState) => {
    const pm = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(RESULT_VAL);
        });
    });
    const loadingPm = loadingFn(pm);
    // 进入加载状态
    expect(getLoadingState()).to.be.equal(1);
    try {
        await loadingPm;
        // 这一行应该不执行
        expect(false).to.be.true;
    }catch (e) {
        // 应该取消加载状态
        expect(getLoadingState()).to.be.equal(0);
        // 应该拿到抛出的错误
        expect(e).to.be.equal(RESULT_VAL);
    }


};

describe('loadState test', () => {
    it("createRFn", async () => {
        // 模拟react组件
        const reactObj = {
            state: {
                loading: null,
                data: {
                    data1: {
                        loading: true
                    }
                }
            },
            setState(fn){
                this.state = {...this.state, ...fn.call(this, this.state)};
            }
        };
        const reactFn = loadState.createRFn("loading").bind(reactObj);
        await loadFnTest(reactFn, () => reactObj.state.loading);
        await loadFnTestCatch(reactFn, () => reactObj.state.loading);
        await loadFnPromiseTest(reactFn, () => reactObj.state.loading);

        const reactObjFn = loadState.createRFn("data.data1.loading").bind(reactObj);
        await loadFnTest(reactObjFn, () => reactObj.state.data.data1.loading);
        await loadFnTestCatch(reactObjFn, () => reactObj.state.data.data1.loading);
        await loadFnPromiseTest(reactObjFn, () => reactObj.state.data.data1.loading);
    });

    it("createVFn", async () => {
        // 模拟vue组件
        const vueObj = {
            loading: true,
            data: {
                data1: {
                    loading: true
                }
            }
        };
        const vueFn = loadState.createVFn("loading").bind(vueObj);
        await loadFnTest(vueFn, () => vueObj.loading);
        await loadFnTestCatch(vueFn, () => vueObj.loading);
        await loadFnPromiseTest(vueFn, () => vueObj.loading);

        const vueObjFn = loadState.createVFn("data.data1.loading").bind(vueObj);
        await loadFnTest(vueObjFn, () => vueObj.data.data1.loading);
        await loadFnTestCatch(vueObjFn, () => vueObj.data.data1.loading);
        await loadFnPromiseTest(vueObjFn, () => vueObj.data.data1.loading);
    });
});

