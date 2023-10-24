import React from 'react'
import { useSelector } from 'react-redux';
import styles from './RibbonBox.module.css'
import RibbonBoxProject from './ribbon/RibbonBoxProject';
import RibbonBoxImage from './ribbon/RibbonBoxImage';
import RibbonBoxStreaming from "./ribbon/RibbonBoxStreaming"
import RibbonPanorama from './ribbon/RibbonPanorama';

function RibbonBox() {
  const currentTab = useSelector((state) => state.data.sidebar.currentTab);
  const renderComponent = () => {
    switch (currentTab) {
      case 'project':
        return <RibbonBoxProject />;
      case 'image':
        return <RibbonBoxImage />;
      case 'panorama':
        return <RibbonPanorama />;
      case 'streaming':
        return <RibbonBoxStreaming />;
      // case "database": return <SidebarDatabase />;
      // case "settings": return <SidebarSetting />;
      default:
        return <div style={{ color: 'white' }}>default</div>;
    }
  };
  return (
    <div className={styles.ribbonbox}>
      <div className={styles.ribbonbox__main}>{renderComponent()}</div>
    </div>
  );
}

export default RibbonBox;
