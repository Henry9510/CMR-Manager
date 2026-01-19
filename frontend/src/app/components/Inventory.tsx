import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Search, Plus, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { mockSpareParts } from '../data/mockData';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredParts = mockSpareParts.filter(part => {
    const matchesSearch = 
      part.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || part.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas
  const categories = Array.from(new Set(mockSpareParts.map(p => p.category)));

  // Calcular estadísticas
  const stats = {
    totalItems: mockSpareParts.length,
    totalValue: mockSpareParts.reduce((sum, part) => sum + (part.stock * part.unitCost), 0),
    lowStock: mockSpareParts.filter(part => part.stock < part.minStock).length,
    okStock: mockSpareParts.filter(part => part.stock >= part.minStock && part.stock <= part.maxStock).length,
  };

  const getStockStatus = (part: typeof mockSpareParts[0]) => {
    const percentage = (part.stock / part.maxStock) * 100;
    
    if (part.stock < part.minStock) {
      return { status: 'Bajo', color: 'text-red-600', bgColor: 'bg-red-100', percentage };
    }
    if (part.stock > part.maxStock) {
      return { status: 'Exceso', color: 'text-orange-600', bgColor: 'bg-orange-100', percentage };
    }
    return { status: 'Normal', color: 'text-green-600', bgColor: 'bg-green-100', percentage };
  };

  const getStockProgressColor = (percentage: number, stock: number, minStock: number) => {
    if (stock < minStock) return 'bg-red-500';
    if (percentage > 80) return 'bg-green-500';
    if (percentage > 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Inventario de Repuestos</h1>
        <p className="text-gray-500">Gestión de stock y almacén</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total de Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-2xl">{stats.totalItems}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-2xl">${(stats.totalValue / 1000).toFixed(0)}K</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div className="text-2xl text-red-600">{stats.lowStock}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Stock Normal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-2xl text-green-600">{stats.okStock}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de stock bajo */}
      {stats.lowStock > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <CardTitle className="text-red-900">Alertas de Stock Bajo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockSpareParts
                .filter(part => part.stock < part.minStock)
                .map(part => (
                  <div key={part.id} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <p className="text-sm font-medium">{part.name}</p>
                      <p className="text-xs text-gray-500">{part.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        Stock: {part.stock} / Mín: {part.minStock}
                      </p>
                      <Button size="sm" variant="outline" className="mt-1 text-xs">
                        Solicitar compra
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Listado de repuestos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Catálogo de Repuestos</CardTitle>
              <CardDescription>Gestión de piezas y materiales</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Repuesto
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Costo Unit.</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.map((part) => {
                const stockInfo = getStockStatus(part);
                return (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.code}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{part.name}</div>
                        <div className="text-xs text-gray-500">{part.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{part.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 min-w-[120px]">
                        <div className="flex items-center justify-between text-xs">
                          <span>{part.stock} uds</span>
                          <span className="text-gray-400">{part.maxStock}</span>
                        </div>
                        <Progress 
                          value={stockInfo.percentage} 
                          className="h-2"
                        />
                        <div className="text-xs text-gray-500">
                          Min: {part.minStock}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={stockInfo.bgColor + ' ' + stockInfo.color}>
                        {stockInfo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{part.location}</TableCell>
                    <TableCell className="text-sm">${part.unitCost.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">
                      ${(part.stock * part.unitCost).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Ver</Button>
                        <Button variant="ghost" size="sm">Mover</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Movimientos recientes (simulado) */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos Recientes</CardTitle>
          <CardDescription>Últimas entradas y salidas de almacén</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Repuesto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>OT Relacionada</TableHead>
                <TableHead>Usuario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>07/01/2026</TableCell>
                <TableCell>
                  <Badge className="bg-red-100 text-red-800">Salida</Badge>
                </TableCell>
                <TableCell>Sello Mecánico 50mm</TableCell>
                <TableCell>1</TableCell>
                <TableCell>OT-2026-002</TableCell>
                <TableCell>Carlos Rodríguez</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>05/01/2026</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Entrada</Badge>
                </TableCell>
                <TableCell>Aceite Hidráulico ISO 68</TableCell>
                <TableCell>10</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Almacén</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>04/01/2026</TableCell>
                <TableCell>
                  <Badge className="bg-red-100 text-red-800">Salida</Badge>
                </TableCell>
                <TableCell>Ventilador Axial 24V</TableCell>
                <TableCell>1</TableCell>
                <TableCell>OT-2026-003</TableCell>
                <TableCell>Ana Martínez</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>03/01/2026</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">Entrada</Badge>
                </TableCell>
                <TableCell>Rodamiento SKF 6205</TableCell>
                <TableCell>12</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Almacén</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
