module DateFormats
  MONTH_YEAR = '%b %Y'.freeze                # Mar 2026
  MONTH_YEAR_FULL = '%B %Y'.freeze           # March 2026
  MONTH_DAY = '%b %d'.freeze                 # Mar 31
  MONTH_DAY_YEAR = '%b %d %Y'.freeze         # Mar 31 2026
  MONTH_DAY_YEAR_COMMA = '%b %d, %Y'.freeze  # Mar 31, 2026

  DAY_MONTH_YEAR = '%d %b %Y'.freeze         # 31 Mar 2026

  STANDARD_DATE = '%Y-%m-%d'.freeze          # ISO standard date format YYYY-MM-DD (for parsing)

  DAY_NAME_FULL = '%A'.freeze                # Wednesday
end
