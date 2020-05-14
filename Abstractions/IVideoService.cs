using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VideoChatWebapp.Models;

namespace VideoChatWebapp.Abstractions
{
    public interface IVideoService
    {
        string GetTwilioJwt(string identity);
        Task<IEnumerable<RoomDetails>> GetAllRoomsAsync();
    }

}
