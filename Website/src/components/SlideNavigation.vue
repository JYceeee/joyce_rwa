<template>
  <div 
    class="sidebar" 
    :class="{ open: isOpen }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="sidebar-header">
      <h3 class="sidebar-title">Navigation Menu</h3>
    </div>
    
    <nav class="sidebar-nav">
      <a href="#" @click.prevent="navigate('/overview')" class="sidebar-item">
        <span class="sidebar-item-icon">📋</span>
        <span>Overview</span>
      </a>
      <a href="#" @click.prevent="navigate('/about')" class="sidebar-item">
        <span class="sidebar-item-icon">🏢</span>
        <span>About Us</span>
      </a>
      <a href="#" @click.prevent="navigate('/features')" class="sidebar-item">
        <span class="sidebar-item-icon">⭐</span>
        <span>Features</span>
      </a>
      <a href="#" @click.prevent="navigate('/solutions')" class="sidebar-item">
        <span class="sidebar-item-icon">🔧</span>
        <span>Solutions</span>
      </a>
      <a href="#" @click.prevent="navigate('/tutorials')" class="sidebar-item">
        <span class="sidebar-item-icon">📚</span>
        <span>Tutorials</span>
      </a>
      <a href="#" @click.prevent="navigate('/pricing')" class="sidebar-item">
        <span class="sidebar-item-icon">💰</span>
        <span>Pricing</span>
      </a>
      <a href="#" @click.prevent="navigate('/contact')" class="sidebar-item">
        <span class="sidebar-item-icon">📞</span>
        <span>Contacts</span>
      </a>
    </nav>
    
    <div class="sidebar-footer">
      <button class="sidebar-footer-btn" @click="navigate('/options')">
        <span class="sidebar-item-icon">⚙️</span>
        <span>Options</span>
      </button>
      <button class="sidebar-footer-btn" @click="navigate('/settings')">
        <span class="sidebar-item-icon">🔧</span>
        <span>Settings</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideNavigation',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      autoCloseTimer: null,
      autoCloseDelay: 1000 // 1秒后自动关闭
    }
  },
  methods: {
    navigate(path) {
      this.$router.push(path);
      // 导航后关闭侧边栏
      this.closeSidebar();
    },
    handleMouseEnter() {
      // 鼠标进入时清除自动关闭定时器
      if (this.autoCloseTimer) {
        clearTimeout(this.autoCloseTimer);
        this.autoCloseTimer = null;
      }
    },
    handleMouseLeave() {
      // 鼠标离开时启动自动关闭定时器
      if (this.isOpen) {
        this.autoCloseTimer = setTimeout(() => {
          this.closeSidebar();
        }, this.autoCloseDelay);
      }
    },
    closeSidebar() {
      // 发出关闭事件给父组件
      this.$emit('close');
    }
  },
  beforeUnmount() {
    // 清理定时器
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }
}
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 180px;
  height: 100vh;
  background: var(--bg, #1a1a2e);
  border-right: 1px solid var(--border, #2a2a4a);
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border, #2a2a4a);
}

.sidebar-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text, #ffffff);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  color: var(--text, #ffffff);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.01em;
}

.sidebar-item:hover {
  background: var(--brand-600, rgba(255, 165, 0, 0.1));
  border-left-color: var(--brand, #ffa500);
  color: var(--text, #ffffff);
}

.sidebar-item-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px 18px;
  border-top: 1px solid var(--border, #2a2a4a);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-footer-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: transparent;
  border: 1px solid var(--border, #2a2a4a);
  border-radius: 6px;
  color: var(--text, #ffffff);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.sidebar-footer-btn:hover {
  background: var(--brand-600, rgba(255, 165, 0, 0.1));
  border-color: var(--brand, #ffa500);
}

/* 响应式设计 - 移动端侧边栏适配 */
@media (max-width: 768px) {
  .sidebar {
    width: 180px;  /* 保持与桌面端相同的宽度 */
  }
}
</style>

<style>
/* 全局样式 - 页面内容偏移样式 */
body {
  transition: transform 0.3s ease-out;
}

body.sidebar-open {
  transform: translateX(0px);
}

/* 移动端页面内容偏移 */
@media (max-width: 768px) {
  body.sidebar-open {
    transform: translateX(0px);
  }
}
</style>
