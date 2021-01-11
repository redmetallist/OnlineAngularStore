using System;
using System.Collections.Immutable;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStoreAngular.Models;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace OnlineStoreAngular.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : Controller
    {
        private Context.AppContext db;

        public CartController(Context.AppContext context)
        {
            db = context;
        }

        [HttpPost("addToCart")]
        public IActionResult AddToCart([FromBody] int id)
        {
            var username = User.Identity.Name; //if not auth or token expired =null
            if (username != null)
            {
                try
                {
                    var user = db.Users.First(x => x.Email == username);
                    var product = db.Products.First(x => x.Id == id);
                    var exist = db.Cart.FirstOrDefault(x => x.UserId == user.Id && x.ProductId == product.Id);
                    if (exist == null)
                    {
                        db.Cart.Add(new Cart {UserId = user.Id, ProductId = product.Id, Quantity = 1});
                        db.SaveChanges();
                        return StatusCode(200);
                    }

                    return StatusCode(403, "Product already exist");
                }
                catch
                {
                    return StatusCode(500, "Internal server error");
                }
            }

            return StatusCode(200, "Not authorized. Cart only local");
        }

        //[Authorize]
        [HttpGet("getCart")]
        public IActionResult GetCart()
        {
            var username = User.Identity.Name;
            if (username != null)
            {
                try
                {
                    var user = db.Users.First(x => x.Email == username.ToString());
                    var cart = db.Cart.ToList().Where(x => x.UserId == user.Id);

                    return new JsonResult(cart);
                }
                catch
                {
                    return StatusCode(500, "Internal server error");
                }
            }

            return StatusCode(401);
        }

        [Authorize]
        [HttpDelete("RemoveFromCart/{id}")]
        public IActionResult RemoveFromCart(int id)
        {
            var username = User.Identity.Name;
            if (username != null)
            {
                try
                {
                    var user = db.Users.First(x => x.Email == username.ToString());
                    var cart = db.Cart.First(x => x.UserId == user.Id && x.ProductId == id);
                    db.Cart.Remove(cart);

                    db.SaveChanges();

                    return StatusCode(200);
                }
                catch
                {
                    return StatusCode(500, "Internal server error");
                }
            }

            return StatusCode(401);
        }

        [Authorize]
        [HttpPost("changeQuantity/{id}/{quantity}")]
        public IActionResult ChangeQuantity(int id, int quantity)
        {
            if (quantity > 0)
            {
                var username = User.Identity.Name;

                try
                {
                    var user = db.Users.First(x => x.Email == username);
                    var product = db.Products.First(x => x.Id == id);
                    var exist = db.Cart.FirstOrDefault(x => x.UserId == user.Id && x.ProductId == product.Id);

                    if (exist != null)
                    {
                        if (quantity == exist.Quantity)
                        {
                            return StatusCode(200);
                        }

                        exist.Quantity = quantity;
                        db.SaveChanges();
                        return StatusCode(200);
                    }

                    db.Cart.Add(new Cart {UserId = user.Id, ProductId = product.Id, Quantity = quantity});
                    db.SaveChanges();
                    return StatusCode(200);
                }
                catch
                {
                    return StatusCode(500, "Internal server error");
                }
            }

            return StatusCode(403, "Bad request");
        }
    }
}