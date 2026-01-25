# Cookie Consent (Çerez Onayı) Kurulum Rehberi

## Eklenen Özellikler

✅ **GDPR Uyumlu Cookie Consent Banner**
- Modern ve kullanıcı dostu arayüz
- Framer Motion animasyonları
- Tailwind CSS ile responsive tasarım
- Çok dilli destek (Nederlands/English)

✅ **Granüler Cookie Kontrolü**
- Noodzakelijke (Gerekli) cookies - Her zaman aktif
- Analytische (Analitik) cookies - Kullanıcı seçimi
- Marketing cookies - Kullanıcı seçimi

✅ **Kullanıcı Tercihleri**
- Tüm çerezleri kabul et
- Sadece gerekli çerezleri kabul et
- Özelleştirilmiş seçenekler
- Tercihler localStorage'da saklanır

✅ **Cookie Settings Button**
- Kullanıcılar tercihlerini istediği zaman değiştirebilir
- Sol alt köşede sabit buton

## Nasıl Çalışır?

1. **İlk Ziyaret:** Kullanıcı siteye ilk kez geldiğinde cookie banner görünür
2. **Seçim Yapma:** Kullanıcı üç seçenekten birini seçer:
   - "Alles accepteren" (Tümünü kabul et)
   - "Alleen noodzakelijke" (Sadece gerekli)
   - "Aanpassen" (Özelleştir)
3. **Tercih Kaydetme:** Seçim localStorage'a kaydedilir
4. **Sonraki Ziyaretler:** Banner tekrar gösterilmez
5. **Ayarları Değiştirme:** Sol alt köşedeki 🍪 butonuna tıklayarak tercihler değiştirilebilir

## Teknik Detaylar

### Cookie Kategorileri

#### 1. Noodzakelijke (Gerekli) Cookies
- **Her zaman aktif** - Devre dışı bırakılamaz
- Site fonksiyonelliği için gerekli
- Örnek: Session cookies, authentication cookies

#### 2. Analytische (Analitik) Cookies
- **Kullanıcı seçimi** - Açılıp kapatılabilir
- Site kullanım istatistikleri için
- Örnek: Google Analytics (eklenmemiş, hazır altyapı var)

#### 3. Marketing Cookies
- **Kullanıcı seçimi** - Açılıp kapatılabilir
- Reklam ve pazarlama için
- Örnek: Facebook Pixel, Google Ads (eklenmemiş, hazır altyapı var)

### LocalStorage Yapısı

```javascript
// Cookie consent kaydı
localStorage.setItem('cookie-consent', JSON.stringify({
  necessary: true,
  analytics: false,
  marketing: false
}));

// Tarih kaydı
localStorage.setItem('cookie-consent-date', '2024-01-25T12:00:00.000Z');
```

### Analytics Entegrasyonu

Analytics cookies'i aktif olduğunda, `applyCookiePreferences` fonksiyonu çağrılır. Burada Google Analytics veya başka bir analytics aracı ekleyebilirsiniz:

```typescript
// components/CookieConsent.tsx içinde
const applyCookiePreferences = (prefs: CookiePreferences) => {
  if (prefs.analytics) {
    // Google Analytics'i aktif et
    // gtag('consent', 'update', { analytics_storage: 'granted' });
  } else {
    // Google Analytics'i devre dışı bırak
    // gtag('consent', 'update', { analytics_storage: 'denied' });
  }
};
```

## Özelleştirme

### Renkleri Değiştirme

`components/CookieConsent.tsx` dosyasında Tailwind class'larını değiştirerek renkleri özelleştirebilirsiniz:

```tsx
// Primary renk (mavi)
className="bg-primary-600" // → bg-blue-600 veya istediğiniz renk
```

### Metinleri Değiştirme

`getCookieText()` fonksiyonu içinde metinleri düzenleyebilirsiniz.

### Banner Pozisyonu

Banner şu anda `bottom-0` (alt) konumunda. Üstte göstermek için:

```tsx
className="fixed top-0 left-0 right-0 z-50" // bottom-0 yerine top-0
```

## GDPR Uyumluluk

✅ **Gerekli Özellikler:**
- Kullanıcıya bilgilendirme
- Açık onay mekanizması
- Granüler kontrol (kategori bazlı)
- Tercihleri değiştirme imkanı
- Tercihlerin saklanması

## Test Etme

1. Development server'ı başlatın: `npm run dev`
2. Tarayıcıda siteyi açın
3. Cookie banner'ın göründüğünü kontrol edin
4. Farklı seçenekleri test edin
5. localStorage'ı kontrol edin (DevTools → Application → Local Storage)
6. Sayfayı yenileyin - banner tekrar görünmemeli
7. Sol alt köşedeki 🍪 butonuna tıklayın - ayarlar açılmalı

## Production İçin Öneriler

1. **Privacy Policy Linki:** "Meer informatie" butonuna privacy policy sayfası linki ekleyin
2. **Analytics Entegrasyonu:** Google Analytics eklediğinizde `applyCookiePreferences` fonksiyonunu güncelleyin
3. **Cookie Listesi:** Hangi cookie'lerin kullanıldığını listeleyen bir sayfa oluşturun
4. **Server-Side Tracking:** Analytics tercihlerini server-side'a da gönderin (opsiyonel)

## Sorun Giderme

### Banner görünmüyor
- localStorage'ı temizleyin: `localStorage.removeItem('cookie-consent')`
- Sayfayı yenileyin

### Tercihler kaydedilmiyor
- Browser console'da hata var mı kontrol edin
- localStorage desteği var mı kontrol edin

### Ayarlar butonu görünmüyor
- Önce cookie banner'ı kabul etmeniz gerekiyor
- localStorage'da `cookie-consent` kaydı olmalı

## Maliyet

✅ **Tamamen Ücretsiz**
- Açık kaynak kod
- Harici servis yok
- Sınırsız kullanım

## Sonraki Adımlar

1. Privacy Policy sayfası oluşturun
2. "Meer informatie" linkini privacy policy'ye bağlayın
3. Google Analytics ekleyin (isteğe bağlı)
4. Cookie listesi sayfası oluşturun (isteğe bağlı)
