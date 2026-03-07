import { defineConfig } from 'vitepress'

const sidebar = [
  { text: '首页', link: '/' },
  { text: '1. 开发方法', link: '/1.开发方法' },
  { text: '2. 架构设计', link: '/2.架构设计' },
  { text: '3. 分布式与高并发', link: '/3.分布式与高并发' },
  { text: '4. 面向服务架构', link: '/4.面向服务架构' },
  { text: '5. 云原生架构', link: '/5.云原生架构' },
  { text: '6. 软件测试与质量保证', link: '/6.软件测试与质量保证' },
  { text: '7. 需求工程', link: '/7.需求工程' },
  { text: '8. 系统设计', link: '/8.系统设计' },
  { text: '9. 系统运维', link: '/9.系统运维' },
  { text: '10. 数据与集成', link: '/10.数据与集成' },
]

// 部署到 GitHub Pages 项目站时为 /仓库名/，本地或自定义域名时为 /
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  srcDir: '.',
  outDir: 'dist',
  base,
  title: '论文素材',
  description: '系统架构与软件工程：开发方法、架构设计、分布式、面向服务、云原生、测试、需求、系统设计、运维与数据集成',
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
      { text: '文档', link: '/1.开发方法' },
    ],
    sidebar,
    outline: [2, 4],
    socialLinks: [],
    footer: {
      message: '论文素材 · 系统架构与软件工程',
      copyright: '仅供学习与论文参考',
    },
    docFooter: { prev: '上一篇', next: '下一篇' },
    // 本地搜索需 VitePress 2.x 或 @vitepress/plugin-search
    mobile: true,
  },
  markdown: {
    lineNumbers: false,
  },
  ignoreDeadLinks: true,
  vite: {
    // 兼容 Web 与 App 内浏览器
    build: {
      target: 'esnext',
      cssTarget: 'chrome61',
    },
  },
})
