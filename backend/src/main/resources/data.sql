-- Insertar datos de prueba en la base de datos

-- Insertar ubicaciones (genéricas - líneas de producción)
INSERT INTO ubicaciones (nombre) VALUES ('Línea de Producción 1');
INSERT INTO ubicaciones (nombre) VALUES ('Línea de Producción 2');
INSERT INTO ubicaciones (nombre) VALUES ('Línea de Producción 3');
INSERT INTO ubicaciones (nombre) VALUES ('Área de Mantenimiento');
INSERT INTO ubicaciones (nombre) VALUES ('Almacén de Equipos');
INSERT INTO ubicaciones (nombre) VALUES ('Área de Pruebas');

-- Insertar criticidades (usando 'nivel', no 'nombre')
INSERT INTO criticidades (nivel) VALUES ('Baja');
INSERT INTO criticidades (nivel) VALUES ('Media');
INSERT INTO criticidades (nivel) VALUES ('Alta');
INSERT INTO criticidades (nivel) VALUES ('Crítica');

-- Insertar tipos de equipo
INSERT INTO tipo_equipo (nombre, descripcion) VALUES ('Máquina CNC', 'Centro de mecanizado numérico');
INSERT INTO tipo_equipo (nombre, descripcion) VALUES ('Prensa Hidráulica', 'Prensa industrial de alta presión');
INSERT INTO tipo_equipo (nombre, descripcion) VALUES ('Tornos', 'Torno automático y manual');
INSERT INTO tipo_equipo (nombre, descripcion) VALUES ('Compresor', 'Compresor de aire industrial');
INSERT INTO tipo_equipo (nombre, descripcion) VALUES ('Banda Transportadora', 'Sistema de transporte automático');

-- Insertar estados de equipo
INSERT INTO estado_equipo (nombre) VALUES ('Operativo');
INSERT INTO estado_equipo (nombre) VALUES ('Mantenimiento');
INSERT INTO estado_equipo (nombre) VALUES ('Fuera de servicio');
INSERT INTO estado_equipo (nombre) VALUES ('Reparación');

-- Insertar equipos
INSERT INTO equipos (nombre, codigo, ubicacion_id, tipo_id, estado_id, criticidad_id) VALUES ('CNC-001', 'EQU-001', 1, 1, 1, 3);
INSERT INTO equipos (nombre, codigo, ubicacion_id, tipo_id, estado_id, criticidad_id) VALUES ('Prensa Hidráulica 1', 'EQU-002', 2, 2, 1, 2);
INSERT INTO equipos (nombre, codigo, ubicacion_id, tipo_id, estado_id, criticidad_id) VALUES ('Torno Automático', 'EQU-003', 3, 3, 1, 2);
INSERT INTO equipos (nombre, codigo, ubicacion_id, tipo_id, estado_id, criticidad_id) VALUES ('Compresor Principal', 'EQU-004', 4, 4, 1, 3);
INSERT INTO equipos (nombre, codigo, ubicacion_id, tipo_id, estado_id, criticidad_id) VALUES ('Banda Transportadora A', 'EQU-005', 3, 5, 2, 2);
INSERT INTO equipos (nombre, codigo, ubicacion_id, tipo_id, estado_id, criticidad_id) VALUES ('Soldadora Robótica', 'EQU-006', 6, 1, 1, 4);
INSERT INTO equipos (nombre, codigo, ubicacion_id, tipo_id, estado_id, criticidad_id) VALUES ('Cortadora Láser', 'EQU-007', 5, 2, 3, 4);

-- Insertar componentes
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Motor Principal', 'MOT-001', 1);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Eje de transmisión', 'EJE-001', 1);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Cilindro Hidráulico', 'CIL-001', 2);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Válvula de control', 'VAL-001', 2);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Rodamiento SKF', 'ROD-001', 3);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Correa dentada', 'COR-001', 5);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Pistola neumática', 'PIS-001', 4);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Sensor óptico', 'SEN-001', 6);
INSERT INTO componente (nombre, numero_parte, equipo_id) VALUES ('Cable de control', 'CAB-001', 7);