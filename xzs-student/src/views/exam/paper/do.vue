<template>
  <div style="background-color: #eff3f7; width: 100%; height: 100%">
    <el-container
      style="
        margin-left: 80px;
        margin-right: 80px;
        padding-top: 20px;
        padding-bottom: 20px;
        height: 100%;
      "
    >
      <el-aside
        width="300px"
        height="100%"
        style="
          border-radius: 4px;
          padding-left: 10px;
          padding-right: 10px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          border-radius: 10px;
        "
      >
        <p style="font-size: 18px">{{ form.name }}</p>
        <div style="font-size: 13px">
          总分：<span>{{ form.score }}</span> &nbsp;&nbsp; 时长：<span>{{
            form.suggestTime
          }}</span>
        </div>
        <el-divider></el-divider>
        <span :key="item.itemOrder" v-for="item in answer.answerItems">
          <el-tag
            @click="goAnchor('question-'+item.itemOrder)"
            :type="questionCompleted(item.completed)"
            style="margin-right: 5px"
            >{{item.itemOrder}}</el-tag
          >
        </span>
        <el-divider></el-divider>
        <div style="text-align: center">
          剩余时间：
          <p style="color: red; font-size: 20px">
            {{ formatSeconds(remainTime) }}
          </p>
        </div>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 90px" @click="submitForm">提交试卷</el-button>
      </el-aside>

      <el-container>
        <el-scrollbar class="page-scroll">
        <el-main
          style="
            margin-left: 20px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            background-color: #ffffff;
            border-radius: 10px;
          "
        >
          <el-form :model="form" ref="form" v-loading="formLoading" label-width="100px">
          <el-row :key="index"  v-for="(titleItem,index) in form.titleItems">
            <h3>{{titleItem.name}}</h3>
            <el-card class="exampaper-item-box" v-if="titleItem.questionItems.length!==0">
              <el-form-item :key="questionItem.itemOrder" :label="questionItem.itemOrder+'.'"
                            v-for="questionItem in titleItem.questionItems"
                            class="exam-question-item" label-width="50px" :id="'question-'+ questionItem.itemOrder">
                <QuestionEdit :qType="questionItem.questionType" :question="questionItem"
                              :answer="answer.answerItems[questionItem.itemOrder-1]"/>
              </el-form-item>
            </el-card>
          </el-row>
        </el-form>
          </el-main
        >
        </el-scrollbar>
      </el-container>

    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { formatSeconds } from "@/utils";
import QuestionEdit from "../components/QuestionEdit";
import examPaperApi from "@/api/examPaper";
import examPaperAnswerApi from "@/api/examPaperAnswer";

export default {
  components: { QuestionEdit },
  data() {
    return {
      form: {},
      formLoading: false,
      answer: {
        // questionId: null,
        doTime: 0,
        answerItems: [],
      },
      timer: null,
      remainTime: 0,
    };
  },
  created() {
    let id = this.$route.query.id;
    let _this = this;
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true;
      examPaperApi.select(id).then((re) => {
        _this.form = re.data;
        _this.remainTime = re.data.suggestTime * 60;
        _this.initAnswer();
        _this.timeReduce();
        _this.formLoading = false;
      });
    }
  },
  mounted() {},
  beforeDestroy() {
    window.clearInterval(this.timer);
  },
  methods: {
    cancel() {
      this.$router.push({ path: "/" });
    },
    formatSeconds(theTime) {
      return formatSeconds(theTime);
    },
    timeReduce() {
      let _this = this;
      this.timer = setInterval(function () {
        if (_this.remainTime <= 0) {
          _this.submitForm();
        } else {
          ++_this.answer.doTime;
          --_this.remainTime;
        }
      }, 1000);
    },
    questionCompleted(completed) {
      return this.enumFormat(this.doCompletedTag, completed);
    },
    goAnchor(selector) {
      console.log(selector);
      document.getElementById(selector).scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    },
    initAnswer() {
      this.answer.id = this.form.id;
      let titleItemArray = this.form.titleItems;
      for (let tIndex in titleItemArray) {
        let questionArray = titleItemArray[tIndex].questionItems;
        for (let qIndex in questionArray) {
          let question = questionArray[qIndex];
          this.answer.answerItems.push({
            questionId: question.id,
            content: null,
            contentArray: [],
            completed: false,
            itemOrder: question.itemOrder,
          });
        }
      }
    },
    submitForm() {
      let _this = this;
      window.clearInterval(_this.timer);
      _this.formLoading = true;
      console.log(this.answer)
      examPaperAnswerApi.answerSubmit(this.answer)
        .then((re) => {
          console.log(re)
          if (re.code === 200) {
            _this.$alert("试卷系统得分：" + re.data + "分", "考试结果", {
              confirmButtonText: "返回考试记录",
              callback: (action) => {
                _this.$router.push("/record/index");
              },
            });
          } else {
            _this.$message.error(re.message);
          }
          _this.formLoading = false;
        })
        .catch((e) => {
          _this.formLoading = false;
        });
    },
  },
  computed: {
    ...mapGetters("enumItem", ["enumFormat"]),
    ...mapState("enumItem", {
      doCompletedTag: (state) => state.exam.question.answer.doCompletedTag,
    }),
  },
};
</script>

<style lang="scss">
.align-center {
  text-align: center;
}

.exam-question-item {
  padding: 10px;

  .el-form-item__label {
    font-size: 15px !important;
  }
}

.question-title-padding {
  padding-left: 25px;
  padding-right: 25px;
}

.page-scroll{
  height: 100%;
  width: 100%;
}
.page-scroll .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
