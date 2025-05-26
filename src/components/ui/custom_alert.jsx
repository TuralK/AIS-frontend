import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert_dialog";
import Logo from '../../assets/iyte_logo_eng.png';

const CustomAlertDialog = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmLabel,
  cancelLabel,
  showCancel = false,   // yeni prop: default olarak false
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex items-center justify-between">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <img src={Logo} alt="logo" className="h-8 w-auto" />
        </AlertDialogHeader>
        <AlertDialogDescription className="mt-2">
          {description}
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-4 flex justify-end space-x-2">
          {showCancel && (
            <AlertDialogCancel onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
              {cancelLabel}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={onConfirm} className="px-4 py-2 bg-red-800 text-white rounded">
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;