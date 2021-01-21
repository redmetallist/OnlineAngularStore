using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStoreAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;

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
                            Quantity = product.Quantity,
                            Cost = db.Products.First(x => x.Id == product.ProductId).Cost
                        };
                        db.ActiveOrders.Add(order);
                        db.Cart.Remove(product);
                        db.SaveChanges();
                    }

                    var databaseUserData = db.UsersData.FirstOrDefault(x => x.UserId == user.Id);
                    if (databaseUserData != null)
                    {
                        databaseUserData.Address = userData.Address;
                        databaseUserData.City = userData.City;
                        databaseUserData.Country = userData.Country;
                        databaseUserData.FirstName = userData.FirstName;
                        databaseUserData.LastName = userData.LastName;
                        databaseUserData.MobileNumber = userData.MobileNumber;
                        databaseUserData.Zipcode = userData.Zipcode;
                        db.UsersData.Update(databaseUserData);
                        db.SaveChanges();
                    }
                    else
                    {
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
                    }

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

        [Authorize(Roles = "Admin")]
        [HttpPost("getUserInfoFromOrder")]
        public IActionResult GetUserInfoFromOrder([FromBody] int userId)
        {
            try
            {
                return new JsonResult(db.UsersData.FirstOrDefault(x => x.UserId == userId));
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("completeOrder")]
        public IActionResult CompleteOrder([FromBody] int orderId)
        {
            try
            {
                var order = db.ActiveOrders.Where(x => x.OrderId == orderId).ToList();
                List<ArchiveOrder> archiveOrder = new List<ArchiveOrder>();
                foreach (var product in order)
                {
                    var prod = new ArchiveOrder()
                    {
                        UserId = product.UserId,
                        OrderId = product.OrderId,
                        IsComplete = true,
                        OrderDateTime = product.OrderDateTime,
                        ProductId = product.ProductId,
                        Quantity = product.Quantity,
                        Cost = product.Cost
                    };
                    archiveOrder.Add(prod);
                    db.ActiveOrders.Remove(product);
                }

                db.ArchiveOrders.AddRange(archiveOrder);
                db.SaveChanges();
                return StatusCode(200);
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}