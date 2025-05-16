# GeoActive

GeoActive es una aplicación web que permite visualizar y gestionar datos geoespaciales de manera interactiva.

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Git
- IntelliJ IDEA (opcional, para desarrollo)

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/GeoActive.git
cd GeoActive
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Copia el contenido de `.env.example` y configura las variables necesarias

## Ejecución

### Opción 1: Desde la Terminal

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

### Opción 2: Desde IntelliJ IDEA

1. Abre el proyecto en IntelliJ IDEA
2. Navega a la clase principal (normalmente en `src/main/java/com/geoactive/Main.java`)
3. Haz clic derecho sobre la clase y selecciona "Run 'Main.main()'"
   - Alternativamente, puedes usar el botón verde de "play" en la barra de herramientas
   - O usar el atajo de teclado `Shift + F10` (Windows/Linux) o `Control + R` (Mac)

La aplicación se iniciará y estará disponible en `http://localhost:8080`

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción
- `npm run lint`: Ejecuta el linter para verificar el código
- `npm run test`: Ejecuta las pruebas

## Estructura del Proyecto

```
GeoActive/
├── src/              # Código fuente
│   ├── main/        # Código principal de la aplicación
│   └── test/        # Pruebas
├── public/           # Archivos estáticos
├── tests/            # Pruebas
├── .env.example      # Ejemplo de variables de entorno
└── package.json      # Dependencias y scripts
```

## Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 