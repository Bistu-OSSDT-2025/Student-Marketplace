Page({
    data: {
      imageUrl: '',
      name: '',
      categories: ['书籍', '电子', '服饰', '生活', '二次元','其他'],
      currentCategory: '书籍',
      tag: '',
      desc: '',
      formValid: false // 表单是否有效
    },
    // 选择图片
    chooseImage() {
      wx.chooseImage({
        count: 1,
        success: (res) => {
          this.setData({ imageUrl: res.tempFilePaths[0] });
          this.checkFormValid();
        }
      });
    },
    // 输入事件
    onNameInput(e) {
      this.setData({ name: e.detail.value }, () => this.checkFormValid());
    },
    onCategoryChange(e) {
      const index = e.detail.value;
      this.setData({ currentCategory: this.data.categories[index] }, () => this.checkFormValid());
    },
    onTagInput(e) {
      this.setData({ tag: e.detail.value }, () => this.checkFormValid());
    },
    onDescInput(e) {
      this.setData({ desc: e.detail.value }, () => this.checkFormValid());
    },
    // 表单校验
    checkFormValid() {
      const { imageUrl, name, desc } = this.data;
      const valid = !!imageUrl && !!name && !!desc;
      this.setData({ formValid: valid });
    },
    // 发布物品（模拟）
    publishItem() {
      if (!this.data.formValid) return;
      
      const app = getApp();
      const newItem = {
        id: Date.now(),
        image: this.data.imageUrl,
        name: this.data.name,
        category: this.data.currentCategory,
        tag: this.data.tag,
        desc: this.data.desc,
        ownerWechat: app.globalData.user.wechat // 关联发布者微信
      };
      // 模拟添加到全局数据（实际需调用后端接口）
      app.globalData.items.unshift(newItem); 
      wx.showToast({ title: '发布成功' });
      wx.navigateBack(); // 返回上一页
    }
  });
  