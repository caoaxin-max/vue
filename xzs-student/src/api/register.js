import { postWithLoadTip } from '@/utils/request'

export default {
  register: query => postWithLoadTip(`/api/auth/register`, query)
}
