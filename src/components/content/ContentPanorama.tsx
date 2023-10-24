import styles from "./ContentPanorama.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { onTopImgClick, onInferenceModelChange } from '../../app/contentFileSlice';
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


const TopImage = (props) => {
  const dispatch = useDispatch();
  const imgSrc = props.src;

  const onClickHandler = () => {
    dispatch(onTopImgClick({
      src: imgSrc
    }));
  }
  return (
    <div
      className={styles.contentImg__TopImg}
      onClick={onClickHandler}
    >
      <img
        src={props.src}
        alt="photo"
      />
    </div>
  )
}

const AsideBar = () => {
  const dispatch = useDispatch();
  const itemClickHandler = (e) => {
    dispatch(onInferenceModelChange({
      model: e.target.innerText
    }))
  };

  return (
    <div>
      <TreeView
        className={styles.asidebar__treeview}
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        >
        <TreeItem nodeId="1" label="Image classification">
          <TreeItem nodeId="1_1" label="resnet">
            <TreeItem onClick={itemClickHandler} nodeId="1_1_1" label="classification_resnet18" />
            <TreeItem onClick={itemClickHandler} nodeId="1_1_2" label="classification_resnet34" />
            <TreeItem onClick={itemClickHandler} nodeId="1_1_3" label="classification_resnet50" />
          </TreeItem>
          <TreeItem nodeId="1_2" label="efficientnet">
            <TreeItem onClick={itemClickHandler} nodeId="1_2_1" label="classification_efficientnetb0" />
            <TreeItem onClick={itemClickHandler} nodeId="1_2_2" label="classification_efficientnetb1" />
            <TreeItem onClick={itemClickHandler} nodeId="1_2_3" label="classification_efficientnetb2" />
          </TreeItem>
        </TreeItem>
        <TreeItem nodeId="2" label="Object detection">
          <TreeItem nodeId="2_1" label="yolo" >
            <TreeItem onClick={itemClickHandler} nodeId="2_1_1" label="detection_yolov5" />
            <TreeItem onClick={itemClickHandler} nodeId="2_1_2" label="detection_yolov7" />
            <TreeItem onClick={itemClickHandler} nodeId="2_1_3" label="detection_yolov8" />
          </TreeItem>
        </TreeItem>
        <TreeItem nodeId="3" label="Semantic segmentation">
          <TreeItem nodeId="3_1" label="deeplab" >
            <TreeItem onClick={itemClickHandler} nodeId="3_1_1" label="semantic_deeplabv3" />
            <TreeItem onClick={itemClickHandler} nodeId="3_1_2" label="semantic_deeplabv3plus" />
          </TreeItem>
        </TreeItem>
      </TreeView>
    </div>
  )
}

function ContentImagePage() {
  const open = useSelector((state) => state.data.contentFile.isAsidebarOpen);
  const imgList = useSelector((state) => state.data.contentFile.img_srcs);
  const clickedImg = useSelector((state) => state.data.contentFile.clickedImg);
  const inferenceImg = useSelector((state) => state.data.contentFile.inferenceImg);
  const concatImg = useSelector((state) => state.data.contentFile.concatImg);

  return (
    <div className={styles.contentImg}>
      <div className={open ? styles.contentImg__Main__hide : styles.contentImg__Main__open}>
        <div className={styles.contentImg__Top}>
          {imgList.map((imgSrc) => (
            <TopImage src={imgSrc.src}/>
          ))}
        </div>
        <div className={styles.contentImg__View}>
          <div className={styles.contentImg__ViewLeft}>
            <img
              src={clickedImg}
              alt="original image"
            />
            입력 이미지
          </div>
          {/* <div className={styles.contentImg__ViewMid}>
            <img
              src={inferenceImg}
              alt="deep learning result"
            />
            출력 이미지
          </div> */}
          <div className={styles.contentImg__ViewRight}>
            <img
              src={concatImg}
              alt="concat result"
            />
            파노라마 이미지
          </div>
        </div>
      </div>
      <div className={open ? styles.asidebar__open : styles.asidebar__hide}>
        <AsideBar />
      </div>
    </div>
  )
}

export default ContentImagePage;
