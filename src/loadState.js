import is from "is-type-of";

const loadState = {

    /**
     * 获取下一个状态值
     * 如果不存在 或 类型是布尔型 则认为是初始值 0 用于刚开始就显示加载状态true的情况
     * @param cur 当前状态值
     * @param change 修改值
     * @returns {*}
     */
    getNextState(cur, change){
        // 如果不存在 或 类型是布尔型 则认为是初始值 0 用于刚开始就显示加载状态true的情况
        if(!cur || is.boolean(cur)){
            cur = 0;
        }
        return cur + change;
    },

    /**
     * 创建一个loading方法
     * @param changeLoadFn function(change) 进入loading则change为1, 取消loading则change为-1
     * @return {Function}
     */
    createFn(changeLoadFn){
        /**
         * 此方法可以接受promise对象或者一个方法, 自动设置state中指定属性(数字, 0为非加载状态, 大于0则代表是加载状态)
         * 在promise执行过程state +1
         * 在promise完成后将state -1
         * @params promise Promise|Function
         * @return 返回promise或function最终返回值
         */
        return async function(promise){
            // 进入loading状态
            changeLoadFn.call(this, 1);
            let result;
            try{
                if(is.function(promise)){
                    result = await promise();
                }else{
                    result = await promise;
                }
            }catch(e){
                // 取消loading状态
                changeLoadFn.call(this, -1);
                throw e;
            }
            // 取消loading状态
            changeLoadFn.call(this, -1);
            return result;
        }
    },

    /**
     * 创建react组件内部的加载状态管理方法
     * @param field state中的名字  该属性应该为数字, 如果是空或布尔类型会在计算中置为0
     * @return {Function}
     */
    createRFn(field){
        return this.createFn(function(change){
            // 修改组件state中指定属性
            this.setState(prevState => {
                let loading = prevState[field];
                loading = loadState.getNextState(loading, change);
                let nextState = Object.assign({}, prevState);
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
    createVFn(field){
        return this.createFn(function(change){
            // 修改组件props中指定属性
            let loading = this[field];
            loading = loadState.getNextState(loading, change);
            this[field] = loading;
        });
    }

};
/**
 * 加载状态管理工具
 */
export default loadState