import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Settings,
  Search,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Pencil,
  Trash,
} from 'lucide-react';

import { Equipment } from '../types';

const API_URL = 'http://localhost:8080/api/equipos';

export function EquipmentManagement() {
  // Estado principal
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showEditComponentModal, setShowEditComponentModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<any>(null);
  const [editingComponent, setEditingComponent] = useState<any>(null);

  // Datos de formularios
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    tipoId: '',
    ubicacionId: '',
    estadoId: '',
    criticidadId: '',
  });

  const [componentForm, setComponentForm] = useState({
    nombre: '',
    numeroParte: '',
    descripcion: '',
    criticidadId: '',
  });

  const [editComponentForm, setEditComponentForm] = useState({
    nombre: '',
    numeroParte: '',
    descripcion: '',
    criticidadId: '',
  });

  // Catálogos
  const [tiposEquipo, setTiposEquipo] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [criticidades, setCriticidades] = useState<any[]>([]);

  // Estados únicos para filtro
  const statuses = ['Todos', ...new Set(equipments.map(eq => eq.status))];

  // Convertir valor a número o null
  const toNumber = (val: any) => val !== '' && val !== null ? Number(val) : null;

  /* =======================
     CARGAR DATOS DE CATÁLOGOS
     ======================= */
  const loadCatalogData = async () => {
    try {
      const [tiposRes, ubicacionesRes, estadosRes, criticidadesRes] = await Promise.all([
        fetch('http://localhost:8080/api/tipos-equipo'),
        fetch('http://localhost:8080/api/ubicaciones'),
        fetch('http://localhost:8080/api/estados'),
        fetch('http://localhost:8080/api/criticidades'),
      ]);

      if (tiposRes.ok) setTiposEquipo(await tiposRes.json());
      if (ubicacionesRes.ok) setUbicaciones(await ubicacionesRes.json());
      if (estadosRes.ok) setEstados(await estadosRes.json());
      if (criticidadesRes.ok) setCriticidades(await criticidadesRes.json());
    } catch (err) {
      console.error('Error cargando catálogos:', err);
    }
  };

  /* =======================
     CARGAR EQUIPOS BACKEND
     ======================= */
  useEffect(() => {
    loadEquipments();
    loadCatalogData();
  }, []);

  const loadEquipments = async (keepSelection = false, selectedId?: string) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Error al cargar equipos: ${response.status}`);

      const data = await response.json();
      const mapped: Equipment[] = data.map((eq: any) => ({
        id: String(eq.id),
        name: eq.nombre,
        code: eq.codigo,
        nombre: eq.nombre,
        codigo: eq.codigo,
        type: eq.tipo?.nombre ?? 'N/A',
        status: eq.estado?.nombre ?? 'N/A',
        location: eq.ubicacion?.nombre ?? 'N/A',
        criticality: eq.criticidad?.nivel ?? 'Media',
        tipoId: eq.tipo?.id,
        ubicacionId: eq.ubicacion?.id,
        estadoId: eq.estado?.id,
        criticidadId: eq.criticidad?.id,
        components: eq.componentes || [],
      }));

      setEquipments(mapped);

      if (keepSelection) {
        const idToKeep = selectedId ?? selectedEquipment?.id;
        if (idToKeep) {
          const refreshed = mapped.find(eq => eq.id === String(idToKeep)) || null;
          setSelectedEquipment(refreshed);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     CREAR EQUIPO
     ======================= */
  const handleCreateEquipment = async () => {
    if (!formData.nombre || !formData.codigo) {
      alert('Nombre y código son requeridos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          codigo: formData.codigo,
          tipoId: toNumber(formData.tipoId),
          ubicacionId: toNumber(formData.ubicacionId),
          estadoId: toNumber(formData.estadoId),
          criticidadId: toNumber(formData.criticidadId),
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        loadEquipments(true, responseData.id ? String(responseData.id) : undefined);
        setShowCreateModal(false);
        setFormData({ nombre: '', codigo: '', tipoId: '', ubicacionId: '', estadoId: '', criticidadId: '' });
        alert('Equipo creado exitosamente');
      } else {
        alert('Error al crear equipo: ' + await response.text());
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  /* =======================
     EDITAR EQUIPO
     ======================= */
  const handleEditEquipment = async () => {
    if (!editingEquipment?.id) return;

    try {
      const response = await fetch(`http://localhost:8080/api/equipos/${editingEquipment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editingEquipment.nombre,
          codigo: editingEquipment.codigo,
          tipoId: toNumber(editingEquipment.tipoId),
          ubicacionId: toNumber(editingEquipment.ubicacionId),
          estadoId: toNumber(editingEquipment.estadoId),
          criticidadId: toNumber(editingEquipment.criticidadId),
        }),
      });

      if (response.ok) {
        loadEquipments(true, editingEquipment.id);
        setEditingEquipment(null);
        alert('Equipo actualizado exitosamente');
      } else {
        alert('Error al actualizar equipo: ' + await response.text());
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  /* =======================
     ELIMINAR EQUIPO
     ======================= */
  const handleDeleteEquipment = async () => {
    if (!selectedEquipment) return;
    if (!confirm(`¿Está seguro de que desea eliminar ${selectedEquipment.name}?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/equipos/${selectedEquipment.id}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        setSelectedEquipment(null);
        await loadEquipments();
        alert('Equipo y sus componentes eliminados exitosamente');
      } else {
        const errorText = await response.text();
        alert('Error al eliminar equipo: ' + errorText);
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  /* =======================
     CREAR COMPONENTE
     ======================= */
  const handleCreateComponent = async () => {
    if (!selectedEquipment?.id || !componentForm.nombre || !componentForm.numeroParte) {
      alert('Nombre y número de parte son requeridos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/componentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: componentForm.nombre,
          numeroParte: componentForm.numeroParte,
          descripcion: componentForm.descripcion,
          equipoId: Number(selectedEquipment.id),
          criticidadId: toNumber(componentForm.criticidadId),
        }),
      });

      if (response.ok) {
        loadEquipments(true, selectedEquipment?.id);
        setShowComponentModal(false);
        setComponentForm({ nombre: '', numeroParte: '', descripcion: '', criticidadId: '' });
        alert('Componente creado exitosamente');
      } else {
        alert('Error al crear componente: ' + await response.text());
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handleEditComponent = async () => {
    if (!editingComponent?.id || !editComponentForm.nombre || !editComponentForm.numeroParte) {
      alert('Nombre y número de parte son requeridos');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/componentes/${editingComponent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: editComponentForm.nombre,
          numeroParte: editComponentForm.numeroParte,
          descripcion: editComponentForm.descripcion,
          equipoId: Number(selectedEquipment?.id),
          criticidadId: toNumber(editComponentForm.criticidadId),
        }),
      });

      if (response.ok) {
        loadEquipments(true, selectedEquipment?.id);
        setShowEditComponentModal(false);
        setEditingComponent(null);
        alert('Componente actualizado exitosamente');
      } else {
        alert('Error al actualizar componente: ' + await response.text());
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const handleDeleteComponent = async (componentId: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este componente?')) return;

    try {
      const response = await fetch(`http://localhost:8080/api/componentes/${componentId}`, {
        method: 'DELETE',
      });

      // 204 No Content es el response correcto para DELETE
      if (response.status === 204 || response.ok) {
        // Esperar un poco y luego recargar equipos
        setTimeout(async () => {
          await loadEquipments(true, selectedEquipment?.id);
        }, 200);
        alert('Componente eliminado exitosamente');
      } else {
        const errorText = await response.text();
        alert('Error al eliminar componente: ' + (errorText || `Error ${response.status}`));
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  };

  const openEditComponentModal = (comp: any) => {
    setEditingComponent(comp);
    setEditComponentForm({
      nombre: comp.nombre || '',
      numeroParte: comp.numeroParte || '',
      descripcion: comp.descripcion || '',
      criticidadId: comp.criticidad?.id ? String(comp.criticidad.id) : '',
    });
    setShowEditComponentModal(true);
  };;
  const filteredEquipment = equipments.filter(eq => {
    const matchesSearch = 
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || eq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* =======================
     UI HELPERS
     ======================= */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operativo': return 'bg-green-100 text-green-800';
      case 'Mantenimiento': return 'bg-yellow-100 text-yellow-800';
      case 'Fuera de servicio': return 'bg-red-100 text-red-800';
      case 'Reparación': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Alta': return 'bg-red-500';
      case 'Media': return 'bg-yellow-500';
      case 'Baja': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Operativo': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Mantenimiento': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'Fuera de servicio': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'Reparación': return <Zap className="h-5 w-5 text-orange-600" />;
      default: return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  /* =======================
     LOADING / ERROR
     ======================= */
  if (loading) return <p className="text-center py-12">Cargando equipos...</p>;
  if (error) return <p className="text-center py-12 text-red-500">Error: {error}</p>;

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Gestión de Equipos</h1>
          <p className="text-gray-500">
            Listado y gestión de equipos industriales
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Equipo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LISTA IZQUIERDA */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Equipos</CardTitle>
            <CardDescription>
              Total: {filteredEquipment.length}
            </CardDescription>

            <div className="space-y-3 mt-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 text-sm"
                />
              </div>

              {/* Filtro Estado */}
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="max-h-[600px] overflow-y-auto">
            <div className="space-y-2">
              {filteredEquipment.length > 0 ? (
                filteredEquipment.map(eq => (
                  <div
                    key={eq.id}
                    className={`flex items-center space-x-3 p-3 border rounded cursor-pointer transition ${
                      selectedEquipment?.id === eq.id 
                        ? 'bg-blue-50 border-blue-500 border-2' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedEquipment(eq)}
                  >
                    {getStatusIcon(eq.status)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{eq.name}</p>
                      <p className="text-xs text-gray-500">{eq.code}</p>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${getCriticalityColor(
                        eq.criticality
                      )}`}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hay equipos</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* DETALLES DERECHA */}
        {selectedEquipment ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedEquipment.name}</CardTitle>
                  <CardDescription>{selectedEquipment.code}</CardDescription>
                </div>
                <Badge className={getStatusColor(selectedEquipment.status)}>
                  {selectedEquipment.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Tipo</label>
                  <p className="text-sm font-medium">{selectedEquipment.type}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Ubicación</label>
                  <p className="text-sm font-medium">{selectedEquipment.location}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Criticidad</label>
                  <p className="text-sm font-medium">{selectedEquipment.criticality}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Estado</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(selectedEquipment.status)}
                    <p className="text-sm font-medium">{selectedEquipment.status}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm font-medium mb-3">Componentes</p>
                {selectedEquipment.components && selectedEquipment.components.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEquipment.components.map((comp: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{comp.nombre}</p>
                            <p className="text-xs text-gray-500">Código: {comp.numeroParte}</p>
                            {comp.descripcion && (
                              <p className="text-xs text-gray-600 mt-1">{comp.descripcion}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Badge variant="outline">
                              {comp.criticidad?.nivel || 'N/A'}
                            </Badge>
                            <button
                              title="Editar"
                              className="p-1 hover:bg-blue-100 rounded"
                              onClick={() => openEditComponentModal(comp)}
                            >
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              title="Eliminar"
                              className="p-1 hover:bg-red-100 rounded"
                              onClick={() => handleDeleteComponent(comp.id)}
                            >
                              <Trash className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Relación: Componente de {selectedEquipment.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay componentes registrados</p>
                )}
              </div>

              <div className="border-t pt-6">
                <p className="text-sm font-medium mb-3">Acciones</p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setShowComponentModal(true)} className="flex-1">
                    Agregar Componente
                  </Button>
                  <Button onClick={() => setEditingEquipment(selectedEquipment)} variant="outline" className="flex-1">
                    Editar Equipo
                  </Button>
                  <Button onClick={handleDeleteEquipment} variant="destructive" className="flex-1">
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2">
            <CardContent className="flex items-center justify-center py-16 text-gray-500">
              <div className="text-center">
                <Settings className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Selecciona un equipo para ver detalles</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL CREAR EQUIPO */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Equipo</DialogTitle>
            <DialogDescription>
              Ingresa los detalles del nuevo equipo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                placeholder="Ej: Bomba Centrífuga"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Código</label>
              <Input
                placeholder="Ej: PUMP-001"
                value={formData.codigo}
                onChange={e => setFormData({...formData, codigo: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo de Equipo</label>
              <select
                className="w-full p-2 border rounded bg-white"
                value={formData.tipoId || ''}
                onChange={e => setFormData({...formData, tipoId: e.target.value})}
              >
                <option value="">Selecciona un tipo</option>
                {tiposEquipo.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Ubicación</label>
              <select
                className="w-full p-2 border rounded bg-white"
                value={formData.ubicacionId || ''}
                onChange={e => setFormData({...formData, ubicacionId: e.target.value})}
              >
                <option value="">Selecciona una ubicación</option>
                {ubicaciones.map(u => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Estado</label>
              <select
                className="w-full p-2 border rounded bg-white"
                value={formData.estadoId || ''}
                onChange={e => setFormData({...formData, estadoId: e.target.value})}
              >
                <option value="">Selecciona un estado</option>
                {estados.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Criticidad</label>
              <select
                className="w-full p-2 border rounded bg-white"
                value={formData.criticidadId || ''}
                onChange={e => setFormData({...formData, criticidadId: e.target.value})}
              >
                <option value="">Selecciona una criticidad</option>
                {criticidades.map(c => (
                  <option key={c.id} value={c.id}>{c.nivel}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateModal(false);
              setFormData({ nombre: '', codigo: '', tipoId: '', ubicacionId: '', estadoId: '', criticidadId: '' });
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateEquipment} className="bg-blue-600 hover:bg-blue-700">
              Crear Equipo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EDITAR EQUIPO */}
      <Dialog open={!!editingEquipment} onOpenChange={(open) => {
        if (!open) setEditingEquipment(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Equipo</DialogTitle>
            <DialogDescription>
              Actualiza los detalles del equipo
            </DialogDescription>
          </DialogHeader>
          {editingEquipment && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  placeholder="Nombre"
                  value={editingEquipment.nombre || editingEquipment.name || ''}
                  onChange={e => setEditingEquipment({...editingEquipment, nombre: e.target.value, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Código</label>
                <Input
                  placeholder="Código"
                  value={editingEquipment.codigo || editingEquipment.code || ''}
                  onChange={e => setEditingEquipment({...editingEquipment, codigo: e.target.value, code: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de Equipo</label>
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={editingEquipment.tipoId || editingEquipment.tipo?.id || ''}
                  onChange={e => setEditingEquipment({...editingEquipment, tipoId: e.target.value ? parseInt(e.target.value) : null})}
                >
                  <option value="">Selecciona un tipo</option>
                  {tiposEquipo.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Ubicación</label>
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={editingEquipment.ubicacionId || editingEquipment.ubicacion?.id || ''}
                  onChange={e => setEditingEquipment({...editingEquipment, ubicacionId: e.target.value ? parseInt(e.target.value) : null})}
                >
                  <option value="">Selecciona una ubicación</option>
                  {ubicaciones.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Estado</label>
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={editingEquipment.estadoId || editingEquipment.estado?.id || ''}
                  onChange={e => setEditingEquipment({...editingEquipment, estadoId: e.target.value ? parseInt(e.target.value) : null})}
                >
                  <option value="">Selecciona un estado</option>
                  {estados.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Criticidad</label>
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={editingEquipment.criticidadId || editingEquipment.criticidad?.id || ''}
                  onChange={e => setEditingEquipment({...editingEquipment, criticidadId: e.target.value ? parseInt(e.target.value) : null})}
                >
                  <option value="">Selecciona una criticidad</option>
                  {criticidades.map(c => (
                    <option key={c.id} value={c.id}>{c.nivel}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEquipment(null)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (editingEquipment) {
                handleEditEquipment();
              }
            }} className="bg-blue-600 hover:bg-blue-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL CREAR COMPONENTE */}
      <Dialog open={showComponentModal} onOpenChange={setShowComponentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Componente</DialogTitle>
            <DialogDescription>
              Crea un nuevo componente para {selectedEquipment?.nombre || selectedEquipment?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del Componente</label>
              <Input
                placeholder="Ej: Rodamiento principal"
                value={componentForm.nombre}
                onChange={e => setComponentForm({...componentForm, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Número de Parte</label>
              <Input
                placeholder="Ej: SKF-6209"
                value={componentForm.numeroParte}
                onChange={e => setComponentForm({...componentForm, numeroParte: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Input
                placeholder="Descripción del componente"
                value={componentForm.descripcion}
                onChange={e => setComponentForm({...componentForm, descripcion: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Criticidad</label>
              <select
                className="w-full p-2 border rounded bg-white"
                value={componentForm.criticidadId || ''}
                onChange={e => setComponentForm({...componentForm, criticidadId: e.target.value})}
              >
                <option value="">Selecciona una criticidad</option>
                {criticidades.map(c => (
                  <option key={c.id} value={c.id}>{c.nivel}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowComponentModal(false);
              setComponentForm({ nombre: '', numeroParte: '', descripcion: '', criticidadId: '' });
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateComponent} className="bg-green-600 hover:bg-green-700">
              Crear Componente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL EDITAR COMPONENTE */}
      <Dialog open={showEditComponentModal} onOpenChange={setShowEditComponentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Componente</DialogTitle>
            <DialogDescription>
              Modifica los datos del componente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                placeholder="Nombre del componente"
                value={editComponentForm.nombre}
                onChange={e => setEditComponentForm({ ...editComponentForm, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Número de Parte</label>
              <Input
                placeholder="Número de parte"
                value={editComponentForm.numeroParte}
                onChange={e => setEditComponentForm({ ...editComponentForm, numeroParte: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Input
                placeholder="Descripción"
                value={editComponentForm.descripcion}
                onChange={e => setEditComponentForm({ ...editComponentForm, descripcion: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Criticidad</label>
              <select
                className="w-full p-2 border rounded bg-white"
                value={editComponentForm.criticidadId || ''}
                onChange={e => setEditComponentForm({ ...editComponentForm, criticidadId: e.target.value })}
              >
                <option value="">Selecciona una criticidad</option>
                {criticidades.map(c => (
                  <option key={c.id} value={c.id}>{c.nivel}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditComponentModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditComponent} className="bg-blue-600 hover:bg-blue-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
