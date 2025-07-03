// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      // 创建订单
      case 'create':
        return await createOrder(data)
      
      // 获取订单列表
      case 'list':
        return await getOrderList(data)
      
      // 获取订单详情
      case 'detail':
        return await getOrderDetail(data)
      
      // 更新订单状态
      case 'updateStatus':
        return await updateOrderStatus(data)
      
      // 取消订单
      case 'cancel':
        return await cancelOrder(data)
      
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
  const { itemId, itemTitle, itemPrice, buyerOpenid, sellerOpenid } = data
  
  // 验证必填字段
  if (!itemId || !itemTitle || !itemPrice || !buyerOpenid || !sellerOpenid) {
    return { success: false, msg: '订单信息不完整' }
  }
  
  // 检查商品是否可购买
  const item = await db.collection('items').doc(itemId).get()
  if (!item.data || item.data.status !== 'active') {
    return { success: false, msg: '商品已下架或不存在' }
  }
  
  // 检查是否是自己购买自己的商品
  if (buyerOpenid === sellerOpenid) {
    return { success: false, msg: '不能购买自己的商品' }
  }
  
  // 创建订单
  const result = await db.collection('orders').add({
    data: {
      itemId,
      itemTitle,
      itemPrice,
      buyerOpenid,
      sellerOpenid,
      status: 'pending', // pending: 待确认, confirmed: 已确认, completed: 已完成, cancelled: 已取消
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  
  return { success: true, msg: '订单创建成功', data: { id: result._id } }
}

// 获取订单列表
async function getOrderList({ openid, type = 'all', page = 0, pageSize = 10 }) {
  let query = db.collection('orders')
  
  // 根据类型筛选
  if (type === 'buy') {
    query = query.where({ buyerOpenid: openid })
  } else if (type === 'sell') {
    query = query.where({ sellerOpenid: openid })
  } else {
    // all: 获取所有相关订单
    query = query.where(db.command.or([
      { buyerOpenid: openid },
      { sellerOpenid: openid }
    ]))
  }
  
  const result = await query
    .orderBy('createTime', 'desc')
    .skip(page * pageSize)
    .limit(pageSize)
    .get()
  
  return { success: true, data: result.data }
}

// 获取订单详情
async function getOrderDetail({ id }) {
  const result = await db.collection('orders').doc(id).get()
  
  if (!result.data) {
    return { success: false, msg: '订单不存在' }
  }
  
  return { success: true, data: result.data }
}

// 更新订单状态
async function updateOrderStatus({ id, status, openid }) {
  const order = await db.collection('orders').doc(id).get()
  
  if (!order.data) {
    return { success: false, msg: '订单不存在' }
  }
  
  // 验证权限
  if (order.data.buyerOpenid !== openid && order.data.sellerOpenid !== openid) {
    return { success: false, msg: '无权限操作此订单' }
  }
  
  // 状态验证
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return { success: false, msg: '无效的状态' }
  }
  
  await db.collection('orders').doc(id).update({
    data: {
      status,
      updateTime: db.serverDate()
    }
  })
  
  return { success: true, msg: '订单状态更新成功' }
}

// 取消订单
async function cancelOrder({ id, openid }) {
  const order = await db.collection('orders').doc(id).get()
  
  if (!order.data) {
    return { success: false, msg: '订单不存在' }
  }
  
  // 只有买家可以取消订单
  if (order.data.buyerOpenid !== openid) {
    return { success: false, msg: '只有买家可以取消订单' }
  }
  
  // 只有待确认状态的订单可以取消
  if (order.data.status !== 'pending') {
    return { success: false, msg: '订单状态不允许取消' }
  }
  
  await db.collection('orders').doc(id).update({
    data: {
      status: 'cancelled',
      updateTime: db.serverDate()
    }
  })
  
  return { success: true, msg: '订单已取消' }
} 