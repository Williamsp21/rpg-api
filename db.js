// Base de datos en memoria (simula una BD real)
let characters = [
  {
    id: 1,
    nombre: 'Aragorn',
    color_piel: 'blanca',
    raza: 'Humano',
    fuerza: 85,
    agilidad: 70,
    magia: 20,
    conocimiento: 75,
  },
  {
    id: 2,
    nombre: 'Gandalf',
    color_piel: 'blanca',
    raza: 'Mago',
    fuerza: 40,
    agilidad: 50,
    magia: 95,
    conocimiento: 99,
  },
  {
    id: 3,
    nombre: 'Legolas',
    color_piel: 'blanca',
    raza: 'Elfo',
    fuerza: 65,
    agilidad: 98,
    magia: 35,
    conocimiento: 80,
  },
  {
    id: 4,
    nombre: 'Baldur',
    color_piel: 'morena',
    raza: 'Enano',
    fuerza: 92,
    agilidad: 40,
    magia: 10,
    conocimiento: 60,
  },
];

let nextId = 5;

module.exports = {
  getAll: () => characters,
  getById: (id) => characters.find((c) => c.id === id),
  create: (data) => {
    const newChar = { id: nextId++, ...data };
    characters.push(newChar);
    return newChar;
  },
  update: (id, data) => {
    const index = characters.findIndex((c) => c.id === id);
    if (index === -1) return null;
    characters[index] = { ...characters[index], ...data, id };
    return characters[index];
  },
  delete: (id) => {
    const index = characters.findIndex((c) => c.id === id);
    if (index === -1) return false;
    characters.splice(index, 1);
    return true;
  },
};
