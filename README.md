**RequestConverter** - Convert HTTP Requests & Websockets from Fiddler, Chrome etc into clean, readable code. Current support for C# & Python

**Early production version**: https://requestconverter.com/ | https://requestconverter.com/r/uezu51

![](https://i.imgur.com/QVaNUqY.png)

**Features**

* Analyse Http Requests & Websockets
* Store request bundles (SQL server) rq.com/r/xyz
* Brotli compression (reducing JSON by half)
* Multiple file types
* * .HAR
* * .SAZ
* Request body
* * Detect POST text, json
* * Detect Multipart data
* * Detect XWWWUrlFormEncoded data
* * Escape strings when needed
* Code generation
* * Python
* * * Change req/resp/header names
* * C#
* * * Add proxy
* * * Change request name
* * Method name generation
* * Custom preferences
* * * Wrap with class
* * * Wrap with method
* API analysis (identify IDs previously used in other requests)

**Roadmap:**

- API Analysis & Automation: 
1. JSON class & object generation from response
2. Regex creation for identified ids (header, body...) from response data
- Add more languages:
1. Java
2. Rust
3. Perl
4. Go
5. Kotlin
- Add settings to change the programming output & theme etc.
- Ability to save request bundle to account (login/register features)

**V2 (CSS Changes + React/Angular/Vue/Blazor Support):**

Figma design: https://www.figma.com/file/j06HFXXYLrRfZTDrXpxMpz/RequestConverterWeb?node-id=0%3A1&t=1I7EnYRZHwBPJCuM-1

![V2](https://i.imgur.com/ef7u3T7.png)
![V2](https://i.imgur.com/rBxRGaT.png)

**V1:**

![V1](https://i.imgur.com/qhNUIOb.png)
![V1](https://i.imgur.com/GOC3fS5.png)
