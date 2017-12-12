<template>
    <div class="bazi-main" :style="'background-color:'+$store.state.config.theme+'.07)'">
            <div class="left" :style="'background-color:'+$store.state.config.theme+'.2)'">
                <Menu :style="'background-color:transparent'" :active-name="$store.state.activeName" width="" :open-names="['']" @on-select="routerHandle($event)">
                <!-- <Menu :style="'background-color:'+activeColor" :active-name="$store.state.activeName" width="" :open-names="['']" @on-select="routerHandle($event)"> -->
                        </br>
                    <!-- <router-link :to="{path:'/bazi/paipan'}"> -->
                        <MenuItem name="baziCalendar" ><Icon type="android-calendar"></Icon> 日 历</MenuItem>
                        <MenuItem name="baziPaipan" ><Icon type="ios-navigate"></Icon> PAIPAN</MenuItem>
                    <!-- </router-link> -->
                    <!-- <router-link :to="{path:'/bazi/data'}"> -->
                        <MenuItem name="baziData"><Icon type="android-list"></Icon> 存储数据</MenuItem>
                    <!-- </router-link> -->
                    <Submenu name="set">
                        <template slot="title">
                            <Icon type="android-settings"></Icon> 偏好设置
                        </template>
                        <MenuItem class="menu-son" name="baziSet-theme"><Icon type="android-color-palette"></Icon> 主题设置</MenuItem>
                        <MenuItem class="menu-son" name="baziSet-birthday"><Icon type="pizza"></Icon> 生日提醒</MenuItem>
                        <MenuItem class="menu-son" name="baziSet-paipan"><Icon type="ios-navigate-outline"></Icon> paipan设置</MenuItem>
                    </Submenu>
                    <MenuItem name="baziInfo"><Icon type="ios-information"></Icon> 说明</MenuItem>
                </Menu>
            </div>
            <div class="right">
                <div class="top-nav" :style="'background:'+$store.state.config.theme+'.15)'" >

                </div>
                <div class="layout-content-main">
                    <!-- 路由视口 -->
                    <router-view></router-view>
                </div>
            </div>
    </div>
</template>
<script>
import userConfig from '../../js/user_config'
export default {
  data() {
    return {
        activeColor:'',
    };
  },
  methods: {
    //点击改变路由
    routerHandle(routerName){
        if(routerName.indexOf("baziSet")!=-1){
            this.$router.push({name:'baziSet'});
            // this.$store.state.setActiveName = routerName;
            // this.activeRouterName=routerName;
            // this.activeRouterName=this.$store.state.setActiveName;
        }else{
            this.$router.push({name:routerName});
            // this.activeRouterName=routerName;
        }
        // this.$store.state.setActiveName=routerName;
        this.$store.commit('setActiveName', { name: routerName });
        localStorage.setItem('activeName',routerName);

    },
    saveBazi(){
        if(!true){

        }else{
        }
    },
    queryBazi(){
        // if(!this.dateObj || !this.timeObj){
        //     this.warning("请将信息填写完整");
        //     return false;
        // }
        
        this.$http.post(apiPath+"/api/bz/calc",{params:null},{emulateJSON:true}).then(res=>{
            console.log(res);
        },res=>{
            this.warning("服务器链接失败");
        })
    },
    setHeight() {
    //   let h = document.documentElement.clientHeight;
    //   document.querySelector(".layout").style.height = h + "px";
    },
    getDate(){

    },
    //日期 时间输入框有、无内容边框状态
    checkStyle(d,value){
        let input =  document.querySelector('div[data-active='+d+'] input');
        if(value.trim()){
            input.style.borderColor="#2d8cf0"; //变蓝色
        }else{
            input.style.borderColor="#dddee1"; //变回灰色
        }
    },
    //监测选择阴历或阳历
    checkLunarSolar(e){
        this.isLunar = e==0 ? true:false;
        this.acWidth = e==0 ? '136px':'';
    },
    warning (msg) {
        this.$Message.warning(msg);
    },
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        let _this = this;
        // 绘制图表
        myChart.setOption({
              tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'center',
        // data:['jin','mu','shui','huo','tu']
    },
    series: [
        {
            name:'五行',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '55%'],

            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            color:["#fb9900","#06ab11","#1f16c3","#fe3000","#964900"],
            data:[
                // {value:_this.bzInfo.wuXing.WXPower['金'], name:'金'},
                // {value:_this.bzInfo.wuXing.WXPower['木'], name:'木'},
                // {value:_this.bzInfo.wuXing.WXPower['水'], name:'水'},
                // {value:_this.bzInfo.wuXing.WXPower['火'], name:'火'},
                // {value:_this.bzInfo.wuXing.WXPower['土'], name:'土'},
                {value:27, name:'金'},
                {value:22, name:'木'},
                {value:44, name:'水'},
                {value:6, name:'火'},
                {value:54, name:'土'},
                // {value:335, name:'直达', selected:true},
                // {value:679, name:'营销广告'},
                // {value:1548, name:'搜索引擎'}
            ]
        },
        {
            name:'五行',
            type:'pie',
            radius: ['70%', '75%'],
            label: {
                normal: {
                    // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 15,
                            align: 'center'
                        },
                        // abg: {
                        //     backgroundColor: '#333',
                        //     width: '100%',
                        //     align: 'right',
                        //     height: 22,
                        //     borderRadius: [4, 4, 0, 0]
                        // },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 11,
                            lineHeight: 15
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 4],
                            borderRadius: 2
                        }
                    }
                }
            },
            data:[
                    {value:335, name:'jin'},
                    {value:310, name:'mu'},

                ]
            }
        ]
    });
    },
    setColor(){  
    }
  },
  mounted() {
      this.setColor();
  },
  created() {
    //判断进入哪个页面
    //   this.$router.push({name:'baziPaipan'});
    //   this.$store.commit('setActiveName', { name: 'baziPaipan' });
    //   localStorage.setItem('activeName','baziPaipan');
    //   return false;
    if(localStorage.getItem('activeName')){
        this.$store.commit('setActiveName', { name: localStorage.getItem('activeName') });
    }else{
        this.$store.commit('setActiveName', { name: 'baziPaipan' });
    }
    let routerName = this.$store.state.activeName;

    if(routerName.indexOf("baziSet")!=-1){
        this.$router.push({name:'baziSet'});
    }else{
        this.$router.push({name:routerName});   
    }
    this.$store.commit('setActiveName', { name: routerName });
        localStorage.setItem('activeName',routerName);
    }

};
</script>
<style lang="less" scoped>
.bazi-main {
    height:100%;
    .left {
        min-height:532px;
        width:210px;
        float:left;
    }
    .right {
        padding-left:210px;
        min-height:532px;
    }
    .menu-son {
        font-size:12px;
    }
    .menu-hor {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    }
    .layout-content-main {
    height: 100%;
    // width: 105.5%;
    padding: 5px 14px;
    // background-color: skyblue; 
    }
    .ivu-col-span-5 {
    width: 16%;
    }
    .ivu-col-span-12 {
        display: block;
        width: 100%;
    }
    div.name-box .ivu-input-group{
        /* top: 12px; */
        margin-left:15px;
        margin-top:-22px;
    }
    .inputBox {
        background-color: #ccc;
        width:100%;
    }
    li.ivu-menu-item {
        padding-right:0px;
    }
    div.bz-view {
        background-color: pink;
        height: 450px;
        width:100%;
    }
    .top-nav {
        width:106%;
        height:28px;
    }
}
</style>
