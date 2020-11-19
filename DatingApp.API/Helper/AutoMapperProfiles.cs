using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Model;

namespace DatingApp.API.Helper
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>().ForMember(destination => destination.PhotoUrl,
               opts => opts.MapFrom(source => source.Photos.FirstOrDefault(p => p.IsMain).Url))
               .ForMember(destination => destination.Age,
               opts => opts.MapFrom(source => source.DateOfBirth.calculateAge()));
            CreateMap<User, UserForDetailedDto>().ForMember(destination => destination.PhotoUrl,
               opts => opts.MapFrom(source => source.Photos.FirstOrDefault(p => p.IsMain).Url))
               .ForMember(destination => destination.Age,
               opts => opts.MapFrom(source => source.DateOfBirth.calculateAge()));
            CreateMap<Photo, PhotoForDetailedDto>();
            CreateMap<UserForUpdateDto, User>();
        }
    }
}