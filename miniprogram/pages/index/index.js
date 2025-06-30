Page({
    data: {
        // 新增 type 字段，值为分类的拼音（对应文件夹名）
        categories: [
          { name: '书籍', type: 'shuji' },
          { name: '电子', type: 'dianzi' },
          { name: '服饰', type: 'fushi' },
          { name: '生活', type: 'shenghuo' },
          { name: '二次元', type: 'erciyuan' },
          { name: '其他', type: 'qita' },
        ], 
        leftCategories: [], 
        rightCategories: [], 
        filteredItems: [],
        items: []
      },
      onLoad() {
        // 分割分类时按新结构处理（取 name 显示，type 用于路径）
        const left = this.data.categories.slice(0, 3); 
        const right = this.data.categories.slice(3); 
        this.setData({ 
          leftCategories: left, 
          rightCategories: right,
          filteredItems: getApp().globalData.items 
        });
        wx.cloud.callFunction({
          name: 'product',
          data: {
            action: 'list',
            data: { page: 1, pageSize: 10 }
          },
          success: res => {
            this.setData({ items: res.result.data });
          },
          fail: err => {
            wx.showToast({ title: '加载失败', icon: 'none' });
            console.error(err);
          }
        });
      },
    onSearchInput(e) {
      this.setData({ searchKey: e.detail.value });
    },
    onSearch() {
      const app = getApp();
      const filtered = app.globalData.items.filter(item => 
        item.name.includes(this.data.searchKey) || item.desc.includes(this.data.searchKey)
      );
      this.setData({ filteredItems: filtered });
    },

    // 点击物品卡片跳转到详情页
    goToDetail(e) {
      const itemId = e.currentTarget.dataset.id; // 获取物品 ID
      wx.navigateTo({
        url: `/pages/itemDetail/itemDetail?id=${itemId}`, // 跳转到详情页，传递 ID 参数
      });
    }
  });
  