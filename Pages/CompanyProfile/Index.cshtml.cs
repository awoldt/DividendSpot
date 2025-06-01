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

  public Db _db { get; set; }
  public string? Ticker { get; set; }
  public Company? Company { get; set; }
  public CustomCache _cache { get; set; }
  public PgonUtils _utils { get; set; }

  public async Task<IActionResult> OnGetAsync(string ticker)
  {
    Ticker = ticker;
    // see if the company is stored in cache
    var cachedCompany = _cache.GetCompanyFromCache(ticker.ToUpper());
    if (cachedCompany != null)
    {
      Company = cachedCompany;
      return Page();
    }

    // if company is not stored in cache, must fetch data from db and third party API to get company data
    // this data is fetched and will then be stored in cache
    var company = await _db.GetCompanyDetails(ticker.ToUpper());
    if (company == null)
    {
      return NotFound();
    }
    company.Dividends = await _utils.GetCompanyDividendData(ticker.ToUpper());
    company.CompanyNews = await _utils.GetCompanyNews(ticker.ToUpper());
    var relatedTickers = await _utils.GetRelatedCompanies(ticker.ToUpper());
    company.RelatedCompanies = await _db.GetRelatedCompanies(relatedTickers);
    company.PageLastUpdated = DateTime.UtcNow;

    // now add this company to the cache for all future requests
    _cache.AddCompanyToCache(company);
    Company = company;

    return Page();
  }
}