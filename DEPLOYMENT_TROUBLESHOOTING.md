# Beyaz Ekran / Chunk 404 Hatası Çözümü

## Belirtiler
- Site beyaz ekran gösteriyor
- Console: `GET .../246-xxx.js net::ERR_ABORTED 404`
- Console: `ChunkLoadError: Loading chunk 246 failed`
- MIME type: 'text/html' (sunucu JS yerine HTML sayfası dönüyor)

## Neden
HTML yeni build’e ait chunk dosya isimlerini kullanıyor ama sunucuda bu JS dosyaları yok. Genelde:
- Sadece kısmen deploy edildi (HTML güncel, `_next/static` eski veya eksik), veya
- Eski cache (CDN/tarayıcı) yeni HTML’i gösteriyor, chunk’lar eski build’den.

## Çözüm Adımları

### Vercel kullanıyorsanız
1. Vercel Dashboard → projeniz → **Deployments**
2. En son deployment’a tıklayın → sağ üst **⋯** → **Redeploy**
3. **“Redeploy with existing Build Cache”** kutusunu **işaretlemeyin** (cache’i temizleyerek redeploy)
4. **Redeploy** butonuna basın
5. Build bitene kadar bekleyin, sonra https://stralendezorg.nl adresini **gizli pencere** veya farklı tarayıcıda açın

### Hostinger veya manuel deploy
1. Lokal projede temiz build alın:
   ```bash
   cd /Users/onur/zorgstralende
   rm -rf .next
   npm run build
   ```
2. Sunucuya **tüm** build çıktısını yükleyin:
   - `.next` klasörünün **tamamı** (özellikle `.next/static/chunks/` ve `.next/static/css/`)
   - `public/` klasörü
   - `node_modules` gerekliyse veya `standalone` kullanıyorsanız `output: 'standalone'` ile üretilen çıktı
3. Node uygulamasını yeniden başlatın
4. Tarayıcıda cache’i temizleyin veya gizli pencerede test edin

### Her platform için
- Deploy sonrası **aynı build**’e ait HTML ve `_next/static/*` dosyalarının birlikte yayında olduğundan emin olun
- Sorun sürerse tarayıcıda **Hard Refresh**: Mac `Cmd+Shift+R`, Windows `Ctrl+Shift+R`
