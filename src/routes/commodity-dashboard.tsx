import React, { useState, useMemo } from 'react';
import { 
  Search, Download, TrendingUp, TrendingDown, 
  ShieldAlert, Database, Copy, Eye, X, Info, 
  Building2, CheckCircle2, Table as TableIcon, LayoutGrid,
  ArrowUpRight, Users, Briefcase, Wallet, CalendarClock, Package, Calendar
} from 'lucide-react';
import { AppShell } from '@/app/app-shell';
import { Panel, Pill, Kosong } from '@/app/ui-bits';
import { 
  COMMODITY_DATA, 
  COMMODITY_SOURCES, 
  UPDATE_CADENCES, 
  PRICING_TYPES,
  CommodityItem,
  UpdateCadence,
  PricingType
} from '../commodityData';

function MetrikCard({
  ikon,
  label,
  nilai,
  catatan,
}: {
  ikon: React.ReactNode;
  label: string;
  nilai: string;
  catatan: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground">
          {ikon}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{nilai}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{catatan}</p>
    </div>
  );
}

export function CommodityDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCadence, setSelectedCadence] = useState<UpdateCadence | 'Semua'>('Semua');
  const [selectedSource, setSelectedSource] = useState<string>('Semua');
  const [selectedPricingType, setSelectedPricingType] = useState<PricingType | 'Semua'>('Semua');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'id' | 'nama' | 'harga' | 'cadence'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [selectedItem, setSelectedItem] = useState<CommodityItem | null>(null);
  const [showJsonSchemaModal, setShowJsonSchemaModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const triggerNotify = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return COMMODITY_DATA.filter((item) => {
      if (selectedCadence !== 'Semua' && item.updateCadence !== selectedCadence) return false;
      if (selectedSource !== 'Semua' && item.sumberData !== selectedSource) return false;
      if (selectedPricingType !== 'Semua' && item.jenisBatas !== selectedPricingType) return false;
      if (q) {
        const matchName = item.nama.toLowerCase().includes(q);
        const matchSource = item.sumberData.toLowerCase().includes(q);
        const matchCat = item.kategori.toLowerCase().includes(q);
        const matchReg = item.statusRegulasi.toLowerCase().includes(q);
        const matchSpec = item.deskripsiSpesifikasi.toLowerCase().includes(q);
        return matchName || matchSource || matchCat || matchReg || matchSpec;
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'nama') {
        comparison = a.nama.localeCompare(b.nama);
      } else if (sortBy === 'harga') {
        const priceA = a.mataUang === 'USD' ? a.hargaTerbaru * 15800 : a.hargaTerbaru;
        const priceB = b.mataUang === 'USD' ? b.hargaTerbaru * 15800 : b.hargaTerbaru;
        comparison = priceA - priceB;
      } else if (sortBy === 'cadence') {
        comparison = a.updateCadence.localeCompare(b.updateCadence);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [searchQuery, selectedCadence, selectedSource, selectedPricingType, sortBy, sortDirection]);

  const formatPrice = (harga: number, currency: 'IDR' | 'USD', satuan: string) => {
    if (currency === 'USD') {
      return (
        <span className="tabular-nums">
          <span className="font-semibold text-foreground">${harga.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-muted-foreground text-xs ml-1 font-normal">/ {satuan}</span>
        </span>
      );
    }
    return (
      <span className="tabular-nums">
        <span className="font-semibold text-foreground">Rp {harga.toLocaleString('id-ID')}</span>
        <span className="text-muted-foreground text-xs ml-1 font-normal">/ {satuan}</span>
      </span>
    );
  };

  const stats = useMemo(() => {
    const total = COMMODITY_DATA.length;
    const subsidiCount = COMMODITY_DATA.filter(i => i.jenisBatas === 'Subsidi').length;
    const hetCount = COMMODITY_DATA.filter(i => i.jenisBatas === 'HET Pemerintah').length;
    const harianCount = COMMODITY_DATA.filter(i => i.updateCadence === 'Harian').length;
    return { total, subsidiCount, hetCount, harianCount };
  }, []);

  const handleExportCSV = () => {
    const headers = ["ID", "Nama Komoditas", "Kategori", "Harga", "Mata Uang", "Satuan", "Jenis Batas", "Sumber Data", "Rentang Update", "Regulasi"];
    const rows = filteredData.map(i => [
      i.id,
      `"${i.nama.replace(/"/g, '""')}"`,
      `"${i.kategori.replace(/"/g, '""')}"`,
      i.hargaTerbaru,
      i.mataUang,
      `"${i.satuan.replace(/"/g, '""')}"`,
      `"${i.jenisBatas.replace(/"/g, '""')}"`,
      `"${i.sumberData.replace(/"/g, '""')}"`,
      i.updateCadence,
      `"${i.statusRegulasi.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `100_Komoditas_Fisik_${selectedCadence}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    triggerNotify("File CSV berhasil diunduh!");
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(COMMODITY_DATA, null, 2));
    triggerNotify("Array JSON (100 Komoditas) disalin ke clipboard!");
  };

  return (
    <AppShell 
      title="100 Komoditas" 
      subtitle="Pelacak Harga 100 Komoditas Fisik & Subsidi"
      actions={
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button 
            onClick={() => setShowJsonSchemaModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 text-xs font-medium bg-card/60 text-foreground hover:bg-accent rounded-lg transition-colors border border-border/70 whitespace-nowrap shadow-2xs cursor-pointer"
            title="Lihat Skema JSON"
          >
            <Database size={13} />
            Skema JSON
          </button>
          <button 
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 sm:px-3 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
            title="Unduh CSV Komoditas"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Unduh CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      }
    >
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <span>{copiedNotification}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <MetrikCard
          ikon={<Package className="size-4" />}
          label="Total Terpantau"
          nilai={`${stats.total}`}
          catatan="Komoditas referensi pasar"
        />
        <MetrikCard
          ikon={<ShieldAlert className="size-4" />}
          label="Subsidi & HET Gov"
          nilai={`${stats.subsidiCount + stats.hetCount}`}
          catatan="Pagu & aturan pemerintah"
        />
        <MetrikCard
          ikon={<CalendarClock className="size-4" />}
          label="Update Harian"
          nilai={`${stats.harianCount}`}
          catatan="Data spot & bursa global"
        />
        <MetrikCard
          ikon={<Building2 className="size-4" />}
          label="Koneksi Sumber"
          nilai="10"
          catatan="Kanal data instansi resmi"
        />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <a href="https://farmaplus.kemkes.go.id/medicine/search" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border bg-card rounded-xl hover:bg-accent transition-colors flex-1 sm:flex-none justify-center">
          <ArrowUpRight className="size-4 text-muted-foreground" />
          FarmaPlus Kemkes
        </a>
        <a href="https://www.bi.go.id/hargapangan/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border bg-card rounded-xl hover:bg-accent transition-colors flex-1 sm:flex-none justify-center">
          <ArrowUpRight className="size-4 text-muted-foreground" />
          PIHPS Bank Indonesia
        </a>
        <a href="https://sp2kp.kemendag.go.id/statistik/tabulasi-harga" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-border bg-card rounded-xl hover:bg-accent transition-colors flex-1 sm:flex-none justify-center">
          <ArrowUpRight className="size-4 text-muted-foreground" />
          SP2KP Kemendag
        </a>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Cari komoditas, satuan, atau regulasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border text-sm">
              <button
                onClick={() => setSelectedCadence('Semua')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedCadence === 'Semua' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua
              </button>
              {UPDATE_CADENCES.map(cadence => (
                <button
                  key={cadence}
                  onClick={() => setSelectedCadence(cadence)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedCadence === cadence ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cadence}
                </button>
              ))}
            </div>
            
            <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 rounded-md text-xs transition-all ${
                  viewMode === 'table' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Tabel"
              >
                <TableIcon size={16} />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1 rounded-md text-xs transition-all ${
                  viewMode === 'cards' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Kartu"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="Semua">Semua Sumber Data</option>
            {COMMODITY_SOURCES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select 
            value={selectedPricingType}
            onChange={(e) => setSelectedPricingType(e.target.value as any)}
            className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
          >
            <option value="Semua">Semua Jenis Batas</option>
            {PRICING_TYPES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            >
              <option value="id">Urut: ID</option>
              <option value="nama">Urut: Nama</option>
              <option value="harga">Urut: Harga</option>
              <option value="cadence">Urut: Waktu</option>
            </select>
            <button 
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 bg-background border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <TrendingUp size={14} className={sortDirection === 'desc' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <Panel className="py-12">
          <Kosong pesan="Tidak ada komoditas yang sesuai kriteria." />
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setSelectedCadence('Semua');
                setSelectedSource('Semua');
                setSelectedPricingType('Semua');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </Panel>
      ) : viewMode === 'table' ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
                  <th className="py-3 px-4 font-medium w-12 text-center">ID</th>
                  <th className="py-3 px-4 font-medium">Komoditas</th>
                  <th className="py-3 px-4 font-medium">Harga Terkini</th>
                  <th className="py-3 px-4 font-medium">Regulasi</th>
                  <th className="py-3 px-4 font-medium">Sumber</th>
                  <th className="py-3 px-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredData.map((item) => {
                  const tagColor = 
                    item.jenisBatas === 'Subsidi' ? 'prospek' : 
                    item.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
                    item.jenisBatas === 'Spot Global' ? 'aktif' : 'todo';
                    
                  return (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="hover:bg-muted/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 text-center font-mono text-xs text-muted-foreground">
                        {item.id.toString().padStart(3, '0')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.nama}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.kategori}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {formatPrice(item.hargaTerbaru, item.mataUang, item.satuan)}
                        {item.perubahan24h !== 0 && (
                          <div className={`text-xs mt-0.5 flex items-center gap-1 ${
                            item.perubahan24h > 0 ? 'text-rose-500' : 'text-emerald-500'
                          }`}>
                            {item.perubahan24h > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>{Math.abs(item.perubahan24h)}%</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Pill value={tagColor} label={item.jenisBatas} />
                        <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-1" title={item.statusRegulasi}>
                          {item.statusRegulasi}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-foreground font-medium truncate max-w-[150px]">
                          {item.sumberData}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Update: {item.updateCadence}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredData.map((item) => {
            const tagColor = 
              item.jenisBatas === 'Subsidi' ? 'prospek' : 
              item.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
              item.jenisBatas === 'Spot Global' ? 'aktif' : 'todo';
              
            return (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-card rounded-2xl border border-border p-5 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      #{item.id.toString().padStart(3, '0')}
                    </span>
                    <Pill value={tagColor} label={item.jenisBatas} />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.nama}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">{item.kategori}</p>
                  
                  <div className="bg-muted/30 p-3 rounded-xl border border-border mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Harga Terkini</div>
                    <div className="text-lg">
                      {formatPrice(item.hargaTerbaru, item.mataUang, item.satuan)}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {item.deskripsiSpesifikasi}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground truncate mr-2">
                    <Building2 size={14} className="shrink-0" />
                    <span className="truncate">{item.sumberData}</span>
                  </div>
                  <span className="text-primary font-medium group-hover:translate-x-0.5 transition-transform shrink-0">
                    Detail &rarr;
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-card rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-5 md:p-6 relative flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">#{selectedItem.id.toString().padStart(3, '0')}</span>
                  <Pill 
                    value={
                      selectedItem.jenisBatas === 'Subsidi' ? 'prospek' : 
                      selectedItem.jenisBatas === 'HET Pemerintah' ? 'berjalan' : 
                      selectedItem.jenisBatas === 'Spot Global' ? 'aktif' : 'todo'
                    } 
                    label={selectedItem.jenisBatas} 
                  />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  {selectedItem.nama}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">{selectedItem.kategori}</p>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-6">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Harga Terkini</div>
                  <div className="text-2xl text-foreground">
                    {formatPrice(selectedItem.hargaTerbaru, selectedItem.mataUang, selectedItem.satuan)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Pembaruan</div>
                  <div className="text-sm font-medium text-foreground">{selectedItem.tanggalUpdate}</div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Spesifikasi</h4>
                  <p className="text-foreground leading-relaxed">
                    {selectedItem.deskripsiSpesifikasi}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1.5">Regulasi</h4>
                  <div className="flex items-start gap-2 text-foreground">
                    <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{selectedItem.statusRegulasi}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Sumber Data</span>
                    <span className="text-sm font-medium text-foreground">{selectedItem.sumberData}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Frekuensi Update</span>
                    <span className="text-sm font-medium text-foreground">{selectedItem.updateCadence}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-5 border-t border-border bg-muted/30 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  const text = `${selectedItem.nama}: ${selectedItem.mataUang === 'USD' ? '$' : 'Rp '}${selectedItem.hargaTerbaru} / ${selectedItem.satuan} (${selectedItem.sumberData})`;
                  navigator.clipboard.writeText(text);
                  triggerNotify("Data disalin!");
                }}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Copy size={16} />
                Salin Data
              </button>
            </div>
          </div>
        </div>
      )}

      {showJsonSchemaModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            className="bg-card rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-border flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border p-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Database size={16} className="text-primary" />
                  Skema JSON (100 Komoditas)
                </h3>
              </div>
              <button 
                onClick={() => setShowJsonSchemaModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-muted/30 text-foreground font-mono text-xs overflow-y-auto flex-1">
              <pre>{JSON.stringify(COMMODITY_DATA.slice(0, 5), null, 2)}</pre>
              <div className="text-muted-foreground text-center py-4 italic font-sans text-sm">
                ... 95 data lainnya dimuat dalam skema asli.
              </div>
            </div>

            <div className="p-4 border-t border-border bg-card flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total: 100 item
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Copy size={16} />
                  Salin Seluruh JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </AppShell>
  );
}
