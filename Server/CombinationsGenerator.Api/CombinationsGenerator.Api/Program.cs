using CombinationsGenerator.Application.Services;
using CombinationsGenerator.Application.Services.Interfaces;
using CombinationsGenerator.Domain.Services;
using CombinationsGenerator.Domain.Services.Abstractions;
using CombinationsGenerator.Infrastructure.Storage;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register dependencies
builder.Services.AddSingleton<IPermutationGenerator, PermutationGenerator>();
builder.Services.AddSingleton<IStateStorage, InMemoryStateStorage>();
builder.Services.AddSingleton<CombinationService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular client
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
