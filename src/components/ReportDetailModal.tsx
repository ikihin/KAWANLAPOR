import { X, MapPin, Calendar, Shield, MessageCircle, Share2, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
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
  comments?: Comment[];
}

interface Comment {
  id: string;
  walletAddress: string;
  text: string;
  createdAt: string;
}

interface ReportDetailModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (reportId: string) => void;
  onAddComment: (reportId: string, text: string) => void;
  currentWallet?: string;
  isVerifying?: boolean;
}

export function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onVerify,
  onAddComment,
  currentWallet,
  isVerifying,
}: ReportDetailModalProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  if (!isOpen) return null;

  const canVerify = currentWallet && 
                    !report.isVerified && 
                    currentWallet !== report.walletAddress &&
                    !report.verifications.includes(currentWallet);

  const category = CATEGORIES.find(c => c.id === report.category) || CATEGORIES[0];

  const handleShare = () => {
    const url = window.location.href;
    const text = `Check out this report: ${report.title}`;
    
    if (navigator.share) {
      navigator.share({ title: report.title, text, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleExport = () => {
    const exportData = {
      title: report.title,
      description: report.description,
      category: report.category,
      location: `Desa ${report.desa}, Kec. ${report.kecamatan}, Kab. ${report.kabupaten}, ${report.provinsi}`,
      status: report.isVerified ? 'Verified' : `${report.verifiedCount}/3 Verifications`,
      date: new Date(report.createdAt).toLocaleDateString('id-ID'),
      reporter: report.walletAddress,
      verifiers: report.verifications,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.id}.json`;
    a.click();
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !currentWallet) return;
    
    setIsSubmittingComment(true);
    await onAddComment(report.id, commentText);
    setCommentText('');
    setIsSubmittingComment(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg text-2xl`}>
              {category.icon}
            </div>
            <div>
              <h2 className="text-white text-xl">Detail Laporan</h2>
              <p className="text-white/80 text-sm">{category.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleExport}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4" />
            </Button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <ScrollArea className="h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Image */}
            {report.imageData && (
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={report.imageData} 
                  alt={report.title}
                  className="w-full h-80 object-cover"
                />
                {report.isVerified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                )}
              </div>
            )}

            {/* Title & Description */}
            <div>
              <h3 className="text-2xl mb-3">{report.title}</h3>
              <p className="text-gray-600 leading-relaxed">{report.description}</p>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Lokasi</span>
                </div>
                <p className="text-gray-900 text-sm">
                  Desa {report.desa}, Kec. {report.kecamatan}<br />
                  Kab. {report.kabupaten}, {report.provinsi}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Tanggal</span>
                </div>
                <p className="text-gray-900 text-sm">
                  {new Date(report.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
              <h4 className="mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Status Verifikasi
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm text-gray-900">{report.verifiedCount}/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${(report.verifiedCount / 3) * 100}%` }}
                  />
                </div>
                {report.verifications.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Verified by:</p>
                    <div className="flex flex-wrap gap-2">
                      {report.verifications.map((wallet, index) => (
                        <div key={index} className="bg-white px-3 py-1.5 rounded-lg text-xs text-gray-700 shadow-sm">
                          {wallet.slice(0, 6)}...{wallet.slice(-4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            {canVerify && (
              <Button
                onClick={() => onVerify(report.id)}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg py-6 text-base gap-2"
              >
                <Shield className="w-5 h-5" />
                {isVerifying ? 'Memverifikasi...' : 'Verifikasi Laporan Ini'}
              </Button>
            )}

            {/* Comments Section */}
            <div className="border-t pt-6">
              <h4 className="mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Komentar ({report.comments?.length || 0})
              </h4>

              {currentWallet && (
                <div className="mb-6 space-y-3">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Tulis komentar..."
                    rows={3}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isSubmittingComment ? 'Mengirim...' : 'Kirim Komentar'}
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {report.comments && report.comments.length > 0 ? (
                  report.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {comment.walletAddress.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-900">
                              {comment.walletAddress.slice(0, 6)}...{comment.walletAddress.slice(-4)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">Belum ada komentar</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
