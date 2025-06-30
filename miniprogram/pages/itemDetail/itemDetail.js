Page({
    data: {
      item: {}
    },
    onLoad(options) {
      const id = options.id;
      const app = getApp();
      const item = app.globalData.items.find(i => i.id == id);
      this.setData({ item });
    },
    // 复制原主微信
    copyWechat() {
      const wechat = this.data.item.ownerWechat;
      wx.setClipboardData({
        data: wechat,
        success() {
          wx.showToast({ title: '已复制微信号' });
        }
      });
    },
    // 交易确认（模拟）
    confirmTrade() {
      wx.showModal({
        title: '交易确认',
        content: '是否确认与对方达成交易？',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({ title: '交易已标记为完成' });
            // 实际需更新物品状态（如对接后端）
          }
        }
      });
    }
  });
  