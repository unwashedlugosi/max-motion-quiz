/* config.js — where progress is stored.
 * backend:
 *   'jsonblob' – a no-account JSON store (default service https://jsonblob.com). The practice code is the blob id;
 *                the first run on a device creates the blob and shows Max his save code.
 *   'supabase' – Supabase REST (run supabase/schema.sql first; fill supabaseUrl and supabaseAnonKey).
 *   ''         – this browser only (localStorage).
 * Whatever the backend, progress is mirrored in localStorage, so a network or service failure never loses work.
 */
window.FDP_CONFIG = { backend: 'jsonblob', jsonblobBase: 'https://jsonblob.com', supabaseUrl: '', supabaseAnonKey: '' };
