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
      target: 'http://localhost:8600',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
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
      component: './Editor',
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
