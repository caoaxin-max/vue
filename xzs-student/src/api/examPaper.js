import { post, get } from '@/utils/request'

export default {
  select: id => post('/api/student/exam/paper/select/' + id),
  pageList: query => post('/api/student/exam/paper/pageList', query),
  getMaxQuestions: (subjectId,difficulty,userName) => get('/api/student/question/'+subjectId+'/'+difficulty+'/'+userName+'/count'),
  generateExam: (difficulty, subjectId, numQuestions, username) => post('/api/student/generate/exam/'+difficulty+'/'+subjectId+'/'+numQuestions+'/'+username),
}
