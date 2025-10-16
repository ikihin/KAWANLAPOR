# 🚀 KawanLapor - Deployment Guide untuk VPS

## 📋 Prerequisites

Pastikan VPS sudah terinstall:
- **Node.js** v18+ dan npm
- **Git**
- **PM2** (untuk process management)
- **Nginx** (untuk reverse proxy)
- **SSL Certificate** (Let's Encrypt - optional tapi recommended)

## 📦 Step 1: Setup VPS

### 1.1 Update sistem dan install dependencies
```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js v18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 1.2 Create user untuk aplikasi (optional tapi recommended)
```bash
# Create user
sudo adduser kawanlapor

# Add to sudo group
sudo usermod -aG sudo kawanlapor

# Switch to new user
su - kawanlapor
```

## 📁 Step 2: Upload Project ke VPS

### Option A: Upload via Git (Recommended)
```bash
# Clone dari repository
cd ~
git clone <your-repo-url> kawanlapor
cd kawanlapor
```

### Option B: Upload via SCP/SFTP
```bash
# Dari local machine, upload file ZIP
scp kawanlapor.zip user@your-vps-ip:~/

# Di VPS, extract
cd ~
unzip kawanlapor.zip
cd kawanlapor
```

## ⚙️ Step 3: Setup Aplikasi

### 3.1 Install dependencies
```bash
npm install
```

### 3.2 Setup Environment Variables
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env dengan credentials Supabase kamu
nano .env
```

Isi dengan:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NODE_ENV=production
PORT=3000
```

### 3.3 Build aplikasi
```bash
npm run build
```

## 🔧 Step 4: Setup Supabase Edge Functions

### 4.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 4.2 Login ke Supabase
```bash
supabase login
```

### 4.3 Link project
```bash
supabase link --project-ref your-project-ref
```

### 4.4 Deploy Edge Functions
```bash
supabase functions deploy server
```

## 🏃 Step 5: Run Aplikasi dengan PM2

### 5.1 Create PM2 ecosystem file
```bash
# File sudah ada: ecosystem.config.js
pm2 start ecosystem.config.js
```

### 5.2 Setup PM2 startup script
```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save
```

### 5.3 Monitor aplikasi
```bash
# View logs
pm2 logs kawanlapor

# Monitor status
pm2 monit

# Restart aplikasi
pm2 restart kawanlapor
```

## 🌐 Step 6: Setup Nginx Reverse Proxy

### 6.1 Create Nginx config
```bash
sudo nano /etc/nginx/sites-available/kawanlapor
```

Paste config berikut:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 6.2 Enable site
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/kawanlapor /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## 🔒 Step 7: Setup SSL dengan Let's Encrypt (Recommended)

### 7.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 7.3 Auto-renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot akan auto-renew via cron
```

## 🔥 Step 8: Setup Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## 📊 Step 9: Monitoring & Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs kawanlapor --lines 100
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### View System Resources
```bash
htop
df -h
free -m
```

### Update Application
```bash
cd ~/kawanlapor
git pull origin main
npm install
npm run build
pm2 restart kawanlapor
```

## 🐛 Troubleshooting

### Application not starting?
```bash
# Check PM2 logs
pm2 logs kawanlapor

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart kawanlapor
```

### Nginx errors?
```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Test config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Supabase connection issues?
```bash
# Verify .env file
cat .env

# Check if Edge Functions are deployed
supabase functions list

# Test Edge Function
curl https://your-project.supabase.co/functions/v1/make-server-54870fc4/reports
```

## 🎉 Done!

Aplikasi KawanLapor sekarang sudah live di:
- **HTTP**: http://your-domain.com
- **HTTPS**: https://your-domain.com (jika SSL sudah setup)

## 📚 Useful Commands

```bash
# PM2
pm2 list                    # List all processes
pm2 restart kawanlapor      # Restart app
pm2 stop kawanlapor         # Stop app
pm2 delete kawanlapor       # Delete app from PM2
pm2 logs kawanlapor         # View logs

# Nginx
sudo systemctl status nginx   # Check status
sudo systemctl restart nginx  # Restart
sudo nginx -t                 # Test config

# System
htop                         # System monitor
df -h                        # Disk usage
free -m                      # Memory usage
```

## 🆘 Support

Jika ada masalah deployment, check:
1. PM2 logs: `pm2 logs kawanlapor`
2. Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. System resources: `htop`
4. Environment variables: `cat .env`

---

**Built for Garuda Spark Hackathon 2024** 🇮🇩
Blockchain for Good • Community-Driven Civic Tech
