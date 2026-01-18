import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronRight, ChevronDown, Factory, Grid3x3, Settings, Box, Search, AlertCircle } from 'lucide-react';
import { mockEquipment } from '../data/mockData';
import { Equipment } from '../types';

export function EquipmentManagement() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['1', '1-1']));
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(mockEquipment[2]);
  const [searchTerm, setSearchTerm] = useState('');

  // Construir árbol jerárquico
  const buildTree = (items: Equipment[]): Equipment[] => {
    const map = new Map<string, Equipment>();
    const roots: Equipment[] = [];

    items.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });

    items.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parent) {
        const parent = map.get(item.parent);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const filteredEquipment = mockEquipment.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const equipmentTree = buildTree(searchTerm ? filteredEquipment : mockEquipment);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Planta': return <Factory className="h-4 w-4" />;
      case 'Línea': return <Grid3x3 className="h-4 w-4" />;
      case 'Máquina': return <Settings className="h-4 w-4" />;
      case 'Componente': return <Box className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operativo': return 'bg-green-100 text-green-800';
      case 'Detenido': return 'bg-red-100 text-red-800';
      case 'En Mantenimiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTreeNode = (equipment: Equipment, level: number = 0) => {
    const isExpanded = expandedItems.has(equipment.id);
    const hasChildren = equipment.children && equipment.children.length > 0;
    const isSelected = selectedEquipment?.id === equipment.id;

    return (
      <div key={equipment.id}>
        <div
          className={`flex items-center space-x-2 py-2 px-3 cursor-pointer hover:bg-gray-50 rounded ${
            isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => setSelectedEquipment(equipment)}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(equipment.id); }}>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          {getIcon(equipment.type)}
          
          <span className="flex-1 text-sm">{equipment.name}</span>
          
          <span className={`h-2 w-2 rounded-full ${getCriticalityColor(equipment.criticality)}`} />
        </div>

        {hasChildren && isExpanded && equipment.children!.map(child => renderTreeNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Gestión de Equipos</h1>
        <p className="text-gray-500">Árbol jerárquico de equipos industriales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Árbol de equipos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Jerarquía de Equipos</CardTitle>
            <CardDescription>Planta → Línea → Máquina → Componente</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            {equipmentTree.map(equipment => renderTreeNode(equipment))}
          </CardContent>
        </Card>

        {/* Detalles del equipo seleccionado */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detalles del Equipo</CardTitle>
                <CardDescription>
                  {selectedEquipment ? selectedEquipment.code : 'Seleccione un equipo'}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(selectedEquipment?.status || 'Operativo')}>
                {selectedEquipment?.status || '-'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {selectedEquipment ? (
              <div className="space-y-6">
                {/* Información general */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Información General</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Nombre</label>
                      <p className="text-sm">{selectedEquipment.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Código</label>
                      <p className="text-sm">{selectedEquipment.code}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Tipo</label>
                      <p className="text-sm">{selectedEquipment.type}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Criticidad</label>
                      <div className="flex items-center space-x-2">
                        <span className={`h-3 w-3 rounded-full ${getCriticalityColor(selectedEquipment.criticality)}`} />
                        <span className="text-sm">{selectedEquipment.criticality}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Ubicación</label>
                      <p className="text-sm">{selectedEquipment.location}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Estado</label>
                      <p className="text-sm">{selectedEquipment.status}</p>
                    </div>
                  </div>
                </div>

                {/* Datos técnicos (si existen) */}
                {selectedEquipment.manufacturer && (
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Datos Técnicos</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Fabricante</label>
                        <p className="text-sm">{selectedEquipment.manufacturer}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Modelo</label>
                        <p className="text-sm">{selectedEquipment.model}</p>
                      </div>
                      {selectedEquipment.serialNumber && (
                        <div>
                          <label className="text-xs text-gray-500">Número de Serie</label>
                          <p className="text-sm">{selectedEquipment.serialNumber}</p>
                        </div>
                      )}
                      {selectedEquipment.installDate && (
                        <div>
                          <label className="text-xs text-gray-500">Fecha de Instalación</label>
                          <p className="text-sm">
                            {new Date(selectedEquipment.installDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Historial y alertas simuladas */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Alertas y Notificaciones</h3>
                  <div className="space-y-2">
                    {selectedEquipment.status === 'En Mantenimiento' && (
                      <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Mantenimiento en curso</p>
                          <p className="text-xs text-yellow-700">El equipo está actualmente en mantenimiento</p>
                        </div>
                      </div>
                    )}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-900">
                        Próximo mantenimiento programado: <span className="font-medium">15/01/2026</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button variant="default">Crear OT</Button>
                  <Button variant="outline">Ver Historial</Button>
                  <Button variant="outline">Editar Datos</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Seleccione un equipo del árbol para ver sus detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
