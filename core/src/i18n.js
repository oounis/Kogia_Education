// ════════════════════════════════════════════════════════════════════════════
// L'ARABE N'EST PAS UNE TRADUCTION — C'EST UNE DIRECTION.
//
// Pourquoi ce module existe (PLAN, carnet v2, chantier n°1) : l'absence d'arabe
// bloque TOUT le Golfe — le marché où vit Othman, et la Vague 2 annoncée
// publiquement sur kogiagroup.com. Un ERP à 60 % en arabe vaut mieux qu'un ERP
// à 90 % qu'aucune école de Manama ne peut lire.
//
// LA MÉTHODE (façon gettext) : le FRANÇAIS EST LA CLÉ. `t('Tableau de bord')`
// rend « لوحة المتابعة » en arabe, et le texte lui-même partout ailleurs.
// Aucune clé à inventer, aucun fichier de clés à synchroniser : si une
// traduction manque, l'écran retombe sur le français — jamais sur un trou.
// Et un test d'exécution garantit que la NAVIGATION, les NIVEAUX et les RÔLES
// sont couverts à 100 % : la dégradation gracieuse n'a pas le droit de grandir
// en silence.
//
// LES RÈGLES :
//  1. La langue est un choix d'APPAREIL (clé de stockage dédiée), pas une
//     donnée d'école : dans une même école du Golfe, la maîtresse française
//     lit en français et le parent en arabe.
//  2. `dir()` accompagne toujours la langue : l'arabe se lit de droite à
//     gauche, l'interface aussi — pas seulement les mots.
//  3. On n'ajoute une langue qu'avec son test de couverture.
// ════════════════════════════════════════════════════════════════════════════
import { getItem, setItem } from './storage.js'

export const LOCALES = {
  fr: { key: 'fr', label: 'Français', dir: 'ltr' },
  ar: { key: 'ar', label: 'العربية',  dir: 'rtl' },
}

const KEY = 'coreon_locale'
let cur = null

export function locale() {
  if (cur) return cur
  const s = getItem(KEY)
  cur = LOCALES[s] ? s : 'fr'
  return cur
}
export function setLocale(l) {
  if (!LOCALES[l]) return
  cur = l
  setItem(KEY, l)
}
export const dir = () => LOCALES[locale()].dir
export const isRTL = () => dir() === 'rtl'

/** Traduire. Le français est la clé ; s'il manque une entrée, il reste le texte. */
export function t(text) {
  if (!text || locale() === 'fr') return text
  return AR[text] || text
}

// ── Le dictionnaire arabe ────────────────────────────────────────────────────
// Arabe standard moderne, vocabulaire scolaire. Périmètre de la tranche 1 :
// l'écorce (navigation, rôles, niveaux, connexion) et le parcours public du
// parent (pré-inscription, pièces, reçu) — ce qu'un directeur du Golfe touche
// en premier. Les pages métier suivent, tranche par tranche.
export const AR = {
  // Navigation (nav.js — chaque libellé, y compris les variantes par rôle)
  'Tableau de bord': 'لوحة المتابعة',
  'Suivi en direct': 'المتابعة المباشرة',
  'Écoles': 'المدارس',
  'Comptes': 'الحسابات',
  'Inscriptions': 'التسجيلات',
  'Élèves': 'التلاميذ',
  'Enseignants': 'المعلّمون',
  'Personnel': 'الموظفون',
  'RH & Paie': 'الموارد البشرية والرواتب',
  'Comptabilité': 'المحاسبة',
  'Bulletins & passage': 'كشوف الأعداد والارتقاء',
  'Installations': 'المرافق',
  'Mon pointage': 'حضوري',
  'Évaluer': 'التقييم',
  'Dossier de l’enfant': 'ملف الطفل',
  'Journal du jour': 'يوميّات اليوم',
  'La journée de mon enfant': 'يوم طفلي',
  'Suivi élèves': 'متابعة التلاميذ',
  'Emploi du temps': 'جدول الأوقات',
  'Présence': 'الحضور',
  'Devoirs': 'الواجبات',
  'Examens': 'الامتحانات',
  'Frais & Finances': 'الرسوم والمالية',
  'Mes paiements': 'مدفوعاتي',
  'Bibliothèque': 'المكتبة',
  'Transport': 'النقل المدرسي',
  'Événements': 'الفعاليات',
  'Poste de sécurité': 'مركز الحراسة',
  'Espaces': 'الفضاءات',
  'Espace parents': 'فضاء الأولياء',
  'Espace enseignants': 'فضاء المعلّمين',
  'Espace personnel': 'فضاء الموظفين',
  'Incidents': 'الوقائع',
  'Accidents': 'الإصابات',
  'Déclarations d’accident': 'تصاريح الإصابات',
  'Demandes': 'المطالب',
  'Messages': 'الرسائل',
  'Annonces': 'الإعلانات',
  'Interopérabilité': 'تبادل البيانات',
  'Paramètres': 'الإعدادات',

  // Sections du menu (nav.js SECTIONS)
  'Au quotidien': 'اليومي',
  'Élèves & familles': 'التلاميذ والعائلات',
  'Pédagogie': 'البيداغوجيا',
  'Vie de l’école': 'حياة المدرسة',
  'Équipe': 'الفريق',
  'Finances': 'المالية',
  'Administration': 'الإدارة',

  // Rôles (theme.js)
  'Plateforme': 'المنصّة',
  'Direction': 'الإدارة العامة',
  'Enseignant': 'معلّم',
  'Surveillant': 'مراقب',
  'Sécurité': 'الحراسة',
  'Parent': 'وليّ',

  // Niveaux (levels.js)
  'Crèche': 'الحضانة',
  'Pré-maternelle': 'التمهيدي',
  'Maternelle 1': 'روضة 1',
  'Maternelle 2': 'روضة 2',
  '1ère année': 'السنة الأولى',
  '2ème année': 'السنة الثانية',
  '3ème année': 'السنة الثالثة',
  '4ème année': 'السنة الرابعة',
  '5ème année': 'السنة الخامسة',
  '6ème année': 'السنة السادسة',
  'Petite enfance': 'الطفولة المبكرة',
  'Primaire': 'الابتدائي',

  // Connexion
  'Bon retour': 'مرحبًا بعودتك',
  'Connectez-vous à votre portail.': 'سجّل الدخول إلى بوابتك.',
  'E-mail': 'البريد الإلكتروني',
  'Mot de passe': 'كلمة السر',
  'Se connecter': 'تسجيل الدخول',
  'E-mail ou mot de passe incorrect.': 'البريد الإلكتروني أو كلمة السر غير صحيحة.',
  'Ce compte a été désactivé. Contactez la direction.': 'هذا الحساب معطَّل. اتصلوا بالإدارة.',
  'Démo — connexion en un clic :': 'تجربة — دخول بنقرة واحدة:',
  'Pas un ERP scolaire de plus': 'ليس مجرّد نظام مدرسي آخر',
  'L\'école qu\'on a envie d\'ouvrir.': 'المدرسة التي يسعدنا أن نفتحها كل صباح.',

  // L'écorce (AppShell)
  'Rechercher…': 'بحث…',
  'Recherche globale (Ctrl+K)': 'بحث شامل (Ctrl+K)',
  'Recherche globale': 'بحث شامل',
  'Rechercher une page, un élève, un enseignant…': 'ابحث عن صفحة، تلميذ، معلّم…',
  'Notifications': 'الإشعارات',
  'Tout lire': 'قراءة الكل',
  'Aucune notification': 'لا إشعارات',
  'Déconnexion': 'تسجيل الخروج',
  'Ouvrir le menu': 'فتح القائمة',
  'Menu utilisateur': 'قائمة المستخدم',
  'Pages': 'الصفحات',
  'Aucun résultat pour': 'لا نتائج عن',

  // Pré-inscription publique — la porte d'entrée du parent
  'Pré-inscription': 'التسجيل الأولي',
  'Se connecter ': 'تسجيل الدخول ',
  'Quelques informations, une minute. Joignez les pièces si vous les avez — sinon l’école vous les demandera.':
    'بضع معلومات، دقيقة واحدة. أرفقوا الوثائق إن كانت لديكم — وإلا فستطلبها منكم المدرسة.',
  'Nom et prénom de l’enfant *': 'اسم الطفل ولقبه *',
  'Date de naissance *': 'تاريخ الولادة *',
  'Niveau demandé *': 'المستوى المطلوب *',
  'Le parent ou tuteur': 'الوليّ',
  'Votre nom *': 'اسمكم *',
  'Téléphone *': 'الهاتف *',
  'E-mail (facultatif)': 'البريد الإلكتروني (اختياري)',
  'Pièces (facultatif maintenant)': 'الوثائق (اختيارية الآن)',
  'Joignez ce que vous avez sous la main — une photo prise au téléphone suffit. Ce qui manque, l’école vous le demandera.':
    'أرفقوا ما هو متوفر لديكم — تكفي صورة بالهاتف. وما ينقص، ستطلبه منكم المدرسة.',
  'Rien n’est bloquant à cette étape.': 'لا شيء يعطّل التسجيل في هذه المرحلة.',
  'Un mot pour l’école (facultatif)': 'كلمة للمدرسة (اختياري)',
  'Envoyer ma candidature': 'إرسال المطلب',
  'Le nom de l’enfant est requis.': 'اسم الطفل مطلوب.',
  'La date de naissance est requise.': 'تاريخ الولادة مطلوب.',
  'Choisissez un niveau.': 'اختاروا مستوى.',
  'Votre nom est requis.': 'اسمكم مطلوب.',
  'Un numéro joignable, s’il vous plaît.': 'رقم هاتف يمكن الاتصال به، من فضلكم.',
  'Candidature reçue.': 'تم استلام المطلب.',
  'Votre référence': 'مرجعكم',
  'Retour à l’accueil': 'العودة إلى الاستقبال',
  'par Kogia Group': 'من Kogia Group',

  // Pièces (admissions.js DOCS + Attach)
  'Acte de naissance': 'شهادة الميلاد',
  'Photo d’identité': 'صورة شمسية',
  'Carnet de vaccination': 'دفتر التطعيمات',
  'Bulletin de l’école précédente': 'كشف أعداد المدرسة السابقة',
  'Justificatif de domicile': 'إثبات محل السكن',
  'Joindre': 'إرفاق',
  'Remplacer': 'استبدال',
  'Ouvrir': 'فتح',
  'Lecture…': 'جارٍ القراءة…',
}
