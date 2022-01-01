import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { memberService, accountService } from '@/_services';

function ListFamilyMembers({ match }) {
    const { path } = match;
    const [ familymembers, setFamilyMembers ] = useState(null);
    const user = accountService.userValue;

    useEffect(() => {
        memberService.getFamilyByMemberId(user.member_id).then(x => setFamilyMembers(x));
    }, []);

    function deleteFamilyMember(id) {
        setFamilyMembers(familymembers.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        memberService.deleteFamilyMember(id).then(() => {
            setFamilyMembers(familymembers.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Family Members</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Family Member</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>Name</th>
                        <th style={{ width: '30%' }}>Date of Birth</th>
                        <th style={{ width: '30%' }}>Email</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {familymembers && familymembers.map(familymember =>
                        <tr key={familymember.id}>
                            <td>{familymember.first_name} {familymember.last_name}</td>
                            <td>{new Date(familymember.dob).toISOString().split('T')[0]}</td>
                            <td>{familymember.email}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${familymember.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
                                <button onClick={() => deleteFamilyMember(familymember.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={familymember.isDeleting}>
                                    {familymember.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!familymembers &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

export { ListFamilyMembers }