/* Poiesis — the day's art, by date (Round 23, 1 November 2026).
 *
 * From 1 November the third work on the Muse page is Art; the day's Scripture
 * moves into the ✝ beside the day's word. Each day lists one or more
 * paintings: the first is the work's title on the page, the others hang
 * beside it. Until the images are licensed and hosted, each painting is shown
 * as a colour study: "study" names a drawn study in app.js, otherwise the
 * palette is used. A day not listed here shows the painting the bank gives
 * its Scripture, or a plain study.
 *
 *   1 Nov: Niko's picks (Cole, Rembrandt).
 *   2–5 Nov: placeholders, the first painting the Art Wall lists for the
 *   day's theme, with the Art Wall's own line about it (Niko: "just a
 *   placeholder for nov 2-5, just use like the first option from the art
 *   library thats visible"). Palettes are Build's, for the colour study.
 */
window.POIESIS_ART = {
  "2026-11-01": { paintings: [
    { title: "The Voyage of Life: Old Age", artist: "Thomas Cole", date: "1842",
      medium: "Oil on canvas", where: "National Gallery of Art, Washington",
      link: "https://en.wikipedia.org/wiki/The_Voyage_of_Life", study: "oldage",
      palette: ["#2b3138", "#d9b56a", "#121617"] },
    { title: "The Return of the Prodigal Son", artist: "Rembrandt van Rijn", date: "c. 1668",
      medium: "Oil on canvas", where: "State Hermitage Museum, Saint Petersburg",
      link: "https://en.wikipedia.org/wiki/The_Return_of_the_Prodigal_Son_(Rembrandt)", study: "prodigal",
      palette: ["#1a110b", "#9c2f1c", "#d79a46"] }
  ]},
  "2026-11-02": { paintings: [
    { title: "The Gleaners", artist: "Jean-François Millet", date: "1857",
      note: "Gathering what the harvest left behind.",
      link: "https://en.wikipedia.org/wiki/The_Gleaners", placeholder: true,
      palette: ["#d9c48a", "#8a7a52", "#5e6a72"] }
  ]},
  "2026-11-03": { paintings: [
    { title: "Self-Portrait at the Age of 63", artist: "Rembrandt", date: "1669",
      note: "Painted the year he died, hiding nothing.",
      link: "https://en.wikipedia.org/wiki/Self-Portrait_at_the_Age_of_63", placeholder: true,
      palette: ["#c9925a", "#3a2716", "#1a120b"] }
  ]},
  "2026-11-04": { paintings: [
    { title: "The Death of Socrates", artist: "Jacques-Louis David", date: "1787",
      note: "Still teaching, his hand reaching for the cup.",
      link: "https://en.wikipedia.org/wiki/The_Death_of_Socrates", placeholder: true,
      palette: ["#d8d2c4", "#9a2b22", "#4a4f4a"] }
  ]},
  "2026-11-05": { paintings: [
    { title: "Found", artist: "Dante Gabriel Rossetti", date: "1854–81",
      note: "A man finds the woman he loved, collapsed against a wall at dawn. Rossetti never finished it.",
      link: "https://en.wikipedia.org/wiki/Found_(Rossetti)", placeholder: true,
      palette: ["#c9c2b4", "#7a4a3a", "#3f4a52"] }
  ]}
};
