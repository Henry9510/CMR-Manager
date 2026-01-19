import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar, Clock, AlertCircle, CheckCircle2, PlayCircle, Plus } from 'lucide-react';
import { mockMaintenancePlans } from '../data/mockData';
import { MaintenancePlan } from '../types';

export function Planning() {
  const [selectedMonth, setSelectedMonth] = useState(0); // Enero 2026
  
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Generar calendario del mes
  const generateCalendar = (monthIndex: number) => {
    const year = 2026;
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    const calendar = [];
    let week = new Array(7).fill(null);
    
    // Ajustar para que lunes sea el primer día (0 = Domingo en JS)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayIndex = (adjustedFirstDay + day - 1) % 7;
      week[dayIndex] = day;
      
      if (dayIndex === 6 || day === daysInMonth) {
        calendar.push([...week]);
        week = new Array(7).fill(null);
      }
    }
    
    return calendar;
  };

  // Obtener planes para un día específico
  const getPlansForDay = (day: number) => {
    const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
    return mockMaintenancePlans.filter(plan => plan.nextExecution === dateStr);
  };

  const calendar = generateCalendar(selectedMonth);
  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  // Próximos planes (siguientes 7 días)
  const today = new Date('2026-01-08');
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingPlans = mockMaintenancePlans
    .filter(plan => {
      const planDate = new Date(plan.nextExecution);
      return planDate >= today && planDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.nextExecution).getTime() - new Date(b.nextExecution).getTime());

  const getFrequencyColor = (plan: MaintenancePlan) => {
    if (plan.frequencyUnit === 'Semanas' || plan.frequency === 1) {
      return 'bg-blue-100 text-blue-800';
    }
    if (plan.frequency <= 3) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Planificación de Mantenimiento</h1>
        <p className="text-gray-500">Calendario y programación de actividades</p>
      </div>

      {/* Resumen de planes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Planes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockMaintenancePlans.filter(p => p.active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">{upcomingPlans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Preventivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              {mockMaintenancePlans.filter(p => p.type === 'Preventivo').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Predictivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-purple-600">
              {mockMaintenancePlans.filter(p => p.type === 'Predictivo').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario mensual */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Calendario de Mantenimiento</CardTitle>
                <CardDescription>{months[selectedMonth]} 2026</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
                  disabled={selectedMonth === 0}
                >
                  ‹
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
                  disabled={selectedMonth === 11}
                >
                  ›
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day, i) => (
                  <div key={i} className="text-center text-sm font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Días del mes */}
              {calendar.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIndex) => {
                    const plans = day ? getPlansForDay(day) : [];
                    const isToday = selectedMonth === 0 && day === 8;
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`
                          min-h-[80px] border rounded p-2 text-sm
                          ${day ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'}
                          ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
                        `}
                      >
                        {day && (
                          <>
                            <div className={`text-xs mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
                              {day}
                            </div>
                            {plans.length > 0 && (
                              <div className="space-y-1">
                                {plans.slice(0, 2).map((plan, i) => (
                                  <div
                                    key={i}
                                    className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                                    title={plan.name}
                                  >
                                    {plan.code}
                                  </div>
                                ))}
                                {plans.length > 2 && (
                                  <div className="text-xs text-gray-500">+{plans.length - 2}</div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Leyenda */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-500 rounded"></div>
                <span>Mantenimiento programado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
                <span>Hoy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos planes */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos 7 Días</CardTitle>
            <CardDescription>Planes programados próximamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingPlans.length > 0 ? (
                upcomingPlans.map((plan) => (
                  <div key={plan.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{plan.name}</p>
                        <p className="text-xs text-gray-500">{plan.equipmentName}</p>
                      </div>
                      <Badge className="text-xs bg-blue-100 text-blue-800">{plan.type}</Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(plan.nextExecution).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No hay planes programados</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listado de planes maestros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Plan Maestro de Mantenimiento</CardTitle>
              <CardDescription>Programas de mantenimiento configurados</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Última Ejecución</TableHead>
                <TableHead>Próxima Ejecución</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaintenancePlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.code}</TableCell>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.equipmentName}</TableCell>
                  <TableCell>
                    <Badge className={plan.type === 'Preventivo' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                      {plan.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getFrequencyColor(plan)} variant="outline">
                      {plan.frequency} {plan.frequencyUnit}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {plan.lastExecution ? new Date(plan.lastExecution).toLocaleDateString('es-ES') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-blue-600" />
                      {new Date(plan.nextExecution).toLocaleDateString('es-ES')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.active ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
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
