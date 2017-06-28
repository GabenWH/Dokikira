const host = process.env.API_URL

export default {
  login: `${host}/AppUsers/login`,
  logout: `${host}/AppUsers/logout`,
  users: `${host}/AppUsers`,
  usersPaginated: `${host}/AppUsers/paginated`,
  userCount: `${host}/AppUsers/count`,
  user: (id) => `${host}/AppUsers/${id}`,
  password: `${host}/AppUsers/change-password`,
  roles: `${host}/Roles`,
  myPermissions: `${host}/user/my-permissions`,
  me: (id) => `${host}/AppUsers/${id}`,
  roleMappings: `${host}/RoleMappings`,
  roleMapping: (id) => `${host}/RoleMappings/${id}`
}
