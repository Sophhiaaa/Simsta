console.log('game-new-features.js starting, Sophia! 💕');

// New Features
window.claimDailyReward = function() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - window.lastDailyReward < oneDay) {
        window.addNotification('Come back tomorrow for more goodies, Sophia! ⏳');
        return;
    }
    const rewardType = Math.random();
    let rewardMessage;
    if (rewardType < 0.5) {
        const money = Math.floor(Math.random() * 100) + 50;
        window.user.money += money;
        rewardMessage = `Claimed $${money} daily reward, my pink cyan queen! 💸`;
    } else {
        const followers = Math.floor(Math.random() * 200) + 100;
        window.user.followers += followers;
        rewardMessage = `Claimed ${followers} followers daily reward, Sophia! 🌟`;
    }
    window.lastDailyReward = now;
    window.addNotification(rewardMessage);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.buyTheme = function(theme) {
    if (window.user.money < 150) {
        window.addNotification('Not enough money, Sophia! 💸');
        return;
    }
    if (window.user.theme === theme) {
        window.addNotification(`You already have the ${theme} theme, Sophia! ✨`);
        return;
    }
    window.user.money -= 150;
    window.user.theme = theme;
    document.body.classList.remove('candy-theme', 'galaxy-theme');
    document.body.classList.add(`${theme}-theme`);
    window.addNotification(`Bought the ${theme} theme, my glittery princess! 💖`);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

console.log('game-new-features.js loaded for Sophia, my pink cyan princess! 💕');
