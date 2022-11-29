import { post } from '@/utils/request'

export default {
  index: () => post('/api/admin/index')
}
