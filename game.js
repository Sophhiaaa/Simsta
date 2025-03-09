console.log('game.js starting');

// Game-specific variables
window.currentSortMode = window.currentSortMode || 'highest';
let lastManualPostTime = 0;
window.debugLikes = true;

// Utility Functions
window.generateRandomUsername = function() {
    const prefixes = ['Glitter', 'Pinky', 'Bae', 'Diva', 'Sparkle'];
    const suffixes = ['Bunny', 'Queen', 'Doll', 'Star'];
    return prefixes[Math.floor(Math.random() * prefixes.length)] +
           suffixes[Math.floor(Math.random() * suffixes.length)] +
           Math.floor(Math.random() * 100);
};

window.pickRandomComment = function() {
    const comments = ['So cute! 💕', 'Slay, girl! ✨', 'Obsessed! 😍', 'Perf! 🌸', 'Love this! 💖'];
    return comments[Math.floor(Math.random() * comments.length)];
};

window.generateFollowers = function(count) {
    const followers = [];
    for (let i = 0; i < count; i++) followers.push(window.generateRandomUsername());
    return followers;
};

window.formatNumber = function(num) {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.?0+$/, '') + 'K';
    return num.toString();
};

// Ensure addNotification triggers save when needed
window.addNotification = function(message, skipSave = true) {
    if (!window.user) {
        console.error('No user in addNotification');
        return;
    }
    window.user.notifications.unshift({
        id: Date.now(),
        message: message,
        timestamp: new Date().toLocaleTimeString()
    });
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
    if (autoSaveEnabled && !skipSave) window.saveUserData();
    window.updateUI();
};

// Sort Function
window.cycleSortPosts = function() {
    if (!Array.isArray(window.user.posts) || window.user.posts.length === 0) {
        window.addNotification('No posts to sort, babe! 💖');
        return;
    }
    const sortButton = document.getElementById('sortButton');
    if (!sortButton) return;
    if (window.currentSortMode === 'highest') {
        window.user.posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        window.addNotification('Sorted by highest likes! ↓');
        window.currentSortMode = 'lowest';
        sortButton.textContent = 'Sort by Lowest ↑';
    } else if (window.currentSortMode === 'lowest') {
        window.user.posts.sort((a, b) => (a.likes || 0) - (b.likes || 0));
        window.addNotification('Sorted by lowest likes! ↑');
        window.currentSortMode = 'newest';
        sortButton.textContent = 'Sort by Newest 🕒';
    } else {
        window.user.posts.sort((a, b) => (b.timestamp || Date.now()) - (a.timestamp || Date.now()));
        window.addNotification('Sorted by newest first! 🕒');
        window.currentSortMode = 'highest';
        sortButton.textContent = 'Sort by Highest ↓';
    }
    console.log('Posts after sorting:', window.user.posts.length, 'followers:', window.user.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

// New Features
window.claimDailyReward = function() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - window.lastDailyReward < oneDay) {
        window.addNotification('Come back tomorrow for more goodies, queen! ⏳');
        return;
    }
    const rewardType = Math.random();
    let rewardMessage;
    if (rewardType < 0.5) {
        const money = Math.floor(Math.random() * 100) + 50;
        window.user.money += money;
        rewardMessage = `Claimed $${money} daily reward! 💸`;
    } else {
        const followers = Math.floor(Math.random() * 200) + 100;
        window.user.followers += followers;
        rewardMessage = `Claimed ${followers} followers daily reward! 🌟`;
    }
    window.lastDailyReward = now;
    window.addNotification(rewardMessage);
    console.log('After claimDailyReward - followers:', window.user.followers, 'money:', window.user.money);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.buyTheme = function(theme) {
    if (window.user.money < 150) {
        window.addNotification('Not enough money, babe! 💸');
        return;
    }
    if (window.user.theme === theme) {
        window.addNotification(`You already have the ${theme} theme, queen! ✨`);
        return;
    }
    window.user.money -= 150;
    window.user.theme = theme;
    document.body.classList.remove('candy-theme', 'galaxy-theme');
    document.body.classList.add(`${theme}-theme`);
    window.addNotification(`Bought the ${theme} theme! Looking fab! 💖`);
    console.log('After buyTheme - money:', window.user.money, 'theme:', window.user.theme);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

// Game Feature Functions
window.refreshFollowers = function() {
    window.simulateOfflineGrowth();
    window.calculateMoneyFromLikes();
    window.addNotification('Refreshed your followers, babe! ✨');
    console.log('After refreshFollowers - followers:', window.user.followers, 'money:', window.user.money);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.shareProfile = function() {
    const followerGain = window.user.followers >= 100000 ? 
        Math.floor(Math.random() * 1000) + 500 : 
        Math.floor(Math.random() * 20) + 5;
    window.user.followers += followerGain;
    window.addNotification(`Shared your profile! Gained ${window.formatNumber(followerGain)} followers! 📲`);
    console.log('After shareProfile - followers:', window.user.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.liveStream = function() {
    const viewers = window.user.followers >= 100000 ? 
        Math.floor(Math.random() * 50000) + 10000 : 
        Math.floor(Math.random() * 500) + 50;
    const followerGain = Math.floor(viewers * 0.05);
    window.user.followers += followerGain;
    window.addNotification(`Went live with ${window.formatNumber(viewers)} viewers! Gained ${window.formatNumber(followerGain)} followers! 🎥`);
    console.log('After liveStream - followers:', window.user.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.getSponsored = function() {
    if (!window.user.sponsored && window.user.followers >= 5000) {
        window.user.sponsored = true;
        const earnings = Math.floor(window.user.followers * 0.02);
        window.user.money += earnings;
        window.addNotification(`Sponsor deal! Earned $${window.formatNumber(earnings)}! 💰`);
    } else if (window.user.sponsored) {
        window.addNotification('Already sponsored, queen! 💅');
    } else {
        window.addNotification('Need 5K followers for a sponsor deal! 🌟');
    }
    console.log('After getSponsored - money:', window.user.money, 'sponsored:', window.user.sponsored);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.hostEvent = function() {
    if (!window.user.eventHosted && window.user.followers >= 10000) {
        window.user.eventHosted = true;
        const attendees = Math.floor(window.user.followers * 0.1);
        window.user.followers += Math.floor(attendees * 0.2);
        window.addNotification(`Hosted an event with ${window.formatNumber(attendees)} besties! 🎉`);
    } else if (window.user.eventHosted) {
        window.addNotification('Already hosted an event! 🎈');
    } else {
        window.addNotification('Reach 10K followers to host an event! 💖');
    }
    console.log('After hostEvent - followers:', window.user.followers, 'eventHosted:', window.user.eventHosted);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.giveShoutout = function() {
    if (window.user.followers < 2000) {
        window.addNotification('Need 2K followers for shoutouts, queen! 📣');
        return;
    }
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    if (now - window.lastShoutoutTime < oneHour) {
        window.addNotification('Wait an hour between shoutouts, babe! ⏳');
        return;
    }
    const generatedAccountNames = Object.keys(window.generatedAccounts);
    if (generatedAccountNames.length === 0) {
        window.addNotification('No generated accounts to shoutout yet! 🌟');
        return;
    }
    const shoutoutAccount = generatedAccountNames[Math.floor(Math.random() * generatedAccountNames.length)];
    window.user.loyalty = window.user.loyalty || 0;
    window.user.loyalty += 10;
    const followerGain = Math.floor(Math.random() * 100) + 50 + (window.shoutoutStreak * 10);
    window.user.followers += followerGain;
    window.shoutoutStreak++;
    window.lastShoutoutTime = now;
    window.generatedAccounts[shoutoutAccount].followers.push(window.generateRandomUsername());
    window.addNotification(`Shoutout to ${shoutoutAccount}! +${window.formatNumber(followerGain)} followers & +10 loyalty! Streak: ${window.shoutoutStreak} 📣`);
    const shoutoutButton = document.getElementById('shoutoutButton');
    if (shoutoutButton) {
        shoutoutButton.classList.add('highlight');
        setTimeout(() => shoutoutButton.classList.remove('highlight'), 500);
    }
    console.log('After giveShoutout - followers:', window.user.followers, 'loyalty:', window.user.loyalty);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.toggleParanoidMode = function() {
    window.paranoidMode = !window.paranoidMode;
    document.body.classList.toggle('paranoid-mode', window.paranoidMode);
    window.addNotification(window.paranoidMode ? 'Paranoid mode on! 👻' : 'Back to glam! 💖');
    if (window.paranoidMode) {
        const followerGain = Math.floor(Math.random() * 50);
        window.user.followers += followerGain;
        window.addNotification(`Spooky followers joined! +${followerGain} 🌙`);
    }
    console.log('After toggleParanoidMode - followers:', window.user.followers, 'paranoidMode:', window.paranoidMode);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.generatePost = function(silent = false) {
    console.log('Generate Post clicked!');
    let lastPostTime = window.lastGeneratePostTime || 0;
    const now = Date.now();
    const cooldown = 800;

    if (now - lastPostTime < cooldown) {
        console.log('Cooldown active, skipping post. Time left:', (cooldown - (now - lastPostTime)) / 1000, 'seconds');
        window.addNotification('Slow down, queen! Wait a sec to post again! ⏳', false);
        return;
    }

    console.log('Posting now!');
    window.lastGeneratePostTime = now;

    const captions = ['Slaying it!', 'Feeling cute!', 'Pink vibes!', 'Best life!', 'Sparkle time!'];
    const hashtags = ['#selfie', '#slay', '#cute', '#pink', '#glam'];
    const images = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVGhD7daxCYAwEETRZQv2P8kTsAQuQTuD8nAIIYTwWcbOdiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2f8A1g8UrX7R6fAAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVGhD7daxCcAwEETRXQr2P8kTsAQuQTuD8nAIIYTwWcbOdiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2f8AyhIUrX7R6fAAAAAASUVORK5CYII='
    ];
    const post = {
        likes: 0,
        comments: [],
        isViral: false,
        isSuperViral: false,
        liked: false,
        caption: captions[Math.floor(Math.random() * captions.length)],
        hashtags: hashtags.sort(() => 0.5 - Math.random()).slice(0, 3),
        imageData: images[Math.floor(Math.random() * images.length)],
        timestamp: Date.now()
    };
    if (!Array.isArray(window.user.posts)) window.user.posts = [];
    window.user.posts.unshift(post);
    window.simulateEngagement(0); // Trigger engagement immediately after posting
    // Add a small follower gain for each post
    const followerGain = Math.floor(Math.random() * 10) + 5; // 5-15 followers per post
    window.user.followers += followerGain;
    window.addNotification(`Your post attracted ${followerGain} new followers! 🌟`);
    if (!silent) window.addNotification('Generated a fab post! 🌟');
    console.log('After generatePost - posts:', window.user.posts.length, 'followers:', window.user.followers, 'new post likes:', post.likes);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
    if (window.debugLikes) console.log('Post created with likes:', window.user.posts[0].likes);
};

window.toggleManualPost = function() {
    document.getElementById('manualPostSection').classList.toggle('hidden');
};

window.createManualPost = function() {
    const now = Date.now();
    const cooldown = 800;
    if (now - lastManualPostTime < cooldown) {
        window.addNotification('Hold up, babe! Wait a sec to post again! ⏳', false);
        return;
    }
    lastManualPostTime = now;

    const imageInput = document.getElementById('imageInput');
    const captionInput = document.getElementById('captionInput');
    const caption = captionInput.value.trim();
    const file = imageInput.files[0];
    if (!file && !caption) {
        alert('Add a pic or caption, princess!');
        return;
    }
    if (file && file.size > 1 * 1024 * 1024) {
        alert('Pic too big, keep it under 1MB!');
        return;
    }
    const post = { 
        likes: 0, 
        comments: [], 
        isViral: false, 
        isSuperViral: false, 
        liked: false,
        timestamp: Date.now()
    };
    if (caption) {
        post.caption = caption;
        post.hashtags = caption.match(/#\w+/g) || [];
    }
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            post.imageData = e.target.result;
            if (!Array.isArray(window.user.posts)) window.user.posts = [];
            window.user.posts.unshift(post);
            window.simulateEngagement(0); // Trigger engagement immediately
            const followerGain = Math.floor(Math.random() * 10) + 5;
            window.user.followers += followerGain;
            window.addNotification(`Your post attracted ${followerGain} new followers! 🌟`);
            console.log('After createManualPost with image - posts:', window.user.posts.length, 'followers:', window.user.followers, 'new post likes:', post.likes);
            if (autoSaveEnabled) window.saveUserData();
            imageInput.value = '';
            captionInput.value = '';
            window.toggleManualPost();
            window.updateUI();
        };
        reader.readAsDataURL(file);
    } else {
        if (!Array.isArray(window.user.posts)) window.user.posts = [];
        window.user.posts.unshift(post);
        window.simulateEngagement(0); // Trigger engagement immediately
        const followerGain = Math.floor(Math.random() * 10) + 5;
        window.user.followers += followerGain;
        window.addNotification(`Your post attracted ${followerGain} new followers! 🌟`);
        console.log('After createManualPost without image - posts:', window.user.posts.length, 'followers:', window.user.followers, 'new post likes:', post.likes);
        if (autoSaveEnabled) window.saveUserData();
        captionInput.value = '';
        window.toggleManualPost();
        window.updateUI();
    }
};

window.calculateMoneyFromLikes = function() {
    if (!Array.isArray(window.user.posts)) return;
    const totalLikes = window.user.posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const earnings = Math.floor(totalLikes * 0.005);
    window.user.money += earnings;
    if (earnings > 0) window.addNotification(`Earned $${window.formatNumber(earnings)} from ${window.formatNumber(totalLikes)} likes! 💸`);
    console.log('After calculateMoneyFromLikes - money:', window.user.money, 'total likes:', totalLikes);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.buyFollowerBoost = function() {
    if (window.user.money < 200) {
        window.addNotification('Not enough money, babe! 💸');
        return;
    }
    window.user.money -= 200;
    const followerGain = 500;
    window.user.followers += followerGain;
    window.addNotification(`Bought a Follower Boost! +${followerGain} followers! 🌟`);
    console.log('After buyFollowerBoost - followers:', window.user.followers, 'money:', window.user.money);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.buyEngagementBoost = function() {
    if (window.user.money < 100) {
        window.addNotification('Not enough money, babe! 💸');
        return;
    }
    if (hasEngagementBoost) {
        window.addNotification('Engagement Boost already active! 📈');
        return;
    }
    window.user.money -= 100;
    hasEngagementBoost = true;
    window.addNotification('Bought an Engagement Boost! Next post gets 50% more likes! 📈');
    console.log('After buyEngagementBoost - money:', window.user.money, 'hasEngagementBoost:', hasEngagementBoost);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.buyProfileGlitter = function() {
    if (window.user.money < 50) {
        window.addNotification('Not enough money, babe! 💸');
        return;
    }
    if (hasProfileGlitter) {
        window.addNotification('Your profile already glitters, queen! ✨');
        return;
    }
    window.user.money -= 50;
    hasProfileGlitter = true;
    window.addNotification('Bought Profile Glitter! Your username sparkles! ✨');
    console.log('After buyProfileGlitter - money:', window.user.money, 'hasProfileGlitter:', hasProfileGlitter);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.previewEditProfilePic = function(event) {
    const file = event.target.files[0];
    if (file && file.size <= 1 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('editProfilePicPreview').src = e.target.result;
            document.getElementById('editProfilePicPreview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Pic too big, keep it under 1MB!');
    }
};

window.saveProfileChanges = function() {
    const newUsername = document.getElementById('editUsername').value.trim();
    const profilePicInput = document.getElementById('editProfilePicInput');
    const profilePic = profilePicInput.files[0];
    if (!newUsername) {
        alert('Need a cute username, girly!');
        return;
    }
    const otherAccounts = window.accounts.filter((_, idx) => idx !== window.currentAccountIndex);
    if (otherAccounts.some(account => account.username.toLowerCase() === newUsername.toLowerCase())) {
        alert('Oops! That username is taken, pick another one, princess! 💕');
        return;
    }
    window.user.username = newUsername;
    if (profilePic && profilePic.size <= 1 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
            window.user.profilePic = e.target.result;
            window.finishProfileUpdate();
        };
        reader.readAsDataURL(profilePic);
    } else {
        window.finishProfileUpdate();
    }
};

window.finishProfileUpdate = function() {
    window.addNotification('Profile updated, slay! 💖');
    console.log('After profile update - username:', window.user.username, 'profilePic:', window.user.profilePic ? 'set' : 'not set');
    if (autoSaveEnabled) window.saveUserData();
    document.getElementById('editProfilePicInput').value = '';
    document.getElementById('editProfilePicPreview').classList.add('hidden');
    window.updateUI();
};

// Rendering Functions
window.renderPosts = function() {
    const feed = document.getElementById('feed');
    if (!feed) {
        console.error('Feed element not found!');
        return;
    }
    if (!Array.isArray(window.user.posts)) window.user.posts = [];
    feed.innerHTML = '';
    const postsToShow = window.user.posts.slice(0, 10);
    console.log('Rendering posts:', postsToShow.length, 'total posts:', window.user.posts.length);
    postsToShow.forEach((post, index) => window.renderPost(post, index, feed));

    if (window.user.posts.length > 10) {
        const loadMore = document.createElement('button');
        loadMore.textContent = 'Load More Posts ✨';
        loadMore.style.background = '#ff69b4';
        loadMore.onclick = () => {
            const nextBatch = window.user.posts.slice(feed.children.length, feed.children.length + 10);
            nextBatch.forEach((post, index) => window.renderPost(post, index + feed.children.length, feed));
            if (feed.children.length >= window.user.posts.length) loadMore.remove();
        };
        feed.appendChild(loadMore);
    }
};

window.renderPost = function(post, index, feed) {
    console.log('Rendering post at index:', index, 'likes:', post.likes);
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    if (post.isViral) postDiv.classList.add('viral');
    if (post.isSuperViral) postDiv.classList.add('super-viral');
    if (post.imageData) {
        const img = document.createElement('img');
        img.src = post.imageData;
        img.alt = 'Post Image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.onerror = () => img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABlSURBVGhD7dKxCcAwDATBXQj+JRzBEZwEO4PycAghhPBZxs52I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeWLgBRJUrX7R6fAAAAAASUVORK5CYII=';
        postDiv.appendChild(img);
    }
    if (post.caption) {
        const p = document.createElement('p');
        p.textContent = post.caption;
        postDiv.appendChild(p);
    }
    const stats = document.createElement('div');
    stats.className = 'post-stats';
    stats.innerHTML = `
        <span id="likes-${index}">${window.formatNumber(post.likes)} likes</span>
        <span id="comments-count-${index}">${window.formatNumber(post.comments.length)} comments</span>
        <button class="refresh-button" onclick="window.refreshPost(${index})">Refresh ✨</button>
    `;
    postDiv.appendChild(stats);
    const likeButton = document.createElement('span');
    likeButton.className = 'like-button';
    likeButton.innerHTML = '❤️';
    likeButton.classList.toggle('liked', post.liked);
    likeButton.onclick = () => window.toggleLike(index);
    postDiv.appendChild(likeButton);
    const buttons = document.createElement('div');
    buttons.className = 'post-buttons';
    const trashButton = document.createElement('button');
    trashButton.className = 'trash-button';
    trashButton.textContent = 'Move to Trash 🗑️';
    trashButton.style.background = 'linear-gradient(45deg, #ff9999, #ff6666)';
    trashButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Trash button clicked for index:', index);
        try {
            if (window.user && window.user.posts[index]) {
                const postToMove = window.user.posts.splice(index, 1)[0];
                window.user.trashBin = window.user.trashBin || [];
                window.user.trashBin.unshift(postToMove);
                postDiv.style.transition = 'transform 0.5s ease';
                postDiv.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    postDiv.remove();
                    window.addNotification('Post moved to trash, girly! 🗑️💕', true);
                    console.log('After moving to trash - posts:', window.user.posts.length, 'trashBin:', window.user.trashBin.length);
                    if (autoSaveEnabled) window.saveUserData();
                    window.updateUI();
                }, 500);
            } else {
                console.error('Post not found at index:', index);
                window.addNotification('Oops, can’t find that post, babe! 💔', false);
            }
        } catch (err) {
            console.error('Error in trash button handler:', err);
            window.addNotification('Oops, something broke! Can’t move to trash right now, babe! 💔', false);
        }
    });
    buttons.appendChild(trashButton);

    const shoutoutButton = document.createElement('button');
    shoutoutButton.className = 'shoutout-button';
    shoutoutButton.textContent = 'Give a Shoutout 📢';
    shoutoutButton.onclick = () => {
        if (window.accounts.length <= 1) {
            window.addNotification('You need another account to give a shoutout, sweetie! 💖', true);
            return;
        }
        window.showShoutoutModal(index);
    };
    buttons.appendChild(shoutoutButton);

    postDiv.appendChild(buttons);
    const commentCenter = document.createElement('div');
    commentCenter.className = 'comment-center';
    const commentList = document.createElement('div');
    commentList.className = 'comment-list';
    if (Array.isArray(post.comments)) {
        post.comments.forEach(comment => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${comment.username}:</strong> ${comment.comment}`;
            commentList.appendChild(p);
        });
    }
    commentCenter.appendChild(commentList);
    const commentInput = document.createElement('div');
    commentInput.className = 'comment-input';
    commentInput.innerHTML = `
        <input type="text" placeholder="Add a comment, girly!">
        <button onclick="window.addComment(${index}, this.previousElementSibling.value)">Post</button>
    `;
    commentCenter.appendChild(commentInput);
    postDiv.appendChild(commentCenter);
    feed.appendChild(postDiv);
    console.log('Post rendered at index:', index, 'likes:', post.likes);
};

window.renderNotifications = function() {
    const notifications = document.getElementById('notifications');
    if (Array.isArray(window.user.notifications)) {
        notifications.innerHTML = '';
        window.user.notifications.forEach(notif => {
            const div = document.createElement('div');
            div.className = 'notification';
            div.textContent = `${notif.timestamp} - ${notif.message}`;
            notifications.appendChild(div);
        });
    } else {
        window.user.notifications = [];
    }
};

window.renderLikes = function() {
    const likesFeed = document.getElementById('likesFeed');
    if (Array.isArray(window.user.posts)) {
        likesFeed.innerHTML = '';
        window.user.posts.forEach(post => {
            if (post.likes > 0) {
                const div = document.createElement('div');
                div.className = 'like-entry';
                div.textContent = `${post.caption || 'Image post'} got ${window.formatNumber(post.likes)} likes ❤️`;
                likesFeed.appendChild(div);
            }
        });
        if (!likesFeed.children.length) likesFeed.innerHTML = '<div class="like-entry">No likes yet, babe! 💖</div>';
    }
};

window.renderComments = function() {
    const commentsFeed = document.getElementById('commentsFeed');
    if (Array.isArray(window.user.posts)) {
        commentsFeed.innerHTML = '';
        window.user.posts.forEach(post => {
            if (Array.isArray(post.comments)) {
                post.comments.forEach(comment => {
                    const div = document.createElement('div');
                    div.className = 'comment-entry';
                    div.innerHTML = `<strong>${comment.username}:</strong> ${comment.comment} on ${post.caption || 'Image post'}`;
                    commentsFeed.appendChild(div);
                });
            }
        });
        if (!commentsFeed.children.length) commentsFeed.innerHTML = '<div class="comment-entry">No comments yet, girly! 💬</div>';
    }
};

window.renderGeneratedPosts = function() {
    const generatedFeed = document.getElementById('generatedFeed');
    if (generatedFeed && !document.getElementById('generatedAccountsTab').classList.contains('hidden')) {
        generatedFeed.innerHTML = '';
        Object.entries(window.generatedAccounts).forEach(([username, data]) => {
            if (Array.isArray(data.posts)) {
                data.posts.forEach((post, index) => window.renderGeneratedPost(post, index, username));
            }
        });
        if (!generatedFeed.children.length) generatedFeed.innerHTML = '<div class="post">No posts from generated accounts yet! 🌟</div>';
    }
};

window.renderProfileTab = function() {
    const profileTab = document.getElementById('profileTab');
    if (profileTab && !profileTab.classList.contains('hidden')) {
        document.getElementById('editUsername').value = window.user.username;
        document.getElementById('editProfilePicPreview').src = window.user.profilePic || '';
        document.getElementById('editProfilePicPreview').classList.toggle('hidden', !window.user.profilePic);
        document.getElementById('shoutoutStreak').textContent = window.shoutoutStreak;
    }
};

window.renderAIAccounts = function() {
    const aiAccountsFeed = document.getElementById('aiAccountsFeed');
    if (!aiAccountsFeed) return;
    aiAccountsFeed.innerHTML = '';
    if (Object.keys(window.generatedAccounts).length === 0) {
        aiAccountsFeed.innerHTML = '<div class="ai-account">No AI accounts yet! 🤖</div>';
        return;
    }
    Object.entries(window.generatedAccounts).forEach(([username, data]) => {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'ai-account';
        accountDiv.innerHTML = `
            <p><strong>${username}</strong></p>
            <p>Followers: ${window.formatNumber(data.followers.length)}</p>
            <p>Posts: ${data.posts.length}</p>
            <p>Followers List:</p>
            <ul>${data.followers.map(follower => `<li>${follower}</li>`).join('')}</ul>
        `;
        aiAccountsFeed.appendChild(accountDiv);
    });
};

window.renderMessages = function() {
    const messagesDiv = document.getElementById('messagesFeed');
    if (!messagesDiv) return;
    messagesDiv.innerHTML = '';
    if (window.messages.length === 0) {
        messagesDiv.innerHTML = '<div class="message">No messages yet, babe! 📩</div>';
        return;
    }
    window.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `<strong>${msg.sender}</strong> (${msg.timestamp}): ${msg.text}`;
        messagesDiv.appendChild(div);
    });
};

window.renderShopTab = function() {
    const shopTab = document.getElementById('shopTab');
    if (shopTab && !shopTab.classList.contains('hidden')) {
        document.getElementById('shopMoneyDisplay').textContent = window.formatNumber(window.user.money);
    }
};

window.renderGeneratedPost = function(post, index, username) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    if (post.isViral) postDiv.classList.add('viral');
    if (post.isSuperViral) postDiv.classList.add('super-viral');
    const usernameP = document.createElement('p');
    usernameP.innerHTML = `<strong>${username}</strong>`;
    postDiv.appendChild(usernameP);
    if (post.imageData) {
        const img = document.createElement('img');
        img.src = post.imageData;
        img.alt = 'Generated Post Image';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.onerror = () => img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABlSURBVGhD7dKxCcAwDATBXQj+JRzBEZwEO4PycAghhPBZxs52I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeWLgBRJUrX7R6fAAAAAASUVORK5CYII=';
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
    document.getElementById('generatedFeed').appendChild(postDiv);
};

// Post Interaction Functions
window.refreshPost = function(index) {
    if (!window.user || !Array.isArray(window.user.posts) || !window.user.posts[index]) {
        console.error('Invalid post or user in refreshPost, index:', index);
        window.addNotification('Oops, can’t refresh that post, babe! 💔');
        return;
    }
    const post = window.user.posts[index];
    const currentLikes = post.likes;
    const currentComments = post.comments ? [...post.comments] : [];
    const viralChance = Math.random();
    if (viralChance > 0.9 && !post.isViral) {
        post.isViral = true;
        const likeGain = Math.floor(window.user.followers * 0.1) + 50; // Ensure some likes even with 0 followers
        post.likes += likeGain;
        window.addNotification(`Your post went viral! +${window.formatNumber(likeGain)} likes 🌟`);
    } else if (viralChance > 0.95 && post.isViral && !post.isSuperViral) {
        post.isSuperViral = true;
        const likeGain = Math.floor(window.user.followers * 0.2) + 100;
        post.likes += likeGain;
        window.addNotification(`Super viral moment! +${window.formatNumber(likeGain)} likes 🚀`);
    } else {
        const likeGain = Math.floor(Math.random() * (window.user.followers * 0.01 + 10)) + 10; // Minimum 10 likes
        post.likes += likeGain;
        const newCommentsCount = Math.floor(Math.random() * 5) + 1; // At least 1 comment
        for (let i = 0; i < newCommentsCount; i++) {
            post.comments.push({
                username: window.generateRandomUsername(),
                comment: window.pickRandomComment()
            });
        }
        if (likeGain > 0 || newCommentsCount > 0) {
            window.addNotification(`Post got ${window.formatNumber(likeGain)} new likes and ${newCommentsCount} new comments! 💖`);
        }
    }
    if (post.likes !== currentLikes) document.getElementById(`likes-${index}`).textContent = `${window.formatNumber(post.likes)} likes`;
    if (post.comments.length !== currentComments.length) {
        document.getElementById(`comments-count-${index}`).textContent = `${window.formatNumber(post.comments.length)} comments`;
        const commentList = document.querySelector(`#feed .post:nth-child(${index + 1}) .comment-list`);
        if (commentList) {
            commentList.innerHTML = '';
            post.comments.forEach(comment => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${comment.username}:</strong> ${comment.comment}`;
                commentList.appendChild(p);
            });
        }
    }
    console.log('After refreshPost - post likes:', post.likes, 'comments:', post.comments.length, 'followers:', window.user.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.toggleLike = function(index) {
    if (!window.user || !Array.isArray(window.user.posts) || !window.user.posts[index]) {
        console.error('Invalid post or user in toggleLike, index:', index);
        window.addNotification('Oops, can’t like that post, babe! 💔');
        return;
    }
    const post = window.user.posts[index];
    if (post.liked) {
        post.likes--;
        post.liked = false;
    } else {
        post.likes++;
        post.liked = true;
    }
    document.getElementById(`likes-${index}`).textContent = `${window.formatNumber(post.likes)} likes`;
    const likeButton = document.querySelector(`#feed .post:nth-child(${index + 1}) .like-button`);
    if (likeButton) likeButton.classList.toggle('liked', post.liked);
    console.log('After toggleLike - post likes:', post.likes, 'liked:', post.liked, 'followers:', window.user.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.addComment = function(index, commentText) {
    if (!window.user || !Array.isArray(window.user.posts) || !window.user.posts[index]) {
        console.error('Invalid post or user in addComment, index:', index);
        window.addNotification('Oops, can’t comment on that post, babe! 💔');
        return;
    }
    if (!commentText.trim()) return;
    const post = window.user.posts[index];
    post.comments.push({
        username: window.user.username,
        comment: commentText
    });
    const commentList = document.querySelector(`#feed .post:nth-child(${index + 1}) .comment-list`);
    if (commentList) {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${window.user.username}:</strong> ${commentText}`;
        commentList.appendChild(p);
    }
    document.getElementById(`comments-count-${index}`).textContent = `${window.formatNumber(post.comments.length)} comments`;
    window.addNotification('Comment added, girly! 💬');
    console.log('After addComment - comments:', post.comments.length, 'followers:', window.user.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

// Growth and Engagement
window.startGrowthLoop = function() {
    if (window.growthLoopId) clearInterval(window.growthLoopId);
    window.growthLoopId = setInterval(() => {
        window.simulateEngagement();
        window.simulateGeneratedAccounts();
        window.simulateMessages();
        console.log('Growth loop triggered - followers:', window.user.followers);
    }, 15000); // Reduced to 15 seconds for faster testing
};

window.simulateEngagement = function(index) {
    if (!window.user || !Array.isArray(window.user.posts)) {
        console.error('No user or posts in simulateEngagement');
        return;
    }
    if (typeof index === 'number') {
        const post = window.user.posts[index];
        if (!post) {
            console.error('Invalid post index in simulateEngagement:', index);
            return;
        }
        let likeGain = Math.floor(Math.random() * (window.user.followers * (hasEngagementBoost ? 0.075 : 0.05) + 10)) + 10; // Minimum 10 likes
        const commentsCount = Math.floor(Math.random() * 5) + 1; // At least 1 comment
        if (window.user.followers >= 100000) likeGain += Math.floor(Math.random() * 1000);
        post.likes += likeGain;
        for (let i = 0; i < commentsCount; i++) {
            post.comments.push({
                username: window.generateRandomUsername(),
                comment: window.pickRandomComment()
            });
        }
        hasEngagementBoost = false;
        if (likeGain > 0 || commentsCount > 0) {
            window.addNotification(`Post got ${window.formatNumber(likeGain)} new likes and ${commentsCount} new comments! 💖`, true);
        }
        console.log('After simulateEngagement (single post) - post likes:', post.likes, 'comments:', post.comments.length, 'followers:', window.user.followers);
    } else {
        window.user.posts.slice(0, 5).forEach(post => {
            let likeGain = Math.floor(Math.random() * (window.user.followers * 0.01 + 5)) + 5; // Minimum 5 likes
            const commentsCount = Math.floor(Math.random() * 3) + 1; // At least 1 comment
            if (window.user.followers >= 100000) likeGain += Math.floor(Math.random() * 500);
            post.likes += likeGain;
            for (let i = 0; i < commentsCount; i++) {
                post.comments.push({
                    username: window.generateRandomUsername(),
                    comment: window.pickRandomComment()
                });
            }
        });
        console.log('After simulateEngagement (all posts) - total posts:', window.user.posts.length, 'followers:', window.user.followers);
    }
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.simulateGeneratedAccounts = function() {
    if (!window.generatedAccounts) window.generatedAccounts = {};
    const username = window.generateRandomUsername();
    if (!window.generatedAccounts[username]) {
        window.generatedAccounts[username] = {
            followers: window.generateFollowers(Math.floor(Math.random() * 50) + 10),
            posts: []
        };
    }
    const account = window.generatedAccounts[username];
    if (Math.random() > 0.5) {
        const captions = ['Slaying it!', 'Feeling cute!', 'Pink vibes!', 'Best life!', 'Sparkle time!'];
        const hashtags = ['#selfie', '#slay', '#cute', '#pink', '#glam'];
        const images = [
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVGhD7daxCYAwEETRZQv2P8kTsAQuQTuD8nAIIYTwWcbOdiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2f8A1g8UrX7R6fAAAAAASUVORK5CYII=',
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVGhD7daxCcAwEETRXQr2P8kTsAQuQTuD8nAIIYTwWcbOdiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2f8AyhIUrX7R6fAAAAAASUVORK5CYII='
        ];
        account.posts.push({
            likes: Math.floor(Math.random() * 100) + 10,
            comments: Array(Math.floor(Math.random() * 5)).fill().map(() => ({
                username: window.generateRandomUsername(),
                comment: window.pickRandomComment()
            })),
            isViral: Math.random() > 0.9,
            isSuperViral: Math.random() > 0.95,
            liked: false,
            caption: captions[Math.floor(Math.random() * captions.length)],
            hashtags: hashtags.sort(() => 0.5 - Math.random()).slice(0, 3),
            imageData: images[Math.floor(Math.random() * images.length)]
        });
        window.addNotification(`${username} posted something fab! Check it out! 🌟`, true);
        console.log('After simulateGeneratedAccounts - generated posts for', username, ':', account.posts.length);
    }
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.simulateMessages = function() {
    if (Math.random() > 0.7) {
        const sender = window.generateRandomUsername();
        const messages = ['Hey girly, love your vibe! 💖', 'Can we collab? ✨', 'You’re slaying it! 😍'];
        window.messages.push({
            sender: sender,
            text: messages[Math.floor(Math.random() * messages.length)],
            timestamp: new Date().toLocaleTimeString()
        });
        window.addNotification(`New message from ${sender}! 📩`, true);
        console.log('After simulateMessages - messages:', window.messages.length);
    }
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.simulateInitialFollowers = function() {
    const initialFollowers = Math.floor(Math.random() * 10) + 5;
    window.user.followers += initialFollowers;
    window.addNotification(`Starting with ${window.formatNumber(initialFollowers)} followers! Let’s grow, babe! 🌟`);
    console.log('After simulateInitialFollowers - followers:', window.user.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.simulateOfflineGrowth = function() {
    if (!window.user || !window.user.lastActive) {
        console.warn('No user or lastActive in simulateOfflineGrowth');
        return;
    }
    const now = Date.now();
    const timeAway = (now - window.user.lastActive) / 1000;
    const hoursAway = timeAway / 3600;
    const followerGain = Math.floor(hoursAway * (window.user.followers * 0.01 + 5));
    if (followerGain > 0) {
        window.user.followers += followerGain;
        window.addNotification(`While you were away, you gained ${window.formatNumber(followerGain)} followers! 🌟`);
        console.log('After simulateOfflineGrowth - followers:', window.user.followers);
    }
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.showShoutoutModal = function(postIndex) {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.style.display = 'block';
    const content = document.createElement('div');
    content.className = 'admin-content';
    content.innerHTML = `
        <h2>Give a Shoutout, Queen! 📣</h2>
        <select id="shoutoutAccountSelect">
            ${window.accounts
                .map((account, index) => `<option value="${index}">${account.username}</option>`)
                .filter((_, index) => index !== window.currentAccountIndex)
                .join('')}
        </select>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button onclick="window.giveAccountShoutout(${postIndex}, document.getElementById('shoutoutAccountSelect').value); this.closest('.admin-modal').remove()" style="background: #ff69b4;">Shoutout! ✨</button>
            <button onclick="this.closest('.admin-modal').remove()" style="background: #ffb6c1;">Cancel 👋</button>
        </div>
    `;
    modal.appendChild(content);
    document.body.appendChild(modal);
};

window.giveAccountShoutout = function(postIndex, accountIndex) {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    if (now - window.lastShoutoutTime < oneHour) {
        window.addNotification('Wait an hour between shoutouts, babe! ⏳', true);
        return;
    }
    if (window.user.followers < 2000) {
        window.addNotification('Need 2K followers for shoutouts, queen! 📣', true);
        return;
    }
    const targetAccount = window.accounts[accountIndex];
    if (!targetAccount) {
        window.addNotification('Oops, can’t find that account, babe! 💔', true);
        return;
    }
    const post = window.user.posts[postIndex];
    if (!post) {
        window.addNotification('Oops, can’t find that post, babe! 💔', true);
        return;
    }
    const followerGain = Math.floor(Math.random() * 100) + 50 + (window.shoutoutStreak * 10);
    window.user.followers += followerGain;
    targetAccount.followers += Math.floor(followerGain * 0.5);
    window.shoutoutStreak++;
    window.lastShoutoutTime = now;
    post.shoutout = targetAccount.username;
    window.addNotification(`Shoutout to ${targetAccount.username}! +${window.formatNumber(followerGain)} followers for you, +${window.formatNumber(Math.floor(followerGain * 0.5))} for them! Streak: ${window.shoutoutStreak} 📣`, true);
    console.log('After giveAccountShoutout - followers:', window.user.followers, 'target followers:', targetAccount.followers);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.closeSelfieSnap = function() {
    console.log('closeSelfieSnap called');
};

console.log('game.js loaded');
