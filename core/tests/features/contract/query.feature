@pact
Feature: Query API
  Scenario: POST /query - Querying for a single user by id
    And I create a pact interaction with "post" method and with "https://beta.pokeapi.co/graphql/v1beta" path and save it as "queryInteraction"
    And I have the following state for the "$queryInteraction" interaction: "There are users"
    And I add the following expectation for the "$queryInteraction" interaction response: "Receiving a single user response"
    And I add headers to "$queryInteraction" interaction request:
      | Authorization | No Auth |
    And I add GraphQL query to "$queryInteraction" interaction request:
        """
     query Pokemon_v2_pokemon {
        pokemon_v2_pokemon(limit: 10) {
          base_experience
          height
          id
          is_default
          name
          order
          pokemon_species_id
          weight
       }
     }
        """
    And I add 200 status code to "$queryInteraction" interaction response
    And I add body to "$queryInteraction" interaction response:
        """
          {
               "base_experience": 142,
                "height": 10,
                "id": 3,
                "is_default": true,
                "name": "ivysaur",
                "order": 2,
                "pokemon_species_id": 2,
                "weight": 130
           }
        """

    And I save the "$queryInteraction" interaction
    And I create "post" request to mock provider "https://beta.pokeapi.co/graphql/v1beta" endpoint and save it as "queryRequest"
    And I add headers to "$queryRequest":
      | Authorization | No Auth |

    And I add GraphQL query to "$queryRequest":
        """
      query Pokemon_v2_pokemon {
        pokemon_v2_pokemon(limit: 10) {
          base_experience
          height
          id
          is_default
          name
          order
          pokemon_species_id
          weight
        }
      }
        """

    And I send the "$queryRequest" request
    Then the "$queryRequest" response should have 200 status code
