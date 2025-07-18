$(document).ready(function() {
    // TEMA AYARLARI
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
    
    $('#theme-toggle').click(function() {
        const newTheme = $('body').hasClass('dark-theme') ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // SAYFA AÇILDIĞINDA OTOMATİK YÜKLEME
    setTimeout(() => loadProfiles(6), 500);

    // BUTON EVENTLERİ
    $('#load-profiles')
        .click(function() {
            const count = parseInt($('#profile-count').val());
            loadProfiles(count);
            $(this).effect('shake', { times: 2, distance: 5 }, 300);
        })
        .hover(
            function() { $(this).effect('bounce', { times: 2 }, 200); },
            function() { $(this).stop(true, true); }
        );
});

// ------------------ FONKSİYONLAR ------------------

function setTheme(theme) {
    $('body').removeClass('light-theme dark-theme').addClass(theme + '-theme');
    $('#theme-toggle').text(theme === 'dark' ? '☀️ Aydınlık Mod' : '🌙 Karanlık Mod');
}

function loadProfiles(count) {
    console.log(`${count} profil yükleniyor...`);
    
    $('#profiles-container').html('<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Profiller yükleniyor...</div>').hide().slideDown(300);
    
    // Slider kontrolü
    if ($('#profile-slider').hasClass('slick-initialized')) {
        $('#profile-slider').slick('unslick');
    }
    $('#profile-slider').empty();
    $('#slider-notice').hide();

    $.ajax({
        url: `https://randomuser.me/api/?results=${count}&no-cache=${Date.now()}`,
        dataType: 'json',
        success: function(data) {
            if(!data.results) throw new Error("Geçersiz veri formatı");
            renderProfiles(data.results);
        },
        error: function(xhr, status, error) {
            console.error("API Hatası:", status, error);
            showError(error);
        }
    });
}

function renderProfiles(profiles) {
    $('#profiles-container').empty();
    
    // Ana Container
    profiles.forEach((profile, i) => {
        createProfileCard(profile, '#profiles-container', i);
    });

    // Slider (En az 2 profil varsa)
    const sliderProfiles = profiles.slice(0, 5);
    if(sliderProfiles.length >= 2) {
        sliderProfiles.forEach((profile, i) => {
            createProfileCard(profile, '#profile-slider', i, true);
        });
        initSlider();
    } else {
        $('#slider-notice').show();
    }

    animateCards();
}

function createProfileCard(profile, container, index, isSlider = false) {
    const { first, last } = profile.name;
    const cardHTML = `
        <div class="profile-card" data-index="${index}">
            <img src="${profile.picture.large}" alt="${first} ${last}" class="profile-img">
            <div class="profile-info">
                <div class="profile-name">${first} ${last}</div>
                <div class="profile-email">${profile.email}</div>
                <div class="profile-country"><i class="fas fa-map-marker-alt"></i> ${profile.location.country}</div>
            </div>
        </div>
    `;
    
    $(container).append(cardHTML);

    if (!isSlider) {
        $(`${container} .profile-card[data-index="${index}"]`)
            .hover(
                function() {
                    $(this).addClass('highlight');
                    $(this).find('img').fadeTo(200, 0.8);
                },
                function() {
                    $(this).removeClass('highlight');
                    $(this).find('img').fadeTo(200, 1);
                }
            )
            .click(() => showDetails(profile));
    }
}

function initSlider() {
    $('#profile-slider').not('.slick-initialized').slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: Math.min(3, $('#profile-slider').children().length),
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
}

function animateCards() {
    $('#profiles-container').slideDown(300);
    $('.profile-card').each(function(i) {
        $(this).delay(i*100).slideDown(500, function() {
            $(this).addClass('visible').css('display', 'flex');
        });
    });
}

function showDetails(profile) {
    Fancybox.show([{
        src: `
            <div class="modal-content">
                <img src="${profile.picture.large}" class="modal-img">
                <h3>${profile.name.first} ${profile.name.last}</h3>
                <p><b><i class="fas fa-birthday-cake"></i> Yaş:</b> ${profile.dob.age}</p>
                <p><b><i class="fas fa-envelope"></i> Email:</b> ${profile.email}</p>
                <p><b><i class="fas fa-phone"></i> Telefon:</b> ${profile.phone}</p>
                <p><b><i class="fas fa-map-marked-alt"></i> Adres:</b> ${profile.location.street.number} ${profile.location.street.name}</p>
                <p><b><i class="fas fa-city"></i> Şehir:</b> ${profile.location.city}</p>
                <p><b><i class="fas fa-globe"></i> Ülke:</b> ${profile.location.country}</p>
            </div>
        `,
        type: 'html'
    }]);
}

function showError(error) {
    $('#profiles-container').html(`
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Veri yüklenirken hata oluştu</p>
            <button class="btn" onclick="loadProfiles(3)">
                <i class="fas fa-redo"></i> Tekrar Dene
            </button>
            <small>${error || 'Bilinmeyen hata'}</small>
        </div>
    `).slideDown(300);
}