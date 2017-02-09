import React from "react";
import {Ajax} from "./ajax";
import {Header} from "./header.jsx";
import {Footer} from "./footer.jsx";
import {TextField, RaisedButton, RefreshIndicator} from "material-ui";

export class Profile extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Header user={this.props.user} />
                <ProfileInterface />
                <Footer />
            </div>
        );
    }
}

class ProfileInterface extends React.Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            city: "",
            state: "",
            country: "",
            loading: false,
            message: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        Ajax.get("/api/profile", (err, response) => {
            if (err || response.error) {
                this.setState({ message: "Sorry, an error occurred" });
            } else {
                this.setState({
                    firstName: response.firstName || "",
                    lastName: response.lastName || "",
                    city: response.city || "",
                    state: response.state || "",
                    country: response.country || ""
                });
            }
        });
    }

    onSubmit() {
        this.setState({
            loading: true,
            message: ""
        });
        const { firstName,
                lastName,
                city,
                state,
                country } = this.state;
        
        Ajax.put(
            "/api/profile",
            { firstName, lastName, city, state, country },
            (err, response) => {
                if (err || response.error) {
                    this.setState({
                        loading: false,
                        message: "Sorry, an error occurred"
                    });
                } else {
                    this.setState({
                        loading: false,
                        message: "Successfully updated"
                    });
                }
            });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        let buttonOrSpinner;
        if (this.state.loading) {
            buttonOrSpinner = (
                <RefreshIndicator
                    status="loading"
                    left={0}
                    top={0} />
            );
        } else {
            buttonOrSpinner = (
                <RaisedButton
                    onTouchTap={this.onSubmit}
                    label="Save"
                    type="submit"
                    primary />
            );
        }
        return (
            <div className="profile-container">
                <form
                    action="javascript:void(0)"
                    onSubmit={this.onSubmit} >
                    <div className="profile-form-row">
                        <TextField
                            onChange={this.handleChange}
                            floatingLabelText="First Name"
                            id="firstname-field"
                            name="firstName"
                            value={this.state.firstName}
                            autoFocus />
                        <TextField
                            onChange={this.handleChange}
                            floatingLabelText="Last Name"
                            id="lastname-field"
                            name="lastName"
                            value={this.state.lastName} />
                    </div>
                    <div className="profile-form-row">
                        <TextField
                            onChange={this.handleChange}
                            floatingLabelText="City"
                            id="city-field"
                            name="city"
                            value={this.state.city} />
                        <TextField
                            onChange={this.handleChange}
                            floatingLabelText="State/Province"
                            id="state-field"
                            name="state"
                            value={this.state.state} />
                        <TextField
                            onChange={this.handleChange}
                            floatingLabelText="Country"
                            id="country-field"
                            name="country"
                            value={this.state.country} />
                    </div>
                    <div style={{position: "relative", height: "40px"}}>
                        {buttonOrSpinner}
                        {this.state.message}
                    </div>
                </form>
            </div>
        );
    }
}
