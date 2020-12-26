<template>
  <div>
    <!-- 导航栏---面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <!-- 搜索输入框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getGoodList'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
        <!-- 商品表格区域 -->
        <el-table :data='goodList' border stripe>
          <el-table-column type='index'></el-table-column>
          <el-table-column label='商品名称' prop='goods_name'></el-table-column>
          <el-table-column label='商品价格' prop="goods_price" width='95px'></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
          <el-table-column label="创建时间" width="180px">
            <template slot-scope="scope">
              {{scope.row.add_time|dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="145px">
            <template slot-scope="scope">
              <el-button type="info" icon="el-icon-edit" ></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页功能区 -->
        <el-row>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" background>
          </el-pagination>
        </el-row>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  export default {
    created() {
      this.getGoodList()
    },
    data() {
      return {
        // 查询参数的对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        // 总数据条数
        total: 0,
        // 商品列表
        goodList: [],
        // 搜索条件
      }
    },
    methods: {
      async getGoodList() {
        const {
          data: res
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取商品列表信息失败')
        this.$message.success('获取商品列表信息成功')
        this.goodList = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodList()
      },
      handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum
        this.getGoodList()
      },
      // 根据ID进行删除
      async removeById(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err) => {
          return err
        });

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除！')
        }

        const {
          data: res
        } = await this.$http.delete(`goods/${id}`)

        if (res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        }

        this.$message.success('删除成功！')
        this.getGoodsList()
      },
      goAddPage(){
        this.$router.push('/goods/add')
      }
    },
  }

</script>
<style lang="scss" scope>
</style>
