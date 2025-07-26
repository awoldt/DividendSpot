public class CompanyDividends
{
    public CompanyDividends(double amount, string exDate, string payDay, string recordDate, int frequency)
    {
        Amount = amount;
        ExDividendDate = DateTime.Parse(exDate);
        DividendPayDate = DateTime.Parse(payDay);
        DividendRecordDate = DateTime.Parse(recordDate);
        Frequency = frequency;
    }

    public double Amount { get; set; }
    public DateTime ExDividendDate { get; set; }
    public DateTime DividendPayDate { get; set; }
    public DateTime DividendRecordDate { get; set; }
    public int Frequency { get; set; }
}
public class CompanyDividendYield
{
    public CompanyDividendYield(double yield, int frequency)
    {
        Yield = yield;
        Frequency = frequency switch
        {
            1 => "Annually",
            4 => "Quarterly",
            12 => "Monthly",
            _ => null
        };
    }

    public double Yield { get; set; }
    public string? Frequency { get; set; }
}
