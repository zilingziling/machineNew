
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  routes: [
    {
      path: '/login',
      component: './user/login',
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/deviceControl',
            },
            {
              path: '/deviceControl',
              name: '设备控制',
              icon: 'deviceIcon',
              component: './deviceControl',
            },
            {
              path: '/warning',
              name: '报警查看',
              icon: 'warningIcon',
              component: './warning',
            },
            {
              path: '/bigData',
              name: '运维数据',
              icon: 'bigData',
            },
            {
              path: '/more',
              name: '更多功能',
              icon: 'more',
              routes: [
                {
                  path: '/more/role',
                  name: '角色管理',
                  component: './role',
                },
                {
                  path: '/more/userManage',
                  name: '用户管理',
                  component: './userManage',
                },
                {
                  path: '/more/region',
                  name: '区域管理',
                  component: './region',
                },
                {
                  path: '/more/menu',
                  name: '菜单管理',
                  component: './menu',
                },
              ],
            },
            {
              component: './404.js',
            },
          ],
        },
        {
          component: './404.js',
        },
      ],
    },
    {
      component: './404.js',
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'machineNew',
        dll: false,

        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};
