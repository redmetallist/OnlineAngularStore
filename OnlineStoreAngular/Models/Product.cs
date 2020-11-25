using System.Collections.Generic;

namespace OnlineStoreAngular.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Descriprion { get; set; }
        public string ImagePath { get; set; }
        public string IsSavedImage { get; set; }
        public virtual ICollection<Category> Categories { get; set; }
    }
}
