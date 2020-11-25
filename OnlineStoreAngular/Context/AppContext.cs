using Microsoft.EntityFrameworkCore;
using OnlineStoreAngular.Models;

namespace OnlineStoreAngular.Context
{
    public class AppContext : DbContext
    {
        public AppContext(DbContextOptions<AppContext> options)
           : base(options)
        {
            //Database.EnsureDeleted();

            Database.EnsureCreated();   // создаем базу данных при первом обращении

            // 
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserData> UsersData { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}
