using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using OnlineStoreAngular.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace OnlineStoreAngular.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private Context.AppContext db;

        public LoginController(Context.AppContext context)
        {
            db = context;
        }

        private string Role(User user)
        {
            var searchedUser = db.Users.First(f => f.Email == user.Email);
            return searchedUser.Role;
        }

        [HttpPost("login")]
        public IActionResult Post(User user)
        {
            var searchedUser = db.Users.FirstOrDefault(f => f.Email == user.Email);
            if (searchedUser != null)
            {
                if (searchedUser.PasswordHash == user.PasswordHash)
                {
                    var userClaims = new List<Claim>()
                    {
                        new Claim(ClaimsIdentity.DefaultNameClaimType, user.Email),
                        new Claim(ClaimsIdentity.DefaultRoleClaimType, Role(user))
                    };
                    ClaimsIdentity claimsIdentity = new ClaimsIdentity(userClaims, "Token",
                        ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

                    var now = DateTime.UtcNow;
                    // создаем JWT-токен
                    var jwt = new JwtSecurityToken(issuer: AuthOptions.ISSUER, audience: AuthOptions.AUDIENCE,
                        notBefore: now, claims: userClaims,
                        expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(),
                            SecurityAlgorithms.HmacSha256));
                    var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

                    var response = new {access_token = encodedJwt, username = user.Email};

                    return Json(response);
                }
            }

            return BadRequest(new {errorText = "Invalid username or password."});
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (user.Email != null && user.PasswordHash != null && user.PasswordHash.Length >= 6)
            {
                var isUniqueEmail = db.Users.FirstOrDefault(x => x.Email == user.Email);

                if (isUniqueEmail == null)
                {
                    if (user.Email != null)
                        try
                        {
                            db.Users.Add(new User()
                            {
                                Email = user.Email,
                                PasswordHash = user.PasswordHash,
                                Role = UserRole.User.ToString()
                            });
                            db.SaveChanges();
                          //  return StatusCode(200, "New user successfully added");
                           return Ok();
                        }
                        catch
                        {
                            return StatusCode(500);
                        }
                }

                return StatusCode(400);
            }

            return StatusCode(400);
        }
    }
}