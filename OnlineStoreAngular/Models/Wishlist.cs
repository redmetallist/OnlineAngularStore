namespace OnlineStoreAngular.Models
{
    public class Wishlist
    {
        public int Id { get; set; }
        public User User { get; set; }
        public Product Product { get; set; }
    }
}