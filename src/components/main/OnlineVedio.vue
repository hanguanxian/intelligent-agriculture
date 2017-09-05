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
            <span id="show-file" @click="showFile"><img src="../../../static/images/vedio/tools_showfile.png" ></span>
            <span id="pre-page" @click="prePage"><img src="../../../static/images/vedio/tools_pre_page.png" ></span>
            <span id="next-page" @click="nextPage"><img src="../../../static/images/vedio/tools_next_page.png" ></span>
            <span id="zoom-out" @click="zoomOut"><img src="../../../static/images/vedio/tools_zoomout.png" ></span>
            <span id="zoom-in" @click="zoomIn"><img src="../../../static/images/vedio/tools_zoom_in.png" ></span>
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
        <input v-model="chat" id="input-text-chat" placeholder="请输入内容" v-on:keyup.enter="sendMsg" />
        <!-- <input type="text" id="input-text-chat" style="height:40px;width:90%;border:1px solid #39c;font-size:20px;color:deeppink;background:rgba(0,0,0,0.1);margin-top:10px;border-radius: 10px;" placeholder="Enter Text Chat" disabled> -->
        <div class="chat-output" style="line-height: 24px;font-size:20px;color:#000;background:#39c;">
          <div v-for="(oneChat, index) in allChat" :key="index" class="chatList">{{ oneChat }}</div>
        </div>
      </div>

    </div>
  </el-row>
</div>
</template>

<script>
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
      allChat: [],
      traceStr: "",
      copyContext: "",
      drawContext: "",
      pdfContext: "",
      pdfCanvas: "",
      copyCanvas: "",
      drawCanvas: "",
      canvasWidth: 840,
      canvasHeight: 600,
      traceArray: [], //数组代表当前页执行的所有操作，每个元素代表执行的每一步操作
      tolArray: [], //数组代表所有页执行的所有操作，每个元素代表第n页执行的所欲操作，每个元素由traceArray组成
      indexArray: [], //数组代表当前页执行的步数，每个元素代表当前页执行的第几步
      index: 0,
      color: "#000",
      canDraw: false,
      currentFileType: "",
      pageRendering: false,
      pdfDoc: null,
      pageNumPending: null,
      fileOnCanvasUrl: "",
      canvasDefaultWidth: 840,
      canvasDefaultHeight: 600,
      scale: 1,
      preScale: 1,
      scaleGap:0.1,
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
    prePage(){
      const self = this;
      if (self.pageNum <= 1) {
          return;
      }
      self.pageNum--;
      self.jumpPageInitial();
      self.queueRenderPage(self.pageNum);
    },
    nextPage(){
     const self = this;
     if(self.currentFileType == 'PDF'){
       if (self.pageNum >= self.pdfDoc.numPages ) {
           return;
       }
       self.pageNum++;
       self.jumpPageInitial();
       self.queueRenderPage(self.pageNum);
         self.connection.send({
             isMessage: true,
             fileOperate: 'NextPage'
         });
     }
    },
    zoomOut(){
      const self = this;
      if(self.currentFileType === 'PDF'){
          self.scale = self.scale + self.scaleGap;
          self.queueRenderPage(self.pageNum);
          //drawCurrentTrace();
      }else if(self.currentFileType === 'IMAGE'){
          console.log("image zoom out");
        self.scale = self.scale + self.scaleGap;
          self.showImage(self.fileOnCanvasUrl);
          //drawCurrentTrace();由于要等待图片在pdfcanvas绘图好后才能在copyCanvas上画图，否则先在copyCanvas上的绘图会被图片覆盖
          setTimeout(self.drawCurrentTrace,100);
      }
      self.connection.send({
          isMessage: true,
          fileOperate: 'ZoomOut'
      });
    },
    zoomIn(){
      const self = this;
      if (self.scale <= 0.1) {
          return;
      }
      if(self.currentFileType === 'PDF'){
          self.scale = self.scale - self.scaleGap;
          self.queueRenderPage(self.pageNum);
          //drawCurrentTrace();
      }else if(self.currentFileType === 'IMAGE'){
        self.scale = self.scale - self.scaleGap;
          self.showImage(self.fileOnCanvasUrl);
          //drawCurrentTrace();由于要等待图片在pdfcanvas绘图好后才能在copyCanvas上画图，否则先在copyCanvas上的绘图会被图片覆盖
          setTimeout(self.drawCurrentTrace,100);
      }
      self.connection.send({
          isMessage: true,
          fileOperate: 'ZoomIn'
      });
    },
    showImage(url) {
      const self = this;
        var image = new Image();
        image.src = url;
        image.onload = function () {
            //默认情况下，图片小于canvas大小
            self.pdfCanvas.height = self.canvasDefaultHeight;
            self.pdfCanvas.width = self.canvasDefaultHeight;
            if(image.height*self.scale >= self.canvasDefaultHeight)
            {
                self.pdfCanvas.height = image.height*self.scale;
                self.copyCanvas.height = image.height*self.scale;
                self.drawCanvas.height = image.height*self.scale;
                self.canvasHeight = image.height*self.scale;
            }
            if(image.width*self.scale >= self.canvasDefaultHeight)
            {
                self.pdfCanvas.width = image.width*self.scale;
                self.copyCanvas.width = image.width*self.scale;
                self.drawCanvas.width = image.width*self.scale;
                self.canvasWidth = image.width*self.scale;
            }
            self.pdfContext.clearRect(0,0,pdfCanvas.width,pdfCanvas.height);
            self.drawContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
            self.copyContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
            self.pdfContext.drawImage(image,0,0,image.width,image.height,0,0,image.width*self.scale,image.height*self.scale);
        }
    },
    queueRenderPage(num){
      const self = this;
      if (self.pageRendering) {
          self.pageNumPending = num;
      } else {
          self.renderPage(num);
      }
    },
    showPDF(url) {
      const self = this;
        PDFJS.getDocument(url).then(function (pdfDoc_) {
            self.pdfDoc = pdfDoc_;
            self.renderPage(self.pageNum);
        });
    },
    renderPage(num){
      const self = this;
      self.pageRendering = true;
      // Using promise to fetch the page
      self.pdfDoc.getPage(num).then(function (page) {
          var viewport = page.getViewport(self.scale);
          self.pdfCanvas.height = viewport.height;
          self.pdfCanvas.width = viewport.width;
          self.copyCanvas.height = viewport.height;
          self.copyCanvas.width =  viewport.width;
          self.drawCanvas.height = viewport.height;
          self.drawCanvas.width =  viewport.width;
          self.canvasWidth = viewport.width;
          self.canvasHeight = viewport.height;
          var renderContext = {
              canvasContext: pdfContext,
              viewport: viewport
          };
          var renderTask = page.render(renderContext);

          renderTask.promise.then(function () {
              pageRendering = false;
              if (self.pageNumPending !== null) {
                  // New page rendering is pending
                  self.renderPage(self.pageNumPending);
                  self.pageNumPending = null;
              }
              //对于上一页已经有划线的情况
              self.drawContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
              self.copyContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
              for (var i = 0; i < index; i++) {
                  eval(self.traceArray[i]);
              }
          });
      });
    },
    showFile() {
      const self = this;
        var selectFile = new FileSelector();
        selectFile.selectSingleFile(function (file) {
            if (file.type === 'application/pdf') {
                self.copyContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
                self.scale = 1;
                self.currentFileType = 'PDF';
                self.connection.send(file);
            } else {
                var re = /^(image)\//;
                if (re.test(file.type)) {
                    self.copyContext.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
                    self.scale = 1;
                    self.currentFileType = 'IMAGE';
                    self.connection.send(file);
                } else {
                    alert('请选择pdf格式文件或图片,其他格式暂不支持');
                }
            }
        });
    },
    sendMsg() {
      const self = this;
      self.chat = self.chat.replace(/^\s+|\s+$/g, '');
      if (!self.chat.length) return;
      self.connection.send({
        isMessage: true,
        chat: true,
        data: self.chat
      });
      self.allChat.push(self.chat);
      self.chat = '';
    },
    startVideo() {
      const self = this;
      //disableInputButtons();
      var roomInfo = {
        owner: self.owner,
        roomid: self.predefinedRoomId,
        toUser: self.$route.query.friendName
      };
      console.log(roomInfo);
      self.connection.open(self.predefinedRoomId, function() {
        self.socket.emit('inviteVideo', roomInfo);
      });
    },
    closeVideo() {
      const self = this;
      self.connection.isInitiator = true;
      if (self.connection.isInitiator) {
        self.connection.closeEntireSession(function() {
          //document.querySelector('h1').innerHTML = 'Entire session has been closed.';
        });
      } else {
        self.connection.leave();
      }
    },
    saveTrace() {
      const self = this;
      self.traceArray[self.index] = self.traceStr; //traceStr代表每一次划线动作，traceArray代表当前页做的所有动作语句
      self.index++;
      self.indexArray[self.pageNum - 1] = self.index; //indexArray代表第self.pageNum 页画了多少步。除了pdf文件，该数组仅一个元素代表当前页执行了多少步，等同于index
      self.tolArray[self.pageNum - 1] = self.traceArray; //tolArray代表第pageNum页上所有画图动作语句。除了pdf文件，该数组仅一个元素代表当前页执行的所有动作，等同于traceArray
    },
    jumpPageInitial() {
      const self = this;
      if (self.currentFileType === 'PDF') {
        //canDraw = true;
        //pdf文件翻转到下一页的分情况处理，到下一页是index初始化为0
        if (!self.indexArray[self.pageNum - 1]) {
          self.index = 0;
          self.traceArray = [];
        } else {
          self.index = self.indexArray[self.pageNum - 1];
          self.traceArray = self.tolArray[self.pageNum - 1];
          if (self.index != traceArray.length) {
            for (var j = self.index; j < traceArray.length; j++)
              self.traceArray[j] = "";
          }
        }
      }
    },
    clearContext(type, obj) {
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

      self.$("#viewFront").css("z-index", "8");
      var startX;
      var startY;
      self.traceStr = "";
      chooseImg(graphType);
      var mousedown = function(e) {
        self.preScale = self.scale;
        self.drawContext.strokeStyle = self.color;
        self.drawContext.lineWidth = size;
        e = e || window.event;
        self.canDraw = true;
        startX = e.offsetX;
        startY = e.offsetY;
        if (graphType == 'pencil') {
          self.traceStr = "self.copyContext.beginPath();";
          self.traceStr += "self.copyContext.moveTo(" + startX / self.preScale + "*self.scale" + "," + startY / self.preScale + "*self.scale" + ");";

          self.drawContext.beginPath();
          self.drawContext.moveTo(startX / self.preScale + "*self.scale", startY / self.preScale + "*self.scale");
        } else if (graphType == 'line') {
          self.copyContext.strokeStyle = self.color;
          self.copyContext.lineWidth = size;
        } else if (graphType == 'rubber') {
          self.copyContext.clearRect(startX - size * 10, startY - size * 10, size * 20, size * 20);
          self.traceStr += "self.copyContext.clearRect(" + startX / self.preScale + "*self.scale" + "-" + size + "*10," + startY + "-" + size + "*10," + size + "*20," + size + "*20);";
        }
      }

      var mousemove = function(e) {
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
            self.traceStr =
              "self.clearContext();" +
              "self.copyContext.beginPath();" +
              "self.copyContext.moveTo(" + startX / self.preScale + "*self.scale" + "," + startY / self.preScale + "*self.scale" + ");" +
              "self.copyContext.lineTo(" + x / self.preScale + "*self.scale" + "," + startY / self.preScale + "*self.scale" + ");" +
              "self.copyContext.lineTo(" + x / self.preScale + "*self.scale" + "," + y / self.preScale + "*self.scale" + ");" +
              "self.copyContext.lineTo(" + startX / self.preScale + "*self.scale" + "," + y / self.preScale + "*self.scale" + ");" +
              "self.copyContext.lineTo(" + startX / self.preScale + "*self.scale" + "," + startY / self.preScale + "*self.scale" + ");" +
              "self.copyContext.stroke();";
          }
        } else if (graphType == 'line') {
          if (self.canDraw) {
            self.clearContext();
            self.drawContext.beginPath();
            self.drawContext.moveTo(startX, startY);
            self.drawContext.lineTo(x, y);
            self.drawContext.stroke();
            self.traceStr =
              "self.clearContext();" +
              "self.copyContext.beginPath();" +
              "self.copyContext.moveTo(" + startX / self.preScale + "*self.scale" + "," + startY / self.preScale + "*self.scale" + ");" +
              "self.copyContext.lineTo(" + x / self.preScale + "*self.scale" + "," + y / self.preScale + "*self.scale" + ");" +
              "self.copyContext.stroke();"
          }
        } else if (graphType == 'pencil') {
          if (self.canDraw) {
            self.clearContext();
            self.drawContext.lineTo(x, y);
            self.drawContext.stroke();
            self.traceStr += "self.copyContext.lineTo(" + x / self.preScale + "*self.scale" + "," + y / self.preScale + "*self.scale" + ");";
            self.traceStr += "self.copyContext.stroke();";
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
            self.traceStr += "self.copyContext.clearRect(" + x / self.preScale + "*self.scale" + "-" + "size * 10," + y + " -" + " size * 10, size * 20, size * 20);";
          }

        }
      };

      var mouseup = function(e) {
        e = e || window.event;
        self.drawContext.lineWidth = 1;
        self.canDraw = false;
        //console.log(self.traceStr);
        eval(self.traceStr);
        self.connection.send({
          isMessage: true,
          toRun: true,
          data: self.traceStr
        });
      }

      var mouseover = function() {
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
        self.$("video").css({
          "width": "100%"
        });
      }
      if (event.type == "remote") {
        remoteVideoContainer.appendChild(event.mediaElement);
        self.$("video").css({
          "width": "100%"
        });
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

      if (event.data.isMessage) { //聊天
        if (event.data.chat) {
          self.allChat.push(event.data.chat);
        } else if (event.data.toRun) { //主要处理白板上的画图工具
          var receivetraceStr = event.data.data;
          eval(receivetraceStr);
          self.traceStr = receivetraceStr;
          self.saveTrace();
        } else if (event.data.clearDraw) {
          self.drawContext.clearRect(0, 0, self.canvasHeight, self.canvasHeight);
          self.copyContext.clearRect(0, 0, self.canvasHeight, self.canvasHeight);
          self.indexArray[self.pageNum - 1] = self.index = 0;
          self.traceArray = [];
          self.tolArray[self.pageNum - 1] = self.traceArray;
        } else if (event.data.fileOperate == 'NextPage') {
          console.log("next page...");
          self.nextPage();
        } else if (event.data.fileOperate == 'PrevPage') {
          console.log("prev page...");
          self.prePage();
        } else if (event.data.fileOperate == 'ZoomOut') {
          if(self.currentFileType === 'PDF'){
              self.scale = self.scale + self.scaleGap;
              self.queueRenderPage(self.pageNum);
              //drawCurrentTrace();
          }else if(self.currentFileType === 'IMAGE'){
              console.log("image zoom out");
            self.scale = self.scale + self.scaleGap;
              self.showImage(self.fileOnCanvasUrl);
              //drawCurrentTrace();由于要等待图片在pdfcanvas绘图好后才能在copyCanvas上画图，否则先在copyCanvas上的绘图会被图片覆盖
              setTimeout(self.drawCurrentTrace,100);
          }
        } else if (event.data.fileOperate == 'ZoomIn') {
          console.log("zoom in");
          if (self.scale <= 0.1) {
              return;
          }
          if(self.currentFileType === 'PDF'){
              self.scale = self.scale - self.scaleGap;
              self.queueRenderPage(self.pageNum);
              //drawCurrentTrace();
          }else if(self.currentFileType === 'IMAGE'){
            self.scale = self.scale - self.scaleGap;
              self.showImage(self.fileOnCanvasUrl);
              //drawCurrentTrace();由于要等待图片在pdfcanvas绘图好后才能在copyCanvas上画图，否则先在copyCanvas上的绘图会被图片覆盖
              setTimeout(self.drawCurrentTrace,100);
          }
        }
      }
    };
    connection.onstreamended = function(event) {
      var mediaElement = document.getElementById(event.streamid);
      if (mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
      }
    };
    connection.onEntireSessionClosed = function(event) {
      connection.attachStreams.forEach(function(stream) {
        stream.stop();
      });
      // don't display alert for moderator
      if (connection.userid === event.userid) return;
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
    socket.on('replyRefuseJoin', function(data) {
      //对方拒绝视频的消息提示
      alert("对方忙，拒绝视频！");
      //关闭本地视频
      self.closeVideo();
    });
    socket.on('replyInviteVideo', function(data) {
      console.log("用户" + data.toUser + "收到邀请！");
      if (data.toUser == self.owner) {
        self.$confirm("用户" + data.owner + "发起视频邀请").then(_ => {
          console.log("用户" + userName + "接受了" + data.owner + "视频邀请");
          self.$router.push({
            path: '/main/vedio',
            query: {
              userName: data.toUser,
              friendName: data.owner,
              roomId: data.roomid
            }
          });
        }).catch(_ => {
          socket.emit('refuseJoin', data);
        });
      }
    });
    self.socket = socket;
  },
  mounted() {
    const self = this;
    self.pdfCanvas = document.getElementById("viewBack");
    self.pdfContext = self.pdfCanvas.getContext("2d");
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
}

#info {
  width: 840px;
  margin: auto;
  margin-top: 20px;
}

#info #media {
  width: 100%;
  height: 240px;
}

#info #media .left {
  float: left;
  width: 15%;
  height: 100%;
}

#info #media .right {
  float: right;
  width: 83%;
  height: 100%;
}

#info #media .right #user {
  float: left;
  width: 60%;
  height: 100%;
  background-color: #9B9B9B;
  box-shadow: 1px 2px 4px 2px #888888;
  border-radius: 5px;
}

#info #media .right #expert {
  float: right;
  width: 35%;
  height: 100%;
  background-color: #9B9B9B;
  box-shadow: 1px 2px 4px 2px #888888;
  border-radius: 5px;
}

#info #white_board {
  width: 100%;
  height: 700px;
  margin-top: 20px;
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
  width: 840px;
  height: 602px;
  box-shadow: 0px 2px 4px #888888;
  margin-top: 15px;
  border-radius: 10px;
}

#info #button {
  width: 100%;
  height: 150px;
  margin-top: 20px;
}

#info #button .allBtn {
  float: left;
  width: 100px;
  height: 40px;
  border: 0;
  background: #9B9B9B;
  border-radius: 10px;
  margin-right: 30px;
}

#info #button .operation {
  width: 100%;
  height: 100%;
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

video {
  object-fit: cover;
  width: 100%;
}

#viewFront {
  z-index: 8;
  position: absolute;
  top: 0px;
}

#viewMiddle {
  z-index: 5;
  position: absolute;
  top: 0px;
}

#viewBack {
  top: 0px;
}

.border_choose {
  background: grey;
}

#canvasContainer {
  width: 840px;
  height: 602px;
  position: absolute;
}

canvas {
  border-radius: 10px;
}

.header {
  width: 100%;
  background-color: #4ba2a2;
  height: 130px;
}

a {
  color: white !important;
}

#logo {
  margin-left: 5%;
  width: 80%;
  position: absolute;
}

.videoWrapeer {
  min-height: 296px;
  background-size: 100%;
  color: #fff;
  text-align: center;
  font-size: 20px;
  background-color: #9B9B9B;
}

.videoWrapeer video {
  width: 100%;
}

#input-text-chat {
  width: 70%;
  margin: 20px auto;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  display: inline-block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: none;
  padding: 3px 10px;
}

.chatList {
  margin: 10px;
}
</style>
