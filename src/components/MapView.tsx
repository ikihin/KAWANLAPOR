import { useEffect, useRef } from 'react';
import { useRef, useEffect } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
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
}

interface MapViewProps {
  reports: Report[];
  onReportClick?: (report: Report) => void;
}

export function MapView({ reports, onReportClick }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      
      script.onload = () => {
        setTimeout(() => initializeMap(), 100);
      };
      
      document.head.appendChild(script);
    } else {
      setTimeout(() => initializeMap(), 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.log('Map cleanup:', e);
        }
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [reports]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    
    // Center of Indonesia
    const map = L.map(mapRef.current).setView([-2.5489, 118.0149], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    const reportsWithCoords = reports.filter(r => r.latitude && r.longitude);

    if (reportsWithCoords.length === 0) return;

    const bounds: any[] = [];

    reportsWithCoords.forEach((report) => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 32px;
              height: 32px;
              background: ${report.isVerified ? '#10b981' : '#3b82f6'};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            ${report.isVerified ? `
              <div style="
                position: absolute;
                top: -4px;
                right: -4px;
                width: 16px;
                height: 16px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${report.title}</h3>
            <p style="color: #666; font-size: 12px; margin-bottom: 8px;">${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</p>
            <div style="display: flex; align-items: center; gap: 4px; color: #666; font-size: 12px; margin-bottom: 4px;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Desa ${report.desa}, Kec. ${report.kecamatan}</span>
            </div>
            <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
              ${report.isVerified 
                ? '<span style="color: #10b981; font-size: 12px; font-weight: 500;">✓ Verified</span>'
                : `<span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${report.verifiedCount}/3</span>`
              }
            </div>
          </div>
        `);

      markersRef.current.push(marker);
      bounds.push([report.latitude, report.longitude]);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  const reportsWithCoords = reports.filter(r => r.latitude && r.longitude);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      {reportsWithCoords.length === 0 ? (
        <div className="h-[500px] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Belum ada laporan dengan koordinat lokasi</p>
            <p className="text-gray-500 text-sm mt-2">Tambahkan koordinat saat membuat laporan untuk menampilkan di peta</p>
          </div>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="h-[500px] w-full"></div>
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
                <span className="text-gray-600">Pending ({reports.filter(r => !r.isVerified && r.latitude && r.longitude).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
                <span className="text-gray-600">Verified ({reports.filter(r => r.isVerified && r.latitude && r.longitude).length})</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
