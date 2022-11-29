<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="班级名称：">
        <el-input v-model="queryParam.className" clearable></el-input>
      </el-form-item>
      <el-form-item label="年级：">
        <el-select v-model="queryParam.level" placeholder="年级" clearable>
          <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="Id" width="90px"/>
      <el-table-column prop="level" label="年级" :formatter="levelFormatter" width="120px" />
      <el-table-column prop="className" label="班级名称"  />
      <el-table-column prop="classPassword" label="班级口令"  />
      <el-table-column prop="classNumber" label="班级人数" width="80px" />
      <el-table-column prop="createTime" label="创建时间" width="160px"/>
      <el-table-column  label="操作" align="center"  width="260px">
        <template slot-scope="{row}">
          <el-button size="mini" @click="jump(row)" >编辑</el-button>
          <el-button size="mini" type="danger"  @click="deleteClass(row)" class="link-left">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParam.pageIndex" :limit.sync="queryParam.pageSize"
                @pagination="search"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Pagination from '@/components/Pagination'
import classApi from '@/api/class'

export default {
  components: { Pagination },
  data(){
    return {
      queryParam: {
        className: "",
        level: null,
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      listLoading: true,
      total: 0
    }
  },
  created () {
    this.search()
  },
  methods:{
    jump(row){
      this.$router.push({
        name: 'ClassPageEdit',
        query: {
          id: row.id
        }
      })
    },
    submitForm () {
      this.queryParam.pageIndex = 1
      this.search()
    },
    search(){
      this.listLoading = true
      classApi.classPageList(this.queryParam).then(data => {
        const re = data.data
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
        this.listLoading = false
      })
    },
    deleteClass (row) {
      let _this = this
      classApi.deleteClass(row.id).then(re => {
        if (re.code === 200) {
          _this.search()
          _this.$message.success(re.message)
        } else {
          _this.$message.error(re.message)
        }
      })
    },
    levelFormatter  (row, column, cellValue, index) {
      return this.enumFormat(this.levelEnum, cellValue)
    },
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      levelEnum: state => state.user.levelEnum,
    })
  }
}
</script>

<style>

</style>
