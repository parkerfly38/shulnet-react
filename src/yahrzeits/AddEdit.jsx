import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { yahrzeitService, alertService, accountService } from '@/_services';


function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const user = accountService.userValue;
    const portalId = localStorage.getItem("portalId");

    const initialValues = {
        english_name: '',
        hebrew_name: '',
        date_of_death: '',
        hebrew_day_of_death: '',
        hebrew_month_of_death: '',
        hebrew_yeah_of_death: '',
        calculated_hebrew_date_of_death: '',
        member_id: user.member_id,
        portal_id: portalId
    };

    const validationSchema = Yup.object().shape({
        english_name: Yup.string()
            .required("English name is required."),
        date_of_death: Yup.date()
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if(isAddMode)
        {
            createYahrzeit(fields, setSubmitting);
        } else {
            updateYahrzeit(id, fields, setSubmitting);
        }
    }

    function createYahrzeit(fields, setSubmitting) {
        yahrzeitService.create(fields)
            .then(() => {
                alertService.success("Yahrzeit added successfully", {keepAfterRouteChange: true});
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateYahrzeit(id, fields, setSubmitting) {
        yahrzeitService.update(id, fields)
            .then(() => {
                alertService.success('Yahrzeit updated successfully', { keepAfterRouteChange: true });
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
                        yahrzeitService.getById(id).then(yz => {
                            const fields = ['english_name','hebrew_name','date_of_death','hebrew_day_of_death','hebrew_month_of_death','hebrew_year_of_death','caluclated_hebrew_date_of_death','member_id','portal_id'];
                            fields.forEach(field => {
                                if (field == 'date_of_death')
                                {
                                    setFieldValue(field, new Date(yz[field]).toISOString().split('T')[0], false);
                                } else {
                                    setFieldValue(field, yz[field], false);
                                }
                            });
                        });
                    }
                },[]);

                return (
                    <Form>
                        <Field type="hidden" name="member_id" />
                        <Field type="hidden" name="portal_id" />
                        <h1>{isAddMode ? 'Add Yahrzeit' : 'Edit Yahrzeit'}</h1>
                        <div className="form-row">
                            <div className="form-group col-6">
                                <label>English Name</label>
                                <Field name="english_name" type="text" className={'form-control' + (errors.english_name && touched.english_name ? ' is-invalid' : '')} />
                                <ErrorMessage name="english_name" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-6">
                                <label>Hebrew Name</label>
                                <Field name="hebrew_name" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Gregorian Date of Death</label>
                            <Field name="date_of_death" type="date" className={'form-control' + (errors.date_of_death && touched.date_of_death ? ' is-invalid' : '')} />
                            <ErrorMessage name="date_of_death" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            <h3>Hebrew Date</h3>
                            <div className="form-group col-4">
                                <label>Day</label>
                                <Field type="text" name="hebrew_day_of_death" className="form-control" />
                            </div>
                            <div className="form-group col-4">
                                <label>Month</label>
                                <Field name="hebrew_month_of_death" as="select" className="form-control">
                                    <option value="NISAN">Nisan</option>
                                    <option value="IYYAR">Iyyar</option>
                                    <option value="SIVAN">Sivan</option>
                                    <option value="TAMUZ">Tamuz</option>
                                    <option value="AV">Av</option>
                                    <option value="ELUL">Elul</option>
                                    <option value="TISHREI">Tishrei</option>
                                    <option value="CHESHVAN">Cheshvan</option>
                                    <option value="KISLEV">Kislev</option>
                                    <option value="TEVET">Tevet</option>
                                    <option value="SHVAT">Shvat</option>
                                    <option value="ADAR_I">Adar</option>
                                    <option value="ADAR_II">Adar II</option>
                                </Field>
                            </div>
                            <div className="form-group col-4">
                                <label>Year (if known)</label>
                                <Field name="hebrew_year_of_death" type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Calculated Hebrew Date of Death</label>
                            <Field name="calculated_hebrew_date_of_death" type="text" className="form-control" disabled={true} />
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
    )
};

export { AddEdit };