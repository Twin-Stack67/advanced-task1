"use client";

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

// Defined strict interface to replace `any`
interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await fetchWithAuth('/users?page=1&limit=10');
        setEmployees(response.data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Company Employees</h1>
      <ul>
        {employees.map((emp) => (
          <li key={emp._id}>
            {emp.name} ({emp.role}) - {emp.email}
          </li>
        ))}
      </ul>
    </div>
  );
}