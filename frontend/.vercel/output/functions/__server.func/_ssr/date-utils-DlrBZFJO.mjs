const IST_OFFSET_MS = 5.5 * 60 * 60 * 1e3;
function nowInIST() {
  const now = /* @__PURE__ */ new Date();
  return new Date(now.getTime() + IST_OFFSET_MS + now.getTimezoneOffset() * 60 * 1e3);
}
function todayISODateIST() {
  return toISODate(nowInIST());
}
function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function isWeekend(iso) {
  const d = parseISODate(iso);
  const day = d.getDay();
  return day === 0 || day === 6;
}
function daysFromTodayIST(iso) {
  const today = parseISODate(todayISODateIST());
  const target = parseISODate(iso);
  return Math.round((target.getTime() - today.getTime()) / 864e5);
}
function isWithinBookingWindow(iso) {
  const diff = daysFromTodayIST(iso);
  return diff >= 0 && diff <= 7;
}
function canCancel(bookingDateISO) {
  const ist = nowInIST();
  const todayIso = toISODate(ist);
  if (bookingDateISO < todayIso) return false;
  if (bookingDateISO > todayIso) return true;
  return ist.getHours() < 18;
}
function formatDateLong(iso) {
  const d = parseISODate(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
export {
  isWithinBookingWindow as a,
  todayISODateIST as b,
  canCancel as c,
  daysFromTodayIST as d,
  formatDateLong as f,
  isWeekend as i,
  parseISODate as p,
  toISODate as t
};
