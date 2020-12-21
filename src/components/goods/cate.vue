<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="编号"
        border
        class="treeTable"
      >
        <!-- 分类名称  -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-close" v-else></i>
        </template>

        <!-- 是否有效  -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="">
          <el-button type="info" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">搜索</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cateInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="cateInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=total
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加分类的对话框  -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    :before-close="addCateDialogClosed"
    >
      <el-form
        :model="addCateRuleForm"
        status-icon
        :rules="addCateRuleFormRules"
        ref="addCateRuleFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            v-model="addCateRuleForm.cat_name"
          ></el-input>
        </el-form-item>

        <el-form-item label="父级分类" >
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>



<script>
export default {
  created() {
    this.getCateLitst()
  },
  data() {
    return {
      // 页面初始化：查询页数、数据数量、什么类型的数据
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 查询数据总数
      total: 0,
      // 页面初始化：商品分类的数据
      catelist: [],
      // 表格插件信息
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '排序',
          type: 'template',
          template: 'opt',
        },
      ],
    //   控制展示关闭的属性 
      addCateDialogVisible: false,
    //   添加用户表单的数据对象 
      addCateRuleForm:{
          cat_name:'',
          
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      addCateRuleFormRules:{
          cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList:[],
      cascaderProps:{
          value:'cat_id',
          label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: []
    }
  },
  methods: {
    // 对页面进行初始化：查询 页面数据、页数等信息
    async getCateLitst() {
      const { data: res } = await this.$http.get('categories', {
        params: this.cateInfo,
      })
      if (res.meta.status != 200)
        return this.$message.error('页面初始化信息出错')
      //   获取商品数据
      this.catelist = res.data.result
      //   获取总数据条数并赋值
      this.total = res.data.total
    },
    // 页数相关方法--点击时候赋值当时的页的数据
    handleSizeChange(newSize) {
      this.cateInfo.pagesize = newSize
      this.getCateLitst()
    },
    // 页数相关方法--点击时候赋值当前是第几页
    handleCurrentChange(newNum) {
      this.cateInfo.pagenum = newNum
      this.getCateLitst()
    },
     // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList() 
      this.addCateDialogVisible = true
    },
  // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      this.parentCateList = res.data
    },
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateRuleForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateRuleForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的Id
        this.addCateRuleForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateRuleForm.cat_level = 0
      } 
    },
    addCate() {
      this.$refs.addCateRuleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }

        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateRuleFormRef.resetFields()
      this.selectedKeys = []
      this.addCateRuleForm.cat_level = 0
      this.addCateRuleForm.cat_pid = 0
    }
  },
}
</script>


<style scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>