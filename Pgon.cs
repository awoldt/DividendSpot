public class PgonUtils
{
  public PgonUtils(IHttpClientFactory httpclient, Db db)
  {
    _httpclient = httpclient;
    _db = db;
  }

  public IHttpClientFactory _httpclient { get; set; }
  public Db _db { get; set; }

  public async Task<CompanyDividends[]?> GetCompanyDividendData(string ticker)
  {
    try
    {
      HttpClient client = _httpclient.CreateClient();
      var res = await client.GetFromJsonAsync<PgonDividendResponse?>($"https://api.polygon.io/v3/reference/dividends?ticker={ticker}&order=desc&limit=1000&sort=pay_date&apiKey=PIS0uzmN4JwRwBzj7HrhbPtWw0Oq2JS6");
      if (res == null) return null;
      List<CompanyDividends> dividendData = new List<CompanyDividends>();
      foreach (var x in res.Results)
      {
        dividendData.Add(new CompanyDividends(x.CashAmount, x.ExDividendDate, x.PayDate, x.RecordDate));
      }
      return dividendData.ToArray();
    }
    catch (System.Exception)
    {
      return null;
    }
  }

  public async Task<CompanyNews[]?> GetCompanyNews(string ticker)
  {
    try
    {
      HttpClient client = _httpclient.CreateClient();
      var res = await client.GetFromJsonAsync<PgonNewsResponse?>($"https://api.polygon.io/v2/reference/news?ticker={ticker}&order=desc&limit=5&sort=published_utc&apiKey=PIS0uzmN4JwRwBzj7HrhbPtWw0Oq2JS6");
      if (res == null) return null;
      List<CompanyNews> news = new List<CompanyNews>();
      foreach (var x in res.Results)
      {
        // only add this news article if the current ticker is included in the featured articles from the api response
        if (Array.Exists(x.FeaturedTickers, x => x == ticker))
        {
          news.Add(new CompanyNews(x.Title, x.PublishedAt, x.Url, x.FeaturedTickers, x.Description, x.Publisher.Name));
        }
      }

      // finally, ensure that only tickers supported in dividendspots db are included in the final output
      var validRelatedTickers = await _db.GetRelatedCompanies(news.SelectMany(x => x.FeaturedTickers).ToArray());
      if (validRelatedTickers != null)
      {
        string[] validTickers = validRelatedTickers.Select(x => x.Ticker).ToArray();
        for (int i = 0; i < news.Count; i++)
        {
          // for each news article, filter out related tickers that are not valid AND the current ticker being viewed
          news[i].FeaturedTickers = news[i].FeaturedTickers.Where(x => Array.Exists(validTickers, z => z == x) && x != ticker).ToArray();
        }
      }

      return news.ToArray();
    }
    catch (System.Exception)
    {
      return null;
    }
  }

  public async Task<string[]?> GetRelatedCompanies(string ticker)
  {

    // return the array of tickers
    try
    {
      var client = _httpclient.CreateClient();
      var res = await client.GetFromJsonAsync<PgonRelatedCompaniesResult?>($"https://api.polygon.io/v1/related-companies/{ticker}?apiKey=PIS0uzmN4JwRwBzj7HrhbPtWw0Oq2JS6");
      if (res == null) return null;
      var tickers = new string[res.Results.Length];
      for (int i = 0; i < res.Results.Length; i++)
      {
        tickers[i] = res.Results[i].Ticker;
      }
      return tickers;
    }
    catch (System.Exception)
    {

      return null;
    }
  }
}