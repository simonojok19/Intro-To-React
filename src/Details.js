// replace Details.js
import React, { lazy } from "react";
import pet from "@frontendmasters/pet";
import Carousel from "./Carousel";
import ErrorBoundaries from "./ErrorBounderies";
import ThemeContext from "./ThemeContext";
import { navigate } from "@reach/router";

const Model = lazy(() => {
  import("./Model");
});

class Details extends React.Component {
  constructor() {
    super();
    this.state = { loading: true, showModel: false };
  }

  componentDidMount() {
    pet
      .animal(+this.props.id)
      .then(({ animal }) => {
        this.setState({
          url: animal.url,
          name: animal.name,
          animal: animal.type,
          location: `${animal.contact.address.city}, ${animal.contact.address.state}`,
          description: animal.description,
          media: animal.photos,
          breed: animal.breeds.primary,
          loading: false,
        });
      })
      .catch((err) => this.setState({ error: err }));
  }

  toggleModal = () => this.setState({ showModel: !this.state.showModel });
  adopt = () => navigate(this.state.url);
  render() {
    if (this.state.loading) {
      return <h1>loading … </h1>;
    }

    const { animal, breed, location, description, media, name } = this.state;

    return (
      <div className="details">
        <Carousel media={media} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} — ${breed} — ${location}`}</h2>
          <ThemeContext.Consumer>
            {(themeHook) => (
              <button
                style={{ backgroundColor: themeHook[0] }}
                onClick={this.toggleModal}
              >
                Adopt {name}
              </button>
            )}
          </ThemeContext.Consumer>

          <p>{description}</p>
          {this.state.showModel ? (
            <Model>
              <div>
                <h1>Would you like to adopt Name</h1>
                <div className="buttons">
                  <button onClick={this.adopt}>Yes</button>
                  <button onClick={this.adopt}>No, I'm monster</button>
                </div>
              </div>
            </Model>
          ) : null}
        </div>
      </div>
    );
  }
}

export default function DetailsWithErrorBoundary(props) {
  return (
    <ErrorBoundaries>
      <Details {...props} />
    </ErrorBoundaries>
  );
}
