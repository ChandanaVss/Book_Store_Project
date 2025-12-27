const API_URL = "http://localhost:5000/books";

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const published_date = document.getElementById("published_date").value;

  fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, published_date })
  })
    .then(res => res.text())
    .then(alert);    
}

function uploadCSV() {
  const formData = new FormData();
  formData.append("csvFile", document.getElementById("csvFile").files[0]);

  fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData
  })
    .then(res => res.text())
    .then(alert);
}

function loadBooks() {
  fetch(`${API_URL}/list`)
    .then(res => res.json())
    .then(data => {
      let html = "<tr><th>ID</th><th>Title</th><th>Author</th><th>Published Date</th></tr>";

      data.forEach(book => {
        const dateObj = new Date(book.published_date);

        const formattedDate = dateObj.toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });

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
    });
}


// function loadBooks() {
//   fetch(`${API_URL}/list`)
//     .then(res => res.json())
//     .then(data => {
//       let html = "<tr><th>ID</th><th>Title</th><th>Author</th><th>Published Date</th></tr>";
//       data.forEach(book => {
//         const formattedDate=new Date(book.published_date).toLocaleString();
//         html += `<tr><td>${book.id}</td><td>${book.title}</td><td>${book.author}</td><td>${formattedDate}</td></tr>`;
//       });
//       document.getElementById("bookTable").innerHTML = html;
//     });
// }

function updateBook() {
  const id = document.getElementById("id").value;
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const published_date = document.getElementById("published_date").value;

  fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, published_date })
  })
    .then(res => res.text())
    .then(alert);
}

function deleteBook() {
  const id = document.getElementById("id").value;
  fetch(`${API_URL}/delete/${id}`, { method: "DELETE" })
    .then(res => res.text())
    .then(alert);
}
