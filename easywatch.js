// Gestion du slider multi-étapes
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-step-btn');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    let currentStep = 1;
    const totalSteps = slides.length;

    // Fonction pour calculer et appliquer la hauteur maximale
    function updateSliderHeight() {
        if (!sliderWrapper) return;
        
        let maxHeight = 0;
        
        // Temporairement rendre tous les slides mesurables
        slides.forEach((slide) => {
            const originalClasses = slide.className;
            const originalStyle = slide.style.cssText;
            
            // Rendre le slide temporairement visible et en position relative pour mesurer
            slide.className = 'slide';
            slide.style.cssText = 'position: relative; visibility: visible; opacity: 0; transform: translateX(0); width: 100%;';
            
            // Forcer le reflow pour que le navigateur calcule la hauteur
            void slide.offsetHeight;
            
            // Mesurer la hauteur réelle du contenu
            const slideHeight = slide.scrollHeight;
            if (slideHeight > maxHeight) {
                maxHeight = slideHeight;
            }
            
            // Restaurer l'état original
            slide.className = originalClasses;
            slide.style.cssText = originalStyle;
        });
        
        // Appliquer la hauteur maximale au wrapper avec transition
        if (maxHeight > 0) {
            sliderWrapper.style.height = `${maxHeight}px`;
        }
    }

    // Fonction pour mettre à jour l'étape active avec animation
    function updateStep(stepNumber) {
        const currentSlide = slides[currentStep - 1];
        const nextSlide = slides[stepNumber - 1];
        const stepsContainer = document.querySelector('.steps-container');

        // Si on avance vers l'étape suivante
        if (stepNumber > currentStep) {
            // Animation de sortie vers la gauche pour le slide actuel
            if (currentSlide) {
                currentSlide.classList.add('leaving');
                currentSlide.classList.remove('active');
            }

            // Animation d'entrée depuis la droite pour le nouveau slide
            if (nextSlide) {
                nextSlide.classList.add('entering');
                // Petit délai pour permettre au navigateur de rendre les changements
                setTimeout(() => {
                    nextSlide.classList.add('active');
                }, 10);
            }
        } else {
            // Si on recule (pour l'instant non utilisé, mais préparé pour l'avenir)
            if (currentSlide) {
                currentSlide.classList.remove('active');
            }
            if (nextSlide) {
                nextSlide.classList.add('active');
            }
        }

        // Nettoyer les classes d'animation après la transition
        setTimeout(() => {
            slides.forEach((slide) => {
                slide.classList.remove('entering', 'leaving');
            });
            // Recalculer la hauteur après la transition pour s'assurer qu'elle est correcte
            requestAnimationFrame(() => {
                updateSliderHeight();
            });
        }, 500); // Correspond à la durée de la transition CSS

        // Mettre à jour les indicateurs d'étapes
        steps.forEach((step, index) => {
            if (index + 1 <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Mettre à jour la progression de la ligne
        if (stepsContainer) {
            const activeStep = steps[stepNumber - 1];
            if (activeStep) {
                // Obtenir la position réelle de l'étape active
                const containerRect = stepsContainer.getBoundingClientRect();
                const stepRect = activeStep.getBoundingClientRect();
                
                // Calculer la position du centre de l'étape par rapport au conteneur
                const stepCenter = stepRect.left - containerRect.left + (stepRect.width / 2);
                const progressWidth = (stepCenter / containerRect.width) * 100;
                
                stepsContainer.style.setProperty('--progress-width', `${progressWidth}%`);
            }
        }

        currentStep = stepNumber;
    }

    // Ajouter les écouteurs d'événements aux boutons "pull"
    nextButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentStep < totalSteps) {
                updateStep(currentStep + 1);
            }
        });
    });

    // Mettre à jour la hauteur lors du redimensionnement de la fenêtre
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateSliderHeight, 100);
    });

    // Initialiser l'étape 1 au chargement
    updateStep(1);
    
    // Calculer la hauteur après que le DOM soit complètement rendu
    requestAnimationFrame(() => {
        updateSliderHeight();
        // Recalculer après un court délai pour s'assurer que tout est chargé (polices, images, etc.)
        setTimeout(() => {
            requestAnimationFrame(updateSliderHeight);
        }, 300);
    });
});
