document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('showmore');
  if (!btn) return;

  const hiddenRows = document.querySelectorAll('.hidden-div');
  let expanded = false;

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    expanded = !expanded;

    hiddenRows.forEach(function (r) {
      r.style.display = expanded ? '' : 'none';
    });

    btn.textContent = expanded ? 'Show less' : 'Show more';
    btn.setAttribute('aria-expanded', String(expanded));
  });
});
