import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 知识 · 体系图谱（5 大阶段）
const knowledgeSidebar = [
  { text: '知识图谱总览', link: '/知识/' },
  {
    text: '01 底层基石',
    collapsed: false,
    items: [
      {
        text: '计算机基础',
        collapsed: true,
        items: [
          { text: '并发编程', link: '/知识/01-底层基石/01-计算机基础/01-并发编程' },
          { text: '网络协议', link: '/知识/01-底层基石/01-计算机基础/02-网络协议' },
          { text: '安全与编译', link: '/知识/01-底层基石/01-计算机基础/03-安全与编译' },
        ]
      },
      {
        text: '语言深度',
        collapsed: true,
        items: [
          { text: 'Java核心', link: '/知识/01-底层基石/02-语言深度/01-Java核心' },
          { text: 'JVM原理', link: '/知识/01-底层基石/02-语言深度/02-JVM原理' },
        ]
      },
      {
        text: '算法与数据结构',
        collapsed: true,
        items: [
          { text: '常用数据结构', link: '/知识/01-底层基石/03-算法与数据结构/01-常用数据结构' },
          { text: '经典算法思想', link: '/知识/01-底层基石/03-算法与数据结构/02-经典算法思想' },
        ]
      },
    ]
  },
  {
    text: '02 核心中间件',
    collapsed: false,
    items: [
      { text: '数据库 MySQL', link: '/知识/02-核心中间件/01-数据库 MySQL/' },
      { text: '缓存 Redis', link: '/知识/02-核心中间件/02-缓存 Redis/' },
      { text: '消息队列 Kafka', link: '/知识/02-核心中间件/03-消息队列 Kafka/' },
      { text: '网关 Nginx', link: '/知识/02-核心中间件/04-网关 Nginx/' },
    ]
  },
  {
    text: '03 分布式与云原生',
    collapsed: false,
    items: [
      { text: '分布式通用设计', link: '/知识/03-分布式与云原生/01-分布式通用设计/' },
      { text: '服务治理', link: '/知识/03-分布式与云原生/02-服务治理/' },
      { text: '高可用保障', link: '/知识/03-分布式与云原生/03-高可用保障/' },
      { text: '云原生工程化', link: '/知识/03-分布式与云原生/04-云原生工程化/' },
    ]
  },
  {
    text: '04 工程化能力落地',
    collapsed: false,
    items: [
      { text: '代码工程化', link: '/知识/04-工程化能力落地/01-代码工程化/' },
      { text: '可观测性工程化', link: '/知识/04-工程化能力落地/02-可观测性工程化/' },
      { text: '测试工程化', link: '/知识/04-工程化能力落地/03-测试工程化/' },
    ]
  },
  {
    text: '05 非技术与软实力',
    collapsed: false,
    items: [
      { text: '项目管理', link: '/知识/05-非技术与软实力/01-项目管理/' },
      { text: '架构设计思维', link: '/知识/05-非技术与软实力/02-架构设计思维/' },
      { text: '团队协作', link: '/知识/05-非技术与软实力/03-团队协作/' },
      { text: '业务理解能力', link: '/知识/05-非技术与软实力/04-业务理解能力/' },
      { text: '技术影响力', link: '/知识/05-非技术与软实力/05-技术影响力/' },
    ]
  },
  { text: '航空运营智能管理平台架构实践', link: '/知识/航空运营智能管理平台架构设计与实践' },
]

// 案例 · 考点速记（15 篇）
const caseSidebar = [
  { text: '案例总览', link: '/案例/' },
  { text: '01 需求分析', link: '/案例/01-需求分析-考点速记' },
  { text: '02 系统设计-面向对象设计', link: '/案例/02-系统设计-面向对象设计-考点速记' },
  { text: '03 层次结构', link: '/案例/03-层次结构-考点速记' },
  { text: '04 云原生架构设计', link: '/案例/04-云原生架构设计-考点速记' },
  { text: '05 面向服务架构', link: '/案例/05-面向服务架构-考点速记' },
  { text: '06 系统架构设计', link: '/案例/06-系统架构设计-考点速记' },
  { text: '07 安全架构设计理论与实践', link: '/案例/07-安全架构设计理论与实践-考点速记' },
  { text: '08 大数据架构', link: '/案例/08-大数据架构-考点速记' },
  { text: '09 领域驱动设计', link: '/案例/09-领域驱动设计-考点速记' },
  { text: '10 分布式系统', link: '/案例/10-分布式系统-考点速记' },
  { text: '11 数据库系统', link: '/案例/11-数据库系统-考点速记' },
  { text: '12 Redis', link: '/案例/12-Redis-考点速记' },
  { text: '13 ElasticSearch', link: '/案例/13-ElasticSearch-考点速记' },
  { text: '14 MongoDB', link: '/案例/14-MongoDB-考点速记' },
  { text: '15 大模型应用', link: '/案例/15-大模型应用-考点速记' },
]

// 论文 · 系统架构与软件工程（最新航空基线版）
const paperSidebar = [
  { text: '论文目录', link: '/论文/' },
  {
    text: '云原生架构专题',
    collapsed: false,
    items: [
      { text: '11. 缓存技术应用', link: '/论文/云原生/11.云原生-缓存技术应用-论文成稿' },
      { text: '12. 消息中间件应用', link: '/论文/云原生/12.云原生-消息中间件技术应用-论文成稿' },
      { text: '13. 自动化运维应用', link: '/论文/云原生/13.云原生-自动化运维应用-论文成稿' },
      { text: '14. 容器化技术应用', link: '/论文/云原生/14.云原生-容器化技术应用-论文成稿' },
      { text: '15. 集群技术应用', link: '/论文/云原生/15.云原生-集群技术应用-论文成稿' },
      { text: '16. AI 大模型应用', link: '/论文/云原生/16.云原生-AI大模型技术应用-论文成稿' },
      { text: '17. 高可用技术应用', link: '/论文/云原生/17.云原生-高可用技术应用-论文成稿' },
      { text: '18. 可靠性设计实践', link: '/论文/云原生/18.云原生-可靠性设计-论文成稿' },
      { text: '19. 架构设计综合实践', link: '/论文/云原生/19.云原生-航空运营智能管理平台架构设计实践' },
      { text: '21. 可观测性设计实践', link: '/论文/云原生/21.云原生-航空运营智能管理平台可观测性设计实践' },
      { text: '22. 事件驱动架构应用', link: '/论文/云原生/22.云原生-航空运营智能管理平台事件驱动架构应用实践' },
      { text: '23. Serverless 架构应用', link: '/论文/云原生/23.云原生-航空运营智能管理平台Serverless架构应用实践' },
      { text: '24. 服务网格技术应用', link: '/论文/云原生/24.云原生-航空运营智能管理平台服务网格技术应用实践' },
      { text: '25. 存储计算分离应用', link: '/论文/云原生/25.云原生-航空运营智能管理平台存储计算分离应用实践' },
      { text: '26. 分布式事务解决方案', link: '/论文/云原生/26.云原生-航空运营智能管理平台分布式事务应用实践' },
    ]
  },
  {
    text: '软件测试与质量保障',
    collapsed: false,
    items: [
      { text: '08. 质量保证与测试综述', link: '/论文/测试/8.测试-航空运营智能管理平台质量保证与测试实践' },
      { text: '09. 静态测试实践', link: '/论文/测试/9.测试-航空运营智能管理平台静态测试实践' },
      { text: '10. 单元测试实践', link: '/论文/测试/10.测试-航空运营智能管理平台单元测试实践' },
      { text: '11. 性能测试实践', link: '/论文/测试/11.测试-航空运营智能管理平台性能测试实践' },
      { text: '12. 自动化测试实践', link: '/论文/测试/12.测试-航空运营智能管理平台自动化测试实践' },
      { text: '13. AI 辅助测试实践', link: '/论文/测试/13.测试-航空运营智能管理平台AI辅助测试实践' },
      { text: '14. 混沌工程实践', link: '/论文/测试/14.测试-航空运营智能管理平台混沌工程实践' },
    ]
  },
  {
    text: '大数据与微服务架构',
    collapsed: false,
    items: [
      { text: '03. Lambda 架构实践', link: '/论文/大数据/3.大数据-航空运营智能管理平台Lambda架构应用实践' },
      { text: '04. Kappa 架构实践', link: '/论文/大数据/4.大数据-航空运营智能管理平台Kappa架构应用实践' },
      { text: '03. 微服务治理技术', link: '/论文/微服务/3.微服务-航空运营智能管理平台微服务治理技术实践' },
      { text: '04. 微服务设计约束', link: '/论文/微服务/4.微服务-航空运营智能管理平台微服务设计约束实践' },
    ]
  },
  {
    text: '安全架构专题',
    collapsed: false,
    items: [
      { text: '02. 安全架构设计实践', link: '/论文/安全/2.安全-航空运营智能管理平台安全架构设计' },
      { text: '03. 安全架构应用实践', link: '/论文/安全/3.安全-航空运营智能管理平台安全架构应用实践' },
    ]
  },
]

// 选择 · 考点速记（14 篇）
const choiceSidebar = [
  { text: '选择总览', link: '/选择/' },
  { text: '01 软件工程概述', link: '/选择/01-软件工程概述-考点速记' },
  { text: '02 需求工程', link: '/选择/02-需求工程-考点速记' },
  { text: '03 系统设计', link: '/选择/03-系统设计-考点速记' },
  { text: '04 系统架构设计', link: '/选择/04-系统架构设计-考点速记' },
  { text: '05 软件测试', link: '/选择/05-软件测试-考点速记' },
  { text: '06 系统运行与维护', link: '/选择/06-系统运行与维护-考点速记' },
  { text: '07 系统可靠性', link: '/选择/07-系统可靠性-考点速记' },
  { text: '08 项目管理', link: '/选择/08-项目管理-考点速记' },
  { text: '09 计算机组成原理', link: '/选择/09-计算机组成原理-考点速记' },
  { text: '10 计算机网络', link: '/选择/10-计算机网络-考点速记' },
  { text: '11 操作系统', link: '/选择/11-操作系统-考点速记' },
  { text: '12 数据库系统', link: '/选择/12-数据库系统-考点速记' },
  { text: '13 信息安全', link: '/选择/13-信息安全-考点速记' },
  { text: '14 法律法规', link: '/选择/14-法律法规-考点速记' },
]

// 计划
const planSidebar = [
  { text: '30天冲刺内容', link: '/plan/30天冲刺内容' },
  { text: '每日计划-带关联', link: '/plan/每日计划-带关联' },
  { text: '英语 · 技术英语入门-计算机常用词汇', link: '/plan/英语/技术英语入门-计算机常用词汇' },
  { text: '英语 · 技术新闻短句听力-前沿科技简讯', link: '/plan/英语/技术新闻短句听力-前沿科技简讯' },
  { text: '英语 · 跟读-技术介绍-云原生可观测性', link: '/plan/英语/跟读-技术介绍-云原生可观测性' },
]

// 论文背诵版 · 云原生（18 篇）
const cloudNativeSidebar = [
  { text: '云原生总览', link: '/论文背诵版/云原生/' },
  { text: '1. 云原生架构', link: '/论文背诵版/云原生/1.云原生架构' },
  { text: '2. 云原生可观测性设计与实践', link: '/论文背诵版/云原生/2.云原生可观测性设计与实践-航空运营智能管理平台-论文' },
  { text: '3. 云原生层次架构', link: '/论文背诵版/云原生/3.云原生-层次架构-成稿' },
  { text: '4. 云原生云计算运维', link: '/论文背诵版/云原生/4.云原生-云计算运维-论文成稿' },
  { text: '5. 云原生事件驱动架构应用', link: '/论文背诵版/云原生/5.云原生-事件驱动架构应用-论文成稿' },
  { text: '6. 云原生 Serverless 架构', link: '/论文背诵版/云原生/6.云原生-Serverless架构-论文成稿' },
  { text: '7. 云原生服务网格', link: '/论文背诵版/云原生/7.云原生-服务网格-论文成稿' },
  { text: '8. 论存储计算分离模式的应用', link: '/论文背诵版/云原生/8.云原生-论存储计算分离模式的应用-论文成稿' },
  { text: '9. 论分布式事务及其解决方案', link: '/论文背诵版/云原生/9.云原生-论分布式事务及其解决方案-论文成稿' },
  { text: '10. 论可靠性设计', link: '/论文背诵版/云原生/10.云原生-论可靠性设计-论文成稿' },
  { text: '11. 缓存技术应用', link: '/论文背诵版/云原生/11.云原生-缓存技术应用-论文成稿' },
  { text: '12. 消息中间件技术应用', link: '/论文背诵版/云原生/12.云原生-消息中间件技术应用-论文成稿' },
  { text: '13. 自动化运维应用', link: '/论文背诵版/云原生/13.云原生-自动化运维应用-论文成稿' },
  { text: '14. 容器化技术应用', link: '/论文背诵版/云原生/14.云原生-容器化技术应用-论文成稿' },
  { text: '15. 集群技术应用', link: '/论文背诵版/云原生/15.云原生-集群技术应用-论文成稿' },
  { text: '16. AI 大模型技术应用', link: '/论文背诵版/云原生/16.云原生-AI大模型技术应用-论文成稿' },
  { text: '17. 高可用技术应用', link: '/论文背诵版/云原生/17.云原生-高可用技术应用-论文成稿' },
  { text: '18. 云原生可靠性设计', link: '/论文背诵版/云原生/18.云原生-可靠性设计-论文成稿' },
]

// 论文背诵版 · 微服务（2 篇）
const microserviceSidebar = [
  { text: '1. 论微服务治理技术', link: '/论文背诵版/微服务/1.微服务-论微服务治理技术-论文成稿' },
  { text: '2. 论微服务设计约束的应用', link: '/论文背诵版/微服务/2.微服务-论微服务设计约束的应用-论文成稿' },
]

// 论文背诵版 · 大数据（2 篇）
const bigDataSidebar = [
  { text: '1. Lambda 架构的应用', link: '/论文背诵版/大数据/1.大数据-Lambda架构的应用-论文成稿' },
  { text: '2. 论 Kappa 架构的应用', link: '/论文背诵版/大数据/2.大数据-论Kappa架构的应用-论文成稿' },
]

// 论文背诵版 · 测试（7 篇）
const testSidebar = [
  { text: '1. 静态测试', link: '/论文背诵版/测试/1.测试-静态测试-论文成稿' },
  { text: '2. 静态和动态测试', link: '/论文背诵版/测试/2.测试-静态和动态测试-论文成稿' },
  { text: '3. 单元测试', link: '/论文背诵版/测试/3.测试-单元测试-论文成稿' },
  { text: '4. 性能测试', link: '/论文背诵版/测试/4.测试-性能测试-论文成稿' },
  { text: '5. 自动化融合测试', link: '/论文背诵版/测试/5.测试-自动化融合测试-论文成稿' },
  { text: '6. AI 辅助 TDD', link: '/论文背诵版/测试/6.测试-AI辅助TDD-论文成稿' },
  { text: '7. 混沌工程', link: '/论文背诵版/测试/7.测试-混沌工程-论文成稿' },
]

// 论文背诵版 · 安全（2 篇）
const securitySidebar = [
  { text: '1. 论安全架构设计', link: '/论文背诵版/安全/1.安全-论安全架构设计-论文成稿' },
  { text: '2. 论安全架构应用', link: '/论文背诵版/安全/2.安全-论安全架构应用-论文成稿' },
]

const paperReciteSidebar = [
  { text: '论文背诵版总览', link: '/论文背诵版/' },
  { text: '🔥 核心背诵简版 (考前冲刺)', link: '/论文背诵版/背诵简版/全主题论文核心背诵简版' },
  { text: '论文成稿通用模板', link: '/论文背诵版/论文成稿-通用模板' },
  { text: '云原生（18 篇）', collapsed: false, items: cloudNativeSidebar },
  { text: '微服务（2 篇）', collapsed: false, items: microserviceSidebar },
  { text: '大数据（2 篇）', collapsed: false, items: bigDataSidebar },
  { text: '测试（7 篇）', collapsed: false, items: testSidebar },
  { text: '安全（2 篇）', collapsed: false, items: securitySidebar },
]

// 论文精读版 (Pro)
const proCloudNativeSidebar = [
  { text: '云原生精读总览', link: '/pro/云原生/' },
  { text: '1. 云原生架构设计', link: '/pro/云原生/1.云原生架构设计' },
  { text: '2. 高可用性与软件可靠性设计', link: '/pro/云原生/2.高可用性与软件可靠性设计' },
  { text: '3. 缓存技术应用', link: '/pro/云原生/3.缓存技术应用' },
  { text: '4. 消息中间件技术应用', link: '/pro/云原生/4.消息中间件技术应用' },
  { text: '5. 数据库与存储设计', link: '/pro/云原生/5.数据库与存储设计' },
  { text: '6. AI大模型与智能化应用', link: '/pro/云原生/6.AI大模型与智能化应用' },
  { text: '7. 云原生安全与服务网格', link: '/pro/云原生/7.云原生安全与服务网格' },
  { text: '8. 云原生运维与可观测性', link: '/pro/云原生/8.云原生运维与可观测性' },
  { text: '云原生论文主题与案例匹配索引', link: '/pro/云原生/云原生论文主题与案例匹配索引' },
]

const proBigDataSidebar = [
  { text: '大数据精读总览', link: '/pro/大数据/' },
  { text: '论大数据架构在航空运营决策支持系统中的应用', link: '/pro/大数据/论大数据架构在航空运营决策支持系统中的应用' },
]

const proSecuritySidebar = [
  { text: '安全精读总览', link: '/pro/安全/' },
  { text: '论信息系统安全架构设计与实践', link: '/pro/安全/论信息系统安全架构设计与实践' },
]

const proMicroserviceSidebar = [
  { text: '微服务精读总览', link: '/pro/微服务/' },
  { text: '论微服务架构在分布式航空运营平台中的设计与治理', link: '/pro/微服务/论微服务架构在分布式航空运营平台中的设计与治理' },
]

const proTestSidebar = [
  { text: '测试精读总览', link: '/pro/测试/' },
  { text: '论软件测试在分布式系统质量保障中的应用', link: '/pro/测试/论软件测试在分布式系统质量保障中的应用' },
]

const proSidebar = [
  { text: '精读版总览', link: '/pro/' },
  { text: '云原生', collapsed: false, items: proCloudNativeSidebar },
  { text: '大数据', collapsed: false, items: proBigDataSidebar },
  { text: '安全', collapsed: false, items: proSecuritySidebar },
  { text: '微服务', collapsed: false, items: proMicroserviceSidebar },
  { text: '测试', collapsed: false, items: proTestSidebar },
]

const sidebar = [
  { text: '首页', link: '/' },
  { text: '背诵要点', link: '/论文/论文模板背诵要点表格' },
  { text: '论文专题', collapsed: false, items: paperSidebar },
  { text: '案例速记', collapsed: false, items: caseSidebar },
  { text: '选择题库', collapsed: false, items: choiceSidebar },
  { text: '复习计划', collapsed: false, items: planSidebar },
]

// 部署到 GitHub Pages 项目站时为 /仓库名/，本地或自定义域名时为 /
const base = process.env.BASE_PATH || '/'

export default withMermaid(defineConfig({
  srcDir: '.',
  srcExclude: ['**/*-raw.md', '**/_docx_extract/**', '**/extract_docx.py', '**/node_modules/**'],
  outDir: 'dist',
  base,
  title: '航空运营架构论文集',
  description: '系统架构设计师考试：航空运营智能管理平台 20 篇高质量论文',
  lang: 'zh-CN',
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes' }],
    ['meta', { name: 'theme-color', content: '#67b3e8' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['link', { rel: 'stylesheet', href: '/custom.css' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '知识图谱', link: '/知识/' },
      { text: '论文专题', link: '/论文/' },
      { text: '案例速记', link: '/案例/' },
      { text: '选择题库', link: '/选择/' },
      { text: '复习计划', link: '/plan/30天冲刺内容' },
    ],
    sidebar: {
      '/知识/': knowledgeSidebar,
      '/论文/': paperSidebar,
      '/案例/': caseSidebar,
      '/选择/': choiceSidebar,
      '/plan/': planSidebar,
      '/': [
        { text: '首页', link: '/' },
        { text: '背诵要点', link: '/论文/论文模板背诵要点表格' },
        { text: '知识图谱', collapsed: false, items: knowledgeSidebar },
        { text: '论文专题', collapsed: false, items: paperSidebar },
        { text: '案例速记', collapsed: false, items: caseSidebar },
        { text: '选择题库', collapsed: false, items: choiceSidebar },
        { text: '复习计划', collapsed: false, items: planSidebar },
      ]
    },
    outline: [2, 4],
    socialLinks: [],
    footer: {
      message: '论文素材 · 案例 · 论文 · 选择',
      copyright: '仅供学习与论文参考',
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    mobile: true,
  },
  markdown: {
    lineNumbers: false,
  },
  ignoreDeadLinks: true,
  vite: {
    publicDir: 'public',
    build: {
      target: 'esnext',
      cssTarget: 'chrome61',
    },
  },
  // Mermaid 图表：淡蓝配色，随主题切换亮/暗色
  mermaid: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#ffffff',      // 节点背景色 (白色)
      primaryTextColor: '#333333',   // 文本颜色 (深灰色)
      primaryBorderColor: '#333333', // 边框颜色 (深灰色)
      lineColor: '#333333',          // 连接线颜色 (深灰色)
      secondaryColor: '#ffffff',    // 次要节点背景色 (白色)
      tertiaryColor: '#ffffff',     // 三级节点背景色 (白色)
      background: '#ffffff',        // 全局背景色 (白色)
      mainBkg: '#ffffff',          // 主背景 (白色)
      secondBkg: '#ffffff',        // 次要背景 (白色)
      border1: '#333333',          // 边框1 (深灰色)
      border2: '#333333',          // 边框2 (深灰色)
      arrowheadColor: '#333333',    // 箭头颜色 (深灰色)
      fontFamily: 'inherit',
    },
  },
  mermaidPlugin: {
    class: 'mermaid-wrap',
  },
}))
