using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using OnlineStoreAngular.Models;

namespace OnlineStoreAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : Controller
    {
        private Context.AppContext db;

        public OrderController(Context.AppContext context)
        {
            db = context;
        }

        [Authorize]
        [HttpGet("getUserOrders")]
        public IActionResult GetUserOrders()
        {
            var username = User.Identity.Name;

            try
            {
                var user = db.Users.First(x => x.Email == username);
                var activeOrders = db.ActiveOrders.Where(x => x.UserId == user.Id).ToList();
                var archiveOrders = db.ArchiveOrders.Where(x => x.UserId == user.Id).ToList();
                List<IOrder> resultOrders = new List<IOrder>();
                resultOrders.AddRange(activeOrders);
                resultOrders.AddRange(archiveOrders);
                return new JsonResult(resultOrders);
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize]
        [HttpPost("doOrder")]
        public IActionResult DoOrder([FromBody] UserData userData)
        {
            var username = User.Identity.Name;

            try
            {
                var user = db.Users.First(x => x.Email == username);
                var userCart = db.Cart.Where(x => x.UserId == user.Id).ToList();
                if (userCart.Count > 0)
                {
                    int orderId = userCart[0].Id;
                    foreach (var product in userCart)
                    {
                        var order = new ActiveOrder()
                        {
                            UserId = user.Id,
                            OrderId = orderId,
                            IsComplete = false,
                            OrderDateTime = DateTime.Now,
                            ProductId = product.ProductId,
                            Quantity = product.Quantity
                        };
                        db.ActiveOrders.Add(order);
                        db.Cart.Remove(product);
                        db.SaveChanges();
                    }

                    userData = new UserData()
                    {
                        UserId = user.Id,
                        Address = userData.Address,
                        City = userData.City,
                        Country = userData.Country,
                        FirstName = userData.FirstName,
                        LastName = userData.LastName,
                        MobileNumber = userData.MobileNumber,
                        Zipcode = userData.Zipcode
                    };
                    db.UsersData.Add(userData);
                    db.SaveChanges();

                    return StatusCode(200);
                }

                return StatusCode(400, "Cart on server is empty");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error" + ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("getActiveOrders")]
        public IActionResult GetActiveOrders()
        {
            try
            {
                return new JsonResult(db.ActiveOrders.ToList());
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}