// Global club details. Values here are used across every page.
export default {
  name: "Penn Golf Club",
  shortName: "Penn GC",
  tagline: "Where city meets countryside",
  description:
    "Penn Golf Club is a traditional heathland golf course on Penn Common, Wolverhampton, with views over the Clee Hills. Golf since the 1890s — visitors, societies and new members welcome.",
  url: process.env.URL || "https://www.penngolfclub.co.uk",
  founded: 1908,
  golfSince: "the early 1890s",
  memberCount: 600,
  address: {
    street: "Penn Common",
    locality: "Penn",
    town: "Wolverhampton",
    county: "West Midlands",
    postcode: "WV4 5JN",
    country: "GB",
    lane: "Pennwood Lane",
  },
  geo: { lat: 52.5521, lng: -2.1471 },
  phone: "01902 341142",
  email: "admin@penngolfclub.co.uk",
  departments: [
    { name: "Administration", detail: "Membership & general enquiries", phone: "01902 341142", ext: "Option 3", email: "admin@penngolfclub.co.uk" },
    { name: "Club Secretary & Welfare Officer", detail: "Ian Foster", phone: "01902 341142", ext: "Option 3", email: "secretary@penngolfclub.co.uk" },
    { name: "The Golf Shop", detail: "Tee times, green fees, societies, lessons", phone: "01902 330472", ext: "or 01902 341142 Ext 4" },
    { name: "Catering & Functions", detail: "Weddings, parties & events — Penny", phone: "01902 341142", ext: "Option 6", email: "catering@penngolfclub.co.uk" },
  ],
  links: {
    bookTeeTime: "https://visitors.brsgolf.com/penn#/course/1",
    bookOpens: "https://visitors.brsgolf.com/penn#/open-competitions",
    membersHub: "https://penn.hub.clubv1.com/",
    golfShop: "https://stevecartergolf.foremostgolf.com",
    playMoreGolf: "https://www.playmore.golf/explore/Club/penn-golf-club-wolverhampton/204",
    howDidiDo: "https://howdidido.com",
    googleMaps: "https://www.google.com/maps/search/?api=1&query=Penn+Golf+Club+WV4+5JN",
    directions: "https://www.google.com/maps/dir/?api=1&destination=Penn+Golf+Club,+Penn+Common,+Wolverhampton+WV4+5JN",
    whatThreeWords: "",
  },
  // Add the club's social profiles here and they appear in the footer automatically.
  social: [],
};
