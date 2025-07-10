// Fil: ./Services/DailyPuzzleService.cs
namespace waffle_backend.Services;

using waffle_backend.Models;

// Denne service er en singleton og har ansvaret for at levere
// det SAMME puslespil for en given dag.
public class DailyPuzzleService
{
    private readonly WaffleGeneratorService _generator;
    private readonly object _lock = new(); // Til trådsikkerhed
    private Puzzle? _cachedPuzzle;
    private DateTime? _cacheDate;

    public DailyPuzzleService(WaffleGeneratorService generator)
    {
        _generator = generator;
    }

    public Puzzle? GetDailyPuzzle()
    {
        // Vi bruger en lock for at sikre, at kun én tråd kan generere
        // dagens puslespil, hvis flere brugere rammer serveren på samme tid
        // lige efter midnat.
        lock (_lock)
        {
            // Vi bruger UTC-dato for at undgå tidszoneproblemer.
            var today = DateTime.UtcNow.Date;

            // Hvis cachen er tom, eller hvis den gemte dato er fra i går,
            // skal vi generere et nyt puslespil.
            if (_cachedPuzzle == null || !_cacheDate.HasValue || _cacheDate.Value != today)
            {
                // Bliv ved med at prøve, indtil et puslespil er genereret.
                // Dette er en sikkerhedsforanstaltning, hvis generator skulle fejle en sjælden gang.
                Puzzle? newPuzzle = null;
                while (newPuzzle == null)
                {
                    newPuzzle = _generator.GeneratePuzzle();
                }
                
                _cachedPuzzle = newPuzzle;
                _cacheDate = today;
            }

            return _cachedPuzzle;
        }
    }
}