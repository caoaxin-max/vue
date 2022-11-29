import { post, postWithLoadTip } from '@/utils/request'

export default {
  login: query => postWithLoadTip(`/api/auth/login`, query),
  logout: query => post(`/api/auth/logout`, query)
}
