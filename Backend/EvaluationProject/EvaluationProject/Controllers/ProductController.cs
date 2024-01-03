using AutoMapper;
using EvaluationProject.DTOs;
using EvaluationProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace EvaluationProject.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly EvaluationContext _context;
        private readonly IMapper mapper;

        public ProductController(EvaluationContext context, IMapper mapper)
        {
            this._context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDTO>>> Get()
        {
            var products = await _context.Products.Where(m => m.IsDeleted == false).ToListAsync();
            var productsDTO = mapper.Map<List<ProductDTO>>(products);
            return productsDTO;
        }

        [HttpGet("allProducts")]
        public async Task<ActionResult<List<ProductDTO>>> GetAllProducts()
        {
            var products = await _context.Products.ToListAsync();
            var productsDTO = mapper.Map<List<ProductDTO>>(products);
            return productsDTO;
        }

        [HttpGet("{id}", Name = "getProduct")]
        public async Task<ActionResult<ProductDTO>> GetProductById(int id)
        {
            var product = await _context.Products.Where(m => m.IsDeleted == false).FirstOrDefaultAsync(m => m.Id == id);

            if (product == null) { return NotFound(); }
            var productDTO = mapper.Map<ProductDTO>(product);
            return productDTO;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ProductCreationDTO productCreation)
        {

            //duplicate entry
            var isDuplicate = await _context.Products
        .AnyAsync(p => p.Name == productCreation.Name && p.IsDeleted == false);
            if (isDuplicate)
            {
                // Handle duplicate entry, for example, return a conflict response
                return Conflict("Product with the same name already exists.");
            }
            var productDb = await _context.Products
        .FirstOrDefaultAsync(p => p.Name == productCreation.Name && p.IsDeleted == true);
            if (productDb != null)
            {
                productDb.IsDeleted = false;
                _context.Entry(productDb).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                var productDbDTO = mapper.Map<ProductDTO>(productDb);
                return new CreatedAtRouteResult("getProduct", new { id = productDb.Id }, productDbDTO);
            }



            var product = mapper.Map<Product>(productCreation);
            _context.Add(product);
            await _context.SaveChangesAsync();


            var productDTO = mapper.Map<ProductDTO>(product);

            return new CreatedAtRouteResult("getProduct", new { id = product.Id }, productDTO);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] ProductCreationDTO productCreation)
        {
            var isItself = await _context.Products.AnyAsync(p => p.Id == id && p.Name == productCreation.Name);
            if (isItself)
            {
                return Conflict("No change");
            }
            //duplicate entry

            var isDuplicate = await _context.Products
        .AnyAsync(p => p.Name == productCreation.Name && p.IsDeleted == false);
            if (isDuplicate)
            {
                // Handle duplicate entry, for example, return a conflict response
                return Conflict("Product with the same name already exists.");
            }
            var productDB = await _context.Products.Where(m => m.IsDeleted == false).FirstOrDefaultAsync(m => m.Id == id);


            if (productDB == null) { return NotFound(); }

            mapper.Map(productCreation, productDB);
            _context.Entry(productDB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(m => m.Id == id);
            if (product == null) { return NotFound(); }

            product.IsDeleted = true;
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("byManufacturer/{id}")]
        public async Task<ActionResult<List<ProductDTO>>> GetProductsByPartyId(int id)
        {
            //var products = await _context.Products.Include(p => p.ManufacturerProductMappings).Join().ToListAsync();

            var products = await (from product in _context.Products
                            join mapping in _context.ManufacturerProductMappings on product.Id equals mapping.ProductId
                            join party in _context.Manufacturers on mapping.ManufacturerId equals party.Id
                                  join rate in _context.Rates on product.Id equals rate.ProductId
                                  where party.Id == id && party.IsDeleted == false && mapping.IsDeleted == false && product.IsDeleted == false
                            select new ProductDTO
                            {
                                Id = product.Id,
                                Name = product.Name
                            }).Distinct().ToListAsync();


            var productsDTO = mapper.Map<List<ProductDTO>>(products);
            return productsDTO;
        }

        [HttpGet]
        [Route("byInvoice/{id}")]
        public async Task<ActionResult<List<ProductDTO>>> GetProductsByPartyIdForInvoice(int id)
        {
            //var products = await _context.Products.Include(p => p.ManufacturerProductMappings).Join().ToListAsync();

            var products = await (from product in _context.Products
                                  join mapping in _context.ManufacturerProductMappings on product.Id equals mapping.ProductId
                                  join party in _context.Manufacturers on mapping.ManufacturerId equals party.Id
                                  join rate in _context.Rates on product.Id equals rate.ProductId
                                  where party.Id == id && party.IsDeleted == false && mapping.IsDeleted == false
                                  select new ProductDTO
                                  {
                                      Id = product.Id,
                                      Name = product.Name
                                  }).Distinct().ToListAsync();


            var productsDTO = mapper.Map<List<ProductDTO>>(products);
            return productsDTO;
        }
    }
}
