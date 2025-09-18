const searchInput = document.getElementById("nav_search_input");
const searchResults = document.getElementById("nav_search_results");

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

async function doSearch(query) {
  if (!query.trim()) {
    searchResults.innerHTML = "";
    return;
  }

  const res = await fetch(`/search?ticker=${query}`, { method: "post" });
  const results = await res.json();

  searchResults.innerHTML = "";

  for (const [k, v] of Object.entries(results)) {
    searchResults.innerHTML += `
      <a href="/${k.toLowerCase()}">
        <div class="search-result-item">
          <strong>${k}</strong> ${v}
        </div>
      </a>
    `;
  }
}

const DebounceSearch = debounce(doSearch, 400);

searchInput.addEventListener("input", (e) => {
  DebounceSearch(e.target.value);
});
