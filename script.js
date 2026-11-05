document.addEventListener('DOMContentLoaded', () => {
    
    /* Preloader */
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 600);

    /* Scroll Progress Bar */
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scroll-progress').style.width = scrolled + '%';

        // Back to top button visibility
        const backToTopBtn = document.getElementById('back-to-top');
        if (winScroll > 400) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    document.getElementById('back-to-top').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* Custom Cursor (Desktop) */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (window.innerWidth > 992) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = e.clientX + 'px';
            
            setTimeout(() => {
                follower.style.top = e.clientY + 'px';
                follower.style.left = e.clientX + 'px';
            }, 50);
        });
    }

    /* Typewriter Effect in Hero */
    class TypeWriter {
        constructor(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
        }
        tick() {
            let i = this.loopNum % this.toRotate.length;
            let fullTxt = this.toRotate[i];

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;

            let that = this;
            let delta = 200 - Math.random() * 100;

            if (this.isDeleting) { delta /= 2; }

            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }

            setTimeout(() => { that.tick(); }, delta);
        }
    }

    window.onload = function() {
        let elements = document.getElementsByClassName('typewrite');
        for (let i = 0; i < elements.length; i++) {
            let toRotate = elements[i].getAttribute('data-rotate');
            let period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TypeWriter(elements[i], JSON.parse(toRotate), period);
            }
        }
    };

    /* Canvas Particles Background in Hero */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = 'rgba(245, 200, 66, 0.3)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    /* Animated Counters */
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + window.innerHeight;
        const sectionPos = document.querySelector('.section-darker').offsetTop;

        if (scrollPos > sectionPos && !animated) {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const speed = target / 30;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 40);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            animated = true;
        }
    });

    /* Interactive Quiz Logic */
    const quizButtons = document.querySelectorAll('.btn-quiz-option');
    let userProfile = '';

    quizButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const currentStepEl = e.target.closest('.quiz-step');
            userProfile = e.target.getAttribute('data-profile');
            
            const nextStepNum = parseInt(currentStepEl.getAttribute('data-step')) + 1;
            currentStepEl.classList.add('d-none');
            
            const nextStepEl = document.querySelector(`.quiz-step[data-step="${nextStepNum}"]`);
            if (nextStepEl) {
                nextStepEl.classList.remove('d-none');
            } else {
                // Show result
                const resultEl = document.querySelector('.quiz-result');
                resultEl.classList.remove('d-none');
                document.getElementById('profile-name').innerText = userProfile;
                
                const waBtn = document.getElementById('whatsapp-quiz-btn');
                const encodedMsg = encodeURIComponent(`Olá Erika! Fiz o quiz no site e meu perfil é "${userProfile}". Quero agendar meu Diagnóstico Gratuito.`);
                waBtn.href = `https://wa.me/5521970074010?text=${encodedMsg}`;
            }
        });
    });

});