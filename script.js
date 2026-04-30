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

    // Room Sliders
    const roomSliders = document.querySelectorAll('.room-slider');
    
    roomSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            if (dotsContainer) {
                dotsContainer.appendChild(dot);
            }
        });

        const dots = slider.querySelectorAll('.slider-dot');

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        }
    });

    // Booking Modal Logic
    let selectedRoom = '';

    window.openBookingModal = function(roomName) {
        selectedRoom = roomName;
        const modalRoomName = document.getElementById('modalRoomName');
        if (modalRoomName) {
            modalRoomName.innerText = 'Check Availability: ' + roomName;
        }
        
        const modal = document.getElementById('bookingModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const modal = document.getElementById('bookingModal');
            if (modal) modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('bookingModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    const checkBtn = document.getElementById('checkAvailabilityBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            
            if (!checkin || !checkout) {
                alert('Please select both check-in and check-out dates.');
                return;
            }

            // Optional: check if check-out is after check-in
            if (new Date(checkout) <= new Date(checkin)) {
                alert('Check-out date must be after check-in date.');
                return;
            }

            const message = `Hi, I would like to check availability for the ${selectedRoom} from ${checkin} to ${checkout}.`;
            const whatsappUrl = `https://wa.me/917907090192?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            
            const modal = document.getElementById('bookingModal');
            if (modal) modal.style.display = 'none';
            
            // Clear dates
            document.getElementById('checkin').value = '';
            document.getElementById('checkout').value = '';
        });
    }
});
