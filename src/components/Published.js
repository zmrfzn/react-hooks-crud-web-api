import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TutorialDataService from "../services/TutorialService";

function Published() {

    const [tutorials, setTutorials] = useState(null);

    useEffect(() => {
        getAllPublishedTutorials();
    }, []);

    const updatePublished = (tutorial,newStatus) => {
        var data = {
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description,
          published: newStatus
        };
    
        TutorialDataService.update(tutorial.id, data)
          .then(response => {
            getAllPublishedTutorials()
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      };

    const getAllPublishedTutorials = () => {
        TutorialDataService.findAllPublished()
            .then((response) => {
                setTutorials(response.data);
                console.log(`data : ${JSON.stringify(response.data)}`)
            })
            .catch((err) => {
                console.error(err);
            })
    }
    return (
        <div className="list row">
            <div className="col-md-6">
                <table className="table table-striped table-inverse table-responsive table-bordered">
                    <thead className="thead-inverse">
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutorials &&
                            tutorials.map((tutorial, index) => (
                                <tr key={index}>
                                    <td>{tutorial.title}</td>
                                    <td>{tutorial.published ? 'Published' : 'Pending'}</td>
                                    <td>
                                        <Link to={`/tutorials/${tutorial.id}`}><span className="Link">Edit</span></Link> | 
                                        <button
                                            className="badge badge-danger mr-2"
                                            onClick={() => updatePublished(tutorial, false)}
                                        >
                                            UnPublish
                                        </button>
                                    </td>
                                </tr>

                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Published