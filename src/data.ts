import amaraImg from './amara1.png'
import kanakImg from './kanak1.png'
import tuscanyImg from './tuscany1.png'
import ninetySixImg from './96a.png'
import placeCharminar from './assets/place-charminar.jpg'
import placeMecca from './assets/place-mecca.jpg'
import placeLaad from './assets/place-laad.jpg'
import placeChowmahalla from './assets/place-chowmahalla.jpg'
import placeSalar from './assets/place-salar.jpg'
import placeGolconda from './assets/place-golconda.jpg'
import placeQutb from './assets/place-qutb.jpg'
import placePaigah from './assets/place-paigah.jpg'
import placeBirla from './assets/place-birla.png'
import placeHitec from './assets/place-hitec.jpg'
import placeJubilee from './assets/place-jubilee.jpg'
import placeBanjara from './assets/place-banjara.jpg'
import placeBiryani from './assets/place-biryani.jpg'
import placeChai from './assets/place-chai.jpg'
import placeHaleem from './assets/place-haleem.jpg'
import placeShilparamam from './assets/place-shilparamam.jpg'
import placeNecklace from './assets/place-necklace.jpg'
import placeRamoji from './assets/place-ramoji.jpg'
import placeZoo from './assets/place-zoo.jpg'
import tevarImg from './assets/tevar.png'
import burmaburmaImg from './assets/burmaburma.png'
import tansenImg from './assets/Tansen.png'
import monasteryImg from './assets/monastery.png'
import babylonImg from './assets/babylon.png'
import airliveImg from './assets/airlive.png'
import placeHitecCity from './assets/place-hitec.jpg'
import placeFood from './assets/place-biryani.jpg'
import type {
  CityEvent,
  CityPlace,
  CmsState,
  ConciergePick,
  GuestPrefs,
  HotelService,
  MenuLine,
  Special,
  Venue,
  VenueSlug,
} from './types'

export const venues: Venue[] = [
  {
    slug: 'amara',
    name: 'Amara',
    kicker: 'All-day dining',
    tagline: 'Regional Hyderabadi · Far East · Mediterranean',
    hours: '7:00 a.m. – 11:00 p.m.',
    openFrom: 7,
    openTo: 23,
    description:
      'The hotel’s main restaurant — ‘unfading’ in Sanskrit, and true to its name. A copper-decorated show kitchen turns out regional Hyderabadi dishes alongside flavours of the Far East and the Mediterranean, served as an extensive buffet or à la carte. Equally at home with a business lunch or a leisurely family dinner.',
    quote: 'Start slow. Stay a little longer.',
    image: amaraImg,
    moods: ['light', 'breakfast', 'steak', 'sweet'],
    cuisine: ['Continental', 'Asian', 'Indian'],
    floor: 'Lobby level',
    reservation: true,
  },
  {
    slug: 'kanak',
    name: 'Kanak',
    kicker: 'The flavours of the Nizams',
    tagline: 'Indian specialties · Coastal seafood · Wine Cabinet',
    hours: '12:30 p.m. – 3:00 p.m. / 7:00 p.m. – 11:00 p.m.',
    openFrom: 12.5,
    openTo: 23,
    description:
      'Authentic Indian cuisine, and a menu that journeys across the subcontinent — delicacies of the northwestern frontiers, local Hyderabadi recipes, and coastal offerings shipped fresh from the Bay of Bengal each morning. Everything pairs with wines from the Wine Cabinet, and two semi-private dining rooms make it easy to gather a party.',
    quote: 'The city, on a plate.',
    image: kanakImg,
    moods: ['spicy', 'indian'],
    cuisine: ['Hyderabadi', 'Indian'],
    floor: 'Lobby level',
    reservation: true,
  },
  {
    slug: 'tuscany',
    name: 'Tuscany',
    kicker: 'A taste of Italy',
    tagline: 'Italian cuisine · Enoteca wine library',
    hours: '7:00 p.m. – 11:00 p.m.',
    openFrom: 19,
    openTo: 23,
    description:
      'Traditional Italian flavours served with warmth, in interiors of red terracotta tiles and hand-painted murals reminiscent of a Tuscan villa. Authentic ingredients imported from Italy bring the Mediterranean to your plate, while wines from Enoteca, the house wine library, complete the journey.',
    quote: 'Come for dinner. Stay for the last glass.',
    image: tuscanyImg,
    moods: ['italian', 'steak', 'light'],
    cuisine: ['Italian'],
    floor: 'Lobby level',
    reservation: true,
  },
  {
    slug: 'ninety-six',
    name: 'Ninety Six',
    kicker: 'After dark',
    tagline: 'Cocktails · Single malts · Wines',
    hours: '12:00 p.m. – 4:00 a.m.',
    openFrom: 12,
    openTo: 4,
    overnight: true,
    description:
      'The perfect place to kick-start an evening, carry it late with friends, or wind down after a full day. An extensive selection of aperitifs and wines, bartenders who will mix something innovative to suit your mood — classic and speakeasy cocktails, house specials, single malts, American whiskies, mocktails, cold coffees and speciality teas.',
    quote: 'The night does not end at eleven.',
    image: ninetySixImg,
    moods: ['cocktail', 'nightcap', 'coffee'],
    cuisine: ['Bar'],
    floor: 'Lobby level',
    // Ninety Six is a walk-in bar - no table reservations are taken.
    reservation: false,
    walkIn: true,
  },
  {
    slug: 'in-room',
    name: 'In-Room Dining',
    kicker: 'Whenever you wish',
    tagline: 'The kitchen, at your door',
    hours: '24 hours',
    openFrom: 0,
    openTo: 24,
    overnight: true,
    description:
      'Breakfast in bed, a quiet supper after a late landing, or chai at an hour that belongs only to you. In-room dining follows the same kitchens as the restaurants below.',
    quote: 'Your table is already set.',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1600&q=80',
    moods: ['breakfast', 'light', 'sweet', 'coffee'],
    cuisine: ['All-day'],
    floor: 'Your suite',
    reservation: false,
  },
]

export const nearbyVenues = [
  {
    slug: 'tevar',
    name: 'Tevar',
    kicker: 'Walking distance',
    tagline: 'Multi-cuisine · Casual dining',
    hours: '11:00 a.m. – 11:00 p.m.',
    description:
      'The closest dining option to Trident, located in Salarpuria Sattva Knowledge City, Madhapur. A relaxed multi-cuisine restaurant ideal for a quick, convenient meal without venturing far from the hotel.',
    image: tevarImg,
    area: 'Madhapur',
    note: 'Strongly recommended to book ahead, especially on weekends.',
    zomatoUrl: 'https://www.zomato.com/hyderabad/tevar-the-progressive-indian-kitchen-bar-hitech-city',
  },
  {
    slug: 'burma-burma',
    name: 'Burma Burma',
    kicker: 'Walking distance',
    tagline: 'Burmese cuisine · Vegetarian-friendly',
    hours: '12:00 p.m. – 10:30 p.m.',
    description:
      'Also in Salarpuria Sattva Knowledge City, Madhapur — just a few minutes from the hotel. Renowned for authentic Burmese flavours with a strong vegetarian selection. A quiet, relaxed atmosphere makes it great for a peaceful dinner.',
    image: burmaburmaImg,
    area: 'Madhapur',
    note: 'Strongly recommended to book ahead, especially on weekends.',
    zomatoUrl: 'https://www.zomato.com/hyderabad/burma-burma-hitech-city-hitech-city',
  },
  {
    slug: 'tansen',
    name: 'Tansen',
    kicker: 'Special occasion',
    tagline: 'Indian fine dining · Royal ambience · Live music',
    hours: '12:00 p.m. – 3:00 p.m. / 7:00 p.m. – 11:00 p.m.',
    description:
      'A standout destination for special-occasion Indian fine dining in the Financial District, Nanakramguda. Royal ambience, live classical music, and consistently highly-rated cuisine make it perfect for memorable evenings.',
    image: tansenImg,
    area: 'Nanakramguda',
    note: 'Advance reservations strongly recommended, especially on weekends.',
    zomatoUrl: 'https://www.zomato.com/hyderabad/tansen-2-nanakramguda',
  },
  {
    slug: 'monastery',
    name: 'Monastery',
    kicker: 'Cocktail-forward',
    tagline: 'Pan-Asian · Continental · Lively bar',
    hours: '12:00 p.m. – 11:00 p.m.',
    description:
      'Well-suited for guests wanting a livelier evening with a cocktail-forward experience. Pan-Asian and continental cuisine served alongside an extensive drinks menu in an energetic atmosphere.',
    image: monasteryImg,
    area: 'Banjara Hills',
    note: 'Can get busy later in the evening; advance reservations recommended.',
    zomatoUrl: 'https://www.zomato.com/hyderabad/monastery-hitech-city',
  },
  {
    slug: 'babylon',
    name: 'Babylon Kitchen & Bar',
    kicker: 'Jubilee Hills',
    tagline: 'Premium dining · Nightlife · Lively crowd',
    hours: '12:00 p.m. – 11:30 p.m.',
    description:
      'Located in Jubilee Hills, Babylon offers premium dining with a side of nightlife energy. Better suited to guests looking for a scene rather than a quiet meal — the atmosphere becomes more club-like as the evening progresses.',
    image: babylonImg,
    area: 'Jubilee Hills',
    note: 'Gets loud and club-like later in the evening. Reservations recommended.',
    zomatoUrl: 'https://www.zomato.com/hyderabad/babylon-bar-and-kitchen-jubilee-hills',
  },
  {
    slug: 'air-live',
    name: 'Air Live',
    kicker: 'Jubilee Hills',
    tagline: 'Premium venue · Rooftop · Nightlife',
    hours: '12:00 p.m. – 11:00 p.m.',
    description:
      'A premium venue in Jubilee Hills with a rooftop setting, popular with the city\'s well-heeled crowd. Offers a more upscale nightlife experience — better for guests seeking a scene than a quiet dinner.',
    image: airliveImg,
    area: 'Jubilee Hills',
    note: 'Gets loud and energetic later in the evening. Reservations recommended.',
    zomatoUrl: 'https://www.zomato.com/hyderabad/air-live-jubilee-hills',
  },
]

export const menuSnippets: Record<VenueSlug, MenuLine[]> = {
  kanak: [
    { name: 'Haleem', note: 'Slow-cooked, while it lasts' },
    { name: 'Hyderabadi dum biryani', note: 'Saffron, patience' },
    { name: 'Nizami kebabs', note: 'From the tandoor' },
    { name: 'Qubani ka meetha', note: 'Apricots, cream' },
  ],
  tuscany: [
    { name: 'Burrata', note: 'Olive oil, sea salt' },
    { name: 'Handmade pappardelle', note: 'The kitchen’s pride' },
    { name: 'Branzino', note: 'Simply grilled' },
    { name: 'Tiramisu', note: 'To finish' },
  ],
  amara: [
    { name: 'Breakfast, unhurried', note: 'From 7:00 a.m.' },
    { name: 'Catch of the day', note: 'Ask the captain' },
    { name: 'A proper steak', note: 'Lunch or dinner' },
    { name: 'Something light', note: 'Salads, broths' },
  ],
  'ninety-six': [
    { name: 'House signature', note: 'Ask the bartender' },
    { name: 'Old fashioned', note: 'Stirred, not hurried' },
    { name: 'A glass of wine', note: 'The short list' },
    { name: 'Bar snacks', note: 'Enough to stay' },
  ],
  'in-room': [
    { name: 'Breakfast in bed', note: 'Whenever you ring' },
    { name: 'Club sandwich', note: 'The classic' },
    { name: 'A pot of chai', note: 'Any hour' },
    { name: 'A last whisky', note: 'Sent upstairs' },
  ],
}

export const services: HotelService[] = [
  {
    slug: 'rooms',
    prompt: 'Looking for a quieter room?',
    detail:
      '323 rooms and suites: Deluxe, Premier, Trident Club, Executive Suites, Premier Suites, Trident Club Suites, and the Presidential Suite. City or park views, depending on how you like to wake.',
    location: 'Throughout the house',
    hours: 'Always',
    cta: 'See rooms & suites →',
  },
  {
    slug: 'club',
    prompt: 'Travelling on business?',
    detail:
      'Trident Club includes express check-in, a dedicated Club Reception, and the Club Lounge for guests aged 21 and above.',
    location: 'Club Lounge',
    hours: 'Lounge hours posted at reception',
    cta: 'Ask about Club access →',
  },
  {
    slug: 'check-in',
    prompt: 'Need an early arrival?',
    detail:
      'Standard check-in is at 2:00 p.m.; check-out at noon. We will try to have your room ready earlier whenever the house allows.',
    location: 'Lobby',
    hours: '24 hours',
    cta: 'Request early check-in →',
  },
  {
    slug: 'housekeeping',
    prompt: 'Would you like the room turned down?',
    detail:
      'Housekeeping, extra linen, a quieter hour, or a later service — tell us how you keep the room.',
    location: 'Your room',
    hours: '24 hours',
    cta: 'Request housekeeping →',
  },
  {
    slug: 'laundry',
    prompt: 'Clothes for tomorrow?',
    detail: 'Express and overnight laundry and pressing. Leave the bag on the handle; we will take care of the rest.',
    location: 'Collected from your room',
    hours: 'Collection until 9:00 a.m. for same-day',
    cta: 'Arrange laundry →',
  },
  {
    slug: 'wifi',
    prompt: 'Need the network?',
    detail: 'Complimentary high-speed Wi-Fi throughout the hotel, including rooms, restaurants and the business centre.',
    location: 'Everywhere',
    hours: 'Always',
    cta: 'View connection details →',
  },
  {
    slug: 'transport',
    prompt: 'Going somewhere?',
    detail:
      'Airport transfers, a car for the evening, or a driver who knows the old city after dark. HITEC City is at the door; the airport is about 40 minutes, traffic permitting.',
    location: 'Lobby porte-cochère',
    hours: '24 hours',
    cta: 'Arrange a car →',
  },
  {
    slug: 'concierge',
    prompt: 'Shall we plan the evening?',
    detail:
      'Reservations, tickets, flowers, a table in the old city, or a quiet hour by the pool. The concierge is the shortest path between a wish and an arrangement.',
    location: 'Lobby',
    hours: '24 hours',
    cta: 'Ask the concierge →',
  },
  {
    slug: 'fitness',
    prompt: 'Want to work out?',
    detail: 'Your fitness centre is on the 10th floor — 24 hours, reserved for resident guests.',
    location: '10th floor',
    hours: 'Open 24 hours',
    cta: 'Open now →',
  },
  {
    slug: 'pool',
    prompt: 'In the mood for water and sky?',
    detail:
      'A temperature-controlled infinity pool on the 10th floor, with the city laid out beneath you. Resident guests only.',
    location: '10th floor',
    hours: '6:00 a.m. – 10:00 p.m.',
    cta: 'See pool hours →',
  },
  {
    slug: 'spa',
    prompt: 'Need an hour back?',
    detail:
      'Trident Spa offers Ayurvedic and Western-inspired therapies, with city views. For resident guests aged 16 and over.',
    location: 'Spa, 10th floor',
    hours: 'By appointment',
    cta: 'Reserve a treatment →',
  },
  {
    slug: 'business',
    prompt: 'A meeting after the meeting?',
    detail: 'Eight meeting rooms and a 24-hour business centre in the heart of HITEC City.',
    location: 'Conference floor',
    hours: 'Business centre: 24 hours',
    cta: 'Book a room →',
  },
  {
    slug: 'emergency',
    prompt: 'Need help immediately?',
    detail:
      'Dial 0 from your room for the operator. For medical assistance, security, or any urgent matter, the desk will stay with you until it is resolved.',
    location: 'Operator · Lobby',
    hours: '24 hours',
    cta: 'Call the operator →',
  },
]

export const places: CityPlace[] = [
  {
    id: 'charminar',
    name: 'Charminar',
    area: 'The Old City',
    category: 'old-city',
    minutes: 45,
    why: 'The city\'s compass. Go at blue hour, when the limestone still holds the day\'s heat.',
    atmosphere: 'local',
    image: placeCharminar,
    directions:
      'About 45 minutes by car via the PVNR Elevated Expressway. Ask the concierge for a car after 5 p.m., when the old city comes alive.',
    mapQuery: 'Charminar, Hyderabad',
  },
  {
    id: 'mecca',
    name: 'Mecca Masjid',
    area: 'The Old City',
    category: 'old-city',
    minutes: 45,
    why: 'One of India\'s largest mosques, four centuries old, with granite arches and bricks said to hold Meccan soil.',
    atmosphere: 'local',
    image: placeMecca,
    directions:
      'Right beside Charminar — the same 45-minute drive. Combine the two in one evening; modest dress required.',
    mapQuery: 'Mecca Masjid, Hyderabad',
  },
  {
    id: 'laad',
    name: 'Laad Bazaar',
    area: 'The Old City',
    category: 'old-city',
    minutes: 45,
    why: 'Bangles, pearls and the particular noise of a market that has never hurried for anyone.',
    atmosphere: 'local',
    image: placeLaad,
    directions:
      'The lane runs beside Charminar — same 45-minute drive. Best at dusk, when the bangle stalls are lit.',
    mapQuery: 'Laad Bazaar, Hyderabad',
  },
  {
    id: 'chowmahalla',
    name: 'Chowmahalla Palace',
    area: 'The Old City',
    category: 'old-city',
    minutes: 50,
    why: 'The Nizams\' ceremonial palaces — courtyards, chandeliers, and a quieter kind of grandeur.',
    atmosphere: 'elegant',
    image: placeChowmahalla,
    directions:
      '45 minutes by car; a five-minute walk from Charminar once you are there. Closed on Fridays.',
    mapQuery: 'Chowmahalla Palace, Hyderabad',
  },
  {
    id: 'salar',
    name: 'Salar Jung Museum',
    area: 'Art & Culture',
    category: 'art',
    minutes: 40,
    why: 'One collector\'s impossible appetite — ivory, clocks, manuscripts, and a famous veiled Rebecca.',
    atmosphere: 'elegant',
    image: placeSalar,
    directions:
      'About 40 minutes by car across the Musi river. Closed on Fridays; go mid-morning before the school groups.',
    mapQuery: 'Salar Jung Museum, Hyderabad',
  },
  {
    id: 'golconda',
    name: 'Golconda Fort',
    area: 'Art & Culture',
    category: 'art',
    minutes: 40,
    why: 'Acoustic architecture and a hill that still commands the Deccan. Go before the heat rises.',
    atmosphere: 'local',
    image: placeGolconda,
    directions:
      '40 minutes by car via Mehdipatnam. Start the climb by 8 a.m.; the light-and-sound show runs most evenings.',
    mapQuery: 'Golconda Fort, Hyderabad',
  },
  {
    id: 'qutb',
    name: 'Qutb Shahi Tombs',
    area: 'Art & Culture',
    category: 'art',
    minutes: 35,
    why: 'The dynasty buried itself beautifully — domed tombs in a garden at the foot of Golconda.',
    atmosphere: 'elegant',
    image: placeQutb,
    directions:
      'Just below Golconda Fort — the same 40-minute drive. Quiet even on weekends; pair it with the fort.',
    mapQuery: 'Qutb Shahi Tombs, Hyderabad',
  },
  {
    id: 'paigah',
    name: 'Paigah Tombs',
    area: 'Art & Culture',
    category: 'art',
    minutes: 30,
    why: 'Nobility at rest — latticework so fine the tombs seem embroidered rather than built.',
    atmosphere: 'elegant',
    image: placePaigah,
    directions:
      '30 minutes by car, off the old city road near Charminar. Often you will have the complex to yourself.',
    mapQuery: 'Paigah Tombs, Hyderabad',
  },
  {
    id: 'birla',
    name: 'Birla Mandir',
    area: 'Art & Culture',
    category: 'art',
    minutes: 25,
    why: 'A marble temple on a hill above the lake — the city\'s calmest view at sunset.',
    atmosphere: 'elegant',
    image: placeBirla,
    directions:
      '25 minutes by car towards Khairatabad. Climb the steps an hour before sunset; phones are not allowed inside.',
    mapQuery: 'Birla Mandir, Hyderabad',
  },
  {
    id: 'hitec',
    name: 'HITEC City',
    area: 'HITEC City',
    category: 'modern',
    minutes: 5,
    why: 'You are already here. Glass, gardens, and the city\'s newer appetite for late dinners.',
    atmosphere: 'lively',
    image: placeHitec,
    directions:
      'A five-minute walk from the lobby into the Cyber Towers grid. Shilpa Layout for after-work evenings.',
    mapQuery: 'HITEC City, Hyderabad',
  },
  {
    id: 'swachh',
    name: 'Swachh',
    area: 'HITEC City',
    category: 'modern',
    minutes: 8,
    why: 'A popular casual dining spot in HITEC City — good for a relaxed meal without venturing far from the hotel.',
    atmosphere: 'lively',
    image: placeHitecCity,
    directions:
      'About 8 minutes by car from the hotel in the HITEC City area. Ask the concierge for directions.',
    mapQuery: 'Swachh restaurant HITEC City Hyderabad',
  },
  {
    id: 'taaza',
    name: 'Taaza Kitchen',
    area: 'HITEC City',
    category: 'modern',
    minutes: 10,
    why: 'A reliable multi-cuisine option in the HITEC City neighbourhood with a comfortable setting for business or leisure.',
    atmosphere: 'lively',
    image: placeHitecCity,
    directions:
      'About 10 minutes by car from the hotel. Located in the commercial district near Cyber Towers.',
    mapQuery: 'Taaza Kitchen HITEC City Hyderabad',
  },
  {
    id: 'rameshwaram',
    name: 'Rameshwaram Cafe',
    area: 'HITEC City',
    category: 'modern',
    minutes: 12,
    why: 'South Indian favourites done well — a favourite among locals and visitors for authentic flavours without the fuss.',
    atmosphere: 'local',
    image: placeHitecCity,
    directions:
      'About 12 minutes by car from the hotel. A popular spot that can get busy during peak hours.',
    mapQuery: 'Rameshwaram Cafe HITEC City Hyderabad',
  },
  {
    id: 'jubilee',
    name: 'Jubilee Hills',
    area: 'Jubilee Hills',
    category: 'nightlife',
    minutes: 20,
    why: 'Hyderabad\'s preferred evening — restaurants that stay open, rooms that know how to light a table.',
    atmosphere: 'elegant',
    image: placeJubilee,
    directions:
      '20 minutes by car past KBR National Park. The tables you want cluster around Road No. 36 and 45.',
    mapQuery: 'Jubilee Hills, Hyderabad',
  },
  {
    id: 'banjara',
    name: 'Banjara Hills',
    area: 'Banjara Hills',
    category: 'nightlife',
    minutes: 22,
    why: 'Bars, galleries and long dinners. The city\'s social map still runs through these streets.',
    atmosphere: 'lively',
    image: placeBanjara,
    directions:
      '22 minutes by car through Jubilee Hills. Road Nos. 1 to 12 hold most of the rooms worth booking.',
    mapQuery: 'Banjara Hills, Hyderabad',
  },
  {
    id: 'biryani',
    name: 'A proper Hyderabadi biryani',
    area: 'Food',
    category: 'food',
    minutes: 25,
    why: 'We will not send you to a tourist queue. Ask the concierge for tonight\'s house recommendation — dum, saffron, and patience.',
    atmosphere: 'local',
    image: placeBiryani,
    directions:
      'Our current favourite sits about 25 minutes away by car. Tell the desk your tolerance for chilli; we will call ahead.',
    mapQuery: 'best biryani restaurant near HITEC City, Hyderabad',
  },
  {
    id: 'chai',
    name: 'Irani chai & Osmania biscuits',
    area: 'Food',
    category: 'food',
    minutes: 15,
    why: 'The city\'s unofficial breakfast. Strong tea, sweet biscuits, newspapers, and no performance.',
    atmosphere: 'local',
    image: placeChai,
    directions:
      'Café Niloufer is the house recommendation — about 15 minutes by car towards Raidurg, famous for its bun maska and Irani chai. For the old-city ritual, Nimrah Café beside Charminar pours with a view.',
    mapQuery: 'Cafe Niloufer, Hyderabad',
  },
  {
    id: 'haleem',
    name: 'Hyderabadi haleem',
    area: 'Food',
    category: 'food',
    minutes: 40,
    why: 'Slow-cooked wheat, meat and ghee — a season-defining dish when it appears.',
    atmosphere: 'local',
    image: placeHaleem,
    directions:
      'The famous houses are in the old city, about 40 minutes by car. In season we can have a portion sent up to the room.',
    mapQuery: 'haleem restaurant Hyderabad',
  },
  {
    id: 'nawab',
    name: 'Nawab\'s biryani trail',
    area: 'Food',
    category: 'food',
    minutes: 30,
    why: 'For guests who want to do it properly — the old city biryani houses that have earned their reputation over decades.',
    atmosphere: 'local',
    image: placeFood,
    directions:
      'About 30 minutes by car into the old city. The desk will know which house is performing best this week.',
    mapQuery: 'best biryani old city Hyderabad',
  },
  {
    id: 'dum',
    name: 'Dum Pukht dining',
    area: 'Food',
    category: 'food',
    minutes: 20,
    why: 'The slow-cooked tradition — meat sealed in dough, cooked over embers. A method the Nizams perfected.',
    atmosphere: 'elegant',
    image: placeFood,
    directions:
      'About 20 minutes by car. Ask the concierge for the current recommendation; the kitchen culture in Hyderabad changes often.',
    mapQuery: 'Dum Pukht restaurant Hyderabad',
  },
  {
    id: 'pearls',
    name: 'Pearls of Hyderabad',
    area: 'Shopping',
    category: 'shopping',
    minutes: 40,
    why: 'The city still knows pearls. We will send you to a dealer we use — not a stall that found you first.',
    atmosphere: 'elegant',
    image: placeLaad,
    directions:
      'Reputed dealers cluster around Charminar and Pot Market — 40 minutes by car. The concierge will phone ahead so you are expected.',
    mapQuery: 'pearl shop near Charminar, Hyderabad',
  },
  {
    id: 'shilparamam',
    name: 'Shilparamam',
    area: 'Shopping',
    category: 'shopping',
    minutes: 10,
    why: 'A crafts village ten minutes away — weavers, potters and the easier kind of souvenir.',
    atmosphere: 'local',
    image: placeShilparamam,
    directions:
      'Ten minutes by car, next door in Madhapur. Livelier on weekends, when folk performances fill the amphitheatre.',
    mapQuery: 'Shilparamam, Madhapur, Hyderabad',
  },
  {
    id: 'necklace',
    name: 'Necklace Road at sunset',
    area: 'Family',
    category: 'family',
    minutes: 30,
    why: 'Hussain Sagar turns gold, then violet. Walk it, or take a car and simply watch.',
    atmosphere: 'elegant',
    image: placeNecklace,
    directions:
      '30 minutes by car via Khairatabad. Time it for the last hour of light; the boat to the Buddha statue closes at dusk.',
    mapQuery: 'Hussain Sagar, Hyderabad',
  },
  {
    id: 'ramoji',
    name: 'Ramoji Film City',
    area: 'Family',
    category: 'family',
    minutes: 60,
    why: 'The world\'s largest film studio complex — a full day of sets, shows and gardens.',
    atmosphere: 'lively',
    image: placeRamoji,
    directions:
      'About an hour by car on the Vijayawada highway. Leave by 9 a.m. and make it a day; tickets through the concierge.',
    mapQuery: 'Ramoji Film City, Hyderabad',
  },
  {
    id: 'zoo',
    name: 'Nehru Zoological Park',
    area: 'Family',
    category: 'family',
    minutes: 30,
    why: 'One of India\'s better zoos — lions, tigers and a safari park children remember for years.',
    atmosphere: 'local',
    image: placeZoo,
    directions:
      '30 minutes by car via NH44. Mornings are coolest and the animals are awake; closed on Mondays.',
    mapQuery: 'Nehru Zoological Park, Hyderabad',
  },
]

export const defaultEvents: CityEvent[] = [
  {
    id: 'e1',
    title: 'Live ghazals at the Club',
    category: 'live-music',
    time: '21:00',
    venue: 'A private room, Jubilee Hills',
    description: 'An intimate evening of Urdu verse and slow percussion.',
    editorial: 'We recommend this when you want Hyderabad without a crowd.',
    featured: true,
  },
  {
    id: 'e2',
    title: 'New tasting menu, Banjara Hills',
    category: 'opening',
    time: '19:30',
    venue: 'A recently opened dining room',
    description: 'A chef who trained in the south of France, cooking for this city.',
    editorial: 'Book through us; the walk-in list is already long.',
    featured: true,
  },
  {
    id: 'e3',
    title: 'Contemporary Deccan at the gallery',
    category: 'art',
    time: '11:00 – 19:00',
    venue: 'Banjara Hills',
    description: 'Works on paper, textiles, and a quiet courtyard.',
    editorial: 'A cultured afternoon if meetings end early.',
    featured: false,
  },
  {
    id: 'e4',
    title: 'Sunday market, Shilparamam',
    category: 'shopping',
    time: '10:00 – 20:00',
    venue: 'Madhapur',
    description: 'Crafts, textiles and the easier kind of souvenir.',
    editorial: 'Ten minutes from the hotel. Pleasant with children.',
    featured: false,
  },
  {
    id: 'e5',
    title: 'Hyderabad vs. the evening',
    category: 'sports',
    time: '19:30',
    venue: 'Uppal',
    description: 'A home fixture. The city will be loud.',
    editorial: 'We can arrange a car and a box, or a quieter screen at Ninety Six.',
    featured: true,
  },
  {
    id: 'e6',
    title: 'Theatre: a new Telugu play',
    category: 'theatre',
    time: '19:00',
    venue: 'Ravindra Bharathi',
    description: 'Contemporary writing, classical discipline.',
    editorial: 'Ask us for an English synopsis before you go.',
    featured: false,
  },
]

export const defaultPicks: ConciergePick[] = [
  {
    id: 'p1',
    rank: 1,
    title: 'Best new restaurant',
    category: 'Dine',
    place: 'A kitchen in Jubilee Hills',
    why: 'The room is still finding its voice, which is precisely when a kitchen is most interesting. We have a table held on Friday.',
  },
  {
    id: 'p2',
    rank: 2,
    title: 'Best cocktail',
    category: 'Drink',
    place: 'Ninety Six',
    why: 'Stay in the house. The signature list is sharper after ten, and you will not lose the night to traffic.',
  },
  {
    id: 'p3',
    rank: 3,
    title: 'Best sunset',
    category: 'City',
    place: '10th-floor pool, or Necklace Road',
    why: 'If you have 40 minutes, the pool. If you have an hour and a car, Hussain Sagar. Both are honest.',
  },
  {
    id: 'p4',
    rank: 4,
    title: 'Best cultural experience',
    category: 'Culture',
    place: 'Chowmahalla Palace',
    why: 'Not the busiest monument, and all the better for it. Go mid-morning, then chai in the old city.',
  },
  {
    id: 'p5',
    rank: 5,
    title: 'Best thing to do tonight',
    category: 'Tonight',
    place: 'Kanak, then Ninety Six',
    why: 'Nizami cooking at 19:30, a last cocktail at 22:00. Hyderabad, without leaving the hotel — unless you ask us to take you further.',
  },
]

export const defaultSpecials: Special[] = [
  {
    id: 's1',
    venue: 'kanak',
    kind: 'chef',
    title: 'Tonight’s haleem',
    detail: 'Slow-cooked, only while it lasts. Ask for the chef’s portion.',
  },
  {
    id: 's2',
    venue: 'ninety-six',
    kind: 'happy-hour',
    title: 'Early evening at the bar',
    detail: 'Selected cocktails, 5:00 – 7:00 p.m.',
  },
  {
    id: 's3',
    venue: 'tuscany',
    kind: 'wine',
    title: 'Tuscan reds by the glass',
    detail: 'A short flight of Chianti Classico and Brunello, this week only.',
  },
]

export const defaultPrefs: GuestPrefs = {
  name: 'Singh',
  title: 'Mr.',
  cuisines: ['Indian', 'Italian'],
  drinks: ['Cocktails', 'Wine'],
  experiences: ['Romantic', 'Culture'],
  budget: '₹₹₹',
  distance: '20',
}

export const defaultCms: CmsState = {
  weather: { temp: 28, condition: 'Partly cloudy' },
  traffic: 'HITEC City is moving. Old City, allow 50 minutes this evening.',
  events: defaultEvents,
  picks: defaultPicks,
  specials: defaultSpecials,
  availability: {
    amara: 'open',
    kanak: 'limited',
    tuscany: 'open',
    'ninety-six': 'open',
    'in-room': 'open',
  },
  requests: [],
  notes: 'Kanak is the stronger recommendation for first-time guests this week.',
}

export const cravings: { id: import('./types').Mood; label: string; hint: string }[] = [
  { id: 'spicy', label: 'Something spicy', hint: '🌶️' },
  { id: 'light', label: 'Something light', hint: '🥗' },
  { id: 'steak', label: 'A great steak', hint: '🥩' },
  { id: 'indian', label: 'Indian food', hint: '🇮🇳' },
  { id: 'italian', label: 'Italian', hint: '🇮🇹' },
  { id: 'sweet', label: 'Something sweet', hint: '🍰' },
  { id: 'cocktail', label: 'A cocktail', hint: '🍸' },
  { id: 'nightcap', label: 'A nightcap', hint: '🥃' },
  { id: 'coffee', label: 'Coffee & conversation', hint: '☕' },
  { id: 'breakfast', label: 'Breakfast in bed', hint: '🛏️' },
]

export const exploreGroups = [
  { id: 'old-city', title: 'The Old City', subtitle: 'Charminar · Laad Bazaar · Chowmahalla Palace' },
  { id: 'modern', title: 'The Modern City', subtitle: 'HITEC City · Jubilee Hills · Banjara Hills' },
  { id: 'art', title: 'Art & Culture', subtitle: 'Museums · Forts · Temples · Tombs' },
  { id: 'food', title: 'Food', subtitle: 'Biryani · Irani chai · Haleem' },
  { id: 'nightlife', title: 'Nightlife', subtitle: 'Bars · Clubs · Live music' },
  { id: 'shopping', title: 'Shopping', subtitle: 'Pearls · Bangles · Crafts' },
  { id: 'family', title: 'Family', subtitle: 'Parks · Lakes · Film City' },
] as const

export const eventFilters: { id: CityEvent['category'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'live-music', label: 'Live music' },
  { id: 'theatre', label: 'Theatre' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'sports', label: 'Sports' },
  { id: 'art', label: 'Art' },
  { id: 'food', label: 'Food pop-ups' },
  { id: 'opening', label: 'New openings' },
  { id: 'party', label: 'Parties' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'culture', label: 'Culture' },
  { id: 'business', label: 'Business' },
]