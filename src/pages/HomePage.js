import React, { useState } from 'react';
import AffiliateForm from '../components/AffiliateForm';
import { LandingPage } from '../App';

const HomePage = () => {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <AffiliateForm />;
  }

  return <LandingPage onStartForm={() => setShowForm(true)} />;
};

export default HomePage; 