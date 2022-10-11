import React, { useEffect, useState } from 'react'
import TutorialDataService from "../services/TutorialService";

function Published() {

    const [tutorials, setTutorials] = useState(null);

    useEffect(() => {
        getAllPublishedTutorials();
    }, []);

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
            <div className="col-md-8">
                <table className="table table-striped table-inverse table-responsive">
                    <thead className="thead-inverse">
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tutorials &&
                            tutorials.map((tutorial, index) => (
                                <tr key={index}>
                                    <td>{tutorial.title}</td>
                                    <td>{tutorial.published ? 'Published' : 'Pending'}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Published