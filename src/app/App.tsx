import { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  ClipboardList, 
  Calendar, 
  Package, 
  AlertTriangle, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { EquipmentManagement } from './components/EquipmentManagement';
import { WorkOrders } from './components/WorkOrders';
import { Planning } from './components/Planning';
import { Inventory } from './components/Inventory';
import { FailureAnalysis } from './components/FailureAnalysis';
import { Reports } from './components/Reports';

type Section = 'dashboard' | 'equipment' | 'workOrders' | 'planning' | 'inventory' | 'failures' | 'reports';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard' as Section, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipment' as Section, name: 'Equipos', icon: Settings },
    { id: 'workOrders' as Section, name: 'Órdenes de Trabajo', icon: ClipboardList },
    { id: 'planning' as Section, name: 'Planificación', icon: Calendar },
    { id: 'inventory' as Section, name: 'Inventario', icon: Package },
    { id: 'failures' as Section, name: 'Análisis de Fallas', icon: AlertTriangle },
    { id: 'reports' as Section, name: 'Reportes', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'workOrders':
        return <WorkOrders />;
      case 'planning':
        return <Planning />;
      case 'inventory':
        return <Inventory />;
      case 'failures':
        return <FailureAnalysis />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">EASY MAINT</h1>
              <p className="text-xs text-blue-200">Sistema CMMS v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-blue-100 hover:bg-blue-800/50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <div className="text-xs text-blue-200">
            <p>Usuario: Admin</p>
            <p>Planta Universal</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Jueves, 8 de Enero 2026</p>
              <p className="text-xs text-gray-500">10:10 AM</p>
            </div>
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
