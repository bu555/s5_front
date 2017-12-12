const Gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const Zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
//判断五行
function calcWuXing(gan){
    let wux="";
    if(gan=="甲"||gan=="乙") wux="木";
    if(gan=="丙"||gan=="丁") wux="火";
    if(gan=="戊"||gan=="己") wux="土";
    if(gan=="庚"||gan=="辛") wux="金";
    if(gan=="壬"||gan=="癸") wux="水";
    return wux;
}
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
//推算十神 传参干和日元
function calcShiShen(gan,ry){  
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
const score={ //权重分数配置
    t:35, //天干
    d1:40, //一个藏干的地支
    dd1:35, dd2:10, //二个藏干的地支，如：亥、午
    ddd1:30, ddd2:10, ddd3:5, //三个藏干的地支
    t_he:13, //天干合化加成
    d_6he:10, //地支六合加成
    d_3he:18, //地支三合加成
    d_3hui:0.3, //地支三会加成（乘系数）
    d_chong1:-0.15, //主冲 （自身耗损系数）
    d_chong2:-0.30, //被冲 （自身耗损系数）
    d_chong:-0.1, //平冲 如：丑未 辰戌 （自身耗损系数）
    //与邻字生剋泄耗作用 
    sheng:0.2,//被生或助（乘系数）
    ke:-0.25, //被剋制（乘系数）
    xie:-0.1, //被泄或食（乘系数）--
    hao:-0.033, //被耗 （乘係數）--才財
    //月令加成
    yueHelp1:15, //主气元素点数加成
    yueHelp2:0.15, //主气元素系数加成
    yueSheng:0.05, //得月令生元素系数加成（乘系数）
    yueKe:-0.08, //被月令剋元素系数减力（乘系数）
}
//被邻字生剋泄耗作用所乘系数 params:十神
function getScore(ss){  
    if(ss=="比"||ss=="劫"||ss=="印"||ss=="梟"){
        return score.sheng; //得生 系数
    }else if(ss=="食"||ss=="傷"){
        return score.xie; //被泄 系数
    }else if(ss=="才"||ss=="財"){
        return score.hao; //被耗 系数
    }else{
        return score.ke; //被克制 系数
    }
}
function getZhuPower(zhu){
    if(zhu=='小運'){
        return {};
    }
    let WXPower={
        '金':0,
        '木':0,
        '水':0,
        '火':0,
        '土':0
    };
    let wx = calcWuXing(zhu.substr(0,1)); //得天干五行
    WXPower[wx] = score.t; //计分数
    let cg = cangGan[zhu.substr(1,1)];
    if(cg.length==1){
        WXPower[calcWuXing(cg)] += score.d1;  
    }else if(cg.length==2){
        WXPower[calcWuXing(cg[0])] += score.dd1;  
        WXPower[calcWuXing(cg[1])] += score.dd2;  
    }else{
        WXPower[calcWuXing(cg[0])] += score.ddd1;  
        WXPower[calcWuXing(cg[1])] += score.ddd2;  
        WXPower[calcWuXing(cg[2])] += score.ddd3;  
    }
    return WXPower;
}
function wxHandle(sizhu){
    let tianZi=[sizhu.sGan.zi,sizhu.rGan.zi,sizhu.yGan.zi,sizhu.nGan.zi];
    let diZhi=[sizhu.sZhi.zi,sizhu.rZhi.zi,sizhu.yZhi.zi,sizhu.nZhi.zi];
    let diZi=[sizhu.sZhi.canggan,sizhu.rZhi.canggan,sizhu.yZhi.canggan,sizhu.nZhi.canggan];
    let WXPower={ //先聲明賦值，避免NaN
        '金':0,
        '木':0,
        '水':0,
        '火':0,
        '土':0
    };
    //計算天字 與鄰柱和地支作用
    for(let i=0;i<tianZi.length;i++){
        let ss;
        let wx = calcWuXing(tianZi[i]);
        //先分配分值
            WXPower[wx] += score.t;
        //在計算損耗得失
        if(i==0){
            ss = calcShiShen(tianZi[i+1],tianZi[i]); //天字第一個元素
            WXPower[wx] += score.t*getScore(ss);
        }else if(i==(tianZi.length-1)){
            ss = calcShiShen(tianZi[i-1],tianZi[i]); //最後一個元素
            WXPower[wx] += score.t*getScore(ss);
        }else{
            ss = calcShiShen(tianZi[i-1],tianZi[i]); //中間的元素，與相鄰的計算
            WXPower[wx] += score.t*getScore(ss);
            ss = calcShiShen(tianZi[i+1],tianZi[i]); 
            WXPower[wx] += score.t*getScore(ss);
        }
        ss = calcShiShen(diZi[i].substr(0,1),tianZi[i]);//所有元素與地支計算
        WXPower[wx] += score.t*getScore(ss);
    }
    //計算地字 與鄰柱和天干作用(以主氣藏干計算)
    let scoreVal; //記錄自身的分值,計算增減分值
    for(let i=0;i<diZi.length;i++){
        let ss;
        let wx = calcWuXing(diZi[i][0]);
        if(diZi[i].length==1){ //子卯酉40
            WXPower[wx] += score.d1; 
            scoreVal = score.d1;
        }else if(diZi[i].length==2){ //亥午主氣 中氣
            WXPower[wx] += score.dd1; 
            scoreVal = score.dd1;
            let wx1 = calcWuXing(diZi[i][1]); 
            WXPower[wx1] += score.dd2;
        }else{ //其餘主氣 中氣 余氣
            WXPower[wx] += score.ddd1;
            scoreVal = score.ddd1;
            let wx1 = calcWuXing(diZi[i][1]); 
            WXPower[wx1] += score.ddd2;
            let wx2 = calcWuXing(diZi[i][2]);
            WXPower[wx2] += score.ddd3;
        }
        if(i==0){
            ss = calcShiShen(diZi[i+1][0],diZi[i][0]); //第一個元素 與下一個地支元素作用
            WXPower[wx] +=  scoreVal*getScore(ss);
        }else if(i==(diZi.length-1)){
            ss = calcShiShen(diZi[i-1][0],diZi[i][0]); //最後一個元素 與上一個地支元素作用
            WXPower[wx] += scoreVal*getScore(ss);
        }else{
            ss = calcShiShen(diZi[i-1][0],diZi[i][0]); //中間的元素，與相鄰地支元素作用
            WXPower[wx] += scoreVal*getScore(ss);
            ss = calcShiShen(diZi[i+1][0],diZi[i][0]); 
            WXPower[wx] += scoreVal*getScore(ss);
        }
        ss = calcShiShen(tianZi[i],diZi[i][0]);//所有元素與天字計算
        WXPower[wx] += scoreVal*getScore(ss);
    }

    //合化影响 
    let hehuaObj = {tg:'',dz:'',chong:'',other:''}; //存合化信息
    //天干合化 甲己合化土 乙庚合化金　丙辛合化水　丁壬合化木　戊癸合化火 两种天干同时出现在命宫时，会带来另一种能量源*/
    {
        let tianS = tianZi.join('');
        if(/甲/g.test(tianS) && /己/g.test(tianS)){
            hehuaObj.tg += '甲己合化土;';
            WXPower['土'] +=  score.t_he;
        }
        if(/乙/g.test(tianS) && /庚/g.test(tianS)){
            hehuaObj.tg += '乙庚合化金;';
            WXPower['金'] +=  score.t_he;
        }
        if(/丙/g.test(tianS) && /辛/g.test(tianS)){
            if(WXPower['水']){ 
                hehuaObj.tg += '丙辛合化水;';
                WXPower['水'] +=  score.t_he;
            }else{ //如果沒有此元素
                hehuaObj.tg += '丙辛合(可化水);';
            }
        }
        if(/丁/g.test(tianS) && /壬/g.test(tianS)){
            if(WXPower['木']){
                hehuaObj.tg += '丁壬合化木;';
                WXPower['木'] +=  score.t_he;
            }else{ //如果沒有此元素
                hehuaObj.tg += '丁壬合(可化木);';
            }
        }
        if(/戊/g.test(tianS) && /癸/g.test(tianS)){
            if(WXPower['火']){
                hehuaObj.tg += '戊癸合化火;';
                WXPower['火'] +=  score.t_he;
            }else{ //如果沒有此元素
                hehuaObj.tg += '戊癸合(可化火);';
            }
        }
    }
    //地支合化（三会→三合→六合 冲-破-害-刑 ）
    let diS = diZhi.join(''); 
    //地支三会：亥子丑會北方水局　寅卯辰會東方木局　巳午未會南方火局　申酉戌會西方金局
    {
        if(/亥/g.test(diS) && /子/g.test(diS) && /丑/g.test(diS)){
            hehuaObj.dz += '亥子丑會北方水局;';
            WXPower['水'] +=  WXPower['水']* score.d_3hui;
        }
        if(/寅/g.test(diS) && /卯/g.test(diS) && /辰/g.test(diS)){
            hehuaObj.dz += '寅卯辰會東方木局;';
            WXPower['木'] +=  WXPower['木']* score.d_3hui;
        }
        if(/巳/g.test(diS) && /午/g.test(diS) && /未/g.test(diS)){
            hehuaObj.dz += '巳午未會南方火局;';
            WXPower['火'] +=  WXPower['火']* score.d_3hui;
        }
        if(/申/g.test(diS) && /酉/g.test(diS) && /戌/g.test(diS)){
            hehuaObj.dz += '申酉戌會西方金局;';
            WXPower['金'] +=  WXPower['金']* score.d_3hui;
        }
    }
    //地支三合：申子辰合成水局　巳酉丑合成金局　寅午戌合成火局　亥卯未合成木局
    {
        if(/子/g.test(diS) && /申/g.test(diS) && /辰/g.test(diS)){
            hehuaObj.dz += '申子辰合成水局;';
            WXPower['水'] +=  score.d_3he;
        }
        if(/巳/g.test(diS) && /酉/g.test(diS) && /丑/g.test(diS)){
            hehuaObj.dz += '巳酉丑合成金局;';
            WXPower['金'] +=  score.d_3he;
        }
        if(/寅/g.test(diS) && /午/g.test(diS) && /戌/g.test(diS)){
            hehuaObj.dz += '寅午戌合成火局;';
            WXPower['火'] +=  score.d_3he;
        }
        if(/亥/g.test(diS) && /卯/g.test(diS) && /未/g.test(diS)){
            hehuaObj.dz += '亥卯未合成木局;';
            WXPower['木'] +=  score.d_3he;
        }
    }
    // 地支六合：子丑合化土　寅亥合化木　卯戌合化火　辰酉合化金　巳申合化水　午未為陰陽中正合化土
    {
        if(/子/g.test(diS) && /丑/g.test(diS)){
            hehuaObj.dz += '子丑合化土;';
            WXPower['土'] +=  score.d_6he;
        }
        if(/寅/g.test(diS) && /亥/g.test(diS)){
            hehuaObj.dz += '寅亥合化木;';
            WXPower['木'] +=  score.d_6he;
        }
        if(/卯/g.test(diS) && /戌/g.test(diS)){
            hehuaObj.dz += '卯戌合化火;';
            WXPower['火'] +=  score.d_6he;
        }
        if(/辰/g.test(diS) && /酉/g.test(diS)){
            hehuaObj.dz += '辰酉合化金;';
            WXPower['金'] +=  score.d_6he;
        }
        if(/巳/g.test(diS) && /申/g.test(diS)){
            hehuaObj.dz += '巳申合化水;';
            WXPower['水'] +=  score.d_6he;
        }
        if(/午/g.test(diS) && /未/g.test(diS)){
            hehuaObj.dz += '午未合化土;';
            WXPower['土'] +=  score.d_6he;
        }
    }
    // 地支相冲: 子午相沖　丑未相沖　寅申相沖　卯酉相沖　辰戌相沖　巳亥相沖
    {
        if(/子/g.test(diS) && /午/g.test(diS)){
            hehuaObj.chong += '子午相沖;';
            WXPower['火'] +=  score.dd1*score.d_chong2;//被冲
            WXPower['水'] +=  score.d1*score.d_chong1;;//主冲
        }
        if(/申/g.test(diS) && /寅/g.test(diS)){
            hehuaObj.chong += '寅申相沖;';
            WXPower['木'] +=  score.ddd1*score.d_chong2;//被冲
            WXPower['金'] +=  score.ddd1*score.d_chong1;;//主冲
        }
        if(/卯/g.test(diS) && /酉/g.test(diS)){
            hehuaObj.chong += '卯酉相沖;';
            WXPower['木'] +=  score.ddd1*score.d_chong2;//被冲
            WXPower['金'] +=  score.ddd1*score.d_chong1;;//主冲
        }
        if(/巳/g.test(diS) && /亥/g.test(diS)){
            hehuaObj.chong += '巳亥相沖;';
            WXPower['火'] +=  score.ddd1*score.d_chong2;//被冲
            WXPower['水'] +=  score.dd1*score.d_chong1;;//主冲
        }
        if(/丑/g.test(diS) && /未/g.test(diS)){
            hehuaObj.chong += '丑未相沖;';
            WXPower['土'] +=  score.ddd1*score.d_chong*2;//土平冲
        }
        if(/辰/g.test(diS) && /戌/g.test(diS)){
            hehuaObj.chong += '辰戌相沖;';
            WXPower['土'] +=  score.ddd1*score.d_chong*2;//土平冲
        }
    }
    // 地支相破：子酉相破　午卯相破　巳申相破　寅亥相破　辰丑相破　戌未相破
    {
        if(/子/g.test(diS) && /酉/g.test(diS)){
            hehuaObj.other += '子酉相破;';
        }
        if(/午/g.test(diS) && /卯/g.test(diS)){
            hehuaObj.other += '午卯相破;';
        }
        if(/巳/g.test(diS) && /申/g.test(diS)){
            hehuaObj.other += '巳申相破;';
        }
        if(/寅/g.test(diS) && /亥/g.test(diS)){
            hehuaObj.other += '寅亥相破;';
        }
        if(/辰/g.test(diS) && /丑/g.test(diS)){
            hehuaObj.other += '辰丑相破;';
        }
        if(/戌/g.test(diS) && /未/g.test(diS)){
            hehuaObj.other += '戌未相破;';
        }
    }
    // 地支相害： 子未相害　丑午相害　寅巳相害　卯辰相害　申亥相害　酉戌相害
    {
        if(/子/g.test(diS) && /未/g.test(diS)){
            hehuaObj.other += '子未相害;';
        }
        if(/丑/g.test(diS) && /午/g.test(diS)){
            hehuaObj.other += '丑午相害;';
        }
        if(/寅/g.test(diS) && /巳/g.test(diS)){
            hehuaObj.other += '寅巳相害;';
        }
        if(/卯/g.test(diS) && /辰/g.test(diS)){
            hehuaObj.other += '卯辰相害;';
        }
        if(/申/g.test(diS) && /亥/g.test(diS)){
            hehuaObj.other += '申亥相害;';
        }
        if(/酉/g.test(diS) && /戌/g.test(diS)){
            hehuaObj.other += '酉戌相害;';
        }
    }
    // 地支相刑：
    // 寅刑巳　巳刑申　申刑寅　為無恩之刑　　
    // 未刑丑　丑刑戌　戌刑未　為持勢之刑
    // 子刑卯　卯刑子　為無禮之刑　　
    // 辰刑辰　午刑午　酉刑酉　亥刑亥　為自刑之刑
    {
        if(/寅/g.test(diS) && /巳/g.test(diS)){
            hehuaObj.other += '寅刑巳;';
        }
        if(/申/g.test(diS) && /巳/g.test(diS)){
            hehuaObj.other += '巳刑申;';
        }
        if(/申/g.test(diS) && /寅/g.test(diS)){
            hehuaObj.other += '申刑寅;';
        }
        if(/未/g.test(diS) && /丑/g.test(diS)){
            hehuaObj.other += '未刑丑;';
        }
        if(/戌/g.test(diS) && /丑/g.test(diS)){
            hehuaObj.other += '丑刑戌;';
        }
        if(/戌/g.test(diS) && /未/g.test(diS)){
            hehuaObj.other += '戌刑未;';
        }
        if(/子/g.test(diS) && /卯/g.test(diS)){
            hehuaObj.other += '子卯相刑;';
        }
        let res = diS.split('').reduce((p, k) => (p[k]++ || (p[k] = 1), p), {});
        if(res['辰']>=2) hehuaObj.other += '辰辰自刑;';
        if(res['午']>=2) hehuaObj.other += '午午自刑;';
        if(res['酉']>=2) hehuaObj.other += '酉酉自刑;';
        if(res['亥']>=2) hehuaObj.other += '亥亥自刑;';     
    }
    //月令影響
    const yWuXing = ['木','火','土','金','水'];
    let YLwx = calcWuXing(sizhu.yZhi.canggan[0]); //月令主气
    // console.log(YLwx)
    let wxIndex = yWuXing.indexOf(YLwx);
    WXPower[yWuXing[wxIndex]] += score.yueHelp1 ; //加成点数20
    WXPower[yWuXing[wxIndex]] += WXPower[yWuXing[wxIndex]]*score.yueHelp2 ; //乘系数
    if(WXPower[yWuXing[(wxIndex+1)%5]]){ //如果不等於0
        WXPower[yWuXing[(wxIndex+1)%5]] += WXPower[yWuXing[wxIndex]] * score.yueSheng ; //得月令生加成
    }
    if(WXPower[yWuXing[(wxIndex+2)%5]]){ //如果不等於0
        WXPower[yWuXing[(wxIndex+2)%5]] += WXPower[yWuXing[wxIndex]] * score.yueKe ; //被月令剋减力
    }
    //四舍五入后，保留一位小数
    for(let key in WXPower){
        WXPower[key]=Math.round(WXPower[key]*10)/10;
    }
    //八字阵势 印梟+日元 VS 官殺+食傷+才財*（33.3%）
    let resultPK = {
        own:0,
        enemy:0,
    };
    let myWX = calcWuXing(sizhu.rGan.zi);
    let myWXIndex = yWuXing.indexOf(myWX); 
    // 己方力量和异方力量
    resultPK.own = WXPower[myWX]+WXPower[yWuXing[(myWXIndex+4)%5]]; //自身五行+印枭
    resultPK.enemy = Math.round((WXPower[yWuXing[(myWXIndex+3)%5]]+ WXPower[yWuXing[(myWXIndex+1)%5]]+WXPower[yWuXing[(myWXIndex+2)%5]]*0.33)*10)/10;
    //找參考用、忌、闲神
    /*1.天干找 根据身强弱，先找天干→看月支藏干选第一用神→第二用神(喜神)；忌神(制喜忌的)*/ 
    let xiJiInfo = {
        yongS:'',
        jiS:'',
        details:''
    }
    {   
        // if(resultPK.own>resultPK.enemy){
            //身强 顺序：用官杀→食伤-→才
            if(new RegExp(sizhu.nGan.shishen).test("官殺食傷財才")){
                resultPK.own>resultPK.enemy? xiJiInfo.yongS+=sizhu.nGan.zi:xiJiInfo.jiS+=sizhu.nGan.zi;
            }
            if(new RegExp(sizhu.yGan.shishen).test("官殺食傷財才")){
                resultPK.own>resultPK.enemy? xiJiInfo.yongS+=sizhu.yGan.zi:xiJiInfo.jiS+=sizhu.yGan.zi;
                // xiJiInfo.yongS+=sizhu.yGan.zi;
            }
            if(new RegExp(sizhu.sGan.shishen).test("官殺食傷財才")){
                resultPK.own>resultPK.enemy? xiJiInfo.yongS+=sizhu.sGan.zi:xiJiInfo.jiS+=sizhu.sGan.zi;
                // xiJiInfo.yongS+=sizhu.sGan.zi;
            }
            if(new RegExp(sizhu.nGan.shishen).test("印梟比劫")){
                resultPK.own>resultPK.enemy? xiJiInfo.jiS+=sizhu.nGan.zi:xiJiInfo.yongS+=sizhu.nGan.zi;
            }
            if(new RegExp(sizhu.yGan.shishen).test("印梟比劫")){
                resultPK.own>resultPK.enemy? xiJiInfo.jiS+=sizhu.yGan.zi:xiJiInfo.yongS+=sizhu.yGan.zi;
            }
            if(new RegExp(sizhu.sGan.shishen).test("印梟比劫")){
                resultPK.own>resultPK.enemy? xiJiInfo.jiS+=sizhu.sGan.zi:xiJiInfo.yongS+=sizhu.sGan.zi;
            }
            if(!xiJiInfo.yongS){ //如果沒有找用神，在月支藏干找
                for(let i=0;i<sizhu.yZhi.shishen.length;i++){
                    if(resultPK.own>resultPK.enemy){
                        if(new RegExp(sizhu.yZhi.shishen[i]).test("官殺食傷財才")){
                            xiJiInfo.yongS+=sizhu.yZhi.shishen[i];
                        }
                    }else{
                        if(new RegExp(sizhu.yZhi.shishen[i]).test("印梟比劫")){
                            xiJiInfo.yongS+=sizhu.yZhi.shishen[i];
                        }
                    }
                }
                if(xiJiInfo.yongS){
                    xiJiInfo.details = `此造無用神透出，可取用月支藏干「${xiJiInfo.yongS}」;`
                }else{
                    xiJiInfo.details = `此造無用神;`
                }
            }else{
                //去重
                let str = '';
                for(let i=0;i<xiJiInfo.yongS.length;i++){
                    if(str.indexOf(xiJiInfo.yongS[i])==-1){
                        str+=xiJiInfo.yongS[i];
                    }
                }
                // let str1 = '';
                // for(let i=0;i<xiJiInfo.jiS.length;i++){
                    //     if(str.indexOf(xiJiInfo.jiS[i])==-1){
                //         str+=xiJiInfo.yongS[i];
                //     }
                // }
                xiJiInfo.yongS = str;
                xiJiInfo.details = `此造用神「${xiJiInfo.yongS}」透干;`
            }
            if(!xiJiInfo.jiS){ //如果沒有找到忌神，在月支藏干找
                for(let i=0;i<sizhu.yZhi.shishen.length;i++){
                    if(resultPK.own<resultPK.enemy){
                        if(new RegExp(sizhu.yZhi.shishen[i]).test("官殺食傷財才")){
                            xiJiInfo.jiS+=sizhu.yZhi.shishen[i];
                        }
                    }else{
                        if(new RegExp(sizhu.yZhi.shishen[i]).test("印梟比劫")){
                            xiJiInfo.jiS+=sizhu.yZhi.shishen[i];
                        }
                    }
                }
                if(xiJiInfo.jiS){
                    xiJiInfo.details += `無忌神透干，月支藏干「${xiJiInfo.jiS}」為忌;`
                }else{
                    xiJiInfo.details += `無忌神;`
                }
            }else{
                //去重
                let str = '';
                for(let i=0;i<xiJiInfo.jiS.length;i++){
                    if(str.indexOf(xiJiInfo.jiS[i])==-1){
                        str+=xiJiInfo.jiS[i];
                    }
                }
                xiJiInfo.jiS = str;
                xiJiInfo.details += `忌神「${xiJiInfo.jiS}」透干;`
            }

    }
    // console.log(WXPower)
    // console.log(hehuaObj)
    return {
        WXPower:WXPower, //五行势力
        resultPK:resultPK, //交战结果
        hehuaObj:hehuaObj, //合化信息
        xiji:xiJiInfo
    }
}
exports.wxHandle = wxHandle;
exports.calcShiShen = calcShiShen;
exports.getZhuPower = getZhuPower;