using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace OnlineStoreAngular.Models
{
    public class AuthOptions
    {
        public const string ISSUER = "OnlineStoreServer";
        public const string AUDIENCE = "OnlineStoreClient";
        const string KEY = "OnlineStoreClientsecretKey";
        public const int LIFETIME = 2;

        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}