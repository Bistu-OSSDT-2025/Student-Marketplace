// 云函数入口文件
// cloudfunctions/product/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  
  try {
    switch (action) {
      // 获取商品列表
      case 'list':
        return await getItemList(data)
      
      // 获取商品详情
      case 'detail':
        return await getItemDetail(data)
      
      // 发布商品
      case 'publish':
        return await publishItem(data)
      
      // 更新商品
      case 'update':
        return await updateItem(data)
      
      // 删除商品
      case 'delete':
        return await deleteItem(data)
      
      default:
        return { success: false, msg: '未知操作类型' }
    }
  } catch (err) {
    console.error('云函数错误:', err)
    return { success: false, msg: '服务器内部错误', error: err }
  }
}

// 获取商品列表
async function getItemList({ page = 0, pageSize = 10, category, keyword }) {
  let query = db.collection('items').where({ status: 'active' })
  
  // 按分类筛选
  if (category) {
    query = query.where({ category })
  }
  
  // 按关键词搜索
  if (keyword) {
    query = query.where({
      title: db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    })
  }
  
  const result = await query
    .orderBy('createTime', 'desc')
    .skip(page * pageSize)
    .limit(pageSize)
    .get()
  
  return { success: true, data: result.data }
}

// 获取商品详情
async function getItemDetail({ id }) {
  const result = await db.collection('items').doc(id).get()
  
  if (!result.data) {
    return { success: false, msg: '商品不存在' }
  }
  
  return { success: true, data: result.data }
}

// 发布商品
async function publishItem(data) {
  const { title, desc, images, category, price, owner } = data
  
  // 验证必填字段
  if (!title || !desc || !images || !category || !price || !owner) {
    return { success: false, msg: '请填写完整信息' }
  }
  
  const result = await db.collection('items').add({
    data: {
      title,
      desc,
      images,
      category,
      price: parseFloat(price),
      owner,
      status: 'active',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  
  return { success: true, msg: '发布成功', data: { id: result._id } }
}

// 更新商品
async function updateItem(data) {
  const { id, ...updateData } = data
  
  await db.collection('items').doc(id).update({
    data: {
      ...updateData,
      updateTime: db.serverDate()
    }
  })
  
  return { success: true, msg: '更新成功' }
}

// 删除商品
async function deleteItem({ id, owner }) {
  // 验证权限
  const item = await db.collection('items').doc(id).get()
  if (!item.data || item.data.owner !== owner) {
    return { success: false, msg: '无权限操作' }
  }
  
  await db.collection('items').doc(id).update({
    data: { status: 'deleted', updateTime: db.serverDate() }
  })
  
  return { success: true, msg: '删除成功' }
} 