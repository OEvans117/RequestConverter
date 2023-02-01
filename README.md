<h1 align="center">
  <br>
<img width=33% src="https://i.imgur.com/FGVa79j.png"/>
    <br>
    RequestConverter
  <br>
</h1>
<p align="center">
  <a href="https://img.shields.io/badge/.NET-5C2D91">
    <img src="https://img.shields.io/badge/.NET-512BD4?logo=dotnet" alt=".NET 6">
  </a>
  <a href="https://img.shields.io/badge/TypeScript-007ACC">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TS">
  </a>
  <a href="https://img.shields.io/badge/Microsoft_SQL_Server-CC2927">
    <img src="https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoft-sql-server&logoColor=white" alt="TS">
  </a>
  <a href="https://discord.gg/7xFzrjTpYk">
    <img src="https://img.shields.io/discord/984473468114456667?color=5b62ef&label=discord" alt="Discord">
  </a>
</p>

RequestConverter - Convert HTTP Requests & Websockets from Fiddler (.SAZ), Chrome (.HAR) into code from multiple programming languages. Ability to modify global/language related settings which will impact the output.

## 🌐 Demo: 
- https://requestconverter.com/
- https://requestconverter.com/r/uezu51

## 📙 Features
<details>
  <summary>Click to open</summary>
  
  ### Added
  - Analyse Http Requests & Websockets
  - Store request bundles (SQL server) rq.com/r/xyz
  - Brotli compression (reducing JSON by half)
  - Multiple file types
  - - .HAR
  - - .SAZ
  - Request body
  - - Detect POST text, json
  - - Detect Multipart data
  - - Detect XWWWUrlFormEncoded data
  - - Escape strings when needed
  - Code generation
  - - Python
  - - - Change req/resp/header names
  - - C#
  - - - Add proxy
  - - - Change request name
  - - Method name generation
  - - Custom preferences
  - - - Wrap with class
  - - - Wrap with method
  - API analysis (identify IDs previously used in other requests)
  
  ### Roadmap
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
</details>

## 📸 Links:

Class diagram: https://i.imgur.com/5Hc6VNQ.png

Figma design: https://www.figma.com/file/j06HFXXYLrRfZTDrXpxMpz/RequestConverterWeb?node-id=0%3A1&t=1I7EnYRZHwBPJCuM-1

![V2](https://i.imgur.com/ef7u3T7.png)
![V2](https://i.imgur.com/rBxRGaT.png)
![Class Diagram](https://i.imgur.com/5Hc6VNQ.png)
