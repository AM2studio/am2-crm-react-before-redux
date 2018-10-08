import React, { Component } from 'react';
import Vacations from './Vacations';
import WP_API from '../../data/Api';

class VacationsContainer extends Component {
    constructor() {
        super();
        this.state = {
            vacations: [],
            offset: 0,
            totalRecords: 0,
            loading: true
        };
    }

    componentWillMount() {
        this.getVacations();
    }

    getVacations = () => {
        const { offset } = this.state;
        const { itemsPerPage } = this.props;
        const api = new WP_API();
        api.getPosts('vacations', { itemsPerPage, offset }).then(result => {
            this.setState({
                vacations: result.data,
                totalRecords: result.count.publish,
                loading: false
            });
        });
    };

    onPageChanged = page => {
        const { itemsPerPage } = this.props;
        const offset = (page - 1) * itemsPerPage;
        this.setState({ offset, loading: true }, () => {
            this.getVacations();
        });
    };

    approve = () => {
        console.log('radi');
    };

    status = status => {
        switch (status) {
            case 'approved':
                return <span className="note-type-positive">Approved</span>;
            case 'declined' || 'rejected':
                return <span className="note-type-negative">Rejected</span>;
            case 'pending':
                return (
                    <div>
                        <span className="note-type-neutral">Pending</span>
                        <button type="button" onClick={this.approve}>
                            ✓
                        </button>
                    </div>
                );
            default:
                return <span className="note-type-neutral">Pending</span>;
        }
    };

    render() {
        const { vacations, totalRecords, loading } = this.state;
        const { itemsPerPage } = this.props;
        const filteredData = vacations.map(user => {
            const filteredUser = user;
            filteredUser.status = this.status(user.status);
            return filteredUser;
        });
        const columns = [
            { key: 'author', title: 'Requested by' },
            { key: 'days', title: 'Days' },
            { key: 'start_date', title: 'Start Date' },
            { key: 'end_date', title: 'End Date' },
            { key: 'note', title: 'Note' },
            { key: 'status', title: 'Status' }
        ];
        return (
            <Vacations
                columns={columns}
                data={filteredData}
                addUser={this.addUser}
                onPageChanged={this.onPageChanged}
                totalRecords={totalRecords}
                loading={loading}
                itemsPerPage={itemsPerPage}
            />
        );
    }
}

export default VacationsContainer;

VacationsContainer.defaultProps = {
    itemsPerPage: 20
};
