$(document).ready(function () {

  const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
  });

  function updateCartCount() {
    const count = $("#cart .product-card").length;
    $(".tab-btn[data-tab='cart'] .badge").text(count);
  }

  $.fn.sepetEkle = function() {
    this.on('click', function() {
      const card = $(this).closest(".product-card").clone(true);
      card.find('.favorite-btn, .detailBtn, .toggleDesc').remove();
      
      card.append('<button class="remove-btn secondary-btn">Kaldır</button>');
      
      card.css({ opacity: 0, transform: 'scale(0.9)' });
      $("#cart").append(card);
      card.animate({ opacity: 1, transform: 'scale(1)' }, 300);
      
      $(this).animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
      
      saveToStorage();
      updateCartCount();
    });
    return this;
  };

  $('.tab-btn').on('click', function() {
    $('.tab-btn').removeClass('active');
    $(this).addClass('active');
    
    $('.tab-content').removeClass('active');
    $('#' + $(this).data('tab')).addClass('active');
  });

  function fetchProducts() {
    $.get("https://fakestoreapi.com/products", function (data) {
      $("#productList").empty();
      $(".swiper-wrapper").empty();


      $.each(data, function (i, product) {
        const isFavorite = checkIfFavorite(product.id);
        const productCard = $(`
          <div class="product-card fade-in" data-id="${product.id}" style="animation-delay: ${i * 0.1}s">
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" title="${isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}">♥</button>
            <img src="${product.image}" alt="${product.title}" loading="lazy" />
            <h4>${product.title}</h4>
            <p><strong>${product.price} $</strong></p>
            <div class="button-group">
              <button class="addToCartBtn">Sepete Ekle</button>
              <button class="detailBtn">Detay</button>
              <button class="toggleDesc">Açıklama</button>
            </div>
            <p class="product-description">${product.description}</p>
          </div>
        `);
        $("#productList").append(productCard);

        const slide = $(`
          <div class="swiper-slide">
            <img src="${product.image}" alt="${product.title}" style="max-height:160px;object-fit:contain;margin:0 auto;display:block;background:#fff;padding:10px;border-radius:8px;" />
          </div>
        `);
        $(".swiper-wrapper").append(slide);
      });

      $(".addToCartBtn").sepetEkle();

      $(".toggleDesc").on("click", function() {
        $(this).closest(".product-card").find(".product-description").slideToggle();
        $(this).text(function(i, text) {
          return text === "Açıklama" ? "Gizle" : "Açıklama";
        });
      });
      if (window.swiper && window.swiper.update) {
        window.swiper.update();
      }
    }).fail(function() {
      $("#productList").html('<p class="empty-message">Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>');
    });
  }

  fetchProducts();

  function checkIfFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.includes(productId);
  }

  $("#productList").on("click", ".favorite-btn", function() {
    const productCard = $(this).closest(".product-card");
    const productId = productCard.data("id");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
    if ($(this).hasClass("active")) {
      favorites = favorites.filter(id => id !== productId);
      $(this).removeClass("active").attr("title", "Favorilere ekle");
    } else {
      favorites.push(productId);
      $(this).addClass("active").attr("title", "Favorilerden çıkar");
    }
    
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavoritesFromStorage();
  });

  function loadFavoritesFromStorage() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const products = $("#productList .product-card");
    
    $("#favorites").empty();
    
    if (favorites.length === 0) {
      $("#favorites").html('<p class="empty-message">Favori ürün bulunmamaktadır.</p>');
      return;
    }
    
    favorites.forEach(id => {
      const product = products.filter(`[data-id="${id}"]`);
      if (product.length) {
        const favoriteCard = product.clone(true);
        favoriteCard.find('.addToCartBtn, .toggleDesc').remove();
        favoriteCard.append('<button class="remove-btn secondary-btn">Kaldır</button>');
        $("#favorites").append(favoriteCard);
      }
    });
  }

  $("#clearCart").click(function() {
    $("#cart").empty();
    localStorage.removeItem("cart");
    updateCartCount();
    $("#cart").html('<p class="empty-message">Sepetiniz boş</p>');
  });

  $("#clearFavorites").click(function() {
    localStorage.removeItem("favorites");
    loadFavoritesFromStorage();
    $(".favorite-btn").removeClass("active").attr("title", "Favorilere ekle");
  });

  $("#cart, #favorites").on("click", ".remove-btn", function() {
    const card = $(this).closest(".product-card");
    card.animate({ opacity: 0, height: 0 }, 300, function() {
      card.remove();
      saveToStorage();
      updateCartCount();
      
      if ($("#cart .product-card").length === 0) {
        $("#cart").html('<p class="empty-message">Sepetiniz boş</p>');
      }
      if ($("#favorites .product-card").length === 0) {
        $("#favorites").html('<p class="empty-message">Favori ürün bulunmamaktadır.</p>');
      }
    });
  });

  function saveToStorage() {
    let cartItems = [];
    $("#cart .product-card").each(function() {
      const title = $(this).find("h4").text();
      const price = $(this).find("p").text();
      const img = $(this).find("img").attr("src");
      const id = $(this).data("id");
      cartItems.push({ id, title, price, img });
    });
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  function loadCartFromStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      if (cartItems.length > 0) {
        cartItems.forEach(item => {
          const card = $(`
            <div class="product-card" data-id="${item.id}">
              <img src="${item.img}" loading="lazy" />
              <h4>${item.title}</h4>
              <p>${item.price}</p>
              <button class="remove-btn secondary-btn">Kaldır</button>
            </div>
          `);
          $("#cart").append(card);
        });
      } else {
        $("#cart").html('<p class="empty-message">Sepetiniz boş</p>');
      }
    } else {
      $("#cart").html('<p class="empty-message">Sepetiniz boş</p>');
    }
    updateCartCount();
  }

  $("#productList").on("click", ".detailBtn", function() {
    const card = $(this).closest(".product-card");
    const img = card.find("img").attr("src");
    const title = card.find("h4").text();
    const price = card.find("p").text();
    const desc = card.find(".product-description").text();

    Fancybox.show([{
      src: `
        <div class="product-detail-modal">
          <img src="${img}" style="max-width:300px;max-height:300px;margin-bottom:20px;">
          <h3>${title}</h3>
          <p style="font-size:24px;color:var(--primary-color);margin:10px 0;">${price}</p>
          <p>${desc}</p>
          <button class="addToCartBtn" style="margin-top:20px;">Sepete Ekle</button>
        </div>
      `,
      type: "html",
    }]);
  });

  function performSearch(query) {
    if (query === "") {
      fetchProducts();
      return;
    }

    $.get("https://fakestoreapi.com/products")
      .done(function(products) {
        const filtered = products.filter(p => 
          p.id.toString().includes(query) || 
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.price.toString().includes(query)
        );

        $("#productList").empty();
        
        if (filtered.length) {
          $.each(filtered, function(i, product) {
            const card = $(`
              <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.title}" loading="lazy" />
                <h4>${product.title}</h4>
                <p><strong>${product.price} $</strong></p>
                <div class="button-group">
                  <button class="addToCartBtn">Sepete Ekle</button>
                  <button class="detailBtn">Detay</button>
                </div>
              </div>
            `);
            $("#productList").append(card);
          });
          
          $(".addToCartBtn").sepetEkle();
        } else {
          $("#productList").html('<p class="empty-message">Aradığınız kriterlere uygun ürün bulunamadı.</p>');
        }
      })
      .fail(function() {
        $("#productList").html('<p class="empty-message">Arama yapılırken bir hata oluştu.</p>');
      });
  }

  let searchTimer;
  $("#searchInput").on("input", function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      performSearch($(this).val().trim().toLowerCase());
    }, 500);
  });

  $("#searchBtn").click(function() {
    performSearch($("#searchInput").val().trim().toLowerCase());
  });

  loadCartFromStorage();
  loadFavoritesFromStorage();
});