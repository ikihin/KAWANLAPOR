import { Trophy, Award, Medal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';

interface LeaderboardEntry {
  wallet: string;
  count: number;
}

interface LeaderboardProps {
  topReporters: LeaderboardEntry[];
  topVerifiers: LeaderboardEntry[];
}

export function Leaderboard({ topReporters, topVerifiers }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-sm text-gray-500">#{rank + 1}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0:
        return 'from-yellow-400 to-yellow-600';
      case 1:
        return 'from-gray-300 to-gray-500';
      case 2:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const LeaderboardList = ({ entries, label }: { entries: LeaderboardEntry[], label: string }) => (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada {label}</p>
        </div>
      ) : (
        entries.map((entry, index) => (
          <div
            key={entry.wallet}
            className={`
              flex items-center gap-4 p-4 rounded-xl transition-all
              ${index < 3 ? 'bg-gradient-to-r ' + getRankColor(index) + ' text-white shadow-lg' : 'bg-gray-50 hover:bg-gray-100'}
            `}
          >
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              {getRankIcon(index)}
            </div>
            <Avatar className="w-12 h-12">
              <AvatarFallback className={index < 3 ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'}>
                {entry.wallet.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                {entry.wallet.slice(0, 8)}...{entry.wallet.slice(-6)}
              </p>
              <p className={`text-xs ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                {entry.count} {label}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${index < 3 ? 'bg-white/20' : 'bg-blue-100'}`}>
              <span className={`text-lg ${index < 3 ? 'text-white' : 'text-blue-600'}`}>
                {entry.count}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl">Leaderboard</h3>
          <p className="text-sm text-gray-600">Kontributor teratas</p>
        </div>
      </div>

      <Tabs defaultValue="reporters" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="reporters">🏆 Top Reporters</TabsTrigger>
          <TabsTrigger value="verifiers">🛡️ Top Verifiers</TabsTrigger>
        </TabsList>
        <TabsContent value="reporters">
          <LeaderboardList entries={topReporters} label="laporan" />
        </TabsContent>
        <TabsContent value="verifiers">
          <LeaderboardList entries={topVerifiers} label="verifikasi" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
