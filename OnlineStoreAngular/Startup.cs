using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Http;
using OnlineStoreAngular.Models;
using System;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace OnlineStoreAngular
{
    public class Startup
    {
        private string _contentRootPath = "";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            var contentRoot = configuration.GetValue<string>(WebHostDefaults.ContentRootKey);

        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<FormOptions>(o => {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            //services.AddAuthentication("CookieAuthentication")
            //     .AddCookie("CookieAuthentication", config =>
            //     {
            //         config.Cookie.Name = "UserLoginCookie";
            //         config.LoginPath = "/login";
            //     });


            //// Get JWT Token Settings from JwtSettings.json file
            //JwtSettings settings;
            //settings = GetJwtSettings();
            //services.AddSingleton<JwtSettings>(settings);
            //// Register Jwt as the Authentication service
            //services.AddAuthentication(options =>
            //{
            //    options.DefaultAuthenticateScheme = "JwtBearer";
            //    options.DefaultChallengeScheme = "JwtBearer";
            //})
            //.AddJwtBearer("JwtBearer", jwtBearerOptions =>
            //{
            //    jwtBearerOptions.TokenValidationParameters =
            //  new TokenValidationParameters
            //      {
            //          ValidateIssuerSigningKey = true,
            //          IssuerSigningKey = new SymmetricSecurityKey(
            //      Encoding.UTF8.GetBytes(settings.Key)),
            //          ValidateIssuer = true,
            //          ValidIssuer = settings.Issuer,

            //          ValidateAudience = true,
            //          ValidAudience = settings.Audience,

            //          ValidateLifetime = true,
            //          ClockSkew = TimeSpan.FromMinutes(
            //             settings.MinutesToExpiration)
            //      };
            //});

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                  .AddJwtBearer(options =>
                  {
                      options.RequireHttpsMetadata = false;
                      options.TokenValidationParameters = new TokenValidationParameters
                      {
                            // укзывает, будет ли валидироваться издатель при валидации токена
                            ValidateIssuer = true,
                            // строка, представляющая издателя
                            ValidIssuer = AuthOptions.ISSUER,

                            // будет ли валидироваться потребитель токена
                            ValidateAudience = true,
                            // установка потребителя токена
                            ValidAudience = AuthOptions.AUDIENCE,
                            // будет ли валидироваться время существования
                            ValidateLifetime = true,

                            // установка ключа безопасности
                            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                            // валидация ключа безопасности
                            ValidateIssuerSigningKey = true,
                      };
                  });



            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // получаем строку подключения из файла конфигурации
            string connection = Configuration.GetConnectionString("AppDatabase");
            // добавляем контекст в качестве сервиса в приложение
            services.AddDbContext<Context.AppContext>(options =>
                options.UseSqlServer(connection));
            services.AddControllers();

            

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            _contentRootPath = env.ContentRootPath;
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }


            app.UseRouting();
            // who are you?
            app.UseAuthentication();

            // are you allowed?
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {

                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "/{controller}/{action=Index}/{id?}");





            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }

        public JwtSettings GetJwtSettings()
        {
            JwtSettings settings = new JwtSettings();

            settings.Key = Configuration["JwtSettings:key"];
            settings.Audience = Configuration["JwtSettings:audience"];
            settings.Issuer = Configuration["JwtSettings:issuer"];
            settings.MinutesToExpiration = Convert.ToInt32(Configuration["JwtSettings:minutesToExpiration"]);

            return settings;
        }
    }
}
