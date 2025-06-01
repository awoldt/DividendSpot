FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV ASPNETCORE_URLS=http://*:8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["dividendspot.csproj", "."]
RUN dotnet restore "./dividendspot.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "dividendspot.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "dividendspot.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV DOTNET_SYSTEM_NET_HTTP_SOCKETSHTTPHANDLER_HTTP3SUPPORT=false
ENTRYPOINT ["dotnet", "dividendspot.dll"]