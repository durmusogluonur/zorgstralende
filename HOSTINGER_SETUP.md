# Stralendezorg.nl – Hostinger Kurulum (Beyaz Ekran / Görünüm Gitti Çözümü)

## Sorun ne?

Tarayıcı `/_next/static/css/...` ve `/_next/static/chunks/...` dosyalarını istiyor ama **404** alıyor veya sunucu **HTML sayfası** dönüyor. Sonuç: CSS ve JS yüklenmiyor, site beyaz / çıplak görünüyor.

**Sebep:** GitHub’dan sadece `git pull` yapılıyor; **build alınmıyor**. Next.js’in ürettiği `.next/static` klasörü sunucuda yok (veya eski).

---

## Çözüm: Her pull sonrası mutlaka build alın

Hostinger’da GitHub’dan güncelleme çekildikten sonra **her seferinde** şu adımlar çalıştırılmalı:

### Yöntem A: `npm start` ile (önerilen – basit)

1. **SSH** veya Hostinger **Node.js Manager** içindeki “Run script” / terminal ile proje klasörüne gidin:
   ```bash
   cd /path/to/zorgstralende   # Hostinger’daki proje yolu
   ```

2. Bağımlılıkları kurun ve **build** alın:
   ```bash
   npm ci
   npm run build
   ```

3. Node uygulamasını **yeniden başlatın** (Hostinger panel → Node.js Manager → Restart).

4. **Start command** panelde şu olmalı:
   ```bash
   npm start
   ```
   (Veya: `npx next start` / `node node_modules/.bin/next start`)

5. Uygulama **proje kök dizininde** çalışmalı (içinde `package.json`, `.next`, `public` olan klasör). Böylece Next.js `._next/static` ve `public` dosyalarını doğru sunar.

---

### Yöntem B: Repo’daki script ile

1. Proje klasöründe:
   ```bash
   bash deploy.sh
   ```

2. Script `npm ci` ve `npm run build` çalıştırır. Bittikten sonra Node uygulamasını panelden **Restart** edin.

3. Start command yine: `npm start` (proje kökünden).

---

### Yöntem C: Standalone (tek klasör deploy)

Build sonrası statik dosyaları standalone içine kopyalayıp sadece Node ile çalıştırmak isterseniz:

1. Build ve kopyalama:
   ```bash
   npm ci
   npm run build
   cp -r public .next/standalone/
   cp -r .next/static .next/standalone/.next/
   ```

2. Start command (proje kökünden):
   ```bash
   node .next/standalone/server.js
   ```

---

## Kontrol listesi

- [ ] GitHub’dan pull sonrası **mutlaka** `npm run build` çalıştırılıyor
- [ ] Start command: `npm start` veya `node .next/standalone/server.js` (proje kökünden)
- [ ] Node uygulaması **restart** edildi
- [ ] Apache/Nginx’te `/_next` istekleri **Node’a proxy** ediliyor; `/_next/*` asla tek bir HTML sayfasına (SPA rewrite) yönlendirilmiyor

---

## Apache kullanıyorsanız

Next.js’i **Node ile** çalıştırıyorsanız, tüm istekler Node’a gitmeli. `/_next/` veya `*.js` isteklerini `index.html`’e yönlendiren bir kural **kullanmayın**; aksi halde CSS/JS istekleri HTML döner ve görünüm bozulur. Node’a proxy örneği:

```apache
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

(Port 3000 yerine Node uygulamanızın dinlediği portu yazın.)

---

## Özet

**“Sitenin görünümü gitti”** = `/_next/static/` dosyaları bulunamıyor veya HTML dönüyor.  
**Çözüm:** Her deploy’da (Git pull sonrası) sunucuda `npm ci` + `npm run build` çalıştırın, sonra Node uygulamasını yeniden başlatın; start command’ın proje kökünden ve doğru (`npm start` veya standalone `server.js`) olduğundan emin olun.
