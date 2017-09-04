<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script>
/*-----------------------------日期格式化-------------------------------*/
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export default {
  name: 'app',
  created() {
    this.connectMsgServer();
  },
  methods: {
    connectMsgServer() {
			const self = this;
      let userName = localStorage.getItem("msuserName");
      if (!userName) {
        return;
      } else {
        //连接服务器
        let socket = io.connect('https://210.28.188.98:3100?userName=' + userName);
        socket.on('connect', function() {
          console.log("用户已连接消息服务器 ！");
          socket.emit('login', {
            userName: userName
          });
        });
				// let data = {
				// 	owner: "ddd",
				// 	toUser: "zhangsir",
				// 	owner: "fgsf",
				// 	roomid: 23
				// };
        //监听事件
        //放在专家系统页面中 socket.on('expertStatus',)
        socket.on('replyInviteVideo', function(data) {
          if (data.toUser == userName) {
						self.$confirm("用户" + data.owner + "发起视频邀请").then(_ => {
            	console.log("用户" + userName + "接受了" + data.owner + "视频邀请");
							self.$router.push({ path: '/main/vedio', query: { userName: data.toUser, friendName: data.owner, roomId: data.roomid}});
          	}).catch(_ => {
							console.log("用户" + userName + "拒绝了" + data.owner + "视频邀请");
						});
          }
        });
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

html,
body,
div,
p,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
}

a {
  text-decoration: none;
  color: #000;
}

a:hover {
  color: #098994;
}


/* 轮播图导航位置 */

.el-carousel__indicators {
  bottom: 80px;
}

.fullWidth {
  width: 100%;
}
</style>
