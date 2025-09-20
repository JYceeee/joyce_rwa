# RWA网站CSS设计报告

## 项目概述
本项目是一个基于Vue.js的房地产代币化投资平台，采用现代化的深色主题设计，为用户提供专业的投资管理界面。

## 主要颜色系统

### 核心颜色
```css
:root {
  --bg: #0A0A1A;           /* 主背景色 - 深蓝黑色 */
  --text: #FFFFFF;         /* 主文字色 - 纯白色 */
  --muted: #8ca0c3;        /* 次要文字色 - 灰蓝色 */
  --brand: #181830;        /* 品牌色 - 深蓝色 */
  --brand-600: #23234a;    /* 品牌色变体 - 中等蓝色 */
  --brand-700: #23234a;    /* 品牌色变体 - 深蓝色 */
  --card: rgba(20, 20, 40, 0.98);  /* 卡片背景 - 半透明深色 */
  --border: #23234a;       /* 边框色 - 深蓝色 */
  --ring: #7dc4ff;         /* 焦点环色 - 亮蓝色 */
  --orange: #EAAB8D;       /* 强调色 - 橙色 */
}
```

### 页面特定颜色
```css
/* 头部导航 */
.header {
  background: #141426;     /* 头部背景色 */
}

/* 卡片组件 */
.card {
  background: var(--card); /* 卡片背景 */
  border: 1px solid #2a2a4a;  /* 卡片边框 */
}

/* 侧边栏 */
.sidebar {
  background: var(--bg);   /* 侧边栏背景 */
  border-right: 1px solid #2a2a4a;  /* 侧边栏边框 */
}

/* 表单输入框 */
.form-group input {
  background: #141426;     /* 输入框背景 */
  border: 1px solid #2a2a4a;  /* 输入框边框 */
}

/* 按钮颜色 */
.btn.primary {
  background: var(--brand);  /* 主要按钮背景 */
  color: #fff;               /* 主要按钮文字 */
}

.btn.primary:hover {
  background: var(--brand-700);  /* 主要按钮悬停 */
}
```

### 悬停和焦点状态
```css
/* 导航链接悬停 */
.menu a:hover {
  color: var(--text);      /* 导航悬停文字色 */
}

/* 侧边栏项目悬停 */
.sidebar-item:hover {
  background: var(--brand-600);  /* 侧边栏悬停背景 */
  border-left-color: var(--brand);  /* 侧边栏悬停边框 */
}

/* 表单焦点状态 */
.form-group input:focus {
  border-color: #f97316;   /* 输入框焦点边框 */
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);  /* 焦点阴影 */
}
```

## 颜色使用总结

### 主要颜色用途
- #0A0A1A** (--bg): 页面主背景色
- #FFFFFF** (--text): 主要文字颜色
- #8ca0c3** (--muted): 次要文字颜色
- #181830** (--brand): 品牌色，用于按钮和强调元素
- #23234a** (--border): 边框和分割线颜色
- #141426**: 头部导航和输入框背景色
- #f97316**: 焦点状态和重要提示颜色
