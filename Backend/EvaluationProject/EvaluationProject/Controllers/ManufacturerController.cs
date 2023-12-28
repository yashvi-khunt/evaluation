using AutoMapper;
using EvaluationProject.DTOs;
using EvaluationProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EvaluationProject.Controllers
{
    [ApiController]
    [Route("api/manufacturers")]
    public class ManufacturerController : ControllerBase
    {
        private readonly EvaluationContext _context;
        private readonly IMapper mapper;

        public ManufacturerController(EvaluationContext context, IMapper mapper)
        {
            this._context = context;
            this.mapper = mapper;
        }



        [HttpGet]
        public async Task<ActionResult<List<ManufacturerDTO>>> Get()
        {
            var manufacturers = await _context.Manufacturers.Where(m => m.IsDeleted == false).ToListAsync();
            var manufacturersDTO = mapper.Map<List<ManufacturerDTO>>(manufacturers);
            return manufacturersDTO;
        }

        [HttpGet]
        [Route("forInvoice")]
        public async Task<ActionResult<List<ManufacturerDTO>>> GetManufacturersForInvoice()
        {
            var manufacturers = await _context.Manufacturers
                .Include(m => m.ManufacturerProductMappings)
                .Where(m => m.IsDeleted == false)
                .Join(_context.ManufacturerProductMappings,mid=>mid.Id,mp => mp.ManufacturerId,(mid,mp) => new Manufacturer { Id = mid.Id, Name = mid.Name}).Distinct()
                .ToListAsync();
            var manufacturersDTO = mapper.Map<List<ManufacturerDTO>>(manufacturers);
            return manufacturersDTO;
        }

        [HttpGet("{id}", Name = "getManufacturer")]
        public async Task<ActionResult<ManufacturerDTO>> GetManufacturerById(int id)
        {
            var manufacturer = await _context.Manufacturers.Where(m => m.IsDeleted == false).FirstOrDefaultAsync(m => m.Id == id);

            if (manufacturer == null) { return NotFound(); }
            var manufacturerDTO = mapper.Map<ManufacturerDTO>(manufacturer);
            return manufacturerDTO;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ManufacturerCreationDTO manufacturerCreation)
        {

            //duplicate entry
            var isDuplicate = await _context.Manufacturers
        .AnyAsync(p => p.Name == manufacturerCreation.Name && p.IsDeleted == false);
            if (isDuplicate)
            {
                // Handle duplicate entry, for example, return a conflict response
                return Conflict("Product with the same name already exists.");
            }
            var manufacturerDb = await _context.Manufacturers
        .FirstOrDefaultAsync(p => p.Name == manufacturerCreation.Name && p.IsDeleted == true);
            if (manufacturerDb != null)
            {
                manufacturerDb.IsDeleted = false;
                _context.Entry(manufacturerDb).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                var manufacturerDbDTO = mapper.Map<ManufacturerDTO>(manufacturerDb);
                return new CreatedAtRouteResult("getManufacturer", new { id = manufacturerDb.Id }, manufacturerDbDTO);
            }



            var manufacturer = mapper.Map<Manufacturer>(manufacturerCreation);
            _context.Add(manufacturer);
            await _context.SaveChangesAsync();


            var manufacturerDTO = mapper.Map<ManufacturerDTO>(manufacturer);

            return new CreatedAtRouteResult("getManufacturer", new { id = manufacturer.Id }, manufacturerDTO);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] ManufacturerCreationDTO manufacturerCreation)
        {
            //duplicate entry

            var isDuplicate = await _context.Manufacturers
        .AnyAsync(p => p.Name == manufacturerCreation.Name && p.IsDeleted == false);
            if (isDuplicate)
            {
                // Handle duplicate entry, for example, return a conflict response
                return Conflict("Product with the same name already exists.");
            }
            var manufacturerDB = await _context.Manufacturers.Where(m => m.IsDeleted == false).FirstOrDefaultAsync(m => m.Id == id);


            if (manufacturerDB == null) { return NotFound(); }

            mapper.Map(manufacturerCreation, manufacturerDB);
            _context.Entry(manufacturerDB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var manufacturer = await _context.Manufacturers.FirstOrDefaultAsync(m => m.Id == id);
            if (manufacturer == null) { return NotFound(); }

            manufacturer.IsDeleted = true;
            _context.Entry(manufacturer).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
