<template lang="jade">
    .user
        form(@submit.stop.prevent='save')
            v-text-field(label='Full Name', v-model='user.name', required)
            v-text-field(label='Username', v-model='user.username', required)
            v-text-field(label='Email', v-model='user.email', required)
            v-text-field(label='Password', v-model='user.password', v-if='!user.id', type='password', required)

            div(v-if='!editProfile')

                .caption.grey--text Roles
                v-chip(v-for='(roleMapping, index) in user.roleMappings', v-model='roleMapping.enabled', :key='index', close, @input='removeRole') {{ roleMapping.role.name | capitalize }}
                v-menu(offset-y, right, v-show='availableRoles.length')
                    v-btn(primary, light, icon, slot='activator')
                        v-icon add
                    v-list
                        v-list-item(v-for='(role, index) in availableRoles', :key='index')
                            v-list-tile(@click.native='addRole(role)')
                                v-list-tile-title {{ role.name | capitalize }}
                v-divider
        v-layout(row)
            v-btn.primary--text(flat, :router='true', :to='{ name: "users" }') Go Back
            v-btn.md-primary.md-raised(primary, light, @click.native='save') Save
</template>

<script>
  import UserService from '../services/UserService'
  import RoleService from '../services/RoleService'
  import { clone } from 'lodash'

  export default {
    name: 'user',
    props: ['id', 'editProfile', 'showSnackbar', 'setTitle'],
    data () {
      return {
        roles: [],
        user: { roleMappings: [] },
        oldRoles: []
      }
    },
    async created () {
      if (this.id) {
        this.user = await UserService.get(this.id)
        this.oldRoles = clone(this.user.roleMappings)
      }
      this.roles = await RoleService.all()
      this.setTitle(this.editProfile ? 'Edit Profile' : (this.user.id ? 'Edit' : 'Create') + ' User')
    },
    methods: {
      async save () {
        const savedUser = await UserService.save(this.user)
        this.user.id = savedUser.id
        await this.updateRoles()
        this.showSnackbar('Success!')
      },
      updateRoles () {
        const promises = []
        const currentRoleIds = this.user.roleMappings.map(r => r.roleId)
        const oldRoleIds = this.oldRoles.map(r => r.roleId)
        this.oldRoles.forEach(r => {
          if (!currentRoleIds.includes(r.roleId)) {
            promises.push(RoleService.removeRoleMapping(r))
          }
        })
        this.user.roleMappings.forEach(r => {
          if (!oldRoleIds.includes(r.roleId)) {
            promises.push(RoleService.addRoleMapping(this.user, r.role))
          }
        })
        return Promise.all(promises)
      },
      async addRole (role) {
        var roleMapping = { userId: this.user.id, roleId: role.id }
        roleMapping.role = this.roles.filter(r => r.id === roleMapping.roleId)[0]
        this.user.roleMappings.push(roleMapping)
      },
      removeRole () {
        this.user.roleMappings = this.user.roleMappings.filter(roleMapping => roleMapping.enabled !== false)
      }
    },
    computed: {
      availableRoles () {
        const assignedRoleIds = this.user.roleMappings.map(roleMapping => roleMapping.role.id)
        return this.roles.filter(role => {
          return !assignedRoleIds.includes(role.id)
        })
      }
    }
  }
</script>

<style>
</style>
