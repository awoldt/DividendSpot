import type { Company } from "../types.ts";

export default function CompaniesList(props: {
  companies: Partial<Company>[];
}) {
  return (
    <div class="container pt-5">
      <p class="lead">
        There are <b>{props.companies.length}</b> companies stored in our
        database. Dividends are constantly changing, be sure to check back to see the latest dividend information!
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
