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
        [HttpGet("getOrders")]
        public IActionResult GetOrders()
        {
            var username = User.Identity.Name;
          
                try
                {
                    var user = db.Users.First(x => x.Email == username);
                    var activeOrders = db.ActiveOrders.ToList().Where(x => x.UserId == user.Id);
                    var archiveOrders = db.Orders.ToList().Where(x => x.UserId == user.Id);
                    IEnumerable<Order> result = activeOrders.Concat(archiveOrders);

                    return new JsonResult(result);
                       
                }
                catch
                {
                    return StatusCode(500, "Internal server error");
                }
                
        }
    }
}
