import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ColumnOptionsIcon,
  DatabaseIcon,
  VideoIcon,
  OpenFileIcon,
  ProductListIcon,
} from '@fluentui/react-icons-mdl2';
import { onMenuClick } from '../app/sidebarSlice';
import styles from './SidebarMenu.module.css';

function SidebarMenuButton(props: { name: string; icon: any }) {
  const dispatch = useDispatch();
  return (
    <div className={styles.menubtn__container}>
      {/* <Link to={props.path}> */}
      <button
        onClick={() => {
          dispatch(
            onMenuClick({
              tabName: props.name,
            })
          );
        }}
      >
        {props.icon}
      </button>
      {/* </Link> */}
    </div>
  );
}

export default function SidebarMenu() {
  return (
    <div className={styles.sidebar__container}>
      <div className={styles.sidebar__topmenu}>
        <ul>
          <li>
            <SidebarMenuButton
              name="project"
              path="/sidebar-open"
              icon={<ProductListIcon className={styles.sidebar__item} />}
            />
          </li>
          <li>
            <SidebarMenuButton
              name="image"
              path="/sidebar-file"
              icon={<OpenFileIcon className={styles.sidebar__item} />}
            />
          </li>
          <li>
            <SidebarMenuButton
              name="panorama"
              path="/panorama"
              icon={<VideoIcon className={styles.sidebar__item} />}
            />
          </li>
          <li>
            <SidebarMenuButton
              name="streaming"
              path="/sidebar-streaming"
              icon={<VideoIcon className={styles.sidebar__item} />}
            />
          </li>
          <li>
            <SidebarMenuButton
              name="database"
              icon={<DatabaseIcon className={styles.sidebar__item} />}
            />
          </li>
          <li>
            <SidebarMenuButton
              name="settings"
              icon={<ColumnOptionsIcon className={styles.sidebar__item} />}
            />
          </li>
        </ul>
      </div>
      <div className={styles.sidebarBottomMenu}>
        <SidebarMenuButton
          icon={<ColumnOptionsIcon className={styles.sidebar__item} />}
        />
      </div>
    </div>
  );
}
