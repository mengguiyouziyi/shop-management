export default {
  pages: [
    'pages/index/index',
    'pages/search/index',
    'pages/products/list/index',
    'pages/products/detail/index',
    'pages/products/create/index',
    'pages/orders/list/index',
    'pages/orders/detail/index',
    'pages/orders/pos/index',
    'pages/members/list/index',
    'pages/members/detail/index',
    'pages/settings/index',
    'pages/reports/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '店铺管理系统',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: true,
  },
  tabBar: {
    color: '#666',
    selectedColor: '#1890ff',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        pagePath: 'pages/products/list/index',
        text: '商品',
      },
      {
        pagePath: 'pages/orders/list/index',
        text: '订单',
      },
      {
        pagePath: 'pages/members/list/index',
        text: '会员',
      },
      {
        pagePath: 'pages/reports/index',
        text: '统计',
      },
    ],
  },
};
