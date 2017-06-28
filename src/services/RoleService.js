import BaseService from './BaseService'

class RoleService extends BaseService {
  static all () {
    return this.GET(this.api.roles)
  }

  static roleMapping (user, role) {
    return this.GET(this.api.roleMappings, {
      filter: JSON.stringify({
        where: {
          and: [
            {principalId: user.id},
            {roleId: role.id}
          ]
        }
      })
    }).then(roleMappings => roleMappings[0])
  }

  static addRoleMapping (user, role) {
    return this.PUT(this.api.roleMappings, {
      principalType: 'USER',
      principalId: user.id,
      roleId: role.id
    })
  }

  static removeRoleMapping (roleMapping) {
    return this.DELETE(this.api.roleMapping(roleMapping.id))
  }
}

export default RoleService
