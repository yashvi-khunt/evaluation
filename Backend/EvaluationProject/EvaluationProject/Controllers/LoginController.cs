using AutoMapper;
using EvaluationProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics.Metrics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EvaluationProject.Controllers
{


    [ApiController]
    
    public class LoginController : ControllerBase
    {
        private readonly EvaluationContext _context;

        public LoginController(EvaluationContext context, IMapper mapper)
        {
            this._context = context;
        }

        [HttpPost]
        [Route("/api/login")]
        public async Task<IActionResult> Login(User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == user.UserName);

            if (existingUser == null || existingUser.PasswordHash != user.PasswordHash)
            {
                return Unauthorized();
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("evaluationAPIkey12345");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, existingUser.UserName),
                }),
                Expires = DateTime.UtcNow.AddHours(50),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);


            return Ok(new { Token = tokenString, });
        }
        [HttpPost]
        [Route("/api/register")]
        public async Task<IActionResult> Register(User user)
        {

            _context.Add(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }

}
