import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { portalService } from '../../_services/portal.service';

function PortalList({ match }) {
    const { path } = match;
    const [portals, setPortals] = useState(null);

    useEffect(() => {
        portalService.getAll().then(x => {
            setPortals(x)
        });
    },[]);

    function deletePortal(id){
        setPortals(portals.map(x => {
            if(x.id === id) { x.isDeleting = true; }
            return x;
        }));
        portalService.delete(id).then(() => {
            setPortals(portals => portals.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Portals</h1>
            <p></p>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Institution Name</th>
                        <th>Url</th>
                        <th>City, State</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {portals && portals.map(portal =>
                        <tr key={portal.id}>
                            <td>{portal.institution_name}</td>
                            <td>{portal.portal_domain}.shulnet.com</td>
                            <td>{portal.city}, {portal.state}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${portal.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                            </td>
                        </tr>
                    )}
                    {!portals &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}
export { PortalList };