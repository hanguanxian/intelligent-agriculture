<template>
  <div class="container">
    <el-row>
      <el-col :span="4"><img :src="'http://210.28.188.103:8080/IntelligentAgriculture/res/'+ userInfo.headImg" style="width: 100%;"></el-col>
      <el-col :span="20">
        <el-col :span="10">{{ '姓名:' + userInfo.personName }}</el-col>
        <el-col :span="14">{{ '邮件:' + userInfo.email }}</el-col>
        <el-col :span="10">{{ '单位:' + userInfo.enterpriseName }}</el-col>
        <el-col :span="14">{{ '技术特长:' + userInfo.category }}</el-col>
        <el-col :span="10">{{ '职位:' + userInfo.professional }}</el-col>
      </el-col>
    </el-row>
    <el-row>
      <div>简介：</div>
      <el-col :span="24" v-html="userInfo.description"></el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        data() {
            return {
              userInfo:{},
            }
        },
        methods:{
            getUserInfo(){
                const self = this;
                let userName = self.$route.query.friendName;
                self.$.post("/IntelligentAgriculture/user/userInfo",{userName:userName},function(res){
                  let result = JSON.parse(res);
                  if(result.resCode == 1) {
                    self.userInfo = result.res;
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
            self.getUserInfo();
        }
    }
</script>

<style scoped>

</style>
