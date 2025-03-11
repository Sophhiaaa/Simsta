console.log('game-utils.js starting, Sophia! 💕');

// Game-specific variables
window.currentSortMode = window.currentSortMode || 'highest'; // How posts are sorted (highest likes first)
let lastManualPostTime = 0; // Tracks when you last posted manually
window.debugLikes = true; // Shows extra info about likes in the console

// Utility Functions
window.generateRandomUsername = function() {
    const prefixes = ['Glitter', 'Pinky', 'Bae', 'Diva', 'Sparkle']; // Cute start words
    const suffixes = ['Bunny', 'Queen', 'Doll', 'Star']; // Cute end words
    const username = prefixes[Math.floor(Math.random() * prefixes.length)] + // Pick a random start
           suffixes[Math.floor(Math.random() * suffixes.length)] + // Add a random end
           Math.floor(Math.random() * 100); // Add a number (0-99)
    console.log('Generated random username for Sophia:', username);
    return username;
};

window.pickRandomComment = function() {
    const comments = ['So cute, Sophia! 💕', 'Slay, girl! ✨', 'Obsessed! 😍', 'Perf, babe! 🌸', 'Love this! 💖'];
    const comment = comments[Math.floor(Math.random() * comments.length)]; // Picks a random cute comment
    console.log('Picked random comment for Sophia:', comment);
    return comment;
};

window.generateFollowers = function(count) {
    const followers = [];
    for (let i = 0; i < count; i++) {
        const follower = window.generateRandomUsername();
        followers.push(follower);
    }
    console.log(`Generated ${count} followers for Sophia:`, followers);
    return followers;
};

window.formatNumber = function(num) {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B'; // Billions (like 1.2B)
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M'; // Millions (like 1.5M)
    if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K'; // Thousands (like 2.3K)
    const formatted = num.toString();
    console.log(`Formatted number ${num} to ${formatted} for Sophia`);
    return formatted;
};

window.addNotification = function(message, addToList = true) {
    if (!window.user) {
        console.log('No user to notify, Sophia!');
        return;
    }
    window.user.notifications.unshift({
        id: Date.now(),
        message: message,
        timestamp: new Date().toLocaleTimeString()
    });
    if (autoSaveEnabled && !addToList) window.saveUserData();
    console.log('Added notification for Sophia:', message);
    window.updateUI();
};

console.log('game-utils.js loaded for Sophia, my pink cyan princess! 💕');
