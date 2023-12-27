using System;
using System.Collections.Generic;

namespace EvaluationProject.Models
{
    public partial class ManufacturerProductMapping
    {
        public int Id { get; set; }
        public int ManufacturerId { get; set; }
        public int ProductId { get; set; }
        public bool IsDeleted { get; set; }

        public virtual Manufacturer Manufacturer { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
