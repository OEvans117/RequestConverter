using RequestConverterAPI.Models;
using System.IO.Compression;
using System.Runtime.Serialization.Formatters.Binary;

namespace RequestConverterAPI.Helpers
{
    public class CompressionHelper
    {
        public static string Compress(byte[] bytes)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var brotliStream = new BrotliStream(memoryStream, CompressionLevel.SmallestSize))
                {
                    brotliStream.Write(bytes, 0, bytes.Length);
                }
                return Convert.ToBase64String(memoryStream.ToArray());
            }
        }

        public static string Decompress(byte[] bytes)
        {
            using (var memoryStream = new MemoryStream(bytes))
            {
                using (var outputStream = new MemoryStream())
                {
                    using (var decompressStream = new BrotliStream(memoryStream, CompressionMode.Decompress))
                    {
                        decompressStream.CopyTo(outputStream);
                    }
                    return Convert.ToBase64String(outputStream.ToArray());
                }
            }
        }
    }
}
