<template>
    <div class="bazi-main" :style="'background-color:'+$store.state.config.theme+'.07)'">
            <div class="left a" :style="'background-color:'+$store.state.config.theme+'.2)'">
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
            <div class="left b" :style="'background-color:'+$store.state.config.theme+'.2)'">
                <Menu :style="'background-color:transparent'" :active-name="$store.state.activeName" width="" :open-names="['']" @on-select="routerHandle($event)">
                <!-- <Menu :style="'background-color:'+activeColor" :active-name="$store.state.activeName" width="" :open-names="['']" @on-select="routerHandle($event)"> -->
                        </br>
                        <MenuItem name="baziCalendar" ><Icon type="android-calendar"></Icon></MenuItem>
                        <MenuItem name="baziPaipan" ><Icon type="ios-navigate"></Icon></MenuItem>
                        <MenuItem name="baziData"><Icon type="android-list"></Icon> </MenuItem>
                    <!-- <Submenu name="set"> -->
                        <!-- <template slot="title">
                            <Icon type="android-settings"></Icon>
                        </template> -->
                        <MenuItem class="menu-son" name="baziSet-theme"><Icon type="android-settings"></Icon></MenuItem>
                        <!-- <MenuItem class="menu-son" name="baziSet-theme"><Icon type="android-color-palette"></Icon> 主题设置</MenuItem>
                        <MenuItem class="menu-son" name="baziSet-birthday"><Icon type="pizza"></Icon> 生日提醒</MenuItem>
                        <MenuItem class="menu-son" name="baziSet-paipan"><Icon type="ios-navigate-outline"></Icon> paipan设置</MenuItem> -->
                    <!-- </Submenu> -->
                    <MenuItem name="baziInfo"><Icon type="ios-information"></Icon></MenuItem>
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
    // routerHandle(routerName){
    //     if(routerName.indexOf("baziSet")!=-1){
    //         this.$router.push({name:'baziSet'});
    //     }else{
    //         this.$router.push({name:routerName});
    //     }
    //     // this.$store.state.setActiveName=routerName;
    //     this.$store.commit('setActiveName', { name: routerName });
    //     localStorage.setItem('activeName',routerName);
    // },

    warning (msg) {
        this.$Message.warning(msg);
    }

  },
  mounted() {
    //   this.setColor();
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
    @media screen and (max-width: 1200px) { //小于1200
        .left {
            min-height:532px;
            width:50px;
            float:left;
        }
        .left.a {
            display:none;
        }
        .left.b {
            display: block;
        }
        .right {
            padding-left:50px;
            min-height:532px;
        }
    }
    @media screen and (max-width:500px) and (min-width:200px){ }@media screen and (min-width: 1200px) { //大于1200
        .left {
            min-height:532px;
            width:210px;
            float:left;
        }
        .left.b {
            display:none;
        }
        .left.a {
            display: block;
        }
        .right {
            padding-left:210px;
            min-height:532px;
        }

    }
    // .left {
    //     min-height:532px;
    //     width:210px;
    //     float:left;
    // }
    // .right {
    //     padding-left:210px;
    //     min-height:532px;
    // }
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
        height:10px;
    }
}
</style>
