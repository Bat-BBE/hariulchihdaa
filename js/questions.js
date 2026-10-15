/* Bestie — асуултын сан (question bank) */
const QUESTION_CATEGORIES = [
  { id: "food", label: "Хоол & амттан", emoji: "🍜" },
  { id: "habit", label: "Өдөр тутмын зуршил", emoji: "⏰" },
  { id: "dream", label: "Мөрөөдөл & зорилго", emoji: "🌍" },
  { id: "fun", label: "Хөгжилтэй дурсамж", emoji: "🙈" },
  { id: "music", label: "Дуу & хөгжим", emoji: "🎵" },
  { id: "style", label: "Зан чанар & style", emoji: "✨" },
  { id: "drink", label: "Дуртай ундаа", emoji: "🧋" },
  { id: "friend", label: "Найзын төрөл", emoji: "🫂" },
];

const QUESTION_BANK = [
  // 🍜 Хоол & амттан
  { id: "f1", cat: "food", emoji: "🍜", text: "Миний хамгийн дуртай хоол юу вэ?", options: [
    { id: "a", emoji: "🍲", text: "Халуун шөлтэй хоол" },
    { id: "b", emoji: "🍕", text: "Пицца & фастфүүд" },
    { id: "c", emoji: "🍣", text: "Суши & япон хоол" },
    { id: "d", emoji: "🥘", text: "Монгол уламжлалт хоол" },
  ]},
  { id: "f2", cat: "food", emoji: "🍰", text: "Амтлаг зүйлсээс юуг илүүд үзэх вэ?", options: [
    { id: "a", emoji: "🍫", text: "Шоколад" },
    { id: "b", emoji: "🍦", text: "Зайрмаг" },
    { id: "c", emoji: "🧁", text: "Жигнэмэг, бялуу" },
    { id: "d", emoji: "🍬", text: "Чихэр, жимс" },
  ]},
  { id: "f3", cat: "food", emoji: "🌶️", text: "Хоолны амтны хувьд би юунд дуртай вэ?", options: [
    { id: "a", emoji: "🌶️", text: "Халуун ногоотой" },
    { id: "b", emoji: "🍋", text: "Исгэлэн амттай" },
    { id: "c", emoji: "🧂", text: "Давстай, шарсан" },
    { id: "d", emoji: "🍯", text: "Чихэрлэг амттай" },
  ]},
  { id: "f4", cat: "food", emoji: "☕", text: "Өглөөгүүр юугаар эхэлдэг вэ?", options: [
    { id: "a", emoji: "☕", text: "Кофегүйгээр сэрдэггүй" },
    { id: "b", emoji: "🍵", text: "Сүүтэй цай" },
    { id: "c", emoji: "🥐", text: "Хөнгөн зууш" },
    { id: "d", emoji: "😴", text: "Юу ч идэхгүй, унтаад байхыг хүсдэг" },
  ]},
  { id: "f5", cat: "food", emoji: "🍳", text: "Хоол хийхдээ би ямар түвшинд байдаг вэ?", options: [
    { id: "a", emoji: "👨‍🍳", text: "Их сайн хийдэг" },
    { id: "b", emoji: "🍳", text: "Энгийн зүйл хийж чаддаг" },
    { id: "c", emoji: "🔥", text: "Хоол шатаах магадлал өндөр" },
    { id: "d", emoji: "🥡", text: "Захиалдаг нь амар" },
  ]},

  // ⏰ Өдөр тутмын зуршил
  { id: "h1", cat: "habit", emoji: "😴", text: "Би өглөө хэдэн цагт сэрдэг вэ?", options: [
    { id: "a", emoji: "🌅", text: "6-7 цагт — эрт боссон хүн" },
    { id: "b", emoji: "⏰", text: "8-9 цагт — цагтай тэмцдэг" },
    { id: "c", emoji: "😵", text: "10-аас хойш — заримдаа хоцордог" },
    { id: "d", emoji: "🌙", text: "Шөнийн хүн, өдрийн дундуур сэрдэг" },
  ]},
  { id: "h2", cat: "habit", emoji: "📱", text: "Чөлөөт цагаараа ихэвчлэн юу хийдэг вэ?", options: [
    { id: "a", emoji: "📱", text: "Утсаараа scroll хийх" },
    { id: "b", emoji: "🎮", text: "Тоглоом тоглох" },
    { id: "c", emoji: "📚", text: "Ном унших, суралцах" },
    { id: "d", emoji: "👯", text: "Найзуудтайгаа уулзах" },
  ]},
  { id: "h3", cat: "habit", emoji: "🛏️", text: "Унтахаасаа өмнө юу хийдэг вэ?", options: [
    { id: "a", emoji: "🎧", text: "Хөгжим сонсдог" },
    { id: "b", emoji: "📱", text: "Утсаараа үзэж байгаад унтдаг" },
    { id: "c", emoji: "📖", text: "Ном уншдаг" },
    { id: "d", emoji: "💭", text: "Маргаашийн төлөвлөгөөгөө бодож хэвтдэг" },
  ]},
  { id: "h4", cat: "habit", emoji: "🧹", text: "Миний өрөө ямар байдаг вэ?", options: [
    { id: "a", emoji: "✨", text: "Үргэлж цэвэрхэн, эмх цэгцтэй" },
    { id: "b", emoji: "📚", text: "Санамсаргүй мэт ч өөрийн эмхтэй" },
    { id: "c", emoji: "🌪️", text: "Заримдаа эмх замбараагүй болдог" },
    { id: "d", emoji: "😅", text: "Байнга цэгцлэх шаардлагатай" },
  ]},
  { id: "h5", cat: "habit", emoji: "🏃", text: "Долоо хоногт хичнээн удаа дасгал хийдэг вэ?", options: [
    { id: "a", emoji: "💪", text: "Бараг өдөр бүр" },
    { id: "b", emoji: "🚶", text: "2-3 удаа л" },
    { id: "c", emoji: "😴", text: "Ховорхон" },
    { id: "d", emoji: "🙅", text: "Бараг хийдэггүй" },
  ]},

  // 🌍 Мөрөөдөл & зорилго
  { id: "d1", cat: "dream", emoji: "🌍", text: "Би хаашаа очихыг хамгийн их мөрөөддөг вэ?", options: [
    { id: "a", emoji: "🗼", text: "Европ руу" },
    { id: "b", emoji: "🌸", text: "Ази руу (Япон, Солонгос гэх мэт)" },
    { id: "c", emoji: "🏖️", text: "Халуун орны арал руу" },
    { id: "d", emoji: "🏔️", text: "Монголын хөдөө орон нутаг руу" },
  ]},
  { id: "d2", cat: "dream", emoji: "💼", text: "10 жилийн дараа би хаана байх вэ гэж бодож байна?", options: [
    { id: "a", emoji: "💼", text: "Том компанид ажиллаж" },
    { id: "b", emoji: "🚀", text: "Өөрийн бизнестэй" },
    { id: "c", emoji: "🎨", text: "Урлаг, бүтээлч ажил хийж" },
    { id: "d", emoji: "🌏", text: "Гадаадад амьдарч" },
  ]},
  { id: "d3", cat: "dream", emoji: "🏆", text: "Миний нууц авьяас юу вэ?", options: [
    { id: "a", emoji: "🎤", text: "Дуу дуулах" },
    { id: "b", emoji: "💃", text: "Бүжиглэх" },
    { id: "c", emoji: "🎨", text: "Зурах, бүтээлч санаа" },
    { id: "d", emoji: "🧠", text: "Хурдан шийдвэр гаргах" },
  ]},
  { id: "d4", cat: "dream", emoji: "📚", text: "Сурч байхаар сонгосон мэргэжил юу вэ?", options: [
    { id: "a", emoji: "💻", text: "IT / Технологи" },
    { id: "b", emoji: "🎨", text: "Дизайн / Урлаг" },
    { id: "c", emoji: "💼", text: "Бизнес / Санхүү" },
    { id: "d", emoji: "🩺", text: "Эрүүл мэнд / Шинжлэх ухаан" },
  ]},

  // 🙈 Хөгжилтэй дурсамж
  { id: "fu1", cat: "fun", emoji: "😂", text: "Найзуудтайгаа хамгийн их ямар үед инээдэг вэ?", options: [
    { id: "a", emoji: "🎮", text: "Хамтдаа тоглоом тоглож байхад" },
    { id: "b", emoji: "🚗", text: "Хаа нэг газар явж байхдаа" },
    { id: "c", emoji: "🎉", text: "Найрсаг цугларалт дээр" },
    { id: "d", emoji: "📸", text: "Зураг авч байхдаа" },
  ]},
  { id: "fu2", cat: "fun", emoji: "🎭", text: "Би ямар нөхцөлд хамгийн их инээдтэй болдог вэ?", options: [
    { id: "a", emoji: "😆", text: "Ядарч байхдаа" },
    { id: "b", emoji: "👯", text: "Ойрхон найзуудтайгаа л" },
    { id: "c", emoji: "🎬", text: "Инээдмийн кино үзэхэд" },
    { id: "d", emoji: "🍹", text: "Чөлөөтэй цагт" },
  ]},
  { id: "fu3", cat: "fun", emoji: "🎪", text: "Хамгийн чамин зуршил юу вэ гэж найзууд маань бодож байна вэ?", options: [
    { id: "a", emoji: "🗣️", text: "Ганцаараа байхдаа чангаар ярьдаг" },
    { id: "b", emoji: "🎵", text: "Дуу дуулж алхдаг" },
    { id: "c", emoji: "📝", text: "Жагсаалт бичих дуртай" },
    { id: "d", emoji: "🍿", text: "Нэг киног олон удаа үздэг" },
  ]},

  // 🎵 Дуу & хөгжим
  { id: "m1", cat: "music", emoji: "🎵", text: "Би одоо ямар төрлийн дуу сонсож байна вэ?", options: [
    { id: "a", emoji: "🎤", text: "K-pop" },
    { id: "b", emoji: "🎸", text: "Pop / Rock" },
    { id: "c", emoji: "🎧", text: "Lofi / Chill" },
    { id: "d", emoji: "🇲🇳", text: "Монгол дуу" },
  ]},
  { id: "m2", cat: "music", emoji: "🎤", text: "Караоке дээр юу дуулдаг вэ?", options: [
    { id: "a", emoji: "💔", text: "Эмоцлог дуу" },
    { id: "b", emoji: "🎉", text: "Хөөрхөн, хөгжилтэй дуу" },
    { id: "c", emoji: "🚫", text: "Би дуулдаггүй" },
    { id: "d", emoji: "🔥", text: "Юу ч өгнө, бүгдийг нь дуулна" },
  ]},
  { id: "m3", cat: "music", emoji: "🎬", text: "Би ямар кино/сериалд дуртай вэ?", options: [
    { id: "a", emoji: "😂", text: "Инээдмийн" },
    { id: "b", emoji: "😭", text: "Романтик, мелодрам" },
    { id: "c", emoji: "👻", text: "Айдас хүргэм" },
    { id: "d", emoji: "🎬", text: "Экшн / adventure" },
  ]},

  // ✨ Зан чанар & style
  { id: "s1", cat: "style", emoji: "🎨", text: "Чи ямар aesthetic вэ?", options: [
    { id: "a", emoji: "🌸", text: "Soft girl / boy" },
    { id: "b", emoji: "🖤", text: "Dark academia" },
    { id: "c", emoji: "✨", text: "Y2K" },
    { id: "d", emoji: "🧸", text: "Cozy / comfy" },
  ]},
  { id: "s2", cat: "style", emoji: "🗣️", text: "Найзуудын дунд би ямар хүн вэ?", options: [
    { id: "a", emoji: "🎉", text: "Хамгийн чангаар ярьдаг, тоглодог" },
    { id: "b", emoji: "👂", text: "Чимээгүйхэн ажиглаж сонсдог" },
    { id: "c", emoji: "😄", text: "Хошигнож инээлгэдэг" },
    { id: "d", emoji: "🤝", text: "Бусдыгаа холбож нэгтгэдэг" },
  ]},
  { id: "s3", cat: "style", emoji: "💭", text: "Шийдвэр гаргахдаа би хэрхэн ханддаг вэ?", options: [
    { id: "a", emoji: "⚡", text: "Хурдан, зоригтой" },
    { id: "b", emoji: "🧠", text: "Нухацтай бодож байж" },
    { id: "c", emoji: "👥", text: "Бусдаасаа асууж байж" },
    { id: "d", emoji: "❤️", text: "Зүрхээрээ мэдэрч" },
  ]},
  { id: "s4", cat: "style", emoji: "🌈", text: "Хувцаслах style-ийн хувьд би юунд дуртай вэ?", options: [
    { id: "a", emoji: "🖤", text: "Хар, minimal" },
    { id: "b", emoji: "🌸", text: "Пастел, хөөрхөн өнгө" },
    { id: "c", emoji: "👟", text: "Streetwear, loose" },
    { id: "d", emoji: "✨", text: "Trendy, яг л одоогийн загвар" },
  ]},

  // 🧋 Дуртай ундаа
  { id: "dr1", cat: "drink", emoji: "🧋", text: "Чи ямар ундаа вэ?", options: [
    { id: "a", emoji: "🧋", text: "Сүүтэй цай / Boba" },
    { id: "b", emoji: "☕", text: "Эспрессо" },
    { id: "c", emoji: "🍓", text: "Жимсний smoothie" },
    { id: "d", emoji: "🥤", text: "Хүйтэн ундаа" },
  ]},
  { id: "dr2", cat: "drink", emoji: "🍹", text: "Найзуудтайгаа хаана уулзах дуртай вэ?", options: [
    { id: "a", emoji: "☕", text: "Кофе шоп" },
    { id: "b", emoji: "🍽️", text: "Ресторан" },
    { id: "c", emoji: "🏠", text: "Хэн нэгний гэрт" },
    { id: "d", emoji: "🌳", text: "Гадаа, парк" },
  ]},

  // 🫂 Найзын төрөл
  { id: "fr1", cat: "friend", emoji: "🫂", text: "Чи ямар төрлийн найз вэ?", options: [
    { id: "a", emoji: "💬", text: "Групп чатын сүнс" },
    { id: "b", emoji: "🤫", text: "Нууцыг хадгалагч" },
    { id: "c", emoji: "📅", text: "Хоолны/аяллын төлөвлөгч" },
    { id: "d", emoji: "🫶", text: "Үргэлж дэмждэг хүн" },
  ]},
  { id: "fr2", cat: "friend", emoji: "📞", text: "Найздаа хэрэгтэй үед би юу хийдэг вэ?", options: [
    { id: "a", emoji: "📞", text: "Шууд залгаж асууна" },
    { id: "b", emoji: "🚗", text: "Шууд очиж тусална" },
    { id: "c", emoji: "💌", text: "Урт зурвас бичнэ" },
    { id: "d", emoji: "🤗", text: "Ойртож тайтгаруулна" },
  ]},
  { id: "fr3", cat: "friend", emoji: "🎁", text: "Найзынхаа төрсөн өдөрт юу хийх дуртай вэ?", options: [
    { id: "a", emoji: "🎁", text: "Бэлэг бэлдэх" },
    { id: "b", emoji: "🎉", text: "Party зохион байгуулах" },
    { id: "c", emoji: "✍️", text: "Дурсамжтай захидал бичих" },
    { id: "d", emoji: "📸", text: "Хамтдаа гэрэл зураг авах" },
  ]},
];

/* ---------- Match (Таарал) тест — хоёр хүн тус бүрийн тухай хариулж,
   хэр төстэй болохыг харьцуулдаг горим. Энд "зөв хариулт" гэж байхгүй. ---------- */
const MATCH_CATEGORIES = [
  { id: "friend", label: "Найзын тест", emoji: "👯", desc: "Та хоёр хэр төстэй найзууд бэ?" },
  { id: "love", label: "Хайрын тест", emoji: "💞", desc: "Та хоёрын зүрх хэр таарч байна?" },
];

const MATCH_QUESTION_BANK = {
  friend: [
    { id: "mf1", emoji: "🎬", text: "Амралтын өдрөө юу хийхийг илүүд үздэг вэ?", options: [
      { id: "a", emoji: "🛋️", text: "Гэртээ кино үзэх" },
      { id: "b", emoji: "👯", text: "Найзуудтайгаа гадуур явах" },
      { id: "c", emoji: "😴", text: "Унтаж амрах" },
      { id: "d", emoji: "📚", text: "Шинэ зүйл сурах" },
    ]},
    { id: "mf2", emoji: "😮‍💨", text: "Стресстэй үедээ юу хийдэг вэ?", options: [
      { id: "a", emoji: "🧍", text: "Ганцаараа байх" },
      { id: "b", emoji: "📞", text: "Найздаа хонжоо тавих" },
      { id: "c", emoji: "🍔", text: "Хооллох" },
      { id: "d", emoji: "🏃", text: "Дасгал хийх" },
    ]},
    { id: "mf3", emoji: "🏖️", text: "Хамгийн дургуй амралтын хэлбэр?", options: [
      { id: "a", emoji: "🏖️", text: "Далайн эрэг" },
      { id: "b", emoji: "⛰️", text: "Уулархаг газар" },
      { id: "c", emoji: "🏙️", text: "Хот руу аялах" },
      { id: "d", emoji: "🛋️", text: "Гэртээ lazy day" },
    ]},
    { id: "mf4", emoji: "🌙", text: "Шөнийн эсвэл өглөөний хүн үү?", options: [
      { id: "a", emoji: "🌙", text: "Шөнийн хүн" },
      { id: "b", emoji: "🌅", text: "Өглөөний хүн" },
      { id: "c", emoji: "⚖️", text: "Аль ч үед сайн" },
      { id: "d", emoji: "😵", text: "Байнга нойрмог" },
    ]},
    { id: "mf5", emoji: "💬", text: "Групп чат дотор чи ямар үүрэгтэй вэ?", options: [
      { id: "a", emoji: "🤣", text: "Мим илгээгч" },
      { id: "b", emoji: "📅", text: "Төлөвлөгч" },
      { id: "c", emoji: "👂", text: "Чимээгүй ажиглагч" },
      { id: "d", emoji: "🧩", text: "Асуудал шийдвэрлэгч" },
    ]},
    { id: "mf6", emoji: "🎤", text: "Хамгийн дургуй зугаа цэнгэл?", options: [
      { id: "a", emoji: "🎬", text: "Кино театр" },
      { id: "b", emoji: "🎤", text: "Караоке" },
      { id: "c", emoji: "🎮", text: "Тоглоомын газар" },
      { id: "d", emoji: "☕", text: "Кафе" },
    ]},
    { id: "mf7", emoji: "💸", text: "Мөнгөөрөө юунд зарцуулдаг вэ?", options: [
      { id: "a", emoji: "👗", text: "Хувцас, гоо сайхан" },
      { id: "b", emoji: "🍽️", text: "Хоол, кафе" },
      { id: "c", emoji: "✈️", text: "Аялал" },
      { id: "d", emoji: "💰", text: "Хадгаламж" },
    ]},
    { id: "mf8", emoji: "🧩", text: "Асуудал гарвал хэрхэн ханддаг вэ?", options: [
      { id: "a", emoji: "🗣️", text: "Шууд ярьж шийднэ" },
      { id: "b", emoji: "⏳", text: "Цаг хугацаа өгнө" },
      { id: "c", emoji: "👥", text: "Бусдаасаа зөвлөгөө авна" },
      { id: "d", emoji: "🙈", text: "Тойрч гарахыг хичээнэ" },
    ]},
    { id: "mf9", emoji: "🍁", text: "Хамгийн дургуй улирал?", options: [
      { id: "a", emoji: "☀️", text: "Зун" },
      { id: "b", emoji: "🍁", text: "Намар" },
      { id: "c", emoji: "❄️", text: "Өвөл" },
      { id: "d", emoji: "🌸", text: "Хавар" },
    ]},
    { id: "mf10", emoji: "🛍️", text: "Нэг өдрийг хамт өнгөрөөх бол юу хийх дуртай вэ?", options: [
      { id: "a", emoji: "🛍️", text: "Shopping" },
      { id: "b", emoji: "🏋️", text: "Спорт заал" },
      { id: "c", emoji: "📖", text: "Ном дэлгүүр" },
      { id: "d", emoji: "🌳", text: "Байгаль, парк" },
    ]},
    { id: "mf11", emoji: "📆", text: "Найз нартайгаа хэр олон удаа уулздаг вэ?", options: [
      { id: "a", emoji: "📅", text: "Өдөр бүр" },
      { id: "b", emoji: "🗓️", text: "Долоо хоногт хэд хэд" },
      { id: "c", emoji: "📆", text: "Сард хэд хэд" },
      { id: "d", emoji: "🌫️", text: "Ховорхон" },
    ]},
    { id: "mf12", emoji: "🧳", text: "Аялахдаа ямар төлөвлөгөөтэй явдаг вэ?", options: [
      { id: "a", emoji: "📋", text: "Бүх зүйлийг нарийн төлөвлөнө" },
      { id: "b", emoji: "🌊", text: "Урсгалаар явна" },
      { id: "c", emoji: "🗒️", text: "Хагас төлөвлөнө" },
      { id: "d", emoji: "🤝", text: "Бусдад даатгана" },
    ]},
    { id: "mf13", emoji: "📱", text: "Хамгийн их цаг зарцуулдаг платформ?", options: [
      { id: "a", emoji: "📸", text: "Instagram" },
      { id: "b", emoji: "🎵", text: "TikTok" },
      { id: "c", emoji: "📺", text: "YouTube" },
      { id: "d", emoji: "💬", text: "Бусад чат апп" },
    ]},
    { id: "mf14", emoji: "☕", text: "Өглөө сэрэнгүүтээ юу уудаг вэ?", options: [
      { id: "a", emoji: "☕", text: "Кофе" },
      { id: "b", emoji: "🍵", text: "Цай" },
      { id: "c", emoji: "💧", text: "Ус" },
      { id: "d", emoji: "🚫", text: "Юу ч уудаггүй" },
    ]},
    { id: "mf15", emoji: "😤", text: "Чиний хамгийн жижиг бухимдал юу вэ?", options: [
      { id: "a", emoji: "⏰", text: "Хоцрох хүмүүс" },
      { id: "b", emoji: "🔊", text: "Чимээ шуугиантай орчин" },
      { id: "c", emoji: "📵", text: "Хариу өгөхгүй байх" },
      { id: "d", emoji: "🔄", text: "Төлөвлөгөө өөрчлөгдөх" },
    ]},
  ],
  love: [
    { id: "ml1", emoji: "💌", text: "Love language чинь юу вэ?", options: [
      { id: "a", emoji: "🗣️", text: "Үг хэллэг" },
      { id: "b", emoji: "⏰", text: "Цаг зав" },
      { id: "c", emoji: "🎁", text: "Бэлэг" },
      { id: "d", emoji: "🤗", text: "Тэврэлт, дэмжлэг" },
    ]},
    { id: "ml2", emoji: "🍷", text: "Анхны уулзалтдаа юу хийхийг хүсдэг вэ?", options: [
      { id: "a", emoji: "🎬", text: "Кино театр" },
      { id: "b", emoji: "🍽️", text: "Романтик зоогийн газар" },
      { id: "c", emoji: "🌳", text: "Гадаа алхах" },
      { id: "d", emoji: "🎮", text: "Тоглоомын газар" },
    ]},
    { id: "ml3", emoji: "🧩", text: "Хайртай хүнтэйгээ зөрчилдвөл яах вэ?", options: [
      { id: "a", emoji: "🗣️", text: "Шууд ярьж шийднэ" },
      { id: "b", emoji: "⏳", text: "Цаг аван тайвширна" },
      { id: "c", emoji: "✍️", text: "Бичгээр илэрхийлнэ" },
      { id: "d", emoji: "🤝", text: "Уучлалт гуйж эвлэрнэ" },
    ]},
    { id: "ml4", emoji: "🔮", text: "5 жилийн дараа харилцаагаа хаана харж байна вэ?", options: [
      { id: "a", emoji: "💍", text: "Гэрлэсэн" },
      { id: "b", emoji: "🏠", text: "Хамтдаа амьдардаг" },
      { id: "c", emoji: "🤷", text: "Хараахан мэдэхгүй" },
      { id: "d", emoji: "🌍", text: "Хамтдаа дэлхий тойрсон" },
    ]},
    { id: "ml5", emoji: "✨", text: "Романтик гэдэг чиний хувьд юу вэ?", options: [
      { id: "a", emoji: "🎁", text: "Гэнэтийн бэлэг" },
      { id: "b", emoji: "💌", text: "Урт захидал, мессеж" },
      { id: "c", emoji: "⏰", text: "Хамтдаа цаг өнгөрөөх" },
      { id: "d", emoji: "🌷", text: "Жижиг анхаарал, халамж" },
    ]},
    { id: "ml6", emoji: "❤️", text: "Хайртай хүндээ хамгийн их юу чухал гэж бодогддог вэ?", options: [
      { id: "a", emoji: "🤝", text: "Итгэлцэл" },
      { id: "b", emoji: "😂", text: "Хошигнол, инээд" },
      { id: "c", emoji: "🫶", text: "Дэмжлэг" },
      { id: "d", emoji: "🧭", text: "Ижил үнэт зүйлс" },
    ]},
    { id: "ml7", emoji: "🔑", text: "Ойр дотно байдлыг (closeness) хэрхэн тодорхойлдог вэ?", options: [
      { id: "a", emoji: "📖", text: "Бүх зүйлээ хуваалцах" },
      { id: "b", emoji: "🧘", text: "Хувийн зай хадгалах" },
      { id: "c", emoji: "📞", text: "Өдөр бүр холбогдох" },
      { id: "d", emoji: "⏳", text: "Чанартай цаг хамт өнгөрөөх" },
    ]},
    { id: "ml8", emoji: "🧭", text: "Асуудал гарахад эхлээд юу хийдэг вэ?", options: [
      { id: "a", emoji: "🗣️", text: "Шууд ярина" },
      { id: "b", emoji: "⏳", text: "Цаг хугацаа авна" },
      { id: "c", emoji: "👥", text: "Найзаасаа зөвлөгөө авна" },
      { id: "d", emoji: "✍️", text: "Бичгээр илэрхийлнэ" },
    ]},
    { id: "ml9", emoji: "🌟", text: "Хань дээр хамгийн их юуг эрхэмлэдэг вэ?", options: [
      { id: "a", emoji: "😄", text: "Хөгжилтэй зан чанар" },
      { id: "b", emoji: "🧱", text: "Тогтвортой байдал" },
      { id: "c", emoji: "🧳", text: "Адал явдал хайрлагч" },
      { id: "d", emoji: "🧠", text: "Гүн ухаалаг ярилцагч" },
    ]},
    { id: "ml10", emoji: "💍", text: "Гэрлэлтийн тухай бодол?", options: [
      { id: "a", emoji: "⚡", text: "Эрт гэрлэхийг хүсдэг" },
      { id: "b", emoji: "🌱", text: "Яарахгүй" },
      { id: "c", emoji: "🤷", text: "Гэрлэхгүй байж ч болно" },
      { id: "d", emoji: "💭", text: "Хараахан бодоогүй" },
    ]},
    { id: "ml11", emoji: "🍳", text: "Хамтдаа цаг өнгөрөөх дуртай арга?", options: [
      { id: "a", emoji: "🛋️", text: "Гэртээ кино үзэх" },
      { id: "b", emoji: "🍳", text: "Хоол хийх" },
      { id: "c", emoji: "✈️", text: "Аялах" },
      { id: "d", emoji: "🏃", text: "Спорт хийх" },
    ]},
    { id: "ml12", emoji: "😒", text: "Атаархал мэдрэх үед яах вэ?", options: [
      { id: "a", emoji: "🗣️", text: "Шууд хэлнэ" },
      { id: "b", emoji: "🤐", text: "Дотроо нуун дарагдуулна" },
      { id: "c", emoji: "😏", text: "Хошигнож хэлнэ" },
      { id: "d", emoji: "⏳", text: "Цаг гарган ярилцана" },
    ]},
    { id: "ml13", emoji: "⏳", text: "Харилцаандаа хамгийн их юунд цаг гаргадаг вэ?", options: [
      { id: "a", emoji: "🗣️", text: "Харилцан яриа" },
      { id: "b", emoji: "⭐", text: "Хамт цагийн чанар" },
      { id: "c", emoji: "🤗", text: "Ойр дотно байдал" },
      { id: "d", emoji: "🎯", text: "Хамтарсан зорилго" },
    ]},
    { id: "ml14", emoji: "🎁", text: "Ямар төрлийн сюрприз таалагддаг вэ?", options: [
      { id: "a", emoji: "🌷", text: "Жижиг өдөр тутмын" },
      { id: "b", emoji: "🎉", text: "Том гэнэтийн" },
      { id: "c", emoji: "✋", text: "Гар хийц бэлэг" },
      { id: "d", emoji: "⏳", text: "Хамтдаа цаг" },
    ]},
    { id: "ml15", emoji: "💭", text: "Хайр дурлалд юу гол гэж боддог вэ?", options: [
      { id: "a", emoji: "✨", text: "Таталцал" },
      { id: "b", emoji: "🤝", text: "Нөхөрлөл" },
      { id: "c", emoji: "🌱", text: "Хамтын өсөлт" },
      { id: "d", emoji: "🧘", text: "Тайван байдал" },
    ]},
  ],
};

function getQuestionsByIds(ids) {
  const map = Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]));
  return ids.map((id) => map[id]).filter(Boolean);
}

function getQuestionsByCategory(catId) {
  return QUESTION_BANK.filter((q) => q.cat === catId);
}

/* Нүүр хуудасны "жишээ загвар" тестүүд — товч дарангуут create.html дээр
   гарчиг, эможи, 4–5 асуулт шууд бэлэн сонгогдоно. */
const TEMPLATE_QUIZZES = [
  {
    id: "friend",
    title: "Хэн чамайг хамгийн сайн мэддэг вэ?",
    emoji: "👑",
    img: "ohin1.png",
    tag: "Найзууд",
    desc: "Хамгийн алдартай Bestie тест",
    questionIds: ["f1", "h2", "d3", "m1", "s1"],
  },
  {
    id: "food",
    title: "Миний дуртай хоол, ундаа",
    emoji: "🍕",
    img: "ohin2.png",
    tag: "Сонирхол",
    desc: "Амт сонголтыг чинь таах уу",
    questionIds: ["f1", "f2", "f3", "dr1", "dr2"],
  },
  {
    id: "style",
    title: "Зан чанарыг минь мэдэх үү?",
    emoji: "🎀",
    img: "ohin3.png",
    tag: "Хөгжилтэй",
    desc: "Aesthetic, зан чанар, style",
    questionIds: ["s1", "s2", "s3", "s4"],
  },
  {
    id: "fun",
    title: "Миний нууц, хөгжилтэй тал",
    emoji: "🤫",
    img: "ohin4.png",
    tag: "Нууц",
    desc: "Хамгийн хөгжилтэй дурсамжууд",
    questionIds: ["fu1", "fu2", "fu3", "d3"],
  },
];
