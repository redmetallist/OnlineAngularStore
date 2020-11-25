using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineStoreAngular.Models
{
    public class UserData
    {
        [ForeignKey("User")]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Address { get; set; }
        //public string? Address2 { get; set; }
        public string? City { get; set; }
        public int? Zipcode { get; set; }
        public string? Country { get; set; }

        public virtual User User { get; set; }
    }
}
