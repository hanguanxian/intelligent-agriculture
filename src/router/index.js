import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'index',
    component: resolve => require(['@/components/Index.vue'], resolve)
  }, {
    path: '/login',
    component: resolve => require(['@/components/Login.vue'], resolve)
  }, {
    path: '/monitor',
    component: resolve => require(['@/components/Monitor.vue'], resolve)
  },{
    path: '/breedingLog',
    component: resolve => require(['@/components/breedingLog.vue'], resolve)
  },{
    path: '/profit',
    component: resolve => require(['@/components/Profit.vue'], resolve)
  },{
    path: '/information',
    component: resolve => require(['@/components/Information.vue'], resolve)
  }]
})
