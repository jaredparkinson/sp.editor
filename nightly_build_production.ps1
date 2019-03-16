# yarn version --patch


# # Move-Item .\src\assets\scriptures ..

# # ng build --prod

# # Copy-Item ..\scriptures dist\assets -Recurse


# docker build . -t scriptures_project_v3_an

# docker save scriptures_project_v3_an -o .\scriptures_project_v3_an

# scp scriptures_project_v3_an jared@192.168.1.150:/home/jared/v3
# # scp scriptures.tar.gz jared@192.168.1.150:/home/jared/v3


# ssh -t jared@192.168.1.150 'docker load -i /home/jared/v3/scriptures_project_v3_an'

# ssh -t jared@192.168.1.150 'docker kill scriptures_project_v3_an'

# ssh -t jared@192.168.1.150 'docker run -d -e "VIRTUAL_HOST=an.scripturesproject.review" -e "LETSENCRYPT_HOST=an.scripturesproject.review" -e "LETSENCRYPT_EMAIL=jared@parkinson.im" -p 11000 -it --rm --name scriptures_project_v3_an scriptures_project_v3_an'



# yarn version --patch

# (Get-Content .\package.json)[2] | Out-File .\src\assets\version.txt

yarn build:web

Set-Location .\dist

tar -czf an.tar.gz *.*

scp -P 7822 an.tar.gz oneinthi@oneinthinehand.org:nightly.oneinthinehand.org/

ssh -t oneinthi@oneinthinehand.org -p 7822 'cd nightly.oneinthinehand.org && tar xvf an.tar.gz'

Set-Location ..