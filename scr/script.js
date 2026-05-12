const lat = 54.6977629;
const lng = 25.2202963;

const map = L.map('map', {
  attributionControl: false
}).setView([lat, lng], 16);

// ================= MAP =================
const darkLayer = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CartoDB'
  }
);

const streetLayer = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }
);

darkLayer.addTo(map);

const darkGrayIcon = new L.Icon({
  iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-grey.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.marker([lat, lng], { icon: darkGrayIcon })
  .addTo(map)
  .bindPopup('Laisves prospektas 42, Vilnius')
  .openPopup();

const baseMaps = {
  'Tamsus / Dark': darkLayer,
  'Street / OSM': streetLayer,
};

L.control.layers(baseMaps).addTo(map);

// ================= SCROLL =================
let lastScroll = 0;
const stickyBar = document.getElementById('sticky-bar');
const scrollBar = document.getElementById('scroll-bar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 350 && currentScroll > lastScroll) {
    stickyBar.classList.add('active');
  } else if (currentScroll < lastScroll) {
    stickyBar.classList.remove('active');
  }

  lastScroll = currentScroll;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  scrollBar.style.width = scrollPercent + '%';
});

// ================= LANGUAGE =================
const currentBtn = document.getElementById('current-lang');
const optionsDiv = document.getElementById('lang-options');
const texts = document.querySelectorAll('[data-lang]');

let currentLang = 'LT';

function updateText(lang) {
  texts.forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });

  updatePlaceholdersAndErrors();
}

function updateOptions() {
  const langs = ['LT', 'EN', 'RU'].filter(l => l !== currentLang);

  optionsDiv.innerHTML = '';

  langs.forEach(l => {
    const div = document.createElement('div');

    div.className = 'lang-option';
    div.setAttribute('data-lang', l);
    div.textContent = l;

    div.addEventListener('click', () => {
      currentLang = l;
      currentBtn.textContent = l + ' ';
      updateText(l);
      updateOptions();
      optionsDiv.style.display = 'none';
    });

    optionsDiv.appendChild(div);
  });
}

currentBtn.addEventListener('click', () => {
  optionsDiv.style.display =
    optionsDiv.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', e => {
  if (!document.getElementById('lang-switcher').contains(e.target)) {
    optionsDiv.style.display = 'none';
  }
});

currentBtn.textContent = currentLang + ' ';
updateText(currentLang);
updateOptions();

// ================= IMAGE ZOOM =================
document.querySelectorAll(
  '.onea img, .two img, .tria img, .twwo img, .trii, .b1, .b2, .b4, .b5, .b6, .b7'
).forEach(img => {
  img.style.cursor = 'zoom-in';

  img.addEventListener('click', () => {
    if (document.querySelector('.zoom-clone')) return;

    const rect = img.getBoundingClientRect();

    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    document.body.appendChild(overlay);

    const clone = img.cloneNode();
    clone.className = 'zoom-clone';

    Object.assign(clone.style, {
      top: rect.top + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      borderRadius: getComputedStyle(img).borderRadius
    });

    document.body.appendChild(clone);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      overlay.classList.add('active');

      Object.assign(clone.style, {
        top: '5vh',
        left: '5vw',
        width: '90vw',
        height: '90vh',
        borderRadius: '22px'
      });
    });

    const closeZoom = () => {
      overlay.classList.remove('active');

      Object.assign(clone.style, {
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        borderRadius: getComputedStyle(img).borderRadius
      });

      clone.addEventListener('transitionend', () => {
        clone.remove();
        overlay.remove();
        document.body.style.overflow = '';
      }, { once: true });
    };

    overlay.addEventListener('click', closeZoom);
    clone.addEventListener('click', closeZoom);
  });
});

// ================= MODAL =================
const openModal = document.getElementById('openModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');

const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const problemForm = document.getElementById('problemForm');

openModal.onclick = () => {
  modalOverlay.style.display = 'flex';
  document.body.classList.add('no-scroll');

  loginForm.style.display = 'flex';
  registerForm.style.display = 'none';
  problemForm.style.display = 'none';
};

function closeAndReset() {
  modalOverlay.style.display = 'none';
  document.body.classList.remove('no-scroll');

  loginForm.reset();
  registerForm.reset();
  problemForm.reset();

  loginError.textContent = '';
  regError.textContent = '';
}

closeModal.onclick = closeAndReset;

showLogin.onclick = () => {
  loginForm.style.display = 'flex';
  registerForm.style.display = 'none';
  problemForm.style.display = 'none';
};

showRegister.onclick = () => {
  registerForm.style.display = 'flex';
  loginForm.style.display = 'none';
  problemForm.style.display = 'none';
};

// ================= STORAGE =================
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// ================= FILTERS =================
regPhone.addEventListener('input', function () {
  this.value = this.value.replace(/[^0-9+]/g, '');
});

function onlyLetters(input) {
  input.value = input.value.replace(/[^a-zA-Zа-яА-ЯąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, '');
}

regName.oninput = function () {
  onlyLetters(this);
};

regSurname.oninput = function () {
  onlyLetters(this);
};

// ================= TEXTS =================
const i18n = {
  LT: {
    fillAll: 'Užpildykite visus laukus',
    passMismatch: 'Slaptažodžiai nesutampa',
    userExists: 'Toks vartotojas jau egzistuoja',
    loginFail: 'Neteisingi duomenys arba vartotojas neegzistuoja',
    problemSent: 'Problema sėkmingai išsiųsta!'
  },
  EN: {
    fillAll: 'Please fill all fields',
    passMismatch: 'Passwords do not match',
    userExists: 'User already exists',
    loginFail: 'Incorrect data or user does not exist',
    problemSent: 'Problem successfully sent!'
  },
  RU: {
    fillAll: 'Заполните все поля',
    passMismatch: 'Пароли не совпадают',
    userExists: 'Пользователь уже существует',
    loginFail: 'Неверные данные или пользователь не найден',
    problemSent: 'Заявка успешно отправлена!'
  }
};

function updatePlaceholdersAndErrors() {
  document.querySelectorAll('[data-lt]').forEach(el => {
    if (el.placeholder !== undefined) {
      el.placeholder = el.dataset[currentLang.toLowerCase()];
    }
  });

  document.querySelectorAll('.error-msg').forEach(el => {
    el.textContent = '';
  });
}

updatePlaceholdersAndErrors();

// ================= REGISTER =================
registerSubmit.onclick = () => {
  const name = regName.value.trim();
  const surname = regSurname.value.trim();
  const phone = regPhone.value.trim();
  const email = regEmail.value.trim();
  const pass = regPass.value;
  const pass2 = regPassConfirm.value;

  if (!name || !surname || !phone || !email || !pass || !pass2) {
    regError.textContent = i18n[currentLang].fillAll;
    return;
  }

  if (pass !== pass2) {
    regError.textContent = i18n[currentLang].passMismatch;
    return;
  }

  let users = getUsers();

  if (users.find(u => u.email === email)) {
    regError.textContent = i18n[currentLang].userExists;
    return;
  }

  users.push({ name, surname, phone, email, pass });
  saveUsers(users);

  regError.textContent = '';

  registerForm.style.display = 'none';
  problemForm.style.display = 'flex';
};

// ================= LOGIN =================
loginSubmit.onclick = () => {
  const user = loginUser.value.trim();
  const pass = loginPass.value;

  if (!user || !pass) {
    loginError.textContent = i18n[currentLang].fillAll;
    return;
  }

  let users = getUsers();

  const found = users.find(
    u => (u.email === user || u.phone === user) && u.pass === pass
  );

  if (!found) {
    loginError.textContent = i18n[currentLang].loginFail;
    return;
  }

  loginError.textContent = '';

  loginForm.style.display = 'none';
  problemForm.style.display = 'flex';
};

// ================= EMAILJS =================
problemSubmit.onclick = () => {
  const city = citySelect.value;
  const service = serviceSelect.value;
  const desc = problemDesc.value.trim();

  if (!city || !service || !desc) {
    alert(i18n[currentLang].fillAll);
    return;
  }

  emailjs.send('service_cy5c66s', 'template_zxwljl8', {
    city: city,
    service: service,
    message: desc
  })
  .then(response => {
    console.log('SUCCESS!', response);

    alert(i18n[currentLang].problemSent);
    closeAndReset();
  })
  .catch(error => {
    console.log('FAILED...', error);

    alert('Send error');
  });
};

// ================= GALLERY =================
const openBtn = document.getElementById('openGallery');
const modal = document.getElementById('galleryModal');
const closeBtn = document.querySelector('.gallery-close');
const images = document.querySelectorAll('.gallery-grid img');

let activeImage = null;

openBtn.onclick = () => {
  modal.style.display = 'flex';

  if (images.length > 0) {
    setActiveImage(images[0]);
  }
};

closeBtn.onclick = () => {
  modal.style.display = 'none';
  clearActiveImage();
};

images.forEach(img => {
  img.onclick = () => {
    setActiveImage(img);
  };
});

function setActiveImage(img) {
  if (activeImage) {
    activeImage.classList.remove('zoomed');
  }

  img.classList.add('zoomed');
  activeImage = img;
}

function clearActiveImage() {
  if (activeImage) {
    activeImage.classList.remove('zoomed');
    activeImage = null;
  }
}

