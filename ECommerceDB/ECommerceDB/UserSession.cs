using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceDB
{
    public static class UserSession
    {
        // storing full customer object for current session
        public static Customer CurrentCustomer { get; set; }
    }
}
