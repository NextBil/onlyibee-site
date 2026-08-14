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
  "paypalClientId": "Aayna5QBBdxQnJaXasgKfksTCamcKUk-HvCNLTcmBWgiQNQO2fm2MoipQUS6grC0GUgO3zvs1vfzUY51",
  "currency": "EUR"
 },
 "folders": [
  {
   "id": "15-tshirts",
   "name": "14 T-SHIRTS",
   "sub": "ONE OF ONE · PRINTED ONCE",
   "tint": "sdr",
   "hype": 0,
   "state": "soon",
   "page": "drop/",
   "made": "print"
  },
  {
   "id": "ics-v2",
   "name": "ICS V2",
   "sub": "NEXT DROP — LOADING…",
   "tint": "sdr",
   "hype": 1,
   "state": "soon"
  },
  {
   "id": "ics-v1-autumn-2025",
   "name": "ICS CLOTHING V1 — AUTUMN 2025",
   "sub": "FIRST DROP · HAND-MADE",
   "tint": "leg",
   "hype": 0,
   "state": "closed",
   "made": "hand"
  }
 ],
 "products": [
  {
   "id": "tee-mimi",
   "folder": "15-tshirts",
   "n": "MIMI",
   "no": "01",
   "one": 1,
   "price": 60,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "Mimi, straight to the chest. The tower of the set, drawn by hand before anything else existed. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/01-mimi.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-nannan",
   "folder": "15-tshirts",
   "n": "NAN-NAN — CHEF EN BAOULE",
   "no": "02",
   "one": 1,
   "price": 75,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The King. A king with trust issues — he been thru a lot and would rather not speak about it. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/02-nannan.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-coeur-dollar",
   "folder": "15-tshirts",
   "n": "CŒUR / DOLLAR",
   "no": "03",
   "one": 1,
   "price": 55,
   "cur": "€",
   "r": "sr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "A cracked heart held together with a dollar bill. Small chest print, loud idea. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/03-coeur-dollar.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-abla",
   "folder": "15-tshirts",
   "n": "ABLA — REINE EN BAOULE",
   "no": "04",
   "one": 1,
   "price": 75,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The Queen. She represents moms and fertility — wise, very caring, with a big attitude. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/04-abla.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-np-rouge",
   "folder": "15-tshirts",
   "n": "NOUVEAUX PUNK — ROUGE",
   "no": "05",
   "one": 1,
   "price": 65,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The bats and the manifesto, yellow on red. Punk ça veut dire voyou en anglais. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/05-nouveaux-punk-rouge.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-onlyibee-engine",
   "folder": "15-tshirts",
   "n": "ONLYIBEE — ENGINE",
   "no": "06",
   "one": 1,
   "price": 60,
   "cur": "€",
   "r": "sr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The wordmark off the site itself: ONLY in acid, IBEE in red. Engine for art and discovery. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/06-onlyibee-engine.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-utopie-pluie",
   "folder": "15-tshirts",
   "n": "UTOPIE — LA PLUIE",
   "no": "07",
   "one": 1,
   "price": 60,
   "cur": "€",
   "r": "sr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The pixel umbrella with the rain coming down through it. One red drop in the whole storm. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/07-utopie-pluie.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-utopie-pt",
   "folder": "15-tshirts",
   "n": "UTOPIE — PARIS/TORONTO",
   "no": "08",
   "one": 1,
   "price": 60,
   "cur": "€",
   "r": "sr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The lockup. Umbrella, wordmark, two cities, and the promise underneath: each piece made once. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/08-utopie-paris-toronto.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-goli",
   "folder": "15-tshirts",
   "n": "GOLI",
   "no": "09",
   "one": 1,
   "price": 65,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "Goli in full. This guy does bare stuff that we can't understand — just don't wake him up at night. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/09-goli.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-goli-masque",
   "folder": "15-tshirts",
   "n": "GOLI — LE MASQUE",
   "no": "10",
   "one": 1,
   "price": 65,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "Just the mask, blown up big. The Baoulé face that started the whole crew. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/10-goli-masque.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-utopie-dreamland",
   "folder": "15-tshirts",
   "n": "UTOPIE — DREAMLAND",
   "no": "11",
   "one": 1,
   "price": 55,
   "cur": "€",
   "r": "c",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The clean umbrella mark and one line: somewhere in Dreamland… One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/11-utopie-dreamland.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-swordy",
   "folder": "15-tshirts",
   "n": "SWORDY",
   "no": "12",
   "one": 1,
   "price": 65,
   "cur": "€",
   "r": "sdr",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The knight on his hippo. The King granted these guys total freedom — they'll woop you on sight. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/12-swordy.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-np-neon",
   "folder": "15-tshirts",
   "n": "NOUVEAUX PUNK — NEON",
   "no": "13",
   "one": 1,
   "price": 75,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The same manifesto, pink bats on deep green, glowing. The loudest piece in the drop. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/13-nouveaux-punk-neon.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "tee-20mzs",
   "folder": "15-tshirts",
   "n": "20 MIN ZA SESSION",
   "no": "14",
   "one": 1,
   "price": 75,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "owner": null,
   "acquired": null,
   "desc": "The session, worn. One take, twenty minutes, no skips — the tape that never got a second run. One of one: this design is printed a single time and then retired. Claim it and your name goes on this page, permanently, with the date.",
   "imgs": [
    "/assets/tees/mockups/14-20mzs.png",
    "/assets/tees/mockups/14-20mzs-worn.png"
   ],
   "pay": {
    "wix": "",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "all-ics-pink",
   "folder": "ics-v1-autumn-2025",
   "n": "VIP ALL ICS CHARACTERS — PINK",
   "price": 270,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "desc": "One of the 2 rarest T-shirts, 100% cotton, Fabric Patch with embroidered ICS logo. simple, nothing fancy... except it has all the characters pressed together! Showing the full chess set. This isn't just a T-shirt, it's the meaning behind months of work making ICS (Ibee's Chess Set) real. You're buying the story, not just the shirt. Scan and unlock something special... we'll let you discover what it is",
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
   "folder": "ics-v1-autumn-2025",
   "n": "VIP ALL ICS CHARACTERS — BLACK",
   "price": 250,
   "cur": "€",
   "r": "leg",
   "out": 0,
   "desc": "One of the 2 rarest T-shirts a black greyish, 100% cotton, Fabric patch with logo embroidered nothing fancy... except it has all the characters pressed together! showing the full chess set. This isn't just a T-shirt, it's the meaning behind months of work making ICS (Ibee's Chess Set) real. You're buying the story, not just the shirt. Scan and unlock something special... we'll let you discover what it is",
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
   "id": "orange-jacket",
   "folder": "ics-v1-autumn-2025",
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
   "id": "queen-shirt",
   "folder": "ics-v1-autumn-2025",
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
   "id": "vdf-sweater",
   "folder": "ics-v1-autumn-2025",
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
   "id": "small-king",
   "folder": "ics-v1-autumn-2025",
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
   "id": "vdf-blue-hoodie",
   "folder": "ics-v1-autumn-2025",
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
   "folder": "ics-v1-autumn-2025",
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
   "folder": "ics-v1-autumn-2025",
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
   "folder": "ics-v1-autumn-2025",
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
   "id": "continents-long-sleeves",
   "folder": "ics-v1-autumn-2025",
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
   "id": "mimi-long-sleeves",
   "folder": "ics-v1-autumn-2025",
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
   "folder": "ics-v1-autumn-2025",
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
   "id": "pink-jean",
   "folder": "ics-v1-autumn-2025",
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
   "folder": "ics-v1-autumn-2025",
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
   "id": "les-bleus-sont-vert-1",
   "folder": "ics-v1-autumn-2025",
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
   "id": "les-bleus-sont-vert-grey-tshirt",
   "folder": "ics-v1-autumn-2025",
   "n": "LES BLEUS SONT VERTS GREY TSHIRT",
   "price": 60,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Size M. 100% cotton.",
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
   "id": "denim-skirt-1",
   "folder": "ics-v1-autumn-2025",
   "n": "MIMI BLACK DENIM SKIRT — SKELETON",
   "price": 60,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Black denim skirt, size M, high-waisted and stretchy (bust 90-94 cm, waist 70-74 cm, hips 95-99 cm). Front features a hand-spray-painted neon drinking skeleton, and the back has Mimi, the cute common bishop, painted in her shape. Each piece is unique and made only once",
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
   "id": "rib-jean",
   "folder": "ics-v1-autumn-2025",
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
   "id": "kiss-crop-top",
   "folder": "ics-v1-autumn-2025",
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
   "id": "denim-skirt-3",
   "folder": "ics-v1-autumn-2025",
   "n": "BISOUS DENIM SKIRT",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 0,
   "desc": "Black denim skirt, size L. Front features hand-spray-painted red lips, and \"Never Give Up\" text painted on the back. Each piece is unique and made only once.",
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
   "id": "jardin-crop-top",
   "folder": "ics-v1-autumn-2025",
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
   "id": "les-bleus-sont-vert-2",
   "folder": "ics-v1-autumn-2025",
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
   "id": "mimi-crop-top",
   "folder": "ics-v1-autumn-2025",
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
   "id": "rib-crop-top",
   "folder": "ics-v1-autumn-2025",
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
   "id": "stoner-content",
   "folder": "ics-v1-autumn-2025",
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
   "id": "vdf-long-sleeve-red",
   "folder": "ics-v1-autumn-2025",
   "n": "VDF GREY LONG SLEEVE — KING",
   "price": 180,
   "cur": "€",
   "r": "sdr",
   "out": 1,
   "desc": "Grey long sleeve, size M, heavy-weight 270 g, 100% cotton. Features King, the super duper rare character. Hand-brush-painted with hand-cut stencil ICS prints on both sleeves, plus a red VDF pressed design on the back. Right sleeve has 2-star hood sergeant badge embroidery and Heartbreak embroidery; left sleeve has VDF and Moody Club smiley embroidery. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_5d11dcf477a34822861eef265e7b460e~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_ee00759c9ee44581930fd487efd0513f~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_475ab5f2cf14497d810e21cd2ee0e1ab~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_efcff2b3fb4540dca89ca346b565684b~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8d5dc2cb8eee48b889b650ae11ccbb9e~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ce515b551afe44f696c5f7e78f73f95f~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_323d6e4ce2834c7e90fbeabf862dc08e~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_d13d525f3adc497f96a54f858484a435~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_66bebdc43f274e2ba46bbd5a83e3a039~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8121aac9b580433da2b9215590ab2cc3~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_05398a3c85f24cafb47e30878dd462af~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_00287e9e4fd247c5b232509f8249d52c~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b70031b5ad44403cbf557ac89be52968~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_38b3506fbff04fc2ad4fdf4ecaaa2465~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_05c16dc9cb9043c38977030b46348c8c~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/vdf-long-sleeve-red",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "king-shirt",
   "folder": "ics-v1-autumn-2025",
   "n": "BLUE LONG SLEEVE — KING NANNAN",
   "price": 160,
   "cur": "€",
   "r": "sdr",
   "out": 1,
   "desc": "Blue long sleeve, size L, heavy-weight 270 g, 100% cotton. Features a small pressed King NanNan on the front, a huge pressed King on the back, and an embroidered logo. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_0d6d0001f80143c5a5f3438546c7d16a~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_785ef486df1a4490a54702577fff2fc2~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ef8f8eaf633048ff8dfbdd8a032d1582~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_4cf5ec14e3894f4c85716e9f59237fe4~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_7e3320a808e74975a014f2af9fbb69ce~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/king-shirt",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "ics-print-jacket",
   "folder": "ics-v1-autumn-2025",
   "n": "HAND BRUSH PAINTED ICS COW PRINT GREEN JACKET",
   "price": 130,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Im keeping this one for myself sorryy",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_2e04e3f9b795492fa68185ba2ef59bb1~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_60d026c77ade4b538ed6b9c8ae33b151~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_2c59c104b1ff4c03a3c210cac1aeca0d~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_3795116a1df444938b361d495a904a8f~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_5537d37805e541ba99809cad4b1ae7a6~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/ics-print-jacket",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "sworda-jacket",
   "folder": "ics-v1-autumn-2025",
   "n": "SWORDA & SWORDY RED RETRO JACKET — LIMITED",
   "price": 130,
   "cur": "€",
   "r": "sr",
   "out": 1,
   "desc": "Red retro jacket, one of only 4 ever made, this is the last one in stock! Features pressed Swordy (common knight) on the front and Sworda (rare) on the back. embroidered logo. Stylish, streetwear-ready, and totally unique.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_d265e471521840499fb92950e58e8aed~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_b5a845cc8497496fad439f780a8a416c~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_35d777da716c4fb89540165b7824ab08~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_e06785b82aea45b49e71b8a33f81cee5~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8d06e82c9b51447e963b13cc57a78431~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_0f0167288dd34f7cb5668a513e142b10~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_ce3260841fc54e869e94871c51575e72~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_ef6d747aac8c41c2831360b4c045121c~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_17283b7399da40a9ab8fef4f71458348~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_90f1146add98442c8c6c1063ea2814b1~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/sworda-jacket",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "liberty-jean",
   "folder": "ics-v1-autumn-2025",
   "n": "LIBERTY NEON BLACK JEAN",
   "price": 110,
   "cur": "€",
   "r": "sr",
   "out": 1,
   "desc": "Black jeans, size L, unisex fit. Features a hand-painted Statue of Liberty, ICS hand-cut stencil print, and a 3-star Punk General embroidery badge. Each piece is unique and made only once. Comes with the red monster tag - scan it to check authenticity and drop number.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_d52445bc4406433fb64242217ae9ce94~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_fd10618dd5fe4ceebdd244e2324c1121~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_571fd1b677ee45d68b2c28a6c0c4ee22~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_2f37aa54d9d4437f93f0d17578521b5c~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_e728ec43dbf643d6a6388eddef437139~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b10599f75f5d4aa2a95aaba69ab6c49f~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_797a07a2e91041a09ce06795117f8d1f~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_1189e8af991741b3a2c6e41bd7641bf5~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/liberty-jean",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "airbrush-painted-ics-print-green-jacket",
   "folder": "ics-v1-autumn-2025",
   "n": "AIRBRUSH PAINTED GREEN JACKET",
   "price": 100,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Airbrush painted, hand-cutted ICS Cow print Stencil. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_45eb9a693dd2428c92b05040e835208c~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/airbrush-painted-ics-print-green-jacket",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "nannan-red-zebra-tshirt",
   "folder": "ics-v1-autumn-2025",
   "n": "BRUSH PAINTED RED TSHIRT — NANNAN",
   "price": 95,
   "cur": "€",
   "r": "sr",
   "out": 1,
   "desc": "Brush-painted T-shirt, size XS, featuring the King pressed on the front and a mix of zebras and stripes hand-painted on the back. Made for family and never released in the drop, a unique one-off piece.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_5d28b85237c848c7a686ba4e1e7d7486~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_10c0333df94243578c847c7c764e1865~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_6b71055c7a0a4575a562b5add6252727~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/nannan-red-zebra-tshirt",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "les-bleus-sont-vert",
   "folder": "ics-v1-autumn-2025",
   "n": "LES BLEUS SONT VERTS JERSEY",
   "price": 95,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "fully painted white Jersey. Not available sadly.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_5dafe047fd264723a0cde5fcd7495621~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_72b01d05528f456281a142ea7174f3d4~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_2118cc4ea67d4b198e188f734e008fe0~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_9946e35f98cc4434b32790a7e4e0fe9c~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_2068d577395043399678d452a989a0f5~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_3332e3a468a14e34878e3e42581f1ea3~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/les-bleus-sont-vert",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "leather-denim",
   "folder": "ics-v1-autumn-2025",
   "n": "NEON COATED BLACK JEAN — MIMI",
   "price": 95,
   "cur": "€",
   "r": "sr",
   "out": 1,
   "desc": "Neon-coated Jean with Mimi painted in bright neon, not your regular denim! Made of 97% cotton and 3% elastane looks like leather!. Features bat embroidery, every stencil is hand cutted. Its everyone's favorite piece, it inspired the whole Neon black denim collection... so I'm keeping it for myself for now soryyy.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_65b80bf2c6bf46899208a3725e20fecc~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_90c81db0bc1a46bfb0ef617feca0541c~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_7edab381af2640648ccafe471ae49ae2~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_5621c632e37648f2894251a9d868e567~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/leather-denim",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "red-ics-jacket",
   "folder": "ics-v1-autumn-2025",
   "n": "RED RETRO JACKET",
   "price": 90,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "This vest didn't make it to the drop, she got snatched up too fast and became a victim of her own hype. Big respect to the homie!",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_0c91fe0a7f494aaea4a2e3010c3dc24a~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/red-ics-jacket",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "utopie-hoodie",
   "folder": "ics-v1-autumn-2025",
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
   "id": "mimi-hoodie",
   "folder": "ics-v1-autumn-2025",
   "n": "MIMI RED HOODIE",
   "price": 70,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Made from a cotton and polyester blend with a durable 380G weight, this M-size piece offers both warmth and long-lasting quality. Designed with an anti-pilling finish to maintain a clean look over time, it features an embroidered ICS logo for a refined, signature touch. Every piece is unique and made only once, ensuring no two are ever the same.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_5c84f97b42974885a472134d791681c7~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_4287ec6cf1654987a6d44aa4d8b0c823~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/mimi-hoodie",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "mimi-white-tshirt",
   "folder": "ics-v1-autumn-2025",
   "n": "MIMI WHITE TSHIRT",
   "price": 70,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "White T-shirt, 100% cotton. It got an embroidered logo on the sleeve and a red spray-painted skeleton drinking on the back. Simple but stands out. clean fit, size S.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_03959c0aa6674d2d892ca232de2a3098~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_4d42b2713af946f6abf9cc46a3722bd2~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8c4dee6f9d1c4d6e957a0ed3d545e7ae~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_f875155483694ec48c523372a446889a~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_f82898c21ca247ae816f5617a22b06d3~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_501b4439cf4c4b43bcca6945c10dd038~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_4a9ae6e5741f4b3c83b6a2df718d4026~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_7acbaab5ef00466cae887feacf461eec~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_9a702aeec74848898391d20354c0ca30~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/mimi-white-tshirt",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "biker-jacket-denim",
   "folder": "ics-v1-autumn-2025",
   "n": "SPRAY-PAINTED DENIM VEST",
   "price": 65,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Black denim jacket, size M. Sleeveless and spray-painted for a worn, custom look. Easy to style.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_7da8c0005df14a50bd8e6e12efb8599d~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_e5af74a7d54b4e1896748f63872da1ef~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_dc386f813bcc4d6ea246d271ce035bcc~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_c7be5e63f5174b33912e5ea75b613d20~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_10749089f521450eaa4261160b5d8a84~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_86270245a0b74a01a6f3ddbd6afb3a96~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/biker-jacket-denim",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "nanap-croptop",
   "folder": "ics-v1-autumn-2025",
   "n": "NANAP EIFFEL TOWER CROPTOP — MIMI",
   "price": 60,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "This one was made for a special person. Not avaiblable sorryy",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_97d14920a5a849ed989b0e16be821dcc~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ef3d639dffe14dabbb916d422ebee19c~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/nanap-croptop",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "nouveaux-punk-black",
   "folder": "ics-v1-autumn-2025",
   "n": "NOUVEAUX PUNK BLACK LONG SLEEVES",
   "price": 55,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Black long-sleeve top made from thin, breathable polyester. Pressed Nouveaux Punk design. Comes with the Mixtape Nouveaux Punk, scan the sleeve to listen to it. Each piece is unique and made only once",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_5cc5d5d17f644833b44267f12b3afc34~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_eaae3948d9824c15a06f55de23296e4d~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8f7fe3939d6445148af9c26055eaa690~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_effd1bb2ec3b4f35bbc1c62f9ee0e881~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_cca21b854f8e422c821a322c7cccae2e~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_61cbcaf06a5449098d442391a0f3d2d7~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_20fb4b8b46e24b91adc76fc3796c2274~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_4243a4636bad4103b12f27274c377df5~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_8410ac3171da443fb3ce918ef2e36bc5~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/nouveaux-punk-black",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "nouveaux-punk-crop-top",
   "folder": "ics-v1-autumn-2025",
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
   "id": "nouveaux-punk-red",
   "folder": "ics-v1-autumn-2025",
   "n": "NOUVEAUX PUNK RED LONG SLEEVE",
   "price": 55,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Red long-sleeve top made from thin, breathable polyester. Features the pressed Nouveaux Punk design. scan to listen to the Nouveaux mixtape.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_b447446f7b58402f9fa1f30017511e51~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_c420e779e6d84625beb2a772d994f7b6~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8207f7f4a3244f43a04a2ae4b50c3178~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_8b3a7b618e384e2995f864cd71dfdd7a~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_06241a08f4f04765936a22c54e7b7b9d~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/nouveaux-punk-red",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "20minzasession",
   "folder": "ics-v1-autumn-2025",
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
  },
  {
   "id": "coochie-eater-long-sleeve",
   "folder": "ics-v1-autumn-2025",
   "n": "COOCHIE EATER LONG SLEEVE",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "Long sleeve, size M, made from lightweight polyester. sleeves are painted with hand-cutted stencil. Each piece is unique and made only once.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_00d616327a6048008368c5dbac75cfcb~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_fe7b8d7acb4f4cf7a4bc7a2df38d3d79~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_b66c6e3c6698485baeef0a4587863e20~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg",
    "https://static.wixstatic.com/media/0fcae7_232b28922aec4614b386cd8f0d86d7e5~mv2.jpg/v1/fit/w_800,h_800,q_90/file.jpg"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/coochie-eater-long-sleeve",
    "stripe": "",
    "paypal": ""
   }
  },
  {
   "id": "racing-tshirt-only-ibee",
   "folder": "ics-v1-autumn-2025",
   "n": "RACING GREEN LONG SLEEVES ONLY IBEE",
   "price": 50,
   "cur": "€",
   "r": "c",
   "out": 1,
   "desc": "100% cotton with a heavy 270G weight, this oversized M-size piece delivers both comfort and structure. Each garment is hand-painted and features the ICS logo in embroidery with an ICS print. Every piece is unique and made only once, no two are ever the same.",
   "imgs": [
    "https://static.wixstatic.com/media/0fcae7_048211393a8e443a9ebdde0aea1da395~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_2da9afd7a42a4290b59d125b78c0c3cb~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_36a4ddaddb184b7393e09a7cc4082255~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_ccf5a601fbb943588d255c4d80d16d61~mv2.png/v1/fit/w_800,h_800,q_90/file.png",
    "https://static.wixstatic.com/media/0fcae7_24054400b9dc483e88467fb225f535e6~mv2.png/v1/fit/w_800,h_800,q_90/file.png"
   ],
   "pay": {
    "wix": "https://nebuladirection.wixsite.com/mysite/product-page/racing-tshirt-only-ibee",
    "stripe": "",
    "paypal": ""
   }
  }
 ]
};
