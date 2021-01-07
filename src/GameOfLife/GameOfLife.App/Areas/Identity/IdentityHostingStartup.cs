using System;
using GameOfLife.App.Areas.Identity.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: HostingStartup(typeof(GameOfLife.App.Areas.Identity.IdentityHostingStartup))]
namespace GameOfLife.App.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
                services.AddDbContext<GameOfLifeAppContext>(options =>
                    options.UseSqlServer(
                        context.Configuration.GetConnectionString("GameOfLifeAppContextConnection")));

                services.AddDefaultIdentity<GameOfLifeAppUser>(options => options.SignIn.RequireConfirmedAccount = false)
                    .AddEntityFrameworkStores<GameOfLifeAppContext>();

                services.Configure<IdentityOptions>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequiredLength = 6;
                    options.Password.RequiredUniqueChars = 1;


                    // Default SignIn settings.
                    options.SignIn.RequireConfirmedEmail = false;
                    options.SignIn.RequireConfirmedPhoneNumber = false;
                });
            });
        }
    }
}