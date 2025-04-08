import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function About({ setIsLoading }) {
    useEffect(() => {
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            initAnimations();
        }, 500);

        return () => clearTimeout(timeoutId); // Cleanup on unmount

    }, [setIsLoading]);


    function initAnimations() {
        // Fade in animations
        const fadeElements = document.querySelectorAll('.fade-in');

        fadeElements.forEach(element => {
            setTimeout(() => {
                element.classList.add('visible');
            }, 100);
        });
    }

    return (
        <section className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-16 fade-in">
                <h1 className="heading-font text-5xl font-bold mb-4">About</h1>
                <p className="text-xl max-w-3xl mx-auto opacity-70">The mind behind Extropy</p>
            </div>

            <div className="mb-12 fade-in">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/3">
                        <div className="rounded-xl overflow-hidden">
                            <img src="https://cdn.jsdelivr.net/gh/phosphor-icons/core@main/assets/fill/user-circle-fill.svg" alt="Okuhle Madondo" className="w-full aspect-square object-cover" />
                        </div>
                    </div>

                    <div className="w-full md:w-2/3">
                        <h2 className="heading-font text-3xl font-bold mb-4">Okuhle Madondo</h2>
                        <p className="text-lg opacity-80 mb-4">22-year-old Mathematics and Computer Science student</p>
                        <p className="mb-4">I'm a South African student deeply passionate about the intersection of mathematics, computer science, philosophy, and their applications in understanding our complex world.</p>
                        <p className="mb-4">My academic journey has been driven by a curiosity about the fundamental structures that underpin reality, from abstract mathematical concepts to the computational frameworks that power our digital world.</p>
                        <p className="mb-4">Through Extropy, I aim to explore and share insights across disciplines, examining how these fields of knowledge interact and inform one another. The name "Extropy" reflects my belief in the power of knowledge and understanding to create order, meaning, and progress.</p>
                        <p>When I'm not studying or writing, you might find me exploring new research papers, experimenting with programming projects, or engaging in philosophical discussions with friends and colleagues.</p>
                    </div>
                </div>
            </div>

            <div className="mt-16 fade-in">
                <h2 className="heading-font text-3xl font-bold mb-8">Topics I'm Passionate About</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="heading-font text-xl font-bold mb-3">Mathematics</h3>
                        <p>Abstract algebra, mathematical logic, category theory, and the philosophy of mathematics.</p>
                    </div>
                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="heading-font text-xl font-bold mb-3">Computer Science</h3>
                        <p>Theoretical computer science, algorithms, artificial intelligence, and computational complexity.</p>
                    </div>
                    <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <h3 className="heading-font text-xl font-bold mb-3">Philosophy</h3>
                        <p>Philosophy of mind, epistemology, metaphysics, and the philosophical implications of scientific discoveries.</p>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center fade-in">
                <h2 className="heading-font text-3xl font-bold mb-8">Get in Touch</h2>
                <div className="flex justify-center space-x-8">
                    <a href="https://instagram.com/okuhlemadondo" target="_blank" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path></svg>
                    </a>
                    <a href="https://x.com/OkuhleMadondo" target="_blank" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.91a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.1.16,11.21,17.89,37.85,29.41A133.69,133.69,0,0,0,100,152.12C121.59,173.74,143.76,184,160,184a47.93,47.93,0,0,0,48-48V76A47.39,47.39,0,0,0,247.39,68.94ZM202.82,136a32,32,0,0,1-31.95,31.62c-21.11-1.84-44.82-21.88-57.11-48.49a8,8,0,0,0-14.36,1.56,64.79,64.79,0,0,1-8.77,20.64A86.28,86.28,0,0,1,80,127.82a75.18,75.18,0,0,1-12.49-19.24,101.77,101.77,0,0,1-5.74-16.25,127.2,127.2,0,0,0,26.59,21.55,92.09,92.09,0,0,0,46.29,16.69,8,8,0,0,0,8.32-8.12L136,88A32,32,0,0,1,167.86,56,32.93,32.93,0,0,1,199.27,80h-17a8,8,0,0,0-7.77,6.12,8.18,8.18,0,0,0,2,7.07L184,101.36V136Z"></path>
                    </a>
                    <a href="mailto:okuhlemadondo@icloud.com" className="social-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-8,144H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Zm-88-40L49.79,64H206.21Z"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}