document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'user') {
        window.location.href = 'user-login.html';
        return;
    }

    // Update greeting
    document.getElementById('user-greeting').textContent = `Welcome, ${currentUser.name}`;

    // Sidebar Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked
            item.classList.add('active');
            const sectionId = item.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Priority Determination Logic
    const priorityRules = {
        High: ['fire', 'spark', 'smoke', 'danger', 'shock', 'short circuit', 'leak', 'flood', 'broken lock', 'theft', 'emergency', 'urgent', 'explode', 'gas'],
        Medium: ['wifi', 'internet', 'slow', 'fan', 'light', 'bulb', 'tube', 'clean', 'dirty', 'pest', 'insect', 'cockroach', 'water', 'furniture', 'chair', 'table', 'bed', 'door'],
        Low: ['paint', 'color', 'noise', 'suggestion', 'request', 'mirror', 'curtain', 'other']
    };

    function calculatePriority(text) {
        text = text.toLowerCase();

        for (const keyword of priorityRules.High) {
            if (text.includes(keyword)) return 'High';
        }
        for (const keyword of priorityRules.Medium) {
            if (text.includes(keyword)) return 'Medium';
        }
        return 'Low'; // Default
    }

    // Real-time Priority Updates
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const categoryInput = document.getElementById('category');
    const priorityDisplay = document.getElementById('priority-display');
    const urgencyInput = document.getElementById('urgency');

    function updatePriority() {
        const text = `${titleInput.value} ${descInput.value} ${categoryInput.value}`;
        const priority = calculatePriority(text);

        urgencyInput.value = priority;
        priorityDisplay.textContent = priority;

        // Color coding
        priorityDisplay.style.color = 'var(--text-main)';
        if (priority === 'High') {
            priorityDisplay.style.color = 'var(--danger-color)';
            priorityDisplay.style.fontWeight = '700';
        } else if (priority === 'Medium') {
            priorityDisplay.style.color = 'var(--accent-color)';
            priorityDisplay.style.fontWeight = '600';
        }
    }

    titleInput.addEventListener('input', updatePriority);
    descInput.addEventListener('input', updatePriority);
    categoryInput.addEventListener('change', updatePriority);

    // Complaint Submission
    const complaintForm = document.getElementById('complaint-form');
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        // Recalculate one last time to be safe
        const urgency = calculatePriority(`${title} ${description} ${category}`);

        const newComplaint = {
            id: Date.now().toString(), // Simple ID generation
            title,
            category,
            urgency,
            description,
            status: 'Submitted',
            date: new Date().toLocaleDateString(),
            user: currentUser.username
        };

        // Get existing complaints or init empty array
        const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
        complaints.push(newComplaint);
        localStorage.setItem('complaints', JSON.stringify(complaints));

        alert('Complaint submitted successfully!');
        complaintForm.reset();
        loadComplaints(); // Refresh list
    });

    // Delete Complaint
    window.deleteComplaint = (id) => {
        if (!confirm('Are you sure you want to delete this complaint?')) return;
        const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
        const updated = complaints.filter(c => c.id !== id);
        localStorage.setItem('complaints', JSON.stringify(updated));
        loadComplaints();
    };

    // Load Complaints
    function loadComplaints() {
        const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
        const userComplaints = complaints.filter(c => c.user === currentUser.username);
        const tbody = document.getElementById('complaints-table-body');

        tbody.innerHTML = '';

        if (userComplaints.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 1rem; text-align: center; color: var(--text-muted);">No complaints submitted yet.</td></tr>';
            return;
        }

        userComplaints.forEach(c => {
            let statusClass = 'status-submitted';
            if (c.status === 'Under Review') statusClass = 'status-review';
            if (c.status === 'In Progress') statusClass = 'status-progress';
            if (c.status === 'Resolved') statusClass = 'status-resolved';
            if (c.status === 'Closed') statusClass = 'status-closed';

            // Delete only allowed when status is still 'Submitted' (admin hasn't acted)
            const canDelete = c.status === 'Submitted';
            const deleteBtn = canDelete
                ? `<button onclick="deleteComplaint('${c.id}')" style="padding: 0.3rem 0.75rem; background: var(--danger-color); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: 0.8rem; font-weight: 500;">🗑 Delete</button>`
                : `<span style="font-size: 0.75rem; color: var(--text-muted);">—</span>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">#${c.id.slice(-4)}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color); font-weight: 500;">${c.title}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${c.category}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${c.date}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    <span class="status-badge ${statusClass}">${c.status}</span>
                </td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${deleteBtn}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Profile Management
    const profileForm = document.getElementById('profile-form');
    const profileImgDisplay = document.getElementById('profile-img-display');
    const profileIconDisplay = document.getElementById('profile-icon-display');
    const profilePicInput = document.getElementById('profile-pic-input');

    // Load initial profile data
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-hostel').value = currentUser.hostelBlock || '';
    document.getElementById('profile-name-display').textContent = currentUser.name || 'User';
    document.getElementById('profile-role-display').textContent = currentUser.role || 'Student';

    // Show profile pic if exists
    if (currentUser.profilePic) {
        profileImgDisplay.src = currentUser.profilePic;
        profileImgDisplay.style.display = 'block';
        profileIconDisplay.style.display = 'none';
    }

    // Handle File Selection
    profilePicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const base64Image = e.target.result;

                // Update UI immediately for preview
                profileImgDisplay.src = base64Image;
                profileImgDisplay.style.display = 'block';
                profileIconDisplay.style.display = 'none';

                // Update current user object but wait for save to persist
                currentUser.pendingProfilePic = base64Image;
            };
            reader.readAsDataURL(file);
        }
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        currentUser.name = document.getElementById('profile-name').value;
        currentUser.phone = document.getElementById('profile-phone').value;
        currentUser.hostelBlock = document.getElementById('profile-hostel').value;

        // Commit pending profile pic if any
        if (currentUser.pendingProfilePic) {
            currentUser.profilePic = currentUser.pendingProfilePic;
            delete currentUser.pendingProfilePic;
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        document.getElementById('profile-name-display').textContent = currentUser.name;
        document.getElementById('user-greeting').textContent = `Welcome, ${currentUser.name}`;

        alert('Profile updated successfully!');
    });

    // Initial Load
    loadComplaints();
});
