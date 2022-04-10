// import Vue from 'vue'
// import VueRouter from 'vue-router'
import Home from '@/Home'
/*import Index from '@/views/Index'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Log from '@/views/Log'
import MessageBoard from '@/views/MessageBoard'
import BlogWrite from '@/views/blog/BlogWrite'
import BlogView from '@/views/blog/BlogView'
import BlogAllCategoryTag from '@/views/blog/BlogAllCategoryTag'
import BlogCategoryTag from '@/views/blog/BlogCategoryTag'*/

import {Message} from 'element-ui'
Vue.prototype.$message=Message
import Admin from '../admin/Admin'

import BlogEdit from '../admin/BlogEdit.vue'
import BlogWrite from '@/views/blog/BlogWrite'

import BlogList from "@/admin/BlogList"
import CategoryList from "@/admin/CategoryList"
import TagList from "@/admin/TagList"
import CommentList from "@/admin/CommentList";


import store from '@/store'

import {getToken} from '@/request/token'

// Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/write/:id?',
      component: r => require.ensure([], () => r(require('@/views/blog/BlogWrite')), 'blogwrite'),
      meta: {
        requireLogin: true
      },
    },
    {
      path: '',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/',
          component: r => require.ensure([], () => r(require('@/views/Index')), 'index')
        },
        {
          path: '/log',
          component: r => require.ensure([], () => r(require('@/views/Log')), 'log')
        },
        {
          path: '/archives/:year?/:month?',
          component: r => require.ensure([], () => r(require('@/views/blog/BlogArchive')), 'archives')
        },
        {
          path: '/messageBoard',
          component: r => require.ensure([], () => r(require('@/views/MessageBoard')), 'messageboard')
        },
        {
          path: '/view/:id',
          component: r => require.ensure([], () => r(require('@/views/blog/BlogView')), 'blogview')
        },
        {
          path: '/:type/all',
          component: r => require.ensure([], () => r(require('@/views/blog/BlogAllCategoryTag')), 'blogallcategorytag')
        },
        {
          path: '/:type/:id',
          component: r => require.ensure([], () => r(require('@/views/blog/BlogCategoryTag')), 'blogcategorytag')
        }
      ]
    },
    {
      path: '/login',
      component: r => require.ensure([], () => r(require('@/views/Login')), 'login')
    },
    {
      path: '/register',
      component: r => require.ensure([], () => r(require('@/views/Register')), 'register')
    },
	{
		//另一个项目的后台登陆界面
		path:'/login-admin',
		component: r => require.ensure([], () => r(require('@/admin/Login')), 'login')
	},
	{
		path:'/admin',
		name: 'Admin',
		component:Admin,
		meta: {
		    title: '后台管理',
			
			requireLogin: true
			
		},
		children:[
			{
				path: '/writeBlog',
				name: 'BlogWrite',
				component: BlogWrite,
				meta:{
					requireAuth:true,
					title:'写博客'
				}
			},
			{
				path:'/bloglist',
				name: 'blogList',
				component: BlogList,
				meta: {
				    requireAuth: true,
				    title: '文章管理'
				}
			},
			{
				path: '/blog/edit/:blogId',
				component: BlogEdit,
				name: 'BlogEdit',
				meta: {
				    requireAuth: true,
				    title: '编辑博客'
				},
				
			},
			{
				path: '/type',
				component: CategoryList,
				meta: {
				    requireAuth: true,
				    title: '分类管理'
				}
			},
			
			{
				path: '/tags',
				component: TagList,
				meta: {
				    requireAuth: true,
				    title: '标签管理'
				}
			},
            {
                path: '/comments',
                component: CommentList,
                meta: {
                    requireAuth: true,
                    title: '评论管理'
                }
            }
		]
	}

  ],
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})

router.beforeEach((to, from, next) => {

  if (getToken()) {

    if (to.path === '/login') {
      next({path: '/'})
    } else {
      if (store.state.account.length === 0) {
        store.dispatch('getUserInfo').then(data => { //获取用户信息
            next()
        }).catch(() => {
          this.$message({
            type: 'warning',
            showClose: true,
            message: '登录已过期'
          })
          next({path: '/'})
        })
      } else {

        next()
      }
    }
  } else {
    if (to.matched.some(r => r.meta.requireLogin)) {
	
	Vue.prototype.$message({
	　　message: '请先登录哦',
	　　type: 'warning'
	})
	
      // this.$message({
      //   type: 'warning',
      //   showClose: true,
      //   message: '请先登录哦'
      // })

    }
    else {
      next();
    }
  }
})


export default router
