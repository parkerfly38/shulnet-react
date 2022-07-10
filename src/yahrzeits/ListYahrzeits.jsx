import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { yahrzeitService, accountService } from '@/_services';

function ListYahrzeits({ match }) {
    const { path } = match;
    const [ yzs, setYahrzeits ] = useState(null);
    const user = accountService.userValue;

    useEffect(() => {
        yahrzeitService.getYahrzeitsByMemberId(user.member_id)
            .then(data => {
                setYahrzeits(data);
            });
    });

    function deleteYahrzeit(id) {
        setYahrzeits(yzs.map(yz => {
            if (yz.id === id) { yz.isDeleting = true; }
            return yz;
        }));
        yahrzeitService.delete(id).then(() => {
            setYahrzeits(yzs.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Yahrzeits</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Yahrzeit</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Name</th>
                        <th style={{ width: '20%' }}>Hebrew Name</th>
                        <th style={{ width: '20%' }}>Hebrew Date of Death</th>
                        <th style={{ width: '20%' }}>Observance English Date</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {yzs && yzs.map(yz =>
                        <tr key={yz.id}>
                            <td>{ yz.english_name }</td>
                            <td>{ yz.hebrew_name }</td>
                            <td>{ yz.hebrew_day_of_death } {yz.hebrew_month_of_death } { yz.hebrew_year_of_death }</td>
                            <td>
                                <button onClick={() => deleteYahrzeit(yz.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={yz.isDeleting}>
                                    {yz.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>    
                    )}
                    {!yzs &&
                        <tr>
                            <td colSpan="5" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export { ListYahrzeits };