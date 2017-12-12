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

                    <Button size="small" @click="getMonthCalendar(true)">返回今天</Button>
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
                    <!-- <div class="day">1</div>
                    <div class="day">2</div>
                    <div class="day">3</div>
                    <div class="day">4</div>
                    <div class="day">5</div>
                    <div class="day">6</div>
                    <div class="day">7</div>
                    <div class="day">8</div>
                    <div class="day">9</div> -->
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
    yearVal:0,
    monthVal:0,
    monthData:[], //月历数据
    showInfo:{},
    checkedIndex:-1,
    isToday:-1,
    clickDay:0, //记录点击了几号，跳转月份时active
    };
  },
  methods: {
    //控制月份前进后退
    changeMonth(val){
        if(val==='prev'){
            if(this.monthVal==1){
                if(this.yearVal<=1891){ //最小年份
                    return;
                }else{
                    this.monthVal=12;
                    this.yearVal--;
                }
            }else{
                this.monthVal--;
            }
        }else{
            if(this.monthVal==12){
                if(this.yearVal>=2100){ //最大年份
                    return;
                }else{
                    this.monthVal=1;
                    this.yearVal++;
                }
            }else{
                this.monthVal++;
            }
        }
    },
    //控制年份前进后退
    changeYear(val){
        if(val==='prev'){
            this.yearVal = this.yearVal==1891?1891:this.yearVal-1;
        }else{
            this.yearVal = this.yearVal==2100?2100:this.yearVal+1;
        }
    },
    selectDay(i){
        this.checkedIndex = i;
        if(this.monthData[i].month!=this.monthVal){
            this.clickDay = this.monthData[i].day;
            this.monthVal = this.monthData[i].month;
            this.yearVal = this.monthData[i].year;
        }else{
            this.clickDay = this.monthData[i].day;
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
            if(this.monthVal ==(new Date().getMonth()+1) && this.yearVal ==new Date().getFullYear()){
                let nowDay = new Date().getDate();
                tempArr.forEach(function(v,i){
                    if(v.day == nowDay){
                        _this.showInfo = v;
                        _this.isToday = i;
                        _this.clickDay = v.day;
                    }
                })
            }else{
                let isHas = false; //记录是否有这一天
                tempArr.forEach(function(v,i){
                    if(v.day ==  _this.clickDay && v.month ==_this.monthVal){
                        _this.showInfo = v;
                        _this.checkedIndex = i;
                        isHas = true;
                    }
                })
                if(!isHas){
                    let index = tempArr.length-1 - tempArr[tempArr.length-1].day;//找到最后一天的索引
                    _this.showInfo = tempArr[index];
                    _this.checkedIndex = index;
                }
            }
            this.monthData = tempArr;
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

  },
  mounted() {
    // this.drawLine();
    
  },
  created(){
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
    .yue .ivu-select-selection{
        color:1px solid red ;
    }
    .calendar-view{
        display:flex;
        // width:555px;
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
                        border:1px solid #06bfa1;
                        color:#06bfa1;
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
}
</style>
