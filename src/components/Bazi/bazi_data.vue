<template>
    <div class="bazi-data">
        <Row> 
            <Col span="24" style="margin-bottom:9px">
                <Input v-model="searchValue" placeholder="请输入关键字..." @on-change="changeHandle" style="width:180px;height:32px"></Input>
                <Button type="primary" icon="ios-search" @click="searchBtn(searchValue)">查 找</Button>
                <Button type="error" style="margin-left:7px" @click="delBtn"><Icon type="ios-trash"></Icon> 删 除</Button>
                <!-- 删除弹窗 -->
                <!-- <Button @click="modal5 = true">Set the width</Button> -->
                <Modal v-model="modal5" width="300" @on-ok="delData" >
                <p slot="header" style="color:#f60;text-align:left">
                    <Icon type="information-circled"></Icon>
                    <span>警示信息</span>
                </p>
                    <p>确定删除所选的数据？</p>
                    <!-- <p>The width of the dialog box is responsive, and the width becomes <code>auto</code> when the screen size is less than 768px.</p> -->
                </Modal>
            </Col>
            <Col span="24">
                <i-table border ref="selection" :columns="columns4" :data="data1" @on-selection-change="selectChange($event)"
                ></i-table>
                <div class="footer-tool" style="padding:12px 0 8px">
                    <Button @click="handleSelectAll(true)">全部选择</Button>&nbsp; 
                    <Button @click="handleSelectAll(false)">取消选择</Button>
                    <Page :total="itemTotal" :page-size="pageSize" show-elevator @on-change="pageChange($event)" :current="currentPage" class="page-ctrl"></Page>
                </div>
            </Col>
            <!-- <Alert type="success" show-icon>  :current="currentPage"
                A success prompt
                <span slot="desc">Content of prompt. Content of prompt. Content of prompt. Content of prompt. </span>
            </Alert> -->
            
        </Row>
    </div>
</template>
<script>
export default {
  data() {
    return {
        searchValue:'',
        selectItem:[],
        itemTotal:0, //页码总数
        pageSize:5, //每页条数
        prevKeyword:'',//上一个搜索词
        currentPage:1, //分页器当前页码

        modal5: false, //显示删除警示信息

        columns4: [
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title: '名字',
                key: 'name'
            },
            {
                title: '性别',
                key: 'sex',
            },
            {
                // title: '生辰',
                title: 'Solar',
                key: 'solar'
            },
            {
                // title: '生辰',
                title: 'lunarCH',
                key: 'lunarCH'
            },
            {
                title: 'Time',
                key: 'time'
            },
            {
                // title: '生日提醒',
                title: 'isRemind',
                key: 'isRemind'
            },
            {
                title: 'Remark',
                key: 'lunar'
            },
        ],
        data1: [],
        modal5:false
    };
  },
  methods: {
      // 选项改变时触发
        selectChange(d){
            this.selectItem = d;
            console.log(d);
        },
        handleSelectAll (status) { //是否全选
            this.$refs.selection.selectAll(status);
        },
        //如果搜索框清空，返回所有数据
        changeHandle(){
            if(!this.searchValue.trim()){
                this.getAll();
            }
        },
        // 查找按钮点击
        searchBtn(name,page=1){
            let keyWord = name.trim();
            if(!keyWord){
                this.warning("请输入关键字！");
                return false;
            }
            this.$http.post(apiPath+'/api/bz/search',{name:keyWord,size:this.pageSize,page:page},{emulateJSON:true}).then(res=>{
                this.data1 = res.body.data.list;
                this.pageTotal = res.body.data.count;
                this.itemTotal = res.body.data.total;
                this.currentPage=res.body.data.page;
                this.prevKeyword = keyWord; //记下搜索词
            },res=>{})
        },
        // 获取数据
        getAll(page=1){
            if(!sessionStorage.getItem('token')){
                        // this.$Modal.warning({
                        //     title: "提示",
                        //     content: "需要登录后才能对数据存储、查看或修改！"
                        // });
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>需要登录后才能对数据存储、查看或修改！</p>',
                    onOk: () => {
                        //切换到paipan
                        this.$router.push({name:'baziPaipan'});
                        this.$store.commit('setActiveName', { name: 'baziPaipan' });
                        localStorage.setItem('activeName','baziPaipan');
                    }
                });
            }
            this.$http.post(apiPath+'/api/bz/list',{size:this.pageSize,page:page},{
                emulateJSON:true,
                // headers:{"token5":sessionStorage.getItem('token')}
                }).then(res=>{
                if(res.body.code==0){
                    this.data1 = res.body.data.list;
                    this.pageTotal = res.body.data.count; //总页数
                    this.itemTotal = res.body.data.total; //总条数
                    this.currentPage=res.body.data.page || 1; //如果没有数据，为0时设为1
                    this.prevKeyword = ""; //清空搜索词
                }
            },res=>{})
        },
        //点击删除按钮判断
        delBtn(){
            if(this.selectItem.length>0){
                this.modal5 = true; //显示弹窗
            }else{
                this.warning("请至少选择一条信息！")
                return false;
            }
        },
        //删除数据
        delData(){
            let idArr = [];
            this.selectItem.forEach((v,i)=>{
                idArr.push(v._id);
            })
            this.$http.post(apiPath+'/api/bz/del',{id:JSON.stringify(idArr)},{emulateJSON:true}).then(res=>{
                if(res.body.code==0){
                    this.success("删除成功！");
                    this.selectItem = [];//注意：清空被选择的id
                    if(this.prevKeyword){ //如果未被清除说明还是搜索状态
                        this.searchBtn(this.prevKeyword,this.currentPage); 
                    }else{
                        this.getAll(this.currentPage);
                    }
                }
            },res=>{ })
        },
        //警告提示
        warning (msg) { 
            this.$Message.warning(msg);
        },
        //分页器改变
        pageChange(page){
            console.log(this.currentPage);
            if(this.prevKeyword){
                this.selectItem = [];//清空被选择的
                this.searchBtn(this.prevKeyword,page);
            }else{
                this.selectItem = [];//清空被选择的
                this.getAll(page); 
            }
        },
        //成功提示
        success (msg) {
            this.$Message.success(msg);
        },
  },
  mounted() {
 
  },
  created(){
      this.getAll();
  }
};
</script>
<style lang="less" scoped>
.bazi-data {
    .footer-tool {
        position: relative;
        .page-ctrl {
            position: absolute;
            top:15px;
            left:35%;
            // transform:translate(-50%,-50%);
        }
    }
}
</style>
