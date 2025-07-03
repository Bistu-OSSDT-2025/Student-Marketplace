# 数据库设置指南

## 需要创建的数据库集合

### 1. users 集合
用于存储用户信息
- 字段：openid, nickname, avatar, studentId, createTime, updateTime
- 索引：openid (唯一索引)

### 2. items 集合  
用于存储商品信息
- 字段：title, desc, images, category, price, owner, status, createTime, updateTime
- 索引：owner, category, status, createTime

### 3. orders 集合
用于存储订单信息
- 字段：itemId, itemTitle, itemPrice, buyerOpenid, sellerOpenid, status, createTime, updateTime
- 索引：buyerOpenid, sellerOpenid, status, createTime

## 设置步骤

1. 登录微信云开发控制台
2. 进入数据库管理
3. 创建上述三个集合
4. 为每个集合添加相应的索引
5. 设置数据库权限为：所有用户可读，仅创建者可写

## 测试数据示例

### 添加测试商品
```javascript
{
  "title": "二手iPhone 12",
  "desc": "9成新，无划痕，原装充电器",
  "images": ["cloud://xxx.jpg"],
  "category": "电子",
  "price": 3000,
  "owner": "test_openid",
  "status": "active",
  "createTime": "2024-01-01T00:00:00.000Z",
  "updateTime": "2024-01-01T00:00:00.000Z"
}
``` 