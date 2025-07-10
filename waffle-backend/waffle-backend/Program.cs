// Fil: ./Program.cs
using waffle_backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Definer en CORS-politik, så din Angular-app (på localhost:4200) må kalde API'et
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "http://10.139.13.207:4200") // URL for din Angular dev server
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Tilføj services til dependency injection-containeren.
builder.Services.AddControllers();
builder.Services.AddSingleton<WordListProvider>();
builder.Services.AddTransient<WaffleGeneratorService>();
builder.Services.AddSingleton<DailyPuzzleService>(); // <-- NY LINJE

var app = builder.Build();

// Konfigurer HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp"); // Anvend CORS-politikken

app.UseAuthorization();

app.MapControllers();

app.Run();