import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ChainedBackend from "i18next-chained-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import HttpApi from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    en: {
        translation: {
            "Welcome": "Welcome to Vesuvius",
            "Welcome describe": "Service for cargo transportation",
            "Russian": "Russian",
            "English": "English",
            "Vesuvius": "Vesuvius",
            "Language": "Language",
            "Search request": "Search request",
            "More": "More",
            "Login": "Login",
            "My account": "My account",
            "My company": "My company",
            "My requests": "My requests",


        }
    },
    ru: {
        translation: {
            "Welcome": "Добро пожаловат в Везувиус",
            "Welcome describe": "Сервис для грузоперевозок",
            "Russian": "Русский",
            "English": "Английский",
            "Vesuvius": "Везувиус",
            "Language": "Язык",
            "Search request": "Поиск заявки",
            "More": "Больше",
            "Login": "Войти",
            "My account": "Мой аккаунт",
            "My company": "Моя компания",
            "My requests": "Мои заявки",


        }
    }
};

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: resources,
        supportedLngs: ['en', 'ru'],
        fallbackLng: 'en',
        debug: false,
        detection: {
            order: ['path', 'cookie', 'htmlTag'],
            caches: ['cookie'],
        }
    })

export default i18n;