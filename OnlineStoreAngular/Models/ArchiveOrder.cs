using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineStoreAngular.Models
{
    public class ArchiveOrder: IOrder
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public bool IsComplete { get; set; }
        public DateTime OrderDateTime { get; set; }
    }
}
