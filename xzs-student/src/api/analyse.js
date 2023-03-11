import { post } from '@/utils/request'

export default {
  getAnalyse: query => post('/api/student/exam/paper/analyse', query)
};
