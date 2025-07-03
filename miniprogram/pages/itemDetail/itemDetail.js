Page({
    data: {
      item: null,
      loading: true,
      isOwner: false
    },
    onLoad(options) {
      const { id } = options;
      if (id) {
        this.loadItemDetail(id);
      }
    },
    // 加载商品详情
    async loadItemDetail(id) {
      this.setData({ loading: true });
      
      try {
        const app = getApp();
        const result = await wx.cloud.callFunction({
          name: 'product',
          data: {
            action: 'detail',
            data: { id }
          }
        });

        if (result.result.success) {
          const item = result.result.data;
          const isOwner = item.owner === app.globalData.openid;
          
          this.setData({ 
            item, 
            isOwner,
            loading: false 
          });
        } else {
          wx.showToast({ 
            title: result.result.msg || '商品不存在', 
            icon: 'none' 
          });
          setTimeout(() => wx.navigateBack(), 1500);
        }
      } catch (err) {
        console.error('加载商品详情失败:', err);
        wx.showToast({ 
          title: '加载失败，请重试', 
          icon: 'none' 
        });
        this.setData({ loading: false });
      }
    },
    // 联系卖家
    contactSeller() {
      const { item } = this.data;
      if (!item) return;

      wx.showActionSheet({
        itemList: ['复制微信号', '拨打电话'],
        success: (res) => {
          if (res.tapIndex === 0) {
            // 复制微信号
            wx.setClipboardData({
              data: item.ownerWechat || '暂无微信号',
              success: () => {
                wx.showToast({ title: '微信号已复制', icon: 'success' });
              }
            });
          } else if (res.tapIndex === 1) {
            // 拨打电话
            if (item.ownerPhone) {
              wx.makePhoneCall({
                phoneNumber: item.ownerPhone
              });
            } else {
              wx.showToast({ title: '暂无联系电话', icon: 'none' });
            }
          }
        }
      });
    },
    // 创建订单
    async createOrder() {
      const { item } = this.data;
      if (!item) return;

      wx.showModal({
        title: '确认购买',
        content: `确定要购买"${item.title}"吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              wx.showLoading({ title: '创建订单中...' });
              
              const app = getApp();
              const result = await app.createOrder({
                itemId: item._id,
                itemTitle: item.title,
                itemPrice: item.price,
                sellerOpenid: item.owner
              });

              if (result.result.success) {
                wx.hideLoading();
                wx.showToast({ title: '订单创建成功', icon: 'success' });
                
                // 跳转到订单页面
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/mine/trade/trade'
                  });
                }, 1500);
              } else {
                throw new Error(result.result.msg || '创建订单失败');
              }
            } catch (err) {
              wx.hideLoading();
              wx.showToast({ 
                title: err.message || '创建订单失败', 
                icon: 'none' 
              });
            }
          }
        }
      });
    },
    // 预览图片
    previewImage(e) {
      const { current } = e.currentTarget.dataset;
      const { images } = this.data.item;
      
      wx.previewImage({
        current,
        urls: images
      });
    },
    // 分享
    onShareAppMessage() {
      const { item } = this.data;
      return {
        title: item ? item.title : '校园二手交易',
        path: `/pages/itemDetail/itemDetail?id=${item._id}`,
        imageUrl: item ? item.images[0] : ''
      };
    }
  });
  