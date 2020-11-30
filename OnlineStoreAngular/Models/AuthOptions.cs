using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace OnlineStoreAngular.Models
{
    public class AuthOptions
    {
        public const string ISSUER = "OnlineStoreServer"; // издатель токена
        public const string AUDIENCE = "OnlineStoreClient"; // потребитель токена
        const string KEY = "OnlineStoreClientsecretKey";   // ключ для шифрации
        public const int LIFETIME = 1; // время жизни токена - 1 минута
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
