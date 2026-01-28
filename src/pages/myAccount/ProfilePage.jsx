import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Auth from "../../auth/Auth";
import { axiosInstance } from "../../axios/axios-config";
import toast from "react-hot-toast";

function ProfilePage() {
    const { setIsContentLoading } = useOutletContext();
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const { register, handleSubmit, watch, setValue } = useForm({ mode: 'onChange' });

    // Refs
    const isMounted = useRef(true);
    const initialLoadDone = useRef(false);

    // Watch state field
    const watchedState = watch('state');

    // Profile update handler
    const profileUpdateHandler = useCallback(async (data) => {
        setIsContentLoading(true);
        try {
            const res = await axiosInstance.post('auth/profile', data);
            if (res && isMounted.current) {
                const t = Auth.token();
                const u = Auth.loggedInUser();
                toast.success('Profile updated successfully.');
                Auth.login({
                    user: { ...u, is_address: true },
                    token: t
                });
            }
        } catch (error) {
            console.error('Failed to update profile');
        } finally {
            if (isMounted.current) {
                setIsContentLoading(false);
            }
        }
    }, [setIsContentLoading]);

    // Get profile handler
    const getProfileHandler = useCallback(async (stateListData) => {
        setIsContentLoading(true);
        try {
            const response = await axiosInstance.get('auth/profile');
            if (response && isMounted.current) {
                const user = response?.data;

                // Find cities for user's state
                const stateData = stateListData.find(s => s.value === user?.state);
                if (stateData) {
                    setCityList(stateData.cities || []);
                }

                setValue('name', user?.name);
                setValue('phone_number', user?.phone_number);
                setValue('email', user?.email);
                setValue('city', user?.city?.toLowerCase());
                setValue('state', user?.state?.toLowerCase());
                setValue('pin_code', user?.pin_code);
            }
        } catch (error) {
            console.error('Failed to load profile');
        } finally {
            if (isMounted.current) {
                setIsContentLoading(false);
            }
        }
    }, [setValue, setIsContentLoading]);

    // Initial load - fetch state list and profile
    useEffect(() => {
        isMounted.current = true;
        document.title = 'My Profile | Kitaab Junction';

        if (!initialLoadDone.current) {
            initialLoadDone.current = true;

            fetch('/cityState.json', {
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            })
                .then(res => res.json())
                .then(data => {
                    if (isMounted.current) {
                        setStateList(data || []);
                        getProfileHandler(data || []);
                    }
                })
                .catch(() => { });
        }

        return () => {
            isMounted.current = false;
        };
    }, [getProfileHandler]);

    // Update city list when state changes
    useEffect(() => {
        if (watchedState && stateList.length > 0) {
            const stateData = stateList.find(s => s.value === watchedState);
            if (stateData) {
                setCityList(stateData.cities || []);
            }
        }
    }, [watchedState, stateList]);

    return (
        <Form autoComplete="off" onSubmit={handleSubmit(profileUpdateHandler)}>
            <Row>
                <Col lg={12} className="pl-5">
                    <Row className="border-bottom pb-4 mb-4">
                        <Col lg={12} className="font-weight-bolder mb-3">
                            Personal Information
                        </Col>
                        <Col lg={5}>
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                    <i className='bx bxs-user'></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    className="border-left-0"
                                    autoComplete="off"
                                    {...register('name', { required: true })}
                                    placeholder="Enter your First Name"
                                />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row className="border-bottom pb-4 mb-4">
                        <Col lg={5}>
                            <Row>
                                <Col lg={12} className="font-weight-bolder mb-3">
                                    Phone Number
                                </Col>
                                <Col lg={12}>
                                    <InputGroup>
                                        <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                            <i className='bx bx-mobile-alt'></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            autoComplete="off"
                                            disabled
                                            {...register('phone_number', { required: true })}
                                            placeholder="Enter your phone"
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={5}>
                            <Row>
                                <Col lg={12} className="font-weight-bolder mb-3">
                                    Email Address
                                </Col>
                                <Col lg={12}>
                                    <InputGroup>
                                        <InputGroup.Text id="basic-addon1" className="border-right-0 icon-input">
                                            <i className='bx bx-envelope'></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            autoComplete="off"
                                            disabled
                                            {...register('email', { required: true })}
                                            placeholder="Enter your email"
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row className="pb-4 mb-4">
                        <Col>
                            <Button type="submit">Submit</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
}

export default ProfilePage;
