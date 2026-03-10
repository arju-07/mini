document.addEventListener('DOMContentLoaded', () => {
    // --- Data Initialization ---
    let users = JSON.parse(localStorage.getItem('users'));
    if (!users) {
        users = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'System Administrator',
                hostelBlock: 'Main Office',
                phone: '987-654-3210',
                status: 'approved'
            },
            {
                username: 'user',
                password: 'user123',
                role: 'user',
                name: 'John Doe',
                hostelBlock: 'Block A - 101',
                phone: '123-456-7890',
                status: 'approved'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    // --- Helper: perform login ---
    function attemptLogin(usernameInput, passwordInput, expectedRole, errorMsgEl, submitBtn) {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.username === usernameInput && u.password === passwordInput && u.role === expectedRole);

        if (user) {
            if (user.status === 'pending') {
                errorMsgEl.textContent = 'Account pending approval. Please contact the warden.';
                errorMsgEl.style.display = 'block';
                errorMsgEl.style.color = 'var(--text-muted)';
                return;
            }
            if (user.status === 'rejected') {
                errorMsgEl.textContent = 'Account registration rejected. Contact admin.';
                errorMsgEl.style.display = 'block';
                return;
            }

            // Successful Login
            errorMsgEl.style.display = 'none';
            localStorage.setItem('currentUser', JSON.stringify(user));

            submitBtn.textContent = 'Authenticating...';
            submitBtn.disabled = true;

            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            }, 800);

        } else {
            errorMsgEl.textContent = expectedRole === 'admin' ? 'Invalid admin credentials' : 'Invalid username or password';
            errorMsgEl.style.display = 'block';
            errorMsgEl.style.color = 'var(--danger-color)';
            // Shake animation on the form's parent card
            const card = errorMsgEl.closest('form');
            if (card) {
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 400);
            }
        }
    }

    // --- Unified Login Page (login.html) ---
    const studentLoginForm = document.getElementById('student-login-form');
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('student-username').value;
            const password = document.getElementById('student-password').value;
            const errorMsg = document.getElementById('student-error-msg');
            const submitBtn = studentLoginForm.querySelector('button[type="submit"]');
            attemptLogin(username, password, 'user', errorMsg, submitBtn);
        });
    }

    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            const errorMsg = document.getElementById('admin-error-msg');
            const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
            attemptLogin(username, password, 'admin', errorMsg, submitBtn);
        });
    }

    // --- Legacy single login-form (fallback for old pages) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm && !studentLoginForm && !adminLoginForm) {
        const errorMsg = document.getElementById('error-msg');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

            if (user) {
                if (user.status === 'pending') {
                    errorMsg.textContent = 'Account pending approval. Please contact the warden.';
                    errorMsg.style.display = 'block';
                    errorMsg.style.color = 'var(--text-muted)';
                    return;
                }
                if (user.status === 'rejected') {
                    errorMsg.textContent = 'Account registration rejected. Contact admin.';
                    errorMsg.style.display = 'block';
                    return;
                }
                localStorage.setItem('currentUser', JSON.stringify(user));
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Authenticating...';
                submitBtn.disabled = true;
                setTimeout(() => {
                    window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
                }, 800);
            } else {
                errorMsg.textContent = 'Invalid username or password';
                errorMsg.style.display = 'block';
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 400);
            }
        });
    }

    // --- Registration Logic ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value;
            const roll = document.getElementById('reg-roll').value;
            const hostel = document.getElementById('reg-hostel').value;
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;

            const users = JSON.parse(localStorage.getItem('users'));

            if (users.find(u => u.username === username)) {
                document.getElementById('reg-error').style.display = 'block';
                document.getElementById('reg-msg').style.display = 'none';
                return;
            }

            const newUser = {
                username: username,
                password: password,
                role: 'user',
                name: name,
                roll: roll,
                hostelBlock: hostel,
                phone: '',
                status: 'pending'
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            document.getElementById('reg-error').style.display = 'none';
            document.getElementById('reg-msg').style.display = 'block';
            registerForm.reset();
        });
    }

    // Simple shake animation styles
    if (!document.getElementById('shake-style')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'shake-style';
        styleSheet.innerText = `
        @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
        animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        `;
        document.head.appendChild(styleSheet);
    }
});
