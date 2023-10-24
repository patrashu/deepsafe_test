import {
  UserFollowedIcon,
  ChromeMinimizeIcon,
  ChromeFullScreenIcon,
  ChromeCloseIcon,
} from '@fluentui/react-icons-mdl2';
import styles from './Titlebar.module.css';

const { ipcRenderer } = window.require('electron');
const ipc = ipcRenderer;

export default function TitleTopbar() {
  return (
    <div className={styles.titleTopbar}>
      <div className={styles.titlebar}>
        <div className={styles.titlebar__left}>
          {/* <img
            src="https://cdnimg.melon.co.kr/cm2/artistcrop/images/002/61/143/261143_20210325180240_org.jpg?61e575e8653e5920470a38d1482d7312/melon/optimize/90"
            alt="test"
          /> */}
        </div>
        {/* deepsafe */}
        <div className={styles.titlebar__right}>
          <button>
            김영일
            <UserFollowedIcon className={styles.titlebar__usericon} />
          </button>
          <ChromeMinimizeIcon
            className={styles.titlebar__windowbtn}
            // onClick={() => {
            //   ipc.sendMessage('minimize');
            // }}
          />
          <ChromeFullScreenIcon
            className={styles.titlebar__windowbtn}
            // onClick={() => {
            //   ipc.sendMessage('maximize');
            // }}
          />
          <ChromeCloseIcon
            className={styles.titlebar__windowbtn}
            // onClick={() => {
            //   ipc.sendMessage('close');
            // }}
          />
        </div>
      </div>
      <div className={styles.topbar}>
        <div className={styles.topbar__option}>
          <button>파일</button>
          <button>홈</button>
          <button>도움말</button>
        </div>
      </div>
  </div>
  );
}
