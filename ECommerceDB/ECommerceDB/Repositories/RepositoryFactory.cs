using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerceDB.Repositories
{
    public static class RepositoryFactory
    {
        public static bool UseStoredProcedures { get; set; } = false;

        public static IECommerceRepository CreateRepository()
        {
            if (UseStoredProcedures)
            {
                return new StoredProcedureRepository();
            }
            else
            {
                return new LinqRepository();
            }
        }

    }
}
