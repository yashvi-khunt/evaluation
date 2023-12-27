using EvaluationProject.Validations;

namespace EvaluationProject.DTOs
{
    public class PurchaseHistoryCreationDTO
    {
        [RestrictNegativeValue]
        public int InvoiceId { get; set; }
        [RestrictNegativeValue]
        public int ManufacturerId { get; set; }
        [RestrictNegativeValue]
        public int ProductId { get; set; }
        [RestrictNegativeValue]
        public int RateId { get; set; }
        [RestrictNegativeValue]
        public int Quantity { get; set; }
        public DateTime Date { get; set; }


    }
}
