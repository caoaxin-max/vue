import { post } from '@/utils/request'

export default {
  getAnalyse: query => post('/api/admin/exam/paper/analyse', query)
};
