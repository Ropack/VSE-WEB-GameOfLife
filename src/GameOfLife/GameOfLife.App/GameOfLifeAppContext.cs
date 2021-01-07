using GameOfLife.App.Areas.Identity.Data;
using GameOfLife.App.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GameOfLife.App
{
    public class GameOfLifeAppContext : IdentityDbContext<GameOfLifeAppUser>
    {
        public DbSet<Game> Games { get; set; }

        public GameOfLifeAppContext(DbContextOptions<GameOfLifeAppContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
