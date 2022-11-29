import { post } from '@/utils/request'

export default {
  index: id => post('/api/student/dashboard/index/'+id),
  task: level => post('/api/student/dashboard/task/'+level)
}
