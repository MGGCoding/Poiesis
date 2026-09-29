# Poiesis: how data is kept (architecture, Round 11, 28 Sept 2026)

## In one paragraph

The site stays what it is: plain HTML, CSS and JavaScript on GitHub Pages, with no build step. Behind it sits **Supabase**, a hosted Postgres database that also handles sign-in. Every rule that matters lives **inside the database** as a database rule, not in the page. That covers the gate, private notebooks, who sees "Moved me", the daily limits, and the three days a conversation stays open. So the website today and an iPhone or Android app later get exactly the same rules without anyone writing them twice. The page never waits for the network: it reads and writes on the device first, and `site/data.js` keeps the account in step in the background.

```
Phone / laptop
  index.html · styles.css · copy.js (words) · app.js (the page)
  config.js (which Supabase project) · data.js (sign-in, sync, conversations)
        │  writes land on the device first (localStorage),
        │  then go up in the background; offline simply waits
        ▼
Supabase (Postgres + sign-in)
  profiles · works · days · day_works         ← who, and the muse bank
                                                (seeded from muse-bank/index.json;
                                                 v2 days: poem, passage, Scripture)
  posts (impression · link · reply) · unlocks ← conversations and the gate
  moved · reports · admins                    ← private marks, moderation
  notebook_items                              ← everything in the Notebook
  work_posts · thread_replies · day_table · day_count · work_count (reads)
```

## The two kinds of data

| | What | Who can read it | Where |
|---|---|---|---|
| **Private** | Notebook pages, kept lines, questions, torn-out pages, rule of life, pen note, drafts, stickers, profile settings, the room and type (shared by phone and desktop), the private ledger | Only you | `notebook_items`: one row per thing, synced |
| **Shared** | First impressions, links, replies | Only people who have written into that same conversation | `posts`, gated through `unlocks` |
| **Between two people** | "Moved me" | The reader who marked it, and the maker | `moved` |

## Conversations: Twitter-style threads, calm

- **Three kinds of post in one table.** An *impression* is about one work. A *link* joins two works (a side) or all three (the centre), and appears under every work it touches. A *reply* answers any post. A reply to a reply stays in the same thread (`root_id`), so a thread reads top to bottom like Twitter: the first post, then its replies in time order, each showing who it answers.
- **The gate lives in the database.** Writing a first impression (or a link) records an *unlock* for that conversation. You can read, reply to and mark only posts whose conversation you have unlocked. Hiding them in the page would not be enough, because anyone can open the browser's developer tools.
- **Links are never blocked (Round 13).** A link written before a work's first impression counts as your first impression on that work: it opens that work's table, and a separate first impression there is refused. Others' links on a side stay hidden until you write your own link on that side.
- **Limits:** one first impression per work per day, one link per side, one centre link. Replies are unlimited, including to yourself (later thoughts), with a spam brake of 30 replies in 10 minutes.
- **Open for three days.** A conversation takes new writing from the day before its date through three days after it. Then it closes to new writing. **Nothing is deleted and nothing is ranked**; the Round 4 "top 10" is gone.
- **Nothing moves on screen by itself.** The page loads the conversation when you open a work and again only when you press refresh. No live push, no typing dots, no text jumping. That is also cheaper to run: no open connections.
- **Order:** newest first, 20 threads at a time, each with its first 3 replies. "Show earlier" and "Show more replies" load the rest.
- **No public counts.** The database will say *how many people* wrote today (the avatar stack) and how many others wrote on a work. It never gives a number per post or per person. Only the maker can ask who was moved.
- **Moderation:** anyone can report a post; moderators (the `admins` table) can hide it. A hidden post vanishes for everyone except its author.

## The Notebook: device first, account second

- `app.js` keeps its state in `localStorage` as it always has, so writing is instant and works offline, including the pen.
- `data.js` fingerprints each piece of the notebook. About 1.5 s after you stop typing, it sends only the pieces that changed. When you come back to the tab, or open the site on another device, it fetches only the pieces changed since the last sync (one indexed read).
- **Conflicts:** each piece is compared separately. If two devices change the same page, the one saved later wins. Something written on this device and not yet sent always goes up; it is never overwritten by an older copy from the server.
- **First sign-in on a device:** the account's copy wins for anything it already has; anything that exists only on this device is added to the account.
- **Signing out** sends anything unsent first, then clears this device's copy, so nothing personal stays on a shared computer.
- **Adding a notebook feature needs no database change.** Add a line to `COLLECTIONS` in `data.js`.
- **Privacy, honestly:** other members can never read your notebook. The database rules forbid it. It is not end-to-end encrypted, so whoever runs the database could technically read it. The Why page should say exactly that. Encryption can come later, at the cost of server-side search and easy account recovery.

## Sign-in

Email magic link, email and password (with "forgot password"), Google and Apple. The Google and Apple buttons show only once each is listed in `config.js`, so you switch them on one at a time. Apple needs a paid Apple Developer account. A profile is made automatically on sign-up. While you are signed out, the avatar opens the sign-in card; the footer says whether you are saved.

## Speed and scale (measured, not guessed)

These were tested against 1.6 million posts, 20,000 people and 1 million notebook rows on Postgres 16:

| Read | Time |
|---|---|
| A page of a work's threads (with the gate) | ~7 ms |
| The first replies of those threads | ~3 ms |
| Notebook changes since the last sync | ~1 ms |
| "How many wrote today" | ~2 ms |
| "Who was at the table" | ~9 ms |

What keeps it fast: every read the app makes has an index built for it, the gate is one primary-key lookup, `auth.uid()` is evaluated once per query, and there are no live connections. Writing never waits on the network, and the Supabase library loads in the background only once the site is configured.

## Becoming an app later

Nothing here ties Poiesis to the browser. Supabase has official libraries for iOS (Swift), Android (Kotlin), Flutter and React Native, and every rule is enforced by the database, so a native app is only a new front end. The quickest route is to wrap this same site with **Capacitor**, which turns a website into App Store and Play Store apps. It needs a deep link for the sign-in email. It also needs "Sign in with Apple" or a similar privacy-focused option, because Apple's review rules ask for one when an app offers Google sign-in.

## Not in this round (next steps, in order)

1. **Wire the Muse page to real conversations.** Replace the example members with `PoiesisData.threads` (list, write, reply, moved, refresh button), laid out as threads. `data.js` already provides the calls, and they are tested.
2. **An empty notebook for new people.** Today a new account starts with the prototype's sample pages. Replace them with one welcome page before sign-up opens.
3. **Public profiles and sticker shelves** from `profiles` plus a public view of stickers.
4. **Photos to Supabase Storage.** They sit inside notebook rows today, capped at about 1 MB each.
5. **Email:** set up a sending service (custom SMTP) for sign-in emails, then build the daily letter on it.
