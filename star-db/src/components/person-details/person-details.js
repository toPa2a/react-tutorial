import React, {Component} from 'react';
import Spinner from '../spinner';
import ErrorButton from '../error-button';
import SwapiService from '../../services/swapi-service';
import './person-details.css';

export default class PersonDetails extends Component {
    swapiService = new SwapiService();
    
    state = {
        person: null,
        loading: true
    };
    
    componentDidMount() {
        this.updatePerson();
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.personId !== prevProps.personId) {
            this.setState({loading: true});
            this.updatePerson();
        }
    }
    
    updatePerson() {
        const {personId} = this.props;
        
        if (!personId) {
            return;
        }
        
        this.swapiService
            .getPerson(personId)
            .then((person) => {
                this.setState({
                    person,
                    loading: false
                });
            });
    }
    
    render() {
        if (!this.state.person) {
            return <span>Select a person from a list</span>;
        }
        
        const spinner = this.state.loading ? <Spinner /> : null;
        const personContent = !this.state.loading ? <PersonView person={this.state.person} /> : null;
        
        return (
            <div className="person-details card">
                {spinner}
                {personContent}
            </div>
        );
    }
}

const PersonView = ({person}) => {
    const {id, name, gender, birthYear, eyeColor} = person;

    return (
        <React.Fragment>
            <img className="person-image" 
                    src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`}
                    alt="" />
            <div className="card-body">
                <h4>{name}</h4>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="term">Gender</span>
                        <span>{gender}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Birth Year</span>
                        <span>{birthYear}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Eye Color</span>
                        <span>{eyeColor}</span>
                    </li>
                </ul>
            </div>
            <ErrorButton />
        </React.Fragment>
    );
};