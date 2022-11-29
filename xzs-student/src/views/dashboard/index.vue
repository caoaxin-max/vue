<template>
  <div style="margin-top: 10px">
    <el-row>
      <el-carousel :interval="5000" arrow="always" type="card">
        <el-carousel-item >
          <img src="@/assets/carousel/1.png" class="carousel-img">
        </el-carousel-item>
        <el-carousel-item >
          <img src="@/assets/carousel/2.png" class="carousel-img">
        </el-carousel-item>
        <el-carousel-item >
          <img src="@/assets/carousel/3.png" class="carousel-img">
        </el-carousel-item>
        <el-carousel-item >
          <img src="@/assets/carousel/4.png" class="carousel-img">
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <el-row class="app-item-contain">
      <h3 class="index-title-h3" style="border-left: solid 10px #3651d4;">任务中心</h3>
      <div style="padding-left: 15px">
        <el-collapse  v-loading="taskLoading"  accordion v-if="taskList.length!==0">
          <el-collapse-item :title="taskItem.title" :name="taskItem.id" :key="taskItem.id" v-for="taskItem in taskList">
            <table class="index-task-table">
              <tr v-for="paperItem in taskItem.paperItems" :key="paperItem.examPaperId">
                <td class="index-task-table-paper">
                  {{paperItem.name}}
                </td>
                <td width="70px">
                  <el-tag :type="statusTagFormatter(paperItem.status)" v-if="paperItem.status !== null" size="mini">
                    {{ statusTextFormatter(paperItem.status) }}
                  </el-tag>
                </td>
                <td width="80px">
                  <router-link :to="{path:'/do',query:{id:paperItem.id}}" v-if="paperItem.status === null">
                    <el-button  type="text" size="small">开始答题</el-button>
                  </router-link>
                  <router-link :to="{path:'/edit',query:{id:paperItem.examPaperAnswerId}}" v-else-if="paperItem.status === 1">
                    <el-button  type="text" size="small">批改试卷</el-button>
                  </router-link>
                  <router-link :to="{path:'/read',query:{id:paperItem.examPaperAnswerId}}" v-else-if="paperItem.status === 2">
                    <el-button  type="text" size="small">查看试卷</el-button>
                  </router-link>
                </td>
              </tr>
            </table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-row>
    <el-row class="app-item-contain">
      <h3 class="index-title-h3">固定试卷</h3>
      <div style="padding-left: 15px">
        <el-col :span="4" v-for="(item, index) in fixedPaper" :key="index" :offset="index > 0 ? 1 : 0">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/exam-paper/show1.png" class="image">
            <div style="padding: 14px;">
              <span>{{item.name}}</span>
              <div class="bottom clearfix">
                <router-link :to="{path:'/do',query:{id:item.id}}">
                  <el-button type="text" class="button">开始做题</el-button>
                </router-link>
              </div>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
    <el-row class="app-item-contain">
      <h3 class="index-title-h3" style="border-left: solid 10px rgb(220, 208, 65);">时段试卷</h3>
      <div style="padding-left: 15px">
        <el-col :span="4" v-for="(item, index) in timeLimitPaper" :key="index" :offset="index > 0 ? 1 : 0">
          <el-card :body-style="{ padding: '0px' }" v-loading="loading">
            <img src="@/assets/exam-paper/show2.png" class="image">
            <div style="padding: 14px;">
              <span>{{item.name}}</span>
              <p class="index-limit-paper-time">
                <span>{{item.limitStartTime}}</span>
                <br/>
                <span>{{item.limitEndTime}}</span>
              </p>
              <div class="bottom clearfix" >
                <!-- <router-link :to="{path:'/do',query:{id:item.id}}"> -->
                  <el-button type="text" class="button" @click="jump(item.id)" :disabled="(nowTime >= item.limitStartTime && nowTime <= item.limitEndTime ) ? false : true">开始做题</el-button>
                <!-- </router-link> -->
              </div>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import indexApi from '@/api/dashboard'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      fixedPaper: [],
      timeLimitPaper: [],
      // pushPaper: [],
      loading: false,
      taskLoading: false,
      taskList: [],
      // isDisabled: false
      nowTime:null
    }
  },
  created () {
    let studentUserInfo = Cookies.get("studentUserInfo")
    let userInfo = JSON.parse(studentUserInfo)
    let _this = this
    this.loading = true
    indexApi.index(userInfo.id).then(re => {
      if(re.code === 200){
        console.log(111111);
        _this.fixedPaper = re.data.fixedPaper
        _this.timeLimitPaper = re.data.timeLimitPaper
        // _this.pushPaper = re.data.pushPaper
        _this.loading = false
      }else{
        console.log(2222222);
        this.$notify({
          title: '警告',
          message: re.message,
          type: 'warning',
          duration: 0
        });
        // _this.loading = false
      }
    })

    this.taskLoading = true
    indexApi.task(userInfo.userLevel).then(re => {
      _this.taskList = re.data
      _this.taskLoading = false
    })
    let flag = _this.checkTime()
    _this.nowTime = flag;
  },
  methods: {
    jump(id){
      this.$router.push({
        path: '/do',
        query:{id:id}
      })
    },
    checkTime(){
      var date = new Date();
      var year = date.getFullYear(); //月份从0~11，所以加一
      var dateArr = [date.getMonth() + 1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()];
      for(var i=0;i<dateArr.length;i++){
        if (dateArr[i] >= 1 && dateArr[i] <= 9) {
            dateArr[i] = "0" + dateArr[i];
        }
      }
      var strDate = year+'-'+dateArr[0]+'-'+dateArr[1]+' '+dateArr[2]+':'+dateArr[3]+':'+dateArr[4];
      /* if(strDate >= startTime && strDate <= endTime){
        console.log("true");
      }else{
        console.log("false");
      } */
      return strDate
    },
    statusTagFormatter (status) {
      return this.enumFormat(this.statusTag, status)
    },
    statusTextFormatter (status) {
      return this.enumFormat(this.statusEnum, status)
    }
  },
  computed: {
    ...mapGetters('enumItem', [
      'enumFormat'
    ]),
    ...mapState('enumItem', {
      statusEnum: state => state.exam.examPaperAnswer.statusEnum,
      statusTag: state => state.exam.examPaperAnswer.statusTag
    })
  }
}
</script>

<style lang="scss" scoped>
  .index-title-h3 {
    font-size: 22px;
    font-weight: 400;
    color: #1f2f3d;
    border-left: solid 10px #2ce8b4;
    padding-left: 10px;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 50%;
    height: 80%;
    display: block;
    margin: 20px auto 10px auto;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
