# 微信小程序 - 二手交易平台

这是一个基于微信小程序开发的二手物品交易平台，支持用户发布、浏览和交易二手物品。

## 项目结构

```
weixin/
├── cloudfunctions/          # 云函数
│   ├── product/            # 商品相关云函数
│   ├── trade/              # 交易相关云函数
│   └── user/               # 用户相关云函数
├── miniprogram/            # 小程序主程序
│   ├── components/         # 自定义组件
│   ├── images/            # 图片资源
│   ├── pages/             # 页面文件
│   │   ├── category/      # 分类页面
│   │   ├── index/         # 首页
│   │   ├── itemDetail/    # 商品详情页
│   │   ├── mine/          # 个人中心
│   │   └── privacy/       # 隐私页面
│   ├── app.js             # 小程序入口文件
│   ├── app.json           # 小程序配置文件
│   └── app.wxss           # 全局样式文件
├── database-setup.md      # 数据库设置说明
├── deploy-guide.md        # 部署指南
└── release-checklist.md   # 发布检查清单
```

## 功能特性

- 🏠 **首页展示** - 展示热门商品和推荐内容
- 📂 **分类浏览** - 按类别浏览商品（电子、服饰、生活、书籍、二次元、其他）
- 🔍 **商品详情** - 查看商品详细信息
- 📝 **发布商品** - 用户可以发布自己的二手物品
- 👤 **个人中心** - 管理个人信息和交易记录
- 💬 **交易功能** - 支持买卖双方沟通和交易

## 技术栈

- **前端**: 微信小程序原生开发
- **后端**: 微信云开发
- **数据库**: 云数据库
- **存储**: 云存储

## 开发环境

- 微信开发者工具
- Node.js
- 微信云开发

## 安装和运行

1. 克隆项目到本地
```bash
git clone [repository-url]
cd weixin
```

2. 使用微信开发者工具打开项目

3. 配置云开发环境
   - 在微信开发者工具中开启云开发
   - 创建云开发环境
   - 配置环境ID

4. 部署云函数
   - 在cloudfunctions目录下分别部署product、trade、user云函数

5. 运行项目
   - 在微信开发者工具中点击预览或真机调试

## 部署说明

详细的部署步骤请参考 [deploy-guide.md](./deploy-guide.md)

## 数据库设置

数据库配置说明请参考 [database-setup.md](./database-setup.md)

## 发布检查

发布前的检查清单请参考 [release-checklist.md](./release-checklist.md)

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

本项目采用 MIT 许可证。 