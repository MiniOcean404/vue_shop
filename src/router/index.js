import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/user/user.vue'

Vue.use(VueRouter)

const vueRouter = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: login },
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