using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using DatingApp.API.Helper;
using System.Security.Claims;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {   

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            
            var userFromRepo = await _repo.GetUser(currentUserId);

            userParams.UserId = currentUserId;

            if(!string.IsNullOrEmpty(userParams.Gender) && userParams.Gender != "undefined") {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male"; 
            }

            var users = await _repo.GetUsers(userParams);

            var userToReturn = _mapper.Map<IEnumerable<UserForDetailedDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(userToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            // if(id!= int.Parse(Users.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();
           
            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto,userFromRepo);

            if(await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating user failed on save"); 
        }
        
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            // if(id!= int.Parse(Users.FindFirst(ClaimTypes.NameIdentifier).Value))
            //     return Unauthorized();
            if(await _repo.GetUser(recipientId) == null)
                return NotFound();
                
            var like = await _repo.GetLike(id, recipientId);

            if(like != null)
                return BadRequest("You already like this user");
            
            like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };

            _repo.Add<Like>(like);
            
            if(await _repo.SaveAll())
                return NoContent();
            
            return BadRequest("Failed to like user");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetPhotoAsMain(int id)
        {   
            
            var newMainPhoto = await _repo.GetPhoto(id);

            if(newMainPhoto.IsMain)
            {
                return BadRequest("This is already your main photo");
            }
            
            var currentMainPhoto = await _repo.GetPhotoByUser(newMainPhoto.UserId);

            currentMainPhoto.IsMain = false;
            newMainPhoto.IsMain = true;
            
            if(await _repo.SaveAll())
                return NoContent();
            
            return BadRequest("Could not set photo as main");
        }
    }
}