import React from 'react'
import styles from "./ContentStreamingPage.module.css"
import { useSelector } from 'react-redux'

function ContentStreamingPage() {
  return (
    <div className={styles.streaming__main}>
        <h1>Streaming</h1>
        <div className={styles.streaming__content}>
          {/* <div className={styles.streaming__item}>
            <img 
              src="http://127.0.0.1:8001/video_streaming_original"
              alt="test1"
            />
            원본 이미지
          </div> */}
          <div className={styles.streaming__item}>
            <img 
              src="http://127.0.0.1:8001/video_streaming_inference"
              alt="test2"
            />
            추론 이미지
          </div>
        </div>
    </div>
  )
}

export default ContentStreamingPage