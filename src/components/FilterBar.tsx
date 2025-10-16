import { Filter, X, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

interface FilterBarProps {
  provinsi: string;
  kabupaten: string;
  onProvinsiChange: (value: string) => void;
  onKabupatenChange: (value: string) => void;
  onClearFilters: () => void;
  availableProvinsi: string[];
  availableKabupaten: string[];
}

export function FilterBar({
  provinsi,
  kabupaten,
  onProvinsiChange,
  onKabupatenChange,
  onClearFilters,
  availableProvinsi,
  availableKabupaten,
}: FilterBarProps) {
  const hasActiveFilters = provinsi !== 'all' || kabupaten !== 'all';

  return (
    <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white">Filter Laporan</h3>
          <p className="text-white/60 text-xs mt-0.5">Saring berdasarkan lokasi</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-white text-sm mb-2 block flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Provinsi
          </label>
          <Select value={provinsi} onValueChange={onProvinsiChange}>
            <SelectTrigger className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg hover:shadow-xl transition-all">
              <SelectValue placeholder="Semua Provinsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {availableProvinsi.map((prov) => (
                <SelectItem key={prov} value={prov}>
                  {prov}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-white text-sm mb-2 block flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Kabupaten
          </label>
          <Select value={kabupaten} onValueChange={onKabupatenChange}>
            <SelectTrigger className="bg-white/95 backdrop-blur-sm border-white/40 shadow-lg hover:shadow-xl transition-all">
              <SelectValue placeholder="Semua Kabupaten" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kabupaten</SelectItem>
              {availableKabupaten.map((kab) => (
                <SelectItem key={kab} value={kab}>
                  {kab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm shadow-lg"
          >
            <X className="w-4 h-4 mr-2" />
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
}
