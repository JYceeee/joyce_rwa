<template>
  <div class="auth-card">
    <div class="auth-logo"><img src="/icons/signup-icon1.png" alt="Mortgage RWA" /></div>
    <h1 class="auth-title">Login Your Account</h1>
    <p class="auth-sub">Welcome to Mortgage RWA</p> 

    <!-- 登录状态显示 -->
    <div v-if="loginStatus" class="status" :class="loginStatusClass">
      {{ loginStatusMessage }}
    </div>

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
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p class="auth-alt">
        Don't have an account?
        <a href="#" class="auth-link" @click.prevent="$emit('navigate','signup')">Sign up</a>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  emits: ['notify','navigate'],
  data() {
    return {
      user_email: '',
      user_password: '',
      remember: false,
      loginStatus: false,
      loginStatusMessage: '',
      loginStatusClass: '',
      loading: false
    }
  },
  mounted() {
    // 检查是否已登录
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.loginStatus = true;
      this.loginStatusClass = 'status success';
      // this.loginStatusMessage = 'Logged in - Wallet and Profile buttons are displayed';
    }
  },
  methods: {
    async submitLogin() {
      if (!this.user_email || !this.user_password) {
        this.$emit('notify', 'Please enter email and password');
        return;
      }
      
      this.loading = true;
      this.loginStatus = true;
      this.loginStatusClass = 'status';
      this.loginStatusMessage = 'Logging in...';
      
      try {
        const response = await fetch('http://localhost:3000/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_email: this.user_email,
            user_password: this.user_password
          })
        });
        
        const data = await response.json();
        
        if (data.status === 0) {
          this.loginStatusClass = 'status success';
          // this.loginStatusMessage = `Successful Login！Token: ${data.token ? data.token.substring(0, 50) + '...' : '无'}`;
          this.loginStatusMessage = 'Login successful!';
          
          // 保存登录状态
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', data.token);
          
          // 记住邮箱（可选）
          if (this.remember) localStorage.setItem('remember_email', this.user_email);
          
          // 触发全局登录状态更新事件
          window.dispatchEvent(new CustomEvent('auth-changed'));
          
          // this.$emit('notify', '登录成功！现在可以看到Wallet和Profile按钮了。');
          this.$emit('notify', 'Login successful!');
          
          // 跳转到首页
          setTimeout(() => {
            this.$router.push('/home');
          }, 1000);
        } else {
          this.loginStatusClass = 'status error';
          this.loginStatusMessage = `Login failed: ${data.message}`;
          this.$emit('notify', data.message);
        }
      } catch (error) {
        this.loginStatusClass = 'status error';
        this.loginStatusMessage = `Network error: ${error.message}`;
        this.$emit('notify', `Network error: ${error.message}`);
      } finally {
        this.loading = false;
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

.status {
  margin-top: 20px;
  padding: 15px;
  border-radius: 6px;
  font-weight: 500;
  text-align: center;
}

.status.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

</style>
