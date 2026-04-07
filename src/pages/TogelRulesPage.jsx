import { Link, useNavigate } from 'react-router-dom'

const toc = [
  { href: '#diskon', label: 'Diskon' },
  { href: '#4d', label: '4D' },
  { href: '#3d', label: '3D' },
  { href: '#2d', label: '2D' },
  { href: '#bbfs', label: 'BBFS' },
]

const sections = [
  {
    id: 'diskon',
    title: 'Diskon (opsional)',
    bullets: [
      'Anda bisa memilih Tanpa diskon atau Pakai diskon sebelum pasang taruhan.',
      'Tanpa diskon: membayar 100% nominal taruhan per baris; jika menang, multiplier hadiah = nilai penuh yang dikonfigurasi pasaran (mis. 9000x).',
      'Pakai diskon: membayar nominal dikurangi persentase diskon pasaran (mis. diskon 40% → bayar 60% dari nominal); multiplier hadiah menang disesuaikan dengan faktor yang sama (mis. 9000 × 60% = 5400x).',
      'Jika pasaran mengatur diskon 0%, hanya mode tanpa diskon yang berlaku.',
    ],
  },
  {
    id: '4d',
    title: '4D (Empat Angka)',
    bullets: [
      'Menebak keempat angka hasil undian secara berurutan (FULL).',
      'Tidak ada pilihan posisi lain; hanya tipe FULL.',
      'Multiplier hadiah mengikuti mode diskon yang Anda pilih (lihat bagian Diskon).',
      'Minimum taruhan per baris sesuai yang ditampilkan di halaman betting.',
    ],
  },
  {
    id: '3d',
    title: '3D (Tiga Angka)',
    bullets: [
      'Hanya dua pilihan posisi: Depan atau Belakang.',
      'Depan: menebak tiga angka di bagian depan hasil resmi (sesuai format pasaran).',
      'Belakang: menebak tiga angka di bagian belakang hasil resmi.',
      'Tidak tersedia posisi Tengah atau Full untuk 3D di halaman ini.',
    ],
  },
  {
    id: '2d',
    title: '2D (Dua Angka)',
    bullets: [
      'Tiga pilihan posisi: Depan, Tengah, atau Belakang.',
      'Masing-masing memetakan ke segmen dua digit pada hasil undian sesuai aturan pasaran.',
      'Hadiah mengikuti kelipatan 2D pada tabel pasaran.',
    ],
  },
  {
    id: 'bbfs',
    title: 'BBFS — Bolak Balik Full Set',
    bullets: [
      'Anda memasukkan tepat 4 digit angka (boleh ada angka yang sama).',
      'Sistem membangkitkan baris taruhan unik yang mencakup:',
      '• Semua permutasi unik 4 angka sebagai 4D (posisi FULL).',
      '• Semua permutasi berurutan panjang 3 dari angka tersebut, masing-masing sebagai 3D untuk posisi Depan dan Belakang.',
      '• Semua permutasi berurutan panjang 2, masing-masing sebagai 2D untuk Depan, Tengah, dan Belakang.',
      'Nominal yang Anda isi adalah taruhan per baris; total bayar = nominal × jumlah baris (dikalikan faktor diskon hanya jika Anda memilih Pakai diskon).',
      'Jumlah baris bergantung pada apakah ada digit yang berulang (contoh: 1234 menghasilkan lebih banyak baris unik daripada 1122).',
    ],
  },
]

export default function TogelRulesPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 bg-black/90 border-b border-[#2a2a2a] backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#C0C0C0] hover:text-white font-bold text-sm"
          >
            ← Kembali
          </button>
          <h1 className="text-lg font-black tracking-wider text-[#C0C0C0]">ATURAN TOGEL</h1>
          <Link to="/togel" className="text-sm font-bold text-[#808080] hover:text-white">
            Betting
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-16">
        <p className="text-sm text-[#808080] leading-relaxed">
          Ringkasan jenis taruhan di aplikasi ini. Detail hadiah, jam tutup, dan format hasil resmi mengikuti masing-masing
          pasaran pada halaman betting.
        </p>

        <nav
          aria-label="Daftar aturan per jenis"
          className="flex flex-wrap gap-2 rounded-xl border border-[#333] bg-[#0d0d0d] p-3"
        >
          {toc.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 text-xs font-bold text-[#C0C0C0] hover:border-[#505050] hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {sections.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="rounded-2xl border border-[#333] bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-5 sm:p-6"
          >
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E8E8E8] to-[#909090] mb-4">
              {s.title}
            </h2>
            <ul className="space-y-3 text-sm text-[#A0A0A0] leading-relaxed list-disc pl-5">
              {s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        ))}

        <p className="text-xs text-[#505050] text-center">
          Jika ada perbedaan dengan aturan bandar, yang berlaku adalah ketentuan resmi situs / API backend.
        </p>
      </main>
    </div>
  )
}
