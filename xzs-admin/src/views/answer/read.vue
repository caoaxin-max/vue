<template>
  <div style="background-color: #eff3f7; width: 100%; height: 100%">
    <el-container
      style="
        margin-left: 80px;
        margin-right: 80px;
        padding-top: 20px;
        padding-bottom: 20px;
      "
    >
      <el-aside
        width="300px"
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
          得分：<span>{{ answer.score }} / {{ form.score }}</span> &nbsp;&nbsp;
          做题人：<span>{{ this.answerUser }}</span>&nbsp;&nbsp;
          耗时：<span>{{ answer.doTime }}</span>
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
      </el-aside>
      <el-container>
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
            <el-row :key="index" v-for="(titleItem, index) in form.titleItems">
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
                  <QuestionAnswerShow
                    :qType="questionItem.questionType"
                    :question="questionItem"
                    :answer="answer.answerItems[questionItem.itemOrder - 1]"
                  />
                </el-form-item>
              </el-card>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import QuestionAnswerShow from "./components/QuestionAnswerShow";
import examPaperAnswerApi from "@/api/examPaperAnwser";
export default {
  components: { QuestionAnswerShow },
  data() {
    return {
      form: {},
      formLoading: false,
      answerUser: '',
      answer: {
        id: null,
        score: 0,
        doTime: 0,
        answerItems: [],
        doRight: false,
      },
    };
  },
  created() {
    let id = this.$route.query.id;
    let _this = this;
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true;
      examPaperAnswerApi.read(id).then((re) => {
        _this.answerUser = re.data.answerUser;
        _this.form = re.data.paper;
        _this.answer = re.data.answer;
        _this.formLoading = false;
      });
    }
  },
  methods: {
    questionDoRightTag(status) {
      return this.enumFormat(this.doRightTag, status);
    },
    goAnchor(selector) {
      this.$el.querySelector(selector).scrollIntoView({
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
