(async () => {
  const LEGACY_STORAGE_KEY = 'yudeng-town-v1';
  let activeTownId = localStorage.getItem('society-active-town') || 'yudeng-main';
  const STORAGE_KEY = `yudeng-town-v2:${activeTownId}`;
  const periods = [
    { name: '早晨', time: '08:00', icon: '☀', weather: '晴朗' },
    { name: '午间', time: '12:00', icon: '☼', weather: '晴朗' },
    { name: '下午', time: '16:00', icon: '◒', weather: '微风' },
    { name: '夜晚', time: '20:00', icon: '☾', weather: '灯火初上' },
  ];
  const facilityTypes = {
    home: { name: '小院民居', icon: '⌂', color: '#b97e62', cost: 28, kind: 'home', subtitle: '有人住着的地方' },
    office: { name: '榆树写字楼', icon: '▥', color: '#77959a', cost: 58, kind: 'work', subtitle: '工作与创意' },
    school: { name: '灯塔学校', icon: '▤', color: '#cfab59', cost: 54, kind: 'study', subtitle: '学习与成长' },
    clinic: { name: '社区诊所', icon: '✚', color: '#8eaa89', cost: 62, kind: 'care', subtitle: '健康与照护' },
    market: { name: '街角超市', icon: '▧', color: '#c78568', cost: 42, kind: 'shop', subtitle: '食物与日用品' },
    cafe: { name: '慢慢咖啡馆', icon: '☕', color: '#aa8a6b', cost: 36, kind: 'social', subtitle: '闲谈与相遇' },
    petshop: { name: '小尾巴宠物店', icon: '♧', color: '#9a8cb0', cost: 39, kind: 'pet', subtitle: '和动物做朋友' },
    toilet: { name: '街区公厕', icon: '🚻', color: '#83a3a5', cost: 18, kind: 'toilet', subtitle: '干净又方便' },
    park: { name: '榆树公园', icon: '♣', color: '#75a078', cost: 26, kind: 'social', subtitle: '散步与放松' },
    plaza: { name: '灯塔小广场', icon: '✳', color: '#c9ad6c', cost: 22, kind: 'social', subtitle: '街坊碰面的地方' },
    fishing: { name: '河岸钓点', icon: '🎣', color: '#79a4ad', cost: 24, kind: 'fishing', subtitle: '钓鱼与吹风' },
    training: { name: '社区训练馆', icon: '◎', color: '#bc8b71', cost: 48, kind: 'training', subtitle: '体能与武器训练' },
    farm: { name: '河岸菜地', icon: '♧', color: '#8caa70', cost: 42, kind: 'farm', subtitle: '种植与收获' },
    restaurant: { name: '榆灯餐厅', icon: '♨', color: '#c58b68', cost: 52, kind: 'food', subtitle: '热饭与邻里餐桌' },
    townhall: { name: '镇公所', icon: '⌂', color: '#879887', cost: 58, kind: 'government', subtitle: '公共预算与居民提案' },
    police: { name: '警务室', icon: '⚑', color: '#7189a0', cost: 64, kind: 'justice', subtitle: '巡逻、报案与调查' },
    prosecutor: { name: '检察院', icon: '⚖', color: '#9688a4', cost: 78, kind: 'justice', subtitle: '审查证据与提起公诉' },
    courthouse: { name: '人民法院', icon: '⚖', color: '#b39b69', cost: 88, kind: 'justice', subtitle: '公开审理与判决' },
    prison: { name: '看守所', icon: '▦', color: '#8d7775', cost: 70, kind: 'justice', subtitle: '执行拘留与有期徒刑' },
  };
  const facilityDetails = {
    home: { capacity: 4, services: '居住、休息、恢复精力、晚间电视新闻', manager: '住户自行维护', access: '住户与访客' },
    office: { capacity: 8, services: '工作、协作、创作', manager: '入驻团队', access: '工作时段开放' },
    school: { capacity: 12, services: '学习、授课、社区活动', manager: '教师与学生', access: '白天开放' },
    clinic: { capacity: 6, services: '健康检查、基础医疗、照护', manager: '医护人员', access: '全天候服务' },
    market: { capacity: 8, services: '食品、日用品、补给', manager: '店主', access: '白天开放' },
    cafe: { capacity: 6, services: '餐饮、交谈、邻里消息、本地电视新闻', manager: '主理人', access: '营业时段开放' },
    petshop: { capacity: 4, services: '宠物照料、美容、领养咨询', manager: '店员', access: '营业时段开放' },
    toilet: { capacity: 4, services: '卫生间、清洁', manager: '镇公所', access: '全天开放' },
    park: { capacity: 14, services: '休憩、散步、园艺、社交', manager: '镇公所与居民', access: '全天开放' },
    plaza: { capacity: 18, services: '集会、节庆、公共公告', manager: '镇公所', access: '全天开放' },
    fishing: { capacity: 5, services: '钓鱼、休闲、河岸观察', manager: '河岸共管小组', access: '日间开放' },
    training: { capacity: 8, services: '体能锻炼、器械与武器训练', manager: '教练与学员', access: '预约开放' },
    farm: { capacity: 6, services: '播种、照料作物、收获食物', manager: '农户与园艺师', access: '白天劳作' },
    restaurant: { capacity: 10, services: '供应热饭、采购食材、邻里用餐', manager: '厨师与经营者', access: '午间至夜晚营业' },
    townhall: { capacity: 8, services: '镇务提案、预算、公共服务协调', manager: '镇政府公职人员', access: '工作时段开放' },
    police: { capacity: 8, services: '治安巡逻、接收报案、调查案件', manager: '警察与治安人员', access: '全天候值守' },
    prosecutor: { capacity: 6, services: '审查证据、决定是否起诉', manager: '检察官', access: '工作时段开放' },
    courthouse: { capacity: 8, services: '审判案件、裁定赔偿与刑期', manager: '法官与书记员', access: '开庭时开放' },
    prison: { capacity: 8, services: '收押服刑人员、管理刑期', manager: '监所工作人员', access: '全天候管理' },
  };
  const facilityProgression = {
    home: { max: 10, names: ['小院民居','联排住宅','街坊公寓','多层公寓','社区住宅楼','综合住宅楼','邻里生活社区','大型居住社区','城市住宅中心','宜居示范社区'], shapes: ['single','barH','L3','square4','P5','rect6','L7','block9','wide12','block16'], gain: 0.11 },
    clinic: { max: 10, names: ['社区诊所','社区卫生站','社区医院','综合医院','二级综合医院','县级人民医院','三级综合医院','三级甲等医院','区域医疗中心','三甲医院'], shapes: ['single','barH','L3','square4','T5','rect6','L7','block9','wide12','block16'], gain: 0.15 },
    school: { max: 8, names: ['社区课堂','完全小学','九年一贯制学校','中学教学楼','高级中学','职业技术学校','综合大学','大学城校区'], shapes: ['single','barV','L3','rect4','T5','wide6','block9','rect12'], gain: 0.13 },
    office: { max: 8, names: ['共享工作间','小型办公楼','创新中心','商务楼','企业园区','科技园','产业中心','城市商务中心'], shapes: ['single','barH','L3','square4','P5','rect6','block9','rect12'], gain: 0.12 },
    market: { max: 7, names: ['街角小店','社区超市','生活超市','邻里商场','购物中心','区域商业中心','城市商业综合体'], shapes: ['single','barH','L3','square4','rect6','wide6','block9'], gain: 0.13 },
    cafe: { max: 6, names: ['街角咖啡馆','社区咖啡馆','文化沙龙','邻里会客中心','城市文化空间','综合文化中心'], shapes: ['single','barH','L3','P5','rect6','block9'], gain: 0.12 },
    petshop: { max: 5, names: ['宠物小店','宠物护理中心','动物诊疗站','宠物综合医院','动物福利中心'], shapes: ['single','barH','L3','square4','rect6'], gain: 0.12 },
    toilet: { max: 4, names: ['街区公厕','无障碍卫生间','社区公共卫浴','综合公共卫生中心'], shapes: ['single','barH','L3','square4'], gain: 0.1 },
    park: { max: 6, names: ['街角绿地','社区公园','滨河公园','综合运动公园','城市中央公园','生态休闲公园'], shapes: ['single','barV','L3','T5','wide6','block9'], gain: 0.1 },
    plaza: { max: 6, names: ['街坊小广场','社区广场','文化活动广场','市民中心广场','城市会客广场','综合公共活动中心'], shapes: ['single','barH','L3','square4','rect6','block9'], gain: 0.11 },
    fishing: { max: 3, names: ['河岸钓点','滨河垂钓区','水上休闲中心'], shapes: ['single','barH','barV'], gain: 0.1 },
    training: { max: 8, names: ['露天训练点','社区健身房','综合训练馆','武道训练中心','竞技训练中心','专业体育馆','区域体育中心','城市体育综合体'], shapes: ['single','barH','L3','square4','T5','rect6','block9','rect12'], gain: 0.14 },
    farm: { max: 7, names: ['家庭菜地','社区农场','设施农业园','综合种植基地','生态农业园','农业合作社','区域农业中心'], shapes: ['single','barH','barV','L3','rect4','rect6','wide8'], gain: 0.16 },
    restaurant: { max: 7, names: ['街坊食堂','社区餐厅','特色餐馆','美食广场','综合餐饮中心','区域餐饮中心','城市美食中心'], shapes: ['single','barH','L3','square4','T5','rect6','block9'], gain: 0.15 },
    townhall: { max: 5, names: ['居民服务点','镇公所','镇政府大楼','综合政务中心','区域公共服务中心'], shapes: ['single','barH','L3','square4','P5'], gain: 0.12 },
    police: { max: 5, names: ['治安岗亭','警务室','派出所','公安分局','区域警务中心'], shapes: ['single','barH','L3','square4','P5'], gain: 0.13 },
    prosecutor: { max: 4, names: ['法律服务点','检察联络室','检察院','县级检察院'], shapes: ['single','barH','L3','square4'], gain: 0.12 },
    courthouse: { max: 5, names: ['巡回法庭','人民法庭','基层人民法院','县人民法院','综合审判中心'], shapes: ['single','barH','L3','square4','P5'], gain: 0.12 },
    prison: { max: 4, names: ['临时羁押室','看守所','拘留所','县级监狱'], shapes: ['single','barH','L3','square4'], gain: 0.1 },
  };
  const footprintShapes = {
    single: [[0,0]], barH: [[0,0],[1,0]], barV: [[0,0],[0,1]], L3: [[0,0],[1,0],[0,1]], rect4: [[0,0],[1,0],[0,1],[1,1]],
    square4: [[0,0],[1,0],[0,1],[1,1]], T5: [[0,0],[1,0],[2,0],[1,1],[1,2]], P5: [[0,0],[1,0],[0,1],[1,1],[0,2]],
    rect6: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], wide6: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1]], L7: [[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2]],
    block9: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]], rect12: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2]],
    wide8: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]], wide12: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2]],
    block16: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2],[0,3],[1,3],[2,3],[3,3]],
  };
  const AGE_DAYS_PER_YEAR = 2;
  const AGE_STAGE_POINTS = { 3: ['emotional','strength'], 6: ['intelligence','emotional'], 12: ['intelligence','speed'], 15: ['charisma','intelligence'], 18: ['financial','emotional'], 22: ['intelligence','financial'] };
  const townLore = {
    title: '河岸小镇，旧站新生',
    summary: '榆灯镇沿着旧河道和停运的支线铁路长大。洪水带走了老桥，铁路复线计划又带来新的机会；居民要决定，小镇如何在变化里留下自己的生活。',
    history: '最早一批住户在老榆树旁点起灯，给夜里赶车的人指路，榆灯镇因此得名。后来木材列车、河运和县道把这里连向外面的世界。十年前的洪水冲坏了石桥，支线铁路也随之停运。如今县里准备修复铁路与河岸步道，年轻人开始回来，老住户则担心小镇会失去熟悉的节奏。',
    geography: '北面是青岚丘陵和旧采石场，东侧有停用的铁路支线；南边的青岚县城提供医院、集市和学校资源。镇子西侧顺河而下，河水与季节性降雨会影响钓点、菜地和交通。',
    outside: '青岚县正修整通往县城的公路；上游水库管理处会发布汛期水情；铁路复线团队征集意见。附近还会发生洪水、疾病、罢工、盗窃和经济衰退，榆灯镇并非总能平稳度日。',
  };
  const outsideUpdates = [
    { headline: '县道养护进入收尾阶段', description: '物资车预计明天恢复通行，超市补货会更稳定。', effect: 'supply' },
    { headline: '上游水库发布平稳水情', description: '本周河水水位正常，河岸钓点和步道保持开放。', effect: 'river' },
    { headline: '县城周末集市开始招募摊主', description: '新摊位可能给本地店铺带来订单，也会吸引访客。', effect: 'market' },
    { headline: '铁路复线工作组征集意见', description: '居民可以讨论旧站周边要保留什么、增加什么。', effect: 'rail' },
    { headline: '气象站提醒午后有阵雨', description: '河岸步道可能暂时湿滑，室内公共空间会更热闹。', effect: 'rain' },
    { headline: '上游暴雨，河水水位快速上涨', description: '菜地和沿河道路面临漫水风险，居民需要检查堤岸和储粮。', effect: 'flood' },
    { headline: '邻县流感进入高发期', description: '诊所提醒注意休息和卫生，密切接触者可能出现发热。', effect: 'illness' },
    { headline: '货运工会临时停工', description: '外部采购延迟、物价上涨，镇上的存粮会变得紧张。', effect: 'strike' },
    { headline: '夜间仓库发生盗窃案', description: '治安压力升高，商户开始担心货物和现金安全。', effect: 'crime' },
    { headline: '县城工厂裁员，求职者向镇上流动', description: '短期内劳动力和住房需求上升，部分居民也担心收入减少。', effect: 'recession' },
    { headline: '寒潮提前抵达河谷', description: '老人和体弱者更容易生病，建筑和作物也需要防寒维护。', effect: 'cold' },
  ];
  const scalePresets = [
    { id: 'neighborhood', label: '邻里街区', width: 6, height: 4, note: '紧凑、步行友好' },
    { id: 'old-town', label: '扩展镇区', width: 8, height: 5, note: '增加一片新街区' },
    { id: 'river-town', label: '河谷镇域', width: 10, height: 6, note: '为长期发展预留空间' },
  ];
  const palette = ['#e8efe2', '#f2e7db', '#e5edf0', '#f2ecd9', '#ece6f0', '#e5ece8', '#f0e5df', '#e9eddc'];
  const residentIdentities = {
    'lin-yao': { gender: '女', age: 29, mbti: 'ISFJ', zodiac: '巨蟹座', alignment: 76 }, 'zhou-yan': { gender: '男', age: 31, mbti: 'ENFP', zodiac: '双子座', alignment: 48 }, 'a-mu': { gender: '女', age: 28, mbti: 'ENFJ', zodiac: '天秤座', alignment: 72 },
    'gu-feng': { gender: '男', age: 34, mbti: 'INTJ', zodiac: '摩羯座', alignment: 32 }, 'shen-he': { gender: '女', age: 30, mbti: 'INFJ', zodiac: '双鱼座', alignment: 52 }, 'ke-ke': { gender: '女', age: 25, mbti: 'ESFP', zodiac: '狮子座', alignment: 74 },
    'tang-qiao': { gender: '女', age: 36, mbti: 'ESTJ', zodiac: '金牛座', alignment: 24 }, 'xu-yi': { gender: '男', age: 38, mbti: 'ISTP', zodiac: '处女座', alignment: 42 }, 'mei-ling': { gender: '女', age: 62, mbti: 'ISFP', zodiac: '金牛座', alignment: 78 },
    'xu-dong': { gender: '男', age: 24, mbti: 'ESTP', zodiac: '白羊座', alignment: 18 }, 'ning-ke': { gender: '女', age: 17, mbti: 'INTP', zodiac: '水瓶座', alignment: 58 }, 'qiu-shi': { gender: '男', age: 45, mbti: 'ISTJ', zodiac: '天蝎座', alignment: 62 },
    'villain-1': { gender: '男', age: 36, mbti: 'ENTJ', zodiac: '天蝎座', alignment: -62 },
    'public-official': { gender: '女', age: 33, mbti: 'ESTJ', zodiac: '摩羯座', alignment: 61 },
  };
  const mbtiTraits = {
    ISTJ: '守序、务实、重承诺', ISFJ: '体贴、谨慎、重视熟人', INFJ: '敏锐、理想主义、重视意义', INTJ: '独立、善于规划、目标明确',
    ISTP: '冷静、动手能力强、喜欢自由', ISFP: '温和、审美敏锐、重视感受', INFP: '理想主义、共情、珍视原则', INTP: '好奇、爱分析、喜欢追问',
    ESTP: '果断、行动快、喜欢挑战', ESFP: '热情、随和、享受当下', ENFP: '热心、想象力丰富、容易被新点子吸引', ENTP: '机敏、好辩、乐于试验',
    ESTJ: '直接、讲效率、善于组织', ESFJ: '热心、擅长照顾群体、在意认可', ENFJ: '善于鼓舞他人、敏感、重视关系', ENTJ: '强势、擅长谋划、看重结果',
  };
  const zodiacNames = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
  const zodiacFlavors = { 白羊座: '更愿意先行动', 金牛座: '偏爱稳定和熟悉的节奏', 双子座: '更容易被新消息吸引', 巨蟹座: '对家庭和归属更敏感', 狮子座: '更在意表达与认可', 处女座: '更留心细节和秩序', 天秤座: '更愿意协商与平衡', 天蝎座: '对信任和秘密格外敏感', 射手座: '更向往探索和变化', 摩羯座: '更重视长期计划', 水瓶座: '更愿意尝试不同做法', 双鱼座: '更容易共情和沉浸想象' };
  const residentBackgrounds = {
    'lin-yao': { story: '林遥在青岚县医院学护理，最初只打算回镇上照顾生病的外婆。洪水那年，她在临时安置点连续值班，看到邻里互相照看的样子，决定留下来做社区护士。', turningPoint: '她把老车站候车室改成临时诊疗点，第一次发现熟悉街坊的名字和习惯同样能救人。', privateWish: '她希望镇上有一支稳定的志愿照护队，这样自己也能放心休息一天。', values: '可靠、耐心、尊重每个人的选择' },
    'zhou-yan': { story: '周砚小时候常在外婆的小茶铺写作业。去大城市做过餐饮策划后，他发现自己记得最清楚的不是名店，而是街坊在一张桌子旁说过的话，于是回镇把旧茶铺改成了咖啡馆。', turningPoint: '一次暴雨停电时，邻居们挤进咖啡馆点起蜡烛，他决定让这里一直保留一张不用消费也能坐的桌子。', privateWish: '他想办一场由镇民自己设计菜单的夜市。', values: '好奇、分享、让陌生人也有位置' },
    'a-mu': { story: '阿沐在县城长大，大学毕业后接下灯塔学校的代课工作。她原本担心小镇课程资源少，后来发现孩子们对身边事物的问题，比课本上的标准答案更有意思。', turningPoint: '一名学生用废木料做出会转动的水位标记，让她开始组织跨年级的社区小课堂。', privateWish: '她想为每个孩子找到一种能被看见的长处，也希望学校重新开办晚间成人课。', values: '耐心、好奇、公平' },
    'gu-feng': { story: '顾逢从父亲修理收音机的工作台边学会拆装东西，后来在省城做软件工程师。返乡后，他发现不少公共信息仍贴在褪色的纸板上，便开始为镇公所做一套简单的设施和交通信息工具。', turningPoint: '他写的第一个小程序帮诊所找到了一位走失老人，之后他开始把技术时间留给镇上的实际需要。', privateWish: '他想搭一张不依赖网络也能工作的社区信息网。', values: '实用、安静、把复杂事说清楚' },
    'shen-he': { story: '沈禾在城里的插画工作室做过几年商业项目，画得越来越熟练，却很少画自己喜欢的地方。她回到榆灯镇后，开始为店铺招牌、校刊和居民的旧照片画小图。', turningPoint: '她为一位老人画下被洪水冲走的桥，老人把画挂在客厅，说这样孙辈就知道桥曾经在哪里。', privateWish: '她想做一本记录镇民记忆的图画册，并为每条街画一幅小地图。', values: '观察、诚实、保存细小的记忆' },
    'ke-ke': { story: '可可小时候常把受伤的小动物带回家，家人教她先观察、再靠近。她在宠物护理学校毕业后，选择回镇开小尾巴宠物店，也为暂时无家可归的动物留出寄养位置。', turningPoint: '她照顾过一只怕人的老狗三个月，直到它愿意主动靠近新主人，这让她相信耐心比催促更有用。', privateWish: '她想和学校一起办儿童动物照护课，也想建一处小型领养角。', values: '温柔、责任、不过度打扰' },
    'tang-qiao': { story: '唐乔跟着父母在镇上做了十几年杂货生意。她熟悉谁家忘了买盐、哪位老人喜欢早晨买豆浆，也亲历过洪水后货架空了一整周的窘迫。', turningPoint: '她把几家小店的补货单合在一起，第一次让一车生活用品按时送到镇上。', privateWish: '她想做一个公开透明的互助采购表，让小店和居民都能省下时间和钱。', values: '公平、守信、把日子过得踏实' },
    'xu-yi': { story: '许一在外地做建筑设计，常负责新楼盘的效果图。父亲去世后，他回来整理河边老屋，发现许多房子的木梁和窗台都有居民自己修补的痕迹，于是开始接小型修缮工作。', turningPoint: '他保住了一栋原计划拆除的老房子，把它改成共享工作间，第一次把设计图交给居民一起修改。', privateWish: '他希望镇上扩建时先修旧屋、留树荫，并让居民能参与画规划图。', values: '节制、耐久、共同决定' },
    'mei-ling': { story: '梅铃在县里的苗圃工作了三十年，退休后回到榆灯镇照看院子。她知道哪种花能熬过河谷的寒风，也记得每户人家门前曾经长过什么。', turningPoint: '她把一片堆杂物的街角整理成小花圃，邻居陆续带来种子和旧花盆，那里慢慢成了大家聊天的地方。', privateWish: '她想沿河种一排果树，等树结果时办一场全镇分享的秋日会。', values: '耐心、照料、让公共空间人人可用' },
    'xu-dong': { story: '徐冬高中毕业后去县城送外卖，骑车路线比地图还熟。他把大部分收入交给家里，计划攒一笔钱带妹妹去海边，自己很少提累不累。', turningPoint: '一次送药途中遇上暴雨，街坊借给他干衣服和热饭，他开始把送货当成了解每户人家的方式。', privateWish: '他想在镇上攒起一辆可靠的货运小车，让老人和小店都少跑几趟路。', values: '行动、守诺、照顾家人' },
    'ning-ke': { story: '宁可从小在灯塔学校读书，成绩一直不错，却不确定离开小镇后自己会不会喜欢那种生活。她喜欢在旧站台看车次表，收集不同地方寄来的明信片。', turningPoint: '老师让她给低年级学生讲一次科学课，她发现自己不仅喜欢学习，也喜欢把问题解释给别人听。', privateWish: '她想考上大学，也想知道能不能把学到的东西带回镇上。', values: '求知、独立、保留回来的可能' },
    'qiu-shi': { story: '邱实跟师傅学修水泵、电灯和旧自行车，工具箱里总有几件拆了一半的东西。他不太会说漂亮话，却能记住哪家门闩松了、哪盏路灯闪了几天。', turningPoint: '洪水退去后，他和邻居们用回收材料修好社区水泵，之后镇公所把公共设施巡检交给他牵头。', privateWish: '他想开一间大家都能借工具、学基础修理的工作间。', values: '动手、互助、能修就先别丢' },
  };

  function createBackground(role, goal, trait, customText = '', name = 'TA') {
    const seed = Array.from(`${name}${role}${goal}`).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const origins = [
      `${name}小时候常在家人的工作间或店铺里帮忙，从观察大人做事开始学会了耐心。后来${name}去县城做过几年${role}，见过更快的生活，也慢慢发现自己最在意的还是人与人之间的联系。`,
      `${name}年轻时换过几种工作，也搬过几次家。每到一个新地方，${name}都会先记住附近的路和常来往的人；成为${role}之后，这种习惯让${name}很擅长发现别人忽略的小事。`,
      `${name}在榆灯镇附近长大，曾经一度觉得应该去远处寻找机会。做了几年${role}后，${name}带着一身本领回来，想试着把熟悉的街区变成值得留下来的地方。`,
      `${name}过去总把时间花在照顾家人和工作上，很少认真想自己想过什么样的生活。一次偶然的机会让TA开始做${role}，也让TA第一次把个人愿望放进了未来的计划。`,
    ];
    const turningPoints = [
      `一次停电的夜晚，邻居们互相帮忙把难题解决了。${name}从那以后相信，${goal}不必一个人完成。`,
      `有位街坊曾经认真听完${name}的建议，并因此少走了弯路。那件小事让${name}决定把自己的${role}本领用在更长远的事情上：${goal}。`,
      `${name}曾经把一件重要的事拖到错过时机，后来才明白再小的行动也值得开始。${name}因此把「${goal}」写进了给自己的约定。`,
      `回到榆灯镇的第一个冬天，${name}发现熟悉的街道仍然需要人照料。${name}决定不再只做旁观者，而是亲手为「${goal}」迈出第一步。`,
    ];
    const wishes = [
      `${name}希望有一天，自己做的${role}工作能让镇上的人彼此更信任，也让${goal}成为大家共同记得的一件事。`,
      `${name}心底里想拥有一间能安心做事的小屋，门口总有人来打招呼；等生活稳定下来，再和街坊一起实现「${goal}」。`,
      `${name}希望自己不必总是匆匆赶路，能和在意的人一起吃顿饭，也能亲眼看到「${goal}」慢慢发生。`,
      `${name}想把一路学来的本事传给别人，让镇上的年轻人也能找到自己的方向；而「${goal}」是${name}愿意长期投入的起点。`,
    ];
    return {
      story: customText || origins[seed % origins.length],
      turningPoint: turningPoints[(seed + 1) % turningPoints.length],
      privateWish: wishes[(seed + 2) % wishes.length],
      values: trait || '真诚、好奇、愿意尝试',
    };
  }

  const attributeLabels = {
    strength: '力量', speed: '速度', charisma: '魅力', intelligence: '智力', emotional: '情商', financial: '财商',
  };
  const proficiencyLabels = {
    firearms: '枪械', melee: '近战', archery: '射箭', medicine: '医学', fishing: '钓鱼', cooking: '烹饪',
    farming: '种植', gardening: '园艺', construction: '建筑', repair: '维修', teaching: '教学', programming: '编程',
    negotiation: '谈判', leadership: '领导', driving: '驾驶', logistics: '物流', animalCare: '动物护理', childcare: '育儿',
    firstAid: '急救', cleaning: '清洁', sewing: '缝纫', communication: '沟通', persuasion: '说服', stealth: '潜行',
    deception: '欺骗', security: '安保', media: '媒体', gardeningDesign: '园林设计',
  };
  const jobProficiencies = [
    [/护士|医生|医护|诊所/, ['medicine','firstAid']], [/学校|老师|教师|学生/, ['teaching','childcare']], [/咖啡|厨师|餐厅|烹饪/, ['cooking','communication']],
    [/超市|店长|商人|采购/, ['negotiation','logistics']], [/工程师|软件|程序|程序员/, ['programming','repair']], [/建筑|工程|修理|维修/, ['construction','repair']],
    [/园艺|农|种植/, ['farming','gardening']], [/宠物|兽医|动物/, ['animalCare','firstAid']], [/骑手|司机|快递|物流/, ['driving','logistics']],
    [/保安|警察|巡逻/, ['security','firstAid']], [/记者|摄影|画师|插画|主播/, ['media','communication']], [/清洁|保洁/, ['cleaning']],
    [/缝纫|裁缝|设计师/, ['sewing','communication']], [/领导|经理|镇长/, ['leadership','negotiation']], [/谈判|销售|律师/, ['negotiation','persuasion']],
    [/潜行|侦探|盗贼/, ['stealth','deception']], [/钓鱼|渔/, ['fishing','survival']],
  ];
  proficiencyLabels.survival = '野外生存';
  proficiencyLabels.recall = '回想';
  const focusBridge = {
    strength: 'craft', speed: 'craft', charisma: 'social', intelligence: 'knowledge', emotional: 'care', financial: 'craft',
    firearms: 'craft', melee: 'craft', archery: 'craft', medicine: 'care', fishing: 'craft', cooking: 'craft',
    farming: 'craft', gardening: 'craft', construction: 'craft', repair: 'craft', teaching: 'knowledge', programming: 'knowledge',
    negotiation: 'social', leadership: 'social', driving: 'craft', logistics: 'craft', animalCare: 'care', childcare: 'care', firstAid: 'care',
    cleaning: 'craft', sewing: 'craft', communication: 'social', persuasion: 'social', stealth: 'craft', deception: 'social', security: 'craft', media: 'knowledge', gardeningDesign: 'craft', survival: 'craft', recall: 'knowledge',
  };

  function roll(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function limitStat(value) { return Math.max(0, Math.min(100, Math.round(value))); }
  function deriveAttributes(job, role, skills) {
    const result = {
      strength: 25 + skills.craft * 4 + roll(-5, 9),
      speed: 30 + skills.craft * 3 + roll(-5, 12),
      charisma: 20 + skills.social * 7 + roll(-4, 10),
      intelligence: 24 + skills.knowledge * 7 + roll(-5, 10),
      emotional: 22 + skills.care * 5 + skills.social * 2 + roll(-4, 10),
      financial: 27 + skills.craft * 2 + skills.social * 2 + roll(-5, 9),
    };
    if (job === 'market') result.financial += 15;
    if (job === 'cafe') result.charisma += 7;
    if (job === 'school' || job === 'office') result.intelligence += 7;
    if (job === 'clinic' || job === 'petshop') result.emotional += 6;
    return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, limitStat(value)]));
  }
  function deriveProficiencies(job, role, skills) {
    const result = Object.fromEntries(Object.keys(proficiencyLabels).map(key => [key, roll(0, 13)]));
    Object.assign(result, {
      firearms: roll(0, 18), melee: roll(2, 22), archery: roll(0, 17),
      medicine: 3 + skills.care * 7 + (job === 'clinic' ? 24 : 0),
      fishing: roll(0, 17) + (job === 'park' ? 18 : 0),
      cooking: 5 + skills.craft * 3 + (job === 'cafe' || job === 'restaurant' ? 25 : 0) + (job === 'market' ? 8 : 0),
    });
    const roleMatch = jobProficiencies.find(([pattern]) => pattern.test(`${role} ${job}`));
    (roleMatch?.[1] || []).forEach((key, index) => { result[key] = (result[key] || 0) + (index ? 16 : 27); });
    if (role.includes('护士') || role.includes('医生')) result.medicine += 12;
    if (role.includes('厨师') || role.includes('主理人')) result.cooking += 12;
    return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, limitStat(value)]));
  }

  const initialBuildings = [
    { id: 'home-a', type: 'home', x: 0, y: 0, name: '榆树公租房', ownership: 'public', capacity: 4, rent: 8 }, { id: 'office', type: 'office', x: 1, y: 0 }, { id: 'townhall', type: 'townhall', x: 2, y: 0 }, { id: 'school', type: 'school', x: 3, y: 0 }, { id: 'clinic', type: 'clinic', x: 4, y: 0 }, { id: 'park', type: 'park', x: 5, y: 0 },
    { id: 'market', type: 'market', x: 0, y: 1 }, { id: 'road-b', type: 'road', x: 1, y: 1 }, { id: 'cafe', type: 'cafe', x: 2, y: 1 }, { id: 'road-c', type: 'road', x: 3, y: 1 }, { id: 'petshop', type: 'petshop', x: 4, y: 1 }, { id: 'grass-a', type: 'grass', x: 5, y: 1 },
    { id: 'home-b', type: 'home', x: 0, y: 2, name: '南街公租房', ownership: 'public', capacity: 4, rent: 8 }, { id: 'toilet', type: 'toilet', x: 1, y: 2 }, { id: 'plaza', type: 'plaza', x: 2, y: 2 }, { id: 'grass-b', type: 'grass', x: 3, y: 2 }, { id: 'home-c', type: 'home', x: 4, y: 2, name: '灯塔公寓', ownership: 'public', capacity: 4, rent: 8 }, { id: 'grass-c', type: 'grass', x: 5, y: 2 },
    { id: 'grass-d', type: 'grass', x: 0, y: 3 }, { id: 'road-d', type: 'road', x: 1, y: 3 }, { id: 'home-d', type: 'home', x: 2, y: 3, name: '河畔公租房', ownership: 'public', capacity: 4, rent: 8 }, { id: 'grass-e', type: 'grass', x: 3, y: 3 }, { id: 'grass-f', type: 'grass', x: 4, y: 3 }, { id: 'fishing', type: 'fishing', x: 5, y: 3 },
  ];

  function person(id, name, role, goal, trait, skills, home, job, color, extras = {}) {
    const [care, social, craft, knowledge] = skills;
    const identity = residentIdentities[id] || {};
    const mbti = extras.mbti || identity.mbti || Object.keys(mbtiTraits)[roll(0, 15)];
    const zodiac = extras.zodiac || identity.zodiac || zodiacNames[roll(0, zodiacNames.length - 1)];
    const result = {
      id, name, role, goal, personality: extras.personality || trait, trait: formatTrait(mbti, zodiac, extras.personality || trait), home, job, location: home, color, gender: identity.gender || '女', age: identity.age || 24, ageDays: 0,
      mbti, zodiac,
      alignment: identity.alignment ?? 38, anger: roll(3, 16), stress: roll(4, 18), illness: null, spouseId: null, parents: [], children: [], experiences: [], interests: [],
      employmentType: ['school','clinic','park','toilet','plaza','townhall','police','prosecutor','courthouse','prison'].includes(job) ? 'public' : 'private',
      education: { status: (identity.age || 24) >= 22 ? 'employed' : 'enrolled', dropout: false }, attributeProgress: {},
      money: 24 + Math.floor(Math.random() * 24),
      dreamFund: 0, dream: null, dreamHistory: [], memoryArchive: [], compressedMemory: '',
      mood: 65 + Math.floor(Math.random() * 17), energy: 66 + Math.floor(Math.random() * 25), health: 78 + Math.floor(Math.random() * 19), hunger: 65 + Math.floor(Math.random() * 23), hygiene: 60 + Math.floor(Math.random() * 30), socialNeed: 58 + Math.floor(Math.random() * 29),
      skills: { care, social, craft, knowledge }, attributes: deriveAttributes(job, role, { care, social, craft, knowledge }),
      proficiencies: deriveProficiencies(job, role, { care, social, craft, knowledge }), relationships: {}, memory: [], journal: [],
      background: structuredClone(residentBackgrounds[id] || createBackground(role, goal, trait, '', name)),
      currentThought: `我想在榆灯镇把「${goal}」一点点做起来。`, lastAction: null, directive: null, customPrompt: '',
      ...extras,
    };
    result.tools = getTools(result);
    if (result.attributes) {
      if (mbti[0] === 'E') result.attributes.charisma = clamp(result.attributes.charisma + 4);
      if (mbti[0] === 'I') result.attributes.intelligence = clamp(result.attributes.intelligence + 3);
      if (mbti[2] === 'F') result.attributes.emotional = clamp(result.attributes.emotional + 4);
      if (mbti[2] === 'T') result.attributes.intelligence = clamp(result.attributes.intelligence + 3);
      if (mbti[3] === 'J') result.attributes.financial = clamp(result.attributes.financial + 2);
    }
    return result;
  }

  const dreamIdeas = [
    { title: '攒钱买一间自己的房子', cost: [130, 210], why: '拥有一处安稳的家' },
    { title: '开一间属于自己的小店', cost: [75, 145], why: '把兴趣变成生意' },
    { title: '带重要的人去远方看看', cost: [55, 105], why: '给生活留一段新经历' },
    { title: '为街坊做一件有用的事', cost: [35, 85], why: '让熟悉的地方变得更好' },
    { title: '学会一门新本领', cost: [30, 70], why: '为未来多留一种可能' },
    { title: '给家里添置一件重要物品', cost: [45, 95], why: '让日常生活更舒服' },
  ];
  function chooseNextDream(agent, announce = false) {
    const previous = agent.dream?.title;
    const options = dreamIdeas.filter(dream => dream.title !== previous);
    const idea = options[roll(0, options.length - 1)] || dreamIdeas[0];
    const ambition = Math.round((agent.attributes?.financial || 50) / 10) + roll(-5, 7);
    agent.dream = { title: idea.title, reason: idea.why, targetCost: Math.max(25, roll(idea.cost[0], idea.cost[1]) + ambition), startedDay: state?.day || 1, progress: 0 };
    agent.dreamFund = Math.max(0, Number(agent.dreamFund) || 0);
    if (announce && state) {
      remember(agent, `实现了上一个愿望后，我为自己定下新梦想：${agent.dream.title}，预计需要 ${agent.dream.targetCost} 元。`);
      pushEvent(`${safeName(agent)}为自己定下新梦想：${esc(agent.dream.title)}，目标资金 ${agent.dream.targetCost} 元。`, 'social', '✦', [agent.id]);
    }
  }

  function makeInitialState() {
    return {
      worldId: activeTownId, worldName: '榆灯镇', day: 1, period: 0, turn: 0, treasury: 145, foodStock: 30, marriages: [], pregnancies: [],
      justice: { cases: [], publicDiscontent: 0, lastProtestDay: 0 },
      environment: { regionName: '青岚县', road: 'open', soil: 'normal', marketPrice: 1 }, worldLore: structuredClone(townLore),
      town: { preset: 'neighborhood', width: 6, height: 4, rules: { maxPopulation: 24, maxBuildings: 24 } }, outsideIndex: 0, outside: { ...outsideUpdates[0] },
      activeProject: null, completedProjects: [], buildings: structuredClone(initialBuildings), businesses: [], loans: [], publicProposal: null, approvedBuild: null, lastProposalDay: 0, monthTaxRevenue: 0, lastMonthTaxRevenue: 0,
      residents: [
        person('lin-yao', '林遥', '社区护士', '让邻里都能安心生活', '温和、细心', [8, 7, 3, 6], 'home-a', 'clinic', '#9cbd9b'),
        person('zhou-yan', '周砚', '咖啡馆主理人', '把咖啡馆变成大家的客厅', '健谈、好奇', [3, 9, 7, 4], 'home-b', 'cafe', '#dec19a'),
        person('a-mu', '阿沐', '学校老师', '让每个孩子都发现擅长的事', '耐心、乐观', [8, 8, 2, 9], 'home-c', 'school', '#b9c8de'),
        person('gu-feng', '顾逢', '软件工程师', '做出能帮到街坊的小工具', '专注、有点内向', [2, 4, 7, 9], 'home-d', 'office', '#c7b8d5'),
        person('shen-he', '沈禾', '插画师', '为小镇留下值得记住的故事', '安静、敏锐', [4, 7, 8, 7], 'home-a', 'office', '#e5b9a3'),
        person('ke-ke', '可可', '宠物美容师', '照顾好每一只来店里的小动物', '热情、善良', [9, 8, 6, 4], 'home-b', 'petshop', '#e1b7c2'),
        person('tang-qiao', '唐乔', '超市店长', '让镇上买东西更方便实惠', '务实、爽快', [5, 7, 7, 5], 'home-c', 'market', '#dfbd82'),
        person('xu-yi', '许一', '建筑师', '修好老房子，也造点新东西', '沉稳、可靠', [5, 5, 9, 7], 'home-d', 'office', '#a7c4c1'),
        person('mei-ling', '梅铃', '退休园艺师', '让街角每一寸空地都长出绿意', '温柔、慢热', [7, 6, 8, 6], 'home-a', 'park', '#aec89a'),
        person('xu-dong', '徐冬', '外卖骑手', '攒够钱带妹妹去看海', '直率、勤奋', [4, 6, 7, 3], 'home-b', 'market', '#edc174'),
        person('ning-ke', '宁可', '高中生', '考上大学，去更远的地方看看', '好学、有韧性', [4, 6, 3, 9], 'home-c', 'school', '#b7c5e3'),
        person('qiu-shi', '邱实', '修理师', '让坏掉的东西都有第二次机会', '热心、爱琢磨', [7, 6, 9, 6], 'home-d', 'office', '#d0bea1'),
        person('public-official', '沈知予', '镇公所专员', '让公共预算先解决居民最迫切的需要', '守信、讲效率、重视协商', [7, 7, 5, 8], 'home-a', 'townhall', '#9ab5a7', { employmentType: 'public', publicRole: '镇公所提案专员', customPrompt: '你是镇政府公职人员，工资来自镇公所预算。提议新建公共设施前要说明公共价值、核算预算并交居民表决。' }),
        person('villain-1', '梁九', '投机商人', '控制镇上的灰色生意并积累财富', '自利、记仇、狡猾', [2, 4, 6, 5], 'home-d', 'market', '#9c7771', { alignment: -62, customPrompt: '习惯先考虑自己的利益；被拒绝时会记仇，倾向欺诈、威胁或破坏来谋利，同时会权衡暴露风险。' }),
      ], events: [], selectedId: 'lin-yao', idCounter: 1,
    };
  }

  function makeRandomWorldState() {
    const world = makeInitialState();
    const names = ['雾港镇','石桥镇','星河湾','青禾埠','白桦镇','风谷镇','栖潮镇','松灯镇','南岬镇','云溪镇','旧渡镇','长堤镇'];
    const regions = ['临海县','青岚县','北河郡','白桦县','风谷市','云溪州','南岬县'];
    const aliases = ['潮汐湾','北岭','旧铁路走廊','云杉河谷','石灰岩丘陵','南部平原','芦苇湿地'];
    const traitsGood = ['重视公平、愿意照顾邻里','讲原则但偶尔固执','乐于合作、在意家庭','诚实谨慎、愿意承担责任','富有同情心、也需要被理解'];
    const traitsBad = ['自利、记仇、擅长掩饰','冲动、好胜、会为钱冒险','冷酷算计、重视控制','嫉妒心强、容易报复','把规则看成可以利用的工具'];
    const goalPool = ['攒够钱买下一处自己的房子','开一家能长期赚钱的小店','让家人拥有稳定的生活','在镇上获得更多话语权','攒钱学会一门新职业','把某项公共设施建在自己关心的街区','还清欠款并重新获得信任','守住家人和自己的安全','经营一片菜地，减少对外部粮食依赖'];
    const roleByJob = { clinic:'社区医护人员', school:'教师', office:'工程师', market:'店铺经营者', cafe:'餐馆主理人', petshop:'动物护理师', farm:'种植户', fishing:'渔业从业者', park:'园艺师', training:'安保教练' };
    const personNames = ['林遥','周砚','阿沐','顾逢','沈禾','可可','唐乔','许一','梅铃','徐冬','宁可','邱实','叶知秋','宋桥','姜闻溪','闻人乐','陶见山','程小满','陆知遥','谢安宁'];
    const townName = names[roll(0,names.length - 1)];
    const scale = scalePresets[roll(1,2)];
    world.worldName = townName; world.worldId = null; world.day = 1; world.turn = 0; world.period = 0;
    world.town = { preset: scale.id, width: scale.width, height: scale.height, rules: { maxPopulation: 32, maxBuildings: Math.min(34, scale.width * scale.height), publicRent: roll(6,12), familyWaitDays: roll(2,5), pregnancyDays: roll(4,8) } };
    world.treasury = roll(180,420); world.foodStock = roll(24,52); world.lastMonthTaxRevenue = 0; world.monthTaxRevenue = 0;
    world.environment = { regionName: regions[roll(0,regions.length - 1)], road: ['open','open','limited','blocked'][roll(0,3)], soil: ['fertile','normal','normal','poor'][roll(0,3)], marketPrice: roll(0,3), riskLevel: ['calm','normal','normal','high'][roll(0,3)] };
    const byCoord = new Set(world.buildings.map(building => `${building.x},${building.y}`));
    for (let y=0;y<scale.height;y++) for (let x=0;x<scale.width;x++) if (!byCoord.has(`${x},${y}`)) {
      const road = (y === 4 && x < scale.width - 1) || (x === 6 && y > 1 && y < scale.height - 1);
      world.buildings.push({ id: `${road ? 'road' : 'grass'}-rand-${x}-${y}`, type: road ? 'road' : 'grass', x, y });
    }
    const addFacility = (type,x,y,id=type) => {
      world.buildings = world.buildings.filter(building => !(building.x===x && building.y===y && ['grass','road','plot'].includes(building.type)));
      const building = { id, type, x, y, level: 1, rotation: roll(0,3)*90, condition: roll(82,100) };
      if (type === 'home') Object.assign(building,{ ownership:'public', capacity:4, baseCapacity:4, rent:world.town.rules.publicRent, baseRent:world.town.rules.publicRent, salePrice:150 });
      if (type === 'farm') building.crop = { name:'土豆', plantedDay:1, maturesOn:1+roll(3,6), yield:18 };
      world.buildings.push(building); return building;
    };
    addFacility('police',6,0); addFacility('prosecutor',7,0); addFacility('courthouse',6,1); addFacility('prison',7,1); addFacility('home',6,2,'home-e');
    if (Math.random() < 0.55) addFacility('farm',7,2,'farm-random');
    if (Math.random() < 0.45) addFacility('restaurant',scale.width-1,3,'restaurant-random');
    world.town.rules.maxBuildings = Math.max(world.buildings.filter(building => !['road','grass','plot'].includes(building.type)).length,world.town.rules.maxBuildings);
    const shuffledNames = personNames.sort(() => Math.random() - 0.5);
    const goodBad = [...Array(9).fill('good'),...Array(6).fill('bad'),...Array(3).fill('neutral')].sort(() => Math.random() - 0.5);
    world.residents.forEach((agent,index) => {
      const side = agent.id === 'villain-1' ? 'bad' : goodBad[index] || 'neutral';
      if (agent.id !== 'public-official') {
        const jobType = agent.id === 'villain-1' ? 'market' : ['clinic','cafe','school','office','office','petshop','market','office','park','market','school','office','market'][index % 13];
        agent.job = jobType; agent.role = roleByJob[jobType] || '自由职业者';
        agent.name = shuffledNames[index % shuffledNames.length]; agent.goal = goalPool[roll(0,goalPool.length-1)];
      }
      agent.age = roll(20,58); agent.ageDays = roll(0,1); agent.gender = Math.random() < 0.5 ? '女' : '男';
      agent.mbti = Object.keys(mbtiTraits)[roll(0,15)]; agent.zodiac = zodiacNames[roll(0,zodiacNames.length-1)];
      agent.personality = side === 'good' ? traitsGood[roll(0,traitsGood.length-1)] : side === 'bad' ? traitsBad[roll(0,traitsBad.length-1)] : '谨慎观望、会根据处境调整选择';
      agent.trait = formatTrait(agent.mbti,agent.zodiac,agent.personality);
      agent.alignment = side === 'good' ? roll(28,82) : side === 'bad' ? roll(-86,-24) : roll(-14,22);
      agent.mood = roll(45,84); agent.health = roll(64,96); agent.hunger = roll(54,90); agent.energy = roll(60,92); agent.anger = roll(6,42);
      agent.relationships = {}; agent.spouseId = null; agent.parents = []; agent.children = []; agent.goalTarget = null;
      agent.employmentType = ['school','clinic','park'].includes(agent.job) || agent.id === 'public-official' ? 'public' : 'private';
      agent.background = createBackground(agent.role,agent.goal,agent.personality,`${agent.name}来到${townName}，希望在${aliases[roll(0,aliases.length-1)]}附近重新开始。`,agent.name);
      if (agent.alignment <= -25) agent.customPrompt = '你先考虑自己的利益；遇到阻碍时可能欺骗、威胁、偷窃或伤害别人，但要权衡证据、法律和后果。';
      if (agent.id === 'public-official') { agent.name='沈知予'; agent.role='镇公所专员'; agent.job='townhall'; agent.employmentType='public'; agent.publicRole='镇公所提案专员'; agent.alignment=roll(42,78); }
      agent.tools = getTools(agent);
    });
    const justiceStaff = [
      ['random-police','警员','警务人员','police'],['random-prosecutor','检察官','检察官','prosecutor'],['random-judge','法官','人民法院法官','courthouse'],['random-guard','看守员','监所工作人员','prison'],
    ];
    justiceStaff.forEach(([id,name,role,job]) => {
      const agent=person(id,name,role,`维护${facilityTypes[job].name}的职责与公正`, '克制、负责、重视程序',[6,5,6,8],'home-e',job,palette[world.residents.length%palette.length],{ age:roll(28,49),gender:Math.random()<0.5?'女':'男',alignment:roll(36,78),employmentType:'public',publicRole: job==='police'?'警务人员':job==='prosecutor'?'检察人员':job==='courthouse'?'司法人员':'监所人员' });
      agent.money=roll(28,75); agent.mood=roll(52,80); agent.health=roll(72,97); world.residents.push(agent);
    });
    world.worldLore = { title:`${townName}：${aliases[roll(0,aliases.length-1)]}的新生活`, summary:`${townName}在${world.environment.regionName}边缘发展，居民既争取新的机会，也面对治安、收入和外部环境的压力。`, history:`${townName}最初由沿河货运、旧公路和周边农田发展而来。一次产业变化让不少家庭离开，也让镇上留下空置的房屋与尚未解决的旧纠纷。最近，一批新居民回到这里，准备重新组织日常生活。`, geography:`小镇靠近${aliases[roll(0,aliases.length-1)]}，外部交通${world.environment.road==='open'?'畅通':world.environment.road==='limited'?'受到限制':'暂时中断'}；${world.environment.soil==='fertile'?'肥沃土壤适合种植':world.environment.soil==='poor'?'贫瘠土地让食物更难获得':'普通土壤需要持续经营'}。`, outside:`${world.environment.regionName}的市场价格、道路、水情和治安消息会影响镇上供给。居民需要自行组织商店、学校、诊所、警务和法院，也可能因资源分配发生冲突。` };
    world.outside = { ...outsideUpdates[roll(0,outsideUpdates.length-1)] }; world.outsideIndex=roll(0,outsideUpdates.length-1);
    world.events=[]; world.logArchive=[]; world.relationshipEvents=[]; world.justice={ cases:[], publicDiscontent:roll(8,34), lastProtestDay:0 };
    world.selectedId=world.residents[0]?.id; world.randomSeed=Math.floor(Math.random()*2**32); world.generatedLocally=true;
    world.residents.forEach(agent => { if (!agent.dream?.targetCost) chooseNextDream(agent); });
    return world;
  }

  function makeAiWorldState(generated, usage) {
    const world = makeRandomWorldState();
    world.worldName = String(generated.worldName || world.worldName).slice(0,24);
    world.town = { ...world.town, preset:'river-town', width:10, height:6, rules:{ ...world.town.rules, maxPopulation:32, maxBuildings:Math.min(42,60) } };
    const coords = new Set(world.buildings.map(building => `${building.x},${building.y}`));
    for (let y=0;y<6;y++) for (let x=0;x<10;x++) if (!coords.has(`${x},${y}`)) {
      const road = y === 4 && x < 9;
      world.buildings.push({ id:`${road?'road':'grass'}-ai-${x}-${y}`, type:road?'road':'grass', x, y });
    }
    for (const facility of (generated.extraFacilities || []).slice(0,6)) {
      const x=Number(facility.x), y=Number(facility.y), type=facilityTypes[facility.type] ? facility.type : null;
      if (!type || x<0 || y<0 || x>=10 || y>=6 || world.buildings.some(building=>building.x===x&&building.y===y&&!['grass','plot'].includes(building.type))) continue;
      world.buildings=world.buildings.filter(building=>!(building.x===x&&building.y===y&&['grass','plot'].includes(building.type)));
      world.buildings.push({ id:`ai-${type}-${world.idCounter++}`,type,x,y,level:1,rotation:[0,90,180,270].includes(Number(facility.rotation))?Number(facility.rotation):0,condition:roll(82,100) });
    }
    world.treasury=roll(200,420); world.foodStock=roll(26,48);
    world.environment={ regionName:generated.regionName,road:generated.road,soil:generated.soil,marketPrice:generated.marketPrice,riskLevel:generated.riskLevel };
    world.worldLore={ title:`${world.worldName}：${generated.summary.slice(0,34)}`,summary:generated.summary,history:generated.history,geography:generated.geography,outside:generated.outside };
    world.residents=[]; world.idCounter=1;
    const homes=world.buildings.filter(building=>building.type==='home'); const homeLoads=new Map(homes.map(home=>[home.id,0]));
    const chooseHome=()=>{
      const home=homes.slice().sort((a,b)=>(homeLoads.get(a.id)||0)-(homeLoads.get(b.id)||0))[0]||null;
      if(home)homeLoads.set(home.id,(homeLoads.get(home.id)||0)+1);
      return home?.id||null;
    };
    const publicJobs=new Set(['townhall','school','clinic','park','toilet','plaza','police','prosecutor','courthouse','prison']);
    const validSkills=Object.keys(proficiencyLabels);
    (generated.residents||[]).forEach((source,index)=>{
      const job=facilityTypes[source.jobType]?source.jobType:'office'; const skills=[roll(3,8),roll(3,8),roll(3,8),roll(3,8)];
      const agent=person(`ai-resident-${index+1}`,source.name||`居民${index+1}`,source.role||'新居民',source.goal||'在镇上找到稳定的生活方向',source.personality||'谨慎、好奇',skills,chooseHome(),job,palette[index%palette.length],{
        age:Math.max(18,Math.min(70,Number(source.age)||28)),gender:source.gender==='男'?'男':'女',mbti:mbtiTraits[source.mbti]?source.mbti:'ISFJ',zodiac:zodiacNames.includes(source.zodiac)?source.zodiac:'金牛座',
        alignment:Math.max(-90,Math.min(90,Number(source.alignment)||0)),employmentType:publicJobs.has(job)?'public':'private',personality:source.personality||'谨慎、好奇',
        background:createBackground(source.role,source.goal,source.personality,source.background,source.name),interests:[],goalTarget:null,
      });
      agent.specialty=validSkills.includes(source.signatureSkill)?source.signatureSkill:'communication';
      if(validSkills.includes(agent.specialty)){agent.proficiencies[agent.specialty]=roll(72,88);agent.interests=[{key:agent.specialty,value:roll(65,92)}];}
      if(agent.attributes[agent.specialty]!=null)agent.attributes[agent.specialty]=roll(68,86);
      if(agent.employmentType==='public'&&job==='townhall')agent.publicRole='镇公所提案专员';
      if(agent.alignment<=-25)agent.customPrompt=`${agent.personality}。优先盘算自己的利益；遇到债务、目标或地位受损时可能欺骗、威胁、殴打甚至杀人，但会考虑证据与刑罚。`;
      agent.money=roll(24,90);agent.mood=roll(48,82);agent.health=roll(68,97);agent.hunger=roll(58,90);agent.energy=roll(56,92);agent.anger=roll(4,38);agent.tools=getTools(agent);
      world.residents.push(agent);
    });
    const staffSpecs=[
      ['townhall','镇务专员','镇公所提案专员'],['police','警员','警务人员'],['prosecutor','检察官','检察人员'],['courthouse','法官','司法人员'],['prison','看守员','监所工作人员'],
    ];
    staffSpecs.forEach(([job,role,publicRole],index)=>{
      if(job==='townhall'&&world.residents.some(agent=>agent.job===job))return;
      const id=`ai-public-${job}`;const name=['沈知予','罗嘉禾','唐正','白芷','魏行'][index];
      const agent=person(id,name,role,`依法履行${facilityTypes[job].name}职责并维护公共秩序`,'克制、负责、重视程序',[6,6,6,8],chooseHome(),job,palette[(world.residents.length+index)%palette.length],{age:roll(28,50),gender:index%2?'男':'女',alignment:roll(38,78),employmentType:'public',publicRole});
      agent.money=roll(30,82);agent.mood=roll(55,82);agent.health=roll(72,98);world.residents.push(agent);
    });
    world.justice={cases:[],publicDiscontent:roll(12,35),lastProtestDay:0};world.marriages=[];world.pregnancies=[];world.loans=[];world.businesses=[];world.events=[];world.logArchive=[];world.relationshipEvents=[];
    const usageInfo={model:usage?.model||'OpenAI Responses API',inputTokens:Number(usage?.inputTokens)||0,outputTokens:Number(usage?.outputTokens)||0,totalTokens:Number(usage?.totalTokens)||0,residentsGenerated:(generated.residents||[]).length};
    world.initializationMode='openai';world.generatedLocally=false;world.initializationUsage=usageInfo;world.randomSeed=Math.floor(Math.random()*2**32);world.selectedId=world.residents[0]?.id;
    const aiResidents=world.residents.filter(agent=>agent.id.startsWith('ai-resident-'));
    const weightTotal=aiResidents.reduce((sum,agent)=>sum+JSON.stringify(agent.background||{}).length+String(agent.goal||'').length+String(agent.name||'').length,0)||1;
    aiResidents.forEach(agent=>{
      const weight=(JSON.stringify(agent.background||{}).length+String(agent.goal||'').length+String(agent.name||'').length)/weightTotal;
      const completionShare=Math.round(usageInfo.outputTokens*weight);const promptShare=Math.ceil(usageInfo.inputTokens/Math.max(1,aiResidents.length));
      agent.tokenUsage={calls:0,initializationCalls:1,estimated:true,inputTokens:promptShare,outputTokens:completionShare,totalTokens:promptShare+completionShare,model:usageInfo.model};
    });
    const startup={id:`init-${Date.now()}`,message:`${esc(world.worldName)}由大模型初始化：${aiResidents.length} 位角色、${usageInfo.totalTokens} tokens（本次世界生成调用；NPC逐回合决策仍使用本地策略）。`,type:'town',icon:'✦',day:1,period:0,involved:[]};
    world.events=[startup];world.logArchive=[startup];
    return world;
  }

  function getTools(agent) {
    const tools = ['move_to', 'rest', 'talk_to_resident'];
    const jobType = state?.buildings?.find(building => building.id === agent.job)?.type || agent.job;
    if (agent.skills?.craft >= 5 || ['office', 'market', 'cafe', 'petshop', 'restaurant'].includes(jobType)) tools.push('work');
    if (agent.skills?.knowledge >= 6 || jobType === 'school') tools.push('study_or_teach');
    if (agent.skills?.care >= 6 || jobType === 'clinic' || jobType === 'petshop') tools.push('care_for_others');
    tools.push('buy_meal');
    if (agent.skills?.craft >= 6 || /建筑|修理|工程/.test(agent.role || '')) tools.push('propose_construction');
    if (jobType === 'market') tools.push('order_food');
    if (jobType === 'farm') tools.push('tend_crops');
    if (jobType === 'restaurant') tools.push('serve_meals');
    tools.push('use_facility', 'practice_skill', 'buy_land', 'build_private_home', 'open_shop', 'rent_or_buy_property', 'franchise_business', 'vote_public_proposal');
    tools.push('request_loan', 'offer_voluntary_loan', 'repay_loan', 'recall_memory', 'observe_resident', 'pursue_dream');
    if ((agent.alignment ?? 38) <= -25) tools.push('deceive', 'steal', 'intimidate', 'assault', 'murder', 'sabotage');
    tools.push('report_crime', 'request_police_protection', 'consider_illegal_action');
    if ((agent.alignment ?? 38) >= 25) tools.push('protect_resident', 'mediate_conflict', 'organize_aid');
    return tools;
  }

  function formatTrait(mbti, zodiac, personality) {
    return `${mbti}型：${mbtiTraits[mbti] || ''}。${String(personality || '性格仍在形成').trim()}；星座仅作轻微倾向：${zodiacFlavors[zodiac] || ''}`;
  }
  function extractPersonality(trait) {
    const match = String(trait || '').match(/^[A-Z]{4}型：.*?。(.+?)；星座仅作轻微倾向：.*$/);
    return match?.[1] || String(trait || '性格仍在形成');
  }
  function levelOf(building) { return Math.max(1, Math.min(facilityProgression[building?.type]?.max || 1, Math.floor(Number(building?.level) || 1))); }
  function facilityLevelName(type, level = 1) {
    const progression = facilityProgression[type];
    return progression?.names[Math.max(0, Math.min(progression.max - 1, level - 1))] || facilityTypes[type]?.name || '街区设施';
  }
  function buildingName(building) {
    if (building.customName) return building.customName;
    const oldName = building.name;
    const knownNames = facilityProgression[building.type]?.names || [];
    return oldName && oldName !== facilityTypes[building.type]?.name && !knownNames.includes(oldName) ? oldName : facilityLevelName(building.type, levelOf(building));
  }
  function rotateCells(cells, rotation = 0) {
    let result = cells.map(([x,y]) => [x,y]);
    for (let turn = 0; turn < ((Number(rotation) % 360 + 360) % 360) / 90; turn++) result = result.map(([x,y]) => [y,-x]);
    const minX = Math.min(...result.map(point => point[0])); const minY = Math.min(...result.map(point => point[1]));
    return result.map(([x,y]) => [x-minX,y-minY]);
  }
  function footprintCells(type, level = 1, rotation = 0) {
    const progression = facilityProgression[type];
    const shapeKey = progression?.shapes[Math.max(0, Math.min(progression.max - 1, level - 1))] || 'single';
    return rotateCells(footprintShapes[shapeKey] || footprintShapes.single, rotation);
  }
  function occupiedCells(building, level = levelOf(building), rotation = Number(building.rotation) || 0) {
    return footprintCells(building.type, level, rotation).map(([dx,dy]) => ({ x: building.x + dx, y: building.y + dy, dx, dy }));
  }
  function footprintFits(type, level, rotation, x, y, excludeId = null, landOwnerId = null) {
    return footprintCells(type, level, rotation).every(([dx,dy]) => {
      const px = x + dx, py = y + dy;
      if (px < 0 || py < 0 || px >= state.town.width || py >= state.town.height) return false;
      return !state.buildings.some(item => {
        if (item.id === excludeId || item.x !== px || item.y !== py) return false;
        if (item.type === 'road') return true;
        if (item.type === 'grass' || item.type === 'plot') return Boolean(item.ownerId && item.ownerId !== landOwnerId);
        return true;
      });
    });
  }
  function shapePreviewHtml(type, level = 1, rotation = 0) {
    const cells = footprintCells(type, level, rotation); const width = Math.max(...cells.map(cell => cell[0])) + 1; const height = Math.max(...cells.map(cell => cell[1])) + 1;
    const occupied = new Set(cells.map(([x,y]) => `${x},${y}`));
    return `<div class="footprint-preview-grid" style="grid-template-columns:repeat(${width},20px);grid-template-rows:repeat(${height},20px)">${Array.from({ length: width * height }, (_, index) => { const x=index%width,y=Math.floor(index/width); return `<i class="${occupied.has(`${x},${y}`) ? 'occupied' : ''}"></i>`; }).join('')}</div>`;
  }

  let state;
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || (activeTownId === 'yudeng-main' ? localStorage.getItem(LEGACY_STORAGE_KEY) : null);
    state = saved ? JSON.parse(saved) : makeInitialState();
    const remote = await window.SocietyBackend?.getTown(activeTownId);
    if (remote?.state) state = remote.state;
    if (!Array.isArray(state.residents) || !Array.isArray(state.buildings)) state = makeInitialState();
  } catch { state = makeInitialState(); }
  if (!Array.isArray(state.events)) state.events = [];
  state.worldId ||= activeTownId; state.worldName ||= '榆灯镇';
  state.aiRuntimeEnabled ??= false;
  state.aiUsage ||= { calls: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, fallbackCalls: 0 };
  state.worldLore ||= structuredClone(townLore);
  state.logArchive ||= [...state.events];
  state.town ||= { preset: 'neighborhood', width: 6, height: 4 };
  state.town.width ||= 6; state.town.height ||= 4;
  state.town.rules ||= { maxPopulation: 24, maxBuildings: Math.min(30, state.town.width * state.town.height) };
  state.town.rules.maxPopulation ||= 24;
  state.town.rules.publicRent ??= 8;
  const existingStructures = state.buildings.filter(building => !['road', 'grass', 'plot'].includes(building.type)).length;
  state.town.rules.maxBuildings = Math.max(existingStructures, Math.min(state.town.width * state.town.height, Number(state.town.rules.maxBuildings) || Math.min(30, state.town.width * state.town.height)));
  state.town.rules.familyWaitDays ??= 3; state.town.rules.pregnancyDays ??= 6;
  state.marriages ||= []; state.pregnancies ||= [];
  state.justice ||= { cases: [], publicDiscontent: 0, lastProtestDay: 0 };
  state.justice.cases ||= []; state.justice.publicDiscontent ||= 0; state.justice.lastProtestDay ||= 0;
  state.environment ||= { regionName: '青岚县', road: 'open', soil: 'normal', marketPrice: 1, riskLevel: 'normal' };
  state.environment.regionName ||= '青岚县'; state.environment.road ||= 'open'; state.environment.soil ||= 'normal';
  state.environment.marketPrice ??= 1; state.environment.riskLevel ||= 'normal';
  state.foodStock ??= Math.max(18, state.residents.length * 3);
  state.outsideIndex ??= 0;
  state.outside ||= { ...outsideUpdates[state.outsideIndex % outsideUpdates.length] };
  state.activeProject ||= null;
  state.completedProjects ||= [];
  state.monthTaxRevenue = Math.max(0, Number(state.monthTaxRevenue) || 0);
  state.lastMonthTaxRevenue = Math.max(0, Number(state.lastMonthTaxRevenue) || 0);
  state.businesses ||= [];
  state.loans ||= [];
  state.publicProposal ??= null;
  state.approvedBuild ??= null;
  state.publicProposalHistory ||= [];
  if (state.publicProposal && !state.publicProposal.id) state.publicProposal.id = `public-proposal-${state.idCounter++}`;
  if (state.approvedBuild && !state.approvedBuild.id) state.approvedBuild.id = `public-proposal-${state.idCounter++}`;
  state.lastProposalDay ??= 0;
  state.businesses.forEach(business => { business.branches ||= []; business.royaltyRate ??= 0.1; business.cashBalance ??= 100; });
  state.loans.forEach(loan => { loan.balance ??= Number(loan.principal) || 0; loan.monthlyRate ??= 0.03; loan.nextInterestDay ??= (loan.createdDay || state.day) + 30; loan.repayments ||= []; loan.status ||= loan.balance > 0 ? 'active' : 'repaid'; });
  state.buildings.forEach(building => {
    building.level = levelOf(building); building.rotation = ((Number(building.rotation) || 0) % 360 + 360) % 360;
    building.customName ||= building.name && building.name !== facilityTypes[building.type]?.name && !(facilityProgression[building.type]?.names || []).includes(building.name) ? building.name : '';
    if (building.type === 'home') {
      building.ownership ||= building.ownerId ? 'private' : 'public';
      building.capacity ||= facilityDetails.home.capacity;
      building.baseCapacity ??= Number(building.capacity) || facilityDetails.home.capacity;
      building.rent ??= building.ownership === 'public' ? state.town.rules.publicRent : 12;
      building.baseRent ??= Number(building.rent) || 0;
      building.salePrice ||= 150;
    }
    if (building.type === 'plot' && building.ownerId) building.landOwned = true;
    if (['market','cafe','restaurant','petshop','farm','office'].includes(building.type) && !building.businessId) building.cashBalance = Math.max(0, Number(building.cashBalance ?? 75));
  });
  if (!state.buildings.some(building => building.type === 'townhall')) {
    const spareStreet = state.buildings.find(building => building.type === 'road');
    if (spareStreet) { spareStreet.type = 'townhall'; spareStreet.name = facilityTypes.townhall.name; }
  }
  state.relationshipEvents ||= [];
  state.moveBuildingId ||= null;
  if (!state.buildings.some(b => b.type === 'fishing')) {
    const riverPlot = state.buildings.find(b => b.x === 5 && b.y === 3 && (b.type === 'grass' || b.type === 'plot'));
    if (riverPlot) { riverPlot.id = 'fishing'; riverPlot.type = 'fishing'; }
  }
  if (!state.residents.some(r => r.id === 'villain-1') && state.residents.length < state.town.rules.maxPopulation) {
    const antagonist = person('villain-1', '梁九', '投机商人', '控制镇上的灰色生意并积累财富', '自利、记仇、狡猾', [2, 4, 6, 5], 'home-d', 'market', '#9c7771', { alignment: -62, customPrompt: '习惯先考虑自己的利益；被拒绝时会记仇，倾向欺诈、威胁或破坏来谋利，同时会权衡暴露风险。' });
    state.residents.push(antagonist);
    state.events.unshift({ message: '<b>梁九</b>带着一笔来路不明的资金搬进镇上。', type: 'social', icon: '⚑', day: state.day, period: state.period, involved: [antagonist.id] });
    state.logArchive.unshift(state.events[0]);
  }
  state.residents.forEach(r => {
    r.gender ||= residentIdentities[r.id]?.gender || '女';
    r.age ??= residentIdentities[r.id]?.age ?? (r.parents?.length ? 0 : 24);
    r.ageDays ??= 0; r.ageDays = Math.floor(Math.max(0,Number(r.ageDays)||0)) % AGE_DAYS_PER_YEAR; r.parents ||= []; r.experiences ||= []; r.interests ||= [];
    r.mbti ||= residentIdentities[r.id]?.mbti || Object.keys(mbtiTraits)[roll(0, 15)]; r.zodiac ||= residentIdentities[r.id]?.zodiac || zodiacNames[roll(0, zodiacNames.length - 1)];
    r.personality ||= extractPersonality(r.trait);
    r.trait = formatTrait(r.mbti, r.zodiac, r.personality);
    r.education ||= { status: r.age >= 22 ? 'employed' : r.age >= 18 ? 'university' : 'enrolled', dropout: false };
    r.education.dropout ||= false;
    r.attributeProgress ||= {};
    r.alignment ??= residentIdentities[r.id]?.alignment ?? (r.trait?.includes('狡猾') || r.trait?.includes('暴躁') ? -30 : 38);
    r.anger ??= roll(3, 16); r.stress ??= 8; r.illness ??= null; r.spouseId ??= null; r.children ||= [];
    r.skills ||= { care: 3, social: 3, craft: 3, knowledge: 3 };
    const jobBuilding = state.buildings.find(b => b.id === r.job);
    const jobType = jobBuilding?.type || r.job;
    r.attributes ||= deriveAttributes(jobType, r.role || '', r.skills);
    r.proficiencies = { ...deriveProficiencies(jobType, r.role || '', r.skills), ...(r.proficiencies || {}) };
    if (typeof r.background === 'string') r.background = createBackground(r.role || '新居民', r.goal || '找到自己的生活方向', r.trait || '', r.background, r.name || 'TA');
    r.background ||= structuredClone(residentBackgrounds[r.id] || createBackground(r.role || '新居民', r.goal || '找到自己的生活方向', r.trait || '', '', r.name || 'TA'));
    r.journal ||= [];
    r.currentThought ||= `我想在榆灯镇把「${r.goal || '自己的目标'}」一点点做起来。`;
    r.lastMealDay ??= state.day - 1;
    r.homelessSince ??= null;
    r.landPlotId ??= null;
    r.ownedBusinessId ??= null;
    r.employmentType ||= (['school','clinic','park','toilet','plaza','townhall','police','prosecutor','courthouse','prison'].includes(jobType) || /公职|镇务|警察|法官|检察|公务员/.test(`${r.role} ${r.job}`)) ? 'public' : 'private';
    r.publicRole ??= null; r.jailDays = Math.max(0, Number(r.jailDays) || 0); r.custodyParentId ??= null;
    r.goalTarget ||= null;
    r.money = Math.max(0, Number(r.money) || 0); r.dreamFund = Math.max(0, Number(r.dreamFund) || 0);
    r.memoryArchive ||= [...(r.memory || [])]; r.compressedMemory ||= '';
    r.dreamHistory ||= [];
    if (!r.dream?.targetCost) chooseNextDream(r);
    r.deceased ||= Number(r.health) <= 0;
    r.health = clamp(r.health);
    r.tools = getTools(r); r.relationships ||= {};
    r.memory = (r.memory || []).map(item => typeof item === 'string' ? { text: item, source: '亲历', confidence: 1, day: state.day, period: state.period, turn: state.turn } : item);
    r.memoryArchive = (r.memoryArchive || []).map(item => typeof item === 'string' ? { text: item, source: '亲历', confidence: 1, day: state.day, period: state.period, turn: state.turn } : item);
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const mapGrid = $('#mapGrid');
  const modalBackdrop = $('#modalBackdrop');
  const modalContent = $('#modalContent');
  let autoTimer = null;
  let turnInProgress = false;
  let toastTimer = null;
  const pendingPerceptions = [];

  function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); }
  function persist() {
    state.worldId = activeTownId;
    try { localStorage.setItem(`yudeng-town-v2:${activeTownId}`, JSON.stringify(state)); localStorage.setItem('society-active-town', activeTownId); } catch { /* local cache may be full; backend storage can still accept the world */ }
    window.SocietyBackend?.saveTown(activeTownId, state);
  }
  function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }
  function buildingById(id) { return state.buildings.find(b => b.id === id); }
  function buildingByType(type) { return state.buildings.find(b => b.type === type); }
  function facilityName(type) { return facilityTypes[type]?.name || '街区'; }
  function rentMultiplier() { return 1 + Math.min(0.75, Math.max(0, Number(state.lastMonthTaxRevenue) || 0) / 2000 * 0.15); }
  function effectiveRent(building) {
    const base = building?.ownership === 'public' ? Number(state.town.rules.publicRent ?? building.baseRent ?? building.rent ?? 8) : Number(building?.baseRent ?? building?.rent ?? 12);
    return Math.max(0, Math.ceil(base * rentMultiplier()));
  }
  function recordTax(amount) {
    const tax = Math.max(0, Math.floor(Number(amount) || 0));
    state.treasury += tax; state.monthTaxRevenue = Math.max(0, Number(state.monthTaxRevenue) || 0) + tax;
    return tax;
  }
  function facilityCapacity(building) {
    if (building.type === 'home') return housingCapacity(building);
    const base = facilityDetails[building.type]?.capacity || 6;
    return Math.max(1, Math.round(base * (1 + (levelOf(building) - 1) * (facilityProgression[building.type]?.gain || 0.12))));
  }
  function facilityEffect(building, effect = 'service') { return 1 + Math.max(0, levelOf(building) - 1) * (facilityProgression[building.type]?.gain || 0.1); }
  function tenantsOf(building) { return state.residents.filter(r => !r.deceased && r.home === building.id); }
  function housingCapacity(building) {
    const base = Number(building.baseCapacity || building.capacity || facilityDetails.home.capacity);
    return Math.max(1, Math.round(base * (1 + (levelOf(building) - 1) * (facilityProgression.home.gain || 0.11))));
  }
  function availableHousing(building) { return Math.max(0, housingCapacity(building) - tenantsOf(building).length); }
  function homeLabel(building) { return building?.name || (building ? facilityName(building.type) : '公共设施'); }
  function businessById(id) { return state.businesses.find(business => business.id === id); }
  function workplaceOf(agent) { return buildingById(agent?.job) || buildingByType(agent?.job) || null; }
  function employerLabel(agent) {
    const workplace = workplaceOf(agent);
    if (agent?.employmentType === 'public') return '镇公所预算 · 公职 / 公共服务';
    const owner = workplace?.ownerId ? state.residents.find(person => person.id === workplace.ownerId) : null;
    return `${owner ? `${owner.name}经营` : '私人雇主'} · 私人经营资金`;
  }
  function marriageFor(agent) { return state.marriages.find(item => item.partnerIds?.includes(agent.id) && item.status !== 'divorced'); }
  function familyMembersOf(agent) {
    if (!agent) return [];
    const byId = id => state.residents.find(person => person.id === id && !person.deceased);
    const members = new Map([[agent.id, agent]]);
    const spouse = byId(agent.spouseId); if (spouse) members.set(spouse.id, spouse);
    const parents = (agent.parents || []).map(byId).filter(Boolean);
    if (agent.age < 18 && parents.length) {
      parents.forEach(parent => members.set(parent.id, parent));
      parents.flatMap(parent => parent.children || []).map(byId).filter(child => child && child.age < 18).forEach(child => members.set(child.id, child));
    }
    const parentIds = new Set([agent.id, spouse?.id].filter(Boolean));
    state.residents.filter(child => !child.deceased && child.age < 18 && (child.parents || []).some(id => parentIds.has(id))).forEach(child => members.set(child.id, child));
    return [...members.values()];
  }
  function assetValue(building) {
    if (!building) return 0;
    if (building.type === 'plot') return landPrice;
    if (building.type === 'home') return Math.max(35, Number(building.salePrice) || 120);
    return Math.max(15, Math.round((facilityTypes[building.type]?.cost || 35) * (0.8 + levelOf(building) * 0.4) + (building.lastMonthlyRevenue || 0) * 2));
  }
  function businessAssetValue(business) {
    const branches = (business.branches || []).filter(id => state.buildings.some(building => building.id === id)).length;
    return Math.max(15, Math.max(0, Number(business.cashBalance) || 0) + branches * 15);
  }
  function familyAssetSummary(agent) {
    const members = familyMembersOf(agent); const ids = new Set(members.map(person => person.id));
    const buildings = state.buildings.filter(building => building.ownerId && ids.has(building.ownerId) && (building.ownership === 'private' || building.type === 'plot'));
    const businesses = state.businesses.filter(business => ids.has(business.ownerId));
    const openLoans = state.loans.filter(loan => loan.balance > 0);
    const receivables = openLoans.filter(loan => ids.has(loan.lenderId) && !ids.has(loan.borrowerId)).reduce((sum, loan) => sum + loan.balance, 0);
    const debts = openLoans.filter(loan => ids.has(loan.borrowerId) && !ids.has(loan.lenderId)).reduce((sum, loan) => sum + loan.balance, 0);
    const cash = members.reduce((sum, person) => sum + (person.money || 0), 0);
    const propertyValue = buildings.reduce((sum, building) => sum + assetValue(building), 0) + businesses.reduce((sum, business) => sum + businessAssetValue(business), 0);
    return { members, buildings, businesses, cash, propertyValue, receivables, debts, netWorth: cash + propertyValue + receivables - debts };
  }
  function custodyScore(child, parent) {
    const relationship = Number(child.relationships?.[parent.id] || 0);
    const home = buildingById(parent.home); const housing = home?.type === 'home' ? 18 + Math.min(12, availableHousing(home) * 3) : -6;
    const violence = state.justice.cases.some(item => item.offenderId === parent.id && ['assault','murder'].includes(item.crimeType) && item.status !== 'dismissed') ? -24 : 0;
    const ageVoice = child.age >= 12 ? 1 : child.age >= 6 ? 0.68 : 0.38;
    const continuity = child.custodyParentId === parent.id ? 9 : 0;
    const careSkill = (parent.proficiencies?.parenting || 0) * 0.12;
    return relationship * ageVoice + continuity + Math.min(24, parent.money / 7) + parent.attributes.emotional * 0.18 + parent.mood * 0.08 + careSkill + housing + violence;
  }
  function divorceAssetPlan(a, b) {
    const cashPool = Math.max(0, Number(a.money) || 0) + Math.max(0, Number(b.money) || 0);
    const cashA = Math.floor(cashPool / 2); const cashB = cashPool - cashA;
    const assets = [
      ...state.buildings.filter(building => (building.ownerId === a.id || building.ownerId === b.id) && (building.ownership === 'private' || building.type === 'plot'))
        .map(asset => ({ kind: 'building', asset, value: assetValue(asset) })),
      ...state.businesses.filter(business => business.ownerId === a.id || business.ownerId === b.id)
        .map(asset => ({ kind: 'business', asset, value: businessAssetValue(asset) })),
    ].sort((left, right) => right.value - left.value);
    const totals = { [a.id]: cashA, [b.id]: cashB };
    const allocations = assets.map(item => {
      const ownerId = totals[a.id] <= totals[b.id] ? a.id : b.id;
      totals[ownerId] += item.value;
      return { ...item, ownerId };
    });
    const richerId = totals[a.id] >= totals[b.id] ? a.id : b.id;
    const poorerId = richerId === a.id ? b.id : a.id;
    return { cashPool, cashA, cashB, totals, allocations, richerId, poorerId, settlement: Math.floor(Math.abs(totals[a.id] - totals[b.id]) / 2) };
  }
  function divorceCouple(a, b, initiatedBy = null) {
    if (!a || !b || a.spouseId !== b.id || b.spouseId !== a.id) return false;
    const marriage = marriageFor(a); const plan = divorceAssetPlan(a, b);
    a.money = plan.cashA; b.money = plan.cashB;
    a.landPlotId = null; b.landPlotId = null;
    a.ownedBusinessId = null; b.ownedBusinessId = null;
    plan.allocations.forEach(({ kind, asset, ownerId }) => {
      const recipient = ownerId === a.id ? a : b;
      if (kind === 'business') {
        asset.ownerId = recipient.id;
        recipient.ownedBusinessId ||= asset.id;
      } else {
        asset.ownerId = recipient.id;
        if (asset.type === 'plot') { asset.name = `${recipient.name}的地块`; recipient.landPlotId ||= asset.id; }
        else if (asset.type === 'home') asset.name = `${recipient.name}的小家`;
      }
    });
    state.businesses.forEach(business => {
      (business.branches || []).forEach(id => {
        const branch = buildingById(id);
        if (!branch || branch.businessId !== business.id) return;
        if (branch.ownerId === business.ownerId && branch.franchiseOf === business.id) branch.franchiseOf = null;
        else if (branch.ownerId !== business.ownerId && !branch.franchiseOf) branch.franchiseOf = business.id;
      });
    });
    const children = state.residents.filter(child => child.parents?.includes(a.id) && child.parents?.includes(b.id) && !child.deceased);
    const custodyNotes = [];
    children.forEach(child => {
      const guardian = custodyScore(child, a) >= custodyScore(child, b) ? a : b;
      child.custodyParentId = guardian.id;
      if (guardian.home && buildingById(guardian.home)?.type === 'home') child.home = guardian.home;
      child.location = child.home || publicShelter()?.id || null;
      const other = guardian.id === a.id ? b : a;
      custodyNotes.push(`${child.name}根据自己的依恋关系、日常照料和安全感，决定跟${guardian.name}生活`);
      remember(child, `父母离婚后，我经过考虑决定跟${guardian.name}生活；我仍然和${other.name}保持亲子关系。`, '家庭', 1);
      remember(guardian, `${child.name}决定由我照料。我会尊重TA继续与${other.name}来往。`);
      remember(other, `${child.name}决定跟${guardian.name}生活，我仍会承担亲子责任。`);
    });
    if (plan.settlement >= 1) {
      const richer = plan.richerId === a.id ? a : b; const poorer = plan.poorerId === a.id ? a : b;
      const settlement = plan.settlement;
      state.loans.unshift({ id: `loan-${state.idCounter++}`, lenderId: poorer.id, borrowerId: richer.id, principal: settlement, balance: settlement, monthlyRate: 0, createdDay: state.day, nextInterestDay: state.day + 30, reason: '离婚财产平分差额结算', status: 'active', repayments: [], type: 'divorce-settlement' });
      custodyNotes.push(`不动产难以拆分，${richer.name}对${poorer.name}形成 ${settlement} 元平分结算债务`);
    }
    a.spouseId = null; b.spouseId = null;
    if (marriage) { marriage.status = 'divorced'; marriage.divorceDay = state.day; marriage.children = [...new Set([...(marriage.children || []), ...children.map(child => child.id)])]; }
    const detail = custodyNotes.length ? custodyNotes.join('；') : '双方没有未成年子女';
    pushEvent(`${safeName(a)}和${safeName(b)}办理离婚：家庭现金、私有房产与店铺品牌按估值平分；${esc(detail)}。`, 'social', '⚖', [a.id, b.id, ...children.map(child => child.id)]);
    remember(a, `我和${b.name}结束了婚姻；家庭现金和名下资产已按平分原则结算。${detail}`);
    remember(b, `我和${a.name}结束了婚姻；家庭现金和名下资产已按平分原则结算。${detail}`);
    recordRelationshipInteraction(a, b, `${a.name}和${b.name}办理离婚，按约分割家庭财产。`, -Math.max(10, Math.abs(Number(a.relationships?.[b.id] || 0))));
    return true;
  }
  function getSelected() { return state.residents.find(r => r.id === state.selectedId) || state.residents[0]; }
  function currentPeriod() { return periods[state.period]; }
  function timeStamp(event) { return `第 ${event.day} 天 · ${periods[event.period]?.name || '早晨'}`; }
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
  }
  function stripMarkup(message) { return String(message).replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }
  function pushEvent(message, type = 'town', icon = '✳', involved = []) {
    const event = { id: `${Date.now()}-${Math.random()}`, message, type, icon, day: state.day, period: state.period, involved };
    state.events.unshift(event); state.events = state.events.slice(0, 60);
    state.logArchive ||= [];
    state.logArchive.unshift(event);
    const anchors = involved.map(id => state.residents.find(r => r.id === id)).filter(Boolean).map(r => {
      const place = buildingById(r.location); return place ? { x: place.x, y: place.y } : null;
    }).filter(Boolean);
    if (anchors.length) pendingPerceptions.push({ id: event.id, text: stripMarkup(message), anchors, involved: [...involved], day: event.day, period: event.period });
  }
  function remember(agent, text, source = '亲历', confidence = 1, timestamp = null) {
    if (!agent) return;
    agent.memory ||= [];
    agent.memoryArchive ||= [];
    const entry = typeof text === 'object' && text !== null ? text : {
      text: String(text), source, confidence,
      day: timestamp?.day ?? state.day, period: timestamp?.period ?? state.period, turn: state.turn,
    };
    entry.id ||= `memory-${agent.id}-${state.turn}-${Math.random().toString(36).slice(2, 7)}`;
    agent.memory.unshift(entry); agent.memoryArchive.unshift(entry);
    if (agent.memory.length > 16) {
      const old = agent.memory.splice(8);
      const details = old.filter(item => item.source !== '压缩回忆').map(item => item.text).slice(0, 6).join('；');
      const prior = old.find(item => item.source === '压缩回忆')?.text || agent.compressedMemory || '';
      agent.compressedMemory = [prior, details].filter(Boolean).join('；').slice(-460);
      const earlier = agent.memory.findIndex(item => item.source === '压缩回忆');
      if (earlier >= 0) agent.memory.splice(earlier, 1);
      agent.memory.unshift({ id: `compressed-${state.turn}`, text: `较早经历的压缩回忆：${agent.compressedMemory}`, source: '压缩回忆', confidence: 0.72, day: old.at(-1)?.day ?? state.day, period: old.at(-1)?.period ?? state.period, turn: old.at(-1)?.turn ?? state.turn });
    }
  }
  function flushNearbyPerceptions() {
    const observations = pendingPerceptions.splice(0);
    observations.forEach(observation => state.residents.forEach(agent => {
      if (observation.involved.includes(agent.id)) return;
      const place = buildingById(agent.location); if (!place) return;
      const withinNineGrid = observation.anchors.some(anchor => Math.abs(anchor.x - place.x) <= 1 && Math.abs(anchor.y - place.y) <= 1);
      if (withinNineGrid) remember(agent, observation.text, '附近九宫格', 0.78, observation);
    }));
  }
  function residentAt(location) { return state.residents.filter(r => r.location === location); }
  function average(key) { return state.residents.length ? Math.round(state.residents.reduce((sum, r) => sum + r[key], 0) / state.residents.length) : 0; }
  function alignmentLabel(agent) { return agent.alignment <= -45 ? '恶名昭著' : agent.alignment <= -15 ? '利己' : agent.alignment >= 55 ? '乐于助人' : agent.alignment >= 25 ? '偏善良' : '立场摇摆'; }
  function relationshipLabel(value) { return value >= 45 ? '亲密' : value >= 20 ? '友好' : value > -15 ? '普通' : value > -45 ? '紧张' : '敌对'; }
  function recordRelationshipInteraction(a, b, text, delta = 0) {
    if (!a || !b) return;
    state.relationshipEvents ||= [];
    state.relationshipEvents.unshift({ a: a.id, b: b.id, text, day: state.day, period: state.period, delta });
    state.relationshipEvents = state.relationshipEvents.slice(0, 120);
  }
  function countStructures() { return state.buildings.filter(building => !['road', 'grass', 'plot'].includes(building.type)).length; }
  function environmentRoadLabel() { return ({ open: '县道畅通', limited: '县道限行', blocked: '县道中断' })[state.environment.road] || '县道畅通'; }
  function cropStatus(building) {
    if (!building.crop) return '等待居民播种';
    const daysLeft = Math.max(0, building.crop.maturesOn - state.day);
    return daysLeft === 0 ? `${building.crop.name}已成熟` : `${building.crop.name} · 还需 ${daysLeft} 天`;
  }
  function cropGrowthDays(farm = null) {
    const base = ({ fertile: 3, normal: 4, poor: 6 })[state.environment.soil] || 4;
    return Math.max(2, base - Math.floor((levelOf(farm || { type: 'farm', level: 1 }) - 1) / 2));
  }
  function importUnitCost() {
    const roadCost = state.environment.road === 'limited' ? 2 : state.environment.road === 'blocked' ? 99 : 0;
    const newsDiscount = state.outside.effect === 'supply' ? 1 : 0;
    const shock = ['strike','recession'].includes(state.outside.effect) ? 2 : 0;
    return Math.max(1, 2 + Number(state.environment.marketPrice || 0) + roadCost + shock - newsDiscount);
  }

  function renderMap() {
    $('#townMapTitle').textContent = `${state.worldName || '榆灯镇'}街区`;
    mapGrid.setAttribute('aria-label', `${state.worldName || '榆灯镇'}地图`);
    document.title = `${state.worldName || '榆灯镇'} · 社会模拟器`;
    mapGrid.innerHTML = '';
    const byCoord = new Map(state.buildings.map(b => [`${b.x},${b.y}`, b]));
    const occupied = new Map();
    state.buildings.filter(building => !['road','grass','plot'].includes(building.type)).forEach(building => {
      occupiedCells(building).forEach((cell, index) => occupied.set(`${cell.x},${cell.y}`, { building, index }));
    });
    const width = state.town.width; const height = state.town.height;
    mapGrid.style.gridTemplateColumns = `repeat(${width}, minmax(76px, 1fr))`;
    mapGrid.style.gridTemplateRows = `repeat(${height}, minmax(82px, 1fr))`;
    mapGrid.style.minWidth = `${width * 76}px`;
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const part = occupied.get(`${x},${y}`);
      let building = part?.building || byCoord.get(`${x},${y}`);
      if (!building) building = { id: `plot-${x}-${y}`, type: 'plot', x, y };
      const tile = document.createElement('button');
      const multiPart = Boolean(part && occupiedCells(building).length > 1);
      tile.type = 'button'; tile.className = `map-tile ${building.type === 'road' ? 'road' : building.type === 'grass' || building.type === 'plot' ? 'grass' : 'building'}${multiPart ? ' building-footprint' : ''}${part && part.index > 0 ? ' footprint-segment' : ''}${building.id === state.selectedBuilding ? ' selected' : ''}`;
      tile.style.gridColumn = String(x + 1); tile.style.gridRow = String(y + 1); tile.dataset.id = building.id; tile.dataset.type = building.type;
      if (building.type === 'road') { tile.innerHTML = '<span class="road-mark">· · ·</span>'; tile.setAttribute('aria-label', '街道'); }
      else if (building.type === 'grass' || building.type === 'plot') {
        tile.classList.add('plot');
        const owned = building.ownerId ? state.residents.find(r => r.id === building.ownerId) : null;
        tile.innerHTML = `<span class="plot-plus">${owned ? '⌂' : '·'}</span><span class="plot-label">${owned ? `${esc(owned.name)}的地` : '空地'}</span>`;
        tile.setAttribute('aria-label', owned ? `${owned.name}的私人地块` : '空地');
      } else if (part && part.index > 0) {
        const meta = facilityTypes[building.type]; const name = buildingName(building);
        tile.style.setProperty('--building-color', meta.color);
        tile.innerHTML = `<span class="footprint-mark">${part.index === 1 ? '↗' : '▦'}</span><span class="building-sub">${levelOf(building)}级 · 占地</span>`;
        tile.setAttribute('aria-label', `${name}的占地格，${levelOf(building)}级，点击查看`);
      } else {
        const meta = facilityTypes[building.type]; const occupants = residentAt(building.id);
        const name = buildingName(building);
        tile.style.setProperty('--building-color', meta.color);
        const farmNote = building.type === 'farm' ? cropStatus(building) : '';
        const homeNote = building.type === 'home' ? `${building.ownership === 'private' ? '私宅' : '公租'} · ${availableHousing(building)}/${housingCapacity(building)}空` : '';
        tile.innerHTML = `<span class="building-roof"></span><span class="building-level">${levelOf(building)}级</span><span class="building-icon">${meta.icon}</span><span class="building-name">${esc(name)}</span><span class="building-sub">${esc(homeNote || farmNote || meta.subtitle)}</span><span class="occupants">${occupants.slice(0, 5).map((r, i) => `<i class="occupant" style="background:${palette[(state.residents.indexOf(r)) % palette.length]};color:#465b48" title="${esc(r.name)}">${esc(r.name.slice(0, 1))}</i>`).join('')}</span>`;
        tile.setAttribute('aria-label', `${name}，${levelOf(building)}级，占用 ${occupiedCells(building).length} 格，${occupants.length} 位居民`);
      }
      tile.addEventListener('click', () => onTileClick(building));
      mapGrid.appendChild(tile);
    }
    $('#buildHint').textContent = '居民自主建设 · 点击建筑或地块旁观详情';
  }

  function onTileClick(building) {
    if (building.type === 'road') return;
    if (building.type === 'plot' || building.type === 'grass') { openPlotModal(building); return; }
    if (building.type !== 'plot' && building.type !== 'grass') {
      state.selectedBuilding = building.id; renderMap(); openBuildingModal(building);
    }
  }

  function openBuildingModal(building) {
    const template = facilityDetails[building.type] || { capacity: 6, services: facilityTypes[building.type]?.subtitle || '街区服务', manager: '镇公所', access: '开放' };
    const occupants = building.type === 'home' ? tenantsOf(building) : residentAt(building.id);
    const staff = state.residents.filter(r => r.job === building.id || r.job === building.type);
    const condition = clamp(building.condition ?? 94);
    const selected = getSelected();
    const owner = building.ownerId ? state.residents.find(r => r.id === building.ownerId) : null;
    const ownHome = building.type === 'home';
    const capacity = facilityCapacity(building);
    const currentLevel = levelOf(building); const maxLevel = facilityProgression[building.type]?.max || 1;
    const nextLevel = currentLevel < maxLevel ? currentLevel + 1 : currentLevel;
    const isPrivate = building.ownership === 'private' || Boolean(building.ownerId && building.businessId);
    const canManage = !isPrivate || owner?.id === selected.id;
    const payerBalance = isPrivate ? Number(owner?.money || 0) : Number(state.treasury || 0);
    const upgradeCost = currentLevel < maxLevel ? Math.ceil((facilityTypes[building.type]?.cost || 30) * (0.55 + nextLevel * 0.32)) : 0;
    const housingInfo = ownHome ? `<div><small>产权与月租</small><b>${building.ownership === 'private' ? `私人房产 · ${esc(owner?.name || '未知业主')}` : '公租房 · 镇公所'} · ${effectiveRent(building)} 元/月</b></div><div><small>租金形成</small><b>基础 ${building.baseRent ?? building.rent ?? state.town.rules.publicRent} 元 · 镇税收联动 ×${rentMultiplier().toFixed(2)}</b></div><div><small>租赁状态</small><b>${occupants.length} / ${capacity} 户 · 空余 ${availableHousing(building)} 户</b></div>` : '';
    const business = building.businessId ? businessById(building.businessId) : null;
    const businessInfo = business ? `<div><small>经营网络</small><b>${esc(business.brand)} · ${business.branches.length} 家门店${building.franchiseOf ? ' · 加盟店' : ''} · 上月营业额 ${building.lastMonthlyRevenue || 0} 元</b></div>` : '';
    const cropInfo = building.type === 'farm' ? `<div><small>作物生长</small><b>${esc(cropStatus(building))}</b></div>` : '';
    const foodInfo = building.type === 'restaurant' ? `<div><small>镇上食物</small><b>${state.foodStock} 份 · ${esc(environmentRoadLabel())}</b></div>` : '';
    const residentsHtml = occupants.length ? occupants.map(agent => `<button class="building-resident" type="button" data-resident="${esc(agent.id)}"><span class="building-resident-avatar" style="background:${palette[state.residents.indexOf(agent) % palette.length]}">${esc(agent.name.slice(0, 1))}</span><span><b>${esc(agent.name)}</b><small>${esc(agent.role)} · 心情 ${agent.mood} · 精力 ${agent.energy}</small></span><i>查看 ↗</i></button>`).join('') : '<div class="event-empty building-empty">目前没有居民在这里。<br/>推进回合后，他们会根据目标与需求前来。</div>';
    const status = condition >= 75 ? '状态良好' : condition >= 45 ? '需要维护' : '亟待修缮';
    const footprint = occupiedCells(building); const nextRotation = Number(building.rotation) || 0;
    const orientationSelect = `<select id="upgradeRotation" aria-label="建筑朝向">${[0,90,180,270].map(degrees => `<option value="${degrees}" ${degrees === nextRotation ? 'selected' : ''}>${degrees}°</option>`).join('')}</select>`;
    const upgradeControls = facilityProgression[building.type]?.max > 1 && canManage ? `<section class="building-upgrade"><div class="profile-section-title"><span>建筑等级</span><small>上限 ${maxLevel} 级</small></div><p class="plot-hint">${facilityLevelName(building.type,currentLevel)} · 当前占地 ${footprint.length} 格 · 朝向 ${Number(building.rotation)||0}°</p><div class="upgrade-preview-row"><div id="upgradePreview">${shapePreviewHtml(building.type,nextLevel,nextRotation)}</div><label>计划朝向 ${orientationSelect}</label></div><small id="footprintStatus" class="footprint-status">${currentLevel < maxLevel ? `下一阶将成为「${facilityLevelName(building.type,nextLevel)}」，占地 ${footprintCells(building.type,nextLevel,nextRotation).length} 格。` : '已达到该类设施等级上限。'}</small><div class="upgrade-actions"><button class="modal-submit secondary-submit" id="rotateBuildingButton" ${nextRotation === (Number(building.rotation)||0) ? 'disabled' : ''}>调整当前朝向</button>${currentLevel < maxLevel ? `<button class="modal-submit" id="upgradeBuildingButton">升级到 ${nextLevel} 级 · ${upgradeCost} 元</button>` : ''}</div><small class="plot-hint">${isPrivate ? `由业主出资 · 可用余额 ${payerBalance} 元` : `镇公所出资 · 当前预算 ${payerBalance} 元`}</small></section>` : '';
    const rentManagement = ownHome ? (owner?.id === selected.id ? `<form id="rentForm" class="form-grid rent-form"><div class="form-field"><label for="rentInput">自定基础月租（元）</label><input id="rentInput" name="rent" type="number" min="0" max="1000" value="${Number(building.baseRent ?? building.rent ?? 12)}" required /></div><button class="modal-submit" type="submit">更新租金</button></form>` : `<div class="plot-actions">${building.ownership === 'private' && availableHousing(building) > 0 ? `<button class="modal-submit" id="rentHomeButton">租住一间 · ${effectiveRent(building)} 元/月</button>` : ''}${building.ownership === 'private' && selected.money >= (building.salePrice || 150) ? `<button class="modal-submit secondary-submit" id="buyHomeButton">购买整栋房屋 · ${building.salePrice || 150} 元</button>` : ''}</div>`) : '';
    openModal('FACILITY PROFILE', buildingName(building), '升级会提升容量或服务效率；建筑占用的网格形状会随等级变化，也可以调整朝向。', `
      <div class="building-hero"><span>${facilityTypes[building.type]?.icon || '⌂'}</span><div><b>${facilityLevelName(building.type,currentLevel)} · ${currentLevel} 级</b><small>${status} · 建筑维护 ${condition}% · 占地 ${footprint.length} 格</small></div></div>
      <div class="building-facts"><div><small>使用容量</small><b>${ownHome ? occupants.length : residentAt(building.id).length} / ${capacity}</b></div><div><small>维护主体</small><b>${owner ? esc(owner.name) : esc(template.manager)}</b></div><div><small>开放方式</small><b>${esc(template.access)}</b></div><div><small>日常服务</small><b>${esc(template.services)} · 效率 ×${facilityEffect(building).toFixed(2)}</b></div><div><small>固定工作人员</small><b>${staff.length ? staff.map(r => esc(r.name)).join('、') : '暂无'}</b></div><div><small>所在网格与朝向</small><b>${building.x + 1} 列 · ${building.y + 1} 行 · ${Number(building.rotation)||0}°</b></div>${housingInfo}${businessInfo}${cropInfo}${foodInfo}</div>
      ${upgradeControls}${rentManagement}
      <div class="building-occupants-heading"><span>当前居民</span><small>${occupants.length} 人</small></div><div class="building-residents">${residentsHtml}</div>`);
    modalContent.querySelectorAll('[data-resident]').forEach(button => button.addEventListener('click', () => { const id = button.dataset.resident; closeModal(); selectResident(id); }));
    if ($('#rentForm')) $('#rentForm').addEventListener('submit', event => { event.preventDefault(); building.baseRent = Math.max(0, Math.min(1000, Number(new FormData(event.currentTarget).get('rent')) || 0)); building.rent = building.baseRent; pushEvent(`${safeName(owner)}把${esc(buildingName(building))}的基础月租设为 ${building.baseRent} 元，按镇税收联动后当前为 ${effectiveRent(building)} 元。`, 'town', '⌂', [owner.id]); closeModal(); render(); });
    $('#rentHomeButton')?.addEventListener('click', () => { const ok = leaseHome(selected, building); if (ok) { closeModal(); render(); } });
    $('#buyHomeButton')?.addEventListener('click', () => { if (buyHouse(selected, building)) { closeModal(); render(); } });
    const rotationControl = $('#upgradeRotation');
    const refreshFootprintPreview = () => {
      if (!rotationControl) return;
      const rotation = Number(rotationControl.value); const previewLevel = currentLevel < maxLevel ? currentLevel + 1 : currentLevel;
      $('#upgradePreview').innerHTML = shapePreviewHtml(building.type, previewLevel, rotation);
      const fits = footprintFits(building.type, previewLevel, rotation, building.x, building.y, building.id, owner?.id || null);
      const cost = currentLevel < maxLevel ? Math.ceil((facilityTypes[building.type]?.cost || 30) * (0.55 + (currentLevel + 1) * 0.32)) : 0;
      $('#footprintStatus').textContent = currentLevel >= maxLevel ? '已达到该类设施等级上限。' : fits ? `下一阶将成为「${facilityLevelName(building.type,previewLevel)}」，占地 ${footprintCells(building.type,previewLevel,rotation).length} 格；朝向 ${rotation}°。` : '这个形状或朝向会超出镇区，或与道路、建筑、他人地块冲突。';
      const rotateButton = $('#rotateBuildingButton'); if (rotateButton) rotateButton.disabled = rotation === (Number(building.rotation)||0) || !footprintFits(building.type,currentLevel,rotation,building.x,building.y,building.id,owner?.id||null);
      const upgradeButton = $('#upgradeBuildingButton'); if (upgradeButton) { upgradeButton.disabled = !fits || payerBalance < cost; upgradeButton.textContent = `${fits ? `升级到 ${previewLevel} 级` : '占地位置冲突'} · ${cost} 元`; }
    };
    rotationControl?.addEventListener('change', refreshFootprintPreview);
    refreshFootprintPreview();
    $('#rotateBuildingButton')?.addEventListener('click', () => {
      const rotation = Number(rotationControl.value);
      if (!footprintFits(building.type,currentLevel,rotation,building.x,building.y,building.id,owner?.id||null)) { toast('这个朝向会与道路、建筑或他人地块冲突。'); return; }
      building.rotation = rotation; pushEvent(`${esc(buildingName(building))}调整了朝向，占地 ${occupiedCells(building).length} 格。`, 'town', '⌖', owner ? [owner.id] : []); closeModal(); render();
    });
    $('#upgradeBuildingButton')?.addEventListener('click', () => {
      const rotation = Number(rotationControl.value); const targetLevel = currentLevel + 1; const cost = Math.ceil((facilityTypes[building.type]?.cost || 30) * (0.55 + targetLevel * 0.32));
      if (payerBalance < cost || !footprintFits(building.type,targetLevel,rotation,building.x,building.y,building.id,owner?.id||null)) { toast('预算不足，或升级后的占地与周围设施冲突。'); return; }
      if (isPrivate) owner.money = Math.max(0,owner.money-cost); else state.treasury = Math.max(0,state.treasury-cost);
      const oldLevel = levelOf(building); building.level = targetLevel; building.rotation = rotation;
      if (ownHome) { building.baseCapacity ||= Number(building.capacity) || facilityDetails.home.capacity; building.capacity = Math.round(building.baseCapacity * (1 + (targetLevel-1) * facilityProgression.home.gain)); building.salePrice = Math.round((building.salePrice || 150) * 1.18); }
      if (building.crop) building.crop.yield = Math.round((building.crop.yield || 12) * (1 + facilityProgression[building.type].gain));
      const payerName = isPrivate ? owner.name : '镇公所';
      pushEvent(`${safeName(selected)}${isPrivate ? '出资' : '推动镇公所'}花费 ${cost} 元，将${esc(buildingName(building))}从 ${oldLevel} 级升级到 ${targetLevel} 级，占地扩展为 ${occupiedCells(building).length} 格。`, 'town', '⬆', [selected.id, ...(owner && owner.id !== selected.id ? [owner.id] : [])]);
      if (isPrivate) remember(owner, `我为${buildingName(building)}投入 ${cost} 元升级到 ${targetLevel} 级，能力和容量都会提高。`);
      else remember(selected, `我推动镇公所为${buildingName(building)}投入 ${cost} 元升级到 ${targetLevel} 级。`);
      closeModal(); render(); toast(`${buildingName(building)}已升级到 ${targetLevel} 级。`);
    });
  }

  const landPrice = 25;
  const privateHomeCost = 75;
  const privateShopTypes = ['market', 'cafe', 'petshop'];
  function homeOccupied(agent, building) {
    const rent = effectiveRent(building);
    if (!building || availableHousing(building) <= 0 || agent.money < rent) return false;
    if (agent.home && agent.home !== building.id) { const previous = buildingById(agent.home); if (previous && previous.ownership === 'private' && previous.ownerId !== agent.id) { /* old lease ends when the new lease starts */ } }
    debit(agent, rent);
    if (building.ownership === 'private' && building.ownerId) {
      const owner = state.residents.find(r => r.id === building.ownerId); if (owner) owner.money += rent;
    } else state.treasury += rent;
    agent.home = building.id; agent.homelessSince = null;
    remember(agent, `我租下了${buildingName(building)}，当前月租 ${rent} 元。`);
    pushEvent(`${safeName(agent)}租住了${esc(buildingName(building))}，月租 ${rent} 元。`, 'town', '⌂', [agent.id, ...(building.ownerId ? [building.ownerId] : [])]);
    return true;
  }
  function leaseHome(agent, building) {
    if (!agent || agent.deceased || building.type !== 'home' || building.ownership !== 'private') return false;
    if (agent.home === building.id) { toast('TA 已经住在这栋房子里。'); return false; }
    if (availableHousing(building) <= 0) { toast('这栋房子的出租容量已满。'); return false; }
    if (!homeOccupied(agent, building)) { toast('钱不够支付首月租金，无法签下租约。'); return false; }
    return true;
  }
  function buyHouse(agent, building) {
    const price = Number(building.salePrice || 150);
    if (agent.money < price) { toast('存款还不够买下这栋房子。'); return false; }
    const formerOwner = state.residents.find(r => r.id === building.ownerId);
    agent.money -= price; if (formerOwner) formerOwner.money += price;
    building.ownerId = agent.id; building.ownership = 'private';
    if (agent.home !== building.id && availableHousing(building) > 0) agent.home = building.id;
    pushEvent(`${safeName(agent)}花 ${price} 元买下了${esc(building.name || '一栋房子')}。`, 'town', '⌂', [agent.id, ...(formerOwner ? [formerOwner.id] : [])]);
    return true;
  }
  function landAt(x, y) { return state.buildings.find(b => b.x === x && b.y === y && (b.type === 'grass' || b.type === 'plot')); }
  function purchaseLand(agent, plot, quiet = false) {
    if (agent.money < landPrice || countStructures() >= state.town.rules.maxBuildings) { if (!quiet) toast(agent.money < landPrice ? `需要 ${landPrice} 元才能买地。` : '建筑数量已达到区域上限。'); return false; }
    agent.money -= landPrice;
    let tile = landAt(plot.x, plot.y);
    if (!tile) { tile = { id: `land-${state.idCounter++}`, type: 'plot', x: plot.x, y: plot.y }; state.buildings.push(tile); }
    tile.type = 'plot'; tile.landOwned = true; tile.ownerId = agent.id; tile.name = `${agent.name}的地块`; agent.landPlotId = tile.id;
    if (agent.goalTarget?.type === 'buy_plot' && agent.goalTarget.x === plot.x && agent.goalTarget.y === plot.y) agent.goalTarget.status = 'land-purchased';
    recordPlotGoalConflict(agent, plot);
    remember(agent, `我花 ${landPrice} 元买下了第 ${plot.x + 1} 列、第 ${plot.y + 1} 行的地块。`);
    pushEvent(`${safeName(agent)}花 ${landPrice} 元买下了一块私人土地。`, 'town', '⌂', [agent.id]);
    return true;
  }
  function buildPrivateHome(agent, plot, quiet = false) {
    if (agent.money < privateHomeCost || countStructures() >= state.town.rules.maxBuildings) { if (!quiet) toast(agent.money < privateHomeCost ? `建房还需要 ${privateHomeCost} 元。` : '建筑数量已达到区域上限。'); return false; }
    agent.money -= privateHomeCost;
    const oldHome = buildingById(agent.home);
    const id = `private-home-${state.idCounter++}`;
    const building = { id, type: 'home', x: plot.x, y: plot.y, name: `${agent.name}的小家`, ownership: 'private', ownerId: agent.id, capacity: 4, rent: 12, salePrice: 160, condition: 96 };
    state.buildings = state.buildings.filter(b => !(b.x === plot.x && b.y === plot.y && ['grass', 'plot'].includes(b.type)));
    state.buildings.push(building); agent.home = id; agent.location = id; agent.homelessSince = null; agent.landPlotId = null;
    if (agent.goalTarget?.status === 'land-purchased') agent.goalTarget.status = 'fulfilled';
    if (oldHome?.ownership === 'private' && oldHome.ownerId !== agent.id) { /* moving ends the prior tenancy */ }
    remember(agent, `我花 ${privateHomeCost} 元盖起了自己的房子，往后不用再交别人的房租。`);
    pushEvent(`${safeName(agent)}花 ${privateHomeCost} 元盖起了自己的房子。`, 'town', '⌂', [agent.id]);
    return true;
  }
  function establishBusiness(agent, plot, type, franchiseId = null, quiet = false) {
    const meta = facilityTypes[type]; const existingBrand = franchiseId ? businessById(franchiseId) : null;
    const royaltyFee = existingBrand && existingBrand.ownerId !== agent.id ? 20 : 0;
    const cost = (meta?.cost || 45) + royaltyFee;
    if (!meta || agent.money < cost || countStructures() >= state.town.rules.maxBuildings) { if (!quiet) toast(agent.money < cost ? `开店需要 ${cost} 元。` : '建筑数量已达到区域上限。'); return false; }
    agent.money -= cost;
    state.buildings = state.buildings.filter(b => !(b.x === plot.x && b.y === plot.y && ['grass', 'plot'].includes(b.type)));
    const id = `private-shop-${state.idCounter++}`;
    let business = existingBrand;
    if (!business) {
      business = { id: `brand-${state.idCounter++}`, ownerId: agent.id, brand: `${agent.name}的${meta.name}`, type, branches: [], royaltyRate: 0.1 };
      state.businesses.push(business); agent.ownedBusinessId = business.id;
    }
    const building = { id, type, x: plot.x, y: plot.y, name: franchiseId ? `${business.brand}·加盟店` : `${agent.name}的${meta.name}`, ownership: 'private', ownerId: agent.id, businessId: business.id, franchiseOf: franchiseId && business.ownerId !== agent.id ? business.id : null, condition: 96 };
    state.buildings.push(building); business.branches.push(id); agent.job = id; agent.location = id;
    agent.landPlotId = null;
    agent.tools = getTools(agent);
    pushEvent(franchiseId && business.ownerId !== agent.id ? `${safeName(agent)}投入 ${cost} 元加盟「${esc(business.brand)}」，开出一家分店。` : `${safeName(agent)}投入 ${cost} 元开了${esc(meta.name)}，开始经营自己的店。`, 'work', meta.icon, [agent.id, ...(franchiseId && business.ownerId !== agent.id ? [business.ownerId] : [])]);
    remember(agent, franchiseId ? `我加盟了${business.brand}，按约定把一部分营业收入交给品牌方。` : `我开了自己的${meta.name}，希望靠经营慢慢攒下钱。`);
    return true;
  }
  function openPlotModal(plot) {
    const currentLand = landAt(plot.x, plot.y);
    const ownerId = plot.ownerId || currentLand?.ownerId;
    const owned = ownerId ? state.residents.find(r => r.id === ownerId) : null;
    const coords = `${plot.x + 1} 列 · ${plot.y + 1} 行`;
    const residents = currentLand?.ownerId ? `<p class="plot-hint">登记居民：${esc(owned?.name || '已离世居民')} · 私人住房、店铺和扩建均由居民结合自己的资金与目标决定。</p>` : '';
    const status = owned ? `这是${esc(owned.name)}的私人地块。` : '目前是空地；居民和公职人员会按需求自行购地、提案、表决和建设。';
    openModal('LAND & PROPERTY', `${owned ? esc(owned.name) + '的地块' : '空地'} · ${coords}`, `${status} 你可以继续观察这块地后续发生的变化。`, `${residents}<div class="building-facts"><div><small>地块状态</small><b>${owned ? '私人持有' : '尚未开发'}</b></div><div><small>区域位置</small><b>${coords}</b></div><div><small>公共建设</small><b>由居民提案并投票决定</b></div><div><small>当前镇公所预算</small><b>${state.treasury} 元</b></div></div><button class="modal-submit" id="plotDone">继续观察</button>`);
    $('#plotDone').addEventListener('click', closeModal);
  }

  function renderDetail() {
    const agent = getSelected();
    if (!agent) { $('#residentDetail').innerHTML = '<p class="event-empty">小镇还没有居民。</p>'; return; }
    const location = buildingById(agent.location); const jobPlace = buildingById(agent.job) || buildingByType(agent.job);
    const paletteIndex = state.residents.indexOf(agent) % palette.length;
    const moodWord = agent.deceased ? '已离世' : agent.anger > 72 ? '正在生气' : agent.mood > 75 ? '心情不错' : agent.mood > 45 ? '状态平稳' : '有些烦闷';
    const directive = agent.directive && agent.directive.until > state.turn ? `正在尝试：${esc(agent.directive.label)}` : agent.goalTarget?.status === 'active' ? `具体目标：${esc(agent.goalTarget.label)}` : agent.goalTarget?.status === 'blocked' ? `目标受阻：${esc(agent.goalTarget.label)}（被${esc(state.residents.find(person=>person.id===agent.goalTarget.blockedBy)?.name || '他人')}占下）` : `当前目标：${esc(agent.goal)}`;
    const attributes = Object.entries(attributeLabels).map(([key, label]) => `<div class="attribute-chip" title="${label} · 成长 ${Number(agent.attributeProgress?.[key] || 0).toFixed(1)} / 3"><span>${label}</span><b>${limitStat(agent.attributes?.[key] || 0)}</b><small>成长 ${Number(agent.attributeProgress?.[key] || 0).toFixed(1)}/3</small></div>`).join('');
    const proficiencies = Object.entries(proficiencyLabels).map(([key, label]) => {
      const value = limitStat(agent.proficiencies?.[key] || 0);
      return `<div class="proficiency-item"><div><span>${label}</span><b>${value}</b></div><i><em style="width:${value}%"></em></i></div>`;
    }).join('');
    $('#residentDetail').innerHTML = `
      <div class="resident-head"><div class="portrait" style="--portrait:${palette[paletteIndex]}">${esc(agent.name.slice(0, 1))}</div><div><div class="resident-name">${esc(agent.name)}<span class="resident-tag">${esc(agent.trait.split(/[、，, ]/)[0])}</span></div><div class="resident-role">${esc(agent.role)} · ${esc(moodWord)}</div></div></div>
      <p class="resident-summary">${esc(directive)}。${agent.home ? `现在住在 <b>${esc(homeLabel(buildingById(agent.home)))}</b>` : '<b class="homeless-label">目前无家可归，夜里只能在公共设施暂住</b>'}；此刻在 <b>${esc(location?.name || facilityName(location?.type))}</b>，平时在${esc(jobPlace?.name || facilityName(jobPlace?.type))}工作，工资由${esc(employerLabel(agent))}支付${agent.jailDays ? `；目前服刑，余刑 ${agent.jailDays} 天` : ''}。</p>
      <div class="current-thought"><span>此刻想法</span><p>“${esc(agent.currentThought || `我想在榆灯镇把「${agent.goal}」一点点做起来。`)}”</p></div>
      ${meter('心情', agent.mood, '')}${meter('精力', agent.energy, '')}${meter('健康', agent.health, 'warm')}${meter('饱腹', agent.hunger, 'warm')}
      <div class="profile-section-title"><span>基础属性</span><small>0—100</small></div><div class="attribute-grid">${attributes}</div>
      <div class="profile-section-title proficiency-title"><span>熟练度</span><small>会随实践成长</small></div><div class="proficiency-grid">${proficiencies}</div>
      <div class="profile-foot"><span>可用余额 <b>${agent.money} 元</b></span><span>借出未还 <b>${receivableBalance(agent.id)} 元</b> · 欠款 <b>${debtBalance(agent.id)} 元</b></span></div>
      <div class="resident-meta dream-summary">梦想：${esc(agent.dream?.title || '还没有定下新梦想')} · 储蓄 ${agent.dreamFund || 0} / ${agent.dream?.targetCost || 0} 元<div class="dream-meter"><i style="width:${Math.max(0, Math.min(100, agent.dream?.progress || 0))}%"></i></div></div>
      <div class="detail-actions"><button data-directive="social">鼓励交朋友</button><button data-directive="work">专注目标</button><button data-directive="rest">提醒休息</button></div>
      <div class="profile-links"><button class="text-button prompt-link" id="editResidentButton">编辑属性与设定 ✎</button><button class="text-button prompt-link" id="familyAssetsButton">家庭资产与财产 ↗</button><button class="text-button prompt-link" id="financeButton">借贷账本 · ${agent.money} 元</button><button class="text-button prompt-link" id="journalButton">行动日志与想法 · ${agent.journal.length}</button><button class="text-button prompt-link" id="backgroundButton">人物背景 ↗</button><button class="text-button prompt-link" id="promptButton">角色设定与工具 ↗</button><button class="text-button prompt-link" id="memoryButton">记忆 ${agent.memory.length} 条 · 历史 ${agent.memoryArchive.length} 条</button></div>`;
    const meta = document.createElement('div'); meta.className = 'resident-meta';
    const spouse = state.residents.find(r => r.id === agent.spouseId);
    const family = spouse ? '已与 ' + spouse.name + ' 结婚 · ' + (agent.children?.length || 0) + ' 个孩子' : agent.parents?.length ? '有 ' + agent.parents.length + ' 位父母' : '未婚';
    meta.textContent = [agent.gender, agent.age + ' 岁 · ' + lifeStage(agent), agent.mbti || 'ISFJ', agent.zodiac || '未记录星座', `${alignmentLabel(agent)} · 道德值 ${agent.alignment}`, family].join(' · ');
    const residentHead = $('#residentDetail .resident-head');
    if (residentHead) residentHead.after(meta); else $('#residentDetail').prepend(meta);
    if (agent.interests?.length || agent.experiences?.length) {
      const growth = document.createElement('div'); growth.className = 'resident-meta';
      growth.textContent = agent.interests?.length ? '兴趣：' + agent.interests.map(item => (proficiencyLabels[item.key] || item.key) + ' ' + item.value).join(' · ') + ' · 经历 ' + (agent.experiences?.length || 0) + ' 条' : '人生经历 ' + agent.experiences.length + ' 条';
      meta.after(growth);
    }
    if (agent.tokenUsage?.estimated) {
      const tokenMeta = document.createElement('div'); tokenMeta.className = 'resident-meta token-usage-note';
      tokenMeta.textContent = `大模型初始化 token 估算分摊：输入 ${agent.tokenUsage.inputTokens} · 输出 ${agent.tokenUsage.outputTokens} · 合计 ${agent.tokenUsage.totalTokens}。按居民背景文本长度分摊整批调用。`;
      const growthMeta = $('#residentDetail .resident-meta'); (growthMeta || meta).after(tokenMeta);
    }
    if (agent.runtimeTokenUsage) {
      const runtimeMeta = document.createElement('div'); runtimeMeta.className = 'resident-meta token-usage-note';
      const runtime = agent.runtimeTokenUsage;
      runtimeMeta.textContent = `逐回合模型用量（实际）：${runtime.calls || 0} 次 · 输入 ${runtime.inputTokens || 0} · 输出 ${runtime.outputTokens || 0} · 合计 ${runtime.totalTokens || 0} tokens · 回退 ${runtime.failedCalls || 0} 次${runtime.model ? ` · ${runtime.model}` : ''}。`;
      const notes = Array.from($('#residentDetail').querySelectorAll('.resident-meta')); (notes[notes.length - 1] || meta).after(runtimeMeta);
    }
    const statusLine = document.createElement('div'); statusLine.className = 'resident-meta health-note';
    statusLine.textContent = agent.illness ? '疾病：' + agent.illness.name + ' · 未治疗 ' + (agent.illness.daysUntreated || 0) + ' 天' : '暂无疾病';
    const meters = $('#residentDetail .meter-row');
    if (meters?.length) meters[2].insertAdjacentHTML('afterend', meter('愤怒', agent.anger || 0, 'rose'));
    $('#residentDetail').querySelector('.current-thought')?.after(statusLine);
    const relationLink = document.createElement('button'); relationLink.type = 'button'; relationLink.className = 'text-button prompt-link'; relationLink.textContent = '关系网与互动记录 ↗';
    relationLink.addEventListener('click', () => showRelationships(agent));
    $('#residentDetail .profile-links')?.append(relationLink);
    $('#residentDetail').querySelectorAll('[data-directive]').forEach(button => button.addEventListener('click', () => nudge(agent.id, button.dataset.directive)));
    $('#promptButton').addEventListener('click', () => showPrompt(agent));
    $('#memoryButton').addEventListener('click', () => showMemories(agent));
    $('#journalButton').addEventListener('click', () => showJournal(agent));
    $('#financeButton').addEventListener('click', () => openFinanceModal(agent));
    $('#backgroundButton').addEventListener('click', () => showBackground(agent));
    $('#editResidentButton').addEventListener('click', () => openResidentEditor(agent));
    $('#familyAssetsButton').addEventListener('click', () => openFamilyAssetsModal(agent));
  }

  function meter(label, value, tone) {
    const fillTone = tone || (value < 40 ? 'rose' : '');
    return `<div class="meter-row"><span class="meter-label">${label}</span><div class="meter-track"><div class="meter-fill ${fillTone}" style="width:${clamp(value)}%"></div></div><span class="meter-value">${clamp(value)}</span></div>`;
  }
  function skillSummary(r) {
    if (r.specialty) return attributeLabels[r.specialty] || proficiencyLabels[r.specialty] || r.specialty;
    const rows = Object.entries({ '照护': r.skills.care, '社交': r.skills.social, '手艺': r.skills.craft, '知识': r.skills.knowledge }).sort((a, b) => b[1] - a[1]);
    return rows.slice(0, 2).map(([label]) => label).join(' · ');
  }
  function renderPeople() {
    const strip = $('#peopleStrip'); strip.innerHTML = '';
    state.residents.forEach((r, i) => {
      const chip = document.createElement('button'); chip.className = `person-chip${r.id === state.selectedId ? ' active' : ''}`; chip.type = 'button';
      chip.innerHTML = `<span class="person-mini" style="background:${palette[i % palette.length]}">${esc(r.name.slice(0, 1))}</span><span class="person-label"><b>${esc(r.name)}</b><small>${esc(r.role)}</small></span><i class="person-status ${Math.min(r.mood, r.energy, r.health) < 39 ? 'low' : ''}"></i>`;
      chip.addEventListener('click', () => selectResident(r.id)); strip.appendChild(chip);
    });
    $('#peopleCountHeading').textContent = state.residents.length;
    $('#residentCount').innerHTML = `${state.residents.length} <small>人</small>`;
    $('#populationLabel').textContent = `${state.residents.length} / ${state.town.rules.maxPopulation} 人`;
    $('#moodValue').innerHTML = `${average('mood')}<small>/100</small>`;
    $('#moodNote').textContent = average('mood') >= 70 ? '大家今天心情不错' : average('mood') >= 48 ? '小镇氛围平和' : '居民需要一些关心';
    $('#fundValue').innerHTML = `${state.treasury}<small> 元</small>`;
    $('#foodCount').innerHTML = `${Math.floor(state.foodStock)}<small> 份</small>`;
    const dailyMeals = Math.max(1, state.residents.length);
    $('#foodNote').textContent = `${Math.floor(state.foodStock / dailyMeals)} 天口粮 · ${state.buildings.filter(b => b.type === 'farm').length} 处农田`;
    $('#eventCount').innerHTML = `${state.events.filter(e => e.day === state.day).length}<small> 件事</small>`;
    $('#dateLabel').textContent = `第 ${state.day} 天 · 第 ${Math.floor((state.day - 1) / 30) + 1} 月`;
    $('#periodLabel').textContent = `${currentPeriod().name} · ${currentPeriod().time}`;
    $('#weatherIcon').textContent = currentPeriod().icon;
    $('#weatherText').textContent = currentPeriod().weather;
    $('#residentNote').textContent = state.residents.length < 15 ? '每个人都有自己的故事' : '居民正在共同塑造小镇';
  }
  function renderEvents() {
    const container = $('#eventList');
    if (!state.events.length) { container.innerHTML = '<div class="event-empty">小镇刚刚醒来。<br/>推进一轮，故事就会开始。</div>'; return; }
    container.innerHTML = state.events.slice(0, 12).map(event => `<article class="event-item"><span class="event-icon ${esc(event.type)}">${esc(event.icon)}</span><div><div class="event-copy">${event.message}</div><div class="event-time">${timeStamp(event)}</div></div></article>`).join('');
  }
  function proposalVoterRows(proposal) {
    return (proposal?.voters || []).map(id => {
      const agent = state.residents.find(resident => resident.id === id);
      const vote = proposal.votes?.[id] || 'pending';
      const label = vote === 'yes' ? '赞成' : vote === 'no' ? '反对' : vote === 'abstain' ? '弃权' : '待表决';
      return `<span class="vote-person ${vote}" title="${esc(label)}">${esc(agent?.name || '已离镇居民')}<i>${label}</i></span>`;
    }).join('');
  }
  function proposalOutcomeLabel(record) {
    return record.status === 'built' ? '已通过 · 建成' : record.status === 'rejected' ? '未通过' : '处理中';
  }
  function renderCivicAssembly() {
    const container = $('#civicBoardContent');
    if (!container) return;
    const proposal = state.publicProposal || state.approvedBuild;
    if (!proposal) {
      const latest = state.publicProposalHistory?.[0];
      container.innerHTML = `<div class="assembly-empty"><span class="assembly-symbol">⌂</span><div><b>目前没有待表决提案</b><p>镇公所公职人员和居民会根据生活需要自行提议；达到三分之二门槛后，居民施工，镇公所承担公共预算。</p></div></div>${latest ? `<div class="assembly-latest"><small>最近一次表决 · 第 ${latest.resolvedDay} 天</small><b>${esc(facilityTypes[latest.type]?.name || '公共设施')} · ${proposalOutcomeLabel(latest)}</b><span>赞成 ${latest.yes} · 反对 ${latest.no} · ${latest.voters.length} 位居民参与</span></div>` : ''}`;
      return;
    }
    const voterCount = (proposal.voters || []).length;
    const yes = Object.values(proposal.votes || {}).filter(vote => vote === 'yes').length;
    const no = Object.values(proposal.votes || {}).filter(vote => vote === 'no').length;
    const abstain = Object.values(proposal.votes || {}).filter(vote => vote === 'abstain').length;
    const pending = Math.max(0, voterCount - yes - no - abstain);
    const threshold = publicVoteThreshold(voterCount);
    const isApproved = proposal === state.approvedBuild;
    const yesWidth = voterCount ? Math.min(100, yes / voterCount * 100) : 0;
    container.innerHTML = `<div class="assembly-proposal"><div class="assembly-proposal-head"><div><small>${isApproved ? '居民已表决通过 · 等待居民施工' : '居民正在表决'}</small><h3>${esc(facilityTypes[proposal.type]?.name || '公共设施')}</h3></div><span class="assembly-cost">${proposal.cost || facilityTypes[proposal.type]?.cost || 0} 元</span></div><p class="assembly-reason">${esc(proposal.reason || '居民提出公共建设需求')} · ${esc(proposal.proposerName || '居民')}发起 · 选址第 ${Number(proposal.plot?.x || 0) + 1} 列、第 ${Number(proposal.plot?.y || 0) + 1} 行</p><div class="assembly-progress"><div><span>赞成 ${yes}</span><span>反对 ${no}</span><span>待表决 ${pending}</span><b>通过需 ${threshold}/${voterCount} 票</b></div><i><em style="width:${yesWidth}%"></em></i></div><div class="vote-roster">${proposalVoterRows(proposal)}</div></div>`;
  }
  function openProposalHistoryModal() {
    const current = state.publicProposal || state.approvedBuild;
    const currentBlock = current ? `<div class="profile-section-title"><span>当前提案 · ${esc(facilityTypes[current.type]?.name || '公共设施')}</span><small>${current === state.approvedBuild ? '已通过，等待居民施工' : '正在表决'}</small></div><div class="vote-roster history-vote-roster">${proposalVoterRows(current)}</div>` : '';
    const rows = (state.publicProposalHistory || []).map(record => `<article class="journal-entry"><header><span class="journal-date">第 ${record.startedDay} 天</span><b>${esc(facilityTypes[record.type]?.name || '公共设施')}</b><small>${proposalOutcomeLabel(record)}</small></header><p>${esc(record.proposerName || '居民')}提出 · 赞成 ${record.yes} / 反对 ${record.no} · 第 ${record.resolvedDay} 天结束 · ${record.cost} 元</p><div class="vote-roster history-vote-roster">${(record.voters || []).map(voter => { const label = voter.vote === 'yes' ? '赞成' : voter.vote === 'no' ? '反对' : '未投票'; return `<span class="vote-person ${voter.vote}" title="${label}">${esc(voter.name)}<i>${label}</i></span>`; }).join('')}</div></article>`).join('') || '<div class="event-empty">还没有结束的公共建设表决。</div>';
    openModal('CIVIC ASSEMBLY', '居民提案与投票记录', '提案由居民提出；每位居民独立投票，赞成超过三分之二才会动用镇公所预算。', `${currentBlock}<div class="profile-section-title"><span>历次表决</span><small>最近 ${state.publicProposalHistory?.length || 0} 项</small></div><div class="journal-list">${rows}</div><button class="modal-submit" id="assemblyHistoryDone">返回观察</button>`);
    $('#assemblyHistoryDone').addEventListener('click', closeModal);
  }
  function renderStoryAndProjects() {
    $('#loreSummary').textContent = state.worldLore?.summary || townLore.summary;
    $('#outsideRegion').textContent = state.environment.regionName;
    $('#outsideHeadline').textContent = state.outside.headline;
    $('#outsideDescription').textContent = state.outside.description;
    $('#scaleButton').textContent = `规模 ${state.town.width}×${state.town.height}`;
    const farms = state.buildings.filter(building => building.type === 'farm');
    const crops = farms.map(cropStatus);
    $('#cropSummary').textContent = farms.length
      ? crops.join(' · ')
      : '还没有农田；居民会根据食物储备和种植条件决定是否开垦。';
    const publicHomes = state.buildings.filter(building => building.type === 'home' && building.ownership !== 'private');
    const homeStatus = `公租房 ${publicHomes.length} 栋 · 容量 ${publicHomes.reduce((sum, home) => sum + housingCapacity(home), 0)} · 基础月租 ${state.town.rules.publicRent} 元`;
    const proposal = state.publicProposal ? `${facilityTypes[state.publicProposal.type]?.name || '公共提案'}正在居民表决` : state.approvedBuild ? '居民已通过提案，等待居民施工' : '公共建设由居民自行提案与投票';
    const privateShops = state.buildings.filter(building => building.businessId).length;
    const initLabel=state.initializationUsage?`大模型初始化 ${state.initializationUsage.model} · ${state.initializationUsage.totalTokens} tokens`:(state.initializationMode==='local-fallback'?'大模型暂不可用 · 已回退本地随机生成':state.initializationMode==='local-random'?'本地随机初始化 · NPC使用本地策略':'默认原型世界 · NPC使用本地策略');
    const aiLabel = state.aiRuntimeEnabled ? `NPC逐回合 AI · ${state.aiUsage.calls || 0} 次调用 · ${state.aiUsage.totalTokens || 0} tokens` : 'NPC本地策略';
    $('#supplyStatus').textContent = `${homeStatus} · 私人店铺 ${privateShops} 家 · ${proposal} · ${initLabel} · ${aiLabel}`;
  }
  function openTownRulesModal() {
    const built = countStructures(); const maxCells = state.town.width * state.town.height;
    openModal('TOWN RULES', '区域规则', '你设定小镇边界和公租房月租；公共设施由居民表决决定。', `<form id="townRulesForm"><div class="form-grid"><div class="form-field"><label for="maxPopulationInput">最多居民人数</label><input id="maxPopulationInput" name="maxPopulation" type="number" min="${state.residents.length}" max="150" value="${state.town.rules.maxPopulation}" required /></div><div class="form-field"><label for="maxBuildingsInput">最多建筑数量</label><input id="maxBuildingsInput" name="maxBuildings" type="number" min="${built}" max="${maxCells}" value="${state.town.rules.maxBuildings}" required /></div><div class="form-field full"><small class="rules-hint">当前 ${state.residents.length} 位居民 · ${built} 座建筑 · ${state.town.width}×${state.town.height} 区域最多 ${maxCells} 个地块</small></div></div><button class="modal-submit" type="submit">应用区域规则</button></form>`);
    const rulesGrid = $('#townRulesForm .form-grid');
    [['publicRent','公租房基础月租（元）',state.town.rules.publicRent ?? 8,0,1000],['familyWaitDays','结婚后尝试生育的等待天数',state.town.rules.familyWaitDays ?? 3,0,60],['pregnancyDays','怀孕时长（天）',state.town.rules.pregnancyDays ?? 6,1,30]].forEach(([name,labelText,value,min,max]) => {
      const field = document.createElement('div'); field.className = 'form-field'; field.innerHTML = '<label></label><input type="number" required />';
      field.querySelector('label').htmlFor = name; field.querySelector('label').textContent = labelText;
      const input = field.querySelector('input'); input.id = name; input.name = name; input.min = min; input.max = max; input.value = value;
      rulesGrid.appendChild(field);
    });
    $('#townRulesForm').addEventListener('submit', event => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      const maxPopulation = Math.max(state.residents.length, Math.min(150, Number(form.get('maxPopulation')) || state.residents.length));
      const maxBuildings = Math.max(built, Math.min(maxCells, Number(form.get('maxBuildings')) || built));
      const publicRent = Math.max(0, Math.min(1000, Number(form.get('publicRent')) || 0));
      state.town.rules = { ...state.town.rules, maxPopulation, maxBuildings, publicRent, familyWaitDays: Math.max(0, Math.min(60, Number(form.get('familyWaitDays')) || 0)), pregnancyDays: Math.max(1, Math.min(30, Number(form.get('pregnancyDays')) || 6)) };
      state.buildings.filter(building => building.type === 'home' && building.ownership !== 'private').forEach(building => { building.rent = publicRent; building.baseRent = publicRent; });
      pushEvent(`镇民共同遵守新的区域边界：最多 ${maxPopulation} 位居民、${maxBuildings} 座建筑。`, 'town', '⌂');
      closeModal(); render(); toast('区域规则已更新。');
    });
  }
  function openEnvironmentModal() {
    openModal('OUTSIDE CONDITIONS', '设置镇外环境', '交通、土壤和物价会影响采购成本、货运能力与作物成熟速度。', `<form id="environmentForm"><div class="form-grid"><div class="form-field"><label for="regionNameInput">邻近地区</label><input id="regionNameInput" name="regionName" maxlength="24" value="${esc(state.environment.regionName)}" required /></div><div class="form-field"><label for="roadInput">交通状况</label><select id="roadInput" name="road"><option value="open" ${state.environment.road === 'open' ? 'selected' : ''}>畅通 · 货运充足</option><option value="limited" ${state.environment.road === 'limited' ? 'selected' : ''}>限行 · 运量减少、成本上升</option><option value="blocked" ${state.environment.road === 'blocked' ? 'selected' : ''}>中断 · 暂停外部采购</option></select></div><div class="form-field"><label for="soilInput">土壤与气候</label><select id="soilInput" name="soil"><option value="fertile" ${state.environment.soil === 'fertile' ? 'selected' : ''}>肥沃 · 作物约 3 天成熟</option><option value="normal" ${state.environment.soil === 'normal' ? 'selected' : ''}>普通 · 作物约 4 天成熟</option><option value="poor" ${state.environment.soil === 'poor' ? 'selected' : ''}>贫瘠 · 作物约 6 天成熟</option></select></div><div class="form-field"><label for="marketPriceInput">外部粮价</label><select id="marketPriceInput" name="marketPrice"><option value="0" ${Number(state.environment.marketPrice) === 0 ? 'selected' : ''}>低</option><option value="1" ${Number(state.environment.marketPrice) === 1 ? 'selected' : ''}>普通</option><option value="2" ${Number(state.environment.marketPrice) === 2 ? 'selected' : ''}>高</option></select></div></div><button class="modal-submit" type="submit">应用周边环境</button></form>`);
    const riskField = document.createElement('div'); riskField.className = 'form-field';
    riskField.innerHTML = '<label for="riskLevelInput">外部风险强度</label><select id="riskLevelInput" name="riskLevel"><option value="low">较低 · 灾害和犯罪影响较轻</option><option value="normal">普通 · 会遭遇疾病、盗窃和经济压力</option><option value="high">较高 · 外部危机更频繁、损失更大</option></select>';
    $('#environmentForm .form-grid').appendChild(riskField); $('#riskLevelInput').value = state.environment.riskLevel || 'normal';
    $('#environmentForm').addEventListener('submit', event => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      state.environment = { regionName: String(form.get('regionName') || '').trim() || '青岚县', road: String(form.get('road')), soil: String(form.get('soil')), marketPrice: Number(form.get('marketPrice')), riskLevel: String(form.get('riskLevel') || 'normal') };
      state.buildings.filter(building => building.type === 'farm' && building.crop).forEach(farm => {
        farm.crop.maturesOn = Math.max(state.day + 1, farm.crop.plantedDay + cropGrowthDays(farm));
      });
      pushEvent(`镇外环境已更新：${state.environment.regionName}，${environmentRoadLabel()}，土壤${({ fertile: '肥沃', normal: '普通', poor: '贫瘠' })[state.environment.soil]}。`, 'town', '↗');
      closeModal(); render(); toast('周边环境已更新。');
    });
  }
  function openTownScaleModal() {
    const maxX = Math.max(...state.buildings.map(building => building.x));
    const maxY = Math.max(...state.buildings.map(building => building.y));
    openModal('TOWN PLANNING', '设置小镇规模', '扩展后会增加可用地块；居民会依照生活需要决定建造什么。', `<div class="scale-options">${scalePresets.map(preset => {
      const fits = preset.width > maxX && preset.height > maxY;
      const selected = state.town.preset === preset.id;
      return `<button class="scale-option${selected ? ' selected' : ''}" type="button" data-scale="${preset.id}" ${fits ? '' : 'disabled'}><span class="scale-size">${preset.width}×${preset.height}</span><span><b>${preset.label}</b><small>${preset.note}</small></span><i>${selected ? '当前' : fits ? '选择 →' : '容纳不下现有建筑'}</i></button>`;
    }).join('')}</div>`);
    modalContent.querySelectorAll('[data-scale]').forEach(button => button.addEventListener('click', () => {
      const preset = scalePresets.find(item => item.id === button.dataset.scale); if (!preset) return;
      const oldCells = state.town.width * state.town.height;
      state.town = { ...state.town, preset: preset.id, width: preset.width, height: preset.height };
      const expandedLimit = state.town.rules.maxBuildings + Math.max(0, preset.width * preset.height - oldCells);
      state.town.rules.maxBuildings = Math.max(countStructures(), Math.min(preset.width * preset.height, expandedLimit));
      pushEvent(`镇民议定将镇区规模调整为「${preset.label}」，新的街区规划已经开放。`, 'town', '⌂');
      closeModal(); render(); toast(`小镇现在是 ${preset.width}×${preset.height} 网格。`);
    }));
  }
  function openStoryModal() {
    const lore = state.worldLore || townLore;
    openModal('WORLD SETTING', lore.title, '一座小镇的过去、地理与镇外变化。', `<div class="story-detail"><section><small>背景故事</small><p>${esc(lore.history)}</p></section><section><small>地理与周边</small><p>${esc(lore.geography)}</p></section><section><small>镇外关系</small><p>${esc(lore.outside)}</p></section><section><small>当前区域条件</small><p>${esc(state.environment.regionName)} · ${environmentRoadLabel()} · 土壤${({ fertile: '肥沃', normal: '普通', poor: '贫瘠' })[state.environment.soil]} · 外部粮价${['低', '普通', '高'][state.environment.marketPrice] || '普通'}</p></section><section><small>今日镇外消息</small><p><b>${esc(state.outside.headline)}</b><br/>${esc(state.outside.description)}</p></section></div><button class="modal-submit" id="storyDone">回到小镇</button>`);
    $('#storyDone').addEventListener('click', closeModal);
  }
  function render() {
    const backend = window.SocietyBackend?.getStatus();
    $('#backendStatusLabel').textContent = backend?.online ? '单机模拟 · 本机后端已连接' : '单机模拟 · 浏览器本地存档';
    const aiButton = $('#aiModeButton');
    if (aiButton) {
      aiButton.textContent = !backend?.openaiConfigured ? 'AI 回合：未配置' : state.aiRuntimeEnabled ? 'AI 回合：已开启' : 'AI 回合：可开启';
      aiButton.title = !backend?.openaiConfigured ? '需要在本机后端设置 OPENAI_API_KEY' : `使用 ${backend.model || 'OpenAI 模型'} 为每位居民单独规划本轮行动`;
    }
    flushNearbyPerceptions(); renderMap(); renderDetail(); renderPeople(); renderEvents(); renderStoryAndProjects(); renderCivicAssembly(); persist();
  }
  function selectResident(id) { state.selectedId = id; render(); }

  function scoreNeed(value) { return Math.max(0, (52 - value) / 52); }
  function findDestination(types, fallback) { for (const type of types) { const item = buildingByType(type); if (item) return item.id; } return fallback; }
  function residentMealPeriod(agent) {
    const seed = Array.from(agent.id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return 1 + (seed % 3);
  }
  function homeCapacity() { return state.buildings.filter(building => building.type === 'home').reduce((sum, building) => sum + housingCapacity(building), 0); }
  function residentBuildingPreference(type) {
    const interests = {
      farm: /园艺|种植|菜|农|花草|绿意|果树|食材/, restaurant: /餐饮|厨师|咖啡|做菜|烹饪|夜市|菜单/,
      home: /房子|房屋|老屋|修缮|建筑|安家|住房/, market: /采购|补货|商店|买东西|实惠/,
      clinic: /诊所|医疗|照护|健康|护士|医生/, office: /工作间|写字楼|工具|创作|工程/,
    };
    const pattern = interests[type]; if (!pattern) return null;
    return state.residents.map(agent => {
      const goalMatch = pattern.test(agent.goal || ''); const roleMatch = pattern.test(agent.role || '');
      const wishMatch = pattern.test(agent.background?.privateWish || '');
      return { agent, score: (goalMatch ? 14 : 0) + (roleMatch ? 10 : 0) + (wishMatch ? 5 : 0) };
    }).filter(item => item.score > 0).sort((a, b) => b.score - a.score)[0] || null;
  }
  function buildingNeeds() {
    const population = state.residents.length; const farms = state.buildings.filter(building => building.type === 'farm').length;
    const homes = state.buildings.filter(building => building.type === 'home').length;
    const restaurants = state.buildings.filter(building => building.type === 'restaurant').length;
    const markets = state.buildings.filter(building => building.type === 'market').length;
    const offices = state.buildings.filter(building => building.type === 'office').length;
    const clinics = state.buildings.filter(building => building.type === 'clinic').length;
    const needs = [];
    const activeCases = state.justice.cases.filter(item => !['convicted','dismissed','closed'].includes(item.status));
    const pendingTrials = state.justice.cases.some(item => item.status === 'prosecuted');
    if (!state.buildings.some(building => building.type === 'townhall')) needs.push({ type: 'townhall', score: 68, reason: '镇上缺少负责预算、居民诉求和公共事务协调的镇公所' });
    if (activeCases.length && !state.buildings.some(building => building.type === 'police')) needs.push({ type: 'police', score: 96 + activeCases.length * 3, reason: `${activeCases.length} 起案件需要正式调查，居民对治安缺少保障` });
    if (activeCases.length && state.buildings.some(building => building.type === 'police') && !state.buildings.some(building => building.type === 'prosecutor')) needs.push({ type: 'prosecutor', score: 88 + activeCases.length * 2, reason: '警务调查已经产生线索，需要检察机关审查并决定是否起诉' });
    if (pendingTrials && !state.buildings.some(building => building.type === 'courthouse')) needs.push({ type: 'courthouse', score: 98, reason: '已有公诉案件等待法院审理' });
    if (state.justice.cases.some(item => item.status === 'convicted' && item.sentenceDays && !state.buildings.some(building => building.type === 'prison')) && !state.buildings.some(building => building.type === 'prison')) needs.push({ type: 'prison', score: 72, reason: '法院已作出判决，需要设施执行监禁与改造' });
    if (population && state.foodStock <= population * 2 && farms < Math.max(1, Math.ceil(population / 12))) {
      const preference = residentBuildingPreference('farm');
      needs.push({ type: 'farm', score: (farms ? 58 + (population * 2 - state.foodStock) : 92) + (preference?.score || 0), reason: `粮食储备和作物产能不足${preference ? `；${preference.agent.name}一直想发展种植` : ''}`, proposer: preference?.agent.name });
    }
    if (population >= 4 && restaurants < Math.ceil(population / 12)) {
      const preference = residentBuildingPreference('restaurant');
      needs.push({ type: 'restaurant', score: (restaurants ? 42 : 76) + (preference?.score || 0), reason: `居民需要稳定的用餐地点${preference ? `；${preference.agent.name}希望镇上有更好的餐桌` : ''}`, proposer: preference?.agent.name });
    }
    if (population < state.town.rules.maxPopulation && population >= homeCapacity() - 2) {
      const preference = residentBuildingPreference('home');
      needs.push({ type: 'home', score: 82 + (preference?.score || 0), reason: `居住空间接近上限${preference ? `；${preference.agent.name}关心老屋与安居` : ''}`, proposer: preference?.agent.name });
    }
    if (population > markets * 12 && markets < Math.ceil(population / 12)) {
      const preference = residentBuildingPreference('market');
      needs.push({ type: 'market', score: 45 + (preference?.score || 0), reason: `采购服务需要扩容${preference ? `；${preference.agent.name}一直关注镇上的补货` : ''}`, proposer: preference?.agent.name });
    }
    if (population > clinics * 12 && clinics < Math.ceil(population / 12)) {
      const preference = residentBuildingPreference('clinic');
      needs.push({ type: 'clinic', score: 39 + (preference?.score || 0), reason: `医疗服务需要扩容${preference ? `；${preference.agent.name}希望邻里更容易得到照护` : ''}`, proposer: preference?.agent.name });
    }
    const officeWorkers = state.residents.filter(agent => {
      const job = buildingById(agent.job) || buildingByType(agent.job); return job?.type === 'office';
    }).length;
    if (officeWorkers >= offices * facilityDetails.office.capacity && offices < Math.ceil(population / 8)) {
      needs.push({ type: 'office', score: 36, reason: '工作空间趋于饱和' });
    }
    return needs.sort((a, b) => b.score - a.score);
  }
  function constructionSpecialist(type, agent) {
    const roleText = `${agent.role} ${agent.goal} ${agent.trait}`;
    if (type === 'farm') return /园艺|农|种植|菜地|花草/.test(roleText) || agent.skills.craft >= 6;
    if (type === 'restaurant') return /餐饮|厨师|咖啡|主理人|烹饪/.test(roleText) || agent.proficiencies.cooking >= 42;
    if (type === 'home') return /建筑|修理|木工|工程/.test(roleText) || agent.skills.craft >= 6;
    return /建筑|修理|木工|工程/.test(roleText) || agent.skills.craft >= 7;
  }
  function findBuildPlot(type, level = 1, rotation = 0, landOwnerId = null) {
    const plots = [];
    for (let y = 0; y < state.town.height; y++) for (let x = 0; x < state.town.width; x++) {
      if (!footprintFits(type, level, rotation, x, y, null, landOwnerId)) continue;
      let anchor = type === 'farm' ? buildingByType('fishing') : type === 'restaurant' ? buildingByType('market') || buildingByType('cafe') : type === 'home' ? buildingByType('home') : buildingByType('office');
      const distance = anchor ? Math.abs(anchor.x - x) + Math.abs(anchor.y - y) : 0;
      const edgePreference = type === 'farm' ? -x * 0.05 : 0;
      plots.push({ x, y, score: distance + edgePreference });
    }
    return plots.sort((a, b) => a.score - b.score || a.y - b.y || a.x - b.x)[0] || null;
  }
  function initializeSpecificGoals() {
    const candidates = [];
    for (let y = 0; y < state.town.height; y++) for (let x = 0; x < state.town.width; x++) if (footprintFits('home', 1, 0, x, y)) candidates.push({ x, y });
    const ambitious = state.residents.filter(agent => !agent.deceased && agent.age >= 18 && !agent.goalTarget)
      .sort((a, b) => (b.attributes.financial + b.attributes.intelligence * 0.25 + Math.max(0, -b.alignment) * 0.2) - (a.attributes.financial + a.attributes.intelligence * 0.25 + Math.max(0, -a.alignment) * 0.2));
    const count = Math.min(4, Math.max(2, Math.floor(ambitious.length / 6)), ambitious.length);
    if (!count || !candidates.length) return;
    const target = candidates[roll(0, candidates.length - 1)];
    ambitious.slice(0, count).forEach((agent, index) => {
      const plot = index < 2 ? target : candidates.filter(item => item.x !== target.x || item.y !== target.y)[roll(0, Math.max(0, candidates.filter(item => item.x !== target.x || item.y !== target.y).length - 1))] || target;
      agent.goalTarget = { type: 'buy_plot', x: plot.x, y: plot.y, label: `买下第 ${plot.x + 1} 列、第 ${plot.y + 1} 行的地块并建起自己的房子`, status: 'active', createdDay: state.day };
      if (index < 2) agent.goalTarget.rivalryGroup = `plot-${plot.x}-${plot.y}`;
      agent.currentThought = `我想具体买下第 ${plot.x + 1} 列、第 ${plot.y + 1} 行的地块，再在那里建自己的房子。`;
      remember(agent, `我把目标具体定为：${agent.goalTarget.label}。这块地可能也会被别人看中。`, '个人目标', 1);
    });
    if (count >= 2) {
      const [first, second] = ambitious;
      const value = -Math.max(8, Math.floor((first.relationships?.[second.id] || 0) * 0.2));
      first.relationships[second.id] ??= value; second.relationships[first.id] ??= value;
    }
  }
  function recordPlotGoalConflict(buyer, plot) {
    const claimants = state.residents.filter(agent => agent.id !== buyer.id && agent.goalTarget?.type === 'buy_plot' && agent.goalTarget.status === 'active' && agent.goalTarget.x === plot.x && agent.goalTarget.y === plot.y);
    claimants.forEach(agent => {
      agent.goalTarget.status = 'blocked'; agent.goalTarget.blockedBy = buyer.id; agent.goalTarget.blockedDay = state.day;
      agent.relationships[buyer.id] = (Number(agent.relationships[buyer.id]) || 0) - 22;
      buyer.relationships[agent.id] = (Number(buyer.relationships[agent.id]) || 0) - 8;
      modify(agent, { anger: 24, mood: -13, stress: 11 }); changeMorality(buyer, -1, '占下另一位居民明确想要的地块');
      const text = `${buyer.name}占下了${agent.name}明确想要的第 ${plot.x + 1} 列、第 ${plot.y + 1} 行地块。`;
      remember(agent, `${text}我的具体目标被抢走了，我对${buyer.name}的好感下降。`, '目标冲突', 1);
      remember(buyer, `我占下了${agent.name}盯上的那块地，TA显然对此不满。`, '目标冲突', 0.9);
      recordRelationshipInteraction(agent, buyer, text, -22);
      pushEvent(`${safeName(buyer)}买下了${safeName(agent)}明确想要的地块；目标被抢让双方关系恶化。`, 'social', '⚑', [buyer.id, agent.id]);
    });
  }
  function chooseConstructionPlan() {
    if (countStructures() >= state.town.rules.maxBuildings || state.treasury < 18) return null;
    for (const need of buildingNeeds()) {
      const meta = facilityTypes[need.type]; if (!meta || state.treasury < meta.cost) continue;
      const orderThreshold = Math.max(6, state.residents.length);
      const importReserve = state.environment.road !== 'blocked' && state.foodStock < orderThreshold
        ? Math.min(state.environment.road === 'limited' ? 4 : 10, Math.floor(state.treasury / importUnitCost())) * importUnitCost()
        : 0;
      if (state.treasury < meta.cost + importReserve) continue;
      const plot = findBuildPlot(need.type); if (!plot) continue;
      const builder = state.residents.filter(agent => !agent.deceased && agent.age >= 18 && agent.energy >= 48 && agent.health >= 50 && constructionSpecialist(need.type, agent))
        .filter(agent => !(agent.lastMealDay !== state.day && (state.period >= residentMealPeriod(agent) || agent.hunger < 42)))
        .sort((a, b) => (b.skills.craft * 5 + b.attributes.intelligence / 3 + (need.type === 'farm' ? b.skills.care : b.proficiencies.cooking / 5)) - (a.skills.craft * 5 + a.attributes.intelligence / 3 + (need.type === 'farm' ? a.skills.care : a.proficiencies.cooking / 5)))[0];
      if (builder) return { agent: builder, type: need.type, plot, reason: need.reason, proposer: need.proposer };
    }
    return null;
  }
  function publicVoteThreshold(count) { return Math.floor(count * 2 / 3) + 1; }
  function createPublicProposal(plan, proposerId = null) {
    if (!plan || state.publicProposal || state.approvedBuild) return false;
    const proposer = state.residents.find(r => r.id === proposerId) || state.residents.find(r => r.name === plan.proposer) || plan.agent;
    if (!proposer) return false;
    state.publicProposal = {
      id: `public-proposal-${state.idCounter++}`,
      type: plan.type, plot: { x: plan.plot.x, y: plan.plot.y }, reason: plan.reason,
      rotation: Number(plan.rotation) || 0, proposerId: proposer.id, proposerName: proposer.name, votes: {}, voters: state.residents.filter(r => !r.deceased).map(r => r.id),
      startedDay: state.day, cost: facilityTypes[plan.type]?.cost || 0,
    };
    state.lastProposalDay = state.day;
    pushEvent(`${safeName(proposer)}提出公共建设提案：建设${esc(facilityTypes[plan.type]?.name || '公共设施')}。居民开始表决，赞成票必须超过三分之二。`, 'town', '✦', [proposer.id]);
    return true;
  }
  function archivePublicProposal(proposal, status) {
    if (!proposal) return;
    state.publicProposalHistory ||= [];
    const voters = (proposal.voters || []).map(id => {
      const resident = state.residents.find(agent => agent.id === id);
      return { id, name: resident?.name || '已离镇居民', vote: proposal.votes?.[id] || 'pending' };
    });
    const record = {
      id: proposal.id || `public-proposal-${state.idCounter++}`, type: proposal.type,
      plot: { ...(proposal.plot || {}) }, reason: proposal.reason || '', proposerId: proposal.proposerId,
      proposerName: proposal.proposerName || '居民', cost: proposal.cost || facilityTypes[proposal.type]?.cost || 0,
      startedDay: proposal.startedDay || state.day, resolvedDay: state.day, status, voters,
      yes: voters.filter(voter => voter.vote === 'yes').length,
      no: voters.filter(voter => voter.vote === 'no').length,
    };
    const existing = state.publicProposalHistory.findIndex(item => item.id === record.id);
    if (existing >= 0) state.publicProposalHistory[existing] = record;
    else state.publicProposalHistory.unshift(record);
    state.publicProposalHistory = state.publicProposalHistory.slice(0, 30);
  }
  function maybeStartPublicProposal() {
    if (state.publicProposal || state.approvedBuild || state.lastProposalDay === state.day) return;
    const plan = chooseConstructionPlan();
    if (!plan) return;
    const official = state.residents.filter(agent => !agent.deceased && (agent.publicRole || agent.employmentType === 'public')).sort((a, b) => ((b.attributes?.financial || 0) + (b.proficiencies?.leadership || 0) + (b.alignment || 0) * 0.2) - ((a.attributes?.financial || 0) + (a.proficiencies?.leadership || 0) + (a.alignment || 0) * 0.2))[0];
    if (!official) return;
    official.publicRole ||= '公共事务提案员';
    plan.proposer = official.name;
    plan.reason = `${official.name}作为${official.publicRole}提出：${plan.reason}`;
    createPublicProposal(plan, official.id);
  }
  function proposalYesChance(agent, proposal) {
    const need = buildingNeeds().find(item => item.type === proposal.type);
    const needScore = need ? Math.min(1, need.score / 100) : 0.12;
    const relation = Number(agent.relationships?.[proposal.proposerId] || 0);
    const costPressure = Math.min(0.15, (proposal.cost || 0) / 500);
    return Math.max(0.05, Math.min(0.95, 0.42 + needScore * 0.19 + (agent.alignment || 0) / 300 + (agent.attributes?.emotional || 50) / 1000 + relation / 250 - costPressure));
  }
  function castPublicVotes() {
    const proposal = state.publicProposal;
    if (!proposal) return;
    const voterIds = proposal.voters || state.residents.filter(r => !r.deceased).map(r => r.id);
    const voters = voterIds.map(id => state.residents.find(r => r.id === id)).filter(Boolean);
    voters.filter(agent => agent.deceased && proposal.votes[agent.id] == null).forEach(agent => { proposal.votes[agent.id] = 'abstain'; });
    const pending = voters.filter(agent => !agent.deceased && proposal.votes[agent.id] == null).slice(0, 4);
    pending.forEach(agent => { proposal.votes[agent.id] = Math.random() < proposalYesChance(agent, proposal) ? 'yes' : 'no'; });
    const yes = Object.values(proposal.votes).filter(vote => vote === 'yes').length;
    const no = Object.values(proposal.votes).filter(vote => vote === 'no').length;
    const threshold = publicVoteThreshold(voterIds.length);
    if (yes >= threshold) {
      const approved = proposal;
      state.publicProposal = null; state.approvedBuild = approved;
      pushEvent(`居民以 ${yes}/${voterIds.length} 票赞成通过${esc(facilityTypes[approved.type]?.name || '公共设施')}提案，达到超过三分之二门槛；施工将使用镇公所预算。`, 'town', '✓', voters.filter(agent => approved.votes[agent.id] === 'yes').map(agent => agent.id));
    } else if (no > voterIds.length - threshold || Object.keys(proposal.votes).length >= voterIds.length) {
      state.publicProposal = null;
      archivePublicProposal(proposal, 'rejected');
      pushEvent(`公共设施提案表决结束，赞成 ${yes} 票、反对 ${no} 票，未达到超过三分之二门槛。`, 'town', '×', voters.map(agent => agent.id));
    }
  }
  function choosePublicBuilder(proposal) {
    if (!proposal || state.treasury < (facilityTypes[proposal.type]?.cost || Infinity) || countStructures() >= state.town.rules.maxBuildings) return null;
    if (!footprintFits(proposal.type, 1, Number(proposal.rotation) || 0, proposal.plot.x, proposal.plot.y)) return null;
    const specialist = state.residents.filter(agent => !agent.deceased && agent.age >= 18 && agent.energy >= 35 && agent.health >= 45 && constructionSpecialist(proposal.type, agent))
      .sort((a, b) => (b.skills.craft * 5 + b.attributes.intelligence / 3) - (a.skills.craft * 5 + a.attributes.intelligence / 3))[0];
    return specialist ? { agent: specialist, type: proposal.type, plot: proposal.plot, rotation: Number(proposal.rotation) || 0, reason: proposal.reason, proposer: proposal.proposerName } : null;
  }
  function procureFood(agent) {
    if (state.environment.road === 'blocked') return 0;
    const unitCost = importUnitCost(); const routeCapacity = state.environment.road === 'limited' ? 4 : 10;
    const affordable = Math.floor(state.treasury / unitCost); const quantity = Math.min(routeCapacity, affordable);
    if (quantity <= 0) return 0;
    state.treasury -= quantity * unitCost; state.foodStock += quantity;
    pushEvent(`${safeName(agent)}向${esc(state.environment.regionName)}订购了 ${quantity} 份食材，花费 ${quantity * unitCost} 元镇公所预算。`, 'town', '↗', [agent.id]);
    remember(agent, `从${state.environment.regionName}补进了${quantity}份食材，暂时缓解了镇上的供给压力。`, '外部采购', 0.95);
    return quantity;
  }
  function harvestMatureCrops() {
    state.buildings.filter(building => building.type === 'farm' && building.crop && state.day >= building.crop.maturesOn).forEach(farm => {
      const amount = farm.crop.yield || Math.max(12, state.residents.length);
      state.foodStock += amount;
      pushEvent(`${esc(farm.name || facilityTypes.farm.name)}的${esc(farm.crop.name)}成熟了，收获 ${amount} 份食材。`, 'town', '♧');
      farm.crop = { name: ['萝卜', '白菜', '土豆', '豆角'][(state.day + farm.x + farm.y) % 4], plantedDay: state.day, maturesOn: state.day + cropGrowthDays(farm), yield: Math.round(amount * facilityEffect(farm)) };
    });
  }
  function startIllness(agent, name, severity = 1) {
    if (!agent || agent.deceased || agent.illness) return;
    agent.illness = { name, severity, daysUntreated: 0, symptom: severity >= 3 ? '持续高热、乏力' : '乏力、身体不适' };
    remember(agent, `我开始出现${name}症状，需要考虑休息或去诊所。`);
    pushEvent(`${safeName(agent)}出现${esc(name)}症状，身体状态需要留意。`, 'care', '✚', [agent.id]);
  }
  function processHealthDay() {
    state.residents.forEach(agent => {
      if (agent.deceased) return;
      let loss = 1 + (agent.age >= 65 ? 1 : 0) + (agent.hunger <= 0 ? 4 : agent.hunger < 22 ? 2 : agent.hunger < 40 ? 1 : 0) + (agent.hygiene < 20 ? 1 : 0) + (agent.energy < 18 ? 1 : 0);
      if (!buildingById(agent.home) || buildingById(agent.home)?.type !== 'home') {
        loss += 1; modify(agent, { mood: -2, stress: 2 });
        if (publicShelter()) agent.location = publicShelter().id;
      }
      if (state.outside.effect === 'cold' && (agent.age >= 60 || agent.health < 70)) loss += 1;
      modify(agent, { health: -loss, stress: agent.hunger < 25 ? 3 : 1 });
      if (agent.deceased) return;
      if (agent.illness) {
        agent.illness.daysUntreated = (agent.illness.daysUntreated || 0) + 1;
        if (agent.illness.daysUntreated >= 2) agent.illness.severity = Math.min(3, (agent.illness.severity || 1) + 1);
        modify(agent, { health: -(1 + agent.illness.severity), energy: -3, stress: 4, mood: -3 });
        if (agent.illness.severity >= 3 && agent.illness.daysUntreated >= 4 && !agent.illness.name.startsWith('重症')) agent.illness.name = '重症' + agent.illness.name;
      } else if (agent.health < 35) startIllness(agent, '严重感染', 3);
      else if (agent.health < 52) startIllness(agent, agent.hygiene < 25 ? '肠胃感染' : '高热', 2);
      else if (agent.health < 76) startIllness(agent, '过度疲劳', 1);
      if (agent.health <= 0 && !agent.deceased) markDeceased(agent, '长期疾病与身体衰竭');
    });
  }
  function applyOutsideImpact() {
    const effect = state.outside.effect; const scale = ({ low: 0.55, normal: 1, high: 1.65 })[state.environment.riskLevel] || 1;
    if (effect === 'flood') {
      const lost = Math.min(state.foodStock, Math.max(1, Math.round(5 * scale))); state.foodStock -= lost;
      state.buildings.filter(b => b.type === 'farm' && b.crop).forEach(farm => { farm.crop.maturesOn += 1; farm.crop.yield = Math.max(2, farm.crop.yield - Math.round(2 * scale)); });
      state.residents.filter(r => !r.deceased && (r.health < 65 || r.home === 'home-d')).forEach(r => { modify(r, { health: -1, stress: 7, mood: -3 }); if (r.health < 68 && Math.random() < 0.35 * scale) startIllness(r, '受寒感冒', 1); });
      pushEvent(`洪水冲坏了部分菜地，损失 ${lost} 份食材，收成也延后了。`, 'care', '⚠');
    } else if (effect === 'illness') {
      const vulnerable = state.residents.filter(r => !r.deceased && !r.illness).sort((a, b) => a.health - b.health).slice(0, Math.max(1, Math.round(2 * scale)));
      vulnerable.forEach(r => startIllness(r, '流感', 1));
    } else if (effect === 'strike') {
      state.residents.filter(r => !r.deceased).forEach(r => modify(r, { stress: 4, mood: -2 }));
      pushEvent('货运停工让补给推迟，物价和居民压力都上升了。', 'town', '↗');
    } else if (effect === 'crime') {
      const lost = Math.min(state.foodStock, Math.max(1, Math.round(3 * scale))); state.foodStock -= lost;
      state.treasury = Math.max(0, state.treasury - Math.round(4 * scale));
      state.residents.filter(r => !r.deceased).forEach(r => modify(r, { stress: 5, anger: 2 }));
      pushEvent(`夜间盗窃造成 ${lost} 份储粮和 ${Math.round(4 * scale)} 元镇公所预算损失。`, 'care', '⚑');
    } else if (effect === 'recession') {
      state.residents.filter(r => !r.deceased).forEach(r => modify(r, { stress: 5, mood: -3 }));
      pushEvent('外部经济下行，工作机会减少，居民收入压力上升。', 'town', '↘');
    } else if (effect === 'cold') {
      state.residents.filter(r => !r.deceased && (r.age >= 60 || r.health < 75)).forEach(r => { modify(r, { health: -2, stress: 3 }); if (Math.random() < 0.16 * scale) startIllness(r, '受寒感冒', 1); });
    }
  }
  function decideAction(agent, snapshot) {
    if (agent.deceased) return { kind: 'rest', destination: agent.home };
    if (agent.jailDays > 0) return { kind: 'incarcerated', destination: buildingByType('prison')?.id || agent.location || agent.home };
    const home = buildingById(agent.home)?.type === 'home' ? agent.home : publicShelter()?.id || snapshot.buildings.find(b => b.type === 'plaza' || b.type === 'park')?.id;
    const job = buildingById(agent.job) || snapshot.buildings.find(b => b.type === agent.job) || null;
    const directiveActive = agent.directive && agent.directive.until > snapshot.turn;
    if (!buildingById(agent.home) && agent.age >= 18 && agent.money < 20 && job && agent.energy > 28 && Math.random() < 0.55) return { kind: actionForJob(job), destination: job.id };
    if (directiveActive && agent.directive.kind === 'rest' && agent.energy < 85) return { kind: 'rest', destination: home };
    if ((agent.illness && agent.illness.severity >= 2) || agent.health < 58) return { kind: buildingByType('clinic') ? 'clinic' : 'rest', destination: findDestination(['clinic'], home) };
    if (agent.lastMealDay !== state.day && (snapshot.period >= residentMealPeriod(agent) || agent.hunger < 42)) return { kind: 'meal', destination: findDestination(['restaurant'], home) };
    if (agent.hygiene < 28) return { kind: 'toilet', destination: findDestination(['toilet'], home) };
    if (agent.energy < 28) return { kind: 'rest', destination: home };
    if ((buildingById(agent.job)?.type || agent.job) === 'market' && state.environment.road !== 'blocked' && agent.lastProcurementDay !== state.day && state.foodStock < Math.max(6, state.residents.length)) return { kind: 'procure', destination: agent.job };
    if (agent.hunger < 35) return { kind: agent.age < 18 ? 'meal' : 'shop', destination: agent.age < 18 ? findDestination(['restaurant'], home) : findDestination(['market'], home) };
    const overdueLoan = state.loans.find(loan => loan.lenderId === agent.id && loan.balance > 0 && loan.status === 'active' && state.day - (loan.createdDay || state.day) >= 30);
    const grievanceTarget = agent.goalTarget?.status === 'blocked' ? state.residents.find(other => other.id === agent.goalTarget.blockedBy && !other.deceased) : overdueLoan ? state.residents.find(other => other.id === overdueLoan.borrowerId && !other.deceased) : null;
    const grievanceImpulse = 0.015 + Math.max(0, -agent.alignment) / 650 + agent.anger / 1700 + agent.stress / 2400;
    if (grievanceTarget && agent.anger >= 48 && Math.random() < Math.min(0.42, grievanceImpulse)) {
      if (agent.alignment <= -78 && agent.anger >= 82 && Math.random() < 0.075) return { kind: 'murder', destination: agent.location || home, targetId: grievanceTarget.id, motive: overdueLoan ? '因为对方长期不还钱' : '因为具体买房目标被抢夺' };
      return { kind: agent.anger >= 67 && agent.attributes.strength >= 45 && Math.random() < 0.58 ? 'assault' : 'intimidate', destination: agent.location || home, targetId: grievanceTarget.id, motive: overdueLoan ? '因为对方长期不还钱' : '因为具体买房目标被抢夺' };
    }
    if (agent.goalTarget?.type === 'buy_plot' && agent.goalTarget.status === 'active' && agent.age >= 18 && agent.money >= landPrice && countStructures() < state.town.rules.maxBuildings) {
      const targetPlot = { x: agent.goalTarget.x, y: agent.goalTarget.y };
      if (footprintFits('home', 1, 0, targetPlot.x, targetPlot.y, null, agent.id)) return { kind: 'buy_land', destination: home, plot: targetPlot, project: 'home', goalTargetId: agent.id };
      const occupying = state.buildings.find(building => occupiedCells(building).some(cell => cell.x === targetPlot.x && cell.y === targetPlot.y));
      const occupyingOwner = occupying?.ownerId && state.residents.find(person => person.id === occupying.ownerId);
      if (occupyingOwner && occupyingOwner.id !== agent.id) recordPlotGoalConflict(occupyingOwner, targetPlot);
    }
    const dueLoan = state.loans.find(loan => loan.borrowerId === agent.id && loan.balance > 0);
    if (dueLoan && agent.money > 35 && Math.random() < 0.18) return { kind: 'repay', destination: home, loanId: dueLoan.id };
    const activeMemoryIds = new Set((agent.memory || []).map(memory => memory.id).filter(Boolean));
    const recoverableMemories = (agent.memoryArchive || []).filter(memory => memory.id && !activeMemoryIds.has(memory.id));
    if (recoverableMemories.length && Math.random() < 0.025 + (agent.proficiencies.recall || 0) / 600) return { kind: 'reminisce', destination: home };
    if (Math.random() < 0.035) {
      const place = buildingById(agent.location);
      const nearby = place ? state.residents.filter(other => other.id !== agent.id && !other.deceased && buildingById(other.location) && Math.abs(buildingById(other.location).x - place.x) <= 1 && Math.abs(buildingById(other.location).y - place.y) <= 1) : [];
      if (nearby.length) return { kind: 'observe', destination: agent.location, targetId: nearby[roll(0, nearby.length - 1)].id };
    }
    if (agent.age >= 18 && agent.alignment >= 55 && Math.random() < 0.09) {
      const neighbor = state.residents.filter(r => r.id !== agent.id && !r.deceased && (r.health < 55 || r.anger > 75)).sort((a, b) => a.health - b.health)[0];
      if (neighbor) return { kind: 'aid', destination: findDestination(['clinic', 'cafe'], home), targetId: neighbor.id };
    }
    if (agent.age < 18 || agent.education?.status === 'university') {
      if (agent.age < 6 || !buildingByType('school')) return { kind: 'play', destination: findDestination(['park', 'home'], home) };
      if (snapshot.period === 0 || snapshot.period === 1) return { kind: agent.education?.status === 'university' ? 'study' : 'childstudy', destination: findDestination(['school'], home) };
      const interest = (agent.interests || []).slice().sort((a, b) => b.value - a.value)[0];
      return { kind: 'hobby', destination: findDestination(['park', 'cafe', 'fishing', 'training', 'school'], home), skill: interest?.key || 'gardening' };
    }
    if (agent.alignment <= -25 && Math.random() < 0.13) {
      const target = state.residents.filter(r => r.id !== agent.id && !r.deceased && r.money > 4).sort((a, b) => b.money - a.money)[0];
      if (target) return { kind: (agent.anger > 58 ? 'intimidate' : 'scam'), destination: agent.location || home, targetId: target.id };
    }
    if (directiveActive && agent.directive.kind === 'social' && agent.socialNeed < 88) return { kind: 'social', destination: findDestination(['cafe', 'plaza', 'park'], home) };
    if (directiveActive && agent.directive.kind === 'work' && job) return { kind: actionForJob(job), destination: job.id };

    const pressure = [
      ['social', scoreNeed(agent.socialNeed) * (0.5 + agent.skills.social / 30 + agent.attributes.emotional / 250 + agent.attributes.charisma / 300) * (agent.mbti?.[0] === 'E' ? 1.18 : 0.82)],
      ['shop', scoreNeed(agent.hunger) * 0.92],
      ['rest', scoreNeed(agent.energy) * 0.82],
      ['clinic', scoreNeed(agent.health) * (agent.illness ? 1.15 : 0.74)],
      ['toilet', scoreNeed(agent.hygiene) * 0.65],
    ].sort((a, b) => b[1] - a[1]);
    if (pressure[0][1] > 0.48) {
      const kind = pressure[0][0];
      if (kind === 'social') return { kind, destination: findDestination(['cafe', 'plaza', 'park'], home) };
      if (kind === 'rest') return { kind, destination: home };
      if (kind === 'clinic') return { kind, destination: findDestination(['clinic'], home) };
      if (kind === 'toilet') return { kind, destination: findDestination(['toilet'], home) };
      return { kind, destination: findDestination(['market'], home) };
    }
    if (agent.goal.includes('钓鱼') || agent.goal.includes('垂钓')) return { kind: 'fish', destination: findDestination(['fishing', 'park'], home) };
    if (agent.goal.includes('射击') || agent.goal.includes('枪械') || agent.goal.includes('近战') || agent.goal.includes('武器') || agent.goal.includes('锻炼') || agent.goal.includes('体能') || agent.goal.includes('跑步')) {
      const training = findDestination(['training'], null);
      if (training) return { kind: 'train', destination: training, proficiency: trainingFocus(agent) };
    }
    if (job && (agent.energy > 26 || agent.energy > 72 - agent.skills.craft * 3) && Math.random() < (agent.mbti?.[3] === 'J' ? 0.84 : 0.68)) return { kind: actionForJob(job), destination: job.id };
    if (agent.goal.includes('學') || agent.goal.includes('考')) return { kind: 'study', destination: findDestination(['school'], home) };
    if (agent.goal.includes('绿') || agent.goal.includes('綠')) return { kind: 'garden', destination: findDestination(['park'], home) };
    return { kind: 'wander', destination: findDestination(['plaza', 'park', 'cafe'], home) };
  }

  function aiActionCandidates(agent, snapshot, fallback) {
    const choices = []; const seen = new Set();
    const add = (action, label) => {
      if (!action?.kind || action.kind === 'build') return;
      if (action.destination && !buildingById(action.destination)) return;
      if (action.targetId && !state.residents.some(person => person.id === action.targetId && !person.deceased)) return;
      const key = JSON.stringify([action.kind, action.destination || '', action.targetId || '', action.skill || '', action.loanId || '']);
      if (seen.has(key)) return;
      seen.add(key); choices.push({ id: `choice-${choices.length}`, label, action });
    };
    add(fallback, `本地策略建议：${actionLabel(fallback.kind)}`);
    if (agent.deceased || agent.jailDays > 0) return choices;
    const home = buildingById(agent.home)?.type === 'home' ? agent.home : publicShelter()?.id || null;
    const job = buildingById(agent.job) || state.buildings.find(building => building.type === agent.job) || null;
    const weakHealth = agent.health < 58 || (agent.illness && agent.illness.severity >= 2);
    const veryHungry = agent.hunger < 28 && agent.lastMealDay !== state.day;
    const exhausted = agent.energy < 22;
    if (weakHealth) {
      add({ kind: 'clinic', destination: findDestination(['clinic'], home) }, '优先就医');
      add({ kind: 'rest', destination: home }, '休息恢复');
      return choices;
    }
    if (veryHungry) {
      if (state.foodStock > 0) add({ kind: 'meal', destination: findDestination(['restaurant'], home) }, '优先吃饭');
      return choices;
    }
    if (exhausted) {
      add({ kind: 'rest', destination: home }, '优先休息');
      return choices;
    }
    if (agent.age >= 18 && job && agent.energy > 26) add({ kind: actionForJob(job), destination: job.id }, `工作：${job.name || facilityName(job.type)}`);
    if (agent.lastMealDay !== state.day && state.foodStock > 0) add({ kind: 'meal', destination: findDestination(['restaurant'], home) }, '支付餐费用餐');
    if (agent.hygiene < 48) add({ kind: 'toilet', destination: findDestination(['toilet'], home) }, '整理个人卫生');
    if (agent.energy < 65) add({ kind: 'rest', destination: home }, '休息恢复精力');
    add({ kind: 'social', destination: findDestination(['cafe', 'plaza', 'park'], home) }, '找居民交谈');
    if (agent.health < 76 || agent.illness) add({ kind: 'clinic', destination: findDestination(['clinic'], home) }, '去诊所检查');
    if (agent.age < 18 || agent.education?.status === 'university') {
      if (agent.age < 6) add({ kind: 'play', destination: findDestination(['park', 'home'], home) }, '玩耍并探索周围');
      else add({ kind: agent.education?.status === 'university' ? 'study' : 'childstudy', destination: findDestination(['school'], home) }, '学习提升能力');
      const interest = (agent.interests || []).slice().sort((a, b) => b.value - a.value)[0];
      add({ kind: 'hobby', destination: findDestination(['park', 'cafe', 'fishing', 'training', 'school'], home), skill: interest?.key || 'gardening' }, '练习自己的兴趣');
    } else {
      if (/钓鱼|垂钓/.test(agent.goal)) add({ kind: 'fish', destination: findDestination(['fishing', 'park'], home) }, '去河边钓鱼');
      if (/绿|園藝|园艺|种植|花草/.test(agent.goal)) add({ kind: 'garden', destination: findDestination(['park'], home) }, '照料花草与菜地');
      if (/射击|枪械|近战|武器|锻炼|体能|跑步/.test(agent.goal)) add({ kind: 'train', destination: findDestination(['training'], home), proficiency: trainingFocus(agent) }, '训练体能或武器熟练度');
      const interest = (agent.interests || []).slice().sort((a, b) => b.value - a.value)[0];
      if (interest) add({ kind: 'hobby', destination: findDestination(['park', 'cafe', 'fishing', 'training', 'school'], home), skill: interest.key }, `练习兴趣：${proficiencyLabels[interest.key] || interest.key}`);
    }
    const wealthyTarget = state.residents.filter(person => person.id !== agent.id && !person.deceased && person.money > 4).sort((a, b) => b.money - a.money)[0];
    if (agent.alignment <= -25 && wealthyTarget) add({ kind: 'scam', destination: agent.location || home, targetId: wealthyTarget.id }, `欺诈：试图骗取${wealthyTarget.name}的钱`);
    const overdueLoan = state.loans.find(loan => loan.lenderId === agent.id && loan.balance > 0 && loan.status === 'active' && state.day - (loan.createdDay || state.day) >= 30);
    const blockedTarget = agent.goalTarget?.status === 'blocked' ? state.residents.find(person => person.id === agent.goalTarget.blockedBy && !person.deceased) : null;
    const grievanceTarget = blockedTarget || (overdueLoan ? state.residents.find(person => person.id === overdueLoan.borrowerId && !person.deceased) : null);
    if (grievanceTarget && agent.anger >= 48) {
      add({ kind: 'intimidate', destination: agent.location || home, targetId: grievanceTarget.id, motive: overdueLoan ? '因为对方长期不还钱' : '因为具体买房目标被抢夺' }, `威胁${grievanceTarget.name}，要求解决纠纷`);
      if (agent.anger >= 67 && agent.attributes.strength >= 45) add({ kind: 'assault', destination: agent.location || home, targetId: grievanceTarget.id, motive: overdueLoan ? '因为对方长期不还钱' : '因为具体买房目标被抢夺' }, `殴打${grievanceTarget.name}，以暴力报复`);
      if (agent.alignment <= -78 && agent.anger >= 82) add({ kind: 'murder', destination: agent.location || home, targetId: grievanceTarget.id, motive: overdueLoan ? '因为对方长期不还钱' : '因为具体买房目标被抢夺' }, `谋杀${grievanceTarget.name}，铤而走险`);
    }
    return choices;
  }

  function aiWorldContext(agent, snapshot) {
    const place = buildingById(agent.location); const spouse = state.residents.find(person => person.id === agent.spouseId && !person.deceased);
    const nearby = place ? state.residents.filter(person => person.id !== agent.id && !person.deceased).filter(person => {
      const otherPlace = buildingById(person.location);
      return otherPlace && Math.abs(otherPlace.x - place.x) <= 1 && Math.abs(otherPlace.y - place.y) <= 1;
    }).slice(0, 6).map(person => ({ name: person.name, role: person.role, health: person.health, mood: person.mood, hunger: person.hunger, relationship: agent.relationships?.[person.id] || 0 })) : [];
    return {
      world: state.worldName, turn: snapshot.turn, day: state.day, period: periods[state.period]?.name || '早晨', weather: currentPeriod().weather,
      background: state.worldLore?.summary || '', environment: { ...state.environment }, outsideNews: state.outside,
      resources: { food: Math.floor(state.foodStock), treasury: Math.floor(state.treasury), residents: state.residents.filter(person => !person.deceased).length, publicDiscontent: state.justice.publicDiscontent || 0 },
      proposal: state.publicProposal ? { facility: facilityTypes[state.publicProposal.type]?.name, yesVotes: Object.values(state.publicProposal.votes || {}).filter(vote => vote === 'yes').length } : null,
      self: { location: place?.name || '街区', energy: agent.energy, health: agent.health, hunger: agent.hunger, hygiene: agent.hygiene, mood: agent.mood, anger: agent.anger, money: agent.money, home: agent.home ? homeLabel(buildingById(agent.home)) : '无家可归', job: `${agent.role} · ${employerLabel(agent)}`, family: spouse ? `配偶 ${spouse.name} · ${agent.children?.length || 0} 个孩子` : `${agent.children?.length || 0} 个孩子` },
      currentGoal: agent.goalTarget?.label || agent.goal, directive: agent.directive?.label || '', availableTools: [...(agent.tools || [])], nearby,
    };
  }

  async function planWithAI(agents, snapshot) {
    if (!state.aiRuntimeEnabled) {
      return agents.map(agent => { const action = decideAction(agent, snapshot); action.thought = composeThought(agent, action); return { id: agent.id, action }; });
    }
    const status = await window.SocietyBackend?.check?.();
    if (!status?.online || !status.openaiConfigured || !window.SocietyBackend?.decideAgentAction) {
      if (!state.aiRuntimeUnavailableNotified) { toast('逐回合模型当前不可用，本轮全部回退到本地策略。'); state.aiRuntimeUnavailableNotified = true; }
      return agents.map(agent => { const action = decideAction(agent, snapshot); action.thought = composeThought(agent, action); return { id: agent.id, action }; });
    }
    const plans = new Array(agents.length); let cursor = 0; let succeeded = 0; let failed = 0; let turnTokens = 0;
    async function worker() {
      while (cursor < agents.length) {
        const index = cursor++; const agent = agents[index];
        const fallback = decideAction(agent, snapshot); const choices = aiActionCandidates(agent, snapshot, fallback);
        try {
          const response = await window.SocietyBackend.decideAgentAction({
            agentId: agent.id, systemPrompt: makeSystemPrompt(agent), context: aiWorldContext(agent, snapshot),
            actions: choices.map(choice => ({ id: choice.id, label: choice.label })),
          });
          const selected = choices.find(choice => choice.id === response.choiceId) || choices[0];
          const action = { ...selected.action, thought: response.thought || composeThought(agent, selected.action) };
          const usage = response.usage || {};
          agent.runtimeTokenUsage ||= { calls: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, failedCalls: 0, model: response.model || null };
          agent.runtimeTokenUsage.calls += 1; agent.runtimeTokenUsage.inputTokens += Number(usage.inputTokens) || 0; agent.runtimeTokenUsage.outputTokens += Number(usage.outputTokens) || 0; agent.runtimeTokenUsage.totalTokens += Number(usage.totalTokens) || 0; agent.runtimeTokenUsage.model = response.model || agent.runtimeTokenUsage.model;
          state.aiUsage.calls += 1; state.aiUsage.inputTokens += Number(usage.inputTokens) || 0; state.aiUsage.outputTokens += Number(usage.outputTokens) || 0; state.aiUsage.totalTokens += Number(usage.totalTokens) || 0; turnTokens += Number(usage.totalTokens) || 0;
          succeeded += 1; plans[index] = { id: agent.id, action };
        } catch {
          agent.runtimeTokenUsage ||= { calls: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0, failedCalls: 0, model: status.model || null };
          agent.runtimeTokenUsage.failedCalls += 1; failed += 1;
          fallback.thought = composeThought(agent, fallback); plans[index] = { id: agent.id, action: fallback };
        }
      }
    }
    state.aiUsage.turns = (state.aiUsage.turns || 0) + 1;
    await Promise.all(Array.from({ length: Math.min(4, agents.length) }, () => worker()));
    state.aiUsage.fallbackCalls += failed;
    if (failed) toast(`${succeeded} 位居民由大模型决策，${failed} 位居民本轮回退到本地策略。`);
    else toast(`本轮 ${succeeded} 位居民完成 AI 决策，共 ${turnTokens} tokens。`);
    return plans;
  }

  function markDeceased(agent, reason = '健康状况持续恶化') {
    if (!agent || agent.deceased) return;
    agent.health = 0; agent.deceased = true; agent.location = agent.home || publicShelter()?.id || null;
    pushEvent(`${safeName(agent)}因${esc(reason)}离世。`, 'care', '†', [agent.id]);
    remember(agent, `我的健康降到了 0，最终因${reason}离世。`);
  }
  function modify(agent, values) {
    for (const [key, delta] of Object.entries(values)) agent[key] = key === 'money' ? Math.max(0, Number(agent[key] || 0) + delta) : clamp(agent[key] + delta);
    if (Object.hasOwn(values, 'health') && agent.health <= 0) markDeceased(agent, agent.hunger <= 0 ? '长期饥饿与健康衰竭' : '健康状况持续恶化');
  }
  function changeSkill(agent, key, amount) { agent.skills[key] = Math.min(10, (agent.skills[key] || 0) + amount); agent.tools = getTools(agent); }
  function improveAttribute(agent, key, amount = 0.2) {
    if (!agent || !attributeLabels[key] || (Number(agent.attributes?.[key]) || 0) >= 100) return 0;
    agent.attributeProgress ||= {};
    const progress = Math.max(0,Number(agent.attributeProgress[key]) || 0) + Math.max(0,Number(amount) || 0);
    const points = Math.floor(progress / 3);
    agent.attributeProgress[key] = Number((progress - points * 3).toFixed(2));
    if (!points) return 0;
    const before = Number(agent.attributes[key]) || 0; agent.attributes[key] = limitStat(before + points);
    const gained = agent.attributes[key] - before;
    if (gained <= 0) return 0;
    const message = `持續的生活與職業實踐讓${attributeLabels[key]}提升了 ${gained} 點。`;
    remember(agent,message); recordExperience(agent,message,key);
    if (Array.isArray(agent.actionAttributeGains)) agent.actionAttributeGains.push(`${attributeLabels[key]} +${gained}`);
    else pushEvent(`${safeName(agent)}的${attributeLabels[key]}成長了 ${gained} 點。`,'work','✦',[agent.id]);
    return gained;
  }
  function applyActionGrowth(agent, kind, action = {}) {
    const practice = {
      procure:[['financial',0.12],['intelligence',0.05]], shop:[['financial',0.12]], meal:[['financial',0.04]],
      clinic:[['emotional',0.12],['intelligence',0.06]], toilet:[['emotional',0.04]], rest:[['strength',0.08]],
      aid:[['emotional',0.16],['charisma',0.07]], observe:[['emotional',0.08],['intelligence',0.05]], reminisce:[['intelligence',0.08],['emotional',0.06]],
      play:[['charisma',0.1],['emotional',0.08]], garden:[['emotional',0.1],['intelligence',0.05]],
      restaurantwork:[['financial',0.12],['charisma',0.08]], farmwork:[['strength',0.12],['intelligence',0.06]],
      buy_land:[['financial',0.12]], build_home:[['strength',0.14],['intelligence',0.1]], open_shop:[['financial',0.15],['charisma',0.07]], open_branch:[['financial',0.12],['charisma',0.06]],
      scam:[['financial',0.08],['intelligence',0.06]], intimidate:[['strength',0.08],['charisma',0.06]], sabotage:[['intelligence',0.08]],
    };
    (practice[kind] || []).forEach(([key,amount]) => improveAttribute(agent,key,amount));
    if (kind === 'hobby') {
      const related = { firearms:'speed', melee:'strength', archery:'speed', medicine:'intelligence', cooking:'intelligence', fishing:'speed', farming:'strength', gardening:'emotional', programming:'intelligence', communication:'charisma', negotiation:'financial', animalCare:'emotional' };
      const key = related[action.skill]; if (key) improveAttribute(agent,key,0.1);
    }
  }
  function improveProficiency(agent, key, amount = 1) { agent.proficiencies[key] = Math.min(100, (agent.proficiencies[key] || 0) + amount); }
  function recordExperience(agent, text, skill) {
    agent.experiences ||= [];
    agent.experiences.unshift({ text, skill, day: state.day }); agent.experiences = agent.experiences.slice(0, 40);
  }
  function actionForJob(job) {
    return ({ school: 'teach', clinic: 'carework', petshop: 'petwork', cafe: 'cookwork', restaurant: 'restaurantwork', farm: 'farmwork', park: 'garden', fishing: 'fish', training: 'train' })[job.type] || 'work';
  }
  function composeThought(agent, action) {
    const goal = `「${agent.goal}」`;
    const place = buildingById(action.destination);
    const placeName = place?.name || (place ? facilityName(place.type) : '附近');
    const thoughts = {
      work: `我先把${placeName}的工作做好，存下一点钱，也能离${goal}更近。`,
      teach: `孩子们各有擅长的事。我想再找一个例子，让今天这堂课更有意思。`,
      carework: `先仔细听街坊说哪里不舒服，再决定怎么帮忙。`,
      petwork: `小动物不太习惯陌生人，我得慢一点，让它觉得安心。`,
      cookwork: `我想做出让人记得住的味道，看看哪种点心最受欢迎。`,
      restaurantwork: `先把食材准备好，让来吃饭的人今天都能吃上一顿热乎的。`,
      farmwork: `看看菜地的土和叶子，照料得仔细一点，收成就能多留下一些。`,
      meal: `该吃饭了。我会挑一顿自己负担得起、也能填饱肚子的饭。`,
      procure: `镇上的食物储备快见底了，我得尽快联系${state.environment.regionName}补货。`,
      build: `这里缺少${facilityTypes[action.facility]?.name || '一处新设施'}。我想和街坊一起把地方建起来，因为${action.reason || '它能让镇上生活更方便'}。`,
      study: `这个问题我还没完全弄懂，再读一遍，也许能找到线索。`,
      social: `我想找个人聊几句，听听最近大家都在忙什么。`,
      wander: `沿着街区走一走，看看今天有什么新变化。`,
      shop: `先买些吃的和日用品，再想想怎样把钱用得更妥当。`,
      clinic: `身体发出的信号不能忽略，我去做个检查。`,
      toilet: `先整理好自己，等会儿做事会更舒服。`,
      rest: `我有点累，先回去歇一会儿，之后再继续。`,
      garden: `照顾好这片花草，路过的人也会觉得心里亮一点。`,
      fish: `河边很安静，我想专心试试今天的水情。`,
      train: `练得扎实一点，下一次就能做得更稳。`,
      scam: `我想从${placeName}找个容易得手的机会，但也要留意会不会被人发现。`,
      intimidate: `我得让${state.residents.find(r => r.id === action.targetId)?.name || '对方'}知道，惹我不划算。`,
      assault: `我因为${action.motive || '积压的愤怒'}失去克制，准备对${state.residents.find(r => r.id === action.targetId)?.name || '对方'}动手。`,
      murder: `我因${action.motive || '强烈私怨'}产生了极端念头，开始考虑杀害${state.residents.find(r => r.id === action.targetId)?.name || '对方'}，即使这会毁掉很多人的生活。`,
      sabotage: `如果${placeName}出点问题，我也许能从混乱里捞到好处。`,
      play: '我想去附近玩一会儿，看看能不能发现新的东西。',
      childstudy: '我想把今天不懂的问题弄明白，也许还能和同学聊聊。',
      hobby: `我想练练自己喜欢的${proficiencyLabels[action.skill] || '事情'}，看看能不能做得更好。`,
      aid: `我看到${state.residents.find(r => r.id === action.targetId)?.name || '一位街坊'}状态不太好，先去问问能不能帮上忙。`,
      observe: `我想看看${state.residents.find(r => r.id === action.targetId)?.name || '街坊'}今天的状态，也许TA需要帮忙，也许只是想一个人待会儿。`,
      reminisce: '我试着从压缩过的记忆里找回一段经历，想想它后来怎样改变了我。',
      repay: '手头宽裕了一点，我想先还一部分欠款，别让约定的利息越滚越多。',
      buy_land: action.goalTargetId ? `这不是随便一块地。我明确想买第 ${action.plot.x + 1} 列、第 ${action.plot.y + 1} 行的地块，在那里盖自己的房子。` : '我攒下了一些钱，想买一块地，为自己的房子或生意打个基础。',
      build_home: '这是自己的地，我想把存款变成一个真正可以安家的地方。',
      open_shop: '我想试着自己做生意，哪怕从一间小店开始。',
      open_branch: '这家店有稳定客源，我想把经营做大一些，再开一家分店。',
    };
    let thought = thoughts[action.kind] || `我先去${placeName}看看，再决定下一步。`;
    if (agent.trait.includes('内向') && action.kind === 'social') thought = `我有点不习惯主动开口，不过我还是想认识新朋友。${thought}`;
    const background = agent.background || {};
    const voiceSeed = Array.from(agent.id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    if ((state.turn + voiceSeed) % 3 === 0) {
      const personalWish = background.privateWish?.startsWith(agent.name)
        ? `我${background.privateWish.slice(agent.name.length)}`
        : background.privateWish?.replace(/^(TA|她|他)/, '我');
      const reflections = [
        background.values ? `我想继续按「${background.values}」的方式做事。` : `我想认真把这件小事做好。`,
        personalWish ? `其实，${personalWish}` : `这样也能离自己的目标近一点。`,
        `我会记得当初为什么来到这里，也不想轻易放弃「${agent.goal}」。`,
      ];
      thought += reflections[voiceSeed % reflections.length];
    }
    return thought;
  }
  function actionLabel(kind) {
    return ({ work: '工作', teach: '授课', carework: '社区照护', petwork: '宠物照料', cookwork: '烹饪', restaurantwork: '经营餐厅', farmwork: '照料菜地', meal: '用餐', procure: '外部采购', build: '公共设施施工', buy_land: '购买土地', build_home: '建造私宅', open_shop: '开设商店', open_branch: '扩展分店', study: '学习', social: '交谈', wander: '散步', shop: '采购', clinic: '就医', toilet: '整理', rest: '休息', garden: '园艺', fish: '钓鱼', train: '训练', scam: '欺诈', intimidate: '威胁', assault: '殴打', murder: '谋杀', sabotage: '破坏', incarcerated: '服刑', play: '玩耍', childstudy: '上学', hobby: '兴趣练习', aid: '帮助居民', observe: '观察街坊', reminisce: '回想往事', repay: '偿还借款' })[kind] || '日常行动';
  }
  function actionOutcome(agent, kind) {
    return ({
      work: `完成工作，缴纳工资税后存款为 ${agent.money} 元。`, teach: '带领学生完成了一堂课。', carework: '为街坊提供了基础检查与照护。',
      petwork: '照顾了来店里的小动物。', cookwork: '做好了餐点，积累了烹饪经验。', restaurantwork: '经营餐厅并准备餐点，积累了烹饪经验。', farmwork: '查看并照料作物，帮助农田稳定生长。', meal: '吃了一顿饭，支付了餐费。', procure: '为小镇补充外部食材。', build: '完成一座居民提议的公共设施。', study: '完成一段学习，智力与知识有所成长。',
      social: '和附近的人聊了聊，心情与关系有所改善。', wander: '在街区走动，留意周围变化。', shop: '买到食品或日用品，缓解了饥饿。',
      clinic: '在诊所检查身体，健康状态好转。', toilet: '使用公共卫生间，整理个人状态。', rest: '休息了一段时间，恢复精力。',
      garden: '照料了公共花圃。', fish: '在河岸垂钓，增长钓鱼熟练度。', train: '完成训练，提升对应熟练度或体能。',
      scam: '试图用谎话骗取钱财，可能得手，也可能被人识破。', intimidate: '用威胁给居民造成压力，关系随之恶化。', assault: '出于积怨殴打他人，受害者可能受伤，案件会进入司法流程。', murder: '尝试谋杀他人；可能致死，也可能留下重伤和严重刑事案件。', sabotage: '破坏公共设施，给小镇带来维护损失。', incarcerated: `在看守所服刑，剩余 ${agent.jailDays} 个模拟日。`,
      play: '通过玩耍和探索积累生活经验。', childstudy: '在学校学习知识，积累学习经历。', hobby: '练习个人兴趣，熟练度随着阅历逐渐提高。',
      aid: '主动照顾了有需要的街坊。', buy_land: '买下一块地，为之后建房或做生意做准备。', build_home: '用个人存款建成自己的房子。', open_shop: '投资开店，开始经营自己的生意。', open_branch: '为自己的品牌或加盟品牌开出一家分店。',
      observe: '观察了附近居民的身体、情绪和能力表现。', reminisce: '主动回想起一段较早的经历，并提高了回想熟练度。', repay: `偿还借款后可用余额为 ${agent.money} 元，当前欠款 ${debtBalance(agent.id)} 元。`,
    })[kind] || '度过了一个生活时段。';
  }
  function trainingFocus(agent) {
    if (['strength', 'speed'].includes(agent.specialty)) return null;
    if (proficiencyLabels[agent.specialty]) return agent.specialty;
    const match = agent.goal.match(/枪械|射击|近战|武器|弓箭|射箭/);
    if (match) return /枪械|射击/.test(match[0]) ? 'firearms' : /弓箭|射箭/.test(match[0]) ? 'archery' : 'melee';
    return Object.keys(proficiencyLabels).slice(0, 3).sort((a, b) => (agent.proficiencies[a] || 0) - (agent.proficiencies[b] || 0))[0];
  }
  function safeName(agent) { return `<b>${esc(agent.name)}</b>`; }
  function debit(agent, amount) {
    const cost = Math.max(0, Math.floor(Number(amount) || 0));
    if (!agent || agent.money < cost) return false;
    agent.money = Math.max(0, agent.money - cost);
    return true;
  }
  function loansFor(agentId) { return state.loans.filter(loan => (loan.lenderId === agentId || loan.borrowerId === agentId) && loan.balance > 0); }
  function receivableBalance(agentId) { return loansFor(agentId).filter(loan => loan.lenderId === agentId).reduce((sum, loan) => sum + loan.balance, 0); }
  function debtBalance(agentId) { return loansFor(agentId).filter(loan => loan.borrowerId === agentId).reduce((sum, loan) => sum + loan.balance, 0); }
  function createLoan(lender, borrower, amount, monthlyRate, reason) {
    const principal = Math.max(1, Math.floor(Number(amount) || 0));
    if (!lender || !borrower || lender.id === borrower.id || !debit(lender, principal)) return null;
    borrower.money = Math.max(0, Number(borrower.money) || 0) + principal;
    const loan = { id: `loan-${state.idCounter++}`, lenderId: lender.id, borrowerId: borrower.id, principal, balance: principal, monthlyRate: Math.max(0, Math.min(0.2, Number(monthlyRate) || 0)), createdDay: state.day, nextInterestDay: state.day + 30, reason, status: 'active', repayments: [] };
    state.loans.unshift(loan);
    remember(lender, `我自愿借给${borrower.name} ${principal} 元；约定月利率 ${(loan.monthlyRate * 100).toFixed(1)}%，用途：${reason}。`);
    remember(borrower, `${lender.name}愿意借给我 ${principal} 元；约定月利率 ${(loan.monthlyRate * 100).toFixed(1)}%。这笔钱需要偿还。`);
    pushEvent(`${safeName(lender)}自愿借给${safeName(borrower)} ${principal} 元，月利率 ${(loan.monthlyRate * 100).toFixed(1)}%。`, 'social', '¥', [lender.id, borrower.id]);
    if (loan.monthlyRate >= 0.12) changeMorality(lender, -1, '收取高额借款利息');
    else if (lender.alignment >= 45 && loan.monthlyRate <= 0.05) changeMorality(lender, 1, '低息帮助有需要的街坊');
    return loan;
  }
  function willingnessToLend(lender, borrower, amount, rate = 0.03) {
    if (!lender || !borrower || lender.deceased || borrower.deceased || lender.money < amount + 3) return false;
    const relation = Number(lender.relationships?.[borrower.id] || 0);
    const family = (borrower.parents || []).includes(lender.id) || lender.children?.includes(borrower.id) || lender.spouseId === borrower.id ? 0.2 : 0;
    const surplus = Math.max(0, Math.min(1, (lender.money - amount) / 100));
    const morality = (Number(lender.alignment || 0) + 100) / 200;
    const profitMotive = lender.alignment < 0 && rate >= 0.1 ? 0.18 : 0;
    const score = 0.05 + morality * 0.38 + Math.max(0, Math.min(1, (relation + 30) / 100)) * 0.24 + surplus * 0.2 + family + profitMotive - (debtBalance(borrower.id) > 0 ? 0.12 : 0);
    return Math.random() < Math.max(0.02, Math.min(0.96, score));
  }
  function requestLoan(borrower, lender, amount, rate, reason) {
    if (!borrower || !lender || borrower.id === lender.id) return null;
    if (willingnessToLend(lender, borrower, amount, rate)) return createLoan(lender, borrower, amount, rate, reason);
    remember(borrower, `我向${lender.name}询问能否借 ${amount} 元，但对方选择不借给我。`);
    remember(lender, `${borrower.name}问我借 ${amount} 元；我权衡之后决定暂时不借。`);
    pushEvent(`${safeName(borrower)}向${safeName(lender)}询问借款，对方考虑后没有答应。`, 'social', '↔', [borrower.id, lender.id]);
    return null;
  }
  function changeMorality(agent, delta, reason) {
    if (!agent) return;
    const before = Number(agent.alignment) || 0; agent.alignment = Math.max(-100, Math.min(100, before + delta));
    if (agent.alignment !== before) remember(agent, `${reason}，我的道德倾向${delta > 0 ? '上升' : '下降'}到 ${agent.alignment}。`);
  }
  function reportCrime(offender, victim, crimeType, severity, detail = '') {
    if (!offender) return null;
    const witnesses = state.residents.filter(person => !person.deceased && person.id !== offender.id && (!victim || person.id !== victim.id) && (person.location === offender.location || person.location === victim?.location));
    const item = { id: `case-${state.idCounter++}`, crimeType, offenderId: offender.id, victimId: victim?.id || null, severity: Math.max(1, Number(severity) || 1), detail, openedDay: state.day, status: 'reported', evidence: Math.min(1, 0.25 + witnesses.length * 0.18), witnesses: witnesses.map(person => person.id), lastProgressDay: 0 };
    state.justice.cases.unshift(item); state.justice.cases = state.justice.cases.slice(0, 80);
    witnesses.forEach(witness => remember(witness, `我目睹了${offender.name}${detail ? `：${detail}` : '实施违法行为'}，之后可能会向警务室报告。`, '目击', 0.92));
    pushEvent(`${safeName(offender)}涉及${crimeType}案件${victim ? `，受害者是${safeName(victim)}` : ''}；${state.buildings.some(building => building.type === 'police') ? '案件进入警务调查。' : '镇上暂无警务室，调查可能受阻。'}`, 'care', '⚖', [offender.id, ...(victim ? [victim.id] : []), ...witnesses.slice(0, 4).map(person => person.id)]);
    return item;
  }
  function justiceFacility(type) { return state.buildings.find(building => building.type === type) || null; }
  function progressJustice() {
    for (const item of state.justice.cases) {
      if (['convicted','dismissed','closed'].includes(item.status) || item.lastProgressDay === state.day) continue;
      item.lastProgressDay = state.day;
      const police = justiceFacility('police'); const prosecutor = justiceFacility('prosecutor'); const court = justiceFacility('courthouse');
      const offender = state.residents.find(person => person.id === item.offenderId); const victim = state.residents.find(person => person.id === item.victimId);
      if (!offender) { item.status = 'closed'; continue; }
      if (item.status === 'reported' || item.status === 'investigation') {
        if (police) {
          const officers = state.residents.filter(person => !person.deceased && (buildingById(person.job)?.type || person.job) === 'police').length;
          item.evidence = Math.min(2, item.evidence + 0.28 + levelOf(police) * 0.07 + officers * 0.1 + Math.random() * 0.12);
          item.status = 'investigation';
          if (item.evidence >= 0.9 && prosecutor) { item.status = 'prosecuted'; item.prosecutedDay = state.day; pushEvent(`${esc(prosecutor.name || '检察院')}审查了${esc(item.crimeType)}案件证据，决定提起公诉。`, 'town', '⚖', [offender.id, ...(victim ? [victim.id] : [])]); }
        } else if (item.evidence >= 1.1 && prosecutor) item.status = 'prosecuted';
      } else if (item.status === 'prosecuted' && court && state.day - (item.prosecutedDay || item.openedDay) >= 1) {
        const convictionChance = Math.min(0.98, 0.3 + item.evidence * 0.4 + item.severity * 0.1);
        const convicted = item.evidence >= 1.25 || Math.random() < convictionChance;
        if (!convicted) {
          item.status = 'dismissed'; item.closedDay = state.day;
          pushEvent(`法院审理${esc(item.crimeType)}案件后，认为现有证据不足，驳回指控。`, 'town', '⚖', [offender.id, ...(victim ? [victim.id] : [])]);
          continue;
        }
        item.status = 'convicted'; item.closedDay = state.day;
        const sentence = item.crimeType === '谋杀' ? 36 + roll(0, 48) : item.crimeType === '殴打' ? 5 + roll(0, 12) : item.crimeType === '盗窃 / 欺诈' ? 2 + roll(0, 7) : 1 + roll(0, 5);
        item.sentenceDays = sentence;
        offender.jailDays = Math.max(offender.jailDays || 0, sentence); offender.convictionCount = (offender.convictionCount || 0) + 1;
        if (victim && item.crimeType !== '谋杀') { const fine = Math.min(offender.money, item.severity * 6); offender.money -= fine; victim.money += fine; item.restitution = fine; }
        pushEvent(`法院判定${safeName(offender)}犯有${esc(item.crimeType)}罪，判处 ${sentence} 个模拟日监禁${justiceFacility('prison') ? '，由看守所执行' : '；镇上暂时没有监狱设施，先行羁押'}。`, 'care', '⚖', [offender.id, ...(victim ? [victim.id] : [])]);
        remember(offender, `法院判我犯有${item.crimeType}罪，并判处 ${sentence} 个模拟日监禁。`);
        if (victim) remember(victim, `法院审结了针对${offender.name}的${item.crimeType}案件。`);
      }
    }
  }
  function contributeToDream(agent, sourceAmount) {
    if (!agent?.dream || agent.money < 18 || sourceAmount <= 0) return;
    const rate = 0.06 + (agent.attributes?.financial || 50) / 1000 + Math.max(0, agent.alignment || 0) / 5000;
    const amount = Math.min(agent.money, Math.max(1, Math.floor(sourceAmount * rate)));
    if (!debit(agent, amount)) return;
    agent.dreamFund += amount; agent.dream.progress = Math.min(100, Math.floor(agent.dreamFund / agent.dream.targetCost * 100));
    if (agent.dreamFund >= agent.dream.targetCost) {
      const achieved = { ...agent.dream, completedDay: state.day, funded: agent.dream.targetCost };
      agent.dreamFund = Math.max(0, agent.dreamFund - agent.dream.targetCost); agent.dreamHistory ||= []; agent.dreamHistory.unshift(achieved);
      pushEvent(`${safeName(agent)}攒够了梦想资金，实现了「${esc(achieved.title)}」。`, 'social', '✦', [agent.id]);
      chooseNextDream(agent, true);
    }
  }
  function repayLoan(loan, payer, amount) {
    if (!loan || !payer || loan.borrowerId !== payer.id || loan.balance <= 0) return false;
    const payment = Math.min(loan.balance, Math.max(1, Math.floor(Number(amount) || 0)), payer.money);
    if (!payment || !debit(payer, payment)) return false;
    loan.balance -= payment; loan.repayments ||= []; loan.repayments.unshift({ day: state.day, amount: payment });
    const lender = state.residents.find(r => r.id === loan.lenderId);
    if (lender && !lender.deceased) lender.money += payment; else state.treasury += payment;
    if (loan.balance <= 0) { loan.balance = 0; loan.status = 'repaid'; loan.closedDay = state.day; }
    pushEvent(`${safeName(payer)}偿还借款 ${payment} 元${loan.balance ? `，还欠 ${loan.balance} 元` : '，这笔借款已还清'}。`, 'social', '¥', [payer.id, ...(lender ? [lender.id] : [])]);
    return true;
  }
  function seekVoluntaryLoan(borrower, amount, reason) {
    if (!borrower) return false;
    const close = state.residents.filter(person => person.id !== borrower.id && !person.deceased && person.money >= amount + 3).sort((a, b) => {
      const score = person => ((Number(person.relationships?.[borrower.id]) || 0) + 30) + (person.alignment || 0) * 0.45 + (person.money - amount) * 0.12 + ((borrower.parents || []).includes(person.id) || person.children?.includes(borrower.id) || person.spouseId === borrower.id ? 48 : 0);
      return score(b) - score(a);
    });
    const lender = close[0];
    if (!lender) return false;
    return Boolean(requestLoan(borrower, lender, amount, borrower.age < 18 ? 0.02 : 0.04, reason));
  }
  function wageProfile(kind, agent) {
    const profiles = {
      work: [['financial','intelligence'],['programming','leadership','negotiation','logistics']], teach: [['intelligence','emotional'],['teaching','childcare']], carework: [['intelligence','emotional'],['medicine','firstAid']],
      petwork: [['emotional','charisma'],['animalCare','firstAid']], study: [['intelligence','emotional'],['programming','teaching']], childstudy: [['intelligence','emotional'],['teaching','programming']],
      cookwork: [['intelligence','charisma'],['cooking','logistics']], restaurantwork: [['financial','charisma'],['cooking','logistics']], farmwork: [['strength','intelligence'],['farming','gardening']],
      fish: [['speed','strength'],['fishing','survival']], train: [['strength','speed'],[agent.specialty || 'firearms']], procure: [['financial','intelligence'],['logistics','driving']],
      garden: [['emotional','intelligence'],['gardening','gardeningDesign']], social: [['charisma','emotional'],['communication','persuasion']], build: [['strength','intelligence'],['construction','repair']],
    };
    if (profiles[kind]) return profiles[kind];
    const job = buildingById(agent.job) || buildingByType(agent.job);
    const byJob = { school: 'teach', clinic: 'carework', petshop: 'petwork', cafe: 'cookwork', restaurant: 'restaurantwork', farm: 'farmwork', park: 'garden', fishing: 'fish', training: 'train' };
    return profiles[byJob[job?.type] || 'work'];
  }
  function wageMultiplier(agent, kind = 'work') {
    const [attributes, skills] = wageProfile(kind, agent);
    const attributeScore = attributes.reduce((sum,key) => sum + (Number(agent.attributes?.[key]) || 0),0) / Math.max(1,attributes.length);
    const skillScore = skills.reduce((sum,key) => sum + (Number(agent.proficiencies?.[key]) || 0),0) / Math.max(1,skills.length);
    const job = buildingById(agent.job) || buildingByType(agent.job);
    const buildingBonus = job ? Math.min(0.18, (levelOf(job)-1)*0.025) : 0;
    return Math.max(0.55,Math.min(1.7,0.55 + attributeScore/100*0.68 + skillScore/100*0.4 + buildingBonus));
  }
  function payWage(agent, gross, label = '工资', actionKind = 'work') {
    const base = Math.max(0, Math.floor(gross)); const multiplier = wageMultiplier(agent, actionKind);
    const amount = Math.max(base ? 3 : 0, Math.round(base * multiplier));
    const workplace = workplaceOf(agent); const publicJob = agent.employmentType === 'public';
    let paid = amount;
    if (publicJob) {
      paid = Math.min(amount, Math.max(0, state.treasury)); state.treasury -= paid;
    } else if (workplace) {
      const business = workplace.businessId ? businessById(workplace.businessId) : null;
      const employer = workplace.ownerId ? state.residents.find(person => person.id === workplace.ownerId) : null;
      const account = business || workplace;
      account.cashBalance = Math.max(0, Number(account.cashBalance) || 0);
      const fromBusiness = Math.min(paid, account.cashBalance); account.cashBalance -= fromBusiness;
      let remaining = paid - fromBusiness;
      if (remaining && employer && employer.id !== agent.id) { const personalShare = Math.min(remaining, employer.money); employer.money -= personalShare; remaining -= personalShare; }
      paid -= remaining;
    } else paid = 0;
    const tax = Math.floor(paid * 0.1); const net = paid - tax;
    agent.money = Math.max(0, agent.money) + net; recordTax(tax); contributeToDream(agent, net);
    if (paid < amount) agent.unpaidWages = Math.max(0, Number(agent.unpaidWages) || 0) + (amount - paid);
    return { gross: paid, tax, net, label, base, multiplier, unpaid: amount - paid, employer: publicJob ? '镇公所预算' : workplace ? '私人经营资金' : '无固定雇主' };
  }
  function recordRetailSale(building, amount) {
    if (!building) { state.treasury += amount; return; }
    if (building.businessId) building.monthSales = (building.monthSales || 0) + amount;
    else if (building.ownership === 'private' || ['market','cafe','restaurant','petshop','farm','office'].includes(building.type)) building.cashBalance = Math.max(0, Number(building.cashBalance) || 0) + Math.max(0, Number(amount) || 0);
    else state.treasury += amount;
  }
  function publicShelter() { return buildingByType('plaza') || buildingByType('park') || buildingByType('cafe') || buildingByType('toilet'); }
  function processMonthlyEconomy() {
    const month = Math.max(1, Math.floor((state.day - 2) / 30) + 1);
    state.lastMonthTaxRevenue = Math.max(0, Number(state.monthTaxRevenue) || 0); state.monthTaxRevenue = 0;
    let paid = 0; let evicted = 0;
    state.loans.filter(loan => loan.status === 'active' && loan.balance > 0 && loan.monthlyRate > 0).forEach(loan => {
      while ((loan.nextInterestDay || loan.createdDay + 30) <= state.day && loan.balance > 0) {
        const interest = Math.max(1, Math.ceil(loan.balance * loan.monthlyRate));
        loan.balance += interest; loan.nextInterestDay += 30;
        const borrower = state.residents.find(r => r.id === loan.borrowerId); const lender = state.residents.find(r => r.id === loan.lenderId);
        remember(borrower, `第 ${month} 月借款利息 ${interest} 元并入本金，当前欠款 ${loan.balance} 元。`);
        if (lender) remember(lender, `第 ${month} 月借款产生 ${interest} 元利息，${borrower?.name || '借款人'}当前欠款 ${loan.balance} 元。`);
      }
    });
    state.residents.filter(agent => !agent.deceased).forEach(agent => {
      let home = buildingById(agent.home);
      if (!home || home.type !== 'home') {
        const vacancy = state.buildings.filter(building => building.type === 'home' && availableHousing(building) > 0 && (building.ownership === 'public' || effectiveRent(building) <= agent.money)).sort((a, b) => effectiveRent(a) - effectiveRent(b))[0];
        if (vacancy && agent.money >= effectiveRent(vacancy)) {
          agent.home = vacancy.id; agent.homelessSince = null; home = vacancy;
          remember(agent, `我找到了空余的${vacancy.ownership === 'public' ? '公租房' : '出租房'}，准备按月支付租金。`);
          pushEvent(`${safeName(agent)}找到了空余房间，结束了公共设施露宿。`, 'town', '⌂', [agent.id]);
        }
      }
      if (home?.type === 'home') {
        const guardians = agent.age < 18 ? (agent.parents || []).map(id => state.residents.find(r => r.id === id)).filter(r => r && !r.deceased).sort((a, b) => b.money - a.money) : [];
        const livesWithOwner = home.ownership === 'private' && (home.ownerId === agent.id || home.ownerId === agent.spouseId || guardians.some(parent => parent.id === home.ownerId));
        const rent = livesWithOwner ? 0 : effectiveRent(home);
        if (agent.money < rent && guardians.length) seekVoluntaryLoan(agent, Math.max(rent, 12), '居民自愿借款缴纳月租');
        if (agent.money >= rent) {
          debit(agent, rent); paid += rent;
          if (home.ownership === 'private' && home.ownerId) { const landlord = state.residents.find(r => r.id === home.ownerId); if (landlord) landlord.money += rent; else state.treasury += rent; }
          else state.treasury += rent;
          remember(agent, `第 ${month} 月缴清 ${home.ownership === 'private' ? '房东' : '公租房'}租金 ${rent} 元。`);
        } else {
          agent.home = null; agent.homelessSince ??= state.day; agent.location = publicShelter()?.id || null; evicted += 1;
          modify(agent, { health: -3, mood: -12, stress: 12 });
          remember(agent, `我凑不出 ${rent} 元月租，被迫搬到公共设施暂住。`);
          pushEvent(`${safeName(agent)}没能交上 ${rent} 元月租，暂时搬到公共设施露宿。`, 'care', '⌂', [agent.id]);
        }
      } else {
        agent.location = publicShelter()?.id || null;
      }
    });
    if (paid) pushEvent(`第 ${month} 月租金结算：镇上共收取 ${paid} 元租金，其中公租房收入进入镇公所预算。`, 'town', '⌂');
    let taxed = 0;
    state.buildings.filter(building => building.businessId).forEach(building => {
      const business = businessById(building.businessId); if (!business) return;
      const owner = state.residents.find(r => r.id === building.ownerId); if (!owner || owner.deceased) return;
      const customers = Math.max(2, Math.round(state.residents.filter(r => !r.deceased).length / 2));
      const gross = Math.max(8, Math.round((building.monthSales || 0) + 6 + customers * 1.5 + (business.type === 'restaurant' || business.type === 'cafe' ? customers : 0)));
      const tax = Math.floor(gross * 0.1); const afterTax = gross - tax;
      const royalty = building.franchiseOf ? Math.floor(afterTax * (business.royaltyRate || 0.1)) : 0;
      const reserve = Math.floor(afterTax * 0.22); business.cashBalance = Math.max(0, Number(business.cashBalance) || 0) + reserve;
      owner.money += afterTax - royalty - reserve;
      contributeToDream(owner, afterTax - royalty - reserve);
      if (royalty) { const brandOwner = state.residents.find(r => r.id === business.ownerId); if (brandOwner && !brandOwner.deceased) brandOwner.money += royalty; }
      recordTax(tax); taxed += tax; building.lastMonthlyRevenue = gross; building.monthSales = 0;
    });
    state.buildings.filter(building => !building.businessId && ['market','cafe','restaurant','petshop','farm','office'].includes(building.type)).forEach(building => {
      const workers = state.residents.filter(agent => !agent.deceased && (agent.job === building.id || agent.job === building.type)).length;
      building.cashBalance = Math.max(0, Number(building.cashBalance) || 0) + Math.max(10, workers * 16 + Math.floor(state.residents.length / 3));
    });
    if (taxed) pushEvent(`第 ${month} 月私人店铺完成结算，营业税共 ${taxed} 元进入镇公所。`, 'town', '▧');
  }
  function choosePersonalInvestmentPlan() {
    const adults = state.residents.filter(agent => !agent.deceased && agent.age >= 18 && agent.health >= 45 && agent.energy >= 35);
    const builders = adults.filter(agent => agent.landPlotId && buildingById(agent.landPlotId)?.ownerId === agent.id && agent.money >= privateHomeCost);
    if (builders.length) {
      const agent = builders.sort((a, b) => Number(b.goalTarget?.status === 'land-purchased') - Number(a.goalTarget?.status === 'land-purchased') || b.money - a.money)[0];
      return { agent, action: { kind: 'build_home', plot: buildingById(agent.landPlotId) } };
    }
    const owners = adults.filter(agent => agent.ownedBusinessId && businessById(agent.ownedBusinessId) && agent.money >= (facilityTypes[businessById(agent.ownedBusinessId).type]?.cost || 40) + landPrice);
    if (owners.length && Math.random() < 0.28) {
      const agent = owners.sort((a, b) => b.money - a.money)[0]; const plot = findBuildPlot(businessById(agent.ownedBusinessId).type);
      if (plot) return { agent, action: { kind: 'open_branch', plot, businessId: agent.ownedBusinessId } };
    }
    const investors = adults.filter(agent => !agent.landPlotId && !agent.ownedBusinessId && agent.money >= landPrice + privateHomeCost && !state.buildings.some(b => b.type === 'home' && b.ownership === 'private' && b.ownerId === agent.id));
    if (investors.length && Math.random() < 0.035) {
      const agent = investors.sort((a, b) => b.money - a.money)[0]; const plot = findBuildPlot('home');
      if (plot) return { agent, action: { kind: 'buy_land', plot, project: 'home' } };
    }
    const shopkeepers = adults.filter(agent => !agent.ownedBusinessId && agent.money >= landPrice + facilityTypes.cafe.cost + 20 && state.buildings.some(b => b.type === 'home' && b.ownership === 'private' && b.ownerId === agent.id));
    if (shopkeepers.length && Math.random() < 0.02) {
      const agent = shopkeepers.sort((a, b) => b.money - a.money)[0]; const plot = findBuildPlot('cafe');
      if (plot) return { agent, action: { kind: 'open_shop', plot, type: 'cafe' } };
    }
    return null;
  }
  function resolveAction(agent, action) {
    if (!agent || agent.deceased) return;
    agent.actionAttributeGains = [];
    const destination = buildingById(action.destination); const placeName = action.placeLabel || destination?.name || (destination ? facilityName(destination.type) : '街区');
    agent.location = action.destination || agent.home;
    modify(agent, { energy: -4, hunger: -5, hygiene: -2, socialNeed: -2 });
    switch (action.kind) {
      case 'work':
        {
          const gross = Math.max(4, Math.floor((9 + (state.outside.effect === 'market' ? 2 : 0)) * (state.outside.effect === 'recession' ? 0.65 : 1)));
          const wage = payWage(agent, gross, '工资', 'work');
          modify(agent, { energy: -Math.max(5, 10 - Math.floor(agent.attributes.speed / 25)), hunger: -5, mood: 2, socialNeed: -1 });
          changeSkill(agent, 'craft', Math.random() < 0.4 ? 1 : 0); improveAttribute(agent, 'financial', 0.25); improveAttribute(agent, 'intelligence', 0.08);
          const profession = jobProficiencies.find(([pattern]) => pattern.test(`${agent.role} ${agent.job}`))?.[1]?.[0];
          if (profession) improveProficiency(agent, profession, 0.8);
          remember(agent, `完成了一段工作，基础工资 ${wage.base} 元，属性与熟练度效能 ×${wage.multiplier.toFixed(2)}，税前 ${wage.gross} 元，缴税 ${wage.tax} 元，到手 ${wage.net} 元。`);
          pushEvent(`${safeName(agent)}在${esc(placeName)}工作，基础工资 ${wage.base} 元，个人效能 ×${wage.multiplier.toFixed(2)}，税前 ${wage.gross} 元、缴税 ${wage.tax} 元，到手 ${wage.net} 元。`, 'work', '↗', [agent.id]); break;
        }
      case 'teach':
        modify(agent, { energy: -7, hunger: -4, mood: 3, socialNeed: 2 }); payWage(agent, 10, '授课收入', 'teach'); changeSkill(agent, 'knowledge', 1); improveProficiency(agent, 'teaching', 1.1); improveProficiency(agent, 'childcare', 0.3);
        remember(agent, '今天教会了别人一点新东西。'); pushEvent(`${safeName(agent)}在学校带大家上了一堂有趣的课。`, 'work', '▤', [agent.id]); break;
      case 'carework':
        modify(agent, { energy: -7, hunger: -4, mood: 3 }); payWage(agent, 10, '诊疗收入', 'carework'); changeSkill(agent, 'care', 1); improveProficiency(agent, 'medicine', 1 + agent.attributes.intelligence / 100); improveProficiency(agent, 'firstAid', 0.8); improveAttribute(agent, 'emotional', 0.2);
        remember(agent, '认真照看了来诊所的人。'); pushEvent(`${safeName(agent)}在诊所帮街坊做了检查，大家都安心了些。`, 'care', '✚', [agent.id]); break;
      case 'petwork':
        modify(agent, { energy: -6, hunger: -3, mood: 5, socialNeed: 3 }); payWage(agent, 9, '宠物护理收入', 'petwork'); changeSkill(agent, 'care', 1); improveProficiency(agent, 'animalCare', 1.2);
        remember(agent, '今天遇见了一只很可爱的动物。'); pushEvent(`${safeName(agent)}在宠物店照顾了一只小狗，心情变好了。`, 'care', '♧', [agent.id]); break;
      case 'study':
        modify(agent, { energy: -8, hunger: -4, mood: 2, socialNeed: 2 }); changeSkill(agent, 'knowledge', 1); improveAttribute(agent, 'intelligence', 0.3 + agent.attributes.intelligence / 300); improveProficiency(agent, agent.role.includes('工程') || agent.role.includes('软件') ? 'programming' : 'teaching', 0.4);
        remember(agent, '学到了一个新知识点。'); pushEvent(`${safeName(agent)}在学校安静地学习了一会儿。`, 'work', '▤', [agent.id]); break;
      case 'social':
      case 'wander':
        modify(agent, { energy: -5, socialNeed: action.kind === 'social' ? 20 + Math.floor(agent.attributes.emotional / 25) : 9, mood: action.kind === 'social' ? 5 + Math.floor(agent.attributes.charisma / 20) : 2, anger: action.kind === 'social' ? -6 : 0, stress: action.kind === 'social' ? -3 : 0 }); changeSkill(agent, 'social', Math.random() < 0.25 ? 1 : 0);
        if (action.kind === 'social') { improveProficiency(agent, 'communication', 0.55); if (agent.attributes.charisma > 65) improveProficiency(agent, 'persuasion', 0.2); }
        if (action.kind === 'social') { improveAttribute(agent, 'charisma', 0.2); improveAttribute(agent, 'emotional', 0.2); }
        if (action.kind === 'social') { remember(agent, `在${placeName}和人聊了聊。`); pushEvent(`${safeName(agent)}去${esc(placeName)}坐了坐，期待遇见熟人。`, 'social', '♡', [agent.id]); }
        else if (Math.random() < 0.45) pushEvent(`${safeName(agent)}沿着街区散步，顺手看了看镇上的新变化。`, 'town', '⌂', [agent.id]);
        break;
      case 'cookwork':
        modify(agent, { energy: -8, hunger: 3, mood: 4, socialNeed: 1 }); payWage(agent, 11, '餐饮收入', 'cookwork');
        improveProficiency(agent, 'cooking', 1.5 + agent.attributes.intelligence / 200); improveAttribute(agent, 'financial', 0.2); changeSkill(agent, 'craft', 1);
        remember(agent, '做出了一道让客人喜欢的餐点。'); pushEvent(`${safeName(agent)}在${esc(placeName)}做了几份好吃的点心，客人们很满意。`, 'work', '☕', [agent.id]); break;
      case 'restaurantwork':
        modify(agent, { energy: -7, hunger: 1, mood: 3 }); payWage(agent, 9, '餐厅经营收入', 'restaurantwork');
        improveProficiency(agent, 'cooking', 1.2); improveProficiency(agent, 'logistics', 0.3); changeSkill(agent, 'craft', Math.random() < 0.35 ? 1 : 0);
        remember(agent, '开门准备了餐厅，也留意大家喜欢什么口味。'); break;
      case 'farmwork':
        modify(agent, { energy: -6, hunger: -2, mood: 2 }); improveProficiency(agent, 'farming', 1.2); improveProficiency(agent, 'gardening', 0.55); changeSkill(agent, 'craft', Math.random() < 0.3 ? 1 : 0);
        remember(agent, '照料了菜地，检查作物生长情况。'); break;
      case 'buy_land':
        purchaseLand(agent, action.plot, true); agent.landProject = action.project || 'home'; break;
      case 'build_home':
        buildPrivateHome(agent, action.plot, true); break;
      case 'open_shop':
        if (purchaseLand(agent, action.plot, true)) establishBusiness(agent, action.plot, action.type || 'cafe', null, true);
        break;
      case 'open_branch':
        {
          const brand = businessById(action.businessId);
          if (brand && purchaseLand(agent, action.plot, true)) establishBusiness(agent, action.plot, brand.type, brand.id, true);
          break;
        }
      case 'build':
        {
          const meta = facilityTypes[action.facility]; const plot = action.plot;
          const approved = action.publicApproval && state.approvedBuild && state.approvedBuild.type === action.facility;
        if (approved && meta && plot && countStructures() < state.town.rules.maxBuildings && state.treasury >= meta.cost && footprintFits(action.facility, 1, Number(action.rotation) || 0, plot.x, plot.y)) {
            state.treasury -= meta.cost;
            const newCells = footprintCells(action.facility, 1, Number(action.rotation) || 0).map(([dx,dy]) => `${plot.x + dx},${plot.y + dy}`);
            state.buildings = state.buildings.filter(building => !(newCells.includes(`${building.x},${building.y}`) && ['grass', 'plot'].includes(building.type) && !building.ownerId));
            const id = `resident-build-${state.idCounter++}`;
            const name = action.facility === 'home' ? `新建公租房 ${state.buildings.filter(building => building.type === 'home').length + 1}` : meta.name;
            const newBuilding = { id, type: action.facility, x: plot.x, y: plot.y, name, level: 1, rotation: Number(action.rotation) || 0, condition: 96 };
            if (action.facility === 'home') Object.assign(newBuilding, { ownership: 'public', capacity: facilityDetails.home.capacity, baseCapacity: facilityDetails.home.capacity, rent: state.town.rules.publicRent, baseRent: state.town.rules.publicRent, salePrice: 150 });
            if (action.facility === 'farm') newBuilding.crop = { name: '萝卜', plantedDay: state.day, maturesOn: state.day + cropGrowthDays(newBuilding), yield: Math.max(12, state.residents.length + 4) };
            state.buildings.push(newBuilding); agent.location = id;
            if (action.facility === 'home') agent.home = id;
            else agent.job = id;
            agent.tools = getTools(agent);
            modify(agent, { energy: -14, hunger: -5, mood: 3 });
            improveProficiency(agent, 'construction', 1.4); improveProficiency(agent, 'repair', 0.5);
            if (action.facility === 'restaurant') improveProficiency(agent, 'cooking', 1);
            remember(agent, `我和街坊一起建成了${name}，因为${action.reason}。`);
            pushEvent(`${action.proposer ? `<b>${esc(action.proposer)}</b>提出想法，` : ''}${safeName(agent)}带头建成了${esc(name)}：${esc(action.reason)}。镇公所支出 ${meta.cost} 元。`, 'town', meta.icon, [...new Set([agent.id, ...state.residents.filter(resident => resident.name === action.proposer).map(resident => resident.id)])]);
            archivePublicProposal(state.approvedBuild, 'built');
            state.approvedBuild = null;
          }
          break;
        }
      case 'meal':
        {
          if (state.foodStock > 0) {
            const restaurant = buildingByType('restaurant');
            const price = Math.max(1, 2 + Number(state.environment.marketPrice || 0) + (restaurant ? 1 : 0) + (state.environment.road === 'limited' ? 1 : 0) + (state.outside.effect === 'recession' ? 2 : 0) - (state.outside.effect === 'supply' ? 1 : 0));
            if (agent.money < price && agent.age < 18) seekVoluntaryLoan(agent, Math.max(price, 12), '孩子主动请求的餐费周转');
            if (agent.money < price) seekVoluntaryLoan(agent, Math.max(price, 12), '生活餐费周转');
            if (debit(agent, price)) {
              state.foodStock -= 1;
              const seller = restaurant || state.buildings.find(building => building.type === 'market');
              recordRetailSale(seller, price);
              modify(agent, { hunger: 43, mood: 2, energy: -1 }); agent.lastMealDay = state.day;
              remember(agent, `我自己支付 ${price} 元在${restaurant ? '餐厅' : '家'}吃饭。`);
              pushEvent(`${safeName(agent)}${restaurant ? `在${esc(restaurant.name || facilityTypes.restaurant.name)}` : '在家'}吃了顿饭，自己支付 ${price} 元。`, 'town', '♨', [agent.id]);
            } else {
              agent.lastMealDay = state.day; modify(agent, { hunger: -4, mood: -6, stress: 4 });
              remember(agent, `我没钱支付 ${price} 元餐费，问过身边的人后仍然没有获得借款。`);
              pushEvent(`${safeName(agent)}身上没钱，借款也未获同意，今天没能买到饭。`, 'care', '!', [agent.id]);
            }
          } else {
            const shortageReason = state.environment.road === 'blocked' ? '县道中断，外部采购暂时停了' : '镇公所预算不足，采购没有及时送到';
            agent.lastMealDay = state.day; modify(agent, { hunger: -5, mood: -5, stress: 4 });
            remember(agent, `${shortageReason}，今天没能买到足够的食物。`);
            pushEvent(`${safeName(agent)}发现镇上暂时没有食物可买，只能先将就。`, 'care', '!', [agent.id]);
          }
          break;
        }
      case 'procure':
        modify(agent, { energy: -5, hunger: -2 });
        agent.lastProcurementDay = state.day;
        if (procureFood(agent)) { payWage(agent, 3, '采购收入', 'procure'); changeSkill(agent, 'craft', Math.random() < 0.2 ? 1 : 0); improveProficiency(agent, 'logistics', 0.8); }
        else pushEvent(`${safeName(agent)}想从${esc(state.environment.regionName)}补货，但镇公所预算不足。`, 'town', '↗', [agent.id]);
        break;
      case 'fish':
        modify(agent, { energy: -5, hunger: 14, mood: 6, socialNeed: 3 }); improveProficiency(agent, 'fishing', 2); improveAttribute(agent, 'speed', 0.08);
        if (Math.random() < 0.5 + (state.outside.effect === 'river' ? 0.2 : 0)) payWage(agent, 4, '渔获收入', 'fish');
        remember(agent, `在${placeName}钓鱼，慢慢安静下来。`); pushEvent(`${safeName(agent)}在${esc(placeName)}垂钓，享受了一段安静时光。`, 'social', '🎣', [agent.id]); break;
      case 'train':
        {
          const proficiency = action.proficiency || trainingFocus(agent);
          const attribute = ['strength', 'speed'].includes(agent.specialty) ? agent.specialty : proficiency === 'firearms' || proficiency === 'archery' ? 'speed' : 'strength';
          const practiceName = proficiencyLabels[proficiency] || (attribute === 'strength' ? '力量训练' : '敏捷训练');
          modify(agent, { energy: -12, hunger: -7, mood: 2 }); if (proficiency) improveProficiency(agent, proficiency, 2); improveAttribute(agent, attribute, 0.3);
          remember(agent, `在${placeName}练习${practiceName}。`);
          pushEvent(`${safeName(agent)}在${esc(placeName)}练习${esc(practiceName)}，${proficiency ? '熟练度' : '属性'}提升了。`, 'work', '◎', [agent.id]); break;
        }
      case 'shop':
        {
          const price = Math.max(1, 3 + Number(state.environment.marketPrice || 0) + (state.environment.road === 'limited' ? 1 : 0) + (state.outside.effect === 'recession' ? 2 : 0) - Math.floor(agent.attributes.financial / 40) - (state.outside.effect === 'supply' ? 1 : 0));
          if (state.foodStock > 0 && agent.money >= price) {
            state.foodStock -= 1; debit(agent, price);
            const seller = state.buildings.find(building => building.type === 'market');
            recordRetailSale(seller, price);
            modify(agent, { hunger: 18 + Math.floor(agent.attributes.financial / 25), mood: 2, energy: -2 });
            remember(agent, `在超市买了些食物和日用品，支付 ${price} 元。`);
            pushEvent(`${safeName(agent)}在超市买了些东西，支付 ${price} 元。`, 'town', '▧', [agent.id]);
          } else {
            modify(agent, { mood: -2, energy: -2, hunger: -3 });
            remember(agent, state.foodStock > 0 ? `我想买东西，但身上只有 ${agent.money} 元，不够支付 ${price} 元。` : '去了超市，但镇上暂时没有现货。');
            pushEvent(`${safeName(agent)}${state.foodStock > 0 ? `身上只有 ${agent.money} 元，买不起 ${price} 元的食物` : '到超市时发现食物缺货'}。`, 'town', '▧', [agent.id]);
          }
          break;
        }
      case 'clinic':
        modify(agent, { health: Math.round(28 * facilityEffect(destination || {type:'clinic',level:1})), mood: 3, energy: -2, stress: -12 });
        if (agent.illness) { const illnessName = agent.illness.name; agent.illness = null; improveProficiency(agent, 'medicine', 0.6); remember(agent, `在诊所接受了治疗，${illnessName}症状缓解。`); pushEvent(`${safeName(agent)}在诊所接受治疗，疾病症状得到缓解。`, 'care', '✚', [agent.id]); }
        else { improveProficiency(agent, 'medicine', 0.3); remember(agent, '去诊所检查了身体。'); }
        pushEvent(`${safeName(agent)}到诊所做了检查，身体状况好转了。`, 'care', '✚', [agent.id]); break;
      case 'toilet':
        modify(agent, { hygiene: 36, mood: 1 }); break;
      case 'rest':
        modify(agent, { energy: 28, mood: 2, health: 1, anger: -9, stress: -14 }); if (Math.random() < 0.34) pushEvent(`${safeName(agent)}回家歇了一会儿，重新打起精神。`, 'care', '☾', [agent.id]);
        break;
      case 'garden':
        modify(agent, { mood: 5, energy: -4, socialNeed: 3 }); changeSkill(agent, 'craft', Math.random() < 0.3 ? 1 : 0); improveProficiency(agent, 'gardening', 1); improveProficiency(agent, 'gardeningDesign', 0.35); remember(agent, '照料了公园里的花草。');
        if (Math.random() < 0.65) pushEvent(`${safeName(agent)}在公园整理花圃，小镇看起来更有生气了。`, 'town', '♣', [agent.id]); break;
      case 'aid':
        {
          const neighbor = state.residents.find(r => r.id === action.targetId);
          if (neighbor) {
            modify(neighbor, { health: 7, mood: 5, stress: -9, anger: -8 }); modify(agent, { mood: 4, energy: -5 });
            if (neighbor.illness && neighbor.illness.severity > 1) neighbor.illness.severity -= 1;
            agent.relationships[neighbor.id] = (agent.relationships[neighbor.id] || 0) + 8; neighbor.relationships[agent.id] = (neighbor.relationships[agent.id] || 0) + 8;
            changeMorality(agent, 1, '主动照顾身体不适的居民');
            improveProficiency(agent, 'firstAid', 0.7); const text = `${agent.name}照顾了状态不佳的${neighbor.name}。`;
            remember(agent, `我陪了${neighbor.name}一会儿，TA看起来平静了一些。`); remember(neighbor, `${agent.name}在我状态不好的时候帮了我。`);
            recordRelationshipInteraction(agent, neighbor, text, 8); pushEvent(`${safeName(agent)}主动帮助了${safeName(neighbor)}，陪TA去诊所休息。`, 'care', '♡', [agent.id, neighbor.id]);
          }
          break;
        }
      case 'observe':
        {
          const target = state.residents.find(r => r.id === action.targetId && !r.deceased);
          if (target) {
            const condition = target.health < 35 ? '看上去病得很重' : target.health < 60 ? '显得疲惫或不太舒服' : target.mood < 35 ? '情绪低落' : target.anger > 65 ? '很生气' : target.hunger < 25 ? '像是饿了' : '身体状态还算平稳';
            const attributes = ['strength','speed','charisma','intelligence','emotional','financial'].map(key => `${attributeLabels[key]} ${target.attributes[key]}`).join('、');
            const details = `${target.name}${condition}；我看到TA的健康 ${target.health}、心情 ${target.mood}、饱腹 ${target.hunger}。我能从日常表现估量TA的能力：${attributes}。`;
            remember(agent, details, '近距离观察', 0.82);
            agent.currentThought = target.health < 50 || target.hunger < 20 ? `我注意到${target.name}${condition}，想想能不能问问TA需要什么。` : `我留意到${target.name}做事时的状态，也许之前对TA的判断还不完整。`;
            improveProficiency(agent, 'recall', 0.2); modify(agent, { socialNeed: 2, mood: 1 });
            pushEvent(`${safeName(agent)}观察了${safeName(target)}的身体和情绪状态。`, 'social', '⌕', [agent.id, target.id]);
          }
          break;
        }
      case 'reminisce':
        {
          const recentIds = new Set((agent.memory || []).map(memory => memory.id).filter(Boolean));
          const oldMemory = (agent.memoryArchive || []).find(memory => memory.id && !recentIds.has(memory.id));
          if (oldMemory) {
            remember(agent, `我想起了第 ${oldMemory.day || 1} 天的一件事：${oldMemory.text}`, '主动回想', 0.94);
            improveProficiency(agent, 'recall', 1.2); modify(agent, { mood: 2, stress: -2 });
            pushEvent(`${safeName(agent)}回想起以前的一段经历，重新理解了它的意义。`, 'social', '◷', [agent.id]);
          } else modify(agent, { mood: 1 });
          break;
        }
      case 'repay':
        {
          const loan = state.loans.find(item => item.id === action.loanId && item.borrowerId === agent.id);
          if (loan) repayLoan(loan, agent, Math.min(loan.balance, Math.max(1, Math.floor(Math.max(0, agent.money - 10) * 0.35))));
          break;
        }
      case 'scam':
        {
          const victim = state.residents.find(r => r.id === action.targetId);
          if (victim && victim.money > 0) {
            changeMorality(agent, -4, '通过欺诈谋取钱财');
            reportCrime(agent, victim, '盗窃 / 欺诈', 2, '试图通过欺诈转移钱财');
            const caught = Math.random() < 0.28 + victim.attributes.emotional / 450;
            if (caught) {
              const text = `${victim.name}识破了${agent.name}的骗局，并当面揭穿了TA。`;
              modify(victim, { anger: 28, mood: -12, stress: 12 }); modify(agent, { anger: 6, mood: -5 });
              agent.relationships[victim.id] = (agent.relationships[victim.id] || 0) - 18; victim.relationships[agent.id] = (victim.relationships[agent.id] || 0) - 18;
              improveProficiency(agent, 'deception', 1.2); pushEvent(`${safeName(victim)}识破了${safeName(agent)}的骗局，当场揭穿了这场欺诈。`, 'care', '⚑', [agent.id, victim.id]);
              remember(victim, `${agent.name}试图骗我，我识破了这件事。`); remember(agent, `${victim.name}识破了我的话术，我暂时得收敛一些。`); recordRelationshipInteraction(agent, victim, text, -18);
            } else {
              const amount = Math.min(victim.money, roll(3, 8)); victim.money -= amount; agent.money += amount;
              modify(victim, { anger: 20, mood: -8, stress: 8 }); agent.relationships[victim.id] = (agent.relationships[victim.id] || 0) - 14; victim.relationships[agent.id] = (victim.relationships[agent.id] || 0) - 14;
              improveProficiency(agent, 'deception', 1.5); const text = `${agent.name}骗走了${victim.name} ${amount} 元。`;
              pushEvent(`${safeName(agent)}骗走${safeName(victim)} ${amount} 元，镇上的信任受到了损害。`, 'care', '⚑', [agent.id, victim.id]);
              remember(victim, `${agent.name}骗走了我 ${amount} 元。`); remember(agent, `我从${victim.name}那里弄到了 ${amount} 元，但对方可能会记住这件事。`); recordRelationshipInteraction(agent, victim, text, -14);
            }
          }
          break;
        }
      case 'intimidate':
        {
          const victim = state.residents.find(r => r.id === action.targetId);
          if (victim) {
            changeMorality(agent, -3, '用威胁伤害他人');
            modify(victim, { anger: 24, stress: 16, mood: -10 }); modify(agent, { anger: 4, mood: -3 });
            agent.relationships[victim.id] = (agent.relationships[victim.id] || 0) - 16; victim.relationships[agent.id] = (victim.relationships[agent.id] || 0) - 16;
            const text = `${agent.name}威胁了${victim.name}，让对方感到害怕和愤怒。`;
            reportCrime(agent, victim, '威胁', 1, action.motive || '以威胁迫使对方让步');
            pushEvent(`${safeName(agent)}威胁了${safeName(victim)}，附近的人开始议论这起冲突。`, 'care', '⚡', [agent.id, victim.id]);
            remember(victim, `${agent.name}威胁了我，我感到愤怒，也有些害怕。`); remember(agent, `我对${victim.name}放了狠话。`); recordRelationshipInteraction(agent, victim, text, -16);
          }
          break;
        }
      case 'assault':
        {
          const victim = state.residents.find(r => r.id === action.targetId && !r.deceased);
          if (victim) {
            const weapon = Math.max(agent.proficiencies.melee || 0, agent.proficiencies.firearms || 0);
            const damage = Math.max(10, Math.round(12 + agent.attributes.strength * 0.16 + weapon * 0.12 - victim.attributes.speed * 0.04));
            modify(victim, { health: -damage, anger: 32, mood: -18, stress: 20 });
            modify(agent, { anger: 8, mood: -8, stress: 9 }); changeMorality(agent, -9, '因私怨殴打他人');
            agent.relationships[victim.id] = (Number(agent.relationships[victim.id]) || 0) - 30; victim.relationships[agent.id] = (Number(victim.relationships[agent.id]) || 0) - 38;
            reportCrime(agent, victim, '殴打', 3, action.motive || '因私人纠纷动手伤人');
            remember(agent, `我因为${action.motive || '愤怒'}打了${victim.name}。伤害已经造成，我可能要承担法律后果。`);
            remember(victim, `${agent.name}因为${action.motive || '愤怒'}打了我，身体和关系都受到了伤害。`);
            recordRelationshipInteraction(agent, victim, `${agent.name}殴打了${victim.name}；起因：${action.motive || '私人冲突'}。`, -38);
            pushEvent(`${safeName(agent)}因为${esc(action.motive || '私人纠纷')}殴打${safeName(victim)}，造成 ${damage} 点伤害。`, 'care', '⚡', [agent.id, victim.id]);
          }
          break;
        }
      case 'murder':
        {
          const victim = state.residents.find(r => r.id === action.targetId && !r.deceased);
          if (victim) {
            const skill = Math.max(agent.proficiencies.melee || 0, agent.proficiencies.firearms || 0);
            const hitChance = Math.max(0.16, Math.min(0.78, 0.24 + skill / 210 + agent.attributes.strength / 500 - victim.attributes.speed / 450));
            const lethal = Math.random() < hitChance;
            changeMorality(agent, -22, '企图杀害他人'); modify(agent, { anger: 12, mood: -18, stress: 20 });
            agent.relationships[victim.id] = (Number(agent.relationships[victim.id]) || 0) - 60; victim.relationships[agent.id] = (Number(victim.relationships[agent.id]) || 0) - 65;
            if (lethal) markDeceased(victim, `遭到${agent.name}谋杀`);
            else modify(victim, { health: -Math.max(34, Math.round(42 + skill * 0.18)), anger: 42, mood: -28, stress: 35 });
            reportCrime(agent, victim, '谋杀', 5, action.motive || '因具体利益冲突蓄意杀人');
            remember(agent, `我因${action.motive || '强烈私怨'}企图杀害${victim.name}。这会改变他们的命运，也会使我面对严重刑事指控。`);
            remember(victim, lethal ? `${agent.name}因${action.motive || '私怨'}杀害了我。` : `${agent.name}因${action.motive || '私怨'}企图杀害我，我受了重伤。`);
            recordRelationshipInteraction(agent, victim, `${agent.name}企图谋杀${victim.name}；起因：${action.motive || '利益冲突'}。`, -65);
            pushEvent(lethal ? `${safeName(agent)}因${esc(action.motive || '强烈私怨')}杀害了${safeName(victim)}；谋杀案件已记录。` : `${safeName(agent)}企图因${esc(action.motive || '强烈私怨')}杀害${safeName(victim)}，受害者幸存但重伤。`, 'care', '†', [agent.id, victim.id]);
          }
          break;
        }
      case 'sabotage':
        {
          const targetBuilding = state.buildings.filter(b => !['road','grass','plot','home'].includes(b.type)).sort((a, b) => (a.condition ?? 94) - (b.condition ?? 94))[0];
          if (targetBuilding) { changeMorality(agent, -5, '蓄意破坏公共设施'); targetBuilding.condition = Math.max(0, (targetBuilding.condition ?? 94) - 16); modify(agent, { anger: 3, mood: -2 }); reportCrime(agent, null, '破坏公共设施', 2, `破坏${targetBuilding.name || facilityName(targetBuilding.type)}`); pushEvent(`${safeName(agent)}暗中破坏了${esc(targetBuilding.name || facilityName(targetBuilding.type))}，维修需求增加。`, 'care', '⚑', [agent.id]); remember(agent, `我动了${targetBuilding.name || facilityName(targetBuilding.type)}的手脚。`); }
          break;
        }
      case 'incarcerated':
        {
          const prison = justiceFacility('prison'); if (prison) agent.location = prison.id;
          modify(agent, { energy: -2, mood: -3, socialNeed: -2 });
          if (Math.random() < 0.2) pushEvent(`${safeName(agent)}正在服刑，剩余 ${agent.jailDays} 个模拟日。`, 'care', '▦', [agent.id]);
          break;
        }
      case 'play':
        modify(agent, { mood: 10, socialNeed: 8, energy: -3 }); recordExperience(agent, '在街区玩耍，观察大人和周围发生的事。', 'social');
        remember(agent, '今天玩得很开心，还发现街角有些新鲜事。'); break;
      case 'childstudy':
        modify(agent, { energy: -7, mood: 3 }); changeSkill(agent, 'knowledge', 1); improveAttribute(agent, 'intelligence', 0.35 * facilityEffect(destination || {type:'school',level:1}));
        improveProficiency(agent, 'teaching', 0.25); recordExperience(agent, '在学校学习并完成了一项练习。', 'teaching'); remember(agent, '今天在学校学会了一点新东西。'); break;
      case 'hobby':
        {
          const skill = Object.hasOwn(proficiencyLabels, action.skill) ? action.skill : 'gardening';
          const favorite = agent.interests?.find(item => item.key === skill);
          improveProficiency(agent, skill, 1 + (favorite?.value || 0) / 80 + agent.experiences.filter(item => item.skill === skill).length / 25);
          modify(agent, { mood: 4, energy: -5 }); recordExperience(agent, `练习了喜欢的${proficiencyLabels[skill]}。`, skill);
          remember(agent, `我花时间练了练喜欢的${proficiencyLabels[skill]}，好像比以前更熟练了。`); break;
        }
      default: break;
    }
    applyActionGrowth(agent,action.kind,action);
    const growthNote = agent.actionAttributeGains.length ? `基础属性成长：${agent.actionAttributeGains.join('、')}` : '';
    if (growthNote) pushEvent(`${safeName(agent)}通过${actionLabel(action.kind)}获得了新的成长点：${agent.actionAttributeGains.join('、')}。`,'work','✦',[agent.id]);
    const record = {
      id: `${state.turn}-${agent.id}-${Math.random()}`, day: state.day, period: state.period,
      action: actionLabel(action.kind), place: placeName, thought: action.thought || composeThought(agent, action),
      result: [actionOutcome(agent, action.kind),growthNote].filter(Boolean).join('；'), mood: agent.mood,
    };
    agent.actionAttributeGains = null;
    agent.currentThought = record.thought; agent.lastAction = record; agent.journal ||= [];
    agent.journal.unshift(record);
    if (agent.directive && agent.directive.until <= state.turn + 1) agent.directive = null;
  }

  function resolveSocialGroups() {
    const socialTypes = new Set(['cafe', 'restaurant', 'plaza', 'park']);
    const groups = new Map();
    state.residents.filter(r => !r.deceased).forEach(r => {
      const place = buildingById(r.location); if (!place || !socialTypes.has(place.type)) return;
      if (!groups.has(place.id)) groups.set(place.id, []); groups.get(place.id).push(r);
    });
    for (const [placeId, group] of groups) {
      if (group.length < 2) continue;
      const place = buildingById(placeId); const pairIndex = state.turn % group.length; const pair = [group[pairIndex], group[(pairIndex + 1) % group.length]];
      const hostile = pair.some(r => r.alignment <= -25) && Math.random() < 0.38;
      pair.forEach(r => { modify(r, hostile ? { socialNeed: 2, mood: -5, anger: 8, stress: 6 } : { socialNeed: 6, mood: 2, anger: -2 }); });
      const moralFriction = Math.abs(pair[0].alignment - pair[1].alignment) > 75 ? -2 : 2;
      const mbtiFit = Math.round(mbtiCompatibility(pair[0], pair[1]) / 16);
      const bond = hostile ? -5 - Math.floor(pair[0].anger / 30) : 2 + mbtiFit + moralFriction + Math.round((pair[0].attributes.charisma + pair[0].attributes.emotional + pair[1].attributes.charisma + pair[1].attributes.emotional) / 100);
      pair[0].relationships[pair[1].id] = (pair[0].relationships[pair[1].id] || 0) + bond;
      pair[1].relationships[pair[0].id] = (pair[1].relationships[pair[0].id] || 0) + bond;
      pair.forEach(r => improveAttribute(r, 'emotional', 0.1));
      if (hostile) {
        const text = `${pair[0].name}和${pair[1].name}在${place.name || facilityName(place.type)}发生争执，彼此更加戒备。`;
        pushEvent(`${safeName(pair[0])}和${safeName(pair[1])}在${esc(place.name || facilityName(place.type))}发生争执，火气都上来了。`, 'care', '⚡', pair.map(r => r.id));
        remember(pair[0], `和${pair[1].name}发生争执，我现在不太信任TA。`); remember(pair[1], `和${pair[0].name}发生争执，心里有些不舒服。`);
        recordRelationshipInteraction(pair[0], pair[1], text, bond);
      } else {
        const text = `${pair[0].name}和${pair[1].name}在${place.name || facilityName(place.type)}交谈，熟络了一些。`;
        pushEvent(`${safeName(pair[0])}和${safeName(pair[1])}在${esc(place.name || facilityName(place.type))}聊得投机，熟络了一些。`, 'social', '♡', pair.map(r => r.id));
        remember(pair[0], `和${pair[1].name}聊得很开心。`); remember(pair[1], `和${pair[0].name}聊得很开心。`);
        recordRelationshipInteraction(pair[0], pair[1], text, bond);
      }
    }
  }

  const childNamePool = ['安宁','知夏','星野','清禾','望舒','明川','念安','云舟','乐言','初阳','以宁','青禾','小满','星遥','一诺','予安'];
  function mbtiCompatibility(a, b) {
    const x = a.mbti || 'ISFJ'; const y = b.mbti || 'ISFJ';
    return 8 + [...x].filter((letter, index) => y[index] === letter).length * 3 + ((x[1] !== y[1] && x[2] !== y[2]) ? 5 : 0);
  }
  function proposeChildName(parent) {
    const seed = Array.from(parent.id + parent.name).reduce((sum, char) => sum + char.charCodeAt(0), 0) + state.day;
    return childNamePool[seed % childNamePool.length];
  }
  function decideChildName(mother, father) {
    const momSuggestion = proposeChildName(mother); const dadSuggestion = proposeChildName(father);
    let chosen = momSuggestion[0] + dadSuggestion[1];
    if (chosen === momSuggestion || chosen === dadSuggestion || chosen.length < 2) chosen = momSuggestion;
    if (state.residents.some(r => r.name === chosen)) chosen = dadSuggestion[0] + momSuggestion[1];
    return { chosen, momSuggestion, dadSuggestion };
  }
  function considerMarriage() {
    if (state.period !== 3) return;
    const eligible = state.residents.filter(r => !r.deceased && r.age >= 18 && ['男','女'].includes(r.gender) && !r.spouseId);
    const pairs = [];
    eligible.forEach(a => eligible.filter(b => b.id > a.id && b.gender !== a.gender).forEach(b => {
      const score = Math.min(Number(a.relationships[b.id] || 0), Number(b.relationships[a.id] || 0));
      const compatibility = mbtiCompatibility(a, b);
      if (score >= 34 && Math.random() < 0.12 + score / 330 + compatibility / 700) pairs.push({ a, b, score, compatibility });
    }));
    pairs.sort((x, y) => y.score + y.compatibility - x.score - x.compatibility);
    const pair = pairs[0]; if (!pair) return;
    const { a, b, score } = pair;
    a.spouseId = b.id; b.spouseId = a.id;
    state.marriages.push({ id: 'marriage-' + state.idCounter++, partnerIds: [a.id, b.id], day: state.day, children: [], lastBirthDay: null });
    const suitableHome = state.buildings.filter(building => building.type === 'home' && (building.ownership !== 'private' || building.ownerId === a.id || building.ownerId === b.id)).find(building => availableHousing(building) + Number(a.home === building.id) + Number(b.home === building.id) >= 2);
    if (suitableHome) { a.home = suitableHome.id; b.home = suitableHome.id; }
    const text = `${a.name}和${b.name}决定结婚，关系从亲密走向新的生活。`;
    pushEvent(`${safeName(a)}和${safeName(b)}举行了婚礼，决定一起生活。`, 'social', '♡', [a.id, b.id]);
    remember(a, `我和${b.name}结婚了，想和TA一起经营我们的生活。`); remember(b, `我和${a.name}结婚了，接下来要一起面对小镇的日子。`);
    recordRelationshipInteraction(a, b, text, Math.max(1, score));
  }
  function considerDivorce() {
    if (state.period !== 3) return;
    const troubled = state.marriages.filter(marriage => marriage.status !== 'divorced').map(marriage => {
      const [a, b] = marriage.partnerIds.map(id => state.residents.find(person => person.id === id));
      if (!a || !b || a.deceased || b.deceased || a.spouseId !== b.id || b.spouseId !== a.id) return null;
      const relationship = Math.min(Number(a.relationships?.[b.id] || 0), Number(b.relationships?.[a.id] || 0));
      const distress = (a.anger + b.anger) / 2 + (100 - a.mood + 100 - b.mood) * 0.18;
      const seriousAbuse = state.justice.cases.some(item => item.offenderId === a.id && item.victimId === b.id || item.offenderId === b.id && item.victimId === a.id);
      const pressure = relationship < -28 || distress > 135 || seriousAbuse;
      return pressure ? { a, b, relationship, distress, seriousAbuse, score: (seriousAbuse ? 50 : 0) + Math.max(0, -relationship) + distress * 0.25 } : null;
    }).filter(Boolean).sort((x, y) => y.score - x.score);
    const candidate = troubled[0];
    if (!candidate) return;
    const chance = candidate.seriousAbuse ? 0.12 : Math.min(0.11, 0.025 + candidate.score / 1800);
    if (Math.random() < chance) divorceCouple(candidate.a, candidate.b);
  }
  function createChild(mother, father, marriage) {
    const { chosen, momSuggestion, dadSuggestion } = decideChildName(mother, father);
    const gender = Math.random() < 0.5 ? '女' : '男'; const id = 'child-' + state.idCounter++;
    const sharedHome = mother.home || father.home || 'home-a';
    const child = person(id, chosen, '婴儿', '在家人的照料与自己的兴趣中慢慢长大', '好奇、依恋家人', [4, 3, 2, 3], sharedHome, 'home', palette[state.residents.length % palette.length], {
      gender, age: 0, ageDays: 0, education: { status: 'enrolled', dropout: false }, attributeProgress: {}, money: 0, alignment: Math.round((mother.alignment + father.alignment) / 2), parents: [mother.id, father.id], children: [],
      background: { story: `${chosen}出生在榆灯镇，是${mother.name}和${father.name}的孩子。TA将从家庭、邻里、学校和自己的经历中逐渐形成能力与喜好。`, turningPoint: '出生时，两位家长一起给TA取了名字。', privateWish: '在安全、有趣的生活里慢慢发现自己喜欢什么。', values: '尚在成长中' },
      interests: [], relationships: { [mother.id]: 26, [father.id]: 26 }, custodyParentId: mother.id,
      experiences: [{ text: `出生于${mother.name}和${father.name}的家庭。`, skill: null, day: state.day }], currentThought: '我还很小，正在通过身边的人了解这个世界。',
    });
    mother.relationships[child.id] = Math.max(Number(mother.relationships[child.id]) || 0, 20);
    father.relationships[child.id] = Math.max(Number(father.relationships[child.id]) || 0, 20);
    chooseNextDream(child);
    const inheritedSkills = ['cooking','medicine','fishing','farming','programming','gardening','animalCare','teaching','repair','media'];
    const parentFocus = [...inheritedSkills].sort((x, y) => ((mother.proficiencies[y] || 0) + (father.proficiencies[y] || 0)) - ((mother.proficiencies[x] || 0) + (father.proficiencies[x] || 0))).slice(0, 2);
    const interestKeys = [...new Set([...parentFocus, inheritedSkills[roll(0, inheritedSkills.length - 1)], inheritedSkills[roll(0, inheritedSkills.length - 1)]])].slice(0, 3);
    child.interests = interestKeys.map((key, index) => ({ key, value: roll(48, 82) - index * 5 }));
    for (const [key, label] of Object.entries(attributeLabels)) child.attributes[key] = limitStat((mother.attributes[key] + father.attributes[key]) / 2 * 0.4 + roll(16, 31));
    for (const key of Object.keys(proficiencyLabels)) child.proficiencies[key] = limitStat(((mother.proficiencies[key] || 0) + (father.proficiencies[key] || 0)) * 0.18 + roll(0, 10));
    child.tools = getTools(child); state.residents.push(child); mother.children.push(child.id); father.children.push(child.id); marriage.children.push(child.id);
    const announcement = `${mother.name}的取名提议是「${momSuggestion}」，${father.name}提议「${dadSuggestion}」，两人共同定名为「${chosen}」。`;
    pushEvent(`${safeName(mother)}和${safeName(father)}迎来了${gender === '男' ? '儿子' : '女儿'}${esc(chosen)}；${esc(announcement)}`, 'social', '✿', [mother.id, father.id, child.id]);
    remember(mother, `我们的孩子出生了。${announcement}`); remember(father, `我和${mother.name}一起给孩子取名${chosen}。`);
    recordRelationshipInteraction(mother, father, announcement, 0);
    return child;
  }
  function lifeStage(agent) {
    if (agent.age <= 2) return '婴儿期';
    if (agent.age <= 5) return '幼儿期';
    if (agent.age <= 11) return '小学阶段';
    if (agent.age <= 14) return '中学阶段';
    if (agent.age <= 17) return agent.education?.status === 'dropout' ? '辍学就业' : '高中阶段';
    if (agent.age <= 21 && agent.education?.status === 'university') return '大学阶段';
    if (agent.education?.status === 'dropout') return '辍学就业';
    return '职业阶段';
  }
  const careerTracks = [
    { role:'社区医生', job:'clinic', attrs:['intelligence','emotional'], skills:['medicine','firstAid'] },
    { role:'学校教师', job:'school', attrs:['intelligence','emotional'], skills:['teaching','childcare'] },
    { role:'软件工程师', job:'office', attrs:['intelligence','financial'], skills:['programming','logistics'] },
    { role:'商业经营者', job:'market', attrs:['financial','charisma'], skills:['negotiation','leadership'] },
    { role:'餐饮厨师', job:'restaurant', attrs:['charisma','intelligence'], skills:['cooking','logistics'] },
    { role:'农业种植师', job:'farm', attrs:['strength','intelligence'], skills:['farming','gardening'] },
    { role:'宠物护理师', job:'petshop', attrs:['emotional','charisma'], skills:['animalCare','firstAid'] },
    { role:'建筑维修师', job:'office', attrs:['strength','intelligence'], skills:['construction','repair'] },
    { role:'社区活动策划', job:'cafe', attrs:['charisma','emotional'], skills:['communication','media'] },
    { role:'物流配送员', job:'market', attrs:['speed','financial'], skills:['driving','logistics'] },
    { role:'安保人员', job:'training', attrs:['strength','speed'], skills:['security','firstAid'] },
    { role:'河岸渔业从业者', job:'fishing', attrs:['speed','emotional'], skills:['fishing','survival'] },
  ];
  function chooseCareer(agent, dropout = false) {
    const options = careerTracks.map(track => {
      const attributeScore = track.attrs.reduce((sum,key) => sum + (agent.attributes[key] || 0),0) / track.attrs.length;
      const skillScore = track.skills.reduce((sum,key) => sum + (agent.proficiencies[key] || 0),0) / track.skills.length;
      const interestScore = (agent.interests || []).reduce((sum,item) => sum + (track.skills.includes(item.key) ? item.value * 0.16 : 0),0);
      return { track, score: attributeScore + skillScore * 0.72 + interestScore + Math.random() * 2 };
    }).sort((a,b) => b.score-a.score);
    const selected = options[0]?.track || careerTracks[0];
    const entryTitle = { '社区医生':'诊所助理','学校教师':'课堂助教','软件工程师':'软件学徒','商业经营者':'门店营业员','餐饮厨师':'餐饮服务员','农业种植师':'农场帮工','宠物护理师':'宠物照护员','建筑维修师':'建筑学徒','社区活动策划':'活动助理','物流配送员':'物流配送员','安保人员':'安保学徒','河岸渔业从业者':'渔业帮工' };
    agent.role = dropout ? entryTitle[selected.role] || selected.role : selected.role;
    agent.job = selected.job; agent.specialty = selected.skills[0];
    agent.education = { ...(agent.education || {}), status: dropout ? 'dropout' : 'employed', dropout: Boolean(dropout), career: selected.role, decidedDay: state.day };
    agent.tools = getTools(agent);
    const message = dropout ? `我决定暂时离开学校，先做${agent.role}，靠工作积累经验。` : `我完成大学阶段，结合自己的兴趣和能力，成为${agent.role}。`;
    agent.currentThought = message; remember(agent,message); recordExperience(agent,message,selected.skills[0]);
    pushEvent(`${safeName(agent)}${dropout ? '选择辍学就业，开始做' : '完成学业，开始做'}${esc(agent.role)}；${attributeLabels[selected.attrs[0]] || selected.attrs[0]}与${proficiencyLabels[selected.skills[0]] || selected.skills[0]}影响了职业选择。`, 'town','✦',[agent.id]);
  }
  function enterLifeStage(agent, age) {
    const stageBoundary = [3,6,12,15,18,22].includes(age);
    if (!stageBoundary && age >= 22) return;
    const bonus = AGE_STAGE_POINTS[age] || [];
    bonus.forEach(key => improveAttribute(agent,key,3));
    if (age <= 2) { agent.role = '婴儿'; agent.job = 'home'; agent.education.status = 'enrolled'; }
    else if (age <= 5) { agent.role = '学前儿童'; agent.job = 'home'; agent.education.status = 'enrolled'; }
    else if (age <= 11) { agent.role = '小学生'; agent.job = 'school'; agent.education.status = 'enrolled'; }
    else if (age <= 14) { agent.role = '中学生'; agent.job = 'school'; agent.education.status = 'enrolled'; }
    else if (age <= 17) { agent.role = '高中生'; agent.job = 'school'; agent.education.status = 'enrolled'; }
    else if (age === 18 && agent.education.status !== 'dropout') { agent.role = '大学生'; agent.job = 'school'; agent.education.status = 'university'; }
    if (age >= 15 && age < 22 && agent.education.status !== 'dropout') {
      const goalStudies = /学|考|大学|学校|知识/.test(agent.goal || '');
      const pressure = (agent.money < 18 ? 0.09 : 0) + (agent.attributes.financial < 35 ? 0.08 : 0) + (!goalStudies ? 0.045 : 0);
      if (Math.random() < Math.min(0.28, 0.035 + pressure)) { chooseCareer(agent,true); return; }
    }
    if (!stageBoundary) return;
    if (age >= 22 && agent.education.status !== 'dropout' && agent.education.status !== 'employed') { chooseCareer(agent,false); return; }
    agent.tools = getTools(agent);
    const stage = lifeStage(agent);
    const milestone = `我进入${stage}，生活经验、兴趣和阶段练习正在塑造新的能力。`;
    agent.currentThought = milestone; remember(agent,milestone); recordExperience(agent,milestone,bonus[0] || null);
    pushEvent(`${safeName(agent)}年满 ${age} 岁，进入${stage}${bonus.length ? `，${bonus.map(key=>`${attributeLabels[key]}+1`).join('、')}` : ''}。`, 'town','✦',[agent.id]);
  }
  function processFamilyDay() {
    state.residents.filter(r => !r.deceased).forEach(r => {
      if (r.jailDays > 0) {
        r.jailDays = Math.max(0, r.jailDays - 1);
        if (r.jailDays === 0) { r.location = r.home || publicShelter()?.id || null; pushEvent(`${safeName(r)}服刑期满，从${justiceFacility('prison')?.name || '看守所'}释放。`, 'care', '▤', [r.id]); remember(r, '我的刑期结束了，准备重新回到社区生活。'); }
      }
      if (r.ageDays == null) r.ageDays = 0;
      r.ageDays += 1;
      if (r.ageDays >= AGE_DAYS_PER_YEAR) { r.ageDays = 0; r.age = Math.min(100,(r.age || 0) + 1); enterLifeStage(r,r.age); }
    });
    const waitDays = Math.max(0, Number(state.town.rules.familyWaitDays ?? 3)); const pregnancyDays = Math.max(1, Number(state.town.rules.pregnancyDays ?? 6));
    state.marriages.forEach(marriage => {
      const parents = marriage.partnerIds.map(id => state.residents.find(r => r.id === id));
      if (parents.some(r => !r || r.deceased) || (marriage.children || []).length >= 3) return;
      const activePregnancy = state.pregnancies.some(p => p.marriageId === marriage.id);
      if (!activePregnancy && marriage.lastBirthDay != null && state.day - marriage.lastBirthDay < 30) return;
      if (!activePregnancy && state.day >= marriage.day + waitDays && state.residents.length + state.pregnancies.length < state.town.rules.maxPopulation) {
        const pregnancy = { id: 'pregnancy-' + state.idCounter++, marriageId: marriage.id, parentIds: marriage.partnerIds.slice(), startedDay: state.day, dueDay: state.day + pregnancyDays, announced: false };
        state.pregnancies.push(pregnancy);
        parents.forEach(r => { r.currentThought = `我和${parents.find(p => p.id !== r.id).name}正在期待一个新生命。`; remember(r, `我们决定要孩子，预计还需要${pregnancyDays}天。`); });
        pushEvent(`${safeName(parents[0])}和${safeName(parents[1])}开始期待一个孩子，预产期大约在第 ${pregnancy.dueDay} 天。`, 'social', '✿', marriage.partnerIds);
      }
    });
    state.pregnancies = state.pregnancies.filter(pregnancy => {
      if (state.day < pregnancy.dueDay) return true;
      const marriage = state.marriages.find(m => m.id === pregnancy.marriageId); const parents = pregnancy.parentIds.map(id => state.residents.find(r => r.id === id));
      if (state.residents.length >= state.town.rules.maxPopulation) {
        if (!pregnancy.announced) { pregnancy.announced = true; pushEvent('新生儿暂时无法迁入：小镇已达到人口上限，家庭正在寻找安置办法。', 'town', '!', pregnancy.parentIds); }
        return true;
      }
      if (marriage && parents.every(Boolean)) { createChild(parents[0].gender === '女' ? parents[0] : parents[1], parents[0].gender === '男' ? parents[0] : parents[1], marriage); marriage.lastBirthDay = state.day; }
      return false;
    });
  }

  function processCivicClimate() {
    const living = state.residents.filter(agent => !agent.deceased); if (!living.length) return;
    const averageMood = living.reduce((sum, agent) => sum + agent.mood, 0) / living.length;
    const averageHealth = living.reduce((sum, agent) => sum + agent.health, 0) / living.length;
    const homeless = living.filter(agent => !agent.home).length / living.length;
    const taxLoad = Math.min(20, (state.lastMonthTaxRevenue || 0) / Math.max(1, living.length * 8));
    const pressure = clamp((52 - averageMood) * 0.9 + (55 - averageHealth) * 0.3 + homeless * 38 + taxLoad);
    state.justice.publicDiscontent = clamp((state.justice.publicDiscontent || 0) * 0.72 + pressure * 0.28);
    if (state.justice.publicDiscontent < 62 || state.day - state.justice.lastProtestDay < 4) return;
    state.justice.lastProtestDay = state.day;
    const frustrated = living.filter(agent => agent.mood < 48 || !agent.home || agent.health < 48);
    frustrated.forEach(agent => modify(agent, { anger: 7, stress: 6, mood: -2 }));
    pushEvent(`${frustrated.length} 位居民走上街头表达不满；生活水平持续下降和幸福感偏低，正在动摇镇上的信任。`, 'town', '⚑', frustrated.slice(0, 12).map(agent => agent.id));
    const office = state.residents.find(agent => !agent.deceased && agent.employmentType === 'public' && agent.publicRole);
    if (office && state.treasury >= 15) {
      state.treasury -= 15; state.foodStock += 5;
      frustrated.slice(0, 5).forEach(agent => modify(agent, { mood: 4, hunger: 3, anger: -4 }));
      remember(office, '居民对生活和幸福感表达了不满。我动用镇公所 15 元预算补充公共食物，并准备提出长期设施方案。');
      pushEvent(`${safeName(office)}从镇公所支出 15 元补充公共食物，并着手提议改善生活的设施。`, 'town', '⌂', [office.id]);
    }
    if (state.justice.publicDiscontent >= 86) {
      const extremist = frustrated.filter(agent => agent.alignment <= -35 && agent.anger >= 65).sort((a, b) => b.anger - a.anger)[0];
      const target = state.buildings.find(building => !['road','grass','plot','home'].includes(building.type));
      if (extremist && target && Math.random() < 0.24) {
        target.condition = Math.max(0, (target.condition || 94) - 12); changeMorality(extremist, -4, '在社会动荡中破坏公共设施');
        reportCrime(extremist, null, '破坏公共设施', 2, `在抗议中破坏${buildingName(target)}`);
        pushEvent(`${safeName(extremist)}在抗议升级时砸坏了${esc(buildingName(target))}，不满转成了暴力冲突。`, 'care', '⚡', [extremist.id]);
      }
    }
  }

  function sharePhoneMessage() {
    const likelyCallers = state.residents.filter(r => !r.deceased).sort((a, b) => (b.skills.social + b.attributes.charisma / 10) - (a.skills.social + a.attributes.charisma / 10));
    const caller = likelyCallers[roll(0, Math.min(3, likelyCallers.length - 1))];
    if (!caller || Math.random() > 0.18 + caller.attributes.emotional / 220) return;
    const contacts = state.residents.filter(r => r.id !== caller.id && !r.deceased).sort((a, b) => (caller.relationships[b.id] || 0) - (caller.relationships[a.id] || 0));
    const target = (caller.relationships[contacts[0]?.id] || 0) > 0 ? contacts[0] : contacts[roll(0, contacts.length - 1)];
    if (!target) return;
    const recent = state.events.find(event => event.involved?.some(id => id !== caller.id) && !event.message.includes('打电话'));
    const topic = recent ? stripMarkup(recent.message) : '最近的工作和生活都还顺利吗？';
    remember(caller, `给${target.name}打电话，聊到：${topic}`, '电话', 0.67);
    remember(target, `${caller.name}来电，聊到：${topic}`, '电话', 0.67);
    caller.relationships[target.id] = (caller.relationships[target.id] || 0) + 2; target.relationships[caller.id] = (target.relationships[caller.id] || 0) + 2;
    recordRelationshipInteraction(caller, target, `${caller.name}给${target.name}打电话，交换了小镇近况。`, 2);
    pushEvent(`${safeName(caller)}打电话给${safeName(target)}，聊起镇上的近况。`, 'social', '☎', [caller.id, target.id]);
  }

  function broadcastTelevision() {
    const viewers = state.residents.filter(agent => {
      const place = buildingById(agent.location); return !agent.deceased && place && ['home', 'cafe'].includes(place.type);
    });
    const headline = state.events.find(event => event.involved?.length && !event.message.includes('电视台'));
    const bulletin = headline ? stripMarkup(headline.message) : state.outside.description;
    viewers.forEach(agent => remember(agent, `晚间新闻：${bulletin}`, '电视', 0.93));
    pushEvent(`榆灯台播报晚间新闻：${esc(bulletin)}`, 'town', '▣', viewers.map(agent => agent.id));
  }

  function updateOutsideWorld() {
    state.outsideIndex = (state.day - 1) % outsideUpdates.length;
    state.outside = { ...outsideUpdates[state.outsideIndex] };
    pushEvent(`镇外消息：${esc(state.outside.headline)}。${esc(state.outside.description)}`, 'town', '↗');
    applyOutsideImpact();
  }

  async function advanceTurn() {
    if (turnInProgress) return;
    turnInProgress = true;
    $('#advanceButton').disabled = true;
    if (state.aiRuntimeEnabled) $('#backendStatusLabel').textContent = 'AI 正在为居民规划本轮行动…';
    try {
    const snapshot = { buildings: state.buildings.map(b => ({ ...b })), turn: state.turn, period: state.period };
    const activeAgents = state.residents.filter(agent => !agent.deceased);
    const plans = await planWithAI(activeAgents, snapshot);
    const construction = choosePublicBuilder(state.approvedBuild);
    if (construction) {
      const plan = plans.find(item => item.id === construction.agent.id);
      if (plan) {
        plan.action = { kind: 'build', publicApproval: true, facility: construction.type, plot: construction.plot, rotation: construction.rotation || 0, reason: construction.reason, proposer: construction.proposer, destination: construction.agent.home, placeLabel: `新建设施地块（${construction.plot.x + 1}列 · ${construction.plot.y + 1}行）` };
        plan.action.thought = composeThought(construction.agent, plan.action);
      }
    } else if (!state.approvedBuild) {
      const investment = choosePersonalInvestmentPlan();
      if (investment) {
        const plan = plans.find(item => item.id === investment.agent.id);
        if (plan) { plan.action = { ...investment.action, destination: investment.agent.home }; plan.action.thought = composeThought(investment.agent, plan.action); }
      }
    }
    plans.sort((a, b) => Number(b.action.kind === 'procure') - Number(a.action.kind === 'procure'));
    plans.forEach(plan => { const agent = state.residents.find(r => r.id === plan.id); if (agent) resolveAction(agent, plan.action); });
    resolveSocialGroups();
    progressJustice();
    considerMarriage();
    considerDivorce();
    sharePhoneMessage();
    if (state.period === 3) broadcastTelevision();
    if (!state.publicProposal && !state.approvedBuild) maybeStartPublicProposal();
    castPublicVotes();
    state.turn += 1; state.period += 1;
    state.residents.forEach(r => { if (r.directive && r.directive.until <= state.turn) r.directive = null; });
    if (state.period >= periods.length) { state.period = 0; state.day += 1; processFamilyDay(); harvestMatureCrops(); pushEvent(`新的一天开始了。榆树叶在晨光里轻轻摇晃。`, 'town', '☀'); updateOutsideWorld(); processHealthDay(); if ((state.day - 1) % 30 === 0) processMonthlyEconomy(); processCivicClimate(); }
    render();
    } catch (error) {
      toast(`本轮未能完成，时间没有推进：${error?.message || '发生未知错误'}`);
    } finally {
      turnInProgress = false;
      $('#advanceButton').disabled = false;
    }
  }

  function nudge(id, kind) {
    const agent = state.residents.find(r => r.id === id); if (!agent) return;
    const settings = { social: ['social', '多和街坊聊聊'], work: ['work', '为自己的目标努力'], rest: ['rest', '留些时间照顾自己'] };
    const [directive, label] = settings[kind]; agent.directive = { kind: directive, label, until: state.turn + 3 };
    remember(agent, `你建议我${label}，我会试着听进去。`);
    pushEvent(`你悄悄提醒${safeName(agent)}${label}。TA点了点头，打算试试看。`, 'town', '✦', [agent.id]);
    render(); toast(`已把建议告诉 ${agent.name}，接下来 3 轮会留意这件事。`);
  }

  function makeSystemPrompt(agent) {
    const attributes = Object.entries(attributeLabels).map(([key, label]) => `${label} ${limitStat(agent.attributes[key])}`).join('、');
    const proficiencies = Object.entries(proficiencyLabels).map(([key, label]) => `${label} ${limitStat(agent.proficiencies[key])}`).join('、');
    const memorySummary = [agent.compressedMemory ? `压缩的早期记忆：${agent.compressedMemory}` : '', ...agent.memory.slice(0, 6).map(memory => `[${memory.source}] ${memory.text}`)].filter(Boolean).join('；') || '还没有特别的记忆。';
    const lifeStory = agent.background?.story || '';
    const educationContext = `生命阶段：${agent.age} 岁 · ${lifeStage(agent)} · ${agent.education?.status === 'dropout' ? '曾经辍学，正在工作积累阅历' : agent.education?.status === 'university' ? '大学在读，可继续学习，也可能自行辍学就业' : agent.age < 22 ? '在成长与学习阶段' : '已进入职业阶段'}。婴幼儿、幼儿、小学、中学、大学阶段会随时间快速推进；角色可在大学前后因现实压力选择辍学就业，职业会结合属性、熟练度、兴趣和阅历重新确定。`;
    const specificGoal = agent.goalTarget ? `当前具体目标：${agent.goalTarget.label}（状态：${agent.goalTarget.status}）。目标被其他人占有会显著降低你的好感并激起愤怒；你可能选择协商、等待或违法报复。` : '';
    const base = `你是${agent.name}，${agent.role}。你的性格是${agent.trait}，长期目标是「${agent.goal}」。${specificGoal}你的道德值为 ${agent.alignment}，会随帮助、欺诈、威胁、殴打、谋杀、破坏和借贷行为变化，并影响你在公共投票、邻里互助和个人利益间的选择。${agent.specialty ? `你的突出优势是${attributeLabels[agent.specialty] || proficiencyLabels[agent.specialty] || agent.specialty}。` : ''}\n\n${educationContext}\n成长背景：${lifeStory}\n你珍视的原则：${agent.background?.values || agent.trait}。心底愿望：${agent.background?.privateWish || '在榆灯镇过上踏实、有联系的生活。'}\n基础属性（0—100）：${attributes}。行动积累成长值，达到门槛后属性会提升整数点；人生阶段转折也会带来阶段性成长。\n熟练度（0—100）：${proficiencies}。\n日常能力：照护 ${agent.skills.care}/10、社交 ${agent.skills.social}/10、手艺 ${agent.skills.craft}/10、知识 ${agent.skills.knowledge}/10。\n经济状况：可花余额 ${agent.money} 元；借出未还 ${receivableBalance(agent.id)} 元；欠款 ${debtBalance(agent.id)} 元；梦想储蓄 ${agent.dreamFund || 0} 元。当前梦想是「${agent.dream?.title || '尚未确定'}」，需要 ${agent.dream?.targetCost || 0} 元。欠款会按约定月利率计息；资产记录必须区分可用余额、债权和负债。钱不够时不能消费，可以请求居民自愿借款；对方拒绝后要承担实际的生活后果，不能假设父母必然资助。\n职业与雇主：${agent.role} · ${agent.employmentType === 'public' ? '公职 / 公共服务岗位，工资从镇公所预算支付' : '私人岗位，工资由店铺或雇主经营资金支付'}；岗位报酬会依赖你的属性、熟练度、工作场所等级和雇主资金。${agent.unpaidWages ? `目前另有 ${agent.unpaidWages} 元未付工资。` : ''}\n小镇边界：最多 ${state.town.rules.maxPopulation} 位居民、${state.town.rules.maxBuildings} 座建筑；镇上食物库存 ${Math.floor(state.foodStock)} 份。工资以人民币结算并缴纳 10% 工资税；每 30 天缴一次房租。工资会按你的职业相关属性、熟练度和工作建筑等级浮动；升级设施会扩大占地并提升服务能力。基础月租随镇上上月税收缓慢上调，最高为基础租金的 1.75 倍。你可以申请公租房，也可以攒钱买地、建私宅、定基础租金出租、开店、开分店或加盟；公共设施必须获得超过三分之二居民赞成后，才能使用镇公所预算施工。公职人员负责提出公共建设并说明预算。无力交租时会失去住房，暂住在公园、广场等公共设施，健康和心情会逐日下降。饱腹降到 0 后健康会额外恶化；健康降到 0 就会死亡，状态数值不能低于 0。\n违法行为可能被邻居目击，经过警务调查、检察审查和法院审判后会被判罚、赔偿或监禁；治安机构缺失会降低破案能力。长期生活水平下降或幸福度偏低会引发抗议，极端情况下会升级成破坏和冲突。\n你需要按时用餐并支付餐费，也可以通过种植、经营餐厅或从${state.environment.regionName}采购来维持供给。你会优先照顾健康、精力、饥饿与社交需求；根据目标选择工作、学习、休息、借贷、还款、投资、投票或与人交往。你能观察附近居民的身体状态和能力，按需帮助、回想旧经历，也会将记忆压缩成近期摘要；完整经历和行动日志保存在历史档案里。注意信息来源与可信度。能力与熟练度会通过对应实践逐渐成长。你只能使用当前可用的行动工具，并尊重小镇的资源和设施规则。\n当前想法：${agent.currentThought}\n近期记忆：${memorySummary}`;
    const custom = agent.customPrompt?.trim();
    return custom ? `${base}\n\n玩家补充的角色原则：\n${custom}` : base;
  }
  function showPrompt(agent) {
    openModal('AGENT RUNTIME', `${agent.name} 的角色设定`, '这是本原型为该角色生成的系统提示词和当前可用工具。', `<div class="prompt-box">${esc(makeSystemPrompt(agent))}</div><div class="tool-pills">${agent.tools.map(tool => `<span>${esc(tool)}</span>`).join('')}</div><button class="modal-submit" id="promptDone">返回小镇</button>`);
    $('#promptDone').addEventListener('click', closeModal);
  }
  function showRelationships(agent) {
    const links = Object.entries(agent.relationships || {}).map(([id, score]) => ({ other: state.residents.find(r => r.id === id), score: Number(score) || 0 })).filter(item => item.other).sort((a, b) => b.score - a.score);
    const relationRows = links.length ? links.map(item => '<article class="journal-entry"><header><b>' + esc(item.other.name) + '</b><small>' + relationshipLabel(item.score) + ' · 关系值 ' + Math.round(item.score) + '</small></header><div class="relationship-meter"><i style="width:' + Math.min(100, Math.abs(item.score)) + '%;background:' + (item.score < 0 ? '#bd7c78' : '#83a986') + '"></i></div></article>').join('') : '<div class="event-empty">还没有明显的人际关系。居民相遇、合作或发生冲突后，这里会逐渐形成关系网。</div>';
    const interactions = (state.relationshipEvents || []).filter(entry => entry.a === agent.id || entry.b === agent.id).slice(0, 12);
    const interactionRows = interactions.length ? interactions.map(entry => {
      const otherId = entry.a === agent.id ? entry.b : entry.a;
      const other = state.residents.find(r => r.id === otherId);
      return '<article class="journal-entry"><header><span class="journal-date">第 ' + entry.day + ' 天 · ' + esc(periods[entry.period]?.name || '早晨') + '</span><b>' + esc(other?.name || '居民') + '</b><small>' + (entry.delta > 0 ? '+' : '') + entry.delta + '</small></header><p>' + esc(entry.text) + '</p></article>';
    }).join('') : '<div class="event-empty">暂时没有记录到直接互动。</div>';
    openModal('SOCIAL NETWORK', agent.name + ' 的关系网', '好感会因交谈、互助和冲突变化；近期互动会留在这里。', '<div class="profile-section-title"><span>关系</span><small>' + links.length + ' 位居民</small></div><div class="journal-list">' + relationRows + '</div><div class="profile-section-title"><span>互动记录</span><small>最近 12 条</small></div><div class="journal-list">' + interactionRows + '</div><button class="modal-submit" id="relationsDone">返回小镇</button>');
    $('#relationsDone').addEventListener('click', closeModal);
  }

  function showMemories(agent) {
    const sourceDescription = '亲历：直接经历 · 附近九宫格：相邻一格内观察到 · 电话：居民联络 · 电视：本地晚间新闻';
    const rows = agent.memory.length ? agent.memory.slice(0, 14).map(memory => `<article class="memory-entry"><div><b>${esc(memory.source || '亲历')}</b><small>第 ${memory.day || state.day} 天 · ${periods[memory.period || 0]?.name || '早晨'} · 可信度 ${Math.round((memory.confidence ?? 1) * 100)}%</small></div><p>${esc(memory.text)}</p></article>`).join('') : '<div class="event-empty">还没有记忆。推进几轮，小镇的消息会从不同渠道传来。</div>';
    const active = new Set((agent.memory || []).map(memory => memory.id).filter(Boolean));
    const old = (agent.memoryArchive || []).find(memory => memory.id && !active.has(memory.id));
    openModal('PERCEPTION & MEMORY', `${agent.name} 的记忆`, `${sourceDescription}。当前记忆会压缩整理；完整经历和行动日志仍保存在历史档案中。`, `<div class="memory-list">${rows}</div>${old ? `<button class="modal-submit secondary-submit" id="recallMemoryButton">主动回想较早的经历 · 回想熟练度 ${agent.proficiencies.recall || 0}</button>` : `<p class="plot-hint">目前没有超出当前记忆范围的旧经历。</p>`}<button class="modal-submit" id="memoryDone">返回小镇</button>`);
    $('#recallMemoryButton')?.addEventListener('click', () => { recallPastMemory(agent, old.id); closeModal(); render(); toast(`${agent.name}回想起一段旧经历。`); });
    $('#memoryDone').addEventListener('click', closeModal);
  }
  function recallPastMemory(agent, memoryId = null) {
    const recent = new Set((agent.memory || []).map(memory => memory.id).filter(Boolean));
    const memory = (agent.memoryArchive || []).find(entry => memoryId ? entry.id === memoryId : entry.id && !recent.has(entry.id));
    if (!memory) return false;
    remember(agent, `我主动想起了第 ${memory.day || 1} 天的经历：${memory.text}`, '主动回想', 0.94);
    improveProficiency(agent, 'recall', 1.2); modify(agent, { mood: 2, stress: -2 });
    agent.currentThought = `我重新想起了以前的事：${memory.text}。那段经历仍然影响着我现在的选择。`;
    pushEvent(`${safeName(agent)}通过回想找回一段较早的经历。`, 'social', '◷', [agent.id]);
    return true;
  }
  function openFamilyAssetsModal(agent) {
    const summary = familyAssetSummary(agent); const spouse = state.residents.find(person => person.id === agent.spouseId && !person.deceased);
    const memberRows = summary.members.map(person => {
      let relation = '家庭成员';
      if (person.id === agent.id) relation = '当前居民';
      else if (person.id === spouse?.id) relation = '配偶';
      else if ((agent.parents || []).includes(person.id)) relation = person.gender === '男' ? '父亲' : '母亲';
      else if (person.parents?.includes(agent.id) || person.parents?.includes(spouse?.id)) relation = `${person.age < 18 ? '未成年子女' : '子女'}${person.custodyParentId ? ` · 由${esc(state.residents.find(parent => parent.id === person.custodyParentId)?.name || '一方家长')}照料` : ''}`;
      else if (agent.age < 18 && (person.parents || []).some(id => (agent.parents || []).includes(id))) relation = '兄弟姐妹';
      return `<article class="journal-entry"><header><b>${esc(person.name)}</b><small>${esc(person.role)} · ${person.money || 0} 元可用</small></header><p>${relation}</p></article>`;
    }).join('');
    const buildingRows = summary.buildings.map(building => `<article class="journal-entry"><header><b>${esc(building.name || buildingName(building))}</b><small>${esc(facilityTypes[building.type]?.name || '私人地块')} · 估值 ${assetValue(building)} 元</small></header><p>登记所有人：${esc(state.residents.find(person => person.id === building.ownerId)?.name || '已离世居民')} · ${building.type === 'plot' ? '土地' : `第 ${levelOf(building)} 级`}</p></article>`);
    const businessRows = summary.businesses.map(business => `<article class="journal-entry"><header><b>${esc(business.brand)}</b><small>店铺品牌与经营资金 · 估值 ${businessAssetValue(business)} 元</small></header><p>品牌所有人：${esc(state.residents.find(person => person.id === business.ownerId)?.name || '已离世居民')} · ${business.branches?.length || 0} 家分店</p></article>`);
    const propertyRows = [...buildingRows, ...businessRows].join('') || '<div class="event-empty">家庭名下还没有登记的私人房产或店铺。</div>';
    const loans = state.loans.filter(loan => loan.balance > 0 && (summary.members.some(person => person.id === loan.lenderId) || summary.members.some(person => person.id === loan.borrowerId)));
    const loanRows = loans.slice(0, 20).map(loan => `<article class="journal-entry"><header><b>${loan.type === 'divorce-settlement' ? '离婚财产平分结算' : '家庭成员借贷'}</b><small>${loan.balance} 元未结清</small></header><p>${esc(state.residents.find(person => person.id === loan.borrowerId)?.name || '借款人')}欠${esc(state.residents.find(person => person.id === loan.lenderId)?.name || '出借人')}</p></article>`).join('') || '<div class="event-empty">家庭成员之间没有未结清的借款。</div>';
    const divorceButton = spouse ? `<button class="modal-submit secondary-submit" id="divorceButton">查看离婚与财产分割方案</button>` : '';
    openModal('FAMILY HOUSEHOLD', `${agent.name} 的家庭资产`, '婚姻与孩子构成家庭。这里合并展示家庭成员的现金、外部债权、负债及登记在家庭成员名下的房产和店铺；婚姻存续期间各自余额仍分别记账。', `<div class="building-facts"><div><small>家庭可用现金</small><b>${summary.cash} 元</b></div><div><small>房产与店铺估值</small><b>${summary.propertyValue} 元</b></div><div><small>对外未收债权</small><b>${summary.receivables} 元</b></div><div><small>对外未还欠款</small><b>${summary.debts} 元</b></div><div><small>家庭净资产估算</small><b>${summary.netWorth} 元</b></div></div><div class="profile-section-title"><span>家庭成员</span><small>${summary.members.length} 人</small></div><div class="journal-list">${memberRows}</div><div class="profile-section-title"><span>家庭名下财产</span><small>按登记人统计估值</small></div><div class="journal-list">${propertyRows}</div><div class="profile-section-title"><span>家庭借贷往来</span><small>最近 ${Math.min(20, loans.length)} 笔 · 共 ${loans.length} 笔</small></div><div class="journal-list">${loanRows}</div>${divorceButton}<button class="modal-submit" id="familyAssetsDone">返回居民档案</button>`);
    $('#divorceButton')?.addEventListener('click', () => {
      const partner = state.residents.find(person => person.id === agent.spouseId); if (!partner) return;
      const plan = divorceAssetPlan(agent, partner);
      const children = state.residents.filter(child => child.parents?.includes(agent.id) && child.parents?.includes(partner.id) && !child.deceased);
      const previews = children.map(child => {
        const guardian = custodyScore(child, agent) >= custodyScore(child, partner) ? agent : partner;
        return `${child.name}（${child.age} 岁）会根据自己的依恋、安全感和年龄表达的意愿，选择跟${guardian.name}生活`;
      });
      const assetRows = plan.allocations.map(({ kind, asset, value, ownerId }) => {
        const label = kind === 'business' ? `店铺品牌 · ${asset.brand}` : asset.name || buildingName(asset);
        const owner = state.residents.find(person => person.id === ownerId);
        return `<article class="journal-entry"><header><b>${esc(label)}</b><small>估值 ${value} 元</small></header><p>分配给 ${esc(owner?.name || '另一方')}</p></article>`;
      }).join('') || '<div class="event-empty">双方没有登记在个人名下的私人房产或店铺。</div>';
      const richer = state.residents.find(person => person.id === plan.richerId);
      const poorer = state.residents.find(person => person.id === plan.poorerId);
      const settlementNote = plan.settlement >= 1
        ? `<article class="journal-entry"><p>按当前估值，${esc(richer?.name || '资产较多的一方')}将欠${esc(poorer?.name || '另一方')} ${plan.settlement} 元无息平分结算款。</p></article>`
        : '<article class="journal-entry"><p>现金与财产估值接近平分，无需结算（整数金额最多相差 1 元）。</p></article>';
      openModal('DIVORCE & CUSTODY', `与${partner.name}离婚`, '离婚会解除婚姻关系；双方现金平分，私有房产、地块和店铺品牌按估值分配，资产分配尽量平衡双方总值，差额以无息结算债权平衡。孩子根据依恋、照料、安全感和年龄表达的意愿选择主要生活的家长，另一方仍保留亲子关系。', `<div class="building-facts"><div><small>双方可分割现金</small><b>${plan.cashPool} 元</b></div><div><small>每方现金</small><b>${plan.cashA} / ${plan.cashB} 元</b></div><div><small>分割后估值</small><b>${plan.totals[agent.id]} / ${plan.totals[partner.id]} 元</b></div></div><div class="profile-section-title"><span>房产与店铺分配预览</span><small>按当前估值</small></div><div class="journal-list">${assetRows}${settlementNote}</div><div class="profile-section-title"><span>孩子的主要照料安排</span><small>${children.length} 人</small></div><div class="journal-list">${previews.length ? previews.map(text => `<article class="journal-entry"><p>${esc(text)}</p></article>`).join('') : '<div class="event-empty">没有需要决定抚养归属的未成年子女。</div>'}</div><button class="modal-submit" id="confirmDivorceButton">确认离婚并平分财产</button><button class="modal-submit secondary-submit" id="cancelDivorceButton">返回家庭资产</button>`);
      $('#confirmDivorceButton').addEventListener('click', () => { divorceCouple(agent, partner, agent.id); closeModal(); render(); toast('离婚已办理，家庭资产已按平分原则结算。'); });
      $('#cancelDivorceButton').addEventListener('click', () => openFamilyAssetsModal(agent));
    });
    $('#familyAssetsDone').addEventListener('click', closeModal);
  }
  function openFinanceModal(agent) {
    const loans = state.loans.filter(loan => loan.lenderId === agent.id || loan.borrowerId === agent.id);
    const rows = loans.length ? loans.slice(0, 35).map(loan => {
      const lender = state.residents.find(r => r.id === loan.lenderId); const borrower = state.residents.find(r => r.id === loan.borrowerId);
      const isBorrower = loan.borrowerId === agent.id;
      return `<article class="journal-entry loan-entry"><header><span class="journal-date">第 ${loan.createdDay} 天 · ${(loan.monthlyRate * 100).toFixed(1)}% / 月</span><b>${isBorrower ? `借自 ${esc(lender?.name || '居民')}` : `借给 ${esc(borrower?.name || '居民')}`}</b><small>${loan.status === 'repaid' ? '已还清' : `余额 ${loan.balance} 元`}</small></header><p>${esc(loan.reason || '居民之间的自愿借款')} · 本金 ${loan.principal} 元${loan.repayments?.length ? ` · 已还 ${loan.repayments.reduce((sum, item) => sum + item.amount, 0)} 元` : ''}</p>${isBorrower && loan.balance > 0 ? `<button class="text-button" data-repay-loan="${esc(loan.id)}" ${agent.money <= 0 ? 'disabled' : ''}>偿还最多 ${Math.min(agent.money, loan.balance)} 元</button>` : ''}</article>`;
    }).join('') : '<div class="event-empty">暂无借贷记录。借款需要出借居民明确同意；约定利息按月计入欠款。</div>';
    const lenders = state.residents.filter(other => other.id !== agent.id && !other.deceased && other.money >= 5);
    const borrowers = state.residents.filter(other => other.id !== agent.id && !other.deceased);
    openModal('PERSONAL FINANCE', `${agent.name} 的资产与借贷`, '余额是现在可以花的钱；借出未还款是债权；欠款是需要偿还的本金与利息。梦想储蓄单独保留。', `<div class="building-facts"><div><small>可用余额</small><b>${agent.money} 元</b></div><div><small>借出未还</small><b>${receivableBalance(agent.id)} 元</b></div><div><small>欠款</small><b>${debtBalance(agent.id)} 元</b></div><div><small>梦想储蓄</small><b>${agent.dreamFund || 0} 元</b></div></div><div class="profile-section-title"><span>借款记录</span><small>${loans.length} 笔</small></div><div class="journal-list">${rows}</div><div class="profile-section-title"><span>申请借款</span><small>由出借人自行决定</small></div><form id="loanRequestForm" class="form-grid loan-form"><div class="form-field"><label>向谁借</label><select name="lender" required>${lenders.map(other => `<option value="${esc(other.id)}">${esc(other.name)} · 余额 ${other.money} 元</option>`).join('')}</select></div><div class="form-field"><label>金额（元）</label><input name="amount" type="number" min="1" max="500" value="20" required></div><div class="form-field"><label>月利率</label><input name="rate" type="number" min="0" max="0.2" step="0.01" value="0.03" required></div><button class="modal-submit" type="submit" ${lenders.length ? '' : 'disabled'}>提出借款请求</button></form><div class="profile-section-title"><span>主动借给别人</span><small>对方也可以拒绝</small></div><form id="loanOfferForm" class="form-grid loan-form"><div class="form-field"><label>借给谁</label><select name="borrower" required>${borrowers.map(other => `<option value="${esc(other.id)}">${esc(other.name)} · 道德值 ${other.alignment}</option>`).join('')}</select></div><div class="form-field"><label>金额（元）</label><input name="amount" type="number" min="1" max="500" value="20" required></div><div class="form-field"><label>月利率</label><input name="rate" type="number" min="0" max="0.2" step="0.01" value="0.03" required></div><button class="modal-submit secondary-submit" type="submit" ${borrowers.length && agent.money > 0 ? '' : 'disabled'}>自愿提出借款</button></form><button class="modal-submit" id="financeDone">返回居民档案</button>`);
    $('#loanRequestForm')?.addEventListener('submit', event => {
      event.preventDefault(); const data = new FormData(event.currentTarget); const lender = state.residents.find(other => other.id === data.get('lender')); const amount = Math.max(1, Math.floor(Number(data.get('amount')) || 0)); const rate = Math.max(0, Math.min(0.2, Number(data.get('rate')) || 0));
      requestLoan(agent, lender, amount, rate, '居民主动提出的周转借款'); closeModal(); render();
    });
    $('#loanOfferForm')?.addEventListener('submit', event => {
      event.preventDefault(); const data = new FormData(event.currentTarget); const borrower = state.residents.find(other => other.id === data.get('borrower')); const amount = Math.max(1, Math.floor(Number(data.get('amount')) || 0)); const rate = Math.max(0, Math.min(0.2, Number(data.get('rate')) || 0));
      if (borrower && amount <= agent.money && willingnessToLend(agent, borrower, amount, rate)) createLoan(agent, borrower, amount, rate, '居民自愿提出的借款');
      else if (borrower) { remember(agent, `我考虑过借给${borrower.name} ${amount} 元，但决定保留自己的余额。`); remember(borrower, `${agent.name}考虑后没有答应借给我钱。`); pushEvent(`${safeName(agent)}考虑后没有答应借给${safeName(borrower)}借款。`, 'social', '↔', [agent.id, borrower.id]); }
      closeModal(); render();
    });
    modalContent.querySelectorAll('[data-repay-loan]').forEach(button => button.addEventListener('click', () => {
      const loan = state.loans.find(item => item.id === button.dataset.repayLoan); if (loan) repayLoan(loan, agent, Math.min(loan.balance, agent.money));
      closeModal(); render();
    }));
    $('#financeDone').addEventListener('click', closeModal);
  }
  function showHistory(page = 0) {
    const history = state.logArchive || state.events;
    const start = page * 120;
    const rows = history.slice(start, start + 120).map(event => `<article class="event-item"><span class="event-icon ${esc(event.type || 'town')}">${esc(event.icon || '✳')}</span><div><div class="event-copy">${event.message}</div><div class="event-time">${timeStamp(event)}</div></div></article>`).join('') || '<div class="event-empty">小镇还没有历史事件。</div>';
    const controls = history.length > 120 ? `<div class="history-pager"><button type="button" id="historyNewer" ${page <= 0 ? 'disabled' : ''}>更新的记录</button><span>${start + 1}–${Math.min(start + 120, history.length)} / ${history.length}</span><button type="button" id="historyOlder" ${start + 120 >= history.length ? 'disabled' : ''}>更早的记录</button></div>` : '';
    openModal('TOWN ARCHIVE', `小镇历史 · ${history.length} 条`, '完整事件档案按时间倒序保存在存档中。', `<div class="journal-list history-list">${rows}</div>${controls}<button class="modal-submit" id="historyDone">返回小镇</button>`);
    $('#historyNewer')?.addEventListener('click', () => showHistory(page - 1));
    $('#historyOlder')?.addEventListener('click', () => showHistory(page + 1));
    $('#historyDone').addEventListener('click', closeModal);
  }
  function showJournal(agent, page = 0) {
    const emptyMessage = state.turn > 0
      ? '这个存档此前没有逐人行动日志，因此旧行动和当时的想法无法还原。<br/>从现在开始，每轮都会自动记录。'
      : '还没有行动记录。<br/>推进一轮后，这里会留下 TA 做过的事和当时的想法。';
    const start = page * 18;
    const rows = agent.journal.length ? agent.journal.slice(start, start + 18).map(entry => `<article class="journal-entry"><header><span class="journal-date">第 ${entry.day} 天 · ${periods[entry.period]?.name || '早晨'}</span><b>${esc(entry.action)}</b><small>${esc(entry.place)}</small></header><blockquote>“${esc(entry.thought)}”</blockquote><p>${esc(entry.result)}</p></article>`).join('') : `<div class="event-empty">${emptyMessage}</div>`;
    const pageControls = agent.journal.length > 18 ? `<div class="history-pager"><button type="button" id="journalNewer" ${page <= 0 ? 'disabled' : ''}>更新的记录</button><span>${start + 1}–${Math.min(start + 18, agent.journal.length)} / ${agent.journal.length}</span><button type="button" id="journalOlder" ${start + 18 >= agent.journal.length ? 'disabled' : ''}>更早的记录</button></div>` : '';
    openModal('PERSONAL JOURNAL', `${agent.name} 的行动日志`, '每轮行动、所在地点、行动结果和当时的想法都会保存在历史档案中。', `<div class="journal-list">${rows}</div>${pageControls}<button class="modal-submit" id="journalDone">返回小镇</button>`);
    $('#journalNewer')?.addEventListener('click', () => showJournal(agent, page - 1));
    $('#journalOlder')?.addEventListener('click', () => showJournal(agent, page + 1));
    $('#journalDone').addEventListener('click', closeModal);
  }
  function showBackground(agent) {
    const background = agent.background || createBackground(agent.role, agent.goal, agent.trait);
    openModal('LIFE STORY', `${agent.name} 的人物背景`, `${agent.role} · ${agent.trait}`, `<div class="background-story"><section><small>成长经历</small><p>${esc(background.story)}</p></section><section><small>重要转折</small><p>${esc(background.turningPoint)}</p></section><section><small>心底愿望</small><p>${esc(background.privateWish)}</p></section><section><small>珍视的原则</small><p>${esc(background.values)}</p></section><section class="background-goal"><small>长期目标</small><p>${esc(agent.goal)}</p></section></div><button class="modal-submit" id="backgroundDone">回到居民档案</button>`);
    $('#backgroundDone').addEventListener('click', closeModal);
  }

  function openResidentEditor(agent) {
    const jobOptions = ['office','school','clinic','market','cafe','restaurant','farm','petshop','training','fishing','park','townhall','police','prosecutor','courthouse','prison'];
    const currentJob = (buildingById(agent.job) || buildingByType(agent.job))?.type || agent.job;
    const educationEditor = agent.age >= 15 && agent.age <= 21 ? `<div class="form-field"><label for="editEducation">当前学业阶段</label><select id="editEducation" name="education"><option value="enrolled" ${agent.education?.status === 'enrolled' ? 'selected' : ''}>继续在读</option>${agent.age >= 18 ? `<option value="university" ${agent.education?.status === 'university' ? 'selected' : ''}>大学在读</option>` : ''}<option value="dropout" ${agent.education?.status === 'dropout' ? 'selected' : ''}>辍学就业</option></select></div>` : '';
    const attributes = Object.entries(attributeLabels).map(([key,label]) => `<div class="form-field"><label for="editAttr_${key}">${label}（当前 ${limitStat(agent.attributes[key])}）</label><input id="editAttr_${key}" name="attr_${key}" type="number" min="0" max="100" step="1" value="${limitStat(agent.attributes[key])}" /></div>`).join('');
    const proficiencies = Object.entries(proficiencyLabels).map(([key,label]) => `<div class="form-field"><label for="editProf_${key}">${label}</label><input id="editProf_${key}" name="prof_${key}" type="number" min="0" max="100" step="1" value="${limitStat(agent.proficiencies[key])}" /></div>`).join('');
    const specialtyOptions = [...Object.entries(attributeLabels),...Object.entries(proficiencyLabels)];
    openModal('RESIDENT SETTINGS', `编辑 ${agent.name} 的属性与设定`, '保存后居民档案、行动偏好、可用工具和重新生成的系统提示词会立即反映更新。', `<form id="residentEditForm" class="resident-editor">
      <div class="form-grid"><div class="form-field"><label>姓名</label><input name="name" maxlength="16" value="${esc(agent.name)}" required></div><div class="form-field"><label>职业 / 身份</label><input name="role" maxlength="24" value="${esc(agent.role)}" required></div><div class="form-field full"><label>长期目标</label><input name="goal" maxlength="64" value="${esc(agent.goal)}" required></div><div class="form-field"><label>MBTI（主要性格）</label><select name="mbti">${Object.keys(mbtiTraits).map(type=>`<option value="${type}" ${type===agent.mbti?'selected':''}>${type} · ${mbtiTraits[type]}</option>`).join('')}</select></div><div class="form-field"><label>星座（轻微倾向）</label><select name="zodiac">${zodiacNames.map(name=>`<option value="${name}" ${name===agent.zodiac?'selected':''}>${name}</option>`).join('')}</select></div><div class="form-field"><label>性格关键词</label><input name="personality" maxlength="60" value="${esc(agent.personality || extractPersonality(agent.trait))}"></div><div class="form-field"><label>善恶倾向 / 道德值</label><input name="alignment" type="number" min="-100" max="100" value="${agent.alignment}"></div><div class="form-field"><label>工作设施</label><select name="job">${jobOptions.map(type=>`<option value="${type}" ${type===currentJob?'selected':''}>${facilityLevelName(type,levelOf(buildingByType(type)||{type,level:1}))}</option>`).join('')}</select></div><div class="form-field"><label>雇佣性质</label><select name="employmentType"><option value="private" ${agent.employmentType!=='public'?'selected':''}>私人雇员 / 经营者</option><option value="public" ${agent.employmentType==='public'?'selected':''}>公职 / 公共服务（镇公所预算）</option></select></div><div class="form-field"><label>突出优势</label><select name="specialty">${specialtyOptions.map(([key,label])=>`<option value="${key}" ${key===agent.specialty?'selected':''}>${label}</option>`).join('')}</select></div>${educationEditor}</div>
      <div class="profile-section-title"><span>基础属性</span><small>保存时直接更新</small></div><div class="form-grid resident-attribute-editor">${attributes}</div>
      <details class="resident-editor-details"><summary>编辑全部职业与爱好熟练度（${Object.keys(proficiencyLabels).length} 项）</summary><div class="form-grid resident-skill-editor">${proficiencies}</div></details>
      <details class="resident-editor-details"><summary>背景、愿望和自定义原则</summary><div class="form-grid"><div class="form-field full"><label>成长经历</label><textarea name="story">${esc(agent.background?.story || '')}</textarea></div><div class="form-field full"><label>重要转折</label><textarea name="turningPoint">${esc(agent.background?.turningPoint || '')}</textarea></div><div class="form-field full"><label>心底愿望</label><textarea name="privateWish">${esc(agent.background?.privateWish || '')}</textarea></div><div class="form-field full"><label>珍视的原则</label><textarea name="values">${esc(agent.background?.values || '')}</textarea></div><div class="form-field full"><label>补充角色原则（系统提示词）</label><textarea name="customPrompt">${esc(agent.customPrompt || '')}</textarea></div></div></details>
      <button class="modal-submit" type="submit">保存角色更新</button></form>`);
    $('#residentEditForm').addEventListener('submit', event => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      const oldName = agent.name; const otherNamed = state.residents.some(person=>person.id!==agent.id && person.name===String(form.get('name')||'').trim());
      if (otherNamed) { toast('镇上已经有一位同名居民了。'); return; }
      const nextName = String(form.get('name')||'').trim(); const nextRole = String(form.get('role')||'').trim(); const nextJob = String(form.get('job')||'office');
      const previousRole = agent.role; const previousJob = (buildingById(agent.job)||buildingByType(agent.job))?.type || agent.job;
      const roleWasChanged = nextRole !== previousRole; const jobWasChanged = nextJob !== previousJob;
      const requestedEducation = String(form.get('education') || agent.education?.status || 'employed');
      agent.name = nextName; agent.goal = String(form.get('goal')||'').trim(); agent.mbti = String(form.get('mbti')||agent.mbti); agent.zodiac = String(form.get('zodiac')||agent.zodiac);
      agent.employmentType = String(form.get('employmentType') || agent.employmentType || 'private');
      agent.personality = String(form.get('personality')||'性格仍在形成').trim(); agent.trait = formatTrait(agent.mbti,agent.zodiac,agent.personality);
      agent.alignment = Math.max(-100,Math.min(100,Math.round(Number(form.get('alignment'))||0))); agent.specialty = String(form.get('specialty')||agent.specialty||'');
      Object.keys(attributeLabels).forEach(key=>{ agent.attributes[key]=limitStat(Number(form.get(`attr_${key}`))||0); });
      Object.keys(proficiencyLabels).forEach(key=>{ agent.proficiencies[key]=limitStat(Number(form.get(`prof_${key}`))||0); });
      agent.background = { story:String(form.get('story')||'').trim(), turningPoint:String(form.get('turningPoint')||'').trim(), privateWish:String(form.get('privateWish')||'').trim(), values:String(form.get('values')||'').trim() };
      agent.customPrompt = String(form.get('customPrompt')||'').trim(); agent.education ||= { status:'enrolled',dropout:false };
      const changedToDropout = agent.age >= 15 && agent.age <= 21 && requestedEducation === 'dropout' && agent.education.status !== 'dropout';
      if (changedToDropout) {
        chooseCareer(agent,true);
        agent.education.status='dropout'; agent.education.dropout=true;
        if (roleWasChanged) agent.role = nextRole; if (jobWasChanged) agent.job = nextJob;
      } else if (agent.age >= 15 && agent.age <= 21 && ['enrolled','university','dropout'].includes(requestedEducation)) {
        agent.education.status=requestedEducation; agent.education.dropout=requestedEducation==='dropout'; agent.role=nextRole; agent.job=nextJob;
      } else { agent.role=nextRole; agent.job=nextJob; }
      agent.tools = getTools(agent); agent.currentThought = `我重新确认了自己的目标：「${agent.goal}」。我的设定、能力和经历都更新了，我会用接下来的行动来回应这些变化。`;
      remember(agent,`我的角色设定已更新：${agent.role}，目标是「${agent.goal}」。`, '自我认知', 1); recordExperience(agent,'角色设定和能力参数发生调整。',agent.specialty);
      pushEvent(`${safeName(agent)}更新了自己的属性、职业和成长设定；后续行动将依据新的能力与原则变化。`,'social','✎',[agent.id]);
      closeModal(); render(); toast(`${agent.name}的属性、设定和系统提示词已更新。`);
    });
  }

  function openModal(kicker, title, description, content) {
    $('#modalKicker').textContent = kicker; $('#modalTitle').textContent = title; $('#modalDescription').textContent = description;
    modalContent.innerHTML = content; modalBackdrop.hidden = false;
  }
  function closeModal() { modalBackdrop.hidden = true; modalContent.innerHTML = ''; }
  function readTownIndex() {
    try { const index = JSON.parse(localStorage.getItem('society-town-index') || '[]'); return Array.isArray(index) ? index : []; }
    catch { return []; }
  }
  async function openTownManager() {
    const remoteTowns = await window.SocietyBackend?.listTowns() || [];
    const entries = new Map(readTownIndex().map(item => [item.id, item]));
    remoteTowns.forEach(item => entries.set(item.id, { ...entries.get(item.id), ...item }));
    entries.set(activeTownId, { ...(entries.get(activeTownId) || {}), id: activeTownId, name: state.worldName || '榆灯镇', day: state.day, residents: state.residents.length, current: true });
    const towns = [...entries.values()].sort((a, b) => Number(Boolean(b.current)) - Number(Boolean(a.current)) || String(a.name).localeCompare(String(b.name), 'zh-CN'));
    const rows = towns.map(town => `<article class="town-list-item"><div><b>${esc(town.name || '未命名小镇')}</b><small>${town.current ? '当前观测中' : `第 ${town.day || 1} 天 · ${town.residents || 0} 位居民`} · ${String(town.id || '').startsWith('local-') ? '本地存档' : '服务端存档'}</small></div><button class="text-button" data-town-switch="${esc(town.id)}" ${town.current ? 'disabled' : ''}>${town.current ? '当前' : '进入'}</button></article>`).join('') || '<div class="event-empty">还没有小镇存档。创建后会作为独立世界保存。</div>';
    const backendOnline = window.SocietyBackend?.isOnline();
    openModal('WORLD COLLECTION', '管理多个小镇', `${backendOnline ? '后端已连接，世界状态与历史记录会写入本机服务端。' : '后端暂不可用；新小镇会暂存在当前浏览器。'}每座小镇拥有独立居民、地图和时间进度。`, `<div class="town-list">${rows}</div><form id="newTownForm" class="form-grid town-create-form"><div class="form-field"><label for="newTownName">新小镇名字</label><input id="newTownName" name="name" maxlength="24" placeholder="例如：雾港镇" required></div><button class="modal-submit" type="submit">创建一座小镇</button></form><button class="modal-submit secondary-submit" id="townManagerDone">返回当前世界</button>`);
    modalContent.querySelectorAll('[data-town-switch]').forEach(button => button.addEventListener('click', () => {
      const townId = button.dataset.townSwitch; if (!townId || townId === activeTownId) return;
      persist(); localStorage.setItem('society-active-town', townId); window.location.reload();
    }));
    $('#newTownForm').addEventListener('submit', async event => {
      event.preventDefault(); const name = String(new FormData(event.currentTarget).get('name') || '').trim(); if (!name) return;
      let newId = `local-${Date.now().toString(36)}`;
      const fresh = makeInitialState(); fresh.worldName = name; fresh.worldId = newId;
      if (window.SocietyBackend?.isOnline()) {
        try { const created = await window.SocietyBackend.createTown(name, fresh); newId = created.id; fresh.worldId = newId; }
        catch { toast('服务端创建失败，先保存为本地小镇。'); }
      }
      const localIndex = readTownIndex().filter(item => item.id !== newId);
      localIndex.push({ id: newId, name, day: 1, residents: fresh.residents.length, createdAt: new Date().toISOString() });
      try { localStorage.setItem('society-town-index', JSON.stringify(localIndex)); localStorage.setItem(`yudeng-town-v2:${newId}`, JSON.stringify(fresh)); } catch { /* server copy remains available */ }
      localStorage.setItem('society-active-town', newId); window.location.reload();
    });
    $('#townManagerDone').addEventListener('click', closeModal);
  }
  function openJusticeModal() {
    const facilities = ['townhall','police','prosecutor','courthouse','prison'];
    const facilityRows = facilities.map(type => {
      const building = state.buildings.find(item => item.type === type);
      const staff = state.residents.filter(agent => !agent.deceased && (buildingById(agent.job)?.type || agent.job) === type).length;
      return `<article class="journal-entry"><header><b>${esc(facilityTypes[type].name)}</b><small>${building ? `已建成 · ${facilityLevelName(type,levelOf(building))} · ${staff} 位在岗` : '尚未建成'}</small></header><p>${esc(facilityDetails[type].services)}</p></article>`;
    }).join('');
    const active = state.justice.cases.filter(item => !['convicted','dismissed','closed'].includes(item.status));
    const caseRows = state.justice.cases.slice(0,30).map(item => {
      const offender=state.residents.find(person=>person.id===item.offenderId); const victim=state.residents.find(person=>person.id===item.victimId);
      const labels={reported:'待调查',investigation:'警务调查中',prosecuted:'检察院已起诉',convicted:'已判刑',dismissed:'证据不足，驳回',closed:'已结案'};
      return `<article class="journal-entry"><header><span class="journal-date">第 ${item.openedDay} 天</span><b>${esc(offender?.name || '未知涉案人')} · ${esc(item.crimeType)}</b><small>${labels[item.status] || item.status}${offender?.jailDays ? ` · 余刑 ${offender.jailDays} 天` : ''}</small></header><p>${esc(item.detail || '违法行为记录')}${victim ? ` · 受害者：${esc(victim.name)}` : ''} · 证据 ${Math.round((item.evidence || 0) * 100)}%</p></article>`;
    }).join('') || '<div class="event-empty">还没有违法案件记录。欺诈、威胁、殴打、谋杀和破坏都会进入这里。</div>';
    openModal('PUBLIC SAFETY & JUSTICE', '治安与司法', '违法行为会改变道德、关系与健康，并进入警务调查、检察审查、法院判决和监禁执行。公共机构是否建设由居民自行提出并表决。', `<div class="building-facts"><div><small>未结案件</small><b>${active.length} 起</b></div><div><small>累计定罪</small><b>${state.justice.cases.filter(item=>item.status==='convicted').length} 起</b></div><div><small>社会不满</small><b>${state.justice.publicDiscontent || 0} / 100</b></div><div><small>镇公所预算</small><b>${state.treasury} 元</b></div></div><div class="profile-section-title"><span>公共机构</span><small>建造后提高执法与治理能力</small></div><div class="journal-list">${facilityRows}</div><div class="profile-section-title"><span>案件档案</span><small>最近 ${Math.min(30,state.justice.cases.length)} 起</small></div><div class="journal-list">${caseRows}</div><button class="modal-submit secondary-submit" id="justiceDone">返回小镇</button>`);
    $('#justiceDone').addEventListener('click', closeModal);
  }
  async function createRandomWorld() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; $('#autoButton').classList.remove('running'); $('#autoButton').title = '自动推进'; }
    persist();
    let fresh; let initializationError='';
    let backendStatus=window.SocietyBackend?.getStatus?.()||{};
    if(window.SocietyBackend?.check)backendStatus=await window.SocietyBackend.check();
    if(backendStatus.online&&backendStatus.openaiConfigured&&window.SocietyBackend?.generateWorld){
      toast(`正在用 ${backendStatus.model||'大模型'} 初始化世界…`);
      try{
        const result=await window.SocietyBackend.generateWorld({population:12});
        fresh=makeAiWorldState(result.world,result.usage);
      }catch(error){
        initializationError=String(error?.message||'大模型请求失败');
        fresh=makeRandomWorldState();fresh.initializationMode='local-fallback';fresh.initializationError=initializationError;
      }
    }else{
      fresh=makeRandomWorldState();fresh.initializationMode='local-random';
      if(backendStatus.online&&!backendStatus.openaiConfigured)fresh.initializationMessage='本地随机初始化；未配置服务端 OPENAI_API_KEY，因此没有调用大模型。';
      else if(!backendStatus.online)fresh.initializationMessage='本地随机初始化；本机后端未连接。';
    }
    const name = fresh.worldName;
    let newId = `local-${Date.now().toString(36)}`;
    if (window.SocietyBackend?.isOnline()) {
      try { const created = await window.SocietyBackend.createTown(name,fresh); newId = created.id; fresh.worldId = newId; }
      catch { toast('本机后端创建失败，改为保存在浏览器本地。'); }
    }
    const entries = readTownIndex().filter(item => item.id !== newId);
    entries.push({ id:newId,name,day:1,residents:fresh.residents.length,createdAt:new Date().toISOString(),generatedLocally:fresh.generatedLocally!==false,initializationMode:fresh.initializationMode||'local-random' });
    try { localStorage.setItem('society-town-index',JSON.stringify(entries)); localStorage.setItem(`yudeng-town-v2:${newId}`,JSON.stringify(fresh)); } catch { /* 后端存档仍可使用 */ }
    localStorage.setItem('society-active-town',newId); window.location.reload();
  }
  function openAddResidentModal() {
    openModal('NEW RESIDENT', '邀请一位居民', '给 TA 一个目标和一项突出优势；其余属性也会生成，并在生活中继续成长。', `
      <form id="residentForm"><div class="form-grid">
        <div class="form-field"><label for="newName">名字</label><input id="newName" name="name" placeholder="例如：叶知秋" maxlength="16" required /></div>
        <div class="form-field"><label for="newRole">职业</label><input id="newRole" name="role" placeholder="例如：街头摄影师" maxlength="20" required /></div>
        <div class="form-field full"><label for="newGoal">他/她最想做成的事</label><input id="newGoal" name="goal" placeholder="例如：记录镇上每个人的故事" maxlength="48" required /></div>
        <div class="form-field"><label for="newTrait">性格关键词</label><input id="newTrait" name="trait" placeholder="好奇、热心" maxlength="24" /></div>
        <div class="form-field"><label for="newSkill">主要特长</label><select id="newSkill" name="skill"><optgroup label="基础属性"><option value="strength">力量</option><option value="speed">速度</option><option value="charisma">魅力</option><option value="intelligence">智力</option><option value="emotional">情商</option><option value="financial">财商</option></optgroup><optgroup label="熟练度"><option value="firearms">枪械</option><option value="melee">近战</option><option value="archery">射箭</option><option value="medicine">医学</option><option value="fishing">钓鱼</option><option value="cooking">烹饪</option></optgroup></select></div>
        <div class="form-field full"><label for="newPrompt">自定义角色提示词（选填）</label><textarea id="newPrompt" name="prompt" placeholder="写一句希望这个角色遵循的处事原则"></textarea></div>
        <div class="form-field full"><label for="newBackground">成长经历（选填）</label><textarea id="newBackground" name="background" placeholder="写一段过去经历、重要转折，或 TA 为什么来到榆灯镇"></textarea></div>
      </div><button class="modal-submit" type="submit">把 TA 邀请到榆灯镇</button></form>`);
    const formGrid = $('#residentForm .form-grid');
    const addSelect = (name, labelText, entries) => {
      const field = document.createElement('div'); field.className = 'form-field';
      const label = document.createElement('label'); label.htmlFor = 'new' + name; label.textContent = labelText;
      const select = document.createElement('select'); select.id = 'new' + name; select.name = name;
      entries.forEach(([value, text]) => { const option = document.createElement('option'); option.value = value; option.textContent = text; select.appendChild(option); });
      field.append(label, select); formGrid.prepend(field);
    };
    const ageField = document.createElement('div'); ageField.className = 'form-field';
    ageField.innerHTML = '<label for="newAge">年龄</label><input id="newAge" name="age" type="number" min="0" max="100" value="25" />'; formGrid.prepend(ageField);
    addSelect('gender', '性别', [['女','女'],['男','男']]);
    addSelect('mbti', 'MBTI（主要性格）', [['random','随机生成'], ...Object.keys(mbtiTraits).map(type => [type, type + ' · ' + mbtiTraits[type]])]);
    addSelect('zodiac', '星座（次要影响）', [['random','随机生成'], ...zodiacNames.map(name => [name,name])]);
    addSelect('alignment', '善恶倾向', [['38','偏善良'],['0','中立'],['-30','利己'],['-62','暴徒倾向']]);
    const proficiencyGroup = $('#newSkill').querySelectorAll('optgroup')[1]; proficiencyGroup.replaceChildren();
    Object.entries(proficiencyLabels).forEach(([key, label]) => { const option = document.createElement('option'); option.value = key; option.textContent = label; proficiencyGroup.appendChild(option); });
    $('#residentForm').addEventListener('submit', event => { event.preventDefault(); addResident(new FormData(event.currentTarget)); });
    setTimeout(() => $('#newName')?.focus(), 60);
  }
  function addResident(form) {
    const name = String(form.get('name') || '').trim(); const role = String(form.get('role') || '').trim(); const goal = String(form.get('goal') || '').trim();
    if (!name || !role || !goal) return;
    if (state.residents.length + state.pregnancies.length >= state.town.rules.maxPopulation) { toast(`已达到区域人口上限 ${state.town.rules.maxPopulation} 人。`); return; }
    const mbti = form.get('mbti') && form.get('mbti') !== 'random' ? String(form.get('mbti')) : Object.keys(mbtiTraits)[roll(0, 15)];
    const zodiac = form.get('zodiac') && form.get('zodiac') !== 'random' ? String(form.get('zodiac')) : zodiacNames[roll(0, zodiacNames.length - 1)];
    const trait = String(form.get('trait') || `${mbtiTraits[mbti]} · ${zodiacFlavors[zodiac]}`).trim(); const focus = String(form.get('skill') || 'charisma');
    const ageInput = form.get('age'); const age = Math.max(0, Math.min(100, ageInput === null || ageInput === '' ? 25 : Number(ageInput))); const gender = String(form.get('gender') || '女'); const alignment = Number(form.get('alignment') ?? 38);
    const skills = { care: 3, social: 3, craft: 3, knowledge: 3 };
    const bridgedSkill = focusBridge[focus] || 'social'; skills[bridgedSkill] = 8;
    const secondary = bridgedSkill === 'care' ? 'social' : 'care'; skills[secondary] = Math.max(skills[secondary], 5);
    const availableHome = state.buildings.filter(building => building.type === 'home' && availableHousing(building) > 0).sort((a, b) => Number(a.rent || 0) - Number(b.rent || 0))[0];
    const home = availableHome?.id || null;
    const focusJob = { strength: 'training', speed: 'training', firearms: 'training', melee: 'training', archery: 'training', charisma: 'cafe', intelligence: 'school', emotional: 'clinic', financial: 'market', medicine: 'clinic', firstAid: 'clinic', teaching: 'school', childcare: 'school', cooking: 'cafe', fishing: 'fishing', survival: 'fishing', farming: 'farm', gardening: 'park', gardeningDesign: 'park', construction: 'office', repair: 'office', programming: 'office', negotiation: 'market', leadership: 'office', driving: 'market', logistics: 'market', animalCare: 'petshop', cleaning: 'office', sewing: 'office', communication: 'cafe', persuasion: 'market', stealth: 'training', deception: 'market', security: 'training', media: 'office' };
    const jobType = focusJob[focus] || 'office';
    const agent = person(`custom-${state.idCounter++}`, name, role, goal, trait || '友善、好奇', [skills.care, skills.social, skills.craft, skills.knowledge], home, jobType, palette[(state.residents.length + 2) % palette.length], {
      gender, age, ageDays: 0, mbti, zodiac, alignment, mood: 72, energy: 84, health: 90, hunger: 78, hygiene: 78, socialNeed: 74, specialty: focus, customPrompt: String(form.get('prompt') || '').trim(),
      background: createBackground(role, goal, trait || '友善、好奇', String(form.get('background') || '').trim(), name),
      currentThought: `我刚搬来榆灯镇，想认识新邻居，也想实现「${goal}」。`, homelessSince: home ? null : state.day, memory: [{ text: '刚刚搬来榆灯镇，准备认识新邻居。', source: '亲历', confidence: 1, day: state.day, period: state.period, turn: state.turn }],
    });
    if (attributeLabels[focus]) agent.attributes[focus] = 84;
    if (proficiencyLabels[focus]) agent.proficiencies[focus] = 82;
    agent.tools = getTools(agent);
    if (state.residents.some(r => r.name === agent.name)) { toast('镇上已经有一位同名居民了。'); return; }
    chooseNextDream(agent); state.residents.push(agent); state.selectedId = agent.id;
    pushEvent(`${safeName(agent)}搬到了榆灯镇，想要${esc(goal)}。`, 'town', '✦', [agent.id]);
    closeModal(); render(); toast(`${name}加入了小镇。`);
  }

  $('#advanceButton').addEventListener('click', advanceTurn);
  $('#aiModeButton').addEventListener('click', async () => {
    const status = await window.SocietyBackend?.check?.();
    if (!status?.online || !status.openaiConfigured) {
      openModal('AGENT RUNTIME', '尚未配置逐回合模型', '当前小镇仍由本地策略正常运行。配置服务端密钥后，可开启每位居民独立的回合决策。', `<div class="story-detail"><section><small>本机后端配置</small><p>在启动 backend.py 的终端设置 OPENAI_API_KEY；可选设置 OPENAI_MODEL，然后重启后端。密钥保存在服务端环境变量，不进入浏览器、角色档案或世界存档。</p></section><section><small>回合费用</small><p>开启后，每位居民每轮会分别调用一次模型。页面会记录每位居民的实际 token 用量；单个角色请求失败时会自动回退到本地策略。</p></section></div><button class="modal-submit" id="aiRuntimeDone">返回小镇</button>`);
      $('#aiRuntimeDone').addEventListener('click', closeModal);
      return;
    }
    state.aiRuntimeEnabled = !state.aiRuntimeEnabled;
    state.aiRuntimeUnavailableNotified = false;
    render();
    toast(state.aiRuntimeEnabled ? `已开启 ${status.model || 'OpenAI 模型'} 逐回合决策；每位居民每轮单独调用一次。` : '已关闭大模型回合决策，居民改用本地策略。');
  });
  $('#autoButton').addEventListener('click', () => {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; $('#autoButton').classList.remove('running'); $('#autoButton').title = '自动推进'; toast('已暂停自动推进。'); }
    else { autoTimer = setInterval(advanceTurn, 2200); $('#autoButton').classList.add('running'); $('#autoButton').title = '暂停自动推进'; toast('小镇将自动推进，每轮约 2 秒。'); }
  });
  $('#scaleButton').addEventListener('click', openTownScaleModal);
  $('#rulesButton').addEventListener('click', openTownRulesModal);
  $('#environmentButton').addEventListener('click', openEnvironmentModal);
  $('#storyDetailButton').addEventListener('click', openStoryModal);
  $('#townsButton').addEventListener('click', openTownManager);
  $('#randomWorldButton').addEventListener('click', createRandomWorld);
  $('#justiceButton').addEventListener('click', openJusticeModal);
  $('#civicHistoryButton').addEventListener('click', openProposalHistoryModal);
  $('#addResidentButton').addEventListener('click', openAddResidentModal);
  $('#modalClose').addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
  $('#clearLog').addEventListener('click', showHistory);
  $('#resetButton').addEventListener('click', () => {
    if (!window.confirm('要重新开始榆灯镇吗？当前这座小镇的进度会被清除。')) return;
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    localStorage.removeItem(STORAGE_KEY); state = makeInitialState(); render(); toast('榆灯镇重新开始了。');
  });
  $('#aboutButton').addEventListener('click', () => {
    openModal('ABOUT THIS PROTOTYPE', '一个会自己生活的小镇', '榆灯镇是一个可玩的社会模拟原型。', `<div class="about-copy"><strong>居民会自主行动：</strong>每人有独立目标、性格、技能、需求、记忆和行动工具。每轮共同决策，再由世界规则结算。<br/><br/><strong>住房与经济：</strong>公租房按月收费且容量固定；工资缴税，欠租会露宿公共设施。居民可以买地、建房出租、开店或加盟。公共设施提案须获超过三分之二居民支持。<br/><br/><strong>借贷与梦想：</strong>余额、借出去的债权和欠款分开记录。居民可以拒绝借钱，双方也能约定利息；借款、还款和计息留在账本中。居民会为自己选择下一个梦想，并从收入中积攒所需资金。<br/><br/><strong>生存与家庭：</strong>钱不够时不能消费；饱腹为零会损害健康，健康归零则死亡。父母不会自动替孩子支付费用，孩子可以请求一笔自愿借款。<br/><br/><strong>感知与记忆：</strong>居民能观察附近人的身体和状态。日常记忆会压缩，完整历史和行动想法仍保存在档案里；角色还能通过回想找回旧经历并提升回想熟练度。<br/><br/><strong>存档与模拟方式：</strong>小镇可以保存在浏览器里；启动本机后端后，会写入独立小镇档案。默认由本地策略驱动；配置服务端 API 密钥并开启 AI 回合后，每位居民会用自己的系统提示词和候选行动独立决策，并记录实际 token 用量。</div><div class="about-meta">YUDENG TOWN SIMULATOR · PROTOTYPE 0.5</div><button class="modal-submit" id="aboutDone">继续观察</button>`);
    $('#aboutDone').addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Enter' && modalBackdrop.hidden && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) advanceTurn();
  });
  initializeSpecificGoals();
  render();
})();
