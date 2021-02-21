helm uninstall testapp testapp
docker rmi $(docker images -q)
docker build . -t testapp:latest
helm install testapp testapp
ping localhost
kubectl logs -n default -l app.kubernetes.io/name=testapp
