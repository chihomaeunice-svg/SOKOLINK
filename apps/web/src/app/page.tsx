import Link from "next/link";
import { ShoppingBag, Store, Shield, Smartphone, MapPin, Star, ChevronRight, CheckCircle2, Truck, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, DELIVERY_ZONES, SITE_CONFIG } from "@/lib/constants";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    icon: Shield,
    title: "Malipo Salama — Escrow",
    description: "Pesa yako inalindwa mpaka unapokea bidhaa. Ukipata, tunalipa muuzaji. Hii ndiyo tofauti yetu.",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: CreditCard,
    title: "Lipa kwa M-Pesa",
    description: "Hakuna kadi ya benki. Lipa moja kwa moja kutoka simu yako ya M-Pesa, Airtel Money, au Cash on Delivery.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Truck,
    title: "Delivery Tanzania Nzima",
    description: "Tunafika Dar es Salaam, Arusha, Mwanza, Zanzibar, na zaidi. Kariakoo kukufikia nyumbani.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Store,
    title: "Wauzaji wa Kariakoo",
    description: "Bidhaa halisi kutoka kwa wafanyabiashara wa Kariakoo na Tanzania nzima. Bei za soko, si bei za maduka makubwa.",
    color: "bg-purple-100 text-purple-700",
  },
];

const STEPS_CUSTOMER = [
  { step: "1", title: "Jisajili", desc: "Ingia kwa nambari ya simu yako — dakika 1 tu." },
  { step: "2", title: "Tafuta Bidhaa", desc: "Vinjari maelfu ya bidhaa kutoka Kariakoo na Tanzania nzima." },
  { step: "3", title: "Lipa M-Pesa", desc: "Pokea prompt kwenye simu yako, ingiza PIN — basi." },
  { step: "4", title: "Pokea Nyumbani", desc: "Rider anapeleka bidhaa kwako. Fuatilia delivery live." },
];

const STEPS_SELLER = [
  { step: "1", title: "Omba Duka", desc: "Jaza fomu na maelezo ya duka lako na namba ya M-Pesa." },
  { step: "2", title: "Pakia Bidhaa", desc: "Piga picha, weka bei, uandike maelezo — tayari." },
  { step: "3", title: "Pokea Maagizo", desc: "Wateja wanaagiza, unapata arifa moja kwa moja kwenye simu." },
  { step: "4", title: "Pata Malipo", desc: "Baada ya delivery kuthibitishwa, pesa inaingia M-Pesa yako ndani ya masaa 48." },
];

const STATS = [
  { value: "10,000+", label: "Bidhaa Zinazosubiri" },
  { value: "500+", label: "Wauzaji wa Kariakoo" },
  { value: "48h", label: "Malipo kwa Wauzaji" },
  { value: "10+", label: "Mikoa ya Tanzania" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="brand-gradient relative overflow-hidden py-20 text-white">
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                🇹🇿 Soko la Kwanza la Kariakoo Online
              </div>

              <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl font-display">
                Nunua Kutoka{" "}
                <span className="text-gold-400">Kariakoo</span>{" "}
                — Pokea Nyumbani
              </h1>

              <p className="mb-8 text-lg text-white/80 leading-relaxed max-w-xl">
                Bidhaa bora za Kariakoo na Tanzania nzima, zinaletwa hadi nyumbani kwako.
                Lipa kwa M-Pesa. Pesa yako inalindwa mpaka unapopata bidhaa yako.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="xl" variant="secondary" className="font-bold">
                    <ShoppingBag className="h-5 w-5" />
                    Anza Kununua
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/seller/register">
                  <Button size="xl" variant="white">
                    <Store className="h-5 w-5" />
                    Fungua Duka Lako
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Malipo salama — Escrow
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  M-Pesa &amp; Airtel Money
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Delivery Tanzania Nzima
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="flex h-80 w-80 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/10">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🛍️</div>
                      <p className="text-2xl font-bold">Soko Link</p>
                      <p className="text-gold-300 text-sm mt-1">Kariakoo Ndani ya Simu</p>
                    </div>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -right-4 top-8 rounded-xl bg-white px-4 py-3 shadow-xl text-gray-900">
                  <p className="text-xs text-gray-500">Malipo Salama</p>
                  <p className="font-bold text-green-700">M-Pesa ✓</p>
                </div>
                <div className="absolute -left-4 bottom-12 rounded-xl bg-white px-4 py-3 shadow-xl text-gray-900">
                  <p className="text-xs text-gray-500">Delivery</p>
                  <p className="font-bold text-brand-900">📦 Leo!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="border-b bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-900 font-display">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-display">Nunua kwa Aina</h2>
              <p className="mt-2 text-gray-500">Bidhaa za kila aina — zote kutoka Tanzania</p>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-1 text-brand-700 font-medium hover:text-brand-900">
              Ona Zote <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="card-hover group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="text-4xl transition-transform duration-200 group-hover:scale-110">{cat.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-900">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 font-display">Kwa Nini Soko Link?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              Tuliunda platform hii kwa ajili ya Tanzania — siyo copy ya Jumia au Kikuu.
              Tumefikiri mahitaji yenu kwanza.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card-hover rounded-2xl bg-white p-6 shadow-sm">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — Customer ───────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Customer */}
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
                <ShoppingBag className="h-3.5 w-3.5" /> KWA WATEJA
              </div>
              <h2 className="mb-8 text-2xl font-bold text-gray-900 font-display">Jinsi ya Kununua</h2>
              <div className="space-y-6">
                {STEPS_CUSTOMER.map((s, i) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-white font-bold text-sm">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{s.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{s.desc}</p>
                      {i < STEPS_CUSTOMER.length - 1 && (
                        <div className="mt-3 ml-0.5 h-6 w-0.5 bg-gray-200" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/shop">
                  <Button size="lg">Anza Kununua <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>

            {/* Seller */}
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-800">
                <Store className="h-3.5 w-3.5" /> KWA WAUZAJI
              </div>
              <h2 className="mb-8 text-2xl font-bold text-gray-900 font-display">Jinsi ya Kuuza</h2>
              <div className="space-y-6">
                {STEPS_SELLER.map((s, i) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-white font-bold text-sm">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{s.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{s.desc}</p>
                      {i < STEPS_SELLER.length - 1 && (
                        <div className="mt-3 ml-0.5 h-6 w-0.5 bg-gray-200" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/seller/register">
                  <Button size="lg" variant="secondary">Fungua Duka <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Delivery zones ───────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 font-display">Tunafika Wapi?</h2>
            <p className="mt-2 text-gray-500">Delivery kwa mikoa 10+ ya Tanzania</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {DELIVERY_ZONES.map((zone) => (
              <div key={zone.id} className="rounded-xl border bg-white p-4 text-center shadow-sm">
                <MapPin className="mx-auto mb-2 h-5 w-5 text-brand-700" />
                <p className="text-sm font-semibold text-gray-900">{zone.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  TZS {zone.fee.toLocaleString()} · Siku {zone.days}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App download CTA ─────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="brand-gradient rounded-3xl p-10 text-white text-center">
            <Smartphone className="mx-auto mb-4 h-12 w-12 opacity-80" />
            <h2 className="mb-3 text-3xl font-bold font-display">App Inakuja Hivi Karibuni!</h2>
            <p className="mb-8 text-white/80 max-w-xl mx-auto">
              App ya Soko Link itakuwa Google Play na App Store.
              Sasa hivi, tumia tovuti yetu — inafanya kazi vizuri kwenye simu.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-3 rounded-xl bg-white/15 px-6 py-3 backdrop-blur-sm">
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <p className="text-xs text-white/70">Inakuja</p>
                  <p className="font-bold">Google Play</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/15 px-6 py-3 backdrop-blur-sm">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <p className="text-xs text-white/70">Inakuja</p>
                  <p className="font-bold">App Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white font-bold">S</div>
                <div>
                  <span className="font-bold text-white">Soko</span>
                  <span className="font-bold text-gold-400">Link</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                Tanzania&apos;s first Kariakoo-focused e-commerce marketplace.
                Nunua kwa usalama, uza kwa urahisi.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Kwa Wateja</h4>
              <ul className="space-y-2 text-sm">
                {["Anza Kununua", "Jinsi ya Kulipa", "Fuatilia Agizo", "Kurudi kwa Bidhaa"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Kwa Wauzaji</h4>
              <ul className="space-y-2 text-sm">
                {["Fungua Duka", "Seller Dashboard", "Masharti ya Kuuza", "Malipo ya Wauzaji"].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Wasiliana Nasi</h4>
              <ul className="space-y-2 text-sm">
                <li>📧 {SITE_CONFIG.email}</li>
                <li>📞 {SITE_CONFIG.phone}</li>
                <li>📍 {SITE_CONFIG.address}</li>
                <li className="pt-2 flex gap-3">
                  <a href="#" className="hover:text-white">Instagram</a>
                  <a href="#" className="hover:text-white">Facebook</a>
                  <a href="#" className="hover:text-white">WhatsApp</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2025 Soko Link. Haki zote zimehifadhiwa. Dar es Salaam, Tanzania.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Sera ya Faragha</a>
              <a href="#" className="hover:text-white">Masharti ya Matumizi</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
