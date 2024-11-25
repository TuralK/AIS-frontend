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
  confirmLabel , 
  // cancelLabel  
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <img src= {Logo} alt="logo" />
        </AlertDialogHeader>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <AlertDialogFooter>
          {/* <AlertDialogCancel onClick={onClose}>
            {cancelLabel}
          </AlertDialogCancel> */}
          <AlertDialogAction onClick={onConfirm} className="w-1/2">
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
