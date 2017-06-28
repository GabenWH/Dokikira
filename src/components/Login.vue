<template lang="jade">
    v-dialog(v-model='dialog', persistent)
        v-card
            v-card-row.primary
                v-card-title.light--text Sign In
            v-card-row
                v-card-text
                    form(novalidate, @submit.stop.prevent='login')
                        v-text-field(label='Username', v-model='credentials.username', required)
                        v-text-field(label='Password', v-model='credentials.password', :type="hidePassword ? 'password' : 'text'", :append-icon="hidePassword ? 'visibility' : 'visibility_off'", :append-icon-cb="() => (hidePassword = !hidePassword)", required)
                        .body-2.red--text.text-xs-center(xs12, v-if='failure') Account not found
            v-card-row(actions)
                v-btn(primary, flat, @click.native='login', :disabled='!credentials.password || !credentials.username') Sign In
</template>

<script>
  import LoginService from '../services/LoginService'
  import UserService from '../services/UserService'

  export default {
    name: 'login',
    props: ['showSnackbar', 'setTitle', 'setUser'],
    data () {
      return {
        dialog: false,
        hidePassword: true,
        credentials: {
          username: '',
          password: ''
        },
        failure: false
      }
    },
    created () {
      setTimeout(() => { this.dialog = true })
      this.setTitle('VuetifyTemplate')
    },
    methods: {
      login: async function () {
        try {
          await LoginService.login(this.credentials)
          const user = await UserService.me()
          this.setUser(user)
          this.dialog = false
          setTimeout(() => { this.$router.push({ name: 'users' }) }, 400)
        } catch (error) {
          this.showSnackbar('Account not found')
        }
      }
    }
  }
</script>
