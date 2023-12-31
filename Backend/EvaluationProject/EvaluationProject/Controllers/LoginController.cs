using Microsoft.AspNetCore.Mvc;

namespace EvaluationProject.Controllers
{
 

[ApiController]
    [Route("/api/login")]
    public class LoginController : ControllerBase
    {
        [HttpPost]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Implement your authentication logic here
            // Check the username and password against your database or any other authentication mechanism

            // For simplicity, I'm using a hardcoded check
            if (model.Username == "admin@abc" && model.Password == "Admin@123")
            {
                return Ok(new { message = "Login successful" });
            }
            else
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

}
