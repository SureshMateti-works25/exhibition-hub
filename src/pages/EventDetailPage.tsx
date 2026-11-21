import React from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  Tag,
  Ticket,
  Car,
  Train,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Info,
  Heart,
  Share2
} from 'lucide-react';
import { BazaarEvent } from '../types';

interface EventDetailPageProps {
  eventId: string;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId }) => {
  const { events, activeEventId, setActiveEventId, navigateTo, setCustomerBrowseView, setIsStallApplicationOpen } = useApp();

  const event = events.find((e) => e.id === eventId) || events[0];

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-1 max-w-xl w-full mx-auto p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Exhibition Not Found</h2>
          <button
            onClick={() => navigateTo({ name: 'events' })}
            className="bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl"
          >
            ← View All Exhibitions
          </button>
        </main>
      </div>
    );
  }

  const isCurrentActive = event.id === activeEventId;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 py-6 pb-24 md:pb-12 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo({ name: 'events' })}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Exhibitions
          </button>

          <div className="flex items-center gap-2">
            {!isCurrentActive ? (
              <button
                onClick={() => {
                  setActiveEventId(event.id);
                  setCustomerBrowseView('stalls');
                  navigateTo({ name: 'stalls' });
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl shadow-sm transition"
              >
                Set as Active Exhibition
              </button>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active Platform Exhibition
              </span>
            )}
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl min-h-[300px] flex flex-col justify-end p-6 sm:p-10">
          <img
            src={event.bannerImage}
            alt={event.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-orange-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                {event.edition || 'Official Edition'}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {event.status === 'ongoing' ? '🟢 Live Exhibition' : '🗓️ Scheduled Upcoming'}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {event.entryTicketPrice ? `₹${event.entryTicketPrice} Ticket` : 'Free Public Entry'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight leading-tight">
              {event.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {event.tagline} • Organized by <strong className="text-white">{event.hostOrgName}</strong>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-orange-400" />
                {event.venueName}, {event.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-amber-400" />
                {event.startDate} to {event.endDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                Weekdays {event.timingsWeekdays}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => {
                  setActiveEventId(event.id);
                  setCustomerBrowseView('stalls');
                  navigateTo({ name: 'stalls' });
                }}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-lg transition flex items-center gap-2"
              >
                Explore {event.totalStallCapacity}+ Stalls <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsStallApplicationOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 px-4 rounded-xl border border-white/30 backdrop-blur-md transition"
              >
                Apply for Stall Allotment
              </button>
            </div>
          </div>
        </div>

        {/* SPECIAL DAYS & THEMED DAYS (HIGHLIGHT FEATURE) */}
        {event.specialDays && event.specialDays.length > 0 && (
          <section className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                  Event Specific Days & Privileges
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 font-serif mt-1">
                  🌸 Special Themed Days & Access Protocols
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {event.specialDays.length} special events scheduled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.specialDays.map((sd) => (
                <div
                  key={sd.id}
                  className={`rounded-2xl p-5 border transition flex flex-col justify-between ${
                    sd.isLadiesOnly
                      ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50/30 border-pink-200 shadow-sm'
                      : sd.isDiscountDay
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm ${
                          sd.isLadiesOnly
                            ? 'bg-pink-600 text-white'
                            : sd.isDiscountDay
                            ? 'bg-amber-600 text-white'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        {sd.badgeText}
                      </span>
                      <span className="text-xs font-extrabold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                        🗓️ {sd.date}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 font-serif">
                      {sd.title}
                    </h3>

                    {sd.startTime && sd.endTime && (
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Timings: {sd.startTime} – {sd.endTime}
                      </p>
                    )}

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {sd.description}
                    </p>
                  </div>

                  {sd.entryRules && (
                    <div className="mt-3 text-[11px] font-semibold bg-white p-2.5 rounded-xl border border-pink-200/80 text-rose-800 flex items-start gap-1.5 shadow-xs">
                      <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>Entry Protocol: {sd.entryRules}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Exhibition Details Grid: Timings & Venue Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Timings & Calendar */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900 font-serif flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              Daily Exhibition Timings
            </h3>

            <div className="space-y-2.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Weekdays (Monday – Friday)</span>
                  <span className="text-[11px] text-slate-500">Standard general visitor access</span>
                </div>
                <span className="text-xs font-black text-orange-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                  {event.timingsWeekdays}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Weekends & Public Holidays</span>
                  <span className="text-[11px] text-slate-500">Extended hours for carnival & food courts</span>
                </div>
                <span className="text-xs font-black text-orange-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                  {event.timingsWeekends}
                </span>
              </div>
            </div>

            {/* Entry Ticket Policy */}
            <div className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-orange-600" /> Ticketing Policy
                </span>
                <span className="text-xs font-black text-orange-700">
                  {event.entryTicketPrice ? `₹${event.entryTicketPrice} / Visitor` : 'Free Entry'}
                </span>
              </div>
              <p className="text-[11px] text-orange-800">{event.ticketDescription}</p>
            </div>
          </div>

          {/* Venue & Transportation Connectivity */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-base font-black text-slate-900 font-serif flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              Venue & Transport Connectivity
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Venue Address</span>
                <p className="font-bold text-slate-900">{event.venueName}</p>
                <p className="text-slate-600">{event.address}, {event.city}, {event.state} - {event.pincode}</p>
              </div>

              {event.nearestMetro && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5">
                  <Train className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Nearest Metro</span>
                    <p className="font-semibold text-slate-800">{event.nearestMetro}</p>
                  </div>
                </div>
              )}

              {event.parkingCapacity && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Parking Facility</span>
                    <p className="font-semibold text-slate-800">{event.parkingCapacity}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gates Directory */}
        {event.gates && event.gates.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-base font-black text-slate-900 font-serif flex items-center gap-2">
              <span>🚪</span> Ground Entry & Exit Gates ({event.gates.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {event.gates.map((g) => (
                <div key={g.id} className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
                  <h4 className="text-xs font-black text-slate-900">{g.name}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">{g.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Public Amenities */}
        {event.amenities && event.amenities.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-3">
            <h3 className="text-base font-black text-slate-900 font-serif flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Public Amenities & Emergency Facilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {event.amenities.map((item, idx) => (
                <div key={idx} className="bg-emerald-50/60 text-emerald-950 border border-emerald-200 rounded-xl p-2.5 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Host Credentials & Support */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Organizing Host
              </span>
              <h3 className="text-lg font-bold font-serif text-white">{event.hostOrgName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Reg No: {event.hostRegNumber} • Representative: {event.hostContactPerson}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href={`mailto:${event.hostEmail}`}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl border border-white/20 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                {event.hostEmail}
              </a>
              <a
                href={`tel:${event.hostPhone}`}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl border border-white/20 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                {event.hostPhone}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};