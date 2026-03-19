import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Simple translation resources
const resources = {
    en: {
        translation: {
            "welcome": "Welcome",
            "dashboard": "Dashboard",
            "medications": "Medications",
            "attendance": "Attendance",
            "logout": "Logout",
            "video_consultation": "Video Consultation",
            "status_offline": "Status: Offline",
            "status_online": "Status: Online"
        }
    },
    es: {
        translation: {
            "welcome": "Bienvenido",
            "dashboard": "Tablero",
            "medications": "Medicamentos",
            "attendance": "Asistencia",
            "logout": "Cerrar sesión",
            "video_consultation": "Consulta de video",
            "status_offline": "Estado: Desconectado",
            "status_online": "Estado: En línea"
        }
    },
    fr: {
        translation: {
            "welcome": "Bienvenue",
            "dashboard": "Tableau de bord",
            "medications": "Médicaments",
            "attendance": "Présence",
            "logout": "Se déconnecter",
            "video_consultation": "Consultation vidéo",
            "status_offline": "Statut: Hors ligne",
            "status_online": "Statut: En ligne"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
