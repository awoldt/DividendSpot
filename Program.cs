using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var databaseConnectionString = builder.Configuration.GetConnectionString("postgres");
if (databaseConnectionString == null) return;
var databaseSource = NpgsqlDataSource.Create(databaseConnectionString);
builder.Services.AddSingleton(databaseSource);
builder.Services.AddSingleton<Db>();
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<CustomCache>();
builder.Services.AddHttpClient();
builder.Services.AddSingleton<PgonUtils>();
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
