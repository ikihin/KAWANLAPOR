import { useState } from 'react';
import { Bell, CheckCircle, Shield, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Notification {
  id: string;
  type: 'verified' | 'comment' | 'verification';
  message: string;
  time: string;
  read: boolean;
}

interface NotificationBellProps {
  reports: any[];
  currentWallet?: string;
}

export function NotificationBell({ reports, currentWallet }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on reports
  const userReports = reports.filter(r => r.walletAddress === currentWallet);
  const newNotifications: Notification[] = [];

  userReports.forEach(report => {
    if (report.isVerified) {
      newNotifications.push({
        id: `verified-${report.id}`,
        type: 'verified',
        message: `Laporan "${report.title}" telah terverifikasi! ✅`,
        time: report.createdAt,
        read: false,
      });
    }
    if (report.comments && report.comments.length > 0) {
      const latestComment = report.comments[report.comments.length - 1];
      if (latestComment.walletAddress !== currentWallet) {
        newNotifications.push({
          id: `comment-${latestComment.id}`,
          type: 'comment',
          message: `Komentar baru di "${report.title}"`,
          time: latestComment.createdAt,
          read: false,
        });
      }
    }
  });

  const unreadCount = newNotifications.length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'verification':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (!currentWallet) return null;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="relative bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-xl shadow-lg"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
              <h3 className="text-white">Notifikasi</h3>
              <p className="text-white/80 text-xs mt-0.5">
                {unreadCount} notifikasi baru
              </p>
            </div>
            
            <ScrollArea className="h-80">
              {newNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Tidak ada notifikasi</p>
                </div>
              ) : (
                <div className="p-2">
                  {newNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors mb-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.time).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
    </div>
  );
}
