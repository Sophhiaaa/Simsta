console.log('script.js starting');

// Saving System Variables and Functions
let autoSaveEnabled = true;
const ADMIN_PASSWORD = "admin123";
const GAME_OWNER_USERNAME = "Sophhiaa"; // Define the game owner (case-insensitive)
window.generatedAccounts = window.generatedAccounts || {};
let saveTimeout = null;
window.messages = window.messages || [];
let hasEngagementBoost = false;
let hasProfileGlitter = false;
let lastUpdate = 0;
let latestAutoSave = null;
let isLocalStorageFull = false;
window.isSortDescending = true;
window.paranoidMode = false;
window.virtualBaeActive = false;
window.growthLoopId = null;
window.accounts = [];
window.currentAccountIndex = 0;
window.user = null;
let currentDeleteUI = null; // Track the active custom delete UI

function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.error('localStorage not available:', e);
        return false;
    }
}

function isSessionStorageAvailable() {
    try {
        const testKey = '__test__';
        sessionStorage.setItem(testKey, testKey);
        sessionStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.error('sessionStorage not available:', e);
        return false;
    }
}

// Enhanced saveUserData with detailed debugging
function saveUserData(showConfirmation = false) {
    if (!window.user) {
        console.log('No user to save');
        return;
    }
    if (!isLocalStorageAvailable()) {
        console.error('localStorage is not available');
        return;
    }
    // Update the current account in the accounts array
    window.accounts[window.currentAccountIndex] = window.user;
    console.log('Saving user data - username:', window.user.username, 'followers:', window.user.followers, 'posts count:', window.user.posts.length, 'full object:', JSON.stringify(window.user, null, 2));
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            const minimalData = {
                accounts: window.accounts.map(account => ({
                    id: account.id,
                    username: account.username,
                    followers: account.followers,
                    money: account.money,
                    posts: account.posts,
                    verified: account.verified,
                    famous: account.famous,
                    profilePic: account.profilePic,
                    theme: account.theme,
                    notifications: account.notifications || [],
                    sponsored: account.sponsored || false,
                    eventHosted: account.eventHosted || false,
                    lastActive: account.lastActive || Date.now(),
                    trashBin: account.trashBin || []
                })),
                generatedAccounts: Object.fromEntries(Object.entries(generatedAccounts).slice(0, 5)),
                messages: messages.slice(0, 10),
                hasEngagementBoost,
                hasProfileGlitter,
                shoutoutStreak: window.shoutoutStreak || 0,
                lastShoutoutTime: window.lastShoutoutTime || 0,
                lastDailyReward: window.lastDailyReward || 0,
                currentAccountIndex: window.currentAccountIndex
            };
            const dataToSave = JSON.stringify(minimalData, null, 2);
            console.log('Serialized data to save:', dataToSave);
            latestAutoSave = dataToSave;
            if (isSessionStorageAvailable()) {
                try {
                    sessionStorage.setItem('simstaLatestAutoSave', dataToSave);
                    console.log('Saved to sessionStorage');
                } catch (e) {
                    console.warn('sessionStorage save failed:', e);
                }
            }
            if (!isLocalStorageFull) {
                try {
                    localStorage.setItem('simstaAccounts', dataToSave);
                    localStorage.setItem('simstaBackup', dataToSave);
                    console.log('Saved to localStorage successfully');
                } catch (e) {
                    console.warn('localStorage save failed (possibly full):', e);
                    isLocalStorageFull = true;
                    window.addNotification('Storage full! Using auto-exported files instead. 📤', false);
                    window.exportUserData(true);
                }
            }
            if (showConfirmation) showSaveConfirmation();
        } catch (e) {
            console.error('Save error:', e, 'Data attempted:', JSON.stringify(window.user));
        }
    }, 2000);
}

// Optimized loadUserData to ensure immediate loading on refresh
function loadUserData() {
    console.log('loadUserData called - Starting data load process');
    if (!isLocalStorageAvailable()) {
        console.error('localStorage not available');
        alert('Your browser does not support localStorage. Data cannot be loaded.');
        return false;
    }

    let loadedData = null;

    // Attempt to load from sessionStorage first (for recent autosave)
    if (isSessionStorageAvailable()) {
        const sessionData = sessionStorage.getItem('simstaLatestAutoSave');
        if (sessionData) {
            try {
                loadedData = JSON.parse(sessionData);
                console.log('Loaded from sessionStorage - raw data:', JSON.stringify(loadedData, null, 2));
            } catch (e) {
                console.error('SessionStorage parse error:', e, 'Data:', sessionData);
                sessionStorage.removeItem('simstaLatestAutoSave'); // Clear corrupted data
            }
        } else {
            console.log('No data in sessionStorage');
        }
    }

    // Fall back to localStorage if sessionStorage fails or is empty
    if (!loadedData) {
        let savedData = localStorage.getItem('simstaAccounts');
        if (!savedData) {
            savedData = localStorage.getItem('simstaBackup');
            if (savedData) {
                console.log('Found data in localStorage backup');
                window.addNotification('Loaded backup save! 💾', false);
            }
        }
        if (savedData) {
            try {
                loadedData = JSON.parse(savedData);
                console.log('Loaded from localStorage - raw data:', JSON.stringify(loadedData, null, 2));
            } catch (e) {
                console.error('LocalStorage parse error:', e, 'Data:', savedData);
                alert('Failed to parse saved data. Resetting to default.');
                localStorage.removeItem('simstaAccounts');
                localStorage.removeItem('simstaBackup');
                loadedData = null; // Force default initialization
            }
        } else {
            console.log('No data in localStorage');
        }
    }

    // Apply loaded data if available
    if (loadedData) {
        window.accounts = loadedData.accounts || [];
        window.generatedAccounts = loadedData.generatedAccounts || {};
        window.messages = loadedData.messages || [];
        hasEngagementBoost = loadedData.hasEngagementBoost || false;
        hasProfileGlitter = loadedData.hasProfileGlitter || false;
        window.shoutoutStreak = loadedData.shoutoutStreak || 0;
        window.lastShoutoutTime = loadedData.lastShoutoutTime || 0;
        window.lastDailyReward = loadedData.lastDailyReward || 0;
        window.currentAccountIndex = loadedData.currentAccountIndex || 0;

        // Set window.user from the current account index
        window.user = window.accounts[window.currentAccountIndex];
        console.log('After assigning loaded data - accounts length:', window.accounts.length, 'currentAccountIndex:', window.currentAccountIndex, 'user:', JSON.stringify(window.user, null, 2));

        // Validate and initialize user data structure
        if (window.user) {
            window.user.followers = Number(window.user.followers) || 0;
            window.user.money = Number(window.user.money) || 0;
            window.user.posts = Array.isArray(window.user.posts) ? window.user.posts : [];
            window.user.notifications = Array.isArray(window.user.notifications) ? window.user.notifications : [];
            window.user.trashBin = Array.isArray(window.user.trashBin) ? window.user.trashBin : [];
            window.user.lastActive = window.user.lastActive || Date.now();
            console.log('User loaded successfully - followers:', window.user.followers, 'posts count:', window.user.posts.length);
            window.addNotification('Auto-loaded last save from storage! 💾', false);
        } else if (window.accounts.length > 0) {
            // Fallback to first account if current index is invalid
            window.currentAccountIndex = 0;
            window.user = window.accounts[0];
            window.user.followers = Number(window.user.followers) || 0;
            window.user.money = Number(window.user.money) || 0;
            window.user.posts = Array.isArray(window.user.posts) ? window.user.posts : [];
            window.user.notifications = Array.isArray(window.user.notifications) ? window.user.notifications : [];
            window.user.trashBin = Array.isArray(window.user.trashBin) ? window.user.trashBin : [];
            window.user.lastActive = window.user.lastActive || Date.now();
            console.log('Fallback to first account - user:', JSON.stringify(window.user, null, 2));
            window.addNotification('Loaded fallback account! 💾', false);
        } else {
            console.log('No valid accounts loaded, initializing empty');
            window.user = null;
        }
    } else {
        console.log('No saved data found, initializing empty state');
        window.accounts = [];
        window.user = null;
        window.currentAccountIndex = 0;
    }

    // Ensure UI updates immediately after loading
    updateUI();
    console.log('loadUserData completed - final user state:', JSON.stringify(window.user, null, 2));
    return !!window.user; // Return true if user data was loaded
}

function showSaveConfirmation() {
    let confirmation = document.getElementById('saveConfirmation');
    if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.id = 'saveConfirmation';
        document.body.appendChild(confirmation);
    }
    confirmation.textContent = 'Saved, babe! 💾';
    confirmation.style.display = 'block';
    setTimeout(() => confirmation.style.display = 'none', 2000);
}

function exportUserData(isAutoExport = false) {
    if (!window.user) return;

    const totalFollowers = window.accounts.reduce((sum, account) => sum + (account.followers || 0), 0);
    const formattedFollowers = window.formatNumber(totalFollowers);

    const data = {
        followersSummary: `Total followers across all accounts: ${formattedFollowers} 🌟`,
        accounts: window.accounts,
        generatedAccounts,
        messages,
        hasEngagementBoost,
        hasProfileGlitter,
        shoutoutStreak: window.shoutoutStreak,
        lastShoutoutTime: window.lastShoutoutTime,
        lastDailyReward: window.lastDailyReward,
        currentAccountIndex: window.currentAccountIndex
    };

    const dataStr = JSON.stringify(data, null, 2);
    latestAutoSave = dataStr;
    if (isSessionStorageAvailable()) {
        try {
            sessionStorage.setItem('simstaLatestAutoSave', dataStr);
            console.log('Exported to sessionStorage');
        } catch (e) {
            console.warn('sessionStorage export failed:', e);
        }
    }
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isAutoExport 
        ? `simsta_${window.user.username}_auto_${formattedFollowers}.json` 
        : `simsta_${window.user.username}_${formattedFollowers}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (!isAutoExport) window.addNotification('Data exported, queen! 📤', false);
    if (!isLocalStorageFull) {
        try {
            localStorage.setItem('simstaBackup', dataStr);
        } catch (e) {
            console.warn('Backup save failed (possibly full):', e);
            isLocalStorageFull = true;
        }
    }
}

function importUserData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            window.accounts = importedData.accounts || [];
            window.generatedAccounts = importedData.generatedAccounts || {};
            window.messages = importedData.messages || [];
            hasEngagementBoost = importedData.hasEngagementBoost || false;
            hasProfileGlitter = importedData.hasProfileGlitter || false;
            window.shoutoutStreak = importedData.shoutoutStreak || 0;
            window.lastShoutoutTime = importedData.lastShoutoutTime || 0;
            window.lastDailyReward = importedData.lastDailyReward || 0;
            window.currentAccountIndex = importedData.currentAccountIndex || 0;
            window.user = window.accounts[window.currentAccountIndex] || null;
            if (!window.user && window.accounts.length > 0) window.user = window.accounts[0];
            if (window.user) {
                if (!Array.isArray(window.user.posts)) window.user.posts = [];
                if (!Array.isArray(window.user.notifications)) window.user.notifications = [];
                if (!Array.isArray(window.user.trashBin)) window.user.trashBin = [];
            }
            console.log('Imported data - user:', JSON.stringify(window.user, null, 2));
            saveUserData();
            window.addNotification('Data imported, slay! 📥', false);
            updateUI();
            if (window.growthLoopId) clearInterval(window.growthLoopId);
            window.startGrowthLoop();
        } catch (err) {
            console.error('Import error:', err, 'Data:', e.target.result);
            alert('Failed to import data.');
        }
    };
    reader.onerror = (e) => {
        console.error('File read error:', e);
        alert('Error reading file.');
    };
    reader.readAsText(file);
}

function toggleAutoSave() {
    autoSaveEnabled = !autoSaveEnabled;
    document.getElementById('toggleAutoSave').textContent = `Auto-Save: ${autoSaveEnabled ? 'ON' : 'OFF'}`;
    window.addNotification(`Auto-save ${autoSaveEnabled ? 'enabled' : 'disabled'}, babe! ⚙️`, false);
}

window.addNotification = function(message, addToList = true) {
    console.log('Notification:', message);
    if (addToList && window.user && window.user.notifications) {
        window.user.notifications.unshift({
            id: Date.now(),
            message: message,
            timestamp: new Date().toLocaleTimeString()
        });
    }
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

window.showAccountSwitcher = function() {
    const modal = document.getElementById('accountSwitcherModal');
    const accountList = document.getElementById('accountList');
    accountList.innerHTML = '';
    window.accounts.forEach((account, index) => {
        const div = document.createElement('div');
        div.style.margin = '5px 0';
        div.innerHTML = `
            <span>${account.username} (Followers: ${window.formatNumber(account.followers)}) ${index === window.currentAccountIndex ? '(Current) ✨' : ''}</span>
            <button onclick="window.switchAccount(${index})" style="background: #ff99cc; margin-left: 10px;">Switch 🌟</button>
            <button onclick="window.deleteAccount(${index})" style="background: #ff9999; margin-left: 5px;">Delete 🗑️</button>
        `;
        accountList.appendChild(div);
    });
    modal.classList.remove('hidden');
};

window.hideAccountSwitcher = function() {
    document.getElementById('accountSwitcherModal').classList.add('hidden');
};

window.switchAccount = function(index) {
    if (index < 0 || index >= window.accounts.length) return;
    window.accounts[window.currentAccountIndex] = window.user; // Save current user state
    window.currentAccountIndex = index;
    window.user = window.accounts[index];
    localStorage.setItem('currentAccountIndex', window.currentAccountIndex);
    hideAccountSwitcher();
    updateUI();
    if (window.growthLoopId) clearInterval(window.growthLoopId);
    window.startGrowthLoop();
    window.addNotification(`Switched to ${window.user.username}, babe! ✨`, true);
};

window.deleteAccount = function(index) {
    if (confirm('Are you sure you want to delete this account, babe? 💔')) {
        window.accounts.splice(index, 1);
        if (window.currentAccountIndex >= window.accounts.length) {
            window.currentAccountIndex = Math.max(0, window.accounts.length - 1);
        }
        if (window.accounts.length === 0) {
            window.user = null;
            document.getElementById('signupSection').classList.remove('hidden');
            document.getElementById('appSection').classList.add('hidden');
        } else {
            window.user = window.accounts[window.currentAccountIndex];
        }
        saveUserData();
        showAccountSwitcher();
    }
};

window.addNewAccount = function() {
    hideAccountSwitcher();
    window.user = null;
    document.getElementById('appSection').classList.add('hidden');
    document.getElementById('signupSection').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('profilePicInput').value = '';
    document.getElementById('profilePicPreview').classList.add('hidden');
    updateUI();
};

window.generateUsername = function() {
    const girlyUsernames = [
        'PinkyBlossom', 'GlitterKitten', 'SparkleBae', 'DivaDreams', 'CandyQueen',
        'FairyGlow', 'LuluStar', 'BunnyBae', 'TwinklePaws', 'PixiePearl',
        'SassyBloom', 'FluffelJelly', 'GigiGlam', 'MimiShine', 'TiffyPop',
        'BaeBaeBee', 'DollyDazzle', 'KikiKisses', 'LalaLuxe', 'ZaraZing',
        'CocoCharm', 'RiriRainbow', 'ViviVelvet', 'NanaNectar', 'JujuJewel',
        'FizzyFawn', 'LiliLush', 'TutuTwirl', 'PipiPetal', 'SukiSweet'
    ];
    const username = girlyUsernames[Math.floor(Math.random() * girlyUsernames.length)];
    document.getElementById('username').value = username;
};

window.goBackToSwitcher = function() {
    if (window.accounts.length > 0) {
        window.user = window.accounts[window.currentAccountIndex];
        document.getElementById('signupSection').classList.add('hidden');
        document.getElementById('appSection').classList.remove('hidden');
        showAccountSwitcher();
        updateUI();
    } else {
        window.user = null;
        updateUI();
    }
};

window.createAccount = function() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput ? usernameInput.value.trim() : '';
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePic = profilePicInput ? profilePicInput.files[0] : null;

    if (!usernameInput) {
        console.error('Username input element not found! Check ID "username" in HTML.');
        alert('Oops! Something broke. Please tell Sophia to check the username field.');
        return;
    }

    if (!username) {
        alert('Need a cute username, girly!');
        return;
    }

    if (window.accounts.some(account => account.username.toLowerCase() === username.toLowerCase())) {
        alert('Oops! That username is taken, pick another one, princess! 💕');
        return;
    }

    const newUser = {
        id: username + '_' + Date.now(),
        username: username,
        followers: 0,
        posts: [],
        notifications: [],
        verified: false,
        famous: false,
        lastActive: Date.now(),
        sponsored: false,
        eventHosted: false,
        profilePic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACCSURBVGhD7dQhDsAgEETR3zO2/wVHsEQTQ9OQhyqP9EOGYChFuC9jV5sR5oQ88YjsL2tXmxHmRDwiu2v+zu3qM8KcIKeQJ+SR5gl5hDzSnCDPkGfkEfJIM8KcIM+QZ+QZ8kwzwpwg55Bn5BnyTDPCnCDnkGfkGfJMM8KcIOeQZ+QZcsw/wAUrX6L6xV9qAAAAAElFTkSuQmCC',
        money: 0,
        trashBin: []
    };

    if (profilePic && profilePic.size <= 1 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
            newUser.profilePic = e.target.result;
            finishAccountCreation(newUser);
        };
        reader.onerror = (e) => {
            console.error('Error reading profile picture:', e);
            alert('Oops! Couldn’t read your profile picture. Using default instead.');
            finishAccountCreation(newUser);
        };
        reader.readAsDataURL(profilePic);
    } else {
        if (profilePic) {
            console.warn('Profile picture too large (> 1MB), using default.');
        }
        finishAccountCreation(newUser);
    }
};

window.previewProfilePic = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profilePicPreview').src = e.target.result;
            document.getElementById('profilePicPreview').classList.remove('hidden');
        };
        reader.onerror = (e) => {
            console.error('Error reading profile picture for preview:', e);
        };
        reader.readAsDataURL(file);
    }
};

function finishAccountCreation(newUser) {
    window.accounts.push(newUser);
    window.currentAccountIndex = window.accounts.length - 1;
    window.user = newUser;
    localStorage.setItem('simstaAccounts', JSON.stringify({
        accounts: window.accounts,
        generatedAccounts,
        messages,
        hasEngagementBoost,
        hasProfileGlitter,
        shoutoutStreak: window.shoutoutStreak,
        lastShoutoutTime: window.lastShoutoutTime,
        lastDailyReward: window.lastDailyReward,
        currentAccountIndex: window.currentAccountIndex
    }));
    localStorage.setItem('currentAccountIndex', window.currentAccountIndex);
    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('appSection').classList.remove('hidden');
    document.getElementById('usernameDisplay').textContent = window.user.username;
    document.getElementById('profilePicDisplay').src = window.user.profilePic;
    window.addNotification(`Welcome to Simsta, ${window.user.username}! 💕`, false);
    window.simulateInitialFollowers();
    if (autoSaveEnabled) saveUserData();
    window.closeSelfieSnap();
    if (window.growthLoopId) clearInterval(window.growthLoopId);
    window.startGrowthLoop();
    updateUI();
}

function resetAccount() {
    if (confirm('Start fresh, babe?')) {
        const newUser = {
            username: window.user.username,
            followers: 0,
            posts: [],
            notifications: [],
            verified: false,
            famous: false,
            lastActive: Date.now(),
            sponsored: false,
            eventHosted: false,
            profilePic: window.user.profilePic,
            money: 0,
            trashBin: []
        };
        window.accounts[window.currentAccountIndex] = newUser;
        window.user = newUser;
        if (window.growthLoopId) clearInterval(window.growthLoopId);
        window.startGrowthLoop();
        saveUserData();
        window.addNotification('Account reset, fresh start! 🌸', false);
        updateUI();
    }
}

window.renderTrashBin = function() {
    const feed = document.getElementById('feed');
    if (!feed) return;
    const trashSection = document.createElement('div');
    trashSection.id = 'trashSection';
    trashSection.style.marginTop = '20px';
    trashSection.innerHTML = '<h3>🗑️ Trash Bin, Princess! 🗑️</h3>';
    const trashBin = document.createElement('div');
    trashBin.id = 'trashBin';
    trashBin.style.border = '2px dashed #ff9999';
    trashBin.style.padding = '10px';
    trashBin.style.borderRadius = '15px';
    trashBin.style.background = '#fff0f5';
    if (window.user.trashBin && window.user.trashBin.length > 0) {
        window.user.trashBin.forEach((post, index) => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post trashed';
            postDiv.style.opacity = '0.7';
            if (post.imageData) {
                const img = document.createElement('img');
                img.src = post.imageData;
                img.alt = 'Trashed Post Image';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                postDiv.appendChild(img);
            }
            if (post.caption) {
                const p = document.createElement('p');
                p.textContent = post.caption;
                postDiv.appendChild(p);
            }
            const stats = document.createElement('div');
            stats.className = 'post-stats';
            stats.innerHTML = `<span>${window.formatNumber(post.likes)} likes</span> <span>${window.formatNumber(post.comments.length)} comments</span>`;
            postDiv.appendChild(stats);
            trashBin.appendChild(postDiv);
        });
    } else {
        trashBin.innerHTML = '<p>No trashed posts yet, babe! 🌸</p>';
    }
    trashSection.appendChild(trashBin);
    const existingTrash = document.getElementById('trashSection');
    if (existingTrash) existingTrash.remove();
    feed.parentNode.insertBefore(trashSection, feed.nextSibling);
};

function updateUI() {
    const now = Date.now();
    if (now - lastUpdate < 500) return;
    lastUpdate = now;

    console.log('updateUI called - user:', JSON.stringify(window.user, null, 2)); // Log user state before UI update

    if (!window.user) {
        document.getElementById('signupSection').classList.remove('hidden');
        document.getElementById('appSection').classList.add('hidden');
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('passwordModal').classList.add('hidden');
        document.getElementById('accountSwitcherModal').classList.add('hidden');
        if (currentDeleteUI) currentDeleteUI.remove();
        console.log('No user, showing signup');
        return;
    }

    // Ensure UI elements exist before updating
    const signupSection = document.getElementById('signupSection');
    const appSection = document.getElementById('appSection');
    if (!signupSection || !appSection) {
        console.error('Required UI elements missing: signupSection or appSection');
        return;
    }

    signupSection.classList.add('hidden');
    appSection.classList.remove('hidden');

    const usernameDisplay = document.getElementById('usernameDisplay');
    const profilePicDisplay = document.getElementById('profilePicDisplay');
    const followerCount = document.getElementById('followerCount');
    const postCount = document.getElementById('postCount');
    const moneyDisplay = document.getElementById('moneyDisplay');
    const shopMoneyDisplay = document.getElementById('shopMoneyDisplay');

    if (!usernameDisplay || !profilePicDisplay || !followerCount || !postCount || !moneyDisplay || !shopMoneyDisplay) {
        console.error('Required UI elements missing for update');
        return;
    }

    usernameDisplay.textContent = window.user.username;
    usernameDisplay.classList.toggle('verified', window.user.verified);
    usernameDisplay.classList.toggle('famous', window.user.famous);
    usernameDisplay.classList.toggle('glitter', hasProfileGlitter);
    profilePicDisplay.src = window.user.profilePic;
    followerCount.textContent = window.formatNumber(window.user.followers);
    postCount.textContent = window.formatNumber(window.user.posts.length);
    moneyDisplay.textContent = `Money: $${window.formatNumber(window.user.money)}`;
    shopMoneyDisplay.textContent = window.formatNumber(window.user.money);

    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        const tabId = activeTab.onclick.toString().match(/'([^']+)'/)[1];
        switch (tabId) {
            case 'postsTab':
                window.renderPosts();
                window.renderTrashBin();
                break;
            case 'notificationsTab':
                window.renderNotifications();
                break;
            case 'likesTab':
                window.renderLikes();
                break;
            case 'commentsTab':
                window.renderComments();
                break;
            case 'generatedAccountsTab':
                window.renderGeneratedPosts();
                break;
            case 'profileTab':
                window.renderProfileTab();
                break;
            case 'aiAccountsTab':
                window.renderAIAccounts();
                break;
            case 'messagesTab':
                window.renderMessages();
                break;
            case 'shopTab':
                window.renderShopTab();
                break;
        }
    }

    const isOwner = window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase();
    const adminTrigger = document.getElementById('adminTrigger');
    if (adminTrigger) {
        adminTrigger.style.display = isOwner ? 'inline-block' : 'none';
    }
    if (!isOwner) {
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('passwordModal').classList.add('hidden');
    }

    if (window.growthLoopId) clearInterval(window.growthLoopId);
    window.startGrowthLoop();

    if (autoSaveEnabled) saveUserData();
    console.log('updateUI completed - followers:', window.user.followers, 'posts count:', window.user.posts.length);
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.section');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => {
        if (tab.id !== 'signupSection' && tab.id !== 'appSection' && tab.id !== 'postControls' && tab.id !== 'adminPanel' && tab.id !== 'passwordModal' && tab.id !== 'accountSwitcherModal') {
            tab.classList.add('hidden');
        }
    });
    document.getElementById(tabId).classList.remove('hidden');

    tabButtons.forEach(btn => btn.classList.remove('active'));
    const clickedButton = Array.from(tabButtons).find(btn => btn.onclick.toString().includes(tabId));
    if (clickedButton) clickedButton.classList.add('active');

    if (window.user) {
        window.user.lastActive = Date.now();
        if (autoSaveEnabled) saveUserData();
    }
    updateUI();
}

function showPasswordModal() {
    if (window.user && window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase()) {
        document.getElementById('passwordModal').classList.remove('hidden');
    } else {
        window.addNotification('Sorry, babe! Only the game owner can access this! 👑', false);
    }
}

function hidePasswordModal() {
    document.getElementById('passwordModal').classList.add('hidden');
}

function validatePassword() {
    const passwordInput = document.getElementById('adminPasswordInput').value;
    if (passwordInput === ADMIN_PASSWORD && window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase()) {
        document.getElementById('passwordModal').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
    } else {
        window.addNotification('Wrong password or not the owner, sweetie! Try again! 💔', false);
    }
}

function hideAdminPanel() {
    document.getElementById('adminPanel').classList.add('hidden');
}

function applyAdminChanges() {
    if (window.user && window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase()) {
        window.user.followers = Number(document.getElementById('adminFollowers').value) || window.user.followers;
        window.user.money = Number(document.getElementById('adminMoney').value) || window.user.money;
        window.user.posts = Array(Number(document.getElementById('adminPostCount').value)).fill().map(() => ({
            likes: 0,
            comments: [],
            isViral: false,
            isSuperViral: false,
            liked: false,
            caption: '',
            hashtags: [],
            imageData: ''
        })) || window.user.posts;
        window.user.verified = document.getElementById('adminVerified').checked;
        window.user.famous = document.getElementById('adminFamous').checked;
        window.paranoidMode = document.getElementById('adminParanoid').checked;
        if (window.paranoidMode) window.toggleParanoidMode();
        saveUserData();
        window.addNotification('Admin changes applied, queen! ✨', false);
        updateUI();
    } else {
        window.addNotification('Only the owner can change settings, babe! 👑', false);
    }
}

function clearNotifications() {
    if (window.user && window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase()) {
        window.user.notifications = [];
        saveUserData();
        window.addNotification('Notifications cleared, slay! 🔔', false);
        updateUI();
    } else {
        window.addNotification('Only the owner can clear notifications, babe! 👑', false);
    }
}

function resetAIAccounts() {
    if (window.user && window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase()) {
        window.generatedAccounts = {};
        saveUserData();
        window.addNotification('AI accounts reset, fab! 🤖', false);
        updateUI();
    } else {
        window.addNotification('Only the owner can reset AI accounts, babe! 👑', false);
    }
}

function resetGameFromAdmin() {
    if (window.user && window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase()) {
        if (confirm('Reset the whole game, queen? This can’t be undone! 💔')) {
            window.accounts = [];
            window.user = null;
            window.currentAccountIndex = 0;
            window.generatedAccounts = {};
            window.messages = [];
            hasEngagementBoost = false;
            hasProfileGlitter = false;
            window.shoutoutStreak = 0;
            window.lastShoutoutTime = 0;
            window.lastDailyReward = 0;
            localStorage.clear();
            saveUserData();
            window.addNotification('Game reset, fresh start! 🌸', false);
            updateUI();
        }
    } else {
        window.addNotification('Only the owner can reset the game, babe! 👑', false);
    }
}

// Load user data immediately on script load
loadUserData();

// Auto-export on page close or refresh
window.addEventListener('beforeunload', (e) => {
    if (window.user) {
        try {
            const dataToSave = JSON.stringify({
                accounts: window.accounts,
                generatedAccounts,
                messages,
                hasEngagementBoost,
                hasProfileGlitter,
                shoutoutStreak: window.shoutoutStreak,
                lastShoutoutTime: window.lastShoutoutTime,
                lastDailyReward: window.lastDailyReward,
                currentAccountIndex: window.currentAccountIndex
            }, null, 2);
            console.log('Before unload data:', dataToSave);
            latestAutoSave = dataToSave;
            if (isSessionStorageAvailable()) {
                sessionStorage.setItem('simstaLatestAutoSave', dataToSave);
            }
            if (!isLocalStorageFull) {
                localStorage.setItem('simstaAccounts', dataToSave);
                localStorage.setItem('simstaBackup', dataToSave);
            }
            window.exportUserData(true);
        } catch (err) {
            console.error('Before unload save/export error:', err);
        }
    }
});

// Add keyboard shortcut for password modal (Ctrl+Shift+A) only for owner
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A' && window.user && window.user.username.toLowerCase() === GAME_OWNER_USERNAME.toLowerCase()) {
        console.log('Ctrl+Shift+A pressed, showing password modal');
        showPasswordModal();
    }
});

// Ensure UI updates after DOM is fully loaded, but only if data wasn't loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready');
    if (window.user) {
        document.getElementById('signupSection').classList.add('hidden');
        document.getElementById('appSection').classList.remove('hidden');
        window.simulateOfflineGrowth();
        window.startGrowthLoop();
        if (window.virtualBaeActive) window.toggleVirtualBae();
        if (window.paranoidMode) window.toggleParanoidMode();
        updateUI();
    } else {
        document.getElementById('signupSection').classList.remove('hidden');
        document.getElementById('appSection').classList.add('hidden');
    }
});

console.log('script.js loaded');
