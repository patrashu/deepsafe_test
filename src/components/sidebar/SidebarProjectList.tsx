import { useDispatch, useSelector } from 'react-redux';
import styles from './SidebarProjectList.module.css';
import { onProjectClick, onProjectRemoveClick, onToggleAddPeoject } from '../../app/contentProjectSlice';

function ProjectDetail(props) {
  const dispatch = useDispatch();
  return (
    <div
      className={styles.projectDetail}
      onClick={() => {
        dispatch(onProjectClick({
          sender: 'sideItem',
          name: props.name,
        }));
        dispatch(onToggleAddPeoject(false));
      }}
    >
      <h4>
        {props.name}
      </h4>
      {props.datetime}
    </div>
  );
}

function SidebarProjectList() {
  const projects = useSelector((state) => state.data.contentProject.projectComponents);

  return (
    <div>
      <div className={styles.sidetopbar}>
        탐색기
      </div>
      <div className={styles.sidebar}>
        {projects.map((values, index) => {
          return (
            <ProjectDetail
              name={values.name}
              datetime={values.datetime}
              idx={index}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SidebarProjectList;
