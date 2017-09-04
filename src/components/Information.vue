<template>
    <div class="information">
        <div class="header">
            <div class="head container">
                <div class="logo"></div>
            </div>
        </div>
        <div class="main_body container">
            <h1 class="page_title">水塘配置管理</h1>
            <el-table
                :data="pondList"
                style="width: 100%">
                <el-table-column
                    fixed
                    prop="name"
                    label="水塘名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="length"
                    label="长"
                    >
                </el-table-column>
                <el-table-column
                    prop="width"
                    label="宽"
                    >
                </el-table-column>
                <el-table-column
                    prop="deep"
                    label="深"
                    >
                </el-table-column>
                <el-table-column
                    prop="area"
                    label="面积"
                    >
                </el-table-column>
                <el-table-column
                    prop="location"
                    label="地区"
                    width="220"
                    >
                </el-table-column>
                <el-table-column
                    prop="person"
                    label="责任人">
                </el-table-column>
                <el-table-column
                    prop="tel"
                    label="联系方式"
                    width="150">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button
                        size="small"
                        type="primary"
                        @click="editPond(scope.$index, scope.row)">编辑</el-button>
                        <br>
                        <el-button
                        size="small"
                        type="danger"
                        @click="deletePond(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="12" :offset="2" style="margin-top:50px">
                    <el-form ref="form_pond" :model="form_pond" :rules="pond_rule" label-position="left" label-width="80px">
                        <el-form-item prop="name" label="水塘名称">
                            <el-input placeholder="请输入名字" v-model="form_pond.name"></el-input>
                        </el-form-item>
                        <el-form-item prop="length" label="长">
                            <el-input placeholder="请输入数值" v-model="form_pond.length">
                                <template slot="append">米</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="width" label="宽">
                            <el-input placeholder="请输入数值" v-model="form_pond.width">
                                <template slot="append">米</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="deep" label="深">
                            <el-input placeholder="请输入数值" v-model="form_pond.deep">
                                <template slot="append">米</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="area" label="面积">
                            <el-input placeholder="请输入数值" v-model="form_pond.area">
                                <template slot="append">亩</template>
                            </el-input>
                        </el-form-item>

                        <!--地区-->
                        <el-form-item prop="location" label="地区">
                            <el-cascader
                                :options="area"
                                v-model="form_pond.location">
                            </el-cascader>
                        </el-form-item>

                        <el-form-item prop="person" label="责任人">
                            <el-input placeholder="请输入姓名" v-model="form_pond.person"></el-input>
                        </el-form-item>
                        <el-form-item prop="tel" label="联系方式">
                            <el-input placeholder="请输入联系方式" v-model="form_pond.tel"></el-input>
                        </el-form-item>
                        <el-form-item prop="email" label="邮箱">
                            <el-input placeholder="请输入邮箱" v-model="form_pond.email"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveNewPond('form_pond')">新增水塘</el-button>
                            <el-button type="primary" @click="saveEdit('form_pond')">保存修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

        </div>

        <el-row style="background:#262e39">
			<el-col :span="24" class="footer">
				copyright &copy;2016 All rights reserved.
			</el-col>
		</el-row>
    </div>
</template>

<script>
    import area from "../assets/areaOptions"
    export default {
        data(){
            return{
                pondList:[],
                form_pond:{
                    id:"",
                    name:"",
                    length:"",
                    width:"",
                    deep:"",
                    area:"",
                    location:[],
                    person:"",
                    tel:"",
                    email:""
                },
                pond_rule:{
                    name:[
                        {type:"string",required: true, message: '请输入塘口名',trigger: 'change'}
                    ],
                    length:[
                        {required: true, message: '请输入长度',trigger: 'change'}
                    ],
                    width:[
                        {required: true, message: '请输入宽度',trigger: 'change'}
                    ],
                    deep:[
                        {required: true, message: '请输入深度',trigger: 'change'}
                    ],
                    area:[
                        {required: true, message: '请输入面积',trigger: 'change'}
                    ]
                },
                area:area.areaOptions,
                test:""
            }
        },
        methods:{
            //重置表单
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            //获取所有塘口
            getPonds(){
                const self = this;
                self.$.get("/IntelligentAgriculture/PondInfo/showPondinfos",function(data){
                    data = JSON.parse(data);
                    if(data.resCode == 1){
                        const res = data.res;
                        console.log(res)
                        self.pondList = [];
                        for(const item of res){
                            let location = "";
                            item.province = self.utils.transArea(item.province) || "";
                            item.city = self.utils.transArea(item.city) || "";
                            item.country = self.utils.transArea(item.country) || "";
                            location = item.province.label + item.city.label + item.country.label
                            self.pondList.push({
                                id:item.id,
                                name:item.pondName,
                                length:item.pondLength,
                                width:item.pondWidth,
                                deep:item.pondDeep,
                                area:item.pondArea,
                                location:location,
                                person:item.personName,
                                tel:item.tel,
                                email:item.email
                            })
                        }
                    } else if (data.loginStatus == 0) {
                      window.location.href = location.origin + '#login';
                      return;
                    } else if(data.resCode == 0){
                        self.$message.error('获取塘口信息失败');
                    }
                })
            },
            //编辑塘口
            editPond(index, row) {
                const self = this;
                let data = {
                    id:row.id
                }
                self.$.post("/IntelligentAgriculture/PondInfo/showPondinfo",data,function(data){
                    self.resetForm('form_pond')
                    data = JSON.parse(data);
                    console.log("选择的塘口")
                    console.log(data)
                    console.log("----------")
                    if(data.resCode == 1){
                        let pondinfo = data.res;
                        pondinfo.province = self.utils.transArea(pondinfo.province)
                        pondinfo.city = self.utils.transArea(pondinfo.city)
                        pondinfo.country = self.utils.transArea(pondinfo.country)
                        self.form_pond.id = pondinfo.id;
                        self.form_pond.name = pondinfo.pondName;
                        self.form_pond.length = pondinfo.pondLength+'';
                        self.form_pond.width = pondinfo.pondWidth+'';
                        self.form_pond.deep = pondinfo.pondDeep+'';
                        self.form_pond.area = pondinfo.pondArea+'';
                        self.form_pond.location[0] = pondinfo.province.value || "";
                        self.form_pond.location[1] = pondinfo.city.value || "";
                        self.form_pond.location[2] = pondinfo.country.value || "";
                        self.form_pond.person = pondinfo.personName;
                        self.form_pond.tel = pondinfo.tel;
                        self.form_pond.email = pondinfo.email;
                        console.log(self.form_pond)
                    }  else if (data.loginStatus == 0) {
                      window.location.href = location.origin + '#login';
                      return;
                    } else if(data.resCode == 0){
                        self.$message.error('获取塘口信息失败');
                    }

                })
            },
            //删除塘口
            deletePond(index, row) {
                console.log(index, row);
                const self = this;
                self.$confirm('此操作将永久删除该塘口, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        id:row.id
                    }
                    self.$.post("/IntelligentAgriculture/PondInfo/deletePond",data,function(data){
                        data = JSON.parse(data)
                        if(data.resCode == 1){
                            self.$message.success("删除成功!")
                            self.getPonds();
                        } else if (data.loginStatus == 0) {
                          window.location.href = location.origin + '#login';
                          return;
                        } else if(data.resCode == 0){
                            self.$message.error('无法删除，关联该水塘的数据正在被使用！');
                        }
                    })
                })

            },
            //保存新增塘口
            saveNewPond(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if(valid){
                        let local = this.utils.areaVtoVL(self.form_pond.location);
                        let data = {
                            // id:form_pond.id,
                            pondName:self.form_pond.name,
                            pondLength:self.form_pond.length,
                            pondWidth:self.form_pond.width,
                            pondDeep:self.form_pond.deep,
                            pondArea:self.form_pond.area,
                            province:local[0],
                            city:local[1],
                            country:local[2],
                            address:"",
                            personName:self.form_pond.person,
                            tel:self.form_pond.tel,
                            email:self.form_pond.email
                        }
                        self.$.post("/IntelligentAgriculture/PondInfo/addPond",data,function(data){
                            data = JSON.parse(data);
                            if(data.resCode == 1){
                                self.$message.success("新增塘口成功!");
                                self.getPonds();
                                self.resetForm(formName)
                            } else if (data.loginStatus == 0) {
                              window.location.href = location.origin + '#login';
                              return;
                            } else if(data.resCode == 0){
                                self.$message.error("新增塘口失败!")
                            }
                        })
                    }else{
                        return false;
                    }
                })

            },
            //保存修改
            saveEdit(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if(valid){
                        let local = this.utils.areaVtoVL(self.form_pond.location);
                        let data = {
                            id:self.form_pond.id,
                            pondName:self.form_pond.name,
                            pondLength:self.form_pond.length,
                            pondWidth:self.form_pond.width,
                            pondDeep:self.form_pond.deep,
                            pondArea:self.form_pond.area,
                            province:local[0] || '',
                            city:local[1] || '',
                            country:local[2] || '',
                            address:"",
                            personName:self.form_pond.person,
                            tel:self.form_pond.tel,
                            email:self.form_pond.email
                        }
                        self.$.post("/IntelligentAgriculture/PondInfo/updatePond",data,function(data){
                            data = JSON.parse(data);
                            if(data.resCode == 1){
                                self.$message.success("修改塘口信息成功!");
                                self.getPonds();
                                self.resetForm(formName)
                            } else if (data.loginStatus == 0) {
                              window.location.href = location.origin + '#login';
                              return;
                            } else if(data.resCode == 0){
                                self.$message.error("修改塘口信息失败!")
                            }
                        })
                    }else{
                        return false;
                    }
                })
            }
        },
        mounted(){
            this.getPonds()
        }
    }
</script>

<style scoped>
    .header{
         width:100%;
    }
    .container{
		max-width:1100px;
		min-width:960px;
		margin:0 auto;
	}
    .header .head{
        height:70px;
    }
    .logo {
        display: inline-block;
        width: 120px;
        height:70px;
        background: url('../assets/index/logo.png') no-repeat center center / 100px 50px;
	}
    .page_title{
        padding:20px 10px;
        margin-bottom:30px;
        text-align:center;
        color:#95bcb7;
    }
    .footer{
		height:100px;
		line-height: 100px;
		text-align:center;
		color:#fff;
	}

</style>
