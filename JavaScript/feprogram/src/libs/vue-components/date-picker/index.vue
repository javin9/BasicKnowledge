<template>
    <div></div>
</template>

<script type="text/ecmascript-6">
    import BetterPicker from 'better-picker';
    import './index.scss';
    export default{
        props: {
            maxDate:{
                type:String,
                default:'2099-12-31'
            },
            minDate:{
                type:String,
                default:'1900-1-1'
            },
            defaultDate:{
                type:String
            },
            type:{
                type:String,
                default:'date'//date 调出日期选择 ym 调出年月选择,
            }
        },
        data(){
            return {
                minY:this.formatDateArr(this.minDate)[0],
                minM:this.formatDateArr(this.minDate)[1].replace(/^0/, ''),
                minD:this.type ==="date"?this.formatDateArr(this.minDate)[2].replace(/^0/, ''):0,
                maxY:this.formatDateArr(this.maxDate)[0],
                maxM:this.formatDateArr(this.maxDate)[1].replace(/^0/, ''),
                maxD:this.type ==="date"?this.formatDateArr(this.maxDate)[2].replace(/^0/, ''):0,
                title:'请选择日期',
                pickerData:[],
                pickerIndex:this.type ==="date"?[0,0,0]:[0,0],
                picker:null
            }
        },
        components: {

        },
        methods: {
            formatDateArr(str){
                var dateArr = str.split("-");
                return dateArr;
            },
            formatDateStr(date){
                return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            },
            initData(){
                let minY = this.minY,
                    curDateY=[],
                    curDateM=[{
                        text:1 + '月',
                        value:1
                    },{
                        text:2 + '月',
                        value:2
                    },{
                        text:3 + '月',
                        value:3
                    },{
                        text:4 + '月',
                        value:4
                    },{
                        text:5 + '月',
                        value:5
                    },{
                        text:6 + '月',
                        value:6
                    },{
                        text:7 + '月',
                        value:7
                    },{
                        text:8 + '月',
                        value:8
                    },{
                        text:9 +'月',
                        value:9
                    },{
                        text:10 + '月',
                        value:10
                    },{
                        text:11 + '月',
                        value:11
                    },{
                        text:12 + '月',
                        value:12
                    }],
                    curDateD = [],
                    curYIndexArr = [],
                    curMIndexArr = ['1','2','3','4','5','6','7','8','9','10','11','12'],
                    curDIndexArr = [],
                    curYIndex,
                    curMIndex,
                    curDIndex,
                    curMStr,
                    curDStr;
                //全部年份数据
                while (minY<= this.maxY){
                    curDateY.push({
                        text:minY+'年',
                        value:minY
                    });
                    curYIndexArr.push(String(minY));
                    minY++;
                }
                //当前默认年份索引
                curYIndex = curYIndexArr.indexOf(this.formatDateArr(this.defaultDate)[0]);

                //月份全部数据
                curMStr = this.formatDateArr(this.defaultDate)[1];
                if(this.maxY == this.formatDateArr(this.defaultDate)[0]){
                    curMIndexArr.splice(this.maxM,12 - this.maxM);
                    curDateM.splice(this.maxM,12 - this.maxM);
                    if(Number(this.formatDateArr(this.defaultDate)[1]) > Number(this.maxM)){
                        curMStr = this.maxM;
                    }
                    if(this.minY == this.formatDateArr(this.defaultDate)[0]){
                        curDateM.splice(0,this.minM-1);
                        curMIndexArr.splice(0,this.minM-1);
                        if(Number(this.formatDateArr(this.defaultDate)[1]) < Number(this.minM)){
                            curMStr = this.minM;
                        }
                    }
                }else if(this.minY == this.formatDateArr(this.defaultDate)[0]){
                    curDateM.splice(0,this.minM-1);
                    curMIndexArr.splice(0,this.minM-1);
                    if(Number(this.formatDateArr(this.defaultDate)[1]) < Number(this.minM)){
                        curMStr = this.minM;
                    }
                }
                //当前默认月份索引
                curMIndex = curMIndexArr.indexOf(curMStr);


                //天全部数据
                curDStr = this.formatDateArr(this.defaultDate)[2];
                let allCurDateD =  new Date(this.formatDateArr(this.defaultDate)[0],this.formatDateArr(this.defaultDate)[1],0).getDate();
                for(let j = 1;j<= allCurDateD;j++){
                    curDateD.push({
                        text:j +'日',
                        value:j
                    })
                    curDIndexArr.push(String(j));
                }
                if(this.maxY == this.formatDateArr(this.defaultDate)[0] && this.maxM == this.formatDateArr(this.defaultDate)[1]){
                    curDIndexArr.splice(this.maxD,allCurDateD - this.maxD);
                    curDateD.splice(this.maxD,allCurDateD - this.maxD);
                    console.log(this.formatDateArr(this.defaultDate)[2])
                    console.log(this.maxD)
                    if(Number(this.formatDateArr(this.defaultDate)[2]) > Number(this.maxD)){
                        curDStr = this.maxD;
                    }
                    if(this.minY == this.formatDateArr(this.defaultDate)[0] && this.minM == this.formatDateArr(this.defaultDate)[1]){
                        curDIndexArr.splice(0,this.minD-1);
                        curDateD.splice(0,this.minD-1);
                        if(Number(this.formatDateArr(this.defaultDate)[2]) < Number(this.minD)){
                            curDStr = this.minD;
                        }
                    }
                }else if(this.minY == this.formatDateArr(this.defaultDate)[0] && this.minM == this.formatDateArr(this.defaultDate)[1]){
                    curDIndexArr.splice(0,this.minD-1);
                    curDateD.splice(0,this.minD-1);
                    if(Number(this.formatDateArr(this.defaultDate)[2]) < Number(this.minD)){
                        curDStr = this.minD;
                    }
                }else{
                    if(Number(this.formatDateArr(this.defaultDate)[2]) >allCurDateD){
                        curDStr = String(allCurDateD);
                    }
                }
                
                //当前默认天索引
                curDIndex = curDIndexArr.indexOf(curDStr);


                this.pickerData=this.type ==="date"?[curDateY,curDateM,curDateD]:[curDateY,curDateM];
                this.pickerIndex=this.type ==="date"?[curYIndex,curMIndex,curDIndex]:[curYIndex,curMIndex];
            },
            initPicker(){
                this.picker = new BetterPicker({
                    data:this.pickerData,
                    selectedIndex:this.pickerIndex,
                    title:this.title
                })

                this.picker.on('picker.select',  (selectedVal, selectedIndex) => {
//                    console.log(selectedVal);
                    this.$emit("onSelected",selectedVal);
                })

                this.picker.on('picker.change',  (index, selectedIndex) => {
                    this.updateData(index,selectedIndex);
                });

                this.picker.on('picker.valuechange',  (selectedVal, selectedIndex) => {
                });

            },
            updateData(index,selectedIndex){
                let _dateArr =  this.formatDateArr(this.defaultDate)

                if(index === 0){
                    _dateArr[0] =  this.pickerData[0][selectedIndex].value;
                    this.defaultDate = _dateArr.join("-");
                    this.initData();
                    this.picker.refillColumn(1, this.pickerData[1]);
                    this.picker.scrollColumn(1, this.pickerIndex[1]);
                    if(this.type ==="date"){
                        this.picker.refillColumn(2, this.pickerData[2]);
                        this.picker.scrollColumn(2, this.pickerIndex[2]);
                    }

                }else if(index === 1){
                    _dateArr[1] =  this.pickerData[1][selectedIndex].value;
                    this.defaultDate = _dateArr.join("-");
                    this.initData();
                    if(this.type ==="date"){
                        this.picker.refillColumn(2, this.pickerData[2]);
                        this.picker.scrollColumn(2, this.pickerIndex[2]);
                    }
                }else{
                    _dateArr[2] =  this.pickerData[2][selectedIndex].value;
                    this.defaultDate = _dateArr.join("-");
                    this.initData();
                }
//                console.log(this.defaultDate)
            }
        },

        events:{
            openDatePicker(){
                this.picker.show();
            }
        },
        computed: {
        },
        created(){
            this.initData();
            this.initPicker();
        },
        ready(){

        }
    }
</script>

<style scoped>
</style>
