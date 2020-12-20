<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 卡片视图，主体内容区域 -->
        <el-card>

        <!-- 添加角色按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary">添加角色</el-button>  
            </el-col>
        </el-row>
        
        <!-- 角色列表展示区 -->
        <el-table :data="rolesList" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope='scope'>
                                <el-row v-for="(item1,index1) in scope.row.children" :key='item1.id' :class="['bd-bottom ',index1===0?'bd-top':'','vcenter']">
                                    <!-- 第一层渲染 -->
                                    <el-col :span='5' >
                                        <el-tag closable @close="removeRolesById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>

                                    <el-col :span='19'>
                                        <el-row v-for="(item2,index2) in item1.children" :key='item2.id' :class="[index2==0?'':'bd-top','vcenter']">
                                            <!-- 渲染第二层的权限 -->
                                            <el-col :span='6'>
                                               <el-tag type='success' closable @close="removeRolesById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                               <i class="el-icon-caret-right"></i>
                                            </el-col>

                                            <!-- 第三层渲染 -->
                                            <el-col :span='18'>
                                               <el-tag type='warning' v-for="item3 in item2.children" :key="item3.id" closable @close="removeRolesById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>

                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="角色名称" prop="roleDesc"></el-table-column>
                        <el-table-column label="角色描述" prop="roleName"></el-table-column>
                        <el-table-column label="操作" prop="level">

                        <template slot-scope='scope'>
                            <el-button type="info" icon="el-icon-edit">编辑</el-button>
                            <el-button type="primary" icon="el-icon-setting" @click="showReleDialogVisible(scope.row)">分配权限</el-button>
                            <el-button type="danger" icon="el-icon-delete">删除</el-button>
                        </template>
                        </el-table-column>
        </el-table>
        
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限"  :visible.sync="setReleDialogVisible" width="50%" @close='setRightDialogClosed' >

            <!-- 树的控件 -->
            <el-tree :data="setRoleList" :props='treePrpos' show-checkbox node-key='id' default-expand-all :default-checked-keys="defKeys" ref='treeRef'>
            
            </el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setReleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allright">确 定</el-button>
            </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    created() {
        // 创建网页时就开启获取角色信息
        this.getRolesList()
    },
    data() {
        return {
             // 获取角色信息及其子信息的数组
            rolesList:[],
            treePrpos:{
                label:'authName',
                children:'children'
            },
            // 分配权限展示的值 
            defKeys:[],
            // 角色分配的展示
            setRoleList:[],
            // 控制展示分配角色的按钮
            setReleDialogVisible:false,
            roleId:''
        }
    },
    methods: {
        // 发请求获取角色信息
        async getRolesList(){
            const {data:res}=await this.$http.get('roles');
            if (res.meta.status !== 200 ) return this.$message.erroe('获取角色信息失败');
            this.rolesList= res.data
            this.$message.success('获取角色信息成功');
        }
        ,
            // 根据ID删除权限
        async removeRolesById(id1,id2){
        const flag= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch((error) => {
          return error        
        });
            
            if(flag !== 'confirm'){
                return this.$message.info('用户取消了删除')
            }else{
             const {data:res}= await  this.$http.delete(`roles/${id1.id}/rights/${id2}`)
             if(res.meta.status !==200) return  this.$message.error();('删除失败')
             id1.children = res.data
            }
            
            
        },
        // 控制展示分配角色的弹窗以及获取分配角色的内容
        async showReleDialogVisible(role){
            this.roleId=role.id
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status!==200) return this.$message.error('获取权限信息失败');
            this.setRoleList = res.data
            this.getLeafKeys(role,this.defKeys)
            this.setReleDialogVisible = true
        },
            getLeafKeys( node ,arr ){
            if(!node.children){
                    return arr.push(node.id)
                }
            node.children.forEach(value => {
                this.getLeafKeys(value,arr)
            });
        }
        ,
        setRightDialogClosed(){
            this.defKeys =[]
        },
        async allright(){
           const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setReleDialogVisible = false
    }  

    },
}
</script> 


<style scoped>
.el-tag{
    margin: 10px;
}
.bd-top{
    border-top: 1px solid #eee;
}
.bd-bottom{
    border-bottom: 1px solid  #eee;
}

.vcenter{
    display: flex;
    align-items: center;
}
</style>