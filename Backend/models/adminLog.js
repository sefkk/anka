const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminUsername: { type: String, required: true },
  actionType: { 
    type: String, 
    required: true,
    enum: [
      'page_enter',      // Admin paneline giriş
      'page_exit',       // Admin panelinden çıkış
      'keypress',        // Tuş basımı
      'tab_switch',      // Tab değiştirme
      'add_job',         // İş ilanı ekleme
      'delete_job',      // İş ilanı silme
      'add_startup',     // Startup ekleme
      'delete_startup',  // Startup silme
      'add_news',        // Haber ekleme
      'delete_news',     // Haber silme
      'add_legacy',      // Legacy üye ekleme
      'delete_legacy',   // Legacy üye silme
      'add_user',        // Yeni üye ekleme
      'grant_admin',     // Kullanıcıya adminlik verme
      'view_applicants', // Başvuranları görüntüleme
      'form_submit',     // Form gönderme
      'form_reset'       // Form sıfırlama
    ]
  },
  details: { type: mongoose.Schema.Types.Mixed }, // Esnek detay alanı (object, string, etc.)
  keyPressed: String,    // Basılan tuş (keypress için)
  keyCode: Number,       // Tuş kodu (keypress için)
  timestamp: { type: Date, default: Date.now }, // İşlem zamanı (milisaniye hassasiyeti)
  sessionId: String,     // Oturum ID'si (sayfa yüklendiğinde oluşturulur)
  ipAddress: String,     // IP adresi (opsiyonel)
  userAgent: String      // User agent (opsiyonel)
});

// Index for faster queries
adminLogSchema.index({ adminUsername: 1, timestamp: -1 });
adminLogSchema.index({ actionType: 1, timestamp: -1 });
adminLogSchema.index({ sessionId: 1 });

module.exports = mongoose.model("AdminLog", adminLogSchema, "admin-logs");
