using System;

namespace OnlineStoreAngular.Models
{
    public interface IOrder
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double Cost { get; set; }
        public bool IsComplete { get; set; }
        public DateTime OrderDateTime { get; set; }
    }
}