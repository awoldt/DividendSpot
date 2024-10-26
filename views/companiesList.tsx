import type { Company } from "../types.ts";

export default function CompaniesList(props: {
  companies: Partial<Company>[];
}) {
  return (
    <div class="container">
      <p>
        There are {props.companies.length} companies stored in our database.
      </p>
      {props.companies.map((c) => {
        return (
          <div>
            <a href={`/${c.ticker}`}>
              {c.name} ({c.ticker})
            </a>
          </div>
        );
      })}
    </div>
  );
}
