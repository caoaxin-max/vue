import { post, get } from '@/utils/request'

export default {
  select: id => post('/api/student/exam/paper/select/' + id),
  pageList: query => post('/api/student/exam/paper/pageList', query),
  getMaxQuestions: (subjectId,difficulty,level) => get('/api/student/question/'+subjectId+'/'+difficulty+'/'+level+'/count'),
  generateExam: (difficulty, subjectId, level, numQuestions, username) => post('/api/student/generate/exam/'+difficulty+'/'+subjectId+'/'+level+'/'+numQuestions+'/'+username),
}
