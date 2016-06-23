var Page = React.createClass({
    render: function () {
        console.log(this.props);
        var people = this.props.peopleList.peopleItem.map((person, i) =>
            (<People people={person} key={'person' + i}/>)
        );
        return (
            <ul>
                {people}
            </ul>
        );
    }
});

Page = Relay.createContainer(Page, {
    fragments: {
        people: () => Relay.QL`
            fragment on peopleList {
                peopleItem {
                    ${People.getFragment('people')}
                }
            }
        `
    }
});

var pageRoute = {
    queries: {
        people: (Component) => Relay.QL`
            query PeopleQuery {
                peopleList {
                    ${Component.getFragment('people')}
                }
            }
        `
    },
    name: 'pageRoute',
    params: {}
};