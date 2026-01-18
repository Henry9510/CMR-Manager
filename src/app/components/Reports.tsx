import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Calendar, TrendingUp, Activity, DollarSign, Clock, Settings } from 'lucide-react';
import { mockKPIs, mockWorkOrders, mockFailures, mockEquipment } from '../data/mockData';

export function Reports() {
  const [reportType, setReportType] = useState('technical');
  const [period, setPeriod] = useState('monthly');

  const kpis = mockKPIs;

  // Datos para gráficos de tendencias
  const monthlyTrends = [
    { mes: 'Jul', mtbf: 650, mttr: 6.2, disponibilidad: 92.5, costos: 118 },
    { mes: 'Ago', mtbf: 680, mttr: 6.8, disponibilidad: 91.8, costos: 132 },
    { mes: 'Sep', mtbf: 720, mttr: 5.9, disponibilidad: 93.2, costos: 115 },
    { mes: 'Oct', mtbf: 710, mttr: 6.1, disponibilidad: 93.8, costos: 128 },
    { mes: 'Nov', mtbf: 730, mttr: 5.5, disponibilidad: 94.5, costos: 120 },
    { mes: 'Dic', mtbf: 715, mttr: 5.8, disponibilidad: 93.9, costos: 126 },
    { mes: 'Ene', mtbf: 720, mttr: 5.75, disponibilidad: 94.2, costos: 125 },
  ];

  // Comparativa de costos
  const costComparison = [
    { categoria: 'Mano de Obra', costo: 45000 },
    { categoria: 'Repuestos', costo: 52000 },
    { categoria: 'Servicios Externos', costo: 18000 },
    { categoria: 'Otros', costo: 10000 },
  ];

  // Reporte de equipos críticos
  const criticalEquipment = mockEquipment.filter(eq => eq.criticality === 'Alta');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Reportes e Indicadores</h1>
        <p className="text-gray-500">Análisis y reportes del sistema de mantenimiento</p>
      </div>

      {/* Selector de tipo de reporte */}
      <Card>
        <CardHeader>
          <CardTitle>Generar Reporte</CardTitle>
          <CardDescription>Seleccione el tipo y período del reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Técnico - KPIs</SelectItem>
                  <SelectItem value="management">Gerencial - Resumen</SelectItem>
                  <SelectItem value="costs">Costos de Mantenimiento</SelectItem>
                  <SelectItem value="equipment">Estado de Equipos</SelectItem>
                  <SelectItem value="failures">Análisis de Fallas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Formato</Label>
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs con diferentes tipos de reportes */}
      <Tabs defaultValue="kpis">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kpis">Indicadores KPI</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="costs">Análisis de Costos</TabsTrigger>
          <TabsTrigger value="summary">Resumen Ejecutivo</TabsTrigger>
        </TabsList>

        {/* Panel de KPIs */}
        <TabsContent value="kpis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-gray-500">MTBF</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{kpis.mtbf}</div>
                <p className="text-xs text-gray-500">horas entre fallas</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2.3% vs mes anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-gray-500">MTTR</CardTitle>
                  <Settings className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{kpis.mttr}</div>
                <p className="text-xs text-gray-500">horas de reparación</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  -5.2% vs mes anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-gray-500">Disponibilidad</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{kpis.availability}%</div>
                <p className="text-xs text-gray-500">de tiempo operativo</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.5% vs mes anterior
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-gray-500">Confiabilidad</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{kpis.reliability}%</div>
                <p className="text-xs text-gray-500">sin interrupciones</p>
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.2% vs mes anterior
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalles de KPIs */}
          <Card>
            <CardHeader>
              <CardTitle>Fórmulas y Cálculos</CardTitle>
              <CardDescription>Definición de indicadores clave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">MTBF - Mean Time Between Failures</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Tiempo promedio entre fallas consecutivas
                  </p>
                  <code className="text-xs bg-white p-2 rounded block">
                    MTBF = Tiempo Total Operativo / Número de Fallas
                  </code>
                  <p className="text-xs text-blue-600 mt-2">
                    Valor actual: {kpis.mtbf} horas
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">MTTR - Mean Time To Repair</h4>
                  <p className="text-sm text-orange-700 mb-2">
                    Tiempo promedio de reparación
                  </p>
                  <code className="text-xs bg-white p-2 rounded block">
                    MTTR = Tiempo Total de Reparación / Número de Reparaciones
                  </code>
                  <p className="text-xs text-orange-600 mt-2">
                    Valor actual: {kpis.mttr} horas
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Disponibilidad</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Porcentaje de tiempo operativo
                  </p>
                  <code className="text-xs bg-white p-2 rounded block">
                    Disponibilidad = (MTBF / (MTBF + MTTR)) × 100
                  </code>
                  <p className="text-xs text-green-600 mt-2">
                    Valor actual: {kpis.availability}%
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Confiabilidad</h4>
                  <p className="text-sm text-purple-700 mb-2">
                    Probabilidad de operación sin fallas
                  </p>
                  <code className="text-xs bg-white p-2 rounded block">
                    Confiabilidad = e^(-t/MTBF) × 100
                  </code>
                  <p className="text-xs text-purple-600 mt-2">
                    Valor actual: {kpis.reliability}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Panel de tendencias */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolución de MTBF y MTTR</CardTitle>
                <CardDescription>Últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mtbf" stroke="#3b82f6" strokeWidth={2} name="MTBF (hrs)" />
                    <Line type="monotone" dataKey="mttr" stroke="#f59e0b" strokeWidth={2} name="MTTR (hrs)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Disponibilidad</CardTitle>
                <CardDescription>Últimos 7 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[90, 95]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="disponibilidad" stroke="#10b981" strokeWidth={2} name="Disponibilidad (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución de Costos</CardTitle>
              <CardDescription>Costos mensuales en miles de $</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}K`} />
                  <Legend />
                  <Bar dataKey="costos" fill="#8b5cf6" name="Costos ($K)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Panel de análisis de costos */}
        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Costo Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${(kpis.maintenanceCost / 1000).toFixed(0)}K</div>
                <p className="text-xs text-gray-500">Este mes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Preventivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">${(kpis.preventiveCost / 1000).toFixed(0)}K</div>
                <p className="text-xs text-gray-500">
                  {((kpis.preventiveCost / kpis.maintenanceCost) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">Correctivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">${(kpis.correctiveCost / 1000).toFixed(0)}K</div>
                <p className="text-xs text-gray-500">
                  {((kpis.correctiveCost / kpis.maintenanceCost) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Costos</CardTitle>
              <CardDescription>Desglose por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costComparison} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="categoria" type="category" width={150} />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="costo" fill="#8b5cf6" name="Costo ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Panel resumen ejecutivo */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Ejecutivo - Enero 2026</CardTitle>
              <CardDescription>Informe gerencial del período</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Estado General del Sistema</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{kpis.availability}%</div>
                    <div className="text-xs text-gray-600">Disponibilidad</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{mockEquipment.filter(e => e.status === 'Operativo').length}</div>
                    <div className="text-xs text-gray-600">Equipos Operativos</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {mockWorkOrders.filter(o => o.status !== 'Cerrada').length}
                    </div>
                    <div className="text-xs text-gray-600">OTs Activas</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{mockFailures.length}</div>
                    <div className="text-xs text-gray-600">Fallas Registradas</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Equipos Críticos</h3>
                <div className="space-y-2">
                  {criticalEquipment.slice(0, 5).map(eq => (
                    <div key={eq.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium text-sm">{eq.name}</p>
                        <p className="text-xs text-gray-500">{eq.code}</p>
                      </div>
                      <Badge className={
                        eq.status === 'Operativo' ? 'bg-green-100 text-green-800' :
                        eq.status === 'En Mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {eq.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Conclusiones y Recomendaciones</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>La disponibilidad se mantiene por encima del objetivo del 93%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>El MTBF ha mejorado un 2.3% respecto al mes anterior</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">!</span>
                    <span>Se recomienda incrementar frecuencia de mantenimiento preventivo en bombas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">!</span>
                    <span>Revisar stock de sellos mecánicos (por debajo del mínimo)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">→</span>
                    <span>Evaluar implementación de análisis predictivo en motores principales</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
