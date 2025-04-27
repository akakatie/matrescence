
async function loadVideos() {
    const response = await fetch('sketches.csv');
    const data = await response.text();
    const rows = data.split('\n').slice(1); // skip header row

    const feed = document.getElementById('feed');

    rows.forEach(row => {
        const [order, id, file, shortTitle, caption, altText] = row.split(',');

        if (!file) return; // Skip if empty line

        const card = document.createElement('div');
        card.className = 'video-card';

        const captionElem = document.createElement('div');
        captionElem.className = 'caption';
        captionElem.textContent = caption;

        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';

        const video = document.createElement('video');
        video.src = `/videos/${file.trim()}`;
        video.setAttribute('alt', altText);
        video.controls = false;
        video.controlsList = "play timeline"; // minimal controls
        video.preload = "metadata";

        // Video behavior: pause at end
        video.addEventListener('ended', () => {
            video.pause();
        });

        videoContainer.appendChild(video);
        card.appendChild(captionElem);
        card.appendChild(videoContainer);
        feed.appendChild(card);
    });

    setupAutoplay();
}

function setupAutoplay() {
    const videos = document.querySelectorAll('video');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio === 1) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 1.0 }); // Fully visible

    videos.forEach(video => {
        observer.observe(video);
    });
}

loadVideos();
