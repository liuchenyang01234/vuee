
//中文2个字符 英文一个字符   获得字符数
export function  getBLen(value){
   if(value==null)
     return 0;
    var Alllength=value.length;  //获得长度
   var cnChar=value.match(/[^\x00-\x80]/g);//利用match方法检索出中文字符并返回一个存放中文的数组
    if(cnChar!=null)
    {
      var zhlength=cnChar.length;
      Alllength=Alllength+cnChar.length;
    }
   console.log("总长度   "+Alllength);
   return  Alllength;
}
//长度不超过40
export var validatenamelength = (rule, value, callback) => {
  console.log("字节数");
  console.log(getBLen(value));
  if (getBLen(value)>40) {
    callback(new Error('不能超过20个字,现在字个数为'+Math.floor(getBLen(value)/2)));
  } else {
    callback();
  }
};
//长度不超过8   经理人名字的长度
export var validateManagerMamelength = (rule, value, callback) => {
  console.log("字节数");
  console.log(getBLen(value));
  if (getBLen(value)>8) {
    callback(new Error('不能超过4个字,现在字个数为'+Math.floor(getBLen(value)/2)));
  } else {
    callback();
  }
};
//长度不超过400
export var validatemessagelength = (rule, value, callback) => {
  console.log("字节数");
  console.log(getBLen(value));
  if (getBLen(value)>400) {
    callback(new Error('不能超过200个字,现在字个数为'+Math.floor(getBLen(value)/2)));
  } else {
    callback();
  }
};


//非负浮点数
export var validateNNFloatingPoint = (rule, value, callback) => {
    if (/^([1-9]\d*|\d+\.\d+)$/.test(value))
    {
      callback()
    } else {
      callback(new Error('请输入非负数字'))
    }
  }

//浮点数
export var validateFloatingPoint = (rule, value, callback) => {
  if (/^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/.test(value))
  {
    callback()
  } else {
    callback(new Error('请输入数字'))
  }
}

