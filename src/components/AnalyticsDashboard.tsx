import { BarChart3 } from 'lucide-react';

interface Report {
  id: string;
  category: string;
  provinsi: string;
  isVerified: boolean;
  createdAt: string;
}

interface AnalyticsDashboardProps {
  reports: Report[];
}

export function AnalyticsDashboard({ reports }: AnalyticsDashboardProps) {
  // Category distribution
  const categoryData = reports.reduce((acc: any[], report) => {
    const existing = acc.find(item => item.name === report.category);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: report.category, value: 1 });
    }
    return acc;
  }, []);

  // Province distribution
  const provinceData = reports.reduce((acc: any[], report) => {
    const existing = acc.find(item => item.name === report.provinsi);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: report.provinsi, value: 1 });
    }
    return acc;
  }, []).slice(0, 5);

  // Count by date (last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const count = reports.filter(r => {
      const rDate = new Date(r.createdAt);
      return rDate.toDateString() === date.toDateString();
    }).length;
    last7Days.push({ date: dateStr, count });
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl">Analytics</h3>
          <p className="text-sm text-gray-600">Insight data platform</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Simple Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
            <h4 className="text-sm text-gray-600 mb-1">Total Kategori</h4>
            <p className="text-2xl">{categoryData.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
            <h4 className="text-sm text-gray-600 mb-1">Total Provinsi</h4>
            <p className="text-2xl">{provinceData.length}</p>
          </div>
        </div>

        {/* Category List */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="text-sm mb-3">Distribusi Kategori</h4>
          <div className="space-y-2">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{cat.name}</span>
                <span className="text-sm font-medium text-blue-600">{cat.value} laporan</span>
              </div>
            ))}
          </div>
        </div>

        {/* Province List */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="text-sm mb-3">Top 5 Provinsi</h4>
          <div className="space-y-2">
            {provinceData.map((prov, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{prov.name}</span>
                <span className="text-sm font-medium text-purple-600">{prov.value} laporan</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
