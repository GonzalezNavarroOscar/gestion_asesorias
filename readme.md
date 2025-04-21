# Proyecto de Gestión de Asesorías

# =====================================

## Descripción del proyecto

**El propósito de la realización de este software basado en un sistema es automatizar y optimizar la gestión y seguimiento de solicitudes de asesorías académicas por parte de los alumnos.**

# =====================================

## Estructura del proyecto

    gestion_asesorias
    ├──frontend     #HTML,CSS,JS
    │   ├──controllers
    │   │   └──CONTROLLER ARCHIVES
    │   ├──css
    │   │   └──CSS ARCHIVES
    │   ├──js
    │   │   └──JS API REQUEST ARCHIVES
    │   ├──images
    │   │   └──IMAGES
    │   └──pages
    │       └──HTML PAGES
    └──backend      #Express,Node.js,MySQL,CORS, Path, JWT, Nodemon
        ├──node_modules
        ├──routes
        │   └──routes.js #API Routes and Methods
        ├──db.js #Database info
        ├──generate_pass.js
        ├──mail.js
        ├──package-lock.json
        ├──package.json
        └──server.js #Server Configuration

# =====================================

## Dependencias del proyecto

### backend

- Node.js
- Express
- CORS
- body-parser
- mysql2
- jwt-decode
- jsonwebtoken
- nodemon
- dotenv
- crypto
- cookie parser

### frontend

- De momento para el desarrollo no se requieren dependencias en el frontend

# =====================================

## Instalación de Node.js y NPM

### Paso 1: Descargar instalador de Node.js

[Página de descarga](https://nodejs.org/en/download/)

![Descargar Node.js](https://phoenixnap.com/kb/wp-content/uploads/2023/12/nodejs-windows-installer-download-page.jpg)

### Paso 2: Instalar Node.js y NPM desde el instalador

![Instalar Node.js y NPM](https://phoenixnap.com/kb/wp-content/uploads/2023/12/nodejs-setup-wizard-welcome-screen.jpg)

### Paso 3: Verificar la instalación en consola

```bash
node -v

npm -v
```

# =====================================

## Clonado del repositorio

```bash

#En la carpeta en la que se desea clonar el repositorio

git init -y

git clone https://github.com/GonzalezNavarroOscar/gestion_asesorias.git


```

# =====================================

## Instalación de dependencias

Las dependencias necesarias están instaladas en las carpetas del proyecto, únicamente las dependencias necesarias para poder correr el proyecto, node.js y npm en este caso.

```bash

##frontend

##backend
    npm install express mysql2 cors body-parser jwt-decode jsonwebtoken cookie-parser --save-dev nodemon crypto

```

# =====================================

## Inicialización del proyecto

El proyecto cuenta con un archivo encargado de lanzar el servidor de forma local, que se conecta a la bd en RDS. Para ello, en consola realizar lo siguiente:

```bash

#En la carpeta del proyecto

cd backend

node server.js

```

# =====================================

## Integrantes del proyecto

- **García Romero Angel**
- **González Navarro Oscar Eduardo**
- **Martínez Monge Saúl Guillermo**
- **Pardo Rubalcaba Andrés**

# =====================================

## Logitipo del proyecto

<p align="center">
  <img src="frontend\images\LOGO.png"/>
</p>

# =====================================

## Liga de documentación del proyecto

[Click aquí para ir a la documentación](https://drive.google.com/drive/folders/1ip0icRrCbJlVMSa8Us8R77tdqRHDO6SA?hl=es-419)
