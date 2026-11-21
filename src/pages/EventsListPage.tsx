import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Building,
  ShieldCheck,
  Search,
  Filter,
  PlusCircle,
  ArrowRight,
  CheckCircle,
  Tag,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { BazaarEvent } from '../types';

export const EventsListPage: React.FC = () => {
  const { events, activeEventId, setActiveEventId, navigateTo, setCustomerBrowseView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const cities = ['All', ...Array.from(new Set(events.map((e) => e.city).filter(Boolean)))];

  const filteredEvents = events.filter((ev) => {
    const matchesCity = selectedCity === 'All' || ev.city === selectedCity;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ev.name.toLowerCase().includes(q) ||
      ev.hostOrgName.toLowerCase().includes(q) ||
      ev.venueName.toLowerCase().includes(q) ||
      ev.city.toLowerCase().includes(q) ||
      ev.specialDays.some((sd) => sd.title.toLowerCase().includes(q) || sd.badgeText.toLowerCase().includes(q));
    return matchesCity && matchesSearch;
  });

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 py-6 pb-24 md:pb-12">
        {/* Top Header & CTAs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-700 bg-orange-100/70 px-2.5 py-0.5 rounded-full border border-orange-200">
                Multi-Exhibition Hub
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                {events.length} Exhibitions Registered
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
              Exhibitions, Expos & Bazaars
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-1">
              Browse heritage industrial exhibitions across India. Numaish is our flagship live event, hosting 2,500+ stalls with dedicated themed days like <strong className="text-slate-800">Ladies-Only Day</strong>.
            </p>
          </div>

          <button
            onClick={() => navigateTo({ name: 'event-host-register' })}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow-md transition transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            + Register as Event Host
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exhibition, host society, venue, or special days (e.g. Ladies Only)..."
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* City Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCity === city
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Current Active Exhibition Banner */}
        {activeEvent && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="max-w-xl space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="bg-green-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> Currently Active Exhibition
                  </span>
                  <span className="text-[11px] text-amber-300 font-bold">
                    {activeEvent.edition || 'Flagship Edition'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-serif text-white">
                  {activeEvent.name}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {activeEvent.description}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    {activeEvent.venueName}, {activeEvent.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {activeEvent.startDate} – {activeEvent.endDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {activeEvent.timingsWeekdays}
                  </span>
                </div>

                {/* Special Days Preview */}
                {activeEvent.specialDays?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeEvent.specialDays.slice(0, 3).map((sd) => (
                      <span
                        key={sd.id}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sd.isLadiesOnly
                            ? 'bg-pink-900/60 text-pink-200 border border-pink-500/30'
                            : 'bg-white/10 text-slate-200 border border-white/20'
                        }`}
                      >
                        {sd.badgeText}: {sd.date.slice(5)}
                      </span>
                    ))}
                    {activeEvent.specialDays.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{activeEvent.specialDays.length - 3} more special days
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    setCustomerBrowseView('stalls');
                    navigateTo({ name: 'stalls' });
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 px-5 rounded-xl shadow transition flex items-center justify-center gap-1.5"
                >
                  Browse Stalls & Products <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigateTo({ name: 'event-detail', eventId: activeEvent.id })}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-white/20 transition flex items-center justify-center gap-1.5"
                >
                  View Full Schedule & Venue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Exhibitions Directory Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
            All Registered Exhibitions ({filteredEvents.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((ev) => {
              const isCurrent = ev.id === activeEventId;
              return (
                <div
                  key={ev.id}
                  className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition hover:shadow-md flex flex-col justify-between ${
                    isCurrent ? 'ring-2 ring-orange-500/50 border-orange-200' : 'border-slate-200'
                  }`}
                >
                  {/* Banner Image */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={ev.bannerImage}
                      alt={ev.name}
                      className="w-full h-full object-cover opacity-90 transition transform hover:scale-105 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Status & Edition Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm ${
                          ev.status === 'ongoing'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-slate-900'
                        }`}
                      >
                        {ev.status === 'ongoing' ? '🟢 Live Now' : '🗓️ Upcoming'}
                      </span>
                      {ev.isFlagship && (
                        <span className="bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                          ⭐ Flagship
                        </span>
                      )}
                    </div>

                    {/* Ticket Price Badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                      {ev.entryTicketPrice ? `₹${ev.entryTicketPrice} Entry` : 'Free Entry'}
                    </div>

                    {/* Venue & Host in Banner */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[11px] font-semibold text-orange-200 truncate">
                        {ev.hostOrgName}
                      </p>
                      <h4 className="text-base font-black font-serif text-white truncate">
                        {ev.name}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Dates and Timings */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Dates</span>
                          <span className="font-bold text-slate-800">{ev.startDate.slice(5)} – {ev.endDate.slice(5)}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Timings</span>
                          <span className="font-bold text-slate-800 truncate block">{ev.timingsWeekdays}</span>
                        </div>
                      </div>

                      {/* Venue Location */}
                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="truncate">{ev.venueName}, {ev.city} • Near {ev.nearestMetro || 'Metro'}</span>
                      </div>

                      {/* Special Days Highlight Strip */}
                      {ev.specialDays && ev.specialDays.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-pink-700 block">
                            🌸 Special Themed Days ({ev.specialDays.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ev.specialDays.map((sd) => (
                              <span
                                key={sd.id}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                                  sd.isLadiesOnly
                                    ? 'bg-pink-50 text-pink-800 border-pink-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {sd.badgeText} ({sd.date.slice(5)})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveEventId(ev.id);
                          setCustomerBrowseView('stalls');
                          navigateTo({ name: 'stalls' });
                        }}
                        className={`flex-1 text-xs font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1 ${
                          isCurrent
                            ? 'bg-orange-600 text-white shadow-sm hover:bg-orange-700'
                            : 'bg-slate-900 text-white hover:bg-black'
                        }`}
                      >
                        {isCurrent ? 'Browse Stalls ✓' : 'Select & Explore Stalls'}
                      </button>
                      <button
                        onClick={() => navigateTo({ name: 'event-detail', eventId: ev.id })}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};