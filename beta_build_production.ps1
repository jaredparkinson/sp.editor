yarn version --minor 
docker build . -t scriptures_project_v3_beta

docker save scriptures_project_v3_beta -o .\scriptures_project_v3_beta

scp scriptures_project_v3_beta jared@192.168.1.150:/home/jared/v3
# scp scriptures.tar.gz jared@192.168.1.150:/home/jared/v3


ssh -t jared@192.168.1.150 'docker load -i /home/jared/v3/scriptures_project_v3_beta'

ssh -t jared@192.168.1.150 'docker kill scriptures_project_v3_beta'

ssh -t jared@192.168.1.150 'docker run -d -e VIRTUAL_HOST=beta.scripturesproject.review -p 11000 -it --rm --name scriptures_project_v3_beta scriptures_project_v3_beta'
