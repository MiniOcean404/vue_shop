<template>
    <div class="login_container">
        <div class="login_box">
            <div class="head_image_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" label-width="0px" class="login_form" :model='loginFrom' :rules='loginFormRules'>
                <!-- 用户名 -->
                <el-form-item prop='username'>
                     <el-input  prefix-icon="iconfont icon-user" v-model='loginFrom.username'></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop='password' >
                     <el-input  prefix-icon="iconfont icon-3702mima" type='password'  v-model="loginFrom.password" ></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="success" round @click="login">登录</el-button>
                    <el-button type="info" round @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script>
export default {
    data() {
        return {
            // 登录表单的数据对象
            loginFrom:{
                username:'admin',
                password:'123456'
            },
            loginFormRules:{
                username:[ 
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 7, message: '长度在 3 到 7 个字符', trigger: 'blur' }
                    ],
                password:[ 
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ]
            }
        }
    },
    methods: {
        // 点击重置按钮重置表单内容
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async boolean=>{
                if(boolean == false) return;
                // await直接获取请求值
                const {data:res}= await this.$http.post('login',this.loginFrom);
                if(res.meta.status !==  200) return this.$message({showClose: true,message: '登录失败',type: 'error'})      
                this.$message.success({showClose: true,message: '登录成功'})
                window.sessionStorage.setItem('token',res.data.token);
                this.$router.push('/home')
            });
        }
    },
}
</script>


<style scoped>
.login_container{
    background-color:rgb(65, 184, 181);
    height: 100%;
}
.login_box{
    width: 450px;
    height: 270px;
    border-radius: 3px;
    background-color: #fff;
    position:absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
.head_image_box{
    height: 100px;
    width: 100px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
}
.head_image_box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #fff;
}
.login_form{
    position: absolute;
    bottom: 0px;    
    width: 100%;
    padding: 0 50px;
    box-sizing: border-box;
}

.btns{
    display: flex;
    justify-content: flex-end;
}
</style>