using System;
using System.ComponentModel.DataAnnotations.Schema;
using GameOfLife.App.Areas.Identity.Data;

namespace GameOfLife.App.Model
{
    public class Game
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Data { get; set; }
        public DateTime CreatedDateTime { get; set; }
        public bool IsPublic { get; set; }
        [ForeignKey(nameof(OwnerUserId))]
        public GameOfLifeAppUser OwnerUser { get; set; }
        public string OwnerUserId { get; set; }
    }
}