import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { onAsidebarToggle } from '../../app/contentFileSlice';
import { setVideoSrc } from '../../app/contentStreamingSlice';
import { ArrowParagraph20Filled } from '@fluentui/react-icons';
import styles from './RibbonBoxStreaming.module.css';

const RibbonBoxStreaming = () => {
  const videoSrc = useSelector((state) => state.data.contentStreaming.videoSrc);
  const dispatch = useDispatch();
  
  const onOptionClickHandler = () => {
    dispatch(onAsidebarToggle())
  };
  const onVideoSrcChangeHandler = () => {
    dispatch(setVideoSrc({
      video_src: "../../public/test.mp4"
    }))
  };

  const onStreamingClickHandler = async () => {
    // await axios.get("http://127.0.0.1:8001/video_streaming_original")
    await axios.get("http://127.0.0.1:8001/video_streaming_inference")
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
              onClick={onVideoSrcChangeHandler}
            />
            비디오 경로 설정
          </div>
          <div className={styles.option__item}>
            <ArrowParagraph20Filled
              className={styles.option__itemicon}
              onClick={onStreamingClickHandler}
            />
            스트리밍
          </div> 
        </div>
        <div className={styles.ribbonbox__bottom}>
          딥러닝
        </div>
      </div>
      <div className={styles.boundary}></div>
    </div>
  )
}

export default RibbonBoxStreaming;

