Move-Item .\src\assets\scriptures\ ..
# npm run electron:linux  
npm run electron:windows
Move-Item ..\scriptures .\src\assets\


Copy-Item '.\app-builds\sp-editor 3.0.0.exe' ('c:\Users\jared\OneDrive\scripture_file_share\scriptures_project\v3_sp-editor_' + [DateTime]::now.ToString("yyyy-MM-dd_HHmm_fffffff") + '.exe')
