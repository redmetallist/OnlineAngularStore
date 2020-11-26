using Microsoft.AspNetCore.Mvc;
using OnlineStoreAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineStoreAngular.Controllers
{
    [ApiController]
    //[Route("categories")]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private Context.AppContext db;
        public CategoriesController(Context.AppContext context)
        {
            db = context;
        }

        [HttpGet]
        public IEnumerable<Category> Get()
        {
            return db.Categories.ToList();

        }

        [HttpPost]
        public IEnumerable<Category> Post(Category category)
        {
            try
            {
                List<Category> categories = db.Categories.ToList();
                if (category.ParentCategory == null || categories.Exists(x => x.Id == category.ParentCategory))
                {
                    db.Categories.Add(category);
                    db.SaveChanges();
                    return db.Categories.ToList();
                }
                else
                    return categories;
            }
            catch
            {
                List<Category> categories = new List<Category>();
                categories.Add(category);
                return categories;
            }

        }

    }
}
