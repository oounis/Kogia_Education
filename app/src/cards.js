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
  { id:'livre',   img:'c18', text:'Un livre, mille aventures.',            bg:'#FFF0D8', accent:'#E0912F', ink:'#8A5A17' },
  { id:'lire2',   img:'c3',  text:'Lire à deux, c’est magique.',           bg:'#DEEBFF', accent:'#4F84E0', ink:'#2E518F' },
  { id:'amis',    img:'c51', text:'Les amis rendent tout plus beau.',      bg:'#E7F3D9', accent:'#5FA83C', ink:'#3E6E22' },
  { id:'effort',  img:'c50', text:'Aujourd’hui, je fais de mon mieux !',   bg:'#DBEFEC', accent:'#3FA79C', ink:'#256E64' },
  { id:'rever',   img:'c44', text:'Prends le temps de rêver.',            bg:'#EEE6F8', accent:'#8A6FC0', ink:'#57408F' },
  { id:'mamie',   img:'c60', text:'Auprès de Mamie, on se sent bien.',     bg:'#FDE8EC', accent:'#E06A86', ink:'#8F3A4E' },
]
