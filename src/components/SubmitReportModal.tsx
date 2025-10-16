import { useState } from 'react';
import { X, Upload, Send, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CATEGORIES } from './CategoryFilter';

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReportFormData) => void;
  walletAddress?: string;
  isSubmitting?: boolean;
}

export interface ReportFormData {
  title: string;
  description: string;
  category: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  latitude?: string;
  longitude?: string;
  imageData?: string;
}

export function SubmitReportModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  walletAddress,
  isSubmitting 
}: SubmitReportModalProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    category: 'infrastruktur',
    desa: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    latitude: '',
    longitude: '',
    imageData: undefined,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageData: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', category: 'infrastruktur', desa: '', kecamatan: '', kabupaten: '', provinsi: '', latitude: '', longitude: '', imageData: undefined });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl">Buat Laporan Baru</h2>
              <p className="text-sm text-gray-600">Laporkan isu di komunitas Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {!walletAddress && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 text-amber-900 shadow-lg">
              <p className="flex items-center gap-2">
                <span className="text-xl">🔒</span>
                Hubungkan Phantom wallet Anda untuk membuat laporan.
              </p>
            </div>
          )}
          
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Broken streetlight on Main Street"
              required
              disabled={!walletAddress}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Jelaskan masalah secara detail..."
              rows={4}
              required
              disabled={!walletAddress}
            />
          </div>

          <div>
            <Label htmlFor="category">Kategori *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={!walletAddress}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter(c => c.id !== 'all').map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Lokasi *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <Input
                  id="desa"
                  value={formData.desa}
                  onChange={(e) => setFormData(prev => ({ ...prev, desa: e.target.value }))}
                  placeholder="Desa"
                  required
                  disabled={!walletAddress}
                />
              </div>
              <div>
                <Input
                  id="kecamatan"
                  value={formData.kecamatan}
                  onChange={(e) => setFormData(prev => ({ ...prev, kecamatan: e.target.value }))}
                  placeholder="Kecamatan"
                  required
                  disabled={!walletAddress}
                />
              </div>
              <div>
                <Input
                  id="kabupaten"
                  value={formData.kabupaten}
                  onChange={(e) => setFormData(prev => ({ ...prev, kabupaten: e.target.value }))}
                  placeholder="Kabupaten"
                  required
                  disabled={!walletAddress}
                />
              </div>
              <div>
                <Input
                  id="provinsi"
                  value={formData.provinsi}
                  onChange={(e) => setFormData(prev => ({ ...prev, provinsi: e.target.value }))}
                  placeholder="Provinsi"
                  required
                  disabled={!walletAddress}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label>Koordinat (Opsional)</Label>
            <p className="text-sm text-gray-600 mb-2">Gunakan Google Maps untuk mendapatkan koordinat</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                  placeholder="Latitude (contoh: -6.2088)"
                  disabled={!walletAddress}
                />
              </div>
              <div>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                  placeholder="Longitude (contoh: 106.8456)"
                  disabled={!walletAddress}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Gambar (Opsional)
            </Label>
            <div className="mt-2">
              <label 
                htmlFor="image" 
                className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl cursor-pointer transition-all w-fit border-2 border-dashed border-blue-300 hover:border-purple-400 shadow-sm"
              >
                <Upload className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">
                  {formData.imageData ? '✓ Gambar dipilih - Klik untuk mengubah' : 'Klik untuk upload gambar'}
                </span>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={!walletAddress}
              />
              {formData.imageData && (
                <div className="mt-4 relative rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={formData.imageData} 
                    alt="Preview" 
                    className="w-full max-h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={!walletAddress || isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl gap-2 py-6 text-base"
              size="lg"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-8 py-6"
              size="lg"
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
