Page({
    data: {
      categories: [
        {
          type: 'shuji',
          name: '书籍',
          image: '/images/category/shuji.jpg'
        },
        {
          type: 'dianzi',
          name: '电子',
          image: '/images/category/dianzi.jpg'
        },
        {
          type: 'fushi',
          name: '服饰',
          image: '/images/category/fushi.jpg'
        },
        {
          type: 'shenghuo',
          name: '生活',
          image: '/images/category/shenghuo.jpg'
        },
        {
          type: 'erciyuan',
          name: '二次元',
          image: '/images/category/erciyuan.jpg'
        },
        {
          type: 'qita',
          name: '其他',
          image: '/images/category/qita.jpg'
        }
      ]
    },
    goToCategoryDetail(e) {
      const { type } = e.currentTarget.dataset;
      // 跳转路径：/pages/category/[type]/[type]
      wx.navigateTo({
        url: `/pages/category/${type}/${type}`,
      });
    }
  });
  