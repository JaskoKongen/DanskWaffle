// Fil: ./Models/SolutionWord.cs
namespace waffle_backend.Models;

// JsonPropertyName bruges til at sikre, at outputtet er camelCase, som JavaScript forventer.
using System.Text.Json.Serialization;

public class SolutionWord
{
    [JsonPropertyName("word")]
    public required string Word { get; set; }

    [JsonPropertyName("orientation")]
    public required string Orientation { get; set; }

    [JsonPropertyName("row")]
    public int? Row { get; set; }

    [JsonPropertyName("col")]
    public int? Col { get; set; }
}