var People = React.createClass({
    render: function () {
        var {people} = this.props;
        var {maPropriete} = this.props;
        var maPropriete = this.props.maPropriete;
        return (
            <li>
                <a href={people.url} target="_blank">{people.name}</a>
                <ul>
                    <li>{people.gender}</li>
                    <li>{people.mass}</li>
                </ul>
            </li>
        );
    }
});

People = Relay.createContainer(People, {
    fragments: {
        people: () => Relay.QL`
      fragment on People {
          url
          name
          gender
          mass
      }
    `
    }
});