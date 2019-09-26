/**
 * @Project Name: vue-admin
 * @Author: luichooy
 * @Date: 2018-01-17 15:01
 * @Email: luichooy@163.com
 * @Idea: WebStorm
 */

import Layout from 'src/pages/layout/layout';

// 不作为main组件子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('src/pages/login/login')
};

// 错误页面
export const errorRouter = {
  path: '/error/:code',
  name: 'error',
  meta: {
    title: 'error'
  },
  component: () =>
    import('src/pages/error/index')
};

// 作为main组件子页面展示  但不在左侧菜单显示的路由卸载otherRoter里
export const otherRouter = {
  path: '',
  name: 'otherRouter',
  redirect: '/home',
  meta: {
    requireAuth: true
  },
  component: Layout,
  children: [
    {
      path: 'home',
      name: 'home',
      meta: {
        title: '首页'
      },
      component: () => import('src/pages/home/home')
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/content',
    name: 'content',
    title: '内容管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'carousel',
        name: 'carousel',
        meta: {
          title: 'Banner'
        },
        component: () => import('src/pages/content/carousel/index')
      },
      {
        path: 'news',
        name: 'news',
        meta: {
          title: '新闻活动'
        },
        component: () => import('src/pages/content/news/index')
      }
    ]
  },
  {
    path: '/form',
    name: 'form',
    title: '表单管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'render',
        name: 'render',
        title: '渲染表单',
        component: () => import('src/pages/form/render/render')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',

    meta: {
      title: '系统管理',
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'system_index',
        title: '系统管理',
        meta: {
          title: '系统管理'
        },
        component: () => import('src/pages/system/index/index')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',

    meta: {
      title: '用户管理',
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'user_index',
        title: '用户管理',
        meta: {
          title: '用户管理'
        },
        component: () => import('src/pages/user/index')
      },
      {
        path: 'account',
        name: 'account',
        meta: {
          title: '账号管理'
        },
        component: () => import('src/pages/user/account')
      }
    ]
  },
  {
    path: '/access',
    name: 'access',
    meta: {
      title: '权限管理',
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'access_index',
        meta: {
          title: '权限管理'
        },
        component: () => import('src/pages/access/index')
      },
      {
        path: 'role',
        name: 'role_index',
        meta: {
          title: '角色管理'
        },
        component: () => import('src/pages/access/role')
      }
    ]
  },
  {
    path: '/log',
    name: 'log',
    title: '日志管理',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'log_index',
        title: '操作日志',
        component: () => import('src/pages/log/index')
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    title: '测试',
    meta: {
      requireAuth: true
    },
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'test_index',
        title: '测试',
        component: () => import('src/pages/test/test')
      }
    ]
  }
];

export const routers = [
  loginRouter,
  errorRouter,
  otherRouter,
  ...appRouter
];
