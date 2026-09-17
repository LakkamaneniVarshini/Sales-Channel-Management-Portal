import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/components/shared/tables/DataTable';

const rows = [
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'Manager' },
];

describe('DataTable', () => {
  it('renders rows and supports search filtering', () => {
    render(
      <DataTable
        data={rows}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'role', header: 'Role' },
        ]}
        pagination={false}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Bob' } });
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn();

    render(
      <DataTable
        data={rows}
        columns={[{ key: 'name', header: 'Name' }]}
        onRowClick={onRowClick}
        searchable={false}
        pagination={false}
      />
    );

    fireEvent.click(screen.getByText('Alice'));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it('shows empty state when no data matches', () => {
    render(
      <DataTable
        data={[]}
        columns={[{ key: 'name', header: 'Name' }]}
        emptyMessage="No records"
        searchable={false}
        pagination={false}
      />
    );

    expect(screen.getByText('No records')).toBeInTheDocument();
  });
});
