import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService, memberService } from '@/_services';
import { date } from 'yup';

function UpdateDetails({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const user = accountService.userValue;
    const member = memberService.getById(user.member_id);

    const initialValues = {
        id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        fax: '',
        dob: '',
        title: '',
        cell: '',
        email: '',
        gender: '',
        hebrew_name: '',
        father_hebrew_name: '',
        mother_hebrew_name: '',
        bar_bat_mitzvah_portion: '',
        aliyah: '',
        dvar_torah: '',
        bnai_mitzvah_date: '',
        haftarah: '',
        wedding_anniversary: '',
        quickbooks_customer_id: ''
    };

    const validationSchema = Yup.object().shape({
        first_name: Yup.string()
            .required('First name is required'),
        last_name: Yup.string()
            .required("Last name is required"),
        email: Yup.string()
            .email('Email is invalid')
            .required("Email is required"),
        dob: Yup.date()
    });

    function onSubmit(fields, {setStatus, setSubmitting })
    {
        setStatus();
        if (isAddMode)
        {
            memberService.create(fields)
                .then(() => {
                    alertService.success("Creation successful", {keepAfterRouteChange: true });
                    history.push('.');
                })
                .catch(error => {
                    setSubmitting(false);
                    alertService.error(error);
                });
        } else {
            memberService.update(user.member_id, fields)
                .then(() => {
                    alertService.success('Update successful', {keepAfterRouteChange: true });
                    history.push('..');
                })
                .catch(error => {
                    setSubmitting(false);
                    alertService.error(error);
                });
        }
    }
    
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    memberService.getById(id).then(member => {
                        const fields = ['id','first_name','last_name','middle_name','address_line_1','address_line_2','city','state','zip','country','phone','fax','dob','title','cell','email','gender','hebrew_name','father_hebrew_name','mother_hebrew_name','bar_bat_mitzvah_portion','aliyah','dvar_torah','haftarah','wedding_anniversary','quickbooks_customer_id' ];
                        fields.forEach(field => {
                            if ((field == 'dob' && member['dob'] != null) || (field == 'wedding_anniversary' && member['wedding_anniversary'] != null))
                            {
                                setFieldValue(field, new Date(member[field]).toISOString().split('T')[0], false);
                            } else {
                                setFieldValue(field, member[field], false);
                            }
                        });
                    });
                },[]);

                return (
                    <Form>
                        <Field name="id" type="hidden">
                        </Field>
                        <h1>Update Member Details</h1>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Title</label>
                                <Field name="title" as="select" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')}>
                                    <option value=""></option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Miss">Miss</option>
                                    <option value="Ms">Ms</option>
                                </Field>
                            </div>
                            <div className="form-group col-4">
                                <label>First Name</label>
                                <Field name="first_name" type="text" className={'form-control' + (errors.first_name && touched.first_name ? ' is-invalid' : '')} />
                                <ErrorMessage name="first_name" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Middle Name</label>
                                <Field name="middle_name" type="text" className="form-control"></Field>
                            </div>
                            <div className="form-group col-4">
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
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Phone</label>
                                <Field name="phone" className="form-control" />
                            </div>
                            <div className="form-group col">
                                <label>Fax</label>
                                <Field name="fax" className="form-control" />
                            </div>
                            <div className="form-group col">
                                <label>Cellular</label>
                                <Field name="cell" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <Field name="gender" className="form-control" />
                        </div>                        
                        <h2>Hebrew Names</h2>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Hebrew Name</label>
                                <Field name="hebrew_name" className="form-control" />
                            </div>
                            <div className="form-group col">
                                <label>Father's Hebrew Name</label>
                                <Field name="father_hebrew_name" className="form-control" />
                            </div>
                            <div className="form-group col">
                                <label>Mother's Hebrew Name</label>
                                <Field name="mother_hebrew_name" className="form-control" />
                            </div>
                        </div>
                        <h2>Torah Honors</h2>
                        <div className="form-row">
                            <div className="form-group col">
                                <div id="aliyah-radio-group">Aliyah</div>
                                <div role="group" aria-labelledby="aliyah-radio-group">
                                    <label>
                                    <Field type="radio" name="aliyah"  value="true" className="form-control" />
                                    Yes
                                    </label>&nbsp;
                                    <label>
                                    <Field type="radio" name="aliyah" value="false" className="form-control" />
                                    No
                                    </label>
                                </div>
                            </div>
                            <div className="form-group col">
                                <div id="dvar-radio-group">Dvar Torah</div>
                                <label>
                                <Field type="radio" name="dvar_torah"  value="true" className="form-control" />
                                Yes
                                </label>&nbsp;
                                <label>
                                <Field type="radio" name="dvar_torah" value="false" className="form-control" />
                                No
                                </label>
                            </div>
                            <div className="form-group col">
                                <div id="haftarah-radio-group">Haftarah</div>
                                <label>
                                    <Field type="radio" name="haftarah" value="true" className="form-control" />
                                    Yes
                                </label>&nbsp;
                                <label>
                                    <Field type="radio" name="haftarah" value="false" className="form-control" />
                                    No
                                </label>
                            </div>
                            <div className="form-group col">
                                <label>B'Nai Mitzvah Portion</label>
                                <Field name="bar_bat_mitzvah_portion" className="form-control" />
                            </div>
                        </div>
                        <h2>Important Dates</h2>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Birthday</label>
                                <Field name='dob' type="date" className="form-control" />
                            </div>
                            <div className="form-group col">
                                <label>Wedding Anniversary</label>
                                <Field name="wedding_anniversary" type="date" className="form-control" />
                            </div>
                            <div className="form-group col">
                                <label>Bnai Mitzah Date</label>
                                <Field name="bnai_mitzvah_date" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Update
                            </button>
                            <Link to="." className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    )
    
}

export { UpdateDetails };