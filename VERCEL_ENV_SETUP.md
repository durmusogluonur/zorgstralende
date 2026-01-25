# Vercel Environment Variables Kurulum Rehberi

## Sorun
Production'da (Vercel'de) reCAPTCHA site key hatası alıyorsunuz:
```
reCAPTCHA site key not configured
```

## Çözüm: Vercel'de Environment Variables Ekleme

### Adım 1: Vercel Dashboard'a Giriş
1. https://vercel.com adresine gidin
2. Projenizi seçin (`zorgstralende` veya `stralendezorg`)

### Adım 2: Environment Variables Ekleme
1. **Settings** sekmesine tıklayın
2. Sol menüden **Environment Variables** seçin
3. Aşağıdaki variable'ları ekleyin:

#### Variable 1: reCAPTCHA Site Key
- **Name:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- **Value:** `6LdTI1YsAAAAAHRh4YqhdNp0A8WGNEyNaICeb9LP`
- **Environment:** 
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 2: reCAPTCHA Secret Key
- **Name:** `RECAPTCHA_SECRET_KEY`
- **Value:** `6LdTI1YsAAAAAJn-3X0UQoy3786jOEFVlJ3NtKIl`
- **Environment:**
  - ✅ Production
  - ✅ Preview
  - ✅ Development

#### Variable 3: Resend API Key
- **Name:** `RESEND_API_KEY`
- **Value:** `re_PqDR3Pg5_HHkhjdCYpwGtSuNs7V37iuSN`
- **Environment:**
  - ✅ Production
  - ✅ Preview
  - ✅ Development

### Adım 3: Deploy Yenileme
Environment variable'ları ekledikten sonra:

1. **Redeploy** yapın:
   - Vercel Dashboard → **Deployments** sekmesi
   - En son deployment'ın yanındaki **⋯** (üç nokta) menüsüne tıklayın
   - **Redeploy** seçin
   - ✅ **Use existing Build Cache** işaretini kaldırın (önemli!)
   - **Redeploy** butonuna tıklayın

VEYA

2. **Yeni bir commit push edin:**
   ```bash
   git commit --allow-empty -m "Trigger redeploy for env vars"
   git push
   ```

### Adım 4: Kontrol
Deploy tamamlandıktan sonra:
1. Siteyi açın
2. Contact formunu test edin
3. Browser console'u kontrol edin (F12)
4. Artık "reCAPTCHA site key not configured" hatası görünmemeli

## Önemli Notlar

### NEXT_PUBLIC_ Prefix
- `NEXT_PUBLIC_` ile başlayan variable'lar **client-side**'da kullanılabilir
- Bu variable'lar browser'da görülebilir (güvenlik riski yok, public key)
- `RECAPTCHA_SECRET_KEY` **asla** `NEXT_PUBLIC_` ile başlamamalı (secret key)

### Environment Seçimi
- **Production:** Canlı site için
- **Preview:** Pull request'ler için
- **Development:** Local development için (opsiyonel)

### Güvenlik
- ✅ Site Key public olabilir (browser'da görünebilir)
- ❌ Secret Key **asla** public olmamalı
- Secret Key sadece server-side'da kullanılır

## Sorun Giderme

### Hata devam ediyor
1. Environment variable'ların doğru eklendiğinden emin olun
2. Redeploy yaptığınızdan emin olun (cache temizlenmiş olmalı)
3. Variable isimlerinin tam olarak doğru olduğundan emin olun (büyük/küçük harf duyarlı)
4. Browser cache'ini temizleyin (Hard Refresh: Cmd+Shift+R / Ctrl+Shift+R)

### Variable'lar görünmüyor
- Vercel'de variable'lar eklendikten sonra **mutlaka redeploy** yapılmalı
- Build cache temizlenmeli
- Yeni bir deployment oluşturulmalı

## Test Etme

Deploy sonrası test:
1. Siteyi açın: `https://zorgstralende.vercel.app`
2. Contact sayfasına gidin
3. Browser console'u açın (F12)
4. Formu doldurup gönderin
5. Console'da hata olmamalı
6. Email'inizin geldiğini kontrol edin

## Mevcut Environment Variables

Şu anda Vercel'de olması gereken variable'lar:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `6LdTI1YsAAAAAHRh4YqhdNp0A8WGNEyNaICeb9LP` | All |
| `RECAPTCHA_SECRET_KEY` | `6LdTI1YsAAAAAJn-3X0UQoy3786jOEFVlJ3NtKIl` | All |
| `RESEND_API_KEY` | `re_PqDR3Pg5_HHkhjdCYpwGtSuNs7V37iuSN` | All |
