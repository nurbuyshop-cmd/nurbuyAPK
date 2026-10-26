/** The live NurBuy API. The app has no other backend. */
export const API_BASE = 'https://apin.nurbuy.com';

/** The rider website this app mirrors. */
export const RIDER_SITE = 'https://rider.nurbuy.com';

/** How often an approved rider's dashboard (new assignments) is checked while the app is open, like the website (15 s). */
export const POLL_MS = 15_000;

/** Riders waiting for approval re-check their status less often (website: 20 s). */
export const STATUS_POLL_MS = 20_000;
