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
      <el-main
        id="print"
        style="
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          background-color: #ffffff;
        "
      >
        <div>
          <h1 style="text-align: center">{{ form.name }}</h1>
          <div style="margin: auto; text-align: center">
            试卷的得分：<span>{{ answer.score }} / {{ form.score }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp; 耗时：<span>{{ answer.doTime }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp; 做题人：<span>{{ this.answerUser }}</span
            >&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
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
      <el-footer>
        <div style="margin-top: 20px; text-align: center">
          <el-button type="primary" @click="print">打印</el-button>
        </div>
      </el-footer>
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
      answerUser: "",
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
    print(){
      let subOutputRankPrint = document.getElementById("print");
      console.log(subOutputRankPrint);
      let newContent = subOutputRankPrint.innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      return false;
    },
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
