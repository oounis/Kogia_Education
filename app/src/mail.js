// ════════════════════════════════════════════════════════════════════════════
// L'ENVOI D'EMAIL CÔTÉ NAVIGATEUR — de vrais emails au candidat depuis le site
// statique, sans backend, via EmailJS (leur clé publique est faite pour ça).
//
// Expéditeur : contact@kogiagroup.com (configuré dans le service/template
// EmailJS). Les 3 identifiants PUBLICS (service, template, clé) sont lus depuis
// localStorage — donc activables sur le site DÉPLOYÉ sans reconstruire :
//
//   localStorage.setItem('coreon_emailjs', JSON.stringify({
//     service:  'service_xxx',   // EmailJS → Email Services
//     template: 'template_xxx',  // EmailJS → Email Templates (variables ci-dessous)
//     key:      'public_xxx',    // EmailJS → Account → Public Key
//   }))
//
// Le template EmailJS doit utiliser ces variables :
//   To Email = {{to_email}} · Subject = {{subject}} · Content = {{message}}
//   From Name = {{from_name}} · Reply-To = {{reply_to}}
//
// SANS clé : aucun envoi. `admissions.js` marque alors l'email « préparé »
// (journalisé, jamais faussé) — on n'affiche jamais « envoyé » à tort.
// ════════════════════════════════════════════════════════════════════════════
const ls = () => window.localStorage
const SENDER = 'contact@kogiagroup.com'

export function mailCfg() {
  try {
    const raw = ls().getItem('coreon_emailjs')
    if (!raw) return null
    const c = JSON.parse(raw)
    return (c && c.service && c.template && c.key) ? c : null
  } catch { return null }
}
export const mailReady = () => !!mailCfg()

export async function emailjsSend(mail) {
  const c = mailCfg()
  if (!c) throw new Error('email non configuré')
  if (!mail?.to) throw new Error('destinataire manquant')
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      service_id: c.service,
      template_id: c.template,
      user_id: c.key,
      template_params: {
        to_email: mail.to,
        subject: mail.subject,
        message: mail.text,
        from_name: 'Coreon EDU — KogiaGroup',
        reply_to: SENDER,
      },
    }),
  })
  if (!res.ok) throw new Error('EmailJS ' + res.status)
  return true
}
