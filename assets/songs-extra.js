/* IBEE EXTRA RECORDS - new songs joining the site, pressed in IBEE STUDIO.
   player.js adds them to the radio; console.html gives them a planet (and new
   albums a galaxy). Additive only - built-in songs are deduped by filename.

   NOTE: the 27 NOUVEAUX PUNK tracks live in assets/audio/np/ (not the usual
   assets/audio/songs/). Their `r` fallback carries the full folder-relative
   path so the player's existing candidate chain (…/songs/f → /f → /r) resolves
   them from that folder — same trick as U MINE loading from the site root. */
window.IBEE_SONGS_EXTRA={"songs":[
{"f":"20mzs.mp3","r":"20mzs-raw.mp3","n":"20MZS","hue":42,"g":"rss","len":1200},
{"f":"all-i-need.mp3","r":"all i need v1.mp3","n":"ALL I NEED","hue":338,"g":"rss","len":130},
{"f":"bounceee.mp3","r":"bounceee3.mp3","n":"BOUNCEEE","hue":226,"g":"rss","len":138},
{"f":"callin-on-u.mp3","r":"callin on u .mp3","n":"CALLIN ON U","hue":323,"g":"rss","len":213},
{"f":"freestyle-sept9.mp3","r":"freestylesept9.mp3","n":"FREESTYLE SEPT9","hue":253,"g":"rss","len":134},
{"f":"head.mp3","r":"head .mp3","n":"HEAD","hue":330,"g":"rss","len":164},
{"f":"lonely22.mp3","r":"lonely22.mp3","n":"LONELY22","hue":297,"g":"rss","len":185},
{"f":"maintenant.mp3","r":"maintenant.mp3","n":"MAINTENANT","hue":309,"g":"rss","len":64},
{"f":"mix-100.mp3","r":"mix 100.mp3","n":"MIX 100","hue":242,"g":"rss","len":145},
{"f":"nananannn.mp3","r":"nananannn.mp3","n":"NANANANNN","hue":279,"g":"rss","len":256},
{"f":"obsess.mp3","r":"obsess.mp3","n":"OBSESS","hue":223,"g":"rss","len":255},
{"f":"real-to-me.mp3","r":"real to me .mp3","n":"REAL TO ME","hue":125,"g":"rss","len":170},
{"f":"ride-it.mp3","r":"riddeit2.mp3","n":"RIDE IT","hue":194,"g":"rss","len":183},
{"f":"right-middle.mp3","r":"right middle.mp3","n":"RIGHT MIDDLE","hue":328,"g":"rss","len":180},
{"f":"silouhette.mp3","r":"silouhette.mp3","n":"SILOUHETTE","hue":182,"g":"rss","len":230},
{"f":"strippin-down.mp3","r":"strippin down.mp3","n":"STRIPPIN DOWN","hue":12,"g":"rss","len":168},
{"f":"to-our-pain.mp3","r":"to our pain .mp3","n":"TO OUR PAIN","hue":171,"g":"rss","len":174},
{"f":"u-mine.mp3","r":"u mine.mp3","n":"U MINE","hue":307,"g":"np","len":168},
{"f":"un-salaire.mp3","r":"un salaire.mp3","n":"UN SALAIRE","hue":7,"g":"que-du-beneff","len":175},
{"f":"write-a-song.mp3","r":"write a song v1.mp3","n":"WRITE A SONG","hue":89,"g":"rss","len":180},
{"f":"yo-body.mp3","r":"yo body .mp3","n":"YO BODY","hue":35,"g":"rss","len":187},
{"f":"np-01-dsl-de-l-attente.mp3","r":"assets/audio/np/np-01-dsl-de-l-attente.mp3","n":"DSL DE L'ATTENTE","hue":0,"g":"np","len":180},
{"f":"np-02-toujours.mp3","r":"assets/audio/np/np-02-toujours.mp3","n":"TOUJOURS","hue":13,"g":"np","len":180},
{"f":"np-03-je-ne-regrette-rien.mp3","r":"assets/audio/np/np-03-je-ne-regrette-rien.mp3","n":"JE NE REGRETTE RIEN","hue":27,"g":"np","len":180},
{"f":"np-04-get-loose.mp3","r":"assets/audio/np/np-04-get-loose.mp3","n":"GET LOOSE","hue":40,"g":"np","len":180},
{"f":"np-05-comme-les-autres.mp3","r":"assets/audio/np/np-05-comme-les-autres.mp3","n":"COMME LES AUTRES","hue":53,"g":"np","len":180},
{"f":"np-06-stresse.mp3","r":"assets/audio/np/np-06-stresse.mp3","n":"STRESSÉ","hue":67,"g":"np","len":180},
{"f":"np-07-to-get-u.mp3","r":"assets/audio/np/np-07-to-get-u.mp3","n":"TO GET U","hue":80,"g":"np","len":180},
{"f":"np-08-ne-me-laisse-pas.mp3","r":"assets/audio/np/np-08-ne-me-laisse-pas.mp3","n":"NE ME LAISSE PAS","hue":93,"g":"np","len":180},
{"f":"np-09-je-m-en-vais.mp3","r":"assets/audio/np/np-09-je-m-en-vais.mp3","n":"JE M'EN VAIS","hue":107,"g":"np","len":180},
{"f":"np-10-trop-tard.mp3","r":"assets/audio/np/np-10-trop-tard.mp3","n":"TROP TARD","hue":120,"g":"np","len":180},
{"f":"np-11-vie-de-merde.mp3","r":"assets/audio/np/np-11-vie-de-merde.mp3","n":"VIE DE MERDE","hue":133,"g":"np","len":180},
{"f":"np-12-je-sens-le-blues-interlude.mp3","r":"assets/audio/np/np-12-je-sens-le-blues-interlude.mp3","n":"JE SENS LE BLUES (INTERLUDE)","hue":147,"g":"np","len":180},
{"f":"np-13-merci-bye-bye.mp3","r":"assets/audio/np/np-13-merci-bye-bye.mp3","n":"MERCI BYE BYE","hue":160,"g":"np","len":180},
{"f":"np-14-roule-un-auuutre.mp3","r":"assets/audio/np/np-14-roule-un-auuutre.mp3","n":"ROULE UN AUUUTRE","hue":173,"g":"np","len":180},
{"f":"np-15-du-love.mp3","r":"assets/audio/np/np-15-du-love.mp3","n":"DU LOVE","hue":187,"g":"np","len":180},
{"f":"np-16-que-faut-il.mp3","r":"assets/audio/np/np-16-que-faut-il.mp3","n":"QUE FAUT-IL","hue":200,"g":"np","len":180},
{"f":"np-17-plus-d-espoirs.mp3","r":"assets/audio/np/np-17-plus-d-espoirs.mp3","n":"PLUS D'ESPOIRS","hue":213,"g":"np","len":180},
{"f":"np-18-desert.mp3","r":"assets/audio/np/np-18-desert.mp3","n":"DÉSERT","hue":227,"g":"np","len":180},
{"f":"np-19-fans-seulement-mix-1.mp3","r":"assets/audio/np/np-19-fans-seulement-mix-1.mp3","n":"FANS SEULEMENT","hue":240,"g":"np","len":180},
{"f":"np-20-baby-let-s-go.mp3","r":"assets/audio/np/np-20-baby-let-s-go.mp3","n":"BABY LET'S GO","hue":253,"g":"np","len":180},
{"f":"np-21-dans-la-street.mp3","r":"assets/audio/np/np-21-dans-la-street.mp3","n":"DANS LA STREET","hue":267,"g":"np","len":180},
{"f":"np-22-radio-hit.mp3","r":"assets/audio/np/np-22-radio-hit.mp3","n":"RADIO HIT","hue":280,"g":"np","len":180},
{"f":"np-23-lost-in-the-world.mp3","r":"assets/audio/np/np-23-lost-in-the-world.mp3","n":"LOST IN THE WORLD","hue":293,"g":"np","len":180},
{"f":"np-24-chouf-chouf-topline.mp3","r":"assets/audio/np/np-24-chouf-chouf-topline.mp3","n":"CHOUF CHOUF","hue":307,"g":"np","len":180},
{"f":"np-25-anormal.mp3","r":"assets/audio/np/np-25-anormal.mp3","n":"ANORMAL","hue":320,"g":"np","len":180},
{"f":"np-26-si-jamais.mp3","r":"assets/audio/np/np-26-si-jamais.mp3","n":"SI JAMAIS","hue":333,"g":"np","len":180},
{"f":"np-27-celui-qu-elle-veut.mp3","r":"assets/audio/np/np-27-celui-qu-elle-veut.mp3","n":"CELUI QU'ELLE VEUT","hue":347,"g":"np","len":180}
],"galaxies":[{"id":"que-du-beneff","name":"QUE DU BENEFF","sub":"CASH MUSIC","hue":7}]};
