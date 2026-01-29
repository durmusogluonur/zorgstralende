# Hostinger Deployment Rehberi

## GitHub'dan Otomatik Çekme Sonrası (Önemli – Beyaz Ekran Önleme)

Hostinger sadece `git pull` yapıyorsa **build üretilmez**; tarayıcı eski chunk dosyalarını arayıp 404 alır ve beyaz ekran oluşur. Her pull sonrası **mutlaka** sunucuda build alın ve Node uygulamasını yeniden başlatın.

1. **SSH veya Node.js Manager “Run script”** ile proje klasöründe:
   ```bash
   npm ci
   npm run build
   ```
2. Veya repo’daki script’i çalıştırın: `bash deploy.sh`
3. **Node.js uygulamasını Hostinger panelden yeniden başlatın** (Node.js Manager → Restart).

**Standalone mod:** Proje `output: 'standalone'` kullanıyor. Çalıştırırken `node .next/standalone/server.js` kullanın; `public` ve `.next/static` klasörlerini standalone çıktı içine veya doğru yere kopyalayın (Next.js dokümantasyonuna bakın). Hostinger Node.js “Start command” örneği: `node .next/standalone/server.js` (ve gerekliyse `NODE_ENV=production`).

## Hostinger'de Next.js Deploy

Hostinger'de Next.js projesi deploy etmek için özel yapılandırma gerekir.

## Mail Servisi Sorun Giderme

### Sorun: Mail servisi çalışmıyor

**Olası Nedenler:**
1. Environment variables yapılandırılmamış
2. Resend API key eksik
3. API route çalışmıyor
4. Node.js versiyonu uyumsuz

### Çözüm Adımları

#### 1. Environment Variables Kontrolü

Hostinger'de environment variables'ları ayarlamak için:

**Seçenek A: .env Dosyası (Önerilen)**
1. Hostinger File Manager veya FTP ile proje klasörüne gidin
2. `.env.production` veya `.env.local` dosyası oluşturun
3. İçine şunu ekleyin:

```bash
RESEND_API_KEY=re_PqDR3Pg5_HHkhjdCYpwGtSuNs7V37iuSN
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdTI1YsAAAAAHRh4YqhdNp0A8WGNEyNaICeb9LP
RECAPTCHA_SECRET_KEY=6LdTI1YsAAAAAJn-3X0UQoy3786jOEFVlJ3NtKIl
```

**Seçenek B: Hostinger Control Panel**
1. Hostinger Control Panel'e giriş yapın
2. **Advanced** → **Environment Variables** (varsa)
3. Variable'ları ekleyin

#### 2. API Route Test

Hostinger'de API route'un çalışıp çalışmadığını test edin:

```bash
# Terminal'den test (Hostinger SSH varsa)
curl -X POST https://yourdomain.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1234567890","message":"Test message","privacyConsent":true}'
```

#### 3. Log Kontrolü

Hostinger'de log dosyalarını kontrol edin:
- Error logs
- Application logs
- Next.js build logs

#### 4. Resend API Key Doğrulama

1. https://resend.com → API Keys
2. API key'inizin aktif olduğundan emin olun
3. Key'in "Sending access" permission'ına sahip olduğundan emin olun

## Hostinger Özel Yapılandırmalar

### .htaccess (Sadece statik export için)

Next.js’i **Node ile** çalıştırıyorsanız tüm istekler Node’a gitmeli; `/_next/static/*` ve `*.js` isteklerini index.html’e yönlendiren bir rewrite **kullanmayın** (beyaz ekran / chunk 404’e yol açar). Statik export kullanıyorsanız rewrite kullanabilirsiniz.

## Debug Adımları

### 1. Environment Variables Kontrolü

API route'a debug log ekleyin:

```typescript
console.log('RESEND_API_KEY configured:', !!process.env.RESEND_API_KEY);
console.log('Resend client initialized:', !!resend);
```

### 2. Email Gönderme Testi

Basit bir test endpoint oluşturun:

```typescript
// app/api/test-email/route.ts
import { Resend } from 'resend';

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'durmusogluonur@gmail.com',
      subject: 'Test Email',
      html: '<p>Test email from Hostinger</p>',
    });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

### 3. Server Logs Kontrolü

Hostinger'de server logs'u kontrol edin:
- `/var/log/` klasörü
- Hostinger Control Panel → Logs
- Application error logs

## Alternatif Çözümler

### 1. SMTP Kullanımı (Hostinger'in kendi SMTP'si)

Eğer Resend çalışmıyorsa, Hostinger'in kendi SMTP servisini kullanabilirsiniz:

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@yourdomain.com',
    pass: 'your-password',
  },
});
```

### 2. Formspree (Ücretsiz Alternatif)

Formspree gibi üçüncü parti servisler de kullanılabilir.

## Kontrol Listesi

- [ ] `.env.production` dosyası oluşturuldu
- [ ] `RESEND_API_KEY` environment variable eklendi
- [ ] API route çalışıyor (`/api/contact`)
- [ ] Resend API key aktif ve doğru
- [ ] Server logs kontrol edildi
- [ ] Node.js versiyonu uyumlu (18+)
- [ ] Next.js build başarılı

## Hostinger Support

Sorun devam ederse:
1. Hostinger support'a başvurun
2. Node.js/Next.js desteği olup olmadığını sorun
3. Environment variables'ların nasıl ayarlanacağını sorun
4. API route'ların çalışıp çalışmadığını kontrol edin
