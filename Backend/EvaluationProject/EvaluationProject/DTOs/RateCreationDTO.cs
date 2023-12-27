using EvaluationProject.Validations;
using System;
namespace EvaluationProject.DTOs
{
	public class RateCreationDTO
	{
		[RestrictNegativeValue]
		public float Amount { get; set; }
		public DateTime Date { get; set; }
		[RestrictNegativeValue]
		public int ProductId { get; set; }
	}
}

