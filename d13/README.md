# Servidor con NodeJS

Inicio de servidor en modo FORK con PM2:
Pm2 start server.js –name=”ServerFork” –watch -- -p 8081 -mod FORK
Inicio de servidor en modo CLUSTER con PM2:
Pm2 start server.js –name=”ServerFork” –watch -- -p 8082 -mod CLUSTER