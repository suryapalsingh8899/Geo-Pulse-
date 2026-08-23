import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  English: {
    translation: {
      settings: "Settings",
      language: "Language",
      darkMode: "Dark Mode",
      deleteAccount: "Delete Account",
      myArea: "My Area",
      recenter: "Recenter",
      events: "Events",
      addReport: "Add Report",
      addEvent: "Add Event",
      goBack: "Go back",
      reports: "Reports",
      locationAccess: "Location Access",
      areYouSure:
        "Are you sure you want to delete your account? This action cannot be undone.",
      accountDeleted: "Account deleted!",
      alertNotifications: "Alert Notifications",
    },
  },
  Hindi: {
    translation: {
      settings: "सेटिंग्स",
      language: "भाषा",
      darkMode: "डार्क मोड",
      deleteAccount: "खाता हटाएं",
      myArea: "मेरा क्षेत्र",
      recenter: "पुनः केंद्रित करें",
      events: "कार्यक्रम",
      addReport: "रिपोर्ट जोड़ें",
      addEvent: "कार्यक्रम जोड़ें",
      goBack: "वापस जाएं",
      reports: "रिपोर्ट्स",
      locationAccess: "स्थान पहुँच",
      areYouSure:
        "क्या आप वाकई अपना खाता हटाना चाहते हैं? इस कार्रवाई को पूर्ववत नहीं किया जा सकता।",
      accountDeleted: "खाता हटा दिया गया!",
      alertNotifications: "अलर्ट सूचनाएं",
    },
  },
  Spanish: {
    translation: {
      settings: "Ajustes",
      language: "Idioma",
      darkMode: "Modo Oscuro",
      deleteAccount: "Eliminar Cuenta",
      myArea: "Mi Área",
      recenter: "Centrar",
      events: "Eventos",
      addReport: "Añadir Informe",
      addEvent: "Añadir Evento",
      goBack: "Volver",
      reports: "Informes",
      locationAccess: "Acceso a la Ubicación",
      areYouSure:
        "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.",
      accountDeleted: "¡Cuenta eliminada!",
      alertNotifications: "Notificaciones de Alerta",
    },
  },
  French: {
    translation: {
      settings: "Paramètres",
      language: "Langue",
      darkMode: "Mode Sombre",
      deleteAccount: "Supprimer le Compte",
      myArea: "Mon Espace",
      recenter: "Recentrer",
      events: "Événements",
      addReport: "Ajouter un Rapport",
      addEvent: "Ajouter un Événement",
      goBack: "Retour",
      reports: "Rapports",
      locationAccess: "Accès à la Localisation",
      areYouSure:
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée.",
      accountDeleted: "Compte supprimé !",
      alertNotifications: "Notifications d'Alerte",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "English", // default language
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
