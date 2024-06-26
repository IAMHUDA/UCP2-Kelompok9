 // Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyCW4lK4Kbs8hgHyUubGfajywlXrYm2NBaM",
    authDomain: "hudadatabase-6277d.firebaseapp.com",
    projectId: "hudadatabase-6277d",
    storageBucket: "hudadatabase-6277d.appspot.com",
    messagingSenderId: "422933041959",
    appId: "1:422933041959:web:66d26fd7f97563d189cf02",
    measurementId: "G-YWG0WRG3EH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

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
        const newRegistrationRef = database.ref('registrations').push();
        newRegistrationRef.set({
            name,
            email,
            phone,
            address,
            gender,
            membership,
            photoURL
        });
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

database.ref('registrations').on('child_added', function(snapshot) {
    const data = snapshot.val();
    appendRow(data);
});

document.getElementById('search').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchTable();
    } else if (event.target.value === '') {
        loadTableData();
    }
});

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
    
    Array.from(tr).forEach(row => {
        const td = row.getElementsByTagName('td')[0];
        if (td) {
            if (td.innerText.toUpperCase().indexOf(input) > -1) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function loadTableData() {
    document.getElementById('registrationData').innerHTML = '';
    database.ref('registrations').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const data = childSnapshot.val();
            appendRow(data);
        });
    });
}