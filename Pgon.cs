public class PgonUtils
{
  public PgonUtils(IHttpClientFactory httpclient, Db db, IConfiguration config)
  {
    _httpclient = httpclient;
    _db = db;
    _config = config;
  }

  private readonly IHttpClientFactory _httpclient;
  private readonly Db _db;
  private readonly IConfiguration _config;

  public async Task<CompanyDividends[]?> GetCompanyDividendData(string ticker)
  {
    try
    {
      HttpClient client = _httpclient.CreateClient();
      var res = await client.GetFromJsonAsync<PgonDividendResponse?>($"https://api.polygon.io/v3/reference/dividends?ticker={ticker}&order=desc&limit=1000&sort=pay_date&apiKey={_config["pgonApiKey"]}");
      if (res == null) return null;
      List<CompanyDividends> dividendData = new List<CompanyDividends>();
      foreach (var x in res.Results)
      {
        dividendData.Add(new CompanyDividends(x.CashAmount, x.ExDividendDate, x.PayDate, x.RecordDate, x.Frequency));
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
      var res = await client.GetFromJsonAsync<PgonNewsResponse?>($"https://api.polygon.io/v2/reference/news?ticker={ticker}&order=desc&limit=100&sort=published_utc&apiKey={_config["pgonApiKey"]}");
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

      // allow each news org to have only 1 article shown in feed (motleyfool spammy as fuck DAMN)
      List<CompanyNews> nonSpammyNews = new List<CompanyNews>();
      for (int i = 0; i < news.Count; i++)
      {
        if (!nonSpammyNews.Any(x => x.Publisher == news[i].Publisher))
        {
          nonSpammyNews.Add(news[i]);
        }

        // only allow up to 5 articles 
        if (nonSpammyNews.Count == 5)
        {
          break;
        }
      }

      // finally, ensure that only tickers supported in dividendspots db are included in the final output
      var validRelatedTickers = await _db.GetRelatedCompanies(nonSpammyNews.SelectMany(x => x.FeaturedTickers).ToArray());
      if (validRelatedTickers != null)
      {
        string[] validTickers = validRelatedTickers.Select(x => x.Ticker).ToArray();
        for (int i = 0; i < nonSpammyNews.Count; i++)
        {
          // for each news article, filter out related tickers that are not valid AND the current ticker being viewed
          nonSpammyNews[i].FeaturedTickers = nonSpammyNews[i].FeaturedTickers.Where(x => Array.Exists(validTickers, z => z == x) && x != ticker).ToArray();
        }
      }

      return nonSpammyNews.ToArray();
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
      var res = await client.GetFromJsonAsync<PgonRelatedCompaniesResult?>($"https://api.polygon.io/v1/related-companies/{ticker}?apiKey={_config["pgonApiKey"]}");
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

  public async Task<DivYield?> GetCompanyDivYield(CompanyDividends[]? dividends, string ticker)
  {
    /*
      dividend yield = annual dividends per share / stock price per share
    */
    try
    {
      if (dividends == null || dividends.Length == 0) return null;

      HttpClient client = _httpclient.CreateClient();
      var res = await client.GetFromJsonAsync<PgonTickerSnapshot?>($"https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/{ticker.ToUpper()}?apiKey={_config["pgonApiKey"]}");
      if (res == null) return null;

      // ensure dividends are sorted from newest to oldest
      var divs = dividends.Where(x => x.DividendPayDate < DateTime.UtcNow).OrderByDescending(x => x.DividendPayDate).ToArray();
      var frequency = dividends.FirstOrDefault(x => x.Frequency != 0);
      if (frequency == null) return null;
      double lastPrice = res.Ticker.Day.Close ?? res.Ticker.PrevDay.Close;
      double yield = divs.Take(frequency.Frequency).Select(x => x.Amount).Sum() / lastPrice * 100;
      int f = frequency.Frequency;

      return new DivYield(yield, f);
    }
    catch (System.Exception)
    {
      return null;
    }
  }
}