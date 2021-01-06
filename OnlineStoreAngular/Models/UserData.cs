

namespace OnlineStoreAngular.Models
{
    public class UserData
    {
       // [DatabaseGenerated(DatabaseGeneratedOption.Identity), Key()]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public int? Zipcode { get; set; }
        public string? Country { get; set; }
        public string MobileNumber { get; set; }

        
    }
}
