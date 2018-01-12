<template>
    <div class="bazi-calendar">
        <!-- <Row style="background:yellow"> 
            <Col span="24" style="margin-bottom:10px">
            <h4>calendar</h4>
            </Col>
        </Row> -->
        <!-- <Row>
            <Col span="24">
                <p>001</p>
            </Col>
        </Row> -->
        <div class="calendar-view">
            <div class="calendar-view-left"> 
                <div class="input-box">
                    <ButtonGroup size="small" style="margin:0 5px;">
                        <Button size="small" style="z-index:5" @click="changeYear('prev')"><i class="ivu-icon ivu-icon-chevron-left"></i></Button>
                        <Select v-model="yearVal" style="width:78px" size="small" @on-change="getMonthCalendar()">
                            <Option :selected="{true:item.value==2017}" v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select> 
                        <Button size="small" style="float:right;z-index:5" @click="changeYear('next')"><i class="ivu-icon ivu-icon-chevron-right"></i></Button>
                    </ButtonGroup> 
                    <ButtonGroup size="small" style="margin:0 5px;">
                        <Button size="small" style="z-index:5" @click="changeMonth('prev')"><i class="ivu-icon ivu-icon-chevron-left"></i></Button>
                        <Select v-model="monthVal" style="width:70px" size="small" @on-change="getMonthCalendar()">
                            <Option v-for="item in monthList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Button size="small" style="float:right;z-index:5" @click="changeMonth('next')"><i class="ivu-icon ivu-icon-chevron-right"></i></Button>
                    </ButtonGroup> 

                    <Button size="small" @click="backToday()">返回今天</Button>
                </div>
                <div class="week">
                    <div class="w">一</div>
                    <div class="w">二</div>
                    <div class="w">三</div>
                    <div class="w">四</div>
                    <div class="w">五</div>
                    <div class="w">六</div>
                    <div class="w">日</div>
                </div>
                <div class="days">
                    <div class="day"  v-for="(v,i) in monthData" :key="i" :class="{ 'not-month': v.month!=monthVal,'zm':(i+1)%7==0||(i+1)%7==6,'check':i==checkedIndex,'is-today':i==isToday}" @click="selectDay(i)">
                    <!-- <div :class="{'active':(v.month!=monthVal)},{'day':true}"  v-for="(v,i) in monthData" :key="i"> -->
                    <!-- <div :class="{ 'class-a': isA, 'class-b': isB}"  v-for="(v,i) in monthData" :key="i"> 5 6 12 13 19 20 26 27-->
                        <div class="solar">{{v.day}}</div>
                        <div class="lunar"  :class="{'is-lunar-j':v.lunarFestival}">{{v.lunarFestival?v.lunarFestival:v.lunarDayName}}</div>
                        <!-- <div class="lunar"  :class="{'is-term':v.term}">{{v.term?v.term:v.lunarDayName}}</div> -->
                        <div class="bottom-line"></div>
                        <div class="is-term" v-if="v.term">{{v.term?v.term:""}}</div>
                    </div>
                </div>

            </div>
            <div class="calendar-view-right">
                <p class="date">{{showInfo.year}}-{{showInfo.month|num2}}-{{showInfo.day|num2}}</p>
                <!-- <p class="week">{{showInfo.}}</p> -->
                <div class="day">{{showInfo.day}}</div>
                <div class="lunar-box">
                    <p class="nian">{{showInfo.lunarMonthName+showInfo.lunarDayName}}</p>
                    <p class="ganzhi">{{showInfo.GanZhiYear}}年 {{showInfo.GanZhiMonth}}月 {{showInfo.GanZhiDay}}日</p>
                    <p class="term">{{showInfo.term?showInfo.term:''}}</p>
                    <!-- <div class="sizhu">

                    </div> -->
                </div>
                <button @click="goPaipan('0')">←Go</button>
                <button @click="goPaipan('1')">Go→</button>
            </div>
        </div>
        <div class="model-box" id="model-box">
            <!-- <div class="jq">
                <span class="a">chun</span>
                <span class="b">lixia</span>
            </div> -->
            <div class="sun"></div>
            <div class="jieqi-model" id="jieqi-model">
                <div class="earth" id="earth"></div>
            </div>
        </div>
    </div>
</template>
<script>
import solarLunar from '../../js/solarLunar/solarLunar'
export default {
  data() {
    return {
    monthList: [
                // {
                //     value: '1',
                //     label: 'New York'
                // },
            ],
    yearList:[],
    yearVal:0, //当前月历的年份
    monthVal:0, //当前月历的月份
    monthData:[], //月历数据
    showInfo:{}, //存储当前日期
    checkedIndex:-1, //被选择的索引
    isToday:-1, //是不是今天,如果是赋值索引
    clickDay:0, //记录点击了几号，跳转月份时active
    offset:0, //记录偏移度
    offsetYear:null, //记录偏移时年份
    switchA:null, //控制是否允许发请求
    timeID:'',
    };
  },
  methods: {
    goPaipan(sex){
        //先设置默认查询值
        sessionStorage.setItem('sex',sex); //性别设置
        sessionStorage.setItem('isLunar','1'); //设为阳历
        let dateStr = this.showInfo.year+"-"+this.showInfo.month+"-"+this.showInfo.day+" "+12+":"+55+":"+55;
        if(!(/^\d{4}(-\d{1,2}){2}\s\d{1,2}(:\d{1,2}){2}$/.test(dateStr)))alert('dateStr格式错误');
        sessionStorage.setItem('dateStr',dateStr);
        //跳转
        sessionStorage.setItem('origin','router'); //声明跳转身份
        this.routerHandle('baziPaipan'); //跳到paipan页面
    },
    //返回今天按钮
    backToday(){
        let date = new Date();
        if(this.showInfo.day== date.getDate() && this.showInfo.month==date.getMonth()+1 && this.showInfo.year==date.getFullYear()){
            return;
        }
        this.getMonthCalendar(true);
    },
    //控制月份前进后退,改变monthVal和yearVal,请求数据
    changeMonth(val){
        if(val==='prev'){ 
            if(this.monthVal==1){ //如果是1月,切换为12月,并且年份减1
                if(this.yearVal<=1891){ //最小年份
                    return;
                }else{
                    this.switchA = false;
                    this.yearVal--;
                    let _this = this;
                    setTimeout(function(){
                        _this.switchA = true;
                        _this.monthVal=12;
                    },10)
                }
            }else{
                this.monthVal--;
            }
        }else if(val==='next'){
            if(this.monthVal==12){  //如果是12月,切换为1月,并且年份加1
                if(this.yearVal>=2100){ //最大年份
                    return;
                }else{
                    this.switchA = false;
                    this.yearVal++;
                    let _this = this;
                    setTimeout(function(){
                        _this.switchA = true;
                        _this.monthVal=1;
                    },10)
                }
            }else{
                this.monthVal++;
            }
        }
    },
    //控制年份前进后退,改变yearVal,请求数据
    changeYear(val){
        if(val==='prev'){
            this.yearVal = this.yearVal==1891?1891:this.yearVal-1;
        }else if(val==='next'){
            this.yearVal = this.yearVal==2100?2100:this.yearVal+1;
        }
    },
    //选择的是哪天(参数传入索引)
    selectDay(i){
        this.checkedIndex = i;
        //如果不是本月的号数,更新monthVal和yearVal
        if(this.monthData[i].month!=this.monthVal){
            this.clickDay = this.monthData[i].day; //记住点击的是几号,等数据回来时找出显示
            this.switchA = false;
            this.yearVal = this.monthData[i].year;//如果是1或12月时,yearVal也可能会变动
            let _this = this;
            setTimeout(function(){
                _this.switchA = true;
                _this.monthVal = _this.monthData[i].month; 
            },10)
        }else{
            this.clickDay = this.monthData[i].day; //记住点击的是几号,等数据回来时找出显示
            this.showInfo = this.monthData.slice(i)[0];
        }
        // console.log(i)
        // let index = -1;
        // if(!i){
        //     let date = new Date();
        //     if(this.yearVal==date.getFullYear() && this.monthVal==(date.getMonth()+1)){
        //         for(var k= 0;k<this.monthData.length;k++){
        //             if(this.monthData[k].month==date.getDate()){
        //                 index=key;
        //             }
        //         }
        //     }
        // }else{
        //     index = i;
        // }
        
        // console.log(index)
        // if(this.showInfo.month!=this.monthVal){
        //     let m = this.showInfo.month;
        //     this.monthVal = m;
        //     // this.getMonthCalendar();
        // }
    },
    //根据年月获取月历数据
    getMonthCalendar(isNow){
        if(!this.switchA){
            return;
        }
        if(isNow){
            this.yearVal = new Date().getFullYear();
            this.monthVal = new Date().getMonth()+1;
        }
        this.$http.post(apiPath+"/api/bz/getMonthCalendar",{year:this.yearVal,month:this.monthVal},{emulateJSON:true}).then(res=>{
            this.isToday = -1; 
            this.checkedIndex = -1;
            let count = res.body.data.monthDays;
            let week = res.body.data.firstDay;
            let addDay = week==0?6:week-1;
            let endIndex = Math.ceil((count+addDay)/7) * 7; //计算数组中需要显示的部分
            let tempArr = res.body.data.monthData.slice(0,endIndex);
            let _this = this;
            // 如果查询的月份和年份等于当前年月,就找出数组中今天的索引值并标识记录
            if(this.monthVal ==(new Date().getMonth()+1) && this.yearVal ==new Date().getFullYear()){
                let nowDay = new Date().getDate();
                tempArr.forEach(function(v,i){
                    if(v.day == nowDay){
                        _this.showInfo = v;
                        _this.isToday = i; //今天的索引
                        _this.clickDay = v.day; //记录当前日期号数
                    }
                })
            }else{
                let isHas = false; //记录是否有这一天(针对28-31这些不是每个月都有的号数)
                tempArr.forEach(function(v,i){
                    if(v.day ==  _this.clickDay && v.month ==_this.monthVal){
                        _this.showInfo = v;
                        _this.checkedIndex = i;
                        isHas = true;
                    }
                }) 
                if(!isHas){  //如果没有这一天,就把最后一天标识
                    let index = tempArr.length-1 - tempArr[tempArr.length-1].day;//找到最后一天的索引
                    _this.showInfo = tempArr[index];
                    _this.checkedIndex = index;
                }
            }
            this.monthData = tempArr;
            console.log(this.monthData);
            // this.selectDay();
        })
    },
    getTerm(option,callback){
        this.$http.post(apiPath+"/api/bz/getTerm",option,{emulateJSON:true}).then(res=>{
            // console.log((res.body.data));
                callback(res.body.data);
        })
    },
    createdSelectDate(){
        for(let i=1;i<=12;i++){
            this.monthList.push({
                    value: i,
                    label: i+'月'
            });
        }
        for(let i=1891;i<=2100;i++){
            this.yearList.push({
                    value: i,
                    label: i+'年'
            });
        }
    },
    modelRun(){
        var days = this.getDays(new Date());
        var arr = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
        var html =document.getElementById('model-box').innerHTML;
        for(var i=0;i<12;i++){
            html+= '<div class="jq" data-v-0e6f3ede=""><span class="s1" data-v-0e6f3ede="">'+arr[(11-i)%24]+'</span><span class="s2" data-v-0e6f3ede="">'+arr[(11-i+12)%24]+'</span></div>';
        }
        document.getElementById('model-box').innerHTML = html;

        var jqs = document.getElementsByClassName('jq');
        for(var i=0;i<jqs.length;i++){
            jqs[i].style.transform = "rotate("+(270+15*i)+"deg)";
        }
        var timeId = "";
        this.timeID=setInterval(function(){
            document.getElementById('earth').className = 'earth halo'
            setTimeout(function(){
                document.getElementById('earth').className = 'earth'
            },400)
        },700)
        var jm = document.getElementById('jieqi-model');
        var step = 360/366;
        var offset = 171-step*days; //第一个节气从小寒开始,约172度
        this.offset = offset;
        this.offsetYear = new Date().getFullYear();
        jm.style.transform = "rotate("+(171-step*days)+"deg)";
        // setInterval(function(){
        //     if(offset<360){
        //         offset -= step;
        //         jm.style.transform = "rotate("+offset+"deg)";
        //     }else{
        //         offset = 0;
        //     }
        // },30)

    },
    //计算一个date是当年的第几天
    getDays(date){
        // 构造1月1日
        var startDay = new Date(date.getFullYear()+"-1-1");
        // 获取距离1月1日过去多少天
        var days = (date - startDay) / (1000 * 60 * 60 *24) + 1;
        return days;
    },
    moveEarth(){
        var jm = document.getElementById('jieqi-model');
        var showInfo = this.showInfo;
        var step = 360/366;
        var dateStr = showInfo.year+'-'+showInfo.month+'-'+showInfo.day;
        var days = this.getDays(new Date(dateStr));
        var _offset = 171-step*days;  //当前日期offset
        var id = '';

        jm.style.transition = "transform .8s";
        jm.style.transform = "rotate("+_offset+"deg)";
        
        // var offset = this.offset;
        // var _this = this; 
        // console.log(showInfo.year);
        // console.log(this.offsetYear);
        // if(showInfo.year==this.offsetYear){
        //     clearInterval(id);
        //     id = setInterval(function(){
        //         if(offset<=_offset){  //顺时针转
        //             if(_offset-offset>step){
        //                 offset += step;
        //                 jm.style.transform = "rotate("+offset+"deg)";
        //             }else{
        //                 _this.offset = offset;
        //                 _this.offsetYear = showInfo.year;
        //                 clearInterval(id);
        //             }
        //         }else{ //逆时针转
        //             if(offset-_offset>step){
        //                 offset -= step;
        //                 jm.style.transform = "rotate("+offset+"deg)";
        //                 jm.style.transform = "rotate("+offset+"deg)";
        //             }else{
        //                 _this.offset = offset;
        //                 _this.offsetYear = showInfo.year;
        //                 clearInterval(id);
        //             }
        //         }
        //     },20)  
        // }else{
        //     // jm.style.transition = "transform .8s";
        //     this.offsetYear = showInfo.year;
        //     jm.style.transform = "rotate("+_offset+"deg)";
        // }

    }

  },
  watch:{
       'showInfo':'moveEarth'
  },
  beforeDestroy(){
      clearInterval(this.timeID);
  },
  mounted() {
      this.modelRun();
    // this.drawLine();
  },
  created(){
      this.switchA = true;
      let date = new Date();
      //设置当下的年月
      this.yearVal = this.nowY = date.getFullYear();
      this.monthVal = this.nowM = date.getMonth()+1;
      //显示当下的月历
      this.getMonthCalendar(true);
      //获取下拉框数据
      this.createdSelectDate(); //
    //   var termInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
    //   var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758)
    //     for(let i=1900;i<2055;i++){
    //         for(let j=1;j<25;j++){
    //             this.getTerm({year:i,num:j,isName:true},function(res){
    //                 let res1 = solarLunar.getTerm(i,j);
    //                 let res2 = getTerm(i,j-1)
    //                 let res3 = sTerm(i,j-1)
    //                 let d = res;
    //                 // if(res2!=res.substr(11,2) || res2!=res1 || res1!= res.substr(11,2)){
    //                 if(res3!=res.substr(11,2)){
    //                 // if(res1!= res.substr(11,2)){
    //                     console.log(res +" "+ res.substr(11,2)+"-"+(res2<10? '0'+res2:res2)+"-"+(res1<10?'0'+res1:res1)+"-"+(res3<10?'0'+res3:res3))


    //                 }
    //             })
    //         }
    //     }
    //     function getTerm(y,n) {
    //         var offDate = new Date( ( 31556925974.7*(y-1890) + termInfo[n]*60000  ) + Date.UTC(1890,0,5,16,2,31) );
    //         return(offDate.getUTCDate());
    //     };  //2017第24节气有误


  }
};
</script>
<style lang="less" scoped>
.bazi-calendar {
    min-height:378px;
    display: flex;
    .yue .ivu-select-selection{
        color:1px solid red ;
    }
    .calendar-view{
        display:flex;
        // display:none;
        width:560px;
        border:1px solid rgba(5,192,165,.9);
        .calendar-view-left{
            width:422px;
            padding:0px 5px 5px;
            background-color: rgba(255,255,255,.7);;
            border:1px dotted rgba(46,139,87,.07);
            .input-box {
                padding-top:8px;
                padding-bottom:8px;

            }
            .week{
                display: flex;
                flex-wrap:wrap;
                div.w{
                    padding-top:8px;
                    padding-bottom:8px;
                    width: 14.2857%;
                    text-align: center;
                    background-color: rgba(46,139,87,.07);
                }
            }
            .days{
                display: flex;
                flex-wrap:wrap;
                div.day{
                    width: 14.2857%;
                    text-align: center;
                    border-bottom:1px solid #f7f1f5;
                    background-color: #fff;
                    padding-top:6px;
                    padding-bottom:4px;
                    border:2px solid transparent;
                    border-radius:2px;
                    position: relative;
                    margin-bottom:1px;
                    position: relative;
                    .solar {
                        font-size:19px;
                        text-shadow: 1px 1px 1px #ccc;
                        // text-align: right;
                    }
                    .lunar {
                        color:	#707a7a;
                        margin-top:-2px;
                        // text-align: right;
                    }
                    &:hover {
                        border-color:#ff5d5b;
                        cursor:pointer;
                    }
                    .bottom-line {
                        height: 1px;
                        width:110%;
                        background-color: rgba(46,139,87,.07);
                        position: absolute;
                        bottom:-3px;
                        left:-2px;
                    }
                    //节气
                    .is-term{
                        // background-color: hotpink;
                        // border:1px solid #fb03f1;
                        // color:#fb03f1;
                        border:1px solid #fff;
                        background-color:#ff5d5b;
                        color:#fff;
                        position: absolute;
                        border-radius:3px;
                        top:4px;
                        left: 1px;
                        width:14px;
                        font-size:11px;
                        line-height: 12px;
                        padding:2px 0px;
                    }
                }
                //不是本月
                div.day.not-month {
                    // color:#bfbfbf !important;
                    opacity: 0.25;
                    .lunar,.solar,.is-term {
                        color:#495060;
                    }

                }
                //周末 或者是农历节
                div.day.zm, div.day .is-lunar-j {
                    color:#ff4433;
                }
                //被选中
                div.day.check {
                    border-color:#ff5d5b;
                }
                //今天
                div.day.is-today {
                    background-color:#ff5d5b;
                    color:#fff;
                    .lunar {
                        color:#fff;
                        text-shadow: 1px 1px 1px #ccc;
                    }
                }
            }
        }
        .calendar-view-right{
            width:138px;
            background-color: rgba(5,192,165,.3);
            background-color: rgba(5,192,165,.9);
            text-align: center;
            padding-top:4px;
            .date {
                line-height: 40px;
                color:#fff;
                font-size:15px;
            }
            .day {
                display: inline-block;
                width:82px;
                height: 80px;
                background-color: #ff5d5b;
                box-shadow:0px 0px 2px black;
                border-radius:5px;
                font-size:50px;
                color:#fff;
                line-height: 80px;
                padding-right:2px;
                margin-bottom:6px;
            }
            .lunar-box {
                p {
                    line-height: 22px;
                    color:#fff;
                    font-size:14px;
                }
            }
        }
    }
    .model-box {
        margin:0px auto;
        // background-color: skyblue;
        // width:250px;
        transform:scale(1,0.4);
        height:450px;
        position: relative;
        .jq {
            transform:scale(1,1.4);
            position: absolute;
            top:0;
            left:0;
            width:100%;
            height:100%;
            span {
                position: absolute;
                left:0;
                width:100%;
                text-align: center;
                font-size:15px;
                text-shadow:1px 1px 75px orange;
                // background-color: yellow;
            }
            span.s1 {
                top:0;
            }
            span.s2{
                bottom:0;
            }
        }
        .sun {
            position: absolute;
            top:50%;
            left:50%;
            width:46px;
            height:46px;
            margin-top:-42px;
            margin-left:-23px;
            background-color: orange;
            border-radius:50%;
            z-index: 5;
            transform:scale(1,2.2);
            box-shadow:0 0 30px red;
        }
        .jieqi-model {
            // margin:50px auto;
            width: 450px;
            height:450px;
            // background-color: #272822;
            border:1px solid #ccc;
            border-radius:50%;
            position:relative;
            // transform:skew(59deg,-10deg);
            transform: rotate(0.5, 2);
            text-align: center;
            box-shadow: 0 0 70px orange;
            .earth {
                position: absolute;
                left: 0px;
                top:50%;
                margin-top:-10px;
                margin-left:-10px;
                width:20px;
                height: 20px;
                border-radius:50%;
                background-color: blue;
                transform:scale(1,.8);
                border:1px solid #000;
            }
            .halo {
                box-shadow:0px 0px 12px red;
                border:1px solid red;
            }
        }
    }
}
</style>
