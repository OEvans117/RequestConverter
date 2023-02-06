using RequestConverterAPI.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RequestConverterAPI.Test.RequestTest
{
    public class RequestConversionTest
    {
        [Fact]
        public void ConvertRequest_ReturnException()
        {
            var requestService = new RequestController();
        }
    }
}
