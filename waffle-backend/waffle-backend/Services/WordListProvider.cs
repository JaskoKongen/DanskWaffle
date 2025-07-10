// Fil: ./Services/WordListProvider.cs
namespace waffle_backend.Services;

// Denne service har ansvaret for at læse og levere ordlisten.
// Vi laver den som en singleton, så filen kun læses én gang.
public class WordListProvider
{
    private readonly List<string> _wordList;

    public WordListProvider()
    {
        string filePath = "./ord.tsv";
        _wordList = File.ReadLines(filePath)
            .Skip(1) // Spring header over
            .Select(line => line.Split('\t'))
            .Where(columns => columns.Length > 1)
            .Select(columns => columns[1].Trim().ToUpper())
            .Where(word => word.Length == 5 && word.All(char.IsLetter))
            .Distinct()
            .ToList();
    }

    public List<string> GetWords() => _wordList;
}