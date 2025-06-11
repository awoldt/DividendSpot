using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class SitemapPageModel : PageModel
{
  public SitemapPageModel(Db db)
  {
    _db = db;
  }
  private readonly Db _db;

  public async Task<IActionResult> OnGetAsync()
  {
    string? sitemap = await _db.GenerateSitemap();
    return sitemap == null ? StatusCode(500) : Content(sitemap.Trim(), "application/xml");
  }
}