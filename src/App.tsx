import { useState, useEffect, useMemo } from 'react';
import { Plus, AlertCircle, List, Map, TrendingUp, CheckCircle2, Clock, Users, Activity as ActivityIcon, BarChart3 } from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';
import { Button } from './components/ui/button';
import { ReportCard } from './components/ReportCard';
import { SubmitReportModal, ReportFormData } from './components/SubmitReportModal';
import { PhantomWallet } from './components/PhantomWallet';
import { FilterBar } from './components/FilterBar';
import { MapView } from './components/MapView';
import { Background } from './components/Background';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ReportDetailModal } from './components/ReportDetailModal';
import { ActivityTimeline } from './components/ActivityTimeline';
import { Leaderboard } from './components/Leaderboard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { NotificationBell } from './components/NotificationBell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { projectId, publicAnonKey } from './utils/supabase/info';

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  latitude?: number;
  longitude?: number;
  imageData?: string;
  walletAddress: string;
  verifications: string[];
  verifiedCount: number;
  isVerified: boolean;
  createdAt: string;
  comments?: Comment[];
}

interface Comment {
  id: string;
  walletAddress: string;
  text: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: 'report' | 'verification' | 'comment';
  reportId: string;
  reportTitle: string;
  walletAddress: string;
  createdAt: string;
}

interface LeaderboardEntry {
  wallet: string;
  count: number;
}

export default function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyingReportId, setVerifyingReportId] = useState<string | null>(null);
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending'>('all');
  const [filterProvinsi, setFilterProvinsi] = useState('all');
  const [filterKabupaten, setFilterKabupaten] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Detail modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Activities & Leaderboard
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState<{
    topReporters: LeaderboardEntry[];
    topVerifiers: LeaderboardEntry[];
  }>({ topReporters: [], topVerifiers: [] });
  
  // Active tab
  const [activeTab, setActiveTab] = useState('reports');

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-54870fc4`;

  useEffect(() => {
    fetchReports();
    // Delay loading activities and leaderboard to reduce initial load
    setTimeout(() => {
      fetchActivities();
      fetchLeaderboard();
    }, 1000);
  }, []);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/reports`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        setError(data.error || 'Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_BASE}/activities`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const handleSubmitReport = async (formData: ReportFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          ...formData,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Laporan berhasil dibuat!', {
          description: 'Terima kasih telah berkontribusi untuk komunitas.',
        });
        setIsModalOpen(false);
        fetchReports();
        fetchActivities();
      } else {
        toast.error('Gagal membuat laporan', {
          description: data.error || 'Terjadi kesalahan',
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Gagal membuat laporan', {
        description: 'Tidak dapat terhubung ke server',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyReport = async (reportId: string) => {
    if (!walletAddress) {
      toast.error('Wallet belum terhubung', {
        description: 'Hubungkan wallet Phantom Anda untuk verifikasi',
      });
      return;
    }

    try {
      setVerifyingReportId(reportId);
      const response = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          reportId,
          walletAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Verifikasi berhasil!', {
          description: `Laporan telah diverifikasi (${data.report.verifiedCount}/3)`,
        });
        fetchReports();
        fetchActivities();
        fetchLeaderboard();
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(data.report);
        }
      } else {
        toast.error('Gagal memverifikasi', {
          description: data.error || 'Terjadi kesalahan',
        });
      }
    } catch (error) {
      console.error('Error verifying report:', error);
      toast.error('Gagal memverifikasi', {
        description: 'Tidak dapat terhubung ke server',
      });
    } finally {
      setVerifyingReportId(null);
    }
  };

  const handleAddComment = async (reportId: string, text: string) => {
    if (!walletAddress) {
      toast.error('Wallet belum terhubung');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          reportId,
          walletAddress,
          text,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Komentar berhasil ditambahkan!');
        fetchReports();
        fetchActivities();
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(data.report);
        }
      } else {
        toast.error('Gagal menambahkan komentar', {
          description: data.error,
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Gagal menambahkan komentar');
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Category filter
      if (filterCategory !== 'all' && report.category !== filterCategory) {
        return false;
      }
      
      // Status filter
      if (filterStatus === 'verified' && !report.isVerified) {
        return false;
      }
      if (filterStatus === 'pending' && report.isVerified) {
        return false;
      }
      
      // Location filters
      if (filterProvinsi !== 'all' && report.provinsi !== filterProvinsi) {
        return false;
      }
      if (filterKabupaten !== 'all' && report.kabupaten !== filterKabupaten) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          report.title.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query) ||
          report.desa.toLowerCase().includes(query) ||
          report.kecamatan.toLowerCase().includes(query) ||
          report.kabupaten.toLowerCase().includes(query) ||
          report.provinsi.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [reports, filterCategory, filterStatus, filterProvinsi, filterKabupaten, searchQuery]);

  // Get unique provinsi and kabupaten for filters
  const availableProvinsi = useMemo(() => {
    return Array.from(new Set(reports.map(r => r.provinsi))).sort();
  }, [reports]);

  const availableKabupaten = useMemo(() => {
    if (filterProvinsi === 'all') {
      return Array.from(new Set(reports.map(r => r.kabupaten))).sort();
    }
    return Array.from(new Set(
      reports
        .filter(r => r.provinsi === filterProvinsi)
        .map(r => r.kabupaten)
    )).sort();
  }, [reports, filterProvinsi]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: reports.length,
      verified: reports.filter(r => r.isVerified).length,
      pending: reports.filter(r => !r.isVerified).length,
      contributors: new Set(reports.map(r => r.walletAddress)).size,
    };
  }, [reports]);

  return (
    <div className="min-h-screen relative">
      <Background />
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-3xl sm:text-4xl flex items-center gap-3">
                👥 <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">KawanLapor</span>
              </h1>
              <p className="text-white/90 text-sm mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Platform Laporan Sipil Terverifikasi Komunitas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell reports={reports} currentWallet={walletAddress} />
              <PhantomWallet 
                onConnect={setWalletAddress}
                onDisconnect={() => setWalletAddress(undefined)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Total Laporan</p>
                <p className="text-white text-2xl">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Verified</p>
                <p className="text-white text-2xl">{stats.verified}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Pending</p>
                <p className="text-white text-2xl">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">Kontributor</p>
                <p className="text-white text-2xl">{stats.contributors}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/15 backdrop-blur-xl border border-white/20 p-1.5 shadow-xl">
            <TabsTrigger value="reports" className="gap-2">
              <List className="w-4 h-4" />
              Laporan
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <ActivityIcon className="w-4 h-4" />
              Aktivitas
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Users className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-white text-2xl">Laporan Komunitas</h2>
                <p className="text-white/80 text-sm mt-1">
                  {filteredReports.length} laporan ditemukan
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-1.5 flex gap-1.5 border border-white/20 shadow-lg">
                  <Button
                    onClick={() => setViewMode('list')}
                    variant="ghost"
                    size="sm"
                    className={viewMode === 'list' 
                      ? 'bg-white text-purple-600 hover:bg-white shadow-md' 
                      : 'text-white hover:bg-white/20'
                    }
                  >
                    <List className="w-4 h-4 mr-2" />
                    List
                  </Button>
                  <Button
                    onClick={() => setViewMode('map')}
                    variant="ghost"
                    size="sm"
                    className={viewMode === 'map' 
                      ? 'bg-white text-purple-600 hover:bg-white shadow-md' 
                      : 'text-white hover:bg-white/20'
                    }
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Peta
                  </Button>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl gap-2 border-0"
                  size="lg"
                >
                  <Plus className="w-5 h-5" />
                  Buat Laporan
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Category Filter */}
            <div>
              <CategoryFilter selected={filterCategory} onChange={setFilterCategory} />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                onClick={() => setFilterStatus('all')}
                variant="outline"
                size="sm"
                className={filterStatus === 'all' 
                  ? 'bg-white text-purple-600 border-white' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }
              >
                Semua
              </Button>
              <Button
                onClick={() => setFilterStatus('verified')}
                variant="outline"
                size="sm"
                className={filterStatus === 'verified' 
                  ? 'bg-white text-purple-600 border-white' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }
              >
                ✅ Verified
              </Button>
              <Button
                onClick={() => setFilterStatus('pending')}
                variant="outline"
                size="sm"
                className={filterStatus === 'pending' 
                  ? 'bg-white text-purple-600 border-white' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }
              >
                ⏳ Pending
              </Button>
            </div>

            {/* Filter Bar */}
            <div>
              <FilterBar
                provinsi={filterProvinsi}
                kabupaten={filterKabupaten}
                onProvinsiChange={(value) => {
                  setFilterProvinsi(value);
                  setFilterKabupaten('all');
                }}
                onKabupatenChange={setFilterKabupaten}
                onClearFilters={() => {
                  setFilterProvinsi('all');
                  setFilterKabupaten('all');
                }}
                availableProvinsi={availableProvinsi}
                availableKabupaten={availableKabupaten}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-xl">
                <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-100">{error}</p>
                  <button 
                    onClick={fetchReports}
                    className="text-red-200 hover:text-white text-sm mt-2 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
                <p className="text-white mt-6 text-lg">Memuat laporan...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md mx-auto border border-white/20 shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-white text-xl mb-3">Belum ada laporan</p>
                  <p className="text-white/80">Jadilah yang pertama melaporkan isu di komunitas Anda!</p>
                </div>
              </div>
            ) : viewMode === 'map' ? (
              <div>
                {viewMode === 'map' && <MapView reports={filteredReports} />}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md mx-auto border border-white/20 shadow-2xl">
                  <p className="text-white text-xl mb-3">Tidak ada laporan yang cocok</p>
                  <p className="text-white/80">Coba ubah filter untuk melihat lebih banyak laporan</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                  >
                    <ReportCard
                      report={report}
                      onVerify={handleVerifyReport}
                      currentWallet={walletAddress}
                      isVerifying={verifyingReportId === report.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            {activeTab === 'activity' && <ActivityTimeline activities={activities} />}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            {activeTab === 'leaderboard' && (
              <Leaderboard 
                topReporters={leaderboard.topReporters}
                topVerifiers={leaderboard.topVerifiers}
              />
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            {activeTab === 'analytics' && <AnalyticsDashboard reports={reports} />}
          </TabsContent>
        </Tabs>
      </main>

      {/* Submit Report Modal */}
      <SubmitReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitReport}
        walletAddress={walletAddress}
        isSubmitting={isSubmitting}
      />

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={handleVerifyReport}
          onAddComment={handleAddComment}
          currentWallet={walletAddress}
          isVerifying={verifyingReportId === selectedReport.id}
        />
      )}

      {/* Footer */}
      <footer className="relative mt-20 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Built for <span className="text-white/90">Garuda Spark Hackathon</span> • Blockchain for Good • Privacy-Preserving Civic Tech
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 border border-white/20">
                Solana Devnet
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 border border-white/20">
                Phantom Wallet
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 border border-white/20">
                Community-Driven
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
