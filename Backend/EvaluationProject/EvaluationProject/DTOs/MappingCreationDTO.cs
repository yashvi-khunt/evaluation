using EvaluationProject.Validations;

namespace EvaluationProject.DTOs
{
    public class MappingCreationDTO
    {
        [RestrictNegativeValue]
        public int ManufacturerId { get; set; }
        [RestrictNegativeValue]
        public int ProductId { get; set; }
    }
}
