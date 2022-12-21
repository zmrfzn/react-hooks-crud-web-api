import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import TutorialDataService from "../services/TutorialService";
import { Chip } from 'primereact/chip';

const Tutorial = props => {
  window.newrelic.setPageViewName('Tutorial->View');

  const { id }= useParams();
  let navigate = useNavigate();

  const initialTutorialState = {
    id: null,
    title: "",
    description: "",
    published: false
  };
  const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
  const [message, setMessage] = useState("");

  const getTutorial = id => {
    TutorialDataService.get(id)
      .then(response => {
        setCurrentTutorial(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (id) {

      window.newrelic.setPageViewName('Tutorial->Edit');
      
      getTutorial(id);
    }
  }, [id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentTutorial({ ...currentTutorial, [name]: value });
  };

  const updatePublished = (tutorial,newStatus) => {
    var data = {
      id: tutorial.id,
      title: tutorial.title,
      description: tutorial.description,
      published: newStatus
    };

    TutorialDataService.update(tutorial.id, data)
      .then(response => {
        setCurrentTutorial({ ...tutorial, published: newStatus });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateTutorial = () => {
    TutorialDataService.update(currentTutorial.id, currentTutorial)
      .then(response => {
        console.log(response.data);
        setMessage("The tutorial was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteTutorial = () => {
    TutorialDataService.remove(currentTutorial.id)
      .then(response => {
        console.log(response.data);
        navigate("/tutorials");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentTutorial ? (
        <div className="edit-form">
          <h4>Tutorial</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={currentTutorial.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                value={currentTutorial.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                <strong>Status:</strong>
              </label>
              {currentTutorial.published ?
                <Chip label="Published" className="mr-2 mb-2 custom-chip published" />
                :
                <Chip label="Pending" className="mr-2 mb-2 custom-chip pending" />
                 }
            </div>
          </form>

          {currentTutorial.published ? (
            <button
              className="btn btn-primary mr-2"
              onClick={() => updatePublished(currentTutorial,false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="btn btn-primary mr-2"
              onClick={() => updatePublished(currentTutorial,true)}
            >
              Publish
            </button>
          )}

          <button className="btn btn-danger mr-2" onClick={deleteTutorial}>
            Delete
          </button>

          <button
            type="submit"
            className="btn btn-success"
            onClick={updateTutorial}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Tutorial...</p>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
