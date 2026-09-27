/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 6. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.0, tr: '7’nin 2 çarpanı var, 12’nin 6 çarpanı', en: '7 has 2 factors, 12 has 6',
      note: '7 yalnızca 1 çarpı 7 diye yazılır. 12 ise 1 çarpı 12, 2 çarpı 6, 3 çarpı 4 diye yazılabilir. Bazı sayıların çarpanı çok, bazılarının çok az.' },
    { scene: 2, start: 10.6, end: 15.6, tr: 'Asal sayı: yalnızca 1’e ve kendisine bölünür', en: 'A prime is divisible only by 1 and itself',
      note: 'Yalnızca 1’e ve kendisine bölünen, yani tam iki çarpanı olan sayılara asal sayı denir. 1’den 30’a kadar asalları bulalım. 1’in tek çarpanı var; o asal değil.' },
    { scene: 2, start: 16.0, end: 19.8, tr: '2 asal; 2’nin diğer katları elenir', en: '2 is prime; its other multiples are out',
      note: '2 asal. 2’nin katları 2’ye bölündüğü için asal olamaz: 4, 6, 8 ve diğerlerini eleyelim.' },
    { scene: 2, start: 20.2, end: 26.2, tr: 'Sonra 3’ün ve 5’in katları', en: 'Then the multiples of 3 and of 5',
      note: '3 asal; 3’ün elenmemiş katları 9, 15, 21 ve 27. 5 asal; geriye yalnızca 25 kalıyor.' },
    { scene: 2, start: 26.4, end: 29.8, tr: '7’nin katları zaten elendi', en: 'The multiples of 7 are already out',
      note: '7 de asal. 14, 21 ve 28 zaten elendi; 49 ise 30’dan büyük. Elenmeyen sayıların hepsi asal.' },
    { scene: 2, start: 30.0, end: 34.0, tr: '30’a kadar 10 asal sayı var', en: 'There are 10 primes up to 30',
      note: '2, 3, 5, 7, 11, 13, 17, 19, 23 ve 29. Bu yönteme Eratosthenes kalburu denir.' },
    { scene: 3, start: 34.6, end: 37.2, tr: '2, tek çift asal sayıdır', en: '2 is the only even prime',
      note: 'Diğer bütün çift sayılar 2’ye de bölünür, bu yüzden asal değildir. 2 tek çift asal sayıdır.' },
    { scene: 3, start: 37.4, end: 40.2, tr: '1 ne asal ne bileşik', en: '1 is neither prime nor composite',
      note: '1’in yalnızca bir çarpanı var: kendisi. Bu yüzden 1 ne asaldır ne bileşiktir.' },
    { scene: 3, start: 40.4, end: 45.8, tr: 'Asal olmayan sayılar bileşiktir', en: 'Numbers that aren’t prime are composite',
      note: '1’den büyük ve asal olmayan sayılara bileşik sayı denir. 9, 3 çarpı 3’tür; 1, 3 ve 9 olmak üzere üç çarpanı var.' },
    { scene: 4, start: 46.6, end: 55.2, tr: '60 = 6 × 10, 6 = 2 × 3, 10 = 2 × 5', en: '60 = 6 × 10, 6 = 2 × 3, 10 = 2 × 5',
      note: '60’ı çarpanlarına ayıralım: 6 çarpı 10. 6, 2 çarpı 3; 10, 2 çarpı 5. Dallar asal sayılarda biter.' },
    { scene: 4, start: 55.4, end: 62.8, tr: 'Bu kez 60 = 4 × 15 ile başlayalım', en: 'This time start with 60 = 4 × 15',
      note: 'Başka bir yoldan başlasak ne olur? 60, 4 çarpı 15. 4, 2 çarpı 2; 15, 3 çarpı 5.' },
    { scene: 4, start: 63.0, end: 69.6, tr: 'İki yol, aynı asal çarpanlar: 2, 2, 3, 5', en: 'Two routes, the same prime factors: 2, 2, 3, 5',
      note: 'Hangi yoldan gidersek gidelim aynı asal çarpanlara ulaşırız: 60 = 2 × 2 × 3 × 5. 60’ın asal çarpanları 2, 3 ve 5’tir.' },
    { scene: 5, start: 70.6, end: 76.8, tr: 'Her bileşik sayıyı asallara ayırabiliriz', en: 'Every composite number splits into primes',
      note: 'Başka sayılarla deneyelim: 12 = 2 × 2 × 3, 30 = 2 × 3 × 5, 49 = 7 × 7. 29 ise asal; tek asal çarpanı kendisi.' },
    { scene: 5, start: 77.0, end: 79.8, tr: 'Asallar, sayıların yapı taşlarıdır', en: 'Primes are the building blocks of numbers',
      note: 'Bileşik sayılar asal sayıların çarpımıdır. Asal sayılar, sayıların yapı taşları gibidir.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Asal: tam 2 çarpan · bileşik: asalların çarpımı', en: 'Prime: exactly 2 factors · composite: a product of primes',
      note: 'Aklında kalsın: asal sayının tam iki çarpanı vardır. 1 asal değildir, 2 tek çift asaldır. Her bileşik sayı asal çarpanlarına ayrılabilir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: '60 = 2 × 2 × 3 × 5', en: '60 = 2 × 2 × 3 × 5',
      note: '60 = 2 × 2 × 3 × 5.' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
