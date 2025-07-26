public class CompanyNews
{
    public CompanyNews(string title, string publishedAt, string url, string[] featuredTickers, string description, string publisher)
    {
        Title = title;
        PublishedAt = publishedAt;
        Url = url;
        FeaturedTickers = featuredTickers;
        Description = description;
        Publisher = publisher;
    }

    public string Title { get; set; }
    public string PublishedAt { get; set; }
    public string Url { get; set; }
    public string[] FeaturedTickers { get; set; }
    public string Description { get; set; }
    public string Publisher { get; set; }
}