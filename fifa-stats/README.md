# ⚽ FIFA Career Stats Dashboard

Un sistema completo para registrar, gestionar y visualizar el rendimiento de un jugador en modo carrera de FIFA, temporada a temporada.

## 🚀 Características

- **Dashboard Principal**: Vista general de estadísticas de carrera
- **Gestión de Temporadas**: Crear y gestionar múltiples temporadas
- **Registro de Partidos**: Formulario detallado para registrar cada partido
- **Estadísticas Detalladas**: Seguimiento de goles, asistencias, rating, tarjetas, etc.
- **Visualización Intuitiva**: Tablas y gráficos claros para analizar el rendimiento
- **Diseño Responsive**: Funciona perfectamente en desktop y móvil
- **Tema FIFA**: Colores y diseño inspirados en la franquicia FIFA

## 📱 Capturas de Pantalla

### Dashboard Principal
- Vista general de todas las temporadas
- Estadísticas de carrera acumuladas
- Acceso rápido a cada temporada

### Vista de Temporada
- Estadísticas específicas de la temporada
- Lista completa de partidos jugados
- Formulario para agregar nuevos partidos

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/fifa-stats.git
cd fifa-stats
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 📋 Cómo Usar

### Crear una Nueva Temporada

1. En el dashboard principal, haz clic en "Nueva Temporada"
2. Ingresa el nombre de la temporada (ej: "2024/2025")
3. Haz clic en "Crear Temporada"

### Registrar un Partido

1. Entra a la temporada deseada
2. Haz clic en "Nuevo Partido"
3. Completa la información del partido:
   - **Información General**: Fecha, competición, equipos
   - **Configuración**: Si jugaste como local o con selección
   - **Resultado**: Marcador final
   - **Estadísticas Personales**: Goles, asistencias, rating, minutos, tarjetas

### Ver Estadísticas

- **Dashboard**: Estadísticas generales de toda tu carrera
- **Temporada**: Estadísticas específicas de cada temporada
- **Historial**: Tabla detallada de todos los partidos

## 🎯 Características de Registro

### Información del Partido
- Fecha del partido
- Competición (Liga, Cup, etc.)
- Equipos participantes
- Resultado final
- Si jugaste como local/visitante
- Si fue con selección nacional

### Estadísticas del Jugador
- **Goles**: Cantidad de goles marcados
- **Asistencias**: Asistencias realizadas
- **Rating**: Calificación del partido (0-10)
- **Minutos**: Tiempo jugado
- **Tarjetas Amarillas**: Cantidad recibida
- **Tarjetas Rojas**: Cantidad recibida

## 🎨 Diseño y UX

- **Tema Oscuro**: Diseño moderno con colores FIFA
- **Iconos**: Iconografía clara para cada estadística
- **Responsive**: Adaptado para todos los dispositivos
- **Navegación Intuitiva**: Fácil acceso a todas las funciones
- **Feedback Visual**: Colores que indican rendimiento (verde para bueno, rojo para malo)

## 📊 Esquema de Datos

El sistema está diseñado siguiendo el esquema detallado en `src/SCHEMA.md`, que incluye:

- **Temporadas**: Períodos de juego
- **Partidos**: Información de cada encuentro
- **Estadísticas**: Rendimiento del jugador
- **Equipos**: Clubes y selecciones
- **Competiciones**: Ligas, copas, torneos

## 🔧 Tecnologías Utilizadas

- **React 19.1.0**: Framework principal
- **React Router**: Navegación entre páginas
- **Lucide React**: Iconos modernos
- **CSS3**: Estilos personalizados con gradientes y animaciones
- **Date-fns**: Manejo de fechas

## 🚧 Próximas Funcionalidades

- [ ] Integración con Supabase para persistencia de datos
- [ ] Gráficos de rendimiento por temporada
- [ ] Exportación de datos a PDF/Excel
- [ ] Comparación entre temporadas
- [ ] Filtros avanzados para partidos
- [ ] Modo de equipo (estadísticas del equipo completo)
- [ ] Objetivos y metas personales

## 📈 Desarrollo

### Estructura del Proyecto
```
src/
├── components/
│   ├── Dashboard.js      # Dashboard principal
│   ├── SeasonDetail.js   # Vista de temporada
│   └── Navbar.js         # Navegación
├── App.js                # Componente principal
├── App.css               # Estilos globales
└── SCHEMA.md             # Esquema de base de datos
```

### Scripts Disponibles

- `npm start`: Servidor de desarrollo
- `npm test`: Ejecutar tests
- `npm run build`: Compilar para producción
- `npm run eject`: Eyectar configuración (no recomendado)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🎮 Sobre FIFA

Este proyecto está inspirado en el modo carrera de FIFA, el popular videojuego de fútbol de EA Sports. Es perfecto para jugadores que quieren llevar un registro detallado de su rendimiento y progreso a lo largo de múltiples temporadas.

---

**¡Disfruta registrando tu carrera FIFA! ⚽🏆**
