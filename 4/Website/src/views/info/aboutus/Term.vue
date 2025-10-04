<template>
  <div class="terms-page">
    <div class="container">
      <div class="header">
        <h1>Terms of Service</h1>
        <p class="subtitle">Please read these terms carefully before using our service</p>
      </div>
      
      <div class="content">
        <section class="section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website and our services, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section class="section">
          <h2>2. Description of Service</h2>
          <p>
            Our platform provides access to real-world asset (RWA) tokenization services, allowing users to invest in tokenized real estate and other physical assets. 
            We facilitate the connection between investors and asset providers through blockchain technology.
          </p>
        </section>

        <section class="section">
          <h2>3. User Responsibilities</h2>
          <ul>
            <li>You must be at least 18 years old to use our services</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You agree to provide accurate and complete information</li>
            <li>You will not use the service for any illegal or unauthorized purpose</li>
            <li>You will comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section class="section">
          <h2>4. Investment Risks</h2>
          <p>
            <strong>Important:</strong> All investments carry risk. The value of your investments can go down as well as up. 
            Past performance is not indicative of future results. You should only invest money that you can afford to lose.
          </p>
          <ul>
            <li>Real estate investments are subject to market fluctuations</li>
            <li>Tokenized assets may have liquidity restrictions</li>
            <li>Regulatory changes may affect the value of your investments</li>
            <li>Technology risks including smart contract vulnerabilities</li>
          </ul>
        </section>

        <section class="section">
          <h2>5. KYC and Compliance</h2>
          <p>
            We are required to comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. 
            You agree to provide necessary documentation and information for verification purposes.
          </p>
        </section>

        <section class="section">
          <h2>6. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for money laundering or terrorist financing</li>
            <li>Attempt to circumvent security measures</li>
            <li>Interfere with the proper functioning of the platform</li>
            <li>Provide false or misleading information</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section class="section">
          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
          </p>
        </section>

        <section class="section">
          <h2>8. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes through our platform or by email. 
            Your continued use of the service after such modifications constitutes acceptance of the updated terms.
          </p>
        </section>

        <section class="section">
          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section class="section">
          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of Australia, without regard to its conflict of law provisions. 
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </section>

        <section class="section">
          <h2>11. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
            <br>
            Email: legal@rwatoken.com
            <br>
            Address: Sydney, Australia
          </p>
        </section>

        <div class="footer-actions">
          <button @click="goBack" class="btn btn-secondary">Back to Signup</button>
          <button @click="acceptTerms" class="btn btn-primary">I Accept These Terms</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermView',
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    acceptTerms() {
      // Emit event to parent component or store acceptance
      this.$emit('terms-accepted');
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.terms-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.content {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  line-height: 1.6;
}

.section {
  margin-bottom: 2.5rem;
}

.section h2 {
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.section p {
  color: #4a5568;
  margin-bottom: 1rem;
  text-align: justify;
}

.section ul {
  color: #4a5568;
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.section li {
  margin-bottom: 0.5rem;
}

.section strong {
  color: #2d3748;
  font-weight: 600;
}

.footer-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #edf2f7;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .content {
    padding: 2rem 1.5rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>


