console.log('game-simulate.js starting, Sophia! 💕');

// Growth and Simulation Functions
window.simulateEngagement = function(index) {
    if (!window.user || !Array.isArray(window.user.posts) || index >= window.user.posts.length) {
        console.log('Error: No user or invalid post index in simulateEngagement, Sophia!');
        return;
    }

    const followerCount = window.user.followers || 0;
    const hashtagBoost = window.user.posts[index].hashtags.length;
    let likes, commentCount;

    if (followerCount >= 100000) {
        likes = Math.floor(Math.random() * 15000) + 5000 + Math.floor(followerCount * 0.05);
        commentCount = Math.floor(likes * 0.00005);
    } else if (followerCount >= 10000) {
        likes = Math.floor(Math.random() * 4500) + 500 + Math.floor(followerCount * 0.03);
        commentCount = Math.floor(likes * 0.00005);
    } else {
        likes = Math.floor(Math.random() * 480) + 20 + Math.floor(followerCount * 0.02);
        commentCount = Math.floor(likes * 0.00005);
    }

    likes = Math.max(Math.floor(likes * (1 + hashtagBoost * 0.1)), 10);
    if (hasEngagementBoost) {
        likes = Math.floor(likes * 1.5);
        hasEngagementBoost = false;
        window.addNotification('Engagement Boost applied, Sophia! Likes increased! 📈');
    }

    window.user.posts[index].likes = likes;
    if (window.debugLikes) console.log(`Simulated engagement for post ${index}: ${likes} likes, ${commentCount} comments`);

    commentCount = Math.min(commentCount, 5);
    for (let i = 0; i < commentCount; i++) {
        const username = window.generateRandomUsername();
        if (!Array.isArray(window.user.posts[index].comments)) window.user.posts[index].comments = [];
        window.user.posts[index].comments.push({
            username: username,
            comment: window.pickRandomComment()
        });
        if (i === 0) window.simulateGeneratedPost(username);
    }

    const viralChance = Math.random();
    if (viralChance < 0.03 && !window.user.posts[index].isSuperViral && followerCount > 100) {
        window.user.posts[index].isSuperViral = true;
        window.addNotification('SUPER VIRAL post, Sophia! 🌟✨');
    } else if (viralChance < 0.15 && !window.user.posts[index].isViral) {
        window.user.posts[index].isViral = true;
        window.addNotification('VIRAL post, Sophia! 🌸');
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
        imageData: images[Math.floor(Math.random() * images.length)],
        timestamp: Date.now()
    };
    if (!Array.isArray(window.generatedAccounts[username].posts)) window.generatedAccounts[username].posts = [];
    window.generatedAccounts[username].posts.unshift(post);
    if (window.generatedAccounts[username].posts.length > 3) window.generatedAccounts[username].posts.pop();
    if (autoSaveEnabled) window.saveUserData();
};

window.startGrowthLoop = function() {
    if (window.growthLoopId) clearInterval(window.growthLoopId);
    window.growthLoopId = null;

    window.growthLoopId = setInterval(() => {
        if (!window.user) return;
        const followerCount = window.user.followers || 0;
        let followerGrowth;
        if (followerCount >= 1000000) {
            followerGrowth = Math.floor(Math.random() * 5000) + 5000;
        } else if (followerCount >= 100000) {
            followerGrowth = Math.floor(Math.random() * 1500) + 500;
        } else if (followerCount >= 10000) {
            followerGrowth = Math.floor(Math.random() * 450) + 50;
        } else {
            followerGrowth = Math.floor(Math.random() * 10) + 1;
        }
        window.user.followers += followerGrowth;
        window.checkStatus();
        console.log('Followers increased to:', window.user.followers);
        if (autoSaveEnabled) window.saveUserData();

        if (!window.user || !Array.isArray(window.user.posts)) return;
        const maxPostsToUpdate = Math.min(window.user.posts.length, 1);
        let totalLikesAdded = 0;
        for (let i = 0; i < maxPostsToUpdate; i++) {
            const post = window.user.posts[i];
            const likeGrowth = followerCount >= 1000000 ? 
                Math.floor(Math.random() * 1000) + 500 : 
                followerCount >= 100000 ? 
                Math.floor(Math.random() * 500) + 200 : 
                followerCount >= 10000 ? 
                Math.floor(Math.random() * 50) + 20 : 
                Math.floor(Math.random() * 5) + 1;
            post.likes += likeGrowth;
            totalLikesAdded += likeGrowth;
            if (Math.random() < 0.05) {
                const username = window.generateRandomUsername();
                if (!Array.isArray(post.comments)) post.comments = [];
                post.comments.push({
                    username: username,
                    comment: window.pickRandomComment()
                });
                window.simulateGeneratedPost(username);
            }
        }
        window.checkStatus();
        console.log('Likes increased by:', totalLikesAdded);
        if (autoSaveEnabled) window.saveUserData();
        window.updateUI();
    }, 3000); // Runs every 3 seconds
};

console.log('game-simulate.js loaded for Sophia, my pink cyan princess! 💕');
