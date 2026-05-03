import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const choiceWithExamDir = path.resolve(__dirname, '../选择-含真题')

/** 选择·含真题：十四章目录名（与磁盘文件夹一致，顺序即侧栏顺序） */
const CHOICE_WITH_EXAM_CHAPTERS = [
  '01-软件工程概述',
  '02-需求工程',
  '03-系统设计',
  '04-系统架构设计',
  '05-软件测试',
  '06-系统运行与维护',
  '07-系统可靠性',
  '08-项目管理',
  '09-计算机组成原理',
  '10-计算机网络',
  '11-操作系统',
  '12-数据库系统',
  '13-信息安全',
  '14-法律法规',
]

/** @param {string} relPathNoMd 相对 选择-含真题，无 .md 后缀，用 / 分隔 */
function choiceWithExamLink(relPathNoMd) {
  return `/选择-含真题/${relPathNoMd.replace(/\\/g, '/')}`
}

/** 动态生成「选择·含真题」侧栏：每章 考点速记 → 总目录 → 其余卡片按文件名排序 */
function buildChoiceWithExamSidebar() {
  const out = [
    { text: '整体知识（12 章）', link: '/整体知识/' },
    { text: '选择·含真题总览', link: '/选择-含真题/' },
    { text: '选择·01–08 工程主线', link: choiceWithExamLink('01-软件工程概述-考点速记') },
    { text: '选择·09–12 计算机基础', link: choiceWithExamLink('09-计算机组成原理-考点速记') },
    { text: '选择·13–14 安全与法规', link: choiceWithExamLink('13-信息安全-考点速记') },
  ]
  if (!fs.existsSync(choiceWithExamDir)) return out

  for (const dir of CHOICE_WITH_EXAM_CHAPTERS) {
    const subAbs = path.join(choiceWithExamDir, dir)
    if (!fs.existsSync(subAbs) || !fs.statSync(subAbs).isDirectory()) continue
    const items = []
    const cheatFile = `${dir}-考点速记.md`
    if (fs.existsSync(path.join(choiceWithExamDir, cheatFile))) {
      items.push({
        text: '考点速记',
        link: choiceWithExamLink(cheatFile.replace(/\.md$/, '')),
      })
    }
    const subMd = fs
      .readdirSync(subAbs, { withFileTypes: true })
      .filter(
        (e) =>
          e.isFile() &&
          e.name.endsWith('.md') &&
          !e.name.endsWith('-raw.md'),
      )
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { numeric: true }))

    const zong = subMd.indexOf('总目录.md')
    const ordered =
      zong === -1
        ? subMd
        : ['总目录.md', ...subMd.filter((n) => n !== '总目录.md')]

    for (const name of ordered) {
      const stem = name.replace(/\.md$/, '')
      items.push({
        text: stem,
        link: choiceWithExamLink(`${dir}/${stem}`),
      })
    }

    const m = dir.match(/^(\d{2})-(.+)$/)
    const title = m ? `${m[1]} ${m[2]}` : dir
    out.push({ text: title, collapsed: true, items })
  }
  return out
}

const choiceWithExamSidebar = buildChoiceWithExamSidebar()

// 选择 · 含真题（四入口：顶栏与首页侧栏与 /考纲、/论文预测 同构；含首页共 5 条）
const choiceWithExamHubSidebar = [
  { text: '首页', link: '/' },
  { text: '选择·总览（含真题）', link: '/选择-含真题/' },
  { text: '选择·01–08 工程主线', link: '/选择-含真题/01-软件工程概述-考点速记' },
  { text: '选择·09–12 计算机基础', link: '/选择-含真题/09-计算机组成原理-考点速记' },
  { text: '选择·13–14 安全与法规', link: '/选择-含真题/13-信息安全-考点速记' },
]

// 整体知识 · 系分十二模块（航空案例文件名含弯引号，link 须与文件系统一致）
const holisticKnowledgeSidebar = [
  { text: '整体知识总览', link: '/整体知识/' },
  { text: '00. 大型航空运营智能管理平台架构设计', link: '/整体知识/00-大型航空运营智能管理平台架构设计' },
  { text: '1. 整体概述', link: '/整体知识/1. 整体概述' },
  { text: '2. 系统规划与分析：项目的“源头设计”', link: '/整体知识/2. 系统规划与分析：项目的“源头设计”' },
  { text: '3. 项目管理：贯穿项目全生命周期的“保障线”', link: '/整体知识/3. 项目管理：贯穿项目全生命周期的“保障线”' },
  { text: '4. 软件工程：项目实施的“技术框架”', link: '/整体知识/4. 软件工程：项目实施的“技术框架”' },
  { text: '5. 软件需求工程：全生命周期管理', link: '/整体知识/5. 软件需求工程：全生命周期管理' },
  { text: '6. 系统设计：从需求到“技术方案”的转化', link: '/整体知识/6. 系统设计：从需求到“技术方案”的转化' },
  { text: '7. 软件架构设计：满足质量属性的“顶层设计”', link: '/整体知识/7. 软件架构设计：满足质量属性的“顶层设计”' },
  { text: '8.信息安全：贯穿平台全生命周期的“防护盾”', link: '/整体知识/8.信息安全：贯穿平台全生命周期的“防护盾”' },
  { text: '9. 软件实现与测试：从‘代码’到‘可用系统’的落地', link: '/整体知识/9. 软件实现与测试：从‘代码’到‘可用系统’的落地' },
  { text: '10. 系统运行与维护：保障平台长期稳定', link: '/整体知识/10. 系统运行与维护：保障平台长期稳定' },
  { text: '11. 基础技术：数据库', link: '/整体知识/11. 基础技术：数据库' },
  { text: '12. 基础技术：计算机基础', link: '/整体知识/12. 基础技术：计算机基础' },
]

// 知识 · 体系图谱（5 大阶段）
const knowledgeSidebar = [
  { text: '核心架构：大型航空运营智能管理平台', link: '/整体知识/00-大型航空运营智能管理平台架构设计' },
  { text: '整体知识（12 章闭环）', link: '/整体知识/' },
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
  { text: '核心架构：大型航空运营智能管理平台', link: '/整体知识/00-大型航空运营智能管理平台架构设计' },
  { text: '整体知识（12 章）', link: '/整体知识/' },
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
  {
    text: '每日一练',
    collapsed: false,
    items: [
      { text: '需求工程背诵版', link: '/案例/每日一练/需求工程背诵版' },
    ]
  },
]

// 论文 · 系统架构与软件工程（最新航空基线版）
const paperSidebar = [
  { text: '核心架构：大型航空运营智能管理平台', link: '/整体知识/00-大型航空运营智能管理平台架构设计' },
  { text: '整体知识（12 章）', link: '/整体知识/' },
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
      { text: '27. AI 大模型拆解背诵版', link: '/论文/云原生/27.AI 大模型拆解背诵版' },
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
  { text: '整体知识（12 章）', link: '/整体知识/' },
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

// 考纲 · 知识点案例（文件名含「知识点」的 md，四个入口：总览 / 案例 / 综合 / 论文）
const kaogangHubSidebar = [
  { text: '首页', link: '/' },
  { text: '考纲总览', link: '/考纲/' },
  { text: '案例科目', link: '/考纲/案例/' },
  { text: '综合科目', link: '/考纲/综合/' },
  { text: '论文科目', link: '/考纲/论文/' },
]

const kaogangCaseSidebar = [
  { text: '考纲总览', link: '/考纲/' },
  { text: '案例总览', link: '/考纲/案例/' },
  { text: '01 系统计划', link: '/考纲/案例/考纲-案例-章节/01-系统计划/系统计划-知识点案例版' },
  { text: '02 信息系统架构的设计理论与实践', link: '/考纲/案例/考纲-案例-章节/02-信息系统架构的设计理论与实践/信息系统架构的设计理论与实践-知识点案例版' },
  { text: '03 层次式架构的设计理论与实践', link: '/考纲/案例/考纲-案例-章节/03-层次式架构的设计理论与实践/层次式架构的设计理论与实践-知识点案例版' },
  { text: '04 云原生架构设计理论与实践', link: '/考纲/案例/考纲-案例-章节/04-云原生架构设计理论与实践/云原生架构设计理论与实践-知识点案例版' },
  { text: '05 面向服务的架构设计理论与实践', link: '/考纲/案例/考纲-案例-章节/05-面向服务的架构设计理论与实践/面向服务的架构设计理论与实践-知识点案例版' },
  { text: '06 嵌入式系统的架构设计理论与实践', link: '/考纲/案例/考纲-案例-章节/06-嵌入式系统的架构设计理论与实践/嵌入式系统的架构设计理论与实践-知识点案例版' },
  { text: '07 通信系统架构的设计理论与实践', link: '/考纲/案例/考纲-案例-章节/07-通信系统架构的设计理论与实践/通信系统架构的设计理论与实践-知识点案例版' },
  { text: '08 安全架构的设计理论与实践', link: '/考纲/案例/考纲-案例-章节/08-安全架构的设计理论与实践/安全架构的设计理论与实践-知识点案例版' },
  { text: '09 大数据架构设计理论与实践', link: '/考纲/案例/考纲-案例-章节/09-大数据架构设计理论与实践/大数据架构设计理论与实践-知识点案例版' },
]

const kaogangZongheSidebar = [
  { text: '考纲总览', link: '/考纲/' },
  { text: '综合总览', link: '/考纲/综合/' },
  { text: '01 计算机系统基本知识', link: '/考纲/综合/考纲-综合-章节/01-计算机系统基本知识/计算机系统基本知识-知识点案例版' },
  { text: '02 信息系统基础知识', link: '/考纲/综合/考纲-综合-章节/02-信息系统基础知识/信息系统基础知识-知识点案例版' },
  { text: '03 信息安全技术基础知识', link: '/考纲/综合/考纲-综合-章节/03-信息安全技术基础知识/信息安全技术基础知识-知识点案例版' },
  { text: '04 软件工程基础知识', link: '/考纲/综合/考纲-综合-章节/04-软件工程基础知识/软件工程基础知识-知识点案例版' },
  { text: '05 数据库设计基础知识', link: '/考纲/综合/考纲-综合-章节/05-数据库设计基础知识/数据库设计基础知识-知识点案例版' },
  { text: '06 系统架构设计基础知识', link: '/考纲/综合/考纲-综合-章节/06-系统架构设计基础知识/系统架构设计基础知识-知识点案例版' },
  { text: '07 系统质量属性与架构评估', link: '/考纲/综合/考纲-综合-章节/07-系统质量属性与架构评估/系统质量属性与架构评估-知识点案例版' },
  { text: '08 软件可靠性技术', link: '/考纲/综合/考纲-综合-章节/08-软件可靠性技术/软件可靠性技术-知识点案例版' },
  { text: '09 软件架构的演化和维护', link: '/考纲/综合/考纲-综合-章节/09-软件架构的演化和维护/软件架构的演化和维护-知识点案例版' },
  { text: '10 未来信息综合技术', link: '/考纲/综合/考纲-综合-章节/10-未来信息综合技术/未来信息综合技术-知识点案例版' },
  { text: '11 标准化与知识产权', link: '/考纲/综合/考纲-综合-章节/11-标准化与知识产权/标准化与知识产权-知识点案例版' },
  { text: '12 应用数学', link: '/考纲/综合/考纲-综合-章节/12-应用数学/应用数学-知识点案例版' },
  { text: '13 专业英语', link: '/考纲/综合/考纲-综合-章节/13-专业英语/专业英语-知识点案例版' },
]

const kaogangLunwenSidebar = [
  { text: '考纲总览', link: '/考纲/' },
  { text: '论文总览', link: '/考纲/论文/' },
  { text: '知识点案例简版', link: '/考纲/论文/考纲-论文-知识点案例简版' },
  { text: '知识点案例详细版', link: '/考纲/论文/考纲-论文-知识点案例详细版' },
]

// 真题分析 · 四个入口：总览 / 案例 / 综合 / 论文
const zhentiHubSidebar = [
  { text: '首页', link: '/' },
  { text: '真题总览', link: '/真题分析/' },
  { text: '豆包总览', link: '/真题分析/豆包/' },
  { text: '案例真题', link: '/真题分析/案例知识点/' },
  { text: '综合真题', link: '/真题分析/综合知识点/' },
  { text: '论文真题', link: '/真题分析/论文/' },
]

// 真题分析 · 豆包（综合 / 案例分类笔记）
const zhentiDoubaoSidebar = [
  { text: '豆包总览', link: '/真题分析/豆包/' },
  {
    text: '综合科目',
    collapsed: false,
    items: [
      { text: '专业英语', link: '/真题分析/豆包/综合/专业英语' },
      { text: '企业信息化战略', link: '/真题分析/豆包/综合/企业信息化战略' },
      { text: '信息安全', link: '/真题分析/豆包/综合/信息安全' },
      { text: '操作系统', link: '/真题分析/豆包/综合/操作系统' },
      { text: '数学与经济管理', link: '/真题分析/豆包/综合/数学与经济管理' },
      { text: '数据库系统', link: '/真题分析/豆包/综合/数据库系统' },
      { text: '法律法规与标准化', link: '/真题分析/豆包/综合/法律法规与标准化' },
      { text: '系统分析与设计', link: '/真题分析/豆包/综合/系统分析与设计' },
      { text: '系统可靠性', link: '/真题分析/豆包/综合/系统可靠性' },
      { text: '系统架构设计', link: '/真题分析/豆包/综合/系统架构设计' },
      { text: '系统运行与维护', link: '/真题分析/豆包/综合/系统运行与维护' },
      { text: '计算机组成原理', link: '/真题分析/豆包/综合/计算机组成原理' },
      { text: '计算机网络', link: '/真题分析/豆包/综合/计算机网络' },
      { text: '软件工程', link: '/真题分析/豆包/综合/软件工程' },
      { text: '软件测试', link: '/真题分析/豆包/综合/软件测试' },
      { text: '需求工程', link: '/真题分析/豆包/综合/需求工程' },
      { text: '项目管理', link: '/真题分析/豆包/综合/项目管理' },
      { text: '架构设计', link: '/真题分析/豆包/综合/架构设计' },
    ],
  },
  {
    text: '案例科目',
    collapsed: false,
    items: [
      { text: 'Web应用设计', link: '/真题分析/豆包/案例/Web应用设计' },
      { text: '数据库系统与缓存设计', link: '/真题分析/豆包/案例/数据库系统与缓存设计' },
      { text: '系统安全', link: '/真题分析/豆包/案例/系统安全' },
      { text: '系统架构设计与评估', link: '/真题分析/豆包/案例/系统架构设计与评估' },
      { text: '系统设计与建模', link: '/真题分析/豆包/案例/系统设计与建模' },
    ],
  },
  { text: '返回 · 真题总览', link: '/真题分析/' },
]

const zhentiCaseSidebar = [
  { text: '真题总览', link: '/真题分析/' },
  { text: '案例真题总览', link: '/真题分析/案例知识点/' },
  { text: 'Web应用设计', link: '/真题分析/案例知识点/Web应用设计_案例真题与教材对照_2026备考' },
  { text: '数据库系统与缓存设计', link: '/真题分析/案例知识点/数据库系统与缓存设计_案例真题与教材对照_2026备考' },
  { text: '系统安全', link: '/真题分析/案例知识点/系统安全_案例真题与教材对照_2026备考' },
  { text: '系统架构设计与评估', link: '/真题分析/案例知识点/系统架构设计与评估_案例真题与教材对照_2026备考' },
  { text: '系统设计与建模', link: '/真题分析/案例知识点/系统设计与建模_案例真题与教材对照_2026备考' },
  { text: '项目管理', link: '/真题分析/案例知识点/项目管理_案例真题与教材对照_2026备考' },
]

const zhentiZongheSidebar = [
  { text: '真题总览', link: '/真题分析/' },
  { text: '综合真题总览', link: '/真题分析/综合知识点/' },
  { text: '专业英语', link: '/真题分析/综合知识点/专业英语_真题考点与教材对照_2026备考' },
  { text: '企业信息化战略', link: '/真题分析/综合知识点/企业信息化战略_真题考点与教材对照_2026备考' },
  { text: '信息安全', link: '/真题分析/综合知识点/信息安全_真题考点与教材对照_2026备考' },
  { text: '操作系统', link: '/真题分析/综合知识点/操作系统_真题考点与第02章教材对照_2026备考' },
  { text: '数学与经济管理', link: '/真题分析/综合知识点/数学与经济管理_真题考点与教材对照_2026备考' },
  { text: '数据库系统', link: '/真题分析/综合知识点/数据库系统_真题考点与教材对照_2026备考' },
  { text: '法律法规与标准化', link: '/真题分析/综合知识点/法律法规与标准化_真题考点与教材对照_2026备考' },
  { text: '系统分析与设计', link: '/真题分析/综合知识点/系统分析与设计_真题考点与教材对照_2026备考' },
  { text: '系统可靠性', link: '/真题分析/综合知识点/系统可靠性_真题考点与教材对照_2026备考' },
  { text: '系统架构设计', link: '/真题分析/综合知识点/系统架构设计_真题考点与教材对照_2026备考' },
  { text: '系统运行与维护', link: '/真题分析/综合知识点/系统运行与维护_真题考点与教材对照_2026备考' },
  { text: '计算机组成原理', link: '/真题分析/综合知识点/计算机组成原理_真题考点与第02章教材对照_2026备考' },
  { text: '计算机网络', link: '/真题分析/综合知识点/计算机网络_真题考点与第02章教材对照_2026备考' },
  { text: '软件工程', link: '/真题分析/综合知识点/软件工程_真题考点与教材对照_2026备考' },
  { text: '软件测试', link: '/真题分析/综合知识点/软件测试_真题考点与教材对照_2026备考' },
  { text: '需求工程', link: '/真题分析/综合知识点/需求工程_真题考点与教材对照_2026备考' },
  { text: '项目管理', link: '/真题分析/综合知识点/项目管理_真题考点与教材对照_2026备考' },
]

// 论文预测 · 四个入口：总览 / 预测题 / 结构化论述 / 通用模板（七篇成稿挂在总览侧栏）
const lunwenYuceHubSidebar = [
  { text: '首页', link: '/' },
  { text: '论文预测·总览', link: '/论文预测/' },
  { text: '预测题', link: '/论文预测/预测题' },
  { text: '论题案例结构化论述', link: '/论文预测/预测题_论题案例结构化论述' },
  { text: '论文成稿·通用模板', link: '/论文预测/论文成稿-通用模板' },
  {
    text: '七篇成稿',
    collapsed: false,
    items: [
      { text: '论题01 大模型及 AI Coding', link: '/论文预测/论题01_大模型及AI_Coding技术应用_论文成稿' },
      { text: '论题02 自动化测试', link: '/论文预测/论题02_自动化测试应用_论文成稿' },
      { text: '论题03 服务网格', link: '/论文预测/论题03_服务网格应用_论文成稿' },
      { text: '论题04 云原生可靠性', link: '/论文预测/论题04_云原生可靠性设计_论文成稿' },
      { text: '论题05 Kappa 架构', link: '/论文预测/论题05_大数据Kappa架构设计应用_论文成稿' },
      { text: '论题06 智能运维 AIOps', link: '/论文预测/论题06_智能运维AIOps应用_论文成稿' },
      { text: '论题07 分布式缓存', link: '/论文预测/论题07_分布式缓存技术应用实践_论文成稿' },
    ],
  },
]

// 综合知识 · 侧栏：总览 + 全科核心整理（含三科锚点）+ 短文总结（四块）
const zongheZhishiHubSidebar = [
  { text: '首页', link: '/' },
  { text: '综合知识·总览', link: '/综合知识/' },
  {
    text: '考试核心知识点整理（全科）',
    collapsed: false,
    items: [
      { text: '全文', link: '/综合知识/系统架构设计师考试核心知识点整理' },
      { text: '科目1 综合知识', link: '/综合知识/系统架构设计师考试核心知识点整理#ks-kemu1' },
      { text: '科目2 案例分析', link: '/综合知识/系统架构设计师考试核心知识点整理#ks-kemu2' },
      { text: '科目3 论文', link: '/综合知识/系统架构设计师考试核心知识点整理#ks-kemu3' },
    ],
  },
  {
    text: '综合知识总结（短文·四块）',
    collapsed: true,
    items: [
      { text: '全文', link: '/综合知识/综合知识总结' },
      { text: '工程·架构·UML', link: '/综合知识/综合知识总结#zonghe-gongcheng' },
      { text: '数据库与 Redis', link: '/综合知识/综合知识总结#zonghe-shuju' },
      { text: '分布式·网络·安全', link: '/综合知识/综合知识总结#zonghe-fenbushi' },
      { text: 'AI·项目与测试', link: '/综合知识/综合知识总结#zonghe-ai' },
    ],
  },
]

const zhentiLunwenSidebar = [
  { text: '真题总览', link: '/真题分析/' },
  { text: '论文真题总览', link: '/真题分析/论文/' },
  { text: '成稿01 ABSD', link: '/真题分析/论文/成稿01_ABSD_基于架构的软件设计' },
  { text: '成稿02 MDA', link: '/真题分析/论文/成稿02_MDA_模型驱动架构' },
  { text: '成稿03 ATAM', link: '/真题分析/论文/成稿03_ATAM_架构评估' },
  { text: '成稿04 DSSA', link: '/真题分析/论文/成稿04_DSSA_领域特定软件架构' },
  { text: '成稿05 OOA', link: '/真题分析/论文/成稿05_OOA_面向对象分析' },
  { text: '成稿06 可靠性设计与评价', link: '/真题分析/论文/成稿06_可靠性设计与评价' },
  { text: '成稿07 微服务架构与治理', link: '/真题分析/论文/成稿07_微服务架构与治理' },
  { text: '成稿08 湖仓一体与数据治理', link: '/真题分析/论文/成稿08_湖仓一体与数据治理' },
  { text: '成稿09 可观测性与SRE', link: '/真题分析/论文/成稿09_可观测性与SRE' },
  { text: '成稿10 边云协同', link: '/真题分析/论文/成稿10_边云协同' },
  { text: '成稿11 零信任与API安全', link: '/真题分析/论文/成稿11_零信任与API安全' },
  { text: '成稿12 企业集成与API经济', link: '/真题分析/论文/成稿12_企业集成与API经济' },
  { text: '成稿13 单元测试与持续集成', link: '/真题分析/论文/成稿13_单元测试与持续集成' },
  { text: '成稿14 RAG应用架构', link: '/真题分析/论文/成稿14_RAG应用架构' },
  { text: '成稿15 低代码与架构管控', link: '/真题分析/论文/成稿15_低代码与架构管控' },
]

// 计划
const planSidebar = [
  { text: '整体知识（12 章）', link: '/整体知识/' },
  { text: '30天冲刺内容', link: '/plan/30天冲刺内容' },
  { text: '每日计划-带关联', link: '/plan/每日计划-带关联' },
  { text: '英语 · 技术英语入门-计算机常用词汇', link: '/plan/英语/技术英语入门-计算机常用词汇' },
  { text: '英语 · 技术新闻短句听力-前沿科技简讯', link: '/plan/英语/技术新闻短句听力-前沿科技简讯' },
  { text: '英语 · 跟读-技术介绍-云原生可观测性', link: '/plan/英语/跟读-技术介绍-云原生可观测性' },
]

// 数据资产智能 · 四个入口：总览 / 需求 / 招标 / 模板
const dataAssetSidebar = [
  { text: '首页', link: '/' },
  { text: '数据资产智能·总览', link: '/数据资产智能/' },
  { text: '需求文档', link: '/数据资产智能/数据资产智能管理平台建设项目-PRD需求文档' },
  { text: '招标书', link: '/数据资产智能/数据资产智能管理平台建设项目（招标书完整稿）' },
  { text: '论文模板', link: '/数据资产智能/模板' },
  { text: '论文总览', link: '/数据资产智能/论文/总览' },
  { text: '正文归纳汇总', link: '/数据资产智能/论文/正文归纳汇总' },
  {
    text: '核心论文（十二篇）',
    collapsed: false,
    items: [
      { text: '1. 大模型及 AI Coding', link: '/数据资产智能/论文/1.大模型及AI_Coding技术应用' },
      { text: '2. 可靠性设计', link: '/数据资产智能/论文/2.云原生-论可靠性设计' },
      { text: '3. 服务网格', link: '/数据资产智能/论文/3.云原生-服务网格' },
      { text: '3. 服务网格·背诵版', link: '/数据资产智能/论文/服务网格-背诵版' },
      { text: '4. 大数据 Kappa', link: '/数据资产智能/论文/4.大数据Kappa架构设计应用' },
      { text: '5. 缓存技术应用', link: '/数据资产智能/论文/5.云原生-缓存技术应用' },
      { text: '6. 智能运维', link: '/数据资产智能/论文/6.智能运维AIOps应用' },
      { text: '7. 自动化测试', link: '/数据资产智能/论文/7.自动化测试应用' },
      { text: '8. 可靠性测试', link: '/数据资产智能/论文/8.可靠性测试' },
      { text: '9. 存储计算分离', link: '/数据资产智能/论文/9.云原生-存储计算分离应用实践' },
      { text: '10. 可观测性设计', link: '/数据资产智能/论文/10.云原生-可观测性设计实践' },
      { text: '11. 容器化技术', link: '/数据资产智能/论文/11.云原生-容器化技术应用' },
      { text: '12. 消息中间件', link: '/数据资产智能/论文/12.云原生-消息中间件技术应用' },
    ],
  },
  {
    text: '其他文档',
    collapsed: false,
    items: [
      { text: 'TOGAF架构', link: '/数据资产智能/TOGAF架构' },
      { text: 'TOGAF架构方法', link: '/数据资产智能/TOGAF架构方法' },
      { text: '补充智能部分', link: '/数据资产智能/补充智能部分' },
      { text: '招标书简版', link: '/数据资产智能/招标书' },
    ]
  }
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
  { text: '综合知识（四入口）', collapsed: true, items: zongheZhishiHubSidebar },
  { text: '整体知识', link: '/整体知识/' },
  { text: '背诵要点', link: '/论文/论文模板背诵要点表格' },
  { text: '论文专题', collapsed: false, items: paperSidebar },
  { text: '案例速记', collapsed: false, items: caseSidebar },
  { text: '选择题库（四入口）', collapsed: false, items: choiceWithExamHubSidebar },
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
      {
        text: '论文预测',
        items: [
          { text: '预测·总览', link: '/论文预测/' },
          { text: '预测·题目', link: '/论文预测/预测题' },
          { text: '预测·论述', link: '/论文预测/预测题_论题案例结构化论述' },
          { text: '预测·模板', link: '/论文预测/论文成稿-通用模板' },
        ],
      },
      {
        text: '考纲',
        items: [
          { text: '考纲总览', link: '/考纲/' },
          { text: '考纲·案例', link: '/考纲/案例/' },
          { text: '考纲·综合', link: '/考纲/综合/' },
          { text: '考纲·论文', link: '/考纲/论文/' },
        ],
      },
      {
        text: '真题分析',
        items: [
          { text: '真题总览', link: '/真题分析/' },
          { text: '真题·豆包', link: '/真题分析/豆包/' },
          { text: '案例真题', link: '/真题分析/案例知识点/' },
          { text: '综合真题', link: '/真题分析/综合知识点/' },
          { text: '论文真题', link: '/真题分析/论文/' },
        ],
      },
      {
        text: '综合知识',
        items: [
          { text: '综合知识·总览', link: '/综合知识/' },
          { text: '核心整理·全科', link: '/综合知识/系统架构设计师考试核心知识点整理' },
          { text: '核心整理·科目1', link: '/综合知识/系统架构设计师考试核心知识点整理#ks-kemu1' },
          { text: '核心整理·科目2', link: '/综合知识/系统架构设计师考试核心知识点整理#ks-kemu2' },
          { text: '核心整理·科目3', link: '/综合知识/系统架构设计师考试核心知识点整理#ks-kemu3' },
          { text: '总结·工程·架构·UML', link: '/综合知识/综合知识总结#zonghe-gongcheng' },
          { text: '总结·数据库与 Redis', link: '/综合知识/综合知识总结#zonghe-shuju' },
          { text: '总结·分布式·网络·安全', link: '/综合知识/综合知识总结#zonghe-fenbushi' },
          { text: '总结·AI·项目与测试', link: '/综合知识/综合知识总结#zonghe-ai' },
        ],
      },
      {
        text: '知识素材',
        items: [
          { text: '整体知识', link: '/整体知识/' },
          { text: '知识图谱', link: '/知识/' },
          { text: '论文专题', link: '/论文/' },
          { text: '案例速记', link: '/案例/' },
        ],
      },
      {
        text: '选择题库',
        items: [
          { text: '选择·总览', link: '/选择-含真题/' },
          { text: '选择·01–08', link: '/选择-含真题/01-软件工程概述-考点速记' },
          { text: '选择·09–12', link: '/选择-含真题/09-计算机组成原理-考点速记' },
          { text: '选择·13–14', link: '/选择-含真题/13-信息安全-考点速记' },
        ],
      },
      { text: '复习计划', link: '/plan/30天冲刺内容' },
      {
        text: '数据资产',
        items: [
          { text: '资产·总览', link: '/数据资产智能/' },
          { text: '资产·正文归纳', link: '/数据资产智能/论文/正文归纳汇总' },
          { text: '资产·需求', link: '/数据资产智能/数据资产智能管理平台建设项目-PRD需求文档' },
          { text: '资产·招标', link: '/数据资产智能/数据资产智能管理平台建设项目（招标书完整稿）' },
          { text: '资产·模板', link: '/数据资产智能/模板' },
        ],
      },
    ],
    sidebar: {
      '/综合知识/': zongheZhishiHubSidebar,
      '/数据资产智能/': dataAssetSidebar,
      '/论文预测/': lunwenYuceHubSidebar,
      '/真题分析/案例知识点/': zhentiCaseSidebar,
      '/真题分析/综合知识点/': zhentiZongheSidebar,
      '/真题分析/论文/': zhentiLunwenSidebar,
      '/真题分析/豆包/': zhentiDoubaoSidebar,
      '/真题分析/': zhentiHubSidebar,
      '/考纲/案例/': kaogangCaseSidebar,
      '/考纲/综合/': kaogangZongheSidebar,
      '/考纲/论文/': kaogangLunwenSidebar,
      '/考纲/': kaogangHubSidebar,
      '/整体知识/': holisticKnowledgeSidebar,
      '/知识/': knowledgeSidebar,
      '/论文/': paperSidebar,
      '/案例/': caseSidebar,
      '/选择/': choiceSidebar,
      '/选择-含真题/': choiceWithExamSidebar,
      '/plan/': planSidebar,
      '/': [
        { text: '首页', link: '/' },
        { text: '综合知识（四入口）', collapsed: true, items: zongheZhishiHubSidebar },
        { text: '数据资产智能（四入口）', collapsed: false, items: dataAssetSidebar },
        { text: '论文预测（四入口）', collapsed: false, items: lunwenYuceHubSidebar },
        { text: '真题分析', collapsed: false, items: zhentiHubSidebar },
        { text: '考纲知识点', collapsed: false, items: kaogangHubSidebar },
        { text: '整体知识', collapsed: false, items: holisticKnowledgeSidebar },
        { text: '背诵要点', link: '/论文/论文模板背诵要点表格' },
        { text: '知识图谱', collapsed: false, items: knowledgeSidebar },
        { text: '论文专题', collapsed: false, items: paperSidebar },
        { text: '案例速记', collapsed: false, items: caseSidebar },
        { text: '选择题库（四入口）', collapsed: false, items: choiceWithExamHubSidebar },
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
