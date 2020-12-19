<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户表格 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mobile" label="手机"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">


        <template slot-scope="getData">
            <el-switch
              v-model="getData.row.mg_state"
              @change="userStateChanged(getData.row)"
            >
            </el-switch>
          </template>
        </el-table-column>


        <el-table-column label="操作">
          <template slot-scope="getData">
            <el-button type="info" icon="el-icon-edit" @click="showEditDialog(getData.row.id)"></el-button>

            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-setting"></el-button>
            </el-tooltip>

              <el-button type="danger" icon="el-icon-delete" @click="deleteUser(getData.row.id)"></el-button>  
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加用户的弹窗信息 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="addDialogClosed">
      <!-- 内容区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户弹窗 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close='editClose'>
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="姓名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    
   
  </div>
</template>


<script>
export default {
  data() {
    var checkEmail = function (rule, value, callback) {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = function (rule, value, callback) {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }

    return {
      // 用户数据
      userList: [],
      // 数据总数
      total: 0,
      //   查询数据的页码信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      dialogVisible: false,
      editDialogVisible:false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单的验证规则 
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        checkMobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 编辑表单的验证规则 
      editFormRules:{
          email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        checkMobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },

      editForm:{},
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 查询用户列表信息
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200)
        return this.$message.console.error('获取用户列表失败')

      this.userList = res.data.users
      console.log(this.userList)
      this.total = res.data.total
    },
    // 查询几条数据
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getUserList()
    },
    // 当前是第几页的数据
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 更新用户的状态信息
    async userStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('用户状态更新出错')
      } else {
        this.$message.success('用户状态更新成功')
      }
    },
    // 表单关闭事件重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户信息
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 控制展示修改页面弹窗
    async showEditDialog(id){
        
        const { data: res } =  await this.$http.get('users/'+id)
        if(res.meta.status !==200){
            this.$message.error('查询用户信息出错')
        }
        this.editForm= res.data
        this.editDialogVisible= true
    },
    // 编辑用户信息
    editUser(){
        this.$refs.editFormRef.validate(async (valid)=>{
            if(!valid)  return

            const {data:res} = await this.$http.put('users/'+this.editForm.id,{
                email:this.editForm.email,
                mobile: this.editForm.mobile
            })
            if(res.meta.status !==200){
                 return this.$message.error('更新用户信息失败！')
            }
            this.editDialogVisible = false
            this.getUserList();
            this.$message.success('更新用户信息成功！')
        })
    },
    // 编辑用户信息关闭后清除表单信息
    editClose(){
      this.$refs.editFormRef.resetFields();
    },
    // 删除用户信息
    async deleteUser(id){
    const judgeUserAction= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((error) => {
          return error        
        });

        if(judgeUserAction == 'cancel'){
          this.$message({ type: 'info',message: '已取消删除'})
        }else if (judgeUserAction == 'confirm'){
          const {data:deletInfo} = await this.$http.delete('users/'+id)
          if(deletInfo.meta.status !==200){
            return this.$message.error('删除用户信息失败')
          }
          this.$message.success('删除用户信息成功')
          this.getUserList()
          
        }
    }
  },
}
</script>

<style scoped>
</style>