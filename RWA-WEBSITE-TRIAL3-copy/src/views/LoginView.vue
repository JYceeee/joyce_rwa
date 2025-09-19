<template>
  <div class="auth-card">
    <div class="auth-logo"><img src="/icons/signup-icon1.png" alt="Mortgage RWA" /></div>
    <h1 class="auth-title">login test</h1>
    <!-- <p class="auth-sub">测试用户: ceshi222_joyce@163.com</p> -->

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
        {{ loading ? '正在登录...' : '测试登录' }}
      </button>
      
      <!-- <button class="btn secondary" type="button" @click="fillTestData">
        填入测试数据
      </button>
      
      <button class="btn success" type="button" @click="testKnownUser">
        测试已知用户
      </button> -->

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
      user_email: 'ceshi222_joyce@163.com',
      user_password: 'rwa12345',
      remember: true,
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
      this.loginStatusMessage = '已登录状态 - Wallet和Profile按钮已显示';
    }
  },
  methods: {
    fillTestData() {
      this.user_email = 'ceshi222_joyce@163.com';
      this.user_password = 'rwa12345';
      this.remember = true;
    },
    
    async testKnownUser() {
      this.user_email = 'ceshi222_joyce@163.com';
      this.user_password = 'rwa12345';
      await this.submitLogin();
    },
    
    async submitLogin() {
      if (!this.user_email || !this.user_password) {
        this.$emit('notify', '请输入邮箱和密码');
        return;
      }
      
      this.loading = true;
      this.loginStatus = true;
      this.loginStatusClass = 'status';
      this.loginStatusMessage = '正在登录...';
      
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
          this.loginStatusMessage = `登录成功！Token: ${data.token ? data.token.substring(0, 50) + '...' : '无'}`;
          
          // 保存登录状态
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', data.token);
          
          // 记住邮箱（可选）
          if (this.remember) localStorage.setItem('remember_email', this.user_email);
          
          // 触发全局登录状态更新事件
          window.dispatchEvent(new CustomEvent('auth-changed'));
          
          this.$emit('notify', '登录成功！现在可以看到Wallet和Profile按钮了。');
          
          // 显示成功后的界面
          setTimeout(() => {
            alert('登录成功！现在可以看到Wallet和Profile按钮了。');
            this.$router.push('/home');
          }, 1000);
        } else {
          this.loginStatusClass = 'status error';
          this.loginStatusMessage = `登录失败: ${data.message}`;
          this.$emit('notify', data.message);
        }
      } catch (error) {
        this.loginStatusClass = 'status error';
        this.loginStatusMessage = `网络错误: ${error.message}`;
        this.$emit('notify', `网络错误: ${error.message}`);
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

.btn.secondary {
  background: #6c757d;
  color: white;
  margin-top: 10px;
  margin-right: 10px;
}

.btn.secondary:hover {
  background: #5a6268;
}

.btn.success {
  background: #28a745;
  color: white;
  margin-top: 10px;
}

.btn.success:hover {
  background: #218838;
}
</style>
