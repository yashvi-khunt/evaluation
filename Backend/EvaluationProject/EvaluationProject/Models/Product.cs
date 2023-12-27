using System;
using System.Collections.Generic;

namespace EvaluationProject.Models
{
    public partial class Product
    {
        public Product()
        {
            ManufacturerProductMappings = new HashSet<ManufacturerProductMapping>();
            PurchaseHistories = new HashSet<PurchaseHistory>();
            Rates = new HashSet<Rate>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsDeleted { get; set; }

        public virtual ICollection<ManufacturerProductMapping> ManufacturerProductMappings { get; set; }
        public virtual ICollection<PurchaseHistory> PurchaseHistories { get; set; }
        public virtual ICollection<Rate> Rates { get; set; }
    }
}
