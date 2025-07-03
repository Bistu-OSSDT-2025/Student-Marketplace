// pages/mine/trade/trade.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],
        loading: false,
        currentTab: 'all', // all, buy, sell
        tabs: [
            { key: 'all', name: '全部' },
            { key: 'buy', name: '我买的' },
            { key: 'sell', name: '我卖的' }
        ],
        statusMap: {
            pending: '待确认',
            confirmed: '已确认',
            completed: '已完成',
            cancelled: '已取消'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadOrders();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.loadOrders();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    // 切换标签
    onTabChange(e) {
        const { key } = e.currentTarget.dataset;
        this.setData({ currentTab: key }, () => {
            this.loadOrders();
        });
    },

    // 加载订单列表
    async loadOrders() {
        const app = getApp();
        if (!app.globalData.openid) {
            wx.showToast({ title: '请先登录', icon: 'none' });
            return;
        }

        this.setData({ loading: true });

        try {
            const result = await wx.cloud.callFunction({
                name: 'trade',
                data: {
                    action: 'list',
                    data: { 
                        openid: app.globalData.openid, 
                        type: this.data.currentTab 
                    }
                }
            });

            if (result.result.success) {
                this.setData({ orders: result.result.data || [] });
            } else {
                wx.showToast({ 
                    title: result.result.msg || '加载失败', 
                    icon: 'none' 
                });
            }
        } catch (err) {
            console.error('加载订单失败:', err);
            wx.showToast({ 
                title: '网络错误，请重试', 
                icon: 'none' 
            });
        } finally {
            this.setData({ loading: false });
        }
    },

    // 更新订单状态
    async updateOrderStatus(e) {
        const { id, status } = e.currentTarget.dataset;
        const app = getApp();

        wx.showModal({
            title: '确认操作',
            content: `确定要${this.data.statusMap[status]}吗？`,
            success: async (res) => {
                if (res.confirm) {
                    try {
                        wx.showLoading({ title: '处理中...' });
                        
                        const result = await wx.cloud.callFunction({
                            name: 'trade',
                            data: {
                                action: 'updateStatus',
                                data: {
                                    id,
                                    status,
                                    openid: app.globalData.openid
                                }
                            }
                        });

                        if (result.result.success) {
                            wx.hideLoading();
                            wx.showToast({ title: '操作成功', icon: 'success' });
                            this.loadOrders(); // 刷新列表
                        } else {
                            throw new Error(result.result.msg || '操作失败');
                        }
                    } catch (err) {
                        wx.hideLoading();
                        wx.showToast({ 
                            title: err.message || '操作失败', 
                            icon: 'none' 
                        });
                    }
                }
            }
        });
    },

    // 取消订单
    async cancelOrder(e) {
        const { id } = e.currentTarget.dataset;
        const app = getApp();

        wx.showModal({
            title: '确认取消',
            content: '确定要取消这个订单吗？',
            success: async (res) => {
                if (res.confirm) {
                    try {
                        wx.showLoading({ title: '取消中...' });
                        
                        const result = await wx.cloud.callFunction({
                            name: 'trade',
                            data: {
                                action: 'cancel',
                                data: {
                                    id,
                                    openid: app.globalData.openid
                                }
                            }
                        });

                        if (result.result.success) {
                            wx.hideLoading();
                            wx.showToast({ title: '订单已取消', icon: 'success' });
                            this.loadOrders(); // 刷新列表
                        } else {
                            throw new Error(result.result.msg || '取消失败');
                        }
                    } catch (err) {
                        wx.hideLoading();
                        wx.showToast({ 
                            title: err.message || '取消失败', 
                            icon: 'none' 
                        });
                    }
                }
            }
        });
    },

    // 联系对方
    contactUser(e) {
        const { openid, role } = e.currentTarget.dataset;
        
        wx.showActionSheet({
            itemList: ['复制微信号', '发送消息'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    // 复制微信号（这里需要根据实际情况获取微信号）
                    wx.setClipboardData({
                        data: '微信号：xxx',
                        success: () => {
                            wx.showToast({ title: '微信号已复制', icon: 'success' });
                        }
                    });
                } else if (res.tapIndex === 1) {
                    // 发送消息（可以跳转到聊天页面或显示联系方式）
                    wx.showModal({
                        title: '联系方式',
                        content: '请通过微信联系对方',
                        showCancel: false
                    });
                }
            }
        });
    },

    // 查看商品详情
    viewItem(e) {
        const { itemId } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/itemDetail/itemDetail?id=${itemId}`
        });
    }
})