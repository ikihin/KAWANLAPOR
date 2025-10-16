# 👥 KawanLapor

**Platform Laporan Sipil Terverifikasi Komunitas dengan Blockchain**

Built for **Garuda Spark Hackathon 2024** - Blockchain for Good

---

## 🌟 Tentang KawanLapor

KawanLapor adalah platform civic tech yang memungkinkan masyarakat Indonesia melaporkan masalah publik secara **anonim** menggunakan **Phantom Wallet** (Solana Devnet) sebagai identitas. Setiap laporan diverifikasi oleh komunitas dan membutuhkan **3 verifikasi** untuk mendapat status "Verified".

### ✨ Fitur Utama

- 🔐 **Anonymous Reporting** - Identitas dilindungi dengan Phantom Wallet
- ✅ **Community Verification** - Sistem verifikasi terdesentralisasi
- 🗺️ **Interactive Map** - Visualisasi laporan berdasarkan lokasi
- 📊 **Analytics Dashboard** - Insight data platform real-time
- 🏆 **Leaderboard** - Gamifikasi untuk kontributor aktif
- 💬 **Comment System** - Diskusi dan follow-up per laporan
- 🔔 **Notifications** - Update real-time untuk laporan Anda
- 🏘️ **Lokasi Indonesia Lengkap** - Filter berdasarkan Desa, Kecamatan, Kabupaten, Provinsi

---

## 🏗️ Tech Stack

### Frontend
- **React** + **TypeScript**
- **Tailwind CSS** v4.0
- **Shadcn/ui** Components
- **Lucide Icons**

### Backend
- **Supabase** (Database, Auth, Edge Functions)
- **Hono** (Edge Functions Framework)
- **KV Store** (Data persistence)

### Blockchain
- **Solana Devnet**
- **Phantom Wallet** Integration

### Maps
- **Leaflet.js** (Interactive maps)

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js v18+
- npm atau yarn
- Phantom Wallet browser extension
- Supabase account

### Installation

1. **Clone repository**
```bash
git clone <repo-url>
cd kawanlapor
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` dengan Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:5173
```

---

## 📦 Production Deployment

Lihat **[DEPLOYMENT.md](./DEPLOYMENT.md)** untuk panduan lengkap deployment ke VPS.

### Quick Deploy dengan Script
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📁 Project Structure

```
kawanlapor/
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
├── components/                # React components
│   ├── ActivityTimeline.tsx   # Recent activities feed
│   ├── AnalyticsDashboard.tsx # Data visualization
│   ├── Background.tsx         # Animated background
│   ├── CategoryFilter.tsx     # Filter by category
│   ├── FilterBar.tsx          # Location filters
│   ├── Leaderboard.tsx        # Top contributors
│   ├── MapView.tsx            # Interactive map
│   ├── NotificationBell.tsx   # Notification system
│   ├── PhantomWallet.tsx      # Wallet integration
│   ├── ReportCard.tsx         # Report display card
│   ├── ReportDetailModal.tsx  # Report detail view
│   ├── SearchBar.tsx          # Search functionality
│   ├── SubmitReportModal.tsx  # Create new report
│   └── ui/                    # Shadcn components
├── styles/
│   └── globals.css            # Global styles & Tailwind
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx      # API endpoints
│           └── kv_store.tsx   # Database operations
└── utils/
    └── supabase/
        └── info.tsx           # Supabase config
```

---

## 🎮 User Guide

### 1. Connect Wallet
- Install Phantom Wallet extension
- Click "Connect Phantom" button
- Approve connection in Phantom

### 2. Create Report
- Click "Buat Laporan" button
- Fill in report details:
  - Title & Description
  - Category (Infrastruktur, Lingkungan, Keamanan, etc.)
  - Location (Desa, Kecamatan, Kabupaten, Provinsi)
  - Optional: Upload image
- Submit report

### 3. Verify Reports
- Browse reports from other users
- Click "Verifikasi Laporan Ini" if you can confirm the issue
- Report becomes "Verified" after 3 verifications

### 4. Comment & Discuss
- Click on any report card to view details
- Add comments to provide updates or additional info
- Engage with community

### 5. Track Progress
- Check "Aktivitas" tab for recent platform activity
- View "Leaderboard" to see top contributors
- Monitor "Analytics" for platform insights

---

## 🔧 API Endpoints

### Reports
- `GET /make-server-54870fc4/reports` - Get all reports
- `GET /make-server-54870fc4/reports/:id` - Get single report
- `POST /make-server-54870fc4/reports` - Create new report

### Verification
- `POST /make-server-54870fc4/verify` - Verify a report

### Comments
- `POST /make-server-54870fc4/comments` - Add comment to report

### Analytics
- `GET /make-server-54870fc4/activities` - Get recent activities
- `GET /make-server-54870fc4/leaderboard` - Get top contributors

---

## 🎨 Design System

### Colors
- Primary: Blue to Purple gradient
- Accent: Yellow to Orange (CTA buttons)
- Success: Green (Verified status)
- Background: Gradient with animated orbs

### Typography
- Headings: Default system font
- Body: Default system font
- Monospace: For wallet addresses

---

## 🔐 Security & Privacy

- ✅ Anonymous reporting with wallet-based identity
- ✅ No personal data collection
- ✅ Decentralized verification system
- ✅ Client-side image processing
- ✅ HTTPS encryption (in production)

---

## 🤝 Contributing

This is a hackathon project. Contributions, issues, and feature requests are welcome!

---

## 📄 License

This project is built for **Garuda Spark Hackathon 2024**.

---

## 👥 Team

Built with ❤️ for Indonesian civic engagement

---

## 🙏 Acknowledgments

- **Garuda Spark Hackathon** - For the opportunity
- **Solana Foundation** - Blockchain infrastructure
- **Phantom Wallet** - Wallet integration
- **Supabase** - Backend infrastructure
- **Shadcn/ui** - Component library

---

## 📞 Support

For deployment issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- Review logs: `pm2 logs kawanlapor`
- Check Supabase Edge Functions logs

---

**🇮🇩 Blockchain for Good • Community-Driven • Privacy-Preserving**
