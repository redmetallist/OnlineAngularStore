using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OnlineStoreAngular.Models;

namespace OnlineStoreAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishListController : Controller
    {
        private readonly Context.AppContext db;

        public WishListController(Context.AppContext context)
        {
            db = context;
        }

        [Authorize(Roles = "User")]
        [HttpPost("addToWish")]
        public IActionResult AddToWish([FromBody] int id)
        {
            var username = User.Identity.Name;
            try
            {
                if (db.Wishlist.FirstOrDefault(x => x.ProductId == id && x.UserId == db.Users.First(z => z.Email == username).Id) == null)

                {
                    if (db.Products.FirstOrDefault(x => x.Id == id) != null)
                    {
                        db.Wishlist.Add(
                            new Wishlist() {UserId = db.Users.First(x => x.Email == username).Id, ProductId = id});
                        db.SaveChanges();
                        return StatusCode(200);
                    }

                    return StatusCode(400, $"Product with id = {id} not found");
                }

                return StatusCode(403, "Product already in wishlist");
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "User")]
        [HttpDelete("removeFromWish/{id}")]
        public IActionResult RemoveFromWish(int id)
        {
            var username = User.Identity.Name;
            try
            {
                var product = db.Wishlist.FirstOrDefault(x => x.ProductId == id && x.UserId == db.Users.First(z => z.Email == username).Id);
                if (product != null)

                {
                    db.Wishlist.Remove(product);
                    db.SaveChanges();
                    return StatusCode(200);
                }

                return StatusCode(403, "Product not exist in wishlist");
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }


        [Authorize(Roles = "User")]
        [HttpGet("getWish")]
        public IActionResult GetWish()
        {
            var username = User.Identity.Name;
            try
            {
                return Json(db.Wishlist.ToList().Where(x=> x.UserId==db.Users.First(z=> z.Email==username).Id));
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}