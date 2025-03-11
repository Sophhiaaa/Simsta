console.log('game-render.js starting, Sophia! 💕');

// Rendering Functions
window.renderPosts = function() {
    const feed = document.getElementById('feed');
    if (!feed) {
        console.error('Feed element not found, Sophia!');
        return;
    }
    if (!Array.isArray(window.user.posts)) window.user.posts = [];
    feed.innerHTML = ''; // Clear once
    const postsToShow = window.user.posts.slice(0, 5); // Limit to 5 posts initially
    console.log('Rendering posts for Sophia:', postsToShow.length);
    postsToShow.forEach((post, index) => window.renderPost(post, index, feed));

    if (window.user.posts.length > 5) {
        const loadMore = document.createElement('button');
        loadMore.textContent = 'Load More Posts, Sophia! ✨';
        loadMore.style.background = '#ff69b4';
        loadMore.onclick = () => {
            const nextBatch = window.user.posts.slice(feed.children.length, feed.children.length + 5);
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
    trashButton.className = 'trash-button delete-button';
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
                    window.addNotification('Post moved to trash, Sophia! 🗑️💕');
                    if (autoSaveEnabled) window.saveUserData();
                    window.updateUI();
                }, 500);
            } else {
                console.error('Post not found at index:', index);
                window.addNotification('Oops, can’t find that post, Sophia! 💔');
            }
        } catch (err) {
            console.error('Error in trash button handler:', err);
            window.addNotification('Oops, something broke, Sophia! Can’t move to trash right now! 💔');
        }
    });
    buttons.appendChild(trashButton);

    const shoutoutButton = document.createElement('button');
    shoutoutButton.className = 'shoutout-button';
    shoutoutButton.textContent = 'Give a Shoutout 📢';
    shoutoutButton.onclick = () => {
        if (window.accounts.length <= 1) {
            window.addNotification('You need another account to give a shoutout, Sophia! 💖');
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
        <input type="text" placeholder="Add a comment, Sophia!">
        <button onclick="window.addComment(${index}, this.previousElementSibling.value)">Post</button>
    `;
    commentCenter.appendChild(commentInput);
    postDiv.appendChild(commentCenter);
    feed.appendChild(postDiv);
    console.log('Post rendered at index:', index);
};

window.renderNotifications = function() {
    const notifications = document.getElementById('notifications');
    if (!notifications) {
        console.error('No notifications div found, Sophia!');
        return;
    }
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
    if (!likesFeed) {
        console.error('No likesFeed div found, Sophia!');
        return;
    }
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
        if (!likesFeed.children.length) likesFeed.innerHTML = '<div class="like-entry">No likes yet, Sophia! 💖</div>';
    }
};

window.renderComments = function() {
    const commentsFeed = document.getElementById('commentsFeed');
    if (!commentsFeed) {
        console.error('No commentsFeed div found, Sophia!');
        return;
    }
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
        if (!commentsFeed.children.length) commentsFeed.innerHTML = '<div class="comment-entry">No comments yet, Sophia! 💬</div>';
    }
};

window.renderGeneratedPosts = function() {
    const generatedFeed = document.getElementById('generatedFeed');
    if (!generatedFeed) {
        console.error('No generatedFeed div found, Sophia!');
        return;
    }
    if (!document.getElementById('generatedAccountsTab') || !document.getElementById('generatedAccountsTab').classList.contains('hidden')) {
        generatedFeed.innerHTML = '';
        Object.entries(window.generatedAccounts).forEach(([username, data]) => {
            if (Array.isArray(data.posts)) {
                data.posts.forEach((post, index) => window.renderGeneratedPost(post, index, username));
            }
        });
        if (!generatedFeed.children.length) generatedFeed.innerHTML = '<div class="post">No posts from generated accounts yet, Sophia! 🌟</div>';
    }
};

window.renderProfileTab = function() {
    const profileTab = document.getElementById('profileTab');
    if (profileTab && !profileTab.classList.contains('hidden')) {
        const editUsername = document.getElementById('editUsername');
        const preview = document.getElementById('editProfilePicPreview');
        const streak = document.getElementById('shoutoutStreak');
        if (editUsername) editUsername.value = window.user.username;
        if (preview) {
            preview.src = window.user.profilePic || '';
            preview.classList.toggle('hidden', !window.user.profilePic);
        }
        if (streak) streak.textContent = window.shoutoutStreak || 0;
    }
};

window.renderAIAccounts = function() {
    const aiAccountsFeed = document.getElementById('aiAccountsFeed');
    if (!aiAccountsFeed) {
        console.error('No aiAccountsFeed div found, Sophia!');
        return;
    }
    aiAccountsFeed.innerHTML = '';
    if (Object.keys(window.generatedAccounts).length === 0) {
        aiAccountsFeed.innerHTML = '<div class="ai-account">No AI accounts yet, Sophia! 🤖</div>';
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
    if (!messagesDiv) {
        console.error('No messagesFeed div found, Sophia!');
        return;
    }
    messagesDiv.innerHTML = '';
    if (window.messages.length === 0) {
        messagesDiv.innerHTML = '<div class="message">No messages yet, Sophia! 📩</div>';
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
        const shopMoney = document.getElementById('shopMoneyDisplay');
        if (shopMoney) shopMoney.textContent = window.formatNumber(window.user.money);
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
    const generatedFeed = document.getElementById('generatedFeed');
    if (generatedFeed) generatedFeed.appendChild(postDiv);
};

console.log('game-render.js loaded for Sophia, my pink cyan princess! 💕');
