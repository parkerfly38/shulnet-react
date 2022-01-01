import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService, memberService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const [ member, setMember ] = useState([]);
    const user = accountService.userValue;

    useEffect(() =>
    {
        memberService.getById(user.member_id).then(x => setMember(x));
    }, []);

    return (
        <div>
            <h1>My Profile</h1>
            <p>
                <strong>Name: </strong> {user.title} {user.firstName} { member.middle_name } {user.lastName}<br />
                <strong>Email: </strong> {user.email}
            </p>
            <p><strong>Address:</strong><br /> { member.address_line_1 } { member.address_line_2 }<br />{ member.city }, { member.state }, { member.zip }</p>
            <p><strong>Phone:</strong><br /> { member.phone }</p>
            <p><strong>Fax:</strong><br /> { member.fax }</p>
            <p><strong>Cell:</strong><br />{ member.cell }</p>
            <p><strong>Gender:</strong><br />{ member.gender }</p>
            <p><strong>Hebrew Name:</strong><br />{ member.hebrew_name }</p>
            <p><strong>Father's Hebrew Name:</strong><br />{ member.father_hebrew_name }</p>
            <p><strong>Mother's Hebrew Name:</strong><br />{ member.mother_hebrew_name }</p>
            <p><strong>Bnai Mitzvah Portion:</strong><br />{ member.bar_bat_mitzvah_portion }</p>
            <p><strong>Receives Aliyot?</strong><br />{ member.aliyah }</p>
            <p><strong>Does D'Var Torah?</strong><br />{ member.dvar_torah }</p>
            <p><strong>Does Haftarah?</strong><br />{ member.haftarah }</p>
            <p><strong>B'nai Mitzvah Date:</strong><br />{ member.bnai_mitzvah_date }</p>
            <p><Link to={`${path}/update`}>Update Profile</Link></p>
            <p><Link to={`${path}/updatedetails/${member.id}`}>Update Member Details</Link></p>
        </div>
    );
}

export { Details };