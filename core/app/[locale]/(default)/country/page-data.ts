const GET_COUNTRIES = `
    query CountriesQuery {
        countries {
            name
            native
            emoji
            continent {
                name
            }
            languages {
                code
                name
                native
            }
        }
    }
`;

export async function fetchCountries() {
    const response = await fetch('https://countries.trevorblades.com/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: GET_COUNTRIES }),
    });
  
    const { data } = await response.json();
    return data.countries;
}
  