using System.Threading.Tasks;
using System.Collections.Generic;
using DatingApp.API.Model;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
         void Add<T>(T entity) where T:class;
         void Delete<T>(T entity) where T:class;
         Task<bool> Save();
         Task<IEnumerable<User>> GetUsers();
         Task<User> GetUser(int id);     

    }
}