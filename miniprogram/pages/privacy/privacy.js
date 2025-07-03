Page({
  data: {
    privacyContent: `
# 隐私政策

## 信息收集
我们收集的信息包括：
- 微信用户基本信息（昵称、头像）
- 用户发布的商品信息
- 交易记录信息

## 信息使用
收集的信息仅用于：
- 提供二手交易服务
- 用户身份验证
- 交易记录管理

## 信息保护
我们承诺：
- 不会泄露用户个人信息
- 不会将信息用于其他商业用途
- 采用安全措施保护用户数据

## 联系方式
如有疑问，请联系：xxx@xxx.com
    `
  },

  onLoad() {
    // 页面加载
  },

  // 复制联系方式
  copyContact() {
    wx.setClipboardData({
      data: 'xxx@xxx.com',
      success: () => {
        wx.showToast({ title: '邮箱已复制', icon: 'success' });
      }
    });
  }
}); 