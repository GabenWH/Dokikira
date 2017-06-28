import BaseService from './BaseService'

class UserService extends BaseService {

  static get (id) {
    return this.GET(this.api.user(id), {
      filter: JSON.stringify({
        include: {
          relation: 'roleMappings',
          scope: {
            include: {
              relation: 'role'
            }
          }
        }
      })
    })
  }

  static save (user) {
    const url = user.id ? this.api.user(user.id) : this.api.users
    return this.PATCH(url, user)
  }

  static paginated (filter) {
    return this.POST(this.api.usersPaginated, { filter: filter })
      .then((data) => data.results)
  }

  static remove (user) {
    return this.DELETE(this.api.user(user.id))
  }

  static me () {
    const userId = window.localStorage['user']
    const token = window.localStorage['token']

    return this.GET(this.api.me(userId), { access_token: token })
  }

  static changePassword (password) {
    return this.POST(this.api.password, password)
  }
}

export default UserService

