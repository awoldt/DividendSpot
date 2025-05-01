export default function Search() {
  return (
    <>
      <div className="search-container position-relative">
        <input
          id="search_input"
          type="search"
          className="form-control form-control-lg rounded-pill ps-4 pe-5 mb-4"
          placeholder="Search for a company..."
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        />
        <div
          className="search-dropdown position-absolute w-100 mt-2 d-none"
          id="search_results"
        >
          <div className="bg-white rounded-3 shadow-lg overflow-hidden">
            <div className="p-2">
              {/* Dropdown content will be populated by JS */}
              <div className="search-item d-flex align-items-center p-2 hover-bg-light rounded cursor-pointer">
                <img
                  src=""
                  alt=""
                  className="company-logo me-3"
                  style={{ width: "32px", height: "32px" }}
                />
                <div>
                  <div className="fw-bold company-name">cvb</div>
                  <small className="text-muted company-ticker">cvb</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
           .search-dropdown {
    max-height: 300px; /* Limit the height */
    overflow-y: auto; /* Enable vertical scrolling */
    position: absolute;
    z-index: 10; /* Ensure it's above other elements */
    width: 100%; /* Keep it aligned with the input box */
    background-color: white; /* Ensure a clean background */
    border: 1px solid #ddd; /* Add a border to separate it visually */
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Add shadow for better UX */
  }

  .search-item {
    padding: 8px 12px; /* Add padding for better spacing */
    cursor: pointer;
  }

  .search-item:hover {
    background-color: #f7f7f7; /* Highlight on hover */
  }

  @media (max-width: 576px) {
    .search-dropdown {
      max-height: 200px; /* Adjust height for smaller screens */
      width: calc(100% - 20px); /* Keep it responsive */
      left: 10px;
    }

    .search-item {
      padding: 6px 10px; /* Adjust padding for small screens */
      font-size: 0.9rem; /* Adjust font size for readability */
    }
  }
          `}
      </style>
    </>
  );
}
