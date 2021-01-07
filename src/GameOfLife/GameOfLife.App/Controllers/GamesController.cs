using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using GameOfLife.App.Areas.Identity.Data;
using GameOfLife.App.Dtos;
using GameOfLife.App.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Metadata;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Logging;

namespace GameOfLife.App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GamesController : ControllerBase
    {
        private readonly ILogger<GamesController> _logger;
        private readonly GameOfLifeAppContext dbContext;
        private readonly UserManager<GameOfLifeAppUser> userManager;

        public GamesController(ILogger<GamesController> logger, GameOfLifeAppContext dbContext, UserManager<GameOfLifeAppUser> userManager)
        {
            _logger = logger;
            this.dbContext = dbContext;
            this.userManager = userManager;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var games = dbContext
                .Games
                .Where(x => x.OwnerUserId == User.FindFirst(ClaimTypes.NameIdentifier).Value)
                .ToList();
            return new PartialViewResult()
            {
                ViewName = "_SavedGamesPartial",
                ViewData = new ViewDataDictionary<IEnumerable<Game>>(new ViewDataDictionary(new EmptyModelMetadataProvider(), ModelState), games),
            };
        }

        [HttpPost]
        public IActionResult Post([FromBody] GameDto gameDto)
        {

            dbContext.Games.Add(new Game()
            {
                CreatedDateTime = DateTime.Now,
                IsPublic = gameDto.IsPublic,
                Title = gameDto.Title,
                Data = gameDto.Data,
                OwnerUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value
            });

            dbContext.SaveChanges();

            return Ok();
        }
    }
}