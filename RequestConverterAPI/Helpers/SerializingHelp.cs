using Newtonsoft.Json;
using System.Text;

public static class ExtendedSerializerExtensions
{
    private static readonly JsonSerializerSettings SerializerSettings = new JsonSerializerSettings
    {
        TypeNameHandling = TypeNameHandling.Auto,
    };

    public static byte[] Serialize<T>(this T source)
    {
        var asString = JsonConvert.SerializeObject(source, SerializerSettings);
        return Encoding.Unicode.GetBytes(asString);
    }

    public static T Deserialize<T>(this byte[] source)
    {
        var asString = Encoding.Unicode.GetString(source);
        return JsonConvert.DeserializeObject<T>(asString);
    }
}
