// Fil: ./Controllers/PuzzleController.cs
using Microsoft.AspNetCore.Mvc;
using waffle_backend.Models;
using waffle_backend.Services;

namespace waffle_backend.Controllers;

[ApiController]
[Route("api/[controller]")] // Ruten bliver /api/puzzle
public class PuzzleController : ControllerBase
{
    private readonly WaffleGeneratorService _randomGenerator;
    private readonly DailyPuzzleService _dailyPuzzleService; // <-- NY

    // Opdateret constructor til at injecte begge services
    public PuzzleController(WaffleGeneratorService randomGenerator, DailyPuzzleService dailyPuzzleService)
    {
        _randomGenerator = randomGenerator;
        _dailyPuzzleService = dailyPuzzleService;
    }

    // NYT ENDPOINT: Henter det samme puslespil for den aktuelle dag
    [HttpGet("daily")]
    public ActionResult<Puzzle> GetDailyPuzzle()
    {
        var puzzle = _dailyPuzzleService.GetDailyPuzzle();
        // Da DailyPuzzleService nu garanterer et puslespil, kan vi fjerne null-check.
        return Ok(puzzle);
    }

    // OPRINDELIGT ENDPOINT: Bruges nu til "Free Play" mode
    [HttpGet("random")] // Giver en mere specifik rute: /api/puzzle/random
    public ActionResult<Puzzle> GetRandomPuzzle()
    {
        var puzzle = _randomGenerator.GeneratePuzzle();

        if (puzzle == null)
        {
            return NotFound("Kunne ikke generere et puslespil med den givne ordliste.");
        }

        return Ok(puzzle);
    }
}