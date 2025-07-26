using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

public class CompanyProfileModel : PageModel
{
  public CompanyProfileModel(Db db, CustomCache cache, PgonUtils utils)
  {
    _db = db;
    _cache = cache;
    _utils = utils;
  }

  public Company? Company { get; set; }
  private readonly Db _db;
  private readonly CustomCache _cache;
  private readonly PgonUtils _utils;

  public async Task<IActionResult> OnGetAsync(string ticker)
  {
    Company = await CompanyService.CreateAsync(ticker, _db, _cache, _utils);
    return Company == null ? NotFound() : Page();
  }
}