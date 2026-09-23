const app = {
    currentUser: null,
    currentPreviewBase64: null,
    
    moments: [
        {
            id: 1,
            time: "08:15",
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&q=80",
            caption: "Berangkat kuliah ☀️",
            mood: "😊",
            visibility: "Close Friends"
        },
        {
            id: 2,
            time: "12:30",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80",
            caption: "Lunch time 🍜",
            mood: "🥰",
            visibility: "Friends"
        }
    ],

    login: function() {
        const username = document.getElementById('login-username').value;
        if(username.trim() === "") return alert("Username required!");
        
        this.currentUser = { name: username.charAt(0).toUpperCase() + username.slice(1) };
        document.getElementById('user-display-name').innerText = `${this.currentUser.name} ☀️`;
        
        this.setGreeting();
        document.getElementById('bottom-nav').style.display = 'flex';
        this.switchView('home');
        this.renderTimeline();
    },

    logout: function() {
        this.currentUser = null;
        document.getElementById('bottom-nav').style.display = 'none';
        this.switchView('login');
    },

    switchView: function(viewName) {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        document.getElementById(`view-${viewName}`).classList.add('active');
    },

    setGreeting: function() {
        const hour = new Date().getHours();
        let greeting = "Good evening,";
        if (hour < 12) greeting = "Good morning,";
        else if (hour < 18) greeting = "Good afternoon,";
        document.getElementById('greeting').innerText = greeting;
    },

    renderTimeline: function() {
        const container = document.getElementById('timeline-container');
        container.innerHTML = "";
        
        const reversedMoments = [...this.moments].reverse();

        reversedMoments.forEach(m => {
            const card = document.createElement('div');
            card.className = 'moment-card';
            card.innerHTML = `
                <div class="moment-header">
                    <span>🕒 ${m.time}</span>
                    <span>🔒 ${m.visibility}</span>
                </div>
                <img src="${m.image}" class="moment-img" alt="Moment image">
                <div class="moment-caption">
                    <span class="moment-mood">${m.mood}</span>
                    ${m.caption}
                </div>
            `;
            container.appendChild(card);
        });
    },

    previewImage: function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                app.currentPreviewBase64 = e.target.result;
                const previewImg = document.getElementById('image-preview');
                previewImg.src = app.currentPreviewBase64;
                previewImg.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    },

    submitMoment: function() {
        const caption = document.getElementById('moment-caption').value;
        const mood = document.getElementById('moment-mood').value;
        const visibility = document.getElementById('moment-visibility').value;

        if (!this.currentPreviewBase64) return alert("Please upload a photo!");
        if (!caption) return alert("Please write a caption!");

        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        this.moments.push({
            id: Date.now(),
            time: timeString,
            image: this.currentPreviewBase64,
            caption: caption,
            mood: mood,
            visibility: visibility
        });

        document.getElementById('moment-caption').value = "";
        document.getElementById('moment-photo').value = "";
        document.getElementById('image-preview').style.display = 'none';
        this.currentPreviewBase64 = null;

        this.switchView('home');
        this.renderTimeline();
    }
};