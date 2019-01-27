Move-Item .\src\assets\scriptures\ ..

# yarn run electron:windows:beta

yarn electron:windows:alpha

Move-Item ..\scriptures\ .\src\assets\


Rename-Item (ls .\app-builds\sp_edi*.exe)[(ls .\app-builds\sp_edi*.exe).Count - 1].FullName ("sp.project_" + (Get-Date).ToString("yyyyMMddmmFFFFFF") + ".exe")
$path = (ls .\app-builds\sp.project*.exe)[(ls .\app-builds\sp.project*.exe).Count - 1].FullName
Move-Item $path ~\OneDrive\scripture_file_share\scriptures_project\