document.addEventListener('DOMContentLoaded', (event) => {
    loadTableData();
});

document.getElementById('search').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchTable();
    } else if (event.target.value === '') {
        loadTableData();
    }
});

function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const membership = document.querySelector('input[name="membership"]:checked').value;
    const photo = document.getElementById('photo').files[0];

    if (!name || !email || !phone || !address || !gender || !membership || !photo) {
        alert('Please fill out all fields');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const photoURL = e.target.result;
        const data = {
            name,
            email,
            phone,
            address,
            gender,
            membership,
            photoURL
        };
        saveData(data);
        appendRow(data);
    }
    reader.readAsDataURL(photo);

    // Clear the form after submission
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.querySelectorAll('input[name="gender"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="membership"]').forEach(input => input.checked = false);
    document.getElementById('photo').value = '';
}

function saveData(data) {
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    registrations.push(data);
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

function loadTableData() {
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    document.getElementById('registrationData').innerHTML = '';
    registrations.forEach(data => appendRow(data));
}

function appendRow(data) {
    const table = document.getElementById('registrationData');
    const row = table.insertRow();
    row.insertCell(0).innerText = data.name;
    row.insertCell(1).innerText = data.email;
    row.insertCell(2).innerText = data.phone;
    row.insertCell(3).innerText = data.address;
    row.insertCell(4).innerText = data.gender;
    row.insertCell(5).innerText = data.membership;
    const photoCell = row.insertCell(6);
    const img = document.createElement('img');
    img.src = data.photoURL;
    img.width = 50;
    img.height = 50;
    photoCell.appendChild(img);
}

function searchTable() {
    const input = document.getElementById('search').value.toUpperCase();
    const table = document.getElementById('registrationTable');
    const tr = table.getElementsByTagName('tr');
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    
    document.getElementById('registrationData').innerHTML = '';
    
    registrations.forEach(data => {
        if (data.name.toUpperCase().indexOf(input) > -1) {
            appendRow(data);
        }
    });
}
