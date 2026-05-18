import Link from "next/link";
import {
  ShoppingBag, Store, Shield, Truck, CreditCard,
  CheckCircle2, ArrowRight, Star, MapPin, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, DELIVERY_ZONES, SITE_CONFIG } from "@/lib/constants";
import Navbar from "@/components/Navbar";

/* ── static data ────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Shield,
    title: "Malipo Salama",
    body: "Pesa yako inalindwa katika escrow mpaka bidhaa yako inafika. Hakuna hatari.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: CreditCard,
    title: "Lipa M-Pesa",
    body: "Hakuna kadi ya benki. M-Pesa, Airtel Money, au Cash on Delivery — chaguo lako.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Truck,
    title: "Delivery Haraka",
    body: "Tunafika nyumbani kwako katika Dar es Salaam, Arusha, Zanzibar, na zaidi ya mikoa 10.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Store,
    title: "Wauzaji Halisi",
    body: "Bidhaa za kweli kutoka kwa wafanyabiashara wa Kariakoo na Tanzania nzima.",
    color: "bg-purple-50 text-purple-600",
  },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Jisajili kwa Simu", body: "Tumia nambari ya simu yako — hakuna email au password." },
  { n: "02", title: "Tafuta Bidhaa",     body: "Vinjari maelfu ya bidhaa, chagua unayotaka." },
  { n: "03", title: "Lipa M-Pesa",       body: "Pokea prompt kwenye simu yako, ingiza PIN tu." },
  { n: "04", title: "Pokea Nyumbani",    body: "Rider analeta bidhaa kwako. Fuatilia moja kwa moja." },
];

const STATS = [
  { v: "10,000+", l: "Bidhaa" },
  { v: "500+",    l: "Wauzaji" },
  { v: "10+",     l: "Mikoa" },
  { v: "48h",     l: "Malipo ya Wauzaji" },
];

/* ── page ───────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="hero-gradient text-white relative overflow-hidden">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            {/* pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Tanzania&apos;s #1 Kariakoo Marketplace
            </div>

            <h1 className="mb-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1]">
              Nunua Kutoka{" "}
              <span className="text-amber-300">Kariakoo</span>
              <br />Pokea Nyumbani
            </h1>

            <p className="mb-8 text-lg text-white/75 leading-relaxed max-w-lg">
              Bidhaa za Kariakoo na Tanzania nzima, zinaletwa hadi mlangoni kwako.
              Lipa kwa M-Pesa. Pesa yako inalindwa hadi bidhaa yako inafika.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button size="xl" variant="secondary" className="font-bold shadow-lg">
                  <ShoppingBag className="h-5 w-5" />
                  Anza Kununua
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/seller/register">
                <Button size="xl" variant="white" className="font-bold">
                  <Store className="h-5 w-5" />
                  Fungua Duka
                </Button>
              </Link>
            </div>

            {/* trust row */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              {["Malipo salama — Escrow", "M-Pesa & Airtel Money", "Delivery Tanzania Nzima"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ════════════════════════════════════════ */}
      <section className="bg-gray-900 text-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.l}>
                <p className="text-3xl font-extrabold text-amber-400">{s.v}</p>
                <p className="text-sm text-gray-400 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ═══════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-700 mb-2">Vinjari kwa Aina</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Bidhaa za Kila Aina</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900">
              Ona Zote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="hover-lift group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:border-brand-200 hover:bg-brand-50 transition-colors"
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-900">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY SOKO LINK ════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700 mb-2">Kwa Nini Sisi?</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Tuliunda kwa Tanzania</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-balance">
              Siyo copy ya Jumia au Kikuu. Platform hii iliundwa hasa kwa mahitaji ya watanzania.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="hover-lift bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700 mb-2">Jinsi Inavyofanya Kazi</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Nunua kwa Hatua 4</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.n} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-100 z-0 -translate-y-1/2" style={{ width: "calc(100% - 3rem)", left: "calc(100% - 0.5rem)" }} />
                )}
                <div className="relative">
                  <div className="w-12 h-12 brand-gradient rounded-2xl flex items-center justify-center text-white font-black text-sm mb-4 shadow-md">
                    {step.n}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/shop">
              <Button size="lg">Anza Sasa <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SELLER CTA ═══════════════════════════════════════ */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl hero-gradient text-white overflow-hidden relative">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            </div>
            <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-300 mb-3">Kwa Wauzaji</p>
                <h2 className="text-3xl font-extrabold mb-3">Uza Kariakoo Online</h2>
                <p className="text-white/75 max-w-md leading-relaxed">
                  Weka duka lako la Kariakoo mtandaoni. Pakia bidhaa, pokea maagizo, pata malipo ya M-Pesa ndani ya masaa 48. Hakuna ada ya kujisajili.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["Hakuna ada ya kujisajili", "Malipo ya M-Pesa", "Dashboard rahisi"].map((b) => (
                    <span key={b} className="flex items-center gap-1.5 text-sm text-white/80">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />{b}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link href="/seller/register">
                  <Button size="xl" variant="secondary" className="font-bold shadow-xl">
                    <Store className="h-5 w-5" />
                    Fungua Duka Bure
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DELIVERY ZONES ═══════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700 mb-2">Delivery</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Tunafika Wapi?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DELIVERY_ZONES.map((z) => (
              <div key={z.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center hover:border-brand-200 hover:bg-brand-50 transition-colors">
                <MapPin className="h-5 w-5 text-brand-700 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900">{z.name}</p>
                <p className="text-xs text-gray-500 mt-1">TZS {z.fee.toLocaleString()} · Siku {z.days}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ APP COMING SOON ══════════════════════════════════ */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Smartphone className="h-10 w-10 text-brand-700 mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">App Inakuja!</h2>
          <p className="text-gray-500 mb-6">
            App ya Soko Link itakuwa Google Play na App Store hivi karibuni.
            Kwa sasa, tovuti inafanya kazi vizuri kwenye simu yako.
          </p>
          <div className="flex justify-center gap-4">
            {["📱 Google Play", "🍎 App Store"].map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600">
                {s} <span className="text-xs font-normal text-gray-400">— Hivi Karibuni</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="bg-gray-950 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl brand-gradient flex items-center justify-center text-white font-bold text-sm">S</div>
                <span className="text-lg font-bold text-white">Soko<span className="text-amber-400">Link</span></span>
              </div>
              <p className="text-sm leading-relaxed">Tanzania&apos;s first Kariakoo-focused e-commerce marketplace. Nunua kwa usalama, uza kwa urahisi.</p>
            </div>

            {[
              { title: "Wateja",  links: ["Anza Kununua", "Jinsi ya Kulipa", "Fuatilia Agizo", "Rudisha Bidhaa"] },
              { title: "Wauzaji", links: ["Fungua Duka", "Seller Dashboard", "Masharti ya Kuuza", "Malipo ya Wauzaji"] },
              { title: "Msaada",  links: ["Wasiliana Nasi", "Maswali Yanayoulizwa", "Sera ya Faragha", "Masharti ya Matumizi"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>© 2025 Soko Link. Haki zote zimehifadhiwa. Dar es Salaam, Tanzania.</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">📧 {SITE_CONFIG.email}</span>
              <span className="text-gray-700">·</span>
              <span className="text-gray-700">📞 {SITE_CONFIG.phone}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
