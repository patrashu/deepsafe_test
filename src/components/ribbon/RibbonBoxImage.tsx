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
import styles from './RibbonBoxImage.module.css';

const RibbonBoxImage = () => {
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
      "http://127.0.0.1:8001/predict",
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      })
    dispatch(onInferenceImgChange({
      img: `data:image/jpeg;base64,${result.data.image_file}`
    }));
  };

  const onInferenceClickHandler2 = async () => {
    const response = await axios.get(clickedImg,
      { responseType: 'arraybuffer' }
    );
    const image = Buffer.from(response.data, "base64").toString("base64");
    console.log(image)
    const data = {
      ml_model_name: 'segformer',
      image_file: image
    };

    const result = await axios.post(
      "http://127.0.0.1:8001/predict_segmentation",
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

  const onRemoveClickHandler = () => {
    dispatch(onInferenceImgChange({
      img: ""
    }))
    dispatch(onConcatImgChange({
      img: ""
    }))

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
            AI 추론
          </div>
          <div className={styles.option__item}>
            <ArrowParagraph20Filled
              className={styles.option__itemicon}
              onClick={onInferenceClickHandler2}
            />
            균열 추론
          </div>
          <div className={styles.option__item}>
            <ArrowParagraph20Filled
              className={styles.option__itemicon}
              onClick={onRemoveClickHandler}
            />
            제거
          </div>
        </div>
        <div className={styles.ribbonbox__bottom}>딥러닝</div>
      </div>
      <div className={styles.boundary}></div>
    </div>
  );
}

export default RibbonBoxImage;
