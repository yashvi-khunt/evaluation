using AutoMapper;
using EvaluationProject.DTOs;
using EvaluationProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EvaluationProject.Controllers
{
    [ApiController]
    [Route("api/rates")]
    public class RateController : ControllerBase
    {
        private readonly EvaluationContext _context;
        private readonly IMapper mapper;

        public RateController(EvaluationContext context, IMapper mapper)
        {
            this._context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<RateDTO>>> Get()
        {
            var rates = await _context.Rates.Include(r => r.Product).Where(m => m.IsDeleted == false).ToListAsync();
            var ratesDTO = mapper.Map<List<RateDTO>>(rates);
            return ratesDTO;
        }

        [HttpGet("{id}", Name = "getRate")]
        public async Task<ActionResult<RateDTO>> GetRateById(int id)
        {
            var rate = await _context.Rates.Include(r => r.Product).Where(m => m.IsDeleted == false).FirstOrDefaultAsync(m => m.Id == id);

            if (rate == null) { return NotFound(); }
            var rateDTO = mapper.Map<RateDTO>(rate);
            return rateDTO;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] RateCreationDTO rateCreation)
        {

            //duplicate entry
            //    var isDuplicate = await _context.Rates
            //.AnyAsync(p => p.Name == rateCreation.Name && p.IsDeleted == false);
            //    if (isDuplicate)
            //    {
            //        // Handle duplicate entry, for example, return a conflict response
            //        return Conflict("Rate with the same name already exists.");
            //    }
            //    var rateDb = await _context.Rates.Include(r=>r.Product)
            //.FirstOrDefaultAsync(p => p.Amount
            //== rateCreation.Amount && p.IsDeleted == true);
            //    if (rateDb != null)
            //    {
            //        rateDb.IsDeleted = false;
            //        _context.Entry(rateDb).State = EntityState.Modified;
            //        await _context.SaveChangesAsync();
            //        var rateDbDTO = mapper.Map<RateDTO>(rateDb);
            //        return new CreatedAtRouteResult("getRate", new { id = rateDb.Id }, rateDbDTO);
            //    }



            var rate = mapper.Map<Rate>(rateCreation);
            _context.Add(rate);
            await _context.SaveChangesAsync();


            var rateDTO = mapper.Map<RateDTO>(rate);

            return new CreatedAtRouteResult("getRate", new { id = rate.Id }, rateDTO);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] RateCreationDTO rateCreation)
        {
            //duplicate entry

            //    var isDuplicate = await _context.Rates
            //.AnyAsync(p => p.Name == rateCreation.Name && p.IsDeleted == false);
            //    if (isDuplicate)
            //    {
            //        // Handle duplicate entry, for example, return a conflict response
            //        return Conflict("Rate with the same name already exists.");
            //    }
            var rateDB = await _context.Rates.Where(m => m.IsDeleted == false).FirstOrDefaultAsync(m => m.Id == id);


            if (rateDB == null) { return NotFound(); }

            mapper.Map(rateCreation, rateDB);
            _context.Entry(rateDB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var rate = await _context.Rates.FirstOrDefaultAsync(m => m.Id == id);
            if (rate == null) { return NotFound(); }

            rate.IsDeleted = true;
            _context.Entry(rate).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet]
        [Route("byProduct/{id}")]
        public async Task<ActionResult<RateDTO>> GetMaxRate(int id)
        {

            var rate = await _context.Rates.Include(r => r.Product).Where(m => m.IsDeleted == false).OrderByDescending(p => p.Date).FirstOrDefaultAsync(m => m.ProductId == id);

             if (rate == null) { return NotFound();}
                var rateDTO = mapper.Map<RateDTO>(rate);
                        return rateDTO;
        }
    }
}
