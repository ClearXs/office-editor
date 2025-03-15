import { defineConfig } from '@umijs/max';

export default defineConfig({
  esbuildMinifyIIFE: true,
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  history: {
    type: 'hash',
  },
  proxy: {
    '/api': {
      target: 'http://localhost:8700',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/office-api': {
      target: 'http://localhost:8700',
      changeOrigin: true,
      pathRewrite: { '^/office-api': '' },
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/doc',
    },
    {
      name: ' Editor',
      path: '/editor/:docId',
      component: './ParamsEditor',
      layout: false,
    },
    {
      name: 'UrlEditor',
      path: '/urlEditor/:docId',
      component: './UrlEditor',
      layout: false,
    },
    {
      name: '文档列表',
      path: '/doc',
      component: './Doc',
    },
  ],
  npmClient: 'pnpm',
});
