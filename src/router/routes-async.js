const routesBasic = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'view-home' */ '../components/views/ViewHome.vue'),
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: 'view-login' */ '../components/views/ViewLogin.vue'),
  },
  {
    path: '/transaction',
    component: () => import(/* webpackChunkName: 'view-transaction' */ '../components/views/ViewTransaction.vue'),
  },
  {
    path: '/transfer',
    component: () => import(/* webpackChunkName: 'view-transfer' */ '../components/views/ViewTransfer.vue'),
  },
]

const routesAsync = [...routesBasic].map((o) => o)

export default routesAsync
