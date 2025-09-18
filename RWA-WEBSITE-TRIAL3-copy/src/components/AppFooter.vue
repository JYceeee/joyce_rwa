<!-- src/components/AppFooter.vue -->
<template>
  <footer class="footer">
    <div class="container footer-top">
      <div class="footer-brand">
        <img src="/icons/RWA.png" alt="Mortgage RWA Logo" class="footer-logo" />
        <p class="footer-tagline">Design amazing digital experiences that create more happy in the world.</p>
      </div>

      <div class="footer-links">
        <div><h4>Product</h4><ul>
          <li><a href="#">Overview</a></li>
          <li><a href="#">Features</a></li>
          <li><a href="#">Solutions <span class="new">New</span></a></li>
          <li><a href="#">Tutorials</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Releases</a></li></ul></div>
        <div><h4>Company</h4><ul>
          <li><a href="#">About us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press</a></li>
          <li><a href="#">News</a></li>
          <li><a href="#">Media kit</a></li>
          <li><a href="#">Contact</a></li></ul></div>
        <div><h4>Resources</h4><ul>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Newsletter</a></li>
          <li><a href="#">Events</a></li>
          <li><a href="#">Help centre</a></li>
          <li><a href="#">Tutorials</a></li>
          <li><a href="#">Support</a></li></ul></div>
        <div><h4>Social</h4><ul>
          <li><a href="#">Twitter</a></li>
          <li><a href="#">LinkedIn</a></li>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">GitHub</a></li>
          <li><a href="#">AngelList</a></li>
          <li><a href="#">Dribbble</a></li></ul></div>
        <div><h4>Legal</h4><ul>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Cookies</a></li>
          <li><a href="#">Licenses</a></li>
          <li><a href="#">Settings</a></li>
          <li><a href="#">Contact</a></li></ul></div>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>© 2025 Mortgage RWA. All rights reserved.</p>
      <div class="social-icons">
        <a href="#"><img src="/icons/X-logo.png" alt="X" /></a>
        <a href="#"><img src="/icons/Linkedin-logo.png" alt="LinkedIn" /></a>
        <a href="#"><img src="/icons/facebook-logo.png" alt="Facebook" /></a>
        <a href="#"><img src="/icons/github-logo.png" alt="GitHub" /></a>
      </div>
    </div>
  </footer>
</template>

<script>
export default { name: 'AppFooter' }
</script>

<style scoped>
.footer {
  background: #0A0A19;
}
</style>
