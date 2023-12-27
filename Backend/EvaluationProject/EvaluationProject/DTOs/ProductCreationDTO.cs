//using Evaluation.Validations;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EvaluationProject.DTOs
{
    public class ProductCreationDTO
    {
        [Required]
        [StringLength(50)]
        //[FirstLetterCapital]
        public string Name { get; set; } = null!;
     
    }
}
 