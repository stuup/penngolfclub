// Primary navigation. Mirrors the structure of the original site, with a new
// "The Course" section and the diary/news promoted to the top level.
export default [
  {
    title: "The Club",
    url: "/the-club/",
    children: [
      { title: "Our Clubhouse", url: "/the-club/clubhouse/" },
      { title: "History", url: "/the-club/history/" },
      { title: "Club Officials", url: "/the-club/officials/" },
      { title: "Our Sponsors", url: "/the-club/sponsors/" },
      { title: "Safeguarding", url: "/the-club/safeguarding/" },
      { title: "News", url: "/news/" },
    ],
  },
  {
    title: "The Course",
    url: "/the-course/",
    children: [
      { title: "Course Guide", url: "/the-course/" },
      { title: "Scorecard", url: "/the-course/scorecard/" },
      { title: "Course Handicap & WHS Ratings", url: "/the-course/course-handicap/" },
      { title: "Course Status & Weather", url: "/the-course/status/" },
    ],
  },
  {
    title: "Visitors",
    url: "/visitors/",
    children: [
      { title: "Green Fees & Tee Times", url: "/visitors/" },
      { title: "Societies", url: "/visitors/societies/" },
      { title: "Open Competitions", url: "/visitors/open-competitions/" },
      { title: "Open Results", url: "/visitors/open-results/" },
      { title: "Dress Code", url: "/visitors/dress-code/" },
    ],
  },
  {
    title: "Hospitality",
    url: "/hospitality/",
    children: [
      { title: "Food & Drink", url: "/hospitality/food-and-drink/" },
      { title: "Weddings", url: "/hospitality/weddings/" },
      { title: "Family Occasions", url: "/hospitality/family-occasions/" },
      { title: "Meeting Room", url: "/hospitality/meeting-room/" },
    ],
  },
  {
    title: "Membership",
    url: "/membership/",
    children: [
      { title: "How to Join", url: "/membership/" },
      { title: "Prices & Offers", url: "/membership/prices/" },
      { title: "PlayMoreGolf Flexible Membership", url: "/membership/playmoregolf/" },
      { title: "Women in Golf Charter", url: "/membership/women-in-golf/" },
    ],
  },
  {
    title: "Golf Shop",
    url: "/golf-shop/",
    children: [
      { title: "The Golf Shop", url: "/golf-shop/" },
      { title: "Coaching & Club Fitting", url: "/golf-shop/coaching/" },
    ],
  },
  { title: "Diary", url: "/diary/" },
  { title: "Contact", url: "/contact/" },
];
