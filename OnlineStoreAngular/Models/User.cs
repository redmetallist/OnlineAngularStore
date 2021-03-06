﻿namespace OnlineStoreAngular.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public virtual UserData UserData { get; set; }
    }
}
