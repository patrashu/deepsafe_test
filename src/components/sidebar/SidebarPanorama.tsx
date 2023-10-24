import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './SidebarFile.module.css';
import { onFileClick } from '../../app/contentFileSlice';

const panorama1 = [
  { src: '/raw_data/h01.jpg' },
  { src: '/raw_data/h02.jpg' },
  { src: '/raw_data/h03.jpg' },
];
const panorama2 = [
  { src: '/raw_data/v01.jpg' },
  { src: '/raw_data/v02.jpg' },
  { src: '/raw_data/v03.jpg' },
];

const panoramaSamples = {
  0: panorama1,
  1: panorama2,
};

const ImageFolder = (props) => {
  const dispatch = useDispatch();
  const index = props.index;
  const title = props.title;
  const path = props.path;
  const ImgSrc = props.imgsrc;

  const onClickHandler = () => {
    dispatch(onFileClick({
      index: index,
      title: title,
      path: path,
      imgPaths: ImgSrc
    }))
  }

  return (
    <div
      className={styles.imageFolder}
      onClick={onClickHandler}
    >
      <div> {props.title} </div>
      <div> {props.path} </div>
    </div>
  );
}

function SidebarPanorama() {
  const mockDatas = [
    { title: 'test1', path: 'C:\\' },
    { title: 'test2', path: 'C:\\' },
  ];

  return (
    <div className={styles.sidebar__main}>
      <div className={styles.sidebar__title}>폴더 목록</div>
      <div className={styles.sidebar__item}>
        {mockDatas.map((mockData, index) => (
          <ImageFolder index={index} title={mockData.title} path={mockData.path} imgsrc={panoramaSamples[index]}/>
        ))}
      </div>
    </div>
  );
}

export default SidebarPanorama;
