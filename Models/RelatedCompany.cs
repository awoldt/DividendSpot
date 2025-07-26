public class RelatedCompany
{
    public RelatedCompany(string ticker, string name)
    {
        Ticker = ticker;
        Name = name;
    }

    public string Ticker { get; set; }
    public string Name { get; set; }
}