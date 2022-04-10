<template>
  <div>

    <!--添加-->
    <el-form inline>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addDialogVisible=true">添加标签</el-button>
      </el-form-item>
    </el-form>
	

    <el-table :data="TagList">
      <el-table-column label="序号" type="index" width="300"></el-table-column>
	  
      <el-table-column label="名称" prop="tagName"></el-table-column>


      <el-table-column label="操作" width="500">
        <template v-slot="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row)">编辑</el-button>
          <!-- <el-popconfirm icon="el-icon-delete" iconColor="red" title="确定删除吗？" @confirm="deleteTagById(scope.row.id)"> -->
            <el-button slot="reference" icon="el-icon-delete" size="mini" type="danger" @click="deleteTagById(scope.row.id)">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.currentPage"
                   :page-sizes="[10, 20, 30, 50]" :page-size="queryInfo.pageSize" :total="total"
                   layout="total, sizes, prev, pager, next, jumper" background>
    </el-pagination>



    <!--添加友链对话框-->
    <el-dialog title="添加标签" width="40%" :visible.sync="addDialogVisible" :close-on-click-modal="false" @close="addDialogClosed">
      <!--内容主体-->
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="80px">
        <el-form-item label="名称" prop="tagName">
          <el-input v-model="addForm.tagName"></el-input>
        </el-form-item>
		
      </el-form>
      <!--底部-->
      <span slot="footer">
				<el-button @click="addDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="saveTag">确 定</el-button>
			</span>
    </el-dialog>

    <!--编辑友链对话框-->
    <el-dialog title="编辑标签" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false" @close="editDialogClosed">
      <!--内容主体-->
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="80px">
        <el-form-item label="名称" prop="tagName">
          <el-input v-model="editForm.tagName"></el-input>
        </el-form-item>
		
		
      </el-form>
      <!--底部-->
      <span slot="footer">
				<el-button @click="editDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="editTag">确 定</el-button>
			</span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "Tag",
  data() {
    return {
      infoForm: {
        content: '',
        commentEnabled: true,
      },
      queryInfo: {
        currentPage: 1,
        pageSize: 10
      },
      TagList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        tagName: '',
      },
      editForm: {
        tagName: '',
      },
      formRules: {
        tagName: [{required: true, message: '名称', trigger: 'blur'}],
      }
    }
  },
  methods:{
    //获取当前分页的友链
    getTagList() {
      const _this = this
      axios.get('/tags/list?currentPage=' + this.queryInfo.currentPage+"&pageSize=" + this.queryInfo.pageSize).then((res) => {
        _this.TagList = res.data.data.records
        _this.total = res.data.data.total
        //console.log(_this.blogList)
      });
    },

    handleCurrentChange(newPage) {
      this.queryInfo.currentPage = newPage
      this.getFriendList()
    },
    handleSizeChange(newPageSize){
      this.queryInfo.pageSize = newPageSize
      this.getFriendList()

    },
    showEditDialog(row){
      this.editForm = row
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.editForm = {}
      this.editDialogVisible = false
    },


  deleteTagById(id) {
     this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
     	// ---------------------------------------------
     const _this = this
     axios.get('/tags/delete/' + id).then((res) => {
     		  _this.getTagList()
     })
     	// ---------------------------------------------
     	
       this.$message({
         type: 'success',
         message: '删除成功!'
       });
     }).catch(() => {
       this.$message({
         type: 'info',
         message: '已取消删除'
       });          
     });
    },

    saveTag(){
      const _this = this
      axios.post('/tags/create',this.addForm).then((res) => {
        _this.$alert('操作成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            _this.addDialogVisible = false

            _this.getTagList()
            //_this.$router.push("/blogList")
          }
        })
      });
      this.$refs['addFormRef'].resetFields();
    },
    editTag(){
      const _this = this
      axios.post('/tags/update', this.editForm).then(res => {
        _this.$alert('操作成功', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            _this.editDialogVisible = false
            _this.getTagList()
          }
        });
      });

    },
    commentEnabledChanged(){

    },
    addDialogClosed(){
      this.addDialogVisible = false
    },



  },
  created() {
    this.getTagList()
  }
}


</script>

<style scoped>
.el-button + span {
  margin-left: 10px;
}


.el-form--inline .el-form-item {
  margin-bottom: 0;
}


</style>