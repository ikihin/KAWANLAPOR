import { MapPin, CheckCircle, Shield, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { CATEGORIES } from './CategoryFilter';

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
  comments?: any[];
}

interface ReportCardProps {
  report: Report;
  onVerify: (reportId: string) => void;
  currentWallet?: string;
  isVerifying?: boolean;
}

export function ReportCard({ report, onVerify, currentWallet, isVerifying }: ReportCardProps) {
  const canVerify = currentWallet && 
                    !report.isVerified && 
                    currentWallet !== report.walletAddress &&
                    !report.verifications.includes(currentWallet);

  const hasVerified = currentWallet && report.verifications.includes(currentWallet);
  
  const category = CATEGORIES.find(c => c.id === report.category) || CATEGORIES[1];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl border border-white/40 group cursor-pointer transition-all hover:-translate-y-2"
    >
      {/* Image Section */}
      {report.imageData && (
        <div className="relative h-52 overflow-hidden">
          <img 
            src={report.imageData} 
            alt={report.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Status Badge on Image */}
          <div className="absolute top-4 right-4">
            {report.isVerified ? (
              <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Verified</span>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm border border-white/20">
                {report.verifiedCount}/3 Verifikasi
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Category Badge & Status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${category.color} text-white text-sm shadow-md`}>
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </div>
          
          {!report.imageData && (
            <div>
              {report.isVerified ? (
                <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Verified</span>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full text-sm shadow-lg">
                  {report.verifiedCount}/3
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-gray-900 mb-3 group-hover:text-purple-600 transition-colors flex items-center gap-2">
          {report.title}
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {report.description}
        </p>
        
        {/* Location */}
        <div className="flex items-start gap-2 text-gray-500 mb-5 bg-gray-50 p-3 rounded-xl">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-500" />
          <span className="text-xs leading-relaxed">
            Desa {report.desa}, Kec. {report.kecamatan}, Kab. {report.kabupaten}, {report.provinsi}
          </span>
        </div>
        
        {/* Verification Progress */}
        {!report.isVerified && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Progress Verifikasi</span>
              <span className="text-xs text-gray-700">{report.verifiedCount}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                style={{ width: `${(report.verifiedCount / 3) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col gap-2">
          {canVerify && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onVerify(report.id);
              }}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl gap-2"
            >
              <Shield className="w-4 h-4" />
              {isVerifying ? 'Memverifikasi...' : 'Verifikasi Laporan Ini'}
            </Button>
          )}
          
          {hasVerified && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2.5 rounded-xl justify-center">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Anda telah memverifikasi</span>
            </div>
          )}
          
          {currentWallet === report.walletAddress && (
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2.5 rounded-xl justify-center">
              <span className="text-sm">📝 Laporan Anda</span>
            </div>
          )}
          
          {!currentWallet && !report.isVerified && (
            <div className="text-sm text-gray-500 text-center bg-gray-50 px-4 py-2.5 rounded-xl">
              Hubungkan wallet untuk verifikasi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
