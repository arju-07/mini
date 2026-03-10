document.addEventListener('DOMContentLoaded', () => {
    // Check Auth
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }

    // Update greeting
    document.getElementById('admin-greeting').textContent = `Hello, ${currentUser.name}`;

    // Sidebar Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
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

    // Load Complaints
    function loadComplaints() {
        const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
        const statusFilter = document.getElementById('status-filter').value;
        const urgencyFilter = document.getElementById('urgency-filter').value;

        const tbody = document.getElementById('admin-complaints-table');
        tbody.innerHTML = '';

        const filteredComplaints = complaints.filter(c => {
            const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
            const matchesUrgency = urgencyFilter === 'All' || c.urgency === urgencyFilter;
            return matchesStatus && matchesUrgency;
        });

        if (filteredComplaints.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="padding: 1rem; text-align: center; color: var(--text-muted);">No complaints found matching filters.</td></tr>';
            return;
        }

        filteredComplaints.forEach((c) => {
            let statusClass = 'status-submitted';
            if (c.status === 'Under Review') statusClass = 'status-review';
            if (c.status === 'In Progress') statusClass = 'status-progress';
            if (c.status === 'Resolved') statusClass = 'status-resolved';
            if (c.status === 'Closed') statusClass = 'status-closed';

            let urgencyColor = 'var(--text-main)';
            if (c.urgency === 'High') urgencyColor = 'var(--danger-color)';
            if (c.urgency === 'Medium') urgencyColor = 'var(--accent-color)';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">#${c.id.slice(-4)}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${c.user}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color); font-weight: 500;">${c.title}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color); color: ${urgencyColor}; font-weight: 600;">${c.urgency}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${c.date}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    <span class="status-badge ${statusClass}">${c.status}</span>
                </td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                     <select onchange="updateStatus('${c.id}', this.value)" style="padding: 0.25rem; border: 1px solid var(--border-color); border-radius: var(--radius-md); font-size: 0.875rem;">
                        <option value="Submitted" ${c.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                        <option value="Under Review" ${c.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                        <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="Closed" ${c.status === 'Closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Expose updateStatus to global scope
    window.updateStatus = (id, newStatus) => {
        const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
        const index = complaints.findIndex(c => c.id === id);
        if (index !== -1) {
            complaints[index].status = newStatus;
            localStorage.setItem('complaints', JSON.stringify(complaints));
            loadComplaints();
        }
    };

    // --- User Validation Logic ---
    function loadPendingUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const pendingUsers = users.filter(u => u.status === 'pending');
        const tbody = document.getElementById('user-validation-table');

        tbody.innerHTML = '';

        if (pendingUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="padding: 1rem; text-align: center; color: var(--text-muted);">No new registration requests.</td></tr>';
            return;
        }

        pendingUsers.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color); font-weight: 500;">${u.name}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${u.username}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${u.hostelBlock}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    <span class="status-badge status-review">Pending</span>
                </td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    <button onclick="approveUser('${u.username}')" class="btn btn-sm btn-primary" style="margin-right: 0.5rem; background-color: var(--secondary-color);">Approve</button>
                    <button onclick="rejectUser('${u.username}')" class="btn btn-sm btn-outline" style="color: var(--danger-color); border-color: var(--danger-color);">Reject</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.approveUser = (username) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const index = users.findIndex(u => u.username === username);
        if (index !== -1) {
            users[index].status = 'approved';
            localStorage.setItem('users', JSON.stringify(users));
            loadPendingUsers();
            loadAllUsers(); // Refresh all users list if open
            alert(`User ${username} approved!`);
        }
    };

    window.rejectUser = (username) => {
        if (!confirm(`Are you sure you want to reject ${username}?`)) return;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const index = users.findIndex(u => u.username === username);
        if (index !== -1) {
            users[index].status = 'rejected'; // Or splice to delete
            localStorage.setItem('users', JSON.stringify(users));
            loadPendingUsers();
            loadAllUsers(); // Refresh all users list if open
        }
    };

    window.deleteStudent = (username) => {
        if (!confirm(`Delete student "${username}"? This will also remove all their complaints and cannot be undone.`)) return;

        // Remove user
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.username !== username);
        localStorage.setItem('users', JSON.stringify(users));

        // Remove their complaints
        let complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
        complaints = complaints.filter(c => c.user !== username);
        localStorage.setItem('complaints', JSON.stringify(complaints));

        loadAllUsers();
        loadComplaints(); // Refresh complaints view too
        alert(`Student "${username}" has been deleted.`);
    };

    function loadAllUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const students = users.filter(u => u.role === 'user');
        const tbody = document.getElementById('all-users-table');

        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 1rem; text-align: center; color: var(--text-muted);">No students registered.</td></tr>';
            return;
        }

        students.forEach(u => {
            let statusBadge = '';
            if (u.status === 'approved') statusBadge = '<span class="status-badge status-progress">Active</span>';
            else if (u.status === 'pending') statusBadge = '<span class="status-badge status-review">Pending</span>';
            else if (u.status === 'rejected') statusBadge = '<span class="status-badge status-closed">Rejected</span>';
            else statusBadge = '<span class="status-badge status-submitted">Unknown</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color); font-weight: 500;">${u.name}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${u.username}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${u.hostelBlock}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">${u.phone || '-'}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    ${statusBadge}
                </td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-color);">
                    <button onclick="deleteStudent('${u.username}')" style="padding: 0.3rem 0.75rem; background: var(--danger-color); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: 0.8rem; font-weight: 500;">🗑 Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Filter Listeners
    document.getElementById('status-filter').addEventListener('change', loadComplaints);
    document.getElementById('urgency-filter').addEventListener('change', loadComplaints);

    // Initial Loads
    loadComplaints();
    loadPendingUsers();
    loadAllUsers();

    // Hook to refresh when tab clicked
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            if (section === 'validate-registrations') {
                loadPendingUsers();
            } else if (section === 'manage-users') {
                loadAllUsers();
            }
        });
    });
    const profileForm = document.getElementById('profile-form');
    const profileImgDisplay = document.getElementById('profile-img-display');
    const profileIconDisplay = document.getElementById('profile-icon-display');
    const profilePicInput = document.getElementById('profile-pic-input');

    // Load initial profile data (Admin)
    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-office').value = currentUser.hostelBlock || '';
    document.getElementById('profile-name-display').textContent = currentUser.name || 'Admin';

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
        currentUser.hostelBlock = document.getElementById('profile-office').value;

        // Commit pending profile pic if any
        if (currentUser.pendingProfilePic) {
            currentUser.profilePic = currentUser.pendingProfilePic;
            delete currentUser.pendingProfilePic;
        }

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        document.getElementById('profile-name-display').textContent = currentUser.name;
        document.getElementById('admin-greeting').textContent = `Hello, ${currentUser.name}`;

        alert('Profile updated successfully!');
    });

    // Initial Load
    loadComplaints();
});
