using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OnlineStoreAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OnlineStoreAngular.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private Context.AppContext db;
        public LoginController(Context.AppContext context, ILogger<LoginController> logger)
        {
            db = context;
            _logger = logger;
        }
        private readonly ILogger<LoginController> _logger;

        [HttpGet]
        public IActionResult Get()
        {
            if (ModelState.IsValid)
            {

                return Ok();
            }
            return BadRequest(ModelState);
        }

        private string Role(User user)
        {
            var searchedUser = db.Users.First(f => f.Email == user.Email);
            return searchedUser.Role;
        }

        [HttpPost]
        public JsonResult Post(User user)
        {
            string role = "error";
            var users = new User();
            var searchedUser = db.Users.First(f => f.Email == user.Email);
            if (searchedUser.PasswordHash == user.PasswordHash)
            {
                var userClaims = new List<Claim>()
                    {
                    new Claim(ClaimTypes.Email, user.Email),
                     new Claim(ClaimTypes.Hash, user.PasswordHash),
                      new Claim(ClaimTypes.Role, Role(user)),
                   };
                role = searchedUser.Role.ToString();

                var grandmaIdentity = new ClaimsIdentity(userClaims, "User Identity");

                var userPrincipal = new ClaimsPrincipal(new[] { grandmaIdentity });
                HttpContext.SignInAsync(userPrincipal);
               

            }
            return new JsonResult( role);

        }


    }
}
