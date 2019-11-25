using System;
using System.Threading.Tasks;
using DatingApp.API.Model;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data

{
    public class AuthRepository : IAuthRepository
    {
        public AuthRepository(DataContext _context)
        {
            this._context = _context;

        }
        public DataContext _context { get; set; }

        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.userName == username);

            if(user == null)
            {
                return null;
            }

            if(!(verifyPassword(password, user.passwordHash, user.passwordSalt)))
            {
                return null;
            }

            return user;
        }

        private bool verifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {   
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i = 0;i <= computedHash.Length -1; i++)
                {
                    if(computedHash[i] != passwordHash[i])
                        return false;
                }
            }
            return true;
        }  

         public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.FirstOrDefaultAsync(x => x.userName == username) == null)
                return false;
            return true;
        }

        public void Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            createPasswordHash(password, out passwordHash, out passwordSalt);

            user.passwordHash = passwordHash;
            user.passwordSalt = passwordSalt;

            _context.Users.AddAsync(user);
             _context.SaveChangesAsync();
             
        }

        private void createPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {   
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}