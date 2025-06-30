// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  try {
    switch (action) {
      case 'create':
        return await createOrder(data)
      case 'list':
        return await queryOrders(data)
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

async function createOrder(data) {
  const { productId, buyerOpenid, sellerOpenid, price } = data
  const product = await db.collection('items').doc(productId).get()
  if (!product.data || product.data.status !== 1) {
    return { success: false, msg: '商品不存在或已下架' }
  }
  const orderData = {
    productId,
    buyerOpenid,
    sellerOpenid,
    price,
    status: 0,
    createTime: db.serverDate(),
    updateTime: db.serverDate()
  }
  await db.runTransaction(async transaction => {
    await transaction.collection('items').doc(productId).update({
      data: { status: 2 }
    })
    await transaction.collection('orders').add({ data: orderData })
  })
  return { success: true, msg: '订单创建成功' }
}

async function queryOrders({ openid, role, status, page = 1, pageSize = 20 }) {
  let query = db.collection('orders')
  if (role === 'buyer') {
    query = query.where({ buyerOpenid: openid })
  } else if (role === 'seller') {
    query = query.where({ sellerOpenid: openid })
  }
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

async function updateOrder(data) {
  const { orderId, status } = data
  const order = await db.collection('orders').doc(orderId).get()
  if (!order.data) {
    return { success: false, msg: '订单不存在' }
  }
  await db.collection('orders').doc(orderId).update({
    data: { status, updateTime: db.serverDate() }
  })
  if (status === 3) {
    await db.collection('items').doc(order.data.productId).update({
      data: { status: 0 }
    })
  }
  return { success: true, msg: '订单状态已更新' }
} 