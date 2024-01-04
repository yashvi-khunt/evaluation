using AutoMapper;
using EvaluationProject.DTOs;
using EvaluationProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EvaluationProject.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/mappings")]
    public class MappingController : ControllerBase
    {
        private readonly EvaluationContext _context;
        private readonly IMapper mapper;
        public MappingController(EvaluationContext context, IMapper mapper)
        {
            this._context = context;
            this.mapper = mapper;
        }


        [HttpGet]
        public async Task<ActionResult<List<MappingDTO>>> Get()
        {
            var mappings = await _context.ManufacturerProductMappings.Include(m => m.Manufacturer).Include(m=>m.Product).Where(m => m.IsDeleted == false && m.Manufacturer.IsDeleted == false && m.Product.IsDeleted == false).ToListAsync();
            var mappingsDTO = mapper.Map<List<MappingDTO>>(mappings);
            return mappingsDTO;
        }

        [HttpGet("{id}", Name = "getMapping")]
        public async Task<ActionResult<MappingDTO>> GetMappingById(int id)
        {
            var mapping = await _context.ManufacturerProductMappings.Include(m => m.Manufacturer).Include(m => m.Product).FirstOrDefaultAsync(m => m.Id == id);

            if (mapping == null) { return NotFound(); }
            var mappingDTO = mapper.Map<MappingDTO>(mapping);
            return mappingDTO;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MappingCreationDTO mappingCreation)
        {
            //duplicate entry
            var isDuplicate = await _context.ManufacturerProductMappings
        .AnyAsync(p => p.ManufacturerId == mappingCreation.ManufacturerId && p.ProductId == mappingCreation.ProductId && p.IsDeleted == false);
            if (isDuplicate)
            {
                // Handle duplicate entry, for example, return a conflict response
                return Conflict("Mapping with the same name already exists.");
            }
            var mappingDb = await _context.ManufacturerProductMappings
        .FirstOrDefaultAsync(p => p.ManufacturerId == mappingCreation.ManufacturerId && p.ProductId == mappingCreation.ProductId && p.IsDeleted == true);
            
            if (mappingDb != null)
            {
                mappingDb.IsDeleted = false;
                _context.Entry(mappingDb).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                var mappingDbDTO = mapper.Map<MappingDTO>(mappingDb);
                return new CreatedAtRouteResult("getMapping", new { id = mappingDb.Id }, mappingDbDTO);
            }



            var mapping = mapper.Map<ManufacturerProductMapping>(mappingCreation);
            _context.Add(mapping);
            await _context.SaveChangesAsync();


            var mappingDTO = mapper.Map<MappingDTO>(mapping);

            return new CreatedAtRouteResult("getMapping", new { id = mapping.Id }, mappingDTO);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MappingCreationDTO mappingCreation)
        {
            //duplicate entry

            var isItself = await _context.ManufacturerProductMappings.AnyAsync(p => p.Id == id && p.ProductId == mappingCreation.ProductId && p.ManufacturerId == mappingCreation.ManufacturerId);
            if (isItself)
            {
                return Conflict("No change");
            }
            var isDuplicate = await _context.ManufacturerProductMappings
        .AnyAsync(p => p.ProductId == mappingCreation.ProductId && p.ManufacturerId == mappingCreation.ManufacturerId);
            if (isDuplicate)
            {
                // Handle duplicate entry, for example, return a conflict response
                return Conflict("Mapping with the same name already exists.");
            }
            //
            var mappingDB = await _context.ManufacturerProductMappings.FirstOrDefaultAsync(m => m.Id == id);

            if (mappingDB == null) { return NotFound(); }

            mapper.Map(mappingCreation, mappingDB);
            _context.Entry(mappingDB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var mapping = await _context.ManufacturerProductMappings.FirstOrDefaultAsync(m => m.Id == id);
            if (mapping == null) { return NotFound(); }

            mapping.IsDeleted = true;
            _context.Entry(mapping).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
