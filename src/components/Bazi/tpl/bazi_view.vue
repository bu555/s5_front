<template> 
    <div class="bz-view" >
        <div class="detail" style="background:#fff">
            <div>姓名：{{this.name?this.name:'佚名'}}<span style="padding-left:36px">起运时间：{{this.bzInfo.other.qiyunTime}}</span> </div>
            <div>生辰：{{this.bzInfo.lunarInfo.solar}}(阳历)<span style="padding-left:15px">{{this.bzInfo.lunarInfo.lunarCH}}(阴历)</span></div>
        </div>
        <div class="sizhu gan">
            <div></div>
            <div class="zi">{{bzInfo.sizhu.sGan.zi}}<span class="ss-text">{{bzInfo.sizhu.sGan.shishen}}</span></div>
            <div class="zi">{{bzInfo.sizhu.rGan.zi}}<span class="riyuan">{{bzInfo.sizhu.rGan.shishen}}</span></div>
            <div class="zi">{{bzInfo.sizhu.yGan.zi}}<span class="ss-text">{{bzInfo.sizhu.yGan.shishen}}</span></div>
            <div class="zi">{{bzInfo.sizhu.nGan.zi}}<span class="ss-text">{{bzInfo.sizhu.nGan.shishen}}</span></div>
            <div class="zi">{{dyGan.zi}}<span class="ss-text">{{dyGan.shishen}}</span></div>
            <div class="zi">{{lnGan.zi}}<span class="ss-text">{{lnGan.shishen}}</span></div>
        </div>
        <div class="sizhu zhi">
            <div></div>
            <div class="zi">{{bzInfo.sizhu.sZhi.zi}}<span class="ss-text">{{bzInfo.sizhu.sZhi.shishen}}</span></div>
            <div class="zi">{{bzInfo.sizhu.rZhi.zi}}<span class="ss-text">{{bzInfo.sizhu.rZhi.shishen}}</span></div>
            <div class="zi">{{bzInfo.sizhu.yZhi.zi}}<span class="ss-text">{{bzInfo.sizhu.yZhi.shishen}}</span></div>
            <div class="zi">{{bzInfo.sizhu.nZhi.zi}}<span class="ss-text">{{bzInfo.sizhu.nZhi.shishen}}</span></div>
            <div class="zi">{{dyZhi.zi}}<span class="ss-text">{{dyZhi.shishen}}</span></div>
            <div class="zi">{{lnZhi.zi}}<span class="ss-text">{{lnZhi.shishen}}</span></div>
        </div>
        <div class="dayun-box">
            <div class="sui">
                <div class="dayun-title" style="width:20px">歲</div>
                <div v-for="(v,i) in bzInfo.dayunAndLiunian.slice(0,-1)" :key="i">{{v.liunian[0].sui}}</div>
            </div>
            <div class="year">
                <div class="dayun-title">年</div>
                <div v-for="(v,i) in bzInfo.dayunAndLiunian.slice(0,-1)" :key="i">{{v.liunian[0].year}}</div>
            </div>
            <div class="dayun">
                <div class="dayun-title">大運</div>
                <div  v-for="(v,i) in bzInfo.dayunAndLiunian.slice(0,-1)" v-on:click="changeDayun(v.liunian[0].year,$event)" :key="i" ref="dayunItem">{{v.dayun}} </div>
            </div>
        </div>
        <div class="liunian-box">
            <div class="sui">
                <div class="liunian-title">歲</div>
                <div v-for="(v,i) in liunianActiveObj.liunian" :key="i">{{v.sui}}</div>
            </div>
            <div class="year">
                <div class="liunian-title">年</div>
                <div v-for="(v,i) in liunianActiveObj.liunian" :key="i">{{v.year}}</div>
            </div>
            <div class="liunian">
                <div class="liunian-title">流年</div>
                <div :class="{'empty':v.empty}" v-for="(v,i) in liunianActiveObj.liunian" :key="i" ref="liunianItem" @click="changeLiunian(v.year,v.empty)">{{v.nian}}</div>
            </div>
        </div>
        <div class="ganzhi-info-box">
          <p class="">提示</p>
          <div class="title">天干提示：</div><div class="content"> {{$store.state.wxPower.hehuaObj.tg||'無'}}</div>
          <div class="title">地支提示：</div><div class="content"> {{($store.state.wxPower .hehuaObj.dz+$store.state.wxPower.hehuaObj.chong+$store.state.wxPower .hehuaObj.other)||'無'}}</div>
          <div class="title">喜忌：</div><div class="content"> {{$store.state.wxPower .xiji.details}}</div>
        </div>
    </div>
</template>
<script>
 /**
 * Author: buzhiguang
 * Date: 2017-10-7
 */
import {wxHandle,calcShiShen,getZhuPower} from '../../../js/tools/bazi_handle.js';
export default {
  data() {
    return {
      //按year更新的动态的liunian数组
      liunianActiveObj: {},
      activeLiuNian:"",//当前流年
      activeDaYun:"", //当前大运
      lnGan:{zi:"",shishen:""},
      lnZhi:{zi:"",shishen:"",canggan:""},
      dyGan:{zi:"",shishen:""},
      dyZhi:{zi:"",shishen:"",canggan:""},
      sex:0,
      isLunarLeap:'false', //如果是农历输入 闰&平
      // wxPower:{},
      tes:0,
      name:''
    };
  },
  props:['bzInfo'],
  computed: {},
  methods: {
    //新日期后点击确定按钮
    confirmBtn(){
      if(!sessionStorage.getItem('name')){
        this.name = ''; //如果本地没存'name',将值清空
      }
      this.calcLiuNianArr(new Date().getFullYear()); //计算当前年份所属流年
      var _this = this;
      this.$store.commit('setWxPower',wxHandle(this.bzInfo.sizhu));
      setTimeout(function(){
        _this.activeRed();
      },7)
    },
    //点击或改变大运  更新动态大运，更新页面流年数组,并将当前标红
    changeDayun(year,event){
        var index = this.calcLiuNianArr(year); //更新页面流年数组，同时返回所在this.bzInfo.dayunAndLiunian索引
        var _this = this;
        setTimeout(function(){
          _this.activeRed();
        },7);
    },
    //点击或改变流年  更新动态流年，并且将当前流年标红色
    changeLiunian(year,isEmpty){ 
      if(isEmpty) return;
      var _this = this;
        this.liunianActiveObj.liunian.forEach(function(v,i){
          if(v.year == year){
            _this.$refs.liunianItem.forEach(function(v,j){
                v.classList.remove("active-red");
            });
            _this.activeLiuNian = v.nian; //更新动态流年
            _this.$refs.liunianItem[i].classList.add("active-red");
          }
        })
        setTimeout(function(){ //休眠，待数据渲染到页面后执行
            _this.setBzColor();
        },15);
      this.getShiShen();//更新十神
      return -1;
    },
    //根据传入的流年年份，计算要显示的流年数组
    calcLiuNianArr(year){
        var _this = this;
        var index = -1;
        this.bzInfo.dayunAndLiunian.forEach(function(v,i){
          v.liunian.forEach(function(v,j){
              if(v.year == year){
                var len = _this.bzInfo.dayunAndLiunian[i].liunian.length;
                if(len==10){
                    _this.liunianActiveObj = _this.bzInfo.dayunAndLiunian[i];
                }else{
                  for(var k=0;k<(10-len);k++){ //小运时补足10个，方便显示
                      _this.bzInfo.dayunAndLiunian[i].liunian.push({empty:true});
                    }
                      _this.liunianActiveObj = _this.bzInfo.dayunAndLiunian[i];
                }
                index = i;
              }
          })
        });
        if(index==-1){
          _this.liunianActiveObj = _this.bzInfo.dayunAndLiunian[0];
          index = 0;
        }
        return index;
    },
    //对大运和流年标示红色（注：Dom渲染完成后才可调用）
    activeRed(){
        var _this = this;
      // 判断流年是否存在当前年份，如是将其标红，如不是将第一个标红
        var nowYear = new Date().getFullYear();
        var flag = false; //假设当前年不存在这个流年数组
        this.liunianActiveObj.liunian.forEach(function(v,i){
          if(v.year == nowYear){
            _this.$refs.liunianItem.forEach(function(v,j){
              v.classList.remove("active-red");
              });
              _this.$refs.liunianItem[i].classList.add("active-red");
              _this.activeLiuNian = _this.$refs.liunianItem[i].innerHTML.trim(); //流年变动
              flag = true;
            }
        })
        //如果不存在就将首个流年标红
        if(!flag){
              this.$refs.liunianItem.forEach(function(v,j){
                  v.classList.remove("active-red");
              });

            this.$refs.liunianItem[0].classList.add("active-red");
            this.activeLiuNian = this.$refs.liunianItem[0].innerHTML.trim(); //流年变动
        }
        //将大运标红
        this.$refs.dayunItem.forEach(function(v,i){
            if((v.innerHTML.trim()) == _this.liunianActiveObj.dayun){
              v.classList.add("active-red");
            }else{
              v.classList.remove("active-red");
            }
        });
        this.activeDaYun = this.liunianActiveObj.dayun;
        this.getShiShen(); //更新大运柱、流年柱
        setTimeout(function(){ //休眠，待数据渲染到页面后执行
          _this.setBzColor();
        },22)
    },
    //计算流年和大运的藏干、十神
    getShiShen(){
        const Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        const cangGan={
            子:"癸",
            丑:"己癸辛",
            寅:"甲丙戊",
            卯:"乙",
            辰:"戊乙癸",
            巳:"丙戊庚",
            午:"丁己",
            未:"己丁乙",
            申:"庚壬戊",
            酉:"辛",
            戌:"戊辛丁",
            亥:"壬甲",
        }
        var BZ = {};
        BZ.calcShiShen = function(gan,ry){  
            let ryIndex = Gan.indexOf(ry);
            let gIndex = Gan.indexOf(gan);
            let shishen = "";
            if(ryIndex-gIndex==0) shishen="比";
            if(ryIndex%2==0){
                if(ryIndex-gIndex==-1) shishen="劫";
                if(ryIndex-gIndex==-2||ryIndex-gIndex==8) shishen="食";
                if(ryIndex-gIndex==-3||ryIndex-gIndex==7) shishen="傷";
                if(ryIndex-gIndex==-4||ryIndex-gIndex==6) shishen="才";
                if(ryIndex-gIndex==-5||ryIndex-gIndex==5) shishen="財";
                if(ryIndex-gIndex==-6||ryIndex-gIndex==4) shishen="殺";
                if(ryIndex-gIndex==-7||ryIndex-gIndex==3) shishen="官";
                if(ryIndex-gIndex==-8||ryIndex-gIndex==2) shishen="梟";
                if(ryIndex-gIndex==-9||ryIndex-gIndex==1) shishen="印";
            }
            if(ryIndex%2==1){
                if(ryIndex-gIndex==1) shishen="劫";
                if(ryIndex-gIndex==2||ryIndex-gIndex==-8) shishen="梟";
                if(ryIndex-gIndex==3||ryIndex-gIndex==-7) shishen="印";
                if(ryIndex-gIndex==4||ryIndex-gIndex==-6) shishen="殺";
                if(ryIndex-gIndex==5||ryIndex-gIndex==-5) shishen="官";
                if(ryIndex-gIndex==6||ryIndex-gIndex==-4) shishen="才";
                if(ryIndex-gIndex==7||ryIndex-gIndex==-3) shishen="財";
                if(ryIndex-gIndex==8||ryIndex-gIndex==-2) shishen="食";
                if(ryIndex-gIndex==9||ryIndex-gIndex==-1) shishen="傷";
            }
            return shishen;
        }
        var _this = this;
        var ry = this.bzInfo.sizhu.rGan.zi;
        this.lnZhi.shishen = "";
        this.lnGan.shishen = "";
        this.dyZhi.shishen = "";
        this.dyGan.shishen = "";
        this.lnGan.zi = this.activeLiuNian.trim().substr(0,1); //流年干
        this.lnGan.shishen = BZ.calcShiShen(this.lnGan.zi,ry); //计算流年干十神 （传参 干和日柱）
        this.lnZhi.zi = this.activeLiuNian.trim().substr(1,1); //流年支
        //取出藏干
        this.lnZhi.canggan = cangGan[this.lnZhi.zi]; 
        //藏干计算十神
        (this.lnZhi.canggan.split("")).forEach(function(v,i){
           _this.lnZhi.shishen += BZ.calcShiShen(v,ry);
        })
        this.dyGan.zi = this.activeDaYun.trim().substr(0,1); //大运干
        if(this.dyGan.zi!="小"){
            this.dyGan.shishen = BZ.calcShiShen(this.dyGan.zi,ry); //传参 干和日柱
        }
        this.dyZhi.zi = this.activeDaYun.trim().substr(1,1); //大运支
        if(this.dyZhi.zi!="運"){
            this.dyZhi.canggan = cangGan[this.dyZhi.zi];
            (this.dyZhi.canggan.split("")).forEach(function(v,i){
                _this.dyZhi.shishen += BZ.calcShiShen(v,ry);
            })
        }   
    },
    // 设置八字的颜色
    setBzColor(){
        var zis = document.querySelectorAll(".zi");
        zis.forEach(function(v,i){
          v.setAttribute('class','');
        });
        for(var i=0;i<zis.length;i++){
          var text = zis[i].innerHTML.trim().substr(0,1);
            if(text=="甲"||text=="乙"||text=="寅"||text=="卯"){
              zis[i].setAttribute('class','zi wood');
            }else if(text=="丙"||text=="丁"||text=="午"||text=="巳"){
              zis[i].setAttribute('class','zi fire');
            }else if(text=="戊"||text=="己"||text=="辰"||text=="戌"||text=="丑"||text=="未"){
              zis[i].setAttribute('class','zi soil');
            }else if(text=="庚"||text=="辛"||text=="申"||text=="酉"){
              zis[i].setAttribute('class','zi gold');
            }else if(text=="壬"||text=="癸"||text=="子"||text=="亥"){
              zis[i].setAttribute('class','zi water');
            }else{  //针对小运二字
              zis[i].setAttribute('class','zi xiaoyun-color');
            }
        }
    },
  },
  watch:{
      'bzInfo':'confirmBtn',
      //监测liunian变动
      'activeLiuNian':function(){
          this.$store.commit("setActiveLiuNian",getZhuPower(this.activeLiuNian))
      },
      //监测dayun变动
      'activeDaYun':function(){
          this.$store.commit("setActiveDaYun",getZhuPower(this.activeDaYun))
      },
  },
  mounted() {
    // this.confirmBtn();
    //初始挂载完后标红色
    this.activeRed();
  },
  created() {
      this.$store.commit('setWxPower',wxHandle(this.bzInfo.sizhu));
      //根据存储session的name判定是否是列表页跳转过来
      if(sessionStorage.getItem('name')){
        this.name = sessionStorage.getItem('name');
        sessionStorage.setItem('name',''); //抹去名字
      }
      //渲染dom前先获取到包含当前年份的流年数组
      var nowDate = new Date();
      this.calcLiuNianArr(nowDate.getFullYear()); //计算出当前年份所属流年数组
  }
};
</script>
<style lang="less" scoped>
.bz-view {
    width:100%;
    background-color:#f9f9f9;
    font-size:16px;
    padding:12px;
    div.detail {
      margin:-10px -10px 10px -10px;
      font-size:13px;
      padding:4px 8px;
      color:	#888888;
    }
    div.sizhu {
        display: -webkit-flex; /* Safari */
        display: flex;
        div {  /* 字 */
            width: 15%;
            font-size: 25px;
            font-family: "Microsoft YaHei";
            position: relative;
            font-weight: 500;
            span { /* 十神 */
                position: absolute;
                top: 1%;
                right: 24%;
                font-size: 10px;
                width: 16px;
                line-height: 14px;
            }
        }
    }
    div.zhi {
      div > span {
        top: 2px;
      }
      padding-bottom:4%;
    }
    div.zi {
      // text-shadow:1px 1px 2px black;
      text-shadow:1px 1px 1px black;
      span {
      text-shadow:none;
      }
    }
    .riyuan {
      color: red;
    }
    .dayun-box,.liunian-box {
      border-top:1px dotted #ccc;
      padding-top:2px;
      // padding-bottom:2px;
      // background-color: rgba(255,255,255,.5);
          div.sui {
          display: -webkit-flex; /* Safari */
          display: flex;
          div {
            width: 10%;
            padding: 0%;
            text-align: center;
            font-size: 1%;
            font-family: "Microsoft YaHei";
          }
        }
        div.year {
          display: -webkit-flex; /* Safari */
          display: flex;
          div {
            width: 10%;
            padding: 0%;
            text-align: center;
            font-size: 1%;
            font-family: "Microsoft YaHei";
          }
        }
        div.dayun,div.liunian {
          display: -webkit-flex; /* Safari */
          display: flex;
          height: 52px;
          div {
            width: 10%;
            padding: 0 10px;
            text-align: center;
            font-size: 17px;
            font-family: "Microsoft YaHei";
            border:1px solid transparent;
            border-radius:3px;
            &:hover{
                cursor:pointer;
                border-color: red;
                box-shadow: 0px 0px 2px orange;
            }
          }
        }
        //dayun标题颜色
        .year .dayun-title,.sui .dayun-title,.dayun .dayun-title,
        .year .liunian-title,.sui .liunian-title,.liunian .liunian-title,
         {
          height:18px;
          line-height: 16px;
          width:20px;
          border-radius:11px;
          margin:1px 2px;
          color:#fff;
          background-color: #ccc;
        }
        .dayun .dayun-title,.liunian .liunian-title ,.empty{
          padding:5px 2px;
          height:44px;
          margin-top:5px;
          font-size:14px;
          border: none;
          &:hover {
            border: none !important;
            cursor:default !important;
            box-shadow:none !important;
          }
        }
    }
    .ganzhi-info-box {
        font-size:14px;
        .title {
          display: inline-block;
          float:left;
        }
        .content {
            padding-left:28px;        
        }
    }
    // active color 激活颜色
    .active-red {
      color: #fe3000;
      // text-shadow: 0px 0px 1px orange;
      font-weight:700 !important;
    }
    //十神文字颜色
    .ss-text {
      color:#1a1a1a;
    }
    //五行颜色
    .wood {
      color:#06ab11;
    }
    .fire {
      color:#fe3000;
    }
    .soil {
      color:#964900;
    }
    .gold {
      color:#fb9900;
    }
    .water {
      color:#1f16c3;
    }
    //小运文字颜色
    .xiaoyun-color {
      color:#958596;
    }
}
</style>