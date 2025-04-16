import { fetchCountries } from './page-data';

export default async function CountriesPage() {
  const countries = await fetchCountries();

  return (
    <div>
      <h1>Countries List</h1>
      <ul>
        {countries.map((country: any) => (
          <li key={country.name}>
            {country.emoji} {country.name} ({country.native}) - {country.continent.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
