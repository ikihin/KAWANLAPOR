# 📦 Cara Membuat ZIP untuk VPS

## Cara Manual

### Option 1: Download dari Figma Make
1. Download semua files dari Figma Make workspace
2. Compress menjadi ZIP

### Option 2: Dari Terminal (jika sudah di Git)
```bash
# Zip semua files (exclude node_modules, dist)
zip -r kawanlapor.zip . \
  -x "node_modules/*" \
  -x "dist/*" \
  -x ".git/*" \
  -x "*.log"
```

### Option 3: Dari Windows
1. Select all files KECUALI `node_modules` dan `dist`
2. Right-click > Send to > Compressed (zipped) folder

### Option 4: Dari Mac
1. Select all files KECUALI `node_modules` dan `dist`
2. Right-click > Compress

---

## 📋 Files yang HARUS ada di ZIP:

### Root Files
✅ package.json
✅ tsconfig.json
✅ vite.config.ts
✅ index.html
✅ main.tsx
✅ App.tsx
✅ .env.example
✅ ecosystem.config.js
✅ deploy.sh
✅ README.md
✅ DEPLOYMENT.md

### Folders
✅ /components (semua files)
✅ /styles (globals.css)
✅ /supabase/functions/server (index.tsx, kv_store.tsx)
✅ /utils/supabase (info.tsx)

### Files yang TIDAK PERLU:
❌ node_modules/
❌ dist/
❌ .git/
❌ *.log files
❌ test-build.tsx

---

## 🚀 Cara Upload ke VPS

### Option 1: Via SCP
```bash
# Dari local machine
scp kawanlapor.zip user@your-vps-ip:~/

# Di VPS
cd ~
unzip kawanlapor.zip -d kawanlapor
cd kawanlapor
```

### Option 2: Via SFTP
1. Buka FileZilla atau WinSCP
2. Connect ke VPS
3. Upload file kawanlapor.zip
4. Di VPS terminal:
```bash
cd ~
unzip kawanlapor.zip -d kawanlapor
cd kawanlapor
```

### Option 3: Via Git (Recommended)
```bash
# Push ke GitHub/GitLab
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

# Di VPS
git clone <your-repo-url> kawanlapor
cd kawanlapor
```

---

## ⚙️ Setelah Upload ke VPS

1. **Setup environment**
```bash
cp .env.example .env
nano .env  # Edit dengan Supabase credentials
```

2. **Install & Deploy**
```bash
chmod +x deploy.sh
./deploy.sh
```

3. **Atau manual:**
```bash
npm install
npm run build
pm2 start ecosystem.config.js
```

---

## 🔍 Checklist Sebelum ZIP

- [ ] Semua component files ada
- [ ] .env.example ada (JANGAN include .env dengan credentials!)
- [ ] package.json ada
- [ ] deploy.sh ada dan executable
- [ ] README.md dan DEPLOYMENT.md ada
- [ ] Tidak ada node_modules/ di dalam ZIP
- [ ] Tidak ada dist/ di dalam ZIP

---

## 📊 Estimated ZIP Size

Without node_modules & dist: ~500KB - 2MB
With node_modules: ~200-300MB (TIDAK PERLU!)

---

## ⚠️ PENTING!

1. **JANGAN** include `.env` file dengan credentials!
2. **JANGAN** include `node_modules/`
3. **JANGAN** include `dist/`
4. **PASTIKAN** `.env.example` ada untuk template

---

## 🆘 Troubleshooting

### ZIP terlalu besar?
- Pastikan tidak ada `node_modules/` di dalamnya
- Pastikan tidak ada `dist/` di dalamnya

### Upload gagal ke VPS?
- Cek koneksi internet
- Cek disk space VPS: `df -h`
- Coba compress lebih kecil atau upload via Git

### Deployment error?
- Cek DEPLOYMENT.md untuk troubleshooting lengkap
- Cek logs: `pm2 logs kawanlapor`

---

Setelah upload sukses, ikuti langkah-langkah di **DEPLOYMENT.md**! 🚀
