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
using Microsoft.AspNetCore.Authorization;

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



            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                  .AddJwtBearer(options =>
                  {
                      options.RequireHttpsMetadata = false;
                      options.TokenValidationParameters = new TokenValidationParameters
                      {
                          // ��������, ����� �� �������������� �������� ��� ��������� ������
                          ValidateIssuer = true,
                          // ������, �������������� ��������
                          ValidIssuer = AuthOptions.ISSUER,

                          // ����� �� �������������� ����������� ������
                          ValidateAudience = true,
                          // ��������� ����������� ������
                          ValidAudience = AuthOptions.AUDIENCE,
                          // ����� �� �������������� ����� �������������
                          ValidateLifetime = true,

                          // ��������� ����� ������������
                          IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                          // ��������� ����� ������������
                          ValidateIssuerSigningKey = true,
                      };
                  });

            

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            // �������� ������ ����������� �� ����� ������������
            string connection = Configuration.GetConnectionString("AppDatabase");
            // ��������� �������� � �������� ������� � ����������
            services.AddDbContext<Context.AppContext>(options =>
                options.UseSqlServer(connection));
            services.AddControllers();
            services.AddMvc();


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
            app.UseAuthentication();     
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

   
    }
}
