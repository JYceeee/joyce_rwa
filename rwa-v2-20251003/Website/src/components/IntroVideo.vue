<template>
  <div class="intro-video-container" v-if="showVideo">
    <!-- 开场视频背景 -->
    <div class="video-background">
      <video 
        ref="introVideo"
        class="intro-video"
        autoplay 
        muted 
        playsinline
        @ended="handleVideoEnd"
        @canplaythrough="handleVideoReady"
        @error="handleVideoError"
      >
         <source src="\public\videos\Introvideo.mp4" type="video/mp4">
        您的浏览器不支持视频播放
      </video>
      
      <!-- 视频遮罩层 -->
      <div class="video-overlay">
        <!-- 加载指示器 -->
        <div v-if="isLoading" class="loading-indicator">
          <div class="loading-spinner"></div>
          <p class="loading-text">正在加载...</p>
        </div>
        
        <!-- 跳过按钮 -->
        <button 
          v-if="showSkipButton" 
          class="skip-button"
          @click="skipVideo"
        >
          跳过开场视频
        </button>
        
        <!-- 错误提示 -->
        <div v-if="hasError" class="error-message">
          <p>视频加载失败，正在跳转到主页...</p>
        </div>
      </div>
    </div>
    
    <!-- 品牌信息展示 -->
    <div class="brand-info">
      <div class="logo-container">
        <!-- <img src="/icons/RWA-logo.png" alt="RWA Logo" class="brand-logo"> -->
      </div>
      <h1 class="brand-title">Real World Assets</h1>
      <p class="brand-subtitle">澳洲地产资产上链 · 安全、低风险、高回报的 RWA 投资平台</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IntroVideo',
  data() {
    return {
      showVideo: true,
      isLoading: true,
      showSkipButton: false,
      hasError: false,
      skipTimer: null
    }
  },
  created() {
    // 检查用户是否已经看过开场视频 
    // this.checkIntroStatus()
    // 每次进入都播放开场视频，不检查历史记录
    console.log('🎬 IntroVideo: 开始播放开场视频')
  },
  mounted() {
    this.initializeVideo()
  },
  beforeUnmount() {
    if (this.skipTimer) {
      clearTimeout(this.skipTimer)
    }
  },
  methods: {
    // 移除检查视频播放记录的方法，每次都会播放视频
    
    // checkIntroStatus() {
    //   // 检查localStorage中是否已经标记用户看过开场视频
    //   const hasSeenIntro = localStorage.getItem('rwa_intro_seen')
    //   if (hasSeenIntro === 'true') {
    //     // 用户已经看过开场视频，直接跳转到主页
    //     this.proceedToHome()
    //   }
    // },
    
    initializeVideo() {
      const video = this.$refs.introVideo
      if (!video) {
        this.handleVideoError()
        return
      }
      
      // 设置跳过按钮显示定时器（3秒后显示）
      this.skipTimer = setTimeout(() => {
        this.showSkipButton = true
      }, 3000)
      
      // 检查视频是否已经可以播放
      if (video.readyState >= 3) {
        this.handleVideoReady()
      }
    },
    
    handleVideoReady() {
      this.isLoading = false
      console.log('开场视频加载完成')
    },
    
    handleVideoEnd() {
      console.log('开场视频播放完成')
      this.proceedToHome()
    },
    
    handleVideoError() {
      console.error('开场视频加载失败')
      this.isLoading = false
      this.hasError = true
      
      // 3秒后自动跳转到主页
      setTimeout(() => {
        this.proceedToHome()
      }, 3000)
    },
    
    skipVideo() {
      console.log('用户跳过开场视频')
      this.proceedToHome()
    },
    
    proceedToHome() {
      this.showVideo = false
      
      // 标记用户已经看过开场视频
      localStorage.setItem('rwa_intro_seen', 'true')
      
      // 不再记录视频播放状态，每次都会播放
      // console.log('🎬 IntroVideo: 视频播放完成，跳转到主页')

      // 触发事件通知父组件视频结束
      this.$emit('video-complete')
      
      // 跳转到主页
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
.intro-video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.intro-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 1;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #ffffff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #33CCFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 跳过按钮 */
.skip-button {
  position: absolute;
  top: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 3;
}

.skip-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* 错误提示 */
.error-message {
  color: #ffffff;
  text-align: center;
  background: rgba(239, 68, 68, 0.8);
  padding: 20px 30px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.error-message p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* 品牌信息 */
.brand-info {
  position: absolute;
  top: 40px;
  right: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 3;
  color: #ffffff;
}

.logo-container {
  margin-bottom: 20px;
  animation: logoFloat 3s ease-in-out infinite;
}

.brand-logo {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.brand-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  line-height: 1.5;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skip-button {
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .brand-info {
    bottom: 40px;
    padding: 0 20px;
  }
  
  .brand-logo {
    width: 60px;
    height: 60px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .brand-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .skip-button {
    top: 15px;
    right: 15px;
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .brand-info {
    bottom: 30px;
  }
  
  .brand-logo {
    width: 50px;
    height: 50px;
  }
  
  .brand-title {
    font-size: 20px;
  }
  
  .brand-subtitle {
    font-size: 13px;
  }
}
</style>
