import * as React from "react";

type User = {
  name?: string;
  role?: "admin" | "user";
};

type Task = {
  id?: string | number;
  title?: string;
  status?: "pending" | "in-progress" | "completed";
  createdAt?: string | Date;
};

type DashboardProps = {
  user?: User;
  tasks?: Task[];
  users?: User[];
};

const Dashboard: React.FC<DashboardProps> = ({ user = {}, tasks = [], users = [] }) => {
  const isAdmin = user.role === "admin";
  const pendingTasks = tasks.filter((t) => t?.status === "pending").length;
  const inProgressTasks = tasks.filter((t) => t?.status === "in-progress").length;
  const completedTasks = tasks.filter((t) => t?.status === "completed").length;
  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ... tu mismo código JSX */}
    </div>
  );
};

export default Dashboard;
