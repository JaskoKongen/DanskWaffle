// Fil: ./Services/WaffleGeneratorService.cs
namespace waffle_backend.Services;

using waffle_backend.Models;

public class WaffleGeneratorService
{
    private readonly List<string> _wordList;
    private readonly Random _random = new();
    private readonly int[] _placementOrder = { 0, 4, 1, 3, 5, 2 }; // H1, V2, H2, V1, V3, H3

    public WaffleGeneratorService(WordListProvider wordProvider)
    {
        _wordList = wordProvider.GetWords().OrderBy(x => _random.Next()).ToList();
    }
    
    public Puzzle? GeneratePuzzle()
    {
        var solutionWords = FindSolution();
        if (solutionWords == null) return null;

        var solvedGrid = CreateSolvedGrid(solutionWords);
        var shuffledGrid = CreateShuffledGrid(solvedGrid);

        return new Puzzle
        {
            SolutionWords = new List<SolutionWord>
            {
                new() { Word = solutionWords[0], Orientation = "horizontal", Row = 0 },
                new() { Word = solutionWords[1], Orientation = "horizontal", Row = 2 },
                new() { Word = solutionWords[2], Orientation = "horizontal", Row = 4 },
                new() { Word = solutionWords[3], Orientation = "vertical", Col = 0 },
                new() { Word = solutionWords[4], Orientation = "vertical", Col = 2 },
                new() { Word = solutionWords[5], Orientation = "vertical", Col = 4 },
            },
            ShuffledLayout = shuffledGrid
        };
    }

    private string[]? FindSolution()
    {
        var solution = new string[6];
        return FindSolutionRecursive(0, solution) ? solution : null;
    }

    private bool FindSolutionRecursive(int step, string[] currentSolution)
    {
        if (step == 6) return true;

        int wordIndexToPlace = _placementOrder[step];
        var candidates = GetCandidateWords(wordIndexToPlace, currentSolution);

        foreach (var candidate in candidates)
        {
            currentSolution[wordIndexToPlace] = candidate;
            if (FindSolutionRecursive(step + 1, currentSolution)) return true;
        }

        currentSolution[wordIndexToPlace] = null!; 
        return false;
    }
    
    private List<string> GetCandidateWords(int wordIndex, string[] currentSolution)
    {
        string h1 = currentSolution[0], h2 = currentSolution[1], h3 = currentSolution[2];
        string v1 = currentSolution[3], v2 = currentSolution[4], v3 = currentSolution[5];
        
        var usedWords = new HashSet<string>(currentSolution.Where(w => w != null));
        IEnumerable<string> query = _wordList.Where(w => !usedWords.Contains(w));

        switch (wordIndex)
        {
            case 0: break;
            case 4: query = query.Where(w => w[0] == h1[2]); break;
            case 1: query = query.Where(w => w[2] == v2[2]); break;
            case 3: query = query.Where(w => w[0] == h1[0] && w[2] == h2[0]); break;
            case 5: query = query.Where(w => w[0] == h1[4] && w[2] == h2[4]); break;
            case 2: query = query.Where(w => w[0] == v1[4] && w[2] == v2[4] && w[4] == v3[4]); break;
        }
        return query.ToList();
    }

    private string?[,] CreateSolvedGrid(string[] solution)
    {
        var grid = new string?[5, 5];
        string h1 = solution[0], h2 = solution[1], h3 = solution[2];
        string v1 = solution[3], v2 = solution[4], v3 = solution[5];

        for (int i = 0; i < 5; i++) { grid[0, i] = h1[i].ToString(); }
        for (int i = 0; i < 5; i++) { grid[2, i] = h2[i].ToString(); }
        for (int i = 0; i < 5; i++) { grid[4, i] = h3[i].ToString(); }
        for (int i = 0; i < 5; i++) { grid[i, 0] = v1[i].ToString(); }
        for (int i = 0; i < 5; i++) { grid[i, 2] = v2[i].ToString(); }
        for (int i = 0; i < 5; i++) { grid[i, 4] = v3[i].ToString(); }

        return grid;
    }

    // --- NY OG KORREKT SHUFFLE-LOGIK BASERET PÅ DIN FEEDBACK ---
    private List<List<string?>> CreateShuffledGrid(string?[,] originalGrid)
    {
        var gridToShuffle = (string?[,])originalGrid.Clone();
        
        // 1. Find koordinaterne på alle 21 felter, der indeholder et bogstav.
        // De 4 tomme felter (hvor værdien er null) bliver automatisk ignoreret.
        var tileCoordinates = new List<(int r, int c)>();
        for (int r = 0; r < 5; r++)
        {
            for (int c = 0; c < 5; c++)
            {
                if (gridToShuffle[r, c] != null)
                {
                    tileCoordinates.Add((r, c));
                }
            }
        }

        // 2. Udfør præcis 10 tilfældige bytninger.
        int numberOfSwaps = 10;
        for (int i = 0; i < numberOfSwaps; i++)
        {
            // Vælg to forskellige, tilfældige positioner fra vores liste af 21 brikker.
            int index1 = _random.Next(tileCoordinates.Count);
            int index2;
            do
            {
                index2 = _random.Next(tileCoordinates.Count);
            } while (index1 == index2); // Sikrer at vi ikke bytter en brik med sig selv.

            var (r1, c1) = tileCoordinates[index1];
            var (r2, c2) = tileCoordinates[index2];

            // Byt bogstaverne på de to positioner.
            (gridToShuffle[r1, c1], gridToShuffle[r2, c2]) = (gridToShuffle[r2, c2], gridToShuffle[r1, c1]);
        }
        
        // 3. Konverter det blandede gitter til det format, som frontenden forventer.
        var result = new List<List<string?>>();
        for (int r = 0; r < 5; r++)
        {
            var row = new List<string?>();
            for (int c = 0; c < 5; c++)
            {
                row.Add(gridToShuffle[r, c]);
            }
            result.Add(row);
        }
        return result;
    }
}