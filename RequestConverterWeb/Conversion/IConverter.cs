using RequestConverterWeb.Models;

namespace RequestConverterWeb.Conversion
{
    public interface IConverter
    {
        public string Convert(IRequest request);
    }
}
