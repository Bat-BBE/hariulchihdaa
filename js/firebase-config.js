/*
 * Bestie — Firebase тохиргоо (сонголттой)
 * -----------------------------------------------------
 * Энэ апп localStorage дээр л ажиллана (ENABLED: false үед).
 * Гэхдээ линкээ өөр төхөөрөмж дээр нээвэл (найз нь өөр утас/компьютер
 * дээр нээнэ) мэдээлэл зөвхөн localStorage-д байвал харагдахгүй.
 * Тийм учраас найзууд үнэхээр өөр өөр төхөөрөмжөөс хариулахыг хүсвэл
 * доорх тохиргоог бөглөж, ENABLED-ийг true болго.
 *
 * Firebase console → Project settings → General → "Your apps" → SDK setup
 * хэсгээс config object-оо хуулаад энд буулгана:
 * https://console.firebase.google.com/project/emonos-c9418/
 *
 * Realtime Database-ийн Rules хэсэгт (MVP, бүртгэлгүй үед):
 * {
 *   "rules": {
 *     "quizzes": {
 *       ".read": true,
 *       ".write": true
 *     }
 *   }
 * }
 */
const BESTIE_FIREBASE_CONFIG = {
  ENABLED: false, // true болговол Firebase Realtime Database ашиглана
  apiKey: "",
  authDomain: "emonos-c9418.firebaseapp.com",
  databaseURL: "https://emonos-c9418-default-rtdb.firebaseio.com",
  projectId: "emonos-c9418",
  storageBucket: "emonos-c9418.appspot.com",
  messagingSenderId: "",
  appId: "",
};
