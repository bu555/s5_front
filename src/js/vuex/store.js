// import Vue from 'vue'
// import Vuex from 'vuex'
// Vue.use(Vuex)

// export default new Vuex.Store({
//     state:{
//         count:1
//     },
//     mutations: {
//         increment (state) {
//         state.count++
//         }
//     }
// })
export default {
    state:{
        count:1,
        activeName:'', //set.vue组件的标签名
        config:{
            theme:'',
        },
        wxPower:{}, //五行计算数据
        activeLiuNian:{}, //变动的流年五行力量
        activeDaYun:{}, //变动的大运五行力量
    },
    mutations: {
        increment (state) {
        state.count++
        },
        setActiveName(state,obj){
            state.activeName = obj['name'];
        },
        setConfig(state,obj){
            for(let key in obj){
                state.config[key] = obj[key];
            }
        },
        setWxPower(state,obj){
            state.wxPower = obj;
        },
        setActiveLiuNian(state,obj){
            state.activeLiuNian = obj;
        },
        setActiveDaYun(state,obj){
            state.activeDaYun = obj;
        }
    }
}
