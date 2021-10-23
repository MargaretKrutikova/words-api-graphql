open System
open Deploy
open Deploy.WebAppDeployment

let commandLineArgs = Environment.GetCommandLineArgs()

match commandLineArgs |> List.ofArray with
| [] | [_] -> Console.WriteLine("No command line argument specified.")
| _applicationName :: publishedAppFolder :: resourceGroupName :: appName :: appVersion :: _ ->
    let fullWebAppName = $"words-api-{appName}"
    let dbFriendlyAppName = appName.Replace("-", "_")
    let collectionName = $"words_{dbFriendlyAppName}"

    let databaseName = "WordsDb"
    let mongoConnectionString = MongoDbDeployment.deployMongoDb databaseName collectionName

    let appSettings: AppSettings = {
        appVersion = appVersion
        mongoConnectionString = mongoConnectionString
        collectionName = collectionName
    }

    deployWebApp resourceGroupName databaseName fullWebAppName publishedAppFolder appSettings

| _ ->
    Console.WriteLine("There should be exactly 4 command line arguments: publishedAppFolder, resourceGroupName, appName and appVersion")
