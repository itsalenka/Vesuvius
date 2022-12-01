import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {
    HOME_ROUTE,
    LOGIN_ROUTE, MYACCOUNT_ROTE, MYCOMPANY_ROTE, MYDRIVERS_ROUTE, MYREQUESTS_ROUTE, MYTRUCKS_ROUTE,
    REQUESTS_ROUTE
} from "../consts";
import {useNavigate} from "react-router-dom";
import 'react-languages-select/css/react-languages-select.css';
import { observer } from "mobx-react-lite"
import {useTranslation} from "react-i18next";



const NavBar = observer(() => {
    const {user} = useContext(Context)
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()

    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid className="px-xxl-5">
                <Navbar.Brand href={HOME_ROUTE}>{t('Vesuvius')}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="ml-auto">
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title={t('Language')} id="basic-nav-dropdown"  flip="true" align="end">
                                <NavDropdown.Item onClick={() => i18n.changeLanguage("en")}>{t('English')}</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => i18n.changeLanguage("ru")}>{t('Russian')}</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav className="me-auto">
                            <NavDropdown title={t('More')} id="basic-nav-dropdown" flip="true" align="end">
                                <NavDropdown.Item href={REQUESTS_ROUTE} rel="nofollow">{t('Search request')}</NavDropdown.Item>
                                    {!user.isAuth ?
                                        <NavDropdown.Item href={LOGIN_ROUTE} rel="nofollow">{t('Login')}</NavDropdown.Item>
                                            :
                                        <>
                                            <NavDropdown.Item href={MYACCOUNT_ROTE} rel="nofollow">{t('My account')}</NavDropdown.Item>
                                            <NavDropdown.Item href={MYREQUESTS_ROUTE} rel="nofollow">{t('My requests')}</NavDropdown.Item>
                                            {user.userRole != 'DRIVER' ?
                                                <NavDropdown.Item href={MYCOMPANY_ROTE} rel="nofollow">{t('My company')}</NavDropdown.Item>
                                                : <></>
                                            }
                                            {user.userRole == 'CARRIER' ?
                                                <>
                                                    <NavDropdown.Item href={MYTRUCKS_ROUTE} rel="nofollow">{t('My trucks')}</NavDropdown.Item>
                                                    <NavDropdown.Item href={MYDRIVERS_ROUTE} rel="nofollow">{t('My drivers')}</NavDropdown.Item>
                                                </>
                                                    : <></>
                                            }
                                        </>
                                    }
                                </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Nav>
            </Container>
        </Navbar>
    );
});

export default NavBar;