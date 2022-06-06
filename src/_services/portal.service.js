import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history } from '@/_helpers';

const portalSubject = new BehaviorSubject(null)
const baseUrl = `${config.apiUrl}/portal`;

export const portalService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByDomain,
    portal: portalSubject.asObservable(),
    get portalValue () { return portalSubject.value }
};

function getAll()
{
    return fetchWrapper.get(baseUrl);
}

function getById(id)
{
    return fetchWrapper.get(`${baseUrl}/${id}`).
        then(profile => {
            portalSubject.next(profile);
            return profile;
        });
}

function getByDomain(domain)
{
    return fetchWrapper.get(`${baseUrl}/domain/${domain}`).
        then(profile => {
            portalSubject.next(profile);
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