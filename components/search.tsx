export default function Search() {
  return (
    <>
      <div
        className="d-flex position-relative mb-4"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search any company"
          aria-label="Search"
          id="search_input"
        />
        <button className="btn btn-outline-primary" id="search_btn">
          Search
        </button>
      </div>
      <div id="search_results" class="mb-3 mt-3"></div>
      <script src="/public/scripts/search.js"></script>
    </>
  );
}
