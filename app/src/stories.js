// "Le Coin des Histoires" — vrais petits livres illustrés (5 pages), écrits pour les enfants.
const A=import.meta.env.BASE_URL
const img=n=>`${A}library/${n}.jpg`
export const storyImg=img

export const STORIES=[
  {
    id:'lina-graine', title:'Lina et la graine magique', subtitle:'Une histoire de patience', cat:'Nature', color:'#22C55E', cover:19,
    moral:'La patience et les petits soins font pousser de grandes choses.',
    pages:[
      {n:18, t:'Un matin de printemps, grand-mère offrit à Lina une toute petite graine grise. « Plante-la, arrose-la chaque jour, et sois patiente », lui dit-elle en souriant. Lina choisit le plus joli pot du jardin et y déposa la graine avec beaucoup de soin.'},
      {n:34, t:'Chaque matin avant l’école, Lina donnait un peu d’eau à sa graine. Un jour, puis deux, puis toute une semaine… mais rien ne poussait. « Peut-être qu’elle dort encore », pensa Lina, et elle continua sans se décourager.'},
      {n:19, t:'Enfin, un petit bout vert sortit de la terre ! Lina sauta de joie. La tige grandissait vers le soleil, un peu plus haut chaque jour, comme si elle voulait toucher le ciel. Lina lui parlait doucement chaque matin.'},
      {n:20, t:'Bientôt, une magnifique fleur s’ouvrit, entourée de dizaines d’autres. Le jardin de Lina était devenu un vrai tapis de couleurs. Les abeilles vinrent danser, et tout le quartier s’arrêtait pour admirer.'},
      {n:50, t:'Lina offrit des graines à tous ses amis, et ensemble ils plantèrent un grand jardin pour l’école. « Tu vois, dit grand-mère, une petite graine et un peu de patience peuvent changer tout un jardin. » Et Lina n’oublia jamais cette leçon.'},
    ],
  },
  {
    id:'sami-ecole', title:'Le premier jour de Sami', subtitle:'Une histoire de courage', cat:'École', color:'#6C5CE7', cover:37,
    moral:'Un peu de courage suffit pour se faire de vrais amis.',
    pages:[
      {n:30, t:'C’était le premier jour d’école de Sami, et son cœur battait très fort. « Et si je ne connaissais personne ? » se demandait-il en serrant la main de sa maman devant la maison. Maman l’embrassa : « Tu vas voir, tout ira bien. »'},
      {n:37, t:'Le grand bus jaune arriva en klaxonnant joyeusement. Sami respira un grand coup, dit au revoir de la main, et monta la première marche. À l’intérieur, plein d’enfants riaient déjà. Il s’assit près de la fenêtre, un peu timide.'},
      {n:49, t:'En classe, la maîtresse ouvrit un grand livre et lut une histoire pleine d’aventures. Sami écoutait, les yeux grands ouverts. À côté de lui, un garçon nommé Karim lui sourit et lui montra une image rigolote.'},
      {n:12, t:'À la récréation, Sami resta d’abord tout seul dans un coin. Puis Karim l’appela : « Viens jouer avec nous ! » Sami hésita une seconde… puis courut les rejoindre. Bientôt, il riait aussi fort que les autres.'},
      {n:46, t:'De retour en classe, Sami et Karim dessinèrent ensemble leur plus belle journée. En rentrant à la maison, Sami dit à sa maman : « J’ai un nouvel ami, et j’ai hâte d’y retourner demain ! » Il avait vaincu sa timidité.'},
    ],
  },
  {
    id:'gardiens-terre', title:'Les gardiens de la Terre', subtitle:'Une aventure pour la planète', cat:'Écologie', color:'#0EA5E9', cover:6,
    moral:'Chaque petit geste aide à protéger notre planète.',
    pages:[
      {n:6, t:'Un jour, la maîtresse montra une grande image de la Terre. « Notre planète est belle, mais elle a besoin de nous », dit-elle. Amira, Youssef et leurs amis se regardèrent et firent une promesse : devenir les gardiens de la Terre.'},
      {n:11, t:'Le samedi, toute la bande se retrouva dans la cour de l’école, munie de petites pelles. Ils creusèrent, plantèrent des arbres, et arrosèrent chaque pousse. « Un jour, ils seront plus grands que nous ! » s’exclama Youssef.'},
      {n:27, t:'Le dimanche, ils partirent en randonnée dans la montagne. En chemin, ils ramassèrent les papiers oubliés par d’autres. Leurs sacs se remplissaient, mais leurs cœurs aussi : la forêt redevenait propre grâce à eux.'},
      {n:48, t:'Le soir venu, ils plantèrent une tente et s’installèrent autour d’un petit feu. En regardant les étoiles, ils imaginaient un monde tout vert et tout bleu. « Demain, on continuera », murmura Amira avant de s’endormir.'},
      {n:24, t:'Au petit matin, le soleil se leva sur une nature plus belle encore. Les gardiens de la Terre étaient fiers : ils avaient compris qu’à plusieurs, même les petits gestes peuvent tout changer. Et toi, veux-tu devenir gardien toi aussi ?'},
    ],
  },
  {
    id:'nour-chien', title:'Nour et le chien de la pluie', subtitle:'Une histoire de gentillesse', cat:'Animaux', color:'#FF6B81', cover:21,
    moral:'La gentillesse envers les animaux rend le monde plus doux.',
    pages:[
      {n:21, t:'Il pleuvait très fort ce jour-là. En rentrant de l’école, Nour aperçut un petit chien tout trempé, tremblant de froid sous un banc. Il la regarda avec de grands yeux tristes. Nour ne pouvait pas le laisser là.'},
      {n:41, t:'Elle le prit doucement dans ses bras et courut jusqu’à la maison. « Maman, il a froid et il a peur ! » Sa maman prépara une serviette bien chaude, et le petit chien remua la queue pour la première fois.'},
      {n:36, t:'Nour lui donna un bon bain avec du savon qui sentait bon. Elle lava chaque patte, puis le sécha jusqu’à ce que son poil redevienne tout doux et brillant. « Voilà, maintenant tu es tout propre ! » dit-elle fièrement.'},
      {n:31, t:'À table, Nour partagea son repas avec son nouvel ami. Le chien mangea de bon appétit, puis posa sa tête sur les genoux de Nour, tout content. On aurait dit qu’il souriait.'},
      {n:42, t:'Depuis ce jour, le petit chien ne quitta plus Nour. Ils jouaient ensemble dans le jardin et se promenaient main dans la patte. Nour avait appris qu’un geste de gentillesse pouvait sauver un ami pour la vie.'},
    ],
  },
  {
    id:'fete-ecole', title:'La grande fête de l’école', subtitle:'Une histoire d’amitié', cat:'Fête', color:'#F59E0B', cover:13,
    moral:'Ensemble, on peut créer quelque chose de merveilleux.',
    pages:[
      {n:16, t:'L’école préparait une grande fête, et chaque enfant avait un rôle. Assis en cercle, ils feuilletaient un grand livre d’idées. « On va faire un spectacle magnifique ! » dit Mariem, les yeux brillants d’excitation.'},
      {n:13, t:'Mariem répétait sa chanson avec sa petite guitare. Au début, ses doigts se trompaient et sa voix tremblait. Mais ses amis l’encourageaient : « Tu chantes comme un rossignol ! » Alors elle recommençait, de plus en plus sûre d’elle.'},
      {n:40, t:'Pendant ce temps, les autres fabriquaient des décorations : des guirlandes de couleurs, des dessins et des affiches joyeuses. Chacun apportait son talent, et la salle se remplissait peu à peu de mille couleurs.'},
      {n:47, t:'Le jour de la fête arriva enfin ! Les familles montèrent dans le petit train pour venir à l’école. Tout le monde riait, applaudissait, et Mariem chanta sans se tromper une seule fois. Quel triomphe !'},
      {n:1, t:'À la fin, tous les enfants se donnèrent la main sur la colline pour saluer. « On a réussi, parce qu’on l’a fait ensemble ! » cria Mariem. Et ce fut la plus belle fête que l’école ait jamais connue.'},
    ],
  },
]
