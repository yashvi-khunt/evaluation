using System;
namespace EvaluationProject.DTOs
{
    public class RateDTO
    {
        public int Id { get; set; }
        public float Amount { get; set; }
        public DateTime Date { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
    }
}



