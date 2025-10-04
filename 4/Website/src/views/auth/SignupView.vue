<template>
  <div class="auth-card">
    <!-- Simple Modal -->
    <div v-if="showModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h3>{{ modalTitle }}</h3>
          <p>{{ modalMessage }}</p>
          <button class="btn orange" @click="handleModalAction">{{ modalButtonText }}</button>
        </div>
      </div>
    </div>

    <div class="auth-logo"><img src="/icons/RWA-logo.png" alt="Mortgage RWA" /></div>
    <h1 class="auth-title">Create an account</h1>
    <!-- <p class="auth-sub">test new user registration function</p> -->

    <!-- Registration Status Display -->
    <div v-if="signupStatus" class="status" :class="signupStatusClass">
      {{ signupStatusMessage }}
    </div>

    <form class="auth-form" @submit.prevent="submitSignup">
      <label for="semail" class="auth-label">Email</label>
      <input
        id="semail"
        v-model.trim="user_email"
        type="email"
        class="input auth-input"
        placeholder="Enter your email"
        required
      />
      
      <label for="spass" class="auth-label">Password</label>
      <input
        id="spass"
        v-model="user_password"
        type="password"
        class="input auth-input"
        placeholder="Enter your password"
        required
      />
      
      <label for="scpass" class="auth-label">Confirm Password</label>
      <input
        id="scpass"
        v-model="confirm_password"
        type="password"
        class="input auth-input"
        :class="{ 'password-match': passwordMatches && confirm_password, 'password-mismatch': !passwordMatches && confirm_password }"
        placeholder="Confirm your password"
        @input="checkPasswordMatch"
        required
      />
      
      <!-- Password Match Status Indicator -->
      <div v-if="confirm_password" class="password-status" :class="passwordMatches ? 'match' : 'mismatch'">
        {{ passwordMatches ? '✓ Passwords match' : '✗ Passwords do not match' }}
      </div>
      
      <label for="sname" class="auth-label">Full Name</label>
      <input
        id="sname"
        v-model.trim="user_name"
        type="text"
        class="input auth-input"
        placeholder="Enter your name"
      />

      <label for="sphone" class="auth-label">Phone number</label>
      <div class="phone-input-container">
        <select 
          v-model="country_code" 
          class="country-code-select"
          @change="updatePhoneNumber"
        >
          <option value="+61">🇦🇺 +61</option>
          <option value="+86">🇨🇳 +86</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+81">🇯🇵 +81</option>
          <option value="+82">🇰🇷 +82</option>
          <option value="+65">🇸🇬 +65</option>
          <option value="+852">🇭🇰 +852</option>
          <option value="+886">🇹🇼 +886</option>
          <option value="+91">🇮🇳 +91</option>
        </select>
        <input
          id="sphone"
          v-model.trim="phone_number"
          type="tel"
          class="input auth-input phone-number-input"
          placeholder="Enter your phone number"
          @input="updatePhoneNumber"
          required
        />
      </div>

      <div class="auth-row">
          <label class="auth-check">
            <input type="checkbox" v-model="agreeTerms" />
            <span>I agree to the 
              <a href="#" @click.prevent="goToTerms">Terms</a> and 
              <a href="#" @click.prevent="goToPrivacy">Privacy Policy.</a>
            </span>
          </label>
      </div>
      <div class="auth-row">
        <label class="auth-check">
          <input type="checkbox" v-model="agreeEmailUpdates" />
          <span>I want to receive e-mail updates from RWA. </span>
        </label>
      </div>

      <button class="btn orange auth-submit" type="submit" :disabled="loading || !agreeTerms" >
        {{ loading ? 'registering...' : 'Sign up' }}
      </button>
      

      <p class="auth-alt">
        Already have an account?
        <a href="#" class="auth-link" @click.prevent="go('/login')">Log in</a>
      </p>
    </form>
  </div>
</template>

<script>
import { setUserInfoFromSignup } from '@/service/userService'
import { generateUserId } from '@/utils/userIdGenerator'

export default {
  name: 'SignupView',
  emits: ['notify','navigate'],
  data() {
    return {
      user_email: '',
      user_password: '',
      confirm_password: '',
      user_name: '',
      user_phone: '',
      country_code: '+61', // Default Australia country code
      phone_number: '',
      agreeTerms: false,
      agreeEmailUpdates: false,
      signupStatus: false,
      signupStatusMessage: '',
      signupStatusClass: '',
      loading: false,
      passwordMatches: false
    };
  },
    methods: {
      generateUserId() {
        // Use shared user_id generation utility
        return generateUserId();
      },
      
      // Check password match
      checkPasswordMatch() {
        this.passwordMatches = this.user_password === this.confirm_password;
      },
      
      // Update complete phone number
      updatePhoneNumber() {
        this.user_phone = this.country_code + this.phone_number;
      },
    async submitSignup() {
      // Clear previous error states
      this.clearFieldErrors();
      
      // Ensure phone number includes country code
      this.updatePhoneNumber();
      
      // Collect form data
     const payload = {
       user_email: this.user_email?.trim(),
       user_password: this.user_password,
       user_name: this.user_name?.trim(),
       user_phone: this.user_phone?.trim(), // Now includes complete country code + phone number
       user_id: this.generateUserId(),
       email_list: this.agreeEmailUpdates ? 'Yes' : 'No'
     };
      
      // Debug: Check form data
      console.log('🔍 注册表单数据:', payload);
      
      // Validate form data
      const errors = this.validateForm(payload);
      
      if (!this.agreeTerms) {
        errors.push('Please agree to the terms and conditions');
      }
      
      if (errors.length > 0) {
        this.$emit('notify', `Validation errors: ${errors.join(', ')}`);
        this.showFieldErrors(payload);
        return;
      }
      
      this.loading = true;
      this.signupStatus = true;
      this.signupStatusClass = 'status';
      this.signupStatusMessage = 'Registering...';
      
      try {
        // Send registration data
        console.log('🚀 Sending registration request:', payload);
        
        const response = await fetch(import.meta.env.VITE_API_REGISTER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.status === 0) {
          this.signupStatusClass = 'status success';
          this.signupStatusMessage = `Registration successful! User: ${this.user_email}`;
          
          // Save user info to local storage
          this.saveUserInfo();
          
          // Detailed success information
          console.log('✅ Registration successful!');
          console.log('📧 Email:', this.user_email);
          console.log('👤 Name:', this.user_name);
          console.log('📱 Phone:', this.user_phone);
          console.log('💾 User data saved to MySQL user table');
          
          this.$emit('notify', data.message || 'Registration successful! Please login to continue.');
          
          // Redirect to login page after successful registration
          setTimeout(() => {
            this.$router.push('/login');
          }, 1500);
        } else {
          this.signupStatusClass = 'status error';
          this.signupStatusMessage = `Registration failed: ${data.message}`;
          
          // Detailed error information
          console.error('❌ Registration failed:', data.message);
          console.error('🔍 Error details: status=', data.status);
          
          this.$emit('notify', data.message);
        }
      } catch (error) {
        this.signupStatusClass = 'status error';
        this.signupStatusMessage = `Network error: ${error.message}`;
        
        // Detailed network error information
        console.error('🌐 Network error:', error.message);
        console.error('🔍 Error type:', error.name);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('🔌 Check if backend server is running on localhost:3000');
          this.$emit('notify', 'Network error: Please check if the server is running');
        } else {
          this.$emit('notify', `Network error: ${error.message}`);
        }
      } finally {
        this.loading = false;
      }
    },

    // Save user info to local storage
    saveUserInfo() {
      try {
        setUserInfoFromSignup({
          user_name: this.user_name,
          user_email: this.user_email,
          user_phone: this.user_phone,
          agree_email_updates: this.agreeEmailUpdates,
          email_list: this.agreeEmailUpdates ? 'Yes' : 'No'
        });
        console.log('User info saved:', this.user_name, this.user_email, this.user_phone);
        console.log('Email updates preference:', this.agreeEmailUpdates);
      } catch (error) {
        console.error('Failed to save user info:', error);
      }
    },

    // Validate form data
    validateForm(formData) {
      const errors = [];
      
      if (!formData.user_email) {
        errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
        errors.push('Invalid email format');
      }
      
      if (!formData.user_password) {
        errors.push('Password is required');
      } else if (formData.user_password.length < 6) {
        errors.push('Password must be at least 6 characters');
      }
      
      if (!this.confirm_password) {
        errors.push('Please confirm your password');
      } else if (formData.user_password !== this.confirm_password) {
        errors.push('Passwords do not match');
      }
      
      // user_name is optional, but if provided, must be at least 2 characters
      if (formData.user_name && formData.user_name.length < 2) {
        errors.push('Name must be at least 2 characters if provided');
      }
      
      if (!formData.user_phone) {
        errors.push('Phone number is required');
      } else if (!this.isValidPhone(formData.user_phone)) {
        errors.push('Invalid phone number format. Please include country code.');
      }
      
      return errors;
    },

    // Show field errors
    showFieldErrors(formData) {
      if (!formData.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
        this.showFieldError('semail', 'Invalid email format');
      }
      if (!formData.user_password || formData.user_password.length < 6) {
        this.showFieldError('spass', 'Password must be at least 6 characters');
      }
      if (!this.confirm_password) {
        this.showFieldError('scpass', 'Please confirm your password');
      } else if (formData.user_password !== this.confirm_password) {
        this.showFieldError('scpass', 'Passwords do not match');
      }
      // user_name is optional, only check length if provided
      if (formData.user_name && formData.user_name.length < 2) {
        this.showFieldError('sname', 'Name must be at least 2 characters if provided');
      }
      if (!formData.user_phone || !this.isValidPhone(formData.user_phone)) {
        this.showFieldError('sphone', 'Invalid phone number format. Please include country code.');
      }
    },

    // Show single field error
    showFieldError(fieldId, message) {
      const field = document.getElementById(fieldId);
      if (field) {
        field.classList.add('error');
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        field.parentNode.appendChild(errorMsg);
      }
    },

    // Clear field errors
    clearFieldErrors() {
      document.querySelectorAll('.auth-input').forEach(input => {
        input.classList.remove('error');
      });
      document.querySelectorAll('.error-message').forEach(msg => {
        msg.remove();
      });
    },

    // Validate phone number format
    isValidPhone(phone) {
      // Validate phone number format with country code
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    // Navigate to Terms page
    goToTerms() {
      this.$router.push('/terms');
    },

    // Navigate to Privacy Policy page
    goToPrivacy() {
      this.$router.push('/privacy');
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

.auth-input.error {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.auth-check a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-check a:hover {
  color: #5a67d8;
  text-decoration: underline;
}

/* 手机端响应式设计 */
@media (max-width: 768px) {
  .auth-container {
    padding: 20px 30px;
    margin: 20px 30px;
    width: calc(100% - 60px);
  }
  
  .auth-title {
    font-size: 20px;
  }
  
  .auth-sub {
    font-size: 14px;
  }
  
  .auth-input {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .phone-input-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .country-code-select {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .phone-number-input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .auth-container {
    padding: 16px 30px;
    margin: 16px 30px;
    width: calc(100% - 60px);
  }
  
  .auth-title {
    font-size: 18px;
  }
  
  .auth-sub {
    font-size: 13px;
  }
  
  .auth-input {
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 10px 16px;
    font-size: 13px;
  }
}

/* Password match status styles */
.password-match {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
}

.password-mismatch {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

/* Password match indicator */
.password-status {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

.password-status.match {
  color: #10b981;
}

.password-status.mismatch {
  color: #ef4444;
}

/* Phone number input container styles */
.phone-input-container {
  display: flex;
  gap: 8px;
  align-items: center;
  height: 35px;
}

.country-code-select {
  flex: 0 0 auto;
  padding: 12px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 100px;
  height: 45px;
}

.country-code-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.phone-number-input {
  flex: 1;
  margin: 0;
  height: 45px;
}

</style>
