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
  ChevronRight,
  ChevronDown,
  Factory,
  Grid3x3,
  Settings,
  Box,
  Search,
  AlertCircle,
} from 'lucide-react';
import { Equipment } from '../types';

const API_URL = 'http://localhost:8080/api/equipos';

export function EquipmentManagement() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =======================
     CARGAR EQUIPOS BACKEND
     ======================= */
  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar equipos');

      const data = await response.json();

      // Adaptar backend → frontend
      const mapped: Equipment[] = data.map((eq: any) => ({
        id: String(eq.id),
        name: eq.nombre,
        code: eq.numeroParte,

        // Catálogos
        type: eq.tipo?.nombre ?? 'N/A',
        status: eq.estado?.nombre ?? 'N/A',
        location: eq.ubicacion?.nombre ?? 'N/A',

        // Opcional (si lo tienes)
        criticality: eq.criticidad?.nivel ?? 'Media',

      }));


      setEquipments(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     CONSTRUIR ÁRBOL
     ======================= */
  const buildTree = (items: Equipment[]): Equipment[] => {
    const map = new Map<string, Equipment>();
    const roots: Equipment[] = [];

    items.forEach(item => map.set(item.id, { ...item, children: [] }));

    items.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parent) {
        const parent = map.get(item.parent);
        parent?.children?.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const filteredEquipment = equipments.filter(eq =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const equipmentTree = buildTree(searchTerm ? filteredEquipment : equipments);

  /* =======================
     UI HELPERS
     ======================= */
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
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

  /* =======================
     RENDER TREE
     ======================= */
  const renderTreeNode = (equipment: Equipment, level = 0) => {
    const isExpanded = expandedItems.has(equipment.id);
    const hasChildren = equipment.children && equipment.children.length > 0;
    const isSelected = selectedEquipment?.id === equipment.id;

    return (
      <div key={equipment.id}>
        <div
          className={`flex items-center space-x-2 py-2 px-3 cursor-pointer hover:bg-gray-50 rounded ${isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
            }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => setSelectedEquipment(equipment)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(equipment.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {getIcon(equipment.type)}
          <span className="flex-1 text-sm">{equipment.name}</span>
          <span
            className={`h-2 w-2 rounded-full ${getCriticalityColor(
              equipment.criticality
            )}`}
          />
        </div>

        {hasChildren &&
          isExpanded &&
          equipment.children!.map(child =>
            renderTreeNode(child, level + 1)
          )}
      </div>
    );
  };

  /* =======================
     LOADING / ERROR
     ======================= */
  if (loading) return <p>Cargando equipos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Gestión de Equipos</h1>
        <p className="text-gray-500">
          Árbol jerárquico de equipos industriales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Árbol */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Jerarquía de Equipos</CardTitle>
            <CardDescription>
              Planta → Línea → Máquina → Componente
            </CardDescription>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar equipo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent className="max-h-[600px] overflow-y-auto">
            {equipmentTree.map(eq => renderTreeNode(eq))}
          </CardContent>
        </Card>

        {/* Detalles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Detalles del Equipo</CardTitle>
                <CardDescription>
                  {selectedEquipment?.code || 'Seleccione un equipo'}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(selectedEquipment?.status || '')}>
                {selectedEquipment?.status || '-'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {selectedEquipment ? (
              <div className="space-y-6">
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
                    <label className="text-xs text-gray-500">Ubicación</label>
                    <p className="text-sm">{selectedEquipment.location}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <Button>Crear OT</Button>
                  <Button variant="outline">Ver Historial</Button>
                  <Button variant="outline">Editar</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Seleccione un equipo del árbol</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
