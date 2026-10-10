// iCalendar feed of club events — subscribe from Google, Apple or Outlook calendars.
export const data = { permalink: "/diary.ics", eleventyExcludeFromCollections: true };

const esc = (s = "") => String(s).replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
const day = (iso, add = 0) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + add);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
};
// RFC 5545: lines longer than 75 octets must be folded (60 chars leaves room for multi-byte characters such as £).
const fold = (line) => line.match(/.{1,60}/g).join("\r\n ");

export function render({ events, site }) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Penn Golf Club//Diary//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Penn Golf Club",
    "X-WR-TIMEZONE:Europe/London",
  ];
  events.events.forEach((e, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.date}-${i}@penngolfclub.co.uk`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day(e.date)}`,
      `DTEND;VALUE=DATE:${day(e.endDate || e.date, 1)}`,
      `SUMMARY:${esc(e.title)}`,
      `DESCRIPTION:${esc([e.format, e.eligibility, e.fees].filter(Boolean).join("\n"))}`,
      `LOCATION:${esc("Penn Golf Club, Penn Common, Wolverhampton WV4 5JN")}`,
      `URL:${new URL("/diary/", site.url)}`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
