const search = document.getElementById("search_input");
const resultsDiv = document.getElementById("search_results");
const searchBtn = document.getElementById("search_btn");

search.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && search.value !== "") {
    await Search(search.value);
  }
  if (e.key === "Backspace" && search.value.length === 1) {
    resultsDiv.innerHTML = "";
    resultsDiv.classList.add("d-none"); // Hide dropdown
  }
});

// Clear results when input is empty
search.addEventListener("input", () => {
  if (search.value === "") {
    resultsDiv.innerHTML = "";
    resultsDiv.classList.add("d-none"); // Hide dropdown
  }
});

searchBtn.addEventListener("click", async (e) => {
  if (search.value !== "") await Search(search.value);
});

async function Search(query) {
  // clear recent results
  resultsDiv.innerHTML = "";
  resultsDiv.classList.add("d-none"); // Hide dropdown initially

  const req = await fetch(`/search?q=${query.trim()}`, {
    method: "post",
  });

  if (req.ok) {
    const res = await req.json();

    if (res.data.length > 0) {
      resultsDiv.classList.remove("d-none"); // Show dropdown

      for (let i = 0; i < res.data.length; i++) {
        const link = document.createElement("a");
        const d = document.createElement("div");
        link.href = `/${res.data[i].ticker.toLowerCase()}`;
        link.textContent = `${res.data[i].name} (${res.data[i].ticker})`;
        d.className =
          "search-item d-flex align-items-center p-2 hover-bg-light rounded cursor-pointer";
        d.appendChild(link);
        resultsDiv.appendChild(d);
      }
    } else {
      resultsDiv.classList.remove("d-none"); // Show "no results"
      resultsDiv.innerHTML = "<i>No results.</i>";
    }
  }
}
