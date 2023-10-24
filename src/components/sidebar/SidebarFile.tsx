import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './SidebarFile.module.css';
import { onFileClick } from '../../app/contentFileSlice';

const ImageDatas1 = [
  { src: '/raw_data/sample-crack-01.jpeg' },
  // { src: '/raw_data/sample-crack-02.jpg' },
  { src: '/raw_data/sample-crack-03.JPG' },
  // { src: '/raw_data/sample-crack-04.png' },
  { src: '/raw_data/sample-crack-05.jpg' },
  { src: '/raw_data/sample-crack-06.jpg' },
  { src: '/raw_data/sample-crack-07.jpg' },
  { src: '/raw_data/sample-crack-08.jpg' },
  { src: '/raw_data/sample-crack-09.jpeg' },
  { src: '/raw_data/sample-crack-10.jpg' },
  // { src: '/raw_data/sample-crack-11.jpg' },
  // { src: '/raw_data/sample-crack-12.jpg' },
  { src: '/raw_data/sample-crack-13.jpeg' },
  { src: '/raw_data/sample-crack-14.jpg' },
  { src: '/raw_data/sample-crack-15.jpg' },
  { src: '/raw_data/sample-crack-16.jpg' },
  { src: '/raw_data/twice-01.jpg' },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230731_120511645.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230731_120511645.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230731_120511645.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230731_120511645.jpg" },
];
const ImageDatas2 = [
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
];
const ImageDatas3 = [
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093909592.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093750457.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093725173.jpg" },
  // { src: "/raw_data/KakaoTalk_20230726_093638920.jpg" },
];
const ImageDatas = {
  0: ImageDatas1,
  1: ImageDatas2,
  2: ImageDatas3,
};

const ImageFolder = (props) => {
  const dispatch = useDispatch();
  const index = props.index;
  const title = props.title;
  const path = props.path;
  const ImgSrc = props.imgsrc

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

function SidebarFile() {
  const mockDatas = [
    { title: "test1", path: "C:\\" },
    { title: "test2", path: "C:\\" },
    { title: "test3", path: "C:\\" },
  ];

  return (
    <div className={styles.sidebar__main}>
      <div className={styles.sidebar__title}>폴더 목록</div>
      <div className={styles.sidebar__item}>
        {mockDatas.map((mockData, index) => (
          <ImageFolder index={index} title={mockData.title} path={mockData.path} imgsrc={ImageDatas[index]}/>
        ))}
      </div>
    </div>
  );
}

export default SidebarFile;
