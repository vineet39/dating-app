using System.Threading.Tasks;
using DatingApp.API.Model;
using DatingApp.API.Helper;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
         void Add<T>(T entity) where T:class;
         void Delete<T>(T entity) where T:class;
         Task<bool> SaveAll();
         Task<PagedList<User>> GetUsers(UserParams userParams);
         Task<User> GetUser(int id);   
         Task<Photo> GetPhoto(int id);   
         Task<Photo> GetPhotoByUser(int id);   
         Task<Like> GetLike(int userId, int recipientId);

    }
}