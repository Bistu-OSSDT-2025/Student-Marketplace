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
      avatarUrl: '/images/avatar.png'
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
      },
    // 点击“学号认证”，显示自定义弹窗
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
    
  });