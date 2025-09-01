import { useCallback, useState } from "react";

export function useDisclosure(defaultIsOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    setIsOpen, // exposed if you want manual control
  };
}
