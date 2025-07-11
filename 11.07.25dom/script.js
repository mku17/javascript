let sayac;
let kalanSure = 0;

const baslatButonu = document.getElementById("baslatButonu");
const sifirlaButonu = document.getElementById("sifirlaButonu");
const saniyeGirisi = document.getElementById("saniyeGirisi");
const geriSayimGosterge = document.getElementById("geriSayimGosterge");

baslatButonu.addEventListener("click", () => {
  if (sayac) clearInterval(sayac);

  kalanSure = parseInt(saniyeGirisi.value);

  if (isNaN(kalanSure) || kalanSure <= 0) {
    alert("Lütfen geçerli bir saniye giriniz.");
    return;
  }

  geriSayimGosterge.textContent = `Süre: ${kalanSure}`;

  sayac = setInterval(() => {
    kalanSure--;
    if (kalanSure <= 0) {
      clearInterval(sayac);
      geriSayimGosterge.textContent = "Süre doldu!";
    } else {
      geriSayimGosterge.textContent = `Süre: ${kalanSure}`;
    }
  }, 1000);
});

sifirlaButonu.addEventListener("click", () => {
  clearInterval(sayac);
  kalanSure = 0;
  geriSayimGosterge.textContent = "Süre: -";
  saniyeGirisi.value = "";
});
