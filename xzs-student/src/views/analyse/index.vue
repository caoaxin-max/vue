<template>
  <div style="margin-top: 10px; " class="app-contain">
    <el-row>
      <el-col :span="6">
        <el-date-picker
          v-model="nowMonth"
          type="month"
          placeholder="选择月"
          :clearable="false"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="20">
    <div id="echarts_box" style="width: 100%;height: 400px;margin-top: 50px;"></div>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import analyseApi from "@/api/analyse";
import Cookies from 'js-cookie';

export default {
  data() {
    return{
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime() - 86400000;//  - 86400000是否包括当天
        }
      },
      legendData:[],
      xAxisData:[],
      series:[],
      nowMonth: new Date(),
      currentUser: null,
    }
  },
  watch: {
    "nowMonth": {
      handler(){
        this.initEcharts();
      }
    }
  },
  created() {
    let temp = Cookies.get("studentUserInfo");
    this.currentUser = JSON.parse(temp);
    console.log(this.currentUser);
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts(){
      let pa = {
        nowMonth: this.nowMonth,
        currentUser: this.currentUser
      }
      var myChart = echarts.init(document.getElementById("echarts_box"));
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
  },
};
</script>

<style scoped>

</style>
