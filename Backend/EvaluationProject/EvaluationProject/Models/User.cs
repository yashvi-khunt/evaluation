using System;
using System.Collections.Generic;

namespace EvaluationProject.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string? PasswordHash { get; set; }
        public string UserName { get; set; } = null!;
    }
}
