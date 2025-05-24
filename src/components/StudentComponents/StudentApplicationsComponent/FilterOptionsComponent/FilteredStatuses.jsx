import React, { useState, useEffect } from 'react'
import FilteredStatusesCSS from './FilteredStatuses.module.css'
import StatusContainer from '../StatusContainerComponent/StatusContainer';
import { useTranslation } from 'react-i18next';

const FilterOptions = ({applicationsStatuses}) => {
  const { t, i18n } = useTranslation();
  const filterOptions = [
    { key: 'all', label: t('all') },
    { key: 'evaluation_phase', label: t('evaluation_phase') },
    { key: 'accepted', label: t('accepted') },
    { key: 'rejected', label: t('rejected') },
  ];
  const [filteredApplicationsStatuses, setFilteredApplicationsStatuses] = useState([]);
  const [activeOption, setActiveOption] = useState(filterOptions[0].key);
  
  useEffect(() => {
    if (!applicationsStatuses || applicationsStatuses.length === 0) {
      setFilteredApplicationsStatuses([]);
      return;
    }
    
    setFilteredApplicationsStatuses(applicationsStatuses.filter(application => 
      application.status !== 5
    ));
  }, [applicationsStatuses]);

  const handleClick = (option) => {
    setActiveOption(option);
    
    // Eğer applicationsStatuses boş ise, boş array döndür
    if (!applicationsStatuses || applicationsStatuses.length === 0) {
      setFilteredApplicationsStatuses([]);
      return;
    }
    
    switch(option) {
      case filterOptions[0].key: // all
        setFilteredApplicationsStatuses(applicationsStatuses.filter(application => 
          application.status !== 5
        ));
        break;
      case filterOptions[1].key: // evaluation_phase
        setFilteredApplicationsStatuses(applicationsStatuses.filter(application => 
          application.status === 0 || application.status === 1 || application.status === 2
        ));
        break;
      case filterOptions[3].key: // rejected
        setFilteredApplicationsStatuses(applicationsStatuses.filter(application => 
          application.status === 4
        ));
        break;
      case filterOptions[2].key: // accepted
        setFilteredApplicationsStatuses(applicationsStatuses.filter(application => 
          application.status === 3
        ));
        break;
      default:
        setFilteredApplicationsStatuses(applicationsStatuses.filter(application => 
          application.status !== 5
        ));
        break;
    }
  }

  return (
    <div>
      <div className={FilteredStatusesCSS.filterContainer}>
        {filterOptions.map((option, index) => (
          <React.Fragment key={index}>
            <div className={`${FilteredStatusesCSS.filterOptions} ${activeOption === option.key ? FilteredStatusesCSS.active : ''}`}>
              <p className={FilteredStatusesCSS.options} onClick={() => handleClick(option.key)}>{ option.label }</p>
            </div>
          </React.Fragment>
        ))}
      </div>
      <StatusContainer applicationsStatuses={filteredApplicationsStatuses}/>
    </div>
  )
}

export default FilterOptions