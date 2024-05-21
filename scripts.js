document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    loadArticles();
    setupAuthForms();
    setupAdminForms();
    setupFloatingTeeth();

    function loadServices() {
        fetch('services.php?action=list')
        .then(response => response.json())
        .then(data => {
            const servicesContainer = document.getElementById('services-container');
            if (servicesContainer) {
                servicesContainer.innerHTML = ''; // Clear existing services
                data.forEach(service => {
                    const serviceDiv = document.createElement('div');
                    serviceDiv.className = 'service';
                    serviceDiv.innerHTML = `
                        <img src="images/${service.service_name.toLowerCase().replace(' ', '_')}.jpg?v=${new Date().getTime()}" alt="${service.service_name}">
                        <h3>${service.service_name}</h3>
                        <p>${service.description}</p>
                        <p>Цена: ₽${service.price}</p>
                    `;
                    servicesContainer.appendChild(serviceDiv);
                });
            }
        })
        .catch(error => console.error('Ошибка загрузки услуг:', error));
    }

    function loadArticles() {
        fetch('articles.php?action=list')
        .then(response => response.json())
        .then(data => {
            if (data.status && data.status === 'error') {
                console.error(data.message);
            } else {
                const articlesList = document.getElementById('articles-list');
                if (articlesList) {
                    articlesList.innerHTML = ''; // Clear existing articles
                    data.forEach(article => {
                        const articleItem = document.createElement('li');
                        articleItem.className = 'article-item';
                        articleItem.innerHTML = `
                            <a href="article.html?id=${article.id}">
                                <img src="${article.image_path}?v=${new Date().getTime()}" alt="Изображение статьи" class="article-image">
                            </a>
                            <div class="article-content">
                                <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
                                <p class="article-author">${article.author} - ${new Date(article.created_at).toLocaleDateString()}</p>
                                <p class="article-description">${article.short_description}</p>
                            </div>
                        `;
                        articlesList.appendChild(articleItem);
                    });
                }
            }
        })
        .catch(error => console.error('Ошибка загрузки статей:', error));
    }

    function setupAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(loginForm);
                formData.append('action', 'login');
                fetch('auth.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showModal(data.message);
                    if (data.status === 'success') {
                        window.location.href = 'dashboard.html';
                    }
                })
                .catch(error => {
                    showModal('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
                });
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('registerConfirmPassword').value;

                if (password !== confirmPassword) {
                    showModal('Пароли не совпадают');
                    return;
                }

                const formData = new FormData(registerForm);
                formData.append('action', 'register');
                fetch('auth.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showModal(data.message);
                    if (data.status === 'success') {
                        window.location.href = 'dashboard.html';
                    }
                })
                .catch(error => {
                    showModal('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
                });
            });
        }
    }

    function setupAdminForms() {
        const addServiceForm = document.getElementById('addServiceForm');
        const addArticleForm = document.getElementById('addArticleForm');

        if (addServiceForm) {
            addServiceForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(addServiceForm);
                formData.append('action', 'add');
                fetch('services.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showModal(data.message);
                    if (data.status === 'success') {
                        window.location.reload();
                    }
                })
                .catch(error => {
                    showModal('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
                });
            });
        }

        if (addArticleForm) {
            addArticleForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(addArticleForm);
                formData.append('action', 'add');
                fetch('articles.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    showModal(data.message);
                    if (data.status === 'success') {
                        window.location.reload();
                    }
                })
                .catch(error => {
                    showModal('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
                });
            });
        }
    }

    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        const span = document.getElementsByClassName('close')[0];

        if (modal && modalMessage && span) {
            modalMessage.textContent = message;
            modal.style.display = 'block';

            span.onclick = function() {
                modal.style.display = 'none';
            };

            window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            };
        }
    }

    function logout() {
        fetch('logout.php', {
            method: 'POST'
        }).then(response => {
            if (response.ok) {
                window.location.href = 'index.html';
            }
        });
    }

    const userLoggedIn = false; // Эта перемента должна быть установлена сервером или сессией
    const isAdmin = false; // Эта переменная должна быть установлена сервером или сессией

    if (userLoggedIn) {
        document.getElementById('dashboardLink').style.display = 'block';
        document.getElementById('authLink').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'block';
    }

    if (isAdmin) {
        document.getElementById('adminLink').style.display = 'block';
    }

    setupFloatingTeeth();
});

function setupFloatingTeeth() {
    const teethContainer = document.querySelector('.floating-teeth');
    const teethImages = ['tooth1.png', 'tooth2.png', 'tooth3.png'];

    for (let i = 0; i < 20; i++) {
        const img = document.createElement('img');
        img.src = `images/${teethImages[Math.floor(Math.random() * teethImages.length)]}`;
        img.className = 'tooth';
        img.style.left = `${Math.random() * 100}%`;
        img.style.top = `${Math.random() * 100}%`;
        img.style.width = `${Math.random() * 20 + 20}px`;
        img.style.height = img.style.width;
        img.style.position = 'absolute';
        img.style.zIndex = '-1';
        teethContainer.appendChild(img);
    }

    document.addEventListener('mousemove', function(e) {
        const teeth = document.querySelectorAll('.floating-teeth .tooth');
        teeth.forEach(tooth => {
            const speed = Math.random() * 5 + 1; // Random speed for each tooth
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            tooth.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    });
}
