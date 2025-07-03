Page({
    data: {
        items: [],
        loading: false,
        hasMore: true,
        page: 0,
        pageSize: 10,
        searchKey: '',
        currentCategory: '全部',
        categories: [
          { name: '全部', icon: '/images/category.png' },
          { name: '书籍', icon: '/images/category/category-书籍.png' },
          { name: '电子', icon: '/images/category/category-电子.png' },
          { name: '服饰', icon: '/images/category/category-服饰.png' },
          { name: '生活', icon: '/images/category/category-生活.png' },
          { name: '二次元', icon: '/images/category/category-二次元.png' },
          { name: '其他', icon: '/images/category/category-其他.png' }
        ]
      },
      onLoad() {
        this.loadItems();
      },
    onShow() {
      // 页面显示时刷新数据
      this.refreshItems();
    },
    // 下拉刷新
    onPullDownRefresh() {
      this.refreshItems();
    },
    // 上拉加载更多
    onReachBottom() {
      if (this.data.hasMore && !this.data.loading) {
        this.loadMoreItems();
      }
    },
    // 搜索输入
    onSearchInput(e) {
      this.setData({ searchKey: e.detail.value });
    },
    // 搜索
    onSearch() {
      this.refreshItems();
    },
    // 点击分类
    onCategoryTap(e) {
      const { category } = e.currentTarget.dataset;
      this.setData({ currentCategory: category }, () => {
        this.refreshItems();
      });
    },
    // 刷新商品列表
    refreshItems() {
      this.setData({ 
        items: [], 
        page: 0, 
        hasMore: true 
      }, () => {
        this.loadItems();
      });
    },
    // 加载商品列表
    async loadItems() {
      if (this.data.loading) return;
      
      this.setData({ loading: true });
      
      try {
        const app = getApp();
        const params = {
          page: this.data.page,
          pageSize: this.data.pageSize
        };

        // 添加分类筛选
        if (this.data.currentCategory && this.data.currentCategory !== '全部') {
          params.category = this.data.currentCategory;
        }

        // 添加搜索关键词
        if (this.data.searchKey) {
          params.keyword = this.data.searchKey;
        }

        const result = await app.getItems(params);

        if (result.result.success) {
          const newItems = result.result.data || [];
          this.setData({
            items: this.data.page === 0 ? newItems : [...this.data.items, ...newItems],
            hasMore: newItems.length === this.data.pageSize
          });
        } else {
          wx.showToast({ 
            title: result.result.msg || '加载失败', 
            icon: 'none' 
          });
        }
      } catch (err) {
        console.error('加载商品失败:', err);
        wx.showToast({ 
          title: '网络错误，请重试', 
          icon: 'none' 
        });
      } finally {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();
      }
    },
    // 加载更多商品
    loadMoreItems() {
      this.setData({ page: this.data.page + 1 }, () => {
        this.loadItems();
      });
    },
    // 点击商品跳转到详情页
    onItemTap(e) {
      const { id } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/itemDetail/itemDetail?id=${id}`
      });
    }
  });
  