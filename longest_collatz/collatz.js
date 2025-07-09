/*x/2 3x+1
milyona kadar kontrol 
dizi uzunlugu hesapla
enuzun diziyi sayiyi sakla   */
function collatzSequenceLength(x) {
  let len = 1;
  while (x !== 1) {
    if (x % 2 === 0) {
      x = x / 2;
    } else {
      x = 3 * x + 1;
    }
    len++;
  }
  return len;
}

let maxLen = 0;
let numMaxLen = 0;

for (let i = 1; i < 1000000; i++) {
  let currentLength = collatzSequenceLength(i);
  if (currentLength > maxLen) {
    maxLen = currentLength;
    numMaxLen = i;
  }
}

console.log("En uzun Collatz dizisini üreten sayı:", numMaxLen);
console.log("Dizinin uzunluğu:", maxLen);
