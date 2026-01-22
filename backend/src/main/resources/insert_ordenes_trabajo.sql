-- Inserts de ejemplo para Órdenes de Trabajo
-- Asegúrate de que existan los equipos y estados necesarios en la BD primero

-- OT-2026-001: Mantenimiento Preventivo para Prensa Universal
INSERT INTO ordenes_trabajo (codigo, titulo, descripcion, tipo, asignado_a, equipo_id, estado_id, prioridad_id, fecha_creacion, fecha_programada, horas_estimadas) 
VALUES (
  'OT-2026-001',
  'Mantenimiento Preventivo Mensual',
  'Inspección y limpieza de componentes principales de la prensa universal. Incluye lubricación de partes móviles y verificación de sistemas hidráulicos.',
  'Preventivo',
  'Juan Pérez',
  1,  -- ID del Equipo (ajusta según tu BD)
  2,  -- ID del Estado 'Planificada' (ajusta según tu BD)
  2,  -- ID de la Criticidad 'Media' (ajusta según tu BD)
  NOW(),
  '2026-01-01 08:00:00',
  4.0
);

-- OT-2026-002: Reparación Correctiva para Bomba Cada B2001
INSERT INTO ordenes_trabajo (codigo, titulo, descripcion, tipo, asignado_a, equipo_id, estado_id, prioridad_id, fecha_creacion, fecha_programada, horas_estimadas) 
VALUES (
  'OT-2026-002',
  'Reparación de Fuga en Sello Mecánico',
  'Detección y reparación de fuga crítica en el sello mecánico de la bomba centrífuga B2001. Se requiere desmontaje parcial y posible reemplazo de componentes sellos.',
  'Correctivo',
  'Carlos Rodríguez',
  2,  -- ID del Equipo (ajusta según tu BD)
  3,  -- ID del Estado 'En Ejecución' (ajusta según tu BD)
  1,  -- ID de la Criticidad 'Alta' (ajusta según tu BD)
  NOW(),
  '2026-01-05 07:30:00',
  6.5
);
