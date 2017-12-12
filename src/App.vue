<template>
    <div class="layout" :style="'background-color:'+$store.state.config.theme+'.05)'">
        <!-- <Menu mode="horizontal" theme="dark" active-name="1">
            <div class="layout-logo"></div>
            <div class="layout-nav">
                <MenuItem name="1">
                    <Icon type="ios-navigate"></Icon>
                    Item 1
                </MenuItem>
                <MenuItem name="2">
                    <Icon type="ios-keypad"></Icon>
                    Item 2
                </MenuItem>
                <MenuItem name="3">
                    <Icon type="ios-analytics"></Icon>
                    Item 3
                </MenuItem>
                <MenuItem name="4">
                    <Icon type="ios-paper"></Icon>
                    Item 4
                </MenuItem>
            </div>
        </Menu> -->
        <Menu mode="horizontal" active-name="1" class="menu-hor" :style="'background-color:'+$store.state.config.theme+'.5)'">
            <Row>
                <Col span="9">
                    <div class="left">
                        <div class="logo">
                        </div>
                        <!-- <h3 class="title1">tuteng</h3> -->
                        <!-- <h3 class="title1">shefu</h3> -->
                        <h3 class="title1">shifen</h3>
                    </div>
                </Col>
                <Col span="8">
                    <div class="middle">
                        <div class="layout-assistant">
                            <!-- <MenuItem name="1">BAZI</MenuItem>
                            <MenuItem name="2">MBTI</MenuItem>
                            <MenuItem name="4">日 历</MenuItem>
                            <MenuItem name="5">星 座</MenuItem>
                            <MenuItem name="3">同月同日</MenuItem>
                            <MenuItem name="6">历史今日</MenuItem> -->
                            <a href="javascript:;" @click="randomC">changeC</a>
                        </div>
                    </div>
                </Col>
                <Col span="7">
                    <div class="right" style="background:yellow">
                        <div class="user-control" v-if="!logined">
                            <a href="javascript:;" @click="tab='login';showLogin=true;">登录</a>&nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="javascript:;" @click="tab='register';showLogin=true;">注册</a>
                        </div>
                        <div class="user-control" v-if="logined">
                            <Dropdown  @on-click="dropdownSelect($event)">
                                <a href="javascript:void(0)">
                                    {{userName}}
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="exit">退出</DropdownItem>
                                    <!-- <DropdownItem>炸酱面</DropdownItem>
                                    <DropdownItem disabled>豆汁儿</DropdownItem>
                                    <DropdownItem>冰糖葫芦</DropdownItem>
                                    <DropdownItem divided>北京烤鸭</DropdownItem> -->
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <v-login class="login" @getStatus="receive" v-if="showLogin" :tabNam = "tab"></v-login>
                    </div>
                </Col>
            </Row>
        </Menu>
        <div class="layout-content">
            <router-view></router-view>
        </div>
        <div class="layout-copy">
            2011-2016 &copy; TalkingData
        </div>
    </div>
</template>
<script>
    import userConfig from './js/user_config.js'
    import login from './components/login/login.vue'
    export default {
        data(){
          return {
              activeColor:'',
              showLogin:false,
              tab:'', //tabName
              userName:'',
              logined:false, //登录状态：是否登陆成功了
          }
        },
        methods:{
            randomC(){
                let c = `rgba(${getRandom(0,256)},${getRandom(0,256)},${getRandom(0,256)},`
                this.setConfig({'theme':c});
                console.log(c)
                function getRandom(min,max){
                    let random = min + Math.floor((max-min)*Math.random());
                    if(random<100){
                        random = random<10? "00"+random:"0"+random;
                    }else{
                        random = random+"";
                    }
                    return random;
                }
                /*
                rgba(082,083,009,
                rgba(041,014,172,
                */
            },
            dropdownSelect(name){
                //点击了退出
                if(name=='exit'){
                    window.sessionStorage.setItem('token','');
                    window.sessionStorage.setItem('userName','');
                    this.logined = false;
                    this.$Message.success("您已退出！");
                    //切换到paipan
                    this.$router.push({name:'baziPaipan'});
                    this.$store.commit('setActiveName', { name: 'baziPaipan' });
                    localStorage.setItem('activeName','baziPaipan');
                }
            },
            //接收子组件数据,控制是否显示登录窗
            receive(showLoginBox,logined){
                if(logined == true){ //如有说明成功登陆
                    this.logined = true;
                    this.showLogin = showLoginBox;
                    this.userName = window.sessionStorage.getItem('userName');
                    this.initConfig(); //登陆成功，同时初始化设置
                }else{
                    this.showLogin = showLoginBox;
                }
            },
            //初始化配置的方法
           initConfig(){
                //如果未登录
                if(this.StorageConfig.get()){
                    //先考虑使用本地配置
                    let config = this.StorageConfig.get();
                    this.$store.commit('setConfig',config);
                }else{
                    //再考虑使用默认配置信息
                    this.$store.commit('setConfig',userConfig);
                    this.StorageConfig.set(userConfig);
                }
               //如果已登录   
            //   if(this.logined){
            //         this.$http.get(apiPath+'/api/bz/getConfig').then(res=>{
            //                 let config = res.body.data[0];
            //                 //使用服务端的配置
            //                 this.$store.commit('setConfig',config);
            //                 console.log(config)
            //                 //覆盖本地配置
            //                 this.StorageConfig.set(config);
            //         },res=>{}); 
            //   }else {
            //         //如果未登录
            //         if(this.StorageConfig.get()){
            //             //先考虑使用本地配置
            //             let config = this.StorageConfig.get();
            //             this.$store.commit('setConfig',config);
            //         }else{
            //             //再考虑使用默认配置信息
            //             this.$store.commit('setConfig',userConfig);
            //             this.StorageConfig.set(userConfig);
            //         }
            //   }
           },
        },
        mounted(){
            },
        components:{
            'v-login':login
        },
        created(){
            this.initConfig();
            //每次载入先判定是否登录,且验证token是否过期
            if(window.sessionStorage.getItem('token')){

                this.$http.get(apiPath+'/api/bz/getConfig',).then(res=>{
                    console.log(res)
                            if(res.body.code==0){
                                this.logined = true;
                                this.userName = window.sessionStorage.getItem('userName')
                            }else{                             
                                window.sessionStorage.setItem('token','');
                            }
                },res=>{})
            }
        }
    }
</script>
<style lang="less" scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position:relative;
    width:100%;
    // height:100%;

    .menu-hor {
        margin-bottom:7px;
        padding-left:3%;
        padding-right:2%;
        height:56px;
        .left {
            // height: 60px;
                .title1 {
                    // color:#faf8fe;
                    color:#d7d0b7;
                    display: inline-block;
                    height:10px;
                    padding-top:10px;
                    float:left;
                }
                .logo{
                    float:left;
                    display: inline-block;
                    height:50px;
                    width:60px;
                    margin-top:2px;
                    background: transparent url('../static/img/logo5.png')  no-repeat left top ; 
                }
        }
        .middle {
            .layout-assistant{
                height: inherit;
            }
        }
        .right {
            .user-control {
                color:#ccc;
                padding-right:7%;
                float:right;
            }
            .login {
                width:400px;
            //   height: 300px;
                background-color: #fff;
                position: fixed;
                top:10%;
                right:10%;
                box-shadow:0px 0px 6px #ccc;
                border-radius:6px;
                z-index:100;
            }
        }
    }
    .layout-content{
        margin:0px 2%;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        min-height:470px;
        width:96%;
    }
    
    .layout-copy {
        width:100%;
        height: 38px;
        text-align:center;
        line-height: 38px;
        background-color: #ccc;
    }
}

</style>
