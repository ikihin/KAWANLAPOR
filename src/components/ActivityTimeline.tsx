import { Activity, FileText, Shield, MessageCircle, Clock } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface ActivityItem {
  id: string;
  type: 'report' | 'verification' | 'comment';
  reportId: string;
  reportTitle: string;
  walletAddress: string;
  createdAt: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="w-4 h-4" />;
      case 'verification':
        return <Shield className="w-4 h-4" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'report':
        return 'from-blue-500 to-blue-600';
      case 'verification':
        return 'from-green-500 to-green-600';
      case 'comment':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getActivityText = (activity: ActivityItem) => {
    const wallet = `${activity.walletAddress.slice(0, 6)}...${activity.walletAddress.slice(-4)}`;
    switch (activity.type) {
      case 'report':
        return (
          <>
            <span className="font-medium">{wallet}</span> melaporkan{' '}
            <span className="font-medium">{activity.reportTitle}</span>
          </>
        );
      case 'verification':
        return (
          <>
            <span className="font-medium">{wallet}</span> memverifikasi{' '}
            <span className="font-medium">{activity.reportTitle}</span>
          </>
        );
      case 'comment':
        return (
          <>
            <span className="font-medium">{wallet}</span> berkomentar di{' '}
            <span className="font-medium">{activity.reportTitle}</span>
          </>
        );
      default:
        return activity.reportTitle;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    
    if (diffInMins < 1) return 'Baru saja';
    if (diffInMins < 60) return `${diffInMins} menit lalu`;
    
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} hari lalu`;
    
    return past.toLocaleDateString('id-ID');
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl">Aktivitas Terbaru</h3>
          <p className="text-sm text-gray-600">Live feed dari komunitas</p>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="group flex gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center shadow-md flex-shrink-0 text-white`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 mb-1">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
