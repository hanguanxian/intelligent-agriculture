<template>
    <div class="breedingLog">

        <el-row class="actTheme" style="border-bottom:1px solid #9b9b9b;">
            <el-col :span="12" style="padding-top:20px;padding-bottom:60px;">
                <el-form ref="form_daily" :rules="daily_rule" :model="form_daily" label-width="90px">
                    <el-form-item>
                        <template slot="label"><span class="theme_title">日常投放</span>
</template>
                    </el-form-item>
                    <el-form-item prop="pond" label="塘口选择">
                        <el-select v-model="form_daily.pond"  placeholder="请选择塘口">
                            <el-option v-for="(pond,index) in formData.pondList" :label="pond.name" :value="pond.value" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="cate" label="投放类别">
                        <el-cascader
                            :options="formData.putCateList"
                            v-model="form_daily.cate">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item :prop="'goods.' + index + '.value'" v-for="(item,index) in form_daily.goods" :label="index == 0 ? '投放物品' :''" :key="index">
                        <el-input v-model="item.value" placeholder="投放物名称"></el-input>
                        <el-button v-if="index == form_daily.goods.length-1" type='primary' @click="addGoods">增加</el-button>
                        <el-button v-if="form_daily.goods.length != 1" type='danger' @click="delGoods(index)">删除</el-button>
                    </el-form-item>

                    <el-form-item prop="money" label="投放总额">
                        <el-input placeholder="总金额" v-model="form_daily.money">
<template slot="append">
    元
</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="picList" label="上传图片">
                        <el-upload
                            class="upload-demo"
                            action=""
                            :file-list="form_daily.picList"
                            :before-upload="form_daily_hold">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item  prop="date" label="活动时间">
                        <el-date-picker
                            v-model="form_daily.date"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="btn_group">
                        <el-button type="primary" @click="onDaily('form_daily')">提交</el-button>
                        <el-button type="danger" @click="resetForm('form_daily')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <span class="boundary"></span>
            <el-col :span="12" style="padding-left:40px;padding-top:20px;padding-bottom:60px;">
                <el-form ref="form_polling" :model="form_polling" :rules="polling_rule" label-width="80px">
                    <el-form-item>
<template slot="label">
    <span class="theme_title">巡视检查</span>
</template>
                    </el-form-item>
                    <el-form-item prop="pond" label="塘口选择">
                        <el-select v-model="form_polling.pond" placeholder="请选择塘口">
                            <el-option v-for="(pond,index) in formData.pondList" :label="pond.name" :value="pond.value" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="content" label="巡视内容">
                        <el-cascader
                            :options="formData.polling_content"
                            v-model="form_polling.content">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item prop="inputData" label="录入数据">
                        <el-radio-group v-model="form_polling.inputData">
                            <el-radio label="yes">是</el-radio>
                            <el-radio label="">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="form_polling.inputData === 'yes'">
                        <el-form-item prop="selectData" label="数据类型" style="display:inline-block">
                            <el-select v-model="form_polling.selectData" placeholder="请选择" @change="watchDataType">
                                <el-option
                                v-for="item in formData.dataType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="num" label="数值" style="margin-top:10px">
                            <el-input placeholder="请输入数值" v-model="form_polling.num" style="width:194px"></el-input>
                            <span>{{range}}</span>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item prop="picList" label="上传图片">
                        <el-upload
                            class="upload-demo"
                            action=""
                            :file-list="form_polling.picList"
                            :before-upload="form_polling_hold"
                            >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item prop="date" label="活动时间">
                        <el-date-picker
                            v-model="form_polling.date"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="btn_group">
                         <el-button type="primary" @click="onPolling('form_polling')">提交</el-button>
                        <el-button type="danger" @click="resetForm('form_polling')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>



        <el-row>
            <el-col :span="24">
                <div  class="myDaily">
                    <span>我的养殖日志</span>
                    <el-button size="small" type="warning" @click="exportDialogShow = true">导出日志</el-button>
                </div>
            </el-col>
        </el-row>

        <el-tabs v-model="kind"  @tab-click="swithKind">
            <el-tab-pane label="日常投放" name="throw" style="padding:20px">
                <el-table
                    :data="formData.tb_daily"
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="序号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="投放物"
                        width="250">
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="类别">
                    </el-table-column>
                    <el-table-column
                        prop="pond"
                        label="投放塘口">
                    </el-table-column>
                    <el-table-column
                        prop="money"
                        label="投放成本">
                    </el-table-column>
                    <el-table-column
                        label="图片">
<template scope="scope">
    <el-button type="primary" size="small" @click.native="checkImg(scope.$index, scope.row)">
        点击查看</el-button>
</template>
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="投放时间">
                </el-table-column>
                </el-table>
                <el-pagination
                    class="pagina"
                    :current-page.sync="daily.curPage"
                    :page-count="daily.totalPages"
                    layout="total, prev, pager, next"
                    :total="daily.totalRecode"
                    @current-change="curChange">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="巡视检查" name="patrol" style="padding:20px">
                <el-table
                    :data="formData.tb_polling"
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="序号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="pond"
                        label="巡检塘口">
                    </el-table-column>
                    <el-table-column
                        prop="content"
                        label="巡检内容">
                    </el-table-column>
                    <el-table-column
                        prop="inputData"
                        label="录入的数据">
                    </el-table-column>
                    <el-table-column
                        label="图片">
<template scope="scope">
    <el-button type="primary" size="small" @click.native="checkImg(scope.$index, scope.row)">
        点击查看</el-button>
</template>
                    </el-table-column>
                    <el-table-column
                        prop="date"
                        label="投放时间">
                </el-table-column>
                </el-table>
                <el-pagination
                    class="pagina"
                    :current-page.sync="polling.curPage"
                    :page-count="polling.totalPages"
                    layout="total, prev, pager, next"
                    :total="polling.totalRecode"
                    @current-change="curChange('polling')">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="导出日志" :visible.sync="exportDialogShow">
            <el-form ref="form_export" :model="form_export" label-width="120px">
                <el-form-item prop="startTime" label="起始时间">
                    <el-date-picker
                        v-model="form_export.startTime"
                        type="date"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="endTime" label="结束时间">
                    <el-date-picker
                        v-model="form_export.endTime"
                        type="date"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop="exportType" label="导出内容">
                    <el-select v-model="form_export.exportType" placeholder="请选择导出内容">
                        <el-option v-for="(item,index) in formData.exportType" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="exportDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="exportTable('form_export')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import FileSaver from "file-saver"
    export default {
        data() {
            return {
                form_daily: {
                    pond: "",
                    cate: [],
                    goods: [{
                        name: "",
                        value: ""
                    }],
                    money: "",
                    picList: [],
                    date: new Date()
                },
                daily_rule: {
                    pond: [{
                        type: "number",
                        required: true,
                        message: '请选择塘口',
                        trigger: 'change'
                    }],
                    cate: [{
                        type: "array",
                        required: true,
                        message: '请选择投放物类别',
                        trigger: 'change'
                    }]
                },
                form_polling: {
                    pond: "",
                    content: [],
                    inputData: "",
                    selectData: '',
                    num: "",
                    picList: [],
                    date: new Date()
                },
                polling_rule: {
                    pond: [{
                        type: "number",
                        required: true,
                        message: '请选择塘口',
                        trigger: 'change'
                    }],
                    content: [{
                        type: "array",
                        required: true,
                        message: '请选择巡视内容',
                        trigger: 'change'
                    }],
                    selectData: [{
                        type: "number",
                        required: true,
                        message: '请选择数据类型',
                        trigger: 'change'
                    }],
                    num:[{
                        // type: "number",
                        required: true,
                        message: '请输入数值',
                        trigger: 'change'
                    }]
                },
                form_export: {
                    startTime: "2017/7/1",
                    endTime: new Date(),
                    exportType: "全部",
                },
                formData: {
                    pondList: [],
                    putCateList: [],
                    polling_content: [{
                            label: "水质",
                            value: "水质",
                            children: []
                        },
                        {
                            label: "螃蟹",
                            value: "螃蟹",
                            children: []
                        },
                        {
                            label: "虾",
                            value: "虾",
                            children: []
                        },
                        {
                            label: "鱼",
                            value: "鱼",
                            children: []
                        },
                    ],
                    dataType: [],
                    tb_daily: [],
                    // tb_daily:this.utils.arrRepeat([{
                    //     id:"0",
                    //     name:"测试五",
                    //     type:"螺蛳",
                    //     pond:"固城湖",
                    //     money:"100元",
                    //     pic:["asdasd"],
                    //     date:"2018-08-19 08:00"
                    // }]),
                    tb_polling: [],
                    // tb_polling:this.utils.arrRepeat([{
                    //     id:"0",
                    //     pond:"固城湖",
                    //     content:"水质水肥度: 偏低",
                    //     inputData:"含氧量2.3ml/L",
                    //     pic:["asdasd"],
                    //     date:"2018-08-19 08:00"
                    // }]),
                    exportType: [{
                            label: "全部",
                            value: "全部"
                        },
                        {
                            label: "日常投放",
                            value: "日常投放"
                        },
                        {
                            label: "巡视检查",
                            value: "巡视检查"
                        },
                    ]
                },
                addTheme: "0",
                myTheme: "0",
                daily: {
                    curPage: 1,
                    totalRecode: 0,
                    totalPages: 1
                },
                polling: {
                    curPage: 1,
                    totalRecode: 0,
                    totalPages: 1
                },
                kind: "throw",
                exportDialogShow: false,
                range: ""
            }
        },
        methods: {
            /* 方法 */
            watchDataType(val) {
                const self = this;
                for (const item of self.formData.dataType) {
                    if (val == item.value) {
                        self.range = "(正常值 " + item.range + ")"
                    }
                }
            },
            /* 页面方法 */
            //新增物品
            addGoods() {
                const self = this;
                self.form_daily.goods.push({
                    name: "",
                    value: ""
                })
            },
            //删除物品
            delGoods(index) {
                const self = this;
                self.form_daily.goods.splice(index, 1);
            },

            //获取当前用户塘口信息
            getPonds() {
                const self = this;
                self.$.get("/IntelligentAgriculture/PondInfo/showPondinfos", function(data) {
                    data = JSON.parse(data);
                    if (data.resCode == 1) {
                        self.formData.pondList = [];
                        for (const item of data.res) {
                            self.formData.pondList.push({
                                name: item.pondName,
                                value: item.id
                            })
                        }
                    }  else if (data.loginStatus == 0) {
                      window.location.href = location.origin + '#login';
                      return;
                    } else if (data.resCode == 0) {
                        self.$message.error('获取塘口信息失败');
                    }
                })
            },
            //获取输入标签
            getDailyInputType() {
                const self = this;
                self.$.get("/IntelligentAgriculture/breedingLog/dailyInputType", function(data) {
                    data = JSON.parse(data);
                    console.log(data)
                    if (data.resCode == 1) {
                        self.formData.putCateList = [];
                        for (const item of data.res) {
                            self.formData.putCateList.push({
                                label: item.inputtypename,
                                value: item.inputtype
                            })
                        }
                    }  else if (data.loginStatus == 0) {
                      window.location.href = location.origin + '#login';
                      return;
                    } else if (data.resCode == 0) {
                        self.$message.error("获取类别信息失败")
                    }

                })
            },
            //获取巡检类别
            getPollingType() {
                const self = this;
                let ssState = [ //水质三级选项
                    {
                        label: "发绿",
                        value: "发绿"
                    }, {
                        label: "发黑",
                        value: "发黑"
                    }, {
                        label: "正常",
                        value: "正常"
                    }
                ]
                let common = [ //通用选项  //过低 过高
                    {
                        label: "过低",
                        value: "过低"
                    },
                    {
                        label: "偏低",
                        value: "偏低"
                    },
                    {
                        label: "正常",
                        value: "正常"
                    },
                    {
                        label: "偏高",
                        value: "偏高"
                    },
                    {
                        label: "过高",
                        value: "过高"
                    }
                ]
                let chiliao = [{
                        label: "太少",
                        value: "太少"
                    },
                    {
                        label: "偏少",
                        value: "偏少"
                    },
                    {
                        label: "正常",
                        value: "正常"
                    },
                    {
                        label: "偏多",
                        value: "偏多"
                    },
                    {
                        label: "太多",
                        value: "太多"
                    }
                ]
                let huodongli = [{
                        label: "很弱",
                        value: "很弱"
                    },
                    {
                        label: "偏弱",
                        value: "偏弱"
                    },
                    {
                        label: "正常",
                        value: "正常"
                    },
                    {
                        label: "偏强",
                        value: "偏强"
                    },
                    {
                        label: "过强",
                        value: "过强"
                    }
                ]
                let xingwei = [{
                        label: "常浮上水面",
                        value: "常浮上水面"
                    },
                    {
                        label: "常浮到池边",
                        value: "常浮到池边"
                    },
                    {
                        label: "正常",
                        value: "正常"
                    },
                    {
                        label: "常在深水区",
                        value: "常在深水区"
                    },
                    {
                        label: "常吐泡沫",
                        value: "常吐泡沫"
                    },
                    {
                        label: "持续颤抖",
                        value: "持续颤抖"
                    },
                    {
                        label: "极少死亡",
                        value: "极少死亡"
                    },
                    {
                        label: "少量死亡",
                        value: "少量死亡"
                    },
                    {
                        label: "大量死亡",
                        value: "大量死亡"
                    },
                ]

                function buweiState() {
                    return [{
                            label: "腐烂",
                            value: "腐烂"
                        },
                        {
                            label: "斑点",
                            value: "斑点"
                        },
                        {
                            label: "正常",
                            value: "正常"
                        },
                        {
                            label: "发黑",
                            value: "发黑"
                        },
                        {
                            label: "发白",
                            value: "发白"
                        },
                        {
                            label: "发绿",
                            value: "发绿"
                        },
                        {
                            label: "发红",
                            value: "发红"
                        },
                        {
                            label: "水肿",
                            value: "水肿"
                        },
                        {
                            label: "发红",
                            value: "发红"
                        },
                        {
                            label: "少量脱落",
                            value: "少量脱落"
                        },
                        {
                            label: "大量脱落",
                            value: "大量脱落"
                        },
                    ]
                }
                let buwei = [{
                        label: "蟹钳",
                        value: "蟹钳",
                        children: buweiState()
                    },
                    {
                        label: "附肢",
                        value: "附肢",
                        children: buweiState()
                    },
                    {
                        label: "头壳",
                        value: "头壳",
                        children: buweiState()
                    },
                    {
                        label: "腮",
                        value: "腮",
                        children: buweiState()
                    },
                    {
                        label: "腹部",
                        value: "腹部",
                        children: buweiState()
                    },
                    {
                        label: "触须",
                        value: "触须",
                        children: buweiState()
                    },
                ]
                let yu_buwei = [{
                        label: "鳞",
                        value: "鳞",
                        children: buweiState()
                    },
                    {
                        label: "嘴",
                        value: "嘴",
                        children: buweiState()
                    },
                    {
                        label: "腮",
                        value: "腮",
                        children: buweiState()
                    },
                    {
                        label: "腹部",
                        value: "腹部",
                        children: buweiState()
                    },
                    {
                        label: "尾部",
                        value: "尾部",
                        children: buweiState()
                    },
                ]
                let tuoke = [{
                        label: "提前",
                        value: "提前"
                    },
                    {
                        label: "正常",
                        value: "正常"
                    },
                    {
                        label: "推迟",
                        value: "推迟"
                    },
                ]
                self.$.get("/IntelligentAgriculture/breedingLog/showPatrolType", function(data) {
                    data = JSON.parse(data);
                    console.log(data)
                    if (data.resCode == 1) {
                        for (const item of data.res) {
                            if (item.name == "水色") {
                                self.formData.polling_content[0].children.push({
                                    label: item.name,
                                    value: item.patroltype,
                                    children: ssState
                                })
                            } else if (item.name == "水肥度" || item.name == "水透明度" || item.name == "水温" || item.name == "溶解氧") {
                                self.formData.polling_content[0].children.push({
                                    label: item.name,
                                    value: item.patroltype,
                                    children: common
                                })
                            } else if (item.name == "体征") {
                                self.formData.polling_content[1].children.push({
                                    label: item.name,
                                    value: item.patroltype,
                                    children: buwei
                                })
                                self.formData.polling_content[2].children.push({
                                    label: item.name,
                                    value: item.patroltype,
                                    children: buwei
                                })
                                self.formData.polling_content[3].children.push({
                                    label: item.name,
                                    value: item.patroltype,
                                    children: yu_buwei
                                })
                            } else {
                                let threeMenu;
                                switch (item.name) {
                                    case "吃料":
                                        threeMenu = chiliao;
                                        break;
                                    case "活动力":
                                        threeMenu = huodongli;
                                        break;
                                    case "行为":
                                        threeMenu = xingwei;
                                        break;
                                    case "脱壳":
                                        threeMenu = tuoke;
                                        break
                                }
                                for (let i = 1; i < self.formData.polling_content.length; i++) {
                                    self.formData.polling_content[i].children.push({
                                        label: item.name,
                                        value: item.patroltype,
                                        children: threeMenu
                                    })
                                }
                            }
                        }
                    }  else if (data.loginStatus == 0) {
                      window.location.href = location.origin + '#login';
                      return;
                    } else if (data.resCode == 0) {
                        self.$message.error("获取巡检类别失败")
                    }

                })
            },
            //获取录入数据的类型
            getInputDataType() {
                const self = this;
                self.$.get("/IntelligentAgriculture/breedingLog/showManualData", function(data) {
                    data = JSON.parse(data);
                    if (data.resCode == 1) {
                        self.formData.dataType = [];
                        for (const item of data.res) {
                            self.formData.dataType.push({
                                label: item.name,
                                value: item.datatype,
                                range: item.range
                            })
                        }
                    }  else if (data.loginStatus == 0) {
                      window.location.href = location.origin + '#login';
                      return;
                    } else if (data.resCode == 0) {
                        self.$message.error("获取数据类型失败")
                    }
                })
            },
            //拦截图片
            form_daily_hold(file) {
                this.form_daily.picList = [];
                this.form_daily.picList.push(file);
                return false;
            },
            form_polling_hold(file) {
                this.form_polling.picList = [];
                this.form_polling.picList.push(file);
                return false;
            },
            //提交日志
            onDaily(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        var form = new FormData();
                        form.append("throw_pondId", self.form_daily.pond);
                        form.append("throw_dailyinputtype", self.form_daily.cate[0]);
                        form.append("throw_sub_dailyinputtype", self.form_daily.cate[1] || "");
                        self.form_daily.goods.forEach((item) => {
                            form.append("throw_name_edit", item.value);
                        });
                        form.append("throw_price_all", self.form_daily.money);
                        self.form_daily.picList.length > 0 ? form.append("throw_image", self.form_daily.picList[0]) : form.append("throw_image", new File([""], ""));
                        form.append("throw_activetime", self.form_daily.date.format("yyyy-MM-dd hh:mm:ss"));　
                        self.$.ajax({
                            url: "/IntelligentAgriculture/breedingLog/throw",
                            type: "post",
                            data: form,
                            processData: false,
                            contentType: false,
                            success: function(data) {
                                data = JSON.parse(data);
                                if (data.resCode == 1) {
                                    self.$message.success("提交成功!");
                                    self.getTableDate();
                                    self.resetForm(formName);
                                }  else if (data.loginStatus == 0) {
                                  window.location.href = location.origin + '#login';
                                  return;
                                } else if (data.resCode == 0) {
                                    self.$message.error("提交失败!")
                                }
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            //提交巡检
            onPolling(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        var content = self.form_polling.content;
                        var form = new FormData();
                        form.append("pondId", self.form_polling.pond);
                        form.append("patrolTarget", content[0]);
                        if (content[0] == "水质") {
                            form.append("patrolContentType1", content[1] || "");
                            form.append("patrolContentType2", 0);
                        } else {
                            form.append("patrolContentType1", 0);
                            form.append("patrolContentType2", content[1] || "");
                        }
                        form.append("patrolContentStatus", content.length > 3 ? content[3] : content[2]);
                        form.append("patrolTargetPart", content.length > 3 ? content[2] : 0);
                        form.append("islog", self.form_polling.inputData == 'yes' ? 'yes' : 'no');
                        form.append("catalog", self.form_polling.selectData || 0);
                        form.append("ranges", self.form_polling.num || "");
                        self.form_polling.picList.length > 0 ? form.append("files", self.form_polling.picList[0]) : form.append("files", new File([""], ""));

                        form.append("activeTime", self.form_polling.date.format("yyyy-MM-dd hh:mm:ss"));　
                        self.$.ajax({
                            url: "/IntelligentAgriculture/breedingLog/patrol",
                            type: "post",
                            data: form,
                            processData: false,
                            contentType: false,
                            success: function(data) {
                                data = JSON.parse(data)
                                if (data.resCode == 1) {
                                    self.$message.success("提交成功!");
                                    self.getTableDate();
                                    self.resetForm(formName);
                                }  else if (data.loginStatus == 0) {
                                  window.location.href = location.origin + '#login';
                                  return;
                                } else if (data.resCode == 0) {
                                    self.$message.error("提交失败!")
                                }
                            }
                        });
                    } else {
                        return false;
                    }
                })
            },
            //重置参数
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //获取表格数据
            swithKind(tab) {
                const self = this;
                self.kind = tab.name;
                self.getTableDate();
            },
            getTableDate() {
                const self = this;
                let data = {
                    page: self.kind == 'throw' ? self.daily.curPage : self.polling.curPage,
                    kind: self.kind
                }

                self.$.get("/IntelligentAgriculture/breedingLog/showMyLog", data, function(data) {
                    data = JSON.parse(data);
                    if (data.resCode == 1) {
                        if (self.kind == "throw") {
                            self.daily.totalRecode = data.res.totalSizeRecord;
                            self.daily.totalPages = data.res.totalPages;
                            self.daily.curPage = data.res.currentPage * 1;
                            self.formData.tb_daily = [];
                            var i = 1
                            for (const item of data.res.recordsByPage) {
                                self.formData.tb_daily.push({
                                    id: i++,
                                    name: item.Name,
                                    type: item.InputTypeName,
                                    pond: item.Pond_Name,
                                    money: item.Value,
                                    pic: item.ImageUrl,
                                    date: item.ActiveTime
                                })
                            }
                        } else {
                            self.polling.totalRecode = data.res.totalSizeRecord;
                            self.polling.totalPages = data.res.totalPages;
                            self.polling.curPage = data.res.currentPage * 1;
                            self.formData.tb_polling = [];
                            var i = 1
                            for (const item of data.res.recordsByPage) {
                                self.formData.tb_polling.push({
                                    id: i++,
                                    pond: item.Pond_Name,
                                    content: item.ContentType + ":" + item.ContentStatus,
                                    inputData: item.Name + item.Value || "",
                                    pic: item.ImageUrl,
                                    date: item.ActiveTime
                                })
                            }
                        }
                    }  else if (data.loginStatus == 0) {
                      window.location.href = location.origin + '#login';
                      return;
                    } else if (data.resCode == 0) {
                        self.$message.error("获取日志失败")
                    }
                })
            },
            curChange(val) {
                const self = this;
                self.getTableDate()
            },
            //表格中查看图片
            checkImg(index, row) {
                const self = this;
                if(row.pic.length>2){
                    // window.open("/IntelligentAgriculture/patrolManage/loadImages?names="+row.pic)
                    // self.$.post("/IntelligentAgriculture/breedingLog/loadImages",{names:row.pic},function(data){
                    //     data = JSON.parse(data);
                    //     // window.open(data)
                    //     if(data.resCode == 1){
                    //         if(data.res.length == 0){
                    //             self.$message.info("暂无图片")
                    //         }else{
                    //             window.open(data)
                    //         }
                    //     }else if(data.resCode == 0){
                    //         self.$message.error("获取图片失败")
                    //     }
                    // })
                    window.open("/IntelligentAgriculture/breedingLog/loadImages?names="+row.pic)
                }else{
                    self.$message.info("暂无图片")
                }

            },

            //导出表格内容
            exportTable(formName) {
                const self = this;
                var start = new Date(self.form_export.startTime);
                var end = new Date(self.form_export.endTime);
                if (start.getTime() > end.getTime()) {
                    self.$message.error("结束时间不能早于开始时间")
                } else {
                    var form = self.$('<form id="excel"></form>');
                    self.$('body').append(form);
                    var input1 = self.$("<input type='text' name='startTime'></input>");
                    var input2 = self.$("<input type='text' name='endTime'></input>");
                    var input3 = self.$("<input type='text' name='content_selected'></input>");
                    input1.attr('value', start.format("yyyy-MM-dd hh:mm:ss"))
                    input2.attr('value', end.format("yyyy-MM-dd hh:mm:ss"))
                    input3.attr('value', self.form_export.exportType)
                    form.append(input1, input2, input3)
                    form.attr('action', "IntelligentAgriculture/breedingLog/export");
                    // form.attr('action', "IntelligentAgriculture/system/export");
                    form.attr("method", "POST");
                    form.attr('enctype', "multipart/form-data")
                    form.submit();
                    self.$("#excel").remove()
                    self.resetForm(formName);
                    self.exportDialogShow = false;
                }
            }
        },
        mounted() {
            var self = this;
            self.getPonds();
            self.getDailyInputType();
            self.getPollingType();
            self.getInputDataType();
            self.getTableDate()
        }
    }
</script>

<style scoped>
    .el-input {
        width: 300px;
        margin-right: 10px;
    }

    .actTheme {
        position: relative;
    }

    .btn_group {
        position: absolute;
        bottom: 0;
    }

    .theme_title {
        width: 90px !important;
        font-size: 16px;
        font-weight: 600;
        color: #333;
    }

    .boundary {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1px;
        height: 100%;
        background-color: #9b9b9b;
    }

    .myDaily {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0px;
        font-size: 16px;
        font-weight: 600;
    }

    .pagina {
        text-align: center;
        padding-top: 20px;
    }
</style>
