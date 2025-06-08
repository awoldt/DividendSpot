using Npgsql;

public class Db
{
  public NpgsqlDataSource _db { get; set; }

  public Db(NpgsqlDataSource db)
  {
    _db = db;
  }

  public async Task<Company?> GetCompanyDetails(string tickerQuery)
  {
    try
    {
      // will fetch data stored about the company from db
      await using var command = _db.CreateCommand("SELECT * FROM assets WHERE asset_ticker = @ticker;");
      command.Parameters.AddWithValue("ticker", tickerQuery);

      await using var reader = await command.ExecuteReaderAsync();
      if (!reader.HasRows) return null;

      while (await reader.ReadAsync())
      {
        int id = reader.GetInt32(reader.GetOrdinal("asset_id"));
        string name = reader.GetString(reader.GetOrdinal("asset_name"));
        string ticker = reader.GetString(reader.GetOrdinal("asset_ticker"));

        string? description = reader.IsDBNull(reader.GetOrdinal("asset_description")) ? null : reader.GetString(reader.GetOrdinal("asset_description"));
        string? websiteUrl = reader.IsDBNull(reader.GetOrdinal("asset_website_url")) ? null : reader.GetString(reader.GetOrdinal("asset_website_url"));
        string? address = reader.IsDBNull(reader.GetOrdinal("asset_address")) ? null : reader.GetString(reader.GetOrdinal("asset_address"));
        string? phone = reader.IsDBNull(reader.GetOrdinal("asset_phone_number")) ? null : reader.GetString(reader.GetOrdinal("asset_phone_number"));

        int assetType = reader.GetInt32(reader.GetOrdinal("fk_asset_type"));


        return new Company(id, name, ticker, description, websiteUrl, address, phone, null, assetType);
      }
      return null;
    }
    catch (System.Exception err)
    {
      Console.WriteLine(err);
      return null;
    }
  }

  public async Task<RelatedCompany[]?> GetRelatedCompanies(string[]? relatedTickers)
  {
    if (relatedTickers == null) return null;

    try
    {
      await using var command = _db.CreateCommand("SELECT * FROM assets WHERE asset_ticker = ANY(@relatedTickers)");
      command.Parameters.AddWithValue("relatedTickers", relatedTickers);

      await using var reader = await command.ExecuteReaderAsync();
      if (!reader.HasRows) return null;

      List<RelatedCompany> relatedCompanies = new List<RelatedCompany>();
      while (await reader.ReadAsync())
      {
        var name = reader.GetString(reader.GetOrdinal("asset_name"));
        var ticker = reader.GetString(reader.GetOrdinal("asset_ticker"));
        relatedCompanies.Add(new RelatedCompany(ticker, name));
      }

      return relatedCompanies.ToArray();
    }
    catch (System.Exception err)
    {
      Console.WriteLine(err);
      return null;
    }
  }

  public async Task<CompanySearchResults[]?> SearchCompany(string query)
  {
    try
    {
      await using var command = _db.CreateCommand("SELECT * FROM assets WHERE asset_ticker = UPPER(@q1) ORDER BY asset_name LIMIT 10;");
      command.Parameters.AddWithValue("q1", query);

      await using var command2 = _db.CreateCommand("SELECT * FROM assets WHERE asset_name ILIKE @q1 ORDER BY asset_name LIMIT 10;");
      command2.Parameters.AddWithValue("q1", $"%{query}%");

      await using var reader = await command.ExecuteReaderAsync();
      await using var reader2 = await command2.ExecuteReaderAsync();

      if (!reader.HasRows && !reader2.HasRows) return null;

      List<CompanySearchResults> companies = new List<CompanySearchResults>();
      while (await reader.ReadAsync())
      {
        var name = reader.GetString(reader.GetOrdinal("asset_name"));
        var ticker = reader.GetString(reader.GetOrdinal("asset_ticker"));
        companies.Add(new CompanySearchResults(ticker, name));
      }

      while (await reader2.ReadAsync())
      {
        var name = reader2.GetString(reader2.GetOrdinal("asset_name"));
        var ticker = reader2.GetString(reader2.GetOrdinal("asset_ticker"));
        companies.Add(new CompanySearchResults(ticker, name));
      }

      return companies.ToArray();
    }
    catch (System.Exception err)
    {
      Console.WriteLine(err);
      return null;
    }
  }
}