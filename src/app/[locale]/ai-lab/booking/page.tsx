"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Scissors,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Loader2,
  User,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { WEBHOOKS } from "@/lib/config/webhooks";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  fullName: string;
  phone: string;
  service: string;
  barber: string;
  date: string;
  time: string;
}

interface ServiceOption {
  value: string;
  label: string;
  duration: string;
  price: string;
}

interface BarberOption {
  value: string;
  label: string;
  role: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICES: ServiceOption[] = [
  { value: "sac-sakal", label: "Saç & Sakal Kesimi", duration: "45 dk", price: "₺350" },
  { value: "sac", label: "Saç Kesimi", duration: "30 dk", price: "₺200" },
  { value: "sakal", label: "Sakal Kesimi", duration: "20 dk", price: "₺150" },
  { value: "cilt-bakimi", label: "Cilt Bakımı", duration: "60 dk", price: "₺450" },
];

const BARBERS: BarberOption[] = [
  { value: "ahmet-usta", label: "Ahmet Usta", role: "Kurucu Berber" },
  { value: "mehmet-usta", label: "Mehmet Usta", role: "Kıdemli Berber" },
  { value: "farketmez", label: "İlk Uygun", role: "En erken randevu" },
];

const TIME_SLOTS = [
  "08:00","09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00","17:00",
  "18:00","19:00","20:00",
];

const MOCK_BOOKED = ["14:00", "16:00"];

const DAYS_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const MONTHS_TR = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
];

// ─── Shared Input Class ───────────────────────────────────────────────────────

const inputCls =
  "w-full bg-secondary/20 border border-border/40 rounded-xl px-4 py-3.5 text-sm text-foreground placeholder-muted-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/50 transition-all duration-200";

// ─── Mini Calendar ────────────────────────────────────────────────────────────

interface MiniCalendarProps {
  value: string;
  onChange: (date: string) => void;
  minDate: string;
}

function MiniCalendar({ value, onChange, minDate }: MiniCalendarProps) {
  const todayObj = new Date();
  const [viewDate, setViewDate] = useState(() =>
    new Date(todayObj.getFullYear(), todayObj.getMonth(), 1)
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const minDateObj = new Date(minDate + "T00:00:00");

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const fmt = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    return d < minDateObj || d.getDay() === 0;
  };
  const isToday = (day: number) =>
    day === todayObj.getDate() &&
    month === todayObj.getMonth() &&
    year === todayObj.getFullYear();
  const isSelected = (day: number) => fmt(day) === value;

  return (
    <div className="w-full select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS_TR[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_TR.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold text-muted-foreground/40 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          const today = isToday(day);
          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(fmt(day))}
              className={`
                mx-auto w-7 h-7 rounded-lg text-xs flex items-center justify-center font-medium transition-all
                ${disabled
                  ? "text-muted-foreground/20 cursor-not-allowed"
                  : selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : today
                  ? "border border-primary/40 text-primary hover:bg-primary/10 cursor-pointer"
                  : "text-foreground/75 hover:bg-secondary/70 cursor-pointer"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/20">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <span className="w-2.5 h-2.5 rounded border border-primary/40 inline-block" /> Bugün
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
          <span className="w-2.5 h-2.5 rounded bg-muted-foreground/15 inline-block" /> Kapalı (Pazar)
        </span>
      </div>
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────

interface CustomSelectProps<T extends { value: string; label: string }> {
  options: T[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  renderOption?: (o: T) => React.ReactNode;
  renderSelected?: (o: T) => React.ReactNode;
}

function CustomSelect<T extends { value: string; label: string }>({
  options, value, onChange, placeholder, renderOption, renderSelected,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 text-left
          bg-secondary/20 border-border/40 hover:border-border/70 hover:bg-secondary/30
          ${open ? "border-primary/50 ring-2 ring-primary/20 bg-background/50" : ""}
          ${selected ? "text-foreground" : "text-muted-foreground/40"}
        `}
      >
        <span className="truncate flex-1">
          {selected ? (renderSelected ? renderSelected(selected) : selected.label) : placeholder}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 ml-2" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-[100] bg-card border border-border/50 rounded-xl shadow-2xl shadow-black/30 overflow-hidden backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left
                  hover:bg-secondary/50
                  ${opt.value === value ? "bg-primary/8 text-primary" : "text-foreground"}
                  border-b border-border/20 last:border-0
                `}
              >
                {renderOption ? renderOption(opt) : <span>{opt.label}</span>}
                {opt.value === value && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 ml-2" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub Components ───────────────────────────────────────────────────────────

function SectionLabel({ icon, text, step }: { icon: React.ReactNode; text: string; step: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/15 flex-shrink-0">
        {step}
      </span>
      <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
        {icon}{text}
      </span>
    </div>
  );
}

function FieldWrapper({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground/60 pl-0.5">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between text-xs py-0.5">
      <span className="flex items-center gap-2 text-foreground/65">
        <span className="text-sm">{icon}</span>
        <span>{label}</span>
      </span>
      {value && <span className="text-primary font-semibold">{value}</span>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BarberAppointment() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "", phone: "", service: "", barber: "", date: "", time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dateError, setDateError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");
  const bookedSlots = useMemo(() => (formData.date ? MOCK_BOOKED : []), [formData.date]);

  const selectedService = SERVICES.find((s) => s.value === formData.service);
  const selectedBarber = BARBERS.find((b) => b.value === formData.barber);

  const canSubmit =
    !!formData.fullName &&
    formData.phone.replace(/\s/g, "").length === 10 &&
    !!formData.service &&
    !!formData.barber &&
    !!formData.date &&
    !!formData.time;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (!digits) { setFormData((p) => ({ ...p, phone: "" })); return; }
    if (digits[0] !== "5") digits = "5" + digits;
    digits = digits.slice(0, 10);
    let result = "";
    for (let i = 0; i < digits.length; i++) {
      if (i === 3 || i === 6 || i === 8) result += " ";
      result += digits[i];
    }
    setFormData((p) => ({ ...p, phone: result }));
  };

  const handleDateChange = (dateStr: string) => {
    const d = new Date(dateStr + "T12:00:00");
    if (d.getDay() === 0) {
      setDateError("Pazar günleri hizmet vermemekteyiz.");
      setFormData((p) => ({ ...p, date: "", time: "" }));
    } else {
      setDateError("");
      setFormData((p) => ({ ...p, date: dateStr, time: "" }));
    }
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T12:00:00");
    return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(WEBHOOKS.booking, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: "+90" + formData.phone.replace(/\s/g, ""),
        }),
      });
      if (!res.ok) throw new Error("Network error");
      setIsSuccess(true);
      setFormData({ fullName: "", phone: "", service: "", barber: "", date: "", time: "" });
    } catch {
      alert("Sistemsel bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-full py-6 px-4 sm:px-6 lg:px-10 flex items-start justify-center">
      <div className="max-w-6xl w-full">
        <AnimatePresence mode="wait">

          {/* ── SUCCESS ─────────────────────────────────────────────────── */}
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card/50 backdrop-blur-2xl rounded-2xl border border-border/40 shadow-2xl p-12 sm:p-20 flex flex-col items-center justify-center text-center min-h-[460px]"
            >
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.06 }}
                className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Randevunuz Onaylandı</h3>
                <p className="text-muted-foreground max-w-sm mb-10 leading-relaxed text-sm mx-auto">
                  İşleminiz başarıyla kaydedildi. Kısa süre içinde SMS ile bilgilendirileceksiniz.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-all font-semibold border border-border/50 text-sm active:scale-95"
                >
                  Yeni Randevu Oluştur
                </button>
              </motion.div>
            </motion.div>

          ) : (

            /* ── FORM ───────────────────────────────────────────────────── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-5"
            >

              {/* ─ LEFT PANEL ─────────────────────────────────────────── */}
              <div className="w-full lg:w-[270px] lg:flex-shrink-0 flex flex-col gap-4">

                {/* Brand */}
                <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/40 p-5 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/8 rounded-full blur-[50px] pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 border border-primary/15">
                      <Scissors className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <h2 className="text-base font-bold text-foreground mb-1">Barber Shop</h2>
                    {/* <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">4.9 (218)</span>
                    </div> */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>Ataşehir, İstanbul</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-border/40 p-4 space-y-3">
                  {[
                    { icon: <Clock className="w-3.5 h-3.5 text-primary" />, bg: "bg-primary/10", title: "Çalışma Saatleri", sub: "Pzt–Cmt · 08:00–20:00" },
                    { icon: <AlertCircle className="w-3.5 h-3.5 text-destructive" />, bg: "bg-destructive/10", title: "Kapalı Günler", sub: "Pazar hizmet verilmez" },
                    { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, bg: "bg-emerald-500/10", title: "Anında Onay", sub: "SMS bildirimi" },
                  ].map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="h-px bg-border/20" />}
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{item.title}</p>
                          <p className="text-[11px] text-muted-foreground/60">{item.sub}</p>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* Dynamic summary */}
                <AnimatePresence>
                  {(selectedService || formData.date || formData.time) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-primary/5 border border-primary/15 rounded-2xl p-4"
                    >
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Seçiminiz</p>
                      <div className="space-y-1.5">
                        {selectedService && (
                          <SummaryRow icon="✂️" label={selectedService.label} value={selectedService.price} />
                        )}
                        {selectedBarber && formData.barber !== "farketmez" && (
                          <SummaryRow icon="👤" label={selectedBarber.label} />
                        )}
                        {formData.date && (
                          <SummaryRow icon="📅" label={formatDisplayDate(formData.date)} />
                        )}
                        {formData.time && (
                          <SummaryRow icon="🕐" label={formData.time} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ─ RIGHT FORM ─────────────────────────────────────────── */}
              <div className="flex-1 bg-card/50 backdrop-blur-2xl rounded-2xl border border-border/40 shadow-xl overflow-visible">

                <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-border/25">
                  <h1 className="text-lg font-bold text-foreground">Randevu Oluştur</h1>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    Tüm alanları doldurarak randevunuzu tamamlayın.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">

                  {/* 1. KİŞİSEL */}
                  <div>
                    <SectionLabel icon={<User className="w-3 h-3" />} text="Kişisel Bilgiler" step="1" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldWrapper label="İsim Soyisim">
                        <div className="relative">
                          <User className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/35 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder="Adınız ve Soyadınız"
                            className={`${inputCls} pl-9`}
                          />
                        </div>
                      </FieldWrapper>
                      <FieldWrapper label="Telefon Numarası">
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none z-10">
                            <span className="text-sm">🇹🇷</span>
                            <span className="text-xs text-muted-foreground/50 font-medium">+90</span>
                            <span className="w-px h-3.5 bg-border/50 block" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="5XX XXX XX XX"
                            className={`${inputCls} pl-[70px] font-mono tracking-wider`}
                          />
                        </div>
                      </FieldWrapper>
                    </div>
                  </div>

                  {/* 2. HİZMET */}
                  <div>
                    <SectionLabel icon={<Scissors className="w-3 h-3" />} text="Hizmet Seçimi" step="2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FieldWrapper label="İşlem Türü">
                        <CustomSelect<ServiceOption>
                          options={SERVICES}
                          value={formData.service}
                          onChange={(v) => setFormData((p) => ({ ...p, service: v }))}
                          placeholder="Hizmet seçin..."
                          renderOption={(o) => (
                            <div className="flex-1">
                              <p className="font-medium text-sm">{o.label}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-muted-foreground">{o.duration}</span>
                                <span className="text-[11px] font-bold text-primary">{o.price}</span>
                              </div>
                            </div>
                          )}
                          renderSelected={(o) => (
                            <span className="flex items-center gap-2">
                              {o.label}
                              <span className="text-xs text-primary font-bold">{o.price}</span>
                            </span>
                          )}
                        />
                      </FieldWrapper>
                      <FieldWrapper label="Personel">
                        <CustomSelect<BarberOption>
                          options={BARBERS}
                          value={formData.barber}
                          onChange={(v) => setFormData((p) => ({ ...p, barber: v }))}
                          placeholder="Berber seçin..."
                          renderOption={(o) => (
                            <div className="flex-1">
                              <p className="font-medium text-sm">{o.label}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{o.role}</p>
                            </div>
                          )}
                        />
                      </FieldWrapper>
                    </div>
                  </div>

                  {/* 3. TARİH & SAAT */}
                  <div>
                    <SectionLabel icon={<Calendar className="w-3 h-3" />} text="Tarih ve Saat" step="3" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                      {/* Calendar */}
                      <FieldWrapper label="Randevu Tarihi">
                        <div className="bg-secondary/15 border border-border/30 rounded-xl p-4">
                          <MiniCalendar value={formData.date} onChange={handleDateChange} minDate={today} />
                        </div>
                        <AnimatePresence>
                          {dateError && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="text-xs text-destructive mt-1.5 flex items-center gap-1.5 font-medium"
                            >
                              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {dateError}
                            </motion.p>
                          )}
                          {formData.date && !dateError && (
                            <motion.p
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="text-xs text-primary mt-1.5 flex items-center gap-1.5 font-medium"
                            >
                              <Check className="w-3 h-3" /> {formatDisplayDate(formData.date)} seçildi
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </FieldWrapper>

                      {/* Time Slots */}
                      <FieldWrapper label="Saat Seçimi">
                        <AnimatePresence mode="wait">
                          {!formData.date ? (
                            <motion.div
                              key="ph"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="bg-secondary/10 border border-dashed border-border/30 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[210px]"
                            >
                              <Calendar className="w-7 h-7 text-muted-foreground/15 mb-3" />
                              <p className="text-xs text-muted-foreground/40 font-medium leading-relaxed">
                                Saatleri görmek için<br />önce tarih seçin
                              </p>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="slots"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="bg-secondary/10 border border-border/25 rounded-xl p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] text-muted-foreground/50 font-medium">
                                  {formatDisplayDate(formData.date)}
                                </span>
                                <div className="flex items-center gap-3 text-[9px] text-muted-foreground/40">
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded bg-secondary/50 border border-border/30 inline-block" />
                                    Dolu
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded bg-primary inline-block" />
                                    Seçili
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {TIME_SLOTS.map((time) => {
                                  const booked = bookedSlots.includes(time);
                                  const sel = formData.time === time;
                                  return (
                                    <motion.button
                                      key={time}
                                      type="button"
                                      disabled={booked}
                                      onClick={() => !booked && setFormData((p) => ({ ...p, time }))}
                                      whileHover={!booked ? { scale: 1.04 } : {}}
                                      whileTap={!booked ? { scale: 0.96 } : {}}
                                      className={`
                                        py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 border
                                        ${booked
                                          ? "bg-transparent border-border/15 text-muted-foreground/20 cursor-not-allowed line-through"
                                          : sel
                                          ? "bg-primary border-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary-rgb,99,102,241),0.25)]"
                                          : "bg-secondary/25 border-border/25 text-foreground/65 hover:border-primary/40 hover:text-foreground cursor-pointer hover:bg-secondary/50"
                                        }
                                      `}
                                    >
                                      {time}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FieldWrapper>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <div className="pt-1">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !canSubmit}
                      whileHover={canSubmit && !isSubmitting ? { scale: 1.005 } : {}}
                      whileTap={canSubmit && !isSubmitting ? { scale: 0.995 } : {}}
                      className={`
                        w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300
                        ${(isSubmitting || !canSubmit)
                          ? "bg-secondary/40 text-muted-foreground/40 border border-border/20 cursor-not-allowed"
                          : "bg-foreground text-background shadow-lg hover:shadow-xl hover:bg-foreground/90 cursor-pointer"
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Randevu Kaydediliyor...</span>
                        </>
                      ) : (
                        <span>Randevuyu Onayla →</span>
                      )}
                    </motion.button>
                    <p className="text-center text-[11px] text-muted-foreground/35 mt-3">
                      {/* Onay sonrası SMS ile bilgilendirileceksiniz. */}
                      Randevunuza geç kalmayınız. Geç kalınan randevular iptal edilir!
                    </p>
                  </div>

                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}