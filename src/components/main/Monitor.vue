<template>
  <el-row class="content">
      <div class="areaSelect">
        <el-cascader
          :options="options"
          v-model="selectedOptions"
          @change="areaChange">
        </el-cascader>
      </div>
      <el-tabs v-model="tabName" type="card" @tab-click="tangKouSelect">
        <el-tab-pane
          v-for="(tangKou, index) in tangKous"
          :key="index" :label="tangKou.sendescription"
          :name="tangKou.sendescription">
        </el-tab-pane>
      </el-tabs>
      <div id="monitor-info">
        <el-row>
          <span :class="{childTangKou: true, active: childTangkouIndex == index}" v-for="(childTangkou,index) in childTangKous" :key="index" @click="childTangKouSelect(index)">{{childTangkou.sendescription}}</span>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="info">
              <el-col :span="7" :offset="4">
                <img class="fullWidth" src="../../../static/images/icon-t.png" />
              </el-col>
              <el-col :span="11":offset="1">
                <h2>{{currentData.temperature}}</h2>
                <span class="tip">实时水温</span>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info">
              <el-col :span="7" :offset="4">
                <img class="fullWidth" src="../../../static/images/icon-o.png" />
              </el-col>
              <el-col :span="11":offset="1">
                <h2>{{currentData.oxygen}}</h2>
                <span class="tip">实时溶氧量</span>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info">
              <el-col :span="7" :offset="4">
                <img class="fullWidth" src="../../../static/images/icon-p.png" />
              </el-col>
              <el-col :span="11":offset="1">
                <h2>{{currentData.ph}}</h2>
                <span class="tip">实时PH值</span>
              </el-col>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row style="padding-left: 20px;">
        <el-form :inline="true" :model="chartForm" style="text-align: center; margin: 10px 0;">
          <el-form-item>
            <el-button type="primary" @click="chartForm.byDataTime = !chartForm.byDataTime">{{ chartForm.byDataTime ? "按时区" : "按时段" }}</el-button>
          </el-form-item>
          <template v-if="chartForm.byDataTime">
            <el-form-item label="时间范围">
              <el-select v-model="chartForm.selectable" @change="dateTimeRange" placeholder="时间范围">
                <el-option label="近一天" :value="60 * 60 * 24"></el-option>
                <el-option label="近三天" :value="60 * 60 * 24 * 3"></el-option>
                <el-option label="近一周" :value="60 * 60 * 24 * 7"></el-option>
                <el-option label="近一月" :value="60 * 60 * 24 * 30"></el-option>
                <el-option label="近三月" :value="60 * 60 * 24 * 90"></el-option>
                <el-option label="近半年" :value="60 * 60 * 24 * 180"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker v-model="chartForm.startTime" type="datetime" placeholder="开始时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间">
              <el-date-picker v-model="chartForm.endTime" type="datetime" placeholder="结束时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="queryHistoryData">查询数据</el-button>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="日期范围">
              <el-date-picker v-model="chartForm.dateRange" type="daterange" placeholder="日期范围">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="时间段范围">
                <el-time-picker is-range v-model="chartForm.timeRange" placeholder="选择时间段范围">
                </el-time-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryAppointedTime">查询数据</el-button>
            </el-form-item>
          </template>
        </el-form>
      </el-row>
      <div style="padding: 10px;">
        <IEcharts class="echarts" :option="option"></IEcharts>
      </div>
  </el-row >
</template>

<script>
  import IEcharts from 'vue-echarts-v3';
  let area = require("../../assets/areaOptions.js");
  export default {
    components: {
      IEcharts
    },
    data: () => ({
      options: [],
      selectedOptions: ["320000", "320100", "320118"],
      tangKous: [],
      tabName: '0',
      tangKousForm: {
        areacode: '',
        facid: '',
        comid: ''
      },
      tangKous: [],
      childTangKous:[],
      childTangkouIndex: 0,
      tangKou: {},
      currentData: {
        temperature: 31.46,
        oxygen: 6.45,
        ph: 8.92
      },
      startTime: '',
      endTime: '',
      chartForm: {
        byDataTime: true,
        selectable: 60 * 60 * 24,
        dateRange: [],//按时段字段
        timeRange:[],//按时段字段
        startTime: '',//按时区字段
        endTime: '',//按时区字段
      },
      option: {
        title: {
          left: "150px",
          text: '水产传感数器采集数据'
        },
        tooltip: {
    			trigger : 'axis',
    			position : function(pt) {
    				return [ pt[0], '10%' ]; //提示框显示的内容 pt[0]跟着鼠标的位置
    			},
    			formatter : function(params) {
    				var data = '';
    				var color = '';
    				for (var i = 0; params[i] != null; i++) {
    					color = "<span style='width: 10px;height: 10px;background-color: "+params[i].color+";float:left;margin-top: 6px;'></span>"
    					data += (params[i].name + '<br/>' + color + " "
    							+ params[i].seriesName + ': ' + params[i].value + '<br/><br/>');
    				}
    				return data;
    			}
    		},
        legend : {
  				data : [ "水温", "溶解氧", "ph" ], //折线名字
  				selected : {
  					"水温" : true,
  					"溶解氧" : false,
  					"ph" : false
  				}
  			},
        axisPointer : {
				  link : {
  					xAxisIndex : 'all'
  				}
  			},
        dataZoom : [
					{
						show : true,
					},
					{ //移动滑块
						start : 0,
						end : 100,
						handleIcon : 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
						handleSize : '80%',
						handleStyle : {
							color : '#fff',
							shadowBlur : 3,
							shadowColor : 'rgba(0, 0, 0, 0.6)',
							shadowOffsetX : 2,
							shadowOffsetY : 2
						},
				}],
  			xAxis : [{
          type: 'category',
			    boundaryGap: false,
			    gridIndex: 0,
			    data: [],
			    axisLine:{onZero:false}
        }],
  			yAxis : [{
          type: 'value',
			    boundaryGap: false,
			    gridIndex: 0,
          min : 0,
			    splitNumber: 5
        }],
        series: []
      }
    }),
    created() {
      this.options = area.areaOptions;
      //this.tangKou = {fid:1,cid:2,sid:'0102',order: '',name: '固城湖塘口1'};
      this.tangKousForm.areacode = '320118';//TODO 登陆获取地区
      this.showTangKou();
    },
    methods: {
      showTangKou(){
        const self = this;
        let data = {areacode: self.tangKousForm.areacode}
        self.$.post('/IntelligentAgriculture/dataDisplay/showpound',data,function(res){
          //TODO 塘口列表展示 tangKous 赋值
            let result = JSON.parse(res);
          // self.tangKous = [
          //   {fid:1,cid:2,sid:'0102',order: '',name: '固城湖塘口1'},
          //   {fid:1,cid:2,sid:'0304',order: '',name: '固城湖塘口2'},
          //   {fid:2,cid:2,sid:'0102',order: '',name: '渔网大市场3'},
          //   {fid:3,cid:2,sid:'0102',order: '',name: '渔网大市场4'},
          //   {fid:4,cid:2,sid:'0102',order: '',name: '渔网大市场5'},
          //   {fid:5,cid:2,sid:'0910',order: '',name: '固城湖威森'},
          //   {fid:6,cid:2,sid:'0409',order: '',name: '实验室'},
          //   {fid:7,cid:2,sid:'0',order: '43',name: '江宁基地'}];
          if(result.resCode == 1) {
            self.tangKous = result.res;
            self.tabName = self.tangKous[0].sendescription;
            self.tangKou = self.tangKous[0];
            self.dateTimeRange(60 * 60 * 24);
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }

        })
      },
      tangKouSelect(tab, event){//塘口选择
        //console.log(tab);
        const self = this;
        self.childTangKous = [];
        self.childTangkouIndex = 0;
        let index = parseInt(tab.index);
        if(self.tangKous[index].hasChild == "1") {
          self.tangKou = self.tangKous[index];
          self.showsensor(self.tangKous[index].orderNum);
        } else {
          self.tangKou = self.tangKous[index];
          self.option.series = [];
          self.dateTimeRange(60 * 60 * 24);
        }
      },
      childTangKouSelect(index){
        const self = this;
        self.childTangkouIndex = index;
        self.option.series = [];
        self.tangKou.senID = self.childTangKous[index].senID;
        self.dateTimeRange(60 * 60 * 24);
      },
      showsensor(orderNum){
          const self = this;
          let data = {
            facid: self.tangKou.facID,
            comid: self.tangKou.comID,
            areacode: orderNum
          };
          self.$.post("/IntelligentAgriculture/dataDisplay/showsensor",data,function(res){
            let result = JSON.parse(res);
            if(result.resCode){
              self.childTangKous = result.res;
              self.childTangKouSelect(0);
            } else if (result.loginStatus == 0) {
              window.location.href = location.origin + '#login';
              return;
            }
          })
      },
      queryCurrentData(){
        const self = this;
        let data = {
          facid: self.tangKou.facID,
          comid: self.tangKou.comID,
          senid: self.tangKou.senID
        };
        self.$.post("/IntelligentAgriculture/dataDisplay/queryCurrentData",data,function(res){
          let result = JSON.parse(res);
          if(result.resCode){
            for (var i = 0; i < result.res.length; i++) {
              switch (result.res[i].type) {
                case "water_temp_1":
                case "water_temp_2":
                case "temp":
                case "temp_ws":
                  self.currentData.temperature = result.res[i].value || '';
                  break;
                case "ph_1":
                case "ph_2":
                case "ph_ph":
                case "ph":
                case "ph_ws":
                  self.currentData.ph = result.res[i].value || '';
                  break;
                case "do2_1":
                case "do2_2":
                case "do_do":
                case "do_ws":
                case "do2":
                  self.currentData.oxygen = result.res[i].value || '';
                  break;
                default:
              }
            }
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
        })
      },
      queryHistoryData(){
        const self = this;
        self.queryCurrentData();

        let startTime = new Date(self.chartForm.startTime).format("yyyy-MM-dd hh:mm:ss");
        let endTime = new Date(self.chartForm.endTime).format("yyyy-MM-dd hh:mm:ss");
        let data = {
          facid: self.tangKou.facID,
          comid: self.tangKou.comID,
          senid: self.tangKou.senID,
          startTime: startTime,
          endTime: endTime
        };
        let dataUrl = "/IntelligentAgriculture/dataDisplay/queryHistoryData";
        let value = self.chartForm.endTime.getTime() - self.chartForm.startTime.getTime()
        if(value/1000 > (60 * 60 * 24 * 30)) {
          dataUrl = "/IntelligentAgriculture/dataDisplay/queryIntegration";
        }
        self.$.post(dataUrl,data,function(res){
          let result = JSON.parse(res);
          if(result.res){
            self.option.xAxis[0].data = result.res.do_time;
            for (var i = 0; i < self.option.legend.data.length; i++) {
              if(self.option.legend.data[i] == "ph"){
                self.initSerie('ph',result.res.ph_ph,0);
      				}else if(self.option.legend.data[i] == "溶解氧"){
                self.initSerie('溶解氧',result.res.do_do,1);
      				}else if(self.option.legend.data[i] == "水温"){
                self.initSerie('水温',result.res.do_temp,2);
      				}
            }
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
        })
      },
      queryAppointedTime(){
        const self = this;
        self.queryCurrentData();
        let startDate = self.chartForm.dateRange[0].format("yyyy-MM-dd");
        let endDate = self.chartForm.dateRange[1].format("yyyy-MM-dd");
        let startTime = self.chartForm.timeRange[0].format("hh:mm:ss");
        let endTime = self.chartForm.timeRange[1].format("hh:mm:ss");
        let data = {
          facid: self.tangKou.facID,
          comid: self.tangKou.comID,
          senid: self.tangKou.senID,
          startTime: startTime,
          endTime: endTime,
          startDate: startDate,
          endDate: endDate
        };

        self.$.post('/IntelligentAgriculture/dataDisplay/queryAppointedTime',data,function(res){
          let result = JSON.parse(res);
          if(result.res){
            self.option.xAxis[0].data = result.res.do_time;
            for (var i = 0; i < self.option.legend.data.length; i++) {
              if(self.option.legend.data[i] == "ph"){
                self.initSerie('ph',result.res.ph_ph,0);
      				}else if(self.option.legend.data[i] == "溶解氧"){
                self.initSerie('溶解氧',result.res.do_do,1);
      				}else if(self.option.legend.data[i] == "水温"){
                self.initSerie('水温',result.res.do_temp,2);
      				}
            }
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
        })
      },
      initSerie(name,data,index) {
        let serie = {
          name: name,
          type: 'line',
          //xAxisIndex: 0,
          //yAxisIndex: 0,
          data: data
        }
        this.option.series[index] = serie;
      },
      areaChange(arrValue) {//地区选择
        const self = this;
        console.log(arrValue);
        self.tangKousForm.areacode = arrValue[2];
        self.showTangKou();
      },
      dateTimeRange(value){
        const self = this;
        let now = new Date();
        self.chartForm.endTime = now;
        self.chartForm.startTime = new Date(now.getTime() - value*1000);
        //console.log(self.chartForm);
        //self.queryCurrentData();
        self.queryHistoryData();
      }
    }
  };
</script>

<style scoped>
  .echarts {
    width: 100%;
    min-height: 400px;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item.is-active, .el-tabs__header {
    border: none !important;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item {
    transition: none;
  }
  .areaSelect {
    margin: 20px;
  }
  #monitor-info {
    padding: 20px 50px;
  }
  #monitor-info .info {
    width: 300px;
    margin: 0 auto;
  }
  #monitor-info .info h2 {
    margin: 5px 0 20px 0;
    font-size: 28px;
  }
  #monitor-info .info .tip {
    font-size: 13px;
  }
  .childTangKou {
    display: inline-block;
    cursor: pointer;
    margin: 10px 10px 35px;
  }
  .childTangKou.active {
    color: #20a0ff;
  }
</style>
