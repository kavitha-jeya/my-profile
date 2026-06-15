document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Navigation & Header scroll effects
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Mobile Menu Toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            const icon = mobileToggle.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // Highlight menu links on scroll
    const sections = document.querySelectorAll('section');
    function highlightActiveSection() {
        let scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            if (scrollPosition >= section.offsetTop && scrollPosition < (section.offsetTop + section.offsetHeight)) {
                const currentId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // 3. Dark / Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', currentTheme);
    });

    // 4. Reveal Animations on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. Skill Bar Animations
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar');
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 6. Project Cards Filter logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    // Trigger reflow for transition
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 7. Interactive Chessboard Puzzle Widget
    // Back-Rank Mate setup:
    // White: Rook on d1, King on g1, Pawns on f2, g2, h2
    // Black: King on h8, Pawns on f7, g7, h7
    // Goal: Move Rook from d1 to d8.
    const puzzleBoard = document.getElementById('puzzle-board');
    const feedbackText = document.getElementById('puzzle-feedback');
    const resetBtn = document.getElementById('reset-puzzle-btn');

    const boardLayout = [
        // a8-h8 (Row 0)
        ['', '', '', '', '', '', '', '♚'],
        // a7-h7 (Row 1)
        ['', '', '', '', '', '♟', '♟', '♟'],
        // a6-h6 (Row 2)
        ['', '', '', '', '', '', '', ''],
        // a5-h5 (Row 3)
        ['', '', '', '', '', '', '', ''],
        // a4-h4 (Row 4)
        ['', '', '', '', '', '', '', ''],
        // a3-h3 (Row 5)
        ['', '', '', '', '', '', '', ''],
        // a2-h2 (Row 6)
        ['', '', '', '', '', '♙', '♙', '♙'],
        // a1-h1 (Row 7)
        ['', '', '', '♖', '', '', '♔', '']
    ];

    let currentBoard = JSON.parse(JSON.stringify(boardLayout));
    let selectedSquare = null;
    let puzzleCompleted = false;

    function renderBoard() {
        puzzleBoard.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                const isLight = (row + col) % 2 === 0;
                
                square.classList.add('chess-square');
                square.classList.add(isLight ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = currentBoard[row][col];
                if (piece) {
                    const pieceSpan = document.createElement('span');
                    pieceSpan.classList.add('chess-piece');
                    pieceSpan.innerText = piece;
                    square.appendChild(pieceSpan);
                }

                // Add click event
                square.addEventListener('click', () => handleSquareClick(row, col));
                puzzleBoard.appendChild(square);
            }
        }
    }

    function handleSquareClick(row, col) {
        if (puzzleCompleted) return;

        const clickedPiece = currentBoard[row][col];

        // 1. Selecting the white rook (Row 7, Col 3 corresponds to d1)
        if (selectedSquare === null) {
            if (clickedPiece === '♖') {
                selectedSquare = { row, col };
                highlightSquare(row, col, 'selected');
                showLegalMoves(row, col);
            } else {
                feedbackText.innerText = "Select the White Rook (♖) on d1 to start!";
                feedbackText.style.color = "var(--color-accent)";
            }
        } else {
            // 2. We already have a piece selected, check target square click
            const originRow = selectedSquare.row;
            const originCol = selectedSquare.col;

            // If user clicked the same rook again, deselect
            if (row === originRow && col === originCol) {
                selectedSquare = null;
                renderBoard();
                feedbackText.innerText = "Deselected. Find the mate-in-one move for White!";
                feedbackText.style.color = "var(--text-secondary)";
                return;
            }

            // Check if user moves Rook along the d-file (col 3) to row 0 (d8)
            if (originRow === 7 && originCol === 3) {
                if (col === 3 && row === 0) {
                    // Correct Move! (d1 to d8)
                    currentBoard[originRow][originCol] = '';
                    currentBoard[row][col] = '♖';
                    selectedSquare = null;
                    puzzleCompleted = true;
                    renderBoard();
                    
                    // Update target square style for visual flair
                    const targetSquareEl = puzzleBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    targetSquareEl.style.backgroundColor = "rgba(16, 185, 129, 0.4)";
                    
                    feedbackText.innerText = "Checkmate! (♖d8#) Beautifully done! Strategic logic applied successfully.";
                    feedbackText.style.color = "#10b981";
                } else if (col === 3 && row > 0) {
                    // Rook moved on same file but not checkmate
                    currentBoard[originRow][originCol] = '';
                    currentBoard[row][col] = '♖';
                    selectedSquare = null;
                    renderBoard();
                    feedbackText.innerText = "Good move, but not checkmate. Black can block or escape! Try moving it all the way to d8.";
                    feedbackText.style.color = "var(--color-accent)";
                    
                    // Reset automatically after short delay to help recruiter
                    setTimeout(resetPuzzle, 1800);
                } else {
                    // Invalid Rook move rule-wise (simplification: rooks move straight)
                    feedbackText.innerText = "Rooks move vertically or horizontally. Try moving straight up the d-file.";
                    feedbackText.style.color = "var(--color-accent)";
                    selectedSquare = null;
                    renderBoard();
                }
            }
        }
    }

    function highlightSquare(row, col, className) {
        const sq = puzzleBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (sq) sq.classList.add(className);
    }

    function showLegalMoves(originRow, originCol) {
        // Highlight cells along the d-file (col = 3) from row 0 to 6
        if (originRow === 7 && originCol === 3) {
            for (let r = 0; r < 7; r++) {
                highlightSquare(r, 3, 'highlight');
            }
        }
    }

    function resetPuzzle() {
        currentBoard = JSON.parse(JSON.stringify(boardLayout));
        selectedSquare = null;
        puzzleCompleted = false;
        renderBoard();
        feedbackText.innerText = "White to move: Move the Rook (♖) to deliver checkmate!";
        feedbackText.style.color = "var(--text-secondary)";
    }

    resetBtn.addEventListener('click', resetPuzzle);
    
    // Initial board paint
    renderBoard();


    // 8. Contact Form Validator & Submission Feedback
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const formInputs = contactForm.querySelectorAll('.form-control');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        formInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('invalid');
                isValid = false;
            } else {
                input.classList.remove('invalid');
            }

            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    input.classList.add('invalid');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');
                }
            }
        });

        if (!isValid) {
            formStatus.className = 'form-status-msg error';
            formStatus.innerHTML = '<i data-lucide="alert-circle"></i> Please check and correct the highlighted fields.';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        // Simulate form submission
        const submitBtn = document.getElementById('form-submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span> <i data-lucide="loader" class="animate-spin"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            submitBtn.disabled = false;
            
            formStatus.className = 'form-status-msg success';
            formStatus.innerHTML = '<i data-lucide="check-circle"></i> Message sent successfully! I will get back to you soon.';
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            contactForm.reset();
        }, 1500);
    });

    // Remove invalid highlights on typing
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('invalid');
            }
        });
    });
});
