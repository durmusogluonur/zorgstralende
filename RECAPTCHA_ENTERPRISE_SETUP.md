# reCAPTCHA Enterprise Server-Side Setup

## Overview

Bu proje artık **reCAPTCHA Enterprise** kullanıyor. Enterprise API, Google Cloud SDK ile server-side doğrulama yapıyor.

## Kurulum Adımları

### Adım 1: Google Cloud Project Oluşturma

1. https://console.cloud.google.com adresine gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. **Project ID**'yi not edin: `stralendezorg-1769372669461`

### Adım 2: reCAPTCHA Enterprise API'yi Etkinleştirme

1. Google Cloud Console → **APIs & Services** → **Library**
2. "reCAPTCHA Enterprise API" arayın
3. **Enable** butonuna tıklayın

### Adım 3: Service Account Oluşturma

1. **IAM & Admin** → **Service Accounts**
2. **Create Service Account** tıklayın
3. İsim: `recaptcha-enterprise-service`
4. **Create and Continue**
5. Role: **reCAPTCHA Enterprise Agent** seçin
6. **Done**

### Adım 4: Service Account Key Oluşturma

1. Oluşturduğunuz service account'a tıklayın
2. **Keys** sekmesi → **Add Key** → **Create new key**
3. **JSON** formatını seçin
4. Key dosyası indirilecek (güvenli tutun!)

### Adım 5: Vercel Environment Variables Ekleme

Vercel Dashboard → Settings → Environment Variables:

#### Variable 1: Google Cloud Project ID
- **Name:** `GOOGLE_CLOUD_PROJECT_ID`
- **Value:** `stralendezorg-1769372669461`
- **Environment:** Production, Preview, Development

#### Variable 2: Google Cloud Credentials (JSON)
- **Name:** `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- **Value:** İndirdiğiniz JSON dosyasının içeriği (tam JSON string)
- **Environment:** Production, Preview

**VEYA** (Alternatif - Daha Güvenli):

Vercel'de **Secrets** kullanarak:
1. Service account JSON dosyasını base64 encode edin
2. Vercel Secrets'a ekleyin
3. Runtime'da decode edin

#### Variable 3: reCAPTCHA Score Threshold (Opsiyonel)
- **Name:** `RECAPTCHA_SCORE_THRESHOLD`
- **Value:** `0.5` (default)
- **Environment:** Production, Preview

### Adım 6: Local Development için .env.local

`.env.local` dosyasına ekleyin:

```bash
GOOGLE_CLOUD_PROJECT_ID=stralendezorg-1769372669461
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
RECAPTCHA_SCORE_THRESHOLD=0.5
```

**ÖNEMLİ:** `.env.local` dosyası `.gitignore`'da olmalı (zaten var).

## Kod Yapısı

### Client-Side (ContactForm.tsx)
```typescript
grecaptcha.enterprise.ready(async () => {
  const token = await grecaptcha.enterprise.execute(siteKey, {
    action: 'contact_form',
  });
});
```

### Server-Side (app/api/contact/route.ts)
```typescript
const { RecaptchaEnterpriseServiceClient } = await import('@google-cloud/recaptcha-enterprise');
const client = new RecaptchaEnterpriseServiceClient();
const [response] = await client.createAssessment(request);
const score = response.riskAnalysis.score;
```

## Fallback Mekanizması

Eğer Google Cloud SDK yapılandırılmamışsa veya hata verirse:
- Otomatik olarak basic reCAPTCHA verification'a geçer
- `RECAPTCHA_SECRET_KEY` kullanarak standart API'yi çağırır
- Bu sayede site çalışmaya devam eder

## Score Threshold

- **0.9 - 1.0:** İnsan kullanıcı (yüksek güven)
- **0.5 - 0.9:** Muhtemelen insan
- **0.0 - 0.5:** Bot şüphesi (reddedilir)

Default threshold: **0.5**

## Test Etme

1. Environment variable'ları ekleyin
2. Vercel'de redeploy yapın
3. Contact formunu test edin
4. Server logs'da score'u görebilirsiniz:
   ```
   reCAPTCHA Enterprise verification successful. Score: 0.9
   ```

## Sorun Giderme

### "Cannot find module '@google-cloud/recaptcha-enterprise'"
```bash
npm install @google-cloud/recaptcha-enterprise
```

### "Permission denied" hatası
- Service account'a **reCAPTCHA Enterprise Agent** rolü verildiğinden emin olun
- Google Cloud Console'da API'nin enable olduğunu kontrol edin

### "Invalid credentials" hatası
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` doğru mu kontrol edin
- JSON formatı doğru mu kontrol edin (tırnak işaretleri escape edilmeli)

### Score her zaman düşük
- Threshold'u düşürebilirsiniz: `RECAPTCHA_SCORE_THRESHOLD=0.3`
- Veya test modunda threshold kontrolünü devre dışı bırakabilirsiniz

## Güvenlik Notları

- ✅ Service account key'leri **asla** GitHub'a commit etmeyin
- ✅ Vercel Secrets kullanın (production için)
- ✅ `.env.local` `.gitignore`'da olmalı
- ✅ Minimum score threshold kullanın (0.5+)

## Maliyet

reCAPTCHA Enterprise:
- **Ücretsiz tier:** Ayda 1 milyon assessment
- **Sonrası:** $1 per 1,000 assessment

Çoğu küçük işletme için ücretsiz tier yeterlidir.

## Avantajlar

✅ **Gelişmiş Analytics:** Google Cloud Console'da detaylı analitik
✅ **Risk Analysis:** Daha iyi bot tespiti
✅ **Score Reasons:** Neden düşük score aldığını görebilirsiniz
✅ **Enterprise Support:** Google'dan destek
✅ **Scalability:** Yüksek trafik için optimize
