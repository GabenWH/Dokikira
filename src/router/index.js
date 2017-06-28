import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../components/Hello'
import User from '../components/User'
import Users from '../components/Users'
import Login from '../components/Login'
import Password from '../components/Password'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'hello',
      component: Hello
    },
    {
      path: '/user/:id?',
      name: 'user',
      component: User,
      props: true
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/password',
      name: 'password',
      component: Password
    }

  ]
})
