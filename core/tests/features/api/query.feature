@api @current
Feature: Query API

  Scenario: POST /query - Validate response status code and response body schema
      When I create "post" request for "https://beta.pokeapi.co/graphql/v1beta" endpoint and save it as "queryRequest"
      And I add headers to "$queryRequest":
        | Content-Type  | application/json                 |

      And I add GraphQL query to "$queryRequest":
        """
        query GetPokemonDetails($id: Int!) {
        pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
          height
          id
          name
          order
          pokemon_species_id
        }
      }
        """
    And I add GraphQL query variables to "$queryRequest":
        | id | 2 |
    Then I send the "$queryRequest" request and the response body should be according to "json:core/schemas/pokemon.json" schema
      And the "$queryRequest" response should have 200 status code
