const area = require('./areaOptions').areaOptions
const len = area.length

const utils = {
    //生成数据
    arrRepeat(arr,num){
        num = num || 6;
        if(Object.prototype.toString.call(arr)=='[object Array]' && arr.length>0){
            for(let i = 0 ;i<num;i++){
                arr.push(arr[0])
            }
            return arr;
        }else{
            return ""
        }
    },
    //地区value数组 转value+label数组格式;
    areaVtoVL(val){
        // var val = [11,1101,110101]
        var VL = [];
        var sum = "";
        var now = 0;
        function resName(arr){
            var len = arr.length;
            for(let i=0;i<len;i++){
                if(arr[i].value == val[now]){
                    VL.push(arr[i].value+arr[i].label)
                    now++;
                    if(arr[i].children && arr[i].children.length>0){
                        resName(arr[i].children)
                    }
                }
            }
        }
        resName(area)
        console.log(VL)
        return VL;
    },
    //地区转value label对象
    areaVLtoVS(val){
        return {
            value:val.replace(/[^\d]/g,""),
            label:val.replace(/\d/g,""),
        }
    },
    transArea(val){
        if(val){
            return {
                value:val.replace(/[^\d]/g,""),
                label:val.replace(/\d/g,""),
            }
        }else{
            return {
                value:"",
                label:""
            }
        }
    },
    relogin(response){
      if (response.loginStatus == 0) {
        window.location.href = location.origin + '#login';
        return;
      }
    }

}
module.exports = utils;
