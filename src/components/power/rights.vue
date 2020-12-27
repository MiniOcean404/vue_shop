<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图，主体内容区域 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  export default {
    created() {
      //在初始化的时候就更新权限信息，进行渲染
      this.getRightList();
    },
    data() {
      return {
        // 权限列表清单
        rightsList: [],
      }
    },
    methods: {
      // 获取所有的权限信息
      async getRightList() {
        const {
          data: resRightsList
        } = await this.$http.get('rights/list');
        if (resRightsList.meta.status !== 200) {
          return this.$message.error('列表更新错误');
        }
        this.$message.success('更新成功');
        this.rightsList = resRightsList.data

      }
    },
  }

</script>

<style scoped>

</style>
