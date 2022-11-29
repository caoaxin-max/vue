import { post } from '@/utils/request'

export default {
  classPageList: query => post('/api/admin/class/page', query),
  edit: query => post('/api/admin/class/edit', query),
  changeStatus: id => post('/api/admin/class/change/status/'+id),
  deleteClass: id => post('/api/admin/class/delete/'+id),
  selectClass: id => post('/api/admin/class/select/'+id)
}
