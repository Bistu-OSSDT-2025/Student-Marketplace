Page({
    data: {
      username: '',        // 存储已认证的用户名
      studentId: '',       // 存储已认证的学号
      usernameInput: '',   // 输入框临时值（用户名）
      studentIdInput: '',  // 输入框临时值（学号）
      isAuth: false,       // 是否已认证
      studentId: '',
      isAuth: false,
      showAuthModal: false, // 控制弹窗显示
      studentIdInput: '',    // 输入框内容（双向绑定）
      avatarUrl: '/images/avatar.png',
      user: null,
      isLogin: false,
      orderCounts: {
        pending: 0,
        confirmed: 0,
        completed: 0
      }
    },
    // 用户名输入事件
    onUsernameInput(e) {
      this.setData({ usernameInput: e.detail.value });
    },
    // 学号输入事件（原有方法保留，补充逻辑）
    onStudentIdInput(e) {
      this.setData({ studentIdInput: e.detail.value });
    },

    // 确认认证（同时校验用户名和学号）
    confirmAuth() {
      const { usernameInput, studentIdInput } = this.data;
      if (usernameInput && studentIdInput) { // 两者都填写才允许认证
        this.setData({
          isAuth: true,
          username: usernameInput,
          studentId: studentIdInput,
          usernameInput: '', // 清空输入框
          studentIdInput: '',
          showAuthModal: false // 关闭弹窗
        });
      } else {
        wx.showToast({ title: '请填写完整信息', icon: 'none' });
      }
    },
    chooseAvatar() {
        wx.chooseImage({
          count: 1, // 最多选1张
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'], // 允许相册和相机
          success: (res) => {
            // 更新头像路径为临时文件路径
            this.setData({ avatarUrl: res.tempFilePaths[0] });
          }
        });
      },
      onLoad() {
        const app = getApp();
        const globalUser = app.globalData.user || {}; // 防止全局数据未定义
        
        this.setData({ 
          username: globalUser.username || '', // 读取全局用户名
          studentId: globalUser.studentId || '', // 读取全局学号
          // 必须两者都存在，才算认证
          isAuth: !!globalUser.username && !!globalUser.studentId 
        });
        this.checkLoginStatus();
      },
    // 点击"学号认证"，显示自定义弹窗
    authStudent() {
      this.setData({ showAuthModal: true });
    },
  
    // 输入学号（双向绑定）
    onStudentIdInput(e) {
      this.setData({ studentIdInput: e.detail.value });
    },
  
    // 取消认证，隐藏弹窗
    hideAuthModal() {
      this.setData({ showAuthModal: false, studentIdInput: '' });
    },
  
    // 确认认证
    
    onShow() {
      this.loadUserInfo();
      this.loadOrderCounts();
    },

    // 检查登录状态
    checkLoginStatus() {
      const app = getApp();
      const isLogin = !!(app.globalData.user && app.globalData.openid);
      this.setData({ isLogin });
    },

    // 加载用户信息
    loadUserInfo() {
      const app = getApp();
      if (app.globalData.user) {
        this.setData({ user: app.globalData.user });
      }
    },

    // 加载订单统计
    async loadOrderCounts() {
      const app = getApp();
      if (!app.globalData.openid) return;

      try {
        const result = await wx.cloud.callFunction({
          name: 'trade',
          data: {
            action: 'list',
            data: { openid: app.globalData.openid, type: 'all' }
          }
        });

        if (result.result.success) {
          const orders = result.result.data || [];
          const counts = {
            pending: 0,
            confirmed: 0,
            completed: 0
          };

          orders.forEach(order => {
            if (counts.hasOwnProperty(order.status)) {
              counts[order.status]++;
            }
          });

          this.setData({ orderCounts: counts });
        }
      } catch (err) {
        console.error('加载订单统计失败:', err);
      }
    },

    // 用户登录
    onUserLogin() {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: async (res) => {
          const app = getApp();
          app.globalData.user = res.userInfo;
          
          // 注册用户信息到数据库
          try {
            await app.registerUser({
              nickname: res.userInfo.nickName,
              avatar: res.userInfo.avatarUrl
            });
            
            this.setData({ 
              user: res.userInfo, 
              isLogin: true 
            });
            
            wx.showToast({ title: '登录成功', icon: 'success' });
          } catch (err) {
            console.error('用户注册失败:', err);
            wx.showToast({ title: '登录失败，请重试', icon: 'none' });
          }
        },
        fail: () => {
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      });
    },

    // 跳转到发布页面
    goToPublish() {
      if (!this.data.isLogin) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      wx.navigateTo({ url: '/pages/mine/publish/publish' });
    },

    // 跳转到订单页面
    goToOrders() {
      if (!this.data.isLogin) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      wx.navigateTo({ url: '/pages/mine/trade/trade' });
    },

    // 跳转到我的商品页面
    goToMyItems() {
      if (!this.data.isLogin) {
        wx.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      wx.navigateTo({ url: '/pages/mine/myItems/myItems' });
    },

    // 联系客服
    contactService() {
      wx.showModal({
        title: '联系客服',
        content: '如有问题请联系客服微信：xxx',
        showCancel: false
      });
    },

    // 关于我们
    aboutUs() {
      wx.showModal({
        title: '关于我们',
        content: '校园二手交易平台\n让闲置物品找到新主人',
        showCancel: false
      });
    },

    // 意见反馈
    feedback() {
      wx.showModal({
        title: '意见反馈',
        content: '如有建议或问题，请发送邮件至：xxx@xxx.com',
        showCancel: false
      });
    },

    // 退出登录
    logout() {
      this.setData({ user: null, isLogin: false });
      const app = getApp();
      app.globalData.user = null;
      app.globalData.openid = null;
      wx.showToast({ title: '已退出登录', icon: 'success' });
    }
  });