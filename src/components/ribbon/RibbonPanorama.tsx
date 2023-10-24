import React from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { useSelector, useDispatch } from 'react-redux';
import {
  onAsidebarToggle,
  onInferenceImgChange,
  onConcatImgChange,
} from '../../app/contentFileSlice';
import { ArrowParagraph20Filled } from '@fluentui/react-icons';
import styles from './RibbonPanorama.module.css';

const RibbonPanorama = () => {
  const clickedImg = useSelector((state) => state.data.contentFile.clickedImg);
  const currentModel = useSelector((state) => state.data.contentFile.inferenceModel);
  const dispatch = useDispatch();

  const onOptionClickHandler = () => {
    dispatch(onAsidebarToggle())
  };

  const onInferenceClickHandler = async () => {
    const response = await axios.get(clickedImg,
      { responseType: 'arraybuffer' }
    );
    const image = Buffer.from(response.data, "base64").toString("base64");
    const data = {
      ml_model_name: 'yolov8n',
      image_file: image
    };

    const result = await axios.post(
      "http://127.0.0.1:8001/panorama",
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
      dispatch(onInferenceImgChange({
        img: `data:image/jpeg;base64,${result.data.image_file}`
      }));
      dispatch(onConcatImgChange({
        img: `data:image/jpeg;base64,${result.data.concat_file}`
      }));
  };

  return (
    <div className={styles.ribbonbox}>
      <div className={styles.ribbonbox__item}>
        <div className={styles.ribbonbox__top}>
          <div className={styles.option__item}>
            <ArrowParagraph20Filled
              className={styles.option__itemicon}
              onClick={onOptionClickHandler}
            />
            옵션
          </div>
          <div className={styles.option__item}>
            <ArrowParagraph20Filled
              className={styles.option__itemicon}
              onClick={onInferenceClickHandler}
            />
            파노라마
          </div>
        </div>
        <div className={styles.ribbonbox__bottom}>딥러닝</div>
      </div>
      <div className={styles.boundary}></div>
    </div>
  );
}

export default RibbonPanorama;
