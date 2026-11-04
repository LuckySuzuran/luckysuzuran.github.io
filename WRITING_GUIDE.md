# 写作与维护指南

这是一个不依赖自定义 Ruby 插件的 Jekyll 个人网站。页面使用 Liquid 模板，文章使用 Markdown，论文使用 YAML 数据。技术博客和生活博客共用一套排版与媒体组件。

## 1. 本地预览

先安装 Ruby 与 Bundler。Windows 推荐使用带 Devkit 的 RubyInstaller，并完成安装程序提示的开发工具安装。然后在本项目目录运行：

```sh
bundle install
bundle exec jekyll serve
```

浏览器打开终端显示的地址，通常为 `http://127.0.0.1:4000`。修改 `_config.yml` 后需要停止并重新启动服务。正式构建可运行：

```sh
bundle exec jekyll build --strict_front_matter
```

可选的源码检查只需要 Node.js，不会取代 Jekyll 构建：

```sh
node scripts/check-source.mjs
```

若文章日期在未来，本地可临时使用 `bundle exec jekyll serve --future` 预览；正常发布不会显示未来文章。

## 2. 修改个人信息

编辑 `_config.yml`：

```yaml
title: "张三"
email: "hello@example.com"
description: "研究、技术笔记与生活记录。"
url: "https://yourusername.github.io"
baseurl: ""
author:
  name: "张三"
  role: "你的研究方向或当前职位"
  avatar: /assets/images/avatar.webp
  location: "中国 · 上海"
social:
  github: "https://github.com/yourusername"
  scholar: "https://scholar.google.com/citations?user=你的ID"
  orcid: ""
```

将自己的头像放进 `assets/images/`，更新 `avatar` 路径。方形图片效果最好；页面以 160 × 160 像素的圆形头像显示。修改 `index.md` 中的简介、研究兴趣、News、Education 和 Experience。当前人物、教育经历和论文都是待替换的示例，不代表真实履历。

`social` 中不使用的链接设为 `""` 即可隐藏。`lang` 可以改为 `zh-CN`，单篇文章也可单独设置 `lang: zh-CN`。如需全中文界面，可直接修改页面和 `_includes/header.html` 中的文案。

## 3. 添加论文

在 `_data/publications.yml` 中添加一条记录。列表的顺序就是页面的顺序，建议按年份从新到旧排列：

```yaml
- title: "你的论文标题"
  authors: "张三, 李四, and 王五"
  venue: "会议或期刊名称"
  year: 2026
  tags: [LLM, RL]
  pdf: "https://example.com/paper.pdf"
  code: "https://github.com/yourusername/project"
  abstract: >-
    在这里填写摘要。可以在 YAML 中分多行书写，
    页面会将这些行作为一个自然段呈现。
  bibtex: |
    @article{zhang2026example,
      title   = {你的论文标题},
      author  = {Zhang, San and Li, Si},
      journal = {期刊名称},
      year    = {2026}
    }
```

- `authors` 中与 `_config.yml` 的 `author.name` 完全一致的名字会自动加粗，无需嵌入 HTML。
- 标签按钮根据所有论文的 `tags` 自动生成。标签大小写敏感，不要使用保留筛选名 `All`，也不要在标签中使用逗号。
- 未公开 PDF 或代码时，填写 `pdf: ""` 或 `code: ""`。页面显示灰色占位文字，不会产生无效链接。
- PDF 可以使用站内路径，例如 `/assets/papers/paper.pdf`，也可以使用完整 HTTPS URL。
- `[Abstract]` 与 `[BibTeX]` 可独立展开。没有 JavaScript 时，仍可以使用原生折叠组件阅读。
- YAML 使用空格缩进，不要使用 Tab。含有冒号的标题最好加引号。

## 4. 写一篇文章

在 `_posts/` 下新建文件，格式必须为 `YYYY-MM-DD-slug.md`。文件开头用两行 `---` 包围 Front Matter。

技术文章示例：

```yaml
---
layout: post
title: "理解注意力机制"
date: 2026-03-03 10:00:00 +0800
category: tech
tags: [LLM, Notes]
math: true
lang: zh-CN
description: "从一个小例子理解注意力。"
---
```

生活文章示例：

```yaml
---
layout: post
title: "周末的游戏与散步"
date: 2026-03-04 18:00:00 +0800
category: life
tags: [Game, Review, Travel]
description: "记录一个不赶时间的周末。"
---
```

正文写在第二条 `---` 后。`category` 必须为单个 `tech` 或 `life`，否则不会进入这两个归档页。`description` 用作列表简介和页面摘要。没有 `description` 时，生活博客会从正文提取短摘要。归档按日期倒序并按年分组。

文章地址默认是 `/blog/年/月/日/slug/`。修改已发布文章的文件名可能改变地址，建议发布后保持稳定。

### 代码与数学公式

使用带语言名称的代码围栏，例如三个反引号后写 `python`。Rouge 在构建时生成语法高亮，不需要浏览器下载额外的代码高亮库。

`math: true` 时才会加载 KaTeX。行内公式写成 `$E = mc^2$`，独立公式写成：

```text
$$
\theta_{t+1} = \theta_t - \eta \nabla L(\theta_t)
$$
```

复杂公式建议放在单独的段落中。代码块里的美元符号不会参与数学渲染。数学文章中展示金额可写 `&#36;20`，避免被当作公式边界。KaTeX 与图片缩放库从 CDN 加载，访客首次使用需要网络；网络失败时正文和原始公式仍可阅读。

## 5. 图片、GIF 与 WebP

建议按文章分文件夹，例如 `assets/images/2026-weekend/`。使用小写英文文件名和连字符，尽量避免空格。

普通 Markdown 图片：

```liquid
![山间湖泊]({{ '/assets/images/quiet-landscape.svg' | relative_url }})
![循环动画]({{ '/assets/images/demo.gif' | relative_url }})
```

`.jpg`、`.png`、`.svg`、`.gif`、`.webp` 均使用相同语法。`relative_url` 会自动加上项目站的 `baseurl`。不要把这个过滤器省掉，也不要手动再拼接一次 `baseurl`。

带宽度和说明的图片：

```liquid
{% include figure.html src="/assets/images/demo.gif" alt="山间日落动画" caption="图 1：慢一点看风景。" width="85%" %}
```

带说明的 WebP（先放入自己的图片文件）：

```liquid
{% include figure.html src="/assets/images/2026-weekend/photo.webp" alt="照片内容的具体描述" caption="拍摄地点与说明。" width="90%" %}
```

`width` 可省略，默认占满阅读区，也可以是 `600px`。图片保持原始比例，自动使用圆角、阴影和懒加载。正文中的图片与 GIF 支持点击缩放；键盘可 Tab 聚焦后按 Enter 或空格打开，按 Escape 关闭。添加 `data-no-zoom` 的 HTML 图片可退出缩放功能。

## 6. 使用循环视频代替大 GIF

把静音 MP4 或 WebM 放到 `assets/images/`，然后使用：

```liquid
{% include gif_video.html src="/assets/images/clip.mp4" alt="角色跑步的循环动画" caption="图 2：循环动作演示。" width="90%" %}
```

也可以使用 WebM 与可选的封面图：

```liquid
{% include gif_video.html src="/assets/images/clip.webm" poster="/assets/images/clip-poster.webp" caption="循环视频，点击播放器控件可以暂停。" width="85%" %}
```

组件包含 `autoplay loop muted playsinline preload="metadata"`，支持手机内联播放并保留暂停控件。部分浏览器可能限制自动播放，此时点击播放即可。启用系统“减少动态效果”时，JavaScript 会暂停自动播放，读者仍可手动启动。

仓库自带的 `demo.gif` 是一个小型原创动画。示例文章的 MP4 使用 MDN 的外部 CC0 素材，需要网络；换成自己的本地文件后就不依赖该素材服务器。不要把一个尚不存在的本地文件路径直接发布。

可选：若已安装 FFmpeg，可以把 GIF 转换为兼容浏览器的 MP4：

```sh
ffmpeg -i input.gif -an -c:v libx264 -pix_fmt yuv420p -movflags +faststart -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" assets/images/clip.mp4
```

## 7. 发布到 GitHub Pages

1. 在 GitHub 创建名为 `<username>.github.io` 的仓库，把 `<username>` 换成你的 GitHub 用户名。
2. 更新 `_config.yml` 中的 `url`，个人主页的 `baseurl` 保持 `""`。
3. 在本项目目录执行（本仓库已初始化 Git，无需再次初始化）：

```sh
git add .
git commit -m "Build personal Jekyll website"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

如果已经配置 `origin`，使用 `git remote set-url origin ...` 更新地址。首次提交前若 Git 提示身份未配置，请按提示设置你的 `user.name` 与 `user.email`。

4. 在仓库 **Settings → Pages → Build and deployment** 中选择 **Deploy from a branch**，分支选择 `main`、目录选择 `/ (root)`，保存。
5. 等待 GitHub 的 Pages 构建完成，访问 `https://<username>.github.io/`。之后每次推送都会触发更新；在 Actions 中可以查看构建日志。

项目站（如 `https://<username>.github.io/my-blog/`）需要设置：

```yaml
url: "https://<username>.github.io"
baseurl: "/my-blog"
```

本地检查项目站路径：

```sh
bundle exec jekyll serve --baseurl /my-blog
```

不要添加 `.nojekyll` 文件，否则 GitHub Pages 会跳过 Jekyll 处理。

## 8. 发布前检查

- 替换头像、姓名、邮箱、GitHub 用户名和所有示例履历、论文。
- 在手机宽度下检查导航、长标题、公式、表格和媒体。
- 检查每个 PDF、代码地址以及所有图片路径，路径大小写需要一致。
- 分别打开技术与生活文章；确认公式、代码高亮、图片缩放与循环视频。
- 运行 `bundle exec jekyll build --strict_front_matter`，确认无构建错误。
- 不提交 `_site/`、密钥或超大原始视频。构建产物和常见本地缓存已加入 `.gitignore`。

参考：[Jekyll 文档](https://jekyllrb.com/docs/)、[GitHub Pages](https://pages.github.com/)、[KaTeX 自动渲染](https://katex.org/docs/autorender)。
