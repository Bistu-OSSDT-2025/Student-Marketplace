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
    onLoad() {
      // 假设原本 categories 数据在这里获取
      const categories = this.getCategories(); // 你原有的获取方式
      // 初始化animated为false
      categories.forEach(item => item.animated = false);
      this.setData({ categories });
      // 依次为每个卡片添加animated，产生瀑布式动画
      categories.forEach((item, idx) => {
        setTimeout(() => {
          const key = `categories[${idx}].animated`;
          this.setData({ [key]: true });
        }, idx * 80);
      });
    },
    goToCategoryDetail(e) {
      const { type } = e.currentTarget.dataset;
      // 跳转路径：/pages/category/[type]/[type]
      wx.navigateTo({
        url: `/pages/category/${type}/${type}`,
      });
    }
  });
  