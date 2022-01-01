import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const userSubject = new BehaviorSubject(null)
const baseUrl = `${config.apiUrl}/portal`;

export const portalService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    profile: profileSubject.asObservable(),
    get profileValue () { return profileSubject.value }
};

function getAll()
{
    return fetchWrapper.get(baseUrl);
}

function getById(id)
{
    return fetchWrapper.get(`${baseUrl}/${id}`).
        then(profile => {
            profileSubject.next(profile);
            return profile;
        });
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