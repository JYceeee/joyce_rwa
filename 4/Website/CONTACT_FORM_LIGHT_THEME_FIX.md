# 联系我们页面表单浅色主题修复

## 问题描述

在浅色主题下，联系我们页面的表单存在以下问题：
1. **文字颜色问题**：表单标签和输入文字使用白色，在浅色主题下不可见
2. **输入框边框问题**：输入框边框使用浅色，在浅色主题下缺乏对比度
3. **占位符文字问题**：占位符文字颜色不随主题变化
4. **焦点状态问题**：焦点状态的边框和背景色不随主题变化

## 解决方案

### 1. 表单标签文字颜色修复

#### ✅ **标签文字颜色**
```css
/* 修复前 */
.form-group label {
  color: #ffffff;
}

/* 修复后 */
.form-group label {
  color: var(--text);
}
```

**效果**：
- **深色主题**：白色文字在深色背景上清晰可见
- **浅色主题**：黑色文字在浅色背景上清晰可见

### 2. 输入框样式修复

#### ✅ **输入框背景和边框**
```css
/* 修复前 */
.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* 修复后 */
.form-group input,
.form-group select,
.form-group textarea {
  background: var(--form-bg);
  border: 1px solid var(--border);
  color: var(--text);
}
```

**效果**：
- **深色主题**：半透明白色背景，浅色边框，白色文字
- **浅色主题**：浅灰色背景，深灰色边框，黑色文字

### 3. 占位符文字颜色修复

#### ✅ **占位符文字**
```css
/* 修复前 */
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #64748b;
}

/* 修复后 */
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-secondary);
}
```

**效果**：
- **深色主题**：浅灰色占位符文字
- **浅色主题**：深灰色占位符文字

### 4. 焦点状态修复

#### ✅ **输入框焦点状态**
```css
/* 修复前 */
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #141426;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(20, 20, 38, 0.3);
}

/* 修复后 */
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--brand);
  background: var(--hover-bg);
  box-shadow: 0 0 0 3px var(--ring);
}
```

**效果**：
- **深色主题**：深色边框，稍亮的背景，深色阴影
- **浅色主题**：橙色边框，浅灰色背景，蓝色阴影

### 5. 下拉菜单选项修复

#### ✅ **下拉菜单选项**
```css
/* 修复前 */
.form-group select option {
  background: #1a1a2e !important;
  color: #ffffff !important;
}

.form-group select option:hover {
  background: #16213e !important;
}

.form-group select option:checked {
  background: #141426 !important;
}

/* 修复后 */
.form-group select option {
  background: var(--modal-bg) !important;
  color: var(--text) !important;
}

.form-group select option:hover {
  background: var(--hover-bg) !important;
}

.form-group select option:checked {
  background: var(--brand) !important;
  color: var(--text) !important;
}
```

**效果**：
- **深色主题**：深色背景选项，悬停和选中状态有适当对比
- **浅色主题**：白色背景选项，悬停和选中状态有清晰区分

### 6. 提交按钮修复

#### ✅ **提交按钮样式**
```css
/* 修复前 */
.send-message-btn {
  background: #141426;
  border: 1px solid #141426;
  color: #ffffff;
}

.send-message-btn:hover:not(:disabled) {
  background: #1a1a2e;
  border-color: #1a1a2e;
  box-shadow: 0 8px 25px rgba(20, 20, 38, 0.4);
}

/* 修复后 */
.send-message-btn {
  background: var(--brand);
  border: 1px solid var(--brand);
  color: var(--text);
}

.send-message-btn:hover:not(:disabled) {
  background: var(--brand-600);
  border-color: var(--brand-600);
  box-shadow: 0 8px 25px var(--shadow);
}
```

**效果**：
- **深色主题**：深色按钮背景，悬停时更亮的深色
- **浅色主题**：橙色按钮背景，悬停时更深的橙色

## 主题变量映射

### ✅ **使用的主题变量**
```css
/* 文字颜色 */
color: var(--text);                    /* 主文字：深色主题白色，浅色主题黑色 */
color: var(--text-secondary);          /* 次要文字：占位符文字 */

/* 背景颜色 */
background: var(--form-bg);            /* 表单背景：深色主题半透明，浅色主题浅灰 */
background: var(--hover-bg);           /* 悬停背景：焦点状态和悬停效果 */
background: var(--modal-bg);           /* 模态框背景：下拉菜单选项 */

/* 边框颜色 */
border: 1px solid var(--border);       /* 主边框：深色主题浅色，浅色主题深灰色 */
border-color: var(--brand);            /* 品牌色边框：焦点状态 */

/* 阴影效果 */
box-shadow: 0 0 0 3px var(--ring);     /* 焦点环：深色主题深色，浅色主题蓝色 */
box-shadow: 0 8px 25px var(--shadow);  /* 按钮阴影：主题阴影 */

/* 按钮颜色 */
background: var(--brand);              /* 品牌色背景：深色主题深色，浅色主题橙色 */
background: var(--brand-600);          /* 品牌色变体：悬停状态 */
```

## 视觉效果对比

### ✅ **深色主题效果**
- **表单标签**：白色文字清晰可见 ✅
- **输入框**：半透明白色背景，浅色边框 ✅
- **占位符**：浅灰色文字 ✅
- **焦点状态**：深色边框，稍亮背景 ✅
- **按钮**：深色背景，悬停效果明显 ✅

### ✅ **浅色主题效果**
- **表单标签**：黑色文字清晰可见 ✅
- **输入框**：浅灰色背景，深灰色边框 ✅
- **占位符**：深灰色文字 ✅
- **焦点状态**：橙色边框，浅灰色背景 ✅
- **按钮**：橙色背景，悬停效果明显 ✅

## 技术实现

### 1. 表单样式层次

#### **标准表单样式**
```css
.form-group label {
  color: var(--text);              /* 主题文字色 */
}

.form-group input,
.form-group select,
.form-group textarea {
  background: var(--form-bg);      /* 表单背景 */
  border: 1px solid var(--border); /* 主题边框 */
  color: var(--text);              /* 主题文字色 */
}

.form-group input::placeholder {
  color: var(--text-secondary);    /* 次要文字色 */
}
```

### 2. 交互状态样式

#### **焦点和悬停效果**
```css
.form-group input:focus {
  border-color: var(--brand);      /* 品牌色边框 */
  background: var(--hover-bg);     /* 悬停背景 */
  box-shadow: 0 0 0 3px var(--ring); /* 焦点环 */
}

.form-group select option:hover {
  background: var(--hover-bg);     /* 悬停背景 */
}
```

### 3. 按钮样式

#### **主题化按钮**
```css
.send-message-btn {
  background: var(--brand);        /* 品牌色背景 */
  color: var(--text);              /* 主题文字色 */
}

.send-message-btn:hover {
  background: var(--brand-600);    /* 品牌色变体 */
  box-shadow: 0 8px 25px var(--shadow); /* 主题阴影 */
}
```

## 测试验证

### ✅ **深色主题测试**
1. 进入设置页面，选择"深色"主题
2. 访问联系我们页面
3. 验证表单效果：
   - 标签文字为白色 ✅
   - 输入框有半透明背景和浅色边框 ✅
   - 占位符文字为浅灰色 ✅
   - 焦点状态有深色边框 ✅
   - 按钮为深色背景 ✅

### ✅ **浅色主题测试**
1. 进入设置页面，选择"浅色"主题
2. 访问联系我们页面
3. 验证表单效果：
   - 标签文字为黑色 ✅
   - 输入框有浅灰色背景和深灰色边框 ✅
   - 占位符文字为深灰色 ✅
   - 焦点状态有橙色边框 ✅
   - 按钮为橙色背景 ✅

## 扩展性

### 1. 添加新表单元素

#### **标准模式**
```css
.new-form-element {
  background: var(--form-bg);
  border: 1px solid var(--border);
  color: var(--text);
}

.new-form-element:focus {
  border-color: var(--brand);
  background: var(--hover-bg);
  box-shadow: 0 0 0 3px var(--ring);
}
```

### 2. 自定义表单样式

#### **如果需要特殊样式**
```css
.special-form-input {
  background: var(--card-bg);      /* 使用卡片背景 */
  border: 2px solid var(--border); /* 使用更粗边框 */
}
```

## 总结

通过系统性的主题变量替换，成功修复了联系我们页面表单在浅色主题下的显示问题：

1. **文字可读性**：所有文字在两种主题下都清晰可见
2. **边框对比度**：输入框边框在浅色主题下使用深灰色，提供足够对比度
3. **交互反馈**：焦点状态和悬停效果在两种主题下都有适当的视觉反馈
4. **一致性**：所有表单元素都使用统一的主题变量
5. **用户体验**：表单在两种主题下都有良好的可用性和美观度

现在联系我们页面的表单完全支持主题切换，在浅色主题下显示为黑色文字和深灰色边框，完全符合用户的要求！🎉
