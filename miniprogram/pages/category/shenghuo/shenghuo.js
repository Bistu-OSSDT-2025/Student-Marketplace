Page({
    data: {
      filteredItems: []
    },
    onLoad() {
      // 从全局数据筛选 category 为“生活”的物品
      const app = getApp();
      const filtered = app.globalData.items.filter(item => 
        item.category === '生活'
      );
      this.setData({ filteredItems: filtered });
    },
    goToDetail(e) {
        const itemId = e.currentTarget.dataset.id; // 获取物品 ID
        wx.navigateTo({
          url: `/pages/itemDetail/itemDetail?id=${itemId}`, // 跳转到详情页，传递 ID 参数
        });
      }
  });
  