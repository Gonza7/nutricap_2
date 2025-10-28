// src/db.js
import Dexie from 'dexie'

export const db = new Dexie('nutricionDB')

// Definimos la estructura de la base de datos
db.version(1).stores({
  /**
   * Tabla 'alimentos'
   * '++id': Clave primaria auto-incremental.
   * 'nombre, grupo': Índices para poder buscar/filtrar por esos campos.
   */
  alimentos: '++id, nombre, grupo',
})
