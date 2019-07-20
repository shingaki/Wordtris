import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import PageOne from './components/page1';
import PageTwo from './components/page2';
import FirstPage from './components/firstpage';
import SecondPage from './components/secondpage';
import ListItem from './components/listItems';


class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [
                {
                    title: "Pizza",
                    content: "Bread, Cheese and Garlic Toppings",
                    served: "Hot"
                },
                {
                    title: "Burger",
                    content: "Oats and Milk",
                    served: "Hot"
                },
                {
                    title: "Spaghetti",
                    content: "Noodles, Sauce and Sausage",
                    served: "Hot"
                },
                {
                    title: "Ice Creams",
                    content: "Milk, Chocolate",
                    served: "Cold"
                },
                {
                    title: "Lasagne",
                    content: "Pasta, Cheese, Sauce",
                    served: "Hot"
                },
                {
                    title: "Cola Cola",
                    content: "Sugar",
                    served: "Cold"
                }
            ]
        }
    }


    render() {
        return (
            <div>
                <Router>
                    <Route exact path="/page1" component={PageOne}/>
                    <Route path="/page1/firstpage" component={FirstPage}/>
                    <Route exact path="/page2" component={PageTwo}/>
                    <Route path="/page2/secondpage" component={SecondPage}/>
                </Router>

                <div>
                    <ol>
                        {this.state.list.map(item => {
                            return <ListItem title={item.title} content={item.content} served={item.served}/>
                        })}
                    </ol>
                </div>
            </div>
        )
    }

}

export default App;
