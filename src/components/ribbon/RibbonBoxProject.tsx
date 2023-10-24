import React from 'react';
import { useDispatch } from 'react-redux';
import { AddIcon, RemoveIcon } from '@fluentui/react-icons-mdl2';
import {
  onProjectRemoveClick,
  onToggleAddPeoject,
} from '../../app/contentProjectSlice';
import styles from './RibbonBoxProject.module.css';

const RibbonBoxProject = () => {
  const dispatch = useDispatch();

  const addProjectItem = () => {
    dispatch(onToggleAddPeoject({
      flag: true,
    }));
  };

  const removeProjectItem = () => {
    dispatch(onProjectRemoveClick());
  };

  return (
    <div className={styles.ribbonbox}>
      <div className={styles.ribbonbox__item}>
        <div className={styles.ribbonbox__top}>
          <div className={styles.option__item}>
            <AddIcon
              className={styles.option__itemicon}
              onClick={addProjectItem}
            />
            생성
          </div>
          <div className={styles.option__item}>
            <RemoveIcon
              className={styles.option__itemicon}
              onClick={removeProjectItem}
            />
            삭제
          </div>
        </div>
        <div className={styles.ribbonbox__bottom}>
          CRUD
        </div>
      </div>
      <div className={styles.boundary}></div>

      <div className={styles.ribbonbox__item}>
        <div className={styles.ribbonbox__top}>
          <div className={styles.option__item}>
            <AddIcon
              className={styles.option__itemicon}
              onClick={addProjectItem}
            />
            생성
          </div>
          <div className={styles.option__item}>
            <RemoveIcon
              className={styles.option__itemicon}
              onClick={removeProjectItem}
            />
            삭제
          </div>
        </div>
        <div className={styles.ribbonbox__bottom}>
          CRUD
        </div>
      </div>
      <div className={styles.boundary}></div>
    </div>
  );
}

export default RibbonBoxProject;

