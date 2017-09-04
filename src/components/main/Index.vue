<template>
	<div class="index">
		<el-row>
			<el-col :span="24" style="position:relative">
				<el-carousel trigger="click" height="380px">
					<el-carousel-item >
						<img style="width: 100%;" src="../../../static/images/banner1.jpg"/>
					</el-carousel-item>
					<el-carousel-item >
						<img style="width: 100%;" src="../../../static/images/banner2.jpg"/>
					</el-carousel-item>
					<el-carousel-item >
						<img style="width: 100%;" src="../../../static/images/banner3.jpg"/>
					</el-carousel-item>
				</el-carousel>
				<div class="bus_and_tec">
					<div class="out_tria">
						<div class="in_tria">
							<span>业务<i>与</i>技术</span>
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20" style="background-color:#f2f7fd;margin:0">
			<el-col :span="6" v-for="(item,index) in title" :key="index">
				<div class="grid-content">
					<div class="content_icon"></div>
					<h2 class="content_title">{{item}}</h2>
					<p class="content_detail">
						9月、10月以来，加州鲈头箍鱼开始陆续出鱼，养殖户喜迎丰收。然而，出鱼过程会出现应激死鱼；出鱼之后又会出现受伤感染死鱼，造成养殖户较大损失。
					</p>
				</div>
			</el-col>
		</el-row>
		<el-row class="news">
			<el-col :span="10">
				<div class="news_title">
					<h3>资讯信息/news</h3>
					<span class="more">更多 <i class="el-icon-arrow-right"></i></span>
				</div>
				<ul class="news_list">
					<li class="news_item" v-for="n in 6" :key="n">
						<span class="news_item_title">新疆北园市场:一周市场分析</span>
						<span class="news_item_time">2017-08-16</span>
					</li>

				</ul>

			</el-col>
			<el-col :span="14">
				<div class="pic_news">
					<h3 style="opacity:0">图片新闻</h3>
					<span class="more">更多 <i class="el-icon-arrow-right"></i></span>
				</div>
				<div class="pic_news_list">
					<el-row :gutter="20">
						<el-col :span="12" v-for="n in 2" :key='n'>
							<div class="pic_news_item">
								<img src="../../assets/index/2.gif" alt="">
								<p>5月6日小龙虾批发价格(北京农贸大市场)</p>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>

	</div>
</template>

<script>
	export default {
		name: 'index',
		data() {
			return {
				activeIndex: '1',
				title:["水产产品","水产技术","水产专家","水产数据"]
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.settings_menu i {
		margin-right: 5px;
	}

	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}

	.el-carousel__item:nth-child(2n+1) {
		background-color: #d3dce6;
	}

	.bus_and_tec{
		position:absolute;
		bottom:0px;
		left:50%;
		transform: translateX(-50%);
		z-index:20;
	}

	.bus_and_tec .out_tria{
		position:relative;
		bottom:0px;
		width: 0;
		height: 0;
		border-right: 80px solid transparent;
		border-bottom: 	60px solid #76ade6;
		border-left: 80px solid transparent;
	}
	.bus_and_tec .in_tria{
		position: absolute;
		top: 16px;
		left: -42px;
		display:flex;
		justify-content:center;
		align-items:center;
		transform: rotate(45deg);
		width:84px;
		height:84px;
		background-color:#192086;
		text-align:center;
	}
	.bus_and_tec .in_tria span{
		display:block;
		transform: rotate(-45deg);
		color:#fff;
		font-size:14px;
	}
	.bus_and_tec .in_tria span i{
		font-style:normal;
		font-size:12px;
	}

	.grid-content{
		display:flex;
		flex-direction: column;
		justify-content: space-around;
		padding:20px 10px;
		min-height: 400px;
		text-align:center;
	}
	.grid-content .content_icon{
		width:100%;
		min-height:200px;
		background:url("../../assets/index/1.gif") no-repeat center center / 200px 200px;
	}
	.grid-content .content_title{
		margin:20px 0px;
	}
	.grid-content .content_detail{
		padding:0 20px;
		font-size:12px;
		line-height: 22px;
	}
	.news{
		min-height:300px;
	}
	.news_title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:20px 30px;
	}
	.more{
		font-size:14px;
	}
	.more i{
		font-size:12px;
	}

	.news_list{
		padding: 0 30px;
	}

	.news_item{
		display: flex;
		justify-content: space-between;
	}
	.news_item .news_item_title{
		text-overflow: ellipsis;
	}

	.pic_news{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:20px 30px;
	}
	.pic_news_list{
		padding:10px 30px;
	}
	.pic_news_item img{
		width:100%;
		max-height:140px;
	}
	.pic_news_item p{
		font-size:12px;
		text-align: center;
	}



</style>
