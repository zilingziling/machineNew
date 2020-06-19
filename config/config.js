// ref: https://umijs.org/config/
export default {
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
              component: '../layouts/normalLayout.js',
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
                {
                  path: '/more/log',
                  name: '操作日志',
                  component: './log',
                },
                {
                  path: '/more/updateCC',
                  name: '中控升级',
                  component: './updateCC',
                },
                {
                  path: '/more/updateTouch',
                  name: '触摸屏升级',
                  component: './updateTouch',
                },
                {
                  path: '/more/updateAI',
                  name: 'AI升级',
                  component: './updateAI',
                },
                {
                  path: '/more/deviceBrand',
                  name: '设备品牌',
                  component: './brand/brand',
                },
                {
                  path: '/more/deviceFunc',
                  name: '控制命令',
                  component: './deviceFunc/deviceFunc',
                },
                {
                  path: '/more/deviceType',
                  name: '设备类型',
                  component: './deviceType/deviceType',
                },
                {
                  path: '/more/deviceConfig',
                  name: '设备配置',
                  component: './deviceConfig/deviceConfig',
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
  antd: {},
  dva: {},
  dynamicImport: false,
  title: '弈简运维管控平台',
  dll: false,
  favicon: '/favicon.png',
  locale: {
    default: 'zh-CN', // default zh-CN
  },
  theme: {
    '@primary-color': '#2D6BB4', // 全局主色
    '@link-color': '#1890ff', // 链接色
    '@success-color': '#52c41a', // 成功色
    '@warning-color': '#faad14', // 警告色
    '@error-color': '#f5222d', // 错误色
    '@font-size-base': '14px', // 主字号
    '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
    '@text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
    '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
    '@disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
    '@border-radius-base': '4px', // 组件/浮层圆角
    '@border-color-base': '#d9d9d9', // 边框色
    '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
  },
  proxy: {
    '/integrated': {
      target: 'http://172.16.3.104:8103/', //dev
      changeOrigin: true,
      pathRewrite: { '': '' },
    },
  },
};
