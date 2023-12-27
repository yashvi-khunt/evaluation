using System;
namespace EvaluationProject.DTOs
{
    public class PurchaseHistoryDTO
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }

        public int ManufacturerId { get; set; }
        public string ManufacturerName { get; set; } = string.Empty;
        public int ProductId { get; set; }

        public string ProductName { get; set; } = string.Empty;
        public int RateId { get; set; }

        public float RateAmount { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
    }
}

