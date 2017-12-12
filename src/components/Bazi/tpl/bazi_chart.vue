<template> 
    <div class="bz-chart" >
       <div id="myChart" :style="{width: '100%', height: '340px'}"></div>
    </div>
</template>
<script>
 /**
 * Author: buzhiguang
 * Date: 2017-10-7
 */
export default {
  data() {
    return {
    };
  },
  methods:{
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'));
        let dataArr = [];
        let dataArr1 = [];
        let dataArr2 = [];
        let colorArr = [];
        let colorArr1 = [];
        let colorArr2 = [];
        const COLOR = {
            "金":"#f3d90b",
            "木":"#06ab11",
            "水":"#1f16c3",
            "火":"#fe3000",
            "土":"#964900"
        }
        let temp = this.$store.state.wxPower.WXPower;
        for(let key in temp){
            if(temp[key]!=0){
              dataArr.push({
                value:temp[key],
                name:key
              });
              colorArr.push(COLOR[key]);
            }
        }
        for(let key in this.$store.state.activeDaYun){
            if(this.$store.state.activeDaYun[key]!=0){
              dataArr1.push({
                value:this.$store.state.activeDaYun[key],
                name:key
              });
              colorArr1.push(COLOR[key]);
            }
        }
        for(let key in this.$store.state.activeLiuNian){
            if(this.$store.state.activeLiuNian[key]!=0){
              dataArr2.push({
                value:this.$store.state.activeLiuNian[key],
                name:key
              });
              colorArr2.push(COLOR[key]);
            }
        }
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
                  name:'【八字】',
                  type:'pie',
                  selectedMode: 'single',
                  radius: [0, '60%'],

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
                  color:colorArr,//["#fb9900","#06ab11","#1f16c3","#fe3000","#964900"],
                  data: dataArr,
              },
              //大运
            {
            name:'【大運】',
            type:'pie',
            radius: ['66%', '75%'],
            label: {
                normal: {
                    // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    shadowBlur:1,
                    shadowOffsetX: 1,
                    shadowOffsetY: 1,
                    shadowColor: '#999',
                    padding: [2, 2],
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
            color:colorArr1,
            data:dataArr1,
            },
            //流年
            {
            name:'【流年】',
            type:'pie',
            radius: ['78%', '86%'],
            label: {
                normal: {
                    // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    shadowBlur:1,
                    shadowOffsetX: 1,
                    shadowOffsetY: 1,
                    shadowColor: '#999',
                    padding: [5, 5],
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
            color:colorArr2,
            data:dataArr2,
            }
        ]
    });
    },
  },
  watch:{
    '$store.state.wxPower':'drawLine',
    '$store.state.activeDaYun':'drawLine',
    '$store.state.activeLiuNian':'drawLine',

  },
  mounted() {
    this.drawLine();
  },
  created() {
  }
};
</script>
<style lang="less" scoped>
.bz-chart {
    width:100%;
    // background:#ccc;
    font-size:16px;
    padding:12px;

    
}
</style>