import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, TrendingUp, DollarSign, Wrench, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { mockKPIs, mockWorkOrders, mockFailures } from '../data/mockData';

export function Dashboard() {
  const kpis = mockKPIs;

  // Datos para gráfico de OTs por tipo
  const otByType = [
    { name: 'Preventivo', value: mockWorkOrders.filter(ot => ot.type === 'Preventivo').length, color: '#3b82f6' },
    { name: 'Correctivo', value: mockWorkOrders.filter(ot => ot.type === 'Correctivo').length, color: '#f59e0b' },
    { name: 'Predictivo', value: mockWorkOrders.filter(ot => ot.type === 'Predictivo').length, color: '#8b5cf6' },
    { name: 'Emergencia', value: mockWorkOrders.filter(ot => ot.type === 'Emergencia').length, color: '#ef4444' },
  ];

  // Datos para gráfico de OTs por estado
  const otByStatus = [
    { name: 'Creada', value: mockWorkOrders.filter(ot => ot.status === 'Creada').length },
    { name: 'Planificada', value: mockWorkOrders.filter(ot => ot.status === 'Planificada').length },
    { name: 'En Ejecución', value: mockWorkOrders.filter(ot => ot.status === 'En Ejecución').length },
    { name: 'Cerrada', value: mockWorkOrders.filter(ot => ot.status === 'Cerrada').length },
  ];

  // Datos para gráfico de costos
  const costData = [
    { name: 'Preventivo', costo: kpis.preventiveCost },
    { name: 'Correctivo', costo: kpis.correctiveCost },
  ];

  // Datos de fallas por mes (simulado)
  const failuresByMonth = [
    { mes: 'Jul', fallas: 8 },
    { mes: 'Ago', fallas: 12 },
    { mes: 'Sep', fallas: 6 },
    { mes: 'Oct', fallas: 10 },
    { mes: 'Nov', fallas: 7 },
    { mes: 'Dic', fallas: 9 },
    { mes: 'Ene', fallas: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Dashboard de Mantenimiento</h1>
        <p className="text-gray-500">Resumen general del sistema CMMS</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">MTBF</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{kpis.mtbf} hrs</div>
            <p className="text-xs text-gray-500">Tiempo medio entre fallas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">MTTR</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{kpis.mttr} hrs</div>
            <p className="text-xs text-gray-500">Tiempo medio de reparación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Disponibilidad</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{kpis.availability}%</div>
            <p className="text-xs text-gray-500">Equipos disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Costos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${(kpis.maintenanceCost / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-500">Mantenimiento mensual</p>
          </CardContent>
        </Card>
      </div>

      {/* Estado de órdenes de trabajo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Órdenes de Trabajo</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={otByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Órdenes por Tipo</CardTitle>
            <CardDescription>Distribución de trabajos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={otByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {otByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fallas y costos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Fallas</CardTitle>
            <CardDescription>Últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={failuresByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fallas" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Costos de Mantenimiento</CardTitle>
            <CardDescription>Comparativa preventivo vs correctivo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="costo" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de indicadores adicionales */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Confiabilidad</p>
                <p className="text-xl">{kpis.reliability}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fallas Registradas</p>
                <p className="text-xl">{mockFailures.length}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">OTs Activas</p>
                <p className="text-xl">
                  {mockWorkOrders.filter(ot => ot.status !== 'Cerrada').length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
