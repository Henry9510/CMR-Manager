// Tipos de datos para el sistema CMMS

export type CriticalityLevel = 'Alta' | 'Media' | 'Baja';
export type WorkOrderType = 'Correctivo' | 'Preventivo' | 'Predictivo' | 'Emergencia';
export type WorkOrderStatus = 'Creada' | 'Planificada' | 'En Ejecución' | 'Cerrada';

export interface Equipment {
  tipo_id?: any;
  id: string;
  name: string;
  code: string;
  type: string; // ej: "Bomba", "Compresor", etc (desde tipo_equipo.nombre)
  criticality: CriticalityLevel;
  location: string;
  status: 'Operativo' | 'Mantenimiento' | 'Fuera de servicio' | 'Reparación';
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  components?: Component[];
  // Horas de operación
  horasTrabajo?: number;
  horasMantenimiento?: number;
  // IDs para edición
  tipoId?: number | null;
  ubicacionId?: number | null;
  estadoId?: number | null;
  criticidadId?: number | null;
  // Nombre y código para edición
  nombre?: string;
  codigo?: string;
}

export interface Component {
  id: string;
  code: string;
  name: string;
  description?: string;
  manufacturer?: string;
  serialNumber?: string;
  criticality: CriticalityLevel;
  // Propiedades actuales del componente
  nombre?: string;
  numeroParte?: string;
  vecesReparado?: number;
  vecesCambiado?: number;
  vecesFallado?: number;
  horasTrabajo?: number;
  horasMantenimiento?: number;
  estado?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
}

export interface WorkOrder {
  id: string;
  code: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  equipmentId: string;
  equipmentName: string;
  title: string;
  description: string;
  priority: CriticalityLevel;
  createdDate: string;
  plannedDate?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  cost?: number;
  parts?: SparePart[];
}

export interface SparePart {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  location: string;
  supplier?: string;
}

export interface MaintenancePlan {
  id: string;
  code: string;
  name: string;
  equipmentId: string;
  equipmentName: string;
  type: 'Preventivo' | 'Predictivo';
  frequency: number;
  frequencyUnit: 'Horas' | 'Días' | 'Semanas' | 'Meses';
  lastExecution?: string;
  nextExecution: string;
  tasks: string[];
  active: boolean;
}

export interface Failure {
  id: string;
  code: string;
  equipmentId: string;
  equipmentName: string;
  workOrderId?: string;
  date: string;
  type: string;
  description: string;
  rootCause?: string;
  corrective?: string;
  downtime: number; // en horas
  cost?: number;
}

export interface KPI {
  mtbf: number; // Mean Time Between Failures (horas)
  mttr: number; // Mean Time To Repair (horas)
  availability: number; // porcentaje
  reliability: number; // porcentaje
  maintenanceCost: number;
  preventiveCost: number;
  correctiveCost: number;
}
