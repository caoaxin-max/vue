import { post, postWithLoadTip } from '@/utils/request'

export default {
  getMenu: role => post('/api/admin/getMenu/'+role)
}
