# Ücretsiz Email Servisi Kurulum Rehberi (Resend)

Bu rehber, contact formu için ücretsiz email servisi kurulumunu adım adım açıklar.

## Seçilen Servis: Resend

**Neden Resend?**
- ✅ Ücretsiz tier: Ayda 3,000 email (yeterli)
- ✅ Next.js ile mükemmel entegrasyon
- ✅ Kolay kurulum
- ✅ Güvenilir ve hızlı
- ✅ Modern API

## Adım Adım Kurulum

### Adım 1: Resend Hesabı Oluşturma

1. https://resend.com adresine gidin
2. "Sign Up" butonuna tıklayın
3. Email adresinizle kayıt olun (ücretsiz)
4. Email'inizi doğrulayın

### Adım 2: API Key Oluşturma

1. Resend dashboard'a giriş yapın
2. Sol menüden "API Keys" sekmesine gidin
3. "Create API Key" butonuna tıklayın
4. Key adı: `Stralendezorg Production` (veya istediğiniz bir isim)
5. Permission: "Sending access" seçin
6. "Create" butonuna tıklayın
7. **ÖNEMLİ:** API Key'i kopyalayın (sadece bir kez gösterilir!)

### Adım 3: Domain Doğrulama (Opsiyonel - İleride)

Şimdilik Resend'in test domain'i ile çalışabilirsiniz. İleride kendi domain'inizi (stralendezorg.nl) doğrulamak isterseniz:

1. Resend dashboard → "Domains"
2. "Add Domain" → `stralendezorg.nl`
3. DNS kayıtlarını ekleyin (Resend size talimatlar verecek)

### Adım 4: Vercel'de Environment Variable Ekleme

1. Vercel dashboard'a gidin: https://vercel.com
2. Projenizi seçin (`zorgstralende`)
3. "Settings" → "Environment Variables" sekmesine gidin
4. Yeni variable ekleyin:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Resend'den kopyaladığınız API key
   - **Environment:** Production, Preview, Development (hepsini seçin)
5. "Save" butonuna tıklayın

### Adım 5: Lokal Development için .env.local

Proje klasöründe `.env.local` dosyası oluşturun:

```bash
cd /Users/onur/zorgstralende
echo "RESEND_API_KEY=re_xxxxxxxxxxxxx" > .env.local
```

**ÖNEMLİ:** `.env.local` dosyası `.gitignore`'da olmalı (zaten var)

### Adım 6: Paket Yükleme

Terminal'de şu komutu çalıştırın:

```bash
npm install resend
```

### Adım 7: API Route Güncelleme

`app/api/contact/route.ts` dosyası zaten güncellenmiş durumda. Resend entegrasyonu eklendi.

### Adım 8: Test Etme

1. Development server'ı başlatın: `npm run dev`
2. Contact sayfasına gidin: `http://localhost:3000/contact`
3. Formu doldurup gönderin
4. Email'inizin geldiğini kontrol edin

## Email Alıcı Adresi

Şu anda email'ler `info@stralendezorg.nl` adresine gönderiliyor. Değiştirmek isterseniz `app/api/contact/route.ts` dosyasındaki `to` adresini değiştirin.

## Ücretsiz Limitler

- **Aylık:** 3,000 email (ücretsiz tier)
- **Günlük:** ~100 email
- Bu limit çoğu küçük işletme için yeterlidir.

## Sorun Giderme

### Email gelmiyor
1. Resend dashboard → "Logs" sekmesinden gönderim durumunu kontrol edin
2. API key'in doğru olduğundan emin olun
3. Spam klasörünü kontrol edin

### API Key hatası
1. Environment variable'ın doğru eklendiğinden emin olun
2. Server'ı yeniden başlatın (değişiklikler için)

## Sonraki Adımlar (Opsiyonel)

1. **Domain Doğrulama:** Kendi domain'inizi doğrulayın (daha profesyonel)
2. **Email Templates:** Resend'in template özelliğini kullanın
3. **Webhooks:** Email durumu için webhook ekleyin

## Maliyet

- **Ücretsiz Tier:** Tamamen ücretsiz (ayda 3,000 email)
- **Pro Tier:** $20/ay (ayda 50,000 email) - sadece ihtiyaç olursa

## Güvenlik Notları

- ✅ API key'i asla GitHub'a commit etmeyin
- ✅ `.env.local` dosyası `.gitignore`'da
- ✅ Production'da sadece Vercel environment variables kullanın
