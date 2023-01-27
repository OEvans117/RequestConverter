using Microsoft.Extensions.Configuration;
using RequestConverterAPI.Context;
using Microsoft.EntityFrameworkCore;
using RequestConverterAPI.Features.RequestAnalysis;
using RequestConverterAPI.Features.RequestConversion;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<RequestConverterContext>(
    options => options.UseSqlServer(builder.Configuration["ConnectionString"]));
builder.Services.AddScoped<RequestsFileConverter>();
builder.Services.AddScoped<RequestAnalyser>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(x => x.AllowAnyMethod()
                  .AllowAnyHeader()
                  .SetIsOriginAllowed(origin => true) // allow any origin
.AllowCredentials());

app.Run();
