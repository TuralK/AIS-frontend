import React from 'react'
import SettingsForm from '../SettingsComp';
import { useOutletContext } from "react-router-dom";
import { useEffect } from 'react';

function SecretarySettings() {
  const {email, firstName } = useOutletContext();

  
  //Buradan doğru şekilde kullanıcı bilgileri aktarılıp komponentte kullanılabilir. Ek olarak onSubmit fonksiyonu aktarılabilir
  return (
    <SettingsForm initialData={ {email, firstName}}  />
  )
}

export default SecretarySettings;