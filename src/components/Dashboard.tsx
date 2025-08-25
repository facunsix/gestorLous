import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

type User = {
  id: string | number;
  name?: string;
  role?: "admin" | "user" | string;
};

type Task = {
  id?: string | number;
  title?: string;
  status?: "pending" | "in-progress" | "completed" | string;
  assignedUserId?: string | number;
  createdAt?: string | Date;
};

type DashboardProps = {
  user?: User | null;
  tasks?: Task[];
  users?: User[];
};

/**
 * Dashboard mejorado (ES)
 * - Gráfico que muestra las tareas completadas por usuario
 * - Muestra el gráfico siempre que haya al menos un usuario, incluso si no completaron tareas
 * - Etiquetas y textos en español
 * - No muestra IDs: usa el nombre del usuario (o "Sin nombre")
 * - Ordena los usuarios por tareas completadas (descendente)
 */

const COLORES = ["#60a5fa", "#fbbf24", "#34d399", "#f87171", "#a78bfa"];

const Dashboard: React.FC<DashboardProps> = ({ user = null, tasks = [], users = [] }) => {
  const esAdmin = user?.role === "admin";

  const totalPendientes = tasks.filter((t) => t?.status === "pending").length;
  const totalEnProgreso = tasks.filter((t) => t?.status === "in-progress").length;
  const totalCompletadas = tasks.filter((t) => t?.status === "completed").length;
  const totalTareas = tasks.length;
  const porcentajeCompletadas =
    totalTareas > 0 ? Math.round((totalCompletadas / totalTareas) * 100) : 0;

  // Datos para el gráfico: tareas completadas por usuario
  const usuariosConEstadisticas = useMemo(() => {
    if (!users) return [] as any[];

    const data = users.map((u) => {
      const nombre = u?.name?.trim() || "Sin nombre";
      const tareasUsuario = tasks.filter((t) => String(t.assignedUserId) === String(u.id));
      const completadas = tareasUsuario.filter((t) => t?.status === "completed").length;
      const total = tareasUsuario.length;
      const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
      return {
        name: nombre,
        completadas,
        total,
        porcentaje,
        role: u.role ?? "sin rol",
      };
    });

    // ordenar por completadas (desc)
    data.sort((a, b) => b.completadas - a.completadas);
    return data;
  }, [users, tasks]);

  return (
    <div className="space-y-6 p-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Panel de control</h1>
          <p className="text-sm text-gray-500">Resumen rápido del sistema</p>
        </div>
        <div className="text-sm text-gray-600">{esAdmin ? "Administrador" : "Usuario"}</div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded p-4">
          <div className="text-xs text-gray-500">Tareas totales</div>
          <div className="text-2xl font-semibold">{totalTareas}</div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <div className="text-xs text-gray-500">Pendientes</div>
          <div className="text-2xl font-semibold">{totalPendientes}</div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <div className="text-xs text-gray-500">En progreso</div>
          <div className="text-2xl font-semibold">{totalEnProgreso}</div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <div className="text-xs text-gray-500">Completadas</div>
          <div className="text-2xl font-semibold">{totalCompletadas}</div>
          <div className="text-sm text-gray-500">{porcentajeCompletadas}% completadas</div>
        </div>
      </div>

      {/* Gráfico: tareas completadas por usuario + lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow rounded p-4">
          <h2 className="text-lg font-medium mb-2">Usuarios según tareas completadas</h2>

          {/* Mostrar siempre el gráfico si existe al menos un usuario */}
          {users && users.length > 0 ? (
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={usuariosConEstadisticas}
                  margin={{ top: 24, right: 16, left: 8, bottom: 24 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      if (name === "completadas") return [`${value} tareas`, "Completadas"];
                      if (name === "porcentaje") return [`${value}%`, "Porcentaje"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Usuario: ${label}`}
                  />
                  <Bar dataKey="completadas" name="Tareas completadas" barSize={40}>
                    {usuariosConEstadisticas.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={
                          // si el usuario no tiene tareas, usar color más claro
                          entry.total === 0 ? `${COLORES[idx % COLORES.length]}33` : COLORES[idx % COLORES.length]
                        }
                      />
                    ))}
                    <LabelList dataKey="porcentaje" position="top" formatter={(val: any) => `${val}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-gray-500">No hay usuarios registrados para mostrar el gráfico.</div>
          )}

          <p className="text-xs text-gray-400 mt-2">Ordenado por tareas completadas (de mayor a menor). Las barras en gris claro indican usuarios sin tareas asignadas.</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-medium mb-2">Lista de usuarios</h2>

          {users && users.length > 0 ? (
            <ul className="space-y-3">
              {usuariosConEstadisticas.map((u, idx) => (
                <li key={`${u.name}-${idx}`} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-gray-500">{u.role} • {u.completadas}/{u.total} completadas</div>
                  </div>
                  <div className="text-sm font-semibold">{u.porcentaje}%</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay usuarios registrados</p>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-400">Componente: Usuarios por tareas completadas — gráfico visible siempre que existan usuarios.</div>
    </div>
  );
};

export default Dashboard;
