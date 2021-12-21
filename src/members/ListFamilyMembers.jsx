import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { memberService } from '@/_services';

function ListFamilyMembers({ match }) {
    const { path } = match;
    const { familymembers, setFamilyMembers } = userState(null);
}