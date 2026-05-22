export const business = {
  name: "Dani's beauty style",
  ownerFirstName: 'Daniëlle',
  ownerShortName: 'Dani',
  address: {
    street: 'Scheldestraat 39',
    postal: '1823 WD',
    city: 'Alkmaar',
    country: 'NL',
    lat: 52.6302593,
    lng: 4.7655734,
  },
  phone: {
    display: '06 33 97 92 70',
    href: 'tel:+31633979270',
    wa: 'https://wa.me/31633979270',
    waMessage: (msg: string) => `https://wa.me/31633979270?text=${encodeURIComponent(msg)}`,
  },
  email: null,
  instagram: 'https://www.instagram.com/danisbeautystyle/',
  facebook: 'https://www.facebook.com/Danisbeautystyle.dt/',
  google: 'https://www.google.com/maps/search/?api=1&query=Dani%C2%B4s%20beauty%20style&query_place_id=ChIJ9VXNPm9Xz0cRmbm8UaLW-Qk',
  googlePlaceId: 'ChIJ9VXNPm9Xz0cRmbm8UaLW-Qk',
  googleReviewsScore: 5.0,
  googleReviewsCount: 5,
};

// Opening hours from Google Maps (NL)
// Day index: 0 = Monday … 6 = Sunday
export const openingHours: Array<{ dayKey: string; openText: string; closed: boolean }> = [
  { dayKey: 'visit.day.mon', openText: '09:00 – 13:30', closed: false },
  { dayKey: 'visit.day.tue', openText: '09:00 – 13:30', closed: false },
  { dayKey: 'visit.day.wed', openText: '09:00 – 13:30', closed: false },
  { dayKey: 'visit.day.thu', openText: '09:00 – 16:00', closed: false },
  { dayKey: 'visit.day.fri', openText: '',              closed: true  },
  { dayKey: 'visit.day.sat', openText: '10:00 – 14:00', closed: false },
  { dayKey: 'visit.day.sun', openText: '',              closed: true  },
];

// JSON-LD opening hours specification
export const openingHoursSchema = [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '13:30' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '09:00', closes: '13:30' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '09:00', closes: '13:30' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '09:00', closes: '16:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' },
];
