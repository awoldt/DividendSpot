public class CompanySearchResults
{
    public CompanySearchResults(string ticker, string name)
    {
        Ticker = ticker;
        Name = name;
    }

    public string Name { get; set; }
    public string Ticker { get; set; }
}