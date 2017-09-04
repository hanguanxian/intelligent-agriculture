<template>
    <el-row class="content">
    <el-col :xs="24" :sm="{span: 8,offset: 8}">
        <h1 style="margin-bottom: 20px;"> {{ title }} </h1>
        <el-row v-show="!registerFlag">
          <el-form :model="loginForm" ref="loginForm" label-width="100px" :rules="loginRules">
              <el-form-item prop="power" label="用户类别:">
                <el-select v-model="loginForm.power" placeholder="请选择用户类别">
                  <el-option label="普通用户" value="0"></el-option>
                  <el-option label="专家" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="userName" label="用户名:">
                  <el-input v-model="loginForm.userName" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="密码:">
                  <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
                <el-button @click="formChange">注册</el-button>
              </el-form-item>
          </el-form>
        </el-row>
        <el-row v-show="registerFlag">
          <el-form :model="registForm" ref="registForm" :rules="registRules" label-width="100px">
              <el-form-item prop="userName" label="用户名:">
                  <el-input v-model="registForm.userName" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item prop="power" label="用户类别:">
                <el-select v-model="registForm.power" placeholder="请选择用户类别">
                  <el-option label="普通用户" value="0"></el-option>
                  <el-option label="专家" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="password" label="密码:">
                  <el-input type="password" placeholder="密码" v-model="registForm.password"></el-input>
              </el-form-item>
              <el-form-item prop="passwordConfirm" label="确认密码:" :rules="registRules.checkPass">
                  <el-input type="password" placeholder="密码" v-model="registForm.passwordConfirm"></el-input>
              </el-form-item>
              <el-form-item prop="enterpriseName" label="企业名称:">
                  <el-input placeholder="企业名称" v-model="registForm.enterpriseName"></el-input>
              </el-form-item>
              <el-form-item prop="personName" label="责任人:">
                  <el-input placeholder="责任人" v-model="registForm.personName"></el-input>
              </el-form-item>
              <el-form-item prop="tel" label="联系方式:">
                  <el-input placeholder="联系方式" v-model="registForm.tel"></el-input>
              </el-form-item>
              <el-form-item prop="email" label="Email:">
                  <el-input placeholder="Email" v-model="registForm.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="register">注册</el-button>
                <el-button @click="formChange">返回登录</el-button>
              </el-form-item>
          </el-form>
        </el-row>
    </el-col>
  </el-row>
</template>
<script>
    export default {
    data () {
      let validateTel = (rule, value, callback) => {
        let telRegex = /^1[34578]\d{9}$/;
        if (value === '') {
          callback(new Error('请输入联系电话'));
        } else if (!telRegex.test(value)) {
          callback(new Error('手机号码格式不对'));
        } else {
          callback();
        }
      };
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        title: '用户登录',
        registerFlag: false,
        loginUrl: "/IntelligentAgriculture/user/checklogin",
        registUrl: "/IntelligentAgriculture/user/register",
        loginForm: {
          power:"0",
          userName: 'zhangsir',
          password: '12121212'
        },
        loginRules: {
          power: [
            { required: true, message: '请选择用户类别', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        registForm: {
          userName: '',
          password: '',
          passwordConfirm: '',
          power: '',
          enterpriseName: '',
          personName: '',
          tel: '',
          email: ''
        },
        registRules: {
          power: [
            { required: true, message: '请选择用户类别', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          enterpriseName: [
            { required: true, message: '请输入企业名称', trigger: 'blur' }
          ],
          personName: [
            { required: true, message: '请输入责任人姓名', trigger: 'blur' }
          ],
          tel: [
            { validator: validateTel, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          checkPass: [
             { validator: validatePass, trigger: 'blur' }
          ]
        }
      }
    },
  methods:{
    formChange(){
      this.registerFlag = !this.registerFlag;
      this.title = this.register ? "用户注册" : "用户登录";
    },
    login() {
      const self = this;
      self.$refs.loginForm.validate((valid) => {
        if (valid) {
          self.$.post(self.loginUrl,self.loginForm,function(data,textStatus){
              data = JSON.parse(data);
     					if(data.resCode == 1){
                localStorage.setItem('msuserName',self.loginForm.userName);
     						self.$router.push('/main/index');
     					}else if(data.resCode == 0){
                self.$message.error('用户名或密码错误');
     					}
 				   })
          // self.$axios.post(self.loginUrl, self.loginForm).then((res) => {
          //   console.log(res);
          //   localStorage.setItem('msuserName',self.loginForm.userName);
          // });
        }
      });
    },
    register() {
      const self = this;
      self.$refs.loginForm.validate((valid) => {
        if (valid) {
          delete self.registForm.passwordConfirm;
          self.$.post(self.registUrl,self.registForm,function(data,textStatus){
              data = JSON.parse(data);
     					if(data.resCode == 1){
                self.$message.success('注册成功');
                localStorage.setItem('msuserName',self.registForm.userName);
     						self.$router.push('/');
     					}else if(data.resCode == 0){
                self.$message.error('注册失败');
     					}
 				   })
        }
      });
      }
    }
  }
</script>
<style scoped>
  .content {
      padding-top: 60px;
  }
  h1 {
      text-align: center;
      color: #368A55;
  }
</style>
