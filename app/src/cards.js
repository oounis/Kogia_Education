// Printable cards: one of the user's watercolor illustrations + a short
// attractive line, on a chosen colour with a decorative frame. Exported as a
// print-ready PDF.
export const art = n => `${import.meta.env.BASE_URL}art/${n}.png`

export const CARDS = [
  { id:'famille', img:'c33', text:'En famille, tout est plus doux.',        bg:'#FCE7E9', accent:'#E8748A', ink:'#8A3D4C' },
  { id:'maman',   img:'c16', text:'Dans les bras de Maman.',                bg:'#FFEEDF', accent:'#F0955A', ink:'#9A5A2E' },
  { id:'chien',   img:'c29', text:'Mon meilleur ami a quatre pattes.',      bg:'#EBF3DC', accent:'#7CAE4E', ink:'#4F6E2E' },
  { id:'chat',    img:'c64', text:'Un câlin qui ronronne.',                 bg:'#EFE7F8', accent:'#9B7BD0', ink:'#5E4690' },
  { id:'reve',    img:'c75', text:'Rêve grand, aime plus fort.',            bg:'#DFF1EF', accent:'#4FB0A6', ink:'#2E6E68' },
  { id:'sourire', img:'c28', text:'Ton sourire illumine tout.',            bg:'#FFF6D9', accent:'#EDB53A', ink:'#8F6E17' },
]
