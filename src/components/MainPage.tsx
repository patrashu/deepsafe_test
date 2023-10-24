import { useSelector } from 'react-redux';
import SidebarMenu from './SidebarMenu';
import ContentPage from './ContentPage';
import Footer from './Footer';
import styles from './MainPage.module.css';
import Sidebar from './sidebar/Sidebar';
import Titlebar from './Titlebar';
import RibbonBox from './RibbonBox';

export default function MainPage() {
  const isOpen = useSelector((state) => state.data.sidebar.isOpen);
  return (
    <div className={styles.container}>
      <div className={styles.titlebar}>
        <Titlebar />
      </div>
      <div className={styles.ribbonbox}>
        <RibbonBox />
      </div>
      <div className={styles.sidebarmenu}>
        <SidebarMenu />
      </div>
      <div
        className={isOpen === 'open' ? styles.sidebarOpen : styles.sidebarHide}
      >
        <Sidebar />
      </div>
      <div className={styles.mainpage}>
        <ContentPage />
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
