import React, { Component } from 'react';
import Text from '../../components/Form/Text';
import Select from '../../components/Form/Select';
import Checkbox from '../../components/Form/Checkbox';
import Radio from '../../components/Form/Radio';
import Loading from '../../components/General/Loading';
import Notification from '../../components/Form/Notification';
import WP_API from '../../data/Api';

class UsersEdit extends Component {
    constructor(props) {
        super(props);
        const { singleUserData } = props;
        this.state = {
            loading: !!singleUserData,
            newUser: !singleUserData
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.loading === true) {
            const { singleUserData } = this.props;
            const obj = {};
            // Loop through props object and set as states
            const result = Object.keys(singleUserData).reduce((prev, curr) => {
                obj[curr] = singleUserData[curr];
                return obj;
            }, {});
            this.setState({ ...result, loading: false }); // eslint-disable-line
        }
    }

    updateUserData = () => {
        const { id } = this.state; // eslint-disable-line camelcase
        const { handleModalClose } = this.props;
        const data = new WP_API();
        data.set('users', id, this.state).then(result => {
            if (result.success === true) {
                handleModalClose(true);
            } else {
                this.setState({ error: result.data.error });
            }
        });
    };

    closeNotification = () => {
        this.setState(() => ({ error: false }));
    };

    inputChangeEvent = e => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target;
            this.setState(prevState => {
                let newVal = prevState[name];
                if (!Array.isArray(newVal)) {
                    newVal = [value];
                } else if (checked) {
                    newVal.push(value);
                } else {
                    const index = newVal.indexOf(value);
                    if (index > -1) {
                        newVal.splice(index, 1);
                    }
                }
                return { [name]: newVal };
            });
        } else {
            this.setState({ [name]: value });
        }
    };

    render() {
        const { handleModalClose, departments, countries, companyRoles, permissionsList, trackResources } = this.props;

        const {
            loading,
            first_name, // eslint-disable-line camelcase
            last_name, // eslint-disable-line camelcase
            email,
            department,
            country,
            company_role, // eslint-disable-line camelcase
            am2Permissions,
            track_resources, // eslint-disable-line camelcase
            hourly_rate, // eslint-disable-line camelcase
            daily_workable_hours, // eslint-disable-line camelcase,
            do_not_track_workable_hours, // eslint-disable-line camelcase
            vacationDays,
            password,
            error,
            newUser
        } = this.state;

        const fields = [
            {
                type: Text,
                name: 'first_name',
                label: 'First Name',
                required: true,
                value: first_name
            },
            {
                type: Text,
                name: 'last_name',
                label: 'Last Name',
                required: true,
                value: last_name
            },
            {
                type: Text,
                propType: 'email',
                name: 'email',
                label: 'Email',
                required: true,
                value: email
            },
            {
                type: Text,
                name: 'hourly_rate',
                label: 'Hourly Rate',
                required: true,
                value: hourly_rate
            },
            {
                type: Text,
                name: 'daily_workable_hours',
                label: 'Daily Workable Hours',
                required: true,
                value: daily_workable_hours
            },
            {
                type: Text,
                name: 'vacationDays',
                label: 'Vacation Days',
                required: true,
                value: vacationDays
            },
            {
                type: Text,
                name: 'password',
                label: 'Password',
                required: true,
                value: password
            },
            {
                type: Select,
                name: 'country',
                label: 'Country',
                required: true,
                value: country,
                list: countries
            },
            {
                type: Select,
                name: 'company_role',
                label: 'Company Role',
                required: true,
                value: company_role,
                list: companyRoles
            },
            {
                type: Radio,
                name: 'track_resources',
                label: 'Track Resources',
                required: true,
                value: track_resources,
                list: trackResources
            },
            {
                type: Radio,
                name: 'do_not_track_workable_hours',
                label: 'Do not track workable hours',
                required: true,
                value: do_not_track_workable_hours,
                list: trackResources
            },
            {
                type: Checkbox,
                name: 'department',
                label: 'Department',
                required: true,
                value: department,
                list: departments
            },
            {
                type: Checkbox,
                name: 'am2Permissions',
                label: 'Permissions',
                required: true,
                parentClass: 'column is-half permissions',
                value: am2Permissions,
                list: permissionsList
            }
        ];
        return (
            <div className="section">
                <header className="section__header">
                    <h2 className="section__title">Edit User</h2>
                </header>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="section__content">
                        {error ? <Notification text={error} type="is-danger" close={this.closeNotification} /> : ''}
                        <form className="form">
                            <div className="columns is-multiline">
                                {fields.map(field => {
                                    const { type, parentClass, name, ...rest } = field;
                                    return name === 'password' && newUser === false ? null : (
                                        <field.type
                                            key={name}
                                            name={name}
                                            parentClass={parentClass || 'column is-half'}
                                            inputChangeEvent={this.inputChangeEvent}
                                            {...rest}
                                        />
                                    );
                                })}
                            </div>
                            <div className="field">
                                <button type="button" className="button is-primary" onClick={this.updateUserData}>
                                    Submit
                                </button>
                                <button type="button" className="button is-danger right" onClick={handleModalClose}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}

export default UsersEdit;

UsersEdit.defaultProps = {
    countries: [
        { id: 'cro', title: 'Croatia' },
        { id: 'ca', title: 'Canada' },
        { id: 'ba', title: 'Bosnia' },
        { id: 'mk', title: 'Macedonia' }
    ],
    companyRoles: [
        { id: 'front_end_developer', title: 'FrontEnd Developer' },
        { id: 'back_end_developer', title: 'BackEnd Developer' },
        { id: 'designer', title: 'Designer' },
        { id: 'pm', title: 'Project Manager' },
        { id: 'qa', title: 'Quality Assurance' }
    ],
    departments: [
        { id: 'wp', title: 'WordPress' },
        { id: 'ticketzone', title: 'TicketZone' },
        { id: 'greenrush', title: 'GreenRush' },
        { id: 'enterprise', title: 'Enterprise' },
        { id: 'other', title: 'Other' }
    ],
    permissionsList: [
        { id: 'projects', title: 'Projects' },
        { id: 'companies', title: 'Companies' },
        { id: 'users', title: 'Users' },
        { id: 'user-note', title: 'User Notes' },
        { id: 'vacations', title: 'Vacations' },
        { id: 'timeline', title: 'Timeline' },
        { id: 'timeEntries', title: 'Time Entries' },
        { id: 'project-reports', title: 'Project Reports' },
        { id: 'project-earnings', title: 'Project Earnings' }
    ],
    trackResources: [{ id: 1, title: 'Yes' }, { id: 0, title: 'No' }]
};
