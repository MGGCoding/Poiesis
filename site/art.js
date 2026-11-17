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
/* 17–23 Nov (17 Nov): Niko's picks, every 'theme through the critics' work ("every piece that follows the theme thorugh the critics is great"). */
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
    { title: "The Money Changer and His Wife", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Le_pr%C3%AAteur_et_sa_femme_-_Quentin_Metsys_-_Mus%C3%A9e_du_Louvre_Peintures_INV_1444_%3B_MR_821.jpg/960px-Le_pr%C3%AAteur_et_sa_femme_-_Quentin_Metsys_-_Mus%C3%A9e_du_Louvre_Peintures_INV_1444_%3B_MR_821.jpg", artist: "Quentin Matsys", date: "1514",
      where: "Louvre, Paris",
      note: "He weighs coins; she has a prayer book open and is watching the scales.",
      link: "https://en.wikipedia.org/wiki/The_Money_Changer_and_His_Wife",
      palette: ["#6b5a3a", "#a8322a", "#2f4a5a"] }
  ]},
  "2026-11-18": { paintings: [
    { title: "The Sower", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Jean-Fran%C3%A7ois_Millet_-_The_Sower_-_Google_Art_Project.jpg/960px-Jean-Fran%C3%A7ois_Millet_-_The_Sower_-_Google_Art_Project.jpg", artist: "Jean-François Millet", date: "1850",
      where: "Museum of Fine Arts, Boston",
      note: "A man throws seed downhill at dusk, with birds already behind him.",
      link: "https://en.wikipedia.org/wiki/The_Sower_(Millet)",
      palette: ["#c9a86a", "#5a4a32", "#8a7a5a"] }
  ]},
  "2026-11-19": { paintings: [
    { title: "The Fighting Temeraire", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg/960px-The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg", artist: "J. M. W. Turner", date: "1838",
      where: "National Gallery, London",
      note: "An old warship towed to be broken up, under a burning sky.",
      link: "https://en.wikipedia.org/wiki/The_Fighting_Temeraire",
      palette: ["#e0a040", "#3a5a7a", "#2a2a2a"] }
  ]},
  "2026-11-20": { paintings: [
    { title: "The Awakening Conscience", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Hunt-AwakeningConscience1853.jpg/960px-Hunt-AwakeningConscience1853.jpg", artist: "William Holman Hunt", date: "1853",
      where: "Tate Britain, London",
      note: "A woman half rises from a man's lap, struck by something he hasn't noticed.",
      link: "https://en.wikipedia.org/wiki/The_Awakening_Conscience",
      palette: ["#3a5a3a", "#c8b48a", "#7a2b24"] }
  ]},
  "2026-11-21": { paintings: [
    { title: "The Angelus", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/17/JEAN-FRAN%C3%87OIS_MILLET_-_El_%C3%81ngelus_%28Museo_de_Orsay%2C_1857-1859._%C3%93leo_sobre_lienzo%2C_55.5_x_66_cm%29.jpg/960px-JEAN-FRAN%C3%87OIS_MILLET_-_El_%C3%81ngelus_%28Museo_de_Orsay%2C_1857-1859._%C3%93leo_sobre_lienzo%2C_55.5_x_66_cm%29.jpg", artist: "Jean-François Millet", date: "1857–59",
      where: "Musée d'Orsay, Paris",
      note: "Two people have stopped work in a field at dusk, before it is finished.",
      link: "https://en.wikipedia.org/wiki/The_Angelus_(painting)",
      palette: ["#8a7a4a", "#c9a86a", "#4a3a2a"] }
  ]},
  "2026-11-22": { paintings: [
    { title: "The Peasant Wedding", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Pieter_Bruegel_the_Elder_-_Peasant_Wedding_-_Google_Art_Project_2.jpg/960px-Pieter_Bruegel_the_Elder_-_Peasant_Wedding_-_Google_Art_Project_2.jpg", artist: "Pieter Bruegel the Elder", date: "1567",
      where: "Kunsthistorisches Museum, Vienna",
      note: "A barn full of people, not grain; dinner carried in on a door.",
      link: "https://en.wikipedia.org/wiki/The_Peasant_Wedding",
      palette: ["#a8322a", "#c9a86a", "#5a4a2a"] }
  ]},
  "2026-11-23": { paintings: [
    { title: "The Little Street", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Johannes_Vermeer_-_Gezicht_op_huizen_in_Delft%2C_bekend_als_%27Het_straatje%27_-_Google_Art_Project.jpg/960px-Johannes_Vermeer_-_Gezicht_op_huizen_in_Delft%2C_bekend_als_%27Het_straatje%27_-_Google_Art_Project.jpg", artist: "Johannes Vermeer", date: "c. 1657–58",
      where: "Rijksmuseum, Amsterdam",
      note: "A brick house, a woman sewing in a doorway, children on the pavement. Nothing happens.",
      link: "https://en.wikipedia.org/wiki/The_Little_Street",
      palette: ["#8a3a2a", "#e0d8c8", "#4a5a4a"] }
  ]},
  "2026-11-24": { paintings: [
    { title: "The Gulf Stream", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Winslow_Homer_-_The_Gulf_Stream_-_Metropolitan_Museum_of_Art.jpg/960px-Winslow_Homer_-_The_Gulf_Stream_-_Metropolitan_Museum_of_Art.jpg", artist: "Winslow Homer", date: "1899",
      where: "Metropolitan Museum of Art, New York",
      note: "A broken boat, sharks in the water, a storm coming. The man on deck is not panicking.",
      link: "https://en.wikipedia.org/wiki/The_Gulf_Stream_(painting)",
      palette: ["#2f6a7a", "#c9b48a", "#7a2a22"] }
  ]},
  "2026-11-25": { paintings: [
    { title: "Saying Grace", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/Le_B%C3%A9n%C3%A9dicit%C3%A9_de_Jean_Sim%C3%A9on_Chardin_%28cropped%29.jpg/960px-Le_B%C3%A9n%C3%A9dicit%C3%A9_de_Jean_Sim%C3%A9on_Chardin_%28cropped%29.jpg", artist: "Jean-Siméon Chardin", date: "c. 1740",
      where: "Louvre, Paris",
      note: "Supper is ready; the youngest says thanks before anyone eats.",
      link: "https://en.wikipedia.org/wiki/Saying_Grace_(Chardin)",
      palette: ["#6a5a3a", "#c8b89a", "#7a3a2a"] }
  ]},
  "2026-11-26": { paintings: [
    { title: "Supper at Emmaus", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Rembrandt_The_Supper_at_Emmaus.jpg/960px-Rembrandt_The_Supper_at_Emmaus.jpg", artist: "Rembrandt", date: "1648",
      where: "Louvre, Paris",
      note: "Two travellers at supper with a stranger; one of them has just understood.",
      link: "https://en.wikipedia.org/wiki/Supper_at_Emmaus_(Rembrandt,_Louvre)",
      palette: ["#4a3a22", "#c9a86a", "#2a221a"] }
  ]},
  "2026-11-27": { paintings: [
    { title: "The Milkmaid", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.png/960px-Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.png", artist: "Johannes Vermeer", date: "c. 1657–58",
      where: "Rijksmuseum, Amsterdam",
      note: "A kitchen maid pours milk into a bowl, slowly, with nobody watching.",
      link: "https://en.wikipedia.org/wiki/The_Milkmaid_(Vermeer)",
      palette: ["#c9a83a", "#2f4a7a", "#8a7a5a"] }
  ]},
  "2026-11-28": { paintings: [
    { title: "Luncheon of the Boating Party", img: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg/960px-Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg", artist: "Pierre-Auguste Renoir", date: "1880–81",
      where: "The Phillips Collection, Washington, D.C.",
      note: "After the rowing: friends linger over lunch on a terrace by the river.",
      link: "https://en.wikipedia.org/wiki/Luncheon_of_the_Boating_Party",
      palette: ["#c8b07a", "#3a5a7a", "#a8322a"] }
  ]}
};
