
using System.ComponentModel.DataAnnotations;

namespace EvaluationProject.DTOs
{
    public class ManufacturerCreationDTO
    {
        [Required]
        [StringLength(50)]
        public string Name {  get; set; }
    }
}
