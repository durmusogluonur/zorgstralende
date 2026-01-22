# Deployment Rehberi - Stralendezorg Website

Bu dosya, projeyi Vercel'e deploy etmek için gereken adımları içerir.

## ✅ Tamamlanan Adımlar

- [x] Git repository oluşturuldu
- [x] İlk commit yapıldı
- [x] Main branch oluşturuldu

## 📋 Yapılacaklar

### Adım 1: GitHub Repository Oluşturma

1. https://github.com adresine gidin ve giriş yapın
2. Sağ üstteki "+" butonuna tıklayın → "New repository"
3. Repository bilgileri:
   - **Repository name:** `zorgstralende` veya `stralendezorg-website`
   - **Visibility:** Public (önerilen - Vercel ücretsiz plan için)
   - **Initialize this repository with:** Hiçbirini işaretlemeyin (README, .gitignore, license)
4. "Create repository" butonuna tıklayın

### Adım 2: Kodu GitHub'a Push Etme

GitHub repository oluşturduktan sonra, GitHub'ın gösterdiği komutları kullanın veya aşağıdaki komutları çalıştırın:

```bash
cd /Users/onur/zorgstralende

# GitHub repository URL'inizi buraya yazın (örnek):
git remote add origin https://github.com/KULLANICI_ADINIZ/zorgstralende.git

# Kodu push edin
git push -u origin main
```

**Not:** `KULLANICI_ADINIZ` yerine kendi GitHub kullanıcı adınızı yazın.

### Adım 3: Vercel Hesabı Oluşturma

1. https://vercel.com adresine gidin
2. "Sign Up" butonuna tıklayın
3. "Continue with GitHub" seçeneğini seçin (önerilen)
4. GitHub hesabınızla giriş yapın ve Vercel'e izin verin

### Adım 4: Vercel'de Proje Import Etme

1. Vercel dashboard'da "Add New..." → "Project" butonuna tıklayın
2. "Import Git Repository" bölümünde GitHub repository'nizi seçin
3. Repository listesinden `zorgstralende` projenizi bulun ve "Import" butonuna tıklayın

### Adım 5: Vercel Proje Ayarları

Vercel otomatik olarak Next.js projesini algılayacak. Şu ayarları kontrol edin (genellikle varsayılanlar doğrudur):

- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Adım 6: Deploy Etme

1. "Deploy" butonuna tıklayın
2. Vercel otomatik olarak build ve deploy işlemini başlatacak
3. İşlem 2-3 dakika sürebilir

### Adım 7: Siteyi Görüntüleme

Deploy tamamlandıktan sonra:
- Vercel size bir URL verecek: `https://zorgstralende.vercel.app` (veya benzer)
- Bu URL'yi tarayıcıda açarak sitenizi görebilirsiniz

## 🔄 Otomatik Deployments

Her GitHub push'unda Vercel otomatik olarak:
- Yeni bir deployment başlatır
- Build işlemini çalıştırır
- Siteyi günceller

## 🌐 Custom Domain (Opsiyonel)

Kendi domain'inizi eklemek için:

1. Vercel dashboard → Projeniz → Settings → Domains
2. Domain adınızı ekleyin (örn: `www.stralendezorg.nl`)
3. Vercel'in verdiği DNS ayarlarını domain sağlayıcınızda yapın

## 📞 Yardım

Sorun yaşarsanız:
1. Lokal build test edin: `npm run build`
2. Vercel build loglarını kontrol edin
3. GitHub repository'nin public olduğundan emin olun

## 🎉 Başarılar!

Deployment tamamlandıktan sonra siteniz canlıda olacak!
