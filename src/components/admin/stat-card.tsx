import { ElementType } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  color: "blue" | "green" | "orange" | "purple"; // Pilihan warna tema
  trend?: string; // Opsional: misal "+5% bulan ini"
}

export default function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  // Mapping warna agar dinamis
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-300",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300",
  };

  return (
    <div className="bg-white dark:bg-[#1a202c] p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
      </div>
    </div>
  );
}