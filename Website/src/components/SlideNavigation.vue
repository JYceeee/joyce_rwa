<template>
  <div 
    class="sidebar" 
    :class="{ open: isOpen }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <img src="/icons/RWA.png" alt="RWA Logo" class="sidebar-logo-img" />
      </div>
      <button class="sidebar-close-btn" @click="closeSidebar">
        <span class="sidebar-close-btn-icon">❌</span>
      </button>
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
      <a href="#" @click.prevent="navigate('/faq')" class="sidebar-item">
        <span class="sidebar-item-icon">❓</span>
        <span>FAQ</span>
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
      autoCloseDelay: 200, // 1秒后自动关闭
      scrollY: 0,
      isScrolling: false
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
    },
    
    // 监听页面滚动
    handleScroll() {
      this.scrollY = window.scrollY;
      this.isScrolling = true;
      
      // 使用requestAnimationFrame优化性能
      if (!this.scrollFrame) {
        this.scrollFrame = requestAnimationFrame(() => {
          this.isScrolling = false;
          this.scrollFrame = null;
        });
      }
    },
    
    // 确保侧边栏始终固定在视窗顶部
    ensureSidebarFixed() {
      const sidebar = this.$el;
      if (sidebar) {
        // 强制设置固定定位，防止其他样式影响
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        sidebar.style.zIndex = '1000';
      }
    }
  },
  mounted() {
    // 确保侧边栏固定定位
    this.ensureSidebarFixed();
    
    // 添加滚动监听
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    
    // 监听窗口大小变化，确保侧边栏始终正确显示
    window.addEventListener('resize', this.ensureSidebarFixed);
  },
  updated() {
    // 组件更新后再次确保固定定位
    this.ensureSidebarFixed();
  },
  beforeUnmount() {
    // 清理定时器
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    
    // 清理滚动监听
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.ensureSidebarFixed);
    
    // 清理requestAnimationFrame
    if (this.scrollFrame) {
      cancelAnimationFrame(this.scrollFrame);
    }
  }
}
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  /* position: fixed; */
  /* left: 0; */
  width: 160px;
  height: 100vh;
  background: var(--bg, #1a1a2e);
  border-right: 1px solid var(--border, #2a2a4a);
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  /* 确保侧边栏始终固定在视窗顶部 */
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
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

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.sidebar-logo-img {
  height: 32px;
  width: auto;
  max-width: 80px;
  object-fit: contain;
}

.sidebar-close-btn {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.sidebar-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-close-btn-icon {
  font-size: 16px;
  color: var(--text, #ffffff);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
  /* 优化滚动性能 */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(138, 43, 226, 0.3) transparent;
}

/* 自定义滚动条样式 */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(138, 43, 226, 0.3);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(138, 43, 226, 0.5);
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
  font-weight: 500;
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

/* 确保侧边栏在所有情况下都保持固定 */
.sidebar {
  /* 强制固定定位，覆盖任何可能的样式冲突 */
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 1000 !important;
}

/* 响应式设计 - 移动端侧边栏适配 */
@media (max-width: 768px) {
  .sidebar {
    width: 160px;  /* 保持与桌面端相同的宽度 */
  }
}

/* 确保侧边栏在页面滚动时保持稳定 */
@media (prefers-reduced-motion: no-preference) {
  .sidebar {
    /* 使用硬件加速优化性能 */
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .sidebar {
    border-right: 2px solid var(--border, #2a2a4a);
  }
  
  .sidebar-item:hover {
    background: rgba(255, 255, 255, 0.1);
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
