<template>
  <el-row class="content profit">
    <div class="content-title" style="padding: 20px;">塘口选择</div>
    <div style="border-bottom: 1px solid #000; min-height: 380px; margin-bottom: 30px;">
      <el-row class="tabs menu_tabs">
        <div class="tab menu_tab"
            v-for="(tangkou,index) in tangKous"
            :class="{active: index == poundIndex}"
            :key="index" @click="poundSelected(index)">
          <div :class="'wrapper wrapper' + index % 3">
            <span class="label" v-html="tangkou.pondName"></span>
          </div>
        </div>
      </el-row>
      <el-row class="tabs actions">
        <div :class="{action: true, tab: true, active: activeAction == index }" v-for="(ac, index) in actions" @click="activeAction = index">{{ ac }}</div>
      </el-row>
      <div v-if="activeAction == 0">
        <el-form :inline="true" :model="tabForm1" class="inlineForm">
          <el-col :span="3" class="label">养殖地租金</el-col>
          <el-form-item prop="count">
            <el-input v-model="tabForm1.count" placeholder="数量"></el-input>
          </el-form-item>
          <el-form-item prop="unit1">
            <el-select width="10px" v-model="tabForm1.unit">
              <el-option label="月" value="月"></el-option>
              <el-option label="年" value="年"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div style="width: 30px;">&nbsp;</div>
          </el-form-item>
          <el-form-item prop="price">
            <el-input v-model="tabForm1.price" placeholder="数量"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form1Unit2">
              <el-option label="元/月" value="元/月"></el-option>
              <el-option label="元/年" value="元/年"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="rentDataSave">计算</el-button>
            </el-form-item>
        </el-form>
      </div>
      <div v-if="activeAction == 1">
        <el-form :inline="true" :model="tabForm2" class="inlineForm">
          <el-row>
            <el-col :span="3" class="label">蟹苗</el-col>
            <el-form-item prop="seedCount" label="">
              <el-input v-model="tabForm2.seedCount" placeholder="数量"></el-input>
            </el-form-item>
            <el-form-item prop="seedUnit">
              <el-select v-model="tabForm2.seedUnit" placeholder="">
                <el-option label="斤" value="斤"></el-option>
                <el-option label="只" value="只"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="width: 30px;">&nbsp;</div>
            </el-form-item>
            <el-form-item prop="seedPrice">
              <el-input v-model="tabForm2.seedPrice" placeholder="单价"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form2Unit2" placeholder="单位">
                <el-option label="元/斤" value="元/斤"></el-option>
                <el-option label="元/只" value="元/只"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="seedDataSave">计算</el-button>
            </el-form-item>
          </el-row>
        </el-form>
        <el-form :inline="true" :model="polycultureData" class="inlineForm polyculture">
          <el-row>
            <el-col :span="3" class="label">套养</el-col>
            <el-form-item>
              <el-select v-model="polycultureData.kind" placeholder="单位">
                <el-option label="鱼" value="鱼"></el-option>
                <el-option label="虾" value="虾"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="polycultureData.totalPrice" placeholder="总价"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="polycultureDataSave">计算</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div v-if="activeAction == 2" class="specailSelect">
        <el-form :inline="true" :model="tabForm3" class="inlineForm">
            <el-col :span="2" class="label">&nbsp;</el-col>
            <el-form-item prop="kind">
              <el-select v-model="tabForm3.kind">
                <el-option label="普通员工" value="普通员工"></el-option>
                <el-option label="临时工" value="临时工"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="personCount">
              <el-input v-model="tabForm3.personCount" placeholder="人数"></el-input>
            </el-form-item>
            <el-form-item prop="priceByPerson" v-if="tabForm3.kind == '普通员工'">
              <el-input v-model="tabForm3.priceByPerson" placeholder="年薪"></el-input>
            </el-form-item>
            <el-form-item v-if="tabForm3.kind == '临时工'">
              <el-input v-model="tabForm3DayPay" placeholder="元/天"></el-input>
            </el-form-item>
            <el-form-item v-if="tabForm3.kind == '临时工'">
              <el-input v-model="tabForm3Day" placeholder="天数"></el-input>
            </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="labourDataSave">计算</el-button>
              </el-form-item>
        </el-form>
      </div>
      <div v-if="activeAction == 3">
        <el-form :inline="true" :model="tabForm4" class="inlineForm tabForm4">
            <div>
              <el-col :span="2" class="label">水质调节</el-col>
              <el-form-item prop="num1" label="肥料">
                <el-input v-model="tabForm4.input_type_4" placeholder="元"></el-input>
              </el-form-item>
              <el-form-item prop="num2" label="消毒解毒剂">
                <el-input v-model="tabForm4.input_type_6" placeholder="元"></el-input>
              </el-form-item>
              <el-form-item prop="num3" label="菌类">
                <el-input v-model="tabForm4.input_type_5" placeholder="元"></el-input>
              </el-form-item>
              <el-form-item prop="num4" label="底质改良剂">
                <el-input v-model="tabForm4.input_type_7" placeholder="元"></el-input>
              </el-form-item>
            </div>
            <div>
              <el-col :span="2" class="label">&nbsp;</el-col>
              <el-form-item prop="num5" label="饵料">
                <el-input v-model="tabForm4.input_type_1" placeholder="元"></el-input>
              </el-form-item>
              <el-form-item prop="num6" label="螺蛳">
                <el-input v-model="tabForm4.input_type_2" placeholder="元"></el-input>
              </el-form-item>
              <el-form-item prop="num7" label="水草">
                <el-input v-model="tabForm4.input_type_3" placeholder="元"></el-input>
              </el-form-item>
              <el-form-item prop="num8" label="其他">
                <el-input v-model="tabForm4.input_type_8" placeholder="元"></el-input>
              </el-form-item>
            </div>
            <el-row style="text-align: center;margin: 20px 0;">
              <el-form-item>
                <!-- <el-button type="primary" @click="">计算</el-button> -->
              </el-form-item>
            </el-row>
        </el-form>
      </div>
      <div v-if="activeAction == 4">
        <el-form :inline="true" :model="tabForm5" class="inlineForm">
          <el-row>
            <el-col :span="3" class="label">蟹苗</el-col>
            <el-form-item prop="name" label="螃蟹">
              <el-select v-model="tabForm5.name" placeholder="">
                <el-option label="公蟹" value="公蟹"></el-option>
                <el-option label="母蟹" value="母蟹"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="size" label="螃蟹">
              <el-select v-model="tabForm5.size" placeholder="">
                <el-option label="2两" value="2两"></el-option>
                <el-option label="2.5两" value="2.5两"></el-option>
                <el-option label="3两" value="3两"></el-option>
                <el-option label="3.5两" value="3.5两"></el-option>
                <el-option label="4两" value="4两"></el-option>
                <el-option label="4.5两" value="4.5两"></el-option>
                <el-option label="5两" value="5两"></el-option>
                <el-option label="5.5两" value="5.5两"></el-option>
                <el-option label="6两" value="5两"></el-option>
                <el-option label="6两以上" value="6两以上"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="crabweight">
              <el-input v-model="tabForm5.crabweight" placeholder="重量"></el-input>
            </el-form-item>
            <el-form-item prop="crabprice">
              <el-input v-model="tabForm5.crabprice" placeholder="价格"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="crabSaleSave">计算</el-button>
            </el-form-item>
          </el-row>
          <el-form :inline="true" :model="polycultureData" class="inlineForm polyculture">
            <el-row>
              <el-col :span="3" class="label">套养</el-col>
              <el-form-item>
                <el-select v-model="polycultureData.kind" placeholder="单位">
                  <el-option label="鱼" value="鱼"></el-option>
                  <el-option label="虾" value="虾"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="polycultureData.totalPrice" placeholder="总价"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="polycultureDataSave(1)">计算</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </el-form>
      </div>
    </div>
    <div style="border-bottom: 1px solid #000; min-height: 220px; margin-bottom: 30px;">
      <div class="content-title">计算结果</div>
      <el-row>
        <el-col :span="8">
          <div :class="{count: true, active: countIndex == 1}"  @click="countIndex = 1">养殖成本&nbsp;&nbsp;总计<span>{{benefitValue.totalCostByPond}}</span>元</div>
        </el-col>
        <el-col :span="8">
          <div :class="{count: true, active: countIndex == 2}"  @click="countIndex = 2">销售额&nbsp;&nbsp;总计<span>{{benefitValue.totalSaleByPond}}</span>元</div>
        </el-col>
        <el-col :span="8">
          <div :class="{count: true, active: countIndex == 3}"  @click="countIndex = 3">利润&nbsp;&nbsp;总计<span>{{benefitValue.totalGainByPond}}</span>元</div>
        </el-col>
      </el-row>
      <div class="content-title">固城湖</div>
      <div v-if="countIndex == 1">
        <el-row style="margin-top: 20px;">
          <el-col :span="6" :offset="3">租金<span style="margin-left: 20px;">{{benefitValue.rentCost}}</span>元</el-col>
          <el-col :span="6" >套养<span style="margin-left: 20px;">{{benefitValue.polyCost}}</span>元</el-col>
          <el-col :span="9" >日常投放<span style="margin-left: 20px;">{{benefitValue.inputCost}}</span>元</el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col :span="6" :offset="3" >蟹苗<span style="margin-left: 20px;">{{benefitValue.seedCost}}</span>元</el-col>
          <el-col :span="6" >劳务<span style="margin-left: 20px;">{{benefitValue.labourCost}}</span>元</el-col>
        </el-row>
      </div>
      <div v-if="countIndex == 2">
        <el-row style="margin-top: 20px;">
          <el-col :span="6" :offset="3">蟹养<span style="margin-left: 20px;">{{benefitValue.crabSale}}</span>元</el-col>
          <el-col :span="6">套养<span style="margin-left: 20px;">{{benefitValue.polySale}}</span>元</el-col>
        </el-row>
      </div>
      <div v-if="countIndex == 3">
        <el-row style="margin-top: 20px;">
          <el-col :span="6" :offset="3">利润<span style="margin-left: 20px;">{{benefitValue.totalGainByPond}}</span>元</el-col>
        </el-row>
      </div>
    </div>
    <div style="border-bottom: 1px solid #000; min-height: 220px; margin-bottom: 30px;">
      <div class="content-title" style="margin-bottom: 10px;">历史记录</div>
      <!-- <el-row style="margin-bottom: 20px;"><el-col :span="3" :offset="21"><el-button style="background-color: #3a293a; color: #fff;">筛选结果</el-button></el-col></el-row> -->
      <el-row>
        <el-col :span="4" :offset="2">
          <div>利润<span style="margin-left: 20px;">{{ allHistoryList.totalGain }}元</span></div>
          <div>收入<span style="margin-left: 20px;">{{ allHistoryList.totalSale }}元</span></div>
          <div>支出<span style="margin-left: 20px;">{{ allHistoryList.totalCost }}元</span></div>
        </el-col>
        <el-col :span="18">
          <el-col :span="12" class="historyData" v-for="(record, index) in allHistoryList.hisRecords" :key="index">
            {{ new Date(record.sysTime).format("yyyy-MM-dd hh:mm:ss") }}<span class="typeName">{{ record.name }}</span> {{ record.value }}元
          </el-col>
          <el-col :span="12" class="historyData">
            2017-08-24 16:00:39<span class="typeName">普通员工</span> -20元
          </el-col>
        </el-col>
      </el-row>
    </div>
  </el-row>
</template>

<script>
    export default {
    data () {
      return {
        tangKous: [],
        actions: ['租金','种苗','劳务成本','日常投放','销售额'],
        pondid: '',
        poundIndex: 0,
        activeAction: 0,
        tabForm1:{
          count: '',
          unit: '月',
          price: ''
        },
        form1Unit2: '元/月',
        tabForm2:{
          seedCount: '',
          seedUnit: '斤',
          seedPrice: ''
        },
        polycultureData: {
          kind: "鱼",
          totalPrice: 0,
          unit: '斤'
        },
        form2Unit2: '元/月',
        tabForm3: {
          kind: "普通员工",
          personCount: "",
          priceByPerson: "",
          day:"",
          dayPay:""
        },
        tabForm3Day: "",
        tabForm3DayPay:"",
        tabForm4: {
          input_type_1: 0,
          input_type_2: 0,
          input_type_3: 0,
          input_type_4: 0,
          input_type_5: 0,
          input_type_6: 0,
          input_type_7: 0,
          input_type_8: 0
        },
        tabForm5: {
          crabprice: "",
          crabweight: "",
          sex: "公蟹",
          name: "公蟹",
          size: "",
          time: ""
        },
        benefitValue: {},
        allHistoryList: {},
        allHistoryListPage: 1,
        countIndex: 1
      }
    },
    created() {
      const self = this;
      self.getTangKous();
    },
    methods:{
      poundSelected(index){
        const self = this;
        self.poundIndex = index;
        self.pondid = self.tangKous[index].id;
        self.dailyInputDataCost();
        self.getBenefitValueByPond();
        self.allHistoryListByPage();
      },
      crabSaleSave(){
        const self = this;
        self.tabForm5.pondId = self.pondid;
        self.tabForm5.sex = self.tabForm5.name;
        self.$.post("/IntelligentAgriculture/cost/CrabSaleSave",self.tabForm5,function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.$message.success("计算成功");
            self.allHistoryListByPage
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          } else {
            self.$message.error(result.msg);
          }
        })
      },
      labourDataSave(){//劳务成本计算
        const self = this;
        self.tabForm3.pondId = self.pondid;
        if(self.tabForm3.kind="临时工") {
          self.tabForm3.priceByPerson = parseInt(self.tabForm3Day) * parseInt(self.tabForm3DayPay);
        }
        self.$.post("/IntelligentAgriculture/cost/labourDataSave",self.tabForm3,function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.$message.success("计算成功");
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          } else {
            self.$message.error(result.msg);
          }
        })
      },
      polycultureDataSave(isSale){//套养成本计算
        const self = this;
        self.polycultureData.pondId = self.pondid;
        let url = "/IntelligentAgriculture/cost/polycultureDataSave"
        if(isSale == 1) {
          url = "/IntelligentAgriculture/cost/PolycultureSale";
        }
        self.$.post(url,self.polycultureData,function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.$message.success("计算成功");
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          } else {
            self.$message.error(result.msg);
          }
        })
      },
      seedDataSave(){//蟹苗成本计算
        const self = this;
        self.tabForm2.pondId = self.pondid;
        self.$.post("/IntelligentAgriculture/cost/seedDataSave",self.tabForm2,function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.$message.success("计算成功");
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          } else {
            self.$message.error(result.msg);
          }
        })
      },
      rentDataSave(index){//租金成本计算
        const self = this;
        self.tabForm1.pondId = self.pondid;
        self.$.post("/IntelligentAgriculture/cost/rentDataSave",self.tabForm1,function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.$message.success("计算成功");
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          } else {
            self.$message.error(result.msg);
          }
        })
      },
      getBenefitValueByPond(pondid){
        const self = this;
        self.$.post("/IntelligentAgriculture/cost/getBenefitValueByPond",{pondid:self.pondid },function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.benefitValue = result.res;
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
        })
      },
      dailyInputDataCost(pondid){
        const self = this;
        self.$.post("/IntelligentAgriculture/cost/dailyInputDataCost",{pondid:self.pondid },function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.tabForm4.input_type_1 = result.res.input_type_1;
            self.tabForm4.input_type_2 = result.res.input_type_2;
            self.tabForm4.input_type_3 = result.res.input_type_3;
            self.tabForm4.input_type_4 = result.res.input_type_4;
            self.tabForm4.input_type_5 = result.res.input_type_5;
            self.tabForm4.input_type_6 = result.res.input_type_6;
            self.tabForm4.input_type_7 = result.res.input_type_7;
            self.tabForm4.input_type_8 = result.res.input_type_8;
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
        })
      },
      historyByPondByPage(pondid){
        const self = this;
        let data = {
          pondid: pondid,
          page: self.allHistoryListPage
        }
        self.$.post("/IntelligentAgriculture/cost/allHistoryListByPage",data,function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.allHistoryList = result;
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
        })
      },
      allHistoryListByPage(){
        const self = this;
        self.$.post("/IntelligentAgriculture/cost/allHistoryListByPage",{page: self.allHistoryListPage},function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1) {
            self.allHistoryList = result.res;
            console.log(self.allHistoryList);
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
        })
      },
      getTangKous(){
        const self = this;
        self.$.post("/IntelligentAgriculture/PondInfo/showPondinfos",{time: new Date()},function(res){
          let result = JSON.parse(res);
          if(result.resCode == 1 && result.res.length > 0) {
            self.tangKous = result.res;
            self.poundSelected(0);
          } else if (result.loginStatus == 0) {
            window.location.href = location.origin + '#login';
            return;
          }
          //console.log(self.tangKous);
        })
      }
    }
  }
</script>
<style scoped>
  .body.container {
    box-sizing: border-box;
    background-color: #f8f8f8;
  }
  .menu_tabs {
    background-color: #fff;
    padding: 15px;
  }
  .actions {
    padding: 14px;
  }
  .tabs{
      display:flex;
      justify-content:space-around;
      width:100%;
  }
  .tab {
      display:flex;
      flex-direction:column;
      text-align:center;
      cursor: pointer;
  }
  .action {
    width: 18.9%;
    display: inline-block;
    padding: 10px;
    background-color: #f8f8f8;
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
  }
  .menu_tab:hover{
    color:#1cb4ad;
  }
  .action.active {
    background-color: #fff;
  }
  .menu_tab.active{
      color:#1cb4ad;
  }
  .menu_tab .label{
    font-size:16px;
  }
  .menu_tab .wrapper {
    margin: 0 auto;
    width: 85px;
    height: 85px;
    background-size: 100% 100%;
    line-height: 85px;
  }
  .menu_tab .wrapper0 {
    background-image: url('../../../static/images/cycle0.png');
  }
  .menu_tab .wrapper1 {
    background-image: url('../../../static/images/cycle1.png');
  }
  .menu_tab .wrapper2 {
    background-image: url('../../../static/images/cycle2.png');
  }
  .inlineForm {
    padding: 30px 5px;
  }
  .tabForm4.inlineForm .el-input__inner{
    width: 80px;
  }
  .polyculture.inlineForm {
    padding-top: 0;
  }
  .inlineForm .label {
    text-align: center;
    line-height: 38px;
  }
  .profit .el-input__icon+.el-input__inner {
    padding-left: 10px;
    width: 80px;
  }
  .profit .specailSelect .el-input__icon+.el-input__inner {
    width: 120px;
  }
  .count {
    font-size: 16px;
    margin: 10px 35px;
    padding-bottom: 10px;
    text-align: center;
    cursor: pointer;
  }
  .count.active{
    border-bottom: 2px solid #116374;
  }
  .content-title {
    padding-left: 35px;
    font-size: 16px;
  }
  .historyData {
    text-align: left;
    padding: 7px 0px;
  }
  .typeName {
    margin: 0 10px;
  }
</style>
