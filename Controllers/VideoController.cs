﻿using System.Threading.Tasks;
using VideoChatWebapp.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace VideoChatWebapp.Controllers
{
    [
        ApiController,
        Route("api/video")
    ]
    public class VideoController : ControllerBase
    {
        readonly IVideoService _videoService;

        public VideoController(IVideoService videoService)
            => _videoService = videoService;

        [HttpGet("token")]
        public IActionResult GetToken()
            => new JsonResult(new { token = _videoService.GetTwilioJwt(User.Identity.Name) });

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms()
            => new JsonResult(await _videoService.GetAllRoomsAsync());
    }
}