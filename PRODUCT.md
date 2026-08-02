# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

小李与希宝两个人，在手机或电脑上记录恋爱生活、计划、日记、照片、做过的菜，并查找可实际照做的完整菜谱。

## Product Purpose

这是两个人私密使用的恋爱纪念站。成功意味着日常记录容易保存和回看，食谱能够像完整烹饪工具一样搜索、阅读和收藏，而不是只做展示。

## Positioning

把两个人的恋爱记录与可执行的 HowToCook 菜谱库放在同一个私人空间里，查到的菜可以直接记入两个人自己的食谱日记。

## Operating Context

网站使用密码 `0616` 登录，主要在手机端使用，也需要兼容桌面端。部署在 Vercel，生产域名包括 `lovelx.top` 与 `li-luo-love.vercel.app`。

## Capabilities and Constraints

- 保留首页、计划书、恋爱日记、食谱日记、照片墙、音乐播放器与星座运势。
- 保持静态前端与 Vercel Serverless API 架构，不迁移到常驻服务器或共享数据库。
- 食谱来源为 Anduin2017/HowToCook，真实菜谱数为 368；食谱内容许可证为 Unlicense。
- 食谱浏览体验以 MIT 开源的 AiursoftWeb/HowToCookViewer 为功能与界面参考。
- 收藏和个人记录保存在当前浏览器，本阶段不承诺跨设备同步、共享评论或共享点赞。

## Brand Commitments

保持现有温暖、可爱、私密的恋爱站气质，以及小白和小鸡毛的角色资产。食谱工具可以提高信息密度，但不能像独立后台一样割裂出站点。

## Evidence on Hand

- 现有产品实现：`index.html`、`css/style.css`、`js/app.js`。
- 角色与页面图片位于 `images/`。
- HowToCook 完整公开菜谱可通过现有 Vercel API 获取。
- HowToCookViewer 源码仓库公开，许可证为 MIT。

## Product Principles

- 真实可用优先于装饰性展示。
- 完整内容优先于少量精选演示。
- 手机与桌面都必须能完成核心任务。
- 外部数据失败时保留明确、可恢复的降级体验。
- 保留来源与许可证说明。

## Accessibility & Inclusion

核心操作需要键盘可达、动态状态可被辅助技术读取，手机端不得横向溢出，并尊重减少动态效果设置。
