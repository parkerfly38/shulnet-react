import { BehaviorSubject } from 'rxjs';
import config from 'config';
import { fetchWrapper, history } from '@/_helpers';
import { accountService } from './account.service';

const portalSubject = new BehaviorSubject(null)
const baseUrl = `${config.apiUrl}/portal`;

export const portalService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByDomain,
    portalSignup,
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
        })
        .catch(err => {
            return null;
        });
}

function portalSignup(params)
{
    const portalPayload = {
        institution_name: params.institution_name,
        address_line_1: params.address_line_1,
        address_line_2: params.address_line_2,
        city: params.city,
        state: params.state,
        zip: params.zip,
        country: params.country,
        phone: params.phone,
        fax: params.fax,
        webUrl: params.webUrl,
        officeEmail: params.officeEmail,
        portal_domain: params.portal_domain,
        accept_terms: params.acceptTerms
    };
    fetchWrapper.post(baseUrl, portalPayload)
        .then(data => {
            const newPortalId = data._id;
            const newAccountPayload = {
                title: params.title,
                firstName: params.firstName,
                lastName: params.lastName,
                password: params.password,
                role: 'admin',
                email: params.email,
                acceptTerms: params.acceptTerms,
                portalId: newPortalId
            };
            return accountService.create(newAccountPayload);
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