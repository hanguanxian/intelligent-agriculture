<template>
<div class="container">
  <el-row style="margin: 20px auto; width: 1000px;">
    <el-col :span="3"><img :src="'http://210.28.188.103:8080/IntelligentAgriculture/res/'+ userInfo.headImg" style="width: 100%;"></el-col>
    <el-col :span="20">
      <el-col :span="10" class="userInfo">{{ '姓名:' + userInfo.personName }}</el-col>
      <el-col :span="14" class="userInfo">{{ '邮件:' + userInfo.email }}</el-col>
      <el-col :span="10" class="userInfo">{{ '单位:' + userInfo.enterpriseName }}</el-col>
      <el-col :span="14" class="userInfo">{{ '技术特长:' + userInfo.category }}</el-col>
      <el-col :span="10" class="userInfo">{{ '职位:' + userInfo.professional }}</el-col>
    </el-col>
    <el-row>
      <el-col :span="22">
        <div style="margin: 10px 0;">简介：</div>
        <div>&nbsp;&nbsp;{{ userInfo.description }}</div>
      </el-col>
    </el-row>
  </el-row>

  <el-row>
    <div style="margin: 15px auto; width: 840px;">
      <el-col :span="11" id="remote-user" class="videoWrapeer" style="background-image:url('../../../static/images/vedio/vedio1.png')"></el-col>
      <el-col :span="11" :offset="2" id="local-user" class="videoWrapeer" style="background-image:url('../../../static/images/vedio/vedio2.png')"></el-col>
    </div>
  </el-row>
  <el-row>
    <div id="file-container" style="text-align: center;"></div>
    <div id="main">
      <div style=" float: left;">
        <div id="edittools" @click="toolBarVisible = !toolBarVisible" style="
    width: 60px;
    border-radius: 15px 0 0 15px;
    background-color: #4A4A4A;
    height: 60px;
    box-shadow: 0px 2px 4px #888888;
    margin-left: 32px;
">
          <img src="../../../static/images/vedio/edittools.png" style="width: 24px;height: 24px;margin: 8px 3px 8px 18px;" />
          <p style="color: #cdcdcd;margin-left: 10px;font-size: 13px;">工具栏 </p>
        </div>

        <div class="guide" id="start-guide" @click="startVideo" style="width: 60px;border-radius: 15px 0 0 15px;background-color: #4A4A4A;height: 60px;box-shadow: 0px 2px 4px #888888;margin-left: 32px;margin-top: 3px;">
          <img src="../../../static/images/vedio/video.png" style="margin: 2px 0px 2px 18px;" />
          <p style="color: #cdcdcd;margin-left: 10px;font-size: 12px;">开启视频</p>
        </div>
        <div id="end-guide" @click="closeVideo" style="
    width: 60px;
    border-radius: 15px 0 0 15px;
    background-color: #4A4A4A;
    height: 60px;
    box-shadow: 0px 2px 4px #888888;
    margin-left: 32px;
    margin-top: 3px;">
          <img src="../../../static/images/vedio/close.png" style="margin: 2px 0px 2px 18px;" />
          <p style="color: #cdcdcd;margin-left: 10px;font-size: 12px;">结束指导</p>
        </div>
      </div>
      <div id="info">
        <div id="white_board">
          <div id="menu" class="drawController" v-show="toolBarVisible" style="display: block;border-radius: 0 10px 10px 0;">
            <span @click="draw_graph('pencil')" id="pencil"><img src="../../../static/images/vedio/tools_pencil.png"></span>
            <span @click="draw_graph('square')" id="square" class="marginTop"><img src="../../../static/images/vedio/tools_rectangle.png"  ></span>
            <span @click="draw_graph('line');" id="line" class="marginTop"><img src="../../../static/images/vedio/tools_line.png"  ></span>
            <span @click="draw_graph('rubber')" id="rubber" class="marginTop"><img src="../../../static/images/vedio/tools_ruber.png" /></span>
            <span @click="clearContext('1')" id=""><img src="../../../static/images/vedio/tools_lajitong.png"  ></span>
            <span id="show-file"><img src="../../../static/images/vedio/tools_showfile.png" ></span>
            <span id="pre-page"><img src="../../../static/images/vedio/tools_pre_page.png" ></span>
            <span id="next-page"><img src="../../../static/images/vedio/tools_next_page.png" ></span>
            <span id="zoom-out"><img src="../../../static/images/vedio/tools_zoomout.png" ></span>
            <span id="zoom-in"><img src="../../../static/images/vedio/tools_zoom_in.png" ></span>
          </div>
          <div id="board" style="border-radius: 0 10px 10px 10px;margin-top: 0px;border-top: 1px solid rgba(0,0,0,0.05);">
            <div id="canvasContainer" width="840" height="600" style="overflow:auto;background: #FFFFFF">
              <canvas id="viewFront" width="840" height="600" style="z-index:8;"></canvas>
              <canvas id="viewMiddle" width="840" height="600" style="z-index: 5;"></canvas>
              <canvas id="viewBack" width="840" height="600" style="z-index: 3;"></canvas>
            </div>
          </div>
        </div>


      </div>


      <div id="chat-div" style="border:1px solid #333;border-radius: 10px;margin:10px;text-align: center;background: #9B9B9B;">
        <el-input v-model="chat" style="width: 90%; margin: 10px auto;" placeholder="请输入内容"></el-input>
        <!-- <input type="text" id="input-text-chat" style="height:40px;width:90%;border:1px solid #39c;font-size:20px;color:deeppink;background:rgba(0,0,0,0.1);margin-top:10px;border-radius: 10px;" placeholder="Enter Text Chat" disabled> -->
        <div class="chat-output" style="line-height: 24px;font-size:20px;color:#000;background:#39c;">
        </div>
      </div>

    </div>
  </el-row>
</div>
</template>

<script>
//require("../../../static/socket/draw.js");
export default {
  data() {
    return {
      toolBarVisible: true,
      userInfo: {},
      connection: {},
      socket: {},
      predefinedRoomId: "",
      owner: "",
      chat: "",
      traceStr: "",
      copyContext: "",
      drawContext: "",
      pdfContext: "",
      pdfCanvas: "",
      copyCanvas: "",
      drawCanvas: "",
      canvasWidth: 840,
      canvasHeight: 600,
      traceArray: [],//数组代表当前页执行的所有操作，每个元素代表执行的每一步操作
      tolArray: [],//数组代表所有页执行的所有操作，每个元素代表第n页执行的所欲操作，每个元素由traceArray组成
      indexArray: [],//数组代表当前页执行的步数，每个元素代表当前页执行的第几步
      index: 0,
      canDraw:false,
      pageNum: 1
    }
  },
  methods: {
    getUserInfo() {
      const self = this;
      let userName = self.$route.query.friendName;
      self.$.post("/IntelligentAgriculture/user/userInfo", {
        userName: userName
      }, function(res) {
        let result = JSON.parse(res);
        if (result.resCode == 1) {
          self.userInfo = result.res;
        } else if (result.loginStatus == 0) {
          window.location.href = location.origin + '#login';
          return;
        } else {
          self.$message.error(result.msg);
        }
      })
    },
    startVideo(){
      const self = this;
        //disableInputButtons();
        var roomInfo = {
            owner: self.owner,
            roomid: self.predefinedRoomId,
            toUser: self.$route.query.friendName
        };
        self.connection.open(self.predefinedRoomId, function() {
            self.socket.emit('inviteVideo',roomInfo);
        });
    },
    closeVideo(){
      const self = this;
        self.connection.isInitiator=true;
        if(self.connection.isInitiator) {
            self.connection.closeEntireSession(function() {
                //document.querySelector('h1').innerHTML = 'Entire session has been closed.';
            });
        } else {
            self.connection.leave();
        }
    },


     saveTrace(){
       const self = this;
        self.traceArray[self.index] = self.traceStr;//traceStr代表每一次划线动作，traceArray代表当前页做的所有动作语句
        self.index++;
        self.indexArray[self.pageNum - 1] = self.index;//indexArray代表第self.pageNum 页画了多少步。除了pdf文件，该数组仅一个元素代表当前页执行了多少步，等同于index
        self.tolArray[self.pageNum - 1] = self.traceArray;//tolArray代表第pageNum页上所有画图动作语句。除了pdf文件，该数组仅一个元素代表当前页执行的所有动作，等同于traceArray
    },
    jumpPageInitial(){
      const self = this;
        if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF')
        {
            //canDraw = true;
            //pdf文件翻转到下一页的分情况处理，到下一页是index初始化为0
            if (!self.indexArray[self.pageNum - 1] )
            {   self.index = 0;
                self.traceArray = [];
            } else
            {
                self.index = self.indexArray[self.pageNum - 1];
                self.traceArray = self.tolArray[self.pageNum - 1];
                if (self.index != traceArray.length) {
                    for (var j = self.index; j < traceArray.length; j++)
                        self.traceArray[j] = "";
                }
            }
        }
    },
    clearContext (type, obj) {
      const self = this;
        if (!type) {
            self.drawContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
        } else {
            self.drawContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
            self.copyContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
            self.connection.send({
                isMessage: true,
                clearDraw: true
            });
            self.traceStr = "";
            self.indexArray[self.pageNum - 1] = self.index = 0;
            self.traceArray = [];
            self.tolArray[self.pageNum - 1] = self.traceArray;
            self.$(obj).siblings('span').removeClass("border_choose");
        }
    },
    draw_graph(graphType) {
      const self = this;
      var size = 1;
      var color = "#FF0000";

        self.$("#viewFront").css("z-index", "8");

        var startX;
        var startY;
        self.traceStr = "";
        chooseImg(graphType);
        var mousedown = function (e) {
            preScale = scale;
            self.drawContext.strokeStyle = color;
            self.drawContext.lineWidth = size;
            e = e || window.event;
            self.canDraw = true;
            startX = e.offsetX;
            startY = e.offsetY;

            if (graphType == 'pencil') {
                // self.traceStr  = "this.copyContext.beginPath();";
                // self.traceStr  += "this.copyContext.moveTo(" + startX/preScale+"*scale"+ "," + startY/preScale+"*scale" + ");";
                self.drawContext.beginPath();
                self.drawContext.moveTo(startX/preScale+"*scale", startY/preScale+"*scale");


            } else if (graphType == 'line') {

                self.copyContext.strokeStyle = color;
                self.copyContext.lineWidth = size;
            } else if (graphType == 'rubber') {
                self.copyContext.clearRect(startX - size * 10, startY - size * 10, size * 20, size * 20);
                self.traceStr  += "this.copyContext.clearRect(" + startX/preScale+"*scale" + "-" + size + "*10," + startY + "-" + size + "*10," + size + "*20," + size + "*20);";
            }
        }

        var mousemove = function (e) {
            var x = e.offsetX;
            var y = e.offsetY;

            if (graphType == 'square') {
                if (self.canDraw) {
                    self.drawContext.beginPath();
                    self.clearContext();
                    self.drawContext.moveTo(startX, startY);

                    self.drawContext.lineTo(x, startY);

                    self.drawContext.lineTo(x, y);
                    self.drawContext.lineTo(startX, y);
                    self.drawContext.lineTo(startX, startY);
                    self.drawContext.stroke();

                    self.traceStr  =
                        "this.clearContext();" +
                        "this.copyContext.beginPath();" +
                        "this.copyContext.moveTo(" + startX/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                        "this.copyContext.lineTo(" + x/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                        "this.copyContext.lineTo(" + x/preScale+"*scale" + "," + y/preScale+"*scale" + ");" +
                        "this.copyContext.lineTo(" + startX/preScale+"*scale" + "," + y/preScale+"*scale" + ");" +
                        "this.copyContext.lineTo(" + startX/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                        "this.copyContext.stroke();";
                }
            } else if (graphType == 'line') {
                if (self.canDraw) {
                    self.clearContext();
                    self.drawContext.beginPath();
                    self.drawContext.moveTo(startX, startY);
                    self.drawContext.lineTo(x, y);
                    self.drawContext.stroke();

                    self.traceStr  =
                        "this.clearContext();" +
                        "this.copyContext.beginPath();" +
                        "this.copyContext.moveTo(" + startX/preScale+"*scale" + "," + startY/preScale+"*scale" + ");" +
                        "this.copyContext.lineTo(" + x/preScale+"*scale" + "," + y/preScale+"*scale" + ");" +
                        "this.copyContext.stroke();"

                }
            } else if (graphType == 'pencil') {
                if (self.canDraw) {
                    //console.log("pencil x,y");
                    //console.log(x+","+y);
                    self.drawContext.lineTo(x, y);
                    self.drawContext.stroke();
                    self.traceStr  += "this.copyContext.lineTo(" + x/preScale+"*scale" + "," + y/preScale+"*scale" + ");";
                    self.traceStr  += "this.copyContext.stroke();";

                }
            } else if (graphType == 'rubber') {
                self.clearContext();
                self.drawContext.lineWidth = 1;
                self.drawContext.beginPath();
                self.drawContext.strokeStyle = "#000000";
                self.drawContext.moveTo(x - size * 10, y - size * 10);
                self.drawContext.lineTo(x + size * 10, y - size * 10);
                self.drawContext.lineTo(x + size * 10, y + size * 10);
                self.drawContext.lineTo(x - size * 10, y + size * 10);
                self.drawContext.lineTo(x - size * 10, y - size * 10);
                self.drawContext.stroke();
                if (self.canDraw) {
                    self.drawContext.clearRect(x - size * 10, y - size * 10, size * 20, size * 20);
                    self.traceStr  += "this.copyContext.clearRect(" + x/preScale+"*scale" + "-" + "size * 10," + y + " -" + " size * 10, size * 20, size * 20);";

                }

            }
        };

        var mouseup = function (e) {
            e = e || window.event;
            self.drawContext.lineWidth = 1;

            self.canDraw = false;

           eval(self.traceStr);

            console.log("sendtest...");
            self.connection.send({
                    isMessage: true,
                    toRun: true,
                    data: traceStr
                });
        };

        var mouseover = function () {
            self.$(self.drawCanvas).css('cursor', 'crosshair');
        }

        //选择功能按钮 修改样式
        function chooseImg(objName) {
            self.$("#" + objName).addClass("border_choose");
            self.$("#" + objName).siblings('span').removeClass("border_choose");

        }

        self.$(self.drawCanvas).unbind();
        self.$(self.drawCanvas).bind('mousedown', mousedown);
        self.$(self.drawCanvas).bind('mousemove', mousemove);
        self.$(self.drawCanvas).bind('mouseup', mouseup);
        self.$(self.drawCanvas).bind('mouseover', mouseover);

    }
  },
  created() {
    const self = this;
    self.owner = localStorage.getItem('msuserName');
    self.predefinedRoomId = self.owner + '1001';
    self.getUserInfo();

    var connection = new RTCMultiConnection();
      connection.socketURL = 'https://210.28.188.98:3100/';
      connection.session = {
          audio: true,
          video: true,
          data: true
      };
      connection.sdpConstraints.mandatory = {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true
      };

      connection.enableFileSharing = true;

      connection.filesContainer = document.getElementById('file-container');
      connection.onstream = function(event) {
          //videoContainer.appendChild(e.mediaElement);
          var localVideoContainer = document.querySelector('#local-user');
          var remoteVideoContainer = document.querySelector('#remote-user');
          if (event.type == "local") {
              localVideoContainer.appendChild(event.mediaElement);
              self.$("video").css({"width":"100%"});
          }
          if (event.type == "remote") {
              remoteVideoContainer.appendChild(event.mediaElement);
              self.$("video").css({"width":"100%"});
          }
          event.mediaElement.id = event.streamid;
      };
      connection.onopen = function() {
          //document.getElementById('share-file').disabled = false;
          document.getElementById('input-text-chat').disabled = false;
        //  document.getElementById('btn-leave-room').disabled = false;
      };
      connection.onclose = function() {
          document.getElementById('input-text-chat').disabled = true;
      };
      // ......................................................
      // ..................white board share.............
      // ......................................................
      connection.onmessage = function(event) {

          if (event.data.isMessage) {  //聊天
              if(event.data.chat){
                  appendDIV(event.data.data);
              }else if(event.data.toRun){            //主要处理白板上的画图工具
                  var receivetraceStr  = event.data.data;
                  eval(receivetraceStr);
                  self.traceStr = receivetraceStr;
                  self.saveTrace();
              }else if(event.data.clearDraw){
                  self.drawContext.clearRect(0, 0, canvasWidth, canvasHeight);
                  self.copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
                  indexArray[self.pageNum - 1] = self.index = 0;
                  traceArray = [];
                  tolArray[self.pageNum - 1] = traceArray;
              }else if(event.data.fileOperate == 'NextPage'){
                  console.log("next page...");
                  NextPage();
              }else if(event.data.fileOperate == 'PrevPage'){
                  console.log("prev page...");
                  PrevPage();
              }else if(event.data.fileOperate == 'ZoomOut'){
                  console.log("zoom out");
                  if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF'){
                      scale = scale + SCALE_GAP;
                      onPDFZoomOut();
                      //drawCurrentTrace();
                  }else if(CURRENT_FILE_TYPE_ON_CANVAS === 'IMAGE'){
                      console.log("image zoom out");
                      scale = scale + SCALE_GAP;
                      onImageZoomOut();
                      setTimeout(drawCurrentTrace,100);
                  }
              }else if(event.data.fileOperate == 'ZoomIn'){
                  console.log("zoom in");
                  if(CURRENT_FILE_TYPE_ON_CANVAS === 'PDF'){
                      scale = scale - SCALE_GAP;
                      onPDFZoomIn();
                      //drawCurrentTrace();
                  }else if(CURRENT_FILE_TYPE_ON_CANVAS === 'IMAGE'){
                      console.log("image zoom in ");
                      scale = scale - SCALE_GAP;
                      onImageZoomIn();
                      setTimeout(drawCurrentTrace,100);
                  }
              }
          }
      };
      connection.onstreamended = function(event) {
          var mediaElement = document.getElementById(event.streamid);
          if(mediaElement) {
              mediaElement.parentNode.removeChild(mediaElement);
          }
      };
      connection.onEntireSessionClosed = function(event) {
          connection.attachStreams.forEach(function(stream) {
              stream.stop();
          });
          // don't display alert for moderator
          if(connection.userid === event.userid) return;
          //document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
      };
      connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
          // seems room is already opened
          connection.join(useridAlreadyTaken);
      };
      self.connection = connection;
      let socket = io.connect('https://210.28.188.98:3100?userName=' + self.owner);
      socket.on('connect', function() {
        console.log("用户已连接消息服务器 ！");
        socket.emit('login', {
          userName: self.owner
        });
      });
      socket.on('replyRefuseJoin',function(data){
        //对方拒绝视频的消息提示
        alert("对方忙，拒绝视频！");
        //关闭本地视频
        self.closeVideo();
      });
      self.socket = socket;


  },
  mounted(){
    const self = this;
    self.pdfCanvas = document.getElementById("viewBack");
    self.pdfContext = self.pdfCanvas.getContext("2d");
    console.log(self.pdfContext);
    console.log(self.pdfCanvas);
    self.copyCanvas = document.getElementById("viewMiddle");
    self.copyContext = self.copyCanvas.getContext("2d");
    self.drawCanvas = document.getElementById("viewFront");
    self.drawContext = self.drawCanvas.getContext("2d");

  }
}
</script>

<style scoped>
.userInfo {
  padding: 20px;
}
#main {
    width: 1024px;
    margin: auto;
    /*background-color: #eeeeee;*/
}

#info {
    width: 840px;
    margin: auto;
    margin-top: 20px;
    /*  	background-color:#eeeeee; */
}

#info #media {
    width: 100%;
    height: 240px;
    /*  	background-color:grey; */
}

#info #media .left {
    float: left;
    width: 15%;
    height: 100%;
    /*   	background-color:grey; */
}

#info #media .right {
    float: right;
    width: 83%;
    height: 100%;
    /*   	background-color:#9B9B9B; */
    /*   	box-shadow: 0px 2px 4px #888888; */
}

#info #media .right #user {
    float: left;
    width: 60%;
    height: 100%;
    background-color: #9B9B9B;
    box-shadow: 1px 2px 4px 2px #888888;
    border-radius: 5px;
    /*background:url('../res/user_videobg.png') no-repeat center center;*/
}

#info #media .right #expert {
    float: right;
    width: 35%;
    height: 100%;
    background-color: #9B9B9B;
    box-shadow: 1px 2px 4px 2px #888888;
    border-radius: 5px;
    /*background:url('../res/self_videobg.png') no-repeat center center;*/
}

#info #white_board {
    width: 100%;
    height: 700px;
    margin-top: 20px;
    /*  	background-color: #4A4A4A; */
    /*  	box-shadow: 0px 2px 4px #888888; */
    /* 	background-color: gray; */
}

#info #white_board #menu {
    width: 100%;
    height: 60px;
    background-color: #4A4A4A;
    box-shadow: 0px 2px 4px #888888;
    text-align: center;
    border-radius: 10px;
}

#info #white_board #menu span {
    width: 64px;
    height: 58px;
    display: inline-block;
}

#info #white_board #menu .marginTop {
    margin-top: -5px;
}

#info #white_board #menu img {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
}

#info #white_board #board {
    /*width: 100%;*/
    /*height: 80%;*/
    width: 840px;
    height: 602px;
    /*background-color: #4A4A4A;*/
    box-shadow: 0px 2px 4px #888888;
    margin-top: 15px;
    border-radius: 10px;
}

#info #button {
    width: 100%;
    height: 150px;
    margin-top: 20px;
    /*  	background-color:grey; */
}

#info #button .allBtn {
    float: left;
    width: 100px;
    height: 40px;
    /*background: url("../img/ready_or_close_btn_background.png") no-repeat center center;*/
    /*background-size: 95% 48px;*/
    border: 0;
    background: #9B9B9B;
    border-radius: 10px;
    margin-right: 30px;
}

#info #button .operation {
    width: 100%;
    height: 100%;
    /*   	vertical-align: middle; */
    text-align: center;
    font-size: 15px;
    margin-top: 10px;
    color: white;
}

#footer {
    width: 100%;
    height: 100px;
    background-color: #d8d8d8;
    padding-top: 30px;
}

#footer div {
    text-align: center;
}

#canvasContainer {
    width: 840px;
    height: 602px;
    position: absolute;
    border-radius: 10px;
}

video{
    object-fit: cover;
    width: 100%;
}

#viewFront{
    z-index:8;position: absolute;top:0px;
}

#viewMiddle{
    z-index:5;position: absolute;top:0px;
}

#viewBack{
    top:0px;
}

.border_choose{
	background: grey;
}

#canvasContainer{
	width:840px;height:602px;position:absolute;
}

canvas{
    border-radius: 10px;
}

.header{
	width:100%;
	background-color:#4ba2a2;
	height: 130px;
}

a {
	color: white !important;
}

#logo{
	margin-left:5%;
	width:80%;
	position:absolute;
}
.videoWrapeer {
  min-height: 296px;
  background-size: 100%;
  color: #fff;
  text-align: center;
  font-size: 20px;
  background-color: #9B9B9B;
}
.videoWrapeer video{ width: 100%; }
</style>
