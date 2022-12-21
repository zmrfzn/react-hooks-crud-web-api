import React, { useState, useEffect } from "react";
import TutorialDataService from "../services/TutorialService";
import { Link } from "react-router-dom";
import { Paginator } from 'primereact/paginator';
import { Card } from 'primereact/card';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";  

const TutorialsList = () => {
  window.newrelic.setPageViewName('Tutorials');

  const [tutorials, setTutorials] = useState([]);
  const [pagedTutorials, setPagedTutorials] = useState([]);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  // pagination
  const [pageStart, setPageStart] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const onBasicPageChange = (event) => {
      console.log('here',new Date());
      // console.log(pagedTutorials.length)
      // console.log(tutorials.length)
      console.log('change:',`first:${event.first},rows:${event.rows}`);
      
      setPageStart(event.first);
      setPageSize(event.rows);
      console.log(pageSize)
      setPagedTutorials(tutorials.slice(event.first,event.first+event.rows))
  };

  useEffect(() => {
    retrieveTutorials();
    console.log('useEffect()');
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveTutorials = () => {
    TutorialDataService.getAll()
      .then(response => {
        setPagedTutorials(response.data.slice(pageStart,pageSize))
        setTutorials(response.data);
        console.log('lenght',tutorials.length);
      })
      .catch(e => {
        console.log(e);
      })
  };

  const refreshList = () => {
    retrieveTutorials();
    setCurrentTutorial(null);
    setCurrentIndex(-1);
  };

  const setActiveTutorial = (tutorial, index) => {
    setCurrentTutorial(tutorial);
    setCurrentIndex(index);
  };

  const removeAllTutorials = () => {
    TutorialDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        alert(`Failure:${e}`)
        console.log(e);
      });
  };

  const findByTitle = () => {
    TutorialDataService.findByTitle(searchTitle)
      .then(response => {
        setTutorials(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="mx-auto">
      <div class="row">
        <div className="col-md-5">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div className="col-md-5">
          <h4>Tutorials List</h4>
          <ul className="list-group">
            {pagedTutorials &&
              pagedTutorials.map((tutorial, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveTutorial(tutorial, index)}
                  key={index}
                >
                  {tutorial.title}
                </li>
              ))}
          </ul>
          <Paginator
            first={pageStart}
            rows={pageSize}
            totalRecords={tutorials.length}
            rowsPerPageOptions={[5, 10]}
            onPageChange={onBasicPageChange}
          ></Paginator>
          <button
            className="m-3 btn btn-sm btn-danger" title="Will fail"
            onClick={removeAllTutorials}
          >
            Remove All
          </button>
        </div>
        <Divider layout="vertical" />
        <div className="col-md-5">
          {currentTutorial ? (
            <>  <h4>Tutorial</h4>
            <Card title={currentTutorial.title}>
            <div>
              <p>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentTutorial.description}
              </p>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentTutorial.published ?
                <Chip label="Published" className="mr-2 mb-2 custom-chip published" />
                :
                <Chip label="Pending" className="mr-2 mb-2 custom-chip pending" />
                 }
              </div>
              <Link
                to={"/tutorials/" + currentTutorial.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
            </Card></>
          ) : (
            <div>
              <br />
              <p>Please click on a Tutorial...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialsList;
