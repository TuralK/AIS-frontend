import React from 'react'
import SettingsForm from '../SettingsComp';
import { useOutletContext } from "react-router-dom";
import { useEffect } from 'react';

function SecretarySettings() {
  const {email, firstName } = useOutletContext();

  return (
    <SettingsForm initialData={ {email, firstName}}  />
  )
}

export default SecretarySettings;