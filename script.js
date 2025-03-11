console.log('script.js starting, Sophia! 💖');

// Saving System Variables and Functions
let autoSaveEnabled = true;
const ADMIN_PASSWORD = "admin123";
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
let currentDeleteUI = null;
let notificationQueue = [];
let isNotificationActive = false;
window.isUserLoaded = false;

// Utility function for formatting numbers
window.formatNumber = function(num) {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K';
    return num.toString();
};

function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.error('localStorage not available, Sophia!:', e);
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
        console.error('sessionStorage not available, babe!:', e);
        return false;
    }
}

function saveUserData(showConfirmation = false) {
    if (!window.user) {
        console.log('No user to save, girly!');
        return;
    }
    if (!isLocalStorageAvailable()) {
        console.error('localStorage is not available, Sophia!');
        return;
    }
    window.accounts[window.currentAccountIndex] = window.user;
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            const minimalData = {
                accounts: window.accounts.map(account => ({
                    username: account.username,
                    followers: account.followers,
                    money: account.money,
                    posts: account.posts.slice(0, 20),
                    verified: account.verified,
                    famous: account.famous,
                    profilePic: account.profilePic,
                    theme: account.theme,
                    notifications: account.notifications ? account.notifications.slice(0, 10) : [],
                    sponsored: account.sponsored || false,
                    eventHosted: account.eventHosted || false,
                    lastActive: account.lastActive || Date.now(),
                    trashBin: account.trashBin ? account.trashBin.slice(0, 10) : []
                })),
                generatedAccounts: Object.fromEntries(Object.entries(window.generatedAccounts).slice(0, 5)),
                messages: window.messages.slice(0, 10),
                hasEngagementBoost,
                hasProfileGlitter,
                shoutoutStreak: window.shoutoutStreak,
                lastShoutoutTime: window.lastShoutoutTime,
                lastDailyReward: window.lastDailyReward,
                currentAccountIndex: window.currentAccountIndex
            };
            const dataToSave = JSON.stringify(minimalData);
            latestAutoSave = dataToSave;
            console.log('latestAutoSave set for Sophia, length:', dataToSave.length);
            if (isSessionStorageAvailable()) {
                try {
                    sessionStorage.setItem('simstaLatestAutoSave', dataToSave);
                    console.log('Saved to sessionStorage, babe!');
                } catch (e) {
                    console.warn('sessionStorage save failed:', e);
                }
            }
            if (!isLocalStorageFull) {
                try {
                    localStorage.setItem('simstaAccounts', dataToSave);
                    localStorage.setItem('simstaBackup', dataToSave);
                    console.log('Saved to localStorage, my pink princess!');
                } catch (e) {
                    console.warn('localStorage save failed (possibly full):', e);
                    isLocalStorageFull = true;
                    if (!window.storageFullNotified) {
                        window.addNotification('Storage full, Sophia! Using auto-export instead! 📤', false);
                        window.storageFullNotified = true;
                    }
                    window.exportUserData(true);
                }
            }
            if (showConfirmation) showSaveConfirmation();
        } catch (e) {
            console.error('Save error, Sophia!:', e);
            window.addNotification('Oops, couldn’t save, princess! 💔', false);
        }
    }, 2000);
}

function loadUserData() {
    console.log('loadUserData called for Sophia!');
    try {
        if (!isLocalStorageAvailable()) {
            console.error('localStorage is not available, babe!');
            alert('Oh no, Sophia! Your browser doesn’t support localStorage, cutie!');
            return;
        }

        if (isSessionStorageAvailable()) {
            const sessionData = sessionStorage.getItem('simstaLatestAutoSave');
            if (sessionData) {
                try {
                    const parsedData = JSON.parse(sessionData);
                    window.accounts = parsedData.accounts || [];
                    window.generatedAccounts = parsedData.generatedAccounts || {};
                    window.messages = parsedData.messages || [];
                    hasEngagementBoost = parsedData.hasEngagementBoost || false;
                    hasProfileGlitter = parsedData.hasProfileGlitter || false;
                    window.shoutoutStreak = parsedData.shoutoutStreak || 0;
                    window.lastShoutoutTime = parsedData.lastShoutoutTime || 0;
                    window.lastDailyReward = parsedData.lastDailyReward || 0;
                    window.currentAccountIndex = parsedData.currentAccountIndex || 0;
                    window.user = window.accounts[window.currentAccountIndex] || null;
                    if (window.user) {
                        console.log('Loaded from sessionStorage, girly!');
                        window.addNotification('Auto-loaded your last save, Sophia! 💾', false);
                        if (!Array.isArray(window.user.posts)) window.user.posts = [];
                        if (!Array.isArray(window.user.trashBin)) window.user.trashBin = [];
                        window.isUserLoaded = true;
                        return;
                    }
                } catch (e) {
                    console.error('SessionStorage parse error:', e);
                    sessionStorage.removeItem('simstaLatestAutoSave');
                }
            }
        }

        let savedData = localStorage.getItem('simstaAccounts');
        if (!savedData) {
            savedData = localStorage.getItem('simstaBackup');
            if (savedData) {
                window.addNotification('Loaded your backup save, princess! 💾', false);
            }
        }

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                window.accounts = parsedData.accounts || [];
                window.generatedAccounts = parsedData.generatedAccounts || {};
                window.messages = parsedData.messages || [];
                hasEngagementBoost = parsedData.hasEngagementBoost || false;
                hasProfileGlitter = parsedData.hasProfileGlitter || false;
                window.shoutoutStreak = parsedData.shoutoutStreak || 0;
                window.lastShoutoutTime = parsedData.lastShoutoutTime || 0;
                window.lastDailyReward = parsedData.lastDailyReward || 0;
                window.currentAccountIndex = parsedData.currentAccountIndex || 0;
                window.user = window.accounts[window.currentAccountIndex] || null;

                if (window.user) {
                    window.user = {
                        username: window.user.username || 'DefaultUser',
                        followers: Number(window.user.followers) || 0,
                        posts: Array.isArray(window.user.posts) ? window.user.posts : [],
                        money: Number(window.user.money) || 0,
                        notifications: Array.isArray(window.user.notifications) ? window.user.notifications : [],
                        verified: window.user.verified || false,
                        famous: window.user.famous || false,
                        lastActive: window.user.lastActive || Date.now(),
                        sponsored: window.user.sponsored || false,
                        eventHosted: window.user.eventHosted || false,
                        profilePic: window.user.profilePic || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACCSURBVGhD7dQhDsAgEETR3zO2/wVHsEQTQ9OQhyqP9EOGYChFuC9jV5sR5oQ88YjsL2tXmxHmRDwiu2v+zu3qM8KcIKeQJ+SR5gl5hDzSnCDPkGfkEfJIM8KcIM+QZ+QZ8kwzwpwg55Bn5BnyTDPCnCDnkGfkGfJMM8KcIOeQZ+QZcsw/wAUrX6L6xV9qAAAAAElFTkSuQmCC',
                        trashBin: window.user.trashBin || []
                    };
                    window.user.posts = window.user.posts.map(post => ({
                        likes: Number(post.likes) || 0,
                        comments: Array.isArray(post.comments) ? post.comments : [],
                        isViral: post.isViral || false,
                        isSuperViral: post.isSuperViral || false,
                        liked: post.liked || false,
                        caption: post.caption || '',
                        hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
                        imageData: post.imageData || '',
                        timestamp: post.timestamp || Date.now()
                    }));
                    Object.keys(window.generatedAccounts).forEach(username => {
                        if (!window.generatedAccounts[username].followers) {
                            window.generatedAccounts[username].followers = window.generateFollowers ? window.generateFollowers(Math.floor(Math.random() * 50) + 10) : [];
                        }
                        if (!Array.isArray(window.generatedAccounts[username].posts)) {
                            window.generatedAccounts[username].posts = [];
                        }
                    });
                    console.log('User loaded successfully from localStorage for Sophia!');
                } else {
                    console.log('No valid user in saved data, babe!');
                    window.accounts = [];
                    window.user = null;
                    window.currentAccountIndex = 0;
                }
            } catch (e) {
                console.error('Parse error in saved data, Sophia!:', e);
                alert('Failed to load your saved data, princess! Resetting for a fresh start! 💕');
                window.accounts = [];
                window.user = null;
                window.currentAccountIndex = 0;
                localStorage.removeItem('simstaAccounts');
                localStorage.removeItem('simstaBackup');
            }
        } else {
            console.log('No saved data found, my pink cyan cutie!');
            window.accounts = [];
            window.user = null;
            window.currentAccountIndex = 0;
        }

        if (window.accounts.length === 0) {
            const defaultProfilePic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACCSURBVGhD7dQhDsAgEETR3zO2/wVHsEQTQ9OQhyqP9EOGYChFuC9jV5sR5oQ88YjsL2tXmxHmRDwiu2v+zu3qM8KcIKeQJ+SR5gl5hDzSnCDPkGfkEfJIM8KcIM+QZ+QZ8kwzwpwg55Bn5BnyTDPCnCDnkGfkGfJMM8KcIOeQZ+QZcsw/wAUrX6L6xV9qAAAAAElFTkSuQmCC';
            
            const sophhiaaAccount = {
                username: 'sophhiaa',
                followers: 0,
                posts: [],
                money: 0,
                notifications: [],
                verified: false,
                famous: false,
                lastActive: Date.now(),
                sponsored: false,
                eventHosted: false,
                profilePic: defaultProfilePic,
                trashBin: []
            };

            const viviVelvetAccount = {
                username: 'ViviVelvet',
                followers: 0,
                posts: [],
                money: 0,
                notifications: [],
                verified: false,
                famous: false,
                lastActive: Date.now(),
                sponsored: false,
                eventHosted: false,
                profilePic: defaultProfilePic,
                trashBin: []
            };

            window.accounts.push(sophhiaaAccount, viviVelvetAccount);
            window.currentAccountIndex = 0;
            window.user = window.accounts[0];
            window.addNotification('Created your fab accounts, sophhiaa and ViviVelvet, Sophia! 💖', false);
        }

        if (!window.user) {
            window.user = window.accounts[0] || {
                username: 'DefaultUser',
                followers: 0,
                posts: [],
                money: 0,
                notifications: [],
                verified: false,
                famous: false,
                lastActive: Date.now(),
                sponsored: false,
                eventHosted: false,
                profilePic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACCSURBVGhD7dQhDsAgEETR3zO2/wVHsEQTQ9OQhyqP9EOGYChFuC9jV5sR5oQ88YjsL2tXmxHmRDwiu2v+zu3qM8KcIKeQJ+SR5gl5hDzSnCDPkGfkEfJIM8KcIM+QZ+QZ8kwzwpwg55Bn5BnyTDPCnCDnkGfkGfJMM8KcIOeQZ+QZcsw/wAUrX6L6xV9qAAAAAElFTkSuQmCC',
                trashBin: []
            };
            if (!window.accounts.includes(window.user)) {
                window.accounts.push(window.user);
            }
        }
        window.isUserLoaded = true;
        console.log('User after load for Sophia:', window.user);
        updateUI();
    } catch (err) {
        console.error('Error in loadUserData, babe!:', err);
        window.isUserLoaded = false;
    }
}

function showSaveConfirmation() {
    let confirmation = document.getElementById('saveConfirmation');
    if (!confirmation) {
        confirmation = document.createElement('div');
        confirmation.id = 'saveConfirmation';
        document.body.appendChild(confirmation);
    }
    confirmation.textContent = 'Saved, Sophia, my pink princess! 💾';
    confirmation.style.display = 'block';
    setTimeout(() => confirmation.style.display = 'none', 2000);
}

function exportUserData(isAutoExport = false) {
    if (!window.user) return;

    const totalFollowers = window.accounts.reduce((sum, account) => sum + (account.followers || 0), 0);
    const formattedFollowers = window.formatNumber(totalFollowers);

    const data = {
        followersSummary: `Total followers for Sophia: ${formattedFollowers} 🌟`,
        accounts: window.accounts,
        generatedAccounts: window.generatedAccounts,
        messages: window.messages,
        hasEngagementBoost,
        hasProfileGlitter,
        shoutoutStreak: window.shoutoutStreak,
        lastShoutoutTime: window.lastShoutoutTime,
        lastDailyReward: window.lastDailyReward,
        currentAccountIndex: window.currentAccountIndex
    };

    const dataStr = JSON.stringify(data);
    latestAutoSave = dataStr;
    if (isSessionStorageAvailable()) {
        try {
            sessionStorage.setItem('simstaLatestAutoSave', dataStr);
            console.log('Exported to sessionStorage, babe!');
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
    if (!isAutoExport) window.addNotification('Data exported, my Smudge Gradient queen! 📤', false);
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
            saveUserData();
            window.addNotification('Data imported, Sophia! Slay it, babe! 📥', false);
            updateUI();
            if (window.growthLoopId) clearInterval(window.growthLoopId);
            if (window.startGrowthLoop) window.startGrowthLoop();
        } catch (err) {
            console.error('Import error:', err);
            alert('Failed to import data, princess!');
        }
    };
    reader.onerror = (e) => {
        console.error('File read error:', e);
        alert('Error reading file, babe!');
    };
    reader.readAsText(file);
}

function toggleAutoSave() {
    autoSaveEnabled = !autoSaveEnabled;
    const toggleButton = document.getElementById('toggleAutoSave');
    if (toggleButton) {
        toggleButton.textContent = `Auto-Save: ${autoSaveEnabled ? 'ON' : 'OFF'}`;
    }
    window.addNotification(`Auto-save ${autoSaveEnabled ? 'enabled' : 'disabled'}, Sophia! ⚙️`, false);
}

window.addNotification = function(message, addToList = true) {
    console.log('Notification queued for Sophia:', message);
    notificationQueue.push({ message, addToList });
    if (!isNotificationActive) showNextNotification();
};

function showNextNotification() {
    if (notificationQueue.length === 0) {
        isNotificationActive = false;
        return;
    }
    isNotificationActive = true;
    const { message, addToList } = notificationQueue.shift();
    console.log('Displaying notification, babe:', message);
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
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
            showNextNotification();
        }, 500);
    }, 3000);
}

window.showAccountSwitcher = function() {
    const modal = document.getElementById('accountSwitcherModal');
    if (!modal) {
        console.error('No accountSwitcherModal, Sophia!');
        return;
    }
    const accountList = document.getElementById('accountList');
    if (!accountList) {
        console.error('No accountList, babe!');
        return;
    }
    accountList.innerHTML = '';
    window.accounts.forEach((account, index) => {
        const div = document.createElement('div');
        div.style.margin = '5px 0';
        div.innerHTML = `
            <span>${account.username} (Followers: ${window.formatNumber(account.followers)}) ${index === window.currentAccountIndex ? '(Current) ✨' : ''}</span>
            <button onclick="window.switchAccount(${index})" style="background: #ff99cc; margin-left: 10px;">Switch 🌟</button>
        `;
        accountList.appendChild(div);
    });
    modal.classList.remove('hidden');
};

window.hideAccountSwitcher = function() {
    const modal = document.getElementById('accountSwitcherModal');
    if (modal) modal.classList.add('hidden');
};

window.switchAccount = function(index) {
    if (index < 0 || index >= window.accounts.length) return;
    window.accounts[window.currentAccountIndex] = window.user;
    window.currentAccountIndex = index;
    window.user = window.accounts[index];
    localStorage.setItem('currentAccountIndex', window.currentAccountIndex);
    window.hideAccountSwitcher();
    updateUI();
    if (window.growthLoopId) clearInterval(window.growthLoopId);
    if (window.startGrowthLoop) window.startGrowthLoop();
    window.addNotification(`Switched to ${window.user.username}, Sophia! ✨`, true);
};

window.addNewAccount = function() {
    window.hideAccountSwitcher();
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
        window.showAccountSwitcher();
        updateUI();
    } else {
        window.user = null;
        updateUI();
    }
};

// Admin Panel Functions
function showPasswordModal() {
    if (!window.user) {
        alert('Create an account first, Sophia! 👑');
        return;
    }
    const passwordModal = document.getElementById('passwordModal');
    if (!passwordModal) {
        console.error('Password modal not found, babe!');
        return;
    }
    passwordModal.classList.remove('hidden');
    document.getElementById('adminPasswordInput').value = '';
}

function hidePasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    if (passwordModal) passwordModal.classList.add('hidden');
}

function validatePassword() {
    const passwordInput = document.getElementById('adminPasswordInput').value;
    if (passwordInput === ADMIN_PASSWORD) {
        hidePasswordModal();
        showAdminPanel();
    } else {
        alert('Wrong password, Sophia! 💅');
    }
}

function showAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (!panel) {
        console.error('Admin panel not found, princess!');
        return;
    }
    panel.classList.remove('hidden');
    document.getElementById('adminFollowers').value = window.user.followers || 0;
    document.getElementById('adminMoney').value = window.user.money || 0;
    document.getElementById('adminMoneyMultiplier').value = 1;
    document.getElementById('adminPostCount').value = window.user.posts.length || 0;
    document.getElementById('adminVerified').checked = window.user.verified || false;
    document.getElementById('adminFamous').checked = window.user.famous || false;
    document.getElementById('adminParanoid').checked = window.paranoidMode || false;
}

function hideAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.classList.add('hidden');
    updateUI();
}

function applyAdminChanges() {
    if (!window.user) return;
    window.user.followers = parseInt(document.getElementById('adminFollowers').value) || 0;
    const newMoney = parseInt(document.getElementById('adminMoney').value) || 0;
    const moneyMultiplier = parseFloat(document.getElementById('adminMoneyMultiplier').value) || 1;
    window.user.money = Math.floor(newMoney * moneyMultiplier);
    const newPostCount = parseInt(document.getElementById('adminPostCount').value) || 0;
    // Adjust post count (moved from game.js dependency)
    while (window.user.posts.length < newPostCount) {
        window.generatePost && window.generatePost(true); // Silent post generation
    }
    while (window.user.posts.length > newPostCount) {
        window.user.posts.pop();
    }
    window.user.verified = document.getElementById('adminVerified').checked;
    window.user.famous = document.getElementById('adminFamous').checked;
    const newParanoid = document.getElementById('adminParanoid').checked;
    if (newParanoid !== window.paranoidMode && window.toggleParanoidMode) window.toggleParanoidMode();
    if (window.calculateMoneyFromLikes) window.calculateMoneyFromLikes();
    saveUserData();
    window.addNotification('Admin changes applied, Sophia! Slay! ✨', false);
    hideAdminPanel();
}

function resetGameFromAdmin() {
    if (confirm('Reset everything, Sophia? This can’t be undone! 👑')) {
        localStorage.removeItem('simstaAccounts');
        localStorage.removeItem('simstaBackup');
        sessionStorage.removeItem('simstaLatestAutoSave');
        clearInterval(window.growthLoopId);
        window.accounts = [];
        window.user = null;
        window.currentAccountIndex = 0;
        window.generatedAccounts = {};
        window.messages = [];
        hasEngagementBoost = false;
        hasProfileGlitter = false;
        latestAutoSave = null;
        isLocalStorageFull = false;
        window.storageFullNotified = false;
        saveUserData();
        hideAdminPanel();
        location.reload();
    }
}

function clearNotifications() {
    if (!window.user) return;
    window.user.notifications = [];
    saveUserData();
    window.addNotification('Notifications cleared, Sophia! 🔔', false);
    updateUI();
}

function resetAIAccounts() {
    window.generatedAccounts = {};
    saveUserData();
    window.addNotification('AI accounts reset, my pink queen! 🤖', false);
    updateUI();
}

function previewProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profilePicPreview').src = e.target.result;
            document.getElementById('profilePicPreview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function createAccount() {
    const username = document.getElementById('username').value.trim();
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePic = profilePicInput ? profilePicInput.files[0] : null;

    if (!username) {
        alert('Need a cute username, Sophia!');
        return;
    }

    const newUser = {
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
        reader.readAsDataURL(profilePic);
    } else {
        finishAccountCreation(newUser);
    }
}

function finishAccountCreation(newUser) {
    window.accounts.push(newUser);
    window.currentAccountIndex = window.accounts.length - 1;
    window.user = newUser;
    localStorage.setItem('simstaAccounts', JSON.stringify({
        accounts: window.accounts,
        generatedAccounts: window.generatedAccounts,
        messages: window.messages,
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
    window.addNotification(`Welcome to Simsta, ${window.user.username}, Sophia! 💕`, false);
    if (window.simulateInitialFollowers) window.simulateInitialFollowers();
    if (autoSaveEnabled) saveUserData();
    if (window.closeSelfieSnap) window.closeSelfieSnap();
    if (window.growthLoopId) clearInterval(window.growthLoopId);
    if (window.startGrowthLoop) window.startGrowthLoop();
    updateUI();
}

function resetAccount() {
    if (confirm('Start fresh, Sophia?')) {
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
        if (window.startGrowthLoop) window.startGrowthLoop();
        saveUserData();
        window.addNotification('Account reset, fresh start, babe! 🌸', false);
        updateUI();
    }
}

window.renderTrashBin = function() {
    const feed = document.getElementById('feed');
    if (!feed) return;
    const trashSection = document.createElement('div');
    trashSection.id = 'trashSection';
    trashSection.style.marginTop = '20px';
    trashSection.innerHTML = '<h3>🗑️ Trash Bin, Sophia! 🗑️</h3>';
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

    if (!window.user) {
        document.getElementById('signupSection').classList.remove('hidden');
        document.getElementById('appSection').classList.add('hidden');
        document.getElementById('adminPanel')?.classList.add('hidden');
        document.getElementById('passwordModal')?.classList.add('hidden');
        document.getElementById('accountSwitcherModal')?.classList.add('hidden');
        if (currentDeleteUI) currentDeleteUI.remove();
        return;
    }

    document.getElementById('signupSection').classList.add('hidden');
    document.getElementById('appSection').classList.remove('hidden');

    const usernameDisplay = document.getElementById('usernameDisplay');
    usernameDisplay.style.background = 'linear-gradient(45deg, #ff69b4, #00ffff)'; // Pink to Cyan for Sophia!
    usernameDisplay.style.color = '#fff';
    usernameDisplay.style.padding = '2px 8px';
    usernameDisplay.style.borderRadius = '5px';
    usernameDisplay.textContent = window.user.username === 'sophhiaa' ? '🌸 Sophia, My Pink Cyan Queen! 🌸' : window.user.username;
    usernameDisplay.classList.toggle('verified', window.user.verified);
    usernameDisplay.classList.toggle('famous', window.user.famous);
    usernameDisplay.classList.toggle('glitter', hasProfileGlitter);
    document.getElementById('profilePicDisplay').src = window.user.profilePic;
    document.getElementById('followerCount').textContent = window.formatNumber(window.user.followers);
    document.getElementById('postCount')?.textContent = window.formatNumber(window.user.posts.length); // Optional since not in HTML yet
    document.getElementById('moneyDisplay').textContent = `Money: $${window.formatNumber(window.user.money)}`;
    if (document.getElementById('shopMoneyDisplay')) {
        document.getElementById('shopMoneyDisplay').textContent = window.formatNumber(window.user.money);
    }

    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        const tabId = activeTab.onclick.toString().match(/'([^']+)'/)[1];
        switch (tabId) {
            case 'postsTab':
                if (window.renderPosts) window.renderPosts();
                window.renderTrashBin();
                break;
            case 'notificationsTab':
                if (window.renderNotifications) window.renderNotifications();
                break;
            case 'likesTab':
                if (window.renderLikes) window.renderLikes();
                break;
            case 'commentsTab':
                if (window.renderComments) window.renderComments();
                break;
            case 'generatedAccountsTab':
                if (window.renderGeneratedPosts) window.renderGeneratedPosts();
                break;
            case 'profileTab':
                if (window.renderProfileTab) window.renderProfileTab();
                break;
            case 'aiAccountsTab':
                if (window.renderAIAccounts) window.renderAIAccounts();
                break;
            case 'messagesTab':
                if (window.renderMessages) window.renderMessages();
                break;
            case 'shopTab':
                if (window.renderShopTab) window.renderShopTab();
                break;
        }
    }

    if (window.growthLoopId) clearInterval(window.growthLoopId);
    if (window.startGrowthLoop) window.startGrowthLoop();
    if (autoSaveEnabled) saveUserData();
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

console.log('Calling loadUserData for Sophia!');
loadUserData();

window.addEventListener('beforeunload', (e) => {
    if (window.user) {
        try {
            const dataToSave = JSON.stringify({ 
                accounts: window.accounts,
                generatedAccounts: window.generatedAccounts,
                messages: window.messages,
                hasEngagementBoost,
                hasProfileGlitter,
                shoutoutStreak: window.shoutoutStreak,
                lastShoutoutTime: window.lastShoutoutTime,
                lastDailyReward: window.lastDailyReward,
                currentAccountIndex: window.currentAccountIndex
            });
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
            console.error('Before unload save/export error, Sophia!:', err);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        console.log('Ctrl+Shift+A pressed, showing password modal, babe!');
        showPasswordModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js DOM ready for Sophia, my pink cyan princess! 💖');
    const waitForUser = setInterval(() => {
        if (window.isUserLoaded) {
            clearInterval(waitForUser);
            console.log('User loaded, initializing UI, girly!');
            try {
                if (!document.getElementById('appSection') || !document.getElementById('signupSection')) {
                    console.error('Oopsie, Sophia! appSection or signupSection is missing!');
                    alert('Hey cutie, the page setup is off! Check the HTML, princess! 💕');
                    return;
                }
                if (window.user) {
                    document.getElementById('signupSection').classList.add('hidden');
                    document.getElementById('appSection').classList.remove('hidden');
                    if (window.virtualBaeActive && window.toggleVirtualBae) window.toggleVirtualBae();
                    if (window.paranoidMode && window.toggleParanoidMode) window.toggleParanoidMode();
                    updateUI();
                    window.dispatchEvent(new Event('userLoaded'));
                } else {
                    document.getElementById('signupSection').classList.remove('hidden');
                    document.getElementById('appSection').classList.add('hidden');
                }
            } catch (err) {
                console.error('Error during UI initialization, Sophia!:', err);
                alert('Eek, something broke, babe! Check the console, my pink princess! 💖');
            }
        } else {
            console.log('Waiting for user to load, my Smudge Gradient sweetie...');
        }
    }, 100);
});

console.log('script.js loaded for Sophia, my glittery bestie! 💕');
