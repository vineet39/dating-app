using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DatingApp.API.Helper;
using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using System.Linq;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _mapper = mapper;
            _repo = repo;
            _cloudinaryConfig = cloudinaryConfig;

            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }
        [HttpGet("{id}", Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }
        
        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreatedDto photoForCreatedDto)
        {
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
           
            var userFromRepo = await _repo.GetUser(userId);

            var file = photoForCreatedDto.File;

            if(file == null)
            {
                return BadRequest("No image/file sent to upload");
            }

            var uploadedResult = new ImageUploadResult();

            if(file.Length > 0)
            {
                using(var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                            Transformation = new Transformation()
                                .Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadedResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreatedDto.Url = uploadedResult.Url.ToString();
            photoForCreatedDto.PublicId = uploadedResult.PublicId.ToString();

            var photo = _mapper.Map<Photo>(photoForCreatedDto);

            if(!userFromRepo.Photos.Any(u => u.IsMain))
            {
                photo.IsMain = true;
            }

            userFromRepo.Photos.Add(photo);
            
            if(await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { id = photo.Id, userId = userId }, photoToReturn);
            }
            
            return BadRequest("Could not upload photo");
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int id)
        {   
            var photoToBeDeleted = await _repo.GetPhoto(id);

            if(photoToBeDeleted.IsMain)
            {
                return BadRequest("Cannot delete main photo");
            }
            
            if(photoToBeDeleted.PublicId != null)
            {
                var deleteParams = new DeletionParams(photoToBeDeleted.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

            }

            _repo.Delete(photoToBeDeleted);

            if(await _repo.SaveAll())
                return NoContent();
            
            return BadRequest("Could not delete photo");
        }
    }
}