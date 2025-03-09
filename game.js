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

// Ensure addNotification matches script.js format
window.addNotification = function(message, skipSave = true) {
    if (!window.user) return;
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
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

// Game Feature Functions
window.refreshFollowers = function() {
    window.simulateOfflineGrowth();
    window.calculateMoneyFromLikes();
    window.addNotification('Refreshed your followers, babe! ✨');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.shareProfile = function() {
    const followerGain = window.user.followers >= 100000 ? 
        Math.floor(Math.random() * 1000) + 500 : 
        Math.floor(Math.random() * 20) + 5;
    window.user.followers += followerGain;
    window.addNotification(`Shared your profile! Gained ${window.formatNumber(followerGain)} followers! 📲`);
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
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

// Existing giveShoutout for generated accounts
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
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.toggleParanoidMode = function() {
    window.paranoidMode = !window.paranoidMode;
    document.body.classList.toggle('paranoid-mode', window.paranoidMode);
    window.addNotification(window.paranoidMode ? 'Paranoid mode on! 👻' : 'Back to glam! 💖');
    if (window.paranoidMode) {
        window.user.followers += Math.floor(Math.random() * 50);
        window.addNotification('Spooky followers joined! 🌙');
    }
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
    window.user.posts.unshift(post);
    window.simulateEngagement(0);
    if (!silent) window.addNotification('Generated a fab post! 🌟');
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
            window.user.posts.unshift(post);
            window.simulateEngagement(0);
            if (autoSaveEnabled) window.saveUserData();
            imageInput.value = '';
            captionInput.value = '';
            window.toggleManualPost();
            window.updateUI();
        };
        reader.readAsDataURL(file);
    } else {
        window.user.posts.unshift(post);
        window.simulateEngagement(0);
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
};

window.buyFollowerBoost = function() {
    if (window.user.money < 200) {
        window.addNotification('Not enough money, babe! 💸');
        return;
    }
    window.user.money -= 200;
    window.user.followers += 500;
    window.addNotification('Bought a Follower Boost! +500 followers! 🌟');
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
    // Check for duplicate usernames (excluding the current user)
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
    console.log('Rendering posts:', postsToShow.length);
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
    console.log('Rendering post at index:', index);
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
    console.log('Attaching onclick to trash button for index:', index);
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

    // Add Shoutout Button for Other Accounts
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
    console.log('Post rendered at index:', index);
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
    const post = window.user.posts[index];
    const currentLikes = post.likes;
    const currentComments = post.comments ? [...post.comments] : [];
    const viralChance = Math.random();
    if (viralChance < 0.05 && window.user.followers > 100 && !post.isSuperViral) {
        post.isSuperViral = true;
        window.addNotification('SUPER VIRAL post on refresh! 🌟✨');
    } else if (viralChance < 0.25 && !post.isViral && !post.isSuperViral) {
        post.isViral = true;
        window.addNotification('VIRAL post on refresh! 🌸');
    }
    window.user.followers += Math.floor(currentLikes * 0.02);
    post.likes = currentLikes;
    post.comments = currentComments;
    window.checkStatus();
    window.addNotification('Refreshed your post! ✨');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.addComment = function(index, commentText) {
    if (!commentText.trim()) {
        alert('Type something cute, babe!');
        return;
    }
    if (!Array.isArray(window.user.posts[index].comments)) window.user.posts[index].comments = [];
    window.user.posts[index].comments.push({ username: window.user.username, comment: commentText.trim() });
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.toggleLike = function(index) {
    window.user.posts[index].liked = !window.user.posts[index].liked;
    window.user.posts[index].likes += window.user.posts[index].liked ? 1 : -1;
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

// Growth and Simulation Functions
window.simulateEngagement = function(index) {
    if (!window.user || !Array.isArray(window.user.posts) || index >= window.user.posts.length) {
        console.log('Error: No user or invalid post index in simulateEngagement');
        return;
    }

    const followerCount = window.user.followers || 0;
    const hashtagBoost = window.user.posts[index].hashtags.length;
    let likes, commentCount;

    if (followerCount >= 100000) {
        likes = Math.floor(Math.random() * 15000) + 5000 + Math.floor(followerCount * 0.05);
        commentCount = Math.floor(likes * 0.0001); // Reduced to 0.01% to fix lag
        if (Math.random() < 0.1) {
            likes *= 2;
            commentCount *= 2;
            window.user.posts[index].isSuperViral = true;
            window.addNotification('SUPER VIRAL post! 🌟✨');
        } else if (Math.random() < 0.3) {
            likes *= 1.5;
            commentCount *= 1.5;
            window.user.posts[index].isViral = true;
            window.addNotification('VIRAL post! 🌸');
        }
    } else if (followerCount >= 10000) {
        likes = Math.floor(Math.random() * 4500) + 500 + Math.floor(followerCount * 0.03);
        commentCount = Math.floor(likes * 0.0001); // Reduced to 0.01% to fix lag
        if (Math.random() < 0.05) {
            likes *= 2;
            commentCount *= 2;
            window.user.posts[index].isSuperViral = true;
            window.addNotification('SUPER VIRAL post! 🌟✨');
        } else if (Math.random() < 0.2) {
            likes *= 1.5;
            window.user.posts[index].isViral = true;
            window.addNotification('VIRAL post! 🌸');
        }
    } else {
        likes = Math.floor(Math.random() * 480) + 20 + Math.floor(followerCount * 0.02);
        commentCount = Math.floor(likes * 0.0001); // Reduced to 0.01% to fix lag
        if (Math.random() < 0.03) {
            likes *= 2;
            window.user.posts[index].isSuperViral = true;
            window.addNotification('SUPER VIRAL post! 🌟✨');
        } else if (Math.random() < 0.15) {
            likes *= 1.5;
            window.user.posts[index].isViral = true;
            window.addNotification('VIRAL post! 🌸');
        }
    }

    likes = Math.max(Math.floor(likes * (1 + hashtagBoost * 0.1)), 10);
    if (hasEngagementBoost) {
        likes = Math.floor(likes * 1.5);
        hasEngagementBoost = false;
        window.addNotification('Engagement Boost applied! Likes increased! 📈');
    }

    window.user.posts[index].likes = likes;
    if (window.debugLikes) console.log(`Simulated engagement for post ${index}: ${likes} likes, ${commentCount} comments`);

    for (let i = 0; i < commentCount; i++) {
        const username = window.generateRandomUsername();
        if (!Array.isArray(window.user.posts[index].comments)) window.user.posts[index].comments = [];
        window.user.posts[index].comments.push({
            username: username,
            comment: window.pickRandomComment()
        });
        window.simulateGeneratedPost(username);
    }
    window.user.followers += Math.floor(likes * 0.02);
    window.checkStatus();
};

window.simulateGeneratedPost = function(username) {
    if (!window.generatedAccounts) {
        window.generatedAccounts = {};
    }
    if (!window.generatedAccounts[username]) {
        window.generatedAccounts[username] = {
            posts: [],
            followers: window.generateFollowers(Math.floor(Math.random() * 20) + 5)
        };
    }
    const captions = ['Living my best life!', 'So fab!', 'Chasing dreams!', 'Glow up!', 'Vibes only!'];
    const hashtags = ['#queen', '#glam', '#yolo', '#sparkle', '#bestie'];
    const images = [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVGhD7daxCYAwEETRZQv2P8kTsAQuQTuD8nAIIYTwWcbOdiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2f8A1g8UrX7R6fAAAAAASUVORK5CYII=',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVGhD7daxCcAwEETRXQr2P8kTsAQuQTuD8nAIIYTwWcbOdiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2V/WrjYjzAl54hHZX9auNiPMCXniEdlf1q42I8wJeeIR2f8AyhIUrX7R6fAAAAAASUVORK5CYII='
    ];
    const post = {
        likes: Math.floor(Math.random() * 50) + 5,
        comments: Array(Math.floor(Math.random() * 3)).fill().map(() => ({
            username: window.generateRandomUsername(),
            comment: window.pickRandomComment()
        })),
        isViral: Math.random() < 0.05,
        isSuperViral: Math.random() < 0.02,
        caption: captions[Math.floor(Math.random() * captions.length)],
        hashtags: hashtags.sort(() => 0.5 - Math.random()).slice(0, 2),
        imageData: images[Math.floor(Math.random() * images.length)]
    };
    if (!Array.isArray(window.generatedAccounts[username].posts)) window.generatedAccounts[username].posts = [];
    window.generatedAccounts[username].posts.unshift(post);
    if (window.generatedAccounts[username].posts.length > 3) window.generatedAccounts[username].posts.pop();
    if (autoSaveEnabled) window.saveUserData();
};

window.startGrowthLoop = function() {
    if (window.growthLoopId) clearInterval(window.growthLoopId);
    window.growthLoopId = setInterval(() => {
        if (!window.user) return;
        const followerCount = window.user.followers || 0; // Ensure followerCount is defined
        let followerGrowth;
        if (followerCount >= 1000000) {
            followerGrowth = Math.floor(Math.random() * 5000) + 5000; // 5,000–10,000 followers
        } else if (followerCount >= 100000) {
            followerGrowth = Math.floor(Math.random() * 1500) + 500; // 500–2,000 followers
        } else if (followerCount >= 10000) {
            followerGrowth = Math.floor(Math.random() * 450) + 50; // 50–500 followers
        } else {
            followerGrowth = Math.floor(Math.random() * 10) + 1; // 1–10 followers
        }
        window.user.followers += followerGrowth;
        if (Array.isArray(window.user.posts)) {
            const maxPostsToUpdate = Math.min(window.user.posts.length, 3);
            for (let i = 0; i < maxPostsToUpdate; i++) {
                const post = window.user.posts[i];
                const likeGrowth = followerCount >= 1000000 ? 
                    Math.floor(Math.random() * 1000) + 500 : // 500–1,500 likes for millions
                    followerCount >= 100000 ? 
                    Math.floor(Math.random() * 500) + 200 : // 200–700 likes
                    followerCount >= 10000 ? 
                    Math.floor(Math.random() * 50) + 20 : // 20–70 likes
                    Math.floor(Math.random() * 5) + 1; // 1–6 likes
                post.likes += likeGrowth;
                if (Math.random() < 0.1) {
                    const username = window.generateRandomUsername();
                    if (!Array.isArray(post.comments)) post.comments = [];
                    post.comments.push({
                        username: username,
                        comment: window.pickRandomComment()
                    });
                    window.simulateGeneratedPost(username);
                }
            }
        }
        window.checkStatus();
        if (autoSaveEnabled) window.saveUserData();
        window.updateUI();
    }, 2000); // Fixed interval at 2 seconds to avoid overlap issues
};

window.simulateOfflineGrowth = function() {
    if (!window.user) return;
    const now = Date.now();
    const timeElapsed = Math.floor((now - (window.user.lastActive || now)) / 1000);
    if (timeElapsed <= 0) return;
    window.user.followers = Number(window.user.followers) || 0;
    const followerCount = window.user.followers;
    let offlineFollowerGrowth = followerCount >= 1000000 ? 
        Math.min(Math.floor(timeElapsed * 10), 1000000) : // Up to 1M for millions
        followerCount >= 100000 ? 
        Math.min(Math.floor(timeElapsed * 2), 50000) : 
        followerCount >= 10000 ? 
        Math.min(Math.floor(timeElapsed * 0.5), 5000) : 
        Math.min(Math.floor(timeElapsed * 0.01), 200);
    window.user.followers += offlineFollowerGrowth;
    if (!Array.isArray(window.user.posts)) window.user.posts = [];
    const maxPostsToUpdate = Math.min(window.user.posts.length, 3);
    for (let i = 0; i < maxPostsToUpdate; i++) {
        const post = window.user.posts[i];
        post.likes = Number(post.likes) || 0;
        if (!Array.isArray(post.comments)) post.comments = [];
        let offlineLikes = followerCount >= 1000000 ? 
            Math.floor(timeElapsed * 10) : // 10 likes per second for millions
            followerCount >= 100000 ? 
            Math.floor(timeElapsed * 5) : 
            followerCount >= 10000 ? 
            Math.floor(timeElapsed * 0.5) : 
            Math.floor(timeElapsed * 0.005);
        post.likes += offlineLikes;
        const commentGrowth = Math.min(Math.floor(offlineLikes * 0.0001), 10); // 0.01% of likes, capped at 10
        for (let j = 0; j < commentGrowth; j++) {
            const username = window.generateRandomUsername();
            post.comments.push({
                username: username,
                comment: window.pickRandomComment()
            });
            window.simulateGeneratedPost(username);
        }
    }
    window.user.lastActive = now;
    window.checkStatus();
};

window.checkStatus = function() {
    if (window.user.followers >= 100000 && !window.user.verified) {
        window.user.verified = true;
        window.addNotification('You’re VERIFIED! ✔️');
    }
    if (window.user.followers >= 500000 && !window.user.famous) {
        window.user.famous = true;
        window.addNotification('You’re FAMOUS! 🌟');
    }
};

// Updated Shoutout Functions for Other Accounts
window.showShoutoutModal = function(postIndex) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'shoutoutModal';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <h3>Select an Account to Shoutout, Princess! 📢</h3>
        <div id="accountSelectList"></div>
        <button onclick="document.getElementById('shoutoutModal').remove()">Cancel 💔</button>
    `;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const accountList = document.getElementById('accountSelectList');
    window.accounts.forEach((account, index) => {
        if (index === window.currentAccountIndex) return; // Skip the current account
        const accountDiv = document.createElement('div');
        accountDiv.style.margin = '5px 0';
        accountDiv.innerHTML = `
            <span>${account.username} (Followers: ${window.formatNumber(account.followers)})</span>
            <button onclick="window.confirmShoutout(${postIndex}, '${account.id}')" style="background: #ff99cc; margin-left: 10px;">Shoutout 🌟</button>
        `;
        accountList.appendChild(accountDiv);
    });
};

window.confirmShoutout = function(postIndex, accountId) {
    console.log('Confirming shoutout to account ID:', accountId, 'for post index:', postIndex);

    // Find the target account by ID
    const accountIndex = window.accounts.findIndex(account => account.id === accountId);
    if (accountIndex === -1) {
        console.error('Invalid account ID:', accountId);
        window.addNotification('Oops, couldn’t find that account, babe! 😕', true);
        document.getElementById('shoutoutModal').remove();
        return;
    }

    // Validate post index
    const originalPost = window.user.posts[postIndex];
    if (!originalPost) {
        console.error('Invalid post index:', postIndex);
        window.addNotification('Select a valid post, queen! 📸', true);
        document.getElementById('shoutoutModal').remove();
        return;
    }

    const shoutedAccount = window.accounts[accountIndex];
    const now = Date.now();

    // Create shoutout post
    const shoutoutPost = {
        likes: 0,
        comments: [],
        isViral: false,
        isSuperViral: false,
        liked: false,
        caption: `Big shoutout to my bestie @${shoutedAccount.username}! Go show them some love! 💕 #ShoutoutSunday`,
        hashtags: ['#ShoutoutSunday', `#${shoutedAccount.username}`],
        imageData: originalPost.imageData || '',
        timestamp: Date.now()
    };
    window.user.posts.unshift(shoutoutPost);
    window.addNotification(`Shouted out to @${shoutedAccount.username}! Let’s spread the love! 📢`, true);

    // Simulate realistic engagement on the shoutout post based on the shoutout giver's followers
    const giverFollowers = window.user.followers || 0;
    let initialLikes = Math.floor(giverFollowers * 0.05); // 5% of followers like the post
    let initialComments = Math.floor(initialLikes * 0.0001); // Reduced to 0.01% to fix lag
    shoutoutPost.likes = initialLikes;
    for (let i = 0; i < initialComments; i++) {
        const username = window.generateRandomUsername();
        shoutoutPost.comments.push({
            username: username,
            comment: window.pickRandomComment()
        });
    }

    // Calculate follower boost based on the shoutout giver's followers
    const totalFollowerBoost = Math.floor(giverFollowers * 0.25); // 25% of giver's followers, no cap
    let followersAdded = 0;

    // Simulate follower growth over time (e.g., over 10 seconds)
    const increment = Math.ceil(totalFollowerBoost / 5); // Add followers in 5 increments
    let intervals = 0;
    const growthInterval = setInterval(() => {
        if (intervals >= 5 || followersAdded >= totalFollowerBoost) {
            clearInterval(growthInterval);
            console.log(`Final follower boost for ${shoutedAccount.username}: ${followersAdded} followers. Total: ${shoutedAccount.followers}`);
            return;
        }
        const followersToAdd = Math.min(increment, totalFollowerBoost - followersAdded);
        shoutedAccount.followers += followersToAdd;
        followersAdded += followersToAdd;
        console.log(`Added ${followersToAdd} followers to ${shoutedAccount.username}. Current total: ${shoutedAccount.followers}`);
        if (intervals === 4 || followersAdded >= totalFollowerBoost) {
            window.addNotification(`@${shoutedAccount.username} gained ${window.formatNumber(followersAdded)} new followers from your shoutout! 🌟`, true);
            // Add notification to the target account
            if (!Array.isArray(shoutedAccount.notifications)) {
                shoutedAccount.notifications = [];
            }
            shoutedAccount.notifications.unshift({
                id: Date.now(),
                message: `@${window.user.username} shouted you out and you gained ${window.formatNumber(followersAdded)} followers! 🎉`,
                timestamp: new Date().toLocaleTimeString()
            });
        }
        if (autoSaveEnabled) window.saveUserData();
        window.updateUI();
        intervals++;
    }, 2000); // Add followers every 2 seconds

    // Increment shoutout streak if within 24 hours
    if (now - window.lastShoutoutTime < 24 * 60 * 60 * 1000) {
        window.shoutoutStreak = (window.shoutoutStreak || 0) + 1;
    } else {
        window.shoutoutStreak = 1;
    }
    window.lastShoutoutTime = now;

    // Save and update
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();

    document.getElementById('shoutoutModal').remove();
};

// Initialization
if (window.user) {
    window.simulateOfflineGrowth();
    window.startGrowthLoop();
    if (window.paranoidMode) window.toggleParanoidMode();
    if (window.user.theme) document.body.classList.add(`${window.user.theme}-theme`);
    document.getElementById('sortButton').textContent = 'Sort by Highest ↓';
}

console.log('game.js loaded');
