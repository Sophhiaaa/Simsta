console.log('game-utils.js starting, Sophia! 💕');

// Game-specific variables
window.currentSortMode = window.currentSortMode || 'highest'; // How posts are sorted (highest likes first)
let lastManualPostTime = 0; // Tracks when you last posted manually
window.debugLikes = true; // Shows extra info about likes in the console

// Utility Functions
window.generateRandomUsername = function() {
    const prefixes = ['Glitter', 'Pinky', 'Bae', 'Diva', 'Sparkle']; // Cute start words
    const suffixes = ['Bunny', 'Queen', 'Doll', 'Star']; // Cute end words
    return prefixes[Math.floor(Math.random() * prefixes.length)] + // Pick a random start
           suffixes[Math.floor(Math.random() * suffixes.length)] + // Add a random end
           Math.floor(Math.random() * 100); // Add a number (0-99)
};

window.pickRandomComment = function() {
    const comments = ['So cute, Sophia! 💕', 'Slay, girl! ✨', 'Obsessed! 😍', 'Perf, babe! 🌸', 'Love this! 💖'];
    return comments[Math.floor(Math.random() * comments.length)]; // Picks a random cute comment
};

window.generateFollowers = function(count) {
    const followers = [];
    for (let i = 0; i < count; i++) followers.push(window.generateRandomUsername()); // Makes a list of random usernames
    return followers;
};

window.formatNumber = function(num) {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B'; // Billions (like 1.2B)
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M'; // Millions (like 1.5M)
    if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K'; // Thousands (like 2.3K)
    return num.toString(); // Just the number if it’s small
};

window.addNotification = function(message, skipSave = true) {
    if (!window.user) return; // No user? No notification!
    window.user.notifications.unshift({ // Adds a new notification to the top
        id: Date.now(),
        message: message,
        timestamp: new Date().toLocaleTimeString()
    });
    if (autoSaveEnabled && !skipSave) window.saveUserData(); // Saves if autosave is on
    window.updateUI(); // Updates the screen
};

console.log('game-utils.js loaded for Sophia, my pink cyan princess! 💕');
