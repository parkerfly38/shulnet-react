import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const yahrzeitSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}/yahrzeit`;
const portalId = localStorage.getItem("portalId");

export const yahrzeitService = {
    getAll,
    getById,
    getYahrzeitsByMemberId,
    create,
    update,
    delete: _delete,
    yahrzeit: yahrzeitSubject.asObservable(),
    get yahrzeitValue() { return yahrzeitSubject.value }
};

function getAll()
{
    return fetchWrapper.get(baseUrl);
}

function getById(id)
{
    return fetchWrapper.get(`${baseURl}/${id}`);
}

function getYahrzeitsByMemberId(memberId)
{
    return fetchWrapper.get(`${config.apiUrl}/members/${memberId}/yahrzeits`);
}

function create(params)
{
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params)
{
    return fetchWrapper.put(`${baseUrl}/${id}`, params);
}

function _delete(id)
{
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}