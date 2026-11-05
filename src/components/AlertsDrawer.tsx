import React from 'react';
import { useAgro } from '../context/AppContext';
import { AgroAlert } from '../types';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info, Trash2, Droplets, ArrowRight } from 'lucide-react';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  const { alerts, markAlertRead, clearAllAlerts } = useAgro();

  if (!isOpen) return null;

  const getAlertIcon = (severity: AgroAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const getSeverityBg = (severity: AgroAlert['severity'], read: boolean) => {
    if (read) return 'bg-slate-50 border-slate-200 opacity-75';
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-50/70 border-rose-200';
      case 'WARNING':
        return 'bg-amber-50/70 border-amber-200';
      case 'SUCCESS':
        return 'bg-emerald-50/70 border-emerald-200';
      default:
        return 'bg-blue-50/70 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md max-h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Grab bar affordance for mobile touch */}
        <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Notifications & Alerts</h3>
            <p className="text-xs text-slate-500">Autonomous sensor warnings & actuator logs</p>
          </div>
          <div className="flex items-center space-x-1">
            {alerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="p-2 text-slate-400 hover:text-rose-600 transition"
                title="Clear all alerts"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 transition"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[60vh]">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700">All Systems Nominal</p>
              <p className="text-xs text-slate-400 mt-1">No pending warnings or error alerts.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => markAlertRead(alert.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${getSeverityBg(
                  alert.severity,
                  alert.read
                )}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.severity)}
                    <span className="text-xs font-bold text-slate-800">{alert.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed ml-6">{alert.message}</p>

                {alert.type === 'LOW_MOISTURE' && (
                  <div className="mt-2.5 ml-6 pt-2 border-t border-slate-200/60 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                        onNavigateToTab('control');
                      }}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm"
                    >
                      <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Open Irrigation Control</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Alerts are evaluated against active plant threshold parameters.
          </p>
        </div>
      </div>
    </div>
  );
};
