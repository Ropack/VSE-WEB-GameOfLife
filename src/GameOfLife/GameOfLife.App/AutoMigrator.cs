using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace GameOfLife.App
{
    public class AutoMigrator
    {
        public void Migrate(IApplicationBuilder builder)
        {
            using var scope = builder.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope();
            using var ctx = scope.ServiceProvider.GetRequiredService<GameOfLifeAppContext>();

            ctx.Database.Migrate();
        }
    }
}