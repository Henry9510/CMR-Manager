import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { WorkOrderStatus, WorkOrderType } from '../types';

export function WorkOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [isCreateOTDialogOpen, setIsCreateOTDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Estados del formulario de nueva OT
  const [newOtForm, setNewOtForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'Correctivo',
    asignadoA: '',
    equipoId: '',
    prioridad: 'Media',
    horasEstimadas: 0,
    fechaProgramada: new Date().toISOString().split('T')[0],
  });

  // Cargar equipos y órdenes al montar el componente
  useEffect(() => {
    loadEquipos();
    loadOrdenes();
  }, []);

  const loadEquipos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/equipos');
      if (response.ok) {
        const data = await response.json();
        setEquipos(data);
      }
    } catch (err) {
      console.error('Error cargando equipos:', err);
    }
  };

  const loadOrdenes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/ordenes-trabajo');
      if (response.ok) {
        const data = await response.json();
        setOrdenes(data);
      }
    } catch (err) {
      console.error('Error cargando órdenes:', err);
    }
  };

  const handleCreateOT = async () => {
    if (!newOtForm.titulo || !newOtForm.equipoId) {
      toast.error('El título y el equipo son requeridos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/ordenes-trabajo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: newOtForm.titulo,
          descripcion: newOtForm.descripcion,
          tipo: newOtForm.tipo,
          asignadoA: newOtForm.asignadoA,
          equipoId: Number(newOtForm.equipoId),
          prioridad: newOtForm.prioridad,
          horasEstimadas: newOtForm.horasEstimadas,
          fechaProgramada: newOtForm.fechaProgramada,
        }),
      });

      if (response.ok) {
        toast.success('Orden de trabajo creada exitosamente');
        setNewOtForm({
          titulo: '',
          descripcion: '',
          tipo: 'Correctivo',
          asignadoA: '',
          equipoId: '',
          prioridad: 'Media',
          horasEstimadas: 0,
          fechaProgramada: new Date().toISOString().split('T')[0],
        });
        setIsCreateOTDialogOpen(false);
        loadOrdenes(); // Recargar órdenes después de crear
      } else {
        toast.error(`Error al crear OT: ${await response.text()}`);
      }
    } catch (err) {
      toast.error(`Error: ${err}`);
    }
  };

  const filteredOrders = ordenes.filter(order => {
    const matchesSearch = 
      (order.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.equipo?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || order.tipo === filterType;
    const matchesStatus = filterStatus === 'all' || order.estado?.nombre === filterStatus;

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
    total: ordenes.length,
    creadas: ordenes.filter(o => o.estado?.nombre === 'Creada').length,
    planificadas: ordenes.filter(o => o.estado?.nombre === 'Planificada').length,
    enEjecucion: ordenes.filter(o => o.estado?.nombre === 'En Ejecución').length,
    cerradas: ordenes.filter(o => o.estado?.nombre === 'Cerrada').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Órdenes de Trabajo</h1>
          <p className="text-gray-500">Gestión completa de órdenes de mantenimiento</p>
        </div>
        <Dialog open={isCreateOTDialogOpen} onOpenChange={setIsCreateOTDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva OT
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Orden de Trabajo</DialogTitle>
              <DialogDescription>Complete los datos para generar una nueva OT</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={newOtForm.tipo} onValueChange={(value) => setNewOtForm({...newOtForm, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preventivo">Preventivo</SelectItem>
                      <SelectItem value="Correctivo">Correctivo</SelectItem>
                      <SelectItem value="Predictivo">Predictivo</SelectItem>
                      <SelectItem value="Emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select value={newOtForm.prioridad} onValueChange={(value) => setNewOtForm({...newOtForm, prioridad: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Equipo</Label>
                  <Select value={newOtForm.equipoId} onValueChange={(value) => setNewOtForm({...newOtForm, equipoId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipos.map(eq => (
                        <SelectItem key={eq.id} value={String(eq.id)}>{eq.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input 
                  placeholder="Descripción breve del trabajo" 
                  value={newOtForm.titulo}
                  onChange={(e) => setNewOtForm({...newOtForm, titulo: e.target.value})}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
              <div className="space-y-2">
                <Label>Asignado A</Label>
                <Input 
                  placeholder="Nombre del técnico" 
                  value={newOtForm.asignadoA}
                  onChange={(e) => setNewOtForm({...newOtForm, asignadoA: e.target.value})}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
              <div className="space-y-2">
                <Label>Descripción Detallada</Label>
                <Textarea 
                  placeholder="Detalles del trabajo a realizar..." 
                  rows={4}
                  value={newOtForm.descripcion}
                  onChange={(e) => setNewOtForm({...newOtForm, descripcion: e.target.value})}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horas Estimadas</Label>
                  <Input 
                    type="number" 
                    placeholder="0"
                    value={newOtForm.horasEstimadas}
                    onChange={(e) => setNewOtForm({...newOtForm, horasEstimadas: Number(e.target.value)})}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Programada</Label>
                  <Input 
                    type="date"
                    value={newOtForm.fechaProgramada}
                    onChange={(e) => setNewOtForm({...newOtForm, fechaProgramada: e.target.value})}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOTDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateOT}>Crear OT</Button>
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
                  <TableCell className="font-medium">{order.codigo}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(order.tipo)}>{order.tipo}</Badge>
                  </TableCell>
                  <TableCell>{order.equipo?.nombre || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{order.titulo}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <AlertCircle className={`h-4 w-4 mr-1 ${getPriorityColor(order.prioridad?.nivel || 'Media')}`} />
                      <span className="text-sm">{order.prioridad?.nivel || '-'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.estado?.nombre || 'Creada')}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.estado?.nombre || 'Creada')}
                        {order.estado?.nombre || 'Creada'}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{order.asignadoA || '-'}</TableCell>
                  <TableCell>{order.fechaCreacion ? new Date(order.fechaCreacion).toLocaleDateString('es-ES') : '-'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailsDialogOpen(true);
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
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de Orden de Trabajo</DialogTitle>
            <DialogDescription>{selectedOrder?.code}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{selectedOrder.titulo}</h3>
                  <p className="text-sm text-gray-500">{selectedOrder.equipo?.nombre || '-'}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(selectedOrder.tipo)}>{selectedOrder.tipo}</Badge>
                  <Badge className={getStatusColor(selectedOrder.estado?.nombre || 'Creada')}>{selectedOrder.estado?.nombre || 'Creada'}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Prioridad:</span>
                      <span className={getPriorityColor(selectedOrder.prioridad?.nivel || 'Media')}>{selectedOrder.prioridad?.nivel || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Asignado a:</span>
                      <span>{selectedOrder.asignadoA || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha creación:</span>
                      <span>{selectedOrder.fechaCreacion ? new Date(selectedOrder.fechaCreacion).toLocaleDateString('es-ES') : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha planificada:</span>
                      <span>{selectedOrder.fechaProgramada ? new Date(selectedOrder.fechaProgramada).toLocaleDateString('es-ES') : '-'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Tiempos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Horas estimadas:</span>
                      <span>{selectedOrder.horasEstimadas || '-'} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Código:</span>
                      <span>{selectedOrder.codigo || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Descripción</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedOrder.description}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Cerrar</Button>
                <Button variant="outline">Editar</Button>
                {selectedOrder.estado?.nombre === 'Planificada' && <Button>Iniciar Trabajo</Button>}
                {selectedOrder.estado?.nombre === 'En Ejecución' && <Button>Cerrar OT</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
