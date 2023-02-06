using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RequestConverterAPI.Context;
using RequestConverterAPI.Controllers;
using RequestConverterAPI.Features.RequestAnalysis;
using RequestConverterAPI.Features.RequestConversion;
using RequestConverterAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RequestConverterAPI.Tests.Controller
{
    public class RequestControllerTests
    {
        private RequestController _requestController;
        private RequestConverterContext _converterContext;
        private RequestsFileConverter _rfc;
        private RequestAnalyser _ra;

        private async Task<RequestConverterContext> GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<RequestConverterContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var databaseContext = new RequestConverterContext(options);
            databaseContext.Database.EnsureCreated();
            if(await databaseContext.ConvertedRequest.CountAsync() <= 0)
            {
                for(int i = 0; i < 10; i++)
                {
                    databaseContext.ConvertedRequest.Add(
                        new ConvertedRequest()
                        {
                            Id = i.ToString(),
                            ConversionResult = i.ToString() + i.ToString()
                        }
                        );

                    await databaseContext.SaveChangesAsync();
                }
            }
            return databaseContext;
        }

        public RequestControllerTests()
        {
            // Dependencies
            _rfc = A.Fake<RequestsFileConverter>();
            _ra = A.Fake<RequestAnalyser>();
        }

        [Fact]
        public async Task RequestController_GetAsync_ReturnsNotFoundAsync()
        {
            // Arrange
            _converterContext = await GetDatabaseContext();
            _requestController = new RequestController(_converterContext, _rfc, _ra);

            var requestId = "fakeid";

            // Act
            var result = _requestController.GetAsync(requestId);

            // Assert - object check actions
            result.Result.Should().BeOfType<NotFoundResult>();
        }
    }

}
