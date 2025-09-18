<template>
  <section class="profile-page">
    <!-- 顶部：面包屑 & 操作按钮 -->
    <header class="topbar container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <button class="crumb-back" @click="$emit('navigate','home')" aria-label="Back to Home">
          <svg viewBox="0 0 24 24" class="i"><path d="M10 19a1 1 0 0 1-.7-.3l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 1 1 1.4 1.4L4.41 11H21a1 1 0 1 1 0 2H4.41l6.3 6.3A1 1 0 0 1 10 19z"/></svg>
        </button>
        <span class="sep">/</span>
        <span class="crumb-current">Profile</span>
      </nav>
    </header>

    <!-- 标题块 -->
    <div class="container head">
      <div class="avatar"><span class="avatar-initial">O</span></div>
      <div>
        <h1 class="title">Olivia Rhye</h1>
        <p class="subtitle">@olivia</p>
      </div>
    </div>

    <!-- 表单 -->
    <form class="container form" @submit.prevent="onSave">
      <!-- KYC -->
      <div class="field">
        <label class="label">KYC verification <span class="req">*</span></label>
        <div class="kyc-banner" :class="isVerified ? 'green' : 'orange'" role="status">
          <span class="icon">
            <svg viewBox="0 0 24 24" class="i">
              <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 4v13l10 5 10-5V4L12 9Zm0 9.5-7-3.5V9l7 3.5V20.5Z"/>
            </svg>
          </span>
          <!-- 文案：未验证=Verify now；已验证=Verified(+对勾) -->
          <span v-if="!isVerified">Verify now</span>
          <span v-else class="verified">
            <svg viewBox="0 0 24 24" class="i"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
            Verified
          </span>
          <!-- 右侧按钮：未验证=Start；已验证=Cancel -->
          <button v-if="!isVerified" class="link" type="button" @click="verifyKYC">Start</button>
          <button v-else class="link danger" type="button" @click="cancelKYC">Cancel verification</button>
        </div>
      </div>

      <!-- Email with verification -->
      <div class="field">
        <label class="label">Email Address</label>
        <div style="display: flex; gap: 8px; align-items: center;">
          <input class="input" type="email" placeholder="name@example.com" v-model.trim="form.email" style="flex:1;" />
          <button class="btn light" type="button" @click="sendEmailCode" :disabled="emailCodeSent || !form.email || !isValidEmail(form.email)">Send Code</button>
        </div>
        <div v-if="emailCodeSent" style="margin-top: 10px; display: flex; gap: 8px; align-items: center;">
          <input class="input" type="text" placeholder="Enter verification code" v-model.trim="form.emailCode" style="flex:1;" />
          <button class="btn orange" type="button" @click="verifyEmailCode" :disabled="!form.emailCode">Verify</button>
        </div>
        <div v-if="emailVerified" style="margin-top: 8px; color: #17683a; font-weight: 600;">Email verified and bound to account.</div>
      <!-- 邮箱验证弹窗 -->
      <div v-if="showEmailModal" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <h2 style="margin-bottom:8px;">Check Your Email</h2>
            <p>Verify your email address to use your account.<br>
            We sent an email with a button to verify your email address.<br>
            Did you receive the email? If not, check your spam folder or request a new verification email for up to 3 days.<br>
            If you do not verify your email address within 3 days, you will need to create a new account.<br>
            If you are having trouble, see Account Help.</p>
            <div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:10px;">
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Account Help</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Subscriptions</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Unsubscribe</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Privacy / Do Not Sell My Info</a>
              <a href="#" style="color:#ea7a2e; text-decoration:underline;">Cookie Preferences</a>
            </div>
            <div style="margin-top:18px; text-align:right;">
              <button class="btn orange" @click="showEmailModal=false">OK</button>
            </div>
          </div>
        </div>
      </div>
      </div>

      <!-- 底部按钮 -->
      <div class="actions bottom">
        <button class="btn light" type="button" @click="onCancel">Cancel</button>
        <button class="btn orange" type="submit">Save</button>
        <!-- 新增：安全退出 -->
        <button class="btn light" type="button" @click="logout" style="margin-left:auto;">Log out</button>
      </div>
    </form>
  </section>
</template>

<script>
import {
  getKycStatus,
  setKycStatus,
  KYC_STATUS
} from '/src/service/kycService'

export default {
  name: 'ProfileView',
  emits: ['navigate','notify'],
  data(){
    return {
      kycStatus: getKycStatus(),
      form: {
        twoFA: 'off',
        email: '',
        walletAction: ''
      },
      emailCode: '',
      emailCodeSent: false,
      emailVerified: false,
      generatedCode: '',
  _offVis: null,
  _offStorage: null,
  _offAfterEach: null,
  showEmailModal: false
    }
  },
  computed:{
    isVerified(){ return this.kycStatus === KYC_STATUS.VERIFIED },
    isPending(){ return this.kycStatus === KYC_STATUS.PENDING }
  },
  mounted(){
    // 刷新函数：从 localStorage 读取最新状态
    const refresh = () => { this.kycStatus = getKycStatus() }

    // 1) 初次进入
    refresh()
    // 2) 标签激活（从 /kycService 返回就会触发）
    const onVis = () => document.visibilityState === 'visible' && refresh()
    document.addEventListener('visibilitychange', onVis)
    this._offVis = () => document.removeEventListener('visibilitychange', onVis)

    // 3) 跨标签同步（若多标签页同时登录）
    const onStore = (e) => { if (e.key === 'kycStatus') refresh() }
    window.addEventListener('storage', onStore)
    this._offStorage = () => window.removeEventListener('storage', onStore)

    // 4) 路由返回时（从 KYC 页面 push 回来）
    this._offAfterEach = this.$router.afterEach((to) => {
      if (to.path === '/profile') refresh()
    })
  },
  activated(){
    // keep-alive 场景下也会被调用
    this.kycStatus = getKycStatus()
  },
  beforeUnmount(){
    this._offVis && this._offVis()
    this._offStorage && this._offStorage()
    this._offAfterEach && this._offAfterEach()
  },
  methods:{
    // 校验邮箱格式
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // 发送验证码
    async sendEmailCode() {
      if (!this.isValidEmail(this.form.email)) {
        this.$emit('notify','Please enter a valid email.');
        return;
      }
      try {
        // 调用后端API发送验证码邮件
        const res = await fetch('/api/send-email-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.form.email })
        });
        const data = await res.json();
        if (data.success) {
          this.emailCodeSent = true;
          this.generatedCode = data.code; // 前端演示用，实际生产环境不应返回验证码
          this.showEmailModal = true;
        } else {
          this.$emit('notify',data.message || 'Failed to send email.');
        }
      } catch (e) {
        this.$emit('notify','Network error, please try again.');
      }
    },

    // 验证验证码
    async verifyEmailCode() {
      try {
        // 调用后端API校验验证码
        const res = await fetch('/api/verify-email-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.form.email, code: this.form.emailCode })
        });
        const data = await res.json();
        if (data.success) {
          this.emailVerified = true;
          this.$emit('notify','Email verified and bound to account.');
        } else {
          this.$emit('notify',data.message || 'Incorrect verification code.');
        }
      } catch (e) {
        this.$emit('notify','Network error, please try again.');
      }
    },
    verifyKYC(){ this.$router.push('/kycService') },

    // 撤销 KYC：立即变回黄色并显示 Start
    cancelKYC(){
      if (!confirm('Are you sure you want to cancel KYC verification?')) return
      setKycStatus(KYC_STATUS.UNVERIFIED)     // 写入存储
      this.kycStatus = KYC_STATUS.UNVERIFIED  // 立刻刷新 UI
      this.$emit('notify','KYC verification has been cancelled.')
    },

    onCancel(){ this.$emit('navigate','home') },

    onSave(){
      if (!this.isVerified) return this.$emit('notify','Please complete KYC first.')
      if (this.form.email && !this.isValidEmail(this.form.email))
        return this.$emit('notify','Please enter a valid email.')
      if (this.form.email && !this.emailVerified)
        return this.$emit('notify','Please verify your email before saving.')
      this.$emit('notify','Profile saved (demo)')
    },

    logout() {
    // 1) 清理本地状态
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    delete axios.defaults.headers.common['Authorization'];

    // 2) 友好提示（可选）
    this.$emit('notify','You have logged out.');

    // 3) 跳转到登录页
    this.$router.push('/login');
    // 不需要 location.reload()，Header 会因路由变化而刷新按钮
  }
}
}
</script>

<style scoped>
/* 简易弹窗样式 */
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-wrapper {
  width: 100%;
  max-width: 420px;
}
.modal-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.12);
  padding: 28px 24px 18px;
  font-size: 15px;
}
.container { max-width: 920px; margin: 0 auto; }
.profile-page { padding-bottom: 64px; }

/* 顶部 */
.topbar { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:24px 16px; }
.breadcrumb { display:flex; align-items:center; gap:10px; color:#64748b; }
.crumb-back { border:0; background:transparent; cursor:pointer; color:#64748b; }
.sep{ opacity:.6; }
.crumb-current{ color:#0f172a; font-weight:600; }

/* 标题块 */
.head { display:flex; align-items:center; gap:16px; padding:0 16px 8px; }
.avatar{ width:44px; height:44px; border-radius:999px; background:#eef2f7; display:grid; place-items:center;}
.avatar-initial{ font-weight:700; color:#475569; }
.title{ font-size:24px; line-height:1.2; margin:0; color:#0f172a; }
.subtitle{ margin:2px 0 0; color:#94a3b8; }

/* 表单与控件 */
.form{ margin-top:24px; padding:0 16px; }
.field{ margin:18px 0; }
.label{ display:block; font-size:12px; color:#64748b; margin-bottom:8px; }
.req{ color:#f97316; }
.input{ width:100%; height:40px; border:1px solid #e2e8f0; border-radius:8px; padding:0 12px; background:#fff; color:#0f172a; }
.input:focus{ border-color:#cbd5e1; box-shadow:0 0 0 3px rgba(99,102,241,.08); }
.input.with-icon{ display:flex; align-items:center; gap:8px; padding:0 8px; }
.input.with-icon select{ border:0; outline:none; width:100%; height:38px; background:transparent; color:#0f172a; }
.input.with-icon .icon{ width:28px; height:28px; border-radius:10px; background:#fff; display:grid; place-items:center;
  box-shadow:0 2px 6px rgba(15,23,42,.06), inset 0 0 0 1px #e2e8f0; }
.i{ width:18px; height:18px; fill:currentColor; color:#0f172a; }

/* KYC 横幅 */
.kyc-banner{ display:flex; align-items:center; gap:10px; height:40px; border-radius:8px; padding:0 12px; border:1px solid; }
.kyc-banner.orange{ background:#fdebdc; color:#a45117; border-color:#f6d3bb; }
.kyc-banner.green{ background:#e8f7ec; color:#17683a; border-color:#bfe6cc; }
.kyc-banner .icon{
  width:28px; height:28px; border-radius:10px; background:#fff; display:grid; place-items:center;
  box-shadow:0 2px 6px rgba(15,23,42,.06), inset 0 0 0 1px currentColor; opacity:.9;
}
.link{ margin-left:auto; color:inherit; background:transparent; border:0; cursor:pointer; text-decoration:underline; }
.link.danger{ color:#b91c1c; }
.verified{ margin-left:4px; display:inline-flex; align-items:center; gap:6px; font-weight:600; }

/* 底部按钮 */
.actions { display:flex; gap:12px; }
.actions.bottom { margin-top: 16px; }
.btn{ border:1px solid transparent; border-radius:10px; padding:8px 14px; cursor:pointer; font-weight:600; line-height:1; }
.btn.orange{ background:#ea7a2e; color:#fff; }
.btn.orange:hover{ filter:brightness(.96); }
.btn.light{ background:#f1f5f9; color:#0f172a; border-color:#e2e8f0; }
.btn.light:hover{ background:#e9eef5; }
</style>
