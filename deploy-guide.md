# 部署指南

## 1. 云开发环境配置

### 创建云开发环境
1. 登录微信开发者工具
2. 打开云开发控制台
3. 创建新的云开发环境
4. 记录环境ID

### 配置环境ID
在 `miniprogram/app.js` 中替换环境ID：
```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的环境ID
  traceUser: true
});
```

## 2. 云函数部署

### 部署 user 云函数
1. 在微信开发者工具中右键 `cloudfunctions/user` 文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成

### 部署 product 云函数
1. 右键 `cloudfunctions/product` 文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成

### 部署 trade 云函数
1. 右键 `cloudfunctions/trade` 文件夹
2. 选择"上传并部署：云端安装依赖"
3. 等待部署完成

## 3. 数据库设置

### 创建集合
1. 进入云开发控制台 → 数据库
2. 创建以下集合：
   - users
   - items
   - orders

### 设置权限
1. 点击每个集合的"权限设置"
2. 设置为：所有用户可读，仅创建者可写

### 创建索引
为每个集合创建以下索引：

**users 集合：**
- openid (唯一索引)

**items 集合：**
- owner
- category
- status
- createTime

**orders 集合：**
- buyerOpenid
- sellerOpenid
- status
- createTime

## 4. 云存储配置

### 设置权限
1. 进入云开发控制台 → 存储
2. 设置权限为：所有用户可读，仅创建者可写

## 5. 测试部署

### 功能测试
1. 在开发者工具中预览小程序
2. 测试用户登录功能
3. 测试商品发布功能
4. 测试订单创建功能
5. 检查云函数日志是否有错误

### 真机测试
1. 上传代码到微信公众平台
2. 在真机上测试各项功能
3. 确认所有功能正常工作

## 6. 常见问题

### 云函数调用失败
- 检查环境ID是否正确
- 确认云函数已成功部署
- 查看云函数日志排查错误

### 数据库操作失败
- 检查数据库权限设置
- 确认集合名称正确
- 验证字段格式是否正确

### 图片上传失败
- 检查云存储权限设置
- 确认文件大小在限制范围内
- 验证文件格式是否支持 