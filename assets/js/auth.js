document.addEventListener('DOMContentLoaded', () => {
    // --- Data Initialization ---
    // Initialize default users if not present
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

    // --- Login Logic ---
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

            if (user) {
                // Check status
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

                // Successful Login
                localStorage.setItem('currentUser', JSON.stringify(user));

                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Authenticating...';
                submitBtn.disabled = true;

                // Emulate network delay
                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'user-dashboard.html';
                    }
                }, 800);

            } else {
                // Invalid credentials
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

            // Check if username exists
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
                phone: '', // Optional during reg
                status: 'pending' // Default status
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
