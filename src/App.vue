<template lang="jade">
    v-app
        v-navigation-drawer(persistent, :mini-variant='miniVariant', :clipped='true', v-model='drawer')
            v-list
                v-list-item
                    v-list-tile
                        v-list-tile-action
                            v-btn.pa-0.ma-0(light, icon, @click.native.stop='miniVariant = !miniVariant')
                                v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
                        v-list-tile-content
                            v-list-tile-title
                                .headline VuetifyTemplate
                v-list-item(v-for='(item, i) in items', :key='i')
                    v-list-tile(value='true', :href='item.url', @click.native='drawer = false', :ripple='true')
                        v-list-tile-action
                            v-icon(light, v-html='item.icon')
                        v-list-tile-content
                            v-list-tile-title(v-text='item.title')
        v-toolbar(light, :fixed='true')
            v-toolbar-side-icon(@click.native.stop='drawer = !drawer', light)
            v-toolbar-title(v-text='title || "VuetifyTemplate"')
            v-spacer
            v-toolbar-title.text-xs-right.px-0.hidden-xs-only(v-text='user.name', v-show='user.id')
            v-menu(offset-y, left, v-show='user.id')
                v-btn(icon, light, slot='activator')
                    v-icon account_circle
                v-list
                    v-list-item.hidden-sm-and-up
                        v-list-tile
                            v-layout.pa-2.mb-2(column)
                                .caption Signed in as
                                .body-2 {{ user.name }}
                    v-divider.hidden-sm-and-up
                    v-list-item
                        v-list-tile(@click.native='$router.push({ name: "user", params: { id: user.id, editProfile: true } })')
                            v-list-tile-title Edit Profile
                    v-list-item
                        v-list-tile(@click.native='$router.push({ name: "password" })')
                            v-list-tile-title Change Password
                    v-divider
                    v-list-item
                        v-list-tile(@click.native='logout')
                            v-list-tile-title Sign Out
        main.grey.lighten-4
            v-container(fluid)
                router-view(
                    :show-snackbar='showSnackbar',
                    :set-title='setTitle',
                    :set-user='setUser')
        v-footer(:fixed='true')
            span © 2017 Harland Clarke Holdings
        v-snackbar(v-model='snackbar', :timeout='3000', :bottom='true') {{ snackbarMessage }}
            v-btn.primary--text(flat, @click.native='snackbar = false') Close

</template>

<script>
  import LoginService from './services/LoginService'
  import UserService from './services/UserService'

  export default {
    name: 'app',
    data () {
      return {
        user: {},
        drawer: false,
        items: [
          { icon: 'people', title: 'Manage Users', url: '#/users' }
        ],
        miniVariant: true,
        snackbar: false,
        snackbarMessage: '',
        title: ''
      }
    },
    created () {
      this.getUserInfo()
    },
    methods: {
      async logout () {
        try {
          await LoginService.logout()
        } finally {
          this.user = {}
          this.$router.push({ name: 'login' })
        }
      },
      getUserInfo () {
        UserService.me().then(this.setUser)
          .catch(() => { this.$router.push({ name: 'login' }) })
      },
      showSnackbar (message) {
        this.snackbarMessage = message
        this.snackbar = true
      },
      setTitle (title) {
        this.title = title
        this.$forceUpdate()
      },
      setUser (user) {
        this.user = user
        this.$forceUpdate()
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
