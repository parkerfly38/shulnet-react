import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Tabs, Tab } from 'react-bootstrap';

import { portalService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    const initialValues = {
        institution_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        fax: '',
        webUrl: '',
        officeEmail: '',
        portal_domain: '',
        accept_terms: false,
        active: false,
        rabbis: [],
        officers: [],
        board_members: [],
        committee_chairs: [],
        portal_settings: [],
    };

    const [domainList, setDomainList] = useState(['www']);
    
    useEffect(() => {
        portalService.getAll()
            .then(data => {
                for(var i = 0; i < data.length; i++)
                {
                    setDomainList(domainList.concat(data[i].portal_domain));
                }
            });
    },[]);

    const validationSchema = Yup.object().shape({
        institution_name: Yup.string()
            .required('Institution name is required.'),
        address_line_1: Yup.string()
            .required('Address line 1 is required.'),
        city: Yup.string()
            .required('City is required.'),
        state: Yup.string()
            .required('State is required.'),
        zip: Yup.string()
            .min(5, 'Please enter a correct postal code.')
            .required('Postal code is required.'),
        country: Yup.string()
            .required('Country is required.'),
        phone: Yup.string()
            .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/u, 'Proper phone number is required.')
            .required('A phone number is required.'),
        fax: Yup.string()
            .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/u, 'Proper phone number is required.'),
        officeEmail: Yup.string()
            .email("Office email is invalid."),
        webUrl: Yup.string()
            .url('Your URL must be valid.'),
        portal_domain: Yup.string()
        .required("A domain name is required.")
        .test('Unique domain name', 'Domain name already in use.',
            function(value)
            {
                if(isAddMode)
                {
                    return new Promise((resolve, reject) => {
                        portalService.getByDomain(value)
                            .then((res) => {
                                console.log(res);
                                resolve(true);
                            })
                            .catch(error => {
                                resolve(false);
                            });
                    });
                } else {
                    return true;
                }
            })
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        console.log(fields);
        if (isAddMode) {
            createPortal(fields, setSubmitting);
        } else {
            updatePortal(id, fields, setSubmitting);
        }
    }

    function createPortal(fields, setSubmitting) {
        portalService.create(fields)
            .then(() => {
                alertService.success('Portal added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updatePortal(id, fields, setSubmitting) {
        portalService.update(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values, errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        portalService.getById(id, true).then(portal => {
                            const fields = [
                                'institution_name',
                                'address_line_1',
                                'address_line_2',
                                'city',
                                'state',
                                'zip',
                                'country',
                                'phone',
                                'fax',
                                'webUrl',
                                'officeEmail',
                                'portal_domain',
                                'accept_terms',
                                'active',
                                'rabbis',
                                'officers',
                                'board_members',
                                'committee_chairs',
                                'portal_settings'
                            ];
                            fields.forEach(field => {
                                setFieldValue(field, portal[field], false);
                            });

                        });
                    }
                },[]);
            
                return (
                    <Form>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h1>{isAddMode ? 'Add Portal' : 'Edit Portal'}</h1>
                                    <Tabs defaultActiveKey="portalDetails" id="uncontrolled-tab-example" className="mb-3">
                                        <Tab eventKey="portalDetails" title="Portal Details">
                                        <div className="form-group">
                                                <label>Synagogue or Institution Name</label>
                                                <Field name="institution_name" type="text" className={'form-control' + (errors.institution_name && touched.institution_name ? ' is-invalid' : '')}></Field>
                                                <ErrorMessage name="institution_name" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group">
                                                <label>Address Line 1</label>
                                                <Field name="address_line_1" type="text" className={'form-control' + (errors.address_line_1 && touched.address_line_1 ? ' is-invalid' : '')}></Field>
                                                <ErrorMessage name="address_line_1" component="div" className="invalid-feedback" />
                                                <label>Address Line 2</label>
                                                <Field name="address_line_2" type="text" className="form-control" />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col">
                                                    <label>City</label>
                                                    <Field name="city" type="text" className={'form-control' + (errors.city && touched.city ? ' is-invalid' : '')}></Field>
                                                    <ErrorMessage name="city" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col">
                                                    <label>State</label>
                                                    <Field name="state" as="select" className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')}>
                                                        <optgroup label="United States">
                                                            <option value="AL">Alabama</option>
                                                            <option value="AK">Alaska</option>
                                                            <option value="AZ">Arizona</option>
                                                            <option value="AR">Arkansas</option>
                                                            <option value="CA">California</option>
                                                            <option value="CO">Colorado</option>
                                                            <option value="CT">Connecticut</option>
                                                            <option value="DE">Delaware</option>
                                                            <option value="DC">District Of Columbia</option>
                                                            <option value="FL">Florida</option>
                                                            <option value="GA">Georgia</option>
                                                            <option value="HI">Hawaii</option>
                                                            <option value="ID">Idaho</option>
                                                            <option value="IL">Illinois</option>
                                                            <option value="IN">Indiana</option>
                                                            <option value="IA">Iowa</option>
                                                            <option value="KS">Kansas</option>
                                                            <option value="KY">Kentucky</option>
                                                            <option value="LA">Louisiana</option>
                                                            <option value="ME">Maine</option>
                                                            <option value="MD">Maryland</option>
                                                            <option value="MA">Massachusetts</option>
                                                            <option value="MI">Michigan</option>
                                                            <option value="MN">Minnesota</option>
                                                            <option value="MS">Mississippi</option>
                                                            <option value="MO">Missouri</option>
                                                            <option value="MT">Montana</option>
                                                            <option value="NE">Nebraska</option>
                                                            <option value="NV">Nevada</option>
                                                            <option value="NH">New Hampshire</option>
                                                            <option value="NJ">New Jersey</option>
                                                            <option value="NM">New Mexico</option>
                                                            <option value="NY">New York</option>
                                                            <option value="NC">North Carolina</option>
                                                            <option value="ND">North Dakota</option>
                                                            <option value="OH">Ohio</option>
                                                            <option value="OK">Oklahoma</option>
                                                            <option value="OR">Oregon</option>
                                                            <option value="PA">Pennsylvania</option>
                                                            <option value="RI">Rhode Island</option>
                                                            <option value="SC">South Carolina</option>
                                                            <option value="SD">South Dakota</option>
                                                            <option value="TN">Tennessee</option>
                                                            <option value="TX">Texas</option>
                                                            <option value="UT">Utah</option>
                                                            <option value="VT">Vermont</option>
                                                            <option value="VA">Virginia</option>
                                                            <option value="WA">Washington</option>
                                                            <option value="WV">West Virginia</option>
                                                            <option value="WI">Wisconsin</option>
                                                            <option value="WY">Wyoming</option>
                                                        </optgroup>
                                                        <optgroup label="United States Outlying Territories">
                                                            <option value="AS">American Samoa</option>
                                                            <option value="GU">Guam</option>
                                                            <option value="MP">Northern Mariana Islands</option>
                                                            <option value="PR">Puerto Rico</option>
                                                            <option value="UM">United States Minor Outlying Islands</option>
                                                            <option value="VI">Virgin Islands</option>
                                                        </optgroup>
                                                        <optgroup label="Canada">
                                                            <option value="AB">Alberta</option>
                                                            <option value="BC">British Columbia</option>
                                                            <option value="MB">Manitoba</option>
                                                            <option value="NB">New Brunswick</option>
                                                            <option value="NL">Newfoundland and Labrador</option>
                                                            <option value="NS">Nova Scotia</option>
                                                            <option value="ON">Ontario</option>
                                                            <option value="PE">Prince Edward Island</option>
                                                            <option value="QC">Quebec</option>
                                                            <option value="SK">Saskatchewan</option>
                                                            <option value="NT">Northwest Territories</option>
                                                            <option value="NU">Nunavut</option>
                                                        </optgroup>
                                                        <option>No State</option>
                                                    </Field>
                                                    <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col">
                                                    <label>Postal Code</label>
                                                    <Field name="zip" type="text" className={'form-control' + (errors.zip && touched.zip ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="zip" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col">
                                                    <label>Country</label>
                                                    <Field name="country" as="select" className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')}>
                                                        <option>-- select --</option>
                                                        <option>United States</option>
                                                        <option>Canada</option>
                                                    </Field>
                                                    <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col">
                                                    <label>Phone Number</label>
                                                    <Field name="phone" type="text" className={'form-control' + (errors.phone && touched.phone ? ' is-invalid' : '')} placeholder="(xxx) xxx-xxxx" />
                                                    <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col">
                                                    <label>Fax Number</label>
                                                    <Field name="fax" type="text" className={'form-control' + (errors.fax && touched.fax ? ' is-invalid' : '')} placeholder="(xxx) xxx-xxxx" />
                                                    <ErrorMessage name="fax" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col">
                                                    <label>Office Email</label>
                                                    <Field name="officeEmail" type="text" className={'form-control' + (errors.officeEmail && touched.officeEmail ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="officeEmail" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col">
                                                    <label>Institution Website</label>
                                                    <Field name="webUrl" type="text" className={'form-control' + (errors.webUrl && touched.webUrl ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="webUrl" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Domain (will be &lt;yourdomain&gt;.shulnet.com)</label>
                                                <Field name="portal_domain" type="text" disabled={isAddMode ? false : true} className={'form-control' + (errors.portal_domain && touched.portal_domain ? ' is-invalid' : '')} />
                                                <ErrorMessage name="portal_domain" component="div" className="invalid-feedback" />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="rabbis" title="Rabbis / Cantors / Educators">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Position</th>
                                                        <th>Phone</th>
                                                        <th>Email</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                    <FieldArray name="rabbis" render={arrayHelpers => (
                                                    <tbody>
                                                    {values.rabbis && values.rabbis.length > 0 && (
                                                        
                                                        values.rabbis.map((rabbi, index) => (

                                                        <tr key={index}>
                                                            <td>
                                                                <Field name={`rabbis[${index}]._id`} type="hidden" />
                                                                <Field name={`rabbis[${index}].first_name`} type="text" className={'form-control'} />
                                                            </td>
                                                            <td>
                                                                <Field name={`rabbis[${index}].last_name`} type="text" className={'form-control'} />
                                                            </td>
                                                            <td>
                                                                <Field name={`rabbis[${index}].title`} type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <Field name={`rabbis[${index}].phone`} type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <Field name={`rabbis[${index}].email`} type="email" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <button type="button" onClick={() => {
                                                                    if (confirm("Really remove this rabbi?")) 
                                                                    { arrayHelpers.remove(index) }}} className="btn btn-danger">Remove</button>
                                                            </td>
                                                        </tr>
                                                        ))

                                                    )}
                                                        <tr>
                                                            <td colSpan="6">                                                       
                                                                <button type="button" onClick={() => arrayHelpers.push('')} className="btn btn-success">
                                                                Add a Rabbi / Cantor / Other

                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                    )} />
                                            </table>
                                        </Tab>
                                        <Tab eventKey="officers" title="Officers">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Position</th>
                                                        <th>Phone</th>
                                                        <th>Email</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                    <FieldArray name="officers" render={arrayHelpers => (
                                                        <tbody>
                                                            {values.officers && values.officers.length > 0 && (
                                                                values.officers.map((officer, index) => (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            <Field name={`officers[${index}]._id`} type="hidden" />
                                                                            <Field name={`officers[${index}].first_name`} type="text" className="form-control" />
                                                                        </td>
                                                                        <td>
                                                                            <Field name={`officers[${index}].last_name`} type="text" className="form-control" />
                                                                        </td>
                                                                        <td>
                                                                            <Field name={`officers[${index}].title`} type="text" className="form-control" />
                                                                        </td>
                                                                        <td>
                                                                            <Field name={`officers[${index}].phone`} type="text" className="form-control" />
                                                                        </td>
                                                                        <td>
                                                                            <Field name={`officers[${index}].email`} type="email" className="form-control" />
                                                                        </td>
                                                                        <td>
                                                                            <button type="button" onClick={() => {
                                                                                if (confirm("Really remove this officer?"))
                                                                                { arrayHelpers.remove(index) }}} className="btn btn-danger">Remove</button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                            <tr>
                                                                <td colSpan="6">
                                                                    <button type="button" onClick={() => arrayHelpers.push('')} className="btn btn-success">Add an officer</button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    )}
                                                />
                                            </table>
                                        </Tab>
                                        <Tab eventKey="boardMembers" title="Board Members">
                                        <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Position</th>
                                                        <th>Phone</th>
                                                        <th>Email</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                    <FieldArray name="board_members" render={arrayHelpers => (
                                                    <tbody>
                                                    {values.board_members && values.board_members.length > 0 && (
                                                        
                                                        values.board_members.map((member, index) => (

                                                        <tr key={index}>
                                                            <td>
                                                                <Field name={`board_members[${index}]._id`} type="hidden" />
                                                                <Field name={`board_members[${index}].first_name`} type="text" className={'form-control'} />
                                                            </td>
                                                            <td>
                                                                <Field name={`board_members[${index}].last_name`} type="text" className={'form-control'} />
                                                            </td>
                                                            <td>
                                                                <Field name={`board_members[${index}].title`} type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <Field name={`board_members[${index}].phone`} type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <Field name={`board_members[${index}].email`} type="email" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <button type="button" onClick={() => {
                                                                    if (confirm("Really remove this board member?")) 
                                                                    { arrayHelpers.remove(index) }}} className="btn btn-danger">Remove</button>
                                                            </td>
                                                        </tr>
                                                        ))

                                                    )}
                                                        <tr>
                                                            <td colSpan="6">                                                       
                                                                <button type="button" onClick={() => arrayHelpers.push('')} className="btn btn-success">
                                                                Add a Board Member

                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                    )} />
                                            </table>
                                        </Tab>
                                        <Tab eventKey="committeeChairs" title="Committee Chairs">
                                        <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>First Name</th>
                                                        <th>Last Name</th>
                                                        <th>Position</th>
                                                        <th>Phone</th>
                                                        <th>Email</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                    <FieldArray name="committee_chairs" render={arrayHelpers => (
                                                    <tbody>
                                                    {values.committee_chairs && values.committee_chairs.length > 0 && (
                                                        
                                                        values.committee_chairs.map((chair, index) => (

                                                        <tr key={index}>
                                                            <td>
                                                                <Field name={`committee_chairs[${index}]._id`} type="hidden" />
                                                                <Field name={`committee_chairs[${index}].first_name`} type="text" className={'form-control'} />
                                                            </td>
                                                            <td>
                                                                <Field name={`committee_chairs[${index}].last_name`} type="text" className={'form-control'} />
                                                            </td>
                                                            <td>
                                                                <Field name={`committee_chairs[${index}].title`} type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <Field name={`committee_chairs[${index}].phone`} type="text" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <Field name={`committee_chairs[${index}].email`} type="email" className="form-control" />
                                                            </td>
                                                            <td>
                                                                <button type="button" onClick={() => {
                                                                    if (confirm("Really remove this committee chair?")) 
                                                                    { arrayHelpers.remove(index) }}} className="btn btn-danger">Remove</button>
                                                            </td>
                                                        </tr>
                                                        ))

                                                    )}
                                                        <tr>
                                                            <td colSpan="6">                                                       
                                                                <button type="button" onClick={() => arrayHelpers.push('')} className="btn btn-success">
                                                                Add a Committee Chair
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                    )} />
                                            </table>
                                        </Tab>
                                        <Tab eventKey="portalSettings" title="Portal Settings">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Option Name</th>
                                                        <th>Option Value</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <FieldArray name="portal_settings" render={arrayHelpers => (
                                                <tbody>
                                                    {values.portal_settings && values.portal_settings.length > 0 && (
                                                        values.portal_settings.map((setting, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <Field name={`portal_settings[${index}]._id`} type="hidden" />
                                                                    <Field name={`portal_settings[${index}].option_name`} type="text" className="form-control" />
                                                                </td>
                                                                <td>
                                                                    <Field name={`portal_settings[${index}].option_value`} type="text" className="form-control" />
                                                                </td>
                                                                <td>
                                                                    <button type="button" onClick={() => { if (confirm("Really remove this portal setting?")) { arrayHelpers.remove(index) }}} className="btn btn-danger">Remove</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                    <tr>
                                                        <td colSpan="3">
                                                            <button type="button" onClick={() => arrayHelpers.push('')} className="btn btn-success">Add Portal Setting</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                )} />
                                            </table>
                                        </Tab>
                                    </Tabs>
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                                Save
                                            </button>
                                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };