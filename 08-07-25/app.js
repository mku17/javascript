let user = JSON.parse(localStorage.getItem("user"));

function isNumber(value) {
  return !isNaN(value) && value.trim() !== "";
}

if (!user) {
  const name = prompt("Adınız:");
  let age;

  //sayi girilmesi isteniyor
  while (true) {
    age = prompt("Yaşınız:");
    if (isNumber(age)) {
      age = parseInt(age);
      break;
    } else {
      alert("Lütfen geçerli bir sayı giriniz.");
    }
  }

  const job = prompt("Mesleğiniz:");
  user = { name, age, job };
  localStorage.setItem("user", JSON.stringify(user));
}

console.log("👤 Kullanıcı Bilgisi:", user);

// kullanici karsilama
const greetingEl = document.getElementById("greeting");
greetingEl.textContent = `Merhaba, ${user.name}!`;

if (user.age < 18) {
  alert("⚠️ 18 yaş altına takviye ürün satışı yapılmamaktadır.");
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];


const buttons = document.querySelectorAll(".product-card button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");

    //tukeneni ekletmeme
    if (card.querySelector(".badge")) {
      alert("❌ Bu ürün tükenmiştir.");
      return;
    }

    const name = card.querySelector("h3").innerText;
    const priceText = card.querySelector("p").innerText.replace(" TL", "").replace(",", ".");
    const price = parseFloat(priceText);

    cart.push({ name, price });
    saveCart();
    alert(`${name} sepete eklendi.`);
    updateCartDisplay();
  });
});


function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartItems.innerHTML = "Henüz ürün eklenmedi.";
    cartTotal.innerHTML = "<strong>Toplam:</strong> 0.00₺";
    return;
  }

  cartItems.innerHTML = cart.map((item, i) => {
  return `
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background-color: #f8f9fa;
      border: 1px solid #ddd;
      border-radius: 8px;
    ">
      <div>
        <strong>${item.name}</strong><br>
        <small>${item.price.toFixed(2)}₺</small>
      </div>
      <button onclick="removeProductByIndex(${i})" style="
        background-color: #ff4d4f;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 6px 10px;
        cursor: pointer;
      ">❌</button>
    </div>
  `;
}).join("");


  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.innerHTML = `<strong>Toplam:</strong> ${total.toFixed(2)}₺`;


  console.clear();
  console.log("🛒 Sepet:");
  cart.forEach((item, i) => {
    console.log(`${i + 1}. ${item.name} - ${item.price.toFixed(2)}₺`);
  });
  console.log(`💰 Toplam: ${total.toFixed(2)}₺`);
}

//urunu cikartma
function removeProductByIndex(index) {
  const removed = cart.splice(index, 1)[0];
  alert(`${removed.name} sepetten çıkarıldı.`);
  saveCart();
  updateCartDisplay();
}

//sepeti tamamen bosalt
function clearCart() {
  if (cart.length === 0) {
    alert("Sepet zaten boş.");
    return;
  }

  if (confirm("Sepeti tamamen temizlemek istiyor musunuz?")) {
    cart = [];
    saveCart();
    updateCartDisplay();
    alert("Sepet temizlendi.");
  }
}


function addCustomProduct() {
  const name = prompt("Eklemek istediğiniz ürünün adı:");
  const price = parseFloat(prompt("Fiyatı:"));
  if (!isNaN(price)) {
    cart.push({ name, price });
    saveCart();
    alert(`${name} sepete eklendi.`);
    updateCartDisplay();
  } else {
    alert("❌ Geçersiz fiyat girdiniz.");
  }
}


function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

updateCartDisplay();

function resetUserData() {
  if (confirm("Kullanıcı bilgilerini sıfırlamak istiyor musunuz?")) {
    localStorage.removeItem("user");
    location.reload();
  }
}


