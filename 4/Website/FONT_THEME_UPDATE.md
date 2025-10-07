# 浅色主题黑体字更新

## 更新内容

### 1. 主题配置更新 (`useTheme.js`)

#### 深色主题字体配置
```javascript
'--heading-font': 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
'--heading-weight': '700'
```

#### 浅色主题字体配置
```javascript
'--heading-font': 'SimHei, "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif',
'--heading-weight': '900'
```

### 2. 全局样式更新 (`style.css`)

#### 添加字体变量到根样式
```css
:root {
  /* 字体变量 */
  --heading-font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  --heading-weight: 700;
}
```

#### 大标题样式规则
```css
/* 大标题样式 - 根据主题应用不同字体 */
h1, h2, h3, h4, h5, h6,
.main-title, .sidebar-title, .section-title,
.headline, .page-title, .hero-title {
  font-family: var(--heading-font);
  font-weight: var(--heading-weight);
  transition: font-family 0.3s ease, font-weight 0.3s ease;
}

/* 确保所有标题元素都使用主题字体 */
.title, .heading, .header-title {
  font-family: var(--heading-font);
  font-weight: var(--heading-weight);
}
```

## 字体效果对比

### 深色主题
- **字体**：系统默认字体栈（ui-sans-serif, system-ui 等）
- **字重**：700 (Bold)
- **效果**：现代简洁的系统字体，适合深色背景

### 浅色主题
- **字体**：黑体字栈（SimHei, Microsoft YaHei, PingFang SC 等）
- **字重**：900 (Black/Extra Bold)
- **效果**：粗黑体字，在浅色背景上更加醒目和有力

## 字体栈说明

### 浅色主题字体优先级
1. **SimHei** - 黑体（Windows 中文系统）
2. **Microsoft YaHei** - 微软雅黑（Windows 现代系统）
3. **PingFang SC** - 苹方（macOS 中文系统）
4. **Hiragino Sans GB** - 冬青黑体（macOS 旧版）
5. **sans-serif** - 系统默认无衬线字体（备用）

## 影响的元素

以下元素会在主题切换时自动应用相应的字体：

### HTML 标题标签
- `<h1>` - 主标题
- `<h2>` - 二级标题
- `<h3>` - 三级标题
- `<h4>` - 四级标题
- `<h5>` - 五级标题
- `<h6>` - 六级标题

### CSS 类名
- `.main-title` - 主标题
- `.sidebar-title` - 侧边栏标题
- `.section-title` - 章节标题
- `.headline` - 头条标题
- `.page-title` - 页面标题
- `.hero-title` - 英雄区标题
- `.title` - 通用标题
- `.heading` - 通用标题
- `.header-title` - 头部标题

## 过渡效果

- **字体切换**：0.3s 平滑过渡
- **字重变化**：0.3s 平滑过渡
- **用户体验**：无闪烁，自然过渡

## 测试步骤

1. **访问网站**：打开任意页面
2. **查看深色主题**：确认标题使用系统字体，字重为 700
3. **切换到浅色主题**：
   - 进入设置页面 `/settings`
   - 在"常规设置"中选择"浅色"
4. **验证字体变化**：
   - 所有大标题应该变为黑体字
   - 字重应该变为 900（更粗）
   - 字体应该有平滑的过渡效果

## 兼容性

### 字体支持
- ✅ **Windows**：SimHei, Microsoft YaHei
- ✅ **macOS**：PingFang SC, Hiragino Sans GB
- ✅ **Linux**：sans-serif 备用
- ✅ **移动端**：各平台原生中文字体

### 浏览器支持
- ✅ **Chrome**：完全支持
- ✅ **Firefox**：完全支持
- ✅ **Safari**：完全支持
- ✅ **Edge**：完全支持

## 预期效果

### 深色主题
- 标题使用系统默认字体，保持现代简洁风格
- 字重适中，不会过于厚重

### 浅色主题
- 标题使用黑体字，更加醒目有力
- 字重更粗，在浅色背景上对比度更高
- 符合中文阅读习惯，增强可读性
