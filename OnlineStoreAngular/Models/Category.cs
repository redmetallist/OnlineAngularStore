namespace OnlineStoreAngular.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ParentCategory { get; set; }
    }
}

