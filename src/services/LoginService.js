import BaseService from './BaseService'

class LoginService extends BaseService {
  static login (credentials) {
    return this.POST(this.api.login, credentials, true).then(accessToken => {
      window.localStorage['token'] = accessToken.id
      window.localStorage['user'] = accessToken.userId
      return accessToken
    })
  }
  static logout () {
    return this.POST(this.api.logout, true).then(() => {
      delete window.localStorage['token']
      delete window.localStorage['user']
    })
  }
}

export default LoginService

