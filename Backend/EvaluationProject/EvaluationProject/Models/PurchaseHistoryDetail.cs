using System;
using System.Collections.Generic;

namespace EvaluationProject.Models
{
    public partial class PurchaseHistoryDetail
    {
        public int Id { get; set; }
        public int PurchaseHistoryId { get; set; }
        public int RateId { get; set; }
        public int Quantity { get; set; }

        public virtual PurchaseHistory PurchaseHistory { get; set; } = null!;
        public virtual Rate Rate { get; set; } = null!;
    }
}
