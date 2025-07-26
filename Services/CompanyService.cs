public class CompanyService
{
    public static async Task<Company> CreateAsync(string ticker,
        Db db,
        CustomCache cache,
        PgonUtils utils)
    {
        // try cache first
        var fromCache = cache.GetCompanyFromCache(ticker.ToUpper());
        if (fromCache != null) return fromCache;

        // the base company data (name, description, etccc...)
        var baseData = await db.GetCompanyDetails(ticker.ToUpper())
                       ?? throw new KeyNotFoundException($"no asset “{ticker}”");

        // other things related to company to fetch
        var dividends = utils.GetCompanyDividendData(ticker.ToUpper());
        var news = utils.GetCompanyNews(ticker.ToUpper());
        var relatedTickers = utils.GetRelatedCompanies(ticker.ToUpper());

        await Task.WhenAll(dividends, news, relatedTickers);

        baseData.Dividends = dividends.Result;
        baseData.CompanyNews = news.Result;
        baseData.RelatedCompanies = await db.GetRelatedCompanies(relatedTickers.Result);
        baseData.PageLastUpdated = DateTime.UtcNow;
        baseData.DivYield = await utils.GetCompanyDivYield(dividends.Result, ticker);

        cache.AddCompanyToCache(baseData);
        return baseData;
    }
}