document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            navbar.style.padding = '0';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Hero Background Slideshow
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const images = [
            'images/hero.png',
            'images/about.png'
        ];
        let currentImageIndex = 0;

        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            heroBg.style.backgroundImage = `url('${images[currentImageIndex]}')`;
        }, 4000); // Change image every 4 seconds
    }

    // Form Submission in Background
    const form = document.getElementById('enquiry-form');
    const result = document.getElementById('form-result');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            
            result.style.display = 'block';
            result.innerHTML = "Sending...";
            result.style.color = "var(--text-light)";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = json.message || "Form submitted successfully!";
                    result.style.color = "var(--primary-green)";
                    form.reset();
                } else {
                    console.log(response);
                    result.innerHTML = json.message || "Something went wrong!";
                    result.style.color = "red";
                }
            })
            .catch(error => {
                console.log(error);
                result.innerHTML = "Something went wrong!";
                result.style.color = "red";
            })
            .then(function() {
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
            });
        });
    }
});
