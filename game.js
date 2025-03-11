console.log('game.js starting, Sophia! 💕');

// Game Feature Functions
window.refreshFollowers = function() {
    window.simulateOfflineGrowth();
    window.calculateMoneyFromLikes();
    window.addNotification('Refreshed your followers, Sophia! ✨');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.shareProfile = function() {
    const followerGain = window.user.followers >= 100000 ? 
        Math.floor(Math.random() * 1000) + 500 : 
        Math.floor(Math.random() * 20) + 5;
    window.user.followers += followerGain;
    window.addNotification(`Shared your profile, Sophia! Gained ${window.formatNumber(followerGain)} followers! 📲`);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.liveStream = function() {
    const viewers = window.user.followers >= 100000 ? 
        Math.floor(Math.random() * 50000) + 10000 : 
        Math.floor(Math.random() * 500) + 50;
    const followerGain = Math.floor(viewers * 0.05);
    window.user.followers += followerGain;
    window.addNotification(`Went live with ${window.formatNumber(viewers)} viewers, Sophia! Gained ${window.formatNumber(followerGain)} followers! 🎥`);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.getSponsored = function() {
    if (!window.user.sponsored && window.user.followers >= 5000) {
        window.user.sponsored = true;
        const earnings = Math.floor(window.user.followers * 0.02);
        window.user.money += earnings;
        window.addNotification(`Sponsor deal, Sophia! Earned $${window.formatNumber(earnings)}! 💰`);
    } else if (window.user.sponsored) {
        window.addNotification('Already sponsored, my pink queen! 💅');
    } else {
        window.addNotification('Need 5K followers for a sponsor deal, Sophia! 🌟');
    }
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.hostEvent = function() {
    if (!window.user.eventHosted && window.user.followers >= 10000) {
        window.user.eventHosted = true;
        const attendees = Math.floor(window.user.followers * 0.1);
        window.user.followers += Math.floor(attendees * 0.2);
        window.addNotification(`Hosted an event with ${window.formatNumber(attendees)} besties, Sophia! 🎉`);
    } else if (window.user.eventHosted) {
        window.addNotification('Already hosted an event, girly! 🎈');
    } else {
        window.addNotification('Reach 10K followers to host an event, Sophia! 💖');
    }
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.giveShoutout = function() {
    if (window.user.followers < 2000) {
        window.addNotification('Need 2K followers for shoutouts, Sophia! 📣');
        return;
    }
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    if (now - window.lastShoutoutTime < oneHour) {
        window.addNotification('Wait an hour between shoutouts, Sophia! ⏳');
        return;
    }
    const generatedAccountNames = Object.keys(window.generatedAccounts);
    if (generatedAccountNames.length === 0) {
        window.addNotification('No generated accounts to shoutout yet, Sophia! 🌟');
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
    window.addNotification(`Shoutout to ${shoutoutAccount}, Sophia! +${window.formatNumber(followerGain)} followers & +10 loyalty! Streak: ${window.shoutoutStreak} 📣`);
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
    window.addNotification(window.paranoidMode ? 'Paranoid mode on, Sophia! 👻' : 'Back to glam, Sophia! 💖');
    if (window.paranoidMode) {
        window.user.followers += Math.floor(Math.random() * 50);
        window.addNotification('Spooky followers joined, my pink cyan queen! 🌙');
    }
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

// Posting Functions
window.generatePost = function(silent = false) {
    console.log('Generate Post clicked, Sophia!');
    let lastPostTime = window.lastGeneratePostTime || 0;
    const now = Date.now();
    const cooldown = 800;

    if (now - lastPostTime < cooldown) {
        console.log('Cooldown active, skipping post. Time left:', (cooldown - (now - lastPostTime)) / 1000, 'seconds');
        window.addNotification('Slow down, Sophia! Wait a sec to post again! ⏳', false);
        return;
    }

    console.log('Posting now, girly!');
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
    if (!silent) window.addNotification('Posted something fab, Sophia! 📸');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
    if (window.debugLikes) console.log('Post created with likes:', window.user.posts[0].likes);
};

window.toggleManualPost = function() {
    const manualPostSection = document.getElementById('manualPostSection');
    if (manualPostSection) {
        manualPostSection.classList.toggle('hidden');
    } else {
        console.error('No manualPostSection found, Sophia!');
    }
};

window.createManualPost = function() {
    const now = Date.now();
    const cooldown = 800;
    if (now - lastManualPostTime < cooldown) {
        window.addNotification('Hold up, Sophia! Wait a sec to post again! ⏳', false);
        return;
    }
    lastManualPostTime = now;

    const imageInput = document.getElementById('imageInput');
    const captionInput = document.getElementById('captionInput');
    const caption = captionInput.value.trim();
    const file = imageInput.files[0];
    if (!file && !caption) {
        alert('Add a pic or caption, Sophia my princess!');
        return;
    }
    if (file && file.size > 1 * 1024 * 1024) {
        alert('Pic too big, keep it under 1MB, Sophia!');
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
            window.addNotification('Posted your custom pic, Sophia! 📸');
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
        window.addNotification('Posted your caption, Sophia! 💬');
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
    if (earnings > 0) window.addNotification(`Earned $${window.formatNumber(earnings)} from ${window.formatNumber(totalLikes)} likes, Sophia! 💸`);
};

window.buyFollowerBoost = function() {
    if (window.user.money < 200) {
        window.addNotification('Not enough money, Sophia! 💸');
        return;
    }
    window.user.money -= 200;
    window.user.followers += 500;
    window.addNotification('Bought a Follower Boost, Sophia! +500 followers! 🌟');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.buyEngagementBoost = function() {
    if (window.user.money < 100) {
        window.addNotification('Not enough money, Sophia! 💸');
        return;
    }
    if (hasEngagementBoost) {
        window.addNotification('Engagement Boost already active, Sophia! 📈');
        return;
    }
    window.user.money -= 100;
    hasEngagementBoost = true;
    window.addNotification('Bought an Engagement Boost, Sophia! Next post gets 50% more likes! 📈');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.buyProfileGlitter = function() {
    if (window.user.money < 50) {
        window.addNotification('Not enough money, Sophia! 💸');
        return;
    }
    if (hasProfileGlitter) {
        window.addNotification('Your profile already glitters, Sophia! ✨');
        return;
    }
    window.user.money -= 50;
    hasProfileGlitter = true;
    window.addNotification('Bought Profile Glitter, my pink cyan queen! Your username sparkles! ✨');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.previewEditProfilePic = function(event) {
    const file = event.target.files[0];
    if (file && file.size <= 1 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('editProfilePicPreview');
            if (preview) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            } else {
                console.error('No editProfilePicPreview found, Sophia!');
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Pic too big, keep it under 1MB, Sophia!');
    }
};

window.saveProfileChanges = function() {
    const newUsername = document.getElementById('editUsername').value.trim();
    const profilePicInput = document.getElementById('editProfilePicInput');
    const profilePic = profilePicInput.files[0];
    if (!newUsername) {
        alert('Need a cute username, Sophia!');
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
    window.addNotification('Profile updated, Sophia! Slay, princess! 💖');
    if (autoSaveEnabled) window.saveUserData();
    const profilePicInput = document.getElementById('editProfilePicInput');
    const preview = document.getElementById('editProfilePicPreview');
    if (profilePicInput) profilePicInput.value = '';
    if (preview) preview.classList.add('hidden');
    window.updateUI();
};

// Post Interaction Functions
window.refreshPost = function(index) {
    const post = window.user.posts[index];
    const currentLikes = post.likes;
    const currentComments = post.comments ? [...post.comments] : [];
    const viralChance = Math.random();
    if (viralChance < 0.05 && window.user.followers > 100 && !post.isSuperViral) {
        post.isSuperViral = true;
        window.addNotification('SUPER VIRAL post on refresh, Sophia! 🌟✨');
    } else if (viralChance < 0.25 && !post.isViral && !post.isSuperViral) {
        post.isViral = true;
        window.addNotification('VIRAL post on refresh, Sophia! 🌸');
    }
    window.user.followers += Math.floor(currentLikes * 0.02);
    post.likes = currentLikes;
    post.comments = currentComments;
    window.checkStatus();
    window.addNotification('Refreshed your post, Sophia! ✨');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.addComment = function(index, commentText) {
    if (!commentText.trim()) {
        alert('Type something cute, Sophia!');
        return;
    }
    if (!Array.isArray(window.user.posts[index].comments)) window.user.posts[index].comments = [];
    window.user.posts[index].comments.push({ username: window.user.username, comment: commentText.trim() });
    window.addNotification('Added your comment, Sophia! 💬');
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

window.toggleLike = function(index) {
    window.user.posts[index].liked = !window.user.posts[index].liked;
    window.user.posts[index].likes += window.user.posts[index].liked ? 1 : -1;
    window.addNotification(`You ${window.user.posts[index].liked ? 'liked' : 'unliked'} your post, Sophia! ❤️`);
    if (autoSaveEnabled) window.saveUserData();
    window.updateUI();
};

console.log('game.js loaded for Sophia, my pink cyan princess! 💕');
