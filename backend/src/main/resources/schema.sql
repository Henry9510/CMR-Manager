-- Script para asegurar constraint ON DELETE CASCADE en componentes
-- Ejecutar si es necesario (MySQL requiere esto para cascade)

-- Crear constraint si no existe
ALTER TABLE componente 
  ADD CONSTRAINT componente_equipo_fk FOREIGN KEY (equipo_id) 
  REFERENCES equipos(id) ON DELETE CASCADE
  ON UPDATE CASCADE;
