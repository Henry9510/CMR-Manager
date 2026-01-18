import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Plus, AlertTriangle, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { mockFailures } from '../data/mockData';

export function FailureAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFailures = mockFailures.filter(failure =>
    failure.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    failure.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    failure.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estadísticas
  const stats = {
    totalFailures: mockFailures.length,
    totalDowntime: mockFailures.reduce((sum, f) => sum + f.downtime, 0),
    totalCost: mockFailures.reduce((sum, f) => sum + (f.cost || 0), 0),
    avgDowntime: mockFailures.reduce((sum, f) => sum + f.downtime, 0) / mockFailures.length,
  };

  // Datos para gráficos
  const failuresByType = [
    { name: 'Eléctrica', value: mockFailures.filter(f => f.type === 'Eléctrica').length, color: '#3b82f6' },
    { name: 'Mecánica', value: mockFailures.filter(f => f.type === 'Mecánica').length, color: '#f59e0b' },
    { name: 'Hidráulica', value: mockFailures.filter(f => f.type === 'Hidráulica').length, color: '#8b5cf6' },
    { name: 'Electrónica', value: mockFailures.filter(f => f.type === 'Electrónica').length, color: '#10b981' },
  ];

  // Análisis por equipo
  const failuresByEquipment = Array.from(
    mockFailures.reduce((map, failure) => {
      const count = map.get(failure.equipmentName) || 0;
      map.set(failure.equipmentName, count + 1);
      return map;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name, fallas: count }));

  // Plantilla de 5 porqués
  const [whyAnalysis, setWhyAnalysis] = useState({
    problema: '',
    why1: '',
    why2: '',
    why3: '',
    why4: '',
    why5: '',
    causaRaiz: '',
    accionCorrectiva: '',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Análisis de Fallas</h1>
        <p className="text-gray-500">Registro y análisis de causa raíz (RCFA)</p>
      </div>

      {/* Estadísticas de fallas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Fallas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div className="text-2xl">{stats.totalFailures}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Tiempo Parada Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600 mr-3" />
              <div className="text-2xl">{stats.totalDowntime} hrs</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Costo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
              <div className="text-2xl">${(stats.totalCost / 1000).toFixed(0)}K</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-2xl">{stats.avgDowntime.toFixed(1)} hrs</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de análisis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fallas por Tipo</CardTitle>
            <CardDescription>Distribución de tipos de falla</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={failuresByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {failuresByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fallas por Equipo</CardTitle>
            <CardDescription>Equipos con más incidencias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={failuresByEquipment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="fallas" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Herramientas de análisis */}
      <Card>
        <CardHeader>
          <CardTitle>Herramientas de Análisis</CardTitle>
          <CardDescription>Métodos de análisis de causa raíz</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="5why">
            <TabsList>
              <TabsTrigger value="5why">5 Porqués</TabsTrigger>
              <TabsTrigger value="ishikawa">Diagrama Ishikawa</TabsTrigger>
              <TabsTrigger value="pareto">Análisis Pareto</TabsTrigger>
            </TabsList>

            <TabsContent value="5why" className="space-y-4 pt-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 text-blue-900">Método de los 5 Porqués</h4>
                <p className="text-sm text-blue-700">
                  Técnica de análisis que busca la causa raíz preguntando "¿Por qué?" sucesivamente.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Problema Observado</Label>
                  <Textarea
                    placeholder="Describa el problema o falla observada..."
                    value={whyAnalysis.problema}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, problema: e.target.value })}
                  />
                </div>

                <div>
                  <Label>1. ¿Por qué ocurrió el problema?</Label>
                  <Input
                    placeholder="Primera causa..."
                    value={whyAnalysis.why1}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, why1: e.target.value })}
                  />
                </div>

                <div>
                  <Label>2. ¿Por qué ocurrió eso?</Label>
                  <Input
                    placeholder="Segunda causa..."
                    value={whyAnalysis.why2}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, why2: e.target.value })}
                  />
                </div>

                <div>
                  <Label>3. ¿Por qué ocurrió eso?</Label>
                  <Input
                    placeholder="Tercera causa..."
                    value={whyAnalysis.why3}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, why3: e.target.value })}
                  />
                </div>

                <div>
                  <Label>4. ¿Por qué ocurrió eso?</Label>
                  <Input
                    placeholder="Cuarta causa..."
                    value={whyAnalysis.why4}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, why4: e.target.value })}
                  />
                </div>

                <div>
                  <Label>5. ¿Por qué ocurrió eso?</Label>
                  <Input
                    placeholder="Quinta causa..."
                    value={whyAnalysis.why5}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, why5: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Causa Raíz Identificada</Label>
                  <Textarea
                    placeholder="Resumen de la causa raíz..."
                    value={whyAnalysis.causaRaiz}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, causaRaiz: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Acción Correctiva Propuesta</Label>
                  <Textarea
                    placeholder="Acción para eliminar la causa raíz..."
                    value={whyAnalysis.accionCorrectiva}
                    onChange={(e) => setWhyAnalysis({ ...whyAnalysis, accionCorrectiva: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Limpiar</Button>
                  <Button>Guardar Análisis</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ishikawa" className="pt-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold mb-2 text-purple-900">Diagrama Causa-Efecto (Ishikawa)</h4>
                <p className="text-sm text-purple-700 mb-4">
                  También conocido como diagrama de espina de pescado. Analiza las causas agrupadas en categorías.
                </p>
                <div className="bg-white p-6 rounded border text-center">
                  <p className="text-gray-500 text-sm">Vista de diagrama Ishikawa</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Categorías: Mano de obra, Máquina, Material, Método, Medición, Medio ambiente
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pareto" className="pt-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-900">Análisis de Pareto</h4>
                <p className="text-sm text-green-700 mb-4">
                  Principio 80/20: el 80% de los problemas proviene del 20% de las causas.
                </p>
                <div className="bg-white p-6 rounded border text-center">
                  <p className="text-gray-500 text-sm">Gráfico de Pareto de fallas</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Identifica las causas más frecuentes para priorizar acciones
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Historial de fallas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Historial de Fallas</CardTitle>
              <CardDescription>Registro completo de incidencias</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Falla
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Registrar Nueva Falla</DialogTitle>
                  <DialogDescription>Complete la información del incidente</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Equipo Afectado</Label>
                      <Input placeholder="Seleccionar equipo" />
                    </div>
                    <div>
                      <Label>Tipo de Falla</Label>
                      <Input placeholder="Eléctrica, Mecánica, etc." />
                    </div>
                  </div>
                  <div>
                    <Label>Descripción de la Falla</Label>
                    <Textarea placeholder="Describa detalladamente la falla..." rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tiempo de Parada (horas)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label>Costo Estimado</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancelar</Button>
                    <Button>Registrar</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por código, equipo o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tiempo Parada</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>OT</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFailures.map((failure) => (
                <TableRow key={failure.id}>
                  <TableCell className="font-medium">{failure.code}</TableCell>
                  <TableCell>{new Date(failure.date).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>{failure.equipmentName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{failure.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{failure.description}</TableCell>
                  <TableCell>{failure.downtime} hrs</TableCell>
                  <TableCell>${failure.cost?.toLocaleString() || '-'}</TableCell>
                  <TableCell>
                    {failure.workOrderId ? (
                      <Badge className="bg-blue-100 text-blue-800">{failure.workOrderId}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Ver</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
