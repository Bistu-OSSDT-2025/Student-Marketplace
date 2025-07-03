Page({
    data: {
      imageUrl: '',
      name: '',
      price: '',
      categories: ['书籍', '电子', '服饰', '生活', '二次元','其他'],
      currentCategory: '书籍',
      tag: '',
      desc: '',
      formValid: false, // 表单是否有效
      uploading: false
    },
    // 选择图片
    chooseImage() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
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
    onPriceInput(e) {
      this.setData({ price: e.detail.value }, () => this.checkFormValid());
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
      const { imageUrl, name, price, desc } = this.data;
      const valid = !!imageUrl && !!name && !!price && !!desc;
      this.setData({ formValid: valid });
    },
    // 上传图片到云存储
    async uploadImage(filePath) {
      const cloudPath = `items/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
      
      try {
        const result = await wx.cloud.uploadFile({
          cloudPath,
          filePath
        });
        return result.fileID;
      } catch (err) {
        console.error('图片上传失败:', err);
        throw err;
      }
    },
    // 发布物品
    async publishItem() {
      if (!this.data.formValid || this.data.uploading) return;
      
      this.setData({ uploading: true });
      
      try {
        // 1. 上传图片
        wx.showLoading({ title: '上传图片中...' });
        const imageUrl = await this.uploadImage(this.data.imageUrl);
        
        // 2. 发布商品
        wx.showLoading({ title: '发布商品中...' });
        const app = getApp();
        const result = await app.publishItem({
          title: this.data.name,
          desc: this.data.desc,
          images: [imageUrl],
          category: this.data.currentCategory,
          price: parseFloat(this.data.price)
        });

        if (result.result.success) {
          wx.hideLoading();
          wx.showToast({ title: '发布成功', icon: 'success' });
          
          // 刷新首页商品列表
          const indexPage = getCurrentPages().find(page => page.route === 'pages/index/index');
          if (indexPage) {
            indexPage.loadItems();
          }
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          throw new Error(result.result.msg || '发布失败');
        }
      } catch (err) {
        wx.hideLoading();
        wx.showToast({ 
          title: err.message || '发布失败，请重试', 
          icon: 'none' 
        });
      } finally {
        this.setData({ uploading: false });
      }
    }
  });
  