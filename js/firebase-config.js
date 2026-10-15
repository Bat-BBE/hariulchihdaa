/*
 * Bestie — Firebase тохиргоо
 * -----------------------------------------------------
 * ENABLED: true үед Realtime Database-ээр дамжуулж тест/хариултуудыг
 * бүх browser, бүх төхөөрөмжөөс хандаж болдог болгоно (localStorage бол
 * зөвхөн тухайн browser дээрээ л ажилладаг байсан).
 *
 * Realtime Database-ийн Rules хэсэгт (MVP, бүртгэлгүй үед) ийм байх ёстой:
 * {
 *   "rules": {
 *     "quizzes": {
 *       ".read": true,
 *       ".write": true
 *     }
 *   }
 * }
 * Console: https://console.firebase.google.com/project/emonos-c9418/database/emonos-c9418-default-rtdb/rules
 */
const BESTIE_FIREBASE_CONFIG = {
  ENABLED: true,
  apiKey: "AIzaSyBF3AjBX16-Zz_PrLZQTWWC62D6dnnVAjY",
  authDomain: "emonos-c9418.firebaseapp.com",
  databaseURL: "https://emonos-c9418-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "emonos-c9418",
  storageBucket: "emonos-c9418.firebasestorage.app",
  messagingSenderId: "387620022807",
  appId: "1:387620022807:web:45f5efc0e70fdcb29cca52",
};
