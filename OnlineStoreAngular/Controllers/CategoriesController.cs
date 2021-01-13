using Microsoft.AspNetCore.Mvc;
using OnlineStoreAngular.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace OnlineStoreAngular.Controllers
{
    [ApiController]
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
            var categories = db.Categories.ToList();
            db.Dispose();
            return categories;
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

        [Authorize(Roles = "Admin")]
        [HttpPost("addCategory")]
        public IActionResult AddCategory([FromBody] Category newCategory)
        {
            try
            {
                if (newCategory != null && newCategory.Title.Length > 2)
                {
                    if (db.Categories.FirstOrDefault(x => x.Title == newCategory.Title) != null)
                    {
                        return StatusCode(400, "Category with same name already exist");
                    }

                    if (newCategory.ParentCategory == null)
                    {
                        db.Add(newCategory);
                        db.SaveChanges();
                        return StatusCode(200);
                    }

                    Category node = newCategory;
                    for (int a = 0; a < 3; a++)
                    {
                        if (node != null && node.ParentCategory == null)
                        {
                            db.Add(newCategory);
                            db.SaveChanges();
                            return StatusCode(200);
                        }

                        node = db.Categories.FirstOrDefault(x => x.Id == node.ParentCategory);
                    }
                }

                return StatusCode(400);
            }
            catch (Exception)
            {
                return StatusCode(400);
            }
        }
    }
}