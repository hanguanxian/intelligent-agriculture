<template>
    <div>
        <div class="expert_menu">
            <div class="menu_item"
                v-for="(item,index) in menu"
                :key="index"
                :class="index == activeItem?'active':''"
                @click="activeItem = index"
            >
                <span class="cn_label" v-html="item.label"></span>
                <span class="en_label" v-html="item.en"></span>
            </div>
        </div>
        <div v-if="activeItem == 0">
            <div class="expert_group">
                <el-row :gutter="20" class="group_body">
                    <el-col :span="12" class="group_item" v-for="(item,index) in expertList" :key="index">
                        <div class="left">
                            <div class="avatar">
                                <img :src="'http://210.28.188.103:8080/IntelligentAgriculture/res/'+item.headImg">
                            </div>
                        </div>
                        <div class="right">
                            <div class="basic">
                                <span>姓名:{{item.personName}}</span>
                                <span>邮件:{{item.email}}</span>
                            </div>
                            <div class="info">
                                <span>单位:{{item.company}}</span>
                                <span>技术特长:{{item.enterpriseName}}</span>
                                <span>职位:{{item.professional}}</span>
                            </div>
                            <div class="introduc">
                                <span>简介:</span>
                                <p class="nowrap">{{item.description}}</p>
                            </div>
                            <div class="btn_group">
                                <a href="#" class="ask" @click.stop.prevent="askQuestion(item)">&nbsp;</a>
                                <a href="#" class="video" @click.stop.prevent="appointDate(item)">&nbsp;</a>
                                <a href="#" class="make" @click.stop.prevent="appointDate(item)">&nbsp;</a>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-dialog title="提问" :visible.sync="questionDialogShow">
                  <el-form ref="questionForm" :model="peerQuestionForm" label-width="120px">
                    <el-form-item label="标题">
                      <el-input v-model="peerQuestionForm.title" placeholder="请输入标题"></el-input>
                    </el-form-item>

                    <el-form-item label="类别">
                      <el-checkbox-group v-model="peerQuestionForm.contentType">
                        <el-checkbox label="饲料喂养"></el-checkbox>
                        <el-checkbox label="水质环境"></el-checkbox>
                        <el-checkbox label="病害防治"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label=“他人是否可见”>
                      <el-radio class="radio" v-model="peerQuestionForm.visable" :label="1">是</el-radio>
                      <el-radio class="radio" v-model="peerQuestionForm.visable" :label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input type="textarea" v-model="peerQuestionForm.content"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="preQuestionSubmit">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-dialog>
                <el-dialog title="预约" :visible.sync="appointDialogShow">
                  <el-form ref="questionForm" :model="appointForm" label-width="100px">
                    <el-form-item label="日期">
                      <el-date-picker v-model="appointForm.appointDate" type="date" placeholder="选择日期"></el-date-picker>
                    </el-form-item>

                    <el-form-item label="时间段">
                      <el-time-picker is-range v-model="appointForm.timeRange" placeholder="选择时间端"></el-time-picker>
                    </el-form-item>
                    <el-form-item label="联系方式">
                      <el-input v-model="appointForm.launchUserTel" placeholder="请输入联系方式"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="appointSave">提交</el-button>
                    </el-form-item>
                  </el-form>
                </el-dialog>
            </div>
        </div>
        <div v-if="activeItem == 1" >
            <div class="know_group" style="padding:50px;">
                <el-row style="width: 48px;"><img src="../../../static/images/new.png" style="display: block; width: 100%;"/></el-row>
                <el-row style="margin-left: 20px;">
                    <el-col :span="20" class="group_item" v-for="(item,index) in newQuestions" :key="index">
                      <div style="line-height: 40px;">{{ index +"."+ item.title }}</div>
                    </el-col>
                </el-row>
            </div>
            <div class="know_group" style="padding:0 50px 50px;">
                <el-row style="width: 48px;"><img src="../../../static/images/hot.png" style="display: block; width: 100%;"/></el-row>
                <el-row style="margin-left: 20px;">
                    <el-col :span="20" class="group_item" v-for="(item,index) in hostQuestions" :key="index">
                      <div style="line-height: 40px;">{{ index +"."+ item.title }}</div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div v-if="activeItem == 2" >
            <div class="questionForm" >
              <el-form ref="questionForm" :model="questionForm" label-width="80px">
                <el-form-item label="活动名称">
                  <el-input v-model="questionForm.questionTitle"></el-input>
                </el-form-item>

                <el-form-item label="活动性质">
                  <el-checkbox-group v-model="questionForm.contentType">
                    <el-checkbox label="饲料喂养"></el-checkbox>
                    <el-checkbox label="水质环境"></el-checkbox>
                    <el-checkbox label="病害防治"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-form-item label="活动形式">
                  <el-input type="textarea" v-model="questionForm.content"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="questionSubmit">提交</el-button>
                </el-form-item>
                </el-form>
            </div>
        </div>
        <div>

        </div>
        <div>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeItem:0,
                menu:[
                    {label:"专家列表",value:"",en:"Expert"},
                    {label:"问题集萃",value:"",en:"FAQ"},
                    {label:"我要提问",value:"",en:"Quiz"}
                ],
                questionDialogShow: false,
                orderDialogShow: false,
                newQuestions:[],
                hostQuestions:[],
                questionForm:{
                  userName:"",
                  questionTitle: "",
                  contentType: [],
                  content: ""
                },
                peerQuestionForm: {
                  userName:"",
                  expertUserName:"",
                  title:"",
                  contentType:[],
                  visable:1,
                  content:""
                },
                appointDialogShow: false,
                appointForm: {
                  userName:"",
                  beInvitedUserName:"",
                  appointDate:"",
                  timeRange:[],
                  launchUserTel:""
                },
                expertList:[],
                newQuestionPage: 1,
                hostQuestionPage: 1,
                expertPage: 1
            }
        },
        methods:{
            overString(val){
                return val.length > 70 ? val.substring(0,70)+"..." : val
            },
            askQuestion(item){
              const self = this;
              self.questionDialogShow = true;
              self.peerQuestionForm.expertUserName = item.personName;
            },
            appointDate(item){
              const self = this;
              self.appointDialogShow = true;
              self.appointForm.beInvitedUserName = item.personName;
            },
            appointSave(){
              const self = this;
              self.appointForm.userName = localStorage.getItem('msuserName');
              self.$.post("/IntelligentAgriculture/expert/appointSave",self.appointForm,function(res){
                let result = JSON.parse(res);
                self.questionDialogShow = false;
                if(result.resCode == 1) {
                  self.$message.success("提交成功");
                } else if (result.loginStatus == 0) {
                  window.location.href = location.origin + '#login';
                  return;
                } else {
                  self.$message.error(result.msg);
                }
              })
            },
            preQuestionSubmit(){
              const self = this;
              self.peerQuestionForm.userName = localStorage.getItem('msuserName');
              self.peerQuestionForm.startTime = self.peerQuestionForm.timeRange[0];
              self.peerQuestionForm.endTime = self.peerQuestionForm.timeRange[1];
              delete self.peerQuestionForm.timeRange;
              self.$.post("/IntelligentAgriculture/expert/appointSave",self.peerQuestionForm,function(res){
                let result = JSON.parse(res);
                self.appointDialogShow = false;
                if(result.resCode == 1) {
                  self.$message.success("提交成功");
                } else if (result.loginStatus == 0) {
                  window.location.href = location.origin + '#login';
                  return;
                } else {
                  self.$message.error(result.msg);
                }
              })
            },
            //获取专家列表
            getExpertList(){
                const self = this;
                self.$.get("/IntelligentAgriculture/expert/expertList",{page: self.expertPage},function(res){
                  let result = JSON.parse(res);
                  if(result.resCode == 1) {
                    self.expertList = result.res;
                  } else if (result.loginStatus == 0) {
                    window.location.href = location.origin + '#login';
                    return;
                  } else {
                    self.$message.error(result.msg);
                  }
                })
            },
            //获取问题列表
            getQsList(){
                const self = this;
                self.$.post("/IntelligentAgriculture/expert/getNewQuestionsByPage",{page:self.newQuestionPage},function(res){
                  let result = JSON.parse(res);
                  if(result.resCode == 1) {
                    self.newQuestions = result.res.newQuestionByPage;
                    console.log(result.res);
                  } else if (result.loginStatus == 0) {
                    window.location.href = location.origin + '#login';
                    return;
                  } else {
                    self.$message.error(result.msg);
                  }
                })
            },
            //获取热门问题
            questionSubmit(){
              const self = this;
              self.questionForm.userName = localStorage.getItem('msuserName');
              self.$.post("/IntelligentAgriculture/expert/sharedQuestionSave",self.questionForm,function(res){
                let result = JSON.parse(res);
                if(result.resCode == 1) {
                  self.$message.success("提交成功");
                } else if (result.loginStatus == 0) {
                  window.location.href = location.origin + '#login';
                  return;
                } else {
                  self.$message.error(result.msg);
                }
              })
            },
            getHotQsList(){
                const self = this;
                self.$.get("/IntelligentAgriculture/expert/getHostQuestionsByPage",{page:self.hostQuestionPage},function(res){
                  let result = JSON.parse(res);
                  if(result.resCode == 1) {
                    self.hostQuestions = result.res.hotQuestionByPage;
                  } else if (result.loginStatus == 0) {
                    window.location.href = location.origin + '#login';
                    return;
                  } else {
                    self.$message.error(result.msg);
                  }
                })
            }
        },
        created(){
            const self = this;
            self.getExpertList();
            self.getQsList();
            self.getHotQsList();
        }
    }
</script>

<style scoped>
    .expert_menu{
        display:flex;
        justify-content:space-around;
        width:100%;
    }
    .menu_item{
        display:flex;
        flex-direction:column;
        padding:20px;
        text-align:center;
        cursor: pointer;
    }
    .menu_item:hover{
        color:#1cb4ad;
    }
    .menu_item.active{
        color:#1cb4ad;
    }
    .menu_item .cn_label{
        font-size:24px;
    }
    .menu_item .en_label{
        font-size:12px;
        font-family:'Cambria'
    }

    .expert_group .group_title{
        display:flex;
        justify-content:space-between;
        padding:20px 10px;
    }
    .expert_group .group_body .group_item{
        display:flex;
        margin-top:50px;
        padding-bottom:30px;
        min-height:120px;
        overflow:hidden;
        text-overflow:ellipsis;
    }

    .expert_group .group_body .group_item .left{
        margin-right:16px;
    }
    .expert_group .group_body .group_item .left .avatar{
         width:170px;
         height:240px;
         background-color:#4c92e4;
    }
    .expert_group .group_body .group_item .left img{
        width:100%;
        height:100%;

    }
    .expert_group .group_body .group_item .right{
        display:flex;
        flex-direction:column;
    }
    .expert_group .group_body .group_item .right .item_label{
        font-size:16px;
    }
    .expert_group .group_body .group_item .right .item_content{
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:3;
        font-size:12px;
    }
    .expert_group .group_body .group_item .right .basic{
        display:flex;
        justify-content:space-between;
    }
    .expert_group .group_body .group_item .right .info{
        display:flex;
        flex-direction:column;
    }
    .expert_group .group_body .group_item .right .info span{
        padding-top:10px;
    }
    .expert_group .group_body .group_item .right .introduc{
        padding-top:10px;
    }
    .expert_group .group_body .group_item .right .introduc span{
        font-size:14px;
    }
    .expert_group .group_body .group_item .right .introduc p{
        text-indent:2em;
    }
    .expert_group .group_body .group_item .right .btn_group{
        display:flex;
        justify-content:space-around;
        margin-top:10px;
    }
    .expert_group .group_body .group_item .right .btn_group a{
        width:61px;
        height:54px;
        background-position:center center;
        background-repeat: no-repeat;
        background-size:cover;
        text-decoration:none;
    }
    .expert_group .group_body .group_item .right .btn_group .video{
        background-size:45px 54px;
        background-image:url('../../assets/expert/icon1.png');
    }
    .expert_group .group_body .group_item .right .btn_group .ask{
        background-image:url('../../assets/expert/icon2.png');
    }
    .expert_group .group_body .group_item .right .btn_group .make{
        background-image:url('../../assets/expert/icon3.png');
    }
    .nowrap {
      overflow: hidden;
      text-overflow:ellipsis;
      height: 70px;
      font-size: 12px;
    }
    .questionForm {
      margin: 50px auto;
      width: 40%;
    }

</style>
