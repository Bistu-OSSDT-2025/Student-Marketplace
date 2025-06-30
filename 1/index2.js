// 云函数入口文件
// cloudfunctions/trade/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      // 创建订单
      case 'create':
        return await createOrder(data)
      
      // 获取订单列表
      case 'list':
        return await queryOrders(data)
      
      // 更新订单状态
      case 'update':
        return await updateOrder(data)
      
      default:
        return { success: false, msg: '未知操作类型' }
    }
  } catch (err) {
    console.error('云函数错误:', err)
    return { success: false, msg: '服务器内部错误', error: err }
  }
}

// 创建订单
async function createOrder(data) {
  const { productId, buyerOpenid, sellerOpenid, price } = data
  
  // 检查商品是否存在且可交易
  const product = await db.collection('items').doc(productId).get()
  if (!product.data || product.data.status !== 1) {
    return { success: false, msg: '商品不存在或已下架' }
  }
  
  // 创建订单
  const orderData = {
    productId,
    buyerOpenid,
    sellerOpenid,
    price,
    status: 0, // 0: 待支付，1: 已支付，2: 已发货，3: 已完成，4: 已取消
    createTime: db.serverDate(),
    updateTime: db.serverDate()
  }
  
  // 同时更新商品状态为"已预订"
  await db.runTransaction(async transaction => {
    await transaction.collection('items').doc(productId).update({
      data: { status: 2 } // 2: 已预订
    })
    
    await transaction.collection('orders').add({ data: orderData })
  })
  
  return { success: true, msg: '订单创建成功' }
}

// 查询订单列表
async function queryOrders({ openid, role, status, page = 1, pageSize = 20 }) {
  let query = db.collection('orders')
  
  // 根据角色筛选（买家或卖家）
  if (role === 'buyer') {
    query = query.where({ buyerOpenid: openid })
  } else if (role === 'seller') {
    query = query.where({ sellerOpenid: openid })
  }
  
  // 根据订单状态筛选
  if (status !== undefined) {
    query = query.where({ status })
  }
  
  const countResult = await query.count()
  const total = countResult.total
  const totalPages = Math.ceil(total / pageSize)
  
  const orders = await query
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .orderBy('createTime', 'desc')
    .get()
  
  return {
    success: true,
    data: orders.data,
    page,
    pageSize,
    total,
    totalPages
  }
}

// 更新订单状态
async function updateOrder(data) {
  const { orderId, status } = data
  
  // 获取订单详情
  const order = await db.collection('orders').doc(orderId).get()
  if (!order.data) {
    return { success: false, msg: '订单不存在' }
  }
  
  // 更新订单状态
  await db.collection('orders').doc(orderId).update({
    data: { status, updateTime: db.serverDate() }
  })
  
  // 如果订单完成，更新商品状态为"已售出"
  if (status === 3) {
    await db.collection('items').doc(order.data.productId).update({
      data: { status: 0 } // 0: 下架
    })
  }
  
  return { success: true, msg: '订单状态已更新' }
}