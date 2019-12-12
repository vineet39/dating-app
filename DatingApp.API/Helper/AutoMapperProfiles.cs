using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Model;

namespace DatingApp.API.Helper
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>();
        }
    }
}