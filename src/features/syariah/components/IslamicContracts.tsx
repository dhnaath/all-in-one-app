import React from "react";
import { HeartHandshake, Scale, Handshake, Archive, Users, Tag } from "lucide-react";

export default function IslamicContracts() {
  return (
    <div className="w-full flex flex-col gap-8">
      <section className="bg-card border border-black/5 p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
        <div className="lg:w-1/3 flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40">
            <Handshake className="w-6 h-6 text-foreground" />
            <h2 className="text-2xl font-semibold italic text-foreground">Akad Muamalah</h2>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed space-y-4">
            <p>
              Dalam sistem ekonomi syariah, akad atau kontrak harus berlandaskan asas
              tolong-menolong, keadilan, dan transparansi. Berikut adalah beberapa prinsip akad yang
              sering digunakan dalam muamalah.
            </p>
          </div>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <HeartHandshake className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Tabarru'</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Gotong Royong
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Akad yang dilakukan dengan tujuan tolong-menolong dan tidak berorientasi pada
              keuntungan komersial (non-profit). Contohnya adalah qardh (pinjaman tanpa bunga),
              sedekah, hibah, dan wakaf.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Scale className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Mudharabah</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Bagi Hasil
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Akad kerja sama usaha antara shahibul maal (pemilik dana) dan mudharib (pengelola
              dana). Keuntungan dibagi sesuai nisbah yang disepakati, sedangkan kerugian finansial
              ditanggung oleh pemilik dana.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Handshake className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Wakalah</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Perwakilan
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Akad perwakilan di mana satu pihak memberikan kuasa kepada pihak lain untuk melakukan
              suatu tindakan atau pekerjaan tertentu atas namanya. Sering digunakan dalam transaksi
              perbankan dan asuransi syariah.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Archive className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Wadiah</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Titipan
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Akad penitipan barang atau uang kepada pihak lain yang dipercaya dengan tujuan untuk
              menjaga keselamatan, keamanan, dan keutuhan barang atau uang tersebut.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Users className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Musyarakah</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Kerja Sama
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Akad kerja sama antara dua pihak atau lebih untuk suatu usaha tertentu, di mana
              masing-masing pihak memberikan kontribusi dana. Keuntungan dan kerugian dibagi
              berdasarkan kesepakatan bersama.
            </p>
          </div>

          <div className="bg-card border border-black/5 p-6 flex flex-col hover:border-border/40 transition-colors duration-300">
            <Tag className="w-8 h-8 text-foreground mb-4" />
            <h3 className="font-semibold italic text-xl text-foreground mb-2">Murabahah</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 border-b border-border/40 pb-2">
              Jual Beli
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1">
              Akad jual beli barang dengan menyatakan harga perolehan dan keuntungan (margin) yang
              disepakati oleh penjual dan pembeli. Sering digunakan untuk pembiayaan konsumtif.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card border border-black/5 p-6 md:p-8 grid grid-cols-1 gap-6 w-full">
        <div className="text-xs md:text-sm text-muted-foreground italic border-l border-border/40 pl-4 md:pl-6 py-2">
          <p className="leading-relaxed">
            “Dan tolong-menolonglah kamu dalam (mengerjakan) kebajikan dan takwa, dan jangan
            tolong-menolong dalam berbuat dosa dan pelanggaran.”
          </p>
          <span className="block mt-3 not-italic font-bold text-[10px] uppercase tracking-[0.1em] opacity-60">
            — QS. Al-Ma'idah (5): 2
          </span>
        </div>
      </section>
    </div>
  );
}
