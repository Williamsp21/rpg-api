# RPG Battle API — Actividad 10

API REST en Node.js + Express para gestionar personajes de RPG y simular batallas.

---

## Estructura del proyecto

```
rpg-api/
├── server.js          ← Punto de entrada
├── db.js              ← Base de datos en memoria
├── package.json
└── routes/
    ├── characters.js  ← CRUD de personajes
    └── battles.js     ← Sistema de batallas
```

---

## Pasos para ejecutar

1. Tener Node.js instalado
2. npm install
3. npm start
4. La API corre en http://localhost:3000
```

---

## Endpoints disponibles

### PERSONAJES

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/characters | Listar todos los personajes |
| GET | /api/characters/:id | Obtener un personaje por ID |
| POST | /api/characters | Crear nuevo personaje |
| PUT | /api/characters/:id | Actualizar personaje |
| DELETE | /api/characters/:id | Eliminar personaje |

### BATALLAS

| Método | URL | Descripción |
|--------|-----|-------------|
| POST | /api/battles | Simular batalla entre dos personajes |

---

## Ejemplos de prueba con Thunder Client (VS Code)

### Listar personajes
```
GET http://localhost:3000/api/characters
```

### Ver personaje por ID
```
GET http://localhost:3000/api/characters/1
```

### Crear personaje
```
POST http://localhost:3000/api/characters
Content-Type: application/json

{
  "nombre": "Saruman",
  "color_piel": "blanca",
  "raza": "Mago",
  "fuerza": 50,
  "agilidad": 45,
  "magia": 90,
  "conocimiento": 95
}
```

### Actualizar personaje
```
PUT http://localhost:3000/api/characters/1
Content-Type: application/json

{
  "fuerza": 90,
  "agilidad": 75
}
```

### Eliminar personaje
```
DELETE http://localhost:3000/api/characters/2
```

### Simular batalla
```
POST http://localhost:3000/api/battles
Content-Type: application/json

{
  "personaje1_id": 1,
  "personaje2_id": 3
}
```

---

## Lógica de combate

El puntaje de cada personaje se calcula así:

```
Daño físico     = fuerza       × 0.35
Evasión         = agilidad     × 0.20
Ataque mágico   = magia        × 0.25
Bonus estrategia = conocimiento × 0.20

Puntaje base = suma de los 4 valores anteriores
Puntaje final = puntaje base × factor de suerte (entre 0.90 y 1.10)
```

Cada personaje tiene un puntaje calculado según sus stats.
Gana el que tenga el puntaje más alto. Hay un factor de
suerte que varía cada batalla.
