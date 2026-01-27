# reCAPTCHA "Geçersiz Alan" Hatası Çözümü

## Hata Mesajı
```
Site anahtarı için geçersiz alan
Invalid domain for site key
```

## Sorunun Nedeni

Bu hata, **reCAPTCHA site key'inin Google reCAPTCHA konsolunda kayıtlı olan domain'lerle, sitenin çalıştığı domain'in eşleşmemesinden** kaynaklanır.

### Neden Oluşur?

1. **Domain Kayıtlı Değil**: reCAPTCHA site key'i Google konsolunda sadece belirli domain'ler için kayıtlı (örn: `localhost`, `zorgstralende.vercel.app`)
2. **Farklı Domain**: Site farklı bir domain'de çalışıyor (örn: başka bir Vercel URL'i, custom domain)
3. **Wildcard Eksik**: `*.vercel.app` wildcard domain kayıtlı değil

## Çözüm Adımları

### Adım 1: Google reCAPTCHA Konsolunu Açın

1. https://www.google.com/recaptcha/admin adresine gidin
2. Google hesabınızla giriş yapın
3. **Stralendezorg Contact Form** (veya ilgili site key'inizi) seçin

### Adım 2: Domain'leri Kontrol Edin

**Settings** sekmesinde **Domains** bölümünü bulun.

### Adım 3: Tüm Domain'leri Ekleyin

Aşağıdaki domain'leri ekleyin (her birini ayrı satıra):

```
localhost
127.0.0.1
zorgstralende.vercel.app
*.vercel.app
stralendezorg.nl
www.stralendezorg.nl
```

**Önemli:**
- `localhost` - Local development için
- `127.0.0.1` - Local development için (alternatif)
- `zorgstralende.vercel.app` - Vercel production URL'i
- `*.vercel.app` - Tüm Vercel preview URL'leri için (wildcard)
- `stralendezorg.nl` - Custom domain (varsa)
- `www.stralendezorg.nl` - www subdomain (varsa)

### Adım 4: Kaydet ve Bekle

1. **Save** butonuna tıklayın
2. **5-10 dakika bekleyin** (Google'ın DNS cache'i güncellenmesi için)
3. Siteyi yenileyin ve tekrar test edin

## Alternatif Çözüm: Development'ta reCAPTCHA'yı Devre Dışı Bırakma

Eğer sadece production'da reCAPTCHA kullanmak istiyorsanız, kod zaten bunu destekliyor:

- Development'ta reCAPTCHA yüklenmez (localhost hariç)
- Production'da reCAPTCHA aktif olur
- Domain hatası alırsanız, form yine de çalışır (reCAPTCHA token olmadan)

## Test Etme

1. Domain'leri ekledikten sonra 5-10 dakika bekleyin
2. Browser cache'ini temizleyin (Hard Refresh: `Cmd+Shift+R` / `Ctrl+Shift+R`)
3. Siteyi yenileyin
4. Browser console'u açın (F12)
5. Contact formunu test edin
6. Console'da "reCAPTCHA loaded successfully" mesajını görmelisiniz

## Hata Devam Ediyorsa

### Kontrol Listesi:

- [ ] Google reCAPTCHA konsolunda domain'ler eklendi mi?
- [ ] 5-10 dakika beklendi mi?
- [ ] Browser cache temizlendi mi?
- [ ] Site key doğru mu? (`6LdTI1YsAAAAAHRh4YqhdNp0A8WGNEyNaICeb9LP`)
- [ ] Vercel'de environment variable doğru mu?
- [ ] Vercel'de redeploy yapıldı mı?

### Debug İçin:

Browser console'da şu komutu çalıştırın:
```javascript
console.log('Current domain:', window.location.hostname);
console.log('reCAPTCHA loaded:', typeof window.grecaptcha !== 'undefined');
```

Bu domain'i Google reCAPTCHA konsoluna eklemelisiniz.

## Önemli Notlar

1. **Wildcard Domain**: `*.vercel.app` eklemek, tüm Vercel preview URL'lerini kapsar
2. **Localhost**: Development için `localhost` ve `127.0.0.1` eklenmeli
3. **Custom Domain**: Eğer custom domain kullanıyorsanız, hem `domain.com` hem de `www.domain.com` ekleyin
4. **Bekleme Süresi**: Domain ekledikten sonra 5-10 dakika beklemeniz gerekebilir

## Kod İyileştirmeleri

Kodda şu iyileştirmeler yapıldı:

1. ✅ Domain hatası için özel error handling
2. ✅ Development'ta reCAPTCHA'yı devre dışı bırakma seçeneği
3. ✅ Daha açıklayıcı error mesajları
4. ✅ Console'da domain bilgisi gösterimi

## Sonuç

Bu hata **domain kayıt sorunu**dur. Google reCAPTCHA konsolunda tüm domain'leri ekledikten sonra çözülecektir.
