using System.Text.Json.Serialization;

public class CorporationJSONLD
{
    public CorporationJSONLD(string name, string? description, string? url, string logo, string? telephone, string ticker)
    {
        Name = name;
        Description = description;
        Url = url;
        Logo = logo;
        Telephone = telephone;
        TickerSymbol = ticker;
    }

    [JsonPropertyName("@context")]
    public string Context { get; set; } = "https://schema.org";

    [JsonPropertyName("@type")]
    public string Type { get; set; } = "Corporation";

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("url")]
    public string? Url { get; set; }

    [JsonPropertyName("logo")]
    public string Logo { get; set; }

    [JsonPropertyName("telephone")]
    public string? Telephone { get; set; }

    [JsonPropertyName("tickerSymbol")]
    public string TickerSymbol { get; set; }
}

public class NewsArticleJSONLD
{
    public NewsArticleJSONLD(string headline, string datePublished, string url, string description, string publisherName)
    {
        Headline = headline;
        DatePublished = datePublished;
        Url = url;
        Description = description;
        Publisher = new Organization
        {
            Name = publisherName
        };
        Author = new Organization
        {
            Name = publisherName
        };
    }

    [JsonPropertyName("@context")]
    public string Context { get; set; } = "https://schema.org";

    [JsonPropertyName("@type")]
    public string Type { get; set; } = "NewsArticle";

    [JsonPropertyName("headline")]
    public string Headline { get; set; }

    [JsonPropertyName("datePublished")]
    public string DatePublished { get; set; }

    [JsonPropertyName("url")]
    public string Url { get; set; }

    [JsonPropertyName("description")]
    public string Description { get; set; }

    [JsonPropertyName("author")]
    public Organization Author { get; set; }

    [JsonPropertyName("publisher")]
    public Organization Publisher { get; set; }
}

public class Organization
{
    [JsonPropertyName("@type")]
    public string Type { get; set; } = "Organization";

    [JsonPropertyName("name")]
    public string Name { get; set; }
}

public class ImageObject
{
    [JsonPropertyName("@type")]
    public string Type { get; set; } = "ImageObject";

    [JsonPropertyName("url")]
    public string Url { get; set; }
}