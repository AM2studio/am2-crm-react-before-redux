import React, { Component } from 'react';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Companies from './Companies';
import AM2Modal from '../../components/General/AM2Modal';
import CompaniesEdit from './CompaniesEdit';
import WP_API from '../../data/Api';

class CompaniesContainer extends Component {
    constructor() {
        super();
        this.state = {
            companies: [],
            modal: false,
            singleCompanyData: {},
            offset: 0,
            totalRecords: 0,
            loading: true
        };
    }

    componentWillMount() {
        this.getCompanies();
    }

    getCompanies() {
        const { offset } = this.state;
        const { itemsPerPage } = this.props;
        const cachedCompanies = localStorage.getItem('companies');
        if (cachedCompanies) {
            const companies = JSON.parse(cachedCompanies);
            this.setState(() => ({
                companies: companies.slice(offset, offset + itemsPerPage),
                totalRecords: companies.length,
                loading: false
            }));
        } else {
            const companies = new WP_API();
            companies.getPosts('companies', { itemsPerPage: 9999, offset }).then(result => {
                const posts = result.data.map(post => ({
                    id: post.id,
                    title: post.title,
                    city: post.city
                }));
                localStorage.setItem('companies', JSON.stringify(posts));
                this.setState({
                    companies: posts,
                    totalRecords: result.count.publish,
                    loading: false
                });
            });
        }
    }

    onPageChanged = page => {
        const { itemsPerPage } = this.props;
        const offset = (page - 1) * itemsPerPage;
        this.setState({ offset, loading: true }, () => {
            this.getCompanies();
        });
    };

    addCompany = () => {
        this.setState(() => ({
            modal: true,
            singleCompanyData: false
        }));
    };

    editCompany = (e, id) => {
        console.log(`Editing company with id: ${id}`);
        const dataToFetch = [
            'id',
            'title',
            'address',
            'city',
            'contact_email',
            'country',
            'province',
            'phone',
            'zip',
            'website'
        ];
        const data = new WP_API();
        data.get('companies', id, dataToFetch).then(result => {
            this.setState(() => ({
                modal: true,
                singleCompanyData: result
            }));
        });
    };

    handleModalClose = updated => {
        this.setState({ modal: false });
        if (updated === true) {
            localStorage.removeItem('companies');
            this.getCompanies();
        }
    };

    deleteCompany = (e, id) => {
        console.log(`Deleting company with id: ${id}`);
    };

    actionBtns = id => (
        <React.Fragment>
            <button
                type="button"
                className="button--table button--table--edit"
                onClick={e => {
                    this.editCompany(e, id);
                }}
            >
                <FaPencilAlt />
            </button>
            <button
                type="button"
                className="button--table button--table--delete"
                onClick={e => {
                    this.deleteCompany(e, id);
                }}
            >
                <FaTrashAlt />
            </button>
        </React.Fragment>
    );

    render() {
        const { companies, modal, singleCompanyData, totalRecords, loading } = this.state;
        const { itemsPerPage } = this.props;

        const newComp = companies.map(value => {
            const newValue = value;
            newValue.btn = this.actionBtns(value.id);
            return newValue;
        });
        const columns = [
            { key: 'id', title: 'ID' },
            { key: 'title', title: 'Title' },
            { key: 'city', title: 'City' },
            { key: 'btn', title: 'Action' }
        ];
        return (
            <React.Fragment>
                <Companies
                    columns={columns}
                    data={newComp}
                    addCompany={this.addCompany}
                    onPageChanged={this.onPageChanged}
                    totalRecords={totalRecords}
                    loading={loading}
                    itemsPerPage={itemsPerPage}
                />
                <AM2Modal open={modal} handleModalClose={this.handleModalClose}>
                    <CompaniesEdit
                        singleCompanyData={singleCompanyData}
                        handleModalClose={this.handleModalClose}
                        inputChangeEvent={this.inputChangeEvent}
                    />
                </AM2Modal>
            </React.Fragment>
        );
    }
}

export default CompaniesContainer;

CompaniesContainer.defaultProps = {
    itemsPerPage: 20
};
