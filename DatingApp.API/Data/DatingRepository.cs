using System;
using System.Threading.Tasks;
using DatingApp.API.Model;
using Microsoft.EntityFrameworkCore;
using DatingApp.API.Helper;
using System.Linq;
using System.Collections.Generic;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private DataContext _context { get; set; }
        public DatingRepository(DataContext context)
        {
            this._context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public Task<User> GetUser(int id)
        {
            return _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(user => user.Id == id);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =  _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive)
            .AsQueryable();
            
            users = users.Where(u => u.Id != userParams.UserId);

            if(!string.IsNullOrEmpty(userParams.Gender) && userParams.Gender != "undefined") 
            {
                users = users.Where(u => u.Gender == userParams.Gender);
            }

            if(userParams.Likees)
            {   
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if(userParams.Likers)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }
            Console.WriteLine("........................."+userParams.MinAge);
            if(!string.IsNullOrEmpty(userParams.MinAge.ToString()))
            {
                if((userParams.MinAge != 18 && userParams.MinAge != 0)  || (userParams.MaxAge != 99 && userParams.MaxAge != 0)) 
                {
                    var minDob = DateTime.Today.AddYears((int)(-userParams.MaxAge - 1));
                    var maxDob = DateTime.Today.AddYears((int)-userParams.MinAge);
                
                    users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
                }
            }
            

            if(!string.IsNullOrEmpty(userParams.OrderBy) && userParams.OrderBy != "undefined") 
            {
                switch(userParams.OrderBy)
                {   
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default: 
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => 
                u.LikerId == userId && u.LikeeId == recipientId);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id,bool likers)
        {
            var user = await _context.Users
                .Include(x => x.Likers)
                .Include(x => x.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);
            
            if(likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

         public async Task<Photo> GetPhotoByUser(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.UserId == id && p.IsMain == true);

            return photo;
        }
    }
}