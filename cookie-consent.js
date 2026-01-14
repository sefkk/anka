// Cookie Consent Management
(function() {
  'use strict';

  const COOKIE_CONSENT_KEY = 'cookieConsent';
  const COOKIE_EXPIRY_DAYS = 365;
  const API_BASE = 'https://anka-vkrl.onrender.com';

  // Cookie utility functions
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Check if user has already given consent
  function hasConsent() {
    return getCookie(COOKIE_CONSENT_KEY) !== null;
  }

  // Collect device and connection information
  async function collectUserData() {
    const data = {
      userAgent: navigator.userAgent,
      deviceBrand: getDeviceBrand(),
      deviceType: getDeviceType(),
      connectionType: getConnectionType(),
      timestamp: new Date().toISOString()
    };

    // Get IP and country from backend
    try {
      const response = await fetch(`${API_BASE}/api/user-info`);
      if (response.ok) {
        const info = await response.json();
        data.ipAddress = info.ipAddress || 'Unknown';
        data.country = info.country || 'Unknown';
      } else {
        data.ipAddress = 'Unknown';
        data.country = 'Unknown';
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      data.ipAddress = 'Unknown';
      data.country = 'Unknown';
    }

    return data;
  }

  // Detect device brand from user agent
  function getDeviceBrand() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('macintosh')) {
      return 'Apple';
    } else if (ua.includes('android')) {
      return 'Android';
    } else if (ua.includes('windows')) {
      return 'Microsoft';
    } else if (ua.includes('linux')) {
      return 'Linux';
    }
    return 'Unknown';
  }

  // Detect device type
  function getDeviceType() {
    const ua = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      return 'phone';
    } else {
      return 'web';
    }
  }

  // Detect connection type
  function getConnectionType() {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const effectiveType = connection.effectiveType || 'unknown';
        if (connection.type === 'wifi' || effectiveType.includes('wifi')) {
          return 'wifi';
        } else if (connection.type === 'cellular' || connection.type === 'cellular') {
          return 'cellular';
        }
        return connection.type || 'unknown';
      }
    }
    return 'unknown';
  }

  // Create cookie banner HTML (as popup modal)
  function createCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookieConsentBanner';
    banner.className = 'cookie-consent-popup';
    banner.innerHTML = `
      <div class="cookie-popup-backdrop"></div>
      <div class="cookie-popup-content">
        <div class="cookie-popup-header">
          <div class="cookie-popup-icon">🍪</div>
          <h3>We Use Cookies</h3>
        </div>
        <div class="cookie-popup-body">
          <p>We use cookies to collect your IP address, location (country), login/logout timestamps, device brand, device type, and internet connection type. By clicking "Accept", you consent to our use of cookies. Click "Reject" to decline.</p>
          <div class="cookie-consent-links">
            <a href="cookie-policy.html">Cookie Policy</a>
            <span>•</span>
            <a href="privacy-policy.html">Privacy Policy</a>
          </div>
        </div>
        <div class="cookie-popup-footer">
          <button id="cookieRejectAll" class="cookie-btn cookie-btn-secondary">Reject</button>
          <button id="cookieAcceptAll" class="cookie-btn cookie-btn-primary">Accept</button>
        </div>
      </div>
    `;
    return banner;
  }


  // Show cookie banner
  function showCookieBanner() {
    if (hasConsent()) {
      // Ensure scroll is enabled if already consented
      document.body.style.overflow = '';
      return; // Don't show if already consented
    }

    const banner = createCookieBanner();
    document.body.appendChild(banner);

    // Fade in animation
    setTimeout(() => {
      banner.classList.add('show');
      // Only prevent scroll after popup is visible (check if it actually showed)
      setTimeout(() => {
        const visiblePopup = document.getElementById('cookieConsentBanner');
        if (visiblePopup && visiblePopup.classList.contains('show')) {
          // Check computed style to ensure popup is actually visible
          const style = window.getComputedStyle(visiblePopup);
          if (style.opacity !== '0' && style.visibility !== 'hidden') {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = '';
          }
        } else {
          // If popup didn't show, ensure scroll is enabled
          document.body.style.overflow = '';
        }
      }, 300);
    }, 100);

    // Event listeners - use event delegation to ensure they work
    banner.addEventListener('click', (e) => {
      if (e.target.id === 'cookieAcceptAll' || e.target.closest('#cookieAcceptAll')) {
        acceptAllCookies();
      } else if (e.target.id === 'cookieRejectAll' || e.target.closest('#cookieRejectAll')) {
        rejectAllCookies();
      }
    });
  }


  // Accept cookies and save data
  async function acceptAllCookies() {
    setCookie(COOKIE_CONSENT_KEY, 'accepted', COOKIE_EXPIRY_DAYS);
    
    // Collect and save user data
    const userData = await collectUserData();
    userData.consentStatus = 'accepted';
    userData.loginTimestamp = new Date().toISOString();
    
    // Save to backend
    try {
      await fetch(`${API_BASE}/api/cookies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (err) {
      console.error('Failed to save cookie data:', err);
    }
    
    hideCookieBanner();
  }

  // Reject cookies
  async function rejectAllCookies() {
    setCookie(COOKIE_CONSENT_KEY, 'rejected', COOKIE_EXPIRY_DAYS);
    
    // Still collect data but mark as rejected
    const userData = await collectUserData();
    userData.consentStatus = 'rejected';
    userData.loginTimestamp = new Date().toISOString();
    
    // Save to backend
    try {
      await fetch(`${API_BASE}/api/cookies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (err) {
      console.error('Failed to save cookie data:', err);
    }
    
    hideCookieBanner();
  }

  // Track logout timestamp
  function trackLogout() {
    const consent = getCookie(COOKIE_CONSENT_KEY);
    if (consent === 'accepted' || consent === 'rejected') {
      // Update logout timestamp in backend
      fetch(`${API_BASE}/api/cookies/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoutTimestamp: new Date().toISOString()
        })
      }).catch(err => console.error('Failed to track logout:', err));
    }
  }

  // Hide cookie banner
  function hideCookieBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) {
      banner.classList.remove('show');
      // Restore body scroll
      document.body.style.overflow = '';
      setTimeout(() => {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 300);
    }
  }

  // Initialize on page load
  function init() {
    // Show banner if no consent given
    if (!hasConsent()) {
      // Small delay to ensure page is loaded and CSS is available
      setTimeout(() => {
        showCookieBanner();
      }, 500);
    } else {
      // Ensure scroll is enabled if consent already given
      document.body.style.overflow = '';
    }
  }

  // Make functions globally available
  window.showCookieBanner = showCookieBanner;
  window.hasCookieConsent = hasConsent;
  window.trackLogout = trackLogout;
  
  // Track logout on page unload
  window.addEventListener('beforeunload', trackLogout);

  // Safety check: Ensure scroll is enabled if popup isn't visible
  function checkScrollState() {
    const popup = document.getElementById('cookieConsentBanner');
    if (!popup || !popup.classList.contains('show')) {
      document.body.style.overflow = '';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      // Check scroll state after a delay
      setTimeout(checkScrollState, 1000);
    });
  } else {
    init();
    setTimeout(checkScrollState, 1000);
  }
  
  // Periodic check to ensure scroll isn't blocked unnecessarily
  setInterval(checkScrollState, 2000);
})();
