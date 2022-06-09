import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { portalService, alertService, accountService } from '@/_services';
import '../account/styles.module.less';

function PortalSignup({ history, match }) {
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
        webUrl: 'https://',
        officeEmail: '',
        portal_domain: '',
        acceptTerms: false,
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''       
    };
    const [domainList, setDomainList] = useState(['www']);
    const { path } = match;


    useEffect(() => {
        portalService.getAll()
            .then(data => {
                for(var i = 0; i < data.length; i++)
                {
                    setDomainList(domainList.concat(data[i].portal_domain));
                }
            });
        const arrBodyBg = ['bodybg1','bodybg2'];
        const arrPhotoCredit = [
            'Photo of <a href="https://www.cbisrael.org">Congregation Beth Israel in Bangor, Maine</a> by Brian Kresge',
            'Photo by <a href="https://unsplash.com/@bokcily?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Boris Ivanović</a> on <a href="https://unsplash.com/s/photos/synagogue?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
        ];
        const imgIndex = (Math.floor(Math.random() * (arrBodyBg.length - 1 + 1) + 1))-1;
        const bodybg = arrBodyBg[imgIndex];
        document.body.classList.add(bodybg);
        document.getElementById('photoCredit').innerHTML = arrPhotoCredit[imgIndex];
        //setPortal(portalService.getByDomain(window.location.hostname));
        //console.log(portal);
        // redirect to home if already logged in
        if (accountService.userValue) {
            history.push('/');
        }
        return () => {
            document.body.classList.remove("bodybg1");
            document.body.classList.remove("bodybg2");
        }
    }, []);    

    const validationSchema = Yup.object().shape({
        institution_name: Yup.string()
            .required('Name of your synagogue/institution is required.'),
        address_line_1: Yup.string()
            .required('A street address or PO Box is required.'),
        city: Yup.string()
            .required('City is required.'),
        state: Yup.string()
            .required('State is required.'),
        zip: Yup.string()
            .required('Postal code is required.'),
        country: Yup.string()
            .required('Country is required.'),
        phone: Yup.string()
            .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/u, 'Proper phone number is required.')
            .required('A phone number is required.'),
        fax: Yup.string()
            .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/u, 'A proper fax number is required, or leave blank.'),
        officeEmail: Yup.string()
            .email("Office email is invalid."),
        webUrl: Yup.string()
            .url('Your URL must be valid.'),
        portal_domain: Yup.string()
            .required("A domain name is required.")
            .notOneOf(domainList, 'Domain is already in use.'),    
        title: Yup.string()
            .required('Title is required.'),
        firstName: Yup.string()
            .required('First Name is required.'),
        lastName: Yup.string()
            .required('Last Name is required.'),
        email: Yup.string()
            .email('Email is invalid.')
            .required('Email is required.')
            .test('Unique Email', 'Email already in use.',
                function(value)
                {
                    return new Promise((resolve, reject) => {
                        accountService.checkEmail(value)
                            .then((res) => {
                                resolve(true)
                            })
                            .catch(error => {
                                resolve(false);
                            })
                    })
                }),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters.')
            .required('Password is required.'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match.')
            .required('Confirm Password is required.'),
        acceptTerms: Yup.bool()
            .oneOf([true], 'Accept Terms & Conditions is required')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        portalService.portalSignup(fields)
            .then(() => {
                alertService.success('Portal signup successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                history.push('login');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 offset-sm-2 mt-5">
                    <div className="card m-3">
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <h3 className="card-header">Portal Signup</h3>
                                <div className="card-body">
                                    <h3>Synagogue/Institution Details</h3>
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
                                        <Field name="portal_domain" type="text" className={'form-control' + (errors.portal_domain && touched.portal_domain ? ' is-invalid' : '')} />
                                        <ErrorMessage name="portal_domain" component="div" className="invalid-feedback" />
                                    </div>
                                    <h3>Create an Admin User</h3>
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
                                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group col-5">
                                            <label>First Name</label>
                                            <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                            <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group col-5">
                                            <label>Last Name</label>
                                            <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                            <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col">
                                            <label>Password</label>
                                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group col">
                                            <label>Confirm Password</label>
                                            <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                            <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                    <div className="form-group form-check">
                                        <Field type="checkbox" name="acceptTerms" id="acceptTerms" className={'form-check-input ' + (errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : '')} />
                                        <label htmlFor="acceptTerms" className="form-check-label">Accept Terms & Conditions</label>
                                        <ErrorMessage name="acceptTerms" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                            Create Account
                                        </button>
                                        <Link to="login" className="btn btn-link">Cancel</Link>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    </div>
                </div>
            </div>
            <div id="photoCredit" className="bottomrightbox">
                    
            </div>
        </div>
    );
}

export { PortalSignup };