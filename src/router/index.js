import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')


const user = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/user.vue')
const rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/rights.vue')
const roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/roles.vue')

const cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/cate.vue')
const params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/params.vue')

const list = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/list.vue')
const add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/add.vue')

const report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const vueRouter = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: welcome
        },
        {
          path: '/users',
          component: user
        },
        {
          path: '/rights',
          component: rights
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/categories',
          component: cate
        },
        {
          path: '/params',
          component: params
        },
        {
          path: '/goods',
          component: list
        },
        {
          path: '/goods/add',
          component: add
        },
        {
          path: '/reports',
          component: report
        }
      ]
    },
  ]
})

// 挂载路由守卫 beforeach
vueRouter.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    return next();
  } else {
    const myToken = window.sessionStorage.getItem('token')
    if (myToken == null) return next('/login')
  }
  next();
})

export default vueRouter;
