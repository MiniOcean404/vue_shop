import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'

Vue.use(VueRouter)

const vueRouter = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: login },
        { path: '/home', component: home }
    ]
})

// 挂载路由守卫
vueRouter.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        return next();
    } else {
        const myToken = window.sessionStorage.getItem('token')
        console.log(myToken);
        if (myToken == null) return next('/login')
    }
    next();
})

export default vueRouter;