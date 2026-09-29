/* Poiesis — where the site keeps things for signed-in people.
 *
 * Leave both blank and the site runs as the prototype: everything stays
 * in this browser, nobody signs in, other members are examples.
 *
 * Fill both in from Supabase (Project Settings → API) to switch on
 * accounts and syncing. The anon key is meant to be public: the database
 * rules (supabase/migrations) decide what each person may read or write.
 * Never put the service_role key here.
 */
window.POIESIS_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  // Sign-in buttons to show besides email. Add each one only after it is
  // switched on in Supabase (Authentication → Sign In / Providers).
  providers: [], // e.g. ["google"] or ["google", "apple"]
};
