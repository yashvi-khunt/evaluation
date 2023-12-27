namespace EvaluationProject.DTOs
{
    public class PurchaseHistoryListDTO
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }

        public string ManufacturerName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
