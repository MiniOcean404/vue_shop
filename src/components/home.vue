<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="exit">退出登录</el-button>
    </el-header>

    
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'200px'">
          <div class="toggle-button"  @click="toggleCollapse">
              |||
          </div>
          <!-- 侧边栏菜单区 -->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#2e94fc" :unique-opened='true' :collapse="isCollapse" :collapse-transition="false"  router :default-active='activeStatus'>  
              <!-- 一级菜单  -->
            <el-submenu :index="item.id.toString()"  v-for="item in menulist" :key="item.id"> 
                      <!-- 一级菜单模板区 -->
                <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconsObj[item.id]"></i>
                    <!-- 文字 -->
                    <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveStatus('/'+subItem.path)">
                    <!-- 一级菜单模板区 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-collection-tag"></i>
                        <!-- 文字 -->
                        <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
    
        
          </el-submenu>
        </el-menu>
      </el-aside>


      <!-- 右侧主体区 -->
      <el-main>
          <!-- welcome路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>




<script>
export default {
    data() {
        return {
            menulist:[],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            isCollapse:false,
            activeStatus:''
        }
    },
    created(){
        this.getMenuList()
        this.activeStatus=window.sessionStorage.getItem('activePath')
    },
  methods: {
    exit() {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    async getMenuList(){
        const {data:res} = await this.$http.get('menus')
        if(res.meta.status !=200) return $message.error(res.meta.msg)
        this.menulist=res.data
    },
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
    },
    saveStatus(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activeStatus=activePath
    }
  },
}
</script>




<style  scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #545c64;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div img {
  height: 57px;
  width: 57px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.el-aside {
  background-color: #545c64;
}
.el-aside .el-menu{
    border-right: none;
}
.el-main {
  background-color: #eaedf2;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color: #485166;
    font-size:10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>