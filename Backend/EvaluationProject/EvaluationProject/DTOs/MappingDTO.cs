using EvaluationProject.Validations;

namespace EvaluationProject.DTOs
{
    public class MappingDTO
    {

        public int Id { get; set; }
        [RestrictNegativeValue]
        public int ManufacturerId { get; set; }
        [RestrictNegativeValue]
        public int ProductId { get; set; }

        public string ManufacturerName { get; set; }
        public string ProductName { get; set; }
    }
}
