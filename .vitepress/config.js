import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

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

// 论文 · 系统架构与软件工程（10 章 + 首页）
const paperSidebar = [
  { text: '论文总览', link: '/论文/' },
  { text: '1. 开发方法', link: '/论文/1.开发方法' },
  { text: '2. 架构设计', link: '/论文/2.架构设计' },
  { text: '3. 分布式与高并发', link: '/论文/3.分布式与高并发' },
  { text: '4. 面向服务架构', link: '/论文/4.面向服务架构' },
  { text: '5. 云原生架构', link: '/论文/5.云原生架构' },
  { text: '6. 软件测试与质量保证', link: '/论文/6.软件测试与质量保证' },
  { text: '7. 需求工程', link: '/论文/7.需求工程' },
  { text: '8. 系统设计', link: '/论文/8.系统设计' },
  { text: '9. 系统运维', link: '/论文/9.系统运维' },
  { text: '10. 数据与集成', link: '/论文/10.数据与集成' },
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

// 论文背诵版 · 云原生（10 篇论文成稿，含 Mermaid 架构图）
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
]

const paperReciteSidebar = [
  { text: '论文背诵版', link: '/论文背诵版/' },
  { text: '云原生（10 篇）', collapsed: false, items: cloudNativeSidebar },
]

// 可观测 · 产品需求与设计（位于论文背诵版/云原生/可观测）
const observabilitySidebar = [
  { text: '可观测总览', link: '/论文背诵版/云原生/可观测/' },
  { text: '产品需求设计文档 - 航空运营智能管理平台可观测性', link: '/论文背诵版/云原生/可观测/产品需求设计文档-航空运营智能管理平台可观测性' },
  { text: '架构技术设计方案 - 航空运营智能管理平台可观测性', link: '/论文背诵版/云原生/可观测/架构技术设计方案-航空运营智能管理平台可观测性' },
  { text: '案例 - 问题、方案与成效', link: '/论文背诵版/云原生/可观测/案例-问题方案与成效-航空运营智能管理平台可观测性' },
]

const sidebar = [
  { text: '首页', link: '/' },
  { text: '案例', collapsed: false, items: caseSidebar },
  { text: '论文', collapsed: false, items: paperSidebar },
  { text: '论文背诵版', collapsed: false, items: paperReciteSidebar },
  { text: '选择', collapsed: false, items: choiceSidebar },
  { text: '计划', collapsed: false, items: planSidebar },
]

// 部署到 GitHub Pages 项目站时为 /仓库名/，本地或自定义域名时为 /
const base = process.env.BASE_PATH || '/'

export default withMermaid(defineConfig({
  srcDir: '.',
  srcExclude: ['**/*-raw.md', '**/_docx_extract/**', '**/extract_docx.py', '**/node_modules/**'],
  outDir: 'dist',
  base,
  title: '论文素材',
  description: '系统架构与软件工程：案例、论文、选择考点速记',
  lang: 'zh-CN',
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes' }],
    ['meta', { name: 'theme-color', content: '#2d7ff9' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['link', { rel: 'stylesheet', href: '/custom.css' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '案例', link: '/案例/' },
      { text: '论文', link: '/论文/' },
      { text: '论文背诵版', link: '/论文背诵版/' },
      { text: '云原生', link: '/论文背诵版/云原生/' },
      { text: '选择', link: '/选择/' },
      { text: '计划', link: '/plan/30天冲刺内容' },
    ],
    sidebar,
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
  // Mermaid 图表：站点内 ```mermaid 代码块可正常渲染，随主题切换亮/暗色
  mermaid: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#2d7ff9',
      primaryTextColor: '#1a1a1a',
      primaryBorderColor: '#2d7ff9',
      lineColor: '#4a4a4a',
      secondaryColor: '#e8f0fe',
      tertiaryColor: '#f0f4f8',
    },
  },
  mermaidPlugin: {
    class: 'mermaid-wrap',
  },
}))
