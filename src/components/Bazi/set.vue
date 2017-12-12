<template>
<div class="set">
    <Tabs type="card" :value="$store.state.activeName" @on-click="getName($event)">
        <TabPane label="主题设置" name="baziSet-theme">
            <ul class="setTheme">
                <li class="tit">
                    <span class="titl">主题颜色 </span>
                    <span class="info"> 设置整体的界面风格</span>
                </li>
                <li class="second">
                    <!-- <RadioGroup v-model="button2" type="button"> -->
                        <!-- <Radio label="北京" style="background-color:red"></Radio>
                        <Radio label="上海" style="background-color:blue"></Radio>
                        <Radio label="深圳" style="background-color:green"></Radio>
                        <Radio label="杭州" style="background-color:lime"></Radio>
                        <Radio label="3" style="background-color:yellow"></Radio> -->
                    <!-- </RadioGroup> -->
                </li>
                </br>
                <li class="tit">
                    <span class="titl">排盘窗颜色 </span>
                    <span class="info"> 设置排盘视口背景颜色</span>
                </li>
                <li class="second">
                    <RadioGroup v-model="button1" type="button" @on-change="getTheme($event)" v-for="(v,i) in colors" :key="i">

                        <Radio :label="v.val" :style="'background-color:'+v.val+'.7);color:#fff'" >{{v.name}}</Radio>
                        <!-- <Radio label="rgba(255,255,255," style="background-color:rgba(255,255,255,.9);color:#fff" >白色</Radio>
                        <Radio label="rgba(255,0,0," style="background-color:rgba(255,0,0,.9);color:#fff" >红色</Radio>
                        <Radio label="rgba(255,165,0," style="background-color:rgba(255,165,0,.9);color:#fff">橙色</Radio>
                        <Radio label="rgba(255,215,0," style="background-color:rgba(255,215,0,.9);color:#fff">金色</Radio>
                        <Radio label="rgba(0,128,0," style="background-color:rgba(0,128,0,.9);color:#fff">绿色</Radio>
                        <Radio label="rgba(0,0,255," style="background-color:rgba(0,0,255,.9);color:#fff">蓝色</Radio>
                        <Radio label="rgba(105,105,105," style="background-color:rgba(105,105,105,.9);color:#fff">黯灰</Radio>
                        <Radio label="rgba(128,0,128," style="background-color:rgba(128,0,128,.9);color:#fff">紫色</Radio>
                        <Radio label="rgba(0,0,0," style="background-color:rgba(0,0,0,.9);color:#fff">黑色</Radio> -->
                    </RadioGroup>
                </li>
            </ul>
        </TabPane>
        <TabPane label="标签二" name="baziSet-birthday">
            <ul class="setBirt">
                <li class="tit">
                    <span class="titl">提醒时间 </span>
                    <span class="info"> 设置时间</span>
                </li>
                <li class="second">
                    <TimePicker v-model="birtNotice" type="time" placeholder="Select time" style="width: 168px"></TimePicker>
                </li>
                </br>
                <li class="tit">
                    <span class="titl">生日类型 </span>
                    <span class="info"> 设置时间</span>
                </li>
                <li class="second">
                        <CheckboxGroup v-model="birtType">
                            <Checkbox label="阳历"></Checkbox>
                            <Checkbox label="阴历"></Checkbox>
                        </CheckboxGroup>
                </li>

            </ul>
        </TabPane>
        <TabPane label="标签三" name="baziSet-paipan">
            <ul class="setPaipan">
                <li>
                    <i-switch size="small" v-model="remind"></i-switch> 
                    <span class="titl">生日提醒</span>
                    <span class="info">开启后提示</span>
                </li>
                <li>
                    <i-switch size="small" v-model="isAuto23"></i-switch> 
                    <span class="titl">子时设定</span>
                    <span class="info">23时按次日子时排</span>
                </li>
                <li>
                    <i-switch size="small"></i-switch> 
                    <span class="titl">背景颜色</span>
                </li>
                <li>
                    <i-switch size="small" v-model="ziColor"></i-switch> 
                    <span class="titl">五行颜色</span>
                    <span class="info">启用五行颜色</span>
                </li>
                <li>
                    <i-switch size="small" v-model="openInfo"></i-switch> 
                    <span class="titl">提示信息</span>
                    <span class="info">显示合沖害、参考用神等提示</span>
                </li>
            </ul>

        </TabPane>
    </Tabs>
</div>
</template>
<script>
    export default {
        data(){
            return{
                activeName:'',
                button1:'',
                button2:'',
                remind: !!(this.$store.state.config.remind-0),
                isAuto23: !!(this.$store.state.config.isAuto23-0),
                ziColor: !!(this.$store.state.config.ziColor-0),
                openInfo: !!(this.$store.state.config.openInfo-0),
                birtNotice:new Date('2011-11-11 07:07:07'),
                birtType:['阳历','阴历'],
                colors:[
                    {
                        val:'rgba(0,0,0,',
                        name:'白色'
                    },
                    {
                        val:'rgba(245,245,245,',
                        name:'白烟'
                    },
                    {
                        val:'rgba(255,150,0,',
                        name:'香槟色'
                    },
                    {
                        val:'rgba(071,205,189,',
                        name:'天蓝'
                    },
                    {
                        val:'rgba(	10,177,10,',
                        name:'深绿'
                    },
                    {
                        val:'rgba(123,059,065,',
                        name:'紫罗兰'
                    },
                    {
                        val:'rgba(171,065,132,',
                        name:'紫'
                    },
                    {
                        val:'rgba(108,128,115,',
                        name:'石板灰'
                    },
                    {
                        val:'rgba(197,188,152,',
                        name:'浅灰'
                    },
                    {
                        val:'rgba(245,252,97,',
                        name:'金麦色'
                    },
                    {
                        val:'rgba(85,107,47,',
                        name:'黯绿'
                    },
                ]
            }
        },
        methods:{
        getTheme(e){
            this.setConfig({'theme':e});
            //rgba(255,255,255,
            // this.$store.commit('setTheme',{color:e})
            // localStorage.setItem('theme',e);
            // console.log(e);
            // this.$http.post(apiPath+'/api/bz/setConfig',{key:'theme',value:e},{emulateJSON:true}).then(res=>{
                //     alert(res.body.msg);
            // })

        },
        getName(name){
                this.$store.commit('setActiveName', { name: name });
                localStorage.setItem('activeName',name);
            }
        },
        created(){
            // this.activeName = this.$store.state.setActiveName;
            this.birtNotice = new Date('2011-11-11 07:07:07');
            console.log(typeof this.$store.state.config.isAuto23)
        },
        watch:{
            'isAuto23':function(){this.setConfig({'isAuto23':Number(this.isAuto23)+''})},
            'ziColor':function(){this.setConfig({'ziColor':Number(this.ziColor)+''})},
            'openInfo':function(){this.setConfig({'openInfo':Number(this.openInfo)+''})},
            'remind':function(){this.setConfig({'remind':Number(this.remind)+''})}
        }
    }
</script>
<style lang="less" scoped>
.set{
    .setTheme{
        margin-left:5%;
        li.tit{
            height: 38px;
            font-size:14px;
            // margin-bottom:22px;
            position: relative;
            span.info {
                position: absolute;
                left: 0%;
                bottom:3px;
                font-size:11px;
                color:#cccccc;
            }
            div{
                padding-top:2px;
            }
        }
        li.second{
            padding-bottom:12px;
            border-bottom:1px dotted #f1f1f1;
        }
    }
    .setBirt{
        margin-left:5%;
        li.tit{
            height: 38px;
            font-size:14px;
            // margin-bottom:22px;
            position: relative;
            span.info {
                position: absolute;
                left: 0%;
                bottom:3px;
                font-size:11px;
                color:#cccccc;
            }
            div{
                padding-top:2px;
            }
        }
        li.second{
            padding-bottom:12px;
            border-bottom:1px dotted #f1f1f1;
        }
    }
    .setPaipan {
        margin-left:5%;
        li{
            height: 50px;
            font-size:14px;
            position: relative;
            padding-top:6px;
            border-bottom:1px dotted #f1f1f1;
            span.info {
                position: absolute;
                left: 0%;
                bottom:6px;
                font-size:11px;
                color:#cccccc;
            }
        }
    }
}
</style>
