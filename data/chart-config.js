const CHART_CONFIG = {
  economy: {
    label: "Economy & Productivity",
    desc: "Output, sectoral composition, productivity relative to peers, and trade exposure.",
    charts: [
      { key: "living_standards", type: "line", relatedCharts: ["productivity_g7", "capital_allocation", "gdp_by_sector"],
        explain: "This chart asks the most basic question about an economy: is each person actually getting better off? Total GDP almost always rises because the population grows. The real test is GDP per capita — total output divided by the number of people. When these two lines diverge — GDP rising while GDP per capita flattens or falls — it means growth is coming from adding more people, not from each person becoming more productive or prosperous. Since around 2021, per-capita GDP has been falling while total GDP keeps climbing.",
        verdict: "BAD — GDP per person is falling while total GDP keeps rising. Growth is coming from adding more people, not from each Canadian becoming more prosperous. The average Canadian is getting poorer in real terms.",
        legendExplain: {
          "Real GDP (Index, 1961=100)": "Total economic output for the whole country, adjusted for inflation. Set to 100 in 1961 as a starting point. This almost always goes up.",
          "Real GDP Per Capita (Index, 1961=100)": "Economic output divided by the number of Canadians. This is the real measure of whether the average person is getting richer. When this falls while Total GDP rises, growth is population-driven — not prosperity-driven."
        }
      },
      { key: "gdp_by_sector", type: "line", relatedCharts: ["capital_allocation", "sector_snapshot", "productivity_g7"],
        explain: "This chart tracks which industries make up Canada's economy and how those shares have shifted since 1997. Real Estate has grown from 10% to nearly 14% of GDP — now the largest sector in the country by this measure — while Manufacturing has fallen from 16% to under 10%.",
        verdict: "CONTEXT — Real Estate is now Canada's largest industry sector by GDP share, overtaking Manufacturing, which has declined for over 25 years.",
        legendExplain: {
          "Real Estate & Leasing (%)": "Buying, selling, renting, and managing property. Now Canada's single largest industry sector.",
          "Manufacturing (%)": "Making physical goods — cars, machinery, food products, chemicals. Has been declining for 25+ years.",
          "Mining & Oil/Gas (%)": "Extracting oil, natural gas, and metals. Volatile — rises and falls with global commodity prices.",
          "Health Care (%)": "Hospitals, clinics, long-term care, and health services.",
          "Construction (%)": "Building homes, offices, and infrastructure. Grew alongside the housing boom.",
          "Public Admin (%)": "Running federal, provincial, and local governments.",
          "Wholesale Trade (%)": "Distributing goods between businesses before they reach consumers.",
          "Retail Trade (%)": "Stores and online sellers dealing directly with consumers.",
          "Finance & Insurance (%)": "Banks, insurance companies, and investment firms.",
          "Prof & Tech Services (%)": "Lawyers, accountants, engineers, software developers, and consultants."
        }
      },
      { key: "capital_allocation", type: "line", relatedCharts: ["productivity_g7", "corporate_concentration", "sector_snapshot"],
        explain: "Focused on the five sectors that best show where investment money has moved over 30 years. Real Estate surpassed Manufacturing as a share of GDP around 2012.",
        verdict: "CONTEXT — Real Estate's GDP share has overtaken Manufacturing since 2012, a structural shift in where Canadian economic activity is concentrated.",
        legendExplain: {
          "Real Estate, Rental & Leasing (%)": "Property buying, selling, and renting as a share of GDP. Rising every decade.",
          "Manufacturing (%)": "Physical goods production as a share of GDP. Falling every decade.",
          "Mining, Quarrying & Oil/Gas (%)": "Resource extraction. Volatile but significant.",
          "Construction (%)": "Building activity. Grew alongside the real estate boom.",
          "Finance & Insurance (%)": "Financial services. Relatively stable share."
        }
      },
      { key: "sector_snapshot", type: "horizontalBar", relatedCharts: ["gdp_by_sector", "capital_allocation"],
        explain: "A single-year snapshot of every major industry in Canada ranked by their share of GDP. Real Estate at 13.5% is larger than Manufacturing (9.8%) and Technology combined.",
        verdict: "CONTEXT — Real Estate is Canada's largest single sector by GDP share, ahead of Manufacturing.",
        legendExplain: {
          "Share of Total GDP (%)": "How much of Canada's total economic output that industry accounts for in 2026."
        }
      },
      { key: "productivity_g7", type: "line", relatedCharts: ["capital_allocation", "corporate_concentration", "living_standards"],
        explain: "How efficiently each G7 country turns labour hours into economic output, indexed to 2000 = 100. Canada ranks last in the G7 for productivity growth over this entire period. The widening gap between the Canadian and US lines is closely tied to stagnant real wages: if workers produce less per hour, there is less wealth to distribute.",
        verdict: "BAD — Canada ranks dead last among G7 nations in productivity growth. When workers produce less per hour, there is less wealth to distribute as wages — a major driver of stagnant living standards.",
        legendExplain: {
          "Canada": "Canada's GDP per hour worked, indexed to 2000 = 100. Last in the G7.",
          "USA": "US GDP per hour worked. The widening gap between the US and Canada lines is the productivity crisis.",
          "Germany": "Germany's GDP per hour worked. Germany retained manufacturing and leads European productivity.",
          "UK": "UK GDP per hour worked.",
          "France": "France's GDP per hour worked.",
          "Japan": "Japan's GDP per hour worked.",
          "Italy": "Italy's GDP per hour worked."
        }
      },
      { key: "trade", id: "trade", type: "line", relatedCharts: ["energy", "productivity_g7", "trade-fx"],
        seriesSubset: ["Exports (% of GDP)", "Imports (% of GDP)", "US Share of Exports (%)"],
        title: "Trade as % of GDP & US Export Concentration (2000–2026) | %",
        subtitle: "Exports, imports, and the share of exports going to the US — all percentages. ~75% of goods exports go to one country.",
        explain: "Canada sends roughly 75–85% of its goods exports to one country: the United States. This chart makes that dependency visible. The 'US Share of Exports' line shows how concentrated Canada's trade really is. When the US imposes tariffs, enters a recession, or changes trade policy, Canada has no short-term alternative at scale. This is not trade diversification — it is economic co-dependence.",
        verdict: "BAD — Sending 75–85% of exports to one country is not diversification; it is economic dependency. US tariffs or a recession immediately threatens Canada's entire export economy with no short-term alternative.",
        legendExplain: {
          "Exports (% of GDP)": "The value of everything Canada sells abroad, as a percentage of the total economy.",
          "Imports (% of GDP)": "The value of everything Canada buys from abroad, as a percentage of the total economy.",
          "US Share of Exports (%)": "What percentage of Canada's total exports go specifically to the United States. The higher this number, the more Canada's export economy depends on a single foreign buyer."
        }
      },
      { key: "trade", id: "trade-balance", type: "line", relatedCharts: ["trade", "energy", "trade-fx"],
        seriesSubset: ["Current Account Balance ($B)", "Current Account Balance — Real (2024 CAD $B)"],
        title: "Current Account Balance, Nominal vs. Real (2000–2026) | $B",
        subtitle: "Nominal balance (as reported) vs. inflation-adjusted 2024 dollars. Persistent deficit means Canada finances current consumption by borrowing from or selling assets to foreigners.",
        explain: "A current account deficit means a country spends more than it earns internationally — and finances the gap by borrowing from foreigners or selling off domestic assets. Canada has run a persistent deficit for most of this period, in both nominal and inflation-adjusted terms. This is not automatically catastrophic, but it means part of Canada's consumption is funded by foreign capital, not its own production.",
        verdict: "BAD — A persistent current account deficit means Canada spends more than it earns internationally, financing the gap through foreign borrowing or selling domestic assets.",
        citedThreshold: "IMF external sustainability guidance generally flags current account deficits sustained above roughly 4–5% of GDP as a vulnerability requiring adjustment. This chart shows the balance in dollar terms rather than as a percentage of GDP; as context, Canada's GDP is roughly $2.5–3 trillion, so recent deficits in the $14–18B range are in the range of 0.5–0.7% of GDP — below the IMF's flagged threshold, though the deficit has been persistent rather than occasional.",
        legendExplain: {
          "Current Account Balance ($B)": "The difference between what Canada earns from abroad and what it pays abroad, in the dollars of each year (nominal). Negative means Canada is spending more than it earns internationally.",
          "Current Account Balance — Real (2024 CAD $B)": "The same balance restated in constant 2024 dollars, removing the effect of inflation."
        }
      },
      { key: "trade", id: "trade-fx", type: "line", relatedCharts: ["trade", "trade-balance", "energy-wti"],
        seriesSubset: ["CAD/USD Exchange Rate"],
        title: "CAD/USD Exchange Rate (2000–2026)",
        subtitle: "Canadian dollar value relative to the US dollar.",
        explain: "The Canadian dollar's value against the US dollar. A weaker Canadian dollar makes Canadian exports cheaper for American buyers (good for exporters) but makes imports more expensive for Canadians — which matters because most of Canada's imported goods and equipment are priced in US dollars.",
        verdict: "MIXED — A weaker loonie helps exporters by making Canadian goods cheaper abroad, but hurts consumers by making imports more expensive. Canada has traded below par for most of this period.",
        legendExplain: {
          "CAD/USD Exchange Rate": "How many US dollars one Canadian dollar buys. Above 1.00 = the loonie is worth more than the US dollar. Below 1.00 = it takes more than one Canadian dollar to buy one US dollar. Canada has traded below par (under 1.00) for most of this period."
        }
      }
    ]
  },

  debt_fiscal: {
    label: "Debt & Fiscal",
    desc: "Household and sovereign debt, housing costs, monetary policy, federal spending, and government spending efficiency.",
    charts: [
      { key: "budget_balance_history", id: "budget_balance_history", type: "line", relatedCharts: ["fed_debt_deficit", "household_debt", "govt_efficiency"],
        sectionHeader: "Federal & Provincial Budget History",
        sectionSubhead: "Budget balance as % of GDP — Federal, Ontario, Quebec, Alberta. 1983-84 to 2024-25.",
        explain: "Budgetary balance — the gap between what a government takes in and what it spends — expressed as a percentage of the size of its economy (GDP). This normalizes for inflation and economic growth over four decades, making 1985 and 2025 directly comparable. Positive values are surpluses; negative values are deficits. Shown for the federal government plus the three largest provincial economies: Ontario, Quebec, and Alberta.",
        verdict: "MIXED — The federal government has run a deficit in 29 of the last 42 fiscal years, with the 2020-21 COVID shock (-14.8% of GDP) the largest on record. Provincial patterns diverge sharply: Alberta swings between large resource-driven surpluses and deficits; Ontario and Quebec have run more persistent, smaller deficits.",
        citedThreshold: "The Maastricht Treaty convergence criteria set 3% of GDP as the reference ceiling for annual government deficits — a political threshold for EU monetary union eligibility, not an economically derived limit, but the most widely cited international deficit benchmark. Canada's federal deficit has exceeded 3% of GDP in 16 of the last 42 fiscal years, most recently in 2020-21 (-14.8%).",
        legendExplain: {
          "Federal (% of GDP)": "The federal government's annual budgetary surplus or deficit, as a percentage of national GDP.",
          "Ontario (% of GDP)": "Ontario's annual budgetary surplus or deficit, as a percentage of Ontario's GDP. Not directly comparable to other provinces due to accounting differences.",
          "Quebec (% of GDP)": "Quebec's annual budgetary surplus or deficit, as a percentage of Quebec's GDP. Not directly comparable to other provinces due to accounting differences.",
          "Alberta (% of GDP)": "Alberta's annual budgetary surplus or deficit, as a percentage of Alberta's GDP. Heavily influenced by resource royalty revenue, which swings with commodity prices."
        }
      },
      { key: "household_debt", type: "line", relatedCharts: ["fed_debt_deficit", "housing-ratio", "inflation_boc"],
        explain: "This measures how much debt Canadian households carry relative to their annual income. A ratio of 100% means households owe exactly one full year's income. Canada's ratio reached 179.6% — nearly two full years of income owed, before a single bill is paid. This is one of the highest ratios in the developed world and leaves households extremely vulnerable to interest rate increases or job loss.",
        verdict: "BAD — At 179.6%, Canadians carry one of the heaviest household debt loads in the developed world. A single job loss or rate increase can push households into financial crisis.",
        legendExplain: {
          "Household Debt-to- Disposable Income (%)": "Total household debt (mortgages, car loans, credit cards, lines of credit) divided by after-tax annual income. 179.6% means Canadians owe $1.80 for every $1.00 they earn per year."
        }
      },
      { key: "fed_debt_deficit", id: "fed_debt_deficit", type: "line", relatedCharts: ["budget_balance_history", "household_debt", "inflation_boc"],
        seriesSubset: ["Fed Net Debt (% of GDP)"],
        title: "Federal Net Debt (1970–2026) | % of GDP",
        subtitle: "Federal net debt as a share of GDP. The 1995 fiscal crisis (peak ~67%) and the 2020 COVID shock are the two defining inflection points.",
        explain: "Federal debt as a share of the total economy. The 1995 peak (~67%) brought Canada close to requiring IMF intervention — the Chrétien-Martin austerity cuts were the emergency response. The 2020 COVID shock blew the deficit wider than at any point in Canadian history.",
        verdict: "BAD — Federal debt is rising with no credible plan to reverse it. The higher the debt, the more money consumed by interest payments instead of public services.",
        citedThreshold: "The Maastricht Treaty convergence criteria (EU, 1992) set 60% of GDP as the reference ceiling for general government debt. This is a political convergence threshold set for EU monetary union eligibility, not a figure derived from economic theory — but it is the most widely cited international debt benchmark. Canada's federal net debt alone (not including provincial debt) has exceeded this threshold since 2020.",
        legendExplain: {
          "Fed Net Debt (% of GDP)": "The federal government's total debt minus its financial assets, expressed as a percentage of GDP. A rising number means the government is borrowing faster than the economy grows."
        }
      },
      { key: "fed_debt_deficit", id: "fed_debt_deficit-balance", type: "line", relatedCharts: ["budget_balance_history", "fed_debt_deficit"],
        seriesSubset: ["Annual Surplus/ Deficit ($B)", "Annual Surplus/ Deficit — Real (2024 CAD $B)"],
        title: "Annual Federal Surplus / Deficit, Nominal vs. Real (1970–2026) | $B",
        subtitle: "Nominal dollars (as originally reported) vs. inflation-adjusted 2024 dollars. Over a 56-year span, nominal comparisons alone are misleading — this shows both.",
        explain: "Each point shows whether the federal government took in more than it spent (surplus, positive) or spent more than it collected (deficit, negative) in that year. The nominal line is the figure as originally reported each year. The real line restates every year in constant 2024 dollars, removing the effect of inflation, so 1975 and 2025 are directly comparable. In real terms the 2020 COVID deficit (-$384.8B in 2024 dollars) is still the largest on record by a wide margin, and the 1982-83 and 1984-85 deficits are larger in real terms than their nominal figures suggest.",
        verdict: "BAD — Running deficits in good economic times leaves no room when a real crisis hits. Canada's 2020 COVID deficit was the largest in its history by an enormous margin, even after adjusting for inflation.",
        legendExplain: {
          "Annual Surplus/ Deficit ($B)": "Positive numbers mean the government collected more than it spent that year. Negative numbers mean it borrowed the difference. In the dollars of the year in question (nominal) — not adjusted for inflation.",
          "Annual Surplus/ Deficit — Real (2024 CAD $B)": "The same figure restated in constant 2024 dollars using the Statistics Canada CPI, removing the effect of inflation so different decades can be compared directly."
        }
      },
      { key: "housing", id: "housing", type: "line", relatedCharts: ["housing-ratio", "household_debt", "population-rate"],
        seriesSubset: ["House Price Index (2005=100)"],
        title: "House Price Index (1990–2026) | 2005 = 100",
        subtitle: "National composite house price index, indexed to 2005.",
        explain: "Canada's national house price index, with 2005 set as the baseline of 100. A value of 400 means homes cost four times what they cost in 2005. The steepness of the rise since 2015 — and especially since 2020 — coincides with a period of low interest rates, strong population growth, and constrained housing supply in major cities.",
        verdict: "BAD — Homes are dramatically more expensive relative to incomes than any previous generation experienced. What was once a normal middle-class purchase now requires extraordinary wealth or debt.",
        legendExplain: {
          "House Price Index (2005=100)": "The average price of a Canadian home relative to 2005 prices. 100 = same price as 2005. 400 = four times more expensive than in 2005."
        }
      },
      { key: "housing", id: "housing-dollars", type: "line", relatedCharts: ["housing", "labour_market-earnings", "housing-ratio"],
        seriesSubset: ["Median Household Income ($000s)", "Avg Home Price ($000s)", "Median Household Income — Real (2024 CAD $000s)", "Avg Home Price — Real (2024 CAD $000s)"],
        title: "Median Income vs. Average Home Price, Nominal & Real (1990–2026) | $000s",
        subtitle: "Solid nominal dollars (as reported) and inflation-adjusted 2024 dollars, same units — the gap between income and price lines persists in both.",
        explain: "The clearest way to see the affordability crisis: median household income versus average home price, in the same dollar units on the same chart, shown both as originally reported (nominal) and restated in constant 2024 dollars (real) to remove the effect of inflation. In nominal terms the lines have diverged dramatically since the early 1990s. In real terms the gap is smaller but still substantial — home prices have outpaced income growth even after accounting for 34 years of inflation.",
        verdict: "BAD — Home prices have risen faster than incomes since 1990 in both nominal and inflation-adjusted terms. The gap is smaller once inflation is removed, but it has not closed.",
        legendExplain: {
          "Median Household Income ($000s)": "The income of the household exactly in the middle of all Canadian households, in the dollars of that year (nominal) — not adjusted for inflation.",
          "Avg Home Price ($000s)": "The national average sale price of a Canadian home, in the dollars of that year (nominal) — not adjusted for inflation.",
          "Median Household Income — Real (2024 CAD $000s)": "Median household income restated in constant 2024 dollars, removing the effect of inflation.",
          "Avg Home Price — Real (2024 CAD $000s)": "Average home price restated in constant 2024 dollars, removing the effect of inflation."
        }
      },
      { key: "housing", id: "housing-ratio", type: "line", relatedCharts: ["housing", "household_debt", "population-rate"],
        seriesSubset: ["Price-to- Income Ratio"],
        title: "House Price-to-Income Ratio (1990–2026)",
        subtitle: "Average home price divided by median household income. Rose from 3.3× (1996) to 11.8× (2021).",
        explain: "The most direct measure of housing affordability: average home price divided by median household income. A ratio of 3–4× was historically the rule of thumb for an affordable market. Canada peaked at 11.8× in 2021 — meaning the average home cost nearly 12 full years of the median household's gross income. This is not a housing shortage in the traditional sense; it is a structural consequence of 12 years of near-zero interest rates directing capital into real estate.",
        verdict: "BAD — A ratio above 5× is internationally considered unaffordable. Canada peaked at 11.8× in 2021. The historical norm that worked for previous generations was 3–4×.",
        citedThreshold: "Demographia's International Housing Affordability Survey uses the Median Multiple (median house price ÷ median household income) with published bands: 3.0 or under = affordable, 3.1–4.0 = moderately unaffordable, 4.1–5.0 = seriously unaffordable, 5.1+ = severely unaffordable, 9.0+ = impossibly unaffordable. Canada's most recent national figure sits well into the severely unaffordable range.",
        legendExplain: {
          "Price-to- Income Ratio": "How many full years of median household income it would cost to buy the average home, at that year's prices. The old rule of thumb was 3–4×. Above 5× is generally considered unaffordable. Canada hit 11.8× in 2021."
        }
      },
      { key: "inflation_boc", type: "line", relatedCharts: ["fed_debt_deficit", "household_debt", "labour_market-earnings"],
        explain: "From 2009 to 2021, the Bank of Canada held interest rates near zero — making borrowing effectively free for 12 consecutive years. This directly caused the household debt and housing price explosions shown in other charts. Then in 2022, rates rose from 0.25% to 5.0% in the fastest tightening cycle in 40 years. Every variable-rate mortgage and line of credit repriced almost overnight. Canadians who borrowed heavily when rates were near zero are now paying the bill.",
        verdict: "MIXED — Twelve years of near-zero rates made borrowing cheap but inflated the debt and housing crises. The rapid 2022 rate hike then crushed borrowers. Neither extreme was good for ordinary Canadians.",
        legendExplain: {
          "CPI Inflation (%)": "Consumer Price Index — the official measure of how fast everyday prices are rising. The Bank of Canada targets 2%. Above that, purchasing power is eroding.",
          "BoC Overnight Rate (%)": "The Bank of Canada's key interest rate. Banks use this as their baseline cost of borrowing, which flows through to mortgages, lines of credit, and savings accounts.",
          "Real Interest Rate (%)": "Interest rate minus inflation. When negative, borrowing is effectively free in real terms — which mechanically incentivises debt accumulation."
        }
      },
      { key: "dept_funding", type: "horizontalBar", relatedCharts: ["dept_spending_hist", "fed_debt_deficit", "govt_efficiency"],
        explain: "What the federal government allocates to each major department. National Defence is by far the largest operational department. But this chart covers only about $143 billion of a $500+ billion federal budget — the rest flows through the Department of Finance as transfer payments (healthcare to provinces, equalization, debt servicing) that do not appear here at all.",
        verdict: "CONTEXT — These amounts cover only ~$143B of a $500B+ total federal budget. Healthcare transfers and social programs are not included here.",
        legendExplain: {
          "Funding (CAD Billions)": "The budgetary authority allocated to each department in the 2026–27 Main Estimates — the amount they are authorised to spend."
        }
      },
      { key: "dept_spending_hist", type: "line", relatedCharts: ["dept_funding", "dept_spending_hist-total-real", "govt_efficiency", "dept_outcomes_defence", "dept_outcomes_cht_transfer"],
        seriesSubset: ["National Defence ($B)", "Health Canada ($B)", "Employment & Social Dev ($B)", "Indigenous Services* ($B)", "Global Affairs ($B)"],
        subtitle: "Nominal dollars (as reported each year) — not adjusted for inflation. See the Total spending chart below for a real-dollar comparison.",
        explain: "How the five largest departments with consistent historical records have grown since 2000, in nominal dollars. Key context: Health Canada's line looks small because the real federal healthcare money ($54B+ Canada Health Transfer) flows directly to provinces through the Department of Finance, not through Health Canada. The ESDC spike in 2020 is COVID emergency transfers (CERB, wage subsidies) — a one-time event, not a permanent level. These figures are not adjusted for inflation; a meaningful share of the nominal growth since 2000 reflects rising prices rather than expanded programs.",
        verdict: "MIXED — Rising defence spending toward NATO commitments is arguably necessary. The ESDC spike was one-time COVID emergency spending. Health Canada's small figure is misleading — the real federal healthcare money flows through Finance. Figures are nominal; some of the apparent growth is inflation, not expanded spending.",
        legendExplain: {
          "National Defence ($B)": "DND spending, in the dollars of each year (nominal). Rising sharply as Canada moves toward the NATO 2% of GDP target.",
          "Health Canada ($B)": "Looks small because the $54B+ Canada Health Transfer goes to provinces through Finance, not this department.",
          "ESDC ($B)": "Employment and Social Development Canada. The 2020 spike is COVID emergency spending — CERB and wage subsidies.",
          "Indigenous Services ($B)": "Jumps in 2017 because INAC was split into two departments — not a real spending increase.",
          "Global Affairs ($B)": "Foreign affairs, international trade, and development assistance."
        }
      },
      { key: "dept_spending_hist", id: "dept_spending_hist-total-real", type: "line", relatedCharts: ["dept_spending_hist", "govt_efficiency"],
        seriesSubset: ["TOTAL 5 Depts ($B)", "TOTAL 5 Depts — Real (2024 CAD $B)"],
        title: "Combined Spending, 5 Largest Departments — Nominal vs. Real (2000–2027) | $B",
        subtitle: "Nominal total (as reported) vs. inflation-adjusted 2024 dollars.",
        explain: "The combined budget of the five departments above, shown both as originally reported (nominal) and restated in constant 2024 dollars (real). Nominal totals have roughly quadrupled since 2000, but a meaningful share of that increase reflects 26 years of accumulated inflation rather than genuinely larger programs. The real-dollar line isolates the portion of growth that represents an actual expansion of government activity.",
        verdict: "MIXED — Combined spending has grown substantially even after removing inflation, driven mainly by the post-2022 defence and Indigenous Services increases. But nominal figures alone overstate the scale of that growth.",
        legendExplain: {
          "TOTAL 5 Depts ($B)": "Combined spending across the five departments, in the dollars of each year (nominal) — not adjusted for inflation.",
          "TOTAL 5 Depts — Real (2024 CAD $B)": "The same combined total restated in constant 2024 dollars, removing the effect of inflation."
        }
      }
,
      { key: "govt_efficiency", id: "govt_efficiency-health$", type: "line", relatedCharts: ["govt_efficiency-life", "govt_efficiency-value", "dept_spending_hist"], showRef: true,
        seriesSubset: ["Health Spend per Capita ($)", "Health Spend per Capita — Real (2024 CAD $)"],
        title: "Health Spending per Capita, Nominal vs. Real (2000–2026) | $",
        subtitle: "Nominal spend (as reported) vs. inflation-adjusted 2024 dollars.",
        explain: "How much Canada spends per person on healthcare each year. In nominal terms spending has nearly tripled since 2000; in constant 2024 dollars the real increase is smaller but still substantial. Compare this chart to the life expectancy and health value score charts below: even after removing inflation, spending has grown far faster than outcomes have improved. Canada now spends more per capita than Germany, France, and Japan — and ranks 6th of 7 in the G7 on health outcomes.",
        verdict: "BAD — Healthcare spending has grown substantially even in real, inflation-adjusted terms, while outcomes have barely improved. Canada now spends more per capita than Germany and France and gets worse results.",
        legendExplain: {
          "Health Spend per Capita ($)": "Total health spending (public + private) divided by population, in the dollars of each year (nominal) — not adjusted for inflation.",
          "Health Spend per Capita — Real (2024 CAD $)": "The same per-capita spend restated in constant 2024 dollars, removing the effect of inflation."
        }
      },
      { key: "govt_efficiency", id: "govt_efficiency-infra$", type: "line", relatedCharts: ["govt_efficiency", "dept_spending_hist"],
        seriesSubset: ["Infra Spend ($B)", "Infra Spend — Real (2024 CAD $B)"],
        title: "Infrastructure Spending, Nominal vs. Real (2000–2026) | $B",
        subtitle: "Nominal spend (as reported) vs. inflation-adjusted 2024 dollars.",
        explain: "Total public infrastructure spending per year, shown both as originally reported (nominal) and restated in constant 2024 dollars (real) — rising steadily in both. But compare this to the infrastructure quality index chart below: quality has fallen every year despite rising real spend. More money — even after removing inflation — is producing worse infrastructure. This gap between inputs (spending) and outputs (quality) is the signature of a government efficiency problem.",
        verdict: "BAD — Infrastructure spending is rising in real terms while infrastructure quality is falling. More money, not just more inflation, is being spent to produce worse results — the signature of a government efficiency problem.",
        legendExplain: {
          "Infra Spend ($B)": "Combined federal and provincial public infrastructure investment per year, in the dollars of each year (nominal) — not adjusted for inflation.",
          "Infra Spend — Real (2024 CAD $B)": "The same infrastructure investment restated in constant 2024 dollars, removing the effect of inflation."
        }
      },
      { key: "govt_efficiency", id: "govt_efficiency-value", type: "line", relatedCharts: ["govt_efficiency-health$", "govt_efficiency-life"],
        seriesSubset: ["Health Value Score ($/yr)"],
        title: "Health Value Score (2000–2026) | $ per Life-Year",
        subtitle: "Cost per life-year of health spending — falling is bad here, it means less value per dollar.",
        explain: "A measure of what each dollar of healthcare spending actually buys in terms of population health outcomes. A falling line means each additional dollar is producing less improvement. This is declining efficiency: spending is rising faster than outcomes are improving. The system costs more and delivers proportionally less each year.",
        verdict: "BAD — A falling health value score means each additional dollar buys less health outcome improvement. The system is simultaneously getting more expensive and less efficient.",
        legendExplain: {
          "Health Value Score ($/yr)": "A derived measure of cost-effectiveness — how much health outcome improvement each dollar of spending produces. Falling = declining efficiency. The system is getting more expensive without getting proportionally better."
        }
      },
      { key: "govt_efficiency", id: "govt_efficiency-life", type: "line", relatedCharts: ["govt_efficiency-health$", "govt_efficiency-value"],
        seriesSubset: ["Life Expect. (Years)"],
        title: "Life Expectancy (2000–2026) | Years",
        subtitle: "Average life expectancy at birth.",
        explain: "Average life expectancy at birth in Canada. Has risen modestly since 2000 but has essentially plateaued — and briefly declined during COVID. The near-flatness of this line while healthcare spending has nearly tripled is the core evidence of diminishing returns from additional health investment.",
        verdict: "MIXED — Life expectancy is still rising slowly, which is good. But the near-flatness while spending has tripled is the clearest evidence of diminishing returns on additional health investment.",
        legendExplain: {
          "Life Expect. (Years)": "Average number of years a newborn Canadian is expected to live, based on current mortality rates."
        }
      },
      { key: "govt_efficiency", id: "govt_efficiency", type: "line", relatedCharts: ["fed_debt_deficit", "dept_spending_hist-total-real"],
        seriesSubset: ["Infra Quality Index (0-100)", "Pub Sector Productivity Idx"],
        title: "Infrastructure Quality & Public Sector Productivity (2000–2026) | Index 0–100",
        subtitle: "Same 0–100 index scale, directly comparable. Both declining despite rising spend on the charts above.",
        explain: "Two government performance metrics on the same scale, both anchored at 100 in 2000. Infrastructure quality has fallen to 62.4 — Canadian infrastructure is measurably worse than 25 years ago despite spending more than double. Public sector productivity has fallen to 86.2 — the public sector produces less output per employee than in 2000. The government is spending more and delivering less on both dimensions simultaneously.",
        verdict: "BAD — Both lines are falling. Infrastructure quality is deteriorating. Public sector workers produce less per person than 25 years ago. The government spends more and delivers less on both dimensions simultaneously.",
        legendExplain: {
          "Infra Quality Index (0-100)": "A composite measure of Canadian infrastructure quality and condition. 100 = 2000 baseline. Falling index means deteriorating quality despite rising spending.",
          "Pub Sector Productivity Idx": "Output per government employee relative to 2000 = 100. Falling means the public sector is getting less done per worker over time."
        }
      },
      { key: "dept_outcomes_defence", type: "line", relatedCharts: ["dept_funding", "dept_spending_hist"],
        sectionHeader: "Department & Program Outcomes vs. Spending",
        sectionSubhead: "Covers the 5 most-funded federal departments plus a Canada Health Transfer deep-dive. Pairing each department's funding (above) with its own published performance indicators — not spend-per-outcome ratios, since departments report different things and don't share a common unit.",
        explain: "The Department of National Defence's own readiness indicator: the percentage of CAF force elements ready for operations against an established target of at least 90%. Readiness fell from 71% (2021-22) to 61% (2022-23), then recovered partially to 67% (2023-24) — still well short of target in all three years. A separate, stricter 'concurrent operations' indicator introduced in 2022-23 is not shown here.",
        verdict: "MIXED — CAF readiness has never met its 90% target in the three years reported, though it partially recovered in 2023-24 after a sharp 2022-23 drop. DND itself attributes the shortfall to equipment and personnel shortages.",
        legendExplain: {
          "% Force Elements Ready for Operations": "DND's own measure of what share of Canadian Armed Forces elements are ready to deploy, against an internal target of at least 90%."
        }
      },
      { key: "dept_outcomes_isc_water", type: "line", relatedCharts: ["dept_outcomes_isc_life", "dept_outcomes_isc_education", "dept_spending_hist"],
        explain: "The number of long-term drinking water advisories in effect on reserve, tracked against a baseline of 105 established in November 2015. The count fell sharply to a low of 28 by January 2024, but has since risen to 38–40 by 2025–2026 as new advisories were added faster than existing ones were resolved. This is not a simple steady decline — progress reversed direction in the last two years shown.",
        verdict: "MIXED — Long-term drinking water advisories fell from 105 to a low of 28 (2015–2024), then rose back to roughly 40 by 2026 as new advisories outpaced the rate of resolution.",
        legendExplain: {
          "Long-Term Drinking Water Advisories (#)": "Advisories in effect for more than a year on federally funded public water systems on First Nations reserves. New advisories are added to the list as systems are assessed, even as others are lifted."
        }
      },
      { key: "dept_outcomes_isc_life", type: "horizontalBar", relatedCharts: ["dept_outcomes_isc_water", "dept_outcomes_isc_education"],
        explain: "Life expectancy at birth for First Nations people compared to the non-Indigenous population, by sex. This is the most recent nationally comparable estimate available — Statistics Canada has not published a directly comparable national update since 2011, which is itself worth noting when assessing progress.",
        verdict: "BAD — First Nations life expectancy was 6–10 years lower than the non-Indigenous population as of the most recent comparable estimate (2011). No more recent comparable national figure has been published.",
        legendExplain: {
          "Life Expectancy (Years)": "Average number of years a newborn is expected to live, based on 2011 mortality rates — the most recent year with a nationally comparable First Nations estimate."
        }
      },
      { key: "dept_outcomes_isc_education", type: "line", relatedCharts: ["dept_outcomes_isc_water", "dept_outcomes_isc_life"],
        explain: "The share of 18-24 year-olds who have completed high school, comparing on-reserve First Nations youth to the non-Indigenous population, across the two most recent Census years. The gap has narrowed — from about 46 points in 2016 to about 36 points in 2021 — but remains very large: fewer than half of on-reserve youth in this age group had completed high school as of 2016, rising to just over half by 2021.",
        verdict: "MIXED — On-reserve high school completion rose from 41.9% to 53.3% between 2016 and 2021, narrowing the gap with the non-Indigenous rate (87.7% to 89.6%), but a roughly 36-point gap remains.",
        legendExplain: {
          "On-Reserve First Nations (%)": "Percentage of 18–24 year-olds living on reserve who have completed high school, per the Census.",
          "Non-Indigenous (%)": "Percentage of 18–24 year-old non-Indigenous Canadians who have completed high school, per the Census."
        }
      },
      { key: "dept_outcomes_esdc_poverty", type: "line", relatedCharts: ["dept_funding", "dept_spending_hist"],
        explain: "Canada's Official Poverty Rate under the Market Basket Measure — the legislated poverty line ESDC is responsible for under Opportunity for All. The rate fell steadily from 14.5% (2015) to a low of 6.4% (2020), driven substantially by temporary COVID-19 income supports, then rose for three consecutive years to 10.2% (2023).",
        verdict: "MIXED — Down substantially from 2015 (14.5% → 10.2%), but rising every year since the pandemic-era low of 6.4% in 2020, and progress toward the legislated 2030 target has stalled.",
        citedThreshold: "Opportunity for All (2018) set legislated targets of a 20% reduction in poverty by 2020 and a 50% reduction by 2030, both measured against the 2015 baseline of 14.5%. The 2020 rate (6.4%) briefly exceeded the 2030 target early, but the rate has since risen for three straight years and progress toward 2030 has stalled.",
        legendExplain: {
          "Official Poverty Rate (%)": "Percentage of the population below Canada's Official Poverty Line (Market Basket Measure, 2018 base)."
        }
      },
      { key: "dept_outcomes_gac_oda", type: "line", relatedCharts: ["dept_funding", "dept_spending_hist"],
        explain: "Official Development Assistance as a share of Gross National Income — the standard international measure of foreign aid effort. This is an input/effort ratio, not a measure of aid effectiveness or outcomes, but it is the best standardized comparative figure available for this department.",
        verdict: "CONTEXT — Canada's ODA share rose from 0.28% (2015) to 0.37% (2022) before dipping to 0.34% (2024). It remains well below the internationally cited 0.7% target.",
        citedThreshold: "The United Nations target for developed countries, first set in 1970 and reaffirmed repeatedly since, is 0.7% of GNI in official development assistance. Canada has never met this target; its 2024 figure of 0.34% is less than half.",
        legendExplain: {
          "ODA (% of GNI)": "Official Development Assistance (foreign aid) as a percentage of Gross National Income, per OECD DAC reporting."
        }
      },
      { key: "dept_outcomes_cht_transfer", type: "line", relatedCharts: ["dept_outcomes_cht_access", "dept_outcomes_cht_surgery", "dept_spending_hist"],
        sectionHeader: "Canada Health Transfer Deep-Dive",
        sectionSubhead: "Health Canada's own departmental budget doesn't fund hospital wait times or family doctor access — that money flows to provinces through the Canada Health Transfer instead. These charts pair CHT funding with the outcomes it's intended to support.",
        explain: "The Canada Health Transfer is the federal cash transfer to provinces and territories for healthcare delivery. It has more than doubled in nominal dollars since 2008-09, from $22.6B to a projected $54.7B in 2025-26, including a guaranteed minimum 5% annual growth rate from 2023-24 to 2027-28. These figures are not adjusted for inflation.",
        verdict: "CONTEXT — The transfer has grown substantially in nominal terms. See the access and wait-time charts below for whether outcomes have kept pace.",
        legendExplain: {
          "CHT Annual Transfer ($B)": "The federal cash transfer to provinces and territories for healthcare, in the dollars of each year (nominal) — not adjusted for inflation."
        }
      },
      { key: "dept_outcomes_cht_access", type: "line", relatedCharts: ["dept_outcomes_cht_transfer", "dept_outcomes_cht_surgery"],
        explain: "The share of Canadians who report having a regular healthcare provider (family doctor or equivalent). This declined modestly from an 85% average over 2017-22 to 82.8% in 2023, edging up slightly to 83% in 2024 — over a period when CHT funding continued to grow.",
        verdict: "MIXED — Access has declined modestly from the 2017-22 average and has been roughly flat since, despite rising CHT funding over the same period.",
        legendExplain: {
          "% with Regular Health Care Provider": "Percentage of Canadians aged 12+ who report having a regular family doctor or healthcare provider, per CCHS/CIS survey data."
        }
      },
      { key: "dept_outcomes_cht_surgery", type: "line", relatedCharts: ["dept_outcomes_cht_transfer", "dept_outcomes_cht_access"],
        explain: "The share of hip replacement, knee replacement, and cataract surgeries performed within CIHI's clinically recommended benchmark wait time. Hip and knee replacement both declined from 2019 to 2023-24. Cataract surgery dropped sharply in 2020 due to pandemic disruption but has since recovered to its 2019 level.",
        verdict: "BAD — The share of hip and knee replacements performed within benchmark has fallen since 2019 despite rising CHT funding. Cataract surgery recovered from its 2020 pandemic low back to 2019 levels.",
        citedThreshold: "CIHI's clinically recommended benchmark wait times are 182 days for hip and knee replacement and 112 days (16 weeks) for cataract surgery. These are the maximum wait times considered clinically appropriate, not aspirational targets.",
        legendExplain: {
          "Hip Replacement Within Benchmark (%)": "Percentage of hip replacement surgeries performed within CIHI's 182-day benchmark wait time.",
          "Knee Replacement Within Benchmark (%)": "Percentage of knee replacement surgeries performed within CIHI's 182-day benchmark wait time.",
          "Cataract Surgery Within Benchmark (%)": "Percentage of cataract surgeries performed within CIHI's 112-day (16-week) benchmark wait time."
        }
      }
    ]
  },

  demographics: {
    label: "Demographics",
    desc: "Population growth, fertility, and provincial divergence.",
    charts: [
      { key: "population", id: "population", type: "line", relatedCharts: ["fertility", "population-rate", "labour_market"],
        seriesSubset: ["Pop Growth (000s)", "Permanent Residents (000s)", "Non-Permanent Residents (000s)"],
        title: "Population Growth & Immigration Flows (1990–2026) | Thousands",
        subtitle: "Annual net population growth, permanent resident admissions, and non-permanent residents (NPR) — same unit (000s). The post-2022 NPR surge explains most of the per-capita GDP divergence shown elsewhere.",
        explain: "Three measures of how Canada's population is growing, all in the same unit (thousands of people per year). The most important line is Non-Permanent Residents — international students and temporary foreign workers. This number exploded after 2022, reaching levels that overwhelmed housing, healthcare, and transit infrastructure in major cities. This population surge is the direct mechanism behind Canada's falling GDP per capita: the economy grew, but the population grew faster.",
        verdict: "BAD — The post-2022 surge in Non-Permanent Residents is the fastest population growth Canada has recorded, arriving faster than housing, healthcare, and transit capacity could absorb. This is the direct mechanism behind the falling GDP-per-capita shown elsewhere on this site.",
        legendExplain: {
          "Pop Growth (000s)": "Total net increase in Canada's population each year — births minus deaths, plus net migration. In thousands of people.",
          "Permanent Residents (000s)": "People granted permanent residency each year. On the path to citizenship.",
          "Non-Permanent Residents (000s)": "International students, temporary foreign workers, and asylum claimants present in Canada without permanent status. Surged dramatically after 2022."
        }
      },
      { key: "population", id: "population-total", type: "line", relatedCharts: ["population", "fertility"],
        seriesSubset: ["Total Population (Millions)"],
        title: "Total Population (1990–2026) | Millions",
        subtitle: "Total resident population.",
        explain: "Canada's total population since 1990. The steepening slope after 2022 is visible — Canada is now growing faster than at any point in recorded history, driven almost entirely by non-permanent resident intake. This rapid growth is the input variable behind the housing demand surge, infrastructure stress, and per-capita GDP decline documented elsewhere on this site.",
        verdict: "CONTEXT — A growing population is not inherently good or bad. What matters is whether the economy and infrastructure can absorb the growth. The current rate is demonstrably outpacing that capacity.",
        legendExplain: {
          "Total Population (Millions)": "The number of people living in Canada, including citizens, permanent residents, and non-permanent residents."
        }
      },
      { key: "population", id: "population-rate", type: "line", relatedCharts: ["fertility-dependency", "housing", "labour_market"],
        seriesSubset: ["Pop Growth Rate (%)", "Immigration Share of Growth (%)"],
        title: "Population Growth Rate & Immigration's Share of Growth (1990–2026) | %",
        subtitle: "Annual population growth rate and immigration's share of total growth — both percentages.",
        explain: "How fast Canada's population is growing each year, and how much of that growth comes from immigration versus natural increase (more births than deaths). Immigration's share of growth has risen above 95% — meaning Canada's population growth is almost entirely dependent on people arriving from abroad, not on Canadians having children.",
        verdict: "BAD — When 95%+ of population growth comes from immigration, Canadians are not reproducing at replacement rate. A society that cannot sustain its population naturally is dependent on continuous external intake.",
        legendExplain: {
          "Pop Growth Rate (%)": "Annual percentage increase in total population.",
          "Immigration Share of Growth (%)": "What percentage of population growth comes from immigration rather than natural increase. Near 100% means Canada's births barely exceed deaths — the country grows only because people move here."
        }
      },
      { key: "fertility", id: "fertility", type: "line", relatedCharts: ["fertility-dependency", "social_cohesion", "population"],
        seriesSubset: ["Total Fertility Rate (TFR)", "Replacement Threshold", "Immigrant TFR", "Canadian-Born TFR", "2nd-Gen TFR Convergence"],
        title: "Fertility Rate (1960–2026) | Births per Woman",
        subtitle: "TFR vs. the 2.1 replacement threshold, split by immigrant, Canadian-born, and second-generation cohorts.",
        explain: "The Total Fertility Rate (TFR) is the average number of children a woman is expected to have. The replacement level — needed to maintain stable population without immigration — is 2.1. Canada's TFR peaked above 3 during the baby boom and has fallen every decade since. The three-line comparison is the critical finding: first-generation immigrants arrive with higher fertility (~2.4), but their children — second generation — converge almost exactly to the Canadian-born rate (~1.4). This is why immigration cannot permanently solve the fertility problem: the effect lasts one generation, then disappears.",
        verdict: "BAD — Canada's fertility rate of 1.35 is well below the 2.1 replacement threshold. Critically, immigrant children adopt Canadian fertility rates within one generation — so immigration does not permanently fix the problem.",
        citedThreshold: "The 2.1 replacement-level fertility threshold is the standard used by the UN Population Division and national statistical agencies worldwide — the average number of children per woman needed for a population to replace itself generation over generation without migration (2.0 plus a small margin for child mortality and sex-ratio variance). Canada's TFR has been below this line continuously since the early 1970s.",
        legendExplain: {
          "Total Fertility Rate (TFR)": "Average number of children born per woman over her lifetime. The national average across all demographics.",
          "Replacement Threshold": "The 2.1 line. Above this, the population replaces itself naturally without immigration. Canada has been below this line since the early 1970s.",
          "Immigrant TFR": "Fertility rate of first-generation immigrants. Higher than the Canadian average when they arrive.",
          "Canadian-Born TFR": "Fertility rate of people born in Canada. Well below replacement for decades.",
          "2nd-Gen TFR Convergence": "Fertility rate of the children of immigrants. Converges toward the Canadian-born rate within one generation — which is why immigration is not a long-term demographic fix."
        }
      },
      { key: "fertility", id: "fertility-dependency", type: "line", relatedCharts: ["fertility", "population-rate"],
        seriesSubset: ["Age Dependency Ratio (%)"],
        title: "Age Dependency Ratio (1960–2026) | %",
        subtitle: "Ratio of dependents (children + seniors) to working-age population.",
        explain: "The age dependency ratio measures how many retirees and children there are relative to working-age Canadians. As baby boomers retire and fertility stays low, this ratio rises — fewer workers must support more dependents. This is the fiscal time bomb under the Canada Pension Plan (CPP) and Old Age Security (OAS): the system was designed when there were many workers per retiree, not the ratio we are heading toward.",
        verdict: "BAD — A rising age dependency ratio means fewer workers must support more retirees. This is the fiscal time bomb under CPP and OAS — the system was designed for a demographic ratio that no longer exists.",
        legendExplain: {
          "Age Dependency Ratio (%)": "The number of dependents (children under 15 + seniors over 65) per 100 working-age people (ages 15–64). Rising ratio means the working population is shrinking relative to the people they support through taxes and transfers."
        }
      },
      { key: "provincial", type: "horizontalBar", relatedCharts: ["population", "energy"],
        explain: "Canada is not one economy — it is ten very different economies sharing a federal system. Alberta's GDP per capita ($88,000) is more than double New Brunswick's ($43,000). Ontario carries $412 billion in provincial debt and is losing population to Alberta. BC's average home price ($1.128M) is three times Saskatchewan's ($352K). National averages hide all of this variation.",
        verdict: "CONTEXT — Alberta's GDP per capita is more than double New Brunswick's. National averages hide these structural imbalances within Confederation. This is a map of how unequal Canada's regional economies are.",
        legendExplain: {
          "GDP/Capita 2026 ($000s)": "Economic output per person in that province. In thousands of dollars.",
          "Unemp Rate (%)": "Percentage of the labour force actively looking for work but unable to find it.",
          "Avg Home Price ($000s)": "Average sale price of a home in that province. In thousands of dollars.",
          "Prov Net Debt ($B)": "Provincial government total debt minus financial assets. Negative = the province has more assets than debt. In billions.",
          "Debt/GDP (%)": "Provincial debt as a share of that province's economy.",
          "TFR 2024": "Average number of children born per woman in that province.",
          "Pop Growth Rate (%)": "How fast the province's population is growing per year."
        }
      }
    ]
  },

  labour_inequality: {
    label: "Labour & Inequality",
    desc: "Employment, wages, wealth distribution, and corporate concentration.",
    charts: [
      { key: "labour_market", id: "labour_market", type: "line", relatedCharts: ["labour_market-earnings", "population-rate", "productivity_g7"],
        seriesSubset: ["Unemployment Rate (%)", "Labour Force Participation (%)", "Real Wage Growth (% YoY)", "Youth Unemp. Rate (%)"],
        title: "Labour Market Rates (2000–2026) | %",
        subtitle: "Unemployment, participation, real wage growth, and youth unemployment — all percentages. Participation falling while unemployment looks stable is the key signal.",
        explain: "Four measures of labour market health, all shown as percentages. The headline unemployment rate looks stable — but the participation rate (how many working-age people are actually in the workforce at all) has been quietly falling. When people stop looking for work, they drop out of unemployment statistics even though they are still not employed. A falling participation rate alongside stable unemployment means the labour market is weaker than the headline number suggests.",
        verdict: "BAD — The falling participation rate is the key warning sign. When people stop looking for work, they vanish from unemployment statistics. The labour market is meaningfully weaker than the headline number suggests.",
        legendExplain: {
          "Unemployment Rate (%)": "Percentage of people who want a job, are actively looking, and cannot find one. Does NOT count people who have stopped looking.",
          "Labour Force Participation (%)": "Percentage of working-age Canadians who are either employed or actively looking for work. When this falls, people are leaving the workforce entirely — a sign of hidden weakness the unemployment number does not capture.",
          "Real Wage Growth (% YoY)": "How much wages actually grew after subtracting inflation. Negative means workers got a raise on paper but could buy less than the year before — a real pay cut.",
          "Youth Unemp. Rate (%)": "Unemployment rate for Canadians aged 15–24. Consistently higher than the adult rate. A rising youth unemployment rate means the economy is failing to absorb new workers."
        }
      },
      { key: "labour_market", id: "labour_market-earnings", type: "line", relatedCharts: ["labour_market", "wealth_inequality", "inflation_boc"],
        seriesSubset: ["Avg Weekly Earnings ($)"],
        title: "Average Weekly Earnings (2000–2026) | $",
        subtitle: "Nominal average weekly earnings.",
        explain: "The average Canadian's weekly paycheque over time, in nominal (not inflation-adjusted) dollars. The line trends upward — but so does inflation. To know whether workers are actually better off, compare this to the real wage growth line in the chart above. The gap between nominal earnings growth and real purchasing power is where workers' standard of living disappears.",
        verdict: "MIXED — Nominal earnings are rising, but without adjusting for inflation this is misleading. Compare with the real wage growth line in the adjacent chart to see whether workers are actually gaining purchasing power.",
        legendExplain: {
          "Avg Weekly Earnings ($)": "Average weekly gross pay across all Canadian industries and job types. In current (nominal) dollars — not adjusted for inflation. A rising line here does not mean workers are better off if inflation is rising faster."
        }
      },
      { key: "wealth_inequality", id: "wealth_inequality-gini", type: "line", relatedCharts: ["wealth_inequality", "corporate_concentration"],
        seriesSubset: ["Gini Coefficient"],
        title: "Gini Coefficient (1976–2026)",
        subtitle: "Income inequality index, 0 (perfect equality) to 1 (perfect inequality).",
        explain: "The Gini coefficient is the standard international measure of income inequality. Zero means everyone earns exactly the same. One means one person earns everything and everyone else earns nothing. Canada has moved steadily toward greater inequality since the 1970s. This matters for assessing economic growth: a rising Gini means growth is disproportionately captured by higher earners while median incomes stagnate.",
        verdict: "BAD — A rising Gini coefficient means income gains are increasingly concentrated at the top. Economic growth that bypasses the middle and lower class is the definition of worsening inequality.",
        legendExplain: {
          "Gini Coefficient": "A number between 0 and 1. 0 = perfect equality. 1 = perfect inequality (one person has everything). Most developed countries sit between 0.25 and 0.45. A rising Gini = widening gap between rich and everyone else."
        }
      },
      { key: "wealth_inequality", id: "wealth_inequality", type: "line", relatedCharts: ["corporate_concentration", "labour_market-earnings", "education-debt"],
        seriesSubset: ["Top 1% Income Share (%)", "Top 10% Income Share (%)", "Bottom 50% Income Share (%)", "Labour Share of GDP (%)", "Capital Share of GDP (%)"],
        title: "Income & Capital Distribution (1976–2026) | %",
        subtitle: "Income shares and the labour-vs-capital split of GDP — all percentages, directly comparable.",
        explain: "This chart shows directly who receives the gains from economic growth. Labour's share of GDP — the portion paid as wages and salaries — has been falling since the 1980s while capital's share (profits, dividends, rents) has risen. Simultaneously, the top 1% income share has grown. This is the empirical fingerprint of the mechanism this site documents: the economy grows, but the gains are captured by capital owners rather than distributed to workers.",
        verdict: "BAD — Labour’s share of GDP is falling while capital’s share rises. Workers receive less of what the economy produces; asset owners receive more.",
        legendExplain: {
          "Top 1% Income Share (%)": "How much of all Canadian income goes to the richest 1% of earners.",
          "Top 10% Income Share (%)": "How much of all Canadian income goes to the richest 10% of earners.",
          "Bottom 50% Income Share (%)": "How much of all Canadian income goes to the bottom half of all earners combined.",
          "Labour Share of GDP (%)": "The percentage of total economic output paid out as wages and salaries. Falling labour share means workers are getting a smaller piece of a growing economy.",
          "Capital Share of GDP (%)": "The percentage of total economic output flowing to capital owners — as profits, dividends, rents, and interest. Rising capital share means asset owners capture more of economic growth."
        }
      },
      { key: "corporate_concentration", id: "corporate_concentration-rates", type: "line", relatedCharts: ["corporate_concentration", "productivity_g7"],
        seriesSubset: ["Corporate Profit Margin (%)", "Effective Corp Tax Rate (%)", "Statutory Corp Tax Rate (%)", "Tax Gap (Stat−Eff, %)"],
        title: "Corporate Profit Margins & Tax Rates (1990–2026) | %",
        subtitle: "Profit margins, statutory and effective tax rates, and the gap between them — all percentages.",
        explain: "Corporate profit margins have risen while the effective tax rate — what corporations actually pay after deductions — has fallen well below the official statutory rate. The gap between the two tax lines is legal tax avoidance: money owed at the published rate that is not actually paid. More profit, taxed at a lower effective rate, means more corporate earnings flowing to shareholders and less flowing to public services.",
        verdict: "BAD — Rising profit margins combined with a falling effective tax rate means corporations pay a smaller share of profit in tax than the statutory rate implies.",
        legendExplain: {
          "Corporate Profit Margin (%)": "Average profit as a percentage of revenue across major Canadian corporations. Rising margin means corporations keep more of each dollar of sales.",
          "Effective Corp Tax Rate (%)": "What corporations actually pay in taxes as a percentage of profits, after all legal deductions and strategies.",
          "Statutory Corp Tax Rate (%)": "The official published tax rate, before any deductions or strategies.",
          "Tax Gap (Stat−Eff, %)": "The difference between the official rate and what is actually paid. This is the legal tax avoidance gap — real money not collected."
        }
      },
      { key: "corporate_concentration", id: "corporate_concentration", type: "line", relatedCharts: ["productivity_g7", "wealth_inequality", "corporate_concentration-real"], showRef: true,
        seriesSubset: ["Dividends & Buybacks ($B)", "Productive CapEx ($B)"],
        title: "Dividends & Buybacks vs. Productive Investment (1990–2026) | $B",
        subtitle: "Nominal dollars, same unit — directly comparable to each other within a given year. See below for the inflation-adjusted trend over time.",
        explain: "Two competing uses of corporate profits: return money to shareholders (dividends and share buybacks) or reinvest in productive capacity (equipment, R&D, factories). When dividends and buybacks exceed productive investment, corporations are choosing to enrich current shareholders rather than build capacity that would create jobs and raise productivity. Because both lines are in the same year's dollars, the year-by-year comparison between them is valid without adjusting for inflation — but the multi-decade growth of each line individually is overstated in nominal terms.",
        verdict: "MIXED — Dividends and buybacks have grown faster than productive capital investment. Whether this reflects underinvestment or efficient capital allocation is a matter of ongoing economic debate.",
        legendExplain: {
          "Dividends & Buybacks ($B)": "Money paid to shareholders through dividends (cash payments) and buybacks (company repurchases its own stock to drive up the share price), in the dollars of each year (nominal).",
          "Productive CapEx ($B)": "Capital expenditure on productive physical assets: machinery, equipment, research and development, factories, in the dollars of each year (nominal)."
        }
      },
      { key: "corporate_concentration", id: "corporate_concentration-real", type: "line", relatedCharts: ["corporate_concentration", "productivity_g7"],
        seriesSubset: ["Dividends & Buybacks — Real (2024 CAD $B)", "Productive CapEx — Real (2024 CAD $B)"],
        title: "Dividends & Buybacks vs. Productive Investment, Real Terms (1990–2026) | 2024 CAD $B",
        subtitle: "Both series restated in constant 2024 dollars, removing the effect of inflation.",
        explain: "The same shareholder-payout vs. productive-investment comparison as above, restated in constant 2024 dollars. This isolates genuine growth in each category from the effect of 34 years of accumulated inflation. Productive investment has grown only modestly in real terms since 1990, while shareholder payouts have grown considerably faster — the gap that matters for productivity is real, not a nominal-dollar illusion.",
        verdict: "MIXED — Even after removing inflation, shareholder payouts have grown faster than productive investment. The pattern holds regardless of inflation.",
        legendExplain: {
          "Dividends & Buybacks — Real (2024 CAD $B)": "Dividends and buybacks restated in constant 2024 dollars, removing the effect of inflation.",
          "Productive CapEx — Real (2024 CAD $B)": "Productive capital expenditure restated in constant 2024 dollars, removing the effect of inflation."
        }
      }
    ]
  },

  social_fabric: {
    label: "Social Fabric",
    desc: "Trust, civic participation, and education outcomes.",
    charts: [
      { key: "social_cohesion", id: "social_cohesion", type: "line", relatedCharts: ["fertility", "wealth_inequality", "labour_market"],
        seriesSubset: ["Social Trust (% agree)", "Voter Turnout (Fed %)", "Volunteer Rate (%)", "Loneliness Index (%)", "Self-Reported Mental Health (%)"],
        title: "Social Trust & Civic Participation (1985–2026) | %",
        subtitle: "Social trust, voter turnout, volunteering, loneliness, and self-reported mental health — all percentages, directly comparable.",
        explain: "Five measures of social connection and civic health, all shown as percentages. Social trust — the simple belief that most people can be trusted — has nearly halved since the 1980s. Voter turnout has trended down. Volunteer rates have fallen. Loneliness and poor mental health have both risen sharply. These are not economic statistics; they are measurements of social fabric. They are all moving in the wrong direction simultaneously.",
        verdict: "BAD — Social trust, voter turnout, and volunteering are all declining. Loneliness and poor mental health are rising. All five indicators move in the wrong direction simultaneously.",
        legendExplain: {
          "Social Trust (% agree)": "Percentage of Canadians who agree with the statement 'most people can be trusted.' High-trust societies have lower transaction costs, better institutions, and more cooperative communities.",
          "Voter Turnout (Fed %)": "Percentage of eligible voters who cast a ballot in federal elections.",
          "Volunteer Rate (%)": "Percentage of Canadians who volunteered with a formal organisation in the past year.",
          "Loneliness Index (%)": "Percentage of Canadians reporting they frequently feel lonely.",
          "Self-Reported Mental Health (%)": "Percentage of Canadians rating their own mental health as 'excellent' or 'very good.' Declining."
        }
      },
      { key: "social_cohesion", id: "social_cohesion-opioid", type: "line", relatedCharts: ["social_cohesion", "wealth_inequality"],
        seriesSubset: ["Opioid Deaths (Annual)"],
        title: "Opioid Deaths (1985–2026) | Annual Count",
        subtitle: "Annual opioid-related deaths, raw count.",
        explain: "Annual opioid-related deaths in Canada. This number rose from roughly 200 per year in the late 1980s to over 7,500 by the mid-2020s — a 34-fold increase. This mortality trend does not appear in any GDP or unemployment statistic.",
        verdict: "BAD — Over 7,500 opioid deaths per year is a 34-fold increase from 1985. This mortality trend never appears in GDP or unemployment data.",
        legendExplain: {
          "Opioid Deaths (Annual)": "Number of Canadians who died from opioid overdose that year — including prescription opioids, heroin, fentanyl, and related drugs. Raw count, not per capita."
        }
      },
      { key: "education", id: "education-tuition", type: "line", relatedCharts: ["education-debt", "wealth_inequality"],
        seriesSubset: ["Avg Annual Tuition ($)", "Avg Annual Tuition — Real (2024 CAD $)"],
        title: "Average Annual Tuition, Nominal vs. Real (1990–2026) | $",
        subtitle: "Nominal tuition (as charged that year) vs. inflation-adjusted 2024 dollars.",
        explain: "The average cost of one year of undergraduate university tuition in Canada. In nominal dollars tuition has risen roughly 5.2× since 1990. Once inflation is removed, tuition has risen about 2.5× in real terms — still well ahead of the roughly 2.1× rise in the general price level over the same period, meaning tuition has genuinely outpaced inflation, but by a more modest margin than the nominal figures alone suggest.",
        verdict: "BAD — Tuition has outpaced inflation by a real margin since 1990, forcing students into larger debt loads before earning their first dollar. The gap is smaller than nominal figures imply, but it is real and persistent.",
        legendExplain: {
          "Avg Annual Tuition ($)": "Average undergraduate tuition charged by Canadian universities for one academic year, in the dollars of that year (nominal) — not adjusted for inflation. Does not include housing, food, books, or student fees.",
          "Avg Annual Tuition — Real (2024 CAD $)": "The same tuition figure restated in constant 2024 dollars, removing the effect of inflation."
        }
      },
      { key: "education", id: "education-debt", type: "line", relatedCharts: ["education-tuition", "wealth_inequality", "labour_market-earnings"],
        seriesSubset: ["Avg Student Debt at Grad ($)", "Avg Student Debt at Grad — Real (2024 CAD $)"],
        title: "Average Student Debt at Graduation, Nominal vs. Real (1990–2026) | $",
        subtitle: "Nominal debt (as reported) vs. inflation-adjusted 2024 dollars.",
        explain: "The average debt students carry at graduation — crossing $56,000 in nominal terms by 2026, or roughly $54,600 in constant 2024 dollars. In real terms, average graduation debt has risen about 2.4× since 1990 — still a genuine increase after removing inflation, and still a direct downstream consequence of the tuition growth shown above, but a smaller multiple than the nominal figure alone suggests.",
        verdict: "BAD — Even after adjusting for inflation, student debt at graduation has more than doubled since 1990. That delays home ownership, delays family formation, and constrains career choices for a decade or more.",
        legendExplain: {
          "Avg Student Debt at Grad ($)": "Average amount owed by a Canadian post-secondary graduate at the time of graduation, in the dollars of that year (nominal) — not adjusted for inflation.",
          "Avg Student Debt at Grad — Real (2024 CAD $)": "The same debt figure restated in constant 2024 dollars, removing the effect of inflation."
        }
      },
      { key: "education", id: "education-enrollment", type: "line", relatedCharts: ["education-match", "labour_market"],
        seriesSubset: ["Undergrad Enrollment (000s)", "Trades/Appren. Enrollment (000s)"],
        title: "Undergraduate vs. Trades Enrollment (1990–2026) | Thousands",
        subtitle: "Same unit, directly comparable — the diverging trend lines are the structural underinvestment in trades.",
        explain: "University enrollment has risen steadily while trades and apprenticeship enrollment has fallen. Canada is producing more credential-holders and fewer electricians, plumbers, welders, and machinists — despite the latter being in critical shortage. This mismatch is both an economic productivity problem (fewer skilled workers) and a social one (credential inflation forces everyone into university debt regardless of what the labour market actually needs).",
        verdict: "BAD — Falling trades enrollment alongside rising university enrollment produces a critical skilled trades shortage while inflating credentials. Canada needs more electricians and welders, not more credential-holders.",
        legendExplain: {
          "Undergrad Enrollment (000s)": "Number of students enrolled in undergraduate university programs. In thousands. Rising.",
          "Trades/Appren. Enrollment (000s)": "Number of people registered in apprenticeship and trades training programs. In thousands. Falling while university enrollment rises."
        }
      },
      { key: "education", id: "education-pisa", type: "line", relatedCharts: ["education-enrollment", "education-match"],
        seriesSubset: ["PISA Math Score"],
        title: "PISA Math Score (2000–2024)",
        subtitle: "OECD PISA international math literacy score.",
        explain: "Canada's score on the international PISA math test, administered every three years by the OECD to 15-year-olds in 80+ countries. Canada once scored near the top. The score has declined every test cycle since 2000. Education spending has risen substantially over the same period, alongside the declining scores.",
        verdict: "BAD — Canada's PISA math score has declined every test cycle since 2000, despite rising education spending over the same period.",
        legendExplain: {
          "PISA Math Score": "Canada's average score on the OECD's international mathematics assessment. Scores are comparable across countries and over time. Tested every three years — years without a test show no data point."
        }
      },
      { key: "education", id: "education-match", type: "line", relatedCharts: ["education-enrollment", "labour_market-earnings"],
        seriesSubset: ["% Grads Credential Match"],
        title: "Graduate Credential Match Rate (1990–2026) | %",
        subtitle: "Share of graduates working in a field matching their credential.",
        explain: "The percentage of university graduates working in a field that actually requires their degree. Now below 54% — nearly half of graduates are working in jobs that don't require their credential. This is credential inflation: degrees are demanded for more positions while the actual skills gap goes unfilled elsewhere in the economy.",
        verdict: "BAD — Nearly half of graduates work in jobs that do not require their degree. The system produces credential-holders for positions that do not need them, while real skill gaps go unfilled.",
        legendExplain: {
          "% Grads Credential Match": "Share of university graduates employed in occupations where their credential is actually required or directly applicable to their work."
        }
      }
    ]
  },

  resources: {
    label: "Resources",
    desc: "Energy and resource revenue, equalization flows, and commodity exposure.",
    charts: [
      { key: "energy", id: "energy", type: "line", relatedCharts: ["trade", "fed_debt_deficit", "energy-wti"], showRef: true,
        seriesSubset: ["Oil & Gas Revenue ($B)", "Fed Equalization Paid ($B)", "Alta Resource Revenue ($B)", "Crit. Mineral Export ($B)"],
        title: "Energy & Resource Revenue Flows (1990–2026) | $B",
        subtitle: "Nominal dollars (as reported each year) — not adjusted for inflation. See below for the real-dollar comparison of the three largest flows.",
        explain: "Canada's resource economy in four lines, in nominal dollars. Oil and gas revenue is real but highly volatile — it follows global commodity price cycles, not government policy. Federal equalization payments redistribute this wealth from resource-rich provinces (mainly Alberta) to lower-revenue provinces. Alberta's resource revenue alone funds a large share of the national transfer system — while Alberta itself receives nothing back in equalization payments. These figures are not adjusted for inflation.",
        verdict: "MIXED — Oil and gas revenue is real wealth but highly volatile. It funds equalization for poorer provinces, but this dependency makes national fiscal health hostage to factors Canada cannot control.",
        legendExplain: {
          "Oil & Gas Revenue ($B)": "Total government revenue from oil and natural gas — taxes, royalties, and levies, in the dollars of each year (nominal). Highly volatile, follows global oil price cycles.",
          "Fed Equalization Paid ($B)": "Federal equalization transfers to have-not provinces, in nominal dollars. Funded by all taxpayers including Alberta, which receives none of it.",
          "Alta Resource Revenue ($B)": "Alberta provincial government revenue from resource royalties specifically, in nominal dollars. The engine of Alberta's fiscal surplus and the source funding national equalization.",
          "Crit. Mineral Export ($B)": "Exports of critical minerals (lithium, cobalt, nickel, rare earths) — materials essential to battery technology and the energy transition. Growing fast from a small base."
        }
      },
      { key: "energy", id: "energy-real", type: "line", relatedCharts: ["energy", "energy-wti"],
        seriesSubset: ["Oil & Gas Revenue — Real (2024 CAD $B)", "Fed Equalization Paid — Real (2024 CAD $B)", "Alta Resource Revenue — Real (2024 CAD $B)"],
        title: "Energy & Resource Revenue Flows, Real Terms (1990–2026) | 2024 CAD $B",
        subtitle: "The three largest flows above, restated in constant 2024 dollars.",
        explain: "The same oil & gas revenue, federal equalization, and Alberta resource revenue lines, restated in constant 2024 dollars to remove the effect of inflation. The volatility — the defining feature of resource revenue — persists in real terms; the 2008-09 and 2014-15 price crashes and the 2022 commodity spike are still clearly visible once inflation is removed.",
        verdict: "MIXED — Volatility is the structural feature here, and it remains just as pronounced after adjusting for inflation. Real terms confirm this is a genuine boom-bust pattern, not a nominal-dollar artifact.",
        legendExplain: {
          "Oil & Gas Revenue — Real (2024 CAD $B)": "Oil and gas revenue restated in constant 2024 dollars, removing the effect of inflation.",
          "Fed Equalization Paid — Real (2024 CAD $B)": "Federal equalization payments restated in constant 2024 dollars, removing the effect of inflation.",
          "Alta Resource Revenue — Real (2024 CAD $B)": "Alberta resource royalty revenue restated in constant 2024 dollars, removing the effect of inflation."
        }
      },
      { key: "energy", id: "energy-wti", type: "line", relatedCharts: ["energy", "trade-fx"],
        seriesSubset: ["WTI Oil Price (USD/bbl)"],
        title: "WTI Oil Price (1990–2026) | USD/bbl",
        subtitle: "West Texas Intermediate crude price — the commodity cycle driving resource revenue volatility above.",
        explain: "The price of West Texas Intermediate crude oil in US dollars per barrel. This single number drives Alberta's fiscal position, Canada's current account balance, and federal equalization capacity. When oil is above $80, Alberta runs surpluses and equalization flows freely. When it crashes (2015, 2020), Alberta's budget collapses and equalization capacity tightens. A significant portion of Canada's fiscal health is determined by a price set in global markets that Ottawa cannot control.",
        verdict: "CONTEXT — Oil price is a global market variable Canada cannot control. When high, revenues surge. When it crashes, the fiscal position deteriorates. Canada's fiscal health is partly determined by forces entirely outside its control.",
        legendExplain: {
          "WTI Oil Price (USD/bbl)": "The international benchmark price for crude oil, in US dollars per barrel. Canada's oil sands production trades at a discount to WTI, but WTI movements drive the same directional changes."
        }
      },
      { key: "energy", id: "energy-lng", type: "line", relatedCharts: ["energy", "trade"],
        seriesSubset: ["LNG Exports (BCF/yr)"],
        title: "LNG Exports (1990–2026) | BCF/yr",
        subtitle: "Liquefied natural gas exports, billion cubic feet per year.",
        explain: "Canada's liquefied natural gas exports measured in billions of cubic feet per year. Canada has some of the world's largest natural gas reserves, and LNG export capacity is growing (LNG Canada's first phase recently came online). This represents a significant diversification opportunity — selling to Asian markets rather than solely to the US — but growth has been constrained by decades of pipeline and regulatory delay.",
        verdict: "MIXED — Growing LNG exports represent diversification away from reliance on US export markets, from a low base.",
        legendExplain: {
          "LNG Exports (BCF/yr)": "Canada's total liquefied natural gas exports. BCF = Billion Cubic Feet. A higher number means more natural gas sold abroad."
        }
      }
    ]
  },

  taxes: {
    label: "Taxes",
    desc: "Personal and corporate tax burden, effective vs. marginal rates, and federal revenue composition.",
    charts: [
      { key: "federal_revenue_by_source", id: "federal_revenue_by_source", type: "horizontalBar", relatedCharts: ["budget_balance_history", "fed_debt_deficit", "dept_funding"],
        explain: "Personal income tax alone funds nearly half of everything the federal government spends — more than corporate tax, GST, and EI premiums combined. This chart breaks down where every dollar of federal revenue actually originated in fiscal year 2024–25.",
        verdict: "CONTEXT — This is a composition snapshot, not a judgment on tax policy. A personal-income-tax-led revenue mix is standard among G7 economies, not unique to Canada.",
        legendExplain: {
          "Share of Total Federal Revenue (%)": "What percentage of total federal government revenue that category accounted for in fiscal year 2024–25. 'Other Revenues' includes Crown corporation income and program/service revenue; 'Other Taxes & Duties' includes energy taxes, customs duties, and excise taxes."
        }
      },
      { key: "tax_top_marginal", id: "tax_top_marginal", type: "horizontalBar", relatedCharts: ["effective_tax_rate_trend", "provincial", "federal_revenue_by_source"],
        explain: "The rate paid on the next dollar earned once a filer's income crosses into the top bracket in each province or territory — combined federal and provincial/territorial rates, including applicable surtaxes. Only two jurisdictions, Alberta and Yukon, keep their top combined rate under 50%.",
        verdict: "CONTEXT — Top marginal rates apply only to income earned above each jurisdiction's top bracket threshold, not to a filer's entire income. The average tax rate actually paid is substantially lower — see the Effective Tax Rate chart.",
        legendExplain: {
          "Top Combined Marginal Tax Rate (%)": "Federal plus provincial/territorial income tax rate applied to each additional dollar earned above that jurisdiction's top tax bracket threshold, including surtaxes where applicable."
        }
      },
      { key: "tax_to_gdp_oecd", id: "tax_to_gdp_oecd", type: "line", relatedCharts: ["effective_tax_rate_trend", "fed_debt_deficit", "budget_balance_history"],
        explain: "Total tax revenue collected by all levels of government — federal, provincial, and local, including social-security-style contributions like CPP and EI — as a share of the total economy. This is the OECD's standard measure for comparing overall tax burden across countries. Canada has tracked close to the OECD average for two decades, dipping during the 2009 financial crisis and again around 2011–2012 before recovering to slightly above average by 2021.",
        verdict: "CONTEXT — Canada's overall tax burden, measured this way, sits close to the OECD average — neither a high-tax nor a low-tax outlier among peer economies.",
        legendExplain: {
          "Canada (%)": "Total tax revenue collected by all levels of Canadian government, as a percentage of GDP.",
          "OECD Average (%)": "The unweighted average tax-to-GDP ratio across all OECD member countries."
        }
      },
      { key: "effective_tax_rate_trend", id: "effective_tax_rate_trend", type: "line", relatedCharts: ["tax_top_marginal", "tax_to_gdp_oecd", "federal_revenue_by_source"],
        explain: "The average share of income Canadians actually pay across federal and provincial income tax plus CPP/QPP and EI contributions — not the marginal rate on the last dollar earned, but the real average rate paid across all tax filers. This fell from 13.5% in 1992 to a low of 11.3% in 2009–2010 as federal tax cuts phased in, then edged back up toward 12% through the late 2010s.",
        verdict: "CONTEXT — At roughly 11–12% of income, the average effective tax rate is far below the marginal rates shown in the Top Marginal Tax Rate chart. Marginal and effective rates measure different things and are frequently conflated in public debate.",
        legendExplain: {
          "Effective Tax Rate, All Filers (%)": "Total federal and provincial/territorial income tax plus CPP/QPP and EI contributions, divided by total income, averaged across all Canadian tax filers."
        }
      },
      { key: "tax_filers_by_bracket", id: "tax_filers_by_bracket", type: "horizontalBar", relatedCharts: ["tax_top_marginal", "avg_federal_tax_per_filer", "effective_tax_rate_trend"],
        explain: "What proportion of Canadians actually fall into which federal tax bracket. 63.9% of filers never leave the lowest bracket ($55,867 or less); only 1.5% reach the top bracket ($246,752 or more). This is the population distribution behind every rate discussion on this page.",
        verdict: "CONTEXT — Bracket population, not tax burden. A filer in the lowest bracket pays 14% on income in that bracket only, not their whole income — see the Effective Tax Rate chart for what filers actually pay on average.",
        legendExplain: {
          "Share of Tax Filers (%)": "Percentage of all Canadian tax filers whose taxable income places them in that federal bracket, 2024 tax year."
        }
      },
      { key: "corporate_tax_revenue_trend", id: "corporate_tax_revenue_trend", type: "line", relatedCharts: ["federal_revenue_by_source", "tax_to_gdp_oecd", "avg_federal_tax_per_filer"],
        explain: "Federal corporate income tax revenue at six confirmed points since 2000. Revenue roughly tripled from 2000-01 to 2024-25 in nominal dollars, with the sharpest jump following the pandemic as corporate profits surged. Data points reflect years with independently published figures — the gaps between them are not annual data and should not be read as a smooth trend.",
        verdict: "CONTEXT — Six confirmed data points across 25 years, not a continuous series. Corporate tax revenue depends heavily on corporate profitability, which is cyclical.",
        legendExplain: {
          "Corporate Income Tax Revenue ($B)": "Federal corporate income tax revenue collected that fiscal year, in nominal (not inflation-adjusted) dollars."
        }
      },
      { key: "avg_federal_tax_per_filer", id: "avg_federal_tax_per_filer", type: "line", relatedCharts: ["tax_filers_by_bracket", "effective_tax_rate_trend", "corporate_tax_revenue_trend"],
        explain: "Total net federal income tax collected divided by total tax filers, at three points CRA has published matching filer-count and tax-collected data for. This is federal tax only — it excludes provincial income tax, CPP/QPP, and EI, so it understates a filer's total tax bill.",
        verdict: "CONTEXT — Federal income tax only. For total tax burden including provincial tax and payroll contributions, see the Effective Tax Rate chart.",
        legendExplain: {
          "Average Net Federal Tax per Filer ($)": "Total federal income tax collected from all filers, divided by the number of filers, for that tax year."
        }
      }
    ]
  }
};

const PALETTE = ["#c9a44c","#8ba888","#a87c7c","#7c8ba8","#b89a6e","#6e9ab8","#a8a36e"];
