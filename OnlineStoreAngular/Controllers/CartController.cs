using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineStoreAngular.Models;
using System.Linq;

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

        

        //[Authorize(Roles = "User")]
        //[HttpGet("addToCart/{id}")]
        //public IActionResult GetProductDescription(int id)
        //{


        //    return StatusCode(404, $"404.Not found"); ;

        //}

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
                    //var exist = db.Cart.Any(x => x.UserId == user.Id && x.ProductId == product.Id);
                    //if (!exist)
                   
                        db.Cart.Add(new Cart {UserId = user.Id, ProductId = product.Id, Quantity = 1});
                        db.SaveChanges();
                        return StatusCode(200);
                    
                  //  else
                    //{
                   //     return StatusCode(200, "Product already exist");
                   // }
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

            return StatusCode(400);
        }
    }
}