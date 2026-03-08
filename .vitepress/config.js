import { defineConfig } from 'vitepress'

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
]

const sidebar = [
  { text: '首页', link: '/' },
  { text: '案例', collapsed: false, items: caseSidebar },
  { text: '论文', collapsed: false, items: paperSidebar },
  { text: '选择', collapsed: false, items: choiceSidebar },
  { text: '计划', collapsed: false, items: planSidebar },
]

// 部署到 GitHub Pages 项目站时为 /仓库名/，本地或自定义域名时为 /
const base = process.env.BASE_PATH || '/'

export default defineConfig({
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
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '案例', link: '/案例/' },
      { text: '论文', link: '/论文/' },
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
})
