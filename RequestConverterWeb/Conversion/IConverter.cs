using RequestConverterSSR.Models;

namespace RequestConverterSSR.Conversion
{
    public interface IConverter
    {
        public string Convert(IRequest request);
    }
}
