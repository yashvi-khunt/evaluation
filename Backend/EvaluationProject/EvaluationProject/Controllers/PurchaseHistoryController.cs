﻿using AutoMapper;
using EvaluationProject.DTOs;
using EvaluationProject.Models;
using Microsoft.AspNetCore.Mvc;
//using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace EvaluationProject.Controllers
{
    [ApiController]
    [Route("api/invoices")]
    public class PurchaseHistoryController : ControllerBase
    {

        private readonly EvaluationContext _context;
        private readonly IMapper mapper;

        public PurchaseHistoryController(EvaluationContext context, IMapper mapper)
        {
            this._context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<PurchaseHistoryListDTO>>> Get()
        {
            var purchaseHistories = await _context.PurchaseHistories
                .Where(m => m.IsDeleted == false)
                .Include(p => p.Manufacturer)
                .Include(p => p.Rate)
                .GroupBy(p => new { p.InvoiceId, p.Manufacturer.Name, p.Date })
                .Select(group => new PurchaseHistoryListDTO
                {
                    InvoiceId = group.Key.InvoiceId,
                    ManufacturerName = group.Key.Name,
                    Date = group.Key.Date,
                    GrandTotal = group.Sum(p => p.Rate.Amount * p.Quantity)
                }).ToListAsync();

            var purchaseHistoriesDTO = mapper.Map<List<PurchaseHistoryListDTO>>(purchaseHistories);
            return purchaseHistoriesDTO;
        }

        [HttpGet("{id}", Name = "getPurchaseHistory")]
        public async Task<ActionResult<List<PurchaseHistoryDTO>>> GetPurchaseHistoryByInvoiceId(int id)
        {
            var purchaseHistory = await _context.PurchaseHistories.Include(m => m.Manufacturer).Include(p => p.Product).Include(r => r.Rate).Where(m => m.IsDeleted == false && m.InvoiceId == id).ToListAsync();

            if (purchaseHistory == null) { return NotFound(); }
            var purchaseHistoryDTO = mapper.Map<List<PurchaseHistoryDTO>>(purchaseHistory);
            return purchaseHistoryDTO;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PurchaseHistoryCreationDTO purchaseHistoryCreation)
        {
            //some code for duplicate entry

            //
            var purchaseHistory = mapper.Map<PurchaseHistory>(purchaseHistoryCreation);
            _context.Add(purchaseHistory);
            await _context.SaveChangesAsync();

            var purchaseHistoryDTO = mapper.Map<PurchaseHistoryDTO>(purchaseHistory);

            return new CreatedAtRouteResult("getPurchaseHistory", new { id = purchaseHistory.Id }, purchaseHistoryDTO);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PurchaseHistoryCreationDTO purchaseHistoryCreation)
        {
            var purchaseHistoryDB = await _context.PurchaseHistories.Where(m => m.IsDeleted == false).FirstOrDefaultAsync(m => m.Id == id);

            if (purchaseHistoryDB == null) { return NotFound(); }

            mapper.Map(purchaseHistoryCreation, purchaseHistoryDB);
            _context.Entry(purchaseHistoryDB).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("invoiceId/{id}")]
        //[Route("invoiceId")]
        public async Task<ActionResult> DeleteByInvoiceId(int invoiceId)
        {
            var purchaseHistories = await _context.PurchaseHistories.Where(m => m.InvoiceId == invoiceId).ToListAsync();
            if (purchaseHistories == null) { return NotFound(); }

            //purchaseHistory.IsDeleted = true;
            foreach (var ph in purchaseHistories)
            {
                ph.IsDeleted = true;
                _context.Entry(ph).State = EntityState.Modified;
            }
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteById(int id)
        {
            var purchaseHistories = await _context.PurchaseHistories.SingleOrDefaultAsync(m => m.Id == id);
            if (purchaseHistories == null) { return NotFound(); }

           _context.PurchaseHistories.Remove(purchaseHistories);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("invoiceId")]
        public async Task<ActionResult<InvoiceIdDTO>> GetInvoiceId()
        {

            var inv = await _context.PurchaseHistories.MaxAsync(x => x.InvoiceId);
            var invoice = await _context.PurchaseHistories.FirstOrDefaultAsync(p => p.InvoiceId == inv);

            var result = mapper.Map<InvoiceIdDTO>(invoice);
            return result;

        }
        [HttpGet]
        [Route("count")]
        public async Task<IActionResult> GetInvoiceCount()
        {
            var count = await _context.PurchaseHistories
                .Where(m => m.IsDeleted == false)
                 .GroupBy(p => new { p.InvoiceId })
                .Select(group => new PurchaseHistoryListDTO
                {
                    InvoiceId = group.Key.InvoiceId,
                }).CountAsync();
            if (count == 0)
            {
                return NotFound();
            }
            return Ok(count);
        }


        [HttpGet]
        [Route("search")]
        public async Task<ActionResult<List<PurchaseHistoryListDTO>>> Get([FromQuery] int page = 1,
                                                                          [FromQuery] int pageSize = 10,
                                                                          [FromQuery] string? subStr = null,
                                                                          [FromQuery] int sortColumn = 0,
                                                                          [FromQuery] int sortOrder = 0
                                                                        )
        {
            if (page > pageSize || page <= 0 || pageSize <= 0)
            {
                return BadRequest();
            }

            IQueryable<PurchaseHistoryListDTO> query, phList;
            phList = _context.PurchaseHistories
                .Where(m => m.IsDeleted == false)
                .Include(p => p.Manufacturer)
                .Include(p => p.Rate)
                .GroupBy(p => new { p.InvoiceId, p.Manufacturer.Name, p.Date })
                .Select(group => new PurchaseHistoryListDTO
                {
                    InvoiceId = group.Key.InvoiceId,
                    ManufacturerName = group.Key.Name,
                    Date = group.Key.Date,
                    GrandTotal = group.Sum(p => p.Rate.Amount * p.Quantity)
                });


            switch (sortColumn)
            {
                case 1: //  InvoiceId (ascending)
                    query = sortOrder == 0 ? phList.OrderBy(ph => ph.InvoiceId) : phList.OrderByDescending(ph => ph.InvoiceId);
                    break;
                case 2: //  ManufacturerName (ascending)
                    query = sortOrder == 0 ? phList.OrderBy(ph => ph.ManufacturerName) : phList.OrderByDescending(ph => ph.ManufacturerName);
                    break;
                case 3: //  Date (ascending)
                    query = sortOrder == 0 ? phList.OrderBy(ph => ph.Date) : phList.OrderByDescending(ph => ph.Date);
                    break;
                case 4: //  GrandTotal (ascending)
                    query = sortOrder == 0 ? phList.OrderBy(ph => ph.GrandTotal) : phList.OrderByDescending(ph => ph.GrandTotal);
                    break;
                default: // Default (by InvoiceId ascending)
                    query = phList.OrderBy(ph => ph.InvoiceId);
                    break;
            }


            if (!string.IsNullOrEmpty(subStr))
            {
                query = query.Where(ph => ph.ManufacturerName.Contains(subStr) || ph.Date.ToString().Contains(subStr) || ph.InvoiceId.ToString().Contains(subStr) || ph.GrandTotal.ToString().Contains(subStr));
            }


            query = query.Skip((page - 1) * pageSize).Take(pageSize);

            var purchaseHistories = await query.ToListAsync();
            var purchaseHistoryDTOs = mapper.Map<List<PurchaseHistoryListDTO>>(purchaseHistories);
            return Ok(purchaseHistoryDTOs);
        }

    }
}
