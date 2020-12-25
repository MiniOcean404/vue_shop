<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容区 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" show-icon closeable>
      </el-alert>

      <!-- 商品选择框 -->
      <el-row class="goods">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类级联选择框 -->
          <el-cascader v-model="cateValue" :options="cateList" :props="cateProps" @change="cateHandleChange">
          </el-cascader>

          <!-- tab标签页 -->
          <el-tabs v-model="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="用户管理" name="many">
              <el-button type="primary" :disabled="btnDisable" @click="addDialogVisible=true">添加参数</el-button>

              <!-- 动态参数表格 -->
              <el-table :data="manyData" stripe style="width: 100%" border>
                <el-table-column type="expand"></el-table-column>

                <el-table-column type="index"></el-table-column>

                <el-table-column prop="attr_name" label="参数名称">
                </el-table-column>

                <el-table-column label="操作" slot-scope="scope">
                  <el-button type="info" icon="el-icon-edit" @click="showEidt((scope.row.attr_id))">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 添加属性表格 -->
            <el-tab-pane label="配置管理" name="only">
              <el-button type="primary" :disabled="btnDisable" @click="addDialogVisible=true">配置管理
              </el-button>

              <el-table :data="onlyData" stripe style="width: 100%" border>
                <el-table-column type="expand"></el-table-column>

                <el-table-column type="index"></el-table-column>

                <el-table-column prop="attr_name" label="属性名称">
                </el-table-column>

                <el-table-column label="操作" slot-scope="scope">
                  <el-button type="info" icon="el-icon-edit" @click="showEidt(scope.row.attr_id)">修改</el-button>
                  <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 弹出式对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close='closeAddDialog'>
      <!-- 添加参数的对话框  -->
      <el-form ref="addFormRef" :model="addForm" :rules='addFormRules' label-width="80px">
        <el-form-item :label="titleText" prop='attr_name'>
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParms">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框  -->
    <el-dialog :title="'添加'+titleText" :visible.sync="editDialogVisible" width="50%" @close='closeEditDialog'>
      <!-- 添加参数的对话框  -->
      <el-form ref="editFormRef" :model="editForm" :rules='editFormRules' label-width="80px">
        <el-form-item :label="titleText" prop='attr_name'>
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParms">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  export default {
    created() {
      // 获取所有的商品数据
      this.getCateList()
    },
    data() {
      return {
        cateList: [],
        cateProps: {
          expandTrigger: 'hover',
          value: 'cat_id',
          label: 'cat_name',
          children: 'children',
        },
        cateValue: [],
        activeName: 'many',
        manyData: [],
        onlyData: [],
        addDialogVisible: false,
        addForm: {
          attr_name: ''
        },
        addFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }, ]
        },
        editDialogVisible: false,
        editForm: {

        },
        editFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }, ]
        }
      }
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await this.$http.get('categories')
        if (res.meta.status !== 200) return this.$message.error('获取商品失败')
        this.cateList = res.data
        this.$message.success('获取商品信息成功')
      },
      cateHandleChange() {
        this.getparams()
      },
      tabHandleClick() {
        this.getparams()
      },
      async getparams() {
        if (this.cateValue.length === 3) {
          const {
            data: res,
          } = await this.$http.get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: this.activeName
            },
          })
          if (res.meta.status !== 200) {
            this.$message.error('获取商品失败')
          }

          if (this.activeName == 'many') {
            this.manyData = res.data
          } else {
            this.onlyData = res.data
          }
          this.$message.success('获取商品成功')
        }
      },
      closeAddDialog() {
        this.$refs.addFormRef.resetFields();
      },
      addParms() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          const {
            data: res
          } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败')
          }
          this.$message.success('添加成功')

          this.addDialogVisible = false

          this.getparams()
        })
      },
      async showEidt(id) {
        const {
          data: res
        } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        if (res.meta.status !== 201) {
          return this.$message.error('获取失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },

      closeEditDialog() {
        this.$refs.editFormRef.resetFields()
      },
      editParms() {

      }

    },
    computed: {
      btnDisable() {
        if (this.cateValue.length !== 3) {
          return true
        }
        return false
      },
      cateId() {
        if (this.cateValue.length == 3) {
          return this.cateValue[2]
        }
        return null
      },
      titleText() {
        if (this.activeName == 'many') {
          return '动态属性'
        } else {
          return '静态属性'
        }
      },

    },
  }

</script>


<style scoped>
  .goods {
    margin-top: 15px;
  }

</style>
