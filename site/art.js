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
/* Round 30 (3 Nov): "img" is the painting itself, taken from the Art Wall
   (Wikimedia Commons, public domain); the colour study shows if it fails to load. */
/* 15–19 Nov (15 Nov): the art chat's picks, one a day, chosen for Niko; cards in muse-bank/art/. */
window.POIESIS_ART = {
  "2026-11-01": { paintings: [
    { title: "The Voyage of Life: Old Age", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Thomas_Cole_-_The_Voyage_of_Life_Old_Age%2C_1842_%28National_Gallery_of_Art%29.jpg/960px-Thomas_Cole_-_The_Voyage_of_Life_Old_Age%2C_1842_%28National_Gallery_of_Art%29.jpg", artist: "Thomas Cole", date: "1842",
      medium: "Oil on canvas", where: "National Gallery of Art, Washington",
      link: "https://en.wikipedia.org/wiki/The_Voyage_of_Life", study: "oldage",
      palette: ["#2b3138", "#d9b56a", "#121617"] },
    { title: "The Return of the Prodigal Son", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Bartolom%C3%A9_Esteban_Murillo%2C_The_Return_of_the_Prodigal_Son%2C_1667-1670%2C_NGA_34956.jpg/960px-Bartolom%C3%A9_Esteban_Murillo%2C_The_Return_of_the_Prodigal_Son%2C_1667-1670%2C_NGA_34956.jpg", artist: "Rembrandt van Rijn", date: "c. 1668",
      medium: "Oil on canvas", where: "State Hermitage Museum, Saint Petersburg",
      link: "https://en.wikipedia.org/wiki/The_Return_of_the_Prodigal_Son_(Rembrandt)", study: "prodigal",
      palette: ["#1a110b", "#9c2f1c", "#d79a46"] }
  ]},
  "2026-11-02": { paintings: [
    { title: "The Gleaners", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg/960px-Jean-Fran%C3%A7ois_Millet_-_Gleaners_-_Google_Art_Project_2.jpg", artist: "Jean-François Millet", date: "1857",
      note: "Gathering what the harvest left behind.",
      link: "https://en.wikipedia.org/wiki/The_Gleaners", placeholder: true,
      palette: ["#d9c48a", "#8a7a52", "#5e6a72"] }
  ]},
  "2026-11-03": { paintings: [
    { title: "Self-Portrait at the Age of 63", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Rembrandt%2C_Self_Portrait_at_the_Age_of_63.jpg/960px-Rembrandt%2C_Self_Portrait_at_the_Age_of_63.jpg", artist: "Rembrandt", date: "1669",
      note: "Painted the year he died, hiding nothing.",
      link: "https://en.wikipedia.org/wiki/Self-Portrait_at_the_Age_of_63", placeholder: true,
      palette: ["#c9925a", "#3a2716", "#1a120b"] }
  ]},
  "2026-11-04": { paintings: [
    { title: "The Death of Socrates", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/David_-_The_Death_of_Socrates.jpg/960px-David_-_The_Death_of_Socrates.jpg", artist: "Jacques-Louis David", date: "1787",
      note: "Still teaching, his hand reaching for the cup.",
      link: "https://en.wikipedia.org/wiki/The_Death_of_Socrates", placeholder: true,
      palette: ["#d8d2c4", "#9a2b22", "#4a4f4a"] }
  ]},
  "2026-11-05": { paintings: [
    { title: "Found", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Dante_Gabriel_Rossetti_-_Found_%281859%29_Google_Art_Project.jpg/960px-Dante_Gabriel_Rossetti_-_Found_%281859%29_Google_Art_Project.jpg", artist: "Dante Gabriel Rossetti", date: "1854–81",
      note: "A man finds the woman he loved, collapsed against a wall at dawn. Rossetti never finished it.",
      link: "https://en.wikipedia.org/wiki/Found_(Rossetti)", placeholder: true,
      palette: ["#c9c2b4", "#7a4a3a", "#3f4a52"] }
  ]},
  "2026-11-15": { paintings: [
    { title: "The Good Samaritan (after Delacroix)", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Vincent_van_Gogh_-_The_Good_Samaritan%2C_1890_-_Google_Art_Project.jpg/960px-Vincent_van_Gogh_-_The_Good_Samaritan%2C_1890_-_Google_Art_Project.jpg", artist: "Vincent van Gogh", date: "1890",
      medium: "Oil on canvas", where: "Kröller-Müller Museum, Otterlo",
      note: "Heaving a stranger onto his own horse; two figures walk away down the road.",
      link: "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_The_Good_Samaritan,_1890_-_Google_Art_Project.jpg",
      palette: ["#d9c56a", "#3f6f8f", "#b5532e"] }
  ]},
  "2026-11-16": { paintings: [
    { title: "The Calling of Saint Matthew", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Caravaggio_%E2%80%94_The_Calling_of_Saint_Matthew.jpg/960px-Caravaggio_%E2%80%94_The_Calling_of_Saint_Matthew.jpg", artist: "Caravaggio", date: "1599–1600",
      medium: "Oil on canvas", where: "Contarelli Chapel, San Luigi dei Francesi, Rome",
      note: "A hand points across a counting table. One man hasn't looked up.",
      link: "https://en.wikipedia.org/wiki/The_Calling_of_Saint_Matthew",
      palette: ["#2a211a", "#b9894a", "#7a2e22"] }
  ]},
  "2026-11-17": { paintings: [
    { title: "Zacchaeus in the Sycamore Awaiting the Passage of Jesus", img: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Brooklyn_Museum_-_Zacchaeus_in_the_Sycamore_Awaiting_the_Passage_of_Jesus_%28Zach%C3%A9e_sur_le_sycomore_attendant_le_passage_de_J%C3%A9sus%29_-_James_Tissot.jpg", artist: "James Tissot", date: "1886–96",
      medium: "Opaque watercolour over graphite", where: "Brooklyn Museum, New York",
      note: "A rich man up a tree like a boy, waiting to get a look.",
      link: "https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&type=image&search=Tissot%20Zacchaeus%20in%20the%20sycamore",
      palette: ["#cdbf9c", "#6f7f4f", "#8a5a3c"] }
  ]},
  "2026-11-18": { paintings: [
    { title: "The Parable of the Talents (or Minas)", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Willem_de_Poorter%27s_The_Parable_of_The_Talents_or_Minas.png?width=960", artist: "Willem de Poorter", date: "17th century (c. 1630s)",
      medium: "Oil on panel, 45 × 55 cm", where: "National Gallery Prague",
      note: "A servant gives his account of the coin he kept safe.",
      link: "https://commons.wikimedia.org/wiki/File:Willem_de_Poorter%27s_The_Parable_of_The_Talents_or_Minas.png",
      palette: ["#3a2e22", "#b08a4e", "#d8cdb4"] }
  ]},
  "2026-11-19": { paintings: [
    { title: "The Parable of the Unjust Steward", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Parable_of_the_Unjust_Steward_Marinus_van_Reymerswaele.jpg?width=960", artist: "Marinus van Reymerswaele", date: "c. 1540",
      medium: "Oil on oak panel, 77 × 96.5 cm", where: "Kunsthistorisches Museum, Vienna (Gemäldegalerie, inv. 962)",
      note: "A steward before his master, the books between them.",
      link: "https://www.khm.at/en/artworks/gleichnis-vom-untreuen-verwalter-1536",
      palette: ["#7a2b24", "#c8b48a", "#2f3a36"] }
  ]}
};
