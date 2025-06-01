using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class SearchAPI : PageModel
{

  private Db _db { get; set; }

  public SearchAPI(Db db)
  {
    _db = db;
  }



  public async Task<IActionResult> OnPostAsync(string? q)
  {
    if (q == null || q == "")
    {
      return new JsonResult(new { data = new string[0] });
    }

    return new JsonResult(new { data = await _db.SearchCompany(q) });
  }
}