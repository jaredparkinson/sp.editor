docker build . -t scriptures_project_v3

docker save scriptures_project_v3 -o .\scriptures_project_v3

scp scriptures_project_v3 jared@192.168.1.150:/home/jared/v3
# scp scriptures.tar.gz jared@192.168.1.150:/home/jared/v3


ssh -t jared@192.168.1.150 'docker load -i /home/jared/v3/scriptures_project_v3'

ssh -t jared@192.168.1.150 'docker kill scriptures_project_v3'

ssh -t jared@192.168.1.150 'docker run -d -e VIRTUAL_HOST=v3.scripturesproject.review -p 10000 -it --rm --name scriptures_project_v3 scriptures_project_v3'