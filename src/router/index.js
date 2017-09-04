import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/components/Index'

Vue.use(Router)


export default new Router({
  routes: [{
      path: "/main",
      component: resolve => require(['@/components/main/main.vue'], resolve),
      children: [{
          path: "",
          redirect: "index"
        },
        {
          path: "index",
          component: resolve => require(['@/components/main/Index.vue'], resolve),
        },
        {
          path: "monitor",
          component: resolve => require(['@/components/main/Monitor.vue'], resolve),
        },
        {
          path: "profit",
          component: resolve => require(['@/components/main/Profit.vue'], resolve),
        },
        {
          path: "breedingLog",
          component: resolve => require(['@/components/main/breedingLog.vue'], resolve),
        },
        {
          path: "expert",
          component: resolve => require(['@/components/main/Expert.vue'], resolve),
        },
        {
          path: "vedio",
          component: resolve => require(['@/components/main/OnlineVedio.vue'], resolve),
        },
        {
          path: "knowledge",
          component: resolve => require(['@/components/main/Knowledge.vue'], resolve),
        }
      ]
    },
    {
      path: "/login",
      component: resolve => require(['@/components/Login.vue'], resolve),
    },
    {
      path: "/information",
      component: resolve => require(['@/components/Information.vue'], resolve),
    },
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/",
      redirect: "/main"
    }

  ]
})
// export default new Router({
//   routes: [{
//     path: '/index',
//     component: resolve => require(['@/components/Index.vue'], resolve)
//   }, {
//     path: '/login',
//     component: resolve => require(['@/components/Login.vue'], resolve)
//   }, {
//     path: '/monitor',
//     component: resolve => require(['@/components/Monitor.vue'], resolve)
//   },{
//     path: '/breedingLog',
//     component: resolve => require(['@/components/breedingLog.vue'], resolve)
//   },{
//     path: '/profit',
//     component: resolve => require(['@/components/Profit.vue'], resolve)
//   },{
//     path:'/knowledge',
//     component: resolve => require(['@/components/Knowledge.vue'], resolve),
// children:[
//   {
//     path: '',
//     redirect:'product'
//   },
//   {
//     path:"product",
//     component: resolve => require(['@/components/knowledge/product.vue'], resolve)
//   },
//   {
//     path:"feed",
//     component: resolve => require(['@/components/knowledge/feed.vue'], resolve)
//   },
//   {
//     path:"drug",
//     component: resolve => require(['@/components/knowledge/drug.vue'], resolve)
//   },
//   {
//     path:"seed",
//     component: resolve => require(['@/components/knowledge/seed.vue'], resolve)
//   },
// ]
//   },{
//     path: '/information',
//     component: resolve => require(['@/components/Information.vue'], resolve)
//   },{
//     path:"*",
//     redirect:"/"
//   }
//   ]
// })
