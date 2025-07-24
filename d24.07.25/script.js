const usersContainer = document.querySelector('.ins-api-users');

const style = document.createElement('style');
style.textContent = `
    .ins-api-users {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }
    
    .user-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    
    .user-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background-color: #f9f9f9;
        position: relative;
    }
    
    .user-card h3 {
        margin-top: 0;
        color: #333;
    }
    
    .user-card p {
        margin: 5px 0;
        color: #666;
    }
    
    .delete-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
    }
    
    .delete-btn:hover {
        background-color: #cc0000;
    }
    
    .refresh-btn {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 20px;
    }
    
    .refresh-btn:hover {
        background-color: #45a049;
    }
    
    .error-message {
        color: #ff4444;
        padding: 10px;
        background-color: #ffeeee;
        border: 1px solid #ffcccc;
        border-radius: 4px;
        margin-bottom: 15px;
    }
    
    .loading-message {
        color: #333;
        padding: 10px;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 15px;
    }
`;
document.head.appendChild(style);

function getFromLocalStorage(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (new Date().getTime() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return parsed.value;
}

function setToLocalStorage(key, value, ttl = 24 * 60 * 60 * 1000) {
    const item = {
        value: value,
        expiry: new Date().getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function fetchUsers(force = false) {
    if (!force) {
        const cachedUsers = getFromLocalStorage('cachedUsers');
        if (cachedUsers) return Promise.resolve(cachedUsers);
    }

    showLoading('Veriler yükleniyor...');
    
    return fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('API isteği başarısız: ' + response.status);
            }
            return response.json();
        })
        .then(users => {
            setToLocalStorage('cachedUsers', users);
            hideLoading();
            return users;
        })
        .catch(error => {
            hideLoading();
            throw error;
        });
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Sil';
    deleteBtn.onclick = () => deleteUser(user.id);
    
    const name = document.createElement('h3');
    name.textContent = user.name;
    
    const email = document.createElement('p');
    email.textContent = `Email: ${user.email}`;
    
    const address = document.createElement('p');
    address.textContent = `Adres: ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;
    
    card.appendChild(deleteBtn);
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(address);
    
    return card;
}


function deleteUser(userId) {

    const cachedUsers = getFromLocalStorage('cachedUsers');
    if (!cachedUsers) return;
    
    const updatedUsers = cachedUsers.filter(user => user.id !== userId);
    
    setToLocalStorage('cachedUsers', updatedUsers);
    
    displayUsers(updatedUsers);
}

function displayUsers(users) {
    const container = document.createElement('div');
    container.className = 'user-list';
    
    if (users.length === 0) {
        container.textContent = 'Kullanıcı bulunamadı.';
    } else {
        users.forEach(user => {
            container.appendChild(createUserCard(user));
        });
    }
    
    const oldList = usersContainer.querySelector('.user-list');
    if (oldList) oldList.remove();
    usersContainer.appendChild(container);
}

function addRefreshButton() {
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'refresh-btn';
    refreshBtn.textContent = 'Verileri Yenile';
    refreshBtn.onclick = () => {
        fetchUsers(true)
            .then(users => {
                displayUsers(users);
                showError('');
            })
            .catch(error => {
                showError(`Hata oluştu: ${error.message}. Lütfen daha sonra tekrar deneyin.`);
                console.error('API hatası:', error);
            });
    };
    
    const oldBtn = usersContainer.querySelector('.refresh-btn');
    if (oldBtn) oldBtn.remove();
    
    usersContainer.insertBefore(refreshBtn, usersContainer.firstChild);
}

function showError(message) {
    let errorDiv = usersContainer.querySelector('.error-message');
    
    if (message) {
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            usersContainer.insertBefore(errorDiv, usersContainer.firstChild);
        }
        errorDiv.textContent = message;
    } else if (errorDiv) {
        errorDiv.remove();
    }
}

function showLoading(message) {
    let loadingDiv = usersContainer.querySelector('.loading-message');
    
    if (!loadingDiv) {
        loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-message';
        usersContainer.insertBefore(loadingDiv, usersContainer.firstChild);
    }
    loadingDiv.textContent = message;
}

function hideLoading() {
    const loadingDiv = usersContainer.querySelector('.loading-message');
    if (loadingDiv) loadingDiv.remove();
}

function loadUsers() {
    fetchUsers()
        .then(users => {
            displayUsers(users);
            addRefreshButton();
        })
        .catch(error => {
            showError(`Hata oluştu: ${error.message}. Lütfen daha sonra tekrar deneyin.`);
            console.error('API hatası:', error);
            addRefreshButton();
        });
}

loadUsers();