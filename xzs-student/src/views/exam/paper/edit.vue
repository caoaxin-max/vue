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
          得分：<span>{{ answer.score }} / {{ form.score }}</span>
          &nbsp;&nbsp; 耗时：<span>{{ answer.doTime }}</span>
        </div>
        <el-divider></el-divider>
        <span :key="item.itemOrder" v-for="item in answer.answerItems">
          <el-tag
            @click="goAnchor('#question-' + item.itemOrder)"
            :type="questionDoRightTag(item.doRight)"
            style="margin-right: 5px"
            >{{ item.itemOrder }}</el-tag
          >
        </span>
        <el-divider></el-divider>
        <el-button type="primary" style="margin-left: 90px" @click="submitForm"
          >提交批改</el-button
        >
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
            <el-form
              :model="form"
              ref="form"
              v-loading="formLoading"
              label-width="100px"
            >
              <el-row
                :key="index"
                v-for="(titleItem, index) in form.titleItems"
              >
                <h3>{{ titleItem.name }}</h3>
                <el-card
                  class="exampaper-item-box"
                  v-if="titleItem.questionItems.length !== 0"
                >
                  <el-form-item
                    :key="questionItem.itemOrder"
                    :label="questionItem.itemOrder + '.'"
                    v-for="questionItem in titleItem.questionItems"
                    class="exam-question-item"
                    label-width="50px"
                    :id="'question-' + questionItem.itemOrder"
                  >
                    <el-row>
                      <QuestionAnswerShow
                        :qType="questionItem.questionType"
                        :question="questionItem"
                        :answer="answer.answerItems[questionItem.itemOrder - 1]"
                      />
                    </el-row>
                    <el-row
                      v-if="
                        answer.answerItems[questionItem.itemOrder - 1]
                          .doRight === null
                      "
                    >
                      <label style="color: #e6a23c">批改：</label>

                      <el-input-number
                        size="mini"
                        v-model="
                          answer.answerItems[questionItem.itemOrder - 1].score
                        "
                        :min="min"
                        :max="questionItem.score"
                      ></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-card>
              </el-row>
            </el-form>
          </el-main>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { formatSeconds } from "@/utils";
import QuestionAnswerShow from "../components/QuestionAnswerShow";
import examPaperAnswerApi from "@/api/examPaperAnswer";
export default {
  components: { QuestionAnswerShow },
  data() {
    return {
      form: {},
      formLoading: false,
      answer: {
        id: null,
        score: 0,
        doTime: 0,
        answerItems: [],
        // doRight: false
      },
      min: 0
    };
  },
  created() {
    let id = this.$route.query.id;
    if (id && parseInt(id) !== 0) {
      this.formLoading = true;
      examPaperAnswerApi.read(id).then((re) => {
        console.log(re);
        this.form = re.data.paper;
        this.answer = re.data.answer;
        this.formLoading = false;
      });
    }
  },
  methods: {
    submitForm() {
      console.log(this.answer)
      let _this = this;
      _this.formLoading = true;
      examPaperAnswerApi.edit(this.answer)
        .then((re) => {
          if (re.code === 200) {
            _this.$alert("试卷得分：" + re.data + "分", "考试结果", {
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
    formatSeconds(theTime) {
      return formatSeconds(theTime);
    },
    questionDoRightTag(status) {
      return this.enumFormat(this.doRightTag, status);
    },
    goAnchor(selector) {
      this.$el
        .querySelector(selector)
        .scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    },
  },
  computed: {
    ...mapGetters("enumItem", ["enumFormat"]),
    ...mapState("enumItem", {
      doRightTag: (state) => state.exam.question.answer.doRightTag,
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

.page-scroll {
  height: 100%;
  width: 100%;
}
.page-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
