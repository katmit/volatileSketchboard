using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.SignalR;
using VolitileSketchboard.Models;

namespace VolatileSketchboard
{
    
    public class DrawingHub : Hub
    {
        private static SortedDictionary<string, List<string>> groups = new SortedDictionary<string, List<string>>();
        private static SortedDictionary<string, string> canvasStatePerGroup = new SortedDictionary<string, string>();

        private Random characterGenerator = new Random();
        private string allowedRoomCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        public Task JoinRoom(string roomName)
        {
            if (groups.ContainsKey(roomName))
            {
                groups[roomName].Add(Context.ConnectionId);
            }
            return Groups.Add(Context.ConnectionId, roomName);
        }

        public bool RoomExists(string roomName)
        {
            return groups.ContainsKey(roomName);
        }

        public Task LeaveRoom(string roomName, string userName)
        {
            if (groups.ContainsKey(roomName))
            {
                var connectionList = groups[roomName];
                if (connectionList.Contains(Context.ConnectionId))
                {
                    connectionList.Remove(Context.ConnectionId);
                }
                if(connectionList.Count == 0)
                {
                    groups.Remove(roomName);
                    canvasStatePerGroup.Remove(roomName);
                }
            }
            Send(roomName, "<strong>" + userName + "</strong> <i>has left the room.</i>");
            return Groups.Remove(Context.ConnectionId, roomName);
        }

        private string GenerateRoomID()
        {
            string result = "";
            for(int i = 0; i < 5; i++)
            {
                result += allowedRoomCharacters[characterGenerator.Next(0, allowedRoomCharacters.Length)];
            }
            if (groups.ContainsKey(result))
            {
                //try again
                result = GenerateRoomID();
            }
            return result;
        }

        public string CreateRoom()
        {
            string newGroupID = GenerateRoomID();
            groups.Add(newGroupID, new List<string>());
            canvasStatePerGroup.Add(newGroupID, "");
            return newGroupID;
        }

        public void Send(string groupName, string message)
        {
            // Call the addNewMessageToPage method to update clients in the group.
            Clients.Group(groupName).addNewMessageToPage(message);
        }

        public string GetCanvasState(string groupName)
        {
            if (canvasStatePerGroup.ContainsKey(groupName))
            {
                return canvasStatePerGroup[groupName];
            }
            return "";
        }

        //public void SendDrawing(string groupName, string newDrawingJson, string canvasStateJson)
        //{
        //    if (canvasStatePerGroup.ContainsKey(groupName))
        //    {
        //        canvasStatePerGroup[groupName] = canvasStateJson;
        //    }
        //    Clients.Group(groupName).addNewDrawingToCanvas(newDrawingJson);
        //}

        //public void ModifyDrawing(string groupName, string id, string existingDrawingJson, string canvasStateJson)
        //{
        //    if (canvasStatePerGroup.ContainsKey(groupName))
        //    {
        //        canvasStatePerGroup[groupName] = canvasStateJson;
        //    }
        //    Clients.Group(groupName).modifyExistingDrawing(id, existingDrawingJson);
        //}

        //public void RemoveDrawing(string groupName, string deletedDrawing, string canvasStateJson)
        //{
        //    if (canvasStatePerGroup.ContainsKey(groupName))
        //    {
        //        canvasStatePerGroup[groupName] = canvasStateJson;
        //    }

        //    Clients.Group(groupName).removeDrawingFromCampus(deletedDrawing);
        //}

        public void SyncCanvas(string groupName, string canvasStateJson)
        {
            if (canvasStatePerGroup.ContainsKey(groupName))
            {
                canvasStatePerGroup[groupName] = canvasStateJson;
            }

            Clients.Group(groupName).refreshCanvas(canvasStateJson);
        }
    }
}