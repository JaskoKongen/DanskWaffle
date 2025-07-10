// Fil: ./Models/Puzzle.cs
namespace waffle_backend.Models;

using System.Text.Json.Serialization;

public class Puzzle
{
    [JsonPropertyName("solutionWords")]
    public required List<SolutionWord> SolutionWords { get; set; }

    [JsonPropertyName("shuffledLayout")]
    public required List<List<string?>> ShuffledLayout { get; set; }
}