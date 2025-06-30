// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, data } = event
  try {
    switch (action) {
      case 'register':
        return await registerUser(data)
      case 'info':
        return await getUserInfo(data)
      default:
        return { success: false, msg: '未知操作类型' }
    }
  } catch (err) {
    console.error('云函数错误:', err)
    return { success: false, msg: '服务器内部错误', error: err }
  }
}

async function registerUser(data) {
  const { openid, studentId, nickname, avatar } = data
  const user = await db.collection('users').where({ openid }).get()
  if (user.data.length > 0) {
    await db.collection('users').where({ openid }).update({
      data: { studentId, nickname, avatar, updateTime: db.serverDate() }
    })
    return { success: true, msg: '用户信息已更新' }
  } else {
    await db.collection('users').add({
      data: {
        openid,
        studentId,
        nickname,
        avatar,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    return { success: true, msg: '用户注册成功' }
  }
}

async function getUserInfo({ openid }) {
  const user = await db.collection('users').where({ openid }).get()
  return { success: true, data: user.data[0] || null }
} 