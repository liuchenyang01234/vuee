//基金的信息
var fund={
     id:'',
     no:'',//产品编号
     name:'',  //产品名称
     netWorth:'',  //产品净值
     sdRate:'',  //7日年化率
     spInvestment:null,  //投资起点
     message:'',   //描述信息
     number:'',    //库存
     manager: {
       id:'',   //经理人编号
       name:'',  //经理人姓名
       introduce:'',  //经理人介绍
       picture:''    //经理人图片   url路径
     },
     startTime:'',  //开始时间
     endTime:''    //结束时间

}

function setFundForm (FundForm,fund) {
  FundForm.name=fund.name;
  FundForm.netWorth=fund.netWorth;
  FundForm.sdRate=parseFloat((fund.sdRate*100).toFixed(4));
  FundForm.spInvestment=fund.spInvestment;
  FundForm.message=fund.message;
  FundForm.number=fund.number;
  FundForm.startTime=fund.startTime;
  FundForm.endTime=fund.endTime;
  FundForm.manager=fund.manager.id+fund.manager.name;   //这个需要判断一下  字符串拼接
}
function setFund (FundForm,fund) {
  fund.name=FundForm.name;
  fund.netWorth=FundForm.netWorth;
  fund.sdRate=FundForm.sdRate/100;
  fund.spInvestment=FundForm.spInvestment;
  fund.message=FundForm.message;
  fund.number=FundForm.number;
  fund.startTime=FundForm.startTime;
  fund.endTime=FundForm.endTime;
  fund.manager=FundForm.manager;

}


export {fund,setFundForm}
