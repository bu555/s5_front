<template>
    <div class="login">
        <Tabs :value="tabName" class="tab-pane">
            <TabPane label="登录" name="login" class="tab1">
                <Form ref="formInline" :model="formInline" :rules="ruleInline" >
                    <FormItem prop="user">
                        <Input type="text" v-model="formInline.user" placeholder="邮箱/用户名/手机">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" v-model="formInline.password" placeholder="密码">
                            <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleLogin('formInline')">登录</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="注册" name="register" class="tab2">
                <Form :model="formItem" :label-width="80">
                    <FormItem label="用户名">
                        <Input v-model="formItem.userName" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" v-model="formItem.password" placeholder="请输入密码"></Input>
                    </FormItem>
                    <FormItem label="确认密码">
                        <Input type="password" v-model="password1" placeholder="请再次输入密码"></Input>
                    </FormItem>
                    <FormItem label="性别">
                        <RadioGroup v-model="formItem.sex">
                            <Radio label="男">男</Radio>
                            <Radio label="女">女</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input type="text" v-model="formItem.email" placeholder="请输入邮箱（可用于找回密码）"></Input>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" @click="handleRegister('formItem')">Submit</Button>
                        <!-- <Button type="ghost" style="margin-left: 8px">Cancel</Button> -->
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="找回密码" name="pwd" class="tab2">
                <Form :model="formItem" :label-width="80">
                    <FormItem label="用户名">
                        <Input v-model="formItem.userName" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" v-model="formItem.password" placeholder="请输入密码"></Input>
                    </FormItem>


                    <FormItem>
                        <Button type="primary" @click="handleRegister('formItem')">Submit</Button>
                        <Button type="ghost" style="margin-left: 8px">Cancel</Button>
                    </FormItem>
                </Form>
            </TabPane>
        </Tabs>
        <!-- <a class="closeIcon"><Icon type="close-circled"></Icon></a> -->
        <a class="closeIcon" @click="showLoginBox=false"><Icon type="close-round"></Icon></a>
    </div>
</template>
<script>
export default {
    data () {
        return {
            // tabName:'login',
            //登陆输入信息
            formInline: {
                user: '',
                password: ''
            },
            ruleInline: {
                user: [
                    { required: true, message: '请输入邮箱、用户名或手机', trigger: 'blur' },
                    { type: 'string',trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不小于6位！', trigger: 'blur' }
                ]
            },
            //注册输入信息
            formItem: {
                userName: '',
                password: '',
                sex:'男',
                email:''
            },
            password1:'',
            showLoginBox:true, //是否显示此登陆窗口（传给父组件）
            logined:false, //是否登陆成功
            tabName:''
        }
    },
    props:['tabNam'],
    methods: {
        //发送事件通知父组件
        emitEvent(){
            if(this.logined){ //登陆成功+关闭窗
                this.$emit("getStatus",this.showLoginBox,this.logined)
            }else{ //关闭窗
                this.$emit("getStatus",this.showLoginBox)
            }
        },

        handleLogin(d) {
            this.$refs[d].validate((valid) => {
                if (valid) {
                    // this.$Message.success('Success!');
                    this.$http.post(apiPath+'/api/bz/login',{
                            userName:this.formInline.user,
                            password:this.formInline.password
                        },{emulateJSON:true}).then(res=>{
                            if(res.body.code==0){
                                this.$Message.success(res.body.msg);
                                //每次登录成功本地存储token 和userName
                                sessionStorage.setItem('token',res.body.token);
                                sessionStorage.setItem('userName',this.formInline.user);
                                this.logined = true; //切换状态
                                this.showLoginBox = false; //可以关闭登录框
                            }else{
                                this.$Message.error(res.body.msg);
                            }
                    },res=>{})
                } else { }
            })
        },
        handleRegister(d) {
            this.tabName = "register";
            for(let key in this.formItem){
                if(!this.formItem[key].trim()){
                    this.$Message.error("请将信息输入完整！");
                    return false;
                }
            }
            if(this.formItem.password!=this.password1){
                    this.$Message.error("两次密码输入不一致！");
                    return false;
            }
            // 注册
            this.$http.post(apiPath+'/api/bz/register',this.formItem,{emulateJSON:true}).then(res=>{
                    if(res.body.code==0){
                        this.$Message.success("注册成功！");
                        this.$Message.success("注册成功！");
                        this.tabName = "login"; //注册成功切换到登录面板
                        //输入值清空
                        this.formItem.userName = "";
                        this.formItem.password = "";
                        this.password1 = "";
                        this.formItem.email = "";
                        this.formItem.sex = "男";
                    }
            },res=>{})

            // 查询用户
            // this.$http.post(apiPath+'/api/bz/findUser',{},{emulateJSON:true}).then(res=>{
            //     console.log(res.body)
            // },res=>{})
        }
    },
    watch:{
        'showLoginBox': 'emitEvent',

    },
    created(){
        this.tabName = this.tabNam;
    }
}
</script>
<style lang="less" scoped>
    .login {
        position: relative;
        .closeIcon {
            position: absolute;
            top:6px;
            right:6px;
            width:34px;
            height: 28px;
            line-height: 30px;
            text-align:center;
            // background-color: pink;
        }
        .tab-pane {
            // width:40%
            // background-color: red;
            .tab1 {
                padding:22px 90px 10px 90px;
            }
            .tab2 {
                padding:22px 70px 30px 20px
            }
            .ivu-tabs-tab {
                width: 150px !important;
                text-align: center !important;
                background-color: red;
            }
            .ivu-input-group-prepend {
                border-right: 0;
                width: 40px !important;
            }
        }
span {
    background-color: red;
}

    }
</style>
