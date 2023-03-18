<template>
  <div class="app-container">
    <el-form :model="queryParam" ref="queryForm" :inline="true">
      <el-form-item label="用户名：">
        <el-input v-model="queryParam.userName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">查询</el-button>
        <router-link :to="{path:'/user/student/edit'}" class="link-left">
          <el-button type="primary">添加</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row style="width: 100%"
      @row-click="rowClick"
    >
      <el-table-column prop="id" label="Id" />
      <el-table-column prop="userName" label="用户名"/>
      <el-table-column prop="realName" label="真实姓名" />
      <el-table-column prop="userLevel" label="学级"  :formatter="levelFormatter"/>
      <el-table-column prop="className" label="班级" />
      <el-table-column prop="sex" label="性别" width="60px;" :formatter="sexFormatter"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="createTime" label="创建时间" width="160px"/>
      <el-table-column label="状态" prop="status" width="70px">
        <template slot-scope="{row}">
          <el-tag :type="statusTagFormatter(row.status)">
            {{ statusFormatter(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="270px" label="操作" align="center">
        <template slot-scope="{row}">
          <el-button size="mini"  @click="changeStatus(row)" class="link-left">
            {{ statusBtnFormatter(row.status) }}
          </el-button>
          <router-link :to="{path:'/user/student/edit', query:{id:row.id}}" class="link-left">
            <el-button size="mini" >编辑</el-button>
          </router-link>
          <router-link :to="{path:'/log/user/list', query:{userId:row.id}}" class="link-left" v-if="currentUser.role == 3">
            <el-button size="mini" >日志</el-button>
          </router-link>
          <el-button  size="mini" type="danger" @click="deleteUser(row)" class="link-left">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParam.pageIndex" :limit.sync="queryParam.pageSize"
                @pagination="search"/>
    <el-drawer
      title="学生成绩分析"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="50%"
      @open="openDrawer()"
      @close="closeDrawer()"
    >
      <el-row style="margin-top: 20px;margin-left: 20px;">
            <el-col :span="6">
              <el-date-picker
                v-model="nowMonth"
                type="month"
                placeholder="选择月">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 20px;margin-left: 20px;margin-right: 20px">
          <div
            id="echarts_box"
            style="width: 100%;height: 400px;"
            ref="echarts_box"
          ></div>
          </el-row>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Pagination from '@/components/Pagination';
import userApi from '@/api/user';
import Cookies from 'js-cookie';
import analyseApi from '@/api/analyse';

export default {
  components: { Pagination },
  data () {
    return {
      direction: 'rtl',
      drawer: false,
      queryParam: {
        userName: '',
        role: 1,
        pageIndex: 1,
        pageSize: 10,
        currentUserName: ''
      },
      listLoading: true,
      tableData: [],
      total: 0,
      getRowKeys(row) {
          return row.id;
        },
        //存放展开的id
      expands: [],
      legendData:[],
      xAxisData:[],
      series:[],
      nowMonth: new Date(),
      currentRow: null,
    }
  },
  watch:{
    "nowMonth": {
      handler(){
        this.initEcharts(this.currentRow);
      }
    }
  },
  created () {
    let temp = Cookies.get("adminUserInfo");
    this.currentUser = JSON.parse(temp);
    this.search();
  },
  methods: {
    rowClick(row, column, event) {
      this.drawer = true;
      this.currentRow = row;
    },
    closeDrawer(){
      this.nowMonth = new Date;
    },
    openDrawer(){
        this.$nextTick(() => {
          this.initEcharts(this.currentRow);
        })
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    initEcharts(currentUser){
      let pa = {
        nowMonth: this.nowMonth,
        currentUser: currentUser
      }
      var myChart = this.$echarts.init(this.$refs.echarts_box);
      analyseApi.getAnalyse(pa).then(data => {
        if (data.code === 200){
          let analyseDate = data.data;
          this.legendData = [];
          this.xAxisData = [];
          let seriesData = [];
          this.series = [];
          Object.keys(analyseDate).forEach(key => {
            let oneSeries = {
              name: '',
              type: 'line',
              stack: 'Total',
              smooth: true,
              data: []
            }
            this.legendData.push(key);
            seriesData = analyseDate[key];
            oneSeries.name = key;
            oneSeries.data = seriesData;
            this.series.push(oneSeries);
          })
          for (let i = 1; i <= seriesData.length; i++) {
            this.xAxisData.push(i);
          }
          myChart.setOption({
            title: {
              text: '本月各科答题记录'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: this.legendData
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.xAxisData
            },
            yAxis: {
              type: 'value'
            },
            series: this.series
          });
        }else {
          this.$message.error("加载数据异常！")
        }
      });
    },
    search () {
      this.queryParam.currentUserName = Cookies.get("adminUserName")
      this.listLoading = true
      userApi.getUserPageList(this.queryParam).then(data => {
        const re = data.data
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
        this.listLoading = false
      })
    },
    changeStatus (row) {
      let _this = this
      userApi.changeStatus(row.id).then(re => {
        if (re.code === 200) {
          row.status = re.data
          _this.$message.success("更新状态成功")
        } else {
          _this.$message.error("更新状态失败")
        }
      })
    },
    deleteUser (row) {
      let _this = this
      userApi.deleteUser(row.id).then(re => {
        // console.log(re)
        if (re.code === 200) {
          _this.search()
          _this.$message.success(re.message)
        } else {
          _this.$message.error(re.message)
        }
      })
    },
    submitForm () {
      this.queryParam.pageIndex = 1
      this.search()
    },
    levelFormatter  (row, column, cellValue, index) {
      return this.enumFormat(this.levelEnum, cellValue)
    },
    sexFormatter  (row, column, cellValue, index) {
      return this.enumFormat(this.sexEnum, cellValue)
    },
    statusFormatter (status) {
      return this.enumFormat(this.statusEnum, status)
    },
    statusTagFormatter (status) {
      return this.enumFormat(this.statusTag, status)
    },
    statusBtnFormatter (status) {
      return this.enumFormat(this.statusBtn, status)
    }
  },
  computed: {
    ...mapGetters('enumItem', [
      'enumFormat'
    ]),

    ...mapState('enumItem', {
      sexEnum: state => state.user.sexEnum,
      statusEnum: state => state.user.statusEnum,
      statusTag: state => state.user.statusTag,
      statusBtn: state => state.user.statusBtn,
      levelEnum: state => state.user.levelEnum
    })
  }
}
</script>
