// Use relative API for deploy + local
const API_URL = "/books";

/* ---------------- ADMIN CHECK ---------------- */
function checkAdmin() {
  if (localStorage.getItem("isAdmin") !== "true") {
    alert("Admin login required");
    window.location.href = "index.html";
  }
}


/* ---------------- ADD BOOK ---------------- */
function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  fetch("/books/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author })
  })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(() => alert("Request failed"));
}

/* ---------------- UPLOAD CSV ---------------- */
function uploadCSV() {
  const fileInput = document.getElementById("csvFile");
  if (!fileInput.files.length) {
    alert("Please select a CSV file");
    return;
  }

  const formData = new FormData();
  formData.append("csvFile", fileInput.files[0]);

  fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())            // ✅ JSON
    .then(data => alert(data.message))  // ✅ show message
    .catch(() => alert("CSV upload failed"));
}


/* ---------------- LOAD BOOKS ---------------- */
function loadBooks() {
  fetch(`${API_URL}/list`)
    .then(res => res.json())
    .then(data => {
      let html = `
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Published Date</th>
        </tr>
      `;

      data.forEach(book => {
        const formattedDate = new Date(book.published_date).toLocaleString(
          'en-IN',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }
        );

        html += `
          <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${formattedDate}</td>
          </tr>
        `;
      });

      document.getElementById("bookTable").innerHTML = html;
    })
    .catch(() => alert("Failed to load books"));
}


/* ---------------- UPDATE BOOK ---------------- */
function updateBook() {
  const id = document.getElementById("id").value;
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author })
  })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(() => alert("Update failed"));
}


/* ---------------- DELETE BOOK ---------------- */
function deleteBook() {
  const id = document.getElementById("id").value;

  fetch(`${API_URL}/delete/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(() => alert("Delete failed"));
}


/* ---------------- SEARCH BOOKS ---------------- */
function searchBooks() {
  const keyword = document.getElementById("searchInput").value.trim();

  if (!keyword) {
    alert("Enter a search keyword");
    return;
  }

  fetch(`/books/search?keyword=${encodeURIComponent(keyword)}`)
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(data => {
      let html = `
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Published Date</th>
        </tr>
      `;

      if (data.length === 0) {
        html += `
          <tr>
            <td colspan="4" style="text-align:center;">No books found</td>
          </tr>
        `;
      } else {
        data.forEach(book => {
          html += `
            <tr>
              <td>${book.id}</td>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${new Date(book.published_date).toLocaleString()}</td>
            </tr>
          `;
        });
      }

      document.getElementById("bookTable").innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      alert("Search failed");
    });
}

// function for signup

function adminSignup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/admin/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(() => {
    alert("Signup successful");
    window.location.href = "admin-login.html";
  });
}

// function for login
function adminLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("All fields required");
    return;
  }

  fetch("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        alert("Login successful");
        window.location.href = "dashboard.html";
      } else {
        alert("Invalid username or password");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Login failed");
    });
}

// function checkAdmin() {
//   if (localStorage.getItem("isAdmin") !== "true") {
//     window.location.href = "admin-login.html";
//   }
// }

function logout() {
  localStorage.removeItem("isAdmin");
  window.location.href = "admin-login.html";
}



/* ---------- NAVBAR VISIBILITY ---------- */
function updateNavbar() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const signup = document.getElementById("signupLink");
  const login = document.getElementById("loginLink");
  const logout = document.getElementById("logoutBtn");

  if (!signup || !login || !logout) return;

  if (isAdmin) {
    signup.style.display = "none";
    login.style.display = "none";
    logout.style.display = "inline-block";
  } else {
    signup.style.display = "inline-block";
    login.style.display = "inline-block";
    logout.style.display = "none";
  }
}
