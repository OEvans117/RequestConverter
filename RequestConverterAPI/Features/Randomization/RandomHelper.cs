namespace RequestConverterAPI.Features.Randomization
{
    public static class RandomHelper
    {
        static readonly Random random = new();
        public static string RandomString(int length = 6)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray()).ToLower();
        }
    }
}
