import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// À chaque changement de PAGE, on remonte en haut. Sans ça, cliquer « Demandes »
// depuis le bas d'une longue page ouvrait la nouvelle page à mi-hauteur — il
// fallait remonter à la main pour en voir le titre. On ne réagit qu'au chemin
// (pas à la recherche ni au hash) : le défilement d'une ancre dans une même
// page n'est pas interrompu. Saut INSTANTANÉ : html a scroll-behavior:smooth
// pour les ancres, mais faire défiler « en douceur » toute une longue page à
// chaque navigation serait lent et donnerait le vertige.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
