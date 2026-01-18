import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Search, Plus, Clock, AlertCircle, CheckCircle, PlayCircle, FileText } from 'lucide-react';
import { mockWorkOrders } from '../data/mockData';
import { WorkOrder, WorkOrderStatus, WorkOrderType } from '../types';

export function WorkOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredOrders = mockWorkOrders.filter(order => {
    const matchesSearch = 
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (type: WorkOrderType) => {
    switch (type) {
      case 'Preventivo': return 'bg-blue-100 text-blue-800';
      case 'Correctivo': return 'bg-orange-100 text-orange-800';
      case 'Predictivo': return 'bg-purple-100 text-purple-800';
      case 'Emergencia': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case 'Creada': return 'bg-gray-100 text-gray-800';
      case 'Planificada': return 'bg-blue-100 text-blue-800';
      case 'En Ejecución': return 'bg-yellow-100 text-yellow-800';
      case 'Cerrada': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'Creada': return <FileText className="h-4 w-4" />;
      case 'Planificada': return <Clock className="h-4 w-4" />;
      case 'En Ejecución': return <PlayCircle className="h-4 w-4" />;
      case 'Cerrada': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-600';
      case 'Media': return 'text-yellow-600';
      case 'Baja': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Estadísticas
  const stats = {
    total: mockWorkOrders.length,
    creadas: mockWorkOrders.filter(o => o.status === 'Creada').length,
    planificadas: mockWorkOrders.filter(o => o.status === 'Planificada').length,
    enEjecucion: mockWorkOrders.filter(o => o.status === 'En Ejecución').length,
    cerradas: mockWorkOrders.filter(o => o.status === 'Cerrada').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Órdenes de Trabajo</h1>
          <p className="text-gray-500">Gestión completa de órdenes de mantenimiento</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva OT
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Orden de Trabajo</DialogTitle>
              <DialogDescription>Complete los datos para generar una nueva OT</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Trabajo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventivo">Preventivo</SelectItem>
                      <SelectItem value="correctivo">Correctivo</SelectItem>
                      <SelectItem value="predictivo">Predictivo</SelectItem>
                      <SelectItem value="emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Equipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eq1">Prensa Universal</SelectItem>
                    <SelectItem value="eq2">Motor Principal</SelectItem>
                    <SelectItem value="eq3">Bomba Cada B2001</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input placeholder="Descripción breve del trabajo" />
              </div>
              <div className="space-y-2">
                <Label>Descripción Detallada</Label>
                <Textarea placeholder="Detalles del trabajo a realizar..." rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Asignado a</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech1">Juan Pérez</SelectItem>
                      <SelectItem value="tech2">Carlos Rodríguez</SelectItem>
                      <SelectItem value="tech3">Ana Martínez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Horas Estimadas</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Cancelar</Button>
                <Button>Crear OT</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen de estados */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Creadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.creadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Planificadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{stats.planificadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">En Ejecución</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">{stats.enEjecucion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Cerradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{stats.cerradas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Órdenes</CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, título o equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Preventivo">Preventivo</SelectItem>
                <SelectItem value="Correctivo">Correctivo</SelectItem>
                <SelectItem value="Predictivo">Predictivo</SelectItem>
                <SelectItem value="Emergencia">Emergencia</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Creada">Creada</SelectItem>
                <SelectItem value="Planificada">Planificada</SelectItem>
                <SelectItem value="En Ejecución">En Ejecución</SelectItem>
                <SelectItem value="Cerrada">Cerrada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asignado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.code}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(order.type)}>{order.type}</Badge>
                  </TableCell>
                  <TableCell>{order.equipmentName}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{order.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <AlertCircle className={`h-4 w-4 mr-1 ${getPriorityColor(order.priority)}`} />
                      <span className="text-sm">{order.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{order.assignedTo || '-'}</TableCell>
                  <TableCell>{new Date(order.createdDate).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDialogOpen(true);
                      }}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para ver detalles de OT */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de Orden de Trabajo</DialogTitle>
            <DialogDescription>{selectedOrder?.code}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{selectedOrder.title}</h3>
                  <p className="text-sm text-gray-500">{selectedOrder.equipmentName}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(selectedOrder.type)}>{selectedOrder.type}</Badge>
                  <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Prioridad:</span>
                      <span className={getPriorityColor(selectedOrder.priority)}>{selectedOrder.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Asignado a:</span>
                      <span>{selectedOrder.assignedTo || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha creación:</span>
                      <span>{new Date(selectedOrder.createdDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha planificada:</span>
                      <span>{selectedOrder.plannedDate ? new Date(selectedOrder.plannedDate).toLocaleDateString('es-ES') : '-'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Tiempos y Costos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Horas estimadas:</span>
                      <span>{selectedOrder.estimatedHours || '-'} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Horas reales:</span>
                      <span>{selectedOrder.actualHours || '-'} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Costo total:</span>
                      <span className="font-medium">${selectedOrder.cost?.toLocaleString() || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Descripción</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedOrder.description}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cerrar</Button>
                <Button variant="outline">Editar</Button>
                {selectedOrder.status === 'Planificada' && <Button>Iniciar Trabajo</Button>}
                {selectedOrder.status === 'En Ejecución' && <Button>Cerrar OT</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
