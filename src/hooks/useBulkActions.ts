import { useState, useCallback, useMemo } from 'react';

export interface UseBulkActionsOptions<T> {
  items: T[];
  getItemId: (item: T) => string | number;
}

export interface UseBulkActionsReturn<T> {
  selectedIds: Set<string | number>;
  selectedItems: T[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
  selectedCount: number;
  
  // Actions
  selectItem: (id: string | number) => void;
  deselectItem: (id: string | number) => void;
  toggleItem: (id: string | number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleAll: () => void;
  isSelected: (id: string | number) => boolean;
}

/**
 * Custom hook for managing bulk selection of items
 * 
 * @example
 * const { selectedIds, selectedItems, selectAll, deselectAll, toggleItem } = useBulkActions({
 *   items: users,
 *   getItemId: (user) => user.id
 * });
 */
export function useBulkActions<T>({
  items,
  getItemId,
}: UseBulkActionsOptions<T>): UseBulkActionsReturn<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // Get all item IDs
  const allIds = useMemo(() => items.map(getItemId), [items, getItemId]);

  // Check if all items are selected
  const isAllSelected = useMemo(
    () => allIds.length > 0 && allIds.every((id) => selectedIds.has(id)),
    [allIds, selectedIds]
  );

  // Check if some (but not all) items are selected
  const isSomeSelected = useMemo(
    () => selectedIds.size > 0 && !isAllSelected,
    [selectedIds.size, isAllSelected]
  );

  // Get selected items
  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.has(getItemId(item))),
    [items, selectedIds, getItemId]
  );

  // Select a single item
  const selectItem = useCallback((id: string | number) => {
    setSelectedIds((prev) => new Set(prev).add(id));
  }, []);

  // Deselect a single item
  const deselectItem = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Toggle a single item
  const toggleItem = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Select all items
  const selectAll = useCallback(() => {
    setSelectedIds(new Set(allIds));
  }, [allIds]);

  // Deselect all items
  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Toggle all items
  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [isAllSelected, selectAll, deselectAll]);

  // Check if an item is selected
  const isSelected = useCallback(
    (id: string | number) => selectedIds.has(id),
    [selectedIds]
  );

  return {
    selectedIds,
    selectedItems,
    isAllSelected,
    isSomeSelected,
    selectedCount: selectedIds.size,
    
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    toggleAll,
    isSelected,
  };
}
