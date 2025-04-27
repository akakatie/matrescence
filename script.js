
  // Load CSV, parse it, create the sketch cards
  fetch('sketches.csv')
    .then(response => response.text())
    .then(text => {
      const sketches = parseCSV(text);
      createSketchDivs(sketches);
      setupIntersectionObserver();
    })
    .catch(error => console.error('Error loading sketches:', error));

  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines.shift().split(',').map(h => h.trim());

    return lines.map(line => {
      const values = line.split(',').map(v => v.trim());
      let entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
      });
      return entry;
    });
  }

  function createSketchDivs(sketches) {
    const container = document.getElementById('sketches-container');

    sketches.forEach(sketch => {
      if (!sketch.ID || !sketch.file) return;

      const div = document.createElement('div');
      div.id = sketch.ID;
      div.className = 'sketch-card';

      const video = document.createElement('video');
      video.setAttribute('preload', 'metadata');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('controls', '');
      video.setAttribute('alt', sketch["alt-text"] || '');

      const source = document.createElement('source');
      source.src = '/videos/' + sketch.file;
      source.type = 'video/mp4';
      video.appendChild(source);

      const caption = document.createElement('p');
      caption.textContent = sketch.caption || '';

      div.appendChild(video);
      div.appendChild(caption);
      container.appendChild(div);
    });
  }

  function setupIntersectionObserver() {
    const options = {
      threshold: 1.0  // 100% of the video must be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (!video) return;

        if (entry.isIntersecting) {
          video.play().catch(err => console.log('Play error:', err));
        } else {
          // Pause and reset to last frame (by not resetting currentTime)
          video.pause();
        }
      });
    }, options);

    document.querySelectorAll('.sketch-card video').forEach(video => {
      observer.observe(video);
    });
  }