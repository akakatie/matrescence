
async function loadVideos() {
  const response = await fetch('sketches.csv');
  const data = await response.text();
  const rows = data.split('\n').slice(1);

  const feed = document.getElementById('feed');

  rows.forEach(row => {
      const [order, id, file, shortTitle, caption, altText, mode] = row.split(',');

      if (!file) return;

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
      video.setAttribute('preload', 'metadata');
      video.setAttribute('playsinline', '');
      video.muted = true;
      video.removeAttribute('controls');

      const overlay = document.createElement('div');
      overlay.className = 'custom-controls ' + mode;
      
      const timerSpan = document.createElement('span');
      timerSpan.className = 'timer '+ mode;
      timerSpan.textContent = '00:00';
      
      const statusIcon = document.createElement('img');
      statusIcon.className = 'status-icon ' + mode;
      statusIcon.src = 'assets/pause.png';
      
      overlay.appendChild(timerSpan);
      overlay.appendChild(statusIcon);

      videoContainer.appendChild(video);
      videoContainer.appendChild(overlay);

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

      card.appendChild(captionElem);
      card.appendChild(videoContainer);
      card.appendChild(linkButton);
      feed.appendChild(card);

      setupCustomControl(video, statusIcon, timerSpan);
  });

  setupAutoplay();
}

function setupCustomControl(video, iconEl, timerEl) {
  let isEnded = false;

  function updateIcon() {
    if (isEnded) {
        iconEl.src = 'assets/replay.png'; // Replace with the path to your replay icon
    } else if (video.paused) {
        iconEl.src = 'assets/play.png'; // Replace with the path to your play icon
    } else {
        iconEl.src = 'assets/pause.png'; // Replace with the path to your pause icon
    }
}

  function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  video.addEventListener('timeupdate', () => {
      const remaining = video.duration - video.currentTime;
      timerEl.textContent = formatTime(remaining);
  });

  video.addEventListener('ended', () => {
      isEnded = true;
      updateIcon();
  });

  video.parentElement.addEventListener('click', () => {
      video.parentElement.dataset.userInteracted = 'true';

      if (isEnded) {
          video.currentTime = 0;
          video.play();
          isEnded = false;
      } else if (video.paused) {
          video.play();
      } else {
          video.pause();
      }
      updateIcon();
  });

  updateIcon();
}

function setupAutoplay() {
    const videos = document.querySelectorAll('video');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            const container = video.parentElement;
            const userInteracted = container.dataset.userInteracted === 'true';

            if (entry.isIntersecting && entry.intersectionRatio === 1) {
                if (!userInteracted) {
                    video.play();
                }
            } else {
                if (!userInteracted) {
                    video.pause();
                }
            }
        });
    }, { threshold: 1.0 });

    videos.forEach(video => {
        observer.observe(video);
    });
}

loadVideos();
