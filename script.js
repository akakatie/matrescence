
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
        card.id = id.trim(); 

        const captionElem = document.createElement('div');
        captionElem.className = 'caption';
        captionElem.textContent = caption;

        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';

        const video = document.createElement('video');
        video.src = `/videos/${file.trim()}`;
        video.setAttribute('alt', altText);
        video.controls = true;
        video.controlsList = "play timeline"; // minimal controls
        video.preload = "metadata";
        video.muted = true; 

        // Video behavior: pause at end
        video.addEventListener('ended', () => {
            video.pause();
        });

        const linkButton = document.createElement('button');
            linkButton.textContent = 'Copy link';
            linkButton.className = 'copy-link';
            linkButton.title = 'Copy link to this video';
            linkButton.onclick = () => {
                const fullURL = `${window.location.origin}${window.location.pathname}#${id.trim()}`;
                navigator.clipboard.writeText(fullURL).then(() => {
                    linkButton.textContent = 'Link copied!';
                    setTimeout(() => {
                        linkButton.textContent = 'Copy link';
                    }, 1500);
                });
            };

        videoContainer.appendChild(video);
        card.appendChild(captionElem);
        card.appendChild(videoContainer);
        card.appendChild(linkButton);
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

document.querySelectorAll('video').forEach(video => {
    let hideControlsTimeout;
  
    function showControlsTemporarily() {
      video.setAttribute('controls', ''); // show controls
      clearTimeout(hideControlsTimeout);
      hideControlsTimeout = setTimeout(() => {
        video.removeAttribute('controls'); // hide controls again
      }, 3000);
    }
  
    function togglePlay() {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  
    ['click', 'touchstart'].forEach(evt => {
      video.addEventListener(evt, e => {
        togglePlay();
        showControlsTemporarily();
        e.stopPropagation();
      });
    });
  
    // Optional: Remove controls when user scrolls
    document.addEventListener('scroll', () => {
      video.removeAttribute('controls');
    });
  });


