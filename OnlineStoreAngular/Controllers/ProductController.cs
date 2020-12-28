using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineStoreAngular.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

namespace OnlineStoreAngular.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private Context.AppContext db;

        public ProductController(Context.AppContext context)
        {
            db = context;
        }

        [HttpGet("image/{id}")]
        public IActionResult GetImage(int id)
        {
            string path = Directory.GetCurrentDirectory() + @"\Resources\Images\" + id;

            if (Directory.Exists(path))
            {
                try
                {
                    string[] filesInPaths = Directory.GetFiles(path);
                    /*var files = System.IO.Directory.EnumerateFiles(path, "*.*", SearchOption.AllDirectories)
                                .Where(x => x.EndsWith(".png") || x.EndsWith(".jpg"));*/

                    byte[] mas = System.IO.File.ReadAllBytes(filesInPaths[0]);
                    return File(mas, "image/png");
                }
                catch
                {
                    return StatusCode(502); //if cannot read file throw BadGateway status code
                }
            }

            return NotFound(id);
        }

        [HttpGet("description/{id}")]
        public IActionResult GetProductDescription(int id)
        {
            string path = Directory.GetCurrentDirectory() + @"\Resources\Images";

            if (Directory.Exists(path))
            {
                try
                {
                    Product pr = db.Products.FirstOrDefault(x => x.Id == id);
                    return Json(new Product
                    {
                        Id = pr.Id,
                        Title = pr.Title,
                        Description = pr.Description,
                        CategoryId = pr.CategoryId,
                        Cost = pr.Cost
                    });
                }
                catch
                {
                    return
                        StatusCode(500,
                            $"500. Internal server error"); //if cannot read from database throw InternalServer error status code                   
                }
            }

            return StatusCode(404, $"404.Not found");
        }

        [HttpGet("getAll")]
        public IActionResult GetAllProducts()
        {
            string path = Directory.GetCurrentDirectory() + @"\Resources\Images";

            if (Directory.Exists(path))
            {
                try
                {
                    var pr = db.Products.ToList();
                    db.Dispose();
                    return Json(pr);
                }
                catch
                {
                    return
                        StatusCode(500,
                            $"500. Internal server error"); //if cannot read from database throw InternalServer error status code                   
                }
            }

            return StatusCode(404, $"404.Not found");
            ;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("create")]
        public IActionResult CreateProduct(Product product)
        {
            db.Products.Add(product);
            db.SaveChanges();
            int id = product.Id;
            return Json(id);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}"), DisableRequestSizeLimit]
        public IActionResult Upload(int id)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images", id.ToString());
                if (!Directory.Exists(folderName))
                {
                    Directory.CreateDirectory(folderName + id);
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName + id);
                    if (file.Length > 0)
                    {
                        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var fullPath = Path.Combine(pathToSave, fileName);
                        var dbPath = Path.Combine(folderName, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }

                        return Ok(new {dbPath});
                    }
                    else
                        return BadRequest();
                }
                else
                {
                    return StatusCode(423, $"ObjectExist. Cannot create");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("getProductInCategory/{id}")]
        public IActionResult GetInCategory(int id)
        {
            var result = new List<Product>();
            result.AddRange(db.Products.ToList().Where(x => x.CategoryId == id));
            GetProductFromChild(id, ref result);
            return Json(result);
        }

        private void GetProductFromChild(int nodeId, ref List<Product> resultList)
        {
            foreach (var category in db.Categories.ToList().Where(x => x.ParentCategory == nodeId))
            {
                if (category.ParentCategory != null)
                {
                    GetProductFromChild(category.Id, ref resultList);
                }

                resultList.AddRange(db.Products.ToList().Where(x => x.CategoryId == category.Id));
            }
        }
    }
}