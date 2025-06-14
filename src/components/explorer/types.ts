export interface ModalState {
  isOpen: boolean;
  type: 'file' | 'folder' | null;
  value: string;
}
