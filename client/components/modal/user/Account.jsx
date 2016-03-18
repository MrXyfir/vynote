import React from "react";

// Action creators
import { setSubscription } from "../../../actions/user/";
import { toggleShowUpgradeForm } from "../../../actions/modal/user/account";
import { error, success } from "../../../actions/notification";

// Constants
import { URL, STRIPE_KEY_PUB } from "../../../constants/config";

export default class Account extends React.Component {

	constructor(props) {
		super(props);
        
        this.onToggleShowUpgradeForm = this.onToggleShowUpgradeForm.bind(this);
        this.onPurchase = this.onPurchase.bind(this);
	}
    
    onToggleShowUpgradeForm() {
        this.props.dispatch(toggleShowUpgradeForm());
    }
    
    onPurchase() {
        const purchase = () => {
            Stripe.setPublishableKey(STRIPE_KEY_PUB);
            
            Stripe.card.createToken(this.refs.stripeForm, (s, res) => {
            if (res.error) {
                this.props.dispatch(error(res.error.message));
                return;
            }
            
            let data = {
                months: +this.refs.subscription.value,
                token: res.id
            };
            
            if (data.months == 0) {
                this.props.dispatch(error("Select a subscription length"));
                return;
            }
            
            this.props.socket.emit("purchase subscription", data, (err, res) => {
                if (err) {
                    this.props.dispatch(error(res));
                }
                else {
                    this.onToggleShowUpgradeForm();
                    this.props.dispatch(setSubscription(res));
                    this.props.dispatch(success(`${data.months} of premium subscription added to your account`));
                }
            });
        })};
        
        // Dynamically load Stripe.js
        let element = document.createElement('script');
        element.src = 'https://js.stripe.com/v2/';
        element.type = 'text/javascript';
        element.onload = purchase;
        document.body.appendChild(element);
    }
	
	render() {
		return (
			<div className="user-account">
				<div className="status">{
                    Date.now() > this.props.data.user.subscription
                    ? (
                        <span>
                            You don't have a premium account yet. Interested in what it gets you? Here's a list of
                            <a target="_blank" href={URL + "#Premium"}> features</a>
                        </span>
                    )
                    : (
                        <span>Your account will expire on {
                            (new Date(this.props.data.user.subscription)).toLocaleString()
                        }</span>
                    )
                }</div>
                
                <hr />
                
                <div className="upgrade">{
                    !this.props.data.modal.showUpgradeForm
                    ? (
                        <button className="btn-primary" onClick={this.onToggleShowUpgradeForm}>{
                            Date.now() > this.props.data.user.subscription
                            ? "Upgrade Account" : "Extend Subscription"
                        }</button>
                    )
                    : (
                        <div className="form">
                            <select ref="subscription" defaultValue="0">
                                <option value="0" disabled>Subscription Length</option>
                                <option value="1">1 Month   - $4</option>
                                <option value="2">6 Months  - $21</option>
                                <option value="3">12 Months - $36</option>
                            </select>
                        
                            <form ref="stripeForm" className="stripe-form">
                                <label>Card Number</label>
                                <input type="text" data-stripe="number"/>
                
                                <label>CVC</label>
                                <input type="number" data-stripe="cvc" />
                            
                                <label>Expiration (MM/YYYY)</label>
                                <input type="number" data-stripe="exp-month" placeholder="07"/>
                                <span> / </span>
                                <input type="number" data-stripe="exp-year" placeholder="2020" />
                            </form>
                            
                            <button onClick={this.onPurchase} className="btn-primary">Purchase</button>
                        </div>
                    )
                }</div>
			</div>
		);
	}

}