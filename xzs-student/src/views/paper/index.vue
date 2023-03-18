<template>
  <div style="margin-top: 10px" class="app-contain">
    <div style="margin-bottom:20px;">
      <el-button @click="showDialog()">智能组成试卷</el-button>
     </div>
    <el-tabs tab-position="left"  v-model="tabId"  @tab-click="subjectChange" >
      <el-tab-pane :label="item.name"  :key="item.id" :name="item.id" v-for="item in subjectList" style="margin-left: 20px;" >
        <el-row  style="float: right">
          <el-radio-group v-model="queryParam.paperType" size="mini" @change="paperTypeChange" >
            <el-radio v-for="item in paperTypeEnum" size="mini" :key="item.key" :label="item.key">{{item.value}}</el-radio>
          </el-radio-group>
        </el-row>
        <el-table v-loading="listLoading" :data="tableData" fit highlight-current-row style="width: 100%">
          <el-table-column prop="id" label="序号" width="90px"/>
          <el-table-column prop="name" label="名称"  />
          <el-table-column align="right">
            <template slot-scope="{row}">
              <router-link :to="{path:'/do',query:{id:row.id}}">
                <el-button  type="text" size="small">开始答题</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :background="false" :page.sync="queryParam.pageIndex" :limit.sync="queryParam.pageSize"
                    @pagination="search" style="margin-top: 20px"/>
      </el-tab-pane>
    </el-tabs>

  <el-dialog
    title="智能组卷"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose">
    <el-card class="box-card" shadow="never">
      <el-form :model="form" ref="form" label-width="100px" :rules="rules">
        <el-form-item label="学科：" prop="subjectId" required>
          <el-select v-model="form.subjectId" placeholder="学科">
            <el-option v-for="item in subjectList" :key="item.id" :value="item.id"
                      :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度：" prop="difficulty" required>
          <div class="block">
            <el-rate v-model="form.difficulty" style="padding-top:8px;"></el-rate>
          </div>
        </el-form-item>
        <el-form-item label="题目数：" prop="numQuestions" required>
          <el-input-number v-model="form.numQuestions" :min="1" :max="maxQuestions"></el-input-number>
        </el-form-item>
      </el-form>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="generateExam()">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'
import examPaperApi from '@/api/examPaper'
import subjectApi from '@/api/subject'
import Cookies from 'js-cookie';

export default {
  components: { Pagination },
  data () {
    return {
      form: {
        id: null,
        level: null,
        subjectId: null,
        difficulty: null,
        numQuestions: 1
      },
      maxQuestions: null,
      rules: {
        level: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        subjectId: [
          { required: true, message: '请选择学科', trigger: 'change' }
        ],
      },
      dialogVisible: false,
      queryParam: {
        paperType: 1,
        subjectId: 0,
        pageIndex: 1,
        pageSize: 10
      },
      tabId: 0,
      listLoading: true,
      subjectList: [],
      tableData: [],
      total: 0,
      currentUser: null,
    }
  },
  created () {
    this.initSubject();
    let temp = Cookies.get("adminUserInfo");
    this.currentUser = JSON.parse(temp);
    this.form.level = this.currentUser.userLevel;
  },
  watch: {
    "form.subjectId": {
      handler(){
        this.getMaxQuestions();
      }
    },
    "form.difficulty": {
      handler(){
        this.getMaxQuestions();
      }
    }
  },
  methods: {
    getMaxQuestions(){
      console.log(this.form);
      if(this.form.subjectId != 0 && this.form.difficulty != 0){
        examPaperApi.getMaxQuestions(this.form.subjectId,this.form.difficulty,this.form.level).then(res => {
          if(res.code === 200){
            this.maxQuestions = res.data;
          }
        })
      }
    },
    showDialog(){
      this.dialogVisible = true;
    },
    generateExam(){
      examPaperApi.generateExam(this.form.difficulty, this.form.subjectId, this.form.level, this.form.numQuestions, this.currentUser.userName).then(res => {
          if(res.code === 200){
            this.dialogVisible = false;
            this.$message.success(res.message);
            this.search();
          }else{
            this.$message,error(res.message);
          }
      })
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    initSubject () {
      subjectApi.list().then(re => {
        this.subjectList = re.data
        let subjectId = this.subjectList[0].id
        this.queryParam.subjectId = subjectId
        this.tabId = subjectId
        this.search()
      })
    },
    search () {
      this.listLoading = true
      examPaperApi.pageList(this.queryParam).then(data => {
        const re = data.data
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
        this.listLoading = false
      })
    },
    paperTypeChange (val) {
      this.search()
    },
    subjectChange (tab, event) {
      this.queryParam.subjectId = this.tabId
      this.search()
    }
  },
  computed: {
    ...mapState('enumItem', {
      paperTypeEnum: state => state.exam.examPaper.paperTypeEnum
    })
  }
}
</script>
