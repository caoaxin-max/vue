<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="年级：">
        <el-select v-model="queryParam.level" placeholder="年级" @change="levelChange" clearable>
          <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学科：" >
        <el-select v-model="queryParam.subjectId"  clearable>
          <el-option v-for="item in subjectFilter" :key="item.id" :value="item.id" :label="item.name+' ( '+item.levelName+' )'"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="Id"  width="100" />
      <el-table-column prop="paperName" label="试卷名称"/>
      <el-table-column prop="createUser" label="答卷学生"/>
      <el-table-column  label="得分" width="100px" >
        <template slot-scope="{row}" >
          <span v-if="row.userScore != null">{{row.userScore}} / {{row.paperScore}}</span>
          <span v-if="row.userScore == null">{{row.systemScore}} / {{row.paperScore}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="题目对错" width="80px" >
        <template slot-scope="{row}">
          {{row.questionCorrect}} / {{row.questionCount}}
        </template>
      </el-table-column>
      <el-table-column prop="doTime" label="耗时(秒)" width="100px"/>
      <el-table-column prop="createTime" label="提交时间" width="160px"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <router-link :to="{path:'/answer/edit',query:{id:row.id}}">
            <el-button size="mini">批改</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParam.pageIndex" :limit.sync="queryParam.pageSize"
                @pagination="search"/>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Pagination from '@/components/Pagination'
import examPaperAnswerApi from '@/api/examPaperAnwser'
import Cookies from "js-cookie";
export default {
  components: { Pagination },
  data () {
    return {
      queryParam: {
        subjectId: null,
        level: null,
        status: 1,
        pageIndex: 1,
        pageSize: 10,
        currentUser: ''
      },
      subjectFilter: null,
      listLoading: false,
      tableData: [],
      total: 0
    }
  },
  created () {
    this.queryParam.currentUser = Cookies.get("adminUserName");
    this.initSubject()
    this.search()
  },
  methods: {
    search () {
      this.listLoading = true
      examPaperAnswerApi.page(this.queryParam).then(data => {
        const re = data.data
        if (re.message && re.message != null && re.message != "") {
          this.$notify({
            title: "提示",
            message: re.message,
            type: 'warning',
            duration: 0,
          });
        }
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
        this.listLoading = false
      })
    },
    levelChange () {
      this.queryParam.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.queryParam.level)
    },
    submitForm () {
      this.queryParam.pageIndex = 1
      this.search()
    },
    ...mapActions('exam', { initSubject: 'initSubject' })
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapGetters('exam', ['subjectEnumFormat']),
    ...mapState('exam', { subjects: state => state.subjects }),
    ...mapState('enumItem',{levelEnum: state => state.user.levelEnum})
  }
}
</script>

<style>

</style>
