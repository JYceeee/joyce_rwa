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
    <!-- <p class="auth-sub">test new user registration function</p> -->

    <!-- 注册状态显示 -->
    <div v-if="signupStatus" class="status" :class="signupStatusClass">
      {{ signupStatusMessage }}
    </div>

    <form class="auth-form" @submit.prevent="submitSignup">
      <label for="semail" class="auth-label">email</label>
      <input
        id="semail"
        v-model.trim="user_email"
        type="email"
        class="input auth-input"
        placeholder="Enter your email"
        required
      />
      
      <label for="spass" class="auth-label">password</label>
      <input
        id="spass"
        v-model="user_password"
        type="password"
        class="input auth-input"
        placeholder="Enter your password"
        required
      />
      
      <label for="sname" class="auth-label">name</label>
      <input
        id="sname"
        v-model.trim="user_name"
        type="text"
        class="input auth-input"
        placeholder="Enter your name"
        required
      />

      <div class="auth-row">
        <label class="auth-check">
          <input type="checkbox" v-model="agree" />
          <span>I agree to the Terms and Privacy Policy.</span>
        </label>
      </div>

      <button class="btn orange auth-submit" type="submit" :disabled="loading || !agree" >
        {{ loading ? 'registering...' : 'Sign up' }}
      </button>
      

      <p class="auth-alt">
        Already have an account?
        <a href="#" class="auth-link" @click.prevent="$emit('navigate','login')">Log in</a>
      </p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SignupView',
  emits: ['notify','navigate'],
  data() {
    return {
      user_email: '',
      user_password: '',
      user_name: '',
      agree: false,
      signupStatus: false,
      signupStatusMessage: '',
      signupStatusClass: '',
      loading: false
    };
  },
  methods: {
    async submitSignup() {
      if (!this.user_email || !this.user_password || !this.user_name) {
        this.$emit('notify', 'Please enter email, password and name');
        return;
      }
      if (!this.agree) {
        this.$emit('notify', 'Please agree to the terms to continue');
        return;
      }
      
      this.loading = true;
      this.signupStatus = true;
      this.signupStatusClass = 'status';
      this.signupStatusMessage = 'Registering...';
      
      try {
        const response = await fetch('http://localhost:3000/user/reguser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_email: this.user_email,
            user_password: this.user_password,
            user_name: this.user_name,
            user_id: 'user_' + Date.now(),
            user_phone: ''
          })
        });
        
        const data = await response.json();
        
        if (data.status === 0) {
          this.signupStatusClass = 'status success';
          this.signupStatusMessage = `Registration successful! User: ${this.user_email}`;
          
          this.$emit('notify', data.message || 'Registration successful! Please login to continue.');
          
          // 注册成功后跳转到登录页面
          setTimeout(() => {
            this.$router.push('/login');
          }, 1500);
        } else {
          this.signupStatusClass = 'status error';
          this.signupStatusMessage = `Registration failed: ${data.message}`;
          this.$emit('notify', data.message);
        }
      } catch (error) {
        this.signupStatusClass = 'status error';
        this.signupStatusMessage = `Network error: ${error.message}`;
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
.modal-mask {
  position: fixed; z-index: 9999; inset: 0; background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
}
.modal-container {
  background: #fff; border-radius: 10px; box-shadow: 0 2px 8px #aaa;
  padding: 32px 24px; min-width: 300px; max-width: 90vw; text-align: center;
}
.auth-title { margin: 16px 0 24px; font-size: 24px; font-weight: 600; color: #333; text-align: center; }
.auth-sub { margin: 0 0 20px; color: #666; text-align: center; }
.auth-label { 
  display: block; 
  margin-bottom: 5px; 
  font-weight: 500; 
  color: #333; 
}

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
