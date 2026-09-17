import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchToolbar } from '@/components/shared/forms/SearchToolbar';

describe('SearchToolbar', () => {
  it('updates search term and triggers filter action', () => {
    const onSearchChange = vi.fn();
    const onFilterClick = vi.fn();

    render(
      <SearchToolbar
        searchTerm=""
        onSearchChange={onSearchChange}
        onFilterClick={onFilterClick}
        placeholder="Search users..."
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Search users...'), {
      target: { value: 'john' },
    });
    expect(onSearchChange).toHaveBeenCalledWith('john');

    fireEvent.click(screen.getByRole('button', { name: /Filter/i }));
    expect(onFilterClick).toHaveBeenCalled();
  });

  it('clears search term when clear button is clicked', () => {
    const onClear = vi.fn();
    const onSearchChange = vi.fn();

    render(
      <SearchToolbar
        searchTerm="john"
        onSearchChange={onSearchChange}
        onClear={onClear}
        showFilter={false}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClear).toHaveBeenCalled();
  });
});
