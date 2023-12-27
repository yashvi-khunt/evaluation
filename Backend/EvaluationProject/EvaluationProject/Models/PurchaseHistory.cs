using System;
using System.Collections.Generic;

namespace EvaluationProject.Models
{
    public partial class PurchaseHistory
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public int ManufacturerId { get; set; }
        public int ProductId { get; set; }
        public int RateId { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
        public bool IsDeleted { get; set; }

        public virtual Manufacturer Manufacturer { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
        public virtual Rate Rate { get; set; } = null!;
    }
}
