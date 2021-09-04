param (
  [string]$PublishDir,
  [string]$RgName,
  [string]$WebAppName
)

Write-Output "Deploying..."
Write-Output $PublishDir

Push-Location farmer
dotnet run -- $PublishDir $RgName $WebAppName "localdeploy"
Pop-Location
