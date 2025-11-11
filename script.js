// Select the table body element
const tableBody = document.getElementById('tableBody');

// Function to render the posts in the table
function renderTable(posts) {
  tableBody.innerHTML = ''; // clear existing rows

  // Loop through posts using forEach (array method)
  posts.forEach(post => {
    const row = document.createElement('tr');

    // Create and fill table cells using object properties
    row.innerHTML = `
      <td>${post.id}</td>
      <td>${post.userId}</td>
      <td>${post.title}</td>
      <td>${post.body}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Fetch data using Axios
axios.get('https://jsonplaceholder.typicode.com/posts')
  .then(response => {
    const posts = response.data;
    console.log('Fetched Posts:', posts); // log for verification
    renderTable(posts.slice(0, 20)); // display first 20 posts
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    tableBody.innerHTML = `
      <tr><td colspan="4" class="loading">Error loading data</td></tr>
    `;
  });