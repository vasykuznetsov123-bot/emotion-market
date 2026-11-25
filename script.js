const experiences = [
    {
        id: "EXP-001",
        title: "Свидание в гончарной мастерской на Арбате",
        category: "date",
        trigger: "❤️ Хит для двоих",
        partner: "ИП Смирнова А.В. (Студия «Глина»)",
        price: 5900,
        emoji: "🏺",
        bg: "linear-gradient(135deg, #fbcfe8, #f472b6)",
        desc: "Индивидуальный мастер-класс за гончарным кругом при свечах. Два готовых изделия останутся вам на память."
    },
    {
        id: "EXP-002",
        title: "Тайные дворики Китай-города и Хитровки",
        category: "tour",
        trigger: "🔥 Осталось 2 сертификата",
        partner: "ООО «Москва Глазами Инженера»",
        price: 2400,
        emoji: "🏛️",
        bg: "linear-gradient(135deg, #fde68a, #f59e0b)",
        desc: "Авторская прогулка-исследование по непарадной Москве с местным историком. Без скучных дат, только живые истории."
    },
    {
        id: "EXP-003",
        title: "Арт-терапия: рисование вином и акрилом",
        category: "relax",
        trigger: "✨ Снимает стресс за 2 часа",
        partner: "Студия «Арт-Волна»",
        price: 3500,
        emoji: "🎨",
        bg: "linear-gradient(135deg, #ddd6fe, #8b5cf6)",
        desc: "Вечер расслабления в лофте на Флаконе. Напишете картину на холсте даже если последний раз держали кисть в школе."
    },
    {
        id: "EXP-004",
        title: "Полёт в аэротрубе в Крылатском",
        category: "drive",
        trigger: "⚡ Максимум адреналина",
        partner: "ООО «Аэропоток МСК»",
        price: 4800,
        emoji: "🪂",
        bg: "linear-gradient(135deg, #bae6fd, #0284c7)",
        desc: "Ощущение свободного падения без прыжка с парашютом. Включена экипировка, инструктаж и видео на память."
    },
    {
        id: "EXP-005",
        title: "Ночная экскурсия по крышам центра Москвы",
        category: "date",
        trigger: "🌃 Лучший вид на огни города",
        partner: "ИП Волков Д.С. (Руф-туры)",
        price: 3900,
        emoji: "🌆",
        bg: "linear-gradient(135deg, #c7d2fe, #4338ca)",
        desc: "Безопасный выход на панорамную площадку с видом на Кремль и высотки. Горячий чай и пледы включены."
    },
    {
        id: "EXP-006",
        title: "Мастер-класс по созданию своего парфюма",
        category: "relax",
        trigger: "🎁 Идеально в подарок",
        partner: "Лаборатория «Аромат.Лаб»",
        price: 4500,
        emoji: "🧪",
        bg: "linear-gradient(135deg, #bbf7d0, #16a34a)",
        desc: "Под руководством парфюмера соберёте индивидуальный флакон духов из 40 натуральных эссенций."
    }
];

let selectedExperience = null;

function getCertificates() {
    return JSON.parse(localStorage.getItem("msk_certificates") || "[]");
}

function saveAllCertificates(list) {
    localStorage.setItem("msk_certificates", JSON.stringify(list));
}

function saveCertificate(cert) {
    const list = getCertificates();
    list.unshift(cert);
    saveAllCertificates(list);
}

function generatePromoCode() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return "MSK-" + randomNum;
}

function renderCatalog(filterCategory) {
    if (!filterCategory) filterCategory = "all";
    const grid = document.getElementById("catalog-grid");
    grid.innerHTML = "";

    const filtered = filterCategory === "all"
        ? experiences
        : experiences.filter(function(item) { return item.category === filterCategory; });

    filtered.forEach(function(item) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML =
            '<div class="card-banner" style="background: ' + item.bg + '">' +
                '<span class="trigger-badge">' + item.trigger + '</span>' +
                '<span>' + item.emoji + '</span>' +
            '</div>' +
            '<div class="card-body">' +
                '<div class="card-partner">Партнёр: ' + item.partner + '</div>' +
                '<div class="card-title">' + item.title + '</div>' +
                '<div class="card-desc">' + item.desc + '</div>' +
                '<div class="card-footer">' +
                    '<div class="card-price">' + item.price.toLocaleString("ru-RU") + ' ₽</div>' +
                    '<button class="buy-btn" onclick="openOrderModal(\'' + item.id + '\')">Купить в подарок</button>' +
                '</div>' +
            '</div>';
        grid.appendChild(card);
    });
}
function openOrderModal(expId) {
    selectedExperience = experiences.find(function(e) { return e.id === expId; });
    if (!selectedExperience) return;

    document.getElementById("modal-exp-title").textContent = selectedExperience.title;
    document.getElementById("modal-exp-price").textContent = selectedExperience.price.toLocaleString("ru-RU") + " ₽";
    document.getElementById("order-modal").classList.add("open");
}

document.getElementById("close-order-modal").addEventListener("click", function() {
    document.getElementById("order-modal").classList.remove("open");
});

document.getElementById("close-cert-modal").addEventListener("click", function() {
    document.getElementById("cert-modal").classList.remove("open");
});

document.getElementById("order-form").addEventListener("submit", function(e) {
    e.preventDefault();
    if (!selectedExperience) return;

    const recipient = document.getElementById("recipient-name").value.trim();
    const contact = document.getElementById("buyer-contact").value.trim();
    const wish = document.getElementById("gift-message").value.trim() || "Пусть этот день подарит яркие эмоции!";
    const promoCode = generatePromoCode();
    const commission = Math.round(selectedExperience.price * 0.10);

    const newCert = {
        promoCode: promoCode,
        status: "Продан",
        createdAt: new Date().toLocaleString("ru-RU"),
        redeemedAt: null,
        document1C: "Операция по платежной карте",
        nomenclatureId: selectedExperience.id,
        title: selectedExperience.title,
        partner: selectedExperience.partner,
        price: selectedExperience.price,
        commission: commission,
        recipient: recipient,
        buyerContact: contact,
        wish: wish
    };

    saveCertificate(newCert);

    document.getElementById("order-modal").classList.remove("open");
    document.getElementById("order-form").reset();

    document.getElementById("cert-recipient").textContent = recipient;
    document.getElementById("cert-title").textContent = selectedExperience.title;
    document.getElementById("cert-wish").textContent = "«" + wish + "»";
    document.getElementById("cert-partner").textContent = "Организатор: " + selectedExperience.partner;
    document.getElementById("cert-code").textContent = promoCode;
    document.getElementById("cert-modal").classList.add("open");
});

document.getElementById("copy-code-btn").addEventListener("click", function() {
    const code = document.getElementById("cert-code").textContent;
    navigator.clipboard.writeText(code);
    const btn = document.getElementById("copy-code-btn");
    btn.textContent = "Скопировано!";
    setTimeout(function() { btn.textContent = "Копировать"; }, 2000);
});

document.getElementById("check-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const inputCode = document.getElementById("check-code-input").value.trim().toUpperCase();
    const resultDiv = document.getElementById("check-result");
    const list = getCertificates();
    const cert = list.find(function(c) { return c.promoCode === inputCode; });

    if (!cert) {
        resultDiv.innerHTML =
            '<div class="result-box error">' +
                '<strong>❌ Сертификат с кодом «' + inputCode + '» не найден.</strong>' +
                '<p style="margin-top:6px; font-size:13px;">Проверьте правильность ввода или оформите новый сертификат в каталоге.</p>' +
            '</div>';
        return;
    }

    if (cert.status === "Продан") {
        resultDiv.innerHTML =
            '<div class="result-box valid">' +
                '<span class="status-pill sold">● Статус в 1С: ПРОДАН (Активен)</span>' +
                '<h3 style="margin-bottom:8px;">' + cert.title + '</h3>' +
                '<p style="font-size:14px;"><strong>Получатель:</strong> ' + cert.recipient + '</p>' +
                '<p style="font-size:14px;"><strong>Организатор (Контрагент):</strong> ' + cert.partner + '</p>' +
                '<p style="font-size:14px;"><strong>Номинал:</strong> ' + cert.price.toLocaleString("ru-RU") + ' ₽</p>' +
                '<button type="button" class="redeem-btn" onclick="redeemCertificate(\'' + cert.promoCode + '\')">' +
                    '✅ Активировать (Погасить сертификат и провести «Реализацию услуг» в 1С)' +
                '</button>' +
            '</div>';
    } else {
        resultDiv.innerHTML =
            '<div class="result-box redeemed">' +
                '<span class="status-pill used">● Статус в 1С: ПОГАШЕН</span>' +
                '<h3 style="margin-bottom:8px;">' + cert.title + '</h3>' +
                '<p style="font-size:14px;">Этот сертификат уже был использован <strong>' + cert.redeemedAt + '</strong>.</p>' +
                '<p style="font-size:13px; color:#6b7280; margin-top:4px;">Повторная активация невозможна.</p>' +
            '</div>';
    }
});

function redeemCertificate(code) {
    const list = getCertificates();
    const index = list.findIndex(function(c) { return c.promoCode === code; });
    if (index === -1) return;

    list[index].status = "Погашен";
    list[index].redeemedAt = new Date().toLocaleString("ru-RU");
    list[index].document1C = "Реализация услуг (Акт погашения)";
    saveAllCertificates(list);

    document.getElementById("check-form").dispatchEvent(new Event("submit"));
}

function renderAdminPanel() {
    const list = getCertificates();

    const totalCount = list.length;
    const totalRevenue = list.reduce(function(sum, item) { return sum + item.price; }, 0);
    const totalCommission = list.reduce(function(sum, item) { return sum + item.commission; }, 0);
    const redeemedCount = list.filter(function(item) { return item.status === "Погашен"; }).length;

    document.getElementById("stat-total").textContent = totalCount + " шт.";
    document.getElementById("stat-revenue").textContent = totalRevenue.toLocaleString("ru-RU") + " ₽";
    document.getElementById("stat-commission").textContent = totalCommission.toLocaleString("ru-RU") + " ₽";
    document.getElementById("stat-redeemed").textContent = redeemedCount + " шт.";

    const tbody = document.getElementById("admin-table-body");
    tbody.innerHTML = "";

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#6b7280;">Пока нет оформленных сертификатов. Купите первый в каталоге!</td></tr>';
    } else {
        list.forEach(function(item) {
            const pillClass = item.status === "Продан" ? "sold" : "used";
            const row = document.createElement("tr");
            row.innerHTML =
                '<td><strong>' + item.promoCode + '</strong></td>' +
                '<td>' + item.createdAt + '</td>' +
                '<td>' + item.title + '</td>' +
                '<td>' + item.partner + '</td>' +
                '<td>' + item.price.toLocaleString("ru-RU") + ' ₽ <span style="color:#6366f1;">(+' + item.commission + ' ₽)</span></td>' +
                '<td><span class="status-pill ' + pillClass + '">' + item.status + '</span></td>';
            tbody.appendChild(row);
        });
    }

    const payload1C = {
        exchangeFormat: "1C_Enterprise_REST_JSON_v1.0",
        generatedAt: new Date().toISOString(),
        organization: "Сервис впечатлений Эмоции.МСК",
        recordsCount: list.length,
        certificatesRegister: list
    };

    document.getElementById("json-viewer").textContent = JSON.stringify(payload1C, null, 2);
}

document.getElementById("download-json-btn").addEventListener("click", function() {
    const jsonText = document.getElementById("json-viewer").textContent;
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "1c_certificates_export_" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
});

document.querySelectorAll(".filter-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
        document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        renderCatalog(btn.dataset.category);
    });
});

document.querySelectorAll(".nav-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
        document.querySelectorAll(".nav-btn").forEach(function(b) { b.classList.remove("active"); });
        document.querySelectorAll(".tab-content").forEach(function(t) { t.classList.remove("active"); });
        
        btn.classList.add("active");
        const tabName = btn.dataset.tab;
        document.getElementById("tab-" + tabName).classList.add("active");

        if (tabName === "admin") {
            renderAdminPanel();
        }
    });
});

renderCatalog();
