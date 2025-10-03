import { useState } from "react";
export default function useSelection() {
  const [selectedId, setSelectedId] = useState<number[]>([]);
  function toggle(id: number, isSelected: boolean) {
    setSelectedId((prev) => {
      if (isSelected) {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  }
  return { selectedId, toggle };
}
