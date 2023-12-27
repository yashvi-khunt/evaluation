using System;
using System.Collections.Generic;

namespace EvaluationProject.Models
{
    public partial class Rate
    {
        public Rate()
        {
            PurchaseHistories = new HashSet<PurchaseHistory>();
        }

        public int Id { get; set; }
        public float Amount { get; set; }
        public DateTime Date { get; set; }
        public int ProductId { get; set; }
        public bool IsDeleted { get; set; }

        public virtual Product Product { get; set; } = null!;
        public virtual ICollection<PurchaseHistory> PurchaseHistories { get; set; }
    }
}
