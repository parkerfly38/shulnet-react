import { BehaviorSubject } from "rxjs";

import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/members`;

export const memberService = {
    getAll,
    getById,
    getFamilyByMemberId,
    getFamilyMemberById,
    getMemberInvoicesById,
    create,
    createFamilyMember,
    updateFamilyMember,
    update,
    delete: _delete,
    deleteFamilyMember: _deleteFamilyMember
};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function getFamilyByMemberId(id)
{
    return fetchWrapper.get(`${baseUrl}/${id}/family`);
}

function getFamilyMemberById(id)
{
    return fetchWrapper.get(`${baseUrl}/family/${id}`);
}

function getMemberInvoicesById(id)
{
    return fetchWrapper.get(`${baseUrl}/${id}/invoices`);
}

function create(params)
{
    return fetchWrapper.post(baseUrl, params);
}

function createFamilyMember(params)
{
    return fetchWrapper.post(`${baseUrl}/family`, params);
}

function updateFamilyMember(id, params)
{
    return fetchWrapper.put(`${baseUrl}/family/${id}`, params);
}

function update(id, params)
{
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

function _delete(id)
{
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}

function _deleteFamilyMember(id)
{
    return fetchWrapper.delete(`${baseUrl}/family/${id}`);
}