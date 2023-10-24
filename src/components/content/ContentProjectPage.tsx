import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './ContentProjectPage.module.css';
import { onProjectClick, onProjectAdd, onTabRemoveClick, onToggleAddPeoject } from '../../app/contentProjectSlice';


function ContentProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [projectTime, setProjectTime] = useState('');

  const currentIdx = useSelector((state) => state.data.contentProject.clickedIdx);
  const tabComponents = useSelector((state) => state.data.contentProject.tabComponents);
  const addProject = useSelector((state) => state.data.contentProject.addProject);
  const dispatch = useDispatch();

  const addProjectItem = () => {
    console.log(projectName, projectTime),
    dispatch(onProjectAdd({
      name: projectName,
      datetime: projectTime,
    })),
    dispatch(onToggleAddPeoject(false));
  };

  return (
    <div className={styles.contentMain}>
      <div className={styles.contentTab}>
        <ul>
          {tabComponents.map((values, index) => {
            return (
              <li>
                <div className={styles.contentItem}>
                  <div onClick={() => {
                    dispatch(onProjectClick({
                      sender: 'tabItem',
                      name: values.name,
                    }));
                    dispatch(onToggleAddPeoject(false))
                  }}>
                  <div style={{ background: 'white' }}></div>
                  {values.name}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        dispatch(onTabRemoveClick({
                          name: values.name
                        }))
                      }
                    }>
                      X
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.content}>
        {addProject === true ? (
          <div>
            <h1>ProjectAddPage</h1>
            <div className={styles.projectAdd}>
              <input
                type="text"
                placeholder="Project Name"
                onChange={e => setProjectName(e.target.value)}
                value={projectName}
              ></input>
              <input
                type="text"
                placeholder="Make Time"
                onChange={e => setProjectTime(e.target.value)}
                value={projectTime}
              >
              </input>
              <button onClick={addProjectItem}>
                추가
              </button>
            </div>
          </div>
        ) : (
          <div style={{ color: "black" }}>
            {currentIdx !== 'None' ? (
              <h1>Current Page : {tabComponents[currentIdx].name}</h1>
            ) : (
              <h1 className=''>None</h1>
            )}
            <h2>Current Index: {currentIdx}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentProjectPage;
