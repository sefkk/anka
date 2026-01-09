// Cookie Consent Management
(function() {
  'use strict';

  const COOKIE_CONSENT_KEY = 'cookieConsent';
  const COOKIE_PREFERENCES_KEY = 'cookiePreferences';
  const COOKIE_EXPIRY_DAYS = 365;

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

  // Get user preferences
  function getPreferences() {
    const prefs = getCookie(COOKIE_PREFERENCES_KEY);
    if (prefs) {
      try {
        return JSON.parse(prefs);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Save preferences
  function savePreferences(preferences) {
    setCookie(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences), COOKIE_EXPIRY_DAYS);
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
          <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies. You can manage your preferences at any time.</p>
          <div class="cookie-consent-links">
            <a href="cookie-policy.html">Cookie Policy</a>
            <span>•</span>
            <a href="privacy-policy.html">Privacy Policy</a>
          </div>
        </div>
        <div class="cookie-popup-footer">
          <button id="cookieRejectAll" class="cookie-btn cookie-btn-secondary">Reject All</button>
          <button id="cookieCustomize" class="cookie-btn cookie-btn-secondary">Customize</button>
          <button id="cookieAcceptAll" class="cookie-btn cookie-btn-primary">Accept All</button>
        </div>
      </div>
    `;
    return banner;
  }

  // Create cookie settings modal
  function createCookieSettings() {
    const modal = document.createElement('div');
    modal.id = 'cookieSettingsModal';
    modal.className = 'cookie-settings-modal';
    // Set background immediately on creation - use cssText to override everything
    modal.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; background: rgba(0, 0, 0, 0.85) !important; background-color: rgba(0, 0, 0, 0.85) !important; z-index: 10001 !important; display: flex !important; align-items: center !important; justify-content: center !important; padding: 20px !important; backdrop-filter: blur(8px) !important; -webkit-backdrop-filter: blur(8px) !important; opacity: 1 !important; visibility: visible !important;';
    modal.innerHTML = `
      <div class="cookie-settings-content">
        <div class="cookie-settings-header">
          <h2>Cookie Preferences</h2>
          <button id="cookieSettingsClose" class="cookie-settings-close">&times;</button>
        </div>
        <div class="cookie-settings-body">
          <p>Manage your cookie preferences. You can enable or disable different types of cookies below.</p>
          
          <div class="cookie-setting-item">
            <div class="cookie-setting-info">
              <h3>Essential Cookies <span class="cookie-required-badge">Required</span></h3>
              <p>These cookies are necessary for the website to function and cannot be switched off.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="essentialCookies" checked disabled>
              <span class="cookie-slider"></span>
            </label>
          </div>
          
          <div class="cookie-setting-item">
            <div class="cookie-setting-info">
              <h3>Functional Cookies</h3>
              <p>These cookies enable enhanced functionality and personalization.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="functionalCookies" checked>
              <span class="cookie-slider"></span>
            </label>
          </div>
          
          <div class="cookie-setting-item">
            <div class="cookie-setting-info">
              <h3>Analytics Cookies</h3>
              <p>These cookies help us understand how visitors interact with our website.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="analyticsCookies">
              <span class="cookie-slider"></span>
            </label>
          </div>
          
          <div class="cookie-setting-item">
            <div class="cookie-setting-info">
              <h3>Preference Cookies</h3>
              <p>These cookies remember your preferences and settings.</p>
            </div>
            <label class="cookie-toggle">
              <input type="checkbox" id="preferenceCookies" checked>
              <span class="cookie-slider"></span>
            </label>
          </div>
        </div>
        <div class="cookie-settings-footer">
          <button id="cookieSavePreferences" class="cookie-btn cookie-btn-primary">Save Preferences</button>
          <button id="cookieAcceptAllModal" class="cookie-btn cookie-btn-secondary">Accept All</button>
        </div>
      </div>
    `;
    return modal;
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
      } else if (e.target.id === 'cookieCustomize' || e.target.closest('#cookieCustomize')) {
        e.preventDefault();
        e.stopPropagation();
        showCookieSettings();
      }
    });
  }

  // Show cookie settings modal
  function showCookieSettings() {
    // First, restore scroll in case it was blocked by popup
    document.body.style.overflow = '';
    
    // Hide the cookie popup first (but don't remove it)
    const popup = document.getElementById('cookieConsentBanner');
    if (popup) {
      popup.style.display = 'none';
      popup.classList.remove('show');
    }
    
    // Remove any existing modal
    const existingModal = document.getElementById('cookieSettingsModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create and append modal directly to body (not inside any container)
    const modal = createCookieSettings();
    
    // Ensure modal is appended to body, not inside any other element
    if (document.body) {
      document.body.appendChild(modal);
    } else {
      // Fallback: append to document root
      document.documentElement.appendChild(modal);
    }

    // Background is already set in createCookieSettings via cssText
    // Just add show class for animation
    modal.classList.add('show');
    
    // Force a repaint to ensure styles are applied
    void modal.offsetHeight;

    // Load existing preferences after DOM is ready
    setTimeout(() => {
      const prefs = getPreferences();
      const functionalCheckbox = document.getElementById('functionalCookies');
      const analyticsCheckbox = document.getElementById('analyticsCookies');
      const preferenceCheckbox = document.getElementById('preferenceCookies');
      
      if (functionalCheckbox) {
        functionalCheckbox.checked = prefs ? (prefs.functional !== false) : true;
      }
      if (analyticsCheckbox) {
        analyticsCheckbox.checked = prefs ? (prefs.analytics === true) : false;
      }
      if (preferenceCheckbox) {
        preferenceCheckbox.checked = prefs ? (prefs.preference !== false) : true;
      }
    }, 50);

    // Verify modal is visible and then block scroll
    setTimeout(() => {
      const modalElement = document.getElementById('cookieSettingsModal');
      if (modalElement) {
        const rect = modalElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(modalElement);
        
        // Only block scroll if modal is actually visible
        if (rect.width > 0 && rect.height > 0 && 
            computedStyle.opacity !== '0' && 
            computedStyle.visibility !== 'hidden') {
          document.body.style.overflow = 'hidden';
        } else {
          // If modal didn't appear, restore everything
          document.body.style.overflow = '';
          if (popup) {
            popup.style.display = 'flex';
          }
        }
      } else {
        // Modal doesn't exist, restore scroll
        document.body.style.overflow = '';
        if (popup) {
          popup.style.display = 'flex';
        }
      }
    }, 100);
    
    // Safety timeout: if modal still not visible after 300ms, restore scroll
    setTimeout(() => {
      const modalElement = document.getElementById('cookieSettingsModal');
      if (modalElement) {
        const computedStyle = window.getComputedStyle(modalElement);
        if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
          // Modal not visible, restore scroll and show popup
          document.body.style.overflow = '';
          if (popup) {
            popup.style.display = 'flex';
          }
        }
      } else {
        // Modal removed, restore scroll
        document.body.style.overflow = '';
        if (popup) {
          popup.style.display = 'flex';
        }
      }
    }, 300);

    // Event listeners - use event delegation to ensure they work
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'cookieSettingsClose' || e.target.closest('#cookieSettingsClose')) {
        hideCookieSettings();
      } else if (e.target.id === 'cookieSavePreferences' || e.target.closest('#cookieSavePreferences')) {
        saveCookiePreferences();
      } else if (e.target.id === 'cookieAcceptAllModal' || e.target.closest('#cookieAcceptAllModal')) {
        acceptAllCookies();
      }
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideCookieSettings();
      }
    });
  }

  // Hide cookie settings
  function hideCookieSettings() {
    const modal = document.getElementById('cookieSettingsModal');
    if (modal) {
      // Restore scroll immediately
      document.body.style.overflow = '';
      
      modal.classList.remove('show');
      
      // Remove modal after animation
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
        // Show cookie popup again if it exists and user hasn't given consent
        const popup = document.getElementById('cookieConsentBanner');
        if (popup && !hasConsent()) {
          popup.style.display = 'flex';
        } else if (!hasConsent()) {
          // If popup doesn't exist but consent not given, ensure scroll is enabled
          document.body.style.overflow = '';
        }
      }, 300);
    }
  }

  // Accept all cookies
  function acceptAllCookies() {
    setCookie(COOKIE_CONSENT_KEY, 'accepted', COOKIE_EXPIRY_DAYS);
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      preference: true
    });
    hideCookieBanner();
    hideCookieSettings();
  }

  // Reject all non-essential cookies
  function rejectAllCookies() {
    setCookie(COOKIE_CONSENT_KEY, 'rejected', COOKIE_EXPIRY_DAYS);
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      preference: false
    });
    hideCookieBanner();
  }

  // Save custom preferences
  function saveCookiePreferences() {
    const functionalCheckbox = document.getElementById('functionalCookies');
    const analyticsCheckbox = document.getElementById('analyticsCookies');
    const preferenceCheckbox = document.getElementById('preferenceCookies');
    
    if (!functionalCheckbox || !analyticsCheckbox || !preferenceCheckbox) {
      console.error('Cookie preference checkboxes not found');
      return;
    }
    
    const preferences = {
      essential: true, // Always true
      functional: functionalCheckbox.checked,
      analytics: analyticsCheckbox.checked,
      preference: preferenceCheckbox.checked
    };

    setCookie(COOKIE_CONSENT_KEY, 'custom', COOKIE_EXPIRY_DAYS);
    savePreferences(preferences);
    hideCookieBanner();
    hideCookieSettings();
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
  window.showCookieSettings = showCookieSettings;
  window.getCookiePreferences = getPreferences;
  window.hasCookieConsent = hasConsent;

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
