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
                Database.EnsureCreated();
            
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserData> UsersData { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Cart { get; set; }
        public DbSet<Wishlist> Wishlist { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Order> ActiveOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasData(
               new Category[]
               {
                   new Category{Id=1, Title="Electronics"},
                     new Category{Id=2, Title="Mobile Phones", ParentCategory= 1},
                         new Category{Id=3, Title="Samsung", ParentCategory= 2},
                         new Category{Id=4, Title="Asus", ParentCategory= 2},
                         new Category{Id=5, Title="Nokia", ParentCategory= 2},
                         new Category{Id=6, Title="iPhone", ParentCategory= 2},
                         new Category{Id=7, Title="Oppo", ParentCategory= 2},
                         new Category{Id=8, Title="Xiaomi", ParentCategory= 2},
                         new Category{Id=9, Title="Realme", ParentCategory= 2},
                         new Category{Id=10, Title="Huawei", ParentCategory= 2},
                     new Category{Id=11, Title="Video Games", ParentCategory= 1}, //id=11
                         new Category{Id=12, Title="Consoles", ParentCategory= 11},
                         new Category{Id=13, Title="Games", ParentCategory= 11}
               });
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Email = "admin@admin.onlinestore", Role = UserRole.Admin.ToString(), PasswordHash = "admin123"},
                new User { Id = 2, Email = "user@user.onlinestore", Role = UserRole.User.ToString(), PasswordHash = "user123" });
            modelBuilder.Entity<Product>().HasData(
               new Product{Id = 1, Title="Samsung Galaxy A71", Description="Some description", CategoryId=3, Cost = 500},
            new Product { Id = 2, Title = "Asus Zenfone2", Description = "ZE551ML", CategoryId= 4, Cost = 230},
            new Product { Id = 3, Title = "Nokia Lumia 920", Description = "Some description", CategoryId = 5, Cost = 200});
            base.OnModelCreating(modelBuilder);
        }
    }
}
