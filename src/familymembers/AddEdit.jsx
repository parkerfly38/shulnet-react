import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { memberService, alertService, accountService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const user = accountService.userValue;

    const initialValues = {
        first_name: '',
        last_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        email: '',
        dob: new Date(1999,1,1),
        hebrew_name: '',
        bnai_mitzvah_date: '',
        member_id: user.member_id
    };

    console.log(initialValues);

    const validationSchema = Yup.object().shape({
        first_name: Yup.string()
            .required("First name is required"),
        last_name: Yup.string()
            .required("Last name is required"),
        dob: Yup.date()
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode)
        {
            createMember(fields, setSubmitting);
        } else {
            updateMember(id, fields, setSubmitting);
        }
    }

    function createMember(fields, setSubmitting) {
        memberService.createFamilyMember(fields)
            .then(() => {
                alertService.success('Family member added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateMember(id, fields, setSubmitting)
    {
        memberService.updateFamilyMember(id, fields)
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
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        memberService.getFamilyMemberById(id).then(familymember => {
                            
                            const fields = ['member_id','first_name', 'last_name', 'address_line_1','address_line_2','city','state','zip','country','phone','email','dob','hebrew_name','bnai_mitzvah_date'];
                            fields.forEach(field => {
                                if (field == 'dob')
                                {
                                    setFieldValue(field, new Date(familymember[field]).toISOString().split('T')[0], false);
                                } else {
                                    setFieldValue(field, familymember[field], false);
                                }
                            });
                        })
                    }
                },[]);

                return (
                    <Form>
                        <Field type="hidden" name="member_id" />
                        <h1>{isAddMode ? 'Add Family Member' : 'Edit Family Member'}</h1>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>First Name</label>
                                <Field name="first_name" type="text" className={'form-control' + (errors.first_name && touched.first_name ? ' is-invalid' : '')} />
                                <ErrorMessage name="first_name" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-6">
                                <label>Last Name</label>
                                <Field name="last_name" type="text" className={'form-control' + (errors.last_name && touched.last_name ? ' is-invalid' : '')} />
                                <ErrorMessage name="last_name" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Address Line 1</label>
                            <Field name="address_line_1" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Address Line 2</label>
                            <Field name="address_line_2" type="text" className="form-control" />
                        </div>
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label>City</label>
                                <Field name="city" type="text" className="form-control" />
                            </div>
                            <div className="form-group col">
                                <label>State</label>
                                <Field name="state" type="text" className="form-control" />
                            </div>
                            <div className="form-group col-5">
                                <label>Zip</label>
                                <Field name="zip" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <Field name="phone" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <Field name="email" type="email" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Birthday</label>
                            <Field name="dob" type="date" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Bnai Mitzvah Date (Hebrew or Gregorian)</label>
                            <Field name="bnai_mitzvah_date" type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };