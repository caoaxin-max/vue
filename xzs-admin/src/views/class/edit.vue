<template>
  <div class="app-container">
    <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading">
      <el-form-item label="年级：" prop="level" required>
        <el-select v-model="form.level" placeholder="年级">
          <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责老师："  prop="teacher" required>
        <el-input v-model="form.teacher"/>
      </el-form-item>
      <el-form-item label="班级名称："  prop="className" required>
        <el-input v-model="form.className"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import classApi from '@/api/class'
export default {
  data(){
    return {
      form: {
        id: null,
        level: null,
        className: "",
        teacher:"",
      },
      formLoading: false
    }
  },
  created(){
    let id = this.$route.query.id
    if(id && parseInt(id) !== 0){
      this.formLoading = true
      classApi.selectClass(id).then(re => {
        // console.log(re)
        this.form = re.data
        this.formLoading = false
      })
    }
  },
  methods:{
    resetForm () {
      let lastId = this.form.id
      this.$refs['form'].resetFields()
      this.form = {
        id: null,
        level: null,
        teacher: "",
        className: "",
      }
      this.form.id = lastId
    },
    submitForm () {
      let _this = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formLoading = true
          classApi.edit(this.form).then(re => {
            if (re.code === 200) {
              _this.$message.success(re.message)
              _this.delCurrentView(_this).then(() => {
                _this.$router.push({name: "ClassPageList"})
              })
            }else {
              _this.$message.error(re.message)
              _this.formLoading = false
            }
          }).catch(e => {
            _this.formLoading = false
          })
        }else {
          return false
        }
      })
    },
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  },
   computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      statusEnum: state => state.user.statusEnum,
      levelEnum: state => state.user.levelEnum
    })
   }
}
</script>

<style>

</style>
