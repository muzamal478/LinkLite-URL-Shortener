document.addEventListener('DOMContentLoaded', () => {
    // GSAP Animations
    gsap.from('.navbar', { y: -100, duration: 0, ease: 'power2.out' });
    gsap.from('.hero-section h1', { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: 'power2.out' });
    gsap.from('.hero-section .input-group', { opacity: 0, scale: 0.8, duration: 1, delay: 1, ease: 'back.out(1.7)' });
    gsap.from('.hero-section .action-buttons', { opacity: 0, y: 20, duration: 1, delay: 1.5, ease: 'power2.out' });

    // URL Shortening Logic with TinyURL API
    const shortenBtn = document.getElementById('shortenBtn');
    const urlInput = document.getElementById('urlInput');
    const shortenedUrl = document.getElementById('shortenedUrl');
    const copyBtn = document.getElementById('copyBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const resetBtn = document.getElementById('resetBtn');
    const apiToken = 'zGnY5GWMyVPc5l8uMOTKOH1jrRSTMUFm7UJ9r6WjzXjZH337Asphqu7vfhFi';

    let currentShortUrl = '';

    async function shortenUrl(url) {
        if (!url || !isValidUrl(url)) {
            shortenedUrl.innerHTML = '<span class="text-danger">Please enter a valid URL</span>';
            copyBtn.style.display = 'none';
            refreshBtn.style.display = 'none';
            return;
        }

        try {
            const response = await fetch('https://api.tinyurl.com/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url,
                    domain: 'tinyurl.com'
                })
            });

            const data = await response.json();
            if (response.ok && data.data && data.data.tiny_url) {
                currentShortUrl = data.data.tiny_url;
                shortenedUrl.innerHTML = `Shortened URL: <a href="${currentShortUrl}" target="_blank" class="text-light">${currentShortUrl}</a>`;
                copyBtn.style.display = 'inline-block';
                refreshBtn.style.display = 'inline-block';
                gsap.fromTo('#shortenedUrl', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
            } else {
                shortenedUrl.innerHTML = `<span class="text-danger">Failed to shorten URL: ${data.errors?.[0] || 'Unknown error'}</span>`;
                copyBtn.style.display = 'none';
                refreshBtn.style.display = 'none';
            }
        } catch (error) {
            shortenedUrl.innerHTML = '<span class="text-danger">An error occurred. Please try again.</span>';
            copyBtn.style.display = 'none';
            refreshBtn.style.display = 'none';
            console.error('Error:', error);
        }
    }

    shortenBtn.addEventListener('click', () => shortenUrl(urlInput.value.trim()));

    copyBtn.addEventListener('click', () => {
        if (currentShortUrl) {
            navigator.clipboard.writeText(currentShortUrl).then(() => {
                copyBtn.textContent = 'Copied!';
                copyBtn.disabled = true;
                gsap.to(copyBtn, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Link';
                    copyBtn.disabled = false;
                }, 2000);
            }).catch(err => {
                shortenedUrl.innerHTML = '<span class="text-danger">Failed to copy URL</span>';
                console.error('Copy Error:', err);
            });
        }
    });

    refreshBtn.addEventListener('click', () => {
        if (urlInput.value.trim()) {
            shortenUrl(urlInput.value.trim());
        }
    });

    resetBtn.addEventListener('click', () => {
        urlInput.value = '';
        shortenedUrl.innerHTML = '';
        copyBtn.style.display = 'none';
        refreshBtn.style.display = 'none';
        gsap.to('.action-buttons', { opacity: 1, duration: 0.5 });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Message sent successfully!');
        contactForm.reset();
        gsap.fromTo('#contactForm', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    });

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('.lazy-load');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px 100px 0px'
    });

    lazyImages.forEach(image => observer.observe(image));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}