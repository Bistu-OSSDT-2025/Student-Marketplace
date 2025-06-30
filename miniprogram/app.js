App({
    onLaunch() {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      } else {
        wx.cloud.init({
          // env 参数可以填你的云开发环境ID，留空则使用默认环境
          traceUser: true
        });
      }
      // 模拟用户信息（实际需登录态管理）
      this.globalData.user = {
        wechat: 'wxid_dev_demo', // 模拟原主微信
        studentId: '',          // 学号认证状态
        publishedItems: []      // 我的发布
      };
      // 模拟物品数据（实际需对接后端）
      this.globalData.items = [
        {
          id: 1,
          image: '/images/wupin/wp1.png',
          name: 'MacBook Air 2020',
          category: '电子',
          tag: '笔记本,闲置',
          desc: '9成新，无拆修，附赠电脑包',
          ownerWechat: 'wxid_abc123'
        },
        {
          id: 2,
          image: '/images/wupin/wp2.jpg',
          name: '村上春树作品集',
          category: '书籍',
          tag: '文学,小说',
          desc: '含《挪威的森林》《海边的卡夫卡》等6本',
          ownerWechat: 'wxid_def456'
        },
        // 3. Switch 续航版（电子）
        { 
          id: 3, 
          image: '/images/wupin/wp3.webp', 
          name: 'Switch 续航版', 
          desc: '含塞尔达、奥德赛，95新', 
          category: '电子', 
          tag: '闲置', 
          ownerWechat: 'wx_yw2025'
        },
        // 4. 机械键盘（电子）
        { 
          id: 4, 
          image: '/images/wupin/wp4.webp', 
          name: '机械键盘', 
          desc: '青轴，104键，自定义灯效', 
          category: '电子', 
          tag: '全新', 
          ownerWechat: 'wx_yw2025'
        },
        // 5. iPad Air 5（电子）
        { 
          id: 5, 
          image: '/images/wupin/wp5.webp', 
          name: 'iPad Air 5', 
          desc: '64G，深空灰，带笔', 
          category: '电子', 
          tag: '闲置', 
          ownerWechat: 'wx_yw2025'
        },
        // 6. 无线降噪耳机（电子）
        { 
          id: 6, 
          image: '/images/wupin/wp6.webp', 
          name: '无线降噪耳机', 
          desc: '主动降噪，续航20小时', 
          category: '电子', 
          tag: '闲置', 
          ownerWechat: 'wx_yw2025'
        },
        // 7. 健身环大冒险（二次元）
        { 
          id: 7, 
          image: '/images/wupin/wp7.webp', 
          name: '健身环大冒险', 
          desc: 'Switch配件，几乎全新', 
          category: '二次元',      // 对应分类：二次元
          tag: '全新', 
          ownerWechat: 'wx_yw2025'
        },
        // 8. 精装版四大名著（书籍）
        { 
          id: 8, 
          image: '/images/wupin/wp8.webp', 
          name: '精装版四大名著', 
          desc: '硬壳装订，收藏版', 
          category: '书籍', 
          tag: '闲置', 
          ownerWechat: 'wx_yw2025'
        },
        // 9-14：书籍类（6个）
        {
          id: 9,
          image: '/images/wupin/wp9.jpg',
          name: '考研英语一真题（2021-2025）',
          category: '书籍',
          tag: '考研,闲置',
          desc: '含详细解析，页面无涂鸦，九成新',
          ownerWechat: 'wx_yw2025'
        },
        {
    id: 10,
    image: '/images/wupin/wp10.jpg',
    name: 'Python数据分析实战',
    category: '书籍',
    tag: '编程,学习',
    desc: '配图清晰，代码可直接运行，无折角',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 11,
    image: '/images/wupin/wp11.jpg',
    name: '平凡的世界（全3册）',
    category: '书籍',
    tag: '文学,闲置',
    desc: '无划线，书脊完好，成套出',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 12,
    image: '/images/wupin/wp12.webp',
    name: '计算机网络（谢希仁版）',
    category: '书籍',
    tag: '教材,九成新',
    desc: '期末复习用，笔记少，重点标黄',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 13,
    image: '/images/wupin/wp13.jpg',
    name: '决战行测5000题（判断推理）',
    category: '书籍',
    tag: '考公,练习',
    desc: '做过100题，答案完整，解析清晰',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 14,
    image: '/images/wupin/wp14.webp',
    name: '东野圭吾推理集（10本）',
    category: '书籍',
    tag: '小说,闲置',
    desc: '无折痕，封面完好，成套出',
    ownerWechat: 'wx_yw2025'
        },
        // 15-20：生活类（6个）
        {
    id: 15,
    image: '/images/wupin/wp15.jpg',
    name: '宿舍三层收纳柜',
    category: '生活',
    tag: '生活,收纳',
    desc: '灰白色，塑料材质，无破损',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 16,
    image: '/images/wupin/wp16.webp',
    name: '小浣熊电煮锅',
    category: '生活',
    tag: '厨房,闲置',
    desc: '带蒸笼，用过5次，清洁干净',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 17,
    image: '/images/wupin/wp17.webp',
    name: '折叠床上桌',
    category: '生活',
    tag: '宿舍,学习',
    desc: '木质，80×40cm，折叠方便',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 18,
    image: '/images/wupin/wp18.webp',
    name: '小米手持挂烫机',
    category: '生活',
    tag: '衣物,九成新',
    desc: '出差常用，蒸汽足，小巧便携',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 19,
    image: '/images/wupin/wp19.webp',
    name: '加厚瑜伽垫（6mm）',
    category: '生活',
    tag: '运动,闲置',
    desc: '粉色，防滑，练习瑜伽/健身',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 20,
    image: '/images/wupin/wp20.webp',
    name: '不锈钢保温杯（500ml）',
    category: '生活',
    tag: '日常,九成新',
    desc: '黑色，保温6小时，无划痕',
    ownerWechat: 'wx_yw2025'
        },
        // 21-26：电子类（6个）
        {
    id: 21,
    image: '/images/wupin/wp21.webp',
    name: '罗技M330无线鼠标',
    category: '电子',
    tag: '电子,办公',
    desc: '灰色，静音，电池耐用',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 22,
    image: '/images/wupin/wp22.webp',
    name: 'ikbc红轴机械键盘',
    category: '电子',
    tag: '键盘,闲置',
    desc: '87键，无灯效，按键灵敏',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 23,
    image: '/images/wupin/wp23.png',
    name: '罗马仕20000mAh充电宝',
    category: '电子',
    tag: '充电,九成新',
    desc: '带数显，双口输出，容量足',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 24,
    image: '/images/wupin/wp24.png',
    name: '小度蓝牙音箱',
    category: '电子',
    tag: '影音,闲置',
    desc: '可连手机，低音效果好',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 25,
    image: '/images/wupin/wp25.png',
    name: '二手iPhone 12（64G）',
    category: '电子',
    tag: '手机,二手',
    desc: '黑色，电池85%，无锁无修',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 26,
    image: '/images/wupin/wp26.png',
    name: '雷蛇电竞头戴耳机',
    category: '电子',
    tag: '游戏,闲置',
    desc: '带麦，听声辨位，吃鸡专用',
    ownerWechat: 'wx_yw2025'
        },
  
        // 27-32：二次元类（6个）
        {
    id: 27,
    image: '/images/wupin/wp27.png',
    name: '原神可莉手办（正版）',
    category: '二次元',
    tag: '手办,全新',
    desc: '未拆盒，仅展示，官网购入',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 28,
    image: '/images/wupin/wp28.png',
    name: '祢豆子毛绒抱枕（50cm）',
    category: '二次元',
    tag: '抱枕,闲置',
    desc: '柔软亲肤，无掉毛，鬼灭之刃',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 29,
    image: '/images/wupin/wp29.png',
    name: '动漫周边收纳盒（三层）',
    category: '二次元',
    tag: '周边,收纳',
    desc: '亚克力材质，放谷子/手办',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 30,
    image: '/images/wupin/wp30.png',
    name: '五条悟亚克力立牌',
    category: '二次元',
    tag: '立牌,闲置',
    desc: '高清印刷，无划痕，咒术回战',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 31,
    image: '/images/wupin/wp31.png',
    name: '初音未来头戴耳机',
    category: '二次元',
    tag: '耳机,二次元',
    desc: '粉色，可折叠，初音联名款',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 32,
    image: '/images/wupin/wp32.png',
    name: '海贼王路飞T恤（L码）',
    category: '二次元',
    tag: '服饰,动漫',
    desc: '纯棉材质，九成新，印花清晰',
    ownerWechat: 'wx_yw2025'
        },
  
        // 33-38：服饰类（6个）
        {
    id: 33,
    image: '/images/wupin/wp33.jpg',
    name: '优衣库U系列衬衫（M码）',
    category: '服饰',
    tag: '衬衫,闲置',
    desc: '白色，商务休闲，无褶皱',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 34,
    image: '/images/wupin/wp34.jpg',
    name: '李宁运动短裤（L码）',
    category: '服饰',
    tag: '运动,九成新',
    desc: '黑色，速干面料，侧边口袋',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 35,
    image: '/images/wupin/wp35.jpg',
    name: '女款白鸭绒羽绒服（S码）',
    category: '服饰',
    tag: '冬装,闲置',
    desc: '白色，充绒量足，保暖轻便',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 36,
    image: '/images/wupin/wp36.jpg',
    name: '匡威1970s（42码，黑色）',
    category: '服饰',
    tag: '鞋子,二手',
    desc: '穿过5次，鞋底磨损小，无开胶',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 37,
    image: '/images/wupin/wp37.jpg',
    name: '灰色羊毛围巾',
    category: '服饰',
    tag: '配饰,闲置',
    desc: '保暖亲肤，无起球，长度180cm',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 38,
    image: '/images/wupin/wp38.jpg',
    name: '潮牌棒球服（XL码，黑色）',
    category: '服饰',
    tag: '外套,九成新',
    desc: '印花潮流，宽松版型，适合日常',
    ownerWechat: 'wx_yw2025'
        },
  
        // 39-44：其他类（6个）
        {
    id: 39,
    image: '/images/wupin/wp39.png',
    name: '双翘滑板（8.0寸，黑色）',
    category: '其他',
    tag: '运动,闲置',
    desc: '配新砂纸，轴承顺滑，送工具',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 40,
    image: '/images/wupin/wp40.png',
    name: '23寸桃花心木尤克里里',
    category: '其他',
    tag: '乐器,九成新',
    desc: '音色温润，送琴包和教材',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 41,
    image: '/images/wupin/wp41.png',
    name: '拍立得mini11（粉色）',
    category: '其他',
    tag: '摄影,二手',
    desc: '用过10次，含10张相纸，功能正常',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 42,
    image: '/images/wupin/wp42.png',
    name: '可充电露营灯',
    category: '其他',
    tag: '户外,闲置',
    desc: '三档亮度，防水，露营/应急用',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 43,
    image: '/images/wupin/wp43.png',
    name: 'A5方格手账本',
    category: '其他',
    tag: '文具,闲置',
    desc: '内页空白，送贴纸和分隔页',
    ownerWechat: 'wx_yw2025'
        },
        {
    id: 44,
    image: '/images/wupin/wp44.png',
    name: '红双喜双拍乒乓球拍',
    category: '其他',
    tag: '运动,九成新',
    desc: '含3个乒乓球，拍面无磨损',
    ownerWechat: 'wx_yw2025'
        }
      ];
    },
    globalData: {
      user:{
          username: '',
          studentId:''
      },
      items: []
    }
  });
  