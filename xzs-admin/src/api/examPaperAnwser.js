import { post } from '@/utils/request'

export default {
  page: query => post('/api/admin/examPaperAnswer/page', query),
  read: id => post('/api/admin/exampaper/answer/read/'+id),
  edit: query => post('/api/admin/exampaper/answer/edit', query)
}
