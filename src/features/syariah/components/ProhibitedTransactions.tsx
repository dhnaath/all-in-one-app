import React from "react";
import { AlertOctagon, ShieldAlert, Dice5 } from "lucide-react";

export default function ProhibitedTransactions() {
  return (
    <div className="w-full flex flex-col gap-8">
      <section className="bg-card border border-black/5 p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
        <div className="lg:w-1/3 flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
            <ShieldAlert className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-semibold italic text-foreground">Larangan Muamalah</h2>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed space-y-4">
            <p>
              Dalam sistem ekonomi syariah, terdapat tiga pilar utama larangan yang harus dijauhi
              dalam setiap transaksi atau akad. Keberadaan salah satu unsur ini dapat membatalkan
              keabsahan (fasid/bathil) sebuah transaksi.
            </p>
            <p className="font-bold uppercase tracking-[0.1em] text-[10px] mt-4">Prinsip Dasar:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Keadilan (Al-'Adl)</li>
              <li>Transparansi (Al-Wudhu)</li>
              <li>Saling Ridha (An-Taradhin)</li>
            </ul>
          </div>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <AlertOctagon className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Riba</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Usury / Bunga
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Tambahan yang disyaratkan dalam transaksi pinjaman (riba nasi'ah) atau pertukaran
              barang ribawi yang sejenis dengan takaran berbeda (riba fadhl). Uang tidak boleh
              menghasilkan uang tanpa adanya resiko bisnis.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <ShieldAlert className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Gharar</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Uncertainty / Ketidakpastian
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Ketidakjelasan dalam suatu akad, baik mengenai kualitas, kuantitas, harga, maupun
              waktu penyerahan objek transaksi. Transaksi harus jelas dan transparan bagi semua
              pihak yang terlibat.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Dice5 className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Maysir</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Gambling / Perjudian
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Transaksi yang menggantungkan keuntungan pada suatu keadaan yang tidak pasti atau
              bersifat untung-untungan (zero-sum game) di mana satu pihak pasti untung dan pihak
              lain pasti rugi.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card border border-black/5 p-6 md:p-8 grid grid-cols-1 gap-6 w-full">
        <div className="text-xs md:text-sm text-muted-foreground italic border-l border-border/40 pl-4 md:pl-6 py-2">
          <p className="leading-relaxed">
            “Hai orang-orang yang beriman, janganlah kamu saling memakan harta sesamamu dengan jalan
            yang batil, kecuali dengan jalan perniagaan yang berlaku dengan suka sama-suka di antara
            kamu.”
          </p>
          <span className="block mt-3 not-italic font-bold text-[10px] uppercase tracking-[0.1em] opacity-60">
            — QS. An-Nisa (4): 29
          </span>
        </div>
      </section>
    </div>
  );
}
