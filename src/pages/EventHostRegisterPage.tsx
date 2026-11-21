import React, { useState } from 'react';
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
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Info,
  Heart,
  Ticket,
  Car,
  Train,
  Navigation,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { BazaarEvent, EventSpecialDay, EventGate } from '../types';

const PRESET_BANNERS = [
  {
    label: 'Heritage Exhibition Grounds',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Artisanal Handlooms & Silks',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Vibrant Night Fair & Lights',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Indian Handicrafts & Craftsmen',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80'
  }
];

const PRESET_SPECIAL_DAYS: Omit<EventSpecialDay, 'id' | 'date'>[] = [
  {
    title: 'Ladies-Only Day (Khaas Janana Day)',
    badgeText: '🌸 Ladies Only',
    badgeColor: 'pink',
    startTime: '15:00',
    endTime: '22:30',
    description: 'Exclusive access reserved strictly for women, teenage girls, and boys aged 10 and below. Male visitors are strictly restricted across all gates.',
    isLadiesOnly: true,
    entryRules: 'Men strictly barred from grounds. Female police officers and volunteers manage all gates and ticket turnstiles.'
  },
  {
    title: 'Children & School Excursions Day',
    badgeText: '🎒 School Special',
    badgeColor: 'purple',
    startTime: '10:00',
    endTime: '15:00',
    description: 'Special early morning opening for school student batches in uniform accompanied by school faculty. Interactive science and cultural displays.',
    entryRules: 'Free entry for students in uniform with school ID card. Discounted amusement park ride passes.'
  },
  {
    title: 'Heritage Handloom & Weaver Celebration Day',
    badgeText: '✨ Weaves & Khadi',
    badgeColor: 'amber',
    startTime: '15:00',
    endTime: '22:30',
    description: 'Special platform honoring master handloom weavers with live pit-loom demonstrations and flat 15% cooperative discounts.',
    isDiscountDay: true,
    entryRules: 'Discount coupons distributed at Gate 1 & 2 information desks.'
  },
  {
    title: 'Sufi & Classical Cultural Musical Evening',
    badgeText: '🎶 Cultural Night',
    badgeColor: 'blue',
    startTime: '18:30',
    endTime: '22:30',
    description: 'Open air auditorium musical concert featuring traditional Ghazals, Sufi ensembles, and poetic symposium.',
    isFamilyOnly: true,
    entryRules: 'Open to all event ticket holders. Seating is first-come, first-served.'
  }
];

const AVAILABLE_AMENITIES = [
  '24/7 Primary Health Center & Critical ICU Ambulance',
  'Dedicated Police Station & CCTV Command Post',
  'Fire Safety Tenders & Emergency Exit Corridors',
  'Free High-Speed Wi-Fi Zone across Food Courts',
  'Complimentary Wheelchairs & Battery Buggy for Seniors',
  'ATM Kiosks & Instant UPI Payment Terminals',
  'Clean RO Drinking Water Kiosks every 50 meters',
  'Mothers Feeding Lounge & Lost-and-Found Booth',
  'EV Vehicle Charging Hub'
];

export const EventHostRegisterPage: React.FC = () => {
  const { addEvent, navigateTo, events, loginAsEventHost } = useApp();

  // Multi-step navigation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Form State
  const [hostOrgName, setHostOrgName] = useState('Exhibition Society Hyderabad');
  const [hostRegNumber, setHostRegNumber] = useState('SOC/HYD/1938/01');
  const [hostContactPerson, setHostContactPerson] = useState('Dr. B. Prabha Shankar');
  const [hostEmail, setHostEmail] = useState('contact@exhibitionsociety.org');
  const [hostPhone, setHostPhone] = useState('+91 98490 12345');
  const [hostAddress, setHostAddress] = useState('Exhibition Grounds, Mukarram Jahi Road, Nampally, Hyderabad');

  // Event Identity
  const [eventName, setEventName] = useState('Numaish All India Industrial Exhibition 2027');
  const [edition, setEdition] = useState('85th Edition');
  const [tagline, setTagline] = useState('Annual Heritage Industrial, Cultural & Artisan Fair');
  const [description, setDescription] = useState(
    'The historic annual exhibition organized since 1938. Spanning over 23 acres in Nampally, hosting over 2,500 stalls from every corner of India, authentic Hyderabadi cuisine, amusement rides, and artisan showcases.'
  );
  const [categoryFocus, setCategoryFocus] = useState<string[]>([
    'Handlooms',
    'Handicrafts',
    'Jewelry & Accessories',
    'Dry Fruits & Food Items',
    'Leather Goods & Footwear',
    'Amusement & Attractions'
  ]);
  const [bannerImage, setBannerImage] = useState(PRESET_BANNERS[0].url);
  const [logoImage, setLogoImage] = useState(
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'
  );

  // Venue & Location
  const [venueName, setVenueName] = useState('Numaish Exhibition Grounds');
  const [address, setAddress] = useState('Mukarram Jahi Road, Nampally');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('500001');
  const [nearestMetro, setNearestMetro] = useState('Gandhi Bhavan Metro Station (50m direct walkway to Gate 1)');
  const [nearestRailway, setNearestRailway] = useState('Hyderabad Deccan (Nampally) Railway Station (800m)');
  const [parkingCapacity, setParkingCapacity] = useState('2,500 Cars & 6,000 Two-Wheelers across Goshamahal Grounds');

  // Gates
  const [gates, setGates] = useState<EventGate[]>([
    { id: 'gate-1', name: 'Gate 1 (Gandhi Bhavan Gate)', description: 'Direct access to Metro, VIP Pavilion, Handlooms & Jewelry Sectors' },
    { id: 'gate-2', name: 'Gate 2 (Ajanta Gate)', description: 'Main Public Gateway with 16 automated turnstiles & Bus Stop access' },
    { id: 'gate-3', name: 'Gate 3 (Goshamahal Gate)', description: 'Direct access to Open Air Theater, Amusement Rides & Four-Wheeler Parking' },
    { id: 'gate-4', name: 'Gate 4 (Darussalam Gate)', description: 'Vendor logistics, inventory loading bay, and Food Court access' }
  ]);
  const [newGateName, setNewGateName] = useState('');
  const [newGateDesc, setNewGateDesc] = useState('');

  // Dates & Timings
  const [startDate, setStartDate] = useState('2027-01-01');
  const [endDate, setEndDate] = useState('2027-02-15');
  const [timingsWeekdays, setTimingsWeekdays] = useState('3:00 PM – 10:30 PM');
  const [timingsWeekends, setTimingsWeekends] = useState('3:00 PM – 11:00 PM');

  // Special Days
  const [specialDays, setSpecialDays] = useState<EventSpecialDay[]>([
    {
      id: 'sd-ladies-1',
      title: 'Ladies-Only Day (Khaas Janana Day)',
      date: '2027-01-09',
      startTime: '15:00',
      endTime: '22:30',
      badgeText: '🌸 Ladies Only',
      badgeColor: 'pink',
      description: 'Historic Numaish tradition reserving the entire 23-acre grounds exclusively for women and young children (boys aged 10 & below). Male visitors are strictly prohibited across all gates. Special female security and police personnel deployed throughout.',
      isLadiesOnly: true,
      entryRules: 'Men strictly barred from grounds. Female police officers and volunteers manage all gates and ticket turnstiles.'
    },
    {
      id: 'sd-children-1',
      title: 'Children & School Excursions Day',
      date: '2027-01-16',
      startTime: '10:00',
      endTime: '15:00',
      badgeText: '🎒 School Special',
      badgeColor: 'purple',
      description: 'Special early morning opening for school student batches in uniform accompanied by school faculty. Interactive science and cultural displays.',
      entryRules: 'Free entry for students in uniform with school ID card.'
    }
  ]);

  // Form for custom special day
  const [customSdTitle, setCustomSdTitle] = useState('');
  const [customSdDate, setCustomSdDate] = useState('2027-01-20');
  const [customSdBadge, setCustomSdBadge] = useState('🌸 Ladies Only');
  const [customSdDesc, setCustomSdDesc] = useState('');
  const [customSdRules, setCustomSdRules] = useState('');
  const [customSdIsLadiesOnly, setCustomSdIsLadiesOnly] = useState(false);
  const [customSdIsFamilyOnly, setCustomSdIsFamilyOnly] = useState(false);
  const [customSdIsDiscount, setCustomSdIsDiscount] = useState(false);
  const [showSpecialDayForm, setShowSpecialDayForm] = useState(false);

  // Stalls & Capacity
  const [totalStallCapacity, setTotalStallCapacity] = useState<number>(2500);
  const [sectors, setSectors] = useState<string[]>([
    'Handlooms Pavilion',
    'Jewelry & Pearls',
    'Food Court & Haleem',
    'Handicrafts & Art',
    'Leather & Mojaris',
    'Ready-Made Garments',
    'Home Furnishings',
    'Crockery & Utensils',
    'Amusement Park'
  ]);
  const [newSectorInput, setNewSectorInput] = useState('');
  const [vendorRentPerSqFt, setVendorRentPerSqFt] = useState('₹120 – ₹180 / sq. ft.');
  const [vendorApplicationDeadline, setVendorApplicationDeadline] = useState('2026-11-30');

  // Amenities & Tickets
  const [entryTicketPrice, setEntryTicketPrice] = useState<number>(40);
  const [ticketDescription, setTicketDescription] = useState('₹40 per adult. Free admission for children under 5 years.');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Primary Health Center & Critical ICU Ambulance',
    'Dedicated Police Station & CCTV Command Post',
    'Fire Safety Tenders & Emergency Exit Corridors',
    'Free High-Speed Wi-Fi Zone across Food Courts',
    'Complimentary Wheelchairs & Battery Buggy for Seniors',
    'Clean RO Drinking Water Kiosks every 50 meters',
    'Mothers Feeding Lounge & Lost-and-Found Booth'
  ]);

  // Submission Status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredEventId, setRegisteredEventId] = useState('');

  // Add Gate Handler
  const handleAddGate = () => {
    if (!newGateName.trim()) return;
    const newGate: EventGate = {
      id: `gate-${Date.now()}`,
      name: newGateName.trim(),
      description: newGateDesc.trim() || 'General Visitor Entry & Exit'
    };
    setGates((prev) => [...prev, newGate]);
    setNewGateName('');
    setNewGateDesc('');
  };

  const handleRemoveGate = (id: string) => {
    setGates((prev) => prev.filter((g) => g.id !== id));
  };

  // Add Preset Special Day
  const handleAddPresetSpecialDay = (preset: Omit<EventSpecialDay, 'id' | 'date'>) => {
    const newDay: EventSpecialDay = {
      ...preset,
      id: `sd-${Date.now()}`,
      date: startDate || '2027-01-10'
    };
    setSpecialDays((prev) => [...prev, newDay]);
  };

  // Add Custom Special Day
  const handleAddCustomSpecialDay = () => {
    if (!customSdTitle.trim()) return;
    const newDay: EventSpecialDay = {
      id: `sd-${Date.now()}`,
      title: customSdTitle.trim(),
      date: customSdDate || startDate,
      badgeText: customSdBadge || 'Special Day',
      badgeColor: customSdIsLadiesOnly ? 'pink' : customSdIsDiscount ? 'amber' : 'purple',
      description: customSdDesc.trim() || 'Special program on the exhibition grounds.',
      entryRules: customSdRules.trim() || undefined,
      isLadiesOnly: customSdIsLadiesOnly,
      isFamilyOnly: customSdIsFamilyOnly,
      isDiscountDay: customSdIsDiscount
    };
    setSpecialDays((prev) => [...prev, newDay]);
    setCustomSdTitle('');
    setCustomSdDesc('');
    setCustomSdRules('');
    setCustomSdIsLadiesOnly(false);
    setCustomSdIsFamilyOnly(false);
    setCustomSdIsDiscount(false);
    setShowSpecialDayForm(false);
  };

  const handleRemoveSpecialDay = (id: string) => {
    setSpecialDays((prev) => prev.filter((d) => d.id !== id));
  };

  // Add Sector
  const handleAddSector = () => {
    if (!newSectorInput.trim()) return;
    if (!sectors.includes(newSectorInput.trim())) {
      setSectors((prev) => [...prev, newSectorInput.trim()]);
    }
    setNewSectorInput('');
  };

  const handleRemoveSector = (sec: string) => {
    setSectors((prev) => prev.filter((s) => s !== sec));
  };

  // Toggle Amenity
  const handleToggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Calculate duration in days
  const calculateDays = () => {
    try {
      const d1 = new Date(startDate).getTime();
      const d2 = new Date(endDate).getTime();
      const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
      return diff > 0 ? diff : 1;
    } catch {
      return 46;
    }
  };

  // Handle Complete Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName.trim() || !venueName.trim() || !hostOrgName.trim()) {
      alert('Please fill out Event Name, Host Organization, and Venue.');
      return;
    }

    const slug = eventName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newId = `event-${slug}-${Date.now().toString().slice(-4)}`;

    const newEvent: BazaarEvent = {
      id: newId,
      slug,
      name: eventName.trim(),
      edition: edition.trim() || 'Annual Edition',
      tagline: tagline.trim(),
      description: description.trim(),
      categoryFocus,
      hostOrgName: hostOrgName.trim(),
      hostContactPerson: hostContactPerson.trim(),
      hostEmail: hostEmail.trim(),
      hostPhone: hostPhone.trim(),
      hostRegNumber: hostRegNumber.trim(),
      hostAddress: hostAddress.trim(),
      venueName: venueName.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      nearestMetro: nearestMetro.trim(),
      nearestRailway: nearestRailway.trim(),
      parkingCapacity: parkingCapacity.trim(),
      gates,
      startDate,
      endDate,
      timingsWeekdays,
      timingsWeekends,
      specialDays,
      totalStallCapacity: Number(totalStallCapacity) || 1000,
      sectors,
      vendorRentPerSqFt,
      vendorApplicationDeadline,
      entryTicketPrice: Number(entryTicketPrice) || 0,
      ticketDescription,
      amenities: selectedAmenities,
      bannerImage,
      logoImage,
      status: 'ongoing',
      createdAt: new Date().toISOString()
    };

    addEvent(newEvent);
    setRegisteredEventId(newId);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 py-12">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto shadow-inner">
              🎪
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Event Host Onboarded & Registered
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                {eventName}
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Hosted by <span className="font-bold text-slate-800">{hostOrgName}</span> ({hostRegNumber})
              </p>
            </div>

            {/* Quick Summary Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Venue</span>
                <span className="text-xs font-bold text-slate-900 truncate block">{venueName}</span>
                <span className="text-[10px] text-slate-500">{city}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Duration</span>
                <span className="text-xs font-bold text-slate-900 block">{calculateDays()} Days</span>
                <span className="text-[10px] text-slate-500">{startDate}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Special Days</span>
                <span className="text-xs font-bold text-pink-600 block">{specialDays.length} Themed Days</span>
                <span className="text-[10px] text-slate-500">Incl. Ladies Day</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Stall Capacity</span>
                <span className="text-xs font-bold text-slate-900 block">{totalStallCapacity} Stalls</span>
                <span className="text-[10px] text-slate-500">{sectors.length} Sectors</span>
              </div>
            </div>

            {/* Special Days Highlight List */}
            {specialDays.length > 0 && (
              <div className="bg-pink-50/60 border border-pink-200 rounded-2xl p-4 text-left space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-pink-900 flex items-center gap-1.5">
                  <span>🌸</span> Configured Special Days & Access Protocols ({specialDays.length})
                </h3>
                <div className="space-y-1.5">
                  {specialDays.map((sd) => (
                    <div key={sd.id} className="bg-white/80 rounded-xl p-2.5 border border-pink-100 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{sd.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-pink-100 text-pink-700">
                            {sd.badgeText}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{sd.description}</p>
                      </div>
                      <span className="text-xs font-extrabold text-pink-700 whitespace-nowrap bg-pink-50 px-2 py-1 rounded-lg">
                        {sd.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  loginAsEventHost(registeredEventId);
                  navigateTo({ name: 'admin' });
                }}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>🎪</span>
                <span>Sign In to Host Console Now</span>
              </button>
              <button
                onClick={() => navigateTo({ name: 'event-detail', eventId: registeredEventId })}
                className="px-4 py-3.5 rounded-xl border border-orange-300 bg-orange-50 text-xs font-bold text-orange-800 hover:bg-orange-100 transition"
              >
                View Public Event Page
              </button>
              <button
                onClick={() => navigateTo({ name: 'events' })}
                className="px-4 py-3.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                ← Events Directory
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-6 py-6 pb-24 md:pb-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateTo({ name: 'events' })}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Exhibitions
          </button>
          <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Host Portal • Onboard New Exhibition
          </span>
        </div>

        {/* Title Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-700 rounded-3xl text-white p-5 sm:p-7 shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md mb-2">
              <Building className="w-3.5 h-3.5 text-amber-200" />
              Event Host & Society Onboarding
            </span>
            <h1 className="text-xl sm:text-3xl font-black font-serif mb-2">
              Register Your Exhibition or Bazaar
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              Numaish is one of the premier exhibitions hosted on our platform. Onboard your society, exhibition grounds, dates, daily timings, and special themed days like <strong className="text-white">Ladies-Only Day (Khaas Janana Day)</strong> to allow vendors to apply and visitors to explore.
            </p>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {[
            { num: 1, label: 'Host Society' },
            { num: 2, label: 'Event Profile' },
            { num: 3, label: 'Venue & Gates' },
            { num: 4, label: 'Dates & Timings' },
            { num: 5, label: 'Special Days' },
            { num: 6, label: 'Stalls & Review' }
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`flex-1 min-w-[105px] py-2 px-2.5 rounded-xl text-center text-xs font-bold transition-all border ${
                currentStep === s.num
                  ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                  : currentStep > s.num
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider opacity-80">
                Step {s.num}
              </span>
              <span className="truncate block">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: HOST SOCIETY IDENTITY */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-5 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-serif flex items-center gap-2">
                  <Building className="w-5 h-5 text-orange-600" />
                  Host Society / Organizer Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Provide verified society or organizing committee details for legal compliance and vendor communication.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Organizing Society / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={hostOrgName}
                    onChange={(e) => setHostOrgName(e.target.value)}
                    placeholder="e.g. The Exhibition Society Hyderabad"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registration / Trust Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={hostRegNumber}
                    onChange={(e) => setHostRegNumber(e.target.value)}
                    placeholder="e.g. SOC/HYD/1938/01"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Authorized Representative / Secretary *
                  </label>
                  <input
                    type="text"
                    required
                    value={hostContactPerson}
                    onChange={(e) => setHostContactPerson(e.target.value)}
                    placeholder="e.g. Dr. B. Prabha Shankar (Hon. Secretary)"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    placeholder="secretary@exhibitionsociety.org"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Phone / Helpline *
                  </label>
                  <input
                    type="tel"
                    required
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    placeholder="+91 40 2460 3015"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Registered Office Address
                  </label>
                  <textarea
                    rows={2}
                    value={hostAddress}
                    onChange={(e) => setHostAddress(e.target.value)}
                    placeholder="Headquarters address of the organizing society"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  Next: Event Profile <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EVENT PROFILE & BRANDING */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-5 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-serif flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Exhibition Identity & Branding
                </h2>
                <p className="text-xs text-slate-500">
                  Define your exhibition title, edition, category focus, and promotional imagery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Numaish - 85th All India Industrial Exhibition 2027"
                    className="w-full text-xs sm:text-sm font-bold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Edition / Series
                  </label>
                  <input
                    type="text"
                    value={edition}
                    onChange={(e) => setEdition(e.target.value)}
                    placeholder="e.g. 85th Edition / Annual Spring Expo"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. The Heritage Shopping Carnival of Hyderabad"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Event Detailed Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the heritage, key highlights, and attractions of this exhibition..."
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Banner Presets */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Banner Photo (Select Preset or Provide URL)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_BANNERS.map((b, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setBannerImage(b.url)}
                        className={`relative rounded-xl overflow-hidden border-2 text-left h-20 transition ${
                          bannerImage === b.url ? 'border-orange-600 ring-2 ring-orange-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={b.url} alt={b.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-bold p-1 truncate">
                          {b.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    placeholder="Custom Banner URL..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  Next: Venue & Gates <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: VENUE, GATES & ACCESSIBILITY */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-5 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-serif flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-600" />
                  Venue Location & Entry Gates
                </h2>
                <p className="text-xs text-slate-500">
                  Provide precise ground location, public transport connectivity, and entry gates for visitor wayfinding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Exhibition Ground / Hall Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    placeholder="e.g. Numaish Exhibition Grounds"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Mukarram Jahi Road, Nampally"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Hyderabad"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Telangana"
                      className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="500001"
                      className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nearest Metro Station
                  </label>
                  <input
                    type="text"
                    value={nearestMetro}
                    onChange={(e) => setNearestMetro(e.target.value)}
                    placeholder="Gandhi Bhavan Metro Station (50m direct walkway to Gate 1)"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nearest Railway Station
                  </label>
                  <input
                    type="text"
                    value={nearestRailway}
                    onChange={(e) => setNearestRailway(e.target.value)}
                    placeholder="Nampally Railway Station (800m)"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Parking Capacity
                  </label>
                  <input
                    type="text"
                    value={parkingCapacity}
                    onChange={(e) => setParkingCapacity(e.target.value)}
                    placeholder="2,500 Cars & 6,000 Two-Wheelers in designated ground parking lots"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              {/* Dynamic Gates Manager */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🚪</span> Exhibition Entry & Exit Gates ({gates.length})
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {gates.map((g) => (
                    <div
                      key={g.id}
                      className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-start justify-between gap-2"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{g.name}</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">{g.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGate(g.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Gate Box */}
                <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-200/80 flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={newGateName}
                    onChange={(e) => setNewGateName(e.target.value)}
                    placeholder="Gate Name (e.g. Gate 5 - Charminar Side)"
                    className="flex-1 w-full text-xs p-2.5 rounded-xl border border-orange-200 bg-white"
                  />
                  <input
                    type="text"
                    value={newGateDesc}
                    onChange={(e) => setNewGateDesc(e.target.value)}
                    placeholder="Access details (e.g. Metro walkway, VIP entry)"
                    className="flex-1 w-full text-xs p-2.5 rounded-xl border border-orange-200 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGate}
                    className="w-full sm:w-auto bg-orange-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 shrink-0 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Gate
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  Next: Dates & Timings <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DATES & DAILY TIMINGS */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-5 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-serif flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Exhibition Calendar & Daily Timings
                </h2>
                <p className="text-xs text-slate-500">
                  Set the start and end dates and general visitor timings for weekdays and weekends.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    Calculated Exhibition Duration:
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full text-amber-800 shadow-sm font-black">
                    {calculateDays()} Days of Live Exhibition
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Weekday Daily Timings (Mon - Fri) *
                  </label>
                  <input
                    type="text"
                    required
                    value={timingsWeekdays}
                    onChange={(e) => setTimingsWeekdays(e.target.value)}
                    placeholder="e.g. 3:00 PM – 10:30 PM"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Weekend & Holiday Timings (Sat - Sun) *
                  </label>
                  <input
                    type="text"
                    required
                    value={timingsWeekends}
                    onChange={(e) => setTimingsWeekends(e.target.value)}
                    placeholder="e.g. 3:00 PM – 11:00 PM"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  Next: Special Themed Days <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SPECIAL DAYS & EVENT-SPECIFIC DAYS (CORE USER REQUIREMENT) */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-5 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 font-serif flex items-center gap-2">
                      <span className="text-xl">🌸</span>
                      Special Days & Event-Specific Days
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure custom themed days such as <strong className="text-pink-600">Ladies-Only Day (Khaas Janana Day)</strong>, Children excursions, and artisan discount days with explicit entry rules.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Add Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Quick-Add Standard Indian Exhibition Presets:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_SPECIAL_DAYS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddPresetSpecialDay(p)}
                      className="text-left bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200 p-3 rounded-2xl transition flex items-center justify-between gap-2 group"
                    >
                      <div>
                        <p className="text-xs font-black text-slate-900 group-hover:text-pink-800">
                          + {p.title}
                        </p>
                        <p className="text-[10px] text-slate-600 line-clamp-1">{p.description}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-pink-700 shadow-sm shrink-0">
                        {p.badgeText}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Currently Added Special Days List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Configured Special Days ({specialDays.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSpecialDayForm(!showSpecialDayForm)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {showSpecialDayForm ? 'Cancel Custom Day' : 'Add Custom Special Day'}
                  </button>
                </div>

                {specialDays.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                    No special days configured yet. Click one of the quick presets above (e.g. Ladies-Only Day) or add a custom one.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {specialDays.map((sd) => (
                      <div
                        key={sd.id}
                        className={`rounded-2xl p-4 border transition ${
                          sd.isLadiesOnly
                            ? 'bg-pink-50/80 border-pink-200'
                            : sd.isDiscountDay
                            ? 'bg-amber-50/80 border-amber-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 font-serif">
                                {sd.title}
                              </h4>
                              <span
                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm ${
                                  sd.isLadiesOnly
                                    ? 'bg-pink-600 text-white'
                                    : sd.isDiscountDay
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-purple-600 text-white'
                                }`}
                              >
                                {sd.badgeText}
                              </span>
                              <span className="text-[11px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                                🗓️ {sd.date}
                              </span>
                              {sd.startTime && sd.endTime && (
                                <span className="text-[11px] font-semibold text-slate-500">
                                  ⏰ {sd.startTime} – {sd.endTime}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">{sd.description}</p>
                            {sd.entryRules && (
                              <div className="mt-2 text-[11px] font-semibold bg-white/90 p-2 rounded-xl border border-pink-200/80 text-rose-800 flex items-start gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                                <span>Entry Protocol: {sd.entryRules}</span>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecialDay(sd.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Special Day Form */}
              {showSpecialDayForm && (
                <div className="bg-slate-100/90 rounded-2xl p-4 border border-slate-300 space-y-3 animate-fadeIn">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Create Custom Special Day
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={customSdTitle}
                        onChange={(e) => setCustomSdTitle(e.target.value)}
                        placeholder="e.g. Senior Citizens & Veteran Day"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={customSdDate}
                        onChange={(e) => setCustomSdDate(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={customSdBadge}
                        onChange={(e) => setCustomSdBadge(e.target.value)}
                        placeholder="e.g. Special Privilege"
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSdIsLadiesOnly}
                          onChange={(e) => setCustomSdIsLadiesOnly(e.target.checked)}
                          className="rounded text-pink-600 focus:ring-pink-500"
                        />
                        Ladies Only Event
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSdIsDiscount}
                          onChange={(e) => setCustomSdIsDiscount(e.target.checked)}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        Special Discounts
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Description & Program Details
                      </label>
                      <textarea
                        rows={2}
                        value={customSdDesc}
                        onChange={(e) => setCustomSdDesc(e.target.value)}
                        placeholder="Explain what activities, discounts, or special entry restrictions apply..."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Security & Entry Protocol
                      </label>
                      <input
                        type="text"
                        value={customSdRules}
                        onChange={(e) => setCustomSdRules(e.target.value)}
                        placeholder="e.g. Photo ID required at Gate 1 & 2 turnstiles."
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSpecialDayForm(false)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomSpecialDay}
                      className="bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm"
                    >
                      Save Special Day
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  Next: Stalls & Amenities <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: STALLS, AMENITIES & FINAL SUBMISSION */}
          {currentStep === 6 && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-black text-slate-900 font-serif flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Stall Capacity, Facilities & Launch
                </h2>
                <p className="text-xs text-slate-500">
                  Specify total stall slots for vendors, application deadlines, ticketing, and emergency amenities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Total Exhibition Stall Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={totalStallCapacity}
                    onChange={(e) => setTotalStallCapacity(Number(e.target.value))}
                    placeholder="2500"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Vendor Application Deadline *
                  </label>
                  <input
                    type="date"
                    required
                    value={vendorApplicationDeadline}
                    onChange={(e) => setVendorApplicationDeadline(e.target.value)}
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Vendor Rent Structure
                  </label>
                  <input
                    type="text"
                    value={vendorRentPerSqFt}
                    onChange={(e) => setVendorRentPerSqFt(e.target.value)}
                    placeholder="₹120 – ₹180 / sq. ft."
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Visitor Entry Ticket Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={entryTicketPrice}
                    onChange={(e) => setEntryTicketPrice(Number(e.target.value))}
                    placeholder="40"
                    className="w-full text-xs sm:text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Enter 0 for free general public entry.
                  </span>
                </div>
              </div>

              {/* Sectors Builder */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Exhibition Sectors / Pavilions ({sectors.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {sectors.map((sec) => (
                    <span
                      key={sec}
                      className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-900 border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold"
                    >
                      {sec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSector(sec)}
                        className="text-orange-500 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-sm pt-1">
                  <input
                    type="text"
                    value={newSectorInput}
                    onChange={(e) => setNewSectorInput(e.target.value)}
                    placeholder="Add Sector (e.g. Electronics)"
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddSector}
                    className="bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Public Amenities Checkbox Grid */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Public Amenities & Safety Measures (Select All Available)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_AMENITIES.map((item) => (
                    <label
                      key={item}
                      onClick={() => handleToggleAmenity(item)}
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition text-xs font-medium ${
                        selectedAmenities.includes(item)
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(item)}
                        onChange={() => {}}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Final Review Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      Ready to Publish
                    </span>
                    <h3 className="text-base font-bold font-serif text-white">{eventName}</h3>
                  </div>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">
                    {calculateDays()} Days
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 border-t border-white/10 pt-3">
                  <div>
                    <span className="text-slate-500 block">Host Society:</span>
                    <strong className="text-white truncate block">{hostOrgName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Venue:</span>
                    <strong className="text-white truncate block">{venueName}, {city}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Special Days:</span>
                    <strong className="text-pink-400 block">{specialDays.length} Themed Days</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 text-white font-bold text-xs py-3 px-8 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Publish & Onboard Exhibition
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};