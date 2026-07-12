/* =====================================================================
   IBEE PRODUCTS — the store catalog (window.IBEE_PRODUCTS).
   Written/edited in tools/shop-manager.html -> EXPORT -> deploy this file
   to assets/products-data.js. Loaded clock-stamped (?cb=) by console.html
   (shop grid) and product-page/index.html (product pages) - replacing the
   file goes live in ~1 min, no version bumps.
   Each product: {id, n:name, price, cur, r:rarity(c/sr/sdr/leg), out:0/1,
   desc, imgs:[urls], pay:{wix, stripe, paypal}} - empty pay links hide
   their button on the product page. pay_config.paypalClientId (a PayPal
   Business "Client ID") turns on real on-page PayPal checkout for everything. Seeded 2026-07-12 from the old Wix
   store (JSON-LD scrape: names, prices, descriptions, galleries, stock).
   ===================================================================== */
window.IBEE_PRODUCTS={
 "v": 1,
 "pay_config": {
  "paypalClientId": "",
  "currency": "EUR"
 },
 "products": [
  {
   "id": "all-ics-pink",
   "n": "VIP ALL ICS CHARACTERS — PINK",
   "price": 270,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "desc": "One of the 2 rarest T-shirts, 100% cotton, Fabric Patch with embroidered ICS logo. simple, nothing fancy… except it has all the characters pressed together! Showing the full chess set. This isn’t just a T-shirt, it’s the meaning behind months of work making ICS (Ibee’s Chess Set) real. You’re buying the story, not just the shirt. Scan and unlock something special… we’ll let you discover what it is 😉",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_37851d102940464786ec570c169480c3~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ee7534e7c94d430ab3305ae6ad4cb50c~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_761d9cf263d44e1fa1d18b6dd298bd30~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_4321ba1c23e349e9ad06e323e4145e49~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_60e367af59f64fe8a9329c50eaf578c3~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8974181f0f4549ca9d66ae07c5373220~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/all-ics-pink",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "all-ics-black",
   "n": "VIP ALL ICS CHARACTERS — BLACK",
   "price": 250,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "desc": "One of the 2 rarest T-shirts a black greyish, 100% cotton, Fabric patch with logo embroidered nothing fancy… except it has all the characters pressed together ! showing the full chess set. This isn’t just a T-shirt, it’s the meaning behind months of work making ICS (Ibee’s Chess Set) real. You’re buying the story, not just the shirt. Scan and unlock something special… we’ll let you discover what it is 😉",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_74736ab412fb4ae98569b023169de0b1~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_950b095bef594fe6a86821ef5c9ebe99~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_03a6e41d2dae4c5e86c816fbdb1fd202~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b362e10a938d4b11a2bc24a695be186e~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/all-ics-black",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "queen-shirt",
   "n": "ABLA LONG SLEEVE — QUEEN",
   "price": 140,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "desc": "Black and grey long sleeve, size XXL, heavy-weight 270 g, 100% cotton, oversized fit. Features an embroidered logo on the front, the Queen pressed on the chest, and a huge Queen design on the back. Can be worn as a dress for shorter girls. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_adcaa115259d490e8398a7ac610aa9da~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_dc2fc46f00224182a51a603553b6b29e~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_a3d5e3637e114f5782372414affd39af~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_536dda66a2134387bc579f220d2e45d7~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_48c3918105cd4a64b026fbbd570da1f0~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_8dca0ba4dbc34c9795c75a0e6beab623~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_1bbd394884fd4b35aef54c2946279ca9~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_ca43279d5f8d41a4ace23f305c996a8c~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/queen-shirt",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "small-king",
   "n": "NANNAN OVERSIZED BLACK TEE — KING",
   "price": 110,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "desc": "Black oversized T-shirt, size S, 300 g, 100% cotton ,the best fabric piece in the drop. Thick, high-quality, and super versatile. Features the King NanNan (Super Duper Rare) pressed on the front. Both for guys and girls. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_24f8c917b0aa49da9830b318b3c783dc~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_865674b556c44dccbbcd5bd6b159b357~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_654315c2b969406cb07b8adf9c1fa174~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_58eec3fac3cf4d259312d4ec29b19564~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_680b9a2a17c44c94bd66bbcd0c17523b~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_f52a6ce4b3f84889890494b0c62d1887~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_810f4e7b9e9c4bdaaed7ee18d39362a8~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/small-king",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "kiss-crop-top",
   "n": "BISOUS CROP TOP — ABLA",
   "price": 50,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "desc": "",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_6bae8423ff174dbc97da5180fea21e91~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_27af4c45e46f4bceadf73ee294c2223f~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_e531bd2c10ae4d62b816f003d3eb6b66~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_f9453aed0b714240a885bc98fc4aa3ac~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_2f7d14455d624c799dbb9302aec3dac4~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/kiss-crop-top",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "vdf-sweater",
   "n": "VDF GREY PINK HOODIE — BEEBEE",
   "price": 120,
   "cur": "€",
   "r": "sr",
   "out": 0,
   "desc": "very Soft and heavy 380g hoodie, size M, with a two-way zipper. Beebee the super rare bishop on the front, red VDF print on the back, embroidered logo. 60/40 cotton-poly blend that feels mad comfy.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_972f431666f0430f9db44278283ba9e2~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_87100734d5364c33bf87b98891c04ccb~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_621eea369b16454eb2c9b99832d0f194~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_032edeb5562d4f9fa7eee3a5bbeb983b~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_3779e959cdef4c4280e4db27e38f4de5~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_d45f5899353840ccbd1fda85f3035c0b~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_f3095532a72d4337bd247e36b70603e0~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/vdf-sweater",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "orange-jacket",
   "n": "PAINTED ORANGE DENIM JACKET — MIMI",
   "price": 150,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Orange denim jacket, size S, boxy cut. Hand-brush painted and dipped in paint, featuring Mimi fully hand-painted with hand-cut stencils. Started from all-white denim to this vibrant piece, one of the very first creations of the whole project.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_6acab0667f654fd496c0f774df3d5ce5~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b2db65b7df4643f5a5b788c772f4ff95~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/orange-jacket",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "vdf-blue-hoodie",
   "n": "VDF RED HOODIE — SWORDY",
   "price": 95,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Red hoodie, size XL, 380 g double-way zipper, soft on the skin (60% cotton, 40% polyester). Front features Swordy, the common knight, pressed on, plus an embroidered logo. Back has the red VDF pressed design, and the hood is hand-brush-painted with golden ICS print.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_934f61dd0dff4443bcd3ae03c3cb73eb~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_787c6178f48b4062beea43cf2da776c9~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_a99f95dc92d0476ba412c102cb81ee6d~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_c60de3a3e92642d28027b634ac834a52~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_0935c3f5e84748a4bfb49e3b988d70f7~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_44dbe1c058ba499db55fda0680591f4a~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_6e23137ab2444e30b934da5ee97f1ff7~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7a0f46a3bbd0407eb42dba3db2cafb43~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/vdf-blue-hoodie",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "weed-jean",
   "n": "FLOWER NEON PAINTED BLACK JEAN",
   "price": 90,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Black jeans, size L, featuring Mimi hand-cut stencil neon-painted on the front and a red weed leaf painted. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_97f1b1535c7640c5bd4f23609b13c616~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_56bed50a89f549fc9ac04931ec167d32~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/weed-jean",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "drinking-skull-jean",
   "n": "SIPPIN SKELETON JEAN XL",
   "price": 90,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Jeans, size XL, featuring Mimi in yellow neon hand-brush painted on the front and a blue drinking skeleton sprayed painted. Red bike painted on the back. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_99958a73a78a461e9cf437fdfe404305~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_2ded7fd3a4284d70a9efab24b8472934~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_84ce0459e43e426daaae70d0b954806a~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_8d2700e7a1194067a24cd6ec883392c5~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8a38a2a2dee7443cb5a6d456c83c778e~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/drinking-skull-jean",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "goli-hoodie",
   "n": "STONER GREY PINK HOODIE — GOLI",
   "price": 85,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Grey and pink hoodie, size L, 380 g, soft and comfy (60% cotton, 40% polyester). Features Goli, the common Pon character, with an embroidered ICS logo on the front and a hand-painted weed leaf on the back. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_99d8f35539814ea798780e4038303cfa~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_0110281ce37e47d0980744ca340aeaad~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7c74c522d98841338d4e445373fcf08b~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8173a353995b4ab3bb808dc614161025~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_a61220cd08f84b5bb9727509651d8373~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_cb7f0aba5e03499f99157e8407ac38cf~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/goli-hoodie",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "mimi-long-sleeves",
   "n": "MIMI BLUE LONG SLEEVE",
   "price": 75,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Blue long sleeve, size L, heavy-weight 270 g, 100% cotton. Oversized cut for a relaxed fit. Features an embroidered logo on the front and a huge pressed Mimi character on the back.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_291af86e97db44e6a16aac157d7de455~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_3778b62eb0b54b72b0753a6d407738c1~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_bc1c29d65929450c84a4b2755b6437cc~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_22997d9952db49769f44a6ac8bfb0fcd~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_98033ec03ccb4f4a9bb51ac734abbc76~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_7e3320a808e74975a014f2af9fbb69ce~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_bf210adaad6a46358d08b82f43c20b29~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_b40c20608ec649599e8c542ab34cf578~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_e78db0ea511a4b86a178d1c6bf291f4f~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/mimi-long-sleeves",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "vdf-long-sleeve-blue",
   "n": "VDF BLACK LONG SLEEVE — UTOPIE",
   "price": 75,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Blue long sleeve, size L, heavy-weight 270 g, 100% cotton. Features an embroidered ICS logo on the front, VDF design on the back . Scan the red monster tag to access the Utopie blog with exclusive cartoon comics and random surprises. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_521d0551a2a646259f2ba697c9f81605~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_f224e8b85faf432495f97203d06cc5fc~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_467984355f964d3e8fdded4e048982f5~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7913609213ce4830a2f5b38c0b0a470b~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_01e7ac661c264ad1b1a8ba958dacc94d~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_da70afd4642944898c06bc167b5a82cb~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/vdf-long-sleeve-blue",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "continents-long-sleeves",
   "n": "CONTINENTS LONG SLEEVE — MIMI",
   "price": 75,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Grey long sleeve, 100% cotton, 230 g. Features red-painted continent shapes on the front and a pressed Mimi character. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_afcf9be194db457986c7f894fefb39d7~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/continents-long-sleeves",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "pink-jean",
   "n": "PINK DIPPED JEAN + CHAIN — MIMI",
   "price": 70,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Pink-dipped jeans, size M, featuring Mimi design. Comes with a matching keychain. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_45c8284a2cc5430a9b0a218fb4e563d5~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_bc401d9c63524ac3b13f0c4b6c71e59a~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_cf5d65d913a14c109670d8c2f8636709~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_35411ef423164a66b383cd28b131f909~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_529e99bd8a8244fcaa1de232e87489bb~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/pink-jean",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "denim-skirt-2",
   "n": "PUNK GENERAL DENIM SKIRT",
   "price": 70,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Denim skirt, size XL, stretchy fit. Features a neon-painted skeleton on the front, Punk General embroidered badge.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_0c2bcab017e246b288417fb871ba0f99~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_4be29b077028403599686ce8bcc5ca34~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/denim-skirt-2",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "les-bleus-sont-vert-grey-tshirt",
   "n": "LES BLEUS SONT VERTS GREY TSHIRT",
   "price": 60,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Size M.  100% cotton.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_22a4fea99e27439ab0458d0f939452b3~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_12956dc9999042a9ae3cd5ced9851fd4~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_711c628a69dd4ec4aaaecd3be32349f3~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_c1a20baa69cd4335ade9c5d43d423a4c~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_6e3dda132c474a2b98b8a7fe29eb012c~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/les-bleus-sont-vert-grey-tshirt",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "les-bleus-sont-vert-1",
   "n": "LBSV LONG SLEEVE — ARMY GREEN",
   "price": 60,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Army green long sleeve, size M, 240 g, 100% cotton. Simple, comfy, and ready for everyday wear. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_1b8f3ef1a0f64ac2a1f8eb4a8855429d~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_9a80304fb6d747a3bcf319df00956dd8~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b37a198ccc1c405c8ac5113fdd235cb0~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_9e37ed1670154663a7fe10cda892f977~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_e06f159cde6b46748e0d51dfb44186ca~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/les-bleus-sont-vert-1",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "rib-jean",
   "n": "RIB JEAN",
   "price": 60,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Size L",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_6d1ac2d979fa4909b4bf504474fac719~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/rib-jean",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "denim-skirt-1",
   "n": "MIMI BLACK DENIM SKIRT — SKELETON",
   "price": 60,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Black denim skirt, size M, high-waisted and stretchy (bust 90–94 cm, waist 70–74 cm, hips 95–99 cm). Front features a hand-spray-painted neon drinking skeleton, and the back has Mimi, the cute common bishop, painted in her shape. Each piece is unique and made only once",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_2e8a21e0eba848718f8717f95de25a85~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_19aa5677bcdc48a3bdd4a0eac0754f3e~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/denim-skirt-1",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "rib-crop-top",
   "n": "RIB GREY CROP TOP — MIMI",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Grey crop top, size M, thin polyester fabric. Features Rib red painting and mimi on the sleeve. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_799f15ab4a58426bba3a888e1b514694~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_2b56f270279e4993a3e19a95ad4cba05~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8a2a123c048d4806afd3506be8888374~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_855348bb058e4ae68a29839c75e510f2~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_4272a4af9c094ebc88394d3dcdf60219~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/rib-crop-top",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "mimi-crop-top",
   "n": "MIMI WHITE CROP TOP",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Stretchy Polyester. Red spray painted Mimi with hand-cutted stencil.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_593e4b661422483a805dff1c048085d8~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_af9430265cc34ab198a75dc098ca7c05~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7d8ad095a36646e3a35d92e33c944159~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7a997ea111cd4bd6afa9508a2eb5f01a~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ed3103c6751144148f4acf0715e905aa~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/mimi-crop-top",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "jardin-crop-top",
   "n": "BROWN CROP TOP JARDIN — MIMI",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Brown crop top, size M, thin polyester fabric. Features a discreet red painting, Jardin design, and ICS print brush-painted. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_201c3bc232524f9fb20c8efbba5a0dd5~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8f64a84f84174e3dab8fc1b08f173897~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ad7bc2b9994643c0a9446130462309e1~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_0bb90d6afb2f40ce92ea33c85fd292fd~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b2f88ddf82824c6aaca91a6f755d95c0~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/jardin-crop-top",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "denim-skirt-3",
   "n": "BISOUS DENIM SKIRT",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Black denim skirt, size L. Front features hand-spray-painted red lips, and “Never Give Up” text painted on the back. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_866dcd2c99e64b8ba51849bfd3d15d07~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_bf6f82989c3e424f8ff4e299ce75201e~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_76ce7477fbb54eeda220d12774f67829~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7dc5ff9ba45a4aefab7b29ac1f563c90~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_286af2cebde54b13b1b9417a4309af05~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_3455d7c0cbbf446f95695b7fb7efb1e7~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/denim-skirt-3",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "les-bleus-sont-vert-2",
   "n": "LBSV LONG SLEEVE — LIGHT",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Army green long sleeve, size M, made from lightweight polyester. Easy to wear, smooth feel, and simple look that fits any vibe. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_201a0a6f93554d86a3a1b2a0ddadc27a~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_253bcf08b1d74d57afe45c78793319ea~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_17182f8fd1914e2b8c1de9895fdbd1d8~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_575538cffc664afdb3890842dba071b4~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/les-bleus-sont-vert-2",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "stoner-content",
   "n": "STONER CONTENT LONG SLEEVE",
   "price": 35,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Long sleeve, size M, made from lightweight polyester. Perfect for casual wear.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_23c43cfc9b244555884aeeb4895eb261~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/stoner-content",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "utopie-hoodie",
   "n": "UTOPIE GREY PINK HOODIE",
   "price": 75,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Grey, and pink hoodie, size XL, 380 g, soft and comfy (60% cotton, 40% polyester). Embroidered ICS logo on the front. Scan to access the Utopie blog with exclusive comics and surprises. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_579ccb0a7901414b92f4350b66581609~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_3e37febe97e342818fffe88ba3d6c1c2~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_364e1fc81920444e96124ff6323f9301~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b5ec42e649764ded8886601ebd28dd84~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_afa14f4642e641cf8ed128c4ed4d5e40~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_47fae5ad4c4843f48c3d2afe5551a298~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_279903598dca420d84640eb4d8ff3b14~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/utopie-hoodie",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "nouveaux-punk-crop-top",
   "n": "NOUVEAUX PUNK CROP TOP",
   "price": 55,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_89457a7a195148ba8ad29ed673c24f36~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_699c69514cdd4fcea72237b56bae8f7b~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7e9fb28f13724b62af98e17cd11624d0~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ea230220030d482bb96f4d7dab761916~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_90099041e73e479f817b41654af2b839~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_1004a5ff69104376bf6bb16e64bf8cf8~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_98a8b20a35dc45faa440a1f1aa184475~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_afb1e15c6f1c4d339faffacdd73ce3e9~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_9b015124e016487992a2c3de30dd2676~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_cd936b29b5044191aee0a92cd945ec1c~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/nouveaux-punk-crop-top",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "20minzasession",
   "n": "20 MIN ZA SESSION ONE SLEEVE TEE",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Black and grey long sleeve, size M, 100% cotton. The only piece from the 20MinzaSession mixtape drop. Scan to listen to the mixtape. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_0c899a8179cd45c2b21227f1016aca32~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_df091bf28ef84a1baa47dd9b7656d12e~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_89233dc6d2af49028c517da25da3df73~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_44cf3126977745b183c4df009e6e781a~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/20minzasession",
    "stripe": "",
    "paypal": ""
   }
  }
 ]
};
