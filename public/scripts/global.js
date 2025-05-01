document.addEventListener("DOMContentLoaded", function () {
  const search = document.getElementById("search_input");
  const resultsDiv = document.getElementById("search_results");

  if (search && resultsDiv) {
    search.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && search.value.trim() !== "") {
        await Search(search.value);
      }
      if (e.key === "Backspace" && search.value.length === 1) {
        resultsDiv.innerHTML = "";
        resultsDiv.classList.add("d-none");
      }
    });

    search.addEventListener("input", () => {
      if (search.value.trim() === "") {
        resultsDiv.innerHTML = "";
        resultsDiv.classList.add("d-none");
      }
    });

    async function Search(query) {
      resultsDiv.innerHTML = "";
      resultsDiv.classList.add("d-none");

      resultsDiv.innerHTML = "";
      resultsDiv.classList.add("d-none");

      const req = await fetch(`/search?q=${encodeURIComponent(query.trim())}`, {
        method: "post",
      });

      if (req.ok) {
        const res = await req.json();

        if (res.data && res.data.length > 0) {
          resultsDiv.classList.remove("d-none");

          for (let i = 0; i < res.data.length; i++) {
            const itemData = res.data[i];
            if (!itemData || !itemData.ticker || !itemData.name) {
              continue;
            }

            const link = document.createElement("a");
            const d = document.createElement("div");

            link.href = `/${itemData.ticker.toLowerCase()}`;
            link.textContent = `${itemData.name} (${itemData.ticker})`;

            d.className =
              "search-item d-flex align-items-center p-2 hover-bg-light rounded cursor-pointer";

            link.addEventListener("click", () => {
              resultsDiv.classList.add("d-none");
              search.value = "";
            });

            d.appendChild(link);
            resultsDiv.appendChild(d);
          }
          if (resultsDiv.innerHTML === "") {
            resultsDiv.classList.remove("d-none");
            resultsDiv.innerHTML = "<i>No results.</i>";
          }
        } else {
          resultsDiv.classList.remove("d-none");
          resultsDiv.innerHTML = "<i>No results.</i>";
        }
      } else {
        resultsDiv.classList.remove("d-none");
        resultsDiv.innerHTML = `<i>Error searching: ${req.status} ${req.statusText}</i>`;
      }
    }
  }

  const toggler = document.querySelector(".navbar-toggler");
  const collapseElement = document.querySelector(".navbar-collapse");

  if (toggler && collapseElement) {
    toggler.addEventListener("click", function () {
      collapseElement.classList.toggle("show");

      toggler.classList.toggle("collapsed");
      toggler.setAttribute(
        "aria-expanded",
        toggler.classList.contains("collapsed") ? "false" : "true"
      );
    });

    const navLinks = collapseElement.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        collapseElement.classList.remove("show");
        toggler.classList.add("collapsed");
        toggler.setAttribute("aria-expanded", "false");
      });
    });
  }
});
