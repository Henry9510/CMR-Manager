// Servicio para conectar con el API de órdenes de trabajo
const API_BASE_URL = 'http://localhost:8080/api/ordenes-trabajo';

export interface OrdenTrabajoDTO {
  id?: number;
  codigo: string;
  titulo: string;
  descripcion?: string;
  equipoId?: number;
  tipoId?: number;
  estadoId?: number;
  prioridadId?: number;
  fechaCreacion?: string;
  fechaProgramada?: string;
  fechaCompletacion?: string;
  horasEstimadas?: number;
  // Propiedades adicionales para el frontend
  equipo?: {
    id: number;
    nombre: string;
  };
  tipo?: {
    id: number;
    nombre: string;
  };
  estado?: {
    id: number;
    nombre: string;
  };
  prioridad?: {
    id: number;
    nivel: string;
  };
}

export interface CreateOrdenTrabajoRequest {
  codigo: string;
  titulo: string;
  descripcion?: string;
  equipo_id: number;
  tipo_id: number;
  estado_id: number;
  prioridad_id: number;
  fecha_programada?: string;
  horas_estimadas?: number;
}

// Obtener todas las órdenes de trabajo
export async function getAllOrdenesTrabajo(): Promise<OrdenTrabajoDTO[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener órdenes de trabajo:', error);
    throw error;
  }
}

// Obtener una orden de trabajo por ID
export async function getOrdenTrabajoById(id: number): Promise<OrdenTrabajoDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener orden de trabajo ${id}:`, error);
    throw error;
  }
}

// Crear una nueva orden de trabajo
export async function createOrdenTrabajo(
  request: CreateOrdenTrabajoRequest
): Promise<OrdenTrabajoDTO> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al crear orden de trabajo:', error);
    throw error;
  }
}

// Actualizar una orden de trabajo
export async function updateOrdenTrabajo(
  id: number,
  request: Partial<CreateOrdenTrabajoRequest>
): Promise<OrdenTrabajoDTO> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar orden de trabajo ${id}:`, error);
    throw error;
  }
}

// Eliminar una orden de trabajo
export async function deleteOrdenTrabajo(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error al eliminar orden de trabajo ${id}:`, error);
    throw error;
  }
}
