// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex';
import App from './App'
import router from './router'
import iView from 'iview'
import VueResource from 'vue-resource'
import 'iview/dist/styles/iview.css';
import echarts from 'echarts';
import StorageConfig from './js/localStorage';

// import { Button, Table,RadioGroup,DatePicker,Radio,Input,Menu,MenuItem,Select,Option,ButtonGroup,FormItem,Tabs,TabPane,Form } from 'iview';
// Vue.component('Button', Button);
// Vue.component('Table', Table);
// Vue.component('RadioGroup', RadioGroup);
// Vue.component('DatePicker', DatePicker);
// Vue.component('Radio', Radio);
// Vue.component('Input', Input);
// Vue.component('Menu', Menu);
// Vue.component('MenuItem',MenuItem);
// Vue.component('Select',Select);
// Vue.component('Option',Option);
// Vue.component('ButtonGroup',ButtonGroup);
// Vue.component('TabPane',TabPane);
// Vue.component('Tabs',Tabs);
// Vue.component('FormItem',FormItem);
// Vue.component('Form',Form);
// import userConfig from './js/user_config.js'
// import '../my-theme/index.less';
Vue.config.productionTip = false
Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(iView);

Vue.prototype.StorageConfig = StorageConfig; //local存储config数据
Vue.prototype.setConfig = function(obj){
    //设置vuex
    this.$store.commit('setConfig',obj);
    //设置本地配置
    this.StorageConfig.set(obj);
}
//切换路由
Vue.prototype.routerHandle = function(routerName){
  if(routerName.indexOf("baziSet")!=-1){
      this.$router.push({name:'baziSet'});
  }else{
      this.$router.push({name:routerName});
  }
  this.$store.commit('setActiveName', { name: routerName });
  localStorage.setItem('activeName',routerName);
},
//日期格式化
Vue.prototype.formatDate = function(dateObj){
  return dateObj.getFullYear()+"-"+trans(this.dateObj.getMonth()+1)+"-"+trans(this.dateObj.getDate())+" "+trans(this.dateObj.getHours())+":"+trans(this.dateObj.getMinutes())+":"+trans(this.dateObj.getSeconds());
  function trans(num){
    return num<10?'0'+num:num+''
  }
},

Vue.http.interceptors.push(function(request,next){
  //发送前处理逻辑
      if(sessionStorage.getItem('token')){
        request.headers.set("token5",sessionStorage.getItem('token'));
      }
	next(function(response){ 
      // if(response.body.code==-5){
      //     this.$Modal.warning({
      //       title: '提示',
      //       content: '<p>会话已过期，请重新登陆！</p>',
      //       onOk: () => {
      //       }
      //   });
      // }
  })
 });


// Vue.http.options.emulateJSON = true; //设置
// Vue.http.options.credentials = true; //设置跨域时是否存取凭证
// Vue.http.options.withCredentia = true; //设置跨域时是否发送凭证c
// Vue.http.options.emulateHTTP = true;
// Vue.http.options.crossOrigin = true;

// Vue.http.interceptors.push((request, next)  =>{
//   var a= true;
//   if(a){
//       request.headers.set("ssss",'fsdffdsyyy');
//   }
//   next((response) => {
//   });
// });
// Vue.http.interceptors.push((request, next) => {
//   request.headers.set('Authorization', 'token')
//   console.log(request.headers)
//   next(response => {
//     console.log(response.status)
//     return response
//   })
// })

// Vue.http.options.headers = {
//   "Access-Control-Allow-Origin":'http//:127.0.0.1'
// }; //设置跨域时是否发送凭证

Vue.prototype.$echarts = echarts;


Vue.filter('num2',function(v){
  return v<10? "0"+v : v;
});

import store from './js/vuex/store.js';
/* eslint-disable no-new */
let v = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store:new Vuex.Store(store),
})

