# ⚽ Modo Carrera - FIFA Tracker

Este proyecto tiene como objetivo registrar, gestionar y visualizar el rendimiento de un jugador en modo carrera en FIFA, temporada a temporada. Utiliza Supabase como base de datos y React para el frontend. A continuación se detalla el esquema de datos y las relaciones utilizadas.

---

## 📐 Esquema de Base de Datos

### 1. `nations`
Contiene todos los países utilizados para clubes y selecciones nacionales.

| Campo       | Tipo     | Descripción                        |
|-------------|----------|------------------------------------|
| `id`        | UUID     | Clave primaria                     |
| `name`      | TEXT     | Nombre del país (único)           |

---

### 2. `teams`
Almacena clubes y selecciones nacionales.

| Campo            | Tipo     | Descripción                                    |
|------------------|----------|------------------------------------------------|
| `id`             | UUID     | Clave primaria                                 |
| `name`           | TEXT     | Nombre del equipo                              |
| `is_national_team` | BOOLEAN | `true` si es selección, `false` si es club     |
| `nation_id`      | UUID     | FK → `nations.id`                              |

---

### 3. `competitions`
Define todas las competiciones posibles: ligas, copas nacionales, torneos continentales e internacionales.

| Campo       | Tipo     | Descripción                                                         |
|-------------|----------|---------------------------------------------------------------------|
| `id`        | UUID     | Clave primaria                                                      |
| `name`      | TEXT     | Nombre de la competición                                            |
| `type`      | TEXT     | Tipo (`liga`, `copa`, `continental`, `internacional`, `amistoso`)   |
| `level`     | TEXT     | Nivel del torneo (`club` o `selección`)                             |
| `nation_id` | UUID     | FK → `nations.id` _(puede ser `null` si es internacional)_          |

---

### 4. `seasons`
Registra las temporadas del jugador.

| Campo       | Tipo     | Descripción               |
|-------------|----------|---------------------------|
| `id`        | UUID     | Clave primaria            |
| `name`      | TEXT     | Nombre: ej. "2023/2024"   |
| `created_at`| TIMESTAMP| Fecha de creación         |

---

### 5. `matches`
Registra cada partido jugado por el jugador.

| Campo             | Tipo     | Descripción                                           |
|-------------------|----------|-------------------------------------------------------|
| `id`              | UUID     | Clave primaria                                        |
| `season_id`       | UUID     | FK → `seasons.id`                                     |
| `date`            | DATE     | Fecha del partido                                     |
| `competition_id`  | UUID     | FK → `competitions.id`                                |
| `home_team_id`    | UUID     | FK → `teams.id` (equipo local)                        |
| `away_team_id`    | UUID     | FK → `teams.id` (equipo visitante)                    |
| `is_home`         | BOOLEAN  | `true` si el jugador fue local                        |
| `is_national_team`| BOOLEAN  | `true` si fue un partido por selección                |
| `result`          | TEXT     | Resultado textual: ej. `"2-1"`                        |
| `created_at`      | TIMESTAMP| Fecha de registro                                     |

---

### 6. `player_stats`
Contiene el rendimiento del jugador en cada partido.

| Campo           | Tipo      | Descripción                           |
|-----------------|-----------|---------------------------------------|
| `id`            | UUID      | Clave primaria                        |
| `match_id`      | UUID      | FK → `matches.id`                     |
| `goals`         | INTEGER   | Goles anotados                        |
| `assists`       | INTEGER   | Asistencias                           |
| `yellow_cards`  | INTEGER   | Tarjetas amarillas                    |
| `red_cards`     | INTEGER   | Tarjetas rojas                        |
| `rating`        | NUMERIC   | Calificación (ej: `7.5`)              |
| `minutes_played`| INTEGER   | Minutos jugados                       |
| `created_at`    | TIMESTAMP | Fecha de registro                     |

---

## 🔗 Relaciones entre tablas

```plaintext
nations       ─┬─▶ teams.nation_id
              └─▶ competitions.nation_id

teams         ─┬─▶ matches.home_team_id
              └─▶ matches.away_team_id

competitions  ─▶ matches.competition_id

seasons       ─▶ matches.season_id

matches       ─▶ player_stats.match_id
