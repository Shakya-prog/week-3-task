const apiURL = "https://jsonplaceholder.typicode.com/posts";
let posts = [];
let currentPage = 1;
const postsPerPage = 10;

const searchInput = document.getElementById('searchInput');
const userFilter = document.getElementById('userFilter');
const titleLengthFilter = document.getElementById('titleLengthFilter');
const idRangeFilter = document.getElementById('idRangeFilter');
const sortSelect = document.getElementById('sortSelect');
const resetFilters = document.getElementById('resetFilters');
const tableBody = document.getElementById('tableBody');
const pageInfo = document.getElementById('pageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const themeToggle = document.getElementById('themeToggle');
const createBtn = document.getElementById('createBtn');
const modalOverlay = document.getElementById('modalOverlay');
const savePost = document.getElementById('savePost');
const closeModal = document.getElementById('closeModal');

// Fetch data
axios.get(apiURL)
  .then(response => {
    posts = response.data;
    populateUserFilter();
    renderPaginatedTable();
  })
  .catch(err => console.error("Error fetching data:", err));

// Render table
function renderPaginatedTable() {
  let filtered = applyFiltersAndSort();
  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const start = (currentPage - 1) * postsPerPage;
  const currentPosts = filtered.slice(start, start + postsPerPage);

  tableBody.innerHTML = currentPosts.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.userId}</td>
      <td>${p.title}</td>
      <td>${p.body}</td>
      <td>
        <button onclick="deletePost(${p.id})">🗑 Delete</button>
      </td>
    </tr>
  `).join('');

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function applyFiltersAndSort() {
  let filtered = [...posts];

  const query = searchInput.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.body.toLowerCase().includes(query)
    );
  }

  if (userFilter.value) {
    filtered = filtered.filter(p => p.userId == userFilter.value);
  }

  if (titleLengthFilter.value) {
    filtered = filtered.filter(p => {
      const len = p.title.length;
      if (titleLengthFilter.value === "short") return len <= 30;
      if (titleLengthFilter.value === "medium") return len > 30 && len <= 60;
      if (titleLengthFilter.value === "long") return len > 60;
    });
  }

  if (idRangeFilter.value) {
    const [min, max] = idRangeFilter.value.split('-').map(Number);
    filtered = filtered.filter(p => p.id >= min && p.id <= max);
  }

  const sortVal = sortSelect.value;
  if (sortVal === "title-asc") filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sortVal === "title-desc") filtered.sort((a, b) => b.title.localeCompare(a.title));
  if (sortVal === "id-asc") filtered.sort((a, b) => a.id - b.id);
  if (sortVal === "id-desc") filtered.sort((a, b) => b.id - a.id);

  return filtered;
}

[searchInput, userFilter, titleLengthFilter, idRangeFilter, sortSelect].forEach(el => {
  el.addEventListener('input', () => {
    currentPage = 1;
    renderPaginatedTable();
  });
});

resetFilters.addEventListener('click', () => {
  searchInput.value = '';
  userFilter.value = '';
  titleLengthFilter.value = '';
  idRangeFilter.value = '';
  sortSelect.value = '';
  currentPage = 1;
  renderPaginatedTable();
});

prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderPaginatedTable(); } });
nextBtn.addEventListener('click', () => { currentPage++; renderPaginatedTable(); });

// Dark Mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Modal control
createBtn.addEventListener('click', () => modalOverlay.classList.remove('hidden'));
closeModal.addEventListener('click', () => modalOverlay.classList.add('hidden'));

// Create Post
savePost.addEventListener('click', () => {
  const title = document.getElementById('newTitle').value;
  const body = document.getElementById('newBody').value;
  const userId = document.getElementById('newUserId').value;

  axios.post(apiURL, { title, body, userId }).then(res => {
    posts.unshift(res.data);
    modalOverlay.classList.add('hidden');
    document.getElementById('newTitle').value = '';
    document.getElementById('newBody').value = '';
    document.getElementById('newUserId').value = '';
    renderPaginatedTable();
  });
});

// Delete Post
function deletePost(id) {
  axios.delete(`${apiURL}/${id}`).then(() => {
    posts = posts.filter(p => p.id !== id);
    renderPaginatedTable();
  });
}

function populateUserFilter() {
  const uniqueUsers = [...new Set(posts.map(p => p.userId))];
  userFilter.innerHTML += uniqueUsers.map(u => `<option value="${u}">User ${u}</option>`).join('');
}
