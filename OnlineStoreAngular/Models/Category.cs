
using System;

namespace OnlineStoreAngular.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? ParentCategory { get; set; }

        public static implicit operator Category(int v)
        {
            throw new NotImplementedException();
        }
    }
}

