import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Admin sidebar will go here */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-4">
            <h2 className="font-bold text-lg">Admin Panel</h2>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}