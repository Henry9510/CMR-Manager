// Tipos de datos para el sistema CMMS

export type CriticalityLevel = 'Alta' | 'Media' | 'Baja';
export type WorkOrderType = 'Correctivo' | 'Preventivo' | 'Predictivo' | 'Emergencia';
export type WorkOrderStatus = 'Creada' | 'Planificada' | 'En Ejecución' | 'Cerrada';

export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: 'Planta' | 'Línea' | 'Máquina' | 'Componente';
  criticality: CriticalityLevel;
  location: string;
  parent?: string;
  children?: Equipment[];
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  status: 'Operativo' | 'Detenido' | 'En Mantenimiento';
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
