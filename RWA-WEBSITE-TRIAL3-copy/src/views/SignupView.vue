<template>
  <div class="auth-card">
    <!-- 简单弹窗 -->
    <!-- <div v-if="showModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h3>{{ modalTitle }}</h3>
          <p>{{ modalMessage }}</p>
          <button class="btn orange" @click="handleModalAction">{{ modalButtonText }}</button>
        </div>
      </div>
    </div> -->

    <div class="auth-logo"><img src="/icons/RWA-logo.png" alt="Mortgage RWA" /></div>
    <h1 class="auth-title">Create an account</h1>

    <form class="auth-form" @submit.prevent="submitSignup">
      <input
        v-model.trim="user_email"
        type="email"
        class="input auth-input"
        placeholder="Enter your email"
        required
      />
      <input
        v-model="user_password"
        type="password"
        class="input auth-input"
        placeholder="Enter your password"
        required
      />

      <div class="auth-row">
        <label class="auth-check">
          <input type="checkbox" v-model="agree" />
          <span>I agree to the Terms and Privacy Policy.</span>
        </label>
      </div>

      <button class="btn orange auth-submit" type="submit" :disabled="loading || !agree" >
        {{ loading ? 'Creating...' : 'Get started' }}
      </button>

      <div class="auth-or"><span>OR</span></div> -->

      <!-- 第三方按钮先保留占位，避免 404 静态路径 -->
      <!-- <button class="btn auth-social" type="button">Sign up with Google</button>
      <button class="btn auth-social" type="button">Sign up with Facebook</button>
      <button class="btn auth-social" type="button">Sign up with Apple</button> -->

      <p class="auth-alt">
        Already have an account?
        <a href="#" class="auth-link" @click.prevent="$emit('navigate','login')">Log in</a>
      </p>
    </form>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'SignupView',
  emits: ['notify','navigate'],
  setup() {
    const { signup, loading } = useAuth()
    return { signup, loading }
  },
  data() {
    return {
      user_email: '',
      user_password: '',
      agree: false
    };
  },
  methods: {
    async submitSignup() {
      if (!this.user_email || !this.user_password) {
        this.$emit('notify', '请输入邮箱和密码');
        return;
      }
      if (!this.agree) {
        this.$emit('notify', '请同意条款以继续');
        return;
      }
      
      const result = await this.signup(this.user_email, this.user_password);
      
      if (result.success) {
        this.$emit('notify', result.message);
        this.$router.push('/home');
      } else {
        this.$emit('notify', result.message);
      }
    }
  }
}
</script>

<style scoped>
.auth-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #eee;
  padding: 32px;
  min-width: 340px;
  max-width: 400px;
}
.modal-mask {
  position: fixed; z-index: 9999; inset: 0; background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
}
.modal-container {
  background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #aaa;
  padding: 32px 24px; min-width: 300px; max-width: 90vw; text-align: center;
}
.auth-title { margin: 16px 0 24px; font-size: 24px; font-weight: 600; color: #333; text-align: center; }
</style>
