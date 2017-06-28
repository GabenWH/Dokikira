<template lang="jade">
    v-container.users.pa-0.mx-2(fluid)
        v-btn(primary, light, :router='true', :to='{name: "user"}') Create New User
        v-list.my-3
            v-list-item
                v-layout(row).mx-0
                    v-flex(xs3).pa-0
                        v-list-tile.pa-2.no-highlight
                            v-text-field(label='Name', v-model='filter.name', @keyup.native='getUsers')
                    v-flex(xs3).pa-0
                        v-list-tile.pa-2.no-highlight
                            v-text-field(label='Email', v-model='filter.email', @keyup.native='getUsers')
                    v-flex(xs3).pa-0
                        v-list-tile.pa-2.no-highlight
                            v-text-field(label='Username', v-model='filter.username', @keyup.native='getUsers')
                    v-flex(xs3).pa-0
                        v-list-tile.pa-2.no-highlight
                            v-select(label='Roles', v-model='filter.role', :items='roles', item-value='id', @input='getUsers')
            v-list-item(v-for='(user, index) in users', :key='index')
                v-list-tile.px-0(:href='"#/user/" + user.id', :ripple='true', @mouseenter.native='showDelete(index)', @mouseleave.native='hideDelete(index)')
                    v-list-tile-title.px-2 {{ user.name }}
                    v-list-tile-title.px-2 {{ user.email }}
                    v-list-tile-title.px-2 {{ user.username }}
                    v-list-tile-title.px-2 {{ rolesFormatted(user) | capitalize }}
                        v-btn.ma-0(icon, @click.native.stop.prevent='confirmRemove(user)', :style='{ opacity: shouldShowDelete[index] === true ? 1 : 0 }')
                            v-icon delete
        .text-xs-center
            v-pagination(v-bind:length.number='pageCount', v-model='filter.page', @input='getUsers')
        v-dialog(v-model='confirmRemoveDialog', persistent)
            v-card
                v-card-row
                    v-card-title Delete this user?
                v-card-row(actions)
                    v-btn.primary--text(flat, @click.native='confirmRemoveDialog = false') Cancel
                    v-btn(primary, light, @click.native='removeConfirmed') Delete

</template>

<script>
  import UserService from '../services/UserService'
  import RoleService from '../services/RoleService'

  export default {
    name: 'users',
    props: ['showSnackbar', 'setTitle'],
    data () {
      return {
        users: [],
        roles: [],
        shouldShowDelete: [],
        filter: {
          name: '',
          email: '',
          username: '',
          role: '',
          page: 1,
          limit: 10
        },
        pageCount: 1,
        removeUser: {},
        confirmRemoveDialog: false
      }
    },
    async created () {
      this.getUsers()
      this.getRoles()
      this.setTitle('Users')
    },
    methods: {
      async getRoles () {
        this.roles = await RoleService.all()
        this.roles = this.roles.map(role => {
          role.text = this.$options.filters.capitalize(role.name)
          return role
        })
        this.roles.unshift({text: 'None', id: null})
      },
      showDelete (index) {
        this.shouldShowDelete[index] = true
        this.$forceUpdate()
      },
      hideDelete (index) {
        this.shouldShowDelete[index] = false
        this.$forceUpdate()
      },
      async getUsers () {
        const results = await UserService.paginated(this.filter)
        this.users = results.users
        this.pageCount = results.pageCount
      },
      rolesFormatted (user) {
        if (user.roleMappings && user.roleMappings.length) {
          return user.roleMappings
            .filter(roleMapping => roleMapping.role.name !== 'registered')
            .map(roleMapping => roleMapping.role.name)
            .join(', ')
        } else {
          return 'None'
        }
      },
      confirmRemove (user) {
        this.removeUser = user
        this.confirmRemoveDialog = true
      },
      async removeConfirmed () {
        await UserService.remove(this.removeUser)
        delete this.removeUser
        this.confirmRemoveDialog = false
        this.getUsers()
        this.showSnackbar('Success!')
      }
    }
  }
</script>

<style scoped>
    .list__tile.no-highlight:hover {
        background-color: transparent;
    }
</style>
