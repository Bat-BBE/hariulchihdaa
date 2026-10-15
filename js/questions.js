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
