# Güvenlik Kurulum Rehberi

Bu rehber, contact formu için güvenlik önlemlerinin kurulumunu açıklar.

## Eklenen Güvenlik Özellikleri

### 1. Google reCAPTCHA v3
- ✅ Görünmez captcha (kullanıcı deneyimini bozmaz)
- ✅ Otomatik bot tespiti
- ✅ Score tabanlı doğrulama (0.0 - 1.0)
- ✅ Ücretsiz

### 2. Rate Limiting
- ✅ IP bazlı rate limiting
- ✅ Dakikada maksimum 5 istek
- ✅ Otomatik temizleme

### 3. Input Sanitization
- ✅ XSS koruması
- ✅ Maksimum uzunluk kontrolü
- ✅ Email format doğrulama

### 4. Privacy Consent
- ✅ GDPR uyumlu onay kutusu
- ✅ Zorunlu alan kontrolü

## Adım Adım Kurulum

### Adım 1: Google reCAPTCHA v3 Hesabı Oluşturma

1. https://www.google.com/recaptcha/admin/create adresine gidin
2. Google hesabınızla giriş yapın
3. Formu doldurun:
   - **Label:** Stralendezorg Contact Form
   - **reCAPTCHA type:** reCAPTCHA v3 seçin
   - **Domains:** 
     - `localhost` (development için)
     - `zorgstralende.vercel.app` (Vercel preview için)
     - `stralendezorg.nl` (production için - domain'iniz varsa)
   - **Owners:** Email adresiniz
4. "Submit" butonuna tıklayın
5. **Site Key** ve **Secret Key**'i kopyalayın (sadece bir kez gösterilir!)

### Adım 2: Environment Variables Ekleme

#### Lokal Development (.env.local)

`.env.local` dosyasına ekleyin:

```bash
# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

**Not:** Yukarıdaki key'ler Google'ın test key'leridir. Kendi key'lerinizi kullanın!

#### Vercel Environment Variables

1. Vercel dashboard → Projeniz → Settings → Environment Variables
2. Şu variable'ları ekleyin:

   **Variable 1:**
   - **Name:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **Value:** Google'dan aldığınız Site Key
   - **Environment:** Production, Preview, Development

   **Variable 2:**
   - **Name:** `RECAPTCHA_SECRET_KEY`
   - **Value:** Google'dan aldığınız Secret Key
   - **Environment:** Production, Preview, Development

### Adım 3: Test Etme

1. Development server'ı başlatın: `npm run dev`
2. Contact sayfasına gidin: `http://localhost:3000/contact`
3. Formu doldurup gönderin
4. Browser console'da hata olmamalı
5. Email'inizin geldiğini kontrol edin

### Adım 4: Rate Limiting Test

Rate limiting'i test etmek için:
1. Formu 5 kez hızlıca gönderin
2. 6. denemede "Too many requests" hatası almalısınız
3. 1 dakika bekleyin, tekrar deneyin

## Güvenlik Özellikleri Detayları

### reCAPTCHA v3 Score

- **Score 0.9 - 1.0:** İnsan kullanıcı (yüksek güven)
- **Score 0.5 - 0.9:** Muhtemelen insan
- **Score 0.0 - 0.5:** Bot şüphesi (reddedilir)

Şu anda threshold **0.5** olarak ayarlanmış. İsterseniz `app/api/contact/route.ts` dosyasında değiştirebilirsiniz:

```typescript
return data.success === true && data.score >= 0.5; // Burayı değiştirin
```

### Rate Limiting Ayarları

`app/api/contact/route.ts` dosyasında ayarlanabilir:

```typescript
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 dakika
const RATE_LIMIT_MAX_REQUESTS = 5; // Maksimum istek sayısı
```

### Input Sanitization

- HTML tag'leri temizlenir (`<`, `>`)
- Maksimum uzunluk: 5000 karakter
- Email format kontrolü

## Production İçin Öneriler

1. **Domain Doğrulama:** Kendi domain'inizi (`stralendezorg.nl`) reCAPTCHA'ya ekleyin
2. **Redis Kullanımı:** Rate limiting için Redis kullanın (şu anda memory-based)
3. **Monitoring:** reCAPTCHA score'larını loglayın ve analiz edin
4. **Email Domain:** Resend'de kendi domain'inizi doğrulayın

## Sorun Giderme

### reCAPTCHA yüklenmiyor
- Site key'in doğru olduğundan emin olun
- Domain'in reCAPTCHA'da kayıtlı olduğundan emin olun
- Browser console'da hata var mı kontrol edin

### "reCAPTCHA verification failed" hatası
- Secret key'in doğru olduğundan emin olun
- Environment variable'ların doğru eklendiğinden emin olun
- Development'ta secret key yoksa otomatik geçer (sadece development)

### Rate limiting çalışmıyor
- Server'ı yeniden başlatın
- Farklı IP'den test edin

## Güvenlik Checklist

- [x] reCAPTCHA v3 entegrasyonu
- [x] Rate limiting
- [x] Input sanitization
- [x] Email format validation
- [x] Privacy consent (GDPR)
- [x] XSS koruması
- [ ] Redis rate limiting (opsiyonel, production için)
- [ ] Email domain doğrulama (Resend)
- [ ] Monitoring ve logging

## Maliyet

- **Google reCAPTCHA v3:** Tamamen ücretsiz
- **Rate Limiting:** Ücretsiz (memory-based)
- **Resend:** Ücretsiz tier (ayda 3,000 email)

## Sonraki Adımlar

1. Google reCAPTCHA key'lerini alın ve environment variable'lara ekleyin
2. Test edin
3. Production'a deploy edin
4. Monitoring ekleyin (opsiyonel)
