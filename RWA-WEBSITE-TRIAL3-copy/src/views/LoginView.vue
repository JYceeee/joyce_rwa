<template>
  <div class="auth-card">
    <div class="auth-logo"><img src="/icons/signup-icon1.png" alt="Mortgage RWA" /></div>
    <h1 class="auth-title">Log in to your account</h1>
    <p class="auth-sub">Welcome back! Please enter your details.</p>

    <form class="auth-form" @submit.prevent="submitLogin">
      <label for="lemail" class="auth-label">Email</label>
      <input
        id="lemail"
        type="email"
        class="input auth-input"
        placeholder="Enter your email"
        v-model.trim="user_email"
        required
      />

      <label for="lpass" class="auth-label">Password</label>
      <input
        id="lpass"
        type="password"
        class="input auth-input"
        placeholder="••••••••"
        v-model="user_password"
        required
      />

      <div class="auth-row">
        <label class="auth-check">
          <input type="checkbox" v-model="remember" />
          <span>Remember for 30 days</span>
        </label>
        <a href="#" class="auth-link" @click.prevent="$emit('navigate','forgot')">Forgot password</a>
      </div>

      <button class="btn orange auth-submit" type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <p class="auth-alt">
        Don’t have an account?
        <a href="#" class="auth-link" @click.prevent="$emit('navigate','signup')">Sign up</a>
      </p>
    </form>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'LoginView',
  emits: ['notify','navigate'],
  setup() {
    const { login, loading } = useAuth()
    return { login, loading }
  },
  data() {
    return {
      user_email: '',
      user_password: '',
      remember: true
    }
  },
  methods: {
    async submitLogin() {
      if (!this.user_email || !this.user_password) {
        this.$emit('notify', '请输入邮箱和密码');
        return;
      }
      
      const result = await this.login(this.user_email, this.user_password);
      
      if (result.success) {
        // 记住邮箱（可选）
        if (this.remember) localStorage.setItem('remember_email', this.user_email);
        
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
.auth-title { color: #000; }
</style>
