yarn version --patch

(Get-Content .\package.json)[2] | Out-File .\src\assets\version.txt

# Move-Item .\src\assets\scriptures ..

# ng build --prod

# Copy-Item ..\scriptures dist\assets -Recurse


docker build . -t scriptures_project_v3_beta

docker save scriptures_project_v3_beta -o .\scriptures_project_v3_beta

scp scriptures_project_v3_beta jared@192.168.1.150:/home/jared/v3
# scp scriptures.tar.gz jared@192.168.1.150:/home/jared/v3


ssh -t jared@192.168.1.150 'docker load -i /home/jared/v3/scriptures_project_v3_beta'

ssh -t jared@192.168.1.150 'docker kill scriptures_project_v3_beta'

ssh -t jared@192.168.1.150 'docker run -d -e "VIRTUAL_HOST=beta.scripturesproject.review" -e "LETSENCRYPT_HOST=beta.scripturesproject.review" -e "LETSENCRYPT_EMAIL=jared@parkinson.im" -p 11000 -it --rm --name scriptures_project_v3_beta scriptures_project_v3_beta'

# Move-Item .\src\assets\scriptures\ ..

# # yarn run electron:windows:beta

# electron-builder build --windows

# Move-Item ..\scriptures\ .\src\assets\



