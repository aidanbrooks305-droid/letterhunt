// Three-year daily episode plan for Letter Hunt.
// Covers 2026-04-21 through 2029-04-20, inclusive.
// Bank holiday rules are based on the Federal Reserve System holiday schedule.

(function initDailyEpisodes(global) {
  const DAILY_EPISODE_CONFIG = Object.freeze({
    startDate: "2026-04-21",
    endDate: "2029-04-20",
    timezone: "America/New_York",
    wordsPerEpisode: 3,
  });

  const DEFAULT_WORD_BANKS = Object.freeze([
    ["angle", "pepper", "sailor"],
    ["amber", "rocket", "window"],
    ["anchor", "forest", "ribbon"],
    ["apple", "planet", "tavern"],
    ["artist", "glacier", "pocket"],
    ["atlas", "market", "shadow"],
    ["baker", "meteor", "silver"],
    ["basket", "mirror", "sketch"],
    ["beacon", "nectar", "station"],
    ["beetle", "noodle", "storm"],
    ["bicycle", "notion", "sunrise"],
    ["bridge", "oasis", "tangle"],
    ["cactus", "orbit", "thistle"],
    ["camera", "origin", "timber"],
    ["candle", "otter", "topaz"],
    ["canvas", "paddle", "torch"],
    ["carbon", "parade", "travel"],
    ["castle", "pebble", "tulip"],
    ["cedar", "plaza", "velvet"],
    ["center", "prairie", "voyage"],
    ["cereal", "quartz", "walnut"],
    ["circle", "quiver", "wander"],
    ["cobalt", "radar", "willow"],
    ["copper", "raven", "winter"],
    ["cosmic", "reef", "wonder"],
    ["cradle", "saddle", "yonder"],
    ["crater", "saffron", "dragon"],
    ["cricket", "scarlet", "ember"],
    ["crystal", "signal", "falcon"],
    ["dancer", "solstice", "feather"],
    ["daring", "spruce", "fiddle"],
    ["daylight", "ladder", "figure"],
    ["denim", "lantern", "filter"],
    ["desert", "lattice", "flame"],
    ["dinner", "legend", "fossil"],
    ["drizzle", "lemon", "galaxy"],
    ["easel", "linen", "garden"],
    ["echo", "magnet", "golden"],
    ["engine", "marble", "granite"],
    ["fabric", "meadow", "harbor"],
  ]);

  const BANK_HOLIDAY_RULES = Object.freeze([
    {
      theme: "New Year's Day",
      words: ["midnight", "confetti", "renewal"],
      dateForYear: (year) => utcDate(year, 0, 1),
    },
    {
      theme: "Martin Luther King Jr. Day",
      words: ["dream", "justice", "service"],
      dateForYear: (year) => nthWeekdayOfMonth(year, 0, 1, 3),
    },
    {
      theme: "Washington's Birthday",
      words: ["liberty", "history", "civic"],
      dateForYear: (year) => nthWeekdayOfMonth(year, 1, 1, 3),
    },
    {
      theme: "Memorial Day",
      words: ["honor", "fallen", "banner"],
      dateForYear: (year) => lastWeekdayOfMonth(year, 4, 1),
    },
    {
      theme: "Juneteenth",
      words: ["freedom", "jubilee", "heritage"],
      dateForYear: (year) => utcDate(year, 5, 19),
    },
    {
      theme: "Independence Day",
      words: ["firework", "liberty", "parade"],
      dateForYear: (year) => utcDate(year, 6, 4),
    },
    {
      theme: "Labor Day",
      words: ["worker", "union", "picnic"],
      dateForYear: (year) => nthWeekdayOfMonth(year, 8, 1, 1),
    },
    {
      theme: "Columbus Day / Indigenous Peoples Day",
      words: ["journey", "harbor", "heritage"],
      dateForYear: (year) => nthWeekdayOfMonth(year, 9, 1, 2),
    },
    {
      theme: "Veterans Day",
      words: ["veteran", "salute", "service"],
      dateForYear: (year) => utcDate(year, 10, 11),
    },
    {
      theme: "Thanksgiving Day",
      words: ["harvest", "turkey", "gratitude"],
      dateForYear: (year) => nthWeekdayOfMonth(year, 10, 4, 4),
    },
    {
      theme: "Christmas Day",
      words: ["carol", "candle", "winter"],
      dateForYear: (year) => utcDate(year, 11, 25),
    },
  ]);

  const FIXED_SPECIAL_OCCASIONS = Object.freeze({
    "02-02": { theme: "Groundhog Day", words: ["shadow", "burrow", "winter"] },
    "02-14": { theme: "Valentine's Day", words: ["heart", "candy", "roses"] },
    "03-14": { theme: "Pi Day", words: ["circle", "number", "radius"] },
    "03-17": { theme: "St. Patrick's Day", words: ["clover", "emerald", "rainbow"] },
    "04-01": { theme: "April Fools' Day", words: ["prank", "jester", "laugh"] },
    "04-22": { theme: "Earth Day", words: ["planet", "forest", "garden"] },
    "05-05": { theme: "Cinco de Mayo", words: ["fiesta", "music", "tacos"] },
    "06-01": { theme: "Pride Month Kickoff", words: ["pride", "rainbow", "signal"] },
    "06-14": { theme: "Flag Day", words: ["banner", "stripes", "liberty"] },
    "10-31": { theme: "Halloween", words: ["pumpkin", "ghost", "candle"] },
    "12-24": { theme: "Christmas Eve", words: ["cocoa", "carol", "candle"] },
    "12-26": { theme: "Kwanzaa", words: ["unity", "harvest", "family"] },
    "12-31": { theme: "New Year's Eve", words: ["countdown", "midnight", "sparkle"] },
  });

  const FLOATING_SPECIAL_RULES = Object.freeze([
    {
      theme: "Mardi Gras",
      words: ["parade", "masks", "beads"],
      dateForYear: (year) => addDays(easterDate(year), -47),
    },
    {
      theme: "Easter",
      words: ["spring", "basket", "garden"],
      dateForYear: easterDate,
    },
    {
      theme: "Mother's Day",
      words: ["mother", "flower", "brunch"],
      dateForYear: (year) => nthWeekdayOfMonth(year, 4, 0, 2),
    },
    {
      theme: "Father's Day",
      words: ["father", "grill", "camping"],
      dateForYear: (year) => nthWeekdayOfMonth(year, 5, 0, 3),
    },
    {
      theme: "Election Day",
      words: ["ballot", "civic", "choice"],
      dateForYear: electionDay,
    },
  ]);

  function utcDate(year, monthIndex, day) {
    return new Date(Date.UTC(year, monthIndex, day));
  }

  function parseDateKey(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return utcDate(year, month - 1, day);
  }

  function formatDateKey(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatMonthDayKey(date) {
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${month}-${day}`;
  }

  function addDays(date, days) {
    const next = new Date(date.getTime());
    next.setUTCDate(next.getUTCDate() + days);
    return next;
  }

  function nthWeekdayOfMonth(year, monthIndex, weekday, nth) {
    const date = utcDate(year, monthIndex, 1);
    const offset = (weekday - date.getUTCDay() + 7) % 7;
    return utcDate(year, monthIndex, 1 + offset + (nth - 1) * 7);
  }

  function lastWeekdayOfMonth(year, monthIndex, weekday) {
    const date = utcDate(year, monthIndex + 1, 0);
    const offset = (date.getUTCDay() - weekday + 7) % 7;
    return addDays(date, -offset);
  }

  function electionDay(year) {
    const firstMonday = nthWeekdayOfMonth(year, 10, 1, 1);
    return addDays(firstMonday, 1);
  }

  function easterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return utcDate(year, month - 1, day);
  }

  function setOccasion(occasionMap, date, occasion, priority) {
    const dateKey = formatDateKey(date);
    const existing = occasionMap.get(dateKey);
    if (existing && existing.priority > priority) return;
    occasionMap.set(dateKey, {
      ...occasion,
      date: dateKey,
      priority,
      words: occasion.words.slice(0, DAILY_EPISODE_CONFIG.wordsPerEpisode),
    });
  }

  function addObservedSundayBankHoliday(occasionMap, date, rule) {
    if (date.getUTCDay() !== 0) return;
    setOccasion(
      occasionMap,
      addDays(date, 1),
      {
        theme: `${rule.theme} Observed`,
        words: rule.words,
        bankHoliday: true,
        observedFor: formatDateKey(date),
      },
      90
    );
  }

  function buildOccasionMap(startDate, endDate) {
    const startYear = startDate.getUTCFullYear();
    const endYear = endDate.getUTCFullYear();
    const occasionMap = new Map();

    for (let year = startYear; year <= endYear; year += 1) {
      Object.entries(FIXED_SPECIAL_OCCASIONS).forEach(([monthDayKey, occasion]) => {
        const [month, day] = monthDayKey.split("-").map(Number);
        setOccasion(occasionMap, utcDate(year, month - 1, day), occasion, 40);
      });

      FLOATING_SPECIAL_RULES.forEach((rule) => {
        setOccasion(occasionMap, rule.dateForYear(year), rule, 50);
      });

      BANK_HOLIDAY_RULES.forEach((rule) => {
        const date = rule.dateForYear(year);
        const occasion = { theme: rule.theme, words: rule.words, bankHoliday: true };
        setOccasion(occasionMap, date, occasion, 100);
        addObservedSundayBankHoliday(occasionMap, date, rule);
      });
    }

    return occasionMap;
  }

  function defaultWordsForEpisode(episodeNumber) {
    const index = (episodeNumber - 1) % DEFAULT_WORD_BANKS.length;
    return DEFAULT_WORD_BANKS[index].slice();
  }

  function cleanOccasion(occasion) {
    if (!occasion) return null;
    const { priority, ...cleaned } = occasion;
    return cleaned;
  }

  function buildDailyEpisodePlan() {
    const startDate = parseDateKey(DAILY_EPISODE_CONFIG.startDate);
    const endDate = parseDateKey(DAILY_EPISODE_CONFIG.endDate);
    const occasionMap = buildOccasionMap(startDate, endDate);
    const episodes = [];
    let episodeNumber = 1;

    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const dateKey = formatDateKey(date);
      const occasion = cleanOccasion(occasionMap.get(dateKey));
      const words = occasion ? occasion.words.slice() : defaultWordsForEpisode(episodeNumber);

      episodes.push(Object.freeze({
        episode: episodeNumber,
        dropId: `LH-${dateKey.replace(/-/g, "")}`,
        date: dateKey,
        monthDay: formatMonthDayKey(date),
        theme: occasion ? occasion.theme : "Daily Drop",
        specialOccasion: occasion ? occasion.theme : null,
        bankHoliday: Boolean(occasion && occasion.bankHoliday),
        observedFor: occasion && occasion.observedFor ? occasion.observedFor : null,
        words,
      }));

      episodeNumber += 1;
    }

    return Object.freeze(episodes);
  }

  const DAILY_EPISODE_PLAN = buildDailyEpisodePlan();
  const DAILY_EPISODE_BY_DATE = Object.freeze(
    DAILY_EPISODE_PLAN.reduce((byDate, episode) => {
      byDate[episode.date] = episode;
      return byDate;
    }, {})
  );

  function getDailyEpisode(dateInput = new Date()) {
    const dateKey = typeof dateInput === "string"
      ? dateInput.slice(0, 10)
      : formatDateKey(dateInput);
    return DAILY_EPISODE_BY_DATE[dateKey] || null;
  }

  const api = Object.freeze({
    config: DAILY_EPISODE_CONFIG,
    plan: DAILY_EPISODE_PLAN,
    byDate: DAILY_EPISODE_BY_DATE,
    getDailyEpisode,
  });

  global.DAILY_EPISODE_PLAN = DAILY_EPISODE_PLAN;
  global.DAILY_EPISODE_BY_DATE = DAILY_EPISODE_BY_DATE;
  global.LETTER_HUNT_DAILY_EPISODES = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
