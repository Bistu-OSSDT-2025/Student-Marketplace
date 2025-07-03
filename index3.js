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
      // 发布商品
      case 'publish':
        return await publishProduct(data)
      
      // 查询商品列表
      case 'list':
        return await queryProducts(data)
      
      // 获取单个商品详情
      case 'detail':
        return await getProductDetail(data)
      
      // 更新商品信息
      case 'update':
        return await updateProduct(data)
      
      // 删除商品
      case 'delete':
        return await deleteProduct(data)
      
      default:
        return { success: false, msg: '未知操作类型' }
    }
  } catch (err) {
    console.error('云函数错误:', err)
    return { success: false, msg: '服务器内部错误', error: err }
  }
}

// 发布商品
async function publishProduct(data) {
  const { title, desc, images, category, price, owner } = data
  
  // 参数校验
  if (!title || !desc || !images || !category || !price || !owner) {
    return { success: false, msg: '缺少必要参数' }
  }
  
  const productData = {
    ...data,
    status: 1, // 1: 上架，0: 下架
    createTime: db.serverDate(),
    updateTime: db.serverDate()
  }
  
  const result = await db.collection('items').add({ data: productData })
  return { success: true, msg: '商品发布成功', id: result.id }
}

// 查询商品列表
async function queryProducts({ category, keyword, status, page = 1, pageSize = 20 }) {
  let query = db.collection('items')
  
  // 筛选条件
  if (category) query = query.where({ category })
  if (status !== undefined) query = query.where({ status })
  if (keyword) {
    query = query.where(_.or([
      { title: db.RegExp({ regexp: keyword, options: 'i' }) },
      { desc: db.RegExp({ regexp: keyword, options: 'i' }) }
    ]))
  }
  
  // 分页查询
  const countResult = await query.count()
  const total = countResult.total
  const totalPages = Math.ceil(total / pageSize)
  
  const products = await query
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .orderBy('createTime', 'desc')
    .get()
  
  return {
    success: true,
    data: products.data,
    page,
    pageSize,
    total,
    totalPages
  }
}

// 获取商品详情
async function getProductDetail({ id }) {
  const product = await db.collection('items').doc(id).get()
  return { success: true, data: product.data }
}

// 更新商品信息
async function updateProduct(data) {
  const { id, ...updateData } = data
  updateData.updateTime = db.serverDate()
  
  await db.collection('items').doc(id).update({ data: updateData })
  return { success: true, msg: '商品信息更新成功' }
}

// 删除商品
async function deleteProduct({ id }) {
  await db.collection('items').doc(id).remove()
  return { success: true, msg: '商品已删除' }
}