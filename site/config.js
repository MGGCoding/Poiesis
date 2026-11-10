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
  supabaseUrl: "https://toscnnevnoujsiexnkve.supabase.co",
  supabaseAnonKey: "sb_publishable_01dYwjSVCz0Y3vNsYSJJnA_XZKfJkxo",
  // Sign-in buttons to show besides email. Add each one only after it is
  // switched on in Supabase (Authentication → Sign In / Providers).
  providers: [], // e.g. ["google"] or ["google", "apple"]

  // The forum (site/forum.js, supabase/forum-v1.sql). With the two lines above
  // filled in, forum: true shows the welcome page, lets people sign in with an
  // email, a username and a password, and carries the day's conversation.
  // Nothing from the notebook is stored.
  //   emailLink: true  adds "Email me a sign-in link" (turn it on only once a
  //                    sending service is connected in Supabase).
  //   betaWord: true   asks for the beta word when a username is chosen (set
  //                    the word itself in Supabase; see docs/forum-v1.md).
  //   notebookSoon: true  covers the Notebook page with "Will be added soon".
  //                    It works whether or not the forum is on.
  forum: true,
  emailLink: false,
  betaWord: false,
  notebookSoon: true,

  // The feedback page (feedback.html). Both may stay blank: friends then send
  // their answers to you themselves (share, copy, or email).
  // feedbackEndpoint: the web-app address of the Google Sheet script in
  //   tools/feedback/ — every submission then lands as a row in your sheet.
  // feedbackEmail: where the answers are emailed, straight from the form,
  //   through FormSubmit (formsubmit.co, free, no account). The first
  //   submission sends you an "Activate" email: click it once. This file is
  //   public on GitHub, so the address is public too.
  // feedbackEmailDirect: false keeps only the "Email them" button instead.
  feedbackEndpoint: "",
  feedbackEmail: "moderngreekgod@gmail.com",
  feedbackEmailDirect: true,
};
